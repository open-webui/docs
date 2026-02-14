---
slug: /features/rag/document-extraction/
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

## Available Extraction Methods

Open WebUI supports multiple document extraction engines to accommodate different needs and document types. Each extraction method has its own strengths and is suitable for different scenarios.

Explore the documentation for each available extraction method to learn how to set it up and use it effectively with your Open WebUI instance.
