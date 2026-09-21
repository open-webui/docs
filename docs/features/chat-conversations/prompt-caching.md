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
| **File Context (RAG)** | Retrieves file/knowledge chunks and injects them (with the RAG template) into the latest message on every turn | High: injected content changes per query |
| **Citations** | Rewrites the **system message and the last user message** with the RAG template plus the source list, after every tool-calling round that produced sources | Very high, see the warning below |
| **Memory (system context)** | Injects stored user memories into the system message | High: changes whenever memories change |
| **"Using Entire Document" (Full Context)** | Injects a whole file into every message | Very high: but a **File Context sub-mode**; only fires while File Context is on |
| **Dynamic voice-mode prompt** | Prepends a short voice instruction to the system message | Low: constant while voice mode is on |
| **Attachment metadata block** | Lists attached files / knowledge / collections / chats as metadata (ids and names) in the message | Low: stable as long as the attachments don't change |

:::info
The attachment metadata block is intentionally **metadata only** (no file content), so it stays stable across turns and does not meaningfully hurt caching. The content-injecting rows above are the ones to watch.
:::

:::danger Citations are the biggest cache-breaker in an agentic setup
It is tempting to assume that moving retrieval into tools makes citations harmless, because tool results are appended at the end. It does not. When the **Citations** capability is on and a tool round returns sources (`query_chat_files`, `query_knowledge_files`, `view_file`, `view_knowledge_file`, `fetch_url`), Open WebUI restores the pre-RAG system and user messages and then **re-applies the RAG template with the accumulated source list into the system message and the last user message**. That happens **after every tool-calling iteration**, and the source list grows as the model calls more tools.

The practical effect: the cached prefix is invalidated on every single tool round, which is exactly the thing an agentic setup does most. Turning File Context off but leaving Citations on gives you most of the cost of the old setup with none of the benefit.
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

Turning File Context and Citations off is not a workaround for the cost described above. It selects the other design, the one this page is about.

## The cache-optimal setup

The goal is a **static prefix** (system prompt + tools) with **append-only** growth (user turns and tool results), using **on-demand retrieval** instead of automatic injection.

### 1. Use a static system prompt

Configure a fixed system prompt on the model and avoid anything that regenerates it per turn. This is the single most valuable cacheable block, put your instructions (including how to cite, see below) here once.

### 2. Turn File Context off (this is what switches the file tools on)

Disable the **File Context** capability on the model, and leave **File Upload** enabled. Attached files, knowledge bases, collections and referenced chats are still **surfaced to the model as stable metadata** in an `<attached_files>` block on the message that carried them, but their **content is no longer auto-retrieved or injected**. See [File Context vs Builtin Tools](/features/chat-conversations/rag#file-context-vs-builtin-tools).

From v0.11 this is not only a subtraction. **File Context being off is the condition that injects the builtin Files tools**, which let the model read and search chat attachments itself:

| Tool | What the model does with it |
|---|---|
| `list_chat_files` | See which files are attached, with ids, filenames, content types and sizes |
| `query_chat_files` | Semantic search across the attachments, or one file by id |
| `grep_chat_files` | Exact text search, returning matching lines with file ids and line numbers |
| `view_file` | Read a passage by character offset or line range |

Turning File Context back on removes these tools again, on the grounds that the content would already be in the conversation. The two are deliberately exclusive, so there is no configuration where you pay for injection and agentic access at once.

Retrieval then becomes **on-demand**: the model decides what to fetch and calls a tool. Tool results are appended at the **end** of the conversation, so they never rewrite the cached prefix.

:::info Chat-attached collections and notes are not orphaned
Turning File Context off also re-routes any knowledge collections or notes attached to the chat into the knowledge tool path, so they stay searchable through `query_knowledge_files` and friends rather than becoming invisible. Nothing you attach loses its route to the model, only the automatic injection goes away.
:::

:::info "Using Entire Document" is a File Context sub-mode
The per-file/per-knowledge **Full Context** ("Using Entire Document") mode injects a complete document into every message, the heaviest cache-breaker of all. But it runs **inside** File Context, so turning File Context off (this step) **already disables it**, enabling Full Context while File Context is off does nothing. Just don't re-enable File Context + Full Context as a retrieval workaround; use on-demand tools instead. See [Retrieval Modes](/features/workspace/knowledge#retrieval-modes).
:::

### 3. Turn Citations off and move citation rules into the system prompt

This matters more than it used to, not less. With **Citations** disabled, Open WebUI stops re-applying the RAG template and source list into the system and last user message after each tool round, so the prefix survives an agentic conversation intact. What you give up is the source pills rendered under the reply in the UI; the model still receives the tool results themselves, which is where the content was all along.

Keep citations in the answer text anyway by adding **static citation instructions to your system prompt**. Write them against what the tools actually return, which is a filename or a URL rather than a number:

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
| Files attached to the chat | `list_chat_files`, `query_chat_files`, `grep_chat_files`, `view_file` | **Files** |
| Knowledge bases and collections | `query_knowledge_files`, `search_knowledge_files`, `grep_knowledge_files`, `view_knowledge_file`, plus the discovery tools when no knowledge is attached to the model | **Knowledge Base** |
| Notes | `search_notes`, `view_note` | **Notes** |
| Referenced chats | `search_chats`, `view_chat` | **Chat History** |

This requires **Native** function calling. Builtin tools are a native-mode feature and are not injected for models set to Legacy.

The **Files** category has the tightest conditions of the four. All five must hold, or the tools are silently absent:

1. The **Files** builtin category is enabled on the model (default: on).
2. The model's **File Upload** capability is on.
3. The model's **File Context** capability is **off**.
4. The chat actually has at least one attached file.
5. The user holds the `chat.file_upload` permission (admins always pass).

Each tool re-resolves and access-checks the resource server-side on every call, so nothing enters the context that the model didn't explicitly request, and an attachment the user can no longer open is skipped rather than read. See the [Builtin Tools reference](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode).

:::tip Keep the tool list itself stable
Tool definitions sit in the cached prefix alongside the system prompt, so toggling categories, attaching a skill, or enabling web search mid-conversation invalidates the cache from that point. Decide the tool set per model, not per turn. Note that the Files tools appear the moment the first file is attached to a chat, which is a one-time change within that conversation rather than per-turn churn.
:::

### 5. Handle Memory deliberately

Memory injection writes into the **system message** and is **not** governed by File Context, so it can churn the cache independently. Options:

- Don't change your memories mid-conversation. Part of the injected block is still retrieved against your recent messages on every turn, so it can move as the conversation changes topic, **or**
- Disable system-prompt memory injection with `ENABLE_MEMORY_SYSTEM_CONTEXT=false` and let the model retrieve memories **on demand** via the memory tools (tell it to do so in your static system prompt). See [Memory](/features/chat-conversations/memory).

### 6. Voice mode is usually fine

The dynamic voice-mode prompt is prepended once and stays constant while voice mode is active (a voice session typically starts a fresh chat), so it does not churn the cache. Leave it as-is, or disable `task.voice.prompt.enable` if you want a fully fixed system prompt.

## The result: a stable, append-only request

With the setup above:

- **Prefix**: system prompt + tool definitions, is identical every turn → **cached**.
- **Body** grows by appending new user messages and tool results → only the new tail is uncached.
- Nothing (RAG template, sources, citations, memory) rewrites the earlier request.

:::tip Verify your hit rate
Watch your provider's usage response for cached-token counts (for example cache-read / cache-creation input tokens). A correct setup shows the cached portion **growing with conversation length** while the uncached input per turn stays roughly constant.
:::

## Provider notes

- **Anthropic**: supports both explicit caching (cache breakpoints) and implicit caching, but caching is **opt-in on every request** (a caching directive must be sent each time) and **cache writes are billed**. You must send that opt-in; a stable prefix then maximises the portion that is cached and reused.
- **OpenAI / Gemini / DeepSeek / OpenAI-compatible gateways**: automatic (implicit) prefix caching; identical leading tokens are served from cache with no opt-in and no extra flags.

In every case the requirement is the same: **don't rewrite the beginning of the request between turns.**

## Summary checklist

Set on the model, under **Settings > Admin > Models**, click the pencil (**Edit**), then **Capabilities** and **Builtin Tools**:

- [ ] Static system prompt (no per-turn regeneration)
- [ ] **File Upload** on, **File Context** off, no automatic content injection (this also disables "Using Entire Document" / Full Context) **and** it is what injects the Files tools
- [ ] **Citations** off, citation rules moved into the system prompt
- [ ] **Builtin Tools** on, with the **Files**, **Knowledge Base**, **Notes** and **Chat History** categories left enabled
- [ ] Function calling set to **Native** (builtin tools do not exist in Legacy mode)
- [ ] **Memory** stable, or `ENABLE_MEMORY_SYSTEM_CONTEXT=false` + on-demand retrieval
- [ ] Keep the tool list stable across turns
