---
sidebar_position: 1000
title: "Channels"
---

**Channels** transform Open WebUI from a personal interface into a collaborative workspace. Unlike standard "Chats"—which are isolated sessions—Channels are persistent, topic-based rooms (similar to Discord or Slack), allowing multiple users and multiple AI models to interact in a shared timeline.

:::info Beta Feature
Channels is currently a **Beta** feature. Functionality is subject to change, and it must be explicitly enabled by an Administrator before it appears in the interface.
:::

## Channel Types

Open WebUI supports three types of channels:

| Type | Description |
|------|-------------|
| **Standard** | Traditional topic-based channels with public or private visibility |
| **Group** | Membership-based channels where users explicitly join as members |
| **Direct Message** | Private one-on-one or multi-user conversations |

### Group Channels

Group channels are collaboration spaces where:
- Users explicitly join as members rather than accessing through permissions
- Support public or private visibility
- Can automatically include members from specified user groups
- Channel managers can add or remove members through the channel info modal

### Direct Message Channels

Direct Message (DM) channels enable private conversations:
- One-on-one or multi-user private messaging
- Automatic deduplication for existing conversations
- Optional channel naming
- Display participant avatars instead of channel icons
- Can be hidden from sidebar while preserving message history
- Automatically reappear when new messages arrive
- Show online/offline status indicator for participants

## Enabling Channels

By default, the Channels feature may be hidden. An **Admin** must enable it globally for the instance.

1. Click on your **User Profile** icon in the bottom left (or top right) corner.
2. Select **Admin Panel**.
3. Navigate to **Settings** -> **General**.
4. Locate the toggle labeled **Channels (Beta)**.
5. Toggle it **On** and click **Save**.
6. Refresh the page. The "Channels" section should now appear in the main sidebar.

## Creating a Channel

:::note
Channel creation is restricted to administrators only by default.
:::

1. Locate the **Channels** header in the sidebar.
2. Click the **(+) Plus** icon next to the "Channels" header.
3. **Select Channel Type:** Choose Standard, Group, or Direct Message.
4. **Name:** Enter a channel name (e.g., `general`, `python-dev`). Spaces are converted to hyphens.
5. **Access Control:**
   * **Public:** All registered users can see and join this channel.
   * **Private/Group Access:** Only you or users with permission can access.
   * For Group channels, select which user groups to auto-include.
   * For DM channels, use the user selection interface to choose participants.

## Using Channels

To access a channel, click on an existing channel to join, or create a new one.

### The `@mention` System

Channels function differently than standard Chats. In a standard Chat, you select a model at the top, and it responds to every message. **In Channels, the conversation is passive by default.**

To trigger a response, you must **tag** a specific model using the `@` symbol.

1. Type `@` in the input box.
2. A popup list of your available models will appear.
3. Select the model you wish to speak to (e.g., `@llama3`, `@gpt-4o`).
4. Type your prompt.

**Example:**
> **User:** `@gpt-4o` Write a Python script to scrape a website.
>
> *(GPT-4o responds with code)*
>
> **User:** `@llama3` Can you explain the code that GPT-4 just wrote?

:::tip Multi-Model Workflows
This allows you to chain different models together in one timeline. You can use a "smart" model for reasoning and a "fast" model for formatting, all within the same context window.
:::

### Tagging Users

You can also use the `@` symbol to ping other human users in the channel to get their attention or direct a message to them specifically.

1. Type `@` in the input box.
2. Select the user's name from the list.
3. **Usage:** `@admin Can you check the server logs?`

### Linking Channels

You can reference other channels directly within a conversation using the `#` symbol. This creates a clickable link to that channel.

1. Type `#` in the input box.
2. Select the channel name from the list.
3. **Usage:** `Please post those screenshots in #screenshots instead.`

:::warning Access Control
If a user **does not** have access to view a linked channel (e.g., `#admin-only`) within a channel they **do** have access to (e.g., `#general-chat`), the linked channel will appear to them as **`#Unknown`**, and clicking it will have no effect.
:::

### Message Interactions

Hover over any message in the timeline to access interaction options:

* **Add Reaction:** Click the **Smiley Face** icon to add an emoji reaction. Hovering over reactions shows the names of users who reacted (up to 3 names plus a count for additional reactors).
* **Pin Message:** Pin important messages for easy reference. Pinned messages are highlighted and accessible via a dedicated modal in the navbar.
* **Reply:** Quotes the message within the main channel stream.
* **Reply in Thread:** Starts a separate, nested conversation thread.
* **Edit:** Click the **Pencil** icon to modify your message.
* **Delete:** Click the **Trash** icon to remove the message.

:::note
Currently, reactions are purely visual and do not influence model behavior.
:::

### File Attachments

Channels support file sharing:

* **Paste from clipboard:** Images and files can be pasted directly using Ctrl+V / Cmd+V
* **Drag and drop:** Drag files directly into the message input
* **Image processing:** AI models in channels can view and analyze shared images

### Collaboration

If your Open WebUI instance supports multiple users:

* **Real-time updates:** Messages appear instantly using optimistic UI rendering.
* **Shared Context:** AI responses become part of the context for subsequent queries.
* **Unread indicators:** Visual badges show unread message counts in the sidebar.
* **User list:** Click to view all users with access to the channel.

## Managing Channels

### Editing and Deleting

To manage an existing channel:

1. Hover over the channel name in the sidebar.
2. Click the **Gear (Edit)** icon.

:::info
Channel creators can edit and delete their own group and DM channels without administrator privileges. Standard channels require admin access.
:::

### Permissions

Channels support granular access control:

* **Write access:** Required for posting, editing, and deleting messages
* **Read-only access:** Users can view content but cannot contribute
* **Feature toggle:** Administrators can control channel access via `USER_PERMISSIONS_FEATURES_CHANNELS` environment variable or group permissions in the admin panel

---

## Native Channel Awareness (Agentic)

When using a model with **Native Function Calling** enabled (see the [**Central Tool Calling Guide**](/features/plugin/tools#tool-calling-modes-default-vs-native)), models can navigate and search through your organization's channels autonomously.

### Available Channel Tools:
- **`search_channels`**: The model can find channels by name or description to identify where relevant discussions might be happening.
- **`search_channel_messages`**: The model can search for specific keywords or topics across all channels it has access to.
- **`view_channel_message`**: The model can read specific individual messages and their metadata.
- **`view_channel_thread`**: The model can retrieve an entire conversation thread to understand the full context of a discussion.

### Why use native tool calling for Channels?
This removes the need for human users to manually bridge information between private chats and public channels. You can ask an AI: *"Check the #dev-team channel and summarize the latest updates on the deployment issue,"* or *"What was decided in the #marketing-strategy thread about the logo?"*

The model will use its "Agentic" loop to find the channel, search for relevant messages, read the full thread, and provide you with a synthesized answer—all without you leaving your current chat.

## Use Cases

### 1. Team Development (`#dev-team`)

Create a channel where developers can paste code snippets. Use `@codellama` or `@deepseek-coder` to generate solutions, while human team members comment on the logic in plain text alongside the AI.

### 2. Roleplay & Creative Writing (`#story-mode`)

Keep long-running story contexts alive indefinitely without them getting buried in your personal chat history. Switch between different "Character" models (using Modelfiles) within the same story thread to create multi-character dialogues.

### 3. Project Knowledge Base (`#marketing-strategy`)

Use a channel as a persistent "War Room" for a specific project. Humans can discuss ideas and paste links freely. When a decision is needed, tag an AI to process the conversation history.

* *Example:* "Users discuss a marketing plan for 20 messages. Then, a user types: `@gpt-4o` Read the conversation above and create a bulleted list of the action items we just discussed."

---

:::warning
**Privacy Note**
Remember that **Public Channels** are visible to everyone on your instance. Do not share API keys, passwords, or sensitive personal data in public channels.
:::
