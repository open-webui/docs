---
sidebar_position: 1
title: "Document Extraction"
---

## Document Extraction in Open WebUI

Open WebUI provides powerful document extraction capabilities that allow you to process and analyze various types of documents within your RAG (Retrieval Augmented Generation) workflows. Document extraction is essential for transforming unstructured document content into structured data that can be effectively used by language models.

## What is Document Extraction?

Document extraction refers to the process of automatically identifying and extracting text and data from various file formats, including:

- PDFs (both text-based and scanned)
- Images containing text
- Handwritten documents
- And more

With proper document extraction, Open WebUI can help you:

- Convert image-based documents to searchable text
- Preserve document structure and layout information
- Extract data in structured formats for further processing
- Support multilingual content recognition

:::note Privacy in Temporary Chats
In **Temporary Chat** mode, document extraction is performed **exclusively in the browser** to prevent data from being stored or processed on the backend. This strict privacy measure means that some complex file formats (like certain DOCX files) that rely on backend parsers may not be processed correctly.
:::

:::info Sending images and video to your extraction engine

An uploaded image or video is stored as-is for vision models to look at instead of being run through the extraction engine. The [`external` engine](/features/chat-conversations/rag/document-extraction/external) receives media by default.

[`CONTENT_EXTRACTION_SUPPORTED_MEDIA_MIME_TYPES`](/reference/env-configuration#content_extraction_supported_media_mime_types), or **Supported Media MIME Types** in **Settings > Documents** (admin section), lets you choose: list the MIME types your engine can read, for instance `image/*` for an OCR engine, and matching uploads are extracted whichever engine you run. Saving the field empty from the admin panel, or setting the variable to an empty string, stores an empty list, which turns media extraction off for every engine, the external one included.

:::

## PDF Loader Mode

With the default **Content Extraction Engine**, **PDF Loader Mode** in **Settings > Documents** (admin section), or [`PDF_LOADER_MODE`](/reference/env-configuration#pdf_loader_mode), decides how a PDF's pages are turned into text before chunking. Other engines ignore it.

| | **Page** (default) | **Single** |
| --- | --- | --- |
| Text | One document per page | All pages joined into one document |
| Chunks | Never span a page break | Can run across page breaks |
| Citations | Show `(page N)` and open the PDF at that page | Show no page number |

Pick **Single** when sentences or tables often continue onto the next page and you can do without page numbers in citations. The mode applies when a file is extracted. Files already in a knowledge base change only after **Reindex Knowledge and Memory Vectors** in the same settings page, which extracts them again.

## Files Without a Dedicated Loader

With the default **Content Extraction Engine**, a file whose extension has no loader of its own is read as plain text. Source code and configuration files, such as `.py`, `.js`, `.ts`, `.go`, `.sql`, `.json`, `.yaml` or `.toml`, work in RAG this way. A binary format with no loader, such as `.ods` or `.odp`, is read the same way and produces unreadable text instead of an error, so retrieval returns noise from it. On the slim image such a file fails with `This file type requires an external document extractor in slim. Configure one that supports it.` instead.

To accept only the formats you know extract well, list them without the leading dot in **Allowed File Extensions** in **Settings > Documents** (admin section), or in [`RAG_ALLOWED_FILE_EXTENSIONS`](/reference/env-configuration#rag_allowed_file_extensions). Uploads with any other extension then fail with `File type <extension> is not allowed`.

## Available Extraction Methods

Open WebUI supports multiple document extraction engines to accommodate different needs and document types. Each extraction method has its own strengths and is suitable for different scenarios.

Explore the documentation for each available extraction method to learn how to set it up and use it effectively with your Open WebUI instance. Four engines have no page of their own yet: Datalab Marker, MinerU, Azure Document Intelligence and PaddleOCR-VL. Their settings are listed in the [environment variable reference](/reference/env-configuration#rag-content-extraction-engine).
