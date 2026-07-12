---
title: Use your coding agent subscription
sidebar_position: 3
---

# Use your coding agent subscription

Already paying for Codex, Claude Code, Cursor, Grok, OpenCode, Cline, or Pi? Use that subscription as a native chat backend; no API key is needed. Install and log in to the agent's CLI on the machine running Computer, then go to **Settings → Admin → Agents** and add a profile. Its models appear in the model selector like any other provider, with ids like `agent:<profile-id>/<model>`.

A profile has: **Name**, **Type** (which agent), **Profile ID** (slug used in model ids), **Command** (name or absolute path; `~` works), and optional **Home** (see below). Some types add fields: Claude Code has **Launch args**, Cursor has an **API endpoint**, OpenCode has **Server URL** and password.

## Per-agent setup

The CLI must be installed **and logged in on the host running Computer**, not on the phone or laptop you browse from.

### Codex

Command: `codex`. Sign in with `codex login`. Needs a recent CLI with app-server support; if detection reports an unsupported capability, update the CLI.

### Claude Code

Command: `claude`. Sign in with the CLI's normal login flow. Also requires the Python package `claude-agent-sdk` in the environment Computer runs in; without it the profile shows **missing dependency**:

```bash
pip install claude-agent-sdk
```

The available model list depends on the installed CLI version.

### Cursor

Command: `agent`. Run `agent login` on the host.

### Grok

Command: `grok`. Log in with the CLI, or set the `XAI_API_KEY` environment variable.

### OpenCode

Command: `opencode`. Computer spawns `opencode serve` automatically, or set **Server URL** (and password) in the profile to connect to a server you already run. Models come from the providers connected in OpenCode.

### Cline

Command: `cline`. Run `cline auth` on the host.

### Pi

Command: `pi`. Models are namespaced `provider/id`.

## Detection statuses

Each profile shows a live status (results cached for ~30 seconds):

| Status | Meaning | Fix |
| --- | --- | --- |
| **ready** | Command found, dependencies present, models discoverable | Nothing; pick a model and chat |
| **not found** | Command isn't on `PATH` | Install the CLI, or set Command to the absolute path |
| **missing dependency** | A required local package is absent (Claude Code: `claude-agent-sdk`) | Install the named dependency in Computer's environment |
| **auth unknown** | CLI found but login state couldn't be confirmed | Run the agent's login on the host, then re-detect |

Profile mode: **auto** (selectable only when ready), **enabled** (force), or **disabled**.

## Models, sessions, and the Home field

- **Models:** leave the profile's model list empty to auto-detect from the CLI, or pin a manual list. Model ids look like `agent:claude/claude-sonnet-4-5`.
- **Sessions resume automatically.** Each backend returns a session or thread id that is stored on the chat and passed back next turn (Claude Code SDK session, Codex thread resume, Cursor/Grok/Cline session load). Close the tab, open the chat on your phone, and the agent continues where it left off.
- **Home:** point the profile at an alternate agent config/login directory. This is useful for a second account or an isolated login kept apart from your default `~` config.

## Any other agent still works

Gemini CLI, Kilo Code, or any other terminal agent runs fine in a [terminal tab](/ecosystem/computer/workspace/terminals); it just isn't a native chat backend with model selection and session resume.
