---
sidebar_position: 12
title: "🔧 RAG Configuration and Settings Explained"
---

# RAG Configuration and Settings Explained

The RAG feature in Open WebUI is powerful, but its many configuration options can be overwhelming. This guide explains the key settings, what they do, when to use them, and how to fill in each field properly. Whether you're just starting out or customizing advanced behavior, this guide (in progress) aims to support you end-to-end.

---

## Content Extraction Engine Options

Open WebUI supports multiple engines for extracting content from uploaded documents. Choosing the right one improves retrieval quality and ensures your documents are correctly processed.

### Default

- **Use case**: Standard PDFs, Word docs, or plain text.
- **Fields**: None.
- **Notes**: Easiest to get started with. No setup needed.

---

### External

- **Use case**: When you have a custom service or plugin that extracts document content.
- **Fields Required**:
  - **External Document Loader URL**: The API endpoint your service exposes.
  - **API Key**: The key required to authenticate your request.
- **When to use**: For integrating proprietary or external document loaders (e.g. internal enterprise pipelines).

---

### Apache Tika

- **Use case**: Rich support for diverse file types (PDFs, DOCX, spreadsheets, HTML, etc.).
- **Fields Required**:
  - **Tika Server URL**: Default is `http://tika:9998`
- **Notes**:
  - Java-based service; ensure the Tika server is running.
  - Best for robust multi-format support.
- **When to use**: Complex formats; need open-source content parsing with wide compatibility.

---

### Docling

- **Use case**: Structured parsing (PDFs, HTML, images) -> into (layout, tables etc.) -> (Markdown/JSON).
- **Fields Required**:
  - **Docling Server URL**: Typically `http://docling:5001`
  - **OCR Engine**: e.g., `tesseract`
  - **Languages**: Comma-separated (e.g., `eng,fra,deu`)
  - **Describe Pictures in Documents**: Toggle this if image captions should be generated.
- **When to use**: For multiple document types, multilingual documents, images in documents, or structured output like Markdown.

---

### Datalab Marker API

- **Use case**: AI-enhanced parsing into Markdown, JSON, or HTML with LLM assistance.
- **Fields Required**:
  - **API Key**
  - **Languages**: e.g., `en,fr,de`
  - **Use LLM**: Toggle if LLM should help interpret layout or meaning.
  - **Skip Cache**: Forces fresh parsing, bypassing previous cache.
  - **Force OCR**: Forces OCR on all pages of the document.
  - **Paginate**: Toggle to respect visual pagination.
  - **Strip Existing OCR**: Ignore embedded OCR and reprocess with your own.
  - **Disable Image Extraction**: Prevent extraction of images in PDF.
  - **Output Format**: e.g., `Markdown`, `JSON`, or `HTML`.
- **When to use**: If you need layout-aware parsing, Markdown output, or AI-assisted structure understanding.

---

### Document Intelligence

- **Use case**: Azure or custom AI-powered parsing for contracts, invoices, etc.
- **Fields Required**:
  - **Endpoint URL**: Your hosted Document Intelligence endpoint.
  - **API Key**
- **When to use**: Smart understanding of structured documents (tables, figures, headers, forms, etc.).

---

### Mistral OCR

- **Use case**: OCR (Optical Character Recognition) parsing from scanned documents or photos.
- **Fields Required**:
  - **API Key**
- **When to use**: Low-quality scans, handwritten content, or documents with no embedded text.

---

## Text Splitter Modes

- **Default (Character-based)**

  - Splits text by character count.
  - Best for: Simplicity, short documents.

- **Token-based (Tiktoken)**
  - Splits by token count (i.e., model-relevant units).
  - Best for: When using OpenAI models, efficiency is crucial, managing costs, fine-tuning context size, or matching LLM token limits.

---

## Embedding Model Engine

Embeddings are vector representations used for semantic search.

### Default (SentenceTransformers)

- **Model**: `sentence-transformers/all-MiniLM-L6-v2`
- **When to use**: Local and cost-free. Good performance for general tasks.

---

### Ollama

- **Fields Required**:
  - **Ollama Host URL**: e.g., `http://host.docker.internal:11434`
  - **API Key**
  - **Embedding Model**: e.g., `nomic-embed-text`
  - **Embedding Batch Size**: Adjust for performance tradeoffs.
- **When to use**: When you're using Ollama locally or hosting private LLMs.

---

### OpenAI

- **Fields Required**:
  - **Base URL**: e.g., `https://api.openai.com/v1`
  - **API Key**
  - **Embedding Model**: e.g., `text-embedding-3-small`
  - **Embedding Batch Size**
- **When to use**: Best model quality, but incurs cost and privacy concerns.

---

### Azure OpenAI

- **Fields Required**:
  - **API Base URL**
  - **API Key**
  - **Deployment Version**
  - **Embedding Model**
  - **Embedding Batch Size**
- **When to use**: When using Azure-hosted OpenAI models in enterprise settings.

⚠️ **Note**: If you change your embedding model, you **must re-import documents** so that embeddings match the new model.

---

## Retrieval Settings

### Full Context Mode

- **What it does**: Combines all retrieved document chunks into a single input to the model.
- **Best for**: Complex queries, short documents or cases where full context improves answers.
- **Caution**: Be sure to watch your model’s token limit — long context may lead to errors or truncation.

---

## Hybrid Search (Keyword + Semantic Search)

Hybrid Search combines two powerful search strategies to improve how relevant documents are retrieved in your RAG setup. It’s especially useful when working with large, messy, or complex datasets where either strategy alone might miss important matches.

### What Is Hybrid Search?

Hybrid Search blends:

- **BM25 (Keyword-Based Search)**  
  A traditional information retrieval algorithm that looks for documents containing exact or similar words from your query.

  - Fast and reliable.
  - Great for short queries or when you want precise keyword matching.
  - Example: Searching "employment standards" will prioritize documents that contain those exact terms.

- **Neural Re-ranking (Semantic Search)**  
  A model (like `bge-reranker`) evaluates how _semantically_ relevant each document is to your query — even if the wording is different.
  - Understands meaning and context.
  - Especially helpful when the question and the answer use different vocabulary.

By combining them, Hybrid Search ensures you get both high recall (from keyword matching) and high precision (from semantic understanding).

---

### Hybrid Search Parameters

| Field                        | Description                                                                          | When to Adjust                                                                                                                              |
| ---------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reranking Engine**         | The semantic model that scores and ranks the top BM25 results.                       | Use a well-performing model like `BAAI/bge-reranker-v2-m3` for best results.                                                                |
| **Top K**                    | How many top documents to retrieve from BM25 keyword search before reranking.        | Increase to explore more results.                                                                                                           |
| **Top K Reranker**           | Number of top documents to return _after_ semantic reranking is applied.             | Adjust to control the final number of documents passed to the model. A range of 3–5 works well in most cases.                               |
|                              |
| **Relevance Threshold**      | Only return documents with a final relevance score above this threshold (0.0–1.0).   | Raise this to filter out weak matches. A value of 0.75 means “only show highly relevant docs.”                                              |
| **Weight of BM25 Retrieval** | Controls how much influence BM25 scores have versus reranker scores. Range: 0.0–1.0. | Lower values give more power to the semantic reranker. Set to 0.3–0.5 if you want the results to prioritize meaning over exact word matches |

---

### When Should You Use Hybrid Search?

Enable Hybrid Search when:

- You have **many documents**, and keyword search alone misses subtle answers.
- You want to improve **precision** and **reduce irrelevant results**.
- Your dataset mixes **scanned text, long documents, or diverse file types**.

If your RAG system is returning irrelevant results or missing useful documents that contain paraphrased answers, Hybrid Search is likely to help.

---

Not Done
