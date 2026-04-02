---
sidebar_position: 2
title: "Notes"
---

# 📝 Notes

**Write, think, and refine with AI by your side.**

You search, you discover, you synthesize. Notes is where that becomes lasting knowledge. It's a dedicated workspace for content that lives outside of any single conversation: drafts, cheat sheets, research findings, project briefs. Things you build up over time, refine with AI, and inject into future chats as context.

Unlike standard chats, which are linear and ephemeral, Notes are persistent documents you can return to, edit, and share. Unlike Documents (RAG), which use vector search to find relevant chunks, Notes inject their full content directly into context, giving you precise control over what the AI sees.

---

## Why Notes?

### AI-assisted writing, built in

Highlight text and click **Enhance** to let the AI rewrite it in place. Or open the **Chat sidebar** to brainstorm, critique, or expand on your content in a focused conversation without leaving the editor.

### Precise context injection

When you attach a Note to a chat, the AI reads the entire document, word for word. No chunking, no vector search, no guessing. You control exactly what the model sees.

### Persistent, not disposable

Notes exist outside of chats. Write a coding reference, refine it over weeks, and attach it to any conversation whenever you need it.

### AI can read and write your notes

With [native function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models can search, read, create, and update your notes autonomously, turning Notes into a dynamic long-term memory.

---

## Key Features

| | |
| :--- | :--- |
| ✍️ **Rich editor** | Markdown and Rich Text with a floating formatting toolbar |
| 🤖 **AI Enhance** | Rewrite or improve selected text in place |
| 💬 **Chat sidebar** | Have a focused AI conversation about your note's content |
| 📎 **Context injection** | Attach notes to any chat for full-fidelity context |
| 🔍 **Agentic access** | Models can search, read, and update notes autonomously |
| 📤 **Export** | Download as `.txt`, `.md`, or `.pdf` |

---

## The Editor

Notes uses a context-aware **floating toolbar** for formatting:

* **Click on empty space** to start new headers, lists, or task lists
* **Double-click text** to apply bold, italic, underline, strikethrough, or inline code
* **Drag-and-drop** list items to reorder

The top bar shows real-time **word and character counts**, and a **microphone icon** enables voice dictation.

:::info Rich Text in Chats
This editor can also be enabled for standard chats: **Settings > Interface > Rich Text Input for Chat** and **Show Formatting Toolbar**.
:::

---

## AI Integration

Click the **AI button** (bottom right) to access:

### Enhance

Select text (or leave nothing selected for the whole note) and click **Enhance**. The AI rewrites it in place using the model selected in the note's controls.

### Chat Sidebar

Opens a dedicated conversation focused on the note's content. Ask the AI to summarize, extract data, critique, or rewrite specific sections. Use the **Edit toggle** to manually modify the context sent to the AI before submitting.

All AI changes are tracked by **Undo/Redo** (top right), so you can always revert.

---

## Using Notes in Chat

1. Go to the **Chat Input** bar
2. Click the **+ (More)** button
3. Select **Attach Notes**
4. Choose the note(s) to attach

The full content of the note is injected into the context window for that conversation.

---

## Agentic Note Management

With [**native function calling**](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models can work with your notes autonomously:

| Tool | What it does |
|------|-------------|
| `search_notes` | Search your notes by title and content |
| `view_note` | Read the full content of a note |
| `write_note` | Create a new note |
| `replace_note_content` | Update an existing note |

> **You:** Search my "Project X" notes and find the database schema.
>
> **You:** Add a new task to my "Weekly Todo" note to review the PR.

---

## Management and Sharing

Access management options via the **More (...)** menu in the top right corner.

### Export

* **Plain text (.txt)** or **Markdown (.md)** for raw content
* **PDF (.pdf)** with visual formatting (dark mode detected automatically)

### Sharing

* **Copy Link** to share the note URL
* **Copy to Clipboard** to paste the content elsewhere

Administrators can control sharing via environment variables or the Admin Panel:

* `USER_PERMISSIONS_NOTES_ALLOW_SHARING` for internal sharing
* `USER_PERMISSIONS_NOTES_ALLOW_PUBLIC_SHARING` for public links

These can also be configured in **Admin Panel > Settings > Users > Default Permissions**.

### Quick creation

* Navigate to `/notes/new` to open a blank note
* Add query parameters: `/notes/new?title=My%20Title&content=Initial%20text`
* Create from global search (`Cmd+K` / `Ctrl+K`) by selecting "Create a new note"
* Import `.md` files by dragging them onto the Notes list

### View options

Toggle between **Created by you** and **Shared with you** filters, and switch between **List** and **Grid** layouts.

:::info Admin Visibility
Notes are workspace items. By default (`BYPASS_ADMIN_ACCESS_CONTROL=True`), administrators can see all users' notes. Set `BYPASS_ADMIN_ACCESS_CONTROL` to `False` to restrict this. See [Environment Configuration](/reference/env-configuration#bypass_admin_access_control) for details.
:::

---

## Use Cases

### Living drafts

Draft something in Notes, use **Enhance** to expand bullet points into paragraphs, and use the **Chat sidebar** to brainstorm titles. The Note is the final product, not just a reference.

### High-fidelity code context

RAG uses vector search, which is probabilistic and might miss a crucial line. Paste specific functions into a Note and attach it to guarantee the model sees 100% of your code, exactly as arranged.

### Data sanitization

Paste server logs containing sensitive data into a Note, redact the keys (or use Enhance to "Anonymize this text"), then attach the sanitized Note to a chat. This prevents leaking sensitive data into your chat history.

---

## Limitations

### Context window usage

Attaching a note injects the full text. A very large note attached to a model with a small context window may cause the model to lose earlier conversation context.

### Write access

When manually attached, notes are **read-only**. In **Native Mode** with the `replace_note_content` tool enabled, models can modify your notes. Review changes and use **Undo/Redo** if needed.
