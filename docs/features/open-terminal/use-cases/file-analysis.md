---
sidebar_position: 2
title: "Analyze Documents & Data"
---

# Analyze Your Documents and Data

Got a pile of spreadsheets, PDFs, Word documents, or emails you need to make sense of? Drop them into the file browser and let the AI read them for you. Open Terminal can open and understand all of these formats — no special setup needed.

## What file types can it read?

| Type | Formats |
| :--- | :--- |
| **Spreadsheets** | Excel (.xlsx, .xls), OpenDocument (.ods), CSV |
| **Documents** | Word (.docx), OpenDocument (.odt), Rich Text (.rtf), PDF |
| **Presentations** | PowerPoint (.pptx), OpenDocument (.odp) |
| **Other** | Email (.eml), E-books (.epub), plain text, HTML, Markdown, JSON, XML |

The AI can read all of these directly — it doesn't need to upload them to any external service. Everything stays on your server.

---

## "Summarize this report"

> **You:** *(drag-drop a PDF into the file browser)* <br/>
> Can you read this quarterly report and give me the key takeaways?

The AI opens the PDF, reads through it, and gives you a concise summary — pulling out revenue figures, key decisions, notable changes, whatever matters.

{/* TODO: Screenshot — File browser showing a quarterly_report.pdf file that was just uploaded. The chat shows the AI's response: a bulleted summary with key financial figures, decisions made, and upcoming milestones. */}

{/* TODO: Screenshot — A follow-up question: "What was the total revenue?" with the AI pulling the exact number from the document. */}

---

## "Go through all those invoices"

> **You:** There are about 30 invoices in the /invoices folder. Can you read them all and make a spreadsheet with the vendor name, date, and amount?

The AI opens every file in the folder — even if they're a mix of PDFs and Word documents — extracts the information, and creates a clean spreadsheet you can download.

{/* TODO: Screenshot — Chat showing the AI listing files found in /invoices (invoice_001.pdf, invoice_002.docx, invoice_003.pdf, etc.). The AI reports "Reading 30 files..." */}

{/* TODO: Screenshot — The AI's response: "Done! I created invoices_summary.csv with columns: Vendor, Date, Amount, File. Here's a preview:" followed by a table showing the first few rows. */}

{/* TODO: Screenshot — File browser showing invoices_summary.csv, previewed as a formatted table with the extracted data. */}

---

## "What do these emails say about the deadline?"

> **You:** *(upload several .eml files)* <br/>
> Read through these emails and find any mentions of deadlines or due dates.

The AI reads the email files — including sender, date, subject, and body — and pulls out the relevant information.

{/* TODO: Screenshot — Chat showing the AI reading 5 email files. It responds with a list: "I found 3 mentions of deadlines:" with the email subject, date, and the relevant sentence highlighted for each. */}

---

## "Analyze this data and make a chart"

> **You:** *(drop a sales_data.xlsx into the file browser)* <br/>
> Break down the sales by region and make a pie chart.

The AI reads the spreadsheet, processes the data, creates a chart, and saves it as an image you can preview and download.

{/* TODO: Screenshot — Chat showing the AI reading the spreadsheet (it reports the sheet names and row count), then confirming it created "sales_by_region.png". */}

{/* TODO: Screenshot — File browser previewing the generated pie chart showing sales broken down by region with percentages. */}

---

## "Search across all these documents"

> **You:** Search through everything in the /contracts folder for any mention of "termination clause" or "cancellation".

The AI searches across every file — PDFs, Word docs, spreadsheets, whatever's there — and tells you exactly where it found matches.

{/* TODO: Screenshot — Chat showing the AI searching through 12 files and finding matches in 3 of them. For each match, it shows the filename and the surrounding context: "...either party may invoke the termination clause with 30 days written notice..." */}

:::tip No indexing required
Unlike traditional search or RAG systems, the AI reads files live every time you ask. That means it always sees the latest version — no re-indexing, no sync delays, no database to manage.
:::

---

## Working with large files

If a document is very long, the AI is smart about reading it in sections rather than all at once. You can also ask it to focus on specific parts:

> "Read just the executive summary section of this report"

> "Show me rows 500 through 600 of this spreadsheet"

## More things to try

- **[Run code from chat →](./code-execution)** — the AI writes, runs, and debugs code
- **[Build & preview websites →](./web-development)** — create and iterate on web pages
- **[Explore the file browser →](../file-browser)** — upload, preview, download, and edit files
