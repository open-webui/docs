---
sidebar_position: 4
title: "🗨️ Chat Sharing"
---

# Help Center: Shared Chats in Open WebUI

This guide provides comprehensive information and guidance on using the Shared Chats system in Open WebUI.

## Table of Contents

- [Help Center: Shared Chats in Open WebUI](#help-center-shared-chats-in-open-webui)
  - [Table of Contents](#table-of-contents)
  - [Introduction to Shared Chats](#introduction-to-shared-chats)
  - [How to Share a Chat](#how-to-share-a-chat)
    - [From the Chat Interface](#from-the-chat-interface)
    - [Using Drag and Drop](#using-drag-and-drop)
    - [Dynamic Expiration Summary](#dynamic-expiration-summary)
  - [Feature Matrix for Shared Chats](#feature-matrix-for-shared-chats)
  - [Managing Your Shared Chats](#managing-your-shared-chats)
    - [The Shared Chats Dashboard](#the-shared-chats-dashboard)
    - [Advanced Filtering and Sorting](#advanced-filtering-and-sorting)
      - [Filtering](#filtering)
      - [Sorting](#sorting)
      - [Pagination](#pagination)
    - [Actions on Shared Chats](#actions-on-shared-chats)
      - [Individual Actions](#individual-actions)
      - [Bulk Actions](#bulk-actions)
  - [Troubleshooting Shared Links](#troubleshooting-shared-links)
  - [The Viewer Experience](#the-viewer-experience)
    - [What the Viewer Sees](#what-the-viewer-sees)
    - [Authenticated vs. Unauthenticated Viewers](#authenticated-vs-unauthenticated-viewers)
      - [Unauthenticated (Anonymous) Viewers](#unauthenticated-anonymous-viewers)
      - [Authenticated (Logged-In) Viewers](#authenticated-logged-in-viewers)
  - [Permissions and Public Chats](#permissions-and-public-chats)
    - [What Happens if Your Public Sharing Permission is Revoked?](#what-happens-if-your-public-sharing-permission-is-revoked)
  - [Administrator Configuration](#administrator-configuration)
    - [Environment Variables](#environment-variables)
  - [Automatic Revocation and Expiration](#automatic-revocation-and-expiration)
  - [What Happens When You Share a Chat](#what-happens-when-you-share-a-chat)
  - [What Happens When You Revoke a Link](#what-happens-when-you-revoke-a-link)
  - [QR Code Generation](#qr-code-generation)
  - [Sharing to the Open WebUI Community](#sharing-to-the-open-webui-community)
    - [Enabling Community Sharing](#enabling-community-sharing)
    - [How to Share to the Community](#how-to-share-to-the-community)
  - [Frequently Asked Questions (FAQ)](#frequently-asked-questions-faq)
  - [For Developers: API Endpoints](#for-developers-api-endpoints)
    - [Sharing and Accessing Chats](#sharing-and-accessing-chats)
    - [Managing Shared Chats](#managing-shared-chats)
    - [Statistics](#statistics)

## Introduction to Shared Chats

The Shared Chats feature allows you to share your conversations with others by creating a public link. This is useful for collaborating, sharing information, or getting feedback on your interactions with the AI.

Here's a quick overview of how sharing works:

- **Default Behavior (Snapshot):** By default, sharing creates a static **snapshot** of your conversation up to this point, including all prompts and responses. Future messages will not be included.
- **Live Updates (Optional):** You can enable **Live Updates** for a shared chat. If you do, the shared version will update as you continue the conversation.
- **Updating the Link:** You can update the link at any time to reflect the latest state of the conversation.
- **Link Persistence:** The link remains active as long as the original chat exists and the expiration, if set, has not been reached.
- **Deletion Impact:** If you delete the original conversation from your history, the shared link will also be deleted and the content will no longer be accessible via the shared link.
- **Cloning and Deletion:** If a viewer clones the shared conversation into their own chat history (if "Allow Cloning" is enabled), deleting your chat's share link will not remove the conversation from their chat history.
- **Privacy:** When you share a chat, anyone with the link can read the conversation. Be mindful of sharing confidential or sensitive information.

## How to Share a Chat

There are two main ways to share a chat in Open WebUI.

### From the Chat Interface

1. From the chat interface, locate the chat you wish to share in the sidebar.
2. Click on the "Share" icon or option for that chat.
3. A "Share Chat" modal will appear with several options to customize your shared chat:

    - **Custom Link (Optional):** You can specify a custom URL for your shared chat. This must be a unique ID up to 144 characters long. Spaces will be automatically converted to hyphens, and most special characters will be removed. The allowed characters are alphanumeric characters, hyphens (`-`), periods (`.`), underscores (`_`), and tildes (`~`).
    - **Password Protection (Optional):** Secure your shared chat with a password. Anyone with the link will need to enter the password to view the content. You can change or remove the password later from the "Modify" action on the dashboard.
    - **Public Access:** If checked, anyone with the link can view the chat. If unchecked, only users who are logged into an Open WebUI account can access it.
    - **Enable Live Updates:** If checked, the shared link will update with the conversation in real-time. If unchecked, the shared link will be a static snapshot of the conversation at the time of sharing.
    - **Display Username:** Choose whether to show your username on the shared chat page.
    - **Allow Cloning:** Decide if you want to allow other users to clone your chat into their own account.
    - **Expires After:** Set an expiration time for the shared link (e.g., 1 Hour, 24 Hours, 7 Days, or a custom date and time). The link will be automatically revoked after this period. You cannot set a custom date that is in the past.
    - **Max Number of Views:** Set a maximum number of views for the shared link. The link will be automatically revoked after reaching this limit (0 for unlimited). The view count is incremented for every viewer except the owner of the chat. You cannot set a maximum number of views that is lower than the current view count. If you enter a number lower than the current view count, it will be automatically adjusted to be one more than the current count.
    - **Max Number of Clones:** If cloning is allowed, you can set a maximum number of times the chat can be cloned. The link can be configured to be revoked or remain viewable after the limit is reached (0 for unlimited). You cannot set a maximum number of clones that is lower than the current clone count. If you enter a number lower than the current clone count, it will be automatically adjusted to be one more than the current count.
    - **Allow viewing after clone limit:** If a clone limit is set, this option keeps the link active for viewing even after the limit is reached. Otherwise, the link is revoked.
    - **Show QR Code:** Generate and display a QR code that links to your shared chat.
    - **Gradient QR Code:** Apply a visually appealing gradient background to your QR code.

4. After configuring the options, click **Create Link**. If you are modifying an existing share, this button will be labeled **Update Link Settings**.
5. A public link will be generated. You can copy this link and share it with others.

### Using Drag and Drop

You can also share chats by dragging them from your chat history sidebar and dropping them onto the "Shared Chats" page.

1. Navigate to the "Shared Chats" page from the main menu.
2. From the sidebar, click and drag the chat you want to share.
3. Drop the chat anywhere on the "Shared Chats" page.
4. The "Share Chat" modal will appear, allowing you to configure the sharing options as described above.

This drag-and-drop functionality is particularly powerful as it also allows you to import and share chats from other users or even other Open WebUI instances. If you drag a chat that you do not own onto the page, it will first be imported into your account, and then the sharing modal will open for the newly imported chat.

### Dynamic Expiration Summary

When you set expiration conditions for a shared link, the "Share Chat" modal provides a dynamic summary of when the link will expire. This summary is updated in real-time as you change the settings and can combine multiple conditions into a single, easy-to-understand sentence.

For example, if you set a link to expire on a specific date and after a certain number of views, the summary might say: "Expires on 10/26/2024, 5:00:00 PM or after 100 views". This helps you to quickly understand the exact conditions under which your shared link will become inaccessible.

## Feature Matrix for Shared Chats

This table provides a quick overview of the key settings you can configure when sharing a chat and the outcome of each choice.

| Feature | Setting | Outcome |
| :--- | :--- | :--- |
| **Visibility** | Public | Anyone on the internet with the link can view the chat. |
| | Private | Only users logged into your Open WebUI instance can view the chat. |
| **Security** | Password Protection | Viewers will be prompted to enter a password to see the content. |
| **Interactivity** | Allow Cloning | Viewers can clone the chat to their own account to continue the conversation. |
| | Disable Cloning | The chat is read-only for viewers. |
| **Longevity** | Expires After (Time) | The link becomes inaccessible after the specified time. |
| | Max Views | The link becomes inaccessible after it has been viewed a certain number of times. |
| | Max Clones | The link becomes inaccessible after it has been cloned a certain number of times (unless "Allow viewing after clone limit" is enabled). |
| | No Expiration | The link remains active indefinitely, or until manually revoked. |

**Note on Expiration:** If you set multiple expiration conditions (e.g., time and views), the link will be revoked as soon as the *first* condition is met.

## Managing Your Shared Chats

You can manage all your shared chats from the "Shared Chats" page. This page provides a comprehensive overview and tools to manage your shared content.

### The Shared Chats Dashboard

The dashboard displays a list of all your shared chats with the following information:

- **Title:** The title of the shared chat.
- **Created On:** The date and time the chat was shared.
- **Last Updated:** The date and time the sharing settings were last modified.
- **Link:** The public link to the shared chat.
- **Public:** Whether the chat is marked as public.
- **Password:** Whether the chat is password protected.
- **Views:** The number of times the shared link has been viewed.
- **Clones:** The number of times the shared chat has been cloned by other users.
- **Status:** The status of a shared link, which can be "Active", "Expired", or "Revoked".
- **Type:** The type of share, which can be "Snapshot" or "Live".

### Advanced Filtering and Sorting

The Shared Chats dashboard provides powerful tools to help you find and manage your shared links.

#### Filtering

You can filter your shared chats using the following criteria:

- **Search:** Use the search bar to find chats by their title.
- **Date Range:** Select a start and end date to filter chats shared within a specific period.
- **Visibility:** Filter by public or private status.
- **Password:** Filter by whether a chat is password-protected or not.
- **Status:** Filter by "Active", "Expired", or "Revoked" status.
- **Type:** Filter by "Snapshot" or "Live" share type.

#### Sorting

The list of shared chats is fully sortable. Click on any of the column headers to sort the list by that column. The available columns for sorting are:

- Title
- Created On
- Last Updated
- Link
- Visibility
- Password
- Views
- Clones
- Status
- Type

#### Pagination

If you have a large number of shared chats, the list will be paginated. You can navigate through the pages using the pagination controls at the bottom of the page.

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

- **Revoke All:** A danger zone action that revokes all of your shared links at once. This action cannot be undone and requires typing "REVOKE" to confirm.
- **Reset All Stats:** A danger zone action that resets the statistics for all of your shared chats. This action cannot be undone and requires typing "RESET" to confirm.
- **Clear Revoked:** A danger zone action that permanently removes all sharing information from your revoked chats. They will no longer appear on the Shared Chats dashboard and will revert to being normal, un-shared chats. This action cannot be undone and requires typing "CLEAR" to confirm.

## Troubleshooting Shared Links

If a viewer is unable to access a shared chat, they will be shown a page with one of the following specific error messages:

- **"Oops! The shared link you're trying to access doesn't exist. It might have been deleted or there might be a typo in the URL."** (`SHARE_LINK_NOT_FOUND`)
  - This appears if the share ID in the URL is incorrect, the original chat has been deleted, or the shared chat has been permanently deleted (e.g., by using the "Clear Revoked" action).
- **"The owner of this chat has revoked this sharing link."** (`SHARE_LINK_REVOKED`)
  - This appears if the owner has manually revoked the link from their dashboard or if it was revoked automatically (e.g., by reaching a clone limit).
- **"This shared link has expired and is no longer accessible."** (`SHARE_LINK_EXPIRED`)
  - This appears if the link has reached its expiration time or view limit.
- **A redirection to the login page.** (`LOGIN_REQUIRED`)
  - This happens if the chat is not public and the viewer is not logged into an Open WebUI account.
- **A password prompt.** (`PASSWORD_REQUIRED`)
  - If the chat is password-protected, viewers will be prompted to enter the password before they can see the content.

## The Viewer Experience

### What the Viewer Sees

When a user successfully accesses a shared link, they are presented with a clean, read-only version of the conversation.

- The interface displays the chat title and the original timestamp of the conversation.
- If the owner enabled **"Display Username"**, their name and profile picture will be shown.
- If the owner enabled **"Allow Cloning"** (and the clone limit has not been reached), a "Clone Chat" button will be visible at the bottom.
- For authenticated users, a "Chat Recipe" dropdown is available, showing the model(s) and any advanced parameters that were used in the conversation.

### Authenticated vs. Unauthenticated Viewers

The experience of viewing a shared chat can differ depending on whether the viewer is logged into an Open WebUI account.

#### Unauthenticated (Anonymous) Viewers

- **Access:** Can only view chats that are marked as "Public". If they try to access a non-public shared chat, they will be prompted to log in.
- **Cloning:** If they click the "Clone Chat" button, they will be redirected to the login page. After successfully logging in, they will be redirected back to the shared chat, and the chat will be automatically cloned to their account.
- **Owner Information:** Will not see the sharer's username and profile picture, even if the "Display Username" option was enabled.
- **Chat Recipe:** Will not see the "Chat Recipe" section.

#### Authenticated (Logged-In) Viewers

- **Access:** Can view both public and non-public shared chats (as long as they have the link).
- **Cloning:** Can clone a shared chat, provided that:
    1. They have the necessary permissions for cloning in their user role.
    2. The owner of the shared chat has enabled the "Allow Cloning" option for that specific chat and the clone limit has not been reached.
- **Owner Information:** Will see the sharer's username and profile picture, if the "Display Username" option was enabled for the shared chat.
- **Chat Recipe:** Can view the "Chat Recipe" to see the models and parameters used.

## Permissions and Public Chats

The ability to create public chats is a permission that can be controlled by the administrator of the Open WebUI instance.

### What Happens if Your Public Sharing Permission is Revoked?

If an administrator revokes your permission to create public chats (either by changing your user group's permissions or the default permissions for all users), the following will happen:

- **All your existing public chats will automatically be made private.** The `is_public` flag will be set to `False` for all your shared chats.
- **The share links will NOT be revoked.** They will remain active, but will now require viewers to be logged in to an Open WebUI account to access them (as they are no longer public).
- You will no longer be able to set the "Public" flag when sharing new chats or modifying existing ones.

This is a security measure to ensure that users who are no longer supposed to have public sharing capabilities do not have publicly accessible content.

## Administrator Configuration

Administrators of an Open WebUI instance can configure certain features and permissions using environment variables.

### Environment Variables

The following environment variables can be used to control the chat sharing functionality:

- `USER_PERMISSIONS_SHARING_PUBLIC_CHAT`: Set this to `true` to allow users to create public share links. If set to `false`, users will only be able to create private links that require authentication. This is equivalent to the "Enable Public Chat Sharing" permission in the admin panel.
- `USER_PERMISSIONS_CHAT_SHARE`: Set this to `false` to disable the chat sharing feature entirely. If disabled, users will not see the "Share" button in the chat interface.
- `ENABLE_COMMUNITY_SHARING`: Set this to `false` to disable the "Share to Open WebUI Community" feature. If disabled, the button will not be visible in the "Share Chat" modal.

## Automatic Revocation and Expiration

Shared links can be automatically revoked under several conditions:

- **Expiration by Time:** If you set an expiration time, the link will automatically become inaccessible after that time has passed.
- **Expiration by Views:** If you set a maximum number of views, the link will be automatically revoked as soon as the view count reaches that number. The view count is incremented each time someone views the link, with the exception of the chat's owner.
- **Expiration by Clones:** If you set a maximum number of clones and have not enabled "Allow viewing after clone limit", the link will be automatically revoked once the clone limit is reached.

## What Happens When You Share a Chat

- A unique public link is created for your chat. You can customize this link's ID.
- You can choose whether the shared chat is a **snapshot** or a **live** session.
  - **Snapshot:** A static copy of the conversation at the time of sharing. If you continue the conversation in the original chat, the shared version will not be updated.
  - **Live:** The shared version will update in real-time as you continue the conversation in the original chat.
- If you delete the original conversation from your history, the shared link will also be deleted and will no longer be accessible.

## What Happens When You Revoke a Link

- The public link becomes inactive, and anyone trying to access it will be notified that the chat is no longer available.
- Revoking a link does not delete the original chat from your history.
- You can restore a revoked link at any time from the Shared Chats dashboard.

## QR Code Generation

Open WebUI provides a convenient way to share your chats using QR codes. Here's how it works:

- **Client-Side Generation:** QR codes are generated directly in your browser. This means that the URL of your shared chat is not sent to any third-party service for QR code generation, ensuring your privacy.
- **Standard and Gradient QR Codes:** You can choose to generate a standard black and white QR code, or a visually appealing QR code with a gradient background.
- **How it Works:** The QR code is a graphical representation of the shared chat's URL. When you enable the "Show QR Code" option, the application generates a data URL for the QR code image, which is then displayed on the page.
- **Updating the QR Code:** The QR code is directly tied to the share link's URL. If you change the custom link ID, a new QR code will be generated. However, if you only change other settings like the password or expiration time, the URL remains the same, and so does the QR code.

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

**Note:** You can change the permission level of your shared chats on the community platform at any time from your `openwebui.com` account. Chats shared to the community platform **cannot be deleted** from within your Open WebUI instance; their access level can only be managed on `openwebui.com`.

**Currently, shared chats on the community website cannot be found through search.** Future updates are planned to allow public chats to be discoverable.

## Frequently Asked Questions (FAQ)

**❓ How long does it take for the “Expires in” timer to take effect?**

The expiration takes effect immediately on the backend. The moment a link is accessed, the system checks if it has expired. While the "Shared Chats" dashboard on the frontend checks for expired links every second to update their status, the authoritative check happens on the backend, ensuring that an expired link cannot be accessed even if the frontend hasn't updated yet.

**❓ Can I change the password of an already-shared link?**

Yes. You can change or even remove the password of an already-shared link. From the "Shared Chats" dashboard, find the link you want to modify, click on "Modify", and you will be able to set a new password or clear the existing one. To change or remove an existing password, you will be required to enter the current password for security.

**❓ What happens to the QR code when I edit the link settings?**

The QR code is generated based on the share link's URL (e.g., `/s/your-share-id`). If you change the custom link ID, the URL changes, and a new QR code will be generated. If you only change other settings like the password, expiration time, or public status, the share ID and the URL remain the same, so the QR code will not change.

**❓ What's the difference between a "Snapshot" and a "Live" share?**

A **Snapshot** share is a static, read-only copy of your conversation at the moment you create the link. Any further messages you add to the original chat will not appear in the shared version. This is useful for preserving a specific point in a conversation. A **Live** share creates a dynamic link where the conversation updates in real-time as you continue it. This is ideal for ongoing collaboration or for sharing a conversation as it unfolds.

**❓ What happens when a chat reaches its clone limit?**

If a **Max Number of Clones** is set, the behavior depends on the **"Allow viewing after clone limit"** setting.

- If this setting is **disabled** (the default), the share link will be automatically revoked and become inaccessible once the clone limit is reached.
- If this setting is **enabled**, the "Clone" button will disappear for viewers, but the chat will remain accessible for viewing.

**❓ Can I see who has viewed or cloned my chat?**

No. For privacy reasons, you can only see the total number of views and clones on the dashboard, not the specific users who have accessed your link.

**❓ What are the limits for custom links, views, and clones?**

- **Custom Link:** The custom part of the URL can be up to 144 characters long.
- **Views & Clones:** The maximum value for views or clones is 2,147,483,647 (the maximum value for a 32-bit signed integer).

**❓ I’m an admin – how do I see *all* shared chats on the instance?**

Currently, there is no built-in feature for an administrator to view a list of all shared chats from all users on the instance. The "Shared Chats" page only shows the chats shared by the currently logged-in user.

**❓ Is there an API to list my shared chats?**

Yes. You can get a list of your shared chats by making a `GET` request to the `/api/v1/chats/shared` endpoint. This will return a paginated list of your shared chats with their details.

## For Developers: API Endpoints

For developers looking to integrate with Open WebUI's chat sharing features, here are the primary API endpoints available:

### Sharing and Accessing Chats

- `POST /api/v1/chats/{id}/share`: Creates or updates a share link for a specific chat.
- `GET /api/v1/chats/share/{share_id}`: Retrieves the details of a shared chat.
- `POST /api/v1/chats/share/{share_id}/verify`: Verifies the password for a password-protected shared chat.
- `POST /api/v1/chats/{id}/clone/shared`: Clones a shared chat into the authenticated user's account.

### Managing Shared Chats

- `GET /api/v1/chats/shared`: Returns a paginated list of all shared chats for the authenticated user.
- `GET /api/v1/chats/shared/meta`: Returns metadata for all shared chats for the authenticated user.
- `DELETE /api/v1/chats/{id}/share`: Revokes a share link for a specific chat.
- `POST /api/v1/chats/{id}/share/restore`: Restores a revoked share link for a specific chat.
- `DELETE /api/v1/chats/shared/all`: Revokes all shared links for the authenticated user.
- `DELETE /api/v1/chats/shared/revoked`: Clears all revoked shared links from the dashboard view for the authenticated user.

### Statistics

- `POST /api/v1/chats/{id}/reset_stats`: Resets the "Views" and "Clones" counters for a specific shared chat back to zero.
- `POST /api/v1/chats/shared/all/reset_stats`: Resets the statistics for all of the authenticated user's shared chats.

For more detailed information on the request and response formats for these endpoints, please refer to the OpenAPI specification or the project's source code.

We hope this guide helps you make the most of the Shared Chats feature in Open WebUI! If you have any further questions, please refer to the main project documentation or join our community.
