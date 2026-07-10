---
title: "Resume a workspace from another device"
sidebar_position: 3
---

# Resume a workspace from another device

Use this when the value is continuity, not another AI answer. You already have a project open, files under review, a running command, or a chat with useful decisions. Open WebUI Computer lets you return to that machine state from a phone, tablet, or laptop instead of rebuilding it in a fresh editor, shell, or cloud copy.

## Use this when

You need to check progress, continue a small task, or return to the exact workspace after changing devices. It is useful for a long-running build, local service, or repository with work that has not been committed yet.

## Before you start

- Complete the [local trial](/ecosystem/computer/getting-started/local-trial), add the workspace, and configure [private remote access](/ecosystem/computer/remote-access).
- Leave the host powered and awake. Reopening a browser can recover the workspace view, but it cannot revive a process after the host sleeps, shuts down, or restarts.
- Use a workspace path that identifies the actual checkout, not a broad parent directory.

## Do it

1. Sign in from the second device and choose the workspace by its name and path.
2. Open the files, chat, terminal, or git view that matter for the task.
3. Run `pwd`, `git status`, or another harmless command to confirm that the terminal is in the expected project.
4. Continue only the next useful action: inspect output, send a short follow-up, or make a small edit.

## Verify it worked

The workspace shows the same project path, branch, files, and prior terminal output that were present on the host. Closing the second-device browser and reopening it returns to the same host workspace instead of a blank environment.

## If it did not

- If the workspace is absent, add the real host path through the workspace picker; do not copy the repository into application storage.
- If a process stopped, inspect its final terminal output and host state, then restart it deliberately.
- If the view is unfamiliar, verify the workspace path and chat history before sending instructions or changing files.

## Trust boundary

Cross-device continuity does not create isolation. The remote browser is another way into the same host account, files, and terminal. Keep the machine and access path private.
