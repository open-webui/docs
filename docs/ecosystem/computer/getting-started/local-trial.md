---
title: Local trial
sidebar_position: 2
---

# Local trial

Start by proving that Open WebUI Computer can show the existing project and terminal on your machine before you trust it from another screen.

## Use this when

You want to prove Open WebUI Computer works with an existing machine and project before exposing it to another device, adding AI, or configuring Docker. Its value is continuity: instead of re-cloning a repo into a cloud IDE or reconstructing a terminal, you pick up the files, branch, process, and shell already on this computer.

## Before you start

Use Python 3.10 or newer on the host. Install into the Python environment you intend to keep. This command starts on `127.0.0.1`, so it is not reachable from another device.

## Do it

```bash
pip install cptr
cptr run
```

Open the one-time URL printed by the command. Complete the setup wizard, choose an existing project folder, and open a terminal tab. `cptr run --headless` is useful on a host that should not open a local browser.

## Verify it worked

In a second terminal on the host, run:

```bash
curl http://127.0.0.1:8000/api/health
```

It returns JSON with `"status":"ok"`. In the browser, the selected workspace shows its existing files; run `pwd` and `git status` in its terminal and compare them with your normal shell.

## If it did not

If `cptr` is not found, activate the Python environment where it was installed or run `python -m pip install cptr` there. If the port is occupied, choose another one: `cptr run --port 8001`. See [install and login troubleshooting](/ecosystem/computer/troubleshooting/install-and-login).

## Trust boundary

Local mode still exposes the host filesystem and shell to anyone who can use the signed-in browser profile. Do not treat it as a sandbox; it is your real machine.

## Not a fit

Choose a cloud development environment when you need an isolated disposable machine, or a shared team platform when untrusted people need separate accounts and filesystem boundaries. Open WebUI Computer is for one trusted owner reaching their own machine.
