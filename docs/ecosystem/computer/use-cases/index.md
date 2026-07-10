---
title: "Use Open WebUI Computer for a real job"
sidebar_position: 1
---

# Use Open WebUI Computer for a real job

Open WebUI Computer is useful when the context that matters is already on one machine: a branch with uncommitted changes, a terminal that is still running, a local app, an authenticated browser session, or an AI task already in progress. It gives another device a view of that same state. It does not require a re-clone, a second setup, or a long explanation pasted into a generic chat.

Start locally first, then add private remote access after the local proof works. Choose the job in front of you, not a feature name.

| I need to… | Start here | The proof of value |
| --- | --- | --- |
| Check a real branch, log, or small correction away from my desk | [Fix an issue from another device](./remote-fix) | The branch, diff, and terminal match the host. |
| Pick up exactly where I left off on another screen | [Resume a workspace from another device](./resume-workspace) | Existing files, tabs, and terminal output return. |
| Review and steer an AI coding task | [Supervise a coding agent](./agent-supervision) | Agent activity and the real diff are visible together. |
| Test the app already running on my machine from a phone or tablet | [Test a local app on a real device](./real-device-preview) | The preview is served by the existing local process. |
| Turn a design review into a project artifact | [Review a prototype and capture feedback](./review-and-share-feedback) | The note, file, or link lands in the intended workspace. |
| Investigate a failed build or service alert while away | [Triage an on-call interruption](./on-call-triage) | Logs, process state, and git state come from the host. |
| Run a known recurring check and know whether it finished | [Run recurring checks](./recurring-checks) | A manual run creates a linked result before the schedule is trusted. |
| Use Open WebUI while work happens in one repository | [Use Open WebUI with a real workspace](./open-webui-workspace) | Computer shows the workspace activity behind the answer. |

If Open WebUI Computer is not installed yet, complete the [local trial](/ecosystem/computer/getting-started/local-trial). If a second device cannot reach the host yet, complete [remote access](/ecosystem/computer/remote-access) before following a remote scenario.

## What these workflows are not

They are not a reason to publish a shell to the internet, give untrusted people a login, or skip normal review for high-impact work. The advantage is continuity with a machine you own and already understand. Keep the instance private, keep the task narrow, and verify the real state before acting.
