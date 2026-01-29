---
sidebar_position: 1
title: "Retrieval Augmented Generation (RAG)"
---

:::warning

If you're using **Ollama**, note that it **defaults to a 2048-token context length**. This severely limits **Retrieval-Augmented Generation (RAG) performance**, especially for web search, because retrieved data may **not be used at all** or only partially processed.

:::

Retrieval Augmented Generation (RAG) is a cutting-edge technology that enhances the conversational capabilities of chatbots by incorporating context from diverse sources. It works by retrieving relevant information from a wide range of sources such as local and remote documents, web content, and even multimedia sources like YouTube videos. The retrieved text is then combined with a predefined RAG template and prefixed to the user's prompt, providing a more informed and contextually relevant response.

One of the key advantages of RAG is its ability to access and integrate information from a variety of sources, making it an ideal solution for complex conversational scenarios. For instance, when a user asks a question related to a specific document or web page, RAG can retrieve and incorporate the relevant information from that source into the chat response. RAG can also retrieve and incorporate information from multimedia sources like YouTube videos. By analyzing the transcripts or captions of these videos, RAG can extract relevant information and incorporate it into the chat response.

## Local and Remote RAG Integration

Local documents must first be uploaded via the Documents section of the Workspace area to access them using the `#` symbol before a query. Click on the formatted URL in the that appears above the chat box. Once selected, a document icon appears above `Send a message`, indicating successful retrieval.

:::tip Bulk File Management
Need to clean up multiple uploaded documents or audit your storage? You can now use the centralized **[File Manager](/features/data-controls/files)** located in **Settings > Data Controls > Manage Files**. Deleting files there will automatically clean up their corresponding RAG embeddings.
:::

You can also load documents into the workspace area with their access by starting a prompt with `#`, followed by a URL. This can help incorporate web content directly into your conversations.

## Web Search for RAG

:::warning
**Context Length Warning for Ollama Users:** Web pages typically contain 4,000-8,000+ tokens even after content extraction, including main content, navigation elements, headers, footers, and metadata. With only 2048 tokens available, you're getting less than half the page content, often missing the most relevant information. Even 4096 tokens is frequently insufficient for comprehensive web content analysis.

**To Fix This:** Navigate to **Admin Panel > Models > Settings** (of your Ollama model) > **Advanced Parameters** and **increase the context length to 8192+ (or rather, more than 16000) tokens**. This setting specifically applies to Ollama models. For OpenAI and other integrated models, ensure you're using a model with sufficient built-in context length (e.g., GPT-4 Turbo with 128k tokens).
:::

For web content integration, start a query in a chat with `#`, followed by the target URL. Click on the formatted URL in the box that appears above the chat box. Once selected, a document icon appears above `Send a message`, indicating successful retrieval. Open WebUI fetches and parses information from the URL if it can.

:::tip

Web pages often contain extraneous information such as navigation and footer. For better results, link to a raw or reader-friendly version of the page.

:::

## RAG Template Customization

Customize the RAG template from the `Admin Panel` > `Settings` > `Documents` menu.

## Markdown Header Splitting

When enabled, documents are first split by markdown headers (H1-H6). This preserves document structure and ensures that sections under the same header are kept together when possible. The resulting chunks are then further processed by the standard character or token splitter.

:::tip

Use the **Chunk Min Size Target** setting (found in **Admin Panel > Settings > Documents**) to intelligently merge small sections after markdown splitting, improving retrieval coherence and reducing the total number of vectors in your database.

:::

## Chunking Configuration

Open WebUI allows you to fine-tune how documents are split into chunks for embedding. This is crucial for optimal retrieval performance.

- **Chunk Size**: Sets the maximum number of characters (or tokens) per chunk.
- **Chunk Overlap**: Specifies how much content is shared between adjacent chunks to maintain context.
- **Chunk Min Size Target**: Although [Markdown Header Splitting](#markdown-header-splitting) is excellent for preserving structure, it can often create tiny, fragmented chunks (e.g., a standalone sub-header, a table of contents entry, a single-sentence paragraph, or a short list item) that lack enough semantic context for high-quality embedding. You can counteract this by setting the **Chunk Min Size Target** to intelligently merge these small pieces with their neighbors.

### Why use a Chunk Min Size Target?

Intelligently merging small sections after markdown splitting provides several key advantages:

- **Improves RAG Quality**: Eliminates tiny, meaningless fragments, ensuring better semantic coherence in each retrieve chunk.
- **Reduces Vector Database Size**: Fewer chunks mean fewer vectors to store, reducing storage costs and memory usage.
- **Speeds Up Retrieval & Embedding**: A smaller index is faster to search, and fewer chunks require fewer embedding API calls (or less local compute). This significantly accelerates document processing when uploading files to chats or knowledge bases, as there is less data to vectorize.
- **Efficiency & Impact**: Testing has shown that a well-configured threshold (e.g., 1000 for a chunk size of 2000) can reduce chunk counts by over 90% while **improving accuracy**, increasing embedding speed, and enhancing overall retrieval quality by maintaining semantic context.

<details>
<summary>How the merging algorithm works (technical details)</summary>

For most users, the explanation above is all you need: small chunks get merged with their neighbors, resulting in better retrieval with fewer vectors and other performance, cost and storage benefits. But if you're curious about the exact logic and design rationale, here's how it works under the hood.

### Why header-based splitting needs merging

Markdown header splitting is one of the better structural approaches to chunking because headers are explicit semantic boundaries placed by the document author. You're leveraging human judgment about where one topic ends and another begins, which usually produces more coherent chunks than fixed-size windowing that might cut mid-paragraph or mid-thought.

However, real documents often have structural quirks: tables of contents, short introductory sections, single-sentence paragraphs under their own headers, or deeply nested subheadings with minimal content. These produce tiny chunks that cause problems:

- They lack sufficient context to be useful when retrieved in isolation
- They can produce noisy retrieval results (matching on limited signal but contributing nothing useful)
- Very short texts sometimes embed less reliably
- They waste vector storage and slow down retrieval
- Many chunks take longer to embed than fewer chunks (with the same total content)
- More embedding operations means more API calls (cost) or more local compute

The merging algorithm addresses this by intelligently combining undersized chunks while respecting document structure and size limits.

### The algorithm: a single forward pass

The merging logic is deliberately simple—a single forward pass through all chunks:

1. Start with the first chunk as the "current" accumulator.
2. For each **subsequent** chunk, check if it can be absorbed into the current chunk.
3. A chunk can be absorbed if **all three conditions** are met:
   - The current accumulated content is still below `CHUNK_MIN_SIZE_TARGET`
   - Merging wouldn't exceed `CHUNK_SIZE` (the maximum)
   - Both chunks belong to the same source document
4. If absorption is possible, merge them (with `\n\n` separation to preserve visual structure) and continue checking the next chunk.
5. If absorption isn't possible, finalize the current chunk and start fresh with the next one as the new accumulator.
6. Repeat until all chunks are processed.

**Key point**: The size check is on the *accumulated* content, not individual chunks. This means multiple consecutive tiny chunks (like a table of contents with many small entries) will keep folding together until the combined size reaches the threshold or until merging the next chunk would exceed the maximum.

### Design decisions and why they matter

**Forward-only merging**: Small chunks always merge into the *next* chunk, never backward. This keeps the logic simple and predictable, and preserves the natural "this section introduces what follows" relationship common in documents. A brief intro section merging forward into the content it introduces makes semantic sense.

**Why not backward merging?** Beyond added code complexity, backward merging would frequently fail anyway. By the time any chunk gets finalized, it's in one of two states: either it grew to meet or exceed `CHUNK_MIN_SIZE_TARGET` through absorption (so it's already "satisfied" with limited headroom), or it couldn't absorb the next chunk because that would exceed `CHUNK_SIZE` (so it's already bumping against the ceiling). Either way, a backward merge attempt would often fail the size check, meaning you'd add branching logic and state tracking for something that rarely succeeds.

**No cross-document merging**: Chunks from different source files are never combined, even if both are small. This preserves clear document boundaries for citation, source attribution, and retrieval context.

**Respects maximum size**: If merging two chunks would exceed `CHUNK_SIZE`, both are kept separate. Content is never discarded to force a merge.

**Metadata inheritance**: Merged chunks inherit metadata from the *first* chunk in the merge sequence. This is consistent with forward-merge semantics—source and header information reflects where the merged section "started," which is typically the right choice for retrieval and citation purposes.

**The `\n\n` separator**: When chunks merge, they're joined with double newlines rather than concatenated directly. This preserves visual and structural separation in the combined text, which can matter for both embedding quality and human readability if you inspect your chunks.

### Edge cases

**Consecutive tiny chunks**: Handled naturally. They keep accumulating into a single chunk until the threshold is met or max size would be exceeded.

**Small chunk followed by large chunk**: If a small chunk is followed by a chunk large enough that merging would exceed `CHUNK_SIZE`, the small chunk gets finalized as-is, still undersized. This is unavoidable without backward merging or content splitting, but it's also rare in practice. It typically occurs at natural semantic boundaries (a brief transition before a dense section), and the small chunk being standalone at that boundary is arguably correct anyway.

**Last chunk in document**: If the final chunk is undersized, it stays undersized since there's nothing to merge forward into. Again, unavoidable and usually fine—document endings are natural boundaries.

### Performance characteristics

The algorithm is O(n) in the number of chunks—a single pass with no lookahead or backtracking. This makes it fast even for large document collections.

The efficiency gains from merging scale non-linearly in some ways. Retrieval over 45 vectors versus 588 isn't just ~13x faster in raw compute—you're also getting much cleaner top-k results because you've eliminated the noise of near-empty chunks that might score well on partial keyword matches but contribute nothing useful to the LLM. The quality improvement often matters more than the speed improvement.

Testing has shown that a well-configured threshold (e.g., 1000 for a chunk size of 2000) can reduce chunk counts by over 90% while improving retrieval accuracy, because each remaining chunk carries meaningful semantic context rather than being a fragment that confuses both the embedding model and the retrieval ranking. As positive side effects, it also uses less storage space in the vector database and requires fewer embedding operations, which can be a significant cost saving if outsourcing to an embedding service.

</details>

## RAG Embedding Support

Change the RAG embedding model directly in the `Admin Panel` > `Settings` > `Documents` menu. This feature supports Ollama and OpenAI models, enabling you to enhance document processing according to your requirements.

## Citations in RAG Feature

The RAG feature allows users to easily track the context of documents fed to LLMs with added citations for reference points. This ensures transparency and accountability in the use of external sources within your chats.

## File Context vs Builtin Tools

Open WebUI provides two separate capabilities that control how files are handled. Understanding the difference is important for configuring models correctly.

### File Context Capability

The **File Context** capability controls whether Open WebUI performs RAG (Retrieval-Augmented Generation) on attached files:

| File Context | Behavior |
|--------------|----------|
| ✅ **Enabled** (default) | Attached files are processed via RAG. Content is retrieved and injected into the conversation context. |
| ❌ **Disabled** | File processing is **completely skipped**. No content extraction, no injection. The model receives no file content. |

**When to disable File Context:**
- **Bypassing RAG entirely**: When you don't want Open WebUI to process attached files at all.
- **Using Builtin Tools only**: If you prefer the model to retrieve file content on-demand via tools like `query_knowledge_bases` rather than having content pre-injected.
- **Debugging/testing**: To isolate whether issues are related to RAG processing.

:::warning File Context Disabled = No Pre-Injected Content
When File Context is disabled, file content is **not automatically extracted or injected**. Open WebUI does not forward files to the model's native API. If you disable this, the only way the model can access file content is through builtin tools (if enabled) that query knowledge bases or retrieve attached files on-demand (agentic file processing).
:::

:::info
The File Context toggle only appears when **File Upload** is enabled for the model.
:::

### Builtin Tools Capability

The **Builtin Tools** capability controls whether the model receives native function-calling tools for autonomous retrieval:

| Builtin Tools | Behavior |
|---------------|----------|
| ✅ **Enabled** (default) | In Native Function Calling mode, the model receives tools like `query_knowledge_bases`, `view_knowledge_file`, `search_chats`, etc. |
| ❌ **Disabled** | No builtin tools are injected. The model works only with pre-injected context. |

**When to disable Builtin Tools:**
- **Model doesn't support function calling**: Smaller or older models may not handle the `tools` parameter.
- **Predictable behavior needed**: You want the model to work only with what's provided upfront.

### Combining the Two Capabilities

These capabilities work independently, giving you fine-grained control:

| File Context | Builtin Tools | Result |
|--------------|---------------|--------|
| ✅ Enabled | ✅ Enabled | **Full Agentic Mode**: RAG content injected + model can autonomously query knowledge bases |
| ✅ Enabled | ❌ Disabled | **Traditional RAG**: Content injected upfront, no autonomous retrieval tools |
| ❌ Disabled | ✅ Enabled | **Tools-Only Mode**: No pre-injected content, but model can use tools to query knowledge bases or retrieve attached files on-demand |
| ❌ Disabled | ❌ Disabled | **No File Processing**: Attached files are ignored, no content reaches the model |

:::tip Choosing the Right Configuration
- **Most models**: Keep both enabled (defaults) for full functionality.
- **Small/local models**: Disable Builtin Tools if they don't support function calling.
- **On-demand retrieval only**: Disable File Context, enable Builtin Tools if you want the model to decide what to retrieve rather than pre-injecting everything.
:::

## Enhanced RAG Pipeline

The togglable hybrid search sub-feature for our RAG embedding feature enhances RAG functionality via `BM25`, with re-ranking powered by `CrossEncoder`, and configurable relevance score thresholds. This provides a more precise and tailored RAG experience for your specific use case.

## KV Cache Optimization (Performance Tip) 🚀

For professional and high-performance use cases—especially when dealing with long documents or frequent follow-up questions—you can significantly improve response times by enabling **KV Cache Optimization**.

### The Problem: Cache Invalidation
By default, Open WebUI injects retrieved RAG context into the **user message**. As the conversation progresses, follow-up messages shift the position of this context in the chat history. For many LLM engines—including local engines (like Ollama, llama.cpp, and vLLM) and cloud providers / Model-as-a-Service providers (like OpenAI and Vertex AI)—this shifting position invalidates the **KV (Key-Value) prefix cache** or **Prompt Cache**, forcing the model to re-process the entire context for every single response. This leads to increased latency and potentially higher costs as the conversation grows.

### The Solution: `RAG_SYSTEM_CONTEXT`
You can fix this behavior by enabling the `RAG_SYSTEM_CONTEXT` environment variable.

- **How it works**: When `RAG_SYSTEM_CONTEXT=True`, Open WebUI injects the RAG context into the **system message** instead of the user message. 
- **The Result**: Since the system message stays at the absolute beginning of the prompt and its position never changes, the provider can effectively cache the processed context. Follow-up questions then benefit from **instant responses** and **cost savings** because the "heavy lifting" (processing the large RAG context) is only done once.

:::tip recommended configuration
If you are using **Ollama**, **llama.cpp**, **OpenAI**, or **Vertex AI** and frequently "chat with your documents," set `RAG_SYSTEM_CONTEXT=True` in your environment to experience drastically faster follow-up responses!
:::

## YouTube RAG Pipeline

The dedicated RAG pipeline for summarizing YouTube videos via video URLs enables smooth interaction with video transcriptions directly. This innovative feature allows you to incorporate video content into your chats, further enriching your conversation experience.

## Document Parsing

A variety of parsers extract content from local and remote documents. For more, see the [`get_loader`](https://github.com/open-webui/open-webui/blob/2fa94956f4e500bf5c42263124c758d8613ee05e/backend/apps/rag/main.py#L328) function.

:::warning Temporary Chat Limitations
When using **Temporary Chat**, document processing is restricted to **frontend-only** operations to ensure your data stays private and is not stored on the server. Consequently, advanced backend parsing (used for formats like complex DOCX files) is disabled, which may result in raw data being seen instead of parsed text. For full document support, use a standard chat session.
:::

## Google Drive Integration

When paired with a Google Cloud project that has the Google Picker API and Google Drive API enabled, this feature allows users to directly access their Drive files from the chat interface and upload documents, slides, sheets and more and uploads them as context to your chat. Can be enabled `Admin Panel` > `Settings` > `Documents` menu. Must set [`GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_CLIENT_ID`](../../getting-started/env-configuration.mdx) environment variables to use.

### Detailed Instructions

1. Create an OAuth 2.0 client and configure both the Authorized JavaScript origins & Authorized redirect URI to be the URL (include the port if any) you use to access your Open-WebUI instance.
2. Make a note of the Client ID associated with that OAuth client.
3. Make sure that you enable both Google Drive API and Google Picker API for your project.
4. Also set your app (project) as Testing and add your Google Drive email to the User List
5. Set the permission scope to include everything those APIs have to offer. And because the app would be in Testing mode, no verification is required by Google to allow the app from accessing the data of the limited test users.
6. Go to the Google Picker API page, and click on the create credentials button.
7. Create an API key and under Application restrictions and choose Websites. Then add your Open-WebUI instance's URL, same as the Authorized JavaScript origins and Authorized redirect URIs settings in the step 1.
8. Set up API restrictions on the API Key to only have access to Google Drive API & Google Picker API
9. Set up the environment variable, `GOOGLE_DRIVE_CLIENT_ID` to the Client ID of the OAuth client from step 2.
10. Set up the environment variable `GOOGLE_DRIVE_API_KEY` to the API Key value setup up in step 7 (NOT the OAuth client secret from step 2).
11. Set up the `GOOGLE_REDIRECT_URI` to my Open-WebUI instance's URL (include the port, if any).
12. Then relaunch your Open-WebUI instance with those three environment variables.
13. After that, make sure Google Drive was enabled under `Admin Panel` < `Settings` < `Documents` < `Google Drive`
