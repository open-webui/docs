---
sidebar_position: 2
title: "📚 Prompts"
---

The `Prompts` section of the `Workspace` within Open WebUI enables users to create, manage, and share custom prompts. This feature streamlines interactions with AI models by allowing users to save frequently used prompts and easily access them through slash commands.

### Prompt Management

The Prompts interface provides several key features for managing your custom prompts:

* **Create**: Design new prompts with customizable titles, access levels, and content.
* **Share**: Share prompts with other users based on configured access permissions.
* **Access Control**: Set visibility and usage permissions for each prompt (refer to [Permissions](./permissions.md) for more details).
* **Slash Commands**: Quickly access prompts using custom slash commands during chat sessions.

### Creating and Editing Prompts

When creating or editing a prompt, you can configure the following settings:

* **Title**: Give your prompt a descriptive name for easy identification.
* **Access**: Set the access level to control who can view and use the prompt.
* **Command**: Define a slash command that will trigger the prompt (e.g., `/summarize`).
* **Prompt Content**: Write the actual prompt text that will be sent to the model.

### Prompt Variables

Open WebUI supports dynamic prompt variables that can be included in your prompts:

* **Clipboard Content**: Use `{{CLIPBOARD}}` to insert content from your clipboard.
* **Date and Time**:
  * `{{CURRENT_DATE}}`: Current date
  * `{{CURRENT_DATETIME}}`: Current date and time
  * `{{CURRENT_TIME}}`: Current time
  * `{{CURRENT_TIMEZONE}}`: Current timezone
  * `{{CURRENT_WEEKDAY}}`: Current day of the week
* **User Information**:
  * `{{USER_NAME}}`: Current user's name
  * `{{USER_LANGUAGE}}`: User's selected language
  * `{{USER_LOCATION}}`: User's location (requires HTTPS and Settings > Interface toggle)

### Variable Usage Guidelines

* Enclose variables with double curly braces: `{{variable}}`
* The `{{USER_LOCATION}}` variable requires:
  * A secure HTTPS connection
  * Enabling the feature in Settings > Interface
* The `{{CLIPBOARD}}` variable requires clipboard access permission from your device

### Access Control and Permissions

Prompt management is controlled by the following permission settings:

* **Prompts Access**: Users need the `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS` permission to create and manage prompts.
* For detailed information about configuring permissions, refer to the [Permissions documentation](./permissions.md).

### Best Practices

* Use clear, descriptive titles for your prompts
* Create intuitive slash commands that reflect the prompt's purpose
* Document any specific requirements or expected inputs in the prompt description
* Test prompts with different variable combinations to ensure they work as intended
* Consider access levels carefully when sharing prompts with other users
