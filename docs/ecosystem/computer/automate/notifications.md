---
title: Notifications and webhooks
sidebar_position: 4
---

# Notifications and webhooks

Get pinged without keeping the tab open. Set up a target once in **Settings → Notifications** (a webhook or one of your messaging bots), and there are two ways for messages to reach it: the agent decides, or events fire automatically. Browser push notifications work too.

## The agent can notify you itself

The agent has a **notify** tool, which makes notifications part of the instructions instead of plumbing:

> Run the test suite. If anything fails, notify me with the failing test names. If everything passes, don't ping me.

The agent composes the message and sends it to your default target only when the condition you described is met. This works in normal chats ("notify me when the build finishes") and especially in [scheduled tasks](./scheduled-tasks), where it turns a daily run into a zero-noise alarm that only fires with something to say.

## Event notifications

For blanket coverage, two automatic events exist:

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
