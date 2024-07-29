# Environment Variable Configuration

## App/Backend

Here is a list of supported environment variables used by `backend/config.py` intended to provide Open WebUI startup configurability. See also the [logging environment variables](/getting-started/logging#appbackend). There may be different defaults depending if launched directly, or via Docker.

### General

#### `ENV`

- Options:
  - `dev` - Enables the FastAPI API docs on `/docs`
  - `prod` - Automatically configures several environment variables
- Default:
  - **Backend Default**: `dev`
  - **Docker Default**: `prod`
- Description: Environment setting.

#### `WEBUI_AUTH`

- Default Setting: `True`
- Description: This setting enables or disables authentication. If set to False, authentication is disabled. However, it's important to note that turning off authentication is only possible for fresh installations without any existing users. If there are already users registered, you cannot disable authentication directly. Ensure that no users are present in the database if you intend to turn off `WEBUI_AUTH`.

#### `WEBUI_NAME`

- Default: `Open WebUI`
- Description: Sets the main WebUI name. Appends `(Open WebUI)` if overridden.

#### `WEBUI_URL`

- Default: `http://localhost:3000`
- Description: Specifies the URL where the Open WebUI is reachable. Currently used for search engine support.

#### `AIOHTTP_CLIENT_TIMEOUT`

- Default: `300`
- Description: Specifies the timeout duration in seconds for the aiohttp client. This is the maximum amount of time the client will wait for a response before timing out. If set to an empty string (''), the timeout will be set to None, effectively disabling the timeout and allowing the client to wait indefinitely.

#### `DATA_DIR`

- Default: `./data`
- Description: Specifies the base directory for data storage, including uploads, cache, vector database, etc.

#### `FRONTEND_BUILD_DIR`

- Default: `../build`
- Description: Specifies the location of the built frontend files.

#### `STATIC_DIR`

- Default: `./static`
- Description: Specifies the directory for static files, such as the favicon.

#### `CUSTOM_NAME`

- Description: Sets `WEBUI_NAME` but polls _api.openwebui.com_ for metadata.

#### `ENABLE_SIGNUP`

- Default: `True`
- Description: Toggles user account creation.

### `ENABLE_LOGIN_FORM`

- Default: `True`
- Description: Toggles email, password, sign in and "or" (only when `ENABLE_OAUTH_SIGNUP` is set to true) elements.
- **Important Note:** This should **only** ever be set to `False` when [ENABLE_OAUTH_SIGNUP](https://docs.openwebui.com/getting-started/env-configuration#enable_oauth_signup) is also being used and set to `True`. Failure to do so will result in the inability to login.

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- Default: `True`
- Description: Bypass SSL Verification for RAG on Websites.

#### `DEFAULT_MODELS`

- Description: Sets a default Language Model.

#### `DEFAULT_USER_ROLE`

- Options: `pending`, `user`, `admin`
- Default: `pending`
- Description: Sets the default role assigned to new users.

#### `USER_PERMISSIONS_CHAT_DELETION`

- Default: `True`
- Description: Toggles user permission to delete chats.

#### `ENABLE_MODEL_FILTER`

- Default: `False`
- Description: Toggles Language Model filtering.

#### `MODEL_FILTER_LIST`

- Description: Sets the Language Model filter list, semicolon-separated
- Example: `llama3:instruct;gemma:instruct`

#### `WEBHOOK_URL`

- Description: Sets a webhook for integration with Slack/Microsoft Teams.

#### `ENABLE_ADMIN_EXPORT`

- Default: `True`
- Description: Controls whether admin users can export data.

#### `ENABLE_COMMUNITY_SHARING`

- Default: `True`
- Description: Controls whether users are shown the share to community button.

#### `WEBUI_BUILD_HASH`

- Default: `dev-build`
- Description: Used for identifying the Git SHA of the build for releases.

#### `WEBUI_BANNERS`

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

- Description: Defines the trusted request header for authentication. See [SSO docs](/tutorial/sso).

#### `WEBUI_AUTH_TRUSTED_NAME_HEADER`

- Description: Defines the trusted request header for the username of anyone registering with the `WEBUI_AUTH_TRUSTED_EMAIL_HEADER` header. See [SSO docs](/tutorial/sso).

#### `WEBUI_SECRET_KEY`

- Default: `t0p-s3cr3t`
- Docker Default: Randomly generated on first start
- Description: Overrides the randomly generated string used for JSON Web Token.

#### `JWT_EXPIRES_IN`

- Default: `-1`
- Description: Sets the JWT expiration time in seconds. A value of -1 disables expiration.

#### `USE_CUDA_DOCKER`

- Default: `False`
- Description: Builds the Docker image with NVIDIA CUDA support. Enables GPU acceleration for local Whisper and embeddings.

#### `DATABASE_URL`

- Default: `sqlite:///${DATA_DIR}/webui.db`
- Description: Specifies the database URL to connect to. Supports SQLite and Postgres. Changing the URL does not migrate data between databases. Documentation on URL scheme available [here](https://docs.peewee-orm.com/en/latest/peewee/playhouse.html#db-url).

#### `PORT`

- Default: `8080`
- Description: Sets the port to run Open WebUI from.

#### `RESET_CONFIG_ON_START`

- Default: `False`
- Description: Resets the `config.json` file on startup.

#### `SHOW_ADMIN_DETAILS`

- Default: `True`
- Description: Toggles whether to show admin user details in the interface.

#### `ADMIN_EMAIL`

- Description: Sets the admin email shown by `SHOW_ADMIN_DETAILS`

#### `SAFE_MODE`

- Default: `false`
- Description: Enables safe mode, which disables potentially unsafe features.

#### `WEBUI_SESSION_COOKIE_SAME_SITE`

- Default: `lax`
- Description: Sets the `SameSite` attribute for session cookies.

#### `WEBUI_SESSION_COOKIE_SECURE`

- Default: `false`
- Description: Sets the `Secure` attribute for session cookies if set to `true`.

#### `AIOHTTP_CLIENT_TIMEOUT`

- Description: Sets the timeout in seconds for internal aiohttp connections. This impacts things such as connections to Ollama and OpenAI endpoints.

### Ollama

#### `ENABLE_OLLAMA_API`

- Default: `true`
- Description: Enables the use of Ollama APIs.

#### `OLLAMA_BASE_URL`

- Default: `http://localhost:11434`
- Docker Default:
  - If `K8S_FLAG` is set: `http://ollama-service.open-webui.svc.cluster.local:11434`
  - If `USE_OLLAMA_DOCKER=true`: `http://localhost:11434`
  - Else `http://host.docker.internal:11434`
- Description: Configures the Ollama backend URL.

#### `OLLAMA_BASE_URLS`

- Description: Configures load-balanced Ollama backend hosts, separated by `;`. See [`OLLAMA_BASE_URL`](#ollama_base_url). Takes precedence over[`OLLAMA_BASE_URL`](#ollama_base_url).

#### `K8S_FLAG`

- Description: If set, assumes Helm chart deployment and sets [`OLLAMA_BASE_URL`](#ollama_base_url) to `http://ollama-service.open-webui.svc.cluster.local:11434`

#### `USE_OLLAMA_DOCKER`

- Default: `False`
- Description: Builds the Docker image with a bundled Ollama instance.

#### `OLLAMA_API_BASE_URL`

- Default: `http://localhost:11434/api`
- Description: Deprecated, see [`OLLAMA_BASE_URL`](#ollama_base_url).

### OpenAI

#### `OPENAI_API_KEY`

- Description: Sets the OpenAI API key.

#### `OPENAI_API_BASE_URL`

- Default: `https://api.openai.com/v1`
- Description: Configures the OpenAI base API URL.

#### `OPENAI_API_BASE_URLS`

- Description: Supports balanced OpenAI base API URLs, semicolon-separated.
- Example: `http://host-one:11434;http://host-two:11434`

#### `OPENAI_API_KEYS`

- Description: Supports multiple OpenAI API keys, semicolon-separated.
- Example: `sk-124781258123;sk-4389759834759834`

### Tasks

#### `TASK_MODEL`

- Description: The default model to use for tasks such as title and web search query generation when using Ollama models.

#### `TASK_MODEL_EXTERNAL`

- Description: The default model to use for tasks such as title and web search query generation when using OpenAI-compatible endpoints.

#### `TITLE_GENERATION_PROMPT_TEMPLATE`

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

- Description: Prompt to use when generating search queries.
- Default:

```
You are tasked with generating web search queries. Give me an appropriate query to answer my question for google search. Answer with only the query. Today is {{CURRENT_DATE}}.
        
Question:
{{prompt:end:4000}}
```

#### `SEARCH_QUERY_PROMPT_LENGTH_THRESHOLD`

- Default: `100`
- Description: Sets the minimum length of a prompt before a model is used to synthesize a web search query when web search is enabled.

#### `TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`

- Description: Prompt to use when calling tools.
- Default:

```
Tools: {{TOOLS}}
If a function tool doesn't match the query, return an empty string. Else, pick a function tool, fill in the parameters from the function tool's schema, and return it in the format { "name": \"functionName\", "parameters": { "key": "value" } }. Only pick a function if the user asks.  Only return the object. Do not return any other text.
```

### RAG

#### `DOCS_DIR`

- Default: `${DATA_DIR}/docs`
- Description: Specifies the directory scanned for documents to add to the RAG database when triggered.

#### `CHROMA_TENANT`

- Default: `default_tenant`
- Description: Sets the tenant for ChromaDB to use for RAG embeddings.

#### `CHROMA_DATABASE`

- Default: `default_database`
- Description: Sets the database in the ChromaDB tenant to use for RAG embeddings.

#### `CHROMA_HTTP_HOST`

- Description: Specifies the hostname of a remote ChromaDB Server. Uses a local ChromaDB instance if not set.

#### `CHROMA_HTTP_PORT`

- Default: `8000`
- Description: Specifies the port of a remote ChromaDB Server.

#### `CHROMA_HTTP_HEADERS`

- Description: Comma-separated list of HTTP headers to include with every ChromaDB request.
- Example: `Authorization=Bearer heuhagfuahefj,User-Agent=OpenWebUI`.

#### `CHROMA_HTTP_SSL`

- Default: `False`
- Description: Controls whether or not SSL is used for ChromaDB Server connections.

#### `RAG_TOP_K`

- Default: `5`
- Description: Sets the default number of results to consider when using RAG.

#### `RAG_RELEVANCE_THRESHOLD`

- Default: `0.0`
- Description: Sets the relevance threshold to consider for documents when used with reranking.

#### `ENABLE_RAG_HYBRID_SEARCH`

- Default: `False`
- Description: Enables the use of ensemble search with `BM25` + `ChromaDB`, with reranking using `sentence_transformers` models.

#### `ENABLE_RAG_WEB_LOADER_SSL_VERIFICATION`

- Default: `True`
- Description: Enables TLS certification verification when browsing web pages for RAG.

#### `RAG_EMBEDDING_ENGINE`

- Options:
  - `` (empty for local model)
  - `ollama`
  - `openai`
- Description: Selects an embedding engine to use for RAG.

#### `PDF_EXTRACT_IMAGES`

- Default: `False`
- Description: Extracts images from PDFs using OCR when loading documents.

#### `RAG_EMBEDDING_MODEL`

- Default: `sentence-transformers/all-MiniLM-L6`
- Description: Sets a model for embeddings. Locally, a Sentence-Transformer model is used.

#### `RAG_EMBEDDING_MODEL_AUTO_UPDATE`

- Default: `False`
- Description: Toggles automatic update of the Sentence-Transformer model.

#### `RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE`

- Default: `False`
- Description: Determines whether or not to allow custom models defined on the Hub in their own modeling files.

#### `RAG_TEMPLATE`

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

- Default: ``
- Description: Sets a model for reranking results. Locally, a Sentence-Transformer model is used.

#### `RAG_RERANKING_MODEL_AUTO_UPDATE`

- Default: `False`
- Description: Toggles automatic update of the reranking model.

#### `RAG_RERANKING_MODEL_TRUST_REMOTE_CODE`

- Default: `False`
- Description: Determines whether or not to allow custom models defined on the Hub in their own modeling files for reranking.

#### `RAG_OPENAI_API_BASE_URL`

- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI base API URL to use for RAG embeddings.

#### `RAG_OPENAI_API_KEY`

- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for RAG embeddings.

#### `RAG_EMBEDDING_OPENAI_BATCH_SIZE`

- Default: `1`
- Description: Sets the batch size for OpenAI embeddings.

#### `ENABLE_RAG_LOCAL_WEB_FETCH`

- Default: `False`
- Description: Enables local web fetching for RAG. Enabling this allows Server Side Request Forgery attacks against local network resources.

#### `YOUTUBE_LOADER_LANGUAGE`

- Default: `en`
- Description: Sets the language to use for YouTube video loading.

#### `CHUNK_SIZE`

- Default: `1500`
- Description: Sets the document chunk size for embeddings.

#### `CHUNK_OVERLAP`

- Default: `100`
- Description: Specifies how much overlap there should be between chunks.

### Web Search

#### `ENABLE_RAG_WEB_SEARCH`

- Default: `false`
- Description: Enable web search toggle

#### `RAG_WEB_SEARCH_ENGINE`

- Options: `searxng`, `google_pse`, `brave`, `serpstack`, `serper`, `duckduckgo`, `tavily`, `jina`
- Description: Select engine for performing searches

#### `SEARXNG_QUERY_URL`

- Description: The [SearXNG search API](https://docs.searxng.org/dev/search_api.html) URL supporting JSON output. `<query>` is replaced with the search query. Example: `http://searxng.local/search?q=<query>`

#### `GOOGLE_PSE_API_KEY`

- Description: The API key for the Google Programmable Search Engine (PSE) service.

#### `GOOGLE_PSE_ENGINE_ID`

- Description: The engine ID for the Google Programmable Search Engine (PSE) service.

#### `BRAVE_SEARCH_API_KEY`

- Default: ``
- Description: The API key for the Brave Search API.

#### `SERPSTACK_API_KEY`

- Description: The API key for Serpstack search API.

#### `SERPSTACK_HTTPS`

- Default: `True`
- Description: Configures the use of HTTPS for Serpstack requests. Free tier requests are restricted to HTTP only.

#### `SERPER_API_KEY`

- Description: The API key for the Serper search API.

#### `SERPLY_API_KEY`

- Description: The API key for the Serply search API.

#### `TAVILY_API_KEY`

- Description: The API key for the Tavily search API.

#### `RAG_WEB_SEARCH_RESULT_COUNT`

- Default: `3`
- Description: Maximum number of search results to crawl.

#### `RAG_WEB_SEARCH_CONCURRENT_REQUESTS`

- Default: `10`
- Description: Number of concurrent requests to crawl web pages returned from search results.

#### `RAG_WEB_SEARCH_DOMAIN_FILTER_LIST`

- Default: `[]`
- Description: You can provide a list of your own websites to filter after performing a web search. This ensures the highest level of safety and reliability of the information sources.

### Speech to Text

#### `AUDIO_STT_ENGINE`

- Options:
  - `` - empty for local Whisper
  - `openai` - OpenAI-compatible transcription
- Description: Specifies the Speech-to-Text engine to use.

#### `AUDIO_STT_OPENAI_API_BASE_URL`

- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for Speech-to-Text.

#### `AUDIO_STT_OPENAI_API_KEY`

- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for Speech-to-Text.

#### `AUDIO_STT_MODEL`

- Default: `whisper-1`
- Description: Specifies the Speech-to-Text model to use for OpenAI-compatible endpoints.

#### `WHISPER_MODEL`

- Default: `base`
- Description: Sets the Whisper model to use for Speech-to-Text.

#### `WHISPER_MODEL_DIR`

- Default: `${DATA_DIR}/cache/whisper/models`
- Description: Specifies the directory to store Whisper model files.

#### `WHISPER_MODEL_AUTO_UPDATE`

- Default: `False`
- Description: Toggles automatic update of the Whisper model.

### Text to Speech

#### `AUDIO_OPENAI_API_BASE_URL`

- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for text-to-speech.

#### `AUDIO_OPENAI_API_KEY`

- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for text-to-speech.

#### `AUDIO_OPENAI_API_MODEL`

- Default: `tts-1`
- Description: Specifies the OpenAI text-to-speech model to use.

#### `AUDIO_OPENAI_API_VOICE`

- Default: `alloy`
- Description: Sets the OpenAI text-to-speech voice to use.

### Image Generation

#### `ENABLE_IMAGE_GENERATION`

- Default: `False`
- Description: Enables or disables image generation features.

#### `IMAGE_GENERATION_ENGINE`

- Options: `openai`, `comfyui`, `automatic1111`
- Default: `automatic1111`
- Description: Specifies the engine to use for image generation.

#### `AUTOMATIC1111_BASE_URL`

- Description: Specifies the URL to Automatic1111's Stable Diffusion API.

#### `COMFYUI_BASE_URL`

- Description: Specifies the URL to the ComfyUI image generation API.

#### `COMFYUI_CFG_SCALE`

- Default: `7`
- Description: Specifies a `cfg_scale` value to use with ComfyUI. If you are using Stable Diffusion 3, the recommended value is `5.5`.

#### `COMFYUI_SAMPLER`

- Default: `euler`
- Description: Specifies a sampler to use with ComfyUI.

#### `COMFYUI_SCHEDULER`

- Default: `normal`
- Description: Specifies a scheduler to use with ComfyUI. If you are using Stable Diffusion 3, the recommended value is `sgm_uniform`.

#### `COMFYUI_SD3`

- Default: `False`
- Description: Sets ComfyUI to Stable Diffusion 3 mode. SD3 will work without this set, but the image quality will be significantly lower. Requires a recent version of ComfyUI.

#### `IMAGES_OPENAI_API_KEY`

- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for DALL-E image generation.

#### `IMAGES_OPENAI_API_BASE_URL`

- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for DALL-E image generation.

#### `IMAGE_SIZE`

- Default: `512x512`
- Description: Sets the default image size to generate.

#### `IMAGE_STEPS`

- Default: `50`
- Description: Sets the default iteration steps for image generation. Used for ComfyUI and AUTOMATIC1111.

#### `IMAGE_GENERATION_MODEL`

- Description: Default model to use for image generation

### OAuth

#### `ENABLE_OAUTH_SIGNUP`

- Default: `False`
- Description: Enables user account creation via OAuth.

#### `OAUTH_MERGE_ACCOUNTS_BY_EMAIL`

- Default: `False`
- Description: If enabled, merges OAuth accounts with existing accounts using the same email address. This is considered unsafe as providers may not verify email addresses and can lead account takeovers.

#### `OAUTH_USERNAME_CLAIM`

- Default: `name`
- Description: Set username claim for OpenID.

#### `OAUTH_PICTURE_CLAIM`

- Default: `picture`
- Description: Set picture (avatar) claim for OpenID.

#### `GOOGLE_CLIENT_ID`

- Description: Sets the client ID for Google OAuth

#### `GOOGLE_CLIENT_SECRET`

- Description: Sets the client secret for Google OAuth

#### `GOOGLE_OAUTH_SCOPE`

- Default: `openid email profile`
- Description: Sets the scope for Google OAuth authentication.

#### `MICROSOFT_CLIENT_ID`

- Description: Sets the client ID for Microsoft OAuth

#### `MICROSOFT_CLIENT_SECRET`

- Description: Sets the client secret for Microsoft OAuth

#### `MICROSOFT_CLIENT_TENANT_ID`

- Description: Sets the tenant ID for Microsoft OAuth

#### `MICROSOFT_OAUTH_SCOPE`

- Default: `openid email profile`
- Description: Sets the scope for Microsoft OAuth authentication.

#### `OAUTH_CLIENT_ID`

- Description: Sets the client ID for OIDC

#### `OAUTH_CLIENT_SECRET`

- Description: Sets the client secret for OIDC

#### `OPENID_PROVIDER_URL`

- Description: Path to the `.well-known/openid-configuration` endpoint

#### `OAUTH_SCOPES`

- Default: `openid email profile`
- Description: Sets the scope for OIDC authentication. `openid` and `email` are required.

#### `OAUTH_PROVIDER_NAME`

- Default: `SSO`
- Description: Sets the name for the OIDC provider.

### LiteLLM

:::warning

The bundled LiteLLM instance has been removed as of v0.2.0.
You will need to either migrate to [pipelines](https://github.com/open-webui/pipelines), or self host your own LiteLLM proxy.

:::

#### `ENABLE_LITELLM`

- Default: `True`
- Description: Enables the bundled LiteLLM instance.

#### `LITELLM_PROXY_PORT`

- Default: `14365`
- Description: Sets the port to run the bundled LiteLLM instance on.

#### `LITELLM_PROXY_HOST`

- Default: `127.0.0.1`
- Description: Sets the address to run the bundled LiteLLM instance on.

## Misc Environment Variables

These variables are not specific to Open-Webui but can still be valuable in certain contexts.

### Proxy Settings

Open-Webui supports using proxies for HTTP and HTTPS retrievals. To specify proxy settings, Open-Webui uses the following environment variables:

#### `http_proxy`

#### `https_proxy`

- These variables, if set, should contain the URLs for HTTP and HTTPS proxies, respectively.

#### `no_proxy`

- This variable lists domain extensions (or IP addresses) for which the proxy should not be used, separated by commas. For example, setting no_proxy to '.mit.edu' ensures that the proxy is bypassed when accessing documents from MIT.
