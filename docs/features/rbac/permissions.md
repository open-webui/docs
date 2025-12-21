---
sidebar_position: 3
title: "Permissions"
---


The `Permissions` section of the `Workspace` within Open WebUI allows administrators to configure access controls and feature availability for users. This powerful system enables fine-grained control over what users can access and modify within the application.

Administrators can manage permissions in three primary ways:
1.  **Global Default Permissions:** Set the baseline permissions for all user accounts via the Admin Panel.
2.  **Group Permissions:** Create groups with specific permission overrides (e.g., a "Power Users" group with access to image generation).
3.  **Role-Based Access:** The `Pending` role has no access, `Admin` has full access, and `User` is subject to the permission system.

:::info Permission Logic
Permissions in Open WebUI are **additive**.
*   A user's effective permissions are the combination of **Global Defaults** and all their **Group Memberships**.
*   **True takes precedence over False**: If *any* source (Global Default or *any* single Group) grants a permission, the user **will** have that permission.
*   **No "Deny" ability**: You cannot use a specific group to "take away" a permission that is granted by another group or by the global defaults. To restrict a feature, it must be disabled in the Global Defaults *and* disabled in **all** groups the user belongs to.
:::

:::tip Best Practice: Principle of Least Privilege
Since permissions are **additive**, the recommended security strategy is to start with **Restriction**:
1.  **minimize Global Default Permissions**: Configure the default permissions (Admin > Settings > Users) to include *only* what absolutely every user should have.
2.  **Grant via Groups**: Create specific groups (e.g., "Creators", "Power Users") to explicitly **grant** advanced features like Image Generation or File Uploads.

This approach ensures that new users don't accidentally get access to sensitive features, while allowing you to easily promote users by simply adding them to the relevant group.
:::

## Permission Categories

Permissions are organized into four main categories: **Workspace**, **Sharing**, **Chat**, and **Features**.

### 1. Workspace Permissions
Controls access to the "Workspace" section where users create and manage resources.
Some permissions are **dependent** on others (e.g., you cannot import models if you cannot access the Models workspace).

| Permission | Description |
| :--- | :--- |
| **Models Access** | **(Parent)** Access the **Models** workspace to create or edit custom models. |
| **Models Import** | *(Requires Models Access)* Ability to import models from JSON/files. |
| **Models Export** | *(Requires Models Access)* Ability to export models to files. |
| **Knowledge Access** | Access the **Knowledge** workspace to manage knowledge bases. |
| **Prompts Access** | **(Parent)** Access the **Prompts** workspace to manage custom system prompts. |
| **Prompts Import** | *(Requires Prompts Access)* Ability to import prompts. |
| **Prompts Export** | *(Requires Prompts Access)* Ability to export prompts. |
| **Tools Access** | **(Parent)** Access the **Tools** workspace to manage functions/tools. |
| **Tools Import** | *(Requires Tools Access)* Ability to import tools. |
| **Tools Export** | *(Requires Tools Access)* Ability to export tools. |

### 2. Sharing Permissions
Controls what users can share with the community or make public.

| Permission | Description |
| :--- | :--- |
| **Share Models** | **(Parent)** Ability to share models (make them accessible to others). |
| **Public Models** | *(Requires Share Models)* Ability to make models publicly discoverable. |
| **Share Knowledge** | **(Parent)** Ability to share knowledge bases. |
| **Public Knowledge** | *(Requires Share Knowledge)* Ability to make knowledge bases public. |
| **Share Prompts** | **(Parent)** Ability to share prompts. |
| **Public Prompts** | *(Requires Share Prompts)* Ability to make prompts public. |
| **Share Tools** | **(Parent)** Ability to share tools. |
| **Public Tools** | *(Requires Share Tools)* Ability to make tools public. |
| **Share Notes** | **(Parent)** Ability to share Notes. |
| **Public Notes** | *(Requires Share Notes)* Ability to make Notes public. |

### 3. Chat Permissions
Controls the features available to the user inside the chat interface.

| Permission | Description |
| :--- | :--- |
| **Chat Controls** | **(Parent)** Access to advanced chat settings. Required for Valves, System Prompt, and Parameters. |
| **Model Valves** | *(Requires Chat Controls)* Access to model-specific configuration "valves". |
| **System Prompt** | *(Requires Chat Controls)* Ability to edit the system prompt for a conversation. |
| **Parameters** | *(Requires Chat Controls)* Ability to adjust LLM parameters (e.g., temperature, top_k). |
| **File Upload** | Ability to upload files to the chat. |
| **Delete Chat** | Ability to delete entire chat conversations. |
| **Delete Message** | Ability to delete individual messages. |
| **Edit Message** | Ability to edit messages. |
| **Continue Response** | Ability to use the "Continue" feature for truncated responses. |
| **Regenerate Response**| Ability to regenerate an AI response. |
| **Rate Response** | Ability to thumbs up/down responses. |
| **Share Chat** | Ability to generate a share link for a chat. |
| **Export Chat** | Ability to export chat history. |
| **Speech-to-Text (STT)**| Ability to use voice input. |
| **Text-to-Speech (TTS)**| Ability to use voice output. |
| **Audio Call** | Ability to use the real-time audio call feature. |
| **Multiple Models** | Ability to select multiple models for a simultaneous response. |
| **Temporary Chat** | **(Parent)** Ability to toggle "Temporary Chat" (incognito mode/history off). **Note:** Backend document parsing is disabled in this mode for privacy. |
| **Enforced Temporary** | *(Requires Temporary Chat)* **Restricts** the user to *always* use temporary chat (history disabled). |

### 4. Features Permissions
Controls access to broad platform capabilities.

| Permission | Description |
| :--- | :--- |
| **API Keys** | Ability to generate Personal Access Tokens (API Keys) in User Settings. |
| **Notes** | Access to the "Notes" feature. |
| **Channels** | Access to the "Channels" feature. |
| **Folders** | Ability to use folders for organizing chats. |
| **Web Search** | Ability to use Web Search integration. |
| **Image Generation** | Ability to use Image Generation tools. |
| **Code Interpreter** | Ability to use the Python Code Interpreter. |
| **Direct Tool Servers** | Ability to connect to custom Tool Servers in settings. |

:::warning API Keys Security & Admin Access
The **API Keys** permission (`features.api_keys`) is treated with higher security and works differently than other features:

1.  **Global Toggle Required**: 
    The feature must be enabled globally in **Admin Settings > General > Enable API Keys**. If this is off, *no one* (not even groups with permission) can generate keys.

2.  **Permission Check Required**: 
    In addition to the global toggle, the user must look for the permission `features.api_keys`.

3.  **Admins Are Not Exempt**: 
    Unlike most other permissions which Admins bypass, **Administrators require this permission** to generate API keys. They are subject to the same checks as regular users for this critical security feature.

**Recommended "Least Privilege" Configuration**:
*   **Step 1**: Disable `API Keys` in **Global Default Permissions** (so new users don't get it by default).
*   **Step 2**: Create a specific Group (e.g., `🔐 API Users`) with `API Keys` enabled.
*   **Step 3**: Manually add specific users—including yourself/Admins—to this group to grant access.
:::

## Managing Permissions

Administrators can adjust these permissions through the **Admin Panel > Settings > Users > Permissions**.

*   **Default Permissions**: Changing settings here applies to all users immediately, unless they are granted the permission via a Group.
*   **Group Permissions**: Go to **Admin Panel > Groups**, verify a group, and edit its permissions. Group permissions override the default (e.g., if "Image Generation" is disabled by default, a "Creative User" group can have it enabled).

### Environment Variables

While the UI is the recommended way to manage permissions, initial defaults can be set via environment variables. These are typically prefixed with `USER_PERMISSIONS_`.
*   `ENABLE_IMAGE_GENERATION=True`
*   `ENABLE_WEB_SEARCH=True`
*   `USER_PERMISSIONS_CHAT_FILE_UPLOAD=True`

See the [Environment Configuration](../../getting-started/env-configuration.mdx) guide for a complete list of valid variables.
