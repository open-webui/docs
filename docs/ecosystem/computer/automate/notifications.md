---
title: Notifications and webhooks
sidebar_position: 4
---

# Notifications and webhooks

Get told when a chat finishes or fails without keeping the tab open. Computer supports browser push notifications plus named targets (webhooks and messaging bots) configured in **Settings → Notifications**.

## Events

Two events exist:

- **Chat finished**: a chat's task completed.
- **Chat failed**: a chat's task errored.

Scheduled-task runs are covered by these same events, since every run creates a real chat. Each target has its own event filter, so one webhook can receive only failures while another gets everything.

## Target types

**Webhook**: a URL that receives a POST for each event. If the URL is a Slack, Discord, Google Chat, or Microsoft Teams webhook URL, the payload is auto-formatted for that service; paste the incoming-webhook URL and it just works. Any other URL gets generic JSON:

```json
{
  "event": "...",
  "title": "...",
  "message": "...",
  "source": "...",
  "chat_id": "...",
  "workspace": "...",
  "created_at": "..."
}
```

**Bot**: deliver through one of your [messaging bots](./messaging-bots) to a chat you pick. Useful when you already message your computer on Telegram or Slack and want completion pings in the same thread app.

## Delivery mode

Per target, choose:

- **Away**: deliver only when you have no active browser session connected. The common choice: silence while you're at the screen, pings when you're not.
- **Always**: deliver every time.

Each target has a **test** button to confirm delivery before you rely on it, and you can mark one target as the default.
