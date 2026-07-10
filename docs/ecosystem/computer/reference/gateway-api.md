---
title: OpenAI-compatible gateway API
sidebar_position: 4
---

# OpenAI-compatible gateway API

The gateway exposes each workspace owned by the gateway-key user as an OpenAI-compatible model. It is intended for a trusted client such as Open WebUI, not as a public general-purpose API.

:::danger Full approval only
Gateway-created tasks use `tool_approval_mode: full`. There is no per-tool approval callback in the OpenAI-compatible API. Use only trusted clients, bounded workspaces, and models you intend to give host-capable tool access.
:::

## Use this when

Elena is connecting a trusted OpenAI-compatible client and needs the exact endpoints, authentication, and conversation-continuity semantics.

## Before you start

- Create a gateway API key in Computer; raw keys are shown once and stored hashed.
- Create the workspace and configure the model it should use.
- Ensure the client can reach Computer privately.

## Do it

1. Request `GET /v1/models` with `Authorization: Bearer <gateway-key>`.
2. Select a returned `cptr/<workspace>` model.
3. Send `POST /v1/chat/completions` with `model`, `messages`, and optional `stream`.
4. Send `X-Chat-Id` or `X-OpenWebUI-Chat-Id` to reuse a Computer chat across turns. Open WebUI should additionally send its message/task lineage headers.

Computer accepts extra OpenAI-style request fields for compatibility, but the selected workspace’s configured agent/model runs the task. Utility requests that Open WebUI labels as title/tag/follow-up work are handled without starting a full workspace agent task.

## Verify it worked

`/v1/models` returns only the key owner’s workspaces. A streamed completion returns server-sent events, and repeating the same client chat header continues the same Computer conversation.

## If it did not

`401` means the bearer key is missing, malformed, revoked, or belongs to no valid key record. A missing model usually means the workspace was not created for that key user. A connection that can list models but cannot complete a task needs the workspace’s agent/model configuration fixed.

## Trust boundary

A gateway bearer key is a capability for the corresponding user’s agent workspaces. Protect it like an SSH credential. The gateway does not confer a sandbox, does not merge identity/RBAC semantics with the calling client, and cannot provide interactive approval for a request in progress.
