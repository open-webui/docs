---
sidebar_position: 3
title: "Chat Sharing"
---

### Enabling Community Sharing

To enable community sharing, follow these steps:

1. Navigate to the **Admin Panel** page as an **Admin**.
2. Click on the **Settings** tab.
3. Toggle on **Community Sharing** within the **General** settings tab.

:::note

**Note:** Only Admins can toggle the **Community Sharing** option. If this option is toggled off, users and Admins will not see the **Share to Open WebUI Community** option for sharing their chats. Community sharing must be enabled by an Admin for users to share chats to the Open WebUI community.

:::

This will enable community sharing for all users on your Open WebUI instance.

### Sharing Chats

To share a chat:

1. Select the chat conversation you want to share.
2. Click on the 3-dots that appear when hovering the mouse pointer above the desired chat. On a touchscreen the 3-dots are always shown, so tap them directly.
3. Then click on the **Share** option.
4. Select either **Share to Open WebUI Community** (if **Enable Community Sharing** is toggled on by an **Admin**) or **Copy Link**.

:::info Sharing scope is controlled by RBAC

After generating a share link, the modal shows an **Access Control** selector for who can open it, offering **Private**, **Public** and **Open**.

**Public** makes the link reachable by any signed-in user of this instance, so a visitor who is not logged in is still sent to the login page. It is gated by the **Chats Public Sharing** permission. When disabled, non-admin users only see options to grant access to specific users or groups. Admins always retain access to all options. See [RBAC Permissions](/features/authentication-access/rbac/permissions) and [`USER_PERMISSIONS_CHAT_ALLOW_PUBLIC_SHARING`](/reference/env-configuration#user_permissions_chat_allow_public_sharing) for configuration.

**Open** removes the login requirement entirely and is covered in [Open links](#open-links-no-sign-in) below.

:::

### Open links (no sign-in)

**Open** is the only setting that makes a chat readable without an Open WebUI account. Anyone holding the link can read the conversation straight from the internet, with no login and no record of who viewed it.

It is off by default. A non-admin needs the **Chats Open Sharing** permission ([`USER_PERMISSIONS_CHAT_ALLOW_OPEN_SHARING`](/reference/env-configuration#user_permissions_chat_allow_open_sharing), default `False`) before the option appears at all. Without it the dropdown shows only **Private** and **Public**, and an open grant submitted directly to the API is dropped rather than saved.

What an open link does and does not allow:

- It is read-only. Open access exists only as a read grant, so the write toggle is not offered and a write grant for it is rejected.
- It applies to chats only. No other resource type accepts this kind of grant, so knowledge bases, models, prompts, tools, notes and calendars cannot be shared this way.
- Copying the conversation into an account still requires signing in and holding the **Chat Import** permission.
- The page asks search engines not to index it (`noindex,nofollow`). That is a request to well-behaved crawlers, not access control: the link still works for anyone who receives it.

:::warning An open link is public to the internet

Treat the URL itself as the only protection. It cannot be revoked selectively, so if it leaks, the way to cut access is to delete the share link (see [Deleting Shared Chats](#deleting-shared-chats)) or switch the chat back to **Private**. Shared chats are snapshots, so anything in the conversation at the moment the link was generated stays visible, including any file contents, names or internal details quoted in the messages.

:::

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

#### Copying a Share Link

When you select `Copy Link`, a unique share link is generated that can be shared with others.

**Important Considerations:**

- The shared chat will only include messages that existed at the time the link was created. Any new messages sent within the chat after the link is generated will not be included, unless the link is deleted and updated with a new link.
- The generated share link acts as a static snapshot of the chat at the time the link was generated.
- Unless the chat is set to **Open**, viewing it requires an account on the Open WebUI instance where the link was generated, and being signed in to that account. A visitor who is not signed in is redirected to the login page first.
- A chat set to **Open** skips both requirements and is readable by anyone with the link. See [Open links](#open-links-no-sign-in).

### Viewing Shared Chats

To view a shared chat:

1. Ensure you are signed in to an account on the Open WebUI instance where the chat was shared. This step does not apply to a chat shared as **Open**, which anyone can read without an account.
2. Click on the shared link provided to you.
3. The chat will be displayed in a read-only format.
4. If the Admin of the Open WebUI instance from which the shared link was shared has Text-to-Speech set up, there may be an audio button for messages to be read aloud to you (situational).

A chat you are reading keeps the authorship of the person whose chat it is: their name and profile picture sit on the messages they wrote. This holds however you reached it, through the share link, through a [folder shared with you](/features/chat-conversations/chat-features/conversation-organization#sharing-folders), or as an admin opening a user's chat from **Admin Panel > Users**. Opened inside the app rather than through a share link, the chat's **Overview** panel labels its message nodes the same way. The name and picture beside a message are only drawn when **Chat Bubble UI** is off in **Settings > Interface**; the bubble layout shows neither, whoever wrote the message.

#### Using a Shared Chat as Context

Read access to a chat also lets you attach that conversation to a chat of your own, so a model can work from it. This covers a share granted to you by name, one granted to a group you belong to, one set to **Public** and a chat sitting in a [folder shared with you](/features/chat-conversations/chat-features/conversation-organization#sharing-folders). Previously only the chat's owner and admins got anything back: for everyone else the attachment was accepted and then contributed nothing, with no error to say so.

The model receives the conversation as it stands now, so messages added since the link was generated are included even though the link itself still serves the older snapshot. Only the branch the conversation is currently following is passed along. The text goes in verbatim, with no chunking and no vector search.

### Updating Shared Chats

To update a shared chat:

1. Select the chat conversation you want to share.
2. Click on the 3-dots that appear when hovering the mouse pointer above the desired chat. On a touchscreen the 3-dots are always shown, so tap them directly.
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
2. Click on the 3-dots that appear when hovering the mouse pointer above the desired chat. On a touchscreen the 3-dots are always shown, so tap them directly.
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

Open WebUI provides a centralized dashboard to manage every chat conversation you have shared. From there you can search through your shared history, re-copy links, or revoke access instantly.

For details on the management dashboard, see [Shared Chats Management](/features/chat-conversations/data-controls/shared-chats).
