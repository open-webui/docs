---
title: Sub-agents
sidebar_position: 7
---

# Sub-agents

The AI can delegate work to parallel sub-agents with the `delegate_task` tool. Each sub-agent is a full chat with tool access (it can read files, run commands, and search), and its result is injected back into the parent conversation when it finishes. You'll see the delegations as tool activity in the chat; each worker's output is inspectable.

## Settings

Configure in **Settings → Admin → Subagents**:

| Setting | Default |
| --- | --- |
| Enabled | on |
| Background sub-agents | on |
| Max concurrent | 20 |
| Max iterations per sub-agent | 30 |
| Max output characters | 30000 |
| Custom system prompt | none |

Background sub-agents keep working while the parent chat moves on, and inject their result when done. They are process-bound: a server restart interrupts them rather than resuming them later.

## When to use them

Sub-agents shine when a task splits into **independent** questions (find the failing test, list the callers, scan the deploy log), each with its own answer and no shared files to edit. The parent gets three concise results instead of one long serial investigation.

Skip them when steps depend on each other or touch the same files: sequential edits by parallel workers produce conflicts, not speed. One supervised agent is easier to review. More workers also multiply external requests, and they don't add isolation: every sub-agent has the same machine access as the parent.
