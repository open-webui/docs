---
sidebar_position: 3
title: "🔒 Permissions"
---

The `Permissions` section of the `Workspace` within Open WebUI allows administrators to configure access controls and feature availability for users. This powerful system enables fine-grained control over what users can access and modify within the application.

### Workspace Permissions

Workspace permissions control access to core components of the Open WebUI platform:

* **Models Access**: Toggle to allow users to access and manage custom models.
* **Knowledge Access**: Toggle to allow users to access and manage knowledge bases.
* **Prompts Access**: Toggle to allow users to access and manage saved prompts.
* **Tools Access**: Toggle to allow users to access and manage tools. *Note: Enabling this gives users the ability to upload arbitrary code to the server.*
* **Public Sharing**: Toggle to allow users to share content publicly from their workspace.

### Chat Permissions

Chat permissions determine what actions users can perform within chat conversations:

* **Allow Chat Controls**: Toggle to enable access to chat control options.
* **Allow File Upload**: Toggle to permit users to upload files during chat sessions.
* **Allow Chat Delete**: Toggle to permit users to delete chat conversations.
* **Allow Chat Edit**: Toggle to permit users to edit messages in chat conversations.
* **Allow Temporary Chat**: Toggle to permit users to create temporary chat sessions.

### Features Permissions

Features permissions control access to specialized capabilities within Open WebUI:

* **Web Search**: Toggle to allow users to perform web searches during chat sessions.
* **Image Generation**: Toggle to allow users to generate images.
* **Code Interpreter**: Toggle to allow users to use the code interpreter feature.

### Default Permission Settings

By default, Open WebUI applies the following permission settings:

**Workspace Permissions**:
- Models Access: Disabled
- Knowledge Access: Disabled
- Prompts Access: Disabled
- Tools Access: Disabled
- Public Sharing: Enabled

**Chat Permissions**:
- Allow Chat Controls: Enabled
- Allow File Upload: Enabled
- Allow Chat Delete: Enabled
- Allow Chat Edit: Enabled
- Allow Temporary Chat: Enabled

**Features Permissions**:
- Web Search: Enabled
- Image Generation: Enabled
- Code Interpreter: Enabled

### Managing Permissions

Administrators can adjust these permissions through the user interface to create appropriate access levels for different user groups or scenarios. This flexibility allows organizations to implement security policies while still providing users with the tools they need.
