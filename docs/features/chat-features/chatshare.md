---
sidebar_position: 3
title: "Chat Sharing"
---

### Enabling Community Sharing

To enable community sharing, follow these steps:

1. Navigate to the **Admin Panel** page as an **Admin**.
2. Click on the **Settings** tab.
3. Toggle on **Enable Community Sharing** within the **General** settings tab.

:::note

**Note:** Only Admins can toggle the **Enable Community Sharing** option. If this option is toggled off, users and Admins will not see the **Share to Open WebUI Community** option for sharing their chats. Community sharing must be enabled by an Admin for users to share chats to the Open WebUI community.

:::

This will enable community sharing for all users on your Open WebUI instance.

### Sharing Chats

To share a chat:

1. Select the chat conversation you want to share.
2. Click on the 3-dots that appear when hovering the mouse pointer above the desired chat.
3. Then click on the **Share** option.
4. Select either **Share to Open WebUI Community** (if **Enable Community Sharing** is toggled on by an **Admin**) or **Copy Link**.

#### Sharing to Open WebUI Community

When you select `Share to Open WebUI Community`:

- A new tab will open, allowing you to upload your chat as a snapshot to the Open WebUI community website (https://openwebui.com/chats/upload).
- You can control who can view your uploaded chat by choosing from the following access settings:
  - **Private**: Only you can access this chat.
  - **Public**: Anyone on the internet can view the messages displayed in the chat snapshot.
  - **Public, Full History**: Anyone on the internet can view the full regeneration history of your chat.

:::note

Note: You can change the permission level of your shared chats on the community platform at any time from your openwebui.com account.

**Currently, shared chats on the community website cannot be found through search. However, future updates are planned to allow public chats to be discoverable by the public if their permission is set to `Public` or `Public, Full History`.**

:::

Example of a shared chat to the community platform website: https://openwebui.com/c/iamg30/5e3c569f-905e-4d68-a96d-8a99cc65c90f

#### Copying a Share Link

When you select `Copy Link`, a unique share link is generated that can be shared with others.

**Important Considerations:**

- The shared chat will only include messages that existed at the time the link was created. Any new messages sent within the chat after the link is generated will not be included, unless the link is deleted and updated with a new link.
- The generated share link acts as a static snapshot of the chat at the time the link was generated.
- To view the shared chat, users must:
  1. Have an account on the Open WebUI instance where the link was generated.
  2. Be signed in to their account on that instance.
- If a user tries to access the shared link without being signed in, they will be redirected to the login page to log in before they can view the shared chat.

### Viewing Shared Chats

To view a shared chat:

1. Ensure you are signed in to an account on the Open WebUI instance where the chat was shared.
2. Click on the shared link provided to you.
3. The chat will be displayed in a read-only format.
4. If the Admin of the Open WebUI instance from which the shared link was shared has Text-to-Speech set up, there may be an audio button for messages to be read aloud to you (situational).

### Updating Shared Chats

To update a shared chat:

1. Select the chat conversation you want to share.
2. Click on the 3-dots that appear when hovering the mouse pointer above the desired chat.
3. Click on the **Share** option.
4. The **Share Chat** Modal should look different if you've shared a chat before.

The **Share Chat** Modal includes the following options:

- **before**: Opens a new tab to view the previously shared chat from the share link.
- **delete this link**: Deletes the shared link of the chat and presents the initial share chat modal.
- **Share to Open WebUI Community**: Opens a new tab for https://openwebui.com/chats/upload with the chat ready to be shared as a snapshot.
- **Update and Copy Link**: Updates the snapshot of the chat of the previously shared chat link and copies it to your device's clipboard.

### Deleting Shared Chats

To delete a shared chat link:

1. Select the chat conversation you want to delete the shared link for.
2. Click on the 3-dots that appear when hovering the mouse pointer above the desired chat.
3. Click on the **Share** option.
4. The **Share Chat** Modal should look different if you've shared a chat before.
5. Click on **delete this link**.

Once deleted, the shared link will no longer be valid, and users will not be able to view the shared chat.

:::note

**Note:** Chats shared to the community platform cannot be deleted. To change the access level of a chat shared to the community platform:

:::

1. Log in to your Open WebUI account on openwebui.com.
2. Click on your account username at the top right of the website.
3. Click on **Chats**.
4. Click on the chat you wish to change permission access for.
5. Scroll to the bottom of the chat and update its permission level.
6. Click the **Update Chat** button.

### Managing Shared Chats

Open WebUI provides a centralized dashboard to manage every chat conversation you have shared. This feature allows users to audit their shared content and quickly revoke access if needed.

#### Accessing the Management Dashboard

1. Click on your **profile name** or avatar in the bottom-left corner of the sidebar.
2. Select **Settings** from the menu.
3. Navigate to the **Data Controls** tab.
4. Locate the **Shared Chats** row and click the **Manage** button.

#### Dashboard Features

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

### Shared Management FAQ

**Q: Does unsharing a chat delete the original conversation?**  
**A:** No. Unsharing only deletes the public link. Your original chat history remains completely intact.

**Q: Can I manage chats I've shared on the community platform here?**  
**A:** No. This dashboard manages links generated on your local instance. For community-shared content, see [Deleting Shared Chats](#deleting-shared-chats).

**Q: If I delete my original chat, what happens to the shared link?**  
**A:** Deleting a chat also immediately invalidates and deletes any associated share links.
