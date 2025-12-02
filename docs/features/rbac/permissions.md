---
sidebar_position: 3
title: "Permissions"
---

The `Permissions` section of the `Workspace` within Open WebUI allows administrators to configure access controls and feature availability for users. This powerful system enables fine-grained control over what users can access and modify within the application.

Administrators can manage permissions in the following ways:

1. **User Interface:** The Workspace's Permissions section provides a graphical interface for configuring permissions.
2. **Environment Variables:** Permissions can be set using environment variables, which are stored as `PersistentConfig` variables.
3. **Group Management:** Assigning users to groups with predefined permissions.

## Workspace Permissions

Workspace permissions control access to core components of the Open WebUI platform:

- **Models Access**: Toggle to allow users to access and manage custom models. (Environment variable: `USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS`)
- **Knowledge Access**: Toggle to allow users to access and manage knowledge bases. (Environment variable: `USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS`)
- **Prompts Access**: Toggle to allow users to access and manage saved prompts. (Environment variable: `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS`)
- **Tools Access**: Toggle to allow users to access and manage tools. (Environment variable: `USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS`) *Note: Enabling this gives users the ability to upload arbitrary code to the server.*

## Chat Permissions

Chat permissions determine what actions users can perform within chat conversations:

- **Allow Chat Controls**: Toggle to enable access to chat control options.
- **Allow File Upload**: Toggle to permit users to upload files during chat sessions. (Environment variable: `USER_PERMISSIONS_CHAT_FILE_UPLOAD`)
- **Allow Chat Delete**: Toggle to permit users to delete chat conversations. (Environment variable: `USER_PERMISSIONS_CHAT_DELETE`)
- **Allow Chat Edit**: Toggle to permit users to edit messages in chat conversations. (Environment variable: `USER_PERMISSIONS_CHAT_EDIT`)
- **Allow Temporary Chat**: Toggle to permit users to create temporary chat sessions. (Environment variable: `USER_PERMISSIONS_CHAT_TEMPORARY`)

## Features Permissions

Features permissions control access to specialized capabilities within Open WebUI:

- **Web Search**: Toggle to allow users to perform web searches during chat sessions. (Environment variable: `ENABLE_WEB_SEARCH`)
- **Image Generation**: Toggle to allow users to generate images. (Environment variable: `ENABLE_IMAGE_GENERATION`)
- **Code Interpreter**: Toggle to allow users to use the code interpreter feature. (Environment variable: `USER_PERMISSIONS_FEATURES_CODE_INTERPRETER`)
- **Direct Tool Servers**: Toggle to allow users to connect directly to tool servers. (Environment variable: `USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS`)

## Default Permission Settings

By default, Open WebUI applies the following permission settings:

**Workspace Permissions**:

- Models Access: Disabled (`USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS=False`)
- Knowledge Access: Disabled (`USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS=False`)
- Prompts Access: Disabled (`USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS=False`)
- Tools Access: Disabled (`USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS=False`)

**Chat Permissions**:

- Allow Chat Controls: Enabled
- Allow File Upload: Enabled (`USER_PERMISSIONS_CHAT_FILE_UPLOAD=True`)
- Allow Chat Delete: Enabled (`USER_PERMISSIONS_CHAT_DELETE=True`)
- Allow Chat Edit: Enabled (`USER_PERMISSIONS_CHAT_EDIT=True`)
- Allow Temporary Chat: Enabled (`USER_PERMISSIONS_CHAT_TEMPORARY=True`)

**Features Permissions**:

- Web Search: Enabled (`ENABLE_WEB_SEARCH=True`)
- Image Generation: Enabled (`ENABLE_IMAGE_GENERATION=True`)
- Code Interpreter: Enabled (`USER_PERMISSIONS_FEATURES_CODE_INTERPRETER`)
- Direct Tool Servers: Disabled (`USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS=False`)

Administrators can change the default permissions in the user interface under "users" in the admin panel.

## Managing Permissions

Administrators can adjust these permissions through the user interface or by setting the corresponding environment variables in the configuration. All permission-related environment variables are marked as `PersistentConfig` variables, meaning they are stored internally after the first launch and can be managed through the Open WebUI interface.

This flexibility allows organizations to implement security policies while still providing users with the tools they need. For more detailed information about environment variables related to permissions, see the [Environment Variable Configuration](https://docs.openwebui.com/getting-started/env-configuration#workspace-permissions) documentation.
