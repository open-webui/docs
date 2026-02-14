---
slug: /features/chat-features/conversation-organization
sidebar_position: 4
title: "Folders & Projects"
---

# Folders & Projects

Open WebUI provides powerful folder-based organization that turns simple chat containers into full-featured **project workspaces**. Folders allow you to not only group related conversations but also define specific contexts, system prompts, and knowledge bases that apply to all chats within them.

## Enabling Folders

Folders are enabled by default. Administrators can control this feature via:

- **Admin Panel**: The folders feature is controlled globally alongside other features.
- **Environment Variable**: [`ENABLE_FOLDERS`](/getting-started/env-configuration#enable_folders) - Set to `True` (default) to enable or `False` to disable.

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
- **Right-click Menu**: Right-click on a conversation and select "Move to Folder".

### Nested Folders

Folders can be nested within other folders to create hierarchical organization:

- Drag a folder onto another folder to make it a subfolder.
- Use the right-click menu to move folders between parent folders.
- Folders can be expanded or collapsed to show/hide their contents.

### Starting a Chat in a Folder

When you click on a folder in the sidebar, it becomes your **active workspace**:

1. Click on any folder in the sidebar to select it.
2. The chat interface will show that folder is active.
3. Any new chat you start will automatically be created inside this folder.
4. New chats will **inherit the folder's settings** (system prompt and knowledge).

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
- System prompts are optional—you can use folders purely for organization without one.

:::info

The System Prompt field is only visible if you have permission to set system prompts (controlled by admin settings).

:::

### Attached Knowledge

Link **knowledge bases and files** to your folder:

- All attached files and knowledge bases are automatically included as **context** for every chat in the folder.
- This enables RAG (Retrieval Augmented Generation) for all folder conversations.
- Knowledge is optional—folders work for organization without any attached files.

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
5. **Start chatting** — every new conversation will have:
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
| [`ENABLE_FOLDERS`](/getting-started/env-configuration#enable_folders) | Enable/disable the folders feature globally (Default: `True`) |
| [`USER_PERMISSIONS_FEATURES_FOLDERS`](/getting-started/env-configuration#user_permissions_features_folders) | Control user-level access to the folders feature (Default: `True`) |
