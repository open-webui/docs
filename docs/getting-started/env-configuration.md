# Environment Variable Configuration

## Overview

Open WebUI provides a range of environment variables that allow you to customize and configure various aspects of the application. This page serves as a comprehensive reference for all available environment variables, including their types, default values, and descriptions.

## App/Backend

The following environment variables are used by `backend/config.py` to provide Open WebUI startup configurability. Please note that some variables may have different default values depending on whether you're running Open WebUI directly or via Docker. For more information on logging environment variables, see our [logging documentation](/getting-started/logging#appbackend).

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

    If set to `False`, authentication will be disabled for your Open WebUI instance. However,
    it's important to note that turning off authentication is only possible for fresh installations without any existing users.
    If there are already users registered, you cannot disable authentication directly. Ensure that no users are present in the database,
    if you intend to turn off `WEBUI_AUTH`.

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

    This is the maximum amount of time the client will wait for a response before timing out. If set to an empty string (' '),
    the timeout will be set to `None`, effectively disabling the timeout and allowing the client to wait indefinitely.

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
- Description: Sets `WEBUI_NAME` but polls _api.openwebui.com_ for metadata.

#### `ENABLE_SIGNUP`

- Type: `bool`
- Default: `True`
- Description: Toggles user account creation.

#### `ENABLE_LOGIN_FORM`

- Type: `bool`
- Default: `True`
- Description: Toggles email, password, sign in and "or" (only when `ENABLE_OAUTH_SIGNUP` is set to true) elements.

:::danger

    This should **only** ever be set to `False` when [ENABLE_OAUTH_SIGNUP](https://docs.openwebui.com/getting-started/env-configuration#enable_oauth_signup)
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

#### `ENABLE_MODEL_FILTER`

- Type: `bool`
- Default: `False`
- Description: Toggles Language Model filtering.

#### `MODEL_FILTER_LIST`

- Type: `str`
- Description: Sets the Language Model filter list, semicolon-separated
- Example: `llama3:instruct;gemma:instruct`

#### `WEBHOOK_URL`

- Type: `str`
- Description: Sets a webhook for integration with Slack/Microsoft Teams.

#### `ENABLE_ADMIN_EXPORT`

- Type: `bool`
- Default: `True`
- Description: Controls whether admin users can export data.

#### `ENABLE_COMMUNITY_SHARING`

- Type: `bool`
- Default: `True`
- Description: Controls whether users are shown the share to community button.

#### `WEBUI_BUILD_HASH`

- Type: `str`
- Default: `dev-build`
- Description: Used for identifying the Git SHA of the build for releases.

#### `WEBUI_BANNERS`

- Type: `list` of `dict`
- Default: `[]`
- Description: List of banners to show to users. Format of banners are:

```json
{
  "id": "string",
  "type": "string [info, success, warning, error]",
  "title": "string",
  "content": "string",
  "dismissible": false, # controls if the banner can be dismissed by users
  "timestamp": 1000 # created at timestamp
}
```

#### `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`

- Type: `str`
- Description: Defines the trusted request header for authentication. See [SSO docs](/tutorial/sso).

#### `WEBUI_AUTH_TRUSTED_NAME_HEADER`

- Type: `str`
- Description: Defines the trusted request header for the username of anyone registering with the `WEBUI_AUTH_TRUSTED_EMAIL_HEADER` header. See [SSO docs](/tutorial/sso).

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
- Description: Builds the Docker image with NVIDIA CUDA support. Enables GPU acceleration for local Whisper and embeddings.

#### `DATABASE_URL`

- Type: `str`
- Default: `sqlite:///${DATA_DIR}/webui.db`
- Description: Specifies the database URL to connect to.

:::info

    Supports SQLite and Postgres. Changing the URL does not migrate data between databases.
    Documentation on URL scheme available [here](https://docs.peewee-orm.com/en/latest/peewee/playhouse.html#db-url).

:::

#### `PORT`

- Type: `int`
- Default: `8080`
- Description: Sets the port to run Open WebUI from.

#### `RESET_CONFIG_ON_START`

- Type: `bool`
- Default: `False`
- Description: Resets the `config.json` file on startup.

#### `SHOW_ADMIN_DETAILS`

- Type: `bool`
- Default: `True`
- Description: Toggles whether to show admin user details in the interface.

#### `ADMIN_EMAIL`

- Type: `str`
- Description: Sets the admin email shown by `SHOW_ADMIN_DETAILS`

#### `SAFE_MODE`

- Type: `bool`
- Default: `false`
- Description: Enables safe mode, which disables potentially unsafe features.

#### `WEBUI_SESSION_COOKIE_SAME_SITE`

- Type: `str` (enum: `lax`, `strict`, `none`)
- Options:
  - `lax` - Sets the `SameSite` attribute to lax, allowing session cookies to be sent with requests initiated by third-party websites.
  - `strict` - Sets the `SameSite` attribute to strict, blocking session cookies from being sent with requests initiated by third-party websites.
  - `none` - Sets the `SameSite` attribute to none, allowing session cookies to be sent with requests initiated by third-party websites, but only over HTTPS.
- Default: `lax`
- Description: Sets the `SameSite` attribute for session cookies.

#### `WEBUI_SESSION_COOKIE_SECURE`

- Type: `bool`
- Default: `false`
- Description: Sets the `Secure` attribute for session cookies if set to `true`.

#### `AIOHTTP_CLIENT_TIMEOUT`

- Type: `int`
- Description: Sets the timeout in seconds for internal aiohttp connections. This impacts things such as connections to Ollama and OpenAI endpoints.

### Ollama

#### `ENABLE_OLLAMA_API`

- Type: `bool`
- Default: `true`
- Description: Enables the use of Ollama APIs.

#### `OLLAMA_BASE_URL`

- Type: `str`
- Default: `http://localhost:11434`
- Docker Default:
  - If `K8S_FLAG` is set: `http://ollama-service.open-webui.svc.cluster.local:11434`
  - If `USE_OLLAMA_DOCKER=true`: `http://localhost:11434`
  - Else `http://host.docker.internal:11434`
- Description: Configures the Ollama backend URL.

#### `OLLAMA_BASE_URLS`

- Type: `str`
- Description: Configures load-balanced Ollama backend hosts, separated by `;`. See [`OLLAMA_BASE_URL`](#ollama_base_url). Takes precedence over[`OLLAMA_BASE_URL`](#ollama_base_url).

#### `K8S_FLAG`

- Type: `bool`
- Description: If set, assumes Helm chart deployment and sets [`OLLAMA_BASE_URL`](#ollama_base_url) to `http://ollama-service.open-webui.svc.cluster.local:11434`

#### `USE_OLLAMA_DOCKER`

- Type: `bool`
- Default: `False`
- Description: Builds the Docker image with a bundled Ollama instance.

#### `OLLAMA_API_BASE_URL`

- Type: `str`
- Default: `http://localhost:11434/api`
- Description: Deprecated, see [`OLLAMA_BASE_URL`](#ollama_base_url).

### OpenAI

#### `ENABLE_OPENAI_API`

- Type: `bool`
- Default: `true`
- Description: Enables the use of OpenAI APIs.

#### `OPENAI_API_KEY`

- Type: `str`
- Description: Sets the OpenAI API key.

#### `OPENAI_API_BASE_URL`

- Type: `str`
- Default: `https://api.openai.com/v1`
- Description: Configures the OpenAI base API URL.

#### `OPENAI_API_BASE_URLS`

- Type: `str`
- Description: Supports balanced OpenAI base API URLs, semicolon-separated.
- Example: `http://host-one:11434;http://host-two:11434`

#### `OPENAI_API_KEYS`

- Type: `str`
- Description: Supports multiple OpenAI API keys, semicolon-separated.
- Example: `sk-124781258123;sk-4389759834759834`

### Tasks

#### `TASK_MODEL`

- Type: `str`
- Description: The default model to use for tasks such as title and web search query generation when using Ollama models.

#### `TASK_MODEL_EXTERNAL`

- Type: `str`
- Description: The default model to use for tasks such as title and web search query generation when using OpenAI-compatible endpoints.

#### `TITLE_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when generating chat titles.
- Default:

```
Here is the query:
{{prompt:middletruncate:8000}}

Create a concise, 3-5 word phrase with an emoji as a title for the previous query. Suitable Emojis for the summary can be used to enhance understanding but avoid quotation marks or special formatting. RESPOND ONLY WITH THE TITLE TEXT.

Examples of titles:
📉 Stock Market Trends
🍪 Perfect Chocolate Chip Recipe
Evolution of Music Streaming
Remote Work Productivity Tips
Artificial Intelligence in Healthcare
🎮 Video Game Development Insights
```

#### `SEARCH_QUERY_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when generating search queries.
- Default:

```
You are tasked with generating web search queries. Give me an appropriate query to answer my question for google search. Answer with only the query. Today is {{CURRENT_DATE}}.
        
Question:
{{prompt:end:4000}}
```

#### `SEARCH_QUERY_PROMPT_LENGTH_THRESHOLD`

- Type: `int`
- Default: `100`
- Description: Sets the minimum length of a prompt before a model is used to synthesize a web search query when web search is enabled.

#### `TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when calling tools.
- Default:

```
Tools: {{TOOLS}}
If a function tool doesn't match the query, return an empty string. Else, pick a function tool, fill in the parameters from the function tool's schema, and return it in the format { "name": \"functionName\", "parameters": { "key": "value" } }. Only pick a function if the user asks.  Only return the object. Do not return any other text.
```

### RAG

#### `DOCS_DIR`

- Type: `str`
- Default: `${DATA_DIR}/docs`
- Description: Specifies the directory scanned for documents to add to the RAG database when triggered.

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
- Description: Enables the use of ensemble search with `BM25` + `ChromaDB`, with reranking using `sentence_transformers` models.

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- Type: `bool`
- Default: `True`
- Description: Enables TLS certification verification when browsing web pages for RAG.

#### `RAG_EMBEDDING_ENGINE`

- Type: `str` (enum: ` ` (empty for local model), `ollama`, `openai`)
- Options:
  - (empty) - Uses a local model for embeddings.
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
Use the following context as your learned knowledge, inside <context></context> XML tags.
<context>
    [context]
</context>

When answer to user:
- If you don't know, just say that you don't know.
- If you don't know when you are not sure, ask for clarification.
Avoid mentioning that you obtained the information from the context.
And answer according to the language of the user's question.

Given the context information, answer the query.
Query: [query]
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
- Description: Determines whether or not to allow custom models defined on the Hub in their own modeling files for reranking.

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
- Description: Enables local web fetching for RAG. Enabling this allows Server Side Request Forgery attacks against local network resources.

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

### Web Search

#### `ENABLE_RAG_WEB_SEARCH`

- Type: `bool`
- Default: `false`
- Description: Enable web search toggle

#### `RAG_WEB_SEARCH_ENGINE`

- Type: `str` (enum: `searxng`, `google_pse`, `brave`, `serpstack`, `serper`, `duckduckgo`, `tavily`, `jina`)
- Options:
  - `searxng` - Uses the SearXNG search engine.
  - `google_pse` - Uses the Google Programmable Search Engine.
  - `brave` - Uses the Brave search engine.
  - `serpstack` - Uses the Serpstack search engine.
  - `serper` - Uses the Serper search engine.
  - `duckduckgo` - Uses the DuckDuckGo search engine.
  - `tavily` - Uses the Tavily search engine.
  - `jina` - Uses the Jina search engine.
- Description: Select engine for performing searches

#### `SEARXNG_QUERY_URL`

- Type: `str`
- Description: The [SearXNG search API](https://docs.searxng.org/dev/search_api.html) URL supporting JSON output. `<query>` is replaced with the search query. Example: `http://searxng.local/search?q=<query>`

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

#### `RAG_WEB_SEARCH_DOMAIN_FILTER_LIST`

- Type: `list` of `str`
- Default: `[]`
- Description: You can provide a list of your own websites to filter after performing a web search. This ensures the highest level of safety and reliability of the information sources.

### Speech to Text

#### `AUDIO_STT_ENGINE`

- Type: `str` (enum: ` ` (empty for local Whisper), `openai`)
- Options:
  - (empty) - Uses local Whisper engine for Speech-to-Text.
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
- Description: Sets the Whisper model to use for Speech-to-Text.

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

- Type: `str` (enum: ` ` (empty for Web API), `openai`)
- Options:
  - (empty) - Uses Web API engine for Text-to-Speech.
  - `openai` - Uses OpenAI engine for Text-to-Speech.
- Description: Specifies the Text-to-Speech engine to use.

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

### Image Generation

#### `ENABLE_IMAGE_GENERATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables image generation features.

#### `IMAGE_GENERATION_ENGINE`

- Type: `str` (enum: `openai`, `comfyui`, `automatic1111`)
- Options:
  - `openai` - Uses OpenAI engine for image generation.
  - `comfyui` - Uses ComfyUI engine for image generation.
  - `automatic1111` - Uses Automatic1111 engine for image generation (default).
- Default: `automatic1111`
- Description: Specifies the engine to use for image generation.

#### `AUTOMATIC1111_BASE_URL`

- Type: `str`
- Description: Specifies the URL to Automatic1111's Stable Diffusion API.

#### `COMFYUI_BASE_URL`

- Type: `str`
- Description: Specifies the URL to the ComfyUI image generation API.

#### `IMAGES_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for DALL-E image generation.

#### `IMAGES_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for DALL-E image generation.

#### `IMAGE_SIZE`

- Type: `str`
- Default: `512x512`
- Description: Sets the default image size to generate.

#### `IMAGE_STEPS`

- Type: `int`
- Default: `50`
- Description: Sets the default iteration steps for image generation. Used for ComfyUI and AUTOMATIC1111.

#### `IMAGE_GENERATION_MODEL`

- Type: `str`
- Description: Default model to use for image generation

### OAuth

#### `ENABLE_OAUTH_SIGNUP`

- Type: `bool`
- Default: `False`
- Description: Enables user account creation via OAuth.

#### `OAUTH_MERGE_ACCOUNTS_BY_EMAIL`

- Type: `bool`
- Default: `False`
- Description: If enabled, merges OAuth accounts with existing accounts using the same email address. This is considered unsafe as providers may not verify email addresses and can lead account takeovers.

#### `OAUTH_USERNAME_CLAIM`

- Type: `str`
- Default: `name`
- Description: Set username claim for OpenID.

#### `OAUTH_PICTURE_CLAIM`

- Type: `str`
- Default: `picture`
- Description: Set picture (avatar) claim for OpenID.

#### `OAUTH_EMAIL_CLAIM`

- Type: `str`
- Default: `email`
- Description: Set email claim for OpenID.

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

#### `OAUTH_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for OIDC

#### `OAUTH_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for OIDC

#### `OPENID_PROVIDER_URL`

- Type: `str`
- Description: Path to the `.well-known/openid-configuration` endpoint

#### `OAUTH_SCOPES`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for OIDC authentication. `openid` and `email` are required.

#### `OAUTH_PROVIDER_NAME`

- Type: `str`
- Default: `SSO`
- Description: Sets the name for the OIDC provider.

#### `OPENID_REDIRECT_URI`

- Type: `str`
- Description: Sets the redirect URI for OIDC

### LiteLLM

:::warning

The bundled LiteLLM instance has been removed as of v0.2.0.
You will need to either migrate to [pipelines](https://github.com/open-webui/pipelines), or self host your own LiteLLM proxy.

:::

#### `ENABLE_LITELLM`

- Type: `bool`
- Default: `True`
- Description: Enables the bundled LiteLLM instance.

#### `LITELLM_PROXY_PORT`

- Type: `int`
- Default: `14365`
- Description: Sets the port to run the bundled LiteLLM instance on.

#### `LITELLM_PROXY_HOST`

- Type: `str`
- Default: `127.0.0.1`
- Description: Sets the address to run the bundled LiteLLM instance on.

## Misc Environment Variables

These variables are not specific to Open-Webui but can still be valuable in certain contexts.

### Proxy Settings

Open-Webui supports using proxies for HTTP and HTTPS retrievals. To specify proxy settings, Open-Webui uses the following environment variables:

#### `http_proxy`

- Type: `str`
- Description: Sets the URL for the HTTP proxy.

#### `https_proxy`

- Type: `str`
- Description: Sets the URL for the HTTPS proxy.

#### `no_proxy`

- Type: `str`
- Description: Lists domain extensions (or IP addresses) for which the proxy should not be used, separated by commas. For example, setting no_proxy to '.mit.edu' ensures that the proxy is bypassed when accessing documents from MIT.
