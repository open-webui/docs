---
title: "Persistent terminals"
sidebar_position: 3
---

# Persistent terminals

The terminal is a PTY-backed shell on the host. It is useful precisely because it sees the running services, credentials, checkout, and local tools you already use at the machine.

## Use this when

Run a focused test, inspect logs, start a local development server, or resume a command from another device. The terminal is often the quickest way to establish what is really happening, but it has the same power and risk as a direct host shell.

## Before you start

- Confirm the selected workspace and the terminal's current directory before running a command.
- Know whether the command reads, changes, or deletes data. Start with status, logs, or a focused test when diagnosing.
- Keep the host awake and connected if the task must continue. Browser reconnection cannot recover a process after a host shutdown or sleep policy stops it.

## Do it

1. Open a terminal in the selected workspace and run `pwd` or an equivalent harmless command to confirm context.
2. Run the narrow diagnostic or task. For a local app, start the usual development command and watch its port and output.
3. Leave the terminal open while you use another tab, a split, or another device. Return to the same workspace to review later output.
4. Stop a server or long-running command deliberately when finished; do not assume closing the browser tab is the same as shutting it down.

## Verify it worked

The terminal reports the expected working directory and command output. A running server remains visible in the terminal and its detected port appears in the file browser. Reconnecting to the workspace shows the existing session output unless the host or process itself changed state.

## If it did not

- **The shell opens in an unexpected directory:** `cd` to the intended project and confirm with `pwd`; then check the workspace configuration before relying on it again.
- **The session reconnects but a command is gone:** inspect the final output and host state. Rerun a safe diagnostic rather than assuming success.
- **Input or display is awkward on mobile:** use a short command, keyboard accessory, or return to a desktop browser. Do not turn a risky one-liner into a longer one just to avoid review.

## Trust boundary

Terminal commands are not limited to AI file-tool restrictions or the workspace tree. They run with the host account's permissions. Never give an untrusted person access to the instance, and do not treat a private browser tab as a sandbox.
