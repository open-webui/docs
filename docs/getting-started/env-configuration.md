# Environment Variable Configuration

## App/Backend ##

Here is a list of supported environment variables used by `backend/config.py` intended to provide Open WebUI startup configurability. See also the [logging environment variables](/getting-started/logging#appbackend).

| Environment Variable              | App/Backend                                                                 |
| --------------------------------- | --------------------------------------------------------------------------- |
| `CUSTOM_NAME`                     | Sets `WEBUI_NAME` but polls _api.openwebui.com_ for metadata                |
| `DEFAULT_MODELS`                  | Set a default Language Model, default: `None`                               |
| `ENABLE_SIGNUP`                   | Toggle user account creation, default: `"True"`                             |
| `ENV`                             | Environment setting, default: `"dev"`                                       |
| `K8S_FLAG`                        | Support Kubernetes style Ollama hostname `.svc.cluster.local`               |
| `MODEL_FILTER_ENABLED`            | Toggle Language Model filtering, default: `"False"`                         |
| `MODEL_FILTER_LIST`               | Set Language Model filter list                                              |
| `OLLAMA_API_BASE_URL`             | Deprecated, see `OLLAMA_BASE_URL`                                           |
| `OLLAMA_BASE_URL`                 | Configure Ollama backend URL, default: `"http://localhost:11434"`           |
| `OLLAMA_BASE_URLS`                | Configure load balanced Ollama backend hosts, see `OLLAMA_BASE_URL`         |
| `OPENAI_API_KEY`                  | Set OpenAI API key                                                          |
| `OPENAI_API_KEYS`                 | Support multiple Open API keys                                              |
| `OPENAI_API_BASE_URL`             | Configure OpenAI base API URL                                               |
| `OPENAI_API_BASE_URLS`            | Support balanced OpenAI base API URLs                                       |
| `RAG_EMBEDDING_MODEL`             | Configure a Sentence-Transformer model, default: `"all-MiniLM-L6-v2"`       |
| `RAG_EMBEDDING_MODEL_AUTO_UPDATE` | Toggle automatic update of the Sentence-Transformer model, default: `False` |
| `USE_CUDA_DOCKER`                 | Build docker image with NVIDIA CUDA support, default: `False`               |
| `USE_OLLAMA_DOCKER`               | Build Docker image with bundled Ollama instance, default: `"false"`         |
| `USER_PERMISSIONS_CHAT_DELETION`  | Toggle user permission to delete chats, default: `"True"`                   |
| `WEBHOOK_URL`                     | Set webhook for integration with Slack/Microsoft Teams                      |
| `WEBUI_AUTH_TRUSTED_EMAIL_HEADER` | Define trusted request header for authentication                            |
| `WEBUI_NAME`                      | Main WebUI name, default: `"Open WebUI"`                                    |
| `WEBUI_SECRET_KEY`                | Override randomly generated string used for JSON Web Token                  |
| `WEBUI_VERSION`                   | Override WebUI version, default: `"v1.0.0-alpha.100"`                       |
| `WHISPER_MODEL_AUTO_UPDATE`       | Toggle automatic update of the Whisper model, default: `False`              |
