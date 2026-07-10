---
title: Use a Computer workspace from Open WebUI
sidebar_position: 2
---

# Use a Computer workspace from Open WebUI

Open WebUI is the place to organize AI conversations, models, knowledge, and shared workflows. Open WebUI Computer is the place where a particular machine’s real files, terminal, git state, and running processes live. The gateway lets an Open WebUI chat choose one Computer workspace as its model, so the chat’s agent work happens in that real workspace.

It is valuable when you want Open WebUI as the front door without copying a repository or pretending a remote agent has your local machine context. It is not a general two-way sync product: it does not import Computer’s standalone chats into Open WebUI and does not make Open WebUI knowledge bases automatically available to Computer.

## The first useful proof

You may already use Open WebUI to organize research conversations while your docs checkout, local scripts, and browser login live on a Mac. You do not need another repository or a generic answer. You need one Open WebUI chat to inspect the real checkout.

Connect one deliberately bounded workspace, then ask a harmless question such as:

```text
Read the README in this workspace. Do not change files. Tell me the command it gives for the local documentation preview.
```

If that answer is grounded in the file on the Computer host, the combination is useful. Save edits, deploys, and broad tasks for after this proof works.

:::danger Gateway requests are unattended
Gateway requests run with **full tool approval**. Open WebUI cannot pause a file edit, command, or external tool call for a per-tool confirmation round trip. Connect only trusted Open WebUI clients to deliberately bounded workspaces and models. For interactive approval, open the same workspace directly in Open WebUI Computer.
:::

## Use this when

Use this when you already work in Open WebUI but need an agent to inspect, edit, or run commands in a project on a Computer host. Choose Open WebUI alone for knowledge/chat work that does not need a specific machine. Choose Computer alone when you mainly need files, terminal, or git with optional AI.

## Before you start

- Run both services where Open WebUI can reach the Computer `/v1` endpoint securely.
- Create the target workspace in Computer and configure its default agent/model.
- Create a gateway API key in **Computer → Settings → Admin → Gateway**; copy it immediately because keys are stored hashed.

## Do it

1. In Open WebUI, add an **OpenAI API** connection whose base URL is `https://your-computer-host/v1`.
2. Add the Computer gateway key as its bearer credential.
3. Add the following custom headers to the Open WebUI connection so Computer can preserve chat lineage and filter Open WebUI utility requests:

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
4. Save, select the `cptr/<workspace>` model in Open WebUI, and ask the read-only question above about a file in that workspace.

The lineage headers let Computer reuse the correct chat for subsequent turns, preserve edits/regenerations as branches, and avoid treating Open WebUI title/tag/follow-up utility requests as agent tasks.

| In a combined request | What it owns |
| --- | --- |
| **Open WebUI** | The caller conversation and interface. |
| **`cptr/<workspace>`** | The selected real Computer workspace. |
| **Open WebUI Computer** | The configured model or agent that executes the task in that workspace. |

Open WebUI knowledge bases, model-agent tools, system prompts, users, and general configuration are not forwarded into Computer unless you configure equivalent capabilities in Computer.

## Verify it worked

The workspace appears as `cptr/<workspace>` in Open WebUI’s model picker. Its answer identifies the real README command, and the associated conversation appears in the Computer sidebar. Send a follow-up, then edit or regenerate a message: the Computer sidebar should show the related branch rather than an unrelated chat. Open WebUI title/tag requests should not create a workspace-agent chat.

## If it did not

Call `GET /v1/models` with the same bearer key to distinguish connectivity/authentication from model selection. Recheck the base URL has `/v1`, the key belongs to the intended Computer user, and the workspace exists for that user. If normal chat works but branches or background-task filtering do not, recopy the Open WebUI lineage headers and check the Open WebUI version supports those placeholders.

## Trust boundary

The gateway key authorizes access to the owning user’s Computer workspaces. It is not an Open WebUI user-to-host isolation layer, and gateway work uses full tool approval. Treat it like a credential for shell-capable agent work; keep the Computer instance private and do not expose the gateway as a public model endpoint.
