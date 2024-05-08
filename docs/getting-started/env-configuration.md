# Environment Variable Configuration

## App/Backend

Here is a list of supported environment variables used by `backend/config.py` intended to provide Open WebUI startup configurability. See also the [logging environment variables](/getting-started/logging#appbackend).

| Environment Variable              | App/Backend                                                                                                      |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `AUTOMATIC1111_BASE_URL`          | URL to Automatic1111's Stable Diffusion API.                                                                     |
| `COMFYUI_BASE_URL`                | URL to ComfyUI image generation API.                                                                             |
| `CUSTOM_NAME`                     | Sets `WEBUI_NAME` but polls _api.openwebui.com_ for metadata                                                     |
| `DATA_DIR`                        | Specifies the base directory for data storage, including uploads, cache, vector database, etc, default: `./data` |
| `DEFAULT_MODELS`                  | Set a default Language Model, default: `None`                                                                    |
| `DEFAULT_USER_ROLE`               | Sets the default role assigned to new users, default: `pending`, options: `pending`, `user`, `admin`             |
| `ENABLE_ADMIN_EXPORT`             | Controls whether admin users can export data, default: `True`                                                    |
| `ENABLE_IMAGE_GENERATION`         | Enables or disables image generation features, default: `False`                                                  |
| `ENABLE_SIGNUP`                   | Toggle user account creation, default: `"True"`                                                                  |
| `ENV`                             | Environment setting, default: `"dev"`                                                                            |
| `FRONTEND_BUILD_DIR`              | Location of the built frontend files, default: `../build`                                                        |
| `K8S_FLAG`                        | Support Kubernetes style Ollama hostname `.svc.cluster.local`                                                    |
| `ENABLE_MODEL_FILTER`            | Toggle Language Model filtering, default: `"False"`                                                              |
| `MODEL_FILTER_LIST`               | Set Language Model filter list, semicolon separated: `"llama3:instruct;gemma:instruct"`                          |
| `OLLAMA_API_BASE_URL`             | Deprecated, see `OLLAMA_BASE_URL`                                                                                |
| `OLLAMA_BASE_URL`                 | Configure Ollama backend URL, default: `"http://localhost:11434"`                                                |
| `OLLAMA_BASE_URLS`                | Configure load balanced Ollama backend hosts, see `OLLAMA_BASE_URL`                                              |
| `OPENAI_API_BASE_URL`             | Configure OpenAI base API URL                                                                                    |
| `OPENAI_API_BASE_URLS`            | Support balanced OpenAI base API URLs, semicolon separated: `"http://host-one:11434;http://host-two:11434"`      |
| `OPENAI_API_KEY`                  | Set OpenAI API key                                                                                               |
| `OPENAI_API_KEYS`                 | Support multiple Open API keys                                                                                   |
| `PORT`                            | Port to run Open WebUI from, default: `8080`                                                                     |
| `RAG_EMBEDDING_MODEL_AUTO_UPDATE` | Toggle automatic update of the Sentence-Transformer model, default: `False`                                      |
| `RAG_EMBEDDING_MODEL`             | Configure a Sentence-Transformer model, default: `"all-MiniLM-L6-v2"`                                            |
| `USE_CUDA_DOCKER`                 | Build docker image with NVIDIA CUDA support, default: `False`                                                    |
| `USE_OLLAMA_DOCKER`               | Build Docker image with bundled Ollama instance, default: `"false"`                                              |
| `USER_PERMISSIONS_CHAT_DELETION`  | Toggle user permission to delete chats, default: `"True"`                                                        |
| `WEBHOOK_URL`                     | Set webhook for integration with Slack/Microsoft Teams                                                           |
| `WEBUI_AUTH_TRUSTED_EMAIL_HEADER` | Define trusted request header for authentication                                                                 |
| `WEBUI_NAME`                      | Main WebUI name, default: `"Open WebUI"`                                                                         |
| `WEBUI_SECRET_KEY`                | Override randomly generated string used for JSON Web Token                                                       |
| `WEBUI_VERSION`                   | Override WebUI version, default: `"v1.0.0-alpha.100"`                                                            |
| `WHISPER_MODEL_AUTO_UPDATE`       | Toggle automatic update of the Whisper model, default: `False`                                                   |

### Mail-related

| Environment Variable              | App/Backend/Mail                                                                                                 |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `FRONTEND_URL`                    | URL to the frontend app, example: `https://mydomain.com`. Required for the "forgot your password" flow.          |
| `ENABLE_MAIL`                     | Toggle mail-based communication. It requires the following env variables to be defined, default: `False`         |
| `MAIL_USERNAME`                   | Username for email, some email hosts separates username from the default sender(AWS). (If you service does not provide username use sender address for connection.) |
| `MAIL_PASSWORD`                   | Password for authentication                                                                                      |
| `MAIL_SERVER`                     | SMTP Mail server.                                                                                                |
| `MAIL_STARTTLS`                   | For STARTTLS connections                                                                                         |
| `MAIL_SSL_TLS`                    | For connecting over TLS/SSL                                                                                      |
| `MAIL_DEBUG`                      | Debug mode for while sending mails, defaults 0.                                                                  |
| `MAIL_FROM`                       | Sender address                                                                                                   |
| `MAIL_FROM_NAME`                  | Title for Mail                                                                                                   |
| `SUPPRESS_SEND`                   | To mock sending out mail, defaults 0.                                                                            |
| `USE_CREDENTIALS`                 | Defaults to True. However it enables users to choose whether or not to login to their SMTP server.               |
| `VALIDATE_CERTS`                  | Defaults to True. It enables to choose whether to verify the mail server's certificate                           |
