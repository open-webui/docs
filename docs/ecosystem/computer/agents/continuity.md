---
title: Plans, queues, resume, and context
sidebar_position: 4
---

# Plans, queues, resume, and context

The useful part of remote work is continuity: you can leave a task, reconnect on another device, and see the chat, workspace layout, terminal output, and next action without reconstructing the situation. That does not mean every live operation is durable. Computer preserves the project record and can reconnect to live work while the server and process remain alive; it does not silently continue a provider call, browser session, or background worker through a restart.

## Use this when

Use this when you start an investigation before leaving the desk or need to steer a long-running agent task from a smaller screen.

## Before you start

- Use a named workspace rather than an ad-hoc directory.
- Know whether new messages should **queue** behind a response or **interrupt** it; the choice is in General settings.
- For a risky request, turn on Plan mode before sending it.

## Do it

1. Send the task; use the visible task list to track pending and in-progress work.
2. Queue a concise follow-up instead of opening a duplicate chat. Cancel only when the present task should stop.
3. Close the browser and reopen the same workspace/chat from another device. Reconnect to terminal or command-session output as needed.
4. When the conversation becomes long, use the context indicator and compact the chat when necessary. Compaction summarizes older context so the agent can continue inside the selected model’s limit while retaining the underlying chat record.
5. Fork from a message when you want to explore an alternative without overwriting the original branch.

## Verify it worked

The same workspace URL restores its tabs/layout, the chat shows its prior messages and task state, and an active terminal replays recent scrollback after reconnect. After compaction, the chat reports lower context use while retaining a summary for subsequent turns.

## If it did not

Refresh the chat or use the sidebar to reopen it; if a command is still running, open its command session rather than starting it again. If a task is stuck after an app restart, inspect its partial output and either resume with a new bounded request or cancel it. A terminal session survives browser disconnects, not a host restart or process exit.

| What happened | What to expect | Recover by |
| --- | --- | --- |
| Browser disconnect | Saved workspace layout and chats remain available; a running terminal can reconnect. | Reopen the same workspace and chat; open the existing terminal or command session. |
| Computer or host restart | Terminal, browser, and active background-session state end; in-flight work may have partial output only. | Inspect chat status and partial output, then resend a bounded continuation or restart the command deliberately. |
| Provider interruption | The chat can retain the partial response, but the provider request does not resume itself. | Check the visible error, then resend a small continuation that names the next action. |

## Trust boundary

Persistence is state continuity, not a backup or a guarantee that external providers, host processes, browser sessions, or background sub-agents survive a reboot. Context compaction sends/uses a summary with the selected model; do not treat it as deletion of the underlying chat history.
