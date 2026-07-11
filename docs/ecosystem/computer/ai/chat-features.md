---
title: Chat features
sidebar_position: 5
---

# Chat features

Quick reference for what the chat input and chat view can do.

## Mentions and slash commands

- **`@`** mentions a file; its content is fed to the AI as context. Type `@` and start typing a filename.
- **`$`** mentions a [skill](./skills-and-memory), pulling a reusable instruction set into the turn.
- **`/`** opens slash commands: `/plan` toggles [plan mode](./approvals-and-plan-mode), `/fork` branches the chat. Skills are also reachable through `/`.

## Queue or interrupt

Send a message while the AI is working and it queues for the next turn by default: the current task finishes, then your follow-up runs with full context. Prefer to cut in? Switch the behavior from queue to interrupt in **General settings**.

## Fork a chat

Branch from any response (`/fork` or the response menu) to explore an alternative without overwriting the original thread.

## Automatic context compaction

When a conversation exceeds roughly **80k tokens** (configurable per model), Computer summarizes older messages into a rolling summary so the chat keeps fitting the model's context window. The full chat history is preserved: compaction changes what's sent to the model, not what's stored. Each turn allows up to 2048 tool iterations.

## Reasoning, usage, and persistence

- **Reasoning display:** thinking models (o3, Claude, ...) show their chain of thought as an expandable section on the response.
- **Usage:** every response shows token counts and timing.
- **Persistence:** chats are stored per workspace in `<workspace>/.cptr/chats/` as plain files you can search, move, and commit. Open the same workspace from any device and every chat is there, ready to resume.
