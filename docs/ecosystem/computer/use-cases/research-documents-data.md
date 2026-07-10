---
title: "Work with local documents and data"
sidebar_position: 4
---

# Work with local documents and data

Open the report and data file you already have, then save one findings note beside them. That is the first useful result: the source material and your conclusion stay together in the real folder instead of becoming scattered uploads and downloads.

Use this when the report, spreadsheet, PDF, or source material you need is already on your computer. Open WebUI Computer keeps the source files and working note together. A generic chat can summarize an attachment, but it does not naturally keep your original documents, local data files, and conclusion together.

## Use this when

You are reading reports, comparing a CSV or spreadsheet, organizing sources for a school or work project, or turning a pile of local material into a concise set of findings. You do not need to use AI for this workflow. The file browser and previews are useful on their own.

## Before you start

- Complete the [local trial](/ecosystem/computer/getting-started/local-trial) and create a workspace for the folder that holds the material.
- Decide whether the documents are safe to place in that workspace. Optional AI help sends relevant prompt and file context to its configured provider, so keep sensitive files local if you do not have a provider and data-handling arrangement you trust.
- Use copies when the source material must remain unchanged. Open WebUI Computer shows the real files in the selected folder.

## Do it

1. Open the workspace and use the file browser to open existing files or upload deliberate copies into a project subfolder.
2. Open a report and a related data file in tabs or split panes. The editor can preview PDFs, CSV and TSV data, and common Office files such as DOCX and XLSX.
3. Create a short Markdown note in the workspace, such as `findings.md`, and record the question, source filenames, and what you observed.
4. Optional: if you have configured an AI model you trust, ask a bounded question in the workspace chat, such as “Read these two files and list differences I should check. Do not change files.” Review its answer against the open source files.
5. Save the note beside the sources so the next session starts with the material and conclusion together.

## Verify it worked

The file browser shows the expected original files or intentional copies, the document and data previews match the selected filenames, and `findings.md` is visible in the same workspace. Close and reopen the workspace: the sources and note return together rather than existing only in a past chat upload.

## If it did not

- If a file will not open or preview, confirm its extension and open it with the native application on the host. Keep the workspace note with the file path and next step.
- If a file was uploaded to the wrong folder, move it only after confirming it is the intended copy, then adjust the destination before uploading more.
- If an AI cannot read a source or gives an unsupported conclusion, return to the file preview, narrow the question, and verify the answer against the document. Do not treat a model summary as a citation or a replacement for the source.

## Trust boundary

Files in a workspace are real host files, and uploaded copies become real workspace data. An optional API model may receive the prompt, selected context, and tool results needed for the request. Do not send confidential documents to a provider unless that use is approved, and do not let an AI modify source material without review.
