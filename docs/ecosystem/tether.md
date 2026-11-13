---
title: "Tether"
sidebar_position: 3
---

# Tether

Tether is the desktop companion app for Open WebUI, available for macOS, Windows and Linux. It links your own computer to your Open WebUI account, so a chat can work on that computer and your own connections stay private to you.

Ask a chat to read your files, run commands or build a small project on your machine. The chat can be open in a browser on any device, such as your phone or a work laptop, while the work happens on the computer that runs Tether. In the app you can also add your own OpenAI-compatible connections, tool servers and terminals. Only you see them, and their addresses and keys stay on your computer. The app shows a desktop notification when a chat finishes or fails, a calendar alert fires or a channel message arrives.

Use Tether when the AI should work with files or tools on your own computer and Open WebUI runs somewhere else, for example on a server. Every user can set it up for their own account, and the instance needs no extra setup from an admin if it meets the [requirements](#requirements). Terminals that an admin sets up for the whole instance are covered under [Open Terminal](/features/open-terminal).

The project lives at [github.com/open-webui/tether](https://github.com/open-webui/tether). It is free for personal non-commercial use. Commercial or organizational production use needs an [Open WebUI Enterprise License](https://docs.openwebui.com/enterprise).

## Connecting

Everything is set up in the Tether app, on the computer you want to use from your chats.

1. Install Tether on that computer from the [releases page](https://github.com/open-webui/tether/releases/latest).
2. In Tether, enter the address of your Open WebUI instance. For a further instance or account, click **Add connection**. Enter the address the instance ends up on: if `http://` redirects to `https://`, enter the `https://` address.
3. Tether opens your browser at `/auth/sessions/<id>` on that instance. If you are not signed in yet, you sign in first, with the account you chat with. After sign-in the page returns you to Tether.
4. Tether offers to install Open Terminal, the part that lets chats work on this computer. Accept it. After **Not now**, you install it later in Tether under **Settings > Open Terminal**.
5. The terminal indicator in Tether reads **Connected to WebUI**. Tether stays signed in and renews its session in the background.

## Using Your Computer in a Chat

Open your instance in any browser, on any device, signed in to the same account as Tether. Click the **terminal button** (cloud icon) in the chat input and pick your computer under **Your devices**. It is listed by its computer name, or by the **Device name** you set in Tether's settings. From there it works like any other terminal, see [Select a terminal in chat](/features/open-terminal/setup/connecting#7-select-a-terminal-in-chat).

The terminal button is shown as soon as you have at least one terminal. If Tether is your only one, the button appears the moment Tether connects and leaves when Tether disconnects.

Each signed-in app is a separate session. Signing out from the app ends its session. A session also ends when it is deleted through the API or when nobody uses it for [`SESSION_EXPIRES_IN`](/reference/env-configuration#session_expires_in) (default `90d`). Access tokens last 15 minutes and every renewal replaces the refresh token.

## Your Own Connections

In the Tether app you add your own OpenAI-compatible connections, OpenAPI tool servers and terminals. Open WebUI reaches them through the app, so their URLs and keys stay on your computer and never reach the server. They are listed for your account only and only while Tether is connected.

- **Models.** Models from an OpenAI-compatible connection show in your model list and nowhere else, tagged `device name · connection name`. If a shared model has the same id, the shared model is used.
- **Tool servers.** They show under **Your devices** in the **Tools** list of the **+** menu in the chat input.
- **Terminals.** They show under **Your devices** in the terminal menu, see [Using Your Computer in a Chat](#using-your-computer-in-a-chat).

:::note
The public Tether app does not send your own connections to Open WebUI. The computer terminal described above works with it.
:::

## What the App Gets

- **Your computer as a terminal.** While Tether is connected, your computer appears in your terminal list as `tether:<connection id>`. Only you see it, and only when Tether offers the `open_terminal` service. If the connection drops, an open terminal shows "Connection interrupted. Reconnecting to the same terminal…" and resumes the same terminal once Tether is back. Each connection handles up to 16 active operations at a time.
- **Notifications.** When a chat finishes or fails, a calendar alert fires or a channel message arrives, the server sends a notification to your connected apps that opted in. They are sent only if you turned on **Browser Notifications** in **Settings > Notifications**.

## Requirements

- [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) is on.
- Open WebUI runs with one worker, or with [Redis](/reference/env-configuration#redis_url) when [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) is above 1. Without Redis, a multi-worker instance refuses Tether connections and requests to a Tether terminal fail with "Tether requires Redis with multiple WebUI workers."
- [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers) is on, which is the default. It is the switch for every terminal on the instance, Tether computers included.
- The computer running Tether reaches the instance's address. Tether opens the connection from the computer to the instance, so the computer needs no open port and no address the instance can reach.

Access follows the account: every user who can sign in can connect their own computer, and it is listed for that account only.

## Troubleshooting

If the terminal button or your computer is missing in the chat input, check these in order:

| Check | Fix |
| --- | --- |
| Tether shows **Running locally · Not connected to WebUI** | Tether is not connected to this instance. Add the instance's address as a connection and sign in. |
| The browser is signed in to a different account than Tether | Sign in to the same account in both. |
| Open Terminal is not installed in Tether | Install it in Tether under **Settings > Open Terminal**. |
| The instance does not offer Tether | An admin brings the instance in line with the [requirements](#requirements). |
| The **Tools** and **Open Terminal** sections of **Settings > Admin > Integrations** are greyed out | An admin removes `ENABLE_TOOL_SERVERS=False` and `ENABLE_PLUGINS=False` from the instance's environment and restarts it. |

If the computer is selected and the model does not use it, the model's **Terminal** capability is off. Turn it on in the model editor, see [Capabilities and bindings](/features/workspace/models#capabilities-and-bindings).

## For Developers

The sign-in and connection endpoints change often, so they are not documented here. To build a native client, point an AI agent at the Open WebUI backend and the [Tether source](https://github.com/open-webui/tether) and let it read the latest endpoints and specs.
