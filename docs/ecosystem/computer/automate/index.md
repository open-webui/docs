---
title: Automation and integrations
sidebar_position: 1
---

# Automation and integrations

Open WebUI Computer keeps working when the browser tab is closed. You can message it from Telegram or Slack, run tasks on a schedule, trigger tasks from other systems with a webhook, expose workspaces as OpenAI-compatible models, and give the agent extra tools via MCP or OpenAPI servers.

:::warning Unattended runs use full tool approval
Everything in this section runs without you watching: nobody is there to click **Allow**, so bot messages, scheduled runs, webhook triggers, and gateway requests execute file edits, shell commands, and tool calls without a per-action gate. Point them at a workspace you're comfortable letting an agent act in, and write prompts that say exactly what to do. For interactive approvals, use the web UI; see [approvals and plan mode](/ecosystem/computer/ai/approvals-and-plan-mode).
:::

| I want to... | Go to |
| --- | --- |
| Chat with my computer from Telegram, Discord, Slack, WhatsApp, or Signal | [Message your computer](./messaging-bots) |
| Run a prompt every morning, hour, or Monday | [Scheduled tasks](./scheduled-tasks) |
| Trigger a task from CI, a cron job, or another service | [Scheduled tasks → webhook trigger](./scheduled-tasks#trigger-a-task-with-a-webhook) |
| Get pinged when a chat or scheduled run finishes or fails | [Notifications and webhooks](./notifications) |
| Use a Computer workspace as a model in Open WebUI | [Use a workspace from Open WebUI](./open-webui) |
| Give the agent tools from MCP or OpenAPI servers | [MCP and OpenAPI tool servers](./tool-servers) |

All of these produce real chats in the workspace sidebar, so whatever runs while you're away is there to review when you get back.
