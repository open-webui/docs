---
sidebar_position: 1
title: "Retrieval Augmented Generation (RAG)"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

<ThemedImage
  alt="Documents: a stack of sheets with one slid out"
  sources={{
    light: useBaseUrl('/images/banners/chat-conversations-documents-light.svg'),
    dark: useBaseUrl('/images/banners/chat-conversations-documents-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

:::warning

If you're using **Ollama**, note that it **picks a model's default context length from your GPU's VRAM, and on GPUs with less than 24 GiB that is 4096 tokens** (see [Ollama's context length documentation](https://docs.ollama.com/context-length)). This severely limits **Retrieval-Augmented Generation (RAG) performance**, especially for web search, because retrieved data may **not be used at all** or only partially processed.

:::

Retrieval Augmented Generation (RAG) is a technique that enhances the conversational capabilities of chatbots by incorporating context from diverse sources. It works by retrieving relevant information from a wide range of sources such as local and remote documents, web content, and even multimedia sources like YouTube videos. The retrieved text is then combined with a predefined RAG template and prefixed to the user's prompt, providing a more informed and contextually relevant response.

One of the key advantages of RAG is its ability to access and integrate information from a variety of sources, making it an ideal solution for complex conversational scenarios. For instance, when a user asks a question related to a specific document or web page, RAG can retrieve and incorporate the relevant information from that source into the chat response. RAG can also retrieve and incorporate information from multimedia sources like YouTube videos. By analyzing the transcripts or captions of these videos, RAG can extract relevant information and incorporate it into the chat response.

## Local and Remote RAG Integration

To use a local document in RAG, add it to a knowledge base in **Workspace > Knowledge** or upload it in a chat. In a chat, type `#` before your query and select the document from the suggestion box that appears above the message input. Once selected, a document icon appears above `Send a message`, indicating that the document has been attached for retrieval.

![Document and retrieval settings](/images/admin/admin-documents.png)

:::tip Bulk File Management
Need to clean up multiple uploaded documents or audit your storage? Use the centralized **[File Manager](/features/chat-conversations/data-controls/files)** located in **Settings > Data Controls > Manage Files**. Deleting files there will automatically clean up their corresponding RAG embeddings.
:::

## External Knowledge Sources (External Vector Databases)

:::warning Experimental
This feature is experimental, and its configuration may change between releases.
:::

Instead of uploading and embedding documents inside Open WebUI, you can point a knowledge base at an **external vector database** you already maintain. Open WebUI queries it directly at chat time, so your documents, embeddings and indexing stay in your own store and are never re-ingested.

Supported providers: **Qdrant**, **Milvus** and **pgvector**. The provider's Python client must be present in your Open WebUI image (for example `qdrant-client` or `pymilvus`).

### Adding an external knowledge source

Configure these under **Settings > Integrations > External Knowledge Sources** (admin section):

1. **Create a connection** to your vector database:
   - **Provider** (Qdrant / Milvus / pgvector)
   - **Endpoint** (the database URL)
   - **API Key / Token** (if your database requires authentication)
   - **Database** / **Table** / **Collection** (depending on the provider)
   - **Timeout**
2. **Map the result fields** so Open WebUI knows how to read your records. Each setting maps a field in your stored documents to what Open WebUI expects:

   | Open WebUI field | Mapping setting | Default field |
   | :--- | :--- | :--- |
   | Chunk text | **Content Field** | `content` |
   | Title | **Title Field** | `title` |
   | Source | **Source Field** | `source` |
   | URL | **URL Field** | `url` |
   | Document ID | **Document ID Field** | `document_id` |
   | Page | **Page Field** | `page` |
   | Extra metadata | **Metadata Field** | `metadata` |
   | Relevance score | **Score Field** | `score` |

   Dotted paths are supported for nested fields (for example `payload.text`).
3. **Test the query** with a sample question. Open WebUI runs a live retrieval against the source and shows the results. A successful test is required before you can create or save the source.

Once created, the external source appears in **Workspace > Knowledge** like any other knowledge base and can be attached to models or chats. At chat time, Open WebUI embeds the user's query with its configured RAG embedding model, searches the external database by vector, and feeds the top matches into the prompt. No copy of the documents is stored in Open WebUI.

With [Retrieval Query Generation](/reference/env-configuration#enable_retrieval_query_generation) on, all generated queries run at the same time. Their results are merged by rank (the top result of each query, then the second of each, and so on), duplicates are dropped and the list is cut to the result count.

In the sources under an answer, each result is listed by its title. When a result's **Source Field** holds a web address, clicking its title or the **Content** link in the citation opens that page; otherwise the title is plain text.

:::info Embedding model must match
Because Open WebUI embeds the query and searches your database by vector, the vectors stored in your external database must come from the **same embedding model** Open WebUI uses (matching model and dimensions). Mismatched embeddings produce poor or meaningless results.
:::

## Web Search for RAG

:::warning
**Context Length Warning for Ollama Users:** Web pages often hold 4,000-8,000+ tokens, so Ollama's 4096-token default cuts them off. See the warning at the top of this page and raise the context length to 8192 or more in the model's **Advanced Params**.
:::

For web content integration, start a query in a chat with `#`, followed by the target URL. Click on the formatted URL in the box that appears above the chat box. Once selected, a document icon appears above `Send a message`, indicating successful retrieval. Open WebUI fetches and parses information from the URL if it can. A link to a file, such as a PDF, is read with document extraction. If it cannot read the URL, the attempt fails with a message naming the link that could not be read, see [Attaching a link or a YouTube video fails](/troubleshooting/rag#14-attaching-a-link-or-a-youtube-video-fails).

:::tip

Web pages often contain extraneous information such as navigation and footer. For better results, link to a raw or reader-friendly version of the page.

:::

## RAG Template Customization

Customize the RAG template from the `Settings` > `Documents` (admin section) menu.

The RAG template formats the **retrieved context** and is prefixed to your message before it reaches the model. Use the `{{CONTEXT}}` placeholder (or the legacy `[context]`) to mark where the retrieved document context is inserted. Without it, retrieved context has nowhere to go.

:::warning Do not include a query placeholder
Your message (the query) is **always appended automatically** after the rendered template, so the model already sees it once. The template also recognizes `{{QUERY}}` / `[query]` and will substitute the query there, but because the query is still appended afterward, including that placeholder makes the query appear **twice** in the final prompt. Leave `{{QUERY}}` / `[query]` out of your template: it is a wrapper for the retrieved context, not the place to position the query.
:::

## Markdown Header Splitting

When enabled, documents are first split by markdown headers (H1-H6). This preserves document structure and ensures that sections under the same header are kept together when possible. The resulting chunks are then further processed by the standard character or token splitter.

:::tip

Use the **Chunk Min Size Target** setting (found in **Settings > Documents** (admin section)) to intelligently merge small sections after markdown splitting, improving retrieval coherence and reducing the total number of vectors in your database.

:::

## Chunking Configuration

Open WebUI allows you to fine-tune how documents are split into chunks for embedding. This is crucial for optimal retrieval performance.

- **Text Splitter**: Choose how chunk size is measured. [`RAG_TEXT_SPLITTER`](/reference/env-configuration#rag_text_splitter) is `character` (default, RecursiveCharacterTextSplitter), `token`, or `token_transformers`. The `token` splitter counts tokens with Tiktoken. The `token_transformers` splitter counts them with the HuggingFace tokenizer named by [`RAG_TOKENIZER_MODEL`](/reference/env-configuration#rag_tokenizer_model) (e.g. `bert-base-uncased`), which matches chunk boundaries to your embedding model's own tokenizer. It is unavailable on the slim image.
- **Chunk Size**: Sets the maximum number of characters (or tokens) per chunk.
- **Chunk Overlap**: Specifies how much content is shared between adjacent chunks to maintain context.
- **Chunk Min Size Target**: Although [Markdown Header Splitting](#markdown-header-splitting) is excellent for preserving structure, it can often create tiny, fragmented chunks (e.g., a standalone sub-header, a table of contents entry, a single-sentence paragraph, or a short list item) that lack enough semantic context for high-quality embedding. You can counteract this by setting the **Chunk Min Size Target** to intelligently merge these small pieces with their neighbors.

## RAG Embedding Support

Change the RAG embedding model in **Settings** > **Documents** (admin section). The embedding engine is the built-in SentenceTransformers default, Ollama, OpenAI or Azure OpenAI.

## Changing RAG Settings After Initial Setup

If you need to change your chunking configuration (chunk size, overlap) or embedding model after documents have already been indexed, it is important to understand what actions are required and what effects those changes will have.

### Changing Chunk Size and Overlap

New documents will **automatically** use the updated chunk size and overlap settings. No action is required for newly uploaded files.

Existing documents in knowledge bases **retain their original chunking** until you run a re-index. Retrieval will still work for these old chunks (vector similarity search does not depend on chunk size), but you may notice inconsistent retrieval quality if old and new documents have very different chunk sizes.

:::tip
If you are only changing chunk settings and not the embedding model, a re-index is not strictly required. Old documents will continue to work. However, for consistent retrieval quality across all documents, running a re-index is recommended.
:::

### Changing the Embedding Model

Changing the embedding model **requires a re-index** of all knowledge base documents. Embeddings from different models exist in different vector spaces and are not compatible with each other. Without re-indexing, retrieval against old embeddings will produce poor or nonsensical results.

After changing the embedding model, click the **Reindex** button in **Settings** > **Documents** (admin section) to re-embed all knowledge base documents with the new model.

### What Does Re-Indexing Do?

The re-index process performs the following steps for each knowledge base:

1. **Deletes** the existing vector collection for the knowledge base.
2. **Re-extracts** every file from its original upload using the current content extraction engine and its settings.
3. **Re-chunks** every file using the current chunk size, overlap and text splitter settings.
4. **Re-embeds** all chunks using the currently configured embedding model.
5. **Rebuilds** the per-file collection of every file in the knowledge base as well, so attaching one of those files to a chat on its own retrieves the same content as searching the knowledge base it belongs to.

This means a single re-index applies content extraction, chunking and embedding model changes simultaneously.

:::note Re-indexing parses the file again
Every file goes through the content extraction engine again, so allow for the extraction time on top of the embedding. Text edited in the knowledge base file viewer is replaced by the fresh extraction. Audio, image and video files keep their stored text, and so does a file whose original is missing or fails to extract.
:::

:::warning Re-indexing does not cover chat files
The re-index operation only processes files that belong to **knowledge bases**. Files that were uploaded directly into a chat (without being added to a knowledge base) have their own per-file vector collections that are not touched by re-indexing.

If you change the embedding model, those standalone chat file embeddings will still use the old model and retrieval quality for those files will degrade. The only way to update them is to re-upload the files.
:::

### Summary

| Change | New Documents | Knowledge Base Documents (no re-index) | Knowledge Base Documents (after re-index) | Standalone Chat Files |
|---|---|---|---|---|
| **Chunk Size / Overlap** | Uses new settings | Old chunks still work, but quality may vary | Re-chunked with new settings | Old chunks, re-upload to update |
| **Embedding Model** | Uses new model | Old embeddings, incompatible vector space | Re-embedded with new model | Old embeddings, re-upload to update |

## Citations in RAG Feature

The RAG feature allows users to easily track the context of documents fed to LLMs with added citations for reference points. This ensures transparency and accountability in the use of external sources within your chats. To let the model cite page numbers or other details stored with each chunk, set [`RAG_SOURCE_METADATA_KEYS`](/reference/env-configuration#rag_source_metadata_keys).

## Preload files vs Builtin Tools

Open WebUI provides two separate capabilities that control how files are handled. Understanding the difference is important for configuring models correctly.

### Preload files Capability

The **Preload files** capability controls whether Open WebUI performs RAG (Retrieval-Augmented Generation) on attached files. It is off by default with Native function calling and on with Legacy. The model editor and **Model Defaults** show the effective value. For API requests that do not come from a chat in the web UI, it is on unless the model saves a value for it, so files and knowledge sent in the `files` field reach the model.

| Preload files | Behavior |
|--------------|----------|
| **Enabled** | Attached files are processed via RAG. Content is retrieved and injected into the conversation context. |
| **Disabled** | File content is never extracted or injected. With Native or Default function calling, the model sees a list of the attached files and reads them with the builtin **Files** tools (`list_chat_files`, `query_chat_files`, `grep_chat_files`, `view_file`, `display_file`). These tools need the **Files** builtin tool category, the model's **File Upload** capability and the user's upload permission. |

**When to disable Preload files:**
- **Bypassing RAG entirely**: When you don't want Open WebUI to process attached files at all.
- **Using [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) only**: If you prefer the model to retrieve content on demand rather than having it pre-injected. Disabling Preload files is also what makes the [builtin **Files** tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) available, which let the model list, search and read the chat's attachments itself.
- **Debugging/testing**: To isolate whether issues are related to RAG processing.

:::warning Preload files Disabled = No Pre-Injected Content
When Preload files is disabled, file content is **not automatically extracted or injected**. Open WebUI does not forward files to the model's native API. If you disable this, the only way the model can access file content is through [builtin tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) (if enabled) that query knowledge bases or retrieve attached files on-demand (agentic file processing).
:::

:::tip Per-File Retrieval Mode
Individual files and knowledge bases attached in the chat can also be set to bypass RAG entirely using the **"Using Entire Document"** toggle. This injects the full file content into every message regardless of native function calling settings. Uploaded files and text attachments up to **Full Text Threshold (Characters)** in **Settings** > **Documents** (admin section) are included in full automatically, and **Always Use Full Text** applies it to every document. See [Full Context vs Focused Retrieval](/features/workspace/knowledge#retrieval-modes) for details.

To stop choosing per file, set **Default Upload Mode** in **Settings > Interface > File**: every file you attach then starts in the mode you picked, and can still be switched individually afterwards.
:::

:::info
The Preload files toggle only appears when **File Upload** is enabled for the model.
:::

### Builtin Tools Capability

The **[Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)** capability controls whether the model receives native function-calling tools for autonomous retrieval:

| Builtin Tools | Behavior |
|---------------|----------|
| **Enabled** (default) | Unless the model is set to Legacy, it receives tools like `query_knowledge_bases`, `view_knowledge_file`, `search_chats` and others. |
| **Disabled** | No [builtin tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) are injected. The model works only with pre-injected context. |

**When to disable [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode):**
- **Model doesn't support function calling**: Smaller or older models may not handle the `tools` parameter.
- **Predictable behavior needed**: You want the model to work only with what's provided upfront.

### Combining the Two Capabilities

These capabilities work independently, giving you fine-grained control, and the rows below describe files and knowledge bases attached **inside the chat** on a model set to Default or Native function calling.

On Legacy, the [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) setting has no effect on those attachments. No autonomous retrieval tool is given to the model whatever that setting says, so Preload files alone decides the outcome: on, and the content is injected upfront, as in the traditional RAG row; off, and nothing reaches the model at all, as in the no-processing row.

| Preload files | Builtin Tools | Result |
|--------------|---------------|--------|
| Enabled | Enabled | **Full Agentic Mode**: RAG content injected + model can autonomously query knowledge bases |
| Enabled | Disabled | **Traditional RAG**: Content injected upfront, no autonomous retrieval tools |
| Disabled | Enabled | **Tools-Only Mode**: No pre-injected content. The model queries knowledge bases on demand, and the [builtin **Files** tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) (`list_chat_files`, `query_chat_files`, `grep_chat_files`, `view_file`, `display_file`) are injected so it can read and search the chat's own attachments. Knowledge bases and notes attached in the chat [limit the knowledge tools to them](/features/workspace/knowledge#scoped-access-keeps-things-organized). This combination is also the [prompt-caching optimum](/features/chat-conversations/prompt-caching) |
| Disabled | Disabled | **No File Processing**: Attached files are ignored, no content reaches the model |

:::warning Knowledge attached to a model or a folder behaves differently
The table above covers attachments made in the chat. Knowledge attached to a model in the Workspace, and knowledge attached to a folder, follow the Function Calling mode instead:

- **Legacy**: the knowledge is queued for retrieval and injected upfront, exactly as the table describes, provided Preload files is enabled. Turning Preload files off removes the retrieval step entirely, so nothing is injected on Legacy either.
- **Default and Native**: nothing is injected regardless of Preload files. The knowledge is offered to the model through the [builtin knowledge tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode), and the model decides whether to search it.

The consequence is a configuration that silently does nothing. With Preload files enabled, [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) disabled, and Function Calling left on Default, knowledge attached to a model or a folder is never reached: nothing is injected, and the model has no tool to query it. Default is the setting most deployments never change, so this combination is easy to arrive at by accident.

Any one of these resolves it:

- Leave [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) enabled on that model.
- Set Function Calling to Legacy on that model.
- Attach the knowledge base in the chat rather than on the model or folder.
:::

:::tip Choosing the Right Configuration
- **Most models**: Keep both enabled for full functionality.
- **Small/local models**: Disable [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) if they don't support function calling.
- **On-demand retrieval only**: Disable Preload files, enable [Builtin Tools](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) and set the model to Default or Native function calling, if you want it to decide what to retrieve rather than having everything pre-injected. This does not work on Legacy, which never uses the on-demand tools, so with Preload files off nothing would be retrieved at all.
:::

## Enhanced RAG Pipeline

The togglable hybrid search sub-feature for our RAG embedding feature enhances RAG functionality via `BM25`, with re-ranking powered by `CrossEncoder`, and configurable relevance score thresholds. This provides a more precise and tailored RAG experience for your specific use case.

:::tip Filesystem-style knowledge access (`kb_exec`)
For an even more capable, agentic experience, set `ENABLE_KB_EXEC=True`. This gives the model a shell-style interface over your knowledge bases (`ls`, `tree`, `grep`, `cat`, `head`/`tail`, read-by-line, with pipes) that capable models tend to chain more reliably than a fan-out of separate search tools, so they locate the right passage more often. It requires **native function calling** (it is a native-mode [builtin tool](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)) and is off by default; for models set to Legacy it has no effect. We recommend turning it on for capable models. See [Filesystem-style access](/features/workspace/knowledge#filesystem-style-access-kb_exec).
:::

## YouTube RAG Pipeline

The dedicated RAG pipeline for summarizing YouTube videos via video URLs enables smooth interaction with video transcriptions directly. This innovative feature allows you to incorporate video content into your chats, further enriching your conversation experience.

A video needs a usable transcript. Set the languages to try with [`YOUTUBE_LOADER_LANGUAGE`](/reference/env-configuration#youtube_loader_language), and route blocked requests through a proxy with **Settings > Web Search > Youtube Proxy URL** (admin section) ([`YOUTUBE_LOADER_PROXY_URL`](/reference/env-configuration#youtube_loader_proxy_url)). See [Attaching a link or a YouTube video fails](/troubleshooting/rag#14-attaching-a-link-or-a-youtube-video-fails).

## Document Parsing

A variety of parsers extract content from local and remote documents: built-in engines like Tika, Docling and Mistral OCR, or your own service via the [external engine](/features/chat-conversations/rag/document-extraction/external) if you need per-file-type routing or custom logic. See [Document Extraction](/features/chat-conversations/rag/document-extraction) for the full list and setup steps.

:::warning Temporary Chat Limitations
When using **Temporary Chat**, document processing is restricted to **frontend-only** operations to ensure your data stays private and is not stored on the server. Consequently, advanced backend parsing (used for formats like complex DOCX files) is disabled, which may result in raw data being seen instead of parsed text. For full document support, use a standard chat session.
:::

### CSV Table Summary

A parsed CSV is its rows and nothing else, so a model asked how many orders a spreadsheet holds answers from whichever rows were retrieved. Setting [`ENABLE_RAG_CSV_SUMMARY=true`](/reference/env-configuration#enable_rag_csv_summary) (off by default, restart required) puts one line in front of every `.csv` file naming its row count, its data row count and its column names.

The `external`, `tika` and `docling` extraction engines parse `.csv` files themselves and get no summary. Only files parsed after you turn the setting on get one, so re-index to add it to the CSVs already in a knowledge base.

## Google Drive Integration

When paired with a Google Cloud project that has the Google Picker API and Google Drive API enabled, this feature allows users to directly access their Drive files from the chat interface and upload documents, slides, sheets and more and uploads them as context to your chat. Can be enabled `Settings` > `Documents` (admin section) menu. Must set [`GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_CLIENT_ID`](/reference/env-configuration) environment variables to use.

### Detailed Instructions

1. Create an OAuth 2.0 client and configure both the Authorized JavaScript origins & Authorized redirect URI to be the URL (include the port if any) you use to access your Open-WebUI instance.
2. Make a note of the Client ID associated with that OAuth client. Use it exactly as Google shows it, in the form `<project number>-....apps.googleusercontent.com`. The picker reads the Cloud project number from the leading digits of the Client ID.
3. Make sure that you enable both Google Drive API and Google Picker API for your project.
4. On the OAuth consent screen, set the app to In production, or keep it in Testing and add your users to the test user list.
5. Add the `https://www.googleapis.com/auth/drive.file` scope. Open WebUI asks only for this scope, which grants access to the files each user picks. Google classes it as non-sensitive, so a self-hosted install needs no restricted-scope verification or security assessment, and users get no "Google hasn't verified this app" warning.
6. Go to the Google Picker API page, and click on the create credentials button.
7. Create an API key and under Application restrictions and choose Websites. Then add your Open-WebUI instance's URL, same as the Authorized JavaScript origins and Authorized redirect URIs settings in the step 1.
8. Set up API restrictions on the API Key to only have access to Google Drive API & Google Picker API
9. Set up the environment variable, `GOOGLE_DRIVE_CLIENT_ID` to the Client ID of the OAuth client from step 2.
10. Set up the environment variable `GOOGLE_DRIVE_API_KEY` to the API Key value setup up in step 7 (NOT the OAuth client secret from step 2).
11. Set up the `GOOGLE_REDIRECT_URI` to my Open-WebUI instance's URL (include the port, if any).
12. Then relaunch your Open-WebUI instance with those three environment variables.
13. After that, make sure Google Drive was enabled under `Settings` > `Documents` > `Google Drive` (admin section)

The picker opens in list view, because the `drive.file` scope gives it no access to file thumbnails.
