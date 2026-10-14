---
sidebar_position: 3
title: "Building Apps"
---

# Building Apps

An app is a server that Open WebUI connects to. Admins install it; admins and the channel's creator add it to channels, as described in [Apps](/features/channels/apps).

## Quick start with oix

The quickest way to build an app is [oix](https://github.com/open-webui/oix#readme), the Python SDK (Python 3.11 or later). It implements the protocol on this page, so your code only handles events:

```bash
python -m pip install oix
```

Embeds and link buttons need oix 0.7.0 or newer. Mentions need oix 0.8.0 or newer.

```python
from oix import App

app = App(
    manifest_id="hello",
    name="Hello",
    scopes=["channels:messages:read", "channels:messages:write"],
)


@app.on("channel.message.created")
async def hello(event):
    if event.content == "hello":
        await event.reply("Hello!")


if __name__ == "__main__":
    app.run()
```

Save it as `app.py`. The app reads its API key from `API_KEY` and its private key from the file named in `APP_PRIVATE_KEY_FILE`; the oix README has a script that writes both to `.env` once. Start the app with `. ./.env && python app.py`. It listens on port `8000` at `/events`. Put it behind HTTPS with WebSocket upgrades enabled, and its App URL is for example `https://hello.example.com/events`. [Install it](/features/channels/apps#install-an-app) with that URL and the API key, add it to a channel and send `hello`.

To test against a local Open WebUI, follow the oix [local development](https://github.com/open-webui/oix#local-development) steps together with [Private and plain HTTP app servers](/features/channels/apps#private-and-plain-http-app-servers).

An app in another language implements the protocol below directly.

## What an app provides

1. An optional **manifest** at the App URL.
2. A **Socket.IO server** under the App URL's path, with the `/apps` namespace.
3. An **Ed25519 key pair**, for example `openssl genpkey -algorithm ED25519 > app-private-key.pem`, with the public key from `openssl pkey -in app-private-key.pem -pubout`. The public key goes in the manifest; the private key signs the connection proof.
4. An **API key**: a random secret you create, for example with `openssl rand -hex 32`, and give to the admin. Open WebUI sends it as `Authorization: Bearer <API key>` on the manifest request and on the Socket.IO handshake. Reject requests without it.

## Manifest

Open WebUI sends `GET <App URL>` with the API key. Answer with HTTP 200 and a JSON object of at most 256 KiB, within 10 seconds:

```json
{
  "id": "hello",
  "name": "Hello",
  "description": "Says hello.",
  "profile_image_url": "https://example.com/hello.png",
  "public_key": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----\n",
  "requested_scopes": ["channels:mentions:read", "channels:messages:write"]
}
```

| Field | Rules |
|-------|-------|
| `id` | Required, 1 to 100 characters. Identifies the app and must stay the same for an installed app. |
| `name` | Required, 1 to 100 characters. |
| `description` | Optional, up to 2,000 characters. |
| `profile_image_url` | Optional. An `http(s)` URL of up to 2,048 characters without credentials, or a base64 `data:image/png`, `jpeg`, `gif` or `webp` URL. Up to 192 KiB in total. Users' browsers load it directly. |
| `public_key` | Required. An Ed25519 public key in PEM format (`-----BEGIN PUBLIC KEY-----`). Open WebUI pins it at install. |
| `requested_scopes` | Required. A list of the [scopes](/features/channels/apps#scopes). |

Unknown fields make the manifest invalid.

## Connection

For an App URL of `https://app.example.com/events`, Open WebUI connects as a Socket.IO client to `https://app.example.com` with the Socket.IO path `/events/socket.io`, WebSocket transport only, namespace `/apps` and the `Authorization: Bearer <API key>` header. If the app sits behind a reverse proxy, the proxy must pass WebSocket upgrades on the Socket.IO path. The handshake then runs over Socket.IO events with acknowledgements:

1. Open WebUI emits `app:connect` with:

   ```json
   { "app_id": "<id Open WebUI assigned>", "challenge": "<random UUID>", "connection_token": null }
   ```

   `connection_token` is `null` when Open WebUI holds no token: on the first connect, after the admin enters a new API key, after the app's public key changes and after an uninstall. Otherwise it is the token the app returned at the last **Connect** an admin clicked.

2. The app acknowledges with:

   ```json
   { "status": 200, "data": { "installation_id": "<UUID>", "connection_token": "<string>", "proof": "<JWT>" } }
   ```

   The app chooses `installation_id` (a UUID that stays the same for this installation) and `connection_token` (up to 8,192 characters). Open WebUI stores the token encrypted when an admin clicks **Connect** and sends it on every reconnect. On automatic reconnects it keeps the stored token and ignores the one the app returns, so the app must keep accepting the token it issued.

   The **app** signs `proof` with its **Ed25519 private key** (JWT algorithm `EdDSA`, header `typ` `oix-connect+jwt`). Open WebUI verifies it with the pinned public key from the manifest. Required claims:

   | Claim | Value |
   |-------|-------|
   | `aud` | `oix:connect` |
   | `sub` | the `installation_id` |
   | `app_id` | the `app_id` from `app:connect` |
   | `manifest_id` | the manifest `id` |
   | `challenge` | the `challenge` from `app:connect` |
   | `token_hash` | the SHA-256 hex digest of the `connection_token` in this acknowledgement |
   | `iat`, `exp` | integers, `exp` at most 60 seconds after `iat` |

   While Open WebUI holds a token, the `installation_id` must stay the same. When it sends `null`, the app may answer with a new `installation_id`.

3. Open WebUI emits `app:ready` with `{}`. The app must acknowledge with exactly `{"status": 200, "data": {"received": true}}`.

The connection is then live. Open WebUI authenticates itself with the API key; the app authenticates itself with the signed proof. Each Open WebUI worker opens its own connection, so the app must accept several connections for the same installation.

The whole connection must complete within 20 seconds, and each acknowledgement within 10. Until Open WebUI has verified the proof, every `app:request` fails with `App connection is not ready`. From then until the app acknowledges `app:ready`, only `ping` works.

## Events

Open WebUI emits `app:event` and waits for the acknowledgement. Every event carries `type`, `app_id` (Open WebUI's id for the app) and `installation_id`.

**Interactions** go to `channel.mention` and `channel.action`:

```json
{
  "id": "<operation id>",
  "type": "channel.mention",
  "actor": { "id": "<user id>", "name": "Ada", "is_admin": false },
  "channel": { "id": "<channel id>" },
  "data": { "text": "<@A:<app_id>|Hello> hi", "message_id": "<id>", "parent_id": null },
  "execution_token": "<token>",
  "source": null,
  "app_id": "<app id>",
  "installation_id": "<installation id>"
}
```

- `channel.mention`: a user mentioned the app. `data.text` is the raw message, where the mention appears as `<@A:<app_id>|<name>>`. `data.parent_id` is the thread root when the mention was posted in a thread. Requires `channels:mentions:read` or `channels:messages:read`. Acknowledge within **10 seconds** with exactly `{"status": 200, "data": {"received": true}}`. This only confirms delivery. Post the answer afterwards with the `create_message` operation, which needs `channels:messages:write`; pass `data.message_id` as `reply_to_id` and `data.parent_id` as `parent_id` to reply to the mention in the same place.
- `channel.action`: a user clicked a button. `data` holds `message_id`, `etag`, `parent_id`, `action_id` and the button's `context`; `source` holds the message's `id` and `updated_at`. Answer within **3 seconds** with a [reply](#replying-to-interactions).

**Message events** go to apps with `channels:messages:read`, for every message in the channels they joined, including the app's own messages: `channel.message.created`, `channel.message.updated` and `channel.message.deleted`. Acknowledge with a 2xx `status` within 10 seconds.

```json
{
  "id": "<event id>",
  "type": "channel.message.created",
  "channel": { "id": "<channel id>" },
  "message": {
    "id": "<id>", "channel_id": "<id>", "author": { "type": "user", "id": "<id>" },
    "content": "...", "parent_id": null, "reply_to_id": null, "files": [], "actions": [], "embeds": [],
    "created_at": "<ns>", "updated_at": "<ns>", "etag": "<ns>"
  },
  "event_token": "<token>",
  "app_id": "<app id>",
  "installation_id": "<installation id>"
}
```

`author.type` is `user`, `model`, `webhook` or `app`. `model` and `webhook` follow the label stored on the message. Only Open WebUI sets it: `webhook` for a message posted through a channel webhook, `model` for a model's reply. A label sent with a request to post or edit a message is ignored. The text of a `model` message can still be edited by the member whose mention triggered it and by admins, and the text of a `webhook` message by the account that created the webhook. For a model's reply, `channel.message.updated` is sent only once the reply is complete. Deleted-message events carry only `id`, `channel_id`, `parent_id`, `author` and `updated_at`. Message events are best effort: each is sent once, and events that fail or occur while the app is disconnected are dropped.

A mention reaches an app with `channels:messages:read` twice: as `channel.mention` and as `channel.message.created`. Answer it in one of the two handlers.

`execution_token` and `event_token` are signed by Open WebUI. The app checks them by sending them back with the `authorize` or `verify_event` operation below. An `execution_token` is valid for 24 hours and an `event_token` for 5 minutes. Both stop working when the app's API key or public key changes.

## Replying to interactions

Acknowledge a button click (`channel.action`) with `{"status": 200, "data": <reply>}`, at most 256 KiB:

```json
{
  "status": 200,
  "data": {
    "type": "message",
    "visibility": "channel",
    "content": "Ready to publish?",
    "actions": [{ "action_id": "publish", "label": "Publish", "context": { "draft": 42 } }]
  }
}
```

| Field | Meaning |
|-------|---------|
| `type` | `message` (default), `update`, `ack`, `download` or `error`. |
| `visibility` | `private` (default, only the user who clicked) or `channel`. |
| `content` | Markdown, up to 32,000 characters. |
| `title` | Optional heading for private replies, up to 200 characters. |
| `actions` | Up to 30 buttons. Each has a `label` (up to 200 characters) and either an `action_id` (up to 100 characters) with an optional `context` object that comes back in `channel.action`, or a `url`: an `http(s)` link of up to 2,048 characters, without credentials, that opens in a new tab. Only allowed on `message` or `update` with `visibility` `channel`. |
| `embeds` | Up to 10 cards, on `message` or `update`. Each takes `title` (up to 256 characters), `description` (Markdown, up to 4,096), `url` (links the title), `color` (an integer from `0` to `0xFFFFFF` for the accent bar), `author` (`{"name": ...}`, up to 256), `footer` (`{"text": ...}`, up to 2,048), `thumbnail` (`{"url": ...}`) and up to 25 `fields` (`name` up to 256, `value` in Markdown up to 1,024, optional `inline`). All cards in one message hold at most 6,000 characters of text. URLs are `http(s)` without credentials, up to 2,048 characters. Users' browsers load thumbnails directly. |
| `parent_id`, `reply_to_id` | Post a channel reply into a thread or as a reply to a message. A channel reply without `parent_id` lands at the top of the channel. |
| `filename` | For `download`: letters, digits, `_`, `.` and `-`, ending in `.md`. Default `report.md`. |

- `message` with `visibility` `channel` posts a channel message and needs `channels:messages:write`.
- `update` replaces the content, buttons and cards of the message whose button was clicked. It needs `channels:messages:write`. Set `visibility` to `channel`: with the default `private`, buttons are refused and the user also gets a private copy of the content.
- `download` gives the user the `content` as a Markdown file.
- `error` shows the `content` to the user, or `The app could not complete this operation.` when `content` is empty.
- Send `download` with `visibility` `private`, the default; with `channel` it is shown nowhere. An `error` is shown only to the user who clicked, with either visibility.
- `ack` shows nothing. Send it as `{"type": "ack"}`.

Unknown fields make the reply invalid.

To refuse a mention or a button click, acknowledge with an error `status` and an `error` string, for example `{"status": 403, "error": "Only the on-call team can run this."}`. Open WebUI shows up to 2,000 characters of that string; without it, a message for the status code. After a mention, Open WebUI posts the message in the channel under the app's name, as a reply that starts with `App error:`, so everyone in the channel sees it. If the app cannot post there, only the user who mentioned it sees the message. After a button click, only the user who clicked sees it. [Troubleshooting](/features/channels/apps#troubleshooting) lists the messages admins and users see.

## Calling Open WebUI

The app emits `app:request` on the same connection with `{"operation": "<name>", "arguments": {...}}`. The acknowledgement is `{"status": 200, "data": ...}` or `{"status": <code>, "error": "<message>"}`. Each request must finish within 10 seconds. Requests act only in channels the app is a member of.

| Operation | Arguments | Scope | Returns |
|-----------|-----------|-------|---------|
| `ping` | `{}` | none | `{"received": true}` |
| `get_me` | none | none | The app's record |
| `list_channels` | none | `channels:read` | Joined channels: `id`, `name`, `type`, `is_private` |
| `list_messages` | `channel_id`, optional `parent_id`, `before`, `limit` (1 to 100, default 50) | `channels:messages:read` | `messages` newest first and `next_cursor` |
| `create_message` | `channel_id`, optional `content`, `actions`, `embeds`, `parent_id`, `reply_to_id` | `channels:messages:write` | The new message, including its `etag` |
| `update_message` | `message_id`, `etag`, optional `content`, `actions`, `embeds` | `channels:messages:write` | The updated message |
| `authorize` | `token`: an `execution_token` | the interaction's scope | `authorized`, `operation_id`, `actor`, `channel_id`, `type`, `data` |
| `verify_event` | `token`: an `event_token` | `channels:messages:read` | The verified event |

`update_message` edits only the app's own messages. `content`, `actions` and `embeds` replace the old values, so omitted ones are cleared. If the message changed since the `etag` was read, the request fails with status 412 (`Message changed`).

## Long-running work

A mention only needs its delivery receipt, so the app does the work afterwards and posts the result with `create_message`. A button click must be answered within 3 seconds. For anything slower:

1. Reply `{"type": "ack"}` right away. The user sees nothing.
2. Do the work.
3. Optionally call `authorize` with the event's `execution_token` (valid for 24 hours) to confirm the user can still use the app and read the channel.
4. Post the result with the `create_message` operation, using `data.parent_id` from the event to stay in the thread. This needs `channels:messages:write`, and the result is a channel message that everyone in the channel sees. A private reply is only possible as the direct answer to a button click.

## Limits

| Limit | Value |
|-------|-------|
| Socket.IO packet | 16 MiB, JSON text only. Binary packets are rejected. |
| Event sent to the app | 1 MiB |
| Reply to an event | 256 KiB |
| Manifest response | 256 KiB, within 10 seconds |
| Message content | 32,000 characters, up to 30 buttons and 10 cards with 6,000 characters of card text |
| Connection and handshake | 20 seconds in total, 10 seconds per acknowledgement |
| Mention receipt time | 10 seconds |
| Button click answer time | 3 seconds |
| Message event answer time | 10 seconds |
| `app:request` processing | 10 seconds |
| `execution_token` lifetime | 24 hours |
| `event_token` lifetime | 5 minutes |
