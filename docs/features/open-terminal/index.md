---
sidebar_position: 3
title: "Open Terminal"
---

# ⚡ Open Terminal

**Give your AI a real computer to work on.**

Open Terminal connects a sandboxed Linux environment to Open WebUI, allowing the AI to execute code, manage files, install packages, and return results directly in the chat.

{/* TODO: Screenshot — A chat conversation where a user asks "What's 2+2 in Python?" and the AI creates and runs a script, showing the result "4" inline. The file browser is visible on the right side of the screen. */}

---

## Capabilities

### Data analysis and reporting

Upload spreadsheets, CSVs, or databases. The AI reads the data, runs analysis scripts, and generates charts or reports.

{/* TODO: Screenshot — A user dragging an .xlsx file into the file browser sidebar. The AI responds with a text summary of the data and an embedded chart image showing expenses by category. */}

### Document search and extraction

Point the AI at a folder of PDFs, Word docs, or emails. It reads all of them and returns structured results — summaries, extracted fields, or cross-references.

{/* TODO: Screenshot — A chat where the user asks about the Johnson contract. The AI lists the files it found in a folder (contract_v2.docx, notes.pdf, invoice.xlsx) and provides a consolidated summary of relevant information from each. */}

### Web development with live preview

The AI builds HTML/CSS/JS projects, starts a preview server, and renders the result inside Open WebUI. Iterate by describing changes in chat.

{/* TODO: Screenshot — A chat on the left side of the screen. On the right, a live website preview panel shows a clean event landing page with a banner, date, and registration button. */}

### Software development

Clone repos, run test suites, debug failures, refactor code, and work with Git — all through natural language.

### File and system automation

Bulk rename, sort, deduplicate, convert, compress, and organize files. Manage disk space, schedule backups, process logs.

{/* TODO: Screenshot — A chat where the user asks "rename all the photos to include the date". The AI responds confirming "Renamed 43 files" with a before/after example: IMG_4521.jpg → 2025-03-15_IMG_4521.jpg. */}

---

## Key Features

| | |
| :--- | :--- |
| 🖥️ **Code execution** | Runs real commands and returns output |
| 📁 **File browser** | Browse, upload, download, and edit files in the sidebar |
| 📄 **Document reading** | PDF, Word, Excel, PowerPoint, RTF, EPUB, email |
| 🌐 **Website preview** | Live preview of web projects inside Open WebUI |
| 🔒 **Sandboxed** | Runs in an isolated container by default |

---

## Get Started

**[Installation →](./setup/installation)** · **[Connect to Open WebUI →](./setup/connecting)**

:::info Model requirements
Open Terminal requires models with **native function calling** support. Frontier models (GPT-5.4, Claude Sonnet 4.6, Gemini 3.1 Pro) handle complex multi-step tasks well. Smaller models may work for simple commands but can struggle with longer workflows. [Enable native function calling](./setup/connecting#8-enable-native-function-calling) on your model.
:::

---

## Use Cases

- **[Code execution](./use-cases/code-execution)** — write, run, and debug scripts
- **[Software development](./use-cases/software-development)** — repos, tests, debugging, refactoring, Git
- **[Document & data analysis](./use-cases/file-analysis)** — spreadsheets, PDFs, Word docs, emails
- **[Web development](./use-cases/web-development)** — build and preview websites
- **[System automation](./use-cases/system-automation)** — file management, backups, batch operations
- **[Advanced workflows](./use-cases/advanced-workflows)** — skills for data reports, research, code review, and more
- **[File browser](./file-browser)** — uploading, previewing, editing files
