---
sidebar_position: 750
title: "Prompt Caching (KV Cache) Optimization"
---

# Prompt Caching (KV Cache) Optimization

Most hosted LLM providers cache the KV state of a request's **prefix**. When two requests share an identical leading sequence of tokens, the provider serves the shared part from cache instead of recomputing it, which is **cheaper and faster**. If you want to save money by getting as many cache hits as possible, this page is for you.

:::tip Who this is for
Anyone maximising cache hits (and minimising spend/latency) on providers that support prompt/prefix caching, Anthropic, OpenAI, Google Gemini, DeepSeek, and OpenAI-compatible gateways.
:::

:::warning Before you start
Your model (or the provider/gateway serving it) must **support prompt caching**, and it must actually be **enabled** for your requests.

- **Fully automatic**: identical leading tokens are cached and reused with no opt-in and no extra cost to enable (e.g. OpenAI, Gemini, DeepSeek). Often called **implicit** or **automatic prefix caching**.
- **Opt-in per request**: the provider only caches when your request explicitly asks it to. **Anthropic** supports both **explicit** caching (cache breakpoints) and what it calls **implicit** caching, but in both cases a caching directive must be sent **on every request**, and **cache writes are billed**, so it is never turned on silently. You must send that opt-in for the caching to take effect.

If your model or endpoint does not cache prompts at all, none of the settings below will change your cost or latency.
:::

## How prompt caching works (in one minute)

- Providers cache from the **start** of the request forward.
- A cache hit requires the prefix to be **identical** to a previous request.
- As soon as the request differs, the cache is invalidated **from that point to the end**.

So the golden rule is:

> **Keep the beginning of every request stable, and let only new content be appended at the end.**

A chat conversation naturally grows by appending new turns at the end, which is inherently cache-friendly, **unless something rewrites earlier parts of the request on every turn**. Eliminating those rewrites is what this guide is about.

## What breaks the cache in Open WebUI

Open WebUI can insert content dynamically on each turn. Anything that changes the **system message** or an **earlier user message** invalidates the cached prefix. The usual culprits:

| Source | What it does | Cache impact |
|---|---|---|
| **Preload files (RAG)** | Retrieves file/knowledge chunks and injects them (with the RAG template) into the latest message on every turn | High: injected content changes per query |
| **Citations** | With Native function calling, appends the source markers to the tool result that produced them, and the markers are saved with it. With Legacy, adds the sources with the RAG template to your message on every turn (to the system message with `RAG_SYSTEM_CONTEXT`) | None with Native, see the note below. High with Legacy |
| **Memory** | With Native function calling, adds the recalled memories once per reply as a hidden `recall_memories` tool result after your message. Without it, appends them to your message on every turn | None with Native. High with Legacy: changes whenever memories change |
| **"Using Entire Document"** | Injects a whole file into every message | Very high: but a **Preload files** sub-mode; only fires while Preload files is on |
| **Dynamic voice-mode prompt** | Prepends a short voice instruction to the system message | Low: constant while voice mode is on |
| **Attachment metadata block** | Lists attached files / knowledge / collections / chats as metadata (ids and names) in the message | Low: stable as long as the attachments don't change |
| **Attached knowledge list** | With Native function calling, lists the knowledge attached to the model or folder once per reply as a hidden `list_attached_knowledge` tool result after your message. Skipped when there is nothing to list | None: saved with the reply and replayed unchanged |
| **Open Terminal `AGENTS.md`** | Reads the terminal's `AGENTS.md` on every turn and adds it as a user message just before the first user message | Invalidates everything from the first user message onward whenever the file changes, for example when the model edits it mid-chat. The system message and tools stay cached |
| **Open Terminal skills** | Adds terminal skills to the skills list, which with Native function calling is a hidden `list_available_skills` tool result once per reply (skipped when there are no skills). With Legacy, only the skills you select are written into the system message | Changes only the tail of the request the turn a skill is added or removed. The tool list changes only when the first skill appears or the last one goes, since the skill tools are offered while at least one skill is listed |
| **Open Terminal working directory** | Writes the terminal's current working directory into the command tool's instructions on every turn | Changes the tool list whenever the working directory changes. Turn off the connection's [Working Directory Context](/features/open-terminal/setup/connecting#working-directory-context) to keep it stable |
| **Open Terminal user shell tools** | By default, adds the two tools for your own shell only while that shell is open | Changes the tool list when you open or close the shell. Set the connection's [User Shell Tools](/features/open-terminal/setup/connecting#user-shell-tools) to `Always Include` to keep it stable |
| **[Tool Search](/features/extensibility/plugin/tools#tool-search)** | Adds a fixed `<available_tools>` instruction at the end of the system message, leaves large tools out of the tool list and adds `search_tools` and `call_tool` to it. The model loads a tool's full definition through a tool call and runs it through `call_tool` | Low: the instruction and the tool list only change when the set of enabled tools changes. Loading a tool keeps the tool list as it was |

:::info
The attachment metadata block is intentionally **metadata only** (no file content), so it stays stable across turns and does not meaningfully hurt caching. The content-injecting rows above are the ones to watch.
:::

:::info Native function calling keeps citations, memories, skills and knowledge lists out of the cached prefix
When the **Citations** capability is on and a tool returns sources (`query_chat_files`, `query_knowledge_files`, `view_file`, `view_knowledge_file`, `fetch_url`), the source markers are appended to that tool result and saved with it, so later requests replay the same text. Recalled memories, the skills list and the attached knowledge list arrive as hidden tool results (`recall_memories`, `list_available_skills`, `list_attached_knowledge`) after the user's message, once per reply. A list or recall with nothing in it is skipped, and so is a reply that is continued, because its saved output already holds them. They are saved in the reply's output and replayed unchanged on later turns. Nothing earlier in the request is rewritten.

This applies to chats in the web UI with Native function calling and the model's **Builtin Tools** capability on. The skills list also needs the **Skills** category and the attached knowledge list the **Knowledge Base** category. With Legacy function calling, in API requests without a web UI session and with Builtin Tools off, memories are appended to your message on every turn and there is no skills or knowledge list.

Custom pipes that read the last message can see a tool message there when memories are recalled, knowledge is attached or the user has skills. Filters run before these results are added: `inlet` never sees them and `request` sees them from the second call of a reply on.
:::

### Why the injection goes into the latest user message

The placement is deliberate, and worth understanding before treating it as a defect to be fixed.

Automatic retrieval was built on the premise that the model mainly attends to the message it is answering. Very small local models and older models behave that way in practice: context placed earlier in the conversation gets ignored, or falls out of a context window too short to hold the whole history. Putting the retrieved context anywhere other than the message being answered means those models do not reliably see it, which is the difference between retrieval working and retrieval silently doing nothing.

Breaking the cached prefix is the price of that guarantee, and it is a price worth paying when the alternative is a model that cannot use the context at all. It stops being worth paying the moment your model is large enough and long enough in context to attend to material further up the conversation, which is every frontier model and most current local ones.

So the two capabilities are a choice between two designs rather than a feature and a bug:

| | Context injection on | Context injection off |
| :--- | :--- | :--- |
| **Retrieval** | Forced, before the model runs | On demand, the model calls a tool |
| **Placement** | Rewritten into the latest message every turn | Appended at the end as tool results |
| **Prefix cache** | Invalidated each turn | Preserved |
| **Suits** | Small and short-context models | Everything else |

Turning Preload files off is not a workaround for the cost described above. It selects the other design, the one this page is about.

## The cache-optimal setup

The goal is a **static prefix** (system prompt + tools) with **append-only** growth (user turns and tool results), using **on-demand retrieval** instead of automatic injection.

### 1. Use a static system prompt

Configure a fixed system prompt on the model and avoid anything that regenerates it per turn. This is the single most valuable cacheable block, put your instructions (including how to cite, see below) here once.

### 2. Turn Preload files off (this is what switches the file tools on)

Disable the **Preload files** capability on the model (it is off by default with Native function calling), and leave **File Upload** enabled. Attached files, knowledge bases, collections and referenced chats are still **surfaced to the model as stable metadata** in an `<attached_files>` block on the message that carried them, but their **content is no longer auto-retrieved or injected**. See [Preload files vs Builtin Tools](/features/chat-conversations/rag#preload-files-vs-builtin-tools).

From v0.11 this is not only a subtraction. **Preload files being off is the condition that injects the builtin Files tools**, which let the model read and search chat attachments itself:

| Tool | What the model does with it |
|---|---|
| `list_chat_files` | See which files are attached, with ids, filenames, content types and sizes |
| `query_chat_files` | Semantic search across the attachments, or one file by id |
| `grep_chat_files` | Exact text search, returning matching lines with file ids and line numbers |
| `view_file` | Read a passage by character offset or line range |

Turning Preload files back on removes these tools again, on the grounds that the content would already be in the conversation. The two are deliberately exclusive, so there is no configuration where you pay for injection and agentic access at once.

Retrieval then becomes **on-demand**: the model decides what to fetch and calls a tool. Tool results are appended at the **end** of the conversation, so they never rewrite the cached prefix.

:::info Chat-attached collections and notes are not orphaned
Turning Preload files off also re-routes any knowledge collections or notes attached to the chat into the knowledge tool path, so they stay searchable through `query_knowledge_files` and friends rather than becoming invisible.

A **chat folder** attached with `#` or dragged into the input only reaches the model through Preload files, which retrieves from the folder's attached knowledge. With Preload files off, attach the folder's knowledge bases and files with `#` directly, or start the chat inside the folder, where its knowledge goes through the knowledge tools.
:::

:::info "Using Entire Document" is a Preload files sub-mode
The per-file/per-knowledge **Using Entire Document** mode injects a complete document into every message, the heaviest cache-breaker of all. But it runs **inside** Preload files, so turning Preload files off (this step) **already disables it**, enabling Using Entire Document while Preload files is off does nothing. Just don't re-enable Preload files + Using Entire Document as a retrieval workaround; use on-demand tools instead. See [Retrieval Modes](/features/workspace/knowledge#retrieval-modes).
:::

### 3. Turn Citations off and move citation rules into the system prompt

With Native function calling, **Citations** does not break the cache. Turning it off drops the source markers from tool results (a smaller request) and the source pills rendered under the reply in the UI; the model still receives the tool results themselves.

To get citations in the answer text without the markers, add **static citation instructions to your system prompt**. Write them against what the tools actually return, which is a filename or a URL rather than a number:

- Cite passages from files and knowledge as the `source` filename the tool result carries, for example `(handbook.pdf)`.
- Cite web pages as markdown links built from the `link` field, for example `[example.com](https://example.com/...)`.

Because the instruction lives in the (cached) system prompt, you get citations **without** a per-turn injection.

:::warning Do not ask for numbered citations here
Numbered `[1]`, `[2]` citations work only while **Citations** is on, because the numbers come from the injected `<source>` block and not from the tools. No builtin tool returns one: the file and knowledge tools return `content`, a `source` filename and a `file_id`, and `search_web` returns `title`, `link` and `snippet`. A system prompt asking for `[1]` style citations with Citations off gives the model nothing to number, and it will invent the numbers.
:::

:::info `search_web` returns search results, not page text
`search_web` gives the model a title, a link and a snippet per hit, which is what the search engine returned. It does not fetch those pages. When the model needs what a page actually says, it calls `fetch_url` on the link. Citing a page it only saw a snippet of is citing the search engine, so tell it to fetch before it cites anything specific.
:::

### 4. Keep retrieval agentic

Enable **Builtin Tools** on the model and leave the categories you need switched on. As of v0.11 every resource type a chat can carry has a first-class tool, so custom workspace tools are no longer needed to fill gaps:

| Resource | Tools | Category |
|---|---|---|
| Files attached to the chat | `list_chat_files`, `query_chat_files`, `grep_chat_files`, `view_file`, `display_file` | **Files** |
| Knowledge bases and collections, including the knowledge of the folder the chat is in | `query_knowledge_files`, `search_knowledge_files`, `grep_knowledge_files`, `view_knowledge_file`, `display_file`, plus the discovery tools when no knowledge is attached to the model | **Knowledge Base** |
| Notes | `search_notes`, `view_note` | **Notes** |
| Referenced chats | `search_chats`, `view_chat` | **Chat History** |

This requires **Native** function calling. Builtin tools are a native-mode feature and are not injected for models set to Legacy.

The **Files** category has the tightest conditions of the four. All five must hold, or the tools are silently absent:

1. The **Files** builtin category is enabled on the model (default: on).
2. The model's **File Upload** capability is on.
3. The model's **Preload files** capability is **off**.
4. The chat actually has at least one attached file.
5. The user holds the `chat.file_upload` permission (admins always pass).

Each tool re-resolves and access-checks the resource server-side on every call, so nothing enters the context that the model didn't explicitly request, and an attachment the user can no longer open is skipped rather than read. See the [Builtin Tools reference](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode).

:::tip Keep the tool list itself stable
Tool definitions sit in the cached prefix alongside the system prompt, so toggling categories, attaching a skill, or enabling web search mid-conversation invalidates the cache from that point. Decide the tool set per model, not per turn. Note that the Files tools appear the moment the first file is attached to a chat, which is a one-time change within that conversation rather than per-turn churn.
:::

### 5. Handle Memory deliberately

With Native function calling, recalled memories arrive once per reply as a hidden tool result after your message and are replayed unchanged on later turns, so they do not touch the cached prefix. Without it, memory injection appends to your message on every turn and is **not** governed by Preload files, so it can churn the cache. Options:

- Use Native function calling, **or**
- Disable automatic memory injection with `ENABLE_MEMORY_SYSTEM_CONTEXT=false` and let the model retrieve memories **on demand** via the memory tools (tell it to do so in your static system prompt). See [Memory](/features/chat-conversations/memory).

### 6. Voice mode is usually fine

The dynamic voice-mode prompt is prepended once and stays constant while voice mode is active (a voice session typically starts a fresh chat), so it does not churn the cache. A call started in a chat that already has typed messages, Standard or Realtime, rebuilds the cached prefix once on its first spoken turn. Leave it as-is, or disable `task.voice.prompt.enable` if you want a fully fixed system prompt.

## The result: a stable, append-only request

With the setup above:

- **Prefix**: system prompt + tool definitions, is identical every turn → **cached**.
- **Body** grows by appending new user messages and tool results → only the new tail is uncached.
- Nothing (RAG template, sources, citations, memory, skills and knowledge lists) rewrites the earlier request.

:::tip Verify your hit rate
Watch your provider's usage response for cached-token counts (for example cache-read / cache-creation input tokens). A correct setup shows the cached portion **growing with conversation length** while the uncached input per turn stays roughly constant.
:::

## Provider notes

- **Anthropic**: supports both explicit caching (cache breakpoints) and implicit caching, but caching is **opt-in on every request** (a caching directive must be sent each time) and **cache writes are billed**. You must send that opt-in; a stable prefix then maximises the portion that is cached and reused.
- **OpenAI / Gemini / DeepSeek / OpenAI-compatible gateways**: automatic (implicit) prefix caching; identical leading tokens are served from cache with no opt-in and no extra flags.
- **Anthropic models behind OpenAI-compatible gateways (OpenRouter, LiteLLM)**: a cache marker on a tool result reaches the gateway, so the prefix stays cached through tool loops.

In every case the requirement is the same: **don't rewrite the beginning of the request between turns.**

## Summary checklist

Set on the model, under **Settings > Admin > Models**, click the pencil (**Edit**), then **Capabilities** and **Builtin Tools**:

- [ ] Static system prompt (no per-turn regeneration)
- [ ] **File Upload** on, **Preload files** off, no automatic content injection (this also disables "Using Entire Document") **and** it is what injects the Files tools
- [ ] Optional: **Citations** off, citation rules moved into the system prompt
- [ ] **Builtin Tools** on, with the **Files**, **Knowledge Base**, **Notes** and **Chat History** categories left enabled
- [ ] Function calling set to **Native** (builtin tools do not exist in Legacy mode)
- [ ] With Legacy, `ENABLE_MEMORY_SYSTEM_CONTEXT=false` and on-demand memory retrieval
- [ ] Keep the tool list stable across turns
