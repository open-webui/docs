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

An uploaded image or video is normally stored as-is for vision models to look at, rather than being run through the extraction engine. Only the [`external` engine](/features/chat-conversations/rag/document-extraction/external) received media, and only because it was special-cased.

[`CONTENT_EXTRACTION_SUPPORTED_MEDIA_MIME_TYPES`](/reference/env-configuration#content_extraction_supported_media_mime_types), or **Supported Media MIME Types** in **Settings > Admin > Documents**, makes that a choice rather than a rule: list the MIME types your engine can actually read, for instance `image/*` for an OCR engine, and matching uploads are extracted whichever engine you run. Leave it empty to keep the previous behavior.

:::

## Available Extraction Methods

Open WebUI supports multiple document extraction engines to accommodate different needs and document types. Each extraction method has its own strengths and is suitable for different scenarios.

Explore the documentation for each available extraction method to learn how to set it up and use it effectively with your Open WebUI instance.
