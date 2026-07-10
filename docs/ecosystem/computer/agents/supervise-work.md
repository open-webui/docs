---
title: Supervise agent work safely
sidebar_position: 3
---

# Supervise agent work safely

Open WebUI Computer keeps the agent beside the files, terminal, git view, and task state it is acting on. Use it to make the review loop visible, especially when you are away from the host.

## Use this when

Jules wants an agent to investigate a bug from a phone, while retaining the ability to inspect a diff, answer a question, or stop the task before it turns into a broad rewrite.

## Before you start

- Select the correct workspace and model.
- Choose an approval mode in the chat controls: **ask**, **auto**, or **full**.
- Start with a precise goal and an explicit boundary, such as “inspect and propose a fix; do not commit or push.”

## Do it

1. Use **Plan mode** for unfamiliar or high-impact work. It instructs the agent to research with read-only tools and wait for explicit approval before implementation.
2. Watch tool rows, task progress, and resulting files or git diff.
3. Approve, reject, or cancel a pending action. Send a follow-up while the agent is working; the default queue can preserve it for the next turn.
4. Review changes in the editor or Git panel before committing or pushing.

**Ask** pauses tool actions for your decision. **Auto** reduces routine prompts according to the selected agent/tool behavior. **Full** is only for work you are willing to let proceed with no interactive gate. Native coding agents may also show their own approval request because their host protocol has a separate permission model.

## Verify it worked

In plan mode, the agent produces a plan and does not edit a file before you approve implementation. In ask mode, a pending tool request is visible and only runs after you choose. After a task, the Git panel or file editor shows exactly what changed.

## If it did not

Cancel the active task to preserve partial output, lower the approval mode to **ask**, and restate the workspace boundary. If an expected approval never appears, inspect the selected native profile’s permission configuration; it may be operating under its own agent policy.

## Trust boundary

Computer is not a sandbox. A terminal and `run_command` execute with host access. Its built-in file tools scope ordinary file operations to the workspace and avoid `.env` reads/writes, but that does not constrain shell commands or a separately configured native agent. Do not grant **full** approval to unreviewed prompts, untrusted workspaces, or a public/shared instance.
