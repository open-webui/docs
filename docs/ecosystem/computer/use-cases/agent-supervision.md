---
title: "Supervise a coding agent away from your desk"
sidebar_position: 4
---

# Supervise a coding agent away from your desk

An agent is already running a task in the actual repository. While away from the host, it reaches a migration or design decision. You need to inspect the work and give a precise direction without losing the session or handing the agent an unlimited instruction.

This is valuable because the agent works where the code already lives, while you stay in control. A **coding agent** is an AI program that can inspect files and run development commands; Open WebUI Computer gives you one place to see what it did, ask it a question, and review the resulting changed lines before accepting more work. You do not need to recreate the repository or blindly trust a chat transcript.

## Use this when

Use this when a coding agent is already working in a workspace you trust and a human decision, review, or small course correction is needed. It is for supervision, not for asking an unattended agent to make irreversible production changes.

## Before you start

- **Not set up yet?** Complete the [local trial](/ecosystem/computer/getting-started/local-trial), add [your first workspace](/ecosystem/computer/getting-started/first-workspace), configure [private remote access](/ecosystem/computer/remote-access/tailscale-and-tunnels), and [set up/detect the coding agent](/ecosystem/computer/agents/setup-and-detection) before leaving the host.
- Configure the coding agent and its permission mode on the host before leaving. Confirm its detection status with a harmless task while at the machine.
- Scope the chat to the intended workspace and state the deliverable, constraints, and test command in the initial instruction.
- Ensure you can reach the host privately from a phone. A browser disconnect does not grant the agent a new permission level.

## Do it

1. Open the existing workspace and chat, not a new generic chat. Read the latest assistant message, the rows in the chat showing commands or files the agent touched, and any approval request.
2. Open the git status strip at the bottom of the workspace and inspect the changed paths and diff. Ask the agent a specific question if the decision is unclear: for example, “Do not create a migration yet. Explain the existing data shape and show the affected callers.”
3. Approve only the action you understand and want. If you need a different approach, send a concrete follow-up in the same chat so it retains the workspace context.
4. When the agent reports completion, review the diff and run or request the focused test. Keep the task open for a desktop review if the change is broad.

See [Search and chats](/ecosystem/computer/workspace/search-chats) for finding and resuming the right chat, and [Git, branches, stashes, and worktrees](/ecosystem/computer/workspace/git) for checking the real repository state.

## Verify it worked

The chat shows the agent's continuing tool activity in the existing workspace, not a detached copy of the repo. The git panel reflects its edits, and a follow-up message appears in the same conversation. A read-only task or focused test produces an observable result before you authorize a broader change.

## If it did not

- **The agent is unavailable or not detected:** do not replace it with a different model mid-task. Check the agent configuration on the host, then resume after detection succeeds.
- **The chat looks unfamiliar:** verify the workspace path and chat history before approving anything. Use global search to find the original chat rather than recreating its context.
- **The agent proposes a destructive command:** decline it, request an explanation or a dry-run, and move the decision to a reviewed desktop session if needed.
- **The agent stopped after a disconnect:** reopen the same chat and inspect the last tool result. Do not assume an unfinished command completed.

## Trust boundary

A native coding agent works in the real workspace and may use the host tools allowed by its configured mode. Its output is not a security boundary and its suggestions are not automatically safe. You remain responsible for approvals, credentials available to the host, and every command or diff you accept.
