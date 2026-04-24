---
sidebar_position: 400
title: "API Endpoints"
---

This guide provides essential information on how to interact with the API endpoints effectively to achieve seamless integration and automation using our models. Please note that this is an experimental setup and may undergo future updates for enhancement.

## Authentication

To ensure secure access to the API, authentication is required 🛡️. You can authenticate your API requests using the Bearer Token mechanism. Obtain your API key from **Settings > Account** in the Open WebUI, or alternatively, use a JWT (JSON Web Token) for authentication. For full instructions on enabling and generating API keys - including the admin toggle and group permissions required for non-admin users - see [API Keys](/features/authentication-access/api-keys).

:::tip Alternate credential header for proxy-heavy setups
When Open WebUI is behind a reverse proxy that already uses the `Authorization` header for its own auth, you can deliver the API key via a custom header instead (`x-api-key` by default). Admins can rename the header via the [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) environment variable to avoid collisions — see [Behind a reverse proxy that consumes `Authorization`?](/features/authentication-access/api-keys#behind-a-reverse-proxy-that-consumes-authorization) for the full pattern.
:::

## Swagger Documentation Links

:::important

Make sure to set the `ENV` environment variable to `dev` in order to access the Swagger documentation for any of these services. Without this configuration, the documentation will not be available.

:::

Access detailed API documentation for different services provided by Open WebUI:

| Application | Documentation Path      |
|-------------|-------------------------|
| Main        | `/docs`                 |

## Notable API Endpoints

### 📜 Retrieve All Models

- **Endpoint**: `GET /api/models`
- **Description**: Fetches all models created or added via Open WebUI.
- **Example**:

  ```bash
  curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/models
  ```

### 💬 Chat Completions

- **Endpoint**: `POST /api/chat/completions`
- **Description**: Serves as an OpenAI API compatible chat completion endpoint for models on Open WebUI including Ollama models, OpenAI models, and Open WebUI Function models.

- **Curl Example**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "llama3.1",
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

- **Python Example**:

  ```python
  import requests

  def chat_with_model(token):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      data = {
        "model": "granite3.1-dense:8b",
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }
      response = requests.post(url, headers=headers, json=data)
      return response.json()
  ```

### 🔮 Anthropic Messages API

Open WebUI provides an Anthropic Messages API compatible endpoint. This allows tools, SDKs, and applications built for the Anthropic API to work directly against Open WebUI — routing requests through all configured models, filters, and pipelines.

Internally, the endpoint converts the Anthropic request format to OpenAI Chat Completions format, routes it through the existing chat completion pipeline, and converts the response back to Anthropic format. Both streaming and non-streaming requests are supported.

- **Endpoints**: `POST /api/message`, `POST /api/v1/messages`
- **Authentication**: Supports both `Authorization: Bearer YOUR_API_KEY` and Anthropic's `x-api-key: YOUR_API_KEY` header

- **Curl Example** (non-streaming):

  ```bash
  curl -X POST http://localhost:3000/api/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-4o",
        "max_tokens": 1024,
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

- **Curl Example** (streaming):

  ```bash
  curl -X POST http://localhost:3000/api/v1/messages \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-4o",
        "max_tokens": 1024,
        "stream": true,
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

- **Python Example** (using the Anthropic SDK):

  ```python
  from anthropic import Anthropic

  client = Anthropic(
      api_key="YOUR_OPEN_WEBUI_API_KEY",
      base_url="http://localhost:3000/api",
  )

  message = client.messages.create(
      model="gpt-4o",
      max_tokens=1024,
      messages=[
          {"role": "user", "content": "Why is the sky blue?"}
      ],
  )
  print(message.content[0].text)
  ```

  :::warning
  The `base_url` must be `http://localhost:3000/api` (not `/api/v1`). The Anthropic SDK automatically appends `/v1/messages` to the base URL.
  :::

- **Claude Code Configuration**:

  To use [Claude Code](https://docs.anthropic.com/en/docs/claude-code) with Open WebUI as a proxy, configure it to point at your Open WebUI instance:

  ```bash
  # Set environment variables for Claude Code
  export ANTHROPIC_BASE_URL="http://localhost:3000/api"
  export ANTHROPIC_API_KEY="YOUR_OPEN_WEBUI_API_KEY"

  # Then run Claude Code as normal
  claude
  ```

  Alternatively, create or edit `~/.claude/settings.json`:

  ```json
  {
    "env": {
      "ANTHROPIC_BASE_URL": "http://localhost:3000/api",
      "ANTHROPIC_AUTH_TOKEN": "YOUR_OPEN_WEBUI_API_KEY"
    }
  }
  ```

  This routes all Claude Code requests through Open WebUI's authentication and access control layer, letting you use any configured model (including local models via Ollama or vLLM) with Claude Code's interface.

:::info
All models configured in Open WebUI are accessible through this endpoint — including Ollama models, OpenAI models, and any custom function models. The `model` field should use the model ID as it appears in Open WebUI. Filters (inlet/stream) apply to these requests just as they do for the OpenAI-compatible endpoint.

**Tool Use:** The Anthropic Messages endpoint supports tool use (`tools` and `tool_choice` parameters). Tool calls from the upstream model are translated into Anthropic-format `tool_use` content blocks in both streaming and non-streaming responses.
:::

### 🔧 Filter and Function Behavior with API Requests

When using the API endpoints directly, filters (Functions) behave differently than when requests come from the web interface.

:::info Authentication Note
Open WebUI accepts both **API keys** (prefixed with `sk-`) and **JWT tokens** for API authentication. This is intentional—the web interface uses JWT tokens internally for the same API endpoints. Both authentication methods provide equivalent API access.
:::

#### Filter Execution

| Filter Function | WebUI Request | Direct API — stable (`main`) | Direct API — pre-release (`dev`) |
|----------------|--------------|------------------------------|-----------------------------------|
| `inlet()` | ✅ Runs | ✅ Runs | ✅ Runs |
| `stream()` | ✅ Runs | ✅ Runs | ✅ Runs |
| `outlet()` | ✅ Runs | ❌ Not called by `/api/chat/completions` — use `/api/chat/completed` | ⚠️ Runs inline only under narrow conditions (see below) |

The `inlet()` function always executes, making it ideal for:
- **Rate limiting** - Track and limit requests per user
- **Request logging** - Log all API usage for monitoring
- **Input validation** - Reject invalid requests before they reach the model

:::danger Outlet Behavior for Direct API Calls — Read Carefully
Earlier versions of this page said `outlet()` runs inline during `/api/chat/completions` for both WebUI and API requests. That was wrong. The accurate picture, verified in the backend source, is:

**On tagged releases / `main`:** `outlet()` is **not** invoked inline by `/api/chat/completions` at all. It only runs if the caller performs the second POST to `/api/chat/completed`. For now, if your integration needs `outlet()`, you must still do that second call.

**On `dev` / pre-release builds:** `outlet()` can run inline after `/api/chat/completions`, but only when **all** of the following are true:

1. The request body includes **both** `chat_id` **and** `id` (the assistant message id). If either is missing, the backend has no `event_emitter` and silently skips the outlet block.
2. The `chat_id` is a chat the authenticated user already **owns**, otherwise the request 404s before the outlet path is reached. (Alternatively, send `parent_id: null` without a `chat_id` to trigger new-chat creation on the server.)
3. The request is **non-streaming**. Streaming requests that satisfy (1) and (2) hit a code path designed for the WebUI: the server consumes the upstream stream itself and routes content to the user's WebSocket, so the HTTP response to a streaming API caller is effectively empty. Outlet runs, but you won't see its effect over HTTP.

Even in the non-streaming case, **`outlet()` does not rewrite the HTTP response body**. It updates the persisted chat message and emits a `chat:outlet` WebSocket event, but the JSON your client receives is the pre-outlet content. If you need the outlet-filtered text, read it back from the chat record, subscribe to the WebSocket, or keep using `/api/chat/completed`.

**Practical guidance:** if you are a pure API consumer (Continue.dev, Claude Code, custom scripts, Langfuse pipelines, etc.), treat `/api/chat/completed` as the supported way to run `outlet()` today. Inline execution on `dev` is primarily for WebUI-shaped clients that are already listening on the WebSocket.
:::

#### Legacy / Supported-for-API Endpoint: `/api/chat/completed`

`POST /api/chat/completed` is the endpoint that reliably runs `outlet()` for direct API integrations. On `dev` it is marked deprecated in favor of inline execution, but as described above, inline execution does not currently return the filtered payload to pure API callers — so in practice `/api/chat/completed` remains the right call for most API integrations today.

- **Endpoint**: `POST /api/chat/completed`
- **Description**: Runs `outlet()` filters (and pipeline outlet filters) unconditionally over a completed chat payload. Returns the filtered payload.

- **Curl Example**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completed \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "llama3.1",
        "messages": [
          {"role": "user", "content": "Hello"},
          {"role": "assistant", "content": "Hi! How can I help you today?"}
        ],
        "chat_id": "optional-uuid",
        "session_id": "optional-session-id"
      }'
  ```

- **Python Example**:

  ```python
  import requests

  def complete_chat_with_outlet(token, model, messages, chat_id=None):
      """
      Second-step call that actually runs outlet() for direct API callers.
      On tagged releases /api/chat/completions does not run outlet inline at all.
      On dev it runs inline only under narrow conditions and does not rewrite
      the HTTP response body, so this endpoint is still the right call for
      most API integrations that want outlet's output over HTTP.
      """
      url = 'http://localhost:3000/api/chat/completed'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': messages  # Include the full conversation with assistant response
      }
      if chat_id:
          payload['chat_id'] = chat_id
      
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

:::tip
If you need `outlet()` output over HTTP today, call `/api/chat/completions` followed by `/api/chat/completed`. Inline execution on `dev` is primarily for WebUI-shaped clients that read from the WebSocket. For more details on filter behavior, see the [Filter Function documentation](/features/extensibility/plugin/functions/filter#-filter-behavior-with-api-requests).
:::

### 🦙 Ollama API Proxy Support

If you want to interact directly with Ollama models—including for embedding generation or raw prompt streaming—Open WebUI offers a transparent passthrough to the native Ollama API via a proxy route.

- **Base URL**: `/ollama/<api>`
- **Reference**: [Ollama API Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)

#### 🔁 Generate Completion (Streaming)

```bash
curl http://localhost:3000/ollama/api/generate \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "llama3.2",
  "prompt": "Why is the sky blue?"
}'
```

#### 📦 List Available Models

```bash
curl http://localhost:3000/ollama/api/tags \
  -H "Authorization: Bearer YOUR_API_KEY"
```

#### 🧠 Generate Embeddings

```bash
curl -X POST http://localhost:3000/ollama/api/embed \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "llama3.2",
  "input": ["Open WebUI is great!", "Let'\''s generate embeddings."]
}'
```

:::info
When using the Ollama Proxy endpoints, you **must** include the `Content-Type: application/json` header for POST requests, or the API may fail to parse the body. Authorization headers are also required if your instance is secured.
:::

#### 🔮 Responses API (OpenAI-Compatible)

Ollama supports the OpenAI Responses API format. Open WebUI proxies this through the Ollama router with the same model resolution, access control, and prefix handling used by chat completions.

```bash
curl -X POST http://localhost:3000/ollama/v1/responses \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
  "model": "llama3.2",
  "input": "Why is the sky blue?"
}'
```

This allows API consumers (Codex, Claude Code, etc.) to use the Responses API directly with Ollama-hosted models without configuring a separate OpenAI-compatible connection.

This is ideal for building search indexes, retrieval systems, or custom pipelines using Ollama models behind the Open WebUI.

### 🧩 Retrieval Augmented Generation (RAG)

The Retrieval Augmented Generation (RAG) feature allows you to enhance responses by incorporating data from external sources. Below, you will find the methods for managing files and knowledge collections via the API, and how to use them in chat completions effectively.

#### Uploading Files

To utilize external data in RAG responses, you first need to upload the files. The content of the uploaded file is automatically extracted and stored in a vector database.

- **Endpoint**: `POST /api/v1/files/`
- **Query Parameters**:
  - `process` (boolean, default: `true`): Whether to extract content and compute embeddings
  - `process_in_background` (boolean, default: `true`): Whether to process asynchronously
- **Curl Example**:

  ```bash
  curl -X POST -H "Authorization: Bearer YOUR_API_KEY" -H "Accept: application/json" \
  -F "file=@/path/to/your/file" http://localhost:3000/api/v1/files/
  ```

- **Python Example**:

  ```python
  import requests

  def upload_file(token, file_path):
      url = 'http://localhost:3000/api/v1/files/'
      headers = {
          'Authorization': f'Bearer {token}',
          'Accept': 'application/json'
      }
      files = {'file': open(file_path, 'rb')}
      response = requests.post(url, headers=headers, files=files)
      return response.json()
  ```

:::warning Async Processing and Race Conditions

By default, file uploads are processed **asynchronously**. The upload endpoint returns immediately with a file ID, but content extraction and embedding computation continue in the background. 

If you attempt to add the file to a knowledge base before processing completes, you will receive a `400` error:

```
The content provided is empty. Please ensure that there is text or data present before proceeding.
```

**You must wait for file processing to complete before adding files to knowledge bases.** See the [Checking File Processing Status](#checking-file-processing-status) section below.

:::

#### Checking File Processing Status

Before adding a file to a knowledge base, verify that processing has completed using the status endpoint.

- **Endpoint**: `GET /api/v1/files/{id}/process/status`
- **Query Parameters**:
  - `stream` (boolean, default: `false`): If `true`, returns a Server-Sent Events (SSE) stream

**Status Values:**
| Status | Description |
|--------|-------------|
| `pending` | File is still being processed |
| `completed` | Processing finished successfully |
| `failed` | Processing failed (check `error` field for details) |

- **Python Example** (Polling):

  ```python
  import requests
  import time

  def wait_for_file_processing(token, file_id, timeout=300, poll_interval=2):
      """
      Wait for a file to finish processing.
      
      Returns:
          dict: Final status with 'status' key ('completed' or 'failed')
      
      Raises:
          TimeoutError: If processing doesn't complete within timeout
      """
      url = f'http://localhost:3000/api/v1/files/{file_id}/process/status'
      headers = {'Authorization': f'Bearer {token}'}
      
      start_time = time.time()
      while time.time() - start_time < timeout:
          response = requests.get(url, headers=headers)
          result = response.json()
          status = result.get('status')
          
          if status == 'completed':
              return result
          elif status == 'failed':
              raise Exception(f"File processing failed: {result.get('error')}")
          
          time.sleep(poll_interval)
      
      raise TimeoutError(f"File processing did not complete within {timeout} seconds")
  ```

- **Python Example** (SSE Streaming):

  ```python
  import requests
  import json

  def wait_for_file_processing_stream(token, file_id):
      """
      Wait for file processing using Server-Sent Events stream.
      More efficient than polling for long-running operations.
      """
      url = f'http://localhost:3000/api/v1/files/{file_id}/process/status?stream=true'
      headers = {'Authorization': f'Bearer {token}'}
      
      with requests.get(url, headers=headers, stream=True) as response:
          for line in response.iter_lines():
              if line:
                  line = line.decode('utf-8')
                  if line.startswith('data: '):
                      data = json.loads(line[6:])
                      status = data.get('status')
                      
                      if status == 'completed':
                          return data
                      elif status == 'failed':
                          raise Exception(f"File processing failed: {data.get('error')}")
      
      raise Exception("Stream ended unexpectedly")
  ```

#### Adding Files to Knowledge Collections

After uploading, you can group files into a knowledge collection or reference them individually in chats.

:::important
**Always wait for file processing to complete before adding files to a knowledge base.** Files that are still processing will have empty content, causing a `400` error. Use the status endpoint described above to verify the file status is `completed`.
:::

- **Endpoint**: `POST /api/v1/knowledge/{id}/file/add`
- **Curl Example**:

  ```bash
  curl -X POST http://localhost:3000/api/v1/knowledge/{knowledge_id}/file/add \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"file_id": "your-file-id-here"}'
  ```

- **Python Example**:

  ```python
  import requests

  def add_file_to_knowledge(token, knowledge_id, file_id):
      url = f'http://localhost:3000/api/v1/knowledge/{knowledge_id}/file/add'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      data = {'file_id': file_id}
      response = requests.post(url, headers=headers, json=data)
      return response.json()
  ```


#### Processing Web URLs into Knowledge Collections

Use this endpoint to fetch a webpage, extract content, and store the resulting chunks in a knowledge collection.

- **Endpoint**: `POST /api/v1/retrieval/process/web`
- **Query Parameters**:
  - `process` (boolean, default: `true`): If `false`, only fetches and returns extracted content without saving vectors
  - `overwrite` (boolean, default: `true`): Whether to replace existing vectors in the target collection before saving new chunks, effectively emptying the given collection and replacing it with the content of the given URL
- **Request Body**:
  - `url` (string, required): Web URL to fetch and parse
  - `collection_name` (string, optional): Target collection name. If omitted, Open WebUI generates one from the URL

**`overwrite` behavior:**
| Value | Result |
|-------|--------|
| `true` (default) | Existing vectors in the target collection are replaced before inserting the new URL chunks |
| `false` | Existing vectors are preserved and new URL chunks are added to the same collection |

- **Curl Example** (preserve existing vectors):

  ```bash
  curl -X POST 'http://localhost:3000/api/v1/retrieval/process/web?process=true&overwrite=false' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
        "url": "https://example.com/docs",
        "collection_name": "testkb"
      }'
  ```

- **Python Example**:

  ```python
  import requests

  def process_web_url(token, url, collection_name="testkb", overwrite=False):
      response = requests.post(
          'http://localhost:3000/api/v1/retrieval/process/web',
          headers={
              'Authorization': f'Bearer {token}',
              'Content-Type': 'application/json'
          },
          params={
              'process': 'true',
              'overwrite': str(overwrite).lower()
          },
          json={
              'url': url,
              'collection_name': collection_name
          }
      )
      return response.json()
  ```

:::tip
If `ENV=dev` is enabled, this endpoint schema (including query params like `overwrite`) is also visible in Swagger at `/docs`.
:::

#### Complete Workflow Example

Here's a complete example that uploads a file, waits for processing, and adds it to a knowledge base:

```python
import requests
import time

WEBUI_URL = 'http://localhost:3000'
TOKEN = 'your-api-key-here'

def upload_and_add_to_knowledge(file_path, knowledge_id, timeout=300):
    """
    Upload a file and add it to a knowledge base.
    Properly waits for processing to complete before adding.
    """
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Accept': 'application/json'
    }
    
    # Step 1: Upload the file
    with open(file_path, 'rb') as f:
        response = requests.post(
            f'{WEBUI_URL}/api/v1/files/',
            headers=headers,
            files={'file': f}
        )
    
    if response.status_code != 200:
        raise Exception(f"Upload failed: {response.text}")
    
    file_data = response.json()
    file_id = file_data['id']
    print(f"File uploaded with ID: {file_id}")
    
    # Step 2: Wait for processing to complete
    print("Waiting for file processing...")
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        status_response = requests.get(
            f'{WEBUI_URL}/api/v1/files/{file_id}/process/status',
            headers=headers
        )
        status_data = status_response.json()
        status = status_data.get('status')
        
        if status == 'completed':
            print("File processing completed!")
            break
        elif status == 'failed':
            raise Exception(f"Processing failed: {status_data.get('error')}")
        
        time.sleep(2)  # Poll every 2 seconds
    else:
        raise TimeoutError("File processing timed out")
    
    # Step 3: Add to knowledge base
    add_response = requests.post(
        f'{WEBUI_URL}/api/v1/knowledge/{knowledge_id}/file/add',
        headers={**headers, 'Content-Type': 'application/json'},
        json={'file_id': file_id}
    )
    
    if add_response.status_code != 200:
        raise Exception(f"Failed to add to knowledge: {add_response.text}")
    
    print(f"File successfully added to knowledge base!")
    return add_response.json()

# Usage
result = upload_and_add_to_knowledge('/path/to/document.pdf', 'your-knowledge-id')
```

#### Using Files and Collections in Chat Completions

You can reference both individual files or entire collections in your RAG queries for enriched responses.

##### Using an Individual File in Chat Completions

This method is beneficial when you want to focus the chat model's response on the content of a specific file.

- **Endpoint**: `POST /api/chat/completions`
- **Curl Example**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-4-turbo",
        "messages": [
          {"role": "user", "content": "Explain the concepts in this document."}
        ],
        "files": [
          {"type": "file", "id": "your-file-id-here"}
        ]
      }'
  ```

- **Python Example**:

  ```python
  import requests

  def chat_with_file(token, model, query, file_id):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': [{'role': 'user', 'content': query}],
          'files': [{'type': 'file', 'id': file_id}]
      }
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

##### Using a Knowledge Collection in Chat Completions

Leverage a knowledge collection to enhance the response when the inquiry may benefit from a broader context or multiple documents.

- **Endpoint**: `POST /api/chat/completions`
- **Curl Example**:

  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "gpt-4-turbo",
        "messages": [
          {"role": "user", "content": "Provide insights on the historical perspectives covered in the collection."}
        ],
        "files": [
          {"type": "collection", "id": "your-collection-id-here"}
        ]
      }'
  ```

- **Python Example**:

  ```python
  import requests

  def chat_with_collection(token, model, query, collection_id):
      url = 'http://localhost:3000/api/chat/completions'
      headers = {
          'Authorization': f'Bearer {token}',
          'Content-Type': 'application/json'
      }
      payload = {
          'model': model,
          'messages': [{'role': 'user', 'content': query}],
          'files': [{'type': 'collection', 'id': collection_id}]
      }
      response = requests.post(url, headers=headers, json=payload)
      return response.json()
  ```

These methods enable effective utilization of external knowledge via uploaded files and curated knowledge collections, enhancing chat applications' capabilities using the Open WebUI API. Whether using files individually or within collections, you can customize the integration based on your specific needs.

## Advantages of Using Open WebUI as a Unified LLM Provider

Open WebUI offers a myriad of benefits, making it an essential tool for developers and businesses alike:

- **Unified Interface**: Simplify your interactions with different LLMs through a single, integrated platform.
- **Ease of Implementation**: Quick start integration with comprehensive documentation and community support.

By following these guidelines, you can swiftly integrate and begin utilizing the Open WebUI API. Should you encounter any issues or have questions, feel free to reach out through our Discord Community or consult the FAQs. Happy coding! 🌟
