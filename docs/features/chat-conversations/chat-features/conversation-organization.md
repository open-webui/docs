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

1. In the **sidebar**, click the **+ button** on the Folders section header.
2. Select **"New Folder"**.
3. Enter a name for your folder.
4. Click **Save**.

### Moving Conversations into Folders

Organize existing chats by moving them into folders:

- **Drag and Drop**: Click and drag any conversation from the sidebar into a folder.
- **Conversation menu**: Hover a conversation in the sidebar, click the three-dot menu that appears, then choose **Move** and pick the destination folder. The entry appears once at least one folder exists.

A folder highlights while you drag a chat over it when you are allowed to file the chat there, so you can see where the drop will land before you let go. A folder of your own always takes one. A folder [shared with you](#sharing-folders) takes one only with write access; with read-only access it does not highlight and does not accept the drop, so a move that would be refused anyway is never started.

### Nested Folders

Folders can be nested within other folders to create hierarchical organization:

- **Create subfolder from menu**: Click the three-dot menu on any folder and select **"Create Folder"** to create a new subfolder directly inside it.
- **Drag and drop**: Drag a folder onto another folder to make it a subfolder.
- **Export**: the same three-dot menu on a folder also has **Export**, which downloads the folder's chats. It needs the [Allow Chat Export](/features/authentication-access/rbac/permissions#3-chat-permissions) permission. There is no move entry. Folders are re-parented by drag and drop only.
- Folders can be expanded or collapsed to show/hide their contents.
- Subfolder names must be unique within the same parent folder. If a duplicate name is entered, a number is automatically appended (e.g., "Notes 1").

### Unread Badge

A folder shows a count of the chats inside it that you have not read yet or that are waiting for you to approve a tool call, next to its name in the sidebar.

- The count includes the folder's own chats and everything in its subfolders, so a collapsed parent still shows what is waiting below it.
- A chat counts as unread when it has changed since you last opened it. Archived chats never count, and a chat whose reply is still being generated is not counted until the response has finished. A chat paused on a tool approval counts once, straight away.
- Opening a chat clears it from the count immediately, in every window you have open: the server recalculates your folder counts on the spot and pushes them to your other sessions rather than waiting for the next reload.
- Unread state is about your own reading. Shared folders carry no badge, and chats belonging to someone else never show as unread to you, however recently they were touched.
- A title generated automatically for a chat does not make it unread again.

The folder's page marks the same state per chat: a dot for an unread conversation, a spinner for one whose answer is still streaming and a yellow dot for one waiting for approval. The page keeps itself current while you look at it, so a chat that starts or finishes generating updates in place, a chat that arrives in the folder is inserted without a full reload and the page reloads after a dropped connection is restored. Opening a chat from the page clears its dot immediately, without waiting for the chat to load. See [The Folder Page](#the-folder-page) for sorting, grouping and filtering by activity.

#### Marking Read and Unread

- **Mark a chat unread**: open a chat's three-dot menu in the sidebar and choose **Mark as unread**. The chat gets its dot back, moves up with the other unread chats, and the folder count goes up again. Use it to keep a conversation on your radar after skimming it.
- **Mark a folder read**: open a folder's three-dot menu and choose **Mark all as read**. On a folder you own this clears your unread chats in that folder and everything nested under it; on a folder shared with you it clears only that folder, and only your own chats in it. Archived chats are left alone.
- **Mark everything read**: the **Chats** section header in the sidebar has its own menu with **Mark all as read**, which clears every unread chat you own, loose chats and chats in folders alike, and zeroes all the folder badges at once. Archived chats are again left alone.

### Starting a Chat in a Folder

When you click on a folder in the sidebar, it becomes your **active workspace**:

1. Click on any folder in the sidebar to select it.
2. The chat interface will show that folder is active.
3. Any new chat you start will automatically be created inside this folder.
4. New chats will **inherit the folder's settings** (default model, default terminal, working directory, system prompt and knowledge).

A folder's three-dot menu also has **New Chat**, which opens the folder the same way.

Each folder in the sidebar is a link to its own page, so a middle click or Ctrl/Cmd click opens the folder in a new tab.

Moving a chat into a folder requires **write access** to it. That means the folder is yours, or it is shared with you with write access, either directly or through a folder above it. Read-only access on a shared folder lets you open it and read the chats in it, but sending the first message of a new chat there is refused instead of quietly moving the chat into the folder.

The check is the same in all three places a chat is given a folder: creating a chat through the API, moving an existing chat into a folder, and sending the first message of a chat started inside one. Naming a folder that does not exist is refused the same way as naming one you cannot write to.

## The Folder Page

Click a folder in the sidebar and its page shows every chat in it, laid out like a small project tracker. It suits folders that collect more than a handful of conversations, such as a research project, a queue of requests or a weekly report, where you want to see what is finished, what is waiting and what needs your attention. In a folder shared with you the page works the same way; what you can change depends on your access.

### List and Board

Open **Display options** (the sliders icon beside search and filter) to pick a **Layout**.

- **List** shows one row per chat. **Grouping** splits it into collapsible groups by **Status**, **Tags** or **Activity**, or leaves it as one list with **None**. Empty groups stay hidden until you turn on **Show empty groups**.
- **Board** shows each chat as a card. **Columns** picks **Status**, **Tags** or **Activity** for the columns, and **Rows** adds horizontal lanes from one of the other two. With statuses as columns the board works like a kanban view.

**Ordering** sorts by **Updated** or **Title**, ascending or descending. Your layout, grouping, columns, rows and ordering are remembered in your browser, while filters start empty on every visit.

**Activity** tells you what a chat is doing right now: **Unread** (changed since you last opened it), **Generating**, **Waiting for approval** (paused on a tool approval) and **Read**. Rows and cards mark the first three with a dot or spinner, so a chat that needs you stands out.

### Searching and Filtering

The search icon, or the `/` key, opens a search box that matches chat titles and message text. The filter icon, or the `f` key, opens a menu with **Status**, **Tags**, **Users**, **Activity** and **Updated** (**Today**, **Last 7 days** or **Last 30 days**). Status, tags and users accept several values at once, and the tag list includes **Untagged** for chats without tags. Active filters show as chips above the list, and **Clear filters** removes them. Pressing `c` jumps into the message box to start a new chat in the folder.

### Statuses

A status says where a chat stands, for example **In progress** or **Done**. Every folder starts with **Backlog**, **To do**, **In progress**, **Waiting** and **Done**, and chats without a status show as **No status**.

Click the status icon at the start of a chat to pick a status, or drag its card to another column or lane on a board that uses statuses. The chat's owner can always set its status. In a shared folder, anyone who can edit the folder can set the status of every chat in it. Next to the status, each chat that has one shows how long it has been there, such as **3d**. Hover it to see when this stretch began and how long the chat spent in other statuses. Earlier time spent in the same status counts toward it.

Anyone who can edit the folder can change its statuses with **Edit statuses…** at the bottom of the status menu, or **Add status** at the end of a status board. The **Statuses** dialog changes the name (up to 40 characters, unique within the folder), the icon (a built-in shape or **Use emoji…**), the color, and the order by dragging. It also adds and deletes statuses. Chats in a deleted status go back to **No status**.

### Tags

Tags label chats by topic and feed the grouping, board and filter options above. A chat's owner adds them with the **Tag** button that appears on hover in the chat's row (or by clicking its existing tags), or from the **Tags** submenu in the chat's top-bar menu. Both open the same picker: type to find a tag and tick it to add or remove it. To make a new one, choose **Create “name”**. The colored dot beside a ticked tag opens the color choices, and the color applies to that tag wherever it is used. Chats made by someone else show their tags without the picker.

### Automations

The page header has a **Chats** and **Automations** switch for users who have the [Automations](/features/chat-conversations/chat-features/automations) feature. It lists the folder's automations and has a **New automation** button; see [Folders](/features/chat-conversations/chat-features/automations#folders) on the Automations page for who can do what.

### Renaming from the Tab

Double-click the folder's tab at the top to rename the folder. This needs edit access to the folder.

## Folder Settings (Project Configuration)

Folders can be configured as full project workspaces with their own AI behavior and context. To edit folder settings:

1. Hover over a folder in the sidebar.
2. Click the **three-dot menu** (⋯).
3. Select **"Edit"** to open the folder settings modal.

On desktop, resting the pointer on a folder's name in the sidebar shows a preview of the folder: its number of chats, its default model and how many knowledge items are attached, plus the owner's name for a folder shared with you. With write access, the preview also has an **Edit Folder** button that opens the same settings.

![The hover preview of the shared Product Launch folder: 5 chats, shared by Alex Chen, the Team Assistant default model, two knowledge items and an Edit Folder button](/images/features/chat/folder-hover-preview.webp)

### Folder Name

Change the name of your folder to better reflect its purpose or project.

### Description

Add a short note on what the folder is for. It shows under the folder's name on the folder's page, cut off after two lines.

### Folder Background Image

Customize the visual appearance of your folder by uploading a background image. This helps visually distinguish different projects in your workspace.

### Default Model

Pick the model new chats in this folder start with, or leave it on **Use default** to fall back to your usual default. Switching models inside one of the folder's chats leaves the folder's default as it is; change it here.

### Default Terminal and Working Directory

Under **Advanced**, **Default terminal** picks the terminal new chats in this folder start with. Once one is picked, **Working directory** sets the path on that terminal where those chats start; leave it empty to use the terminal's own default. Its folder button browses the terminal's directories, where you can also [clone a Git repository](/features/open-terminal/file-browser#cloning-a-repository) into a new folder. With a default terminal picked, **Default Model** also offers that terminal's [coding agents](/features/open-terminal/coding-agents). These settings apply to new chats only.

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
- With **Native** function calling, the model gets a list of the folder's knowledge and reads it with the **Knowledge Base** [builtin tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode), whether **Preload files** is on or off. With **Legacy** function calling, it is retrieved and injected through RAG (Retrieval Augmented Generation) while **Preload files** is on.
- Knowledge is optional. Folders work for organization without any attached files.
- **Attaching a folder to another chat.** Folders are listed in the `#` menu, and you can also drag one from the sidebar into the message input. This attaches the files and knowledge bases linked to the folder, and only while **Preload files** is on. With Preload files off, attach the folder's knowledge bases and files with `#` directly, or start the chat inside the folder.

**Whose access decides what is attached.** Attaching needs both your access and the **folder owner's**; every chat in the folder then follows the owner's access:

- Attaching a file, collection or note to a folder requires both the person attaching it and the owner to be able to read it. So someone with write access to a shared folder cannot attach documents into it that its owner could not open themselves, including their own private ones, nor documents they cannot open themselves. The same check applies to a subfolder created inside a shared folder, which belongs to the parent's owner.
- Every chat in the folder re-checks the attachments against the owner's current access before using them. If the owner loses access to a knowledge base after attaching it, it stops being used in the folder's chats.
- Entries that are not a file, collection or note, or that carry no ID, are ignored.

## Sharing Folders

Share a folder, and the chats inside it, with specific users or groups so a team can work from the same set of conversations.

Sharing a folder needs the **Folders Sharing** permission, which is off by default. An administrator turns it on under **Admin Panel > Users > Groups** or with [`USER_PERMISSIONS_FOLDERS_ALLOW_SHARING`](/reference/env-configuration#user_permissions_folders_allow_sharing).

1. Open the **three-dot menu** (⋯) of the folder, either in the sidebar or on the folder page, and select **Share**. This opens the folder's **Access** dialog. The entry shows for admins and for the folder's owner when the owner has the **Folders Sharing** permission. The **Access** button at the top of the **Edit Folder** dialog opens the same dialog.
2. Add the users or groups to share with. Each one starts on **Write**; switch it to **Read** in their row of the **Access List** where needed:
   - **Read**: they can open the folder and read its chats. They cannot start a chat in it or move one into it, and dragging a chat over it in the sidebar does not offer it as a drop target.
   - **Write**: they can also rename the folder, start chats in it, move their own chats into it and create subfolders inside it. It highlights and takes the chat when they drag one onto it in the sidebar.
3. Pick the **Sharing mode**. You can set it before anyone has access, so the folder is ready when you add people:
   - **Clone only** (default): people you shared with read the folder's chats and clone one to continue it on their own.
   - **Allow replies**: everyone with access to the folder, read or write, can send messages into the chats directly in it, which then work like a [shared chat with replies](/features/chat-conversations/chat-features/chatshare#allowing-replies). Chats in a subfolder follow that subfolder's own sharing mode, which you set in the subfolder's own **Access** dialog; until then they open read-only.

Each change applies as soon as you make it.


Only the folder's owner or an admin can change who a folder is shared with and its sharing mode. People with write access do not get the **Access** button in the **Edit Folder** dialog.

The **Add Access** picker lists only the people and groups the folder is not already shared with, so you cannot add the same person twice and the list shrinks as you go. To move someone between **Read** and **Write**, or to drop them entirely, use their row in the **Access List** instead.

Shared folders appear in the recipient's sidebar. A few rules to know:

- **Subfolders inherit the share.** Access granted on a folder cascades to everything nested inside it. When someone has inherited **Write** on a subfolder and a direct **Read** grant on it too, **Write** applies. The sharing mode applies per folder, so replying in a subfolder's chats needs **Allow replies** on that subfolder.
- **Someone else's chat opens under their name.** In a folder set to **Clone only** it is read-only; with **Allow replies** on, it opens with the message input and you can write into it. Each message carries the name and profile picture of the person who sent it, both in the conversation and on the message nodes in the **Overview** window. In the bubble layout, messages from other people sit on the left with their name and picture, and your own sit on the right; with **Chat Bubble UI** off in **Settings > Interface**, every message shows its sender's name and picture.
- **The folder's owner can tidy up other people's chats.** In a folder you own, you can rename chats other people started (title only) and move them to other folders in the same shared tree.
- **Edit and regenerate together.** With **Allow replies** on, people with access can edit any prompt into a new branch and regenerate any reply, the same as in a [shared chat with replies](/features/chat-conversations/chat-features/chatshare#allowing-replies). The chat's top bar shows who else has it open right now.
- **Each chat shows who wrote in it.** In a shared folder, every chat in the sidebar and on the folder's page shows the profile pictures of the people who wrote in it, the chat's owner first. Up to three pictures show, followed by a count such as **+2**; click the count to see everyone. Hover or click a picture to open that person's profile card.
- **Chats in a shared folder can be attached as context.** Drag one from the sidebar into the message input of another chat and the model receives that conversation's messages, the same as for a chat you own. Read access on the folder, whether granted on it directly or inherited from a folder above it, is enough.
- **Archiving a chat takes it out of the folder.** People who could see it only through the folder lose access.
- **Only the owner or an admin can delete a shared root folder.** People with write access can add and edit chats and subfolders.
- **Write access covers the folder page.** People with write access can set the status of every chat in the folder and change the folder's statuses, and people with read access can see the statuses. See [The Folder Page](#the-folder-page).
- **Automations can post into a shared folder.** Anyone with write access can create one there, and everyone who can write to the folder can pause it. See [Folders](/features/chat-conversations/chat-features/automations#folders) on the Automations page.
- **Clone a chat to continue it yourself.** In a folder set to **Clone only**, use **Clone Chat** or **Fork chat** to continue a chat in your own chats; see [Cloning or Forking a Shared Chat](/features/chat-conversations/chat-features/chatshare#cloning-or-forking-a-shared-chat).
- **Folders cannot be shared publicly**, by admins either. Sharing is always to specific users or groups.

![A shared folder in the sidebar where each chat shows the pictures of the people who wrote in it. The Launch checklist chat shows three pictures followed by +2](/images/features/chat/shared-folder-chat-writers.webp)

![The profile card of Sam Patel, opened from their picture on a chat in the shared folder, with their status, when they were last active and a Message button](/images/features/chat/shared-folder-writer-profile-card.webp)

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
- **Searching by Tags**: Type `tag:<name>` in the search window to list your chats with that tag, or `tag:none` for chats without tags. See [Filtering results](/features/chat-conversations/chat-features/history-search#filtering-results).
- **Flexible Organization**: Tags can be added or removed at any time and don't affect folder structure.
- **Colors and folder views**: A tag can have a color, and a folder's page can group, filter and lay out its chats by tag. See [Tags](#tags) on the folder page.
- **Automatic Tags**: A task model can tag your chats for you. Turn this off for yourself with **Chat Tags Auto-Generation** in **Settings > Interface**. The switch shows only while the admin has **Tags Generation** on.

:::tip **Tagging by Topic**

If you frequently discuss topics like "marketing" or "development," tag conversations with these terms. When you search for a specific tag, all relevant conversations are quickly accessible regardless of which folder they're in.

:::

## Related Configuration

| Setting | Description |
|---------|-------------|
| [`ENABLE_FOLDERS`](/reference/env-configuration#enable_folders) | Enable/disable the folders feature globally (Default: `True`) |
| [`USER_PERMISSIONS_FEATURES_FOLDERS`](/reference/env-configuration#user_permissions_features_folders) | Control user-level access to the folders feature (Default: `True`) |
| [`USER_PERMISSIONS_FOLDERS_ALLOW_SHARING`](/reference/env-configuration#user_permissions_folders_allow_sharing) | Allow users to share folders with specific users or groups (Default: `False`) |
