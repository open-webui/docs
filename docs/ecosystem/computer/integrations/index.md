---
title: Automations and integrations
sidebar_position: 1
---

# Automations and integrations

Integrations make a real Computer workspace reachable from another product or let it act without the browser open. That is valuable only when the workspace, sender, credentials, and side effects are all deliberate. Start with a read-only check and add one connection at a time.

| What you want | Read this |
| --- | --- |
| Keep Open WebUI as the AI front door while work happens in a real workspace | [Use a Computer workspace from Open WebUI](./open-webui-gateway) |
| Run a trusted recurring task in one workspace | [Schedule trusted work](./automations) |
| Receive completion/failure results or trigger a run with a secret URL | [Notifications and webhooks](./notifications-and-webhooks) |
| Ask a private messaging account to work in a selected workspace | [Messaging bots](./messaging-bots) |
| Let an agent call a trusted tool server or API | [MCP tool servers](./mcp-tool-servers) and [OpenAPI tool servers](./openapi-tool-servers) |

Not a fit: do not use these integrations to accept arbitrary internet requests, add a bot to a shared group, or hand a third-party service unrestricted credentials. Computer has no tenant isolation and its unattended paths run with high trust.
