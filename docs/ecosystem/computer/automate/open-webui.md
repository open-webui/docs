---
title: Use a workspace from Open WebUI
sidebar_position: 5
---

# Use a workspace from Open WebUI

Computer's gateway exposes each workspace as an OpenAI-compatible model, so you can select `cptr/<workspace>` in Open WebUI's model picker and chat with a real machine (files, terminal, git, tools) from the Open WebUI interface you already use.

## Connect it

1. In Computer, open **Settings → Admin → Gateway** and create a gateway API key. Copy it immediately; it's shown once and stored hashed.
2. In Open WebUI, go to **Admin Settings → Connections** and add an **OpenAI API** connection:
   - Base URL: `http(s)://<computer-host>/v1`
   - API key: the `sk-cptr-...` key from step 1
3. Add these custom headers to the connection so Computer can track chat lineage and filter Open WebUI's utility requests:

   ```json
   {
     "X-OpenWebUI-Chat-Id": "{{CHAT_ID}}",
     "X-OpenWebUI-Message-Id": "{{MESSAGE_ID}}",
     "X-OpenWebUI-User-Message-Id": "{{USER_MESSAGE_ID}}",
     "X-OpenWebUI-User-Message-Parent-Id": "{{USER_MESSAGE_PARENT_ID}}",
     "X-OpenWebUI-Task": "{{TASK}}"
   }
   ```

   `{{USER_MESSAGE_ID}}`, `{{USER_MESSAGE_PARENT_ID}}`, and `{{TASK}}` require Open WebUI 0.10.0 or newer. Without them, basic chat works, but edit/regeneration branches and background-task filtering do not.
4. Save. Each of your Computer workspaces now appears in Open WebUI's model picker as `cptr/<workspace-name>`. Pick one and chat.

Which underlying model actually runs is decided in Computer, in priority order: the Settings → Gateway model, a `<workspace>/.cptr/model` override file, the default chat model, then the first enabled connection's first model.

:::warning Gateway requests are unattended
Gateway tasks run the full agent loop (file edits, shell commands, web, tools) with full tool approval. Open WebUI can't pause for a per-action confirmation. Use it with workspaces you're comfortable letting an agent act in, and keep the key private.
:::

## What the headers buy you

- **Conversation continuity**: follow-up messages land in the same Computer chat instead of creating a new one.
- **Branch mirroring**: edits and regenerations in Open WebUI show up as branches of the right chat in Computer.
- **Utility-task filtering**: Open WebUI's title, tag, and follow-up-suggestion requests are answered by the plain LLM instead of spinning up an agent task in your workspace.

Every gateway conversation is a real chat in the Computer sidebar, so you can open Computer and see exactly what the agent did.

## What does not carry over

The gateway is a model endpoint, not a sync. Open WebUI knowledge bases, tools, prompts, system prompts, and users are not forwarded into Computer; configure equivalent capabilities in Computer if the workspace needs them.

## If it doesn't work

Call `GET /v1/models` with the same bearer key to separate connectivity/auth problems from model selection. Check the base URL ends in `/v1`, the key belongs to the right Computer user, and the workspace exists. If chat works but branching doesn't, recopy the headers and check your Open WebUI version.

For the raw endpoint details (`/v1/models`, `/v1/chat/completions`, streaming, header reference), see the [gateway API reference](/ecosystem/computer/reference/gateway-api).
