---
sidebar_position: 2
title: "🔗 Shared Chats"
---

Open WebUI provides a centralized dashboard to manage every chat conversation you have shared. This feature allows users to audit their shared content and quickly revoke access if needed.

:::info
This page documents the **management dashboard** for shared chats. For information on how to share chats, see [Chat Sharing](/features/chat-conversations/chat-features/chatshare).
:::

## Accessing the Management Dashboard

1. Click on your **profile name** or avatar in the bottom-left corner of the sidebar.
2. Select **Settings** from the menu.
3. Navigate to the **Data Controls** tab.
4. Locate the **Shared Chats** row and click the **Manage** button.

## Dashboard Features

The **Shared Chats** modal provides a unified interface for your public content:

- **Centralized List**: View all conversations that have an active share link.
- **Search & Filter**: Quickly find specific shared chats by title. The search bar includes a **500ms debounce** to ensure smooth performance while typing.
- **Advanced Sorting**: Organize your shared history by:
  - **Updated At** (Default)
  - **Title**
- **Copy Link**: Use the **Clipboard icon** next to any entry to instantly copy the share URL back to your clipboard.
- **Revoke Access (Unshare)**: Use the **Unshare icon** (represented by a slashed link) to deactivate a share link.
    - :::warning
      Revoking access immediately invalidates the link. Anyone attempting to visit the URL will receive a "Not Found" error. This action is permanent, though you can generate a *new* unique link by sharing the chat again from the main interface.
      :::
- **Pagination**: Efficiently browse through your history using the "Load More" functionality at the bottom of the list.

## FAQ

**Q: Does unsharing a chat delete the original conversation?**  
**A:** No. Unsharing only deletes the public link. Your original chat history remains completely intact.

**Q: Can I manage chats I've shared on the community platform here?**  
**A:** No. This dashboard manages links generated on your local instance. For community-shared content, see [Deleting Shared Chats](/features/chat-conversations/chat-features/chatshare#deleting-shared-chats).

**Q: If I delete my original chat, what happens to the shared link?**  
**A:** Deleting a chat also immediately invalidates and deletes any associated share links.
