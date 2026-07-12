---
title: Environment variables
sidebar_position: 3
---

# Environment variables

All variables are read once at startup; restart the server to apply a change.

## Core

| Variable | Default | What it does |
| --- | --- | --- |
| `CPTR_DATA_DIR` | `~/.cptr` | Data directory for the database, config, uploads, and logs. The Docker image sets it to `/data`. |
| `CPTR_LOG_LEVEL` | `INFO` | Server log level. |
| `CPTR_LOG_FORMAT` | `text` | `text` or `json` (structured output for log collectors). |
| `CPTR_AUDIT_LOG_LEVEL` | `NONE` | `NONE` disables audit logging; `METADATA` records mutations; `REQUEST` adds redacted request bodies; `REQUEST_RESPONSE` adds redacted response bodies. |
| `CPTR_AUDIT_LOG_PATH` | `<data>/logs/audit.jsonl` | Audit log file location. |
| `CPTR_AUDIT_LOG_ROTATION` | `10 MB` | Audit log rotation size. |
| `CPTR_AUDIT_MAX_BODY_SIZE` | `2048` | Max bytes of request/response body captured per audit entry. |
| `CPTR_AUDIT_EXCLUDED_PATHS` | `/api/chats,/v1/chat` | Paths excluded from audit logging. |
| `CPTR_LOG_UPSTREAM_REQUESTS` | `false` | Log outgoing model API requests, for debugging model calls. |
| `CPTR_UPSTREAM_REQUEST_LOG_PATH` | `<data>/logs/upstream-requests.jsonl` | Upstream request log location. |
| `CPTR_UPSTREAM_REQUEST_LOG_ROTATION` | `50 MB` | Upstream request log rotation size. |

## Chat and agent tuning

| Variable | Default | What it does |
| --- | --- | --- |
| `CHAT_MAX_ITERATIONS` | `2048` | Max tool-call iterations per turn before the agent is stopped. |
| `ENABLE_CHAT_RECONCILE_ON_STARTUP` | `true` | On startup, recover chats left stuck by a crash. |
| `CHAT_TOOL_MAX_CHARS` | `50000` | Max characters of a tool's output kept in context. |
| `CHAT_TOOL_COMMAND_MAX_CHARS` | `8000` | Max characters of command output kept in context. |
| `CHAT_COMPACT_TOKEN_THRESHOLD` | `80000` | Token count that triggers context compaction. |
| `CPTR_CLAUDE_CODE_MAX_BUFFER_SIZE` | `134217728` | Stdout buffer size (bytes) for the Claude SDK subprocess. |
| `CPTR_EXECUTE_TIMEOUT` | unset | Default wait in seconds for `run_command` before it returns while the command keeps running. |
| `CPTR_STREAM_CONNECT_TIMEOUT` | `30` | Seconds to wait when connecting to a model stream. |
| `CPTR_STREAM_READ_TIMEOUT` | `300` | Seconds to wait for the next chunk from a model stream. |
| `CPTR_STREAM_WRITE_TIMEOUT` | `600` | Seconds to wait when writing to a model stream. |

## Scheduler

| Variable | Default | What it does |
| --- | --- | --- |
| `AUTOMATION_POLL_INTERVAL` | `10` | How often (seconds) the scheduler checks for due automations. |

## Network

| Variable | Default | What it does |
| --- | --- | --- |
| `CPTR_CORS_ALLOWED_ORIGINS` | `*` | Comma-separated list of browser origins allowed to call the API. |

## Web search providers

Keys set here take precedence over keys entered in Settings. With no key at all, web search falls back to DuckDuckGo; otherwise the first configured provider in this order wins: Exa → Perplexity → Tavily → Brave → Firecrawl → SearXNG → DuckDuckGo.

| Variable | Default | What it does |
| --- | --- | --- |
| `EXA_API_KEY` | unset | Exa search. |
| `PERPLEXITY_API_KEY` | unset | Perplexity search. |
| `PERPLEXITY_BASE_URL` | unset | Custom Perplexity endpoint. |
| `TAVILY_API_KEY` | unset | Tavily search. |
| `BRAVE_API_KEY` | unset | Brave search. |
| `FIRECRAWL_API_KEY` | unset | Firecrawl search. |
| `FIRECRAWL_BASE_URL` | unset | Custom Firecrawl endpoint. |
| `SEARXNG_BASE_URL` | unset | Self-hosted SearXNG instance. |
| `CHAT_COMPLETIONS_SEARCH_API_KEY` | unset | Search via an OpenAI-compatible chat-completions endpoint. |
| `CHAT_COMPLETIONS_SEARCH_BASE_URL` | unset | Base URL for that endpoint. |
| `CHAT_COMPLETIONS_SEARCH_MODEL` | unset | Model for that endpoint. |
| `XAI_API_KEY` | unset | Used for Grok agent detection. |
