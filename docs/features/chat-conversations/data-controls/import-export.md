---
sidebar_position: 4
title: "💾 Import & Export"
---

Open WebUI provides tools to backup your chat history and restore it later, or migrate conversations from other platforms.

## Accessing Import & Export

1. Click on your **profile name** or avatar in the bottom-left corner of the sidebar.
2. Select **Settings** from the menu.
3. Navigate to the **Data Controls** tab.
4. Use the **Import Chats** or **Export Chats** buttons.

## Exporting Chats

Click the **Export Chats** button to download all your conversations as a JSON file. This backup includes:

- All chat messages and their metadata
- Model information used in each conversation
- Timestamps and conversation structure

:::tip Regular Backups
It's a good practice to periodically export your chats, especially before major updates or migrations.
:::

## Importing Chats

Click the **Import Chats** button and select a JSON file to restore conversations. Open WebUI supports importing from:

- **Open WebUI exports**: Native JSON format from previous exports
- **ChatGPT exports**: Conversations exported from OpenAI's ChatGPT (auto-detected and converted)
- **Custom JSON files**: Any JSON file that follows the expected structure documented below

### Import Behavior

- Imported chats are added to your existing conversations (they don't replace them)
- Each imported chat receives a new unique ID, so re-importing the same file will create duplicates
- If using ChatGPT exports, the format is automatically detected and converted

## Chat Import JSON Schema

The import file must be a **JSON array** of chat objects. There are two accepted formats: the **standard format** (used by Open WebUI exports) and a **legacy format**.

### Standard Format (Recommended)

Each object in the array should have a `chat` key containing the conversation data:

```json
[
  {
    "chat": {
      "title": "My Conversation",
      "models": ["llama3.2"],
      "history": {
        "currentId": "message-id-2",
        "messages": {
          "message-id-1": {
            "id": "message-id-1",
            "parentId": null,
            "childrenIds": ["message-id-2"],
            "role": "user",
            "content": "Hello, how are you?",
            "timestamp": 1700000000
          },
          "message-id-2": {
            "id": "message-id-2",
            "parentId": "message-id-1",
            "childrenIds": [],
            "role": "assistant",
            "content": "I'm doing well, thank you!",
            "model": "llama3.2",
            "done": true,
            "timestamp": 1700000005
          }
        }
      }
    },
    "meta": {
      "tags": ["greeting"]
    },
    "pinned": false,
    "folder_id": null,
    "created_at": 1700000000,
    "updated_at": 1700000005
  }
]
```

### Legacy Format

If the objects in the array do **not** have a `chat` key, the entire object is treated as the chat data itself (i.e. the object is wrapped in `{ "chat": <object> }` automatically):

```json
[
  {
    "title": "My Conversation",
    "models": ["llama3.2"],
    "history": {
      "currentId": "message-id-2",
      "messages": {
        "message-id-1": {
          "id": "message-id-1",
          "parentId": null,
          "childrenIds": ["message-id-2"],
          "role": "user",
          "content": "Hello!"
        },
        "message-id-2": {
          "id": "message-id-2",
          "parentId": "message-id-1",
          "childrenIds": [],
          "role": "assistant",
          "content": "Hi there!",
          "model": "llama3.2",
          "done": true
        }
      }
    }
  }
]
```

### Field Reference

#### Top-Level Chat Object (Standard Format)

| Field | Type | Required | Description |
|---|---|---|---|
| `chat` | object | ✅ | The conversation data (see Chat Data below) |
| `meta` | object | ❌ | Metadata such as `tags` (array of strings). Defaults to `{}` |
| `pinned` | boolean | ❌ | Whether the chat is pinned. Defaults to `false` |
| `folder_id` | string \| null | ❌ | ID of the folder to place the chat in. Defaults to `null` |
| `created_at` | integer \| null | ❌ | Unix timestamp (seconds) for when the chat was created |
| `updated_at` | integer \| null | ❌ | Unix timestamp (seconds) for when the chat was last updated |

#### Chat Data Object

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | ❌ | The conversation title. Defaults to `"New Chat"` |
| `models` | string[] | ❌ | List of model identifiers used in the conversation |
| `history` | object | ✅ | Contains the message tree (see History below) |
| `options` | object | ❌ | Chat-level options/parameters |

#### History Object

| Field | Type | Required | Description |
|---|---|---|---|
| `currentId` | string | ✅ | ID of the last message in the active conversation branch |
| `messages` | object | ✅ | A map of message ID → message object (see Message below) |

#### Message Object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | ✅ | Unique identifier for the message |
| `parentId` | string \| null | ✅ | ID of the parent message, or `null` for the first message |
| `childrenIds` | string[] | ✅ | Array of child message IDs. Empty array `[]` for the last message |
| `role` | string | ✅ | Either `"user"` or `"assistant"` |
| `content` | string | ✅ | The message text (supports Markdown) |
| `model` | string | ❌ | Model identifier (relevant for assistant messages) |
| `done` | boolean | ❌ | Whether the response is complete |
| `timestamp` | integer | ❌ | Unix timestamp (seconds) for the message |
| `context` | string \| null | ❌ | Additional context for the message |

:::info Message Tree Structure
Messages use a **tree structure** rather than a flat list. Each message references its parent via `parentId` and its children via `childrenIds`. This allows Open WebUI to support branching conversations (e.g. editing a message and getting a different response). The `history.currentId` field points to the last message in the currently active branch.
:::

### ChatGPT Export Format

ChatGPT exports are automatically detected when the first object in the array contains a `mapping` key. You don't need to manually convert ChatGPT exports—just import the file directly and Open WebUI will handle the conversion.

### Minimal Working Example

The smallest valid import file looks like this:

```json
[
  {
    "title": "Quick Chat",
    "history": {
      "currentId": "msg-1",
      "messages": {
        "msg-1": {
          "id": "msg-1",
          "parentId": null,
          "childrenIds": [],
          "role": "user",
          "content": "Hello!"
        }
      }
    }
  }
]
```

This uses the legacy format (no `chat` wrapper) with a single user message.

## FAQ

**Q: Will importing chats overwrite my existing conversations?**  
**A:** No. Imported chats are added alongside your existing conversations.

**Q: Can I import chats from Claude, Gemini, or other platforms?**  
**A:** There is no built-in converter for these platforms. You would need to transform your export into the JSON structure documented above. The key requirement is building the message tree with correct `parentId` / `childrenIds` relationships.

**Q: Is there a size limit for imports?**  
**A:** There's no hard-coded limit, but very large files may take longer to process. The practical limit depends on your server configuration and available memory.

**Q: What happens if I import the same file twice?**  
**A:** Each import creates new chats with fresh IDs, so you will end up with duplicate conversations.

**Q: What message roles are supported?**  
**A:** The import supports `"user"` and `"assistant"` roles. System messages are typically set via model configurations rather than stored in the chat history.
