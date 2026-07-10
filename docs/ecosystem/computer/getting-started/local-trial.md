---
title: Local trial
sidebar_position: 2
---

# Local trial

Start with a folder you recognize. Open a familiar file and see the same folder that is already on your machine. Nothing is copied to a cloud workspace.

## Use this when

Choose this unless you already operate Docker or need an offline installation. It starts Computer only on this machine, so you can decide whether the real-folder view is useful before adding remote access or AI.

## Before you start

- Use Python 3.10 or newer on the machine that holds the folder.
- Pick one small, non-sensitive folder you recognize. It does not need to be code or a Git repository.
- A **workspace** is simply that folder. A **terminal** is an optional text command window for the machine.

The server starts on this machine only (`127.0.0.1`), so another device cannot reach it yet.

## Do it

```bash
pip install cptr
cptr run
```

Open the one-time URL printed by the command. In the setup wizard, choose **Open folder**, select the folder you picked, and skip the optional AI connection for now. `cptr run --headless` is useful on a host that should not open a browser automatically.

## Verify it worked

The sidebar shows the folder you chose. Open a file you recognize and confirm its name and contents match the file on the machine. Close the browser tab, open the same server URL again, and confirm the folder is still there.

### Optional developer check

If you use a terminal or Git, you can make a deeper comparison in a terminal tab:

```bash
pwd
git status
```

`pwd` prints the current folder. Run `git status` only when the selected folder is a Git repository. For a server diagnostic, `curl http://127.0.0.1:8000/api/health` returns JSON with `"status":"ok"`.

## If it did not

If `cptr` is not found, activate the Python environment where it was installed or run `python -m pip install cptr` there. If the page does not open, use [install and login troubleshooting](/ecosystem/computer/troubleshooting/install-and-login) before changing any network settings. If the wrong folder appears, continue with [your first workspace](./first-workspace).

## Next, if you need it

Once the folder check is convincing, choose one optional direction: ask an agent to explain a file through [AI and coding agents](/ecosystem/computer/agents), or keep working locally. Do not set up remote access or an integration merely to complete setup.

## Trust boundary

Local mode still exposes the host filesystem and shell to anyone who can use the signed-in browser profile. Do not treat it as a sandbox; it is your real machine.

## Not a fit

Choose a cloud development environment when you need an isolated disposable machine, or a shared team platform when untrusted people need separate accounts and filesystem boundaries. Open WebUI Computer is for one trusted owner reaching their own machine.
