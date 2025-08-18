---
sidebar_position: 4
title: "🗨️ Chat Sharing"
---

# Help Center: Shared Chats in Open WebUI

This guide provides comprehensive information and guidance on using the Shared Chats system in Open WebUI.

## Introduction to Shared Chats

The Shared Chats feature allows you to share your conversations with others by creating a public link. This is useful for collaborating, sharing information, or getting feedback on your interactions with the AI.

**Important:**

- When you share a chat, anyone with the link can read the conversation. Be mindful of sharing confidential or sensitive information.
- The shared chat will be a snapshot of the conversation at the moment you share it. Subsequent messages in the original chat will not be reflected in the shared version.

## How to Share a Chat

There are two main ways to share a chat in Open WebUI.

### From the Chat Interface

1. From the chat interface, locate the chat you wish to share in the sidebar.
2. Click on the "Share" icon or option for that chat.
3. A "Share Chat" modal will appear with several options to customize your shared chat:

    - **Custom Link (Optional):** You can specify a custom URL for your shared chat. This must be a unique ID that does not contain slashes.
    - **Password Protection (Optional):** Secure your shared chat with a password. Anyone with the link will need to enter the password to view the content.
    - **Public:** If checked, the chat will be listed on the public discovery page of the Open WebUI instance (if enabled by the administrator). If unchecked, only users with the direct link can access it.
    - **Display Username:** Choose whether to show your username on the shared chat page.
    - **Allow Cloning:** Decide if you want to allow other users to clone your chat into their own account.
    - **Expires in:** Set an expiration time for the shared link (e.g., 1 hour, 1 day, never). The link will be automatically revoked after this period.
    - **Expire on views:** Set a maximum number of views for the shared link. The link will be automatically revoked after reaching this limit. The view count is incremented for every viewer except the owner of the chat.
    - **Show QR Code:** Generate and display a QR code that links to your shared chat.
    - **Use Gradient:** Apply a visually appealing gradient background to your shared chat page.

4. After configuring the options, click "Create Link".
5. A public link will be generated. You can copy this link and share it with others.

### Using Drag and Drop

You can also share chats by dragging them from your chat history sidebar and dropping them onto the "Shared Chats" page.

1. Navigate to the "Shared Chats" page from the main menu.
2. From the sidebar, click and drag the chat you want to share.
3. Drop the chat anywhere on the "Shared Chats" page.
4. The "Share Chat" modal will appear, allowing you to configure the sharing options as described above.

This drag-and-drop functionality is particularly powerful as it also allows you to import and share chats from other users or even other Open WebUI instances. If you drag a chat that you do not own onto the page, it will first be imported into your account, and then the sharing modal will open for the newly imported chat.

## Managing Your Shared Chats

You can manage all your shared chats from the "Shared Chats" page. This page provides a comprehensive overview and tools to manage your shared content.

### The Shared Chats Dashboard

The dashboard displays a list of all your shared chats with the following information:

- **Title:** The title of the shared chat.
- **Created On:** The date and time the chat was shared.
- **Last Updated:** The date and time the sharing settings were last modified.
- **Link:** The public link to the shared chat.
- **Public:** Whether the chat is marked as public.
- **Views:** The number of times the shared link has been viewed.
- **Clones:** The number of times the shared chat has been cloned by other users.
- **Status:** The status of the a shared link, which can be "Active" or "Revoked".

### Searching and Filtering

You can easily find specific shared chats using the search and filter options:

- **Search:** Use the search bar to find chats by their title.
- **Filter by Date:** Select a start and end date to filter chats shared within a specific period.
- **Filter by Public Status:** Filter chats based on whether they are public or not.
- **Filter by Status:** Filter chats based on their "Active" or "Revoked" status.

### Actions on Shared Chats

You can perform several actions on your shared chats, either individually or in bulk.

#### Individual Actions

- **Copy Link:** Quickly copy the public link to your clipboard.
- **Revoke:** If a link is active, you can revoke it. This will make the link inaccessible.
- **Restore:** If a link has been revoked, you can restore it to make it active again. **Note:** Restoring a link that was automatically revoked due to expiration (either by time or views) will also remove the original expiration settings. The restored link will be permanent until you set new expiration conditions.
- **Modify:** This opens the "Share Chat" modal, where you can update the sharing settings. If the chat is password-protected and you wish to change or remove the password, you will be required to enter the current password.
- **Reset Statistics:** You can reset the "Views" and "Clones" counters for a shared chat back to zero.

#### Bulk Actions

You can select multiple shared chats using the checkboxes and perform the following bulk actions:

- **Revoke Selected:** Revoke all the selected shared links.
- **Reset Stats for Selected:** Reset the statistics for all selected shared chats.

Additionally, there are actions that affect all your shared chats:

- **Revoke All:** Revoke all of your shared links at once.
- **Reset All Stats:** Reset the statistics for all of your shared chats.
- **Clear Revoked:** This action permanently removes all sharing information from your revoked chats. They will no longer appear on the Shared Chats dashboard and will revert to being normal, un-shared chats. This action cannot be undone.

## Troubleshooting Shared Links

If a viewer is unable to access a shared chat, they will see one of the following messages:

- **Link Not Found:** "Oops! The shared link you're trying to access doesn't exist. It might have been deleted or there might be a typo in the URL." This appears if the share ID in the URL is incorrect or the shared chat has been permanently deleted.
- **Link Revoked:** "The owner of this chat has revoked this sharing link." This appears if the owner has manually revoked the link from their dashboard.
- **Link Expired:** "This shared link has expired and is no longer accessible." This appears if the link has reached its expiration time or view limit.
- **Login Required:** If the chat is not public, unauthenticated viewers will be redirected to the login page.
- **Password Required:** If the chat is password-protected, viewers will be prompted to enter the password before they can see the content.

## Viewer Experience: Authenticated vs. Unauthenticated

The experience of viewing a shared chat can differ depending on whether the viewer is logged into an Open WebUI account.

### Unauthenticated (Anonymous) Viewers

- **Access:** Can only view chats that are marked as "Public". If they try to access a non-public shared chat, they will be prompted to log in.
- **Cloning:** Cannot clone chats. The "Clone Chat" button will not be visible.
- **Owner Information:** Will not see the username and profile picture of the person who shared the chat, even if the "Display Username" option was enabled.

### Authenticated (Logged-In) Viewers

- **Access:** Can view both public and non-public shared chats (as long as they have the link).
- **Cloning:** Can clone a shared chat, provided that:
    1. They have the necessary permissions for cloning in their user role.
    2. The owner of the shared chat has enabled the "Allow Cloning" option for that specific chat.
- **Owner Information:** Will see the sharer's username and profile picture, if the "Display Username" option was enabled for the shared chat.

## Permissions and Public Chats

The ability to create public chats is a permission that can be controlled by the administrator of the Open WebUI instance.

### What Happens if Your Public Sharing Permission is Revoked?

If an administrator revokes your permission to create public chats (either by changing your user group's permissions or the default permissions for all users), the following will happen:

- **All your existing public chats will automatically be made private.** The `is_public` flag will be set to `False` for all your shared chats.
- **The share links will NOT be revoked.** They will remain active, but will now require viewers to be logged in to an Open WebUI account to access them (as they are no longer public).
- You will no longer be able to set the "Public" flag when sharing new chats or modifying existing ones.

This is a security measure to ensure that users who are no longer supposed to have public sharing capabilities do not have publicly accessible content.

## Automatic Revocation and Expiration

- **Expiration by Time:** If you set an expiration time, the link will automatically become revoked and inaccessible after that time has passed.
- **Expiration by Views:** If you set a maximum number of views, the link will be automatically revoked as soon as the view count reaches that number. The view count is incremented each time someone views the link, with the exception of the chat's owner.

## What Happens When You Share a Chat

- A unique public link is created for your chat. You can customize this link's ID.
- The content of the shared chat is a static copy of the conversation at the time of sharing.
- If you continue the conversation in the original chat, the shared version will not be updated.

## What Happens When You Revoke a Link

- The public link becomes inactive, and anyone trying to access it will be notified that the chat is no longer available.
- Revoking a link does not delete the original chat from your history.
- You can restore a revoked link at any time from the Shared Chats dashboard.

## Sharing to the Open WebUI Community

In addition to sharing via private links, you can also share your chats to the public Open WebUI Community website.

### Enabling Community Sharing

For this feature to be available, an administrator of your Open WebUI instance must first enable it.

1. Navigate to the **Admin Panel**.
2. Go to the **Settings** > **General** tab.
3. Toggle on **Enable Community Sharing**.

If this setting is disabled, the option to share to the community will not be visible.

### How to Share to the Community

1. In the chat you wish to share, click the share icon.
2. In the "Share Chat" modal, click the **Share to Open WebUI Community** button.
3. A new browser tab will open, taking you to `https://openwebui.com/chats/upload`.
4. Your chat will be uploaded as a snapshot. You can then set its visibility on the community platform:
    - **Private**: Only you can access this chat when logged into your `openwebui.com` account.
    - **Public**: Anyone on the internet can view the messages in the chat snapshot.
    - **Public, Full History**: Anyone on the internet can view the full regeneration history of your chat.

**Note:** You can change the permission level of your shared chats on the community platform at any time from your `openwebui.com` account.

We hope this guide helps you make the most of the Shared Chats feature in Open WebUI! If you have any further questions, please refer to the main project documentation or join our community.
