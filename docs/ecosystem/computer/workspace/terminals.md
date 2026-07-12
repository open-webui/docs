---
title: "Terminals"
sidebar_position: 4
---

# Terminals

Open a terminal tab and you get a full PTY-backed shell on the host, starting in the workspace folder. It's your real shell: your PATH, your credentials, your tools. Anything you'd run over SSH runs here: tests, build scripts, `htop`, vim, docker.

## Sessions persist

Close the tab, close the browser, put your phone in your pocket; the shell and whatever it's running keep going on the host. Reconnect from any device and the session is still there, with its scrollback replayed, so you can start a long build at your desk and check its output from the train.

Open as many terminals as you need, in tabs or side-by-side splits: a dev server in one, logs in another, a shell for poking around in a third. The arrangement is saved with the workspace layout.

## Terminal coding agents

Any CLI tool works, including terminal coding agents. Run Gemini CLI or any other agent in a terminal tab exactly as you would locally, and it survives disconnects like every other session. If you'd rather have Claude Code, Codex, and friends show up in the chat model selector instead, connect them as [native coding-agent backends](/ecosystem/computer/ai/coding-agents).

## What does not survive

Sessions live inside the `cptr` process. They end when:

- the `cptr` process itself stops or restarts
- the host reboots, or goes to sleep and suspends its processes

If a long-running task has to outlive those, see [keep it running](/ecosystem/computer/phone-and-remote/keep-it-running) for preventing host sleep, or run the task under `tmux`/`nohup` so it detaches from the session entirely.
