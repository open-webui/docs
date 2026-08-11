---
sidebar_position: 3
title: "Archived Chats"
---

Open WebUI allows you to archive conversations to declutter your sidebar while preserving them for future reference. The **Archived Chats** dashboard lets you manage all your archived conversations in one place.

## Accessing Archived Chats

1. Click on your **profile name** or avatar in the bottom-left corner of the sidebar.
2. Select **Settings** from the menu.
3. Open the **Archived Chats** tab, under **Data**.

Archived chats used to sit behind a **Manage** button on the **Data Controls** tab. They now have a tab of their own in the same **Data** group.

## Dashboard Features

The **Archived Chats** view provides tools to manage your archived conversations:

- **Search**: Quickly find archived chats by title using the search bar.
- **Restore**: Bring an archived chat back to your main sidebar.
- **Delete**: Permanently remove an archived chat from your account.

## Bulk Operations

From the Data Controls tab, you can also perform bulk operations:

- **Archive All Chats**: Move all your current conversations to the archive at once. This is useful for periodic cleanup.
- **Delete All Chats**: Permanently remove all conversations (both active and archived). 
  - :::warning
    This action cannot be undone. All chat history will be permanently deleted.
    :::

:::info Deleting needs the Chat Delete permission

**Delete** on an archived chat and **Delete All Chats** are only drawn for people who are allowed to delete chats. If an administrator has turned **Allow Chat Delete** off for you, neither appears, and archiving still works as before. Admins are always exempt. See [Permissions](/features/authentication-access/rbac/permissions#3-chat-permissions).

:::

## FAQ

**Q: Can I search within archived chats?**  
**A:** Yes. The archive dashboard itself searches by chat title, but the sidebar search (`Cmd+K` / `Ctrl+K`) reads the messages of archived chats too: add the `archived:true` filter, for example `archived:true quarterly report`. You do not need to restore a chat to search inside it. See [History & Search](/features/chat-conversations/chat-features/history-search#filter-prefixes).

**Q: Is there a limit to how many chats I can archive?**  
**A:** There is no hard limit. The scalability depends on your database configuration.

**Q: Do archived chats still use storage?**  
**A:** Yes. Archived chats remain in your database. To free up space, you must permanently delete them.
