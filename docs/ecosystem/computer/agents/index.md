---
title: AI and coding agents
sidebar_position: 1
---

# AI and coding agents

An agent earns its place when you can see what it is doing, steer it before the work drifts, and return to the result later. Computer keeps that work beside the real project on your machine: its files, branch, terminal, local service, and installed tools. The workspace is the source of truth, not a detached copy assembled for one chat.

Use this section to make five deliberate choices:

| You want | What Computer provides |
| --- | --- |
| Visible progress | Chat tool activity, task state, files, terminal output, and git diff in the same workspace. |
| A way to steer work | Plan mode, direct chat follow-ups, cancellation, and approval controls for interactive work. |
| Continuity | Saved workspace layout and chat history, plus reconnectable terminals while the host and process remain running. |
| Reusable judgment | Skills for repeatable methods and memory for durable facts you choose to retain. |
| Parallel investigation | Sub-agents for independent questions with results brought back to the parent task. |

Start small. Choose a model, ask it to explain one real file, then decide whether it should be allowed to make a change. You do not need an AI connection to use the rest of Computer.

| Need | Read this |
| --- | --- |
| Decide between an API key/local endpoint and an installed agent subscription | [API models or native coding agents](./models) |
| Make a native agent available on the host | [Set up and detect a coding agent](./setup-and-detection) |
| Review changes and control approval | [Supervise agent work safely](./supervise-work) |
| Continue work across devices or recover after an interruption | [Plans, queues, resume, and context](./continuity) |
| Decide whether reusable guidance, parallel work, web research, or media input is actually needed | [Choose an agent extension](./capabilities) |

Not a fit: use a normal chat product when you only need conversation, knowledge, or model comparison. Use a disposable environment when an untrusted agent or user must not reach the real host. Running an unsupported agent CLI in a terminal remains useful, but it does not make that CLI a native Computer chat backend.
