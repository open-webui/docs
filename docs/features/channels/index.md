---
sidebar_position: 1000
title: "Channels"
---

# 💬 Channels

**Where your team and AI think together, in real time.**

Channels are persistent, shared spaces where humans and AI models participate in the same conversation. Unlike standard chats, which are personal and isolated, Channels let multiple users and multiple models interact in a single timeline. Every exchange, whether human or AI, becomes shared context that the whole team can build on.

Open WebUI is where knowledge is found, created, and shared. Channels make that collaborative.

---

## Why Channels?

### AI as a participant, not a separate tool

Tag `@gpt-4o` to draft a plan, then tag `@claude` to critique it. Your whole team sees both responses in the same timeline with full context. No tab-switching, no copy-pasting between tools.

### Persistent shared context

Every message becomes part of the record. When someone asks a question next week, the AI can draw on everything discussed before. Channels are living knowledge bases, not disposable threads.

### Multiple models, one conversation

Use one model for code review, another for writing, a third for data analysis, all in the same channel. Chain them together for richer answers than any single model could produce.

### Real-time collaboration

Instant updates, emoji reactions, threaded replies, pinned messages, and unread indicators.

---

## Key Features

| | |
| :--- | :--- |
| 🤖 **`@model` tagging** | Summon any AI model into the conversation on demand |
| 👥 **Shared context** | Every message, human or AI, builds the collective knowledge |
| 🧵 **Threads & reactions** | Keep discussions organized with replies, pins, and emoji reactions |
| 📎 **File sharing** | Drop images, documents, and code. AI can see and process them |
| 🔒 **Access control** | Public, private, group-based, and direct message channels |
| 🧠 **AI channel awareness** | Models can search and synthesize across channels autonomously |

---

## Channel Types

| Type | Best for |
|------|----------|
| **Standard** | Topic-based rooms (`#engineering`, `#marketing-strategy`), public or private |
| **Group** | Team-scoped spaces with explicit membership and user-group sync |
| **Direct Message** | Private 1:1 or small-group conversations with online/offline status |

---

## How It Works

### Talking to AI

Channels are **passive by default**. AI doesn't jump into every conversation. When you need input from a model, just tag it:

> **You:** `@gpt-4o` Here's our Q3 revenue data. What trends stand out?
>
> *(GPT-4o analyzes the data and responds with key insights)*
>
> **You:** `@claude` Do you agree with that analysis? What's missing?

This means your team can discuss freely without AI interrupting, and call on exactly the right model when it's needed.

### Tagging people and linking channels

Use `@username` to notify teammates. Use `#channel-name` to create clickable cross-references between conversations.

### Message interactions

Hover any message to react with emoji, pin it for reference, reply inline, or start a threaded side conversation.

---

## AI Channel Awareness

With [**native function calling**](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models can navigate your channels autonomously:

- **Search channels** by name or description
- **Search messages** across all accessible channels
- **Read threads** to understand full discussion context

> **You:** What was decided in `#dev-team` about the migration timeline?
>
> *(The AI searches the channel, reads the relevant thread, and gives you a synthesized answer, all without you leaving your current chat.)*

This removes the need to manually bridge information between private chats and shared channels. The AI does it for you.

:::tip Community action: Forward to Channel
If you want a one-click path from a chat message into a channel, the community **[Forward to Channel](https://openwebui.com/posts/b60c1f03-e29c-47c0-862c-3741a382616e)** action adds a button to each assistant message that posts the reply (or a selection) into a channel of your choice. Useful for promoting good answers from private chats into team-visible spaces without copy-paste.
:::

---

## Getting Started

:::info Beta Feature
Channels is currently in **Beta** and must be enabled by an administrator.
:::

1. Navigate to **Admin Panel > Settings > General**
2. Toggle **Channels (Beta)** on and save
3. Channels appear in the sidebar. Click **(+)** to create your first one

Channel creation is restricted to administrators by default. Channels support granular permissions including read-only access, write access, and feature-level toggles via environment variables or group permissions.

---

## Use Cases

### Team knowledge hub (`#engineering`)

Your team discusses architecture decisions throughout the week. Someone tags `@claude` to evaluate tradeoffs. The AI's analysis becomes part of the permanent record: searchable, referenceable, and available to every future conversation in that channel.

### Multi-model war room (`#incident-response`)

Paste logs and error traces. Tag `@gpt-4o` to analyze the stack trace. Tag `@deepseek-coder` to suggest a fix. Tag `@claude` to draft the postmortem. Three models, one shared context, one timeline.

### Project strategy (`#product-launch`)

Twenty messages of human brainstorming. Then: `@gpt-4o` Read the conversation above and create a prioritized action plan with owners and deadlines. The AI synthesizes everything discussed into a structured deliverable.

### Creative collaboration (`#story-mode`)

Long-running narrative projects where multiple "character" models interact in the same timeline. Switch between personas without losing context.

---

:::warning Privacy
Public channels are visible to all users on your instance. Do not share API keys, passwords, or sensitive data in public channels.
:::
