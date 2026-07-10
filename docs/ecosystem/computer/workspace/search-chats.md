---
title: "Search and chats"
sidebar_position: 7
---

# Search and chats

A workspace chat is part of the project record: it holds the question, tool activity, decisions, and follow-ups for work in that actual directory. Global search lets you recover a chat or file without recreating the context from memory.

## Use this when

Find a previous agent task, jump to a file across workspaces, resume the correct conversation after changing device, or separate one line of work from another. Start a fresh chat when the task has genuinely changed; do not reuse a long conversation just because it is open.

## Before you start

- Identify the workspace or project where the work belongs. Workspace-scoped search narrows results; searching outside a workspace can cover all configured workspaces.
- Treat chat content as project data. It may include task details, filenames, command output, or sensitive business context.
- If an agent session is involved, confirm its current workspace before sending a follow-up.

## Do it

1. Press `Cmd+K` (or `Ctrl+K` on Windows and Linux) to open quick search. With an active workspace, search results stay scoped to it; without one, search can cover configured workspaces.
2. Enter a chat title, message phrase, file name, or path fragment. Select a result to open the matching chat or file.
3. Use `Cmd+Shift+F` (or `Ctrl+Shift+F`) for the broader search shortcut. With an empty query, the search dialog shows recent chats; `Cmd+1` through `Cmd+9` selects a recent result.
4. Resume the exact chat for a continuing task. Add a concise follow-up that names the decision, constraint, or test instead of repeating the entire task.

## Verify it worked

The opened result shows the expected workspace path and prior messages or file. A resumed chat preserves its existing conversation history, and a new message lands in that chat rather than creating a similarly named duplicate. Switching device and searching again finds the same project record.

## If it did not

- **Search finds too much:** first open the intended workspace, then search again with a distinctive path, title, or phrase.
- **Search finds nothing:** check spelling and whether the workspace has been added to this instance. Browse the workspace directly if the file name changed.
- **The wrong chat is open:** do not approve work or send context-sensitive instructions. Return to search and select the chat whose workspace and prior tool activity match the task.

## Trust boundary

Chats are stored alongside the workspace experience and can be searched by the trusted instance user. Do not use chat titles or messages as a place to put secrets. Sharing access to the instance also shares the ability to recover its project conversations.
