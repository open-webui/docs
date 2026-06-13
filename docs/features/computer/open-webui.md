---
title: "Connect to Open WebUI"
sidebar_position: 3
---

# Connect cptr to Open WebUI

cptr ships an **OpenAI-compatible gateway**: it exposes each workspace as a model over `/v1/models` and `/v1/chat/completions`. Point Open WebUI at it as an OpenAI connection and every workspace shows up as a model named `cptr/<workspace>`. Chatting with that model in Open WebUI runs the full cptr agent loop, reading files, editing code and running commands, in that workspace, and the conversation appears in both Open WebUI and the cptr sidebar.

:::info What this does, and what it does not
This lets Open WebUI **drive** a cptr workspace as a model: new chats you start in Open WebUI run through cptr. It is **not** a sync of cptr's existing standalone chats into Open WebUI, and it does not share Open WebUI knowledge bases into cptr.
:::

## Setup

1. **Create a gateway API key in cptr.** Open the **Gateway** admin tab, create a key and copy it. Keys are stored hashed and shown only once.
2. **Note the base URL.** The Gateway tab shows it: your cptr server origin plus `/v1`, for example `http://localhost:8000/v1` (use your host's address if cptr runs elsewhere).
3. **Add cptr as a connection in Open WebUI.** In **Admin Panel > Settings > Connections**, add an **OpenAI API** connection. Set the base URL to the gateway URL from step 2 and paste the API key from step 1.
4. **Add the recommended headers.** The Gateway tab has a one-click copy of the header config. Paste it into the connection's custom headers:

   ```json
   {
     "X-OpenWebUI-Chat-Id": "{{CHAT_ID}}",
     "X-OpenWebUI-Message-Id": "{{MESSAGE_ID}}",
     "X-OpenWebUI-User-Message-Id": "{{USER_MESSAGE_ID}}",
     "X-OpenWebUI-User-Message-Parent-Id": "{{USER_MESSAGE_PARENT_ID}}",
     "X-OpenWebUI-Task": "{{TASK}}"
   }
   ```

5. **Pick a workspace and chat.** Your workspaces now appear in the Open WebUI model picker as `cptr/<workspace>`. Select one and start a conversation; it runs the cptr agent loop in that workspace.

## Why the headers matter

The `{{...}}` values are Open WebUI's [custom-header placeholders](/reference/env-configuration#enable_forward_user_info_headers), filled in per request from the chat metadata. They give cptr the chat and message lineage it needs to:

- **Branch correctly.** Regenerating or editing a message in Open WebUI creates a matching branch in the cptr sidebar (via `X-OpenWebUI-User-Message-Id` and `X-OpenWebUI-User-Message-Parent-Id`), instead of appending in the wrong place.
- **Ignore background work.** Open WebUI also calls the gateway for title generation, tag extraction and follow-up suggestions. `X-OpenWebUI-Task` tells cptr which requests are background tasks, so it skips them instead of spawning ghost chats or running a full agent loop.

:::caution Requires Open WebUI 0.9.7 or newer
The `{{USER_MESSAGE_ID}}`, `{{USER_MESSAGE_PARENT_ID}}` and `{{TASK}}` placeholders were added in Open WebUI 0.9.7. On 0.9.6 the basic gateway connection still works, you can chat with a workspace as a model, but those three headers are not filled in, so branching and background-task filtering do not work yet.
:::
