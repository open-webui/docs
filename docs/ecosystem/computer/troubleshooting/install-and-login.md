---
title: Install and login problems
sidebar_position: 2
---

# Install and login problems

## Use this when

The server will not start, the first setup URL fails, or a known account cannot sign in on the host.

## Before you start

Keep the terminal where `cptr run` was started open. Its printed tokenized URL is for first-time setup and is different from a normal login URL. Do not delete `~/.cptr` to solve a login problem; it holds persistent state.

## Do it

Confirm the package and process:

```bash
cptr run --headless
curl http://127.0.0.1:8000/api/health
```

Use the exact printed URL for initial setup. On Windows, use [the Windows setup guide](/ecosystem/computer/getting-started/windows) if the terminal reports a missing Visual C++ runtime.

## Verify it worked

The command prints a URL, health returns `status: ok`, and the browser presents either the setup wizard or the sign-in screen. A successful login returns you to your preexisting workspace list.

## If it did not

`Address already in use` means choose `--port 8001` or stop the process owning 8000. `cptr: command not found` means activate the correct environment or reinstall with `python -m pip install cptr`. A repeated `401` means the account/session is invalid; verify the URL and password rather than modifying the database. If the server exits, capture its stdout before reinstalling.

## Trust boundary

The setup URL contains a one-time bootstrap token. Do not paste it into a ticket, chat, shell history, or a public terminal recording.
