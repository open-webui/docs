---
sidebar_position: 4
title: "🌍 Environment Variable Configuration"
---


## Overview

Open WebUI provides a range of environment variables that allow you to customize and configure
various aspects of the application. This page serves as a comprehensive reference for all available
environment variables, including their types, default values, and descriptions.

:::info
Last updated: v0.3.20
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

#### `WEBUI_AUTH`

- Type: `bool`
- Default Setting: `True`
- Description: This setting enables or disables authentication.

:::danger
If set to `False`, authentication will be disabled for your Open WebUI instance. However, it's
important to note that turning off authentication is only possible for fresh installations without
any existing users. If there are already users registered, you cannot disable authentication
directly. Ensure that no users are present in the database, if you intend to turn off `WEBUI_AUTH`.
:::

#### `WEBUI_NAME`

- Type: `str`
- Default: `Open WebUI`
- Description: Sets the main WebUI name. Appends `(Open WebUI)` if overridden.

#### `WEBUI_URL`

- Type: `str`
- Default: `http://localhost:3000`
- Description: Specifies the URL where the Open WebUI is reachable. Currently used for search engine support.

#### `AIOHTTP_CLIENT_TIMEOUT`

- Type: `int`
- Default: `300`
- Description: Specifies the timeout duration in seconds for the aiohttp client.

:::info
This is the maximum amount of time the client will wait for a response before timing out.
If set to an empty string (' '), the timeout will be set to `None`, effectively disabling the timeout and
allowing the client to wait indefinitely.
:::

#### `DATA_DIR`

- Type: `str`
- Default: `./data`
- Description: Specifies the base directory for data storage, including uploads, cache, vector database, etc.

#### `FRONTEND_BUILD_DIR`

- Type: `str`
- Default: `../build`
- Description: Specifies the location of the built frontend files.

#### `STATIC_DIR`

- Type: `str`
- Default: `./static`
- Description: Specifies the directory for static files, such as the favicon.

#### `CUSTOM_NAME`

- Type: `str`
- Description: Sets `WEBUI_NAME` but polls **api.openwebui.com** for metadata.

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

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- Type: `bool`
- Default: `True`
- Description: Bypass SSL Verification for RAG on Websites.

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

#### `USER_PERMISSIONS_CHAT_DELETION`

- Type: `bool`
- Default: `True`
- Description: Toggles user permission to delete chats.

#### `USER_PERMISSIONS_CHAT_EDITING`

- Type: `bool`
- Default: `True`
- Description: Toggles user permission to edit chats.

#### `USER_PERMISSIONS_CHAT_TEMPORARY`

- Type: `bool`
- Default: `True`
- Description: Toggles user permission to create temporary chats.

#### `ENABLE_MODEL_FILTER`

- Type: `bool`
- Default: `False`
- Description: Toggles Language Model filtering.

#### `MODEL_FILTER_LIST`

- Type: `str`
- Description: Sets the Language Model filter list, semicolon-separated
- Example: `llama3.1:instruct;gemma2:latest`

#### `WEBHOOK_URL`

- Type: `str`
- Description: Sets a webhook for integration with Slack/Microsoft Teams.

#### `ENABLE_ADMIN_EXPORT`

- Type: `bool`
- Default: `True`
- Description: Controls whether admin users can export data.

#### `ENABLE_ADMIN_CHAT_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables admin users to access all chats.

#### `ENABLE_COMMUNITY_SHARING`

- Type: `bool`
- Default: `True`
- Description: Controls whether users are shown the share to community button.

#### `ENABLE_MESSAGE_RATING`

- Type: `bool`
- Default: `True`
- Description: Enables message rating feature.

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

#### `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`

- Type: `str`
- Description: Defines the trusted request header for authentication. See [SSO docs](/features/sso).

#### `WEBUI_AUTH_TRUSTED_NAME_HEADER`

- Type: `str`
- Description: Defines the trusted request header for the username of anyone registering with the
`WEBUI_AUTH_TRUSTED_EMAIL_HEADER` header. See [SSO docs](/features/sso).

#### `WEBUI_SECRET_KEY`

- Type: `str`
- Default: `t0p-s3cr3t`
- Docker Default: Randomly generated on first start
- Description: Overrides the randomly generated string used for JSON Web Token.

#### `JWT_EXPIRES_IN`

- Type: `int`
- Default: `-1`
- Description: Sets the JWT expiration time in seconds. A value of -1 disables expiration.

#### `USE_CUDA_DOCKER`

- Type: `bool`
- Default: `False`
- Description: Builds the Docker image with NVIDIA CUDA support. Enables GPU acceleration
for local Whisper and embeddings.

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

#### `PORT`

- Type: `int`
- Default: `8080`
- Description: Sets the port to run Open WebUI from.

:::info
If installed via Python, you must instead pass `--port` as a command line argument.
:::

#### `RESET_CONFIG_ON_START`

- Type: `bool`
- Default: `False`
- Description: Resets the `config.json` file on startup.

#### `DEFAULT_LOCALE`

- Type: `str`
- Default: `en`
- Description: Sets the default locale for the application.

#### `FUNCTIONS_DIR`

- Type: `str`
- Default: `./functions`
- Description: Specifies the directory for custom functions.

#### `SHOW_ADMIN_DETAILS`

- Type: `bool`
- Default: `True`
- Description: Toggles whether to show admin user details in the interface.

#### `ADMIN_EMAIL`

- Type: `str`
- Description: Sets the admin email shown by `SHOW_ADMIN_DETAILS`

#### `SAFE_MODE`

- Type: `bool`
- Default: `False`
- Description: Enables safe mode, which disables potentially unsafe features, deactivating all functions.

#### `ENABLE_FORWARD_USER_INFO_HEADERS`

- type: `bool`
- Default: `False`
- Description: Forwards user information (name, id, email, and role) as X-headers to OpenAI API.
If enabled, the following headers are forwarded:
  - `X-OpenWebUI-User-Name`
  - `X-OpenWebUI-User-Id`
  - `X-OpenWebUI-User-Email`
  - `X-OpenWebUI-User-Role`

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

#### `CONTENT_SECURITY_POLICY`

- Type: `str`
- Description: Sets the `content-security-policy` HTTP header
- Example: `default-src 'self' 'unsafe-inline' 'unsafe-eval'; img-src 'self' https://* data:; child-src 'none'; font-src 'self' data:; worker-src 'self';`

#### `AIOHTTP_CLIENT_TIMEOUT`

- Type: `int`
- Description: Sets the timeout in seconds for internal aiohttp connections. This impacts things
such as connections to Ollama and OpenAI endpoints.

#### `AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST`

- Type: `int`
- Description: Sets the timeout in seconds for fetching the OpenAI model list. This can be useful in cases where network latency requires a longer timeout duration to successfully retrieve the model list.

#### `FONTS_DIR`

- Type: `str`
- Description: Specifies the directory for fonts.

### Ollama

#### `ENABLE_OLLAMA_API`

- Type: `bool`
- Default: `True`
- Description: Enables the use of Ollama APIs.

#### `OLLAMA_BASE_URL`

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

#### `SEARCH_QUERY_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when generating search queries.
- Default:

```
Assess the need for a web search based on the current question and prior interactions, but lean towards suggesting a Google search query if uncertain. Generate a Google search query even when the answer might be straightforward, as additional information may enhance comprehension or provide updated data. If absolutely certain that no further information is required, return an empty string. Default to a search query if unsure or in doubt. Today's date is {{CURRENT_DATE}}.

Current Question:
{{prompt:end:4000}}

Interaction History:
{{MESSAGES:END:6}}
```

#### `TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when calling tools.
- Default:

```
Available Tools: {{TOOLS}}\nReturn an empty string if no tools match the query. If a function tool matches, construct and return a JSON object in the format {\"name\": \"functionName\", \"parameters\": {\"requiredFunctionParamKey\": \"requiredFunctionParamValue\"}} using the appropriate tool and its parameters. Only return the object and limit the response to the JSON object without additional text.
```

#### `CORS_ALLOW_ORIGIN`

- Type: `str`
- Default: `*`
- Description: Sets the allowed origins for Cross-Origin Resource Sharing (CORS).

### RAG

#### `VECTOR_DB`

- Type: `str`
- Default: `chroma`
- Description: Specifies which vector database system to use, either 'chroma' for ChromaDB or 'milvus' for Milvus. This setting determines which vector storage system will be used for managing embeddings.

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

#### `MILVUS_URI`

- Type: `str`
- Default: `${DATA_DIR}/vector_db/milvus.db`
- Description: Specifies the URI for connecting to the Milvus vector database. This can point to a local or remote Milvus server based on the deployment configuration.

#### `RAG_TOP_K`

- Type: `int`
- Default: `5`
- Description: Sets the default number of results to consider when using RAG.

#### `RAG_RELEVANCE_THRESHOLD`

- Type: `float`
- Default: `0.0`
- Description: Sets the relevance threshold to consider for documents when used with reranking.

#### `ENABLE_RAG_HYBRID_SEARCH`

- Type: `bool`
- Default: `False`
- Description: Enables the use of ensemble search with `BM25` + `ChromaDB`, with reranking using
`sentence_transformers` models.

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- Type: `bool`
- Default: `True`
- Description: Enables TLS certification verification when browsing web pages for RAG.

#### `RAG_EMBEDDING_ENGINE`

- Type: `str` (enum: `ollama`, `openai`)
- Options:
  - Leave empty for `Default (SentenceTransformers)` - Uses SentenceTransformers for embeddings.
  - `ollama` - Uses the Ollama API for embeddings.
  - `openai` - Uses the OpenAI API for embeddings.
- Description: Selects an embedding engine to use for RAG.

#### `PDF_EXTRACT_IMAGES`

- Type: `bool`
- Default: `False`
- Description: Extracts images from PDFs using OCR when loading documents.

#### `RAG_EMBEDDING_MODEL`

- Type: `str`
- Default: `sentence-transformers/all-MiniLM-L6-v2`
- Description: Sets a model for embeddings. Locally, a Sentence-Transformer model is used.

#### `RAG_EMBEDDING_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the Sentence-Transformer model.

#### `RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE`

- Type: `bool`
- Default: `False`
- Description: Determines whether or not to allow custom models defined on the Hub in their own modeling files.

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

#### `RAG_RERANKING_MODEL`

- Type: `str`
- Description: Sets a model for reranking results. Locally, a Sentence-Transformer model is used.

#### `RAG_RERANKING_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the reranking model.

#### `RAG_RERANKING_MODEL_TRUST_REMOTE_CODE`

- Type: `bool`
- Default: `False`
- Description: Determines whether or not to allow custom models defined on the Hub in their own
modeling files for reranking.

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

#### `ENABLE_RAG_LOCAL_WEB_FETCH`

- Type: `bool`
- Default: `False`
- Description: Enables local web fetching for RAG. Enabling this allows Server Side Request
Forgery attacks against local network resources.

#### `YOUTUBE_LOADER_LANGUAGE`

- Type: `str`
- Default: `en`
- Description: Sets the language to use for YouTube video loading.

#### `CHUNK_SIZE`

- Type: `int`
- Default: `1500`
- Description: Sets the document chunk size for embeddings.

#### `CHUNK_OVERLAP`

- Type: `int`
- Default: `100`
- Description: Specifies how much overlap there should be between chunks.

#### `CONTENT_EXTRACTION_ENGINE`

- Type: `str` (`tika`)
- Options:
  - Leave empty to use default
  - `tika` - Use a local Apache Tika server
- Description: Sets the content extraction engine to use for document ingestion.

#### `TIKA_SERVER_URL`

- Type: `str`
- Default: `http://localhost:9998`
- Description: Sets the URL for the Apache Tika server.

#### `RAG_FILE_MAX_COUNT`

- Type: `int`
- Default: `10`
- Description: Sets the maximum number of files that can be uploaded at once for document ingestion.

#### `RAG_FILE_MAX_SIZE`

- Type: `int`
- Default: `100` (100MB)
- Description: Sets the maximum size of a file that can be uploaded for document ingestion.

### Web Search

#### `ENABLE_RAG_WEB_SEARCH`

- Type: `bool`
- Default: `False`
- Description: Enable web search toggle

#### `ENABLE_SEARCH_QUERY`

- Type: `bool`
- Default: `False`
- Description: Enables the generation of search queries from prompts

#### `RAG_WEB_SEARCH_ENGINE`

- Type: `str` (enum: `searxng`, `google_pse`, `brave`, `serpstack`, `serper`, `serply`, `searchapi`, `duckduckgo`, `tavily`, `jina`)
- Options:
  - `searxng` - Uses the [SearXNG](https://github.com/searxng/searxng) search engine.
  - `google_pse` - Uses the [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/).
  - `brave` - Uses the [Brave search engine](https://brave.com/search/api/).
  - `serpstack` - Uses the [Serpstack search engine](https://serpstack.com/).
  - `serper` - Uses the [Serper search engine](https://serper.dev/).
  - `serply` - Uses the [Serply search engine](https://serply.io/).
  - `searchapi` - Uses the [SearchAPI search engine](https://www.searchapi.io/).
  - `duckduckgo` - Uses the [DuckDuckGo search engine](https://duckduckgo.com/).
  - `tavily` - Uses the [Tavily search engine](https://tavily.com/).
  - `jina` - Uses the [Jina search engine](https://jina.ai/).
- Description: Select engine for performing searches

#### `SEARXNG_QUERY_URL`

- Type: `str`
- Description: The [SearXNG search API](https://docs.searxng.org/dev/search_api.html) URL supporting JSON output. `<query>` is replaced with
the search query. Example: `http://searxng.local/search?q=<query>`

#### `GOOGLE_PSE_API_KEY`

- Type: `str`
- Description: The API key for the Google Programmable Search Engine (PSE) service.

#### `GOOGLE_PSE_ENGINE_ID`

- Type: `str`
- Description: The engine ID for the Google Programmable Search Engine (PSE) service.

#### `BRAVE_SEARCH_API_KEY`

- Type: `str`
- Description: The API key for the Brave Search API.

#### `SERPSTACK_API_KEY`

- Type: `str`
- Description: The API key for Serpstack search API.

#### `SERPSTACK_HTTPS`

- Type: `bool`
- Default: `True`
- Description: Configures the use of HTTPS for Serpstack requests. Free tier requests are restricted to HTTP only.

#### `SERPER_API_KEY`

- Type: `str`
- Description: The API key for the Serper search API.

#### `SERPLY_API_KEY`

- Type: `str`
- Description: The API key for the Serply search API.

#### `TAVILY_API_KEY`

- Type: `str`
- Description: The API key for the Tavily search API.

#### `RAG_WEB_SEARCH_RESULT_COUNT`

- Type: `int`
- Default: `3`
- Description: Maximum number of search results to crawl.

#### `RAG_WEB_SEARCH_CONCURRENT_REQUESTS`

- Type: `int`
- Default: `10`
- Description: Number of concurrent requests to crawl web pages returned from search results.

#### `SEARCHAPI_API_KEY`

- Type: `str`
- Description: Sets the SearchAPI API key.

#### `SEARCHAPI_ENGINE`

- Type: `str`
- Description: Sets the SearchAPI engine.

### Speech to Text

#### `AUDIO_STT_ENGINE`

- Type: `str` (enum: `openai`)
- Options:
  - Leave empty to use local Whisper engine for Speech-to-Text.
  - `openai` - Uses OpenAI engine for Speech-to-Text.
- Description: Specifies the Speech-to-Text engine to use.

#### `AUDIO_STT_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for Speech-to-Text.

#### `AUDIO_STT_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for Speech-to-Text.

#### `AUDIO_STT_MODEL`

- Type: `str`
- Default: `whisper-1`
- Description: Specifies the Speech-to-Text model to use for OpenAI-compatible endpoints.

#### `WHISPER_MODEL`

- Type: `str`
- Default: `base`
- Description: Sets the Whisper model to use for Speech-to-Text. The backend used is faster_whisper with quantization to `int8`.

#### `WHISPER_MODEL_DIR`

- Type: `str`
- Default: `${DATA_DIR}/cache/whisper/models`
- Description: Specifies the directory to store Whisper model files.

#### `WHISPER_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the Whisper model.

### Text to Speech

#### `AUDIO_TTS_ENGINE`

- Type: `str` (enum: `elevenlabs`, `openai`)
- Options:
  - Leave empty to use built-in WebAPI engine for Text-to-Speech.
  - `elevenlabs` - Uses ElevenLabs engine for Text-to-Speech
  - `openai` - Uses OpenAI engine for Text-to-Speech.
- Description: Specifies the Text-to-Speech engine to use.

#### `AUDIO_TTS_API_KEY`

- Type: `str`
- Description: Sets the API key for Text-to-Speech.

#### `AUDIO_TTS_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for text-to-speech.

#### `AUDIO_TTS_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for text-to-speech.

#### `AUDIO_TTS_MODEL`

- Type: `str`
- Default: `tts-1`
- Description: Specifies the OpenAI text-to-speech model to use.

#### `AUDIO_TTS_VOICE`

- Type: `str`
- Default: `alloy`
- Description: Sets the OpenAI text-to-speech voice to use.

#### `AUDIO_TTS_SPLIT_ON`

- Type: `str`
- Default: `punctuation`
- Description: Sets the OpenAI text-to-speech split on to use.

### Image Generation

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

#### `AUTOMATIC1111_BASE_URL`

- Type: `str`
- Description: Specifies the URL to Automatic1111's Stable Diffusion API.

#### `AUTOMATIC1111_API_AUTH`

- Type: `str`
- Description: Sets the Automatic1111 API authentication.

#### `COMFYUI_BASE_URL`

- Type: `str`
- Description: Specifies the URL to the ComfyUI image generation API.

#### `COMFYUI_WORKFLOW`

- Type: `str`
- Description: Sets the ComfyUI workflow.

#### `IMAGES_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for DALL-E image generation.

#### `IMAGES_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for DALL-E image generation.

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

### OAuth

#### `ENABLE_OAUTH_SIGNUP`

- Type: `bool`
- Default: `False`
- Description: Enables user account creation via OAuth.

#### `OAUTH_MERGE_ACCOUNTS_BY_EMAIL`

- Type: `bool`
- Default: `False`
- Description: If enabled, merges OAuth accounts with existing accounts using the same email
address. This is considered unsafe as providers may not verify email addresses and can lead to
account takeovers.

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

#### `OAUTH_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for OIDC

#### `OAUTH_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for OIDC

#### `OAUTH_SCOPES`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for OIDC authentication. `openid` and `email` are required.

#### `OAUTH_PROVIDER_NAME`

- Type: `str`
- Default: `SSO`
- Description: Sets the name for the OIDC provider.

#### `ENABLE_OAUTH_ROLE_MANAGEMENT`

- Type: `bool`
- Default: `False`
- Description: Enables role management to oauth delegation.

#### `OAUTH_ROLES_CLAIM`

- Type: `str`
- Default: `roles`
- Description: Sets the roles claim to look for in the OIDC token.

#### `OAUTH_ALLOWED_ROLES`

- Type: `str`
- Default: `user,admin`
- Description: Sets the roles that are allowed access to the platform.

#### `OAUTH_ADMIN_ROLES`

- Type: `str`
- Default: `admin`
- Description: Sets the roles that are considered administrators.

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
- Description: Sets the redirect URI for Google OAuth

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
- Description: Sets the redirect URI for Microsoft OAuth

#### `OPENID_PROVIDER_URL`

- Type: `str`
- Description: Path to the `.well-known/openid-configuration` endpoint

#### `OPENID_REDIRECT_URI`

- Type: `str`
- Description: Sets the redirect URI for OIDC

### Tools

#### `TOOLS_DIR`

- Type: `str`
- Default: `${DATA_DIR}/tools`
- Description: Specifies the directory for custom tools.

## Misc Environment Variables

These variables are not specific to Open WebUI but can still be valuable in certain contexts.

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
