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

#### `WEBUI_VERSION`

- Default: `v1.0.0-alpha.100`
- Description: Overrides the WebUI version. Currently unused.

#### `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`

- Description: Defines the trusted request header for authentication. See [SSO docs](/tutorial/sso).

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

### Ollama

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
  - ` ` (empty for local model)
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

### Speech to Text

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

### LiteLLM

#### `ENABLE_LITELLM`

- Default: `True`
- Description: Enables the bundled LiteLLM instance.

#### `LITELLM_PROXY_PORT`

- Default: `14365`
- Description: Sets the port to run the bundled LiteLLM instance on.

#### `LITELLM_PROXY_HOST`

- Default: `127.0.0.1`
- Description: Sets the address to run the bundled LiteLLM instance on.
