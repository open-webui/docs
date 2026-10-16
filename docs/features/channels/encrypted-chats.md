---
sidebar_position: 4
title: "Encrypted Chats"
---

# Encrypted Chats

An encrypted chat is a temporary, end-to-end encrypted conversation inside a [direct message](/features/channels#direct-messages) or a private group channel. Messages are encrypted and decrypted in each participant's browser. The Open WebUI server only relays the encrypted packets between participants and stores no messages. Nothing from an encrypted chat is saved, searchable or visible in the channel's normal history.

The encryption uses the MLS protocol (Messaging Layer Security), through the openmls library compiled to WebAssembly and run in the browser.

:::warning Temporary by design
An encrypted chat exists only while its participants are in it. Leaving or reloading the page clears the chat on that device, and there is no way to get the messages back. The chat ends for everyone when the person who started it leaves.
:::

---

## Using Encrypted Chats

### Start an encrypted chat

1. Open a direct message or a private group channel.
2. Open the **...** menu of the conversation, in the sidebar or in the header.
3. Click **Encrypted Chat**.

The encrypted chat opens on its own page, marked **Encrypted**. You are its host. Each conversation has at most one encrypted chat at a time.

### Join an encrypted chat

While an encrypted chat runs, the other members see **Encrypted chat in progress · Join** under the conversation's name. Click **Join** to enter it. The host's browser adds you to the encrypted group, and you see the messages sent from then on. An encrypted chat holds up to 128 participants, and each person takes part from one tab or device at a time.

### Messages

- A message holds at most 16 KiB of text. A longer message shows **Message exceeds the 16 KiB limit.** and is not sent.
- Once every other participant received your message, **Delivered** shows under it when you hover over or focus the message.
- Typing indicators show who is writing.
- Each device keeps up to the last 500 messages of the current chat. Older ones drop off.

### Verify participants

Every participant has a code made from their encryption key. Open **Participants** (the participant count in the header) and click a participant to see their code. Compare it with that person through another channel, for example in person or on a call. When the codes match, click **Codes match** and the participant shows as **Verified**. Verification is kept on your device for the current chat only.

**Refresh encryption keys**, in the same panel, gives your device new encryption keys in the group. Use it for fresh keys partway through a long chat.

### When a chat ends

**Encrypted chat ended** appears and the messages are gone from your screen when:

- you click **Leave**, reload the page, close the tab or lose the connection,
- the host leaves,
- a member is removed from the channel, the channel is edited or deleted or a direct message is hidden with **Hide conversation**,
- a participant loses their access, for example through a role or permission change, or
- the server cannot coordinate the session.

A participant whose browser stops responding for about 45 seconds is removed from the chat. Adding a new member to the channel keeps the chat running; the new member can join it.

---

## Setting Up Encrypted Chats

### Enable encrypted chats

1. Go to **Settings > Admin > General**.
2. Turn on **Channels**. The **Encrypted channels** switch appears below it.
3. Turn on **Encrypted channels** and save.

The same switch is available as [`ENABLE_ENCRYPTED_CHANNELS`](/reference/env-configuration#enable_encrypted_channels). It is off by default.

### Who can use it

Admins can always start and join encrypted chats. A user needs both the **Channels** and the **Encrypted Channels** permission ([`USER_PERMISSIONS_FEATURES_CHANNELS`](/reference/env-configuration#user_permissions_features_channels) and [`USER_PERMISSIONS_FEATURES_ENCRYPTED_CHANNELS`](/reference/env-configuration#user_permissions_features_encrypted_channels)). **Encrypted Channels** is off by default; grant it in the default permissions or per [group](/features/authentication-access/rbac/groups). See [Permissions](/features/authentication-access/rbac/permissions#4-features-permissions).

Encrypted chats are available only in direct messages and private group channels, and only to members of that conversation.

### Requirements

Open WebUI refuses to start or join an encrypted chat unless all of these hold:

| Requirement | Setting |
|-------------|---------|
| The browser is connected over a websocket. HTTP long polling is refused. | [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) on (the default), and a reverse proxy that passes websocket upgrades |
| Websocket server logging is off, so packets never reach the logs | [`WEBSOCKET_SERVER_LOGGING`](/reference/env-configuration#websocket_server_logging) and [`WEBSOCKET_SERVER_ENGINEIO_LOGGING`](/reference/env-configuration#websocket_server_engineio_logging) off (the default) |
| HTTPS when [`ENV`](/reference/env-configuration#env) is `prod` (the Docker default) | Serve Open WebUI over HTTPS. Behind a reverse proxy that terminates TLS, the proxy must send `X-Forwarded-Proto` and [`FORWARDED_ALLOW_IPS`](/reference/env-configuration#forwarded_allow_ips) must trust it |

The browser also needs a secure context: HTTPS, or `localhost` during local testing.

When a requirement is missing, the encrypted chat ends right after it opens.

### Multiple instances

With several workers or instances sharing Redis (`WEBSOCKET_MANAGER=redis`), the session metadata (who is in which chat and their public keys) is coordinated through Redis. Each entry expires 90 seconds after the last activity. The encrypted packets travel through Redis Pub/Sub on their way between instances and are never stored there. See [Scaling Open WebUI](/getting-started/advanced-topics/scaling).

### Rate limits

Each user can start or join at most 10 encrypted chats per minute. All other encrypted chat traffic (messages, typing indicators, receipts and keep-alives) is limited to 100 requests and 4 MiB per second per user. With Redis the limits apply across all instances; without it, per worker.
