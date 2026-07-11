---
title: "Quickstart"
sidebar_position: 2
---

# Quickstart

From zero to your real files in a browser, in about two minutes. You need Python 3.10+ on the machine that has your work (macOS, Linux, or Windows). No AI key, no account with anyone, no cloud.

## 1. Install and run

```bash
pip install cptr
cptr run
```

Or without installing anything permanent: `uvx cptr@latest run`. Prefer containers? Use [Docker](/ecosystem/computer/install/docker) instead; same result.

`cptr run` starts the server on `http://127.0.0.1:8000` and opens your browser at a one-time setup link (`/?token=...`). On a headless machine use `cptr run --headless` and open the printed URL yourself.

## 2. Create your account

The setup page asks for a username and password. This is the admin account, stored locally on your machine. The one-time token only works while no account exists yet, so nobody else can race you to it.

## 3. Open a folder

Choose **Open folder** and pick any folder on the machine: a code repo, your documents, a project directory. That folder is now a **workspace**. Computer shows the folder itself, not an uploaded copy. You can skip the optional AI connection during setup and add it any time later.

From the workspace you get:

- **Files**: browse, edit with syntax highlighting, preview Markdown, PDFs, CSVs, and Office files.
- **Terminal**: a real shell on the machine. It keeps running when you close the tab.
- **Git**: branch, diffs, staging, commits, push (if the folder is a repo).
- **Chat**: available once you [connect a model or agent](/ecosystem/computer/ai/).

Add more folders any time from the workspace picker. See [workspaces](/ecosystem/computer/workspace/workspaces).

## 4. Now make it yours

The two upgrades almost everyone wants next:

1. **Reach it from your phone.** On the same Wi-Fi it's one flag (`cptr run --host 0.0.0.0`); from anywhere it's a ten-minute [Tailscale setup](/ecosystem/computer/phone-and-remote/tailscale). Then [install it as an app](/ecosystem/computer/phone-and-remote/phone-app) on your home screen.
2. **Give it AI.** [Connect an API key or Ollama](/ecosystem/computer/ai/connect-a-model), or [plug in the Claude Code / Codex / Cursor subscription you already have](/ecosystem/computer/ai/coding-agents).

And if the machine is a laptop or reboots occasionally, set up [Keep it running](/ecosystem/computer/phone-and-remote/keep-it-running) so the server, your terminals, and your agents survive without you babysitting them.

## If something didn't work

- `cptr: command not found`: your shell can't see pip's scripts directory. Run `python -m pip install cptr` in the environment you meant, or reopen the terminal.
- Port busy: run `cptr run --port 8001`.
- Anything else: [Troubleshooting](/ecosystem/computer/troubleshooting).
