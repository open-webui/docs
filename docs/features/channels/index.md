---
sidebar_position: 1000
title: "Channels"
---

**Channels** transform Open WebUI from a personal interface into a collaborative workspace. Unlike standard "Chats"—which are isolated sessions—Channels are persistent, topic-based rooms (similar to Discord or Slack), allowing multiple users and multiple AI models to interact in a shared timeline.

:::info Beta Feature
Channels is currently a **Beta** feature. Functionality is subject to change, and it must be explicitly enabled by an Administrator before it appears in the interface.
:::

## Enabling Channels

By default, the Channels feature may be hidden. An **Admin** must enable it globally for the instance.

1. Click on your **User Profile** icon in the bottom left (or top right) corner.
2. Select **Admin Panel**.
3. Navigate to **Settings** -> **General**.
4. Locate the toggle labeled **Channels (Beta)**.
5. Toggle it **On** and click **Save**.
6. Refresh the page. The "Channels" section should now appear in the main sidebar.

## Creating a Channel

1. Locate the **Channels** header in the sidebar.
2. Click the **(+) Plus** icon next to the "Channels" header.
3. **Name:** Enter a channel name (e.g., `general`, `python-dev`). Spaces should get converted to hyphens.
4. **Access Control:**
   * **Public:** All registered users on your Open WebUI instance can see and join this channel.
   * **Private/Group Access:** Only you or users with permission can access this channel.

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

* **Add Reaction:** Click the **Smiley Face** icon to add a visual emoji eaction to a message.
* **Reply:** Quotes the message within the main channel stream, linking your response to the original message while keeping it visible to everyone in the main flow.
* **Reply in Thread:** Starts a separate, nested conversation thread centered on that specific message. This allows for focused discussions without cluttering the main channel history.
* **Edit:** Click the **Pencil** icon to modify the content of your message.
* **Delete:** Click the **Trash** icon to remove the message from the channel.

:::note
Currently, reactions are purely visual and do not influence model behavior.
:::

### Collaboration

If your Open WebUI instance supports multiple users:

* **Real-time updates:** Messages appear instantly for all users currently viewing the channel.
* **Shared Context:** When a teammate asks an AI a question, the AI's response becomes part of the context for the *next* user's query. This allows teams to iterate on AI outputs together.

## Managing Channels

### Editing and Deleting

To manage an existing channel:

1. Hover over the channel name in the sidebar.
2. Click the **Gear (Edit)** icon.

:::info
Only the Channel Creator or an Admin can delete a channel.
:::

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
