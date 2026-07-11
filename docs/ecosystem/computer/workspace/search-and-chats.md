---
title: "Search and chats"
sidebar_position: 7
---

# Search and chats

Press `Cmd+K` (`Ctrl+K` on Windows/Linux) to search. With a workspace active, results are scoped to it: file names, chats, and the messages inside them. `Cmd+Shift+F` opens the broader search. With an empty query the dialog shows recent items, and `Cmd+1` through `Cmd+9` jumps straight to one of them.

That means "where did the AI explain that migration?" is a search away, from any device; chat history is indexed alongside the files.

## Chats are files in the workspace

Chats belong to the project record. Each one is stored as a file at `<workspace>/.cptr/chats/<chat_id>.json`, inside the project folder itself. Because they're plain files, they are:

- **searchable**: found by the same search as everything else
- **portable**: copy the folder, the conversation history comes along
- **commit-able**: check `.cptr/chats/` into git if you want decisions versioned with the code (or add it to `.gitignore` if you don't)

## Managing chats

- **Resume anywhere.** Open any chat from the sidebar or search and continue it: same chat, any device.
- **Fork instead of derailing.** Fork a chat from any response to try a different direction in a fresh copy while the original stays intact.
- **Delete from the sidebar.** Remove chats you no longer need directly from the recent-chats list.
