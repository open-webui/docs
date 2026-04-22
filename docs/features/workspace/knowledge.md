---
sidebar_position: 4
title: "Knowledge"
---

# 📚 Knowledge

**Give your AI access to your documents and let it find what matters.**

Knowledge is where you store the files and collections that your AI can search, read, and reason over. Upload PDFs, spreadsheets, code, or any text-based document. Build collections around projects, teams, or topics. When a model needs an answer, it pulls from your knowledge base instead of guessing.

Unlike [Notes](/features/notes), which inject full content into every message, Knowledge uses retrieval (RAG) to find the relevant chunks on demand. This makes it the right choice for large document sets where injecting everything would exceed the context window.

---

## Why Knowledge?

### Your documents become searchable by AI

Upload a folder of contracts, technical specs, or research papers. The AI searches them by meaning, not just keywords, and cites where it found the answer.

### Two retrieval modes for different needs

Choose **Focused Retrieval** (RAG) to let the AI search large collections efficiently, or **Full Context** to inject an entire document word-for-word when precision matters.

### Autonomous exploration with native function calling

With [native function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models don't just search. They browse your knowledge bases, read files page by page, and synthesize across multiple documents without manual prompting.

### Scoped access keeps things organized

Attach specific knowledge bases to a model so it only searches what's relevant. Or leave it unscoped and let the model discover everything the user has access to.

---

## Key Features

| | |
| :--- | :--- |
| 📄 **9 vector databases** | ChromaDB and PGVector (officially maintained), plus community options: Qdrant, Milvus, OpenSearch, Elasticsearch, and more |
| 🔍 **Hybrid search** | BM25 keyword search + vector search with cross-encoder reranking |
| 📑 **5 extraction engines** | Tika, Docling, Azure, Mistral OCR, custom loaders |
| 🤖 **Agentic retrieval** | Models browse, search, and read your documents autonomously |
| 📄 **Full context mode** | Inject entire documents with no chunking |
| 📦 **Export and API** | Back up knowledge bases as zip files, manage via REST API |

---

## Retrieval Modes

When attaching files or knowledge bases to a model, click on the attached item to toggle between modes:

### 🔍 Focused Retrieval (default)

Uses RAG to find and inject the most relevant chunks based on the user's query. When hybrid search is enabled (`ENABLE_RAG_HYBRID_SEARCH`), retrieval combines BM25 keyword search with vector search, plus reranking for accuracy.

Best for large document sets where only specific sections are relevant.

### 📄 Full Context

Injects the complete content of the file into every message. No chunking, no semantic search. Always injected regardless of native function calling settings, so the model doesn't need to call any tools to access it.

Best for short reference documents, style guides, or context that's always relevant.

---

## Agentic Knowledge Tools

With [native function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models interact with your knowledge bases using built-in tools. Which tools appear depends on whether specific knowledge is attached to the model:

| Tool | Attached KB | No KB attached | Description |
|------|:-----------:|:--------------:|-------------|
| `list_knowledge` | ✅ | ❌ | List all KBs, files, and notes attached to the model |
| `list_knowledge_bases` | ❌ | ✅ | Browse available knowledge bases with file counts |
| `search_knowledge_bases` | ❌ | ✅ | Find knowledge bases by name or description |
| `query_knowledge_bases` | ❌ | ✅ | Search KB names/descriptions by semantic similarity |
| `search_knowledge_files` | ✅ (scoped) | ✅ (all) | Search files by filename |
| `query_knowledge_files` | ✅ (scoped) | ✅ | Search file contents using the RAG pipeline |
| `view_file` | ✅ | ❌ | Read file content with pagination (default 10K chars, cap 100K) |
| `view_knowledge_file` | ✅ | ✅ | Read file content from any accessible KB |
| `view_note` | ✅ | ❌ | Read attached notes |

The key split: `list_knowledge` and `list_knowledge_bases` are mutually exclusive. Attaching a KB scopes the model to only those documents. Leaving it unscoped lets the model discover everything the user has access to.

Autonomous exploration works best with frontier models that can intelligently chain search, browse, and synthesize. Smaller models may struggle with multi-step retrieval. Administrators can disable the **Knowledge Base** tool category per-model in **Workspace > Models > Edit > Builtin Tools**.

For the full list of built-in agentic tools, see the [Native/Agentic Mode Tools Guide](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode).

:::warning Knowledge is NOT auto-injected with native function calling

When native function calling is enabled, attached knowledge is **not automatically injected**. The model must call the knowledge tools to search and retrieve. If your model isn't using attached knowledge:

1. **Add system prompt instructions** telling the model to use `list_knowledge` and `query_knowledge_files`.
2. **Disable native function calling** for that model to restore automatic RAG injection.
3. **Switch to Full Context mode** for the attachment to bypass RAG entirely.
:::

---

## Setting Up a Knowledge Base

1. Click **Workspace** in the sidebar, then select **Knowledge**.
2. Click **+ New Knowledge** and give it a name and description.
3. Upload files or add existing documents.
4. Attach the knowledge base to a model in **Workspace > Models > Edit**, or reference it in chat with `#`.

### Exporting

Admins can export an entire knowledge base as a zip file via the item menu (three dots) > **Export**. Files are converted to `.txt` for universal compatibility. Regular users will not see the Export option.

### API access

Knowledge bases can be managed programmatically:

- `POST /api/v1/files/` - Upload files
- `GET /api/v1/files/{id}/process/status` - Check processing status
- `POST /api/v1/knowledge/{id}/file/add` - Add files to a knowledge base

File processing happens asynchronously. You must poll the status endpoint until processing completes before adding files to a knowledge base, or you'll get an "empty content" error. See [API Endpoints](/reference/api-endpoints#-retrieval-augmented-generation-rag) for workflow examples.

---

## Use Cases

### Project documentation

Upload your team's technical specs, architecture docs, and runbooks into a knowledge base. Attach it to a "Project Assistant" model. The AI answers questions grounded in your actual documentation instead of generic training data.

### Legal and compliance review

Load contracts, policies, and regulatory documents. Ask the AI to find specific clauses, compare terms across agreements, or flag inconsistencies.

### Research synthesis

Add dozens of papers to a knowledge base. The AI searches across all of them to answer questions, find supporting evidence, or identify contradictions between studies.

---

## Limitations

### Context window with Full Context mode

"Using Entire Document" injects the full text. A large document attached to a model with a small context window will crowd out conversation history.

### Processing delay for API uploads

Files uploaded via API are processed asynchronously. Attempting to use a file before processing completes will fail silently or return empty results.

### Per-group upload limits

Administrators can cap how many files a user may add to a knowledge base and how large each file may be. These limits are configured per group in **Admin Panel > Users > Groups > Permissions > Knowledge Max Files / Knowledge Max File Size**.

- `0` or empty means unlimited.
- When a user belongs to multiple groups, the most-permissive value wins: if any group grants unlimited, the user has no cap; otherwise the highest limit across groups applies.
- Admins always bypass both limits.

If a user hits a limit they will see an error before any file processing begins.

### Native function calling changes behavior

Enabling native function calling changes how knowledge bases work. If your KB suddenly stops producing results, check whether `function_calling: native` was set in global model defaults. See [Knowledge Base troubleshooting](/troubleshooting/rag#13-knowledge-base-attached-to-model-not-working) for details.
