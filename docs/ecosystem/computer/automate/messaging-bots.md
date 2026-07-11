---
title: Message your computer (Telegram, Discord, Slack, WhatsApp, Signal)
sidebar_position: 2
---

# Message your computer

Connect a bot and your computer answers in Telegram, Discord, Slack, WhatsApp, or Signal: same agent, same workspaces, full tool access. Ask it to check a build, push a fix, or summarize a file, from any phone with the chat app installed. No tunnel or public URL needed for Telegram, Discord, Slack, or Signal.

## Set up any bot

1. Open **Settings → Admin → Bots** and create a bot.
2. Choose the platform and paste the credential (per-platform instructions below). Tokens are stored encrypted.
3. Click **Verify** to confirm the credential works.
4. Pick the workspace and model the bot starts in.
5. Set **Allowed senders**: a list of platform user IDs that get replies.
6. Start the bot and message it.

:::warning Set Allowed senders
An empty Allowed senders list means anyone who finds the bot can use it, and a bot message runs the agent with full tool approval on your machine. Add your own platform user ID before starting the bot, and keep the bot out of group channels.
:::

## Commands

Work on every platform:

| Command | What it does |
| --- | --- |
| `/new` (also `/reset`) | Start a fresh chat |
| `/stop` | Cancel the running task |
| `/retry` | Re-run your last message |
| `/model [id]` | Show or switch the model (persists) |
| `/workspaces` | List available workspaces |
| `/workspace <name>` | Switch workspace (fuzzy match) and start a new chat |
| `/help` | List commands |

## What to expect

- **Streaming**: the bot edits its message roughly every 2 seconds with progress: tool activity lines plus the text so far. The final answer arrives as persistent messages, chunked to the platform's length limit. (WhatsApp and Signal don't support edits; you get the final answer only.)
- **Attachments in**: images and documents you send are attached to the chat.
- **Voice notes**: transcribed and answered when speech-to-text is configured; see [voice and audio](/ecosystem/computer/ai/voice-and-audio). Otherwise the bot tells you STT isn't set up.
- **Queueing**: messages sent while a task is running are queued and processed in order.
- **Synced**: every bot conversation is a real chat in the selected workspace; it appears in the Computer sidebar, and you can pick it up in the web UI.

## Telegram

1. Message [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot`, and copy the token it gives you.
2. Paste the token as the credential, verify, and start.

Telegram uses long-polling, so your Computer needs no public URL. Your sender ID is your numeric Telegram user ID; get it from a bot like @userinfobot. On Bot API 10.1+ you get rich draft streaming; older versions fall back to plain messages in 4096-character chunks.

## Discord

1. In the [Discord Developer Portal](https://discord.com/developers/applications), create an application, open **Bot**, and copy the token.
2. On the same Bot page, enable the **Message Content** intent.
3. Invite the bot to your server (OAuth2 URL generator with the `bot` scope).
4. Paste the token as the credential.

Discord connects over the Gateway WebSocket, so no public URL is needed. It requires the `websockets` Python package, which is not installed by default:

```bash
pip install websockets
```

Messages are chunked to 2000 characters.

## Slack

1. Create a Slack app and install it to your workspace to get a bot token (`xoxb-...`).
2. Enable **Socket Mode**, which gives you an app-level token (`xapp-...`).
3. Enter both, pipe-separated, as the credential:

```text
xoxb-your-bot-token|xapp-your-app-token
```

Socket Mode means no public URL. Like Discord, Slack needs `pip install websockets` on the host. Messages are chunked to 4000 characters.

## WhatsApp

Uses the Meta Cloud API. From your Meta app, get the access token and the phone number ID, and enter them pipe-separated:

```text
access_token|phone_number_id
```

Inbound messages arrive by webhook only, so your Computer must be publicly reachable (see [security](/ecosystem/computer/phone-and-remote/security) before exposing it). Configure the webhook URL in the Meta app as:

```text
https://<your-host>/api/webhooks/whatsapp/<bot_id>
```

Webhook verification currently accepts any verify token. WhatsApp doesn't support message edits, so there's no streaming; you get the final answer.

## Signal

Requires a signal-cli REST API bridge running next to Computer:

```bash
docker run -p 8080:8080 bbernhard/signal-cli-rest-api
```

Register your Signal number with the bridge, then enter the bridge URL and number pipe-separated as the credential:

```text
http://localhost:8080|+15551234567
```

The bot polls the bridge every 2 seconds. No message edits, so no streaming.
