---
sidebar_position: 3
title: "Permissions"
---


Open WebUI provides a flexible permissions system that allows administrators to configure access controls and feature availability for users. This enables fine-grained control over what users can access and modify within the application.

Administrators can manage permissions in two primary ways:
1.  **Default Permissions:** Set the baseline permissions that apply to all users (including admins) via **Admin Panel > Users > Groups > Default Permissions**.
2.  **Group Permissions:** Create groups with specific permission overrides via **Admin Panel > Users > Groups** (e.g., a "Power Users" group with access to image generation).

Users with the `Pending` role have no access until approved, `Admin` users have full administrative access, and `User` accounts are subject to the permission system described below.

:::info Permission Logic
Permissions in Open WebUI are **additive**.
*   A user's effective permissions are the combination of **Global Defaults** and all their **Group Memberships**.
*   **True takes precedence over False**: If *any* source (Global Default or *any* single Group) grants a permission, the user **will** have that permission.
*   **No "Deny" ability**: You cannot use a specific group to "take away" a permission that is granted by another group or by the global defaults. To restrict a feature, it must be disabled in the Global Defaults *and* disabled in **all** groups the user belongs to.
:::

:::tip Best Practice: Principle of Least Privilege
Since permissions are **additive**, the recommended security strategy is to start with **Restriction**:
1.  **minimize Global Default Permissions**: Configure the default permissions (**Admin Panel > Users > Groups > Default Permissions**) to include *only* what absolutely every user should have.
2.  **Grant via Groups**: Create specific groups (e.g., "Creators", "Power Users") to explicitly **grant** advanced features like Image Generation or File Uploads.

This approach ensures that new users don't accidentally get access to sensitive features, while allowing you to easily promote users by simply adding them to the relevant group.
:::

## Permission Categories

Permissions are organized into five main categories: **Workspace**, **Sharing**, **Chat**, **Features**, and **Settings**.

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
| **Skills Access** | Access the **Skills** workspace to create and manage reusable instruction sets. |

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
| **Share Skills** | **(Parent)** Ability to share skills. |
| **Public Skills** | *(Requires Share Skills)* Ability to make skills public. |
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
| **Memories** | Access to the Memories feature for persistent user context. |

### 5. Settings Permissions
Controls access to user settings areas.

| Permission | Description |
| :--- | :--- |
| **Interface Settings Access** | Ability to access and modify interface settings in user settings. |

:::warning Permissions That Apply to Admins

Certain permissions apply to **all users including administrators**. Currently, this includes:

- **API Keys** (`features.api_keys`) — Administrators must have this permission to generate API keys, just like regular users.

**More permissions may be added to this category in future versions.** As Open WebUI evolves, additional security-sensitive features may require explicit permission grants even for admins.

**API Keys Specifics:**
1.  **Global Toggle Required**: The feature must be enabled globally in **Admin Settings > General > Enable API Keys**. If this is off, *no one* can generate keys.
2.  **Permission Check Required**: The user must have the `features.api_keys` permission.
3.  **Admins Are Not Exempt**: Administrators are subject to the same permission checks as regular users for this feature.

:::

:::tip Best Practice: Create an Admin Group

**To prepare for future permission changes, create a dedicated group for administrators:**

1.  **Create an "Administrators" group** via **Admin Panel > Users > Groups**
2.  **Add all admin users** to this group
3.  **Grant necessary permissions** to the group (e.g., API Keys, and any future admin-applicable permissions)

This approach ensures that when new permissions are added that apply to admins, you can easily grant them to all administrators via the group rather than modifying individual user settings. It also provides fine-grained control over which admins have access to which features.

:::

## Environment Variables

While the UI is the recommended way to manage permissions, initial defaults can be set via environment variables. These are typically prefixed with `USER_PERMISSIONS_`.
*   `ENABLE_IMAGE_GENERATION=True`
*   `ENABLE_WEB_SEARCH=True`
*   `USER_PERMISSIONS_CHAT_FILE_UPLOAD=True`

See the [Environment Configuration](../../getting-started/env-configuration.mdx) guide for a complete list of valid variables.
