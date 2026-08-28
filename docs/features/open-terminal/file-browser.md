---
sidebar_position: 10
title: "File Browser"
---

# The File Browser

When Open Terminal is connected, a **file browser** appears in the sidebar of your chat. It works like the file explorer on your computer. You can browse folders, open files, upload things, and download results. Everything the AI creates shows up here automatically.

:::tip Auto-open behavior
By default the file browser opens automatically when you select a terminal. To stop it from opening on its own, turn off **Show Files on Terminal Select** in **Settings → Interface** (a per-user preference).
:::

![Chat interface with the file browser sidebar](/images/open-terminal-file-browser.png)

---

## Browsing

Click folders to navigate, and click files to preview them. A breadcrumb bar at the top shows where you are.

![Browsing a project directory with breadcrumb navigation](/images/open-terminal-file-browser-project.png)

### Sorting

Use the toolbar above the file list to sort by **Name** or **Date Modified**, ascending or descending. Folders always group ahead of files, so the sort order only reorders entries within each group. Each row shows its modified time next to the size, making it easier to find the latest output the AI just dropped into a working directory.

---

## Previewing files

Click any file to see a preview. Different file types display differently:

:::info Word and PowerPoint rendering needs a recent terminal
The terminal lays those files out itself, which needs Open Terminal 0.12.1 or newer running the default image. On anything older, or on the smaller images, the browser draws an approximation instead. See [Updating](./setup/updating) if your previews look rougher than the ones described here.
:::

### Text and code
Source code and text files are shown with syntax highlighting and line numbers.

![Python code with syntax highlighting and line numbers](/images/open-terminal-preview-code.png)

### PDFs
PDF documents render directly in the browser, so you can read them without downloading. A numbered **thumbnail strip** of the pages runs alongside the document; click a page to jump to it. It is hidden on a narrow panel.

![File browser with rendered markdown preview](/images/open-terminal-preview-markdown.png)

### Spreadsheets (CSV, TSV)
Data files render as **formatted tables** with headers and clean rows, much easier to read than raw comma-separated text.

![CSV data rendered as a clean table](/images/open-terminal-preview-csv.png)

### Word documents (DOCX)
`.docx` files are laid out by the terminal itself, using the same engine an office suite uses, and the preview shows the finished document. What you see is what the file prints: real pagination, headers, footers, footnotes and endnotes, embedded images, fonts and spacing.

A numbered **thumbnail strip** of the pages runs alongside the document; click a page to jump to it. The page is scaled to fit the width of the panel. A small toolbar floats at the bottom of the preview to zoom in and out, and clicking the zoom level puts it back to where it started. Holding **Ctrl** (**Cmd** on macOS) while scrolling zooms around the pointer.

Where the terminal cannot lay the document out, the browser draws it instead and the preview says that it may differ from the download. That rendering keeps the text, tables and images without matching the exact layout. Only when that fails too does it report an error and suggest downloading the file instead.

### Presentations (PPTX)
`.pptx` files open in a **slide viewer**, one slide at a time. The terminal renders the deck the same way it renders Word documents, so each slide arrives as the finished thing: backgrounds, fills, fonts, spacing and the position every placeholder takes from the layout or master.

A numbered **thumbnail strip** of the slides runs down the left side; click a thumbnail to jump to that slide. It is hidden on a narrow panel. The floating toolbar at the bottom steps between slides, shows which slide you are on and zooms. Scrolling pans the slide; **Ctrl** (**Cmd** on macOS) and scroll zooms; once you are zoomed in you can drag the slide around. **Reset view** in the toolbar above the preview, or the zoom level in the floating toolbar, puts the slide back to its fitted position.

Where the terminal cannot render the deck, the browser draws an approximation of each slide instead and the preview says that it may differ from the download. Open the file in its own application when the exact rendering matters.

### Markdown
Markdown files show a **rendered preview** (with formatted headings, links, bold text) and a toggle to switch to raw source.

![Rendered markdown with headings, lists, and formatted text](/images/open-terminal-preview-markdown.png)

### Images
Images display inline at a comfortable size.

![File browser displaying an image preview](/images/open-terminal-file-browser-home.png)

### HTML

HTML files render in a **sandboxed** iframe. Scripts and downloads work, but the page is given a unique origin of its own, so it cannot read cookies or `localStorage`, and same-origin requests back to Open WebUI fail.

That isolation is the point: a previewed file is untrusted content, and giving it your origin would let it act as you. A page that needs same-origin behaviour will fail quietly rather than with an error, which is usually the explanation when a preview looks broken but the file is fine.

If you understand the risk and need it, the per-user **Settings > Interface > iframe Sandbox Allow Same Origin** toggle grants it. It is **off by default** and applies to every embedded iframe, not just this preview. See [Rich UI](/features/extensibility/plugin/development/rich-ui#sandbox-and-security) for the full trade-off.

---

## Uploading files

**Drag and drop** files from your computer directly onto the file browser to upload them. This is how you share data with the AI: drop a spreadsheet, a PDF, an image, or any file you want the AI to work with.

![File browser showing uploaded files with names and sizes](/images/open-terminal-file-browser-home.png)

:::tip Upload to any folder
Navigate to the folder you want first, then drag and drop. The file uploads to whatever directory you're currently viewing.
:::

Uploading is switched off in a folder marked **Read-only**, and dropping files onto one does nothing.

### From the chat input

Files attached in the chat input normally go to Open WebUI, where their text is extracted for the model to read. An administrator can point them at the terminal instead, by setting the connection's **Chat Uploads** to `Filesystem`. Attachments then land in the current working directory and show up here like anything else, and the model opens them with the terminal's tools rather than reading extracted text. See [Chat Uploads](/features/open-terminal/setup/connecting#chat-uploads).

---

## Downloading files

Click the **download button** on any file to save it to your computer. This is how you get results back: after the AI generates a chart, creates a spreadsheet, processes an image, or writes a report, just download it.

### Files shown in the chat message

The AI can also put a file straight into its reply, rather than leaving you to find it in the browser. Ask for it to be shown in the chat and the message carries a small card with the file's name, a preview of its contents, and buttons to download it or open it in the file browser.

The preview understands the same formats the browser does, so a spreadsheet arrives as a table, an image as a picture, a PDF as pages. The card reads the file from the terminal each time it is opened, using your own access, so nothing is copied out of the terminal and no public link to it exists. It follows that a card only works while the terminal it came from is connected and selected, and reports the terminal as unavailable otherwise.

A long document can be opened at the part that matters. For a PDF, a Word document or a slide deck, the AI can name the page or slide it means, and the preview opens there rather than at the beginning. Ask for the page an answer came from and you get the document already scrolled to it, which saves hunting through a hundred pages for the paragraph the reply is quoting. The same applies when the file opens in the browser instead of in the message.

This replaces the older behaviour where a generated file produced a link in the reply that pointed at a path on the terminal's filesystem rather than at anything the browser could open.

![A CSV and a generated chart shown as cards inside an assistant message](/images/open-terminal-inline-file-card.png)

The card header is a toggle, so a preview can be folded down to just the filename when it is taking up too much of the reply, and image and document previews carry a zoom control and a resize handle.

By default the AI decides, and a file it shows opens in the file browser unless it asks for the card. **Settings > Interface > Terminal File Display** changes which one you get when the AI does not say: leave it on **Sidebar** for the browser, or set it to **Inline** to have files arrive in the message. The preference applies to terminals you connect yourself.

![File browser with download and action buttons](/images/open-terminal-file-browser-project.png)

---

## Editing files

Click the **edit icon** on any text file to open it in an editor. Make your changes and save. This is handy for quick fixes: editing a config value, correcting a typo, or tweaking something the AI generated.

![Editing a file directly in the file browser](/images/open-terminal-preview-code.png)

Files marked **Read-only** cannot be edited, so the edit and save buttons stay greyed out for them.

---

## Creating and deleting

You can create new files and folders, or delete things you don't need anymore, directly from the file browser. Both are switched off in a folder marked **Read-only**.

![File browser action bar with New File, New Folder options](/images/open-terminal-file-browser-home.png)

---

## Read-only files and folders

Some files and folders cannot be changed. The file browser marks them **Read-only** and greys out the actions that would fail, so you find out before you try rather than after.

A folder you cannot write to is marked **Read-only** next to the breadcrumbs at the top. **New File**, **New Folder** and **Upload** are greyed out while you are in it, dropping files onto it does nothing, and nothing inside it can be renamed or deleted.

A single file or folder you cannot change is marked **Read-only** next to its name. **Rename** and **Delete** are greyed out in its menu, it cannot be dragged into another folder, and its preview offers no edit or save. If you select several items at once, **Delete** stays greyed out when any one of them is read-only.

Being read-only limits changes, nothing else. You can still browse, preview and download these files as usual.

---

## Good to know

:::tip Files update automatically
When the AI creates or changes files, the file browser refreshes automatically. You don't need to manually reload.
:::

:::tip Remembers where you were
The file browser remembers which folder you were in, even when you switch between chats or terminals.
:::

:::tip Multiple terminals
If you have more than one terminal connected, switching between them in the dropdown updates the file browser to show that terminal's files.
:::

:::info Terminals that give each chat its own files
An administrator can set an orchestrated terminal to give every conversation a workspace of its own, so the files you see in one chat are not the files you see in another. Such a terminal needs the conversation to exist first: the file browser appears once you have sent the first message, and the terminal is not offered in temporary chats at all. See [Terminal Contexts](/features/open-terminal/terminals/orchestration/contexts).
:::

## More things to try

- **[Analyze documents & data →](./use-cases/file-analysis)**: drag in a spreadsheet or PDF and ask about it
- **[Run code from chat →](./use-cases/code-execution)**: the AI creates files you can see here
- **[Build & preview websites →](./use-cases/web-development)**: the files the AI creates appear in the browser

:::tip
Want to browse and edit your real files from any device? [**Open WebUI Computer**](/ecosystem/computer) puts your entire machine in a browser tab, with a full file browser, terminal, git, and editor.
:::
