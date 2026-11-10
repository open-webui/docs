---
title: "Tether"
sidebar_position: 3
---

# Tether

Tether is the desktop companion app for Open WebUI, available for macOS, Windows and Linux. It signs in to your instance and connects your own computer to it, so chats can use that computer as a terminal and the app can show desktop notifications. The project lives at [github.com/open-webui/tether](https://github.com/open-webui/tether). It is free for personal non-commercial use. Commercial or organizational production use needs an [Open WebUI Enterprise License](https://docs.openwebui.com/enterprise).

## Connecting

Everything is set up in the Tether app, on the computer you want to use from your chats. An instance that meets the [requirements](#requirements) accepts the app as it is, with nothing to switch on in the Admin Panel.

1. Install Tether on that computer from the [releases page](https://github.com/open-webui/tether/releases/latest).
2. In Tether, enter the address of your Open WebUI instance. For a further instance or account, click **Add connection**. Enter the address the instance ends up on: if `http://` redirects to `https://`, enter the `https://` address.
3. Tether opens your browser at `/auth/sessions/<id>` on that instance. If you are not signed in yet, you sign in first, with the account you chat with. After sign-in the page returns you to Tether.
4. Tether offers to install Open Terminal, the part that lets chats work on this computer. Accept it. After **Not now**, you install it later in Tether under **Settings > Open Terminal**.
5. The terminal indicator in Tether reads **Connected to WebUI**. Tether stays signed in and renews its session in the background.

## Using Your Computer in a Chat

Open your instance in any browser, on any device, signed in to the same account as Tether. Click the **terminal button** (cloud icon) in the chat input and pick your computer under **Your devices**. It is listed by its computer name, or by the **Device name** you set in Tether's settings. From there it works like any other terminal, see [Select a terminal in chat](/features/open-terminal/setup/connecting#7-select-a-terminal-in-chat).

The terminal button is shown as soon as you have at least one terminal. If Tether is your only one, the button appears the moment Tether connects and leaves when Tether disconnects.

Each signed-in app is a separate session. Signing out from the app ends its session. A session also ends when it is deleted through the API or when nobody uses it for [`SESSION_EXPIRES_IN`](/reference/env-configuration#session_expires_in) (default `90d`). Access tokens last 15 minutes and every renewal replaces the refresh token.

## What the App Gets

- **Your computer as a terminal.** While Tether is connected, your computer appears in your terminal list as `tether:<connection id>`. Only you see it, and only when Tether offers the `open_terminal` service. If the connection drops, an open terminal shows "Connection interrupted. Reconnecting to the same terminal…" and resumes the same terminal once Tether is back. Each connection handles up to 16 active operations at a time.
- **Notifications.** When a chat finishes or fails, a calendar alert fires or a channel message arrives, the server sends a notification to your connected apps that opted in. They are sent only if you turned on **Browser Notifications** in **Settings > Notifications**.

## Requirements

- [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) is on.
- Open WebUI runs with one worker, or with [Redis](/reference/env-configuration#redis_url) when [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) is above 1. Without Redis, a multi-worker instance refuses Tether connections and requests to a Tether terminal fail with "Tether requires Redis with multiple WebUI workers."
- [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers) is on, which is the default. It is the switch for every terminal on the instance, Tether computers included.
- The computer running Tether reaches the instance's address. Tether opens the connection from the computer to the instance, so the computer needs no open port and no address the instance can reach.

The app configuration at `/api/config` reports `features.tether` when the first two requirements are met and `features.auth_sessions` on every instance.

Access follows the account: every user who can sign in can connect their own computer, and it is listed for that account only.

## Troubleshooting

If the terminal button or your computer is missing in the chat input, check these in order:

| Check | Fix |
| --- | --- |
| Tether shows **Running locally · Not connected to WebUI** | Tether is not connected to this instance. Add the instance's address as a connection and sign in. |
| The browser is signed in to a different account than Tether | Sign in to the same account in both. |
| Open Terminal is not installed in Tether | Install it in Tether under **Settings > Open Terminal**. |
| `/api/config` on the instance shows no `"tether":true` | An admin brings the instance in line with the [requirements](#requirements). |
| The **Tools** and **Open Terminal** sections of **Settings > Admin > Integrations** are greyed out | An admin removes `ENABLE_TOOL_SERVERS=False` and `ENABLE_PLUGINS=False` from the instance's environment and restarts it. |

If the computer is selected and the model does not use it, the model's **Terminal** capability is off. Turn it on in the model editor, see [Capabilities and bindings](/features/workspace/models#capabilities-and-bindings).

## Session API

These endpoints are for developers of native clients. `requests`, `exchange` and `refresh` need no sign-in; every other endpoint needs the bearer token of a signed-in user. Calls to create, requests, exchange, refresh and authorize are limited to 30 per minute per IP address.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/auths/sessions/requests` | Starts a browser sign-in. Send the app `name`, a loopback `redirect_uri` such as `http://127.0.0.1:<port>/callback` (host `127.0.0.1`, explicit port, no query or fragment), a `state` of 32 to 256 URL-safe characters and a PKCE `code_challenge` (S256, 43 characters). The request is valid for 10 minutes. Returns the `session_id` to open at `/auth/sessions/<id>`. |
| `GET` | `/api/v1/auths/sessions/{id}/request` | Returns the name and expiry of a waiting request. |
| `POST` | `/api/v1/auths/sessions/{id}/authorize` | Approves the request as the signed-in user and returns the callback address with a one-time `code` that is valid for 60 seconds. The `/auth/sessions/<id>` page calls it. |
| `POST` | `/api/v1/auths/sessions/exchange` | Trades the `session_id`, `code`, `redirect_uri` and `code_verifier` for an access token and a refresh token. |
| `POST` | `/api/v1/auths/sessions/refresh` | Trades a refresh token for new tokens. Send an optional `request_id` to recover the new tokens when the response was lost: repeating the call with the same `request_id` returns them again. |
| `POST` | `/api/v1/auths/sessions` | Creates a session directly from an already signed-in request. |
| `GET` | `/api/v1/auths/sessions` | Lists your sessions. |
| `DELETE` | `/api/v1/auths/sessions/{id}` | Revokes one of your sessions. |

### Connection

A client connects to the websocket `/api/v1/tether/connect` and sends a `hello` message with `version` (`1` or `2`), the access `token` of a session, a `connection_id`, a `name` and a list of `services`. Setting `notifications` to `true` opts the connection in to notifications. The server answers with `ready`.
