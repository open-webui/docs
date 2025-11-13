---
sidebar_position: 2
title: "Backend-Controlled, UI-Compatible API Flow"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/docs/tutorials/tips/contributing-tutorial.md).

:::

---

# Backend-Controlled, UI-Compatible API Flow

This tutorial demonstrates how to implement server-side orchestration of Open WebUI conversations while ensuring that assistant replies appear properly in the frontend UI. This approach requires zero frontend involvement and allows complete backend control over the chat flow.
This tutorial has been verified to work with Open WebUI version v0.6.15. Future versions may introduce changes in behavior or API structure.

## Prerequisites

Before following this tutorial, ensure you have:

- A running Open WebUI instance
- Valid API authentication token
- Access to the Open WebUI backend APIs
- Basic understanding of REST APIs and JSON
- Command-line tools: `curl`, `jq` (optional for JSON parsing)

## Overview

This tutorial describes a comprehensive 7-step process that enables server-side orchestration of Open WebUI conversations while ensuring that assistant replies appear properly in the frontend UI.

### Process Flow

The essential steps are:

1. **Create a new chat with a user message** - Initialize the conversation with the user's input
2. **Enrich the chat response with an assistant message** - Add assistant message to the response object in memory
3. **Update chat with assistant message** - Send the enriched chat state to the server
4. **Trigger the assistant completion** - Generate the actual AI response (with optional knowledge integration)
5. **Wait for response completion** - Monitor the assistant response until fully generated
6. **Complete the assistant message** - Mark the response as completed
7. **Fetch and process the final chat** - Retrieve and parse the completed conversation

This enables server-side orchestration while still making replies show up in the frontend UI exactly as if they were generated through normal user interaction.

## Implementation Guide

### Critical Step: Enrich Chat Response with Assistant Message

The assistant message needs to be added to the chat response object in memory as a critical prerequisite before triggering the completion. This step is essential because the Open WebUI frontend expects assistant messages to exist in a specific structure.

The assistant message must appear in both locations:

- `chat.messages[]` - The main message array
- `chat.history.messages[<assistantId>]` - The indexed message history

**Expected structure of the assistant message:**

```json
{
  "id": "<uuid>",
  "role": "assistant",
  "content": "",
  "parentId": "<user-msg-id>",
  "modelName": "gpt-4o",
  "modelIdx": 0,
  "timestamp": "<currentTimestamp>"
}
```

Without this enrichment, the assistant's response will not appear in the frontend interface, even if the completion is successful.

## Step-by-Step Implementation

### Step 1: Create Chat with User Message

This starts the chat and returns a `chatId` that will be used in subsequent requests.

```bash
curl -X POST https://<host>/api/v1/chats/new \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {
      "title": "New Chat",
      "models": ["gpt-4o"],
      "messages": [
        {
          "id": "user-msg-id",
          "role": "user",
          "content": "Hi, what is the capital of France?",
          "timestamp": 1720000000000,
          "models": ["gpt-4o"]
        }
      ],
      "history": {
        "current_id": "user-msg-id",
        "messages": {
          "user-msg-id": {
            "id": "user-msg-id",
            "role": "user",
            "content": "Hi, what is the capital of France?",
            "timestamp": 1720000000000,
            "models": ["gpt-4o"]
          }
        }
      }
    }
  }'
```

### Step 2: Enrich Chat Response with Assistant Message

Add the assistant message to the chat response object in memory. Note that this can be combined with Step 1 by including the assistant message in the initial chat creation:

```java
// Example implementation in Java
public void enrichChatWithAssistantMessage(OWUIChatResponse chatResponse, String model) {
    OWUIMessage assistantOWUIMessage = buildAssistantMessage(chatResponse, model, "assistant", "");
    assistantOWUIMessage.setParentId(chatResponse.getChat().getMessages().get(0).getId());

    chatResponse.getChat().getMessages().add(assistantOWUIMessage);
    chatResponse.getChat().getHistory().getMessages().put(assistantOWUIMessage.getId(), assistantOWUIMessage);
}
```

:::note

**Note:** This step can be performed in memory on the response object, or combined with Step 1 by including both user and empty assistant messages in the initial chat creation.

:::

### Step 3: Update Chat with Assistant Message

Send the enriched chat state containing both user and assistant messages to the server:

```bash
curl -X POST https://<host>/api/v1/chats/<chatId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {
      "id": "<chatId>",
      "title": "New Chat",
      "models": ["gpt-4o"],
      "messages": [
        {
          "id": "user-msg-id",
          "role": "user",
          "content": "Hi, what is the capital of France?",
          "timestamp": 1720000000000,
          "models": ["gpt-4o"]
        },
        {
          "id": "assistant-msg-id",
          "role": "assistant",
          "content": "",
          "parentId": "user-msg-id",
          "modelName": "gpt-4o",
          "modelIdx": 0,
          "timestamp": 1720000001000
        }
      ],
      "history": {
        "current_id": "assistant-msg-id",
        "messages": {
          "user-msg-id": {
            "id": "user-msg-id",
            "role": "user",
            "content": "Hi, what is the capital of France?",
            "timestamp": 1720000000000,
            "models": ["gpt-4o"]
          },
          "assistant-msg-id": {
            "id": "assistant-msg-id",
            "role": "assistant",
            "content": "",
            "parentId": "user-msg-id",
            "modelName": "gpt-4o",
            "modelIdx": 0,
            "timestamp": 1720000001000
          }
        }
      }
    }
  }'
```

### Step 4: Trigger Assistant Completion

Generate the actual AI response using the completion endpoint:

```bash
curl -X POST https://<host>/api/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<chatId>",
    "id": "assistant-msg-id",
    "messages": [
      {
        "role": "user",
        "content": "Hi, what is the capital of France?"
      }
    ],
    "model": "gpt-4o",
    "stream": true,
    "background_tasks": {
      "title_generation": true,
      "tags_generation": false,
      "follow_up_generation": false
    },
    "features": {
      "code_interpreter": false,
      "web_search": false,
      "image_generation": false,
      "memory": false
    },
    "variables": {
      "{{USER_NAME}}": "",
      "{{USER_LANGUAGE}}": "en-US",
      "{{CURRENT_DATETIME}}": "2025-07-14T12:00:00Z",
      "{{CURRENT_TIMEZONE}}": "Europe"
    },
    "session_id": "session-id"
  }'
```

#### Step 4.1: Trigger Assistant Completion with Knowledge Integration (RAG)

For advanced use cases involving knowledge bases or document collections, include knowledge files in the completion request:

```bash
curl -X POST https://<host>/api/chat/completions \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<chatId>",
    "id": "assistant-msg-id",
    "messages": [
      {
        "role": "user",
        "content": "Hi, what is the capital of France?"
      }
    ],
    "model": "gpt-4o",
    "stream": true,
    "files": [
      {
        "id": "knowledge-collection-id",
        "type": "collection",
        "status": "processed"
      }
    ],
    "background_tasks": {
      "title_generation": true,
      "tags_generation": false,
      "follow_up_generation": false
    },
    "features": {
      "code_interpreter": false,
      "web_search": false,
      "image_generation": false,
      "memory": false
    },
    "variables": {
      "{{USER_NAME}}": "",
      "{{USER_LANGUAGE}}": "en-US",
      "{{CURRENT_DATETIME}}": "2025-07-14T12:00:00Z",
      "{{CURRENT_TIMEZONE}}": "Europe"
    },
    "session_id": "session-id"
  }'
```

### Step 5: Wait for Assistant Response Completion

Assistant responses can be handled in two ways depending on your implementation needs:

#### Option A: Stream Processing (Recommended)

If using `stream: true` in the completion request, you can process the streamed response in real-time and wait for the stream to complete. This is the approach used by the OpenWebUI web interface and provides immediate feedback.

#### Option B: Polling Approach

For implementations that cannot handle streaming, poll the chat endpoint until the response is ready. Use a retry mechanism with exponential backoff:

```java
// Example implementation in Java
@Retryable(
    retryFor = AssistantResponseNotReadyException.class,
    maxAttemptsExpression = "#{${webopenui.retries:50}}",
    backoff = @Backoff(delayExpression = "#{${webopenui.backoffmilliseconds:2000}}")
)
public String getAssistantResponseWhenReady(String chatId, ChatCompletedRequest chatCompletedRequest) {
    OWUIChatResponse response = owuiService.fetchFinalChatResponse(chatId);
    Optional<OWUIMessage> assistantMsg = extractAssistantResponse(response);

    if (assistantMsg.isPresent() && !assistantMsg.get().getContent().isBlank()) {
        owuiService.completeAssistantMessage(chatCompletedRequest);
        return assistantMsg.get().getContent();
    }

    throw new AssistantResponseNotReadyException("Assistant response not ready yet for chatId: " + chatId);
}
```

For manual polling, you can use:

```bash

# Poll every few seconds until assistant content is populated
while true; do
  response=$(curl -s -X GET https://<host>/api/v1/chats/<chatId> \
    -H "Authorization: Bearer <token>")

  # Check if assistant message has content (response is ready)
  if echo "$response" | jq '.chat.messages[] | select(.role=="assistant" and .id=="assistant-msg-id") | .content' | grep -v '""' > /dev/null; then
    echo "Assistant response is ready!"
    break
  fi

  echo "Waiting for assistant response..."
  sleep 2
done
```

### Step 6: Complete Assistant Message

Once the assistant response is ready, mark it as completed:

```bash
curl -X POST https://<host>/api/chat/completed \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat_id": "<chatId>",
    "id": "assistant-msg-id",
    "session_id": "session-id",
    "model": "gpt-4o"
  }'
```

### Step 7: Fetch Final Chat

Retrieve the completed conversation:

```bash
curl -X GET https://<host>/api/v1/chats/<chatId> \
  -H "Authorization: Bearer <token>"
```

## Additional API Endpoints

### Fetch Knowledge Collection

Retrieve knowledge base information for RAG integration:

```bash
curl -X GET https://<host>/api/v1/knowledge/<knowledge-id> \
  -H "Authorization: Bearer <token>"
```

### Fetch Model Information

Get details about a specific model:

```bash
curl -X GET https://<host>/api/v1/models/model?id=<model-name> \
  -H "Authorization: Bearer <token>"
```

### Send Additional Messages to Chat

For multi-turn conversations, you can send additional messages to an existing chat:

```bash
curl -X POST https://<host>/api/v1/chats/<chatId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "chat": {
      "id": "<chatId>",
      "messages": [
        {
          "id": "new-user-msg-id",
          "role": "user",
          "content": "Can you tell me more about this?",
          "timestamp": 1720000002000,
          "models": ["gpt-4o"]
        }
      ],
      "history": {
        "current_id": "new-user-msg-id",
        "messages": {
          "new-user-msg-id": {
            "id": "new-user-msg-id",
            "role": "user",
            "content": "Can you tell me more about this?",
            "timestamp": 1720000002000,
            "models": ["gpt-4o"]
          }
        }
      }
    }
  }'
```

## Response Processing

### Parsing Assistant Responses

Assistant responses may be wrapped in markdown code blocks. Here's how to clean them:

```bash

# Example raw response from assistant
raw_response='```json
{
  "result": "The capital of France is Paris.",
  "confidence": 0.99
}
```'

# Clean the response (remove markdown wrappers)
cleaned_response=$(echo "$raw_response" | sed 's/^```json//' | sed 's/```$//' | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//')

echo "$cleaned_response" | jq '.'
```

This cleaning process handles:

- Removal of ````json` prefix
- Removal of ```` suffix
- Trimming whitespace
- JSON validation

## API Reference

### DTO Structures

#### Chat DTO (Complete Structure)

```json
{
  "id": "chat-uuid-12345",
  "title": "New Chat",
  "models": ["gpt-4o"],
  "files": [],
  "tags": [
    {
      "id": "tag-id",
      "name": "important",
      "color": "#FF5733"
    }
  ],
  "params": {
    "temperature": 0.7,
    "max_tokens": 1000
  },
  "timestamp": 1720000000000,
  "messages": [
    {
      "id": "user-msg-id",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "timestamp": 1720000000000,
      "models": ["gpt-4o"]
    },
    {
      "id": "assistant-msg-id",
      "role": "assistant",
      "content": "",
      "parentId": "user-msg-id",
      "modelName": "gpt-4o",
      "modelIdx": 0,
      "timestamp": 1720000001000
    }
  ],
  "history": {
    "current_id": "assistant-msg-id",
    "messages": {
      "user-msg-id": {
        "id": "user-msg-id",
        "role": "user",
        "content": "Hi, what is the capital of France?",
        "timestamp": 1720000000000,
        "models": ["gpt-4o"]
      },
      "assistant-msg-id": {
        "id": "assistant-msg-id",
        "role": "assistant",
        "content": "",
        "parentId": "user-msg-id",
        "modelName": "gpt-4o",
        "modelIdx": 0,
        "timestamp": 1720000001000
      }
    }
  },
  "currentId": "assistant-msg-id"
}
```

#### ChatCompletionsRequest DTO

```json
{
  "chat_id": "chat-uuid-12345",
  "id": "assistant-msg-id",
  "messages": [
    {
      "role": "user",
      "content": "Hi, what is the capital of France?"
    }
  ],
  "model": "gpt-4o",
  "stream": true,
  "background_tasks": {
    "title_generation": true,
    "tags_generation": false,
    "follow_up_generation": false
  },
  "features": {
    "code_interpreter": false,
    "web_search": false,
    "image_generation": false,
    "memory": false
  },
  "variables": {
    "{{USER_NAME}}": "",
    "{{USER_LANGUAGE}}": "en-US",
    "{{CURRENT_DATETIME}}": "2025-07-14T12:00:00Z",
    "{{CURRENT_TIMEZONE}}": "Europe"
  },
  "session_id": "session-uuid-67890",
  "filter_ids": [],
  "files": [
    {
      "id": "knowledge-collection-id",
      "type": "collection",
      "status": "processed"
    }
  ]
}
```

#### ChatCompletedRequest DTO

```json
{
  "model": "gpt-4o",
  "chat_id": "chat-uuid-12345",
  "id": "assistant-msg-id",
  "session_id": "session-uuid-67890",
  "messages": [
    {
      "id": "user-msg-id",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "timestamp": 1720000000000,
      "models": ["gpt-4o"]
    },
    {
      "id": "assistant-msg-id",
      "role": "assistant",
      "content": "The capital of France is Paris.",
      "parentId": "user-msg-id",
      "modelName": "gpt-4o",
      "modelIdx": 0,
      "timestamp": 1720000001000
    }
  ]
}
```

#### ChatCompletionMessage DTO

```json
{
  "role": "user",
  "content": "Hi, what is the capital of France?"
}
```

#### History DTO

```json
{
  "current_id": "assistant-msg-id",
  "messages": {
    "user-msg-id": {
      "id": "user-msg-id",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "timestamp": 1720000000000,
      "models": ["gpt-4o"]
    },
    "assistant-msg-id": {
      "id": "assistant-msg-id",
      "role": "assistant",
      "content": "The capital of France is Paris.",
      "parentId": "user-msg-id",
      "modelName": "gpt-4o",
      "modelIdx": 0,
      "timestamp": 1720000001000
    }
  }
}
```

#### Message DTO (Complete Structure)

```json
{
  "id": "msg-id",
  "role": "user",
  "content": "Hi, what is the capital of France?",
  "timestamp": 1720000000000,
  "models": ["gpt-4o"]
}
```

```json
{
  "id": "assistant-msg-id",
  "role": "assistant",
  "content": "The capital of France is Paris.",
  "parentId": "user-msg-id",
  "modelName": "gpt-4o",
  "modelIdx": 0,
  "timestamp": 1720000001000
}
```

### Response Examples

#### Create Chat Response

```json
{
  "success": true,
  "chat": {
    "id": "chat-uuid-12345",
    "title": "New Chat",
    "models": ["gpt-4o"],
    "files": [],
    "tags": [],
    "params": {},
    "timestamp": 1720000000000,
    "messages": [
      {
        "id": "user-msg-id",
        "role": "user",
        "content": "Hi, what is the capital of France?",
        "timestamp": 1720000000000,
        "models": ["gpt-4o"]
      }
    ],
    "history": {
      "current_id": "user-msg-id",
      "messages": {
        "user-msg-id": {
          "id": "user-msg-id",
          "role": "user",
          "content": "Hi, what is the capital of France?",
          "timestamp": 1720000000000,
          "models": ["gpt-4o"]
        }
      }
    },
    "currentId": "user-msg-id"
  }
}
```

#### Final Chat Response (After Completion)

```json
{
  "id": "chat-uuid-12345",
  "title": "Capital of France Discussion",
  "models": ["gpt-4o"],
  "files": [],
  "tags": [
    {
      "id": "auto-tag-1",
      "name": "geography",
      "color": "#4CAF50"
    }
  ],
  "params": {},
  "timestamp": 1720000000000,
  "messages": [
    {
      "id": "user-msg-id",
      "role": "user",
      "content": "Hi, what is the capital of France?",
      "timestamp": 1720000000000,
      "models": ["gpt-4o"]
    },
    {
      "id": "assistant-msg-id",
      "role": "assistant",
      "content": "The capital of France is Paris. Paris is not only the capital but also the most populous city in France, known for its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.",
      "parentId": "user-msg-id",
      "modelName": "gpt-4o",
      "modelIdx": 0,
      "timestamp": 1720000001000
    }
  ],
  "history": {
    "current_id": "assistant-msg-id",
    "messages": {
      "user-msg-id": {
        "id": "user-msg-id",
        "role": "user",
        "content": "Hi, what is the capital of France?",
        "timestamp": 1720000000000,
        "models": ["gpt-4o"]
      },
      "assistant-msg-id": {
        "id": "assistant-msg-id",
        "role": "assistant",
        "content": "The capital of France is Paris. Paris is not only the capital but also the most populous city in France, known for its iconic landmarks such as the Eiffel Tower, the Louvre Museum, and Notre-Dame Cathedral.",
        "parentId": "user-msg-id",
        "modelName": "gpt-4o",
        "modelIdx": 0,
        "timestamp": 1720000001000
      }
    }
  },
  "currentId": "assistant-msg-id"
}
```

#### Tag DTO

```json
{
  "id": "tag-uuid-123",
  "name": "geography",
  "color": "#4CAF50"
}
```

#### OWUIKnowledge DTO (Knowledge Collection)

```json
{
  "id": "knowledge-collection-id",
  "type": "collection",
  "status": "processed",
  "name": "Geography Knowledge Base",
  "description": "Contains information about world geography and capitals",
  "created_at": 1720000000000,
  "updated_at": 1720000001000
}
```

#### Knowledge Collection Response

```json
{
  "id": "knowledge-collection-id",
  "name": "Geography Knowledge Base",
  "description": "Contains information about world geography and capitals",
  "type": "collection",
  "status": "processed",
  "files_count": 15,
  "total_size": 2048576,
  "created_at": 1720000000000,
  "updated_at": 1720000001000,
  "metadata": {
    "indexing_status": "complete",
    "last_indexed": 1720000001000
  }
}
```

#### Model Information Response

```json
{
  "id": "gpt-4o",
  "name": "GPT-4 Optimized",
  "model": "gpt-4o",
  "base_model_id": "gpt-4o",
  "meta": {
    "description": "Most advanced GPT-4 model optimized for performance",
    "capabilities": ["text", "vision", "function_calling"],
    "context_length": 128000,
    "max_output_tokens": 4096
  },
  "params": {
    "temperature": 0.7,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  },
  "created_at": 1720000000000,
  "updated_at": 1720000001000
}
```

### Field Reference Guide

#### Required vs Optional Fields

**Chat Creation - Required Fields:**

- `title` - Chat title (string)
- `models` - Array of model names (string[])
- `messages` - Initial message array

**Chat Creation - Optional Fields:**

- `files` - Knowledge files for RAG (defaults to empty array)
- `tags` - Chat tags (defaults to empty array)
- `params` - Model parameters (defaults to empty object)

**Message Structure - User Message:**

- **Required:** `id`, `role`, `content`, `timestamp`, `models`
- **Optional:** `parentId` (for threading)

**Message Structure - Assistant Message:**

- **Required:** `id`, `role`, `content`, `parentId`, `modelName`, `modelIdx`, `timestamp`
- **Optional:** Additional metadata fields

**ChatCompletionsRequest - Required Fields:**

- `chat_id` - Target chat ID
- `id` - Assistant message ID
- `messages` - Array of ChatCompletionMessage
- `model` - Model identifier
- `session_id` - Session identifier

**ChatCompletionsRequest - Optional Fields:**

- `stream` - Enable streaming (defaults to false)
- `background_tasks` - Control automatic tasks
- `features` - Enable/disable features
- `variables` - Template variables
- `filter_ids` - Pipeline filters
- `files` - Knowledge collections for RAG

#### Field Constraints

**Timestamps:**

- Format: Unix timestamp in milliseconds
- Example: `1720000000000` (July 4, 2024, 00:00:00 UTC)

**UUIDs:**

- All ID fields should use valid UUID format
- Example: `550e8400-e29b-41d4-a716-446655440000`

**Model Names:**

- Must match available models in your Open WebUI instance
- Common examples: `gpt-4o`, `gpt-3.5-turbo`, `claude-3-sonnet`

**Session IDs:**

- Can be any unique string identifier
- Recommendation: Use UUID format for consistency

**Knowledge File Status:**

- Valid values: `"processed"`, `"processing"`, `"error"`
- Only use `"processed"` files for completions

## Important Notes

- This workflow is compatible with Open WebUI + backend orchestration scenarios
- **Critical:** The assistant message enrichment must be done in memory on the response object, not via API call
- **Alternative Approach:** You can include both user and assistant messages in the initial chat creation (Step 1) instead of doing Step 2 separately
- No frontend code changes are required for this approach
- The `stream: true` parameter allows for real-time response streaming if needed
- **Response Monitoring:** Use streaming for real-time processing or polling for simpler implementations that cannot handle streams
- Background tasks like title generation can be controlled via the `background_tasks` object
- Session IDs help maintain conversation context across requests
- **Knowledge Integration:** Use the `files` array to include knowledge collections for RAG capabilities
- **Response Parsing:** Handle JSON responses that may be wrapped in markdown code blocks
- **Error Handling:** Implement proper retry mechanisms for network timeouts and server errors

## Summary

Use the Open WebUI backend APIs to:

1. **Start a chat** - Create the initial conversation with user input
2. **Enrich with assistant message** - Add assistant placeholder to the response object in memory (can be combined with Step 1)
3. **Update chat state** - Send the enriched chat to the server
4. **Trigger a reply** - Generate the AI response (with optional knowledge integration)
5. **Monitor completion** - Wait for the assistant response using streaming or polling
6. **Complete the message** - Mark the response as completed
7. **Fetch the final chat** - Retrieve and parse the completed conversation

**Enhanced Capabilities:**

- **RAG Integration** - Include knowledge collections for context-aware responses
- **Asynchronous Processing** - Handle long-running AI operations with streaming or polling
- **Response Parsing** - Clean and validate JSON responses from the assistant
- **Session Management** - Maintain conversation context across requests

This enables backend-controlled workflows that still appear properly in the Web UI frontend chat interface, providing seamless integration between programmatic control and user experience.

The key advantage of this approach is that it maintains full compatibility with the Open WebUI frontend while allowing complete backend orchestration of the conversation flow, including advanced features like knowledge integration and asynchronous response handling.

## Testing

You can test your implementation by following the step-by-step CURL examples provided above. Make sure to replace placeholder values with your actual:

- Host URL
- Authentication token
- Chat IDs
- Message IDs
- Model names

:::tip

Start with a simple user message and gradually add complexity like knowledge integration and advanced features once the basic flow is working.

:::
