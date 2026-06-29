---
title: "Features"
sidebar_position: 2
---

# Features

Everything cptr gives you, grouped by what it is for. The [overview](/features/computer) has the short version; this is the full list.

## The computer you operate

- **Terminal.** A real PTY-backed shell in the browser (macOS, Linux and Windows). Anything you would do over SSH.
- **File browser and editor.** Navigate, view, edit and manage files, with icons by type. Markdown previews inline.
- **Git, without the command line.** See status, stage and commit from a git panel, manage branches (create, rename, delete and search) with stash-aware switching, or drop into the terminal if you prefer.
- **Workspaces.** Manage several project directories from one instance and switch between them without losing your place.
- **Global search and shortcuts.** `Cmd+K` / `Cmd+Shift+F` searches chats (by id, title, summary and message content, best matches ranked first) and files (by name) across every workspace, with optional filtering by workspace and whether to include sub-agent chats, plus a customisable keybinding system.
- **Port preview.** A built-in reverse proxy detects ports your processes open, so you can preview a running app in another tab.
- **System info.** A "System info" entry in the sidebar menu opens a modal showing the machine's hostname, OS, CPU, memory, disk and running processes.
- **Voice memos.** Record audio from the `+` menu or `Cmd+Shift+M`. Recordings save to the workspace as audio files with an auto-generated transcript, via any OpenAI-compatible speech-to-text API (Whisper and similar), configured in Settings > Audio.
- **Installable app (PWA).** Install cptr to a phone, tablet or desktop home screen for a standalone, app-like experience, with offline caching and a fallback page when the server is unreachable. Home screen shortcuts jump straight to a new chat, workspace, note, terminal or search, a share target sends files, text or links from other apps into a chat, and opening a supported file with cptr imports it into a workspace you choose. Manage install status and the offline cache from Settings > PWA.

## The AI agent (optional)

- **Optional AI agent.** A chat panel with multi-provider support (Anthropic, OpenAI, Ollama and OpenAI-compatible endpoints). With a key it reads, searches and edits files, runs shell commands, searches the web and reads URLs. It also reads and describes images in your workspace and can drive a real browser (navigate, click, type, screenshot, run JavaScript) via local Chrome, Firecrawl or Browser-Use. Web search runs through Exa, Tavily, Brave, DuckDuckGo, Perplexity (with a configurable base URL for proxies such as LiteLLM), Firecrawl (with a self-hosted endpoint option) or any OpenAI-compatible endpoint. For bigger tasks it can draft an implementation plan to approve before it starts (plan mode), and long conversations are compacted automatically, with a context-usage indicator showing how full the window is. Every edit or command waits for your approval, and its file tools refuse to read or write `.env` files. Mention files with `@` and queue follow-up messages while it works.
- **Coding agents as backends.** Connect coding agents you already subscribe to as native AI backends, configured from the **Agents** admin tab where you set the command path, the model list and an approval/permission mode (install status and auto-detect are shown). Supported: Codex, Claude Code, Cursor, Grok and OpenCode. They appear as selectable models, run in the workspace with full tool access and resume across sessions. 0.7.1 added live streaming output and approval-request handling.
- **Voice mode and text-to-speech.** Talk to the AI hands-free: tap the voice button, speak, and cptr transcribes your message, sends it and reads the reply back aloud, re-arming the mic for a back-and-forth. Connect any OpenAI-compatible TTS API in Settings > Audio, pick a voice and a playback speed (0.5x to 2x), or click the speaker on any message to hear it. An auto-stream toggle in Settings > Audio reads each AI response aloud as it arrives.
- **Reasoning display.** Models that think before answering (such as o3 or Claude with extended thinking) show their reasoning as collapsible steps in the chat. Tool calls and reasoning render as compact, groupable rows with live status.
- **Memory.** The AI remembers facts about you and your projects, stored per user and per workspace and pulled into future conversations automatically. View, edit and delete them from the Memory tab in Settings. Admins can enable background memory review, which lets the AI pick up preferences and patterns quietly as you chat. Memories are stored as an organized Markdown "memory vault" the AI can link, move, split and merge to keep things tidy.
- **Image generation and editing.** Ask the AI to create or edit images right in the chat. Results save to your workspace and display inline. Works with any OpenAI-compatible image API, configured in the Images admin tab.
- **Tool servers.** Connect external tools over MCP or OpenAPI from the Tool Servers admin tab (bearer auth and custom headers supported). Once verified, the AI uses them alongside its built-in tools.
- **Sub-agents and parallel tools.** The AI can spin up sub-agents that work on tasks in parallel, each with full tool access and inspectable afterwards as its own chat. Multiple tool calls in a single response also run concurrently. Sub-agents can also run in the **background**: the AI kicks off a long task, keeps chatting with you and brings the results back when they are done (labeled as a background sub-agent). Set concurrency and limits in the Subagents admin tab.
- **Skills.** Drop reusable `SKILL.md` instruction sets in a workspace or globally. The AI discovers them and loads them on demand, and you can pull one in with `$` in the chat input.
- **Model configuration.** Set parameters and a system prompt per model or as a global default, and pick a **default model** (Settings > Models) that new chats and gateway requests use automatically. System prompts take `{{VARIABLE}}` placeholders (workspace name, file tree, OS, date, skills, plus runtime environment, hostname, platform, architecture, shell, home directory and cptr version), and a workspace `.cptr/system.md` file overrides the prompt for that project.

## Automation and reach

- **Automations.** Schedule recurring tasks on a timer, or ask the AI to set one up. Each automation runs as a real chat with full tool access, and can alert you when it finishes by browser notification or a webhook (Slack, Discord, Teams).
- **Messaging bots.** Connect the AI to Telegram, Discord, Slack, WhatsApp or Signal from Settings. Each bot has full tool access, streams its replies and syncs the conversation back to the web UI. Send `/workspace` to switch projects and `/new` to start a fresh chat.
- **OpenAI-compatible gateway.** Expose each workspace as a model over `/v1/models` and `/v1/chat/completions`, so Open WebUI or any OpenAI-compatible client can drive the full cptr agent loop as if it were a model. See [**Connect to Open WebUI**](/features/computer/open-webui) for setup and the first-class Open WebUI integration (branching, background-task filtering).

Chats are stored as files too, so your AI conversations are searchable, editable and commit-able alongside your code.
