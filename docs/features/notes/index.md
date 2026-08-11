---
sidebar_position: 2
title: "Notes"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Notes

<ThemedImage
  alt="Notes: a two-pane note editor with an AI chat sidebar, selecting text in the note and asking the AI to edit it in place"
  sources={{
    light: useBaseUrl('/images/banners/notes-light.svg'),
    dark: useBaseUrl('/images/banners/notes-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Write, think, and refine with AI by your side.**

You search, you discover, you synthesize. Notes is where that becomes lasting knowledge. It's a dedicated workspace for content that lives outside of any single conversation: drafts, cheat sheets, research findings, project briefs. Things you build up over time, refine with AI, and inject into future chats as context.

Unlike standard chats, which are linear and ephemeral, Notes are persistent documents you can return to, edit, and share. Unlike Documents (RAG), which use vector search to find relevant chunks, Notes inject their full content directly into context, giving you precise control over what the AI sees.

---

## Why Notes?

![The notes list](/images/features/notes/notes-list.png)

### AI-assisted writing, built in

Open the **Chat sidebar** to brainstorm, critique, expand or rewrite your content without leaving the editor. It is the full chat interface, so you keep the model picker, tools and attachments, and you can hold several separate conversations per note. Highlight a passage first and the model rewrites just that part, in place.

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
| 🤖 **AI Enhance** | Ask the note's chat to rewrite or improve selected text in place |
| 💬 **Chat sidebar** | The full chat interface inside the note, with as many conversations per note as you want |
| 📎 **Context injection** | Attach notes to any chat for full-fidelity context |
| 📄 **Attachments** | Upload files onto the note itself, listed above the note body |
| 📌 **Pin to sidebar** | Pin frequently used notes for quick access from the sidebar |
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

Open the note's chat with the **speech bubble** button in the editor toolbar, at the top of the note next to Undo/Redo. Everything the AI does to a note now runs through that chat.

### Enhance

Rewriting happens in the chat, there is no separate **Enhance** button. Select the passage you want reworked, open the chat and either use the **Rewrite the selected text.** suggestion or say what you want. The model rewrites the note in place through `replace_note_content`, and the change appears in the editor as it happens. Leave nothing selected to talk about the whole note.

### Chat Sidebar

Opens the full chat interface in a pane beside the note. It is the same component as a normal chat, so you get the model picker, tool and skill selection, file attachments, web search and the rest of the chat input. Ask the AI to summarize, extract data, critique or rewrite specific sections.

**Voice mode** is the exception. Its button is not offered in a note's chat, so use a normal chat for a hands-free voice conversation. Dictation still works, from the microphone button in the chat input.

**Insert a response into the note.** Every assistant response carries an **Insert** button that drops that response into the note at the cursor. Insertion creates a note version first, so **Undo/Redo** (top right) reverts it.

**Several conversations per note.** The panel header is a dropdown listing every chat attached to this note. Use it to switch between them, start a new one or delete one. A new conversation is only stored once you send its first message, so opening one and walking away leaves nothing behind. Deleting the last remaining chat immediately recreates an empty one.

**Suggested prompts.** While a conversation is still empty, four prompts are offered: enhance the note and update it, summarize it, extract action items, rewrite the selected text. They disappear as soon as the conversation has messages, and they are also suppressed if you set **Settings > Interface > Landing Page Mode** to **Chat**.

**Selected text is passed along.** If you have text selected in the note, that selection is appended to whatever you send as the target for a rewrite. Selecting nothing sends the message on its own.

:::info How the model actually sees the note

The note is not pasted into the conversation. The chat carries a system prompt with the note's id, and the model reads the note with `view_note` and edits it with `replace_note_content`. Edits land in the editor as the model makes them, without a reload.

Two consequences. A model that cannot call tools will not see the note content at all. And builtin tools behave differently in this chat than anywhere else: the note tools are always injected, and the whole builtin-tool surface is force-enabled even for models an administrator configured without it. See [Builtin tools in a note-attached chat](/features/extensibility/plugin/tools#tool-reference).

Non-image files attached to the note are injected as retrieval context on every message in the note's chats.

:::

:::info Note chats are separate from your chat history

Chats opened from a note are internal chats. They do not appear in the sidebar chat list or in search, and they are per user: on a shared note, each collaborator has their own set of conversations and cannot see anyone else's. Read access on the note is enough to open one.

:::

All AI changes are tracked by **Undo/Redo** (top right), so you can always revert.

---

## Using Notes in Chat

1. Go to the **Chat Input** bar
2. Click the **+ (More)** button
3. Select **Attach Notes**
4. Choose the note(s) to attach

The full content of the note is injected into the context window for that conversation.

You can also **drag a note straight from the sidebar into the chat** to attach it as a context reference, without opening the menu. The same drag-and-drop works for **chats**, **folders** and **models** from the sidebar.

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

## Pinning Notes

Pin important notes to the sidebar for quick access. Pinned notes appear in a dedicated **Notes** folder in the sidebar, just like pinned chats.

### How to pin

* From the **Notes list**: click the **⋯** menu on any note and select **Pin to Sidebar**
* From the **Note editor**: click the **⋯** menu in the top right and select **Pin to Sidebar**

### How to unpin

* From the **sidebar**: hover over the pinned note and click the **✕** button
* From the **Notes list** or **editor**: click the **⋯** menu and select **Unpin**

The sidebar Notes folder only appears when at least one note is pinned and the Notes feature is enabled.

:::info Pins are personal

Pinning a note only affects **your** sidebar: collaborators with access to the same note can pin or unpin it independently without changing what you see. Pinned notes are listed in pin-time order (newest first), and toggling a pin no longer counts as an edit, so it does not bump the note's "Updated" timestamp. Pre-existing pins from before this change are kept for the note's owner only; other users will need to re-pin shared notes they want in their own sidebar.

:::

---

## Management and Sharing

Access management options via the **More (...)** menu in the top right corner.

### Export

* **Plain text (.txt)** or **Markdown (.md)** for raw content
* **PDF (.pdf)** with visual formatting (dark mode detected automatically)

### Sharing

Open **Share** in the **More (...)** menu for the two copy actions:

* **Copy link** to share the note URL
* **Copy to clipboard** to paste the content elsewhere

A copied link opens the note only for people who can already reach it. Giving someone that reach is what the **Access** button does. It sits at the top right of the note, beside the **More (...)** menu, and opens the **Access Control** panel, where you set the note's visibility and manage the list of people and groups it is shared with. Each entry holds one of two levels:

* **Read**: open and read the note, and start chats from it. The editor stays read-only.
* **Write**: also edit the note's body and upload or detach its files.

The button is shown only when you have write access on the note, and it is disabled unless you own the note or you are an admin. With read-only access a **Read-Only Access** label takes its place.

The access list behaves the same here as everywhere else in Open WebUI, including which people and groups the **Add Access** picker offers you. See [Resource Access](/features/authentication-access/rbac/groups#resource-access-rbac).

Administrators can control sharing via environment variables or the Admin Panel:

* [`USER_PERMISSIONS_NOTES_ALLOW_SHARING`](/reference/env-configuration#user_permissions_notes_allow_sharing) for internal sharing (default `False`)
* [`USER_PERMISSIONS_NOTES_ALLOW_PUBLIC_SHARING`](/reference/env-configuration#user_permissions_notes_allow_public_sharing) for public links (default `False`)

These can also be configured in **Admin Panel > Users > Groups**, as **Notes Sharing** and **Notes Public Sharing**. Both start off, and the public toggle is only shown once **Notes Sharing** is on. Admins can share notes publicly regardless. See [Permissions](/features/authentication-access/rbac/permissions#2-sharing-permissions).

### Attachments

Notes carry their own files. Pick **Upload files** in the **More (...)** menu. Non-image files appear as a row of chips above the note body; click one to open it, or use its **✕** to detach it. Uploading is only offered with write access on the note, and read-only collaborators cannot detach files either.

Two things to know:

* **Images uploaded from the menu are invisible.** They are stored on the note but are neither shown as a chip nor placed in the text. To get an image into the note, paste it into the editor, which inserts it where the cursor is. Dropping files onto a note does nothing in this release.
* Attached files feed the note's chat. Every non-image attachment is added as retrieval context on every message you send in a chat opened from this note.

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

Draft something in Notes, select the bullet points and ask the note's chat to expand them into paragraphs, then keep a second conversation open for brainstorming titles. The Note is the final product, not just a reference.

### High-fidelity code context

RAG uses vector search, which is probabilistic and might miss a crucial line. Paste specific functions into a Note and attach it so the model sees 100% of your code, exactly as arranged.

### Data sanitization

Paste server logs containing sensitive data into a Note, redact the keys (or ask the note's chat to anonymize the text), then attach the sanitized Note to a chat. This prevents leaking sensitive data into your chat history.

---

## Limitations

### Context window usage

Attaching a note injects the full text. A very large note attached to a model with a small context window may cause the model to lose earlier conversation context.

### Write access

When manually attached, notes are **read-only**. In **Native Mode** with the `replace_note_content` tool enabled, models can modify your notes. Review changes and use **Undo/Redo** if needed.
