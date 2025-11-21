---
sidebar_position: 1300
title: "Notes"
---

The **Notes** feature in Open WebUI provides a dedicated workspace for content creation and knowledge management. While normal chats within Open WebUI preserves your linear conversations, **Notes** allow you to curate specific content, such as long-form drafts or coding cheatsheets that exists independently of any single conversation. These notes can be written and enhanced using your LLMs and seamlessly injected into new chats as context.

## The Note Editor

The Notes interface is a full-featured writing environment that supports Markdown and Rich Text.

### Floating Formatting Toolbar

Notes utilizes a context-aware **Floating Toolbar** for formatting, rather than a static bar at the top of the screen.

* **Click on empty space:** The toolbar will appear at your cursor location, allowing you to start new elements like Headers or Lists.
* **Double-click text:** Highlighting or double-clicking existing text summons the toolbar to apply styling options.

**Toolbar Options:**

* **Headers:** `H1`, `H2`, `H3` for document structure.
* **Lists:** Bullet points (`·`) and Numbered lists (`1.`).
* **Task Lists:** Interactive checkboxes (`☑`) for to-do lists.
* **Styling:** **Bold**, *Italic*, Underline, and ~~Strikethrough~~.
* **Code:** Inline code formatting `</>`.

While this toolbar is native to the Notes workspace, it can also be enabled for standard Chats.

:::info  To see this toolbar in your main chat input:

1. Go to **Settings > Interface**.
2. Toggle **Rich Text Input for Chat** to ON.
3. Toggle **Show Formatting Toolbar** to ON.

:::

### Input Tools & Metrics

* **Metrics:** The top header displays real-time **Word** and **Character** counts, useful for drafting content with length constraints.
* **Voice Dictation:** Click the **Microphone** icon (bottom left) to dictate text directly into the note using speech-to-text.

---

## AI Integration

LLMs are directly integrated with your notes, turning the editor into an AI-assisted workspace. Click the **AI (Sparkle/Star)** button at the bottom right of the screen to access these features.

### 1. Enhance

The **Enhance** feature allows you to use AI as an in-place editor.

1. Highlight a specific section of text (or select nothing to target the whole note).
2. Click **Enhance**.
3. The LLM (selected in the Note's Controls) will rewrite your text directly in the editor with enhancement in mind.

:::info Custom Control
If you need a specific style or tone (e.g., "Rewrite this to be more professional"), use the **Chat** sidebar instead:

1. Select your text.
2. Click the **Chat** button.
3. Enable the **Edit** toggle if you need to modify the context manually.
4. Instruct the AI to rewrite the selection according to your specific needs.
:::

### 2. Chat (Sidebar)

The **Chat** button opens a dedicated sidebar conversation focused specifically on the note's content. This is a "Chat with Data" mode.

* You can ask the AI to summarize the note, extract specific data, or critique your writing.
* **Edit Toggle:** Inside the chat sidebar, there is an **Edit** toggle. This allows you to manually modify the highlighted context sent to the LLM *before* you press send, giving you granular control over the query.

### Undo / Redo

The **Undo/Redo** arrows (top right) track all changes. Crucially, this includes changes made by the AI. If the `Enhance` feature produces a result you dislike, you can simply click Undo to revert to your original text.

---

## Using Notes in Chat

You can inject the content of your Notes into standard chat sessions to provide context to the AI.

### How to Attach a Note

1. Go to the main **Chat Input** bar.
2. Click the **`+` (More)** button.
3. Select **Attach Notes**.
4. Choose the desired note(s) from the list.

The full content of the note will be loaded into the context window for that conversation.

---

## Management & Sharing

Open WebUI provides several ways to export and manage your notes via the **More (`...`)** menu in the top right corner.

### Download

You can export your notes in standard formats:

* **Plain text (.txt):** The raw text content.
* **Plain text (.md):** Preserves Markdown structure (headers, code blocks, etc.).
* **PDF document (.pdf):** A rendered document with visual formatting applied.

### Sharing

* **Copy Link:** Copies the direct URL of the specific Note to your clipboard (useful for returning to the note later).
* **Copy to Clipboard:** Copies the entire *contents* (text) of the note to your clipboard for pasting into other applications.

### Delete

You can delete notes permanently from two locations:

1. **From the Notes Dashboard:** Click the **More (`...`)** button on the individual note card in the list view and select **Delete**.
2. **From the Editor:** While inside an open note, click the **More (`...`)** button in the top right corner of the screen and select **Delete**.

---

## Use Cases

While Open WebUI has dedicated **Prompts** (for slash commands) and **Documents** (for RAG), **Notes** serves a unique middle ground for iterative work and precise control.

### 1. The "Living" Draft (Iterative Writing)

Unlike a static prompt or an uploaded document, a Note is a workspace.

* **Scenario:** You are writing a blog post or documentation. You draft the outline, use the **Enhance** tool to expand bullet points into paragraphs, and use the **Chat** sidebar to brainstorm titles. The Note becomes the final product, rather than just a reference.

### 2. High-Fidelity Code Staging

RAG (Documents) uses vector search, which is probabilistic—it might miss a crucial line of code in a large file.

* **Scenario:** You have three specific functions from different files that you need to refactor together. Copy/pasting them into the chat is messy. Instead, paste them into a Note. When you attach the Note, you guarantee the LLM sees **100%** of that code exactly as you arranged it, without the "fuzzy" guessing of RAG.

### 3. Transient Data Sanitization

Sometimes you need to analyze data (like error logs) but need to clean it first.

* **Scenario:** You have a server error log containing sensitive API keys. Paste the log into a Note, manually delete the keys or use **Enhance** to "Anonymize this text", and *then* attach the sanitized Note to a chat to ask the AI for a solution. This prevents leaking sensitive data into your main chat history or embeddings.

---

## Limitations

It is important to understand how Notes function technically compared to other features like "Documents".

### Context Injection vs. Vector Search

* **Documents (RAG):** When you upload a file to "Documents". the system uses vector search to find relevant *chunks* of the file based on your query. It is probabilistic.
* **Notes (Deterministic):** When you attach a Note, you are performing **manual context injection**. The system does not guess; it forces the LLM to read the *entire* note. This guarantees the model sees the information, but it requires you to select the correct note manually.

### Context Window Usage

Because attaching a Note injects the full text into the chat:

* If you have a very large note (e.g., 10,000 words) and attach it to a model with a small context window (e.g., 8k tokens), the model may run out of memory or "forget" the beginning of your conversation.

### Read-Only Context

When you attach a Note to a standard chat, it is **read-only** for the AI.

* The AI in the main chat cannot automatically update the text inside your Note file. If the AI suggests changes to your project, you must manually copy those changes back into the Note editor.
