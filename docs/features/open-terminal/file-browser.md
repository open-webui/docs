---
sidebar_position: 10
title: "File Browser"
---

# The File Browser

When Open Terminal is connected, a **file browser** appears in the sidebar of your chat. It works like the file explorer on your computer — you can browse folders, open files, upload things, and download results. Everything the AI creates shows up here automatically.

![Chat interface with the file browser sidebar](/images/open-terminal-file-browser.png)

---

## Browsing

Click folders to navigate, and click files to preview them. A breadcrumb bar at the top shows where you are.

![Browsing a project directory with breadcrumb navigation](/images/open-terminal-file-browser-project.png)

---

## Previewing files

Click any file to see a preview. Different file types display differently:

### Text and code
Source code and text files are shown with syntax highlighting and line numbers.

![Python code with syntax highlighting and line numbers](/images/open-terminal-preview-code.png)

### PDFs
PDF documents render directly in the browser — you can read them without downloading.

![File browser with rendered markdown preview](/images/open-terminal-preview-markdown.png)

### Spreadsheets (CSV, TSV)
Data files render as **formatted tables** with headers and clean rows — much easier to read than raw comma-separated text.

![CSV data rendered as a clean table](/images/open-terminal-preview-csv.png)

### Markdown
Markdown files show a **rendered preview** (with formatted headings, links, bold text) and a toggle to switch to raw source.

![Rendered markdown with headings, lists, and formatted text](/images/open-terminal-preview-markdown.png)

### Images
Images display inline at a comfortable size.

![File browser displaying an image preview](/images/open-terminal-file-browser-home.png)

---

## Uploading files

**Drag and drop** files from your computer directly onto the file browser to upload them. This is how you share data with the AI — drop a spreadsheet, a PDF, an image, or any file you want the AI to work with.

![File browser showing uploaded files with names and sizes](/images/open-terminal-file-browser-home.png)

:::tip Upload to any folder
Navigate to the folder you want first, then drag and drop. The file uploads to whatever directory you're currently viewing.
:::

---

## Downloading files

Click the **download button** on any file to save it to your computer. This is how you get results back: after the AI generates a chart, creates a spreadsheet, processes an image, or writes a report, just download it.

![File browser with download and action buttons](/images/open-terminal-file-browser-project.png)

---

## Editing files

Click the **edit icon** on any text file to open it in an editor. Make your changes and save. This is handy for quick fixes — editing a config value, correcting a typo, or tweaking something the AI generated.

![Editing a file directly in the file browser](/images/open-terminal-preview-code.png)

---

## Creating and deleting

You can create new files and folders, or delete things you don't need anymore, directly from the file browser.

![File browser action bar with New File, New Folder options](/images/open-terminal-file-browser-home.png)

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

## More things to try

- **[Analyze documents & data →](./use-cases/file-analysis)** — drag in a spreadsheet or PDF and ask about it
- **[Run code from chat →](./use-cases/code-execution)** — the AI creates files you can see here
- **[Build & preview websites →](./use-cases/web-development)** — the files the AI creates appear in the browser
