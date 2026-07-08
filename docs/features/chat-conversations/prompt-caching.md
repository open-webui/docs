---
sidebar_position: 750
title: "Prompt Caching (KV Cache) Optimization"
---

# Prompt Caching (KV Cache) Optimization

Most hosted LLM providers cache the KV state of a request's **prefix**. When two requests share an identical leading sequence of tokens, the provider serves the shared part from cache instead of recomputing it — which is **cheaper and faster**. If you want to save money by getting as many cache hits as possible, this page is for you.

:::tip Who this is for
Anyone maximising cache hits (and minimising spend/latency) on providers that support prompt/prefix caching — Anthropic, OpenAI, Google Gemini, DeepSeek, and OpenAI-compatible gateways.
:::

:::warning Before you start
Your model (or the provider/gateway serving it) must **support prompt caching**, and it must actually be **enabled** for your requests.

- **Fully automatic** — identical leading tokens are cached and reused with no opt-in and no extra cost to enable (e.g. OpenAI, Gemini, DeepSeek). Often called **implicit** or **automatic prefix caching**.
- **Opt-in per request** — the provider only caches when your request explicitly asks it to. **Anthropic** supports both **explicit** caching (cache breakpoints) and what it calls **implicit** caching, but in both cases a caching directive must be sent **on every request**, and **cache writes are billed** — so it is never turned on silently. You must send that opt-in for the caching to take effect.

If your model or endpoint does not cache prompts at all, none of the settings below will change your cost or latency.
:::

## How prompt caching works (in one minute)

- Providers cache from the **start** of the request forward.
- A cache hit requires the prefix to be **identical** to a previous request.
- As soon as the request differs, the cache is invalidated **from that point to the end**.

So the golden rule is:

> **Keep the beginning of every request stable, and let only new content be appended at the end.**

A chat conversation naturally grows by appending new turns at the end, which is inherently cache-friendly — **unless something rewrites earlier parts of the request on every turn**. Eliminating those rewrites is what this guide is about.

## What breaks the cache in Open WebUI

Open WebUI can insert content dynamically on each turn. Anything that changes the **system message** or an **earlier user message** invalidates the cached prefix. The usual culprits:

| Source | What it does | Cache impact |
|---|---|---|
| **File Context (RAG)** | Retrieves file/knowledge chunks and injects them (with the RAG template) into the latest message on every turn | High — injected content changes per query |
| **Citations** | Wraps retrieved sources in a citation/RAG-template instruction | High — varies with the retrieved sources |
| **Memory (system context)** | Injects stored user memories into the system message | High — changes whenever memories change |
| **"Using Entire Document" (Full Context)** | Injects a whole file into every message | Very high — but a **File Context sub-mode**; only fires while File Context is on |
| **Dynamic voice-mode prompt** | Prepends a short voice instruction to the system message | Low — constant while voice mode is on |
| **Attachment metadata block** | Lists attached files / knowledge / collections / chats as metadata (ids and names) in the message | Low — stable as long as the attachments don't change |

:::info
The attachment metadata block is intentionally **metadata only** (no file content), so it stays stable across turns and does not meaningfully hurt caching. The content-injecting rows above are the ones to watch.
:::

## The cache-optimal setup

The goal is a **static prefix** (system prompt + tools) with **append-only** growth (user turns and tool results), using **on-demand retrieval** instead of automatic injection.

### 1. Use a static system prompt

Configure a fixed system prompt on the model and avoid anything that regenerates it per turn. This is the single most valuable cacheable block — put your instructions (including how to cite, see below) here once.

### 2. Turn File Context off

Disable the **File Context** capability on the model. Attached files, knowledge bases, collections and referenced chats are still **surfaced to the model as stable metadata**, but their **content is no longer auto-retrieved or injected**. See [File Context vs Builtin Tools](/features/chat-conversations/rag#file-context-vs-builtin-tools).

Retrieval then becomes **on-demand**: the model decides what to fetch and calls a tool. Tool results are appended at the **end** of the conversation, so they never rewrite the cached prefix.

:::info "Using Entire Document" is a File Context sub-mode
The per-file/per-knowledge **Full Context** ("Using Entire Document") mode injects a complete document into every message — the heaviest cache-breaker of all. But it runs **inside** File Context, so turning File Context off (this step) **already disables it** — enabling Full Context while File Context is off does nothing. Just don't re-enable File Context + Full Context as a retrieval workaround; use on-demand tools instead. See [Retrieval Modes](/features/workspace/knowledge#retrieval-modes).
:::

### 3. Turn Citations off and move citation rules into the system prompt

With **Citations** disabled, Open WebUI stops wrapping retrieved sources in the dynamic citation/RAG template. Keep citations anyway by adding **static citation instructions to your system prompt**, for example:

- Cite retrieved passages using the source id returned in the tool result (e.g. `[1]`, `[2]`).
- Cite web pages as markdown links, e.g. `[example.com](https://example.com/...)`.

Because the instruction lives in the (cached) system prompt, you get citations **without** a per-turn injection.

### 4. Keep retrieval agentic

Enable **Builtin Tools** and/or provide your own workspace tool so the model can fetch content only when it needs it:

- **Knowledge bases, collections, notes** → built-in knowledge tools (e.g. `query_knowledge_bases`).
- **Files attached directly to the chat** → a file-scoped retrieval tool (a built-in tool where available, or a small custom workspace tool).
- **Referenced chats** → the chat-viewing tool.

Each tool re-resolves and access-checks the resource server-side, so nothing enters the context that the model didn't explicitly request. See the [Builtin Tools reference](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode).

### 5. Handle Memory deliberately

Memory injection writes into the **system message** and is **not** governed by File Context, so it can churn the cache independently. Options:

- Don't change your memories mid-conversation (the injected block then stays stable across the chat), **or**
- Disable system-prompt memory injection with `ENABLE_MEMORY_SYSTEM_CONTEXT=false` and let the model retrieve memories **on demand** via the memory tools (tell it to do so in your static system prompt). See [Memory](/features/chat-conversations/memory).

### 6. Voice mode is usually fine

The dynamic voice-mode prompt is prepended once and stays constant while voice mode is active (a voice session typically starts a fresh chat), so it does not churn the cache. Leave it as-is, or disable `task.voice.prompt.enable` if you want a fully fixed system prompt.

## The result: a stable, append-only request

With the setup above:

- **Prefix** — system prompt + tool definitions — is identical every turn → **cached**.
- **Body** grows by appending new user messages and tool results → only the new tail is uncached.
- Nothing (RAG template, sources, citations, memory) rewrites the earlier request.

:::tip Verify your hit rate
Watch your provider's usage response for cached-token counts (for example cache-read / cache-creation input tokens). A correct setup shows the cached portion **growing with conversation length** while the uncached input per turn stays roughly constant.
:::

## Provider notes

- **Anthropic** — supports both explicit caching (cache breakpoints) and implicit caching, but caching is **opt-in on every request** (a caching directive must be sent each time) and **cache writes are billed**. You must send that opt-in; a stable prefix then maximises the portion that is cached and reused.
- **OpenAI / Gemini / DeepSeek / OpenAI-compatible gateways** — automatic (implicit) prefix caching; identical leading tokens are served from cache with no opt-in and no extra flags.

In every case the requirement is the same: **don't rewrite the beginning of the request between turns.**

## Summary checklist

- [ ] Static system prompt (no per-turn regeneration)
- [ ] **File Context** off — no automatic content injection (this also disables "Using Entire Document" / Full Context)
- [ ] **Citations** off — citation rules moved into the system prompt
- [ ] **Builtin / custom retrieval tools** on — agentic, on-demand fetching
- [ ] **Memory** stable, or `ENABLE_MEMORY_SYSTEM_CONTEXT=false` + on-demand retrieval
- [ ] Keep the tool list stable across turns
