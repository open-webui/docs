# OpenWebUI API - Complete Reference Documentation

This document provides a comprehensive, source-verified reference for the OpenWebUI server API. It details all major endpoints, recommended client flows, payloads, and data schemas for developers building integrations and applications.

## Table of Contents

1. [API Structure & Conventions](#api-structure--conventions)
2. [Authentication & Error Handling](#authentication--error-handling)
3. [API Endpoint Tree](#api-endpoint-tree)
4. [Chat & Session Management (/api/chats)](#chat--session-management-apichats)
5. [Unified Chat Completions (/api/chat/completions)](#unified-chat-completions-apichatcompletions)
6. [Completion Finalization (/api/chat/completed)](#completion-finalization-apichatcompleted)
7. [File & RAG Management (/api/v1)](#file--rag-management-apiv1)
8. [Model & Prompt Management](#model--prompt-management)
9. [Admin & System Endpoints](#admin--system-endpoints)
10. [Ollama Native Passthrough (/ollama)](#ollama-native-passthrough-ollama)
11. [OpenAI Compatibility Layer (/v1)](#openai-compatibility-layer-v1)
12. [Core Data Schemas](#core-data-schemas)
13. [Client Flows & Best Practices](#client-flows--best-practices)
14. [Appendix: Source Code References](#appendix-source-code-references)
15. [Appendix: curl Examples](#appendix-curl-examples)

## API Structure & Conventions

The OpenWebUI API is organized into logical prefixes that separate different functional concerns:

**Primary Management APIs (`/api`)**: All management APIs that drive the user interface live under this prefix, including chat session management, model configuration, and administrative functions.

**File & RAG Management (`/api/v1`)**: File upload and knowledge-base Retrieval-Augmented Generation endpoints are mounted under this dedicated namespace to handle document processing and vector indexing.

**OpenAI Compatibility (`/v1`)**: A separate stateless OpenAI-compatible layer is mounted at this prefix for external integrations expecting standard OpenAI API semantics.

**Ollama Integration (`/ollama`)**: Native Ollama pass-through endpoints are mounted under this prefix for direct access to Ollama's native API functionality.

All requests requiring authentication must include a valid bearer token in the Authorization header using the format: `Authorization: Bearer <token>`

## Authentication & Error Handling

### Authentication Requirements

Authentication is enforced through FastAPI dependencies using the `get_verified_user` function. All endpoints requiring authentication will return `401 Unauthorized` for missing or invalid tokens. Authorization and permissions are enforced at both model and administrative levels, with insufficient permissions yielding `403 Forbidden` responses.

Bearer tokens can be generated and managed through the web interface under Settings > Account, and must be included in all authenticated requests.

### Common HTTP Status Codes

The API follows standard HTTP status code conventions:

**Success Responses**: `200 OK` indicates successful requests, `201 Created` signifies successful resource creation such as new chats, and `204 No Content` confirms successful deletion operations.

**Client Error Responses**: `400 Bad Request` and `422 Unprocessable Entity` indicate malformed payloads, `401 Unauthorized` signals missing or invalid authentication tokens, `403 Forbidden` represents insufficient permissions, and `404 Not Found` indicates missing resources.

**Server Error Responses**: `5xx` status codes represent server errors, typically from upstream model adapter failures or internal server faults.

### Error Response Format

Typical error payloads follow a consistent structure:

```json
{
  "detail": "Error message"
}
```

## API Endpoint Tree

### Primary UI & Management Endpoints (`/api`)

**Chat Management (`/api/chats`)**:
- `POST /api/chats/new` - Create new chat session
- `GET /api/chats` - List user's chat sessions
- `GET /api/chats/{chat_id}` - Retrieve specific chat with full history
- `POST /api/chats/{chat_id}` - Update entire chat object including messages
- `DELETE /api/chats/{chat_id}` - Delete chat session

**Chat Processing**:
- `POST /api/chat/completions` - Unified chat completion endpoint (OpenAI-compatible)
- `POST /api/chat/completed` - Completion finalization for post-processing

**Model Management (`/api/models`)**:
- `GET /api/models` - List available models and metadata
- `POST /api/models/pull` - Pull or download models from registries

**Prompt Management (`/api/prompts`)**:
- `GET /api/prompts` - List prompt templates
- `POST /api/prompts` - Create new prompt templates

**Administrative Functions**:
- User Management (`/api/users`) - List, update, and delete users (admin only)
- System Management (`/api/system`) - Reload configurations and status checks (admin only)

### File & RAG Management (`/api/v1`)

**File Operations (`/api/v1/files`)**:
- `POST /api/v1/files` - Upload files via multipart form data
- `GET /api/v1/files` - List uploaded files
- `GET /api/v1/files/{id}/content` - Download raw file content
- `DELETE /api/v1/files/{id}` - Delete uploaded files

**Knowledge Base Operations (`/api/v1/knowledge`)**:
- `POST /api/v1/knowledge/create` - Create new knowledge bases
- `GET /api/v1/knowledge` - List available knowledge bases
- `GET /api/v1/knowledge/{id}` - Get knowledge base details
- `POST /api/v1/knowledge/{id}/file/add` - Add files to knowledge bases for embedding
- `DELETE /api/v1/knowledge/{id}/delete` - Delete knowledge bases and vector indices

### Integration Endpoints

**Ollama Passthrough (`/ollama`)**:
- `POST /ollama/api/generate` - Native Ollama generate endpoint
- `POST /ollama/api/chat` - Native Ollama chat endpoint

**OpenAI Compatibility (`/v1`)**:
- `GET /v1/models` - OpenAI-style model listing
- `POST /v1/chat/completions` - OpenAI-compatible chat completions

## Chat & Session Management (/api/chats)

The chat management endpoints handle persistent, UI-visible chat storage and editing operations that maintain conversation history across sessions.

### Create New Chat Session

Creates a new persistent chat record that can optionally be initialized with a complete message history.

**Endpoint**: `POST /api/chats/new`
**Authentication**: Required
**Content-Type**: `application/json`

**Request Body (ChatForm)**:
```json
{
  "model": "llama3.1:latest",
  "title": "Optional chat title",
  "system": "Optional system-level prompt",
  "messages": [
    {
      "role": "user",
      "content": "Initial message content"
    }
  ]
}
```

**Response**: `201 Created` - Returns the complete created chat object including the generated unique identifier.

### List User Chat Sessions

Retrieves summary objects for all chat sessions belonging to the authenticated user.

**Endpoint**: `GET /api/chats`
**Authentication**: Required

**Response**: `200 OK` - Returns an array of chat summary objects containing identifier, title, model, and creation timestamp information.

### Retrieve Complete Chat Details

Retrieves a single, complete chat object including the full message history and metadata.

**Endpoint**: `GET /api/chats/{chat_id}`
**Authentication**: Required (user must be owner or administrator)

**Response**: `200 OK` - Returns the complete chat object with all messages and metadata.

### Update Chat Session

Updates an entire chat object using a stateful approach where clients modify messages by sending the complete updated chat structure.

**Endpoint**: `POST /api/chats/{chat_id}`
**Authentication**: Required (user must be owner or administrator)

**Typical Usage Pattern**: To add a message, clients should fetch the chat via GET, append the new message to the messages array, and POST the complete updated chat object back to this endpoint.

**Response**: `200 OK` - Returns the updated chat object reflecting all changes.

### Delete Chat Session

Permanently removes the specified chat session and all associated message history.

**Endpoint**: `DELETE /api/chats/{chat_id}`
**Authentication**: Required (user must be owner or administrator)

**Response**: `204 No Content` - Confirms successful deletion with no response body.

## Unified Chat Completions (/api/chat/completions)

This central compute endpoint accepts OpenAI-style chat requests and intelligently routes them to the configured model adapter, whether Ollama, OpenAI proxy, Arena ensembles, or local model implementations. The endpoint operates statelessly unless clients explicitly associate requests with a `chat_id` parameter.

### Request Processing Flow

**Authentication and Validation**: The system authenticates requests using `get_verified_user` and validates user permissions for the specified model.

**Model Resolution**: The system resolves the requested model from `app.state.MODELS` or provided model configuration, enforcing appropriate access controls.

**Adapter Selection**: Based on the model's `owned_by` property, the system routes requests to the appropriate backend:
- `owned_by == "ollama"` routes to internal Ollama adapter
- `owned_by == "arena"` enables arena or ensemble selection policies
- `owned_by == "openai"` or third-party values forward to configured upstream providers

**Completion Processing**: The system performs completion generation, either streaming tokens or returning single JSON responses based on the `stream` parameter.

**Chat Association**: When `chat_id` is present, the system associates messages and assistant replies with persistent chat storage through internal chat router functionality.

**Background Task Scheduling**: If requested, the system schedules asynchronous background tasks for title generation, tag creation, and follow-up suggestions that update chat records upon completion.

### Request Parameters

**Endpoint**: `POST /api/chat/completions`
**Authentication**: Required
**Content-Type**: `application/json`

**Core Parameters**:

`model` (string, required): Model identifier specifying which model to use for completion generation.

`messages` (array, required): Complete conversation history as an array of Message objects representing the full context.

`stream` (boolean, optional): When true, the server returns streaming Server-Sent Events; defaults to true if not specified.

`chat_id` (string, optional): Associates the request with an existing persistent chat session for history storage.

`id` or `message_id` (string, optional): Assistant placeholder message identifier for updating specific message records (canonical server-side field name is `id`).

`session_id` (string, optional): Client session identifier used for telemetry and metadata tracking purposes.

**Feature Flags**:

`background_tasks` (object, optional): Enables asynchronous post-processing with flags such as `{"title_generation": true, "tags_generation": true, "follow_up_generation": true}`.

`features` (object, optional): Activates additional capabilities like `code_interpreter`, `web_search`, `image_generation`, and `memory` features.

`files` (array, optional): RAG integration hints specifying collection or file identifiers in format `{"id":"...", "type":"collection"}`.

**Model Parameters**: Standard OpenAI-compatible parameters including `temperature`, `max_tokens`, `top_p`, and `function_calling` configurations.

### Response Formats

**Non-Streaming Response** (`stream: false`): Returns a single JSON object following OpenAI ChatCompletion format:

```json
{
  "id": "cmpl-xxx",
  "object": "chat.completion", 
  "created": 1710000000,
  "model": "llama3.1",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Generated response content"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 12,
    "completion_tokens": 34,
    "total_tokens": 46
  }
}
```

**Streaming Response** (`stream: true`): Server-Sent Events (SSE) delivering delta tokens as data chunks. Clients must reconstruct content from SSE `data:` events and detect completion through `finish_reason` indicators or explicit `[DONE]` events.

## Completion Finalization (/api/chat/completed)

The completion finalization endpoint represents a critical lifecycle component that many UI workflows must invoke after receiving a complete assistant message, whether from streaming or non-streaming responses. This endpoint triggers server-side post-processing pipelines including content filtering, title generation, tag creation, follow-up suggestions, memory writes, and final message state persistence.

**Endpoint**: `POST /api/chat/completed`
**Authentication**: Required

**Request Body**:
```json
{
  "id": "assistant-message-uuid",
  "chat_id": "chat-session-uuid", 
  "message": {
    "role": "assistant",
    "content": "Complete assistant reply text content"
  },
  "model": "llama3.1"
}
```

**Purpose**: Signals the server that the assistant reply is complete, invoking backend processing pipelines and persisting final metadata.

**Response**: Returns acknowledgement or the updated chat and message object depending on implementation specifics.

## File & RAG Management (/api/v1)

The file and RAG management endpoints handle document uploads, knowledge base creation, and vector indexing operations that enable Retrieval-Augmented Generation capabilities. These endpoints are mounted under the `/api/v1` namespace to provide dedicated functionality for document processing workflows.

### File Management Operations

**File Upload** (`POST /api/v1/files`): Accepts multipart form-data uploads and returns file metadata objects containing identifier, filename, MIME type, size, and upload timestamp information.

**File Listing** (`GET /api/v1/files`): Returns a comprehensive list of uploaded files accessible to the authenticated user.

**File Content Retrieval** (`GET /api/v1/files/{id}/content`): Provides direct access to raw file content for download or processing purposes.

**File Deletion** (`DELETE /api/v1/files/{id}`): Permanently removes uploaded files from the system.

### Knowledge Base Operations

**Knowledge Base Creation** (`POST /api/v1/knowledge/create`): Establishes new knowledge bases with specified names and descriptions, returning unique knowledge base identifiers.

**Knowledge Base Listing** (`GET /api/v1/knowledge`): Provides comprehensive information about available knowledge bases including document counts and creation timestamps.

**Knowledge Base Details** (`GET /api/v1/knowledge/{id}`): Returns detailed information about specific knowledge bases including indexing status and associated files.

**File Integration** (`POST /api/v1/knowledge/{id}/file/add`): Adds uploaded files to knowledge bases, triggering embedding generation and vector indexing processes that typically run asynchronously.

**Knowledge Base Deletion** (`DELETE /api/v1/knowledge/{id}/delete`): Permanently removes knowledge bases along with their associated vector indices and processed embeddings.

### RAG Integration Workflow

The typical RAG integration workflow involves uploading files through the file management endpoints, creating knowledge bases for organizational purposes, and adding files to knowledge bases to trigger embedding and indexing processes that often execute asynchronously in background workers.

When utilizing RAG capabilities in chat completions, clients include `files` parameters referencing knowledge base or collection identifiers in their completion requests. The backend retrieval pipeline automatically consults relevant vectors and injects contextually appropriate passages into model prompts to enhance response quality and accuracy.

## Model & Prompt Management

### Model Management (/api/models)

**Model Listing** (`GET /api/models`): Returns comprehensive information about configured models including identifiers, names, types, ownership details, and descriptive metadata.

**Model Acquisition** (`POST /api/models/pull`): Initiates model download and installation processes from configured registries, requiring model identifiers and configuration parameters.

### Prompt Management (/api/prompts)

**Prompt Template Listing** (`GET /api/prompts`): Provides access to available prompt templates for reuse across different conversations and contexts.

**Prompt Template Creation** (`POST /api/prompts`): Enables creation of new prompt templates that can be referenced and reused in future chat sessions.

## Admin & System Endpoints

Administrative and system management endpoints require elevated privileges and provide essential functionality for system maintenance and user management.

### User Administration (/api/users)

These endpoints require administrative privileges and enable comprehensive user management capabilities:

**User Listing** (`GET /api/users`): Returns information about all users in the system for administrative oversight.

**User Updates** (`POST /api/users/{id}/update`): Enables modification of user properties and permissions by system administrators.

**User Deletion** (`DELETE /api/users/{id}`): Permanently removes users from the system along with their associated data.

### System Management (/api/system)

System management endpoints provide essential operational capabilities:

**Configuration Reload** (`POST /api/system/reload`): Triggers reload of server configurations and services without requiring full system restart.

**System Status** (`GET /api/system/status`): Provides health check information and system status details for monitoring and diagnostics.

## Ollama Native Passthrough (/ollama)

The Ollama integration provides direct access to native Ollama API functionality through a dedicated router mounted under the `/ollama` prefix. This passthrough capability enables both internal system usage and direct client access to Ollama's native endpoints.

**Native Generate Endpoint** (`POST /ollama/api/generate`): Provides direct access to Ollama's native text generation capabilities using Ollama's original API semantics.

**Native Chat Endpoint** (`POST /ollama/api/chat`): Enables direct chat interactions using Ollama's native chat API format and response structures.

These endpoints may be used directly by clients or are invoked internally by the central completions routing system when processing requests for Ollama-owned models.

## OpenAI Compatibility Layer (/v1)

The OpenAI compatibility layer provides a separate, stateless API router mounted at the `/v1` prefix that mimics OpenAI's official endpoints for seamless integration with existing tools and applications expecting standard OpenAI API behavior.

**Model Listing** (`GET /v1/models`): Returns model information in OpenAI-compatible format for integration with existing OpenAI-based applications.

**Chat Completions** (`POST /v1/chat/completions`): Provides OpenAI-style chat completion functionality for external integrations requiring standard OpenAI path semantics and response formats.

This compatibility layer enables existing OpenAI integrations to work with OpenWebUI without requiring code modifications, facilitating easier migration and integration scenarios.

## Core Data Schemas

### Message Object Structure

```json
{
  "role": "system" | "user" | "assistant",
  "content": "string"
}
```

### Chat Summary Object

```json
{
  "id": "string",
  "title": "string", 
  "model": "string",
  "created_at": "timestamp"
}
```

### Complete Chat Object

```json
{
  "id": "string",
  "title": "string",
  "model": "string",
  "system": "string (optional)",
  "messages": [
    // array of Message objects
  ],
  "metadata": {
    // optional additional properties
  }
}
```

### File Upload Result

```json
{
  "id": "string",
  "filename": "string", 
  "size": "number",
  "mimetype": "string",
  "uploaded_at": "timestamp"
}
```

### Knowledge Base Object

```json
{
  "id": "string",
  "name": "string",
  "description": "string", 
  "document_count": "number",
  "created_at": "timestamp"
}
```

## Client Flows & Best Practices

### Streaming and Server-Sent Events

When `stream: true` is specified, the `/api/chat/completions` endpoint produces Server-Sent Events containing token deltas that clients must reassemble into complete assistant messages. Clients should monitor for explicit finish messages indicated by `finish_reason` properties or final sentinel tokens to determine completion status.

### Assistant Placeholder Message Handling

User interfaces often inject placeholder assistant messages with unique identifiers before initiating generation requests. The canonical field name on the server is `id`, and clients should pass the same identifier in completion requests to enable server-side updating of the correct placeholder message record.

### Post-Completion Processing Requirements

Clients should invoke `/api/chat/completed` after assembling complete assistant replies, whether from streaming or non-streaming responses, to trigger essential post-processing pipelines. These pipelines handle title and tag generation, follow-up suggestions, and memory writes. Omitting this call may result in missing metadata or skipped processing workflows.

### Background Tasks and Feature Management

The `background_tasks` parameter enables scheduling of asynchronous post-completion work including title generation, tag creation, and follow-up suggestions. Results are written back to chat records upon completion. The `features` parameter can enable additional pre and post-processing capabilities such as code execution, web search, and image generation, though enabling these features may invoke tool integrations and increase response latency.

### RAG Implementation Guidelines

Ensure uploaded files have completed processing and knowledge base indexing reaches `status: processed` before referencing them in completion requests through the `files` parameter. Embedding and indexing operations typically execute asynchronously, so clients should poll `/api/v1/knowledge/{id}` or file listing endpoints to confirm processing status before attempting RAG-enhanced completions.

### UI-Compatible Chat Implementation

To create chat sessions that appear correctly in the user interface and function properly with all features, always use the `/api/chat/completions` endpoint with a `chat_id` parameter, followed by a call to `/api/chat/completed` once the complete response has been received and processed.

## Appendix: Source Code References

The API structure is definitively established through router inclusion patterns in the main application file:

### Core UI and Management Endpoints
```python
from open_webui.routers import chats
app.include_router(chats.router, prefix="/api", tags=["Chats"])
```

### Chat Completions Handler
```python
@app.post("/api/chat/completions")
async def chat_completion(...):
    # Central completion processing logic
```

### File and Knowledge Management
```python
from open_webui.api.v1 import files, knowledge
app.include_router(files.router, prefix="/api/v1", tags=["Files"])
app.include_router(knowledge.router, prefix="/api/v1", tags=["Knowledge"])
```

### Ollama Integration
```python
from open_webui.routers import ollama
app.include_router(ollama.router, prefix="/ollama", tags=["Ollama"])
```

### OpenAI Compatibility Layer
```python
from open_webui.routers import openai_router
app.include_router(openai_router, prefix="/v1", tags=["OpenAI-Compat"])
```

## Appendix: curl Examples

### Complete Chat Session Workflow

**Step 1: Create Chat Session**
```bash
curl -X POST "https://host/api/chats/new" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:latest",
    "title": "Photosynthesis Discussion",
    "messages": [
      {
        "role": "user", 
        "content": "Explain photosynthesis in detail"
      }
    ]
  }'
```

**Step 2: Generate Completion**
```bash
curl -X POST "https://host/api/chat/completions" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "llama3.1:latest",
    "messages": [
      {
        "role": "user",
        "content": "Explain photosynthesis in detail"
      }
    ],
    "stream": false,
    "chat_id": "<chat_id_from_step_1>"
  }'
```

**Step 3: Finalize Completion**
```bash
curl -X POST "https://host/api/chat/completed" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "<assistant_message_id>",
    "chat_id": "<chat_id_from_step_1>",
    "message": {
      "role": "assistant",
      "content": "<complete_assistant_response_text>"
    },
    "model": "llama3.1:latest"
  }'
```

### Streaming Implementation Pattern

For streaming implementations, clients should open Server-Sent Event connections to `/api/chat/completions` with `stream: true` and an `id` placeholder parameter. The client must reassemble SSE `data:` chunks into the complete message content, then invoke `/api/chat/completed` with the assembled text and original `id` parameter to complete the processing workflow.

This comprehensive documentation provides developers with the essential information needed to build robust integrations with the OpenWebUI API, covering all major endpoints, data schemas, and recommended implementation patterns for successful application development.
