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

- **Archive All Chats**: Move all your current conversations to the archive at once. This is useful for periodic cleanup. Archived chats leave their folders, so people who could open them through a [shared folder](/features/chat-conversations/chat-features/conversation-organization#sharing-folders) lose access at once.
- **Delete All Chats**: Permanently remove all conversations (both active and archived). 
  - :::warning
    This action cannot be undone. All chat history will be permanently deleted.
    :::

:::info Deleting needs the Chat Delete permission

**Delete** on an archived chat and **Delete All Chats** are drawn only for people who hold **Allow Chat Delete**. Without it neither appears, so there is no button that refuses when you press it, and archiving and **Unarchive All** work as before. Admins are always exempt. See [Permissions](/features/authentication-access/rbac/permissions#3-chat-permissions).

:::

:::info Archive hidden by the admin

An admin can hide **Archive** under **Visible controls** in **Settings > Admin > Interface**. That removes **Archive** from chat menus and from the sidebar's selection bar, and also hides **Unarchive Chat** on each archived chat, **Unarchive All** and **Archive All Chats**. Chats that are already archived stay archived and can still be opened and deleted here. Admins always see every control.

:::

## FAQ

**Q: Can I search within archived chats?**  
**A:** Yes. The archive dashboard itself searches by chat title. The search window (`Cmd+K` / `Ctrl+K`) and the **Reference Chats** picker in the chat input's **+** menu read the messages of archived chats too when you add the `archived:true` filter, for example `archived:true quarterly report`. You do not need to restore a chat to search inside it. See [History & Search](/features/chat-conversations/chat-features/history-search#filter-prefixes).

**Q: Is there a limit to how many chats I can archive?**  
**A:** There is no hard limit. The scalability depends on your database configuration.

**Q: Do archived chats still use storage?**  
**A:** Yes. Archived chats remain in your database. To free up space, you must permanently delete them.
