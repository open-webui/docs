---
sidebar_position: 4
title: "Organizing Conversations"
---

Open WebUI provides powerful organization features that help users manage their conversations. You can easily categorize and tag conversations, making it easier to find and retrieve them later. The two primary ways to organize conversations are through **Folders** and **Tags**.

## Folders: From Simple Organization to Powerful Projects

Folders in Open WebUI have evolved from simple containers into powerful, project-like workspaces. They allow you to not only group related conversations but also to define specific contexts, instructions, and knowledge bases for those conversations.

### Basic Folder Operations

At their core, folders still allow you to keep your chat list tidy:

- **Creating a Folder**: You can create a new folder to store specific conversations. This is useful if you want to keep conversations of a similar topic or purpose together.
- **Moving Conversations into Folders**: Existing conversations can be moved into folders by dragging and dropping them. This allows you to structure your workspace in a way that suits your workflow.

![Folder Demo](/images/folder-demo.gif)

### Starting a Chat within a Folder

By simply clicking on a folder in the sidebar, you select the folder as your space to start a chat in. The main chat interface will then update to show that you selected that folder and any new chat you start will now automatically be created inside this folder, inheriting its unique settings.

### Editing Folder Settings: System Prompts & Knowledge

You can give each folder a unique personality and context. By hovering over a folder, clicking the three-dot menu, and selecting **"Edit"**, you will open the folder's settings modal popup. Here, you can configure:

- **Folder Name**: Change the name of your folder to better reflect its purpose.
- **System Prompt**: Optionally assign a dedicated System Prompt to the folder. This prompt is automatically prepended to every new conversation and message created within that folder, tailoring the AI's behavior for specific tasks. You can still use folders for organization without a system prompt.
- **Attached Knowledge**: Link one or more knowledge bases to your folder. Any files attached here will automatically be included as context in all new chats within that project folder. This is also optional; you can still use folders for organization, without attaching extra knowledge bases.

### Example Use Case

:::tip

**Creating a 'Python Expert' Project**
Imagine you are working on a Python project. You can create a folder called "Python Expert".

1. **Edit the folder** and set the System Prompt to something like: `You are an expert Python developer. You provide clean, efficient, and well-documented code. When asked for code, you prioritize clarity and adherence to PEP 8 standards.`
2. **Attach Knowledge** by linking a knowledge base which contains a PDF of your project's technical specification, or a specific library's documentation.
3. **Activate/Select the folder** by clicking on it.
4. Now, any new chat you start will automatically have this expert persona, the context of your documents and is saved within the folder, ensuring you get highly relevant and specialized assistance for your project.

:::

## Tagging Conversations

Tags provide an additional layer of organization by allowing you to label conversations with keywords or phrases.

- **Adding Tags to Conversations**: Tags can be applied to conversations based on their content or purpose. Tags are flexible and can be added or removed as needed.
![Tag Demo](/images/tag-demo.gif)
- **Using Tags for Searching**: Tags make it easy to locate specific conversations by using the search feature. You can filter conversations by tags to quickly find those related to specific topics.

### Example Use Case

:::tip

**Tagging by Topic**
If you frequently discuss certain topics, such as "marketing" or "development," you can tag conversations with these terms. Later, when you search for a specific tag, all relevant conversations will be quickly accessible.

:::
