---
title: "Triage an on-call interruption"
sidebar_position: 7
---

# Triage an on-call interruption

Use this when a build fails, a deployment looks wrong, or a small service alert arrives while you are away from the machine that has the logs, checkout, and tools. Open WebUI Computer is more useful than a generic chat because you can inspect the real process and repository; it is less disruptive than rebuilding the environment somewhere else just to answer one question.

## Use this when

You need to determine what happened, collect enough evidence for the next action, or make a narrow, tested correction. It is not a substitute for a production runbook, incident process, or desktop review when the blast radius is high.

## Before you start

- Before an incident, complete the [local trial](/ecosystem/computer/getting-started/local-trial), [first workspace](/ecosystem/computer/getting-started/first-workspace), and [private remote access](/ecosystem/computer/remote-access/tailscale-and-tunnels).
- Know the service’s normal status command, log location, focused test, or safe read-only diagnostic.
- Decide which actions require a full workstation or another reviewer before the alert arrives.

## Do it

1. Open the intended workspace and terminal from the remote device.
2. Confirm the active path and branch with `pwd` and `git status`, then inspect recent logs or the smallest safe diagnostic.
3. Compare the observed failure with the current diff and running process. Record the exact error in the workspace chat or note if another person will continue the investigation.
4. Make a narrow correction only when you can run its focused verification; otherwise leave the state and evidence ready for a reviewed handoff.

## Verify it worked

The terminal output, git state, and local process all come from the expected host workspace. You can state whether the failure reproduced, what command showed it, and whether the focused verification passed after any correction.

## If it did not

- If the host is unreachable, do not improvise public access. Use the established private route or escalate through the normal incident path.
- If logs or the branch do not match expectations, stop and confirm the workspace path before acting.
- If the needed action is destructive or unclear, preserve the evidence and hand it off rather than making a speculative fix.

## Trust boundary

Computer provides access to the real host, not a safe simulation. An on-call login can read files and run shell commands with the host account’s permissions. Keep access private and use least-risk diagnostics first.
