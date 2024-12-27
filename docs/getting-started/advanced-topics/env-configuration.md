---
sidebar_position: 4
title: "🌍 Environment Variable Configuration"
---


## Overview

Open WebUI provides a large range of environment variables that allow you to customize and configure
various aspects of the application. This page serves as a comprehensive reference for all available
environment variables, providing their types, default values, and descriptions.
As new variables are introduced, this page will be updated to reflect the growing configuration options.

:::info

This page is up to date with Open WebUI release version [v0.5.1](https://github.com/open-webui/open-webui/releases/tag/v0.5.1), but is still a work in progress to later include more accurate descriptions, listing out options available for environment variables, defaults, and improving descriptions.

:::

## App/Backend

The following environment variables are used by `backend/config.py` to provide Open WebUI startup
configuration. Please note that some variables may have different default values depending on
whether you're running Open WebUI directly or via Docker. For more information on logging
environment variables, see our [logging documentation](https://docs.openwebui.com/getting-started/advanced-topics/logging)).

### General

#### `ENV`

- Type: `str` (enum: `dev`, `prod`)
- Options:
  - `dev` - Enables the FastAPI API docs on `/docs`
  - `prod` - Automatically configures several environment variables
- Default:
  - **Backend Default**: `dev`
  - **Docker Default**: `prod`
- Description: Environment setting.

#### `CUSTOM_NAME`

- Type: `str`
- Description: Sets `WEBUI_NAME` but polls **api.openwebui.com** for metadata.

#### `WEBUI_NAME`

- Type: `str`
- Default: `Open WebUI`
- Description: Sets the main WebUI name. Appends `(Open WebUI)` if overridden.

#### `WEBUI_URL`

- Type: `str`
- Default: `http://localhost:3000`
- Description: Specifies the URL where the Open WebUI is reachable. Currently used for search engine support.

#### `PORT`

- Type: `int`
- Default: `8080`
- Description: Sets the port to run Open WebUI from.

:::info

If installed via Python, you must instead pass `--port` as a command line argument.

:::

#### `ENABLE_SIGNUP`

- Type: `bool`
- Default: `True`
- Description: Toggles user account creation.

#### `ENABLE_LOGIN_FORM`

- Type: `bool`
- Default: `True`
- Description: Toggles email, password, sign in and "or" (only when `ENABLE_OAUTH_SIGNUP` is set to True) elements.

:::danger

This should **only** ever be set to `False` when [ENABLE_OAUTH_SIGNUP](https://docs.openwebui.com/getting-started/advanced-topics/env-configuration/#enable_oauth_signup)
is also being used and set to `True`. Failure to do so will result in the inability to login.

:::

#### `ENABLE_ADMIN_EXPORT`

- Type: `bool`
- Default: `True`
- Description: Controls whether admin users can export data.

#### `ENABLE_ADMIN_CHAT_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables admin users to access all chats.

#### `ENABLE_CHANNELS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables channel support.

#### `ADMIN_EMAIL`

- Type: `str`
- Description: Sets the admin email shown by `SHOW_ADMIN_DETAILS`

#### `SHOW_ADMIN_DETAILS`

- Type: `bool`
- Default: `True`
- Description: Toggles whether to show admin user details in the interface.

#### `BYPASS_MODEL_ACCESS_CONTROL`

- Type: `bool`
- Default: `False`
- Description: Bypasses model access control.

#### `DEFAULT_MODELS`

- Type: `str`
- Description: Sets a default Language Model.

#### `DEFAULT_USER_ROLE`

- Type: `str` (enum: `pending`, `user`, `admin`)
- Options:
  - `pending` - New users are pending until their accounts are manually activated by an admin.
  - `user` - New users are automatically activated with regular user permissions.
  - `admin` - New users are automatically activated with administrator permissions.
- Default: `pending`
- Description: Sets the default role assigned to new users.

#### `DEFAULT_LOCALE`

- Type: `str`
- Default: `en`
- Description: Sets the default locale for the application.

#### `WEBHOOK_URL`

- Type: `str`
- Description: Sets a webhook for integration with Slack/Microsoft Teams.

#### `WEBUI_BUILD_HASH`

- Type: `str`
- Default: `dev-build`
- Description: Used for identifying the Git SHA of the build for releases.

#### `WEBUI_BANNERS`

- Type: `list` of `dict`
- Default: `[]`
- Description: List of banners to show to users. Format of banners are:

```json
[{"id": "string","type": "string [info, success, warning, error]","title": "string","content": "string","dismissible": False,"timestamp": 1000}]
```

:::info

When setting this environment variable in a `.env` file, make sure to escape the quotes by wrapping the entire value in double quotes and using escaped quotes (`\"`) for the inner quotes. Example:

```
WEBUI_BANNERS="[{\"id\": \"1\", \"type\": \"warning\", \"title\": \"Your messages are stored.\", \"content\": \"Your messages are stored and may be reviewed by human people. LLM's are prone to hallucinations, check sources.\", \"dismissible\": true, \"timestamp\": 1000}]"
```

:::

#### `JWT_EXPIRES_IN`

- Type: `int`
- Default: `-1`
- Description: Sets the JWT expiration time in seconds. Valid time units: `s`, `m`, `h`, `d`, `w` or `-1` for no expiration.

#### `USE_CUDA_DOCKER`

- Type: `bool`
- Default: `False`
- Description: Builds the Docker image with NVIDIA CUDA support. Enables GPU acceleration
for local Whisper and embeddings.

### AIOHTTP Client

#### `AIOHTTP_CLIENT_TIMEOUT`

- Type: `int`
- Default: `300`
- Description: Specifies the timeout duration in seconds for the aiohttp client. This impacts things
such as connections to Ollama and OpenAI endpoints.

:::info

This is the maximum amount of time the client will wait for a response before timing out.
If set to an empty string (' '), the timeout will be set to `None`, effectively disabling the timeout and
allowing the client to wait indefinitely.

:::

#### `AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST`

- Type: `int`
- Description: Sets the timeout in seconds for fetching the OpenAI model list. This can be useful in cases where network latency requires a longer timeout duration to successfully retrieve the model list.

### Directories

#### `DATA_DIR`

- Type: `str`
- Default: `./data`
- Description: Specifies the base directory for data storage, including uploads, cache, vector database, etc.

#### `FONTS_DIR`

- Type: `str`
- Description: Specifies the directory for fonts.

#### `FRONTEND_BUILD_DIR`

- Type: `str`
- Default: `../build`
- Description: Specifies the location of the built frontend files.

#### `STATIC_DIR`

- Type: `str`
- Default: `./static`
- Description: Specifies the directory for static files, such as the favicon.

### Ollama

#### `ENABLE_OLLAMA_API`

- Type: `bool`
- Default: `True`
- Description: Enables the use of Ollama APIs.

#### `OLLAMA_BASE_URL` (`OLLAMA_API_BASE_URL` is depreciated) {#ollama_base_url}

- Type: `str`
- Default: `http://localhost:11434`
- Docker Default:
  - If `K8S_FLAG` is set: `http://ollama-service.open-webui.svc.cluster.local:11434`
  - If `USE_OLLAMA_DOCKER=True`: `http://localhost:11434`
  - Else `http://host.docker.internal:11434`
- Description: Configures the Ollama backend URL.

#### `OLLAMA_BASE_URLS`

- Type: `str`
- Description: Configures load-balanced Ollama backend hosts, separated by `;`. See
[`OLLAMA_BASE_URL`](#ollama_base_url). Takes precedence over[`OLLAMA_BASE_URL`](#ollama_base_url).

#### `USE_OLLAMA_DOCKER`

- Type: `bool`
- Default: `False`
- Description: Builds the Docker image with a bundled Ollama instance.

#### `K8S_FLAG`

- Type: `bool`
- Default: `False`
- Description: If set, assumes Helm chart deployment and sets [`OLLAMA_BASE_URL`](#ollama_base_url) to `http://ollama-service.open-webui.svc.cluster.local:11434`

### OpenAI

#### `ENABLE_OPENAI_API`

- Type: `bool`
- Default: `True`
- Description: Enables the use of OpenAI APIs.

#### `OPENAI_API_BASE_URL`

- Type: `str`
- Default: `https://api.openai.com/v1`
- Description: Configures the OpenAI base API URL.

#### `OPENAI_API_BASE_URLS`

- Type: `str`
- Description: Supports balanced OpenAI base API URLs, semicolon-separated.
- Example: `http://host-one:11434;http://host-two:11434`

#### `OPENAI_API_KEY`

- Type: `str`
- Description: Sets the OpenAI API key.

#### `OPENAI_API_KEYS`

- Type: `str`
- Description: Supports multiple OpenAI API keys, semicolon-separated.
- Example: `sk-124781258123;sk-4389759834759834`

### Tasks

#### `TASK_MODEL`

- Type: `str`
- Description: The default model to use for tasks such as title and web search query generation
when using Ollama models.

#### `TASK_MODEL_EXTERNAL`

- Type: `str`
- Description: The default model to use for tasks such as title and web search query generation
when using OpenAI-compatible endpoints.

#### `TITLE_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when generating chat titles.
- Default:

```
Create a concise, 3-5 word title with an emoji as a title for the prompt in the given language. Suitable Emojis for the summary can be used to enhance understanding but avoid quotation marks or special formatting. RESPOND ONLY WITH THE TITLE TEXT.

Examples of titles:
📉 Stock Market Trends
🍪 Perfect Chocolate Chip Recipe
Evolution of Music Streaming
Remote Work Productivity Tips
Artificial Intelligence in Healthcare
🎮 Video Game Development Insights

Prompt: {{prompt:middletruncate:8000}}
```

#### `TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when calling tools.
- Default:

```
Available Tools: {{TOOLS}}\nReturn an empty string if no tools match the query. If a function tool matches, construct and return a JSON object in the format {\"name\": \"functionName\", \"parameters\": {\"requiredFunctionParamKey\": \"requiredFunctionParamValue\"}} using the appropriate tool and its parameters. Only return the object and limit the response to the JSON object without additional text.
```

### Autocomplete

#### `ENABLE_AUTOCOMPLETE_GENERATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables autocomplete generation.

:::info

When enabling `ENABLE_AUTOCOMPLETE_GENERATION`, ensure that you also configure `AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH` and `AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE` accordingly.

:::

#### `AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH`

- Type: `int`
- Description: Sets the maximum input length for autocomplete generation.

#### `AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Sets the prompt template for autocomplete generation.

### Evaluation Arena Model

#### `ENABLE_EVALUATION_ARENA_MODELS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables evaluation arena models.

#### `ENABLE_MESSAGE_RATING`

- Type: `bool`
- Default: `True`
- Description: Enables message rating feature.

#### `ENABLE_COMMUNITY_SHARING`

- Type: `bool`
- Default: `True`
- Description: Controls whether users are shown the share to community button.

### Tags Generation

#### `ENABLE_TAGS_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables tags generation.

#### `TAGS_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Sets the prompt template for tags generation.

### API Key Endpoint Restrictions

#### `ENABLE_API_KEY_ENDPOINT_RESTRICTIONS`

- Type: `bool`
- Default: `False`
- Description: Enables API key endpoint restrictions for added security and configurability.

#### `API_KEY_ALLOWED_ENDPOINTS`

- Type: `str`
- Description: Specifies a comma-separated list of allowed API endpoints when API key endpoint restrictions are enabled.

:::note

The value of `API_KEY_ALLOWED_ENDPOINTS` should be a comma-separated list of endpoint URLs, such as `/api/v1/messages, /api/v1/channels`.

:::

## Security Variables

#### `ENABLE_FORWARD_USER_INFO_HEADERS`

- type: `bool`
- Default: `False`
- Description: Forwards user information (name, id, email, and role) as X-headers to OpenAI API.
If enabled, the following headers are forwarded:
  - `X-OpenWebUI-User-Name`
  - `X-OpenWebUI-User-Id`
  - `X-OpenWebUI-User-Email`
  - `X-OpenWebUI-User-Role`

#### `ENABLE_RAG_LOCAL_WEB_FETCH`

- Type: `bool`
- Default: `False`
- Description: Enables local web fetching for RAG. Enabling this allows Server Side Request
Forgery attacks against local network resources.

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- Type: `bool`
- Default: `True`
- Description: Bypass SSL Verification for RAG on Websites.

#### `WEBUI_SESSION_COOKIE_SAME_SITE`

- Type: `str` (enum: `lax`, `strict`, `none`)
- Options:
  - `lax` - Sets the `SameSite` attribute to lax, allowing session cookies to be sent with
requests initiated by third-party websites.
  - `strict` - Sets the `SameSite` attribute to strict, blocking session cookies from being sent
with requests initiated by third-party websites.
  - `none` - Sets the `SameSite` attribute to none, allowing session cookies to be sent with
requests initiated by third-party websites, but only over HTTPS.
- Default: `lax`
- Description: Sets the `SameSite` attribute for session cookies.

#### `WEBUI_SESSION_COOKIE_SECURE`

- Type: `bool`
- Default: `False`
- Description: Sets the `Secure` attribute for session cookies if set to `True`.

#### `WEBUI_AUTH`

- Type: `bool`
- Default: `True`
- Description: This setting enables or disables authentication.

:::danger

If set to `False`, authentication will be disabled for your Open WebUI instance. However, it's
important to note that turning off authentication is only possible for fresh installations without
any existing users. If there are already users registered, you cannot disable authentication
directly. Ensure that no users are present in the database, if you intend to turn off `WEBUI_AUTH`.

:::

#### `WEBUI_SECRET_KEY`

- Type: `str`
- Default: `t0p-s3cr3t`
- Docker Default: Randomly generated on first start
- Description: Overrides the randomly generated string used for JSON Web Token.

#### `OFFLINE_MODE`

- Type: `bool`
- Default: `False`
- Description: Enables or disables offline mode.

#### `RESET_CONFIG_ON_START`

- Type: `bool`
- Default: `False`
- Description: Resets the `config.json` file on startup.

#### `SAFE_MODE`

- Type: `bool`
- Default: `False`
- Description: Enables safe mode, which disables potentially unsafe features, deactivating all functions.

#### `CORS_ALLOW_ORIGIN`

- Type: `str`
- Default: `*`
- Description: Sets the allowed origins for Cross-Origin Resource Sharing (CORS).

#### `RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE`

- Type: `bool`
- Default: `False`
- Description: Determines whether or not to allow custom models defined on the Hub in their own modeling files.

#### `RAG_RERANKING_MODEL_TRUST_REMOTE_CODE`

- Type: `bool`
- Default: `False`
- Description: Determines whether or not to allow custom models defined on the Hub in their own
modeling files for reranking.

#### `RAG_EMBEDDING_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the Sentence-Transformer model.

#### `RAG_RERANKING_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the reranking model.

#### `WHISPER_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the Whisper model.

## Retrieval Augmented Generation (RAG)

#### `VECTOR_DB`

- Type: `str`
- Default: `chroma`
- Description: Specifies which vector database system to use, either 'chroma' for ChromaDB or 'milvus' for Milvus. This setting determines which vector storage system will be used for managing embeddings.

#### `RAG_EMBEDDING_ENGINE`

- Type: `str` (enum: `ollama`, `openai`)
- Options:
  - Leave empty for `Default (SentenceTransformers)` - Uses SentenceTransformers for embeddings.
  - `ollama` - Uses the Ollama API for embeddings.
  - `openai` - Uses the OpenAI API for embeddings.
- Description: Selects an embedding engine to use for RAG.

#### `RAG_EMBEDDING_MODEL`

- Type: `str`
- Default: `sentence-transformers/all-MiniLM-L6-v2`
- Description: Sets a model for embeddings. Locally, a Sentence-Transformer model is used.

#### `ENABLE_RAG_HYBRID_SEARCH`

- Type: `bool`
- Default: `False`
- Description: Enables the use of ensemble search with `BM25` + `ChromaDB`, with reranking using
`sentence_transformers` models.

#### `CONTENT_EXTRACTION_ENGINE`

- Type: `str` (`tika`)
- Options:
  - Leave empty to use default
  - `tika` - Use a local Apache Tika server
- Description: Sets the content extraction engine to use for document ingestion.

#### `RAG_TOP_K`

- Type: `int`
- Default: `5`
- Description: Sets the default number of results to consider when using RAG.

#### `RAG_RELEVANCE_THRESHOLD`

- Type: `float`
- Default: `0.0`
- Description: Sets the relevance threshold to consider for documents when used with reranking.

#### `RAG_TEMPLATE`

- Type: `str`
- Default:

```
You are given a user query, some textual context and rules, all inside xml tags. You have to answer the query based on the context while respecting the rules.

<context>
[context]
</context>

<rules>
- If you don't know, just say so.
- If you are not sure, ask for clarification.
- Answer in the same language as the user query.
- If the context appears unreadable or of poor quality, tell the user then answer as best as you can.
- If the answer is not in the context but you think you know the answer, explain that to the user then answer with your own knowledge.
- Answer directly and without using xml tags.
</rules>

<user_query>
[query]
</user_query>
```

- Description: Template to use when injecting RAG documents into chat completion

#### `RAG_TEXT_SPLITTER`

- Type: `str`
- Description: Sets the text splitter for RAG models.

#### `TIKTOKEN_CACHE_DIR`

- Type: `str`
- Description: Sets the directory for TikiToken cache.

#### `TIKTOKEN_ENCODING_NAME`

- Type: `str`
- Description: Sets the encoding name for TikiToken.

#### `CHUNK_SIZE`

- Type: `int`
- Default: `1500`
- Description: Sets the document chunk size for embeddings.

#### `CHUNK_OVERLAP`

- Type: `int`
- Default: `100`
- Description: Specifies how much overlap there should be between chunks.

#### `PDF_EXTRACT_IMAGES`

- Type: `bool`
- Default: `False`
- Description: Extracts images from PDFs using OCR when loading documents.

#### `RAG_FILE_MAX_SIZE`

- Type: `int`
- Default: `100` (100MB)
- Description: Sets the maximum size of a file that can be uploaded for document ingestion.

#### `RAG_FILE_MAX_COUNT`

- Type: `int`
- Default: `10`
- Description: Sets the maximum number of files that can be uploaded at once for document ingestion.

:::info

When configuring `RAG_FILE_MAX_SIZE` and `RAG_FILE_MAX_COUNT`, ensure that the values are reasonable to prevent excessive file uploads and potential performance issues.

:::

#### `RAG_RERANKING_MODEL`

- Type: `str`
- Description: Sets a model for reranking results. Locally, a Sentence-Transformer model is used.

#### `RAG_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI base API URL to use for RAG embeddings.

#### `RAG_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for RAG embeddings.

#### `RAG_EMBEDDING_OPENAI_BATCH_SIZE`

- Type: `int`
- Default: `1`
- Description: Sets the batch size for OpenAI embeddings.

#### `RAG_EMBEDDING_BATCH_SIZE`

- Type: `int`
- Description: Sets the batch size for embedding in RAG (Retrieval-Augmented Generator) models.

#### `RAG_OLLAMA_API_KEY`

- Type: `str`
- Description: Sets the API key for Ollama API used in RAG models.

#### `RAG_OLLAMA_BASE_URL`

- Type: `str`
- Description: Sets the base URL for Ollama API used in RAG models.

#### `ENABLE_RETRIEVAL_QUERY_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables retrieval query generation.

#### `QUERY_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Sets the prompt template for query generation.

### Apache Tika

#### `TIKA_SERVER_URL`

- Type: `str`
- Default: `http://localhost:9998`
- Description: Sets the URL for the Apache Tika server.

### ChromaDB

#### `CHROMA_TENANT`

- Type: `str`
- Default: `default_tenant`
- Description: Sets the tenant for ChromaDB to use for RAG embeddings.

#### `CHROMA_DATABASE`

- Type: `str`
- Default: `default_database`
- Description: Sets the database in the ChromaDB tenant to use for RAG embeddings.

#### `CHROMA_HTTP_HOST`

- Type: `str`
- Description: Specifies the hostname of a remote ChromaDB Server. Uses a local ChromaDB instance if not set.

#### `CHROMA_HTTP_PORT`

- Type: `int`
- Default: `8000`
- Description: Specifies the port of a remote ChromaDB Server.

#### `CHROMA_HTTP_HEADERS`

- Type: `str`
- Description: Comma-separated list of HTTP headers to include with every ChromaDB request.
- Example: `Authorization=Bearer heuhagfuahefj,User-Agent=OpenWebUI`.

#### `CHROMA_HTTP_SSL`

- Type: `bool`
- Default: `False`
- Description: Controls whether or not SSL is used for ChromaDB Server connections.

#### `CHROMA_CLIENT_AUTH_PROVIDER`

- Type: `str`
- Description: Specifies auth provider for remote ChromaDB Server.
- Example: `chromadb.auth.basic_authn.BasicAuthClientProvider`

#### `CHROMA_CLIENT_AUTH_CREDENTIALS`

- Type: `str`
- Description: Specifies auth credentials for remote ChromaDB Server.
- Example: `username:password`

### Google Drive

#### `ENABLE_GOOGLE_DRIVE_INTEGRATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables Google Drive integration. If set to true, and `GOOGLE_DRIVE_CLIENT_ID` & `GOOGLE_DRIVE_API_KEY` are both configured, Google Drive will appear as an upload option in the chat UI.

:::info

When enabling `GOOGLE_DRIVE_INTEGRATION`, ensure that you have configured `GOOGLE_DRIVE_CLIENT_ID` and `GOOGLE_DRIVE_API_KEY` correctly, and have reviewed Google's terms of service and usage guidelines.

:::

#### `GOOGLE_DRIVE_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for Google Drive (client must be configured with Drive API and Picker API enabled).

#### `GOOGLE_DRIVE_API_KEY`

- Type: `str`
- Description: Sets the API key for Google Drive integration.

### Milvus

#### `MILVUS_URI`

- Type: `str`
- Default: `${DATA_DIR}/vector_db/milvus.db`
- Description: Specifies the URI for connecting to the Milvus vector database. This can point to a local or remote Milvus server based on the deployment configuration.

### OpenSearch

#### `OPENSEARCH_CERT_VERIFY`

- Type: `bool`
- Default: `False`
- Description: Enables or disables OpenSearch certificate verification.

#### `OPENSEARCH_PASSWORD`

- Type: `str`
- Description: Sets the password for OpenSearch.

#### `OPENSEARCH_SSL`

- Type: `bool`
- Default: `False`
- Description: Enables or disables SSL for OpenSearch.

#### `OPENSEARCH_URI`

- Type: `str`
- Description: Sets the URI for OpenSearch.

#### `OPENSEARCH_USERNAME`

- Type: `str`
- Description: Sets the username for OpenSearch.

### PGVector

#### `PGVECTOR_DB_URL`

- Type: `str`
- Description: Sets the database URL for model storage.

### Qdrant

#### `QDRANT_API_KEY`

- Type: `str`
- Description: Sets the API key for Qdrant.

#### `QDRANT_URI`

- Type: `str`
- Description: Sets the URI for Qdrant.

## Web Search

#### `ENABLE_RAG_WEB_SEARCH`

- Type: `bool`
- Default: `False`
- Description: Enable web search toggle

#### `ENABLE_SEARCH_QUERY_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables search query generation.

#### `RAG_WEB_SEARCH_RESULT_COUNT`

- Type: `int`
- Default: `3`
- Description: Maximum number of search results to crawl.

#### `RAG_WEB_SEARCH_CONCURRENT_REQUESTS`

- Type: `int`
- Default: `10`
- Description: Number of concurrent requests to crawl web pages returned from search results.

#### `RAG_WEB_SEARCH_ENGINE`

- Type: `str` (enum: `searxng`, `google_pse`, `brave`, `kagi`, `mojeek`, `serpstack`, `serper`, `serply`, `searchapi`, `duckduckgo`, `tavily`, `jina`, `bing`)
- Options:
  - `searxng` - Uses the [SearXNG](https://github.com/searxng/searxng) search engine.
  - `google_pse` - Uses the [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/).
  - `brave` - Uses the [Brave search engine](https://brave.com/search/api/).
  - `kagi` - Uses the [Kagi](https://www.kagi.com/) search engine.
  - `mojeek` - Uses the [Mojeek](https://www.mojeek.com/) search engine.
  - `serpstack` - Uses the [Serpstack](https://serpstack.com/) search engine.
  - `serper` - Uses the [Serper](https://serper.dev/) search engine.
  - `serply` - Uses the [Serply](https://serply.io/) search engine.
  - `searchapi` - Uses the [SearchAPI](https://www.searchapi.io/) search engine.
  - `duckduckgo` - Uses the [DuckDuckGo](https://duckduckgo.com/) search engine.
  - `tavily` - Uses the [Tavily](https://tavily.com/) search engine.
  - `jina` - Uses the [Jina](https://jina.ai/) search engine.
  - `bing` - Uses the [Bing](https://www.bing.com/) search engine.

#### `SEARXNG_QUERY_URL`

- Type: `str`
- Description: The [SearXNG search API](https://docs.searxng.org/dev/search_api.html) URL supporting JSON output. `<query>` is replaced with
the search query. Example: `http://searxng.local/search?q=<query>`

#### `GOOGLE_PSE_API_KEY`

- Type: `str`
- Description: Sets the API key for the Google Programmable Search Engine (PSE) service.

#### `GOOGLE_PSE_ENGINE_ID`

- Type: `str`
- Description: The engine ID for the Google Programmable Search Engine (PSE) service.

#### `BRAVE_SEARCH_API_KEY`

- Type: `str`
- Description: Sets the API key for the Brave Search API.

#### `KAGI_SEARCH_API_KEY`

- Type: `str`
- Description: Sets the API key for Kagi Search API.

#### `MOJEEK_SEARCH_API_KEY`

- Type: `str`
- Description: Sets the API key for Mojeek Search API.

#### `SERPSTACK_API_KEY`

- Type: `str`
- Description: Sets the API key for Serpstack search API.

#### `SERPSTACK_HTTPS`

- Type: `bool`
- Default: `True`
- Description: Configures the use of HTTPS for Serpstack requests. Free tier requests are restricted to HTTP only.

#### `SERPER_API_KEY`

- Type: `str`
- Description: Sets the API key for Serper search API.

#### `SERPLY_API_KEY`

- Type: `str`
- Description: Sets the API key for Serply search API.

#### `SEARCHAPI_API_KEY`

- Type: `str`
- Description: Sets the API key for SearchAPI.

#### `SEARCHAPI_ENGINE`

- Type: `str`
- Description: Sets the SearchAPI engine.

#### `TAVILY_API_KEY`

- Type: `str`
- Description: Sets the API key for Tavily search API.

#### `JINA_API_KEY`

- Type: `str`
- Description: Sets the API key for Jina.

#### `BING_SEARCH_V7_ENDPOINT`

- Type: `str`
- Description: Sets the endpoint for Bing Search API.

#### `BING_SEARCH_V7_SUBSCRIPTION_KEY`

- Type: `str`
- Description: Sets the subscription key for Bing Search API.

### YouTube Loader

#### `YOUTUBE_LOADER_PROXY_URL`

- Type: `str`
- Description: Sets the proxy URL for YouTube loader.

#### `YOUTUBE_LOADER_LANGUAGE`

- Type: `str`
- Default: `en`
- Description: Sets the language to use for YouTube video loading.

## Audio

### Whisper Speech-to-Text (Local)

#### `WHISPER_MODEL`

- Type: `str`
- Default: `base`
- Description: Sets the Whisper model to use for Speech-to-Text. The backend used is faster_whisper with quantization to `int8`.

#### `WHISPER_MODEL_DIR`

- Type: `str`
- Default: `${DATA_DIR}/cache/whisper/models`
- Description: Specifies the directory to store Whisper model files.

### Speech-to-Text (OpenAI)

#### `AUDIO_STT_ENGINE`

- Type: `str` (enum: `openai`)
- Options:
  - Leave empty to use local Whisper engine for Speech-to-Text.
  - `openai` - Uses OpenAI engine for Speech-to-Text.
- Description: Specifies the Speech-to-Text engine to use.

#### `AUDIO_STT_MODEL`

- Type: `str`
- Default: `whisper-1`
- Description: Specifies the Speech-to-Text model to use for OpenAI-compatible endpoints.

#### `AUDIO_STT_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for Speech-to-Text.

#### `AUDIO_STT_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for Speech-to-Text.

### Text-to-Speech

#### `AUDIO_TTS_API_KEY`

- Type: `str`
- Description: Sets the API key for Text-to-Speech.

#### `AUDIO_TTS_ENGINE`

- Type: `str` (enum: `elevenlabs`, `openai`)
- Options:
  - Leave empty to use built-in WebAPI engine for Text-to-Speech.
  - `elevenlabs` - Uses ElevenLabs engine for Text-to-Speech
  - `openai` - Uses OpenAI engine for Text-to-Speech.
- Description: Specifies the Text-to-Speech engine to use.

#### `AUDIO_TTS_MODEL`

- Type: `str`
- Default: `tts-1`
- Description: Specifies the OpenAI text-to-speech model to use.

### Azure Text-to-Speech

#### `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT`

- Type: `str`
- Description: Sets the output format for Azure Text to Speech.

#### `AUDIO_TTS_AZURE_SPEECH_REGION`

- Type: `str`
- Description: Sets the region for Azure Text to Speech.

### OpenAI Text-to-Speech

#### `AUDIO_TTS_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for text-to-speech.

#### `AUDIO_TTS_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for text-to-speech.

#### `AUDIO_TTS_SPLIT_ON`

- Type: `str`
- Default: `punctuation`
- Description: Sets the OpenAI text-to-speech split on to use.

#### `AUDIO_TTS_VOICE`

- Type: `str`
- Default: `alloy`
- Description: Sets the OpenAI text-to-speech voice to use.

## Image Generation

#### `ENABLE_IMAGE_GENERATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables image generation features.

#### `IMAGE_GENERATION_ENGINE`

- Type: `str` (enum: `openai`, `comfyui`, `automatic1111`)
- Options:
  - `openai` - Uses OpenAI DALL-E for image generation.
  - `comfyui` - Uses ComfyUI engine for image generation.
  - `automatic1111` - Uses Automatic1111 engine for image generation (default).
- Default: `automatic1111`
- Description: Specifies the engine to use for image generation.

#### `IMAGE_GENERATION_MODEL`

- Type: `str`
- Description: Default model to use for image generation

#### `IMAGE_SIZE`

- Type: `str`
- Default: `512x512`
- Description: Sets the default image size to generate.

#### `IMAGE_STEPS`

- Type: `int`
- Default: `50`
- Description: Sets the default iteration steps for image generation. Used for ComfyUI and AUTOMATIC1111.

### AUTOMATIC1111

#### `AUTOMATIC1111_API_AUTH`

- Type: `str`
- Description: Sets the Automatic1111 API authentication.

#### `AUTOMATIC1111_BASE_URL`

- Type: `str`
- Description: Specifies the URL to Automatic1111's Stable Diffusion API.

#### `AUTOMATIC1111_CFG_SCALE`

- Type: `float`
- Description: Sets the scale for Automatic1111 inference.

#### `AUTOMATIC1111_SAMPLER`

- Type: `str`
- Description: Sets the sampler for Automatic1111 inference.

#### `AUTOMATIC1111_SCHEDULER`

- Type: `str`
- Description: Sets the scheduler for Automatic1111 inference.

### ComfyUI

#### `COMFYUI_BASE_URL`

- Type: `str`
- Description: Specifies the URL to the ComfyUI image generation API.

#### `COMFYUI_API_KEY`

- Type: `str`
- Description: Sets the API key for ComfyUI.

#### `COMFYUI_WORKFLOW`

- Type: `str`
- Description: Sets the ComfyUI workflow.

### OpenAI DALL-E

#### `IMAGES_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for DALL-E image generation.

#### `IMAGES_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for DALL-E image generation.

## OAuth

#### `ENABLE_OAUTH_SIGNUP`

- Type: `bool`
- Default: `False`
- Description: Enables account creation when sighting up via OAuth. Distinct from `ENABLE_SIGNUP`.

:::danger

`ENABLE_LOGIN_FORM` must be set to `False` when `ENABLE_OAUTH_SIGNUP` is set to `True`. Failure to do so will result in the inability to login.

:::

#### `ENABLE_API_KEY`

- Type: `bool`
- Default: `False`
- Description: Enables API key authentication.

#### `ENABLE_OAUTH_ROLE_MANAGEMENT`

- Type: `bool`
- Default: `False`
- Description: Enables role management to oauth delegation.

#### `ENABLE_OAUTH_GROUP_MANAGEMENT`

- Type: `bool`
- Default: `False`
- Description: Enables or disables OAUTH group management.

#### `OAUTH_MERGE_ACCOUNTS_BY_EMAIL`

- Type: `bool`
- Default: `False`
- Description: If enabled, merges OAuth accounts with existing accounts using the same email
address. This is considered unsafe as not all OAuth providers will verify email addresses and can lead to
potential account takeovers.

#### `OAUTH_USERNAME_CLAIM`

- Type: `str`
- Default: `name`
- Description: Set username claim for OpenID.

#### `OAUTH_EMAIL_CLAIM`

- Type: `str`
- Default: `email`
- Description: Set email claim for OpenID.

#### `OAUTH_PICTURE_CLAIM`

- Type: `str`
- Default: `picture`
- Description: Set picture (avatar) claim for OpenID.

#### `OAUTH_GROUP_CLAIM`

- Type: `str`
- Description: Specifies the group claim for OAUTH authentication.

#### `OAUTH_ROLES_CLAIM`

- Type: `str`
- Default: `roles`
- Description: Sets the roles claim to look for in the OIDC token.

#### `OAUTH_SCOPES`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for OIDC authentication. `openid` and `email` are required.

#### `OAUTH_ALLOWED_DOMAINS`

- Type: `str`
- Description: Specifies the allowed domains for OAUTH authentication. (e.g. "example1.com,example2.com").

#### `OAUTH_ALLOWED_ROLES`

- Type: `str`
- Default: `user,admin`
- Description: Sets the roles that are allowed access to the platform.

#### `OAUTH_ADMIN_ROLES`

- Type: `str`
- Default: `admin`
- Description: Sets the roles that are considered administrators.

#### `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`

- Type: `str`
- Description: Defines the trusted request header for authentication. See [SSO docs](/features/sso).

#### `WEBUI_AUTH_TRUSTED_NAME_HEADER`

- Type: `str`
- Description: Defines the trusted request header for the username of anyone registering with the
`WEBUI_AUTH_TRUSTED_EMAIL_HEADER` header. See [SSO docs](/features/sso).

### Google

See https://support.google.com/cloud/answer/6158849?hl=en

#### `GOOGLE_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for Google OAuth

#### `GOOGLE_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for Google OAuth

#### `GOOGLE_OAUTH_SCOPE`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for Google OAuth authentication.

#### `GOOGLE_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/google/callback`
- Description: Sets the redirect URI for Google OAuth

### Microsoft

See https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app

#### `MICROSOFT_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for Microsoft OAuth

#### `MICROSOFT_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for Microsoft OAuth

#### `MICROSOFT_CLIENT_TENANT_ID`

- Type: `str`
- Description: Sets the tenant ID for Microsoft OAuth

#### `MICROSOFT_OAUTH_SCOPE`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for Microsoft OAuth authentication.

#### `MICROSOFT_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/microsoft/callback`
- Description: Sets the redirect URI for Microsoft OAuth

### OpenID (OIDC)

#### `OAUTH_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for OIDC

#### `OAUTH_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for OIDC

#### `OPENID_PROVIDER_URL`

- Type: `str`
- Description: Path to the `.well-known/openid-configuration` endpoint

#### `OAUTH_PROVIDER_NAME`

- Type: `str`
- Default: `SSO`
- Description: Sets the name for the OIDC provider.

#### `OPENID_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/oidc/callback`
- Description: Sets the redirect URI for OIDC

## LDAP

#### `ENABLE_LDAP`

- Type: `bool`
- Default: `False`
- Description: Enables or disables LDAP authentication.

#### `LDAP_APP_DN`

- Type: `str`
- Description: Sets the distinguished name for LDAP application.

#### `LDAP_APP_PASSWORD`

- Type: `str`
- Description: Sets the password for LDAP application.

#### `LDAP_ATTRIBUTE_FOR_USERNAME`

- Type: `str`
- Description: Sets the attribute to use as username for LDAP authentication.

#### `LDAP_CA_CERT_FILE`

- Type: `str`
- Description: Sets the path to LDAP CA certificate file.

#### `LDAP_CIPHERS`

- Type: `str`
- Description: Sets the ciphers to use for LDAP connection.

#### `LDAP_SEARCH_BASE`

- Type: `str`
- Description: Sets the base to search for LDAP authentication.

#### `LDAP_SEARCH_FILTER`

- Type: `str`
- Description: Sets the filter to use for LDAP search.

#### `LDAP_SERVER_HOST`

- Type: `str`
- Description: Sets the hostname of LDAP server.

#### `LDAP_SERVER_LABEL`

- Type: `str`
- Description: Sets the label of LDAP server.

#### `LDAP_SERVER_PORT`

- Type: `int`
- Description: Sets the port number of LDAP server.

#### `LDAP_USE_TLS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables TLS for LDAP connection.

## Workspace Permissions

#### `USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to access workspace models.

#### `USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to access workspace knowledge.

#### `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to access workspace prompts.

#### `USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to access workspace tools.

## Chat Permissions

#### `USER_PERMISSIONS_CHAT_FILE_UPLOAD`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to upload files to chats.

#### `USER_PERMISSIONS_CHAT_DELETE`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to delete chats.

#### `USER_PERMISSIONS_CHAT_EDIT`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to edit chats.

#### `USER_PERMISSIONS_CHAT_TEMPORARY`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to create temporary chats.

## Misc Environment Variables

These variables are not specific to Open WebUI but can still be valuable in certain contexts.

### Amazon S3 Storage

#### `STORAGE_PROVIDER`

- Type: `str`
- Description: Sets the storage provider.

#### `S3_ACCESS_KEY_ID`

- Type: `str`
- Description: Sets the access key ID for S3 storage.

#### `S3_BUCKET_NAME`

- Type: `str`
- Description: Sets the bucket name for S3 storage.

#### `S3_ENDPOINT_URL`

- Type: `str`
- Description: Sets the endpoint URL for S3 storage.

#### `S3_REGION_NAME`

- Type: `str`
- Description: Sets the region name for S3 storage.

#### `S3_SECRET_ACCESS_KEY`

- Type: `str`
- Description: Sets the secret access key for S3 storage.

### Database Pool

#### `DATABASE_URL`

- Type: `str`
- Default: `sqlite:///${DATA_DIR}/webui.db`
- Description: Specifies the database URL to connect to.

:::info

Supports SQLite and Postgres. Changing the URL does not migrate data between databases.
Documentation on URL scheme available [here](https://docs.sqlalchemy.org/en/20/core/engines.html#database-urls).

:::

#### `DATABASE_POOL_SIZE`

- Type: `int`
- Default: `0`
- Description: Specifies the size of the database pool. A value of `0` disables pooling.

#### `DATABASE_POOL_MAX_OVERFLOW`

- Type: `int`
- Default: `0`
- Description: Specifies the database pool max overflow.

:::info

More information about this setting can be found [here](https://docs.sqlalchemy.org/en/20/core/pooling.html#sqlalchemy.pool.QueuePool.params.max_overflow).

:::

#### `DATABASE_POOL_TIMEOUT`

- Type: `int`
- Default: `30`
- Description: Specifies the database pool timeout in seconds to get a connection.

:::info

More information about this setting can be found [here](https://docs.sqlalchemy.org/en/20/core/pooling.html#sqlalchemy.pool.QueuePool.params.timeout).

:::

#### `DATABASE_POOL_RECYCLE`

- Type: `int`
- Default: `3600`
- Description: Specifies the database pool recycle time in seconds.

:::info

More information about this setting can be found [here](https://docs.sqlalchemy.org/en/20/core/pooling.html#setting-pool-recycle).

:::

### Redis

#### `ENABLE_WEBSOCKET_SUPPORT`

- Type: `bool`
- Default: `False`
- Description: Enables websocket support in Open WebUI (used with Redis).

#### `WEBSOCKET_MANAGER`

- Type: `str`
- Default: `redis`
- Description: Specifies the websocket manager to use (in this case, Redis).

#### `WEBSOCKET_REDIS_URL` (`REDIS_URL` exists for potential future use cases. In practice, it is recommended to set both.)

- Type: `str`
- Default: `redis://localhost:6379/0`
- Description: Specifies the URL of the Redis instance for websocket communication.

### Proxy Settings

Open WebUI supports using proxies for HTTP and HTTPS retrievals. To specify proxy settings,
Open WebUI uses the following environment variables:

#### `http_proxy`

- Type: `str`
- Description: Sets the URL for the HTTP proxy.

#### `https_proxy`

- Type: `str`
- Description: Sets the URL for the HTTPS proxy.

#### `no_proxy`

- Type: `str`
- Description: Lists domain extensions (or IP addresses) for which the proxy should not be used,
separated by commas. For example, setting no_proxy to '.mit.edu' ensures that the proxy is
bypassed when accessing documents from MIT.
