---
sidebar_position: 4
title: "Folders & Projects"
---

# Folders & Projects

Open WebUI provides powerful folder-based organization that turns simple chat containers into full-featured **project workspaces**. Folders allow you to not only group related conversations but also define specific contexts, system prompts, and knowledge bases that apply to all chats within them.

## Enabling Folders

Folders are enabled by default. Administrators can control this feature via:

- **Admin Panel**: The folders feature is controlled globally alongside other features.
- **Environment Variable**: [`ENABLE_FOLDERS`](/reference/env-configuration#enable_folders). Set to `True` (default) to enable or `False` to disable.

## Core Features

### Creating Folders

Create a new folder to organize your conversations:

1. In the **sidebar**, click the **+ button** next to "Chats" or right-click in the chat list.
2. Select **"New Folder"**.
3. Enter a name for your folder.
4. Click **Save**.

### Moving Conversations into Folders

Organize existing chats by moving them into folders:

- **Drag and Drop**: Click and drag any conversation from the sidebar into a folder.
- **Right-click Menu**: Right-click on a conversation, open **Move** and pick the destination folder. The entry appears once at least one folder exists.

A folder highlights while you drag a chat over it when you are allowed to file the chat there, so you can see where the drop will land before you let go. A folder of your own always takes one. A folder [shared with you](#sharing-folders) takes one only with write access; with read-only access it does not highlight and does not accept the drop, so a move that would be refused anyway is never started.

### Nested Folders

Folders can be nested within other folders to create hierarchical organization:

- **Create subfolder from menu**: Right-click (or click the three-dot menu ⋯) on any folder and select **"Create Folder"** to create a new subfolder directly inside it.
- **Drag and drop**: Drag a folder onto another folder to make it a subfolder.
- **Move via context menu**: Right-click on a folder and use the move option to relocate it under a different parent.
- Folders can be expanded or collapsed to show/hide their contents.
- Subfolder names must be unique within the same parent folder. If a duplicate name is entered, a number is automatically appended (e.g., "Notes 1").

### Unread Badge

A folder shows a count of the chats inside it you have not read yet, next to its name in the sidebar.

- The count includes the folder's own chats and everything in its subfolders, so a collapsed parent still shows what is waiting below it.
- A chat counts as unread when it has changed since you last opened it. Archived chats never count, and a chat whose reply is still being generated is not counted until the response has finished.
- Opening a chat clears it from the count immediately, in every window you have open: the server recalculates your folder counts on the spot and pushes them to your other sessions rather than waiting for the next reload.
- Unread state is about your own reading. Shared folders carry no badge, and chats belonging to someone else never show as unread to you, however recently they were touched.
- A title generated automatically for a chat does not make it unread again.

The folder's chat list marks the same state per chat: a dot for an unread conversation, and a spinner for one whose answer is still streaming. Unread chats are listed first, each group ordered by recent activity, so what is waiting for you sits at the top of the folder rather than wherever its timestamp puts it. The list keeps itself current while you look at it — a chat that starts or finishes generating updates in place and re-sorts, a chat that arrives in the folder is inserted rather than triggering a full reload, and the list reloads after a dropped connection is restored. Opening a chat from this list clears its dot immediately, without waiting for the chat to load.

#### Marking Read and Unread

- **Mark a chat unread**: open a chat's three-dot menu in the sidebar and choose **Mark as unread**. The chat gets its dot back, moves up with the other unread chats, and the folder count goes up again. Use it to keep a conversation on your radar after skimming it.
- **Mark a folder read**: open a folder's three-dot menu and choose **Mark all as read**. On a folder you own this clears your unread chats in that folder and everything nested under it; on a folder shared with you it clears only that folder, and only your own chats in it. Archived chats are left alone.
- **Mark everything read**: the **Chats** section header in the sidebar has its own menu with **Mark all as read**, which clears every unread chat you own — loose chats and chats in folders alike — and zeroes all the folder badges at once. Archived chats are again left alone.

### Starting a Chat in a Folder

When you click on a folder in the sidebar, it becomes your **active workspace**:

1. Click on any folder in the sidebar to select it.
2. The chat interface will show that folder is active.
3. Any new chat you start will automatically be created inside this folder.
4. New chats will **inherit the folder's settings** (system prompt and knowledge).

Filing a chat into a folder requires **write access** to it. That means the folder is yours, or it is shared with you with write access, either directly or through a folder above it. Read-only access on a shared folder lets you open it and read the chats in it, but sending the first message of a new chat there is refused instead of quietly filing the chat in the folder.

The check is the same in all three places a chat is given a folder: creating a chat through the API, moving an existing chat into a folder, and sending the first message of a chat started inside one. Naming a folder that does not exist is refused the same way as naming one you cannot write to.

When a move is refused, the error notification carries the message the server sent rather than an `[object Object]` placeholder, so the reason is readable. This holds wherever the move was started: the chat's **Move** menu, the search dialog, the chat view and drag and drop.

## Folder Settings (Project Configuration)

Folders can be configured as full project workspaces with their own AI behavior and context. To edit folder settings:

1. Hover over a folder in the sidebar.
2. Click the **three-dot menu** (⋯).
3. Select **"Edit"** to open the folder settings modal.

### Folder Name

Change the name of your folder to better reflect its purpose or project.

### Folder Background Image

Customize the visual appearance of your folder by uploading a background image. This helps visually distinguish different projects in your workspace.

### System Prompt

Assign a dedicated **System Prompt** to the folder that automatically applies to all conversations within it:

- The system prompt is **prepended to every new conversation** created in the folder.
- This tailors the AI's behavior for specific tasks or personas.
- System prompts are optional. You can use folders purely for organization without one.

:::info

The System Prompt field is only visible if you have permission to set system prompts (controlled by admin settings).

:::

### Attached Knowledge

Link **knowledge bases and files** to your folder:

- All attached files and knowledge bases are automatically included as **context** for every chat in the folder.
- This enables RAG (Retrieval Augmented Generation) for all folder conversations.
- Knowledge is optional. Folders work for organization without any attached files.

**Whose access decides what is attached.** A folder's knowledge is measured against the **folder owner**, not against whoever is editing or reading it:

- Attaching a file, collection or note to a folder requires the owner to be able to read it. So someone with write access to a shared folder cannot attach documents into it that its owner could not open themselves — including their own private ones. The same check applies to a subfolder created inside a shared folder, which belongs to the parent's owner.
- Every chat in the folder re-checks the attachments against the owner's current access before using them. If the owner loses access to a knowledge base after attaching it, it stops being fed into the folder's chats, rather than continuing to serve content through the folder to everyone who can see it.
- Entries that are not a file, collection or note, or that carry no ID, are ignored rather than passed through, since there is nothing to check them against.

## Sharing Folders

Share a folder, and the chats inside it, with specific users or groups so a team can work from the same set of conversations.

1. Hover over a folder in the sidebar and open the **three-dot menu** (⋯).
2. Select **Share**.
3. Add the users or groups to share with and choose their access:
   - **Read**: they can open the folder and read its chats. They cannot start a chat in it or move one into it, and dragging a chat over it in the sidebar does not offer it as a drop target.
   - **Write**: they can also rename the folder, start chats in it, move their own chats into it and create subfolders inside it. It highlights and takes the chat when they drag one onto it in the sidebar.
4. Save.

The **Add Access** picker lists only the people and groups the folder is not already shared with, so you cannot add the same person twice and the list shrinks as you go. To move someone between **Read** and **Write**, or to drop them entirely, use their row in the **Access List** instead.

Shared folders appear in the recipient's sidebar. A few rules to know:

- **Subfolders inherit the share.** Access granted on a folder cascades to everything nested inside it.
- **Someone else's chat opens read-only, under their name.** Their messages carry their name and profile picture, both in the conversation and on the message nodes in the **Overview** panel. The name and picture beside a message appear only when **Chat Bubble UI** is off in **Settings > Interface**; the bubble layout shows neither, whoever wrote the message.
- **Chats in a shared folder can be attached as context.** Drag one from the sidebar into the message input of another chat and the model receives that conversation's messages, the same as for a chat you own. Read access on the folder, whether granted on it directly or inherited from a folder above it, is enough.
- **Only the owner or an admin can delete a shared root folder** or change who it is shared with. People with write access can add and edit chats and subfolders, but cannot remove the shared folder itself.
- **Folders cannot be shared publicly.** Sharing is always to specific users or groups, with no public link.

Folder sharing is gated by the **Folders Sharing** permission, which is off by default. An administrator enables it per group under **Admin Panel > Users > Groups > Permissions**, or sets the default with [`USER_PERMISSIONS_FOLDERS_ALLOW_SHARING`](/reference/env-configuration#user_permissions_folders_allow_sharing).

## Example Use Case

:::tip **Creating a "Python Expert" Project**

Imagine you're working on a Python development project:

1. **Create a folder** named "Python Expert".
2. **Edit the folder** and set the System Prompt:
   ```
   You are an expert Python developer. You provide clean, efficient, and well-documented code. When asked for code, prioritize clarity and adherence to PEP 8 standards.
   ```
3. **Attach Knowledge** by linking your project's technical specification PDF or library documentation.
4. **Click on the folder** to select it as your active workspace.
5. **Start chatting**: every new conversation will have:
   - The expert Python persona
   - Access to your project documents
   - Automatic organization in the folder

:::

## Tags (Complementary Organization)

In addition to folders, **tags** provide a flexible labeling system for conversations:

- **Adding Tags**: Apply keyword labels to conversations based on content or purpose.
- **Searching by Tags**: Filter conversations by tags using the search feature.
- **Flexible Organization**: Tags can be added or removed at any time and don't affect folder structure.

:::tip **Tagging by Topic**

If you frequently discuss topics like "marketing" or "development," tag conversations with these terms. When you search for a specific tag, all relevant conversations are quickly accessible regardless of which folder they're in.

:::

## Related Configuration

| Setting | Description |
|---------|-------------|
| [`ENABLE_FOLDERS`](/reference/env-configuration#enable_folders) | Enable/disable the folders feature globally (Default: `True`) |
| [`USER_PERMISSIONS_FEATURES_FOLDERS`](/reference/env-configuration#user_permissions_features_folders) | Control user-level access to the folders feature (Default: `True`) |
| [`USER_PERMISSIONS_FOLDERS_ALLOW_SHARING`](/reference/env-configuration#user_permissions_folders_allow_sharing) | Allow users to share folders with specific users or groups (Default: `False`) |
