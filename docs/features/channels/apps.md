---
sidebar_position: 2
title: "Apps"
---

# Apps

Apps are external services that join [channels](/features/channels) as members. Mention an app and it answers in the channel. Apps can post messages with cards and buttons, answer a button click privately to you, update their own messages and, when an admin allows it, follow every message in the channels they belong to.

An app runs on its own server. Open WebUI opens the connection to the app, so Open WebUI itself can stay on a private network with no public callback address. To post messages into a channel without answering anyone, a [channel webhook](/features/administration/webhooks#3-channel-webhooks-external-message-integration) is simpler.

:::info
Apps were added in v0.12.1 and are experimental. **Settings > Admin > Apps** shows an **Experimental** badge.
:::

---

## Using Apps in a Channel

### Add an app to a channel

1. Open the channel and click the member count next to the people icon in the header.
2. Click **Add Member**.
3. Select the app under **Apps** and click **Add**.

The app now appears in the member list with an **App** badge. To take it out again, use the remove button next to it in the same list.

Only the channel's creator and admins can add and remove apps. To add an app you also need access to it, and the app must be enabled. You only see apps you are allowed to use. Apps join standard and group channels; direct messages stay between people.

An app granted **Read messages and history in joined channels** receives every message posted in the channel and can read its history. Ask an admin which scopes an app has before adding it to a channel with sensitive content.

### Mention an app

Type `@` in a channel where the app is a member and pick it from the **Apps** group in the suggestion list. You can also type `@` and the app's full name; see [Tagging people and linking channels](/features/channels#tagging-people-and-linking-channels). Send your message and the app receives it. One message reaches at most the first 10 apps it mentions. The app confirms that it received the message, then posts its answer in the channel when it is ready.

### Private and channel replies

An app answers a mention with a channel message. A button click can be answered either way:

- **Private replies** appear under the app's message whose button you clicked, marked **Only visible to you**, with a **Dismiss** link. Only you see them, and only until you dismiss them, reload the page or switch to another channel or thread. A private reply appears only if you are still in that channel or thread when it arrives. File downloads are only ever shown to you.
- **Channel replies** are posted as normal channel messages under the app's name, with an **App** label. Everyone in the channel sees them and they stay in the history.

After a button click, an app can also send a Markdown file as a private reply. It shows as a **Download** button with the file name, for example **Download report.md**, that saves the file to your device.

If a mention fails, Open WebUI posts the reason under the app's name as a reply to your message, starting with `App error:`. Everyone in the channel sees it. If the app cannot post in the channel, for example because it is disabled or lacks the scope to post, the reason appears under your message and only you see it. If a button click fails, the reason appears under the app's message and only you see it. Ask an admin to check the app in **Settings > Admin > Apps**. [Troubleshooting](#troubleshooting) lists the messages you are most likely to see.

### Buttons

Channel messages from an app can carry buttons and cards. A card shows a title, text, fields and a small image, with a colored bar on the side. A link button opens a web page in a new tab. Any other button sends the click to the app, which can answer privately, post a new message or update the message the button belongs to.

---

## Setting Up Apps

### Enable apps

1. Go to **Settings > Admin > General**.
2. Turn on **Apps** and **Channels**, then save. Apps only act in channels, so both are needed.
3. The **Apps** tab appears in the admin settings.

The same switch is available as [`ENABLE_APPS`](/reference/env-configuration#enable_apps). Turning it off closes every app connection.

### Install an app

You need two things from the app's operator: its **App URL**, for example `https://app.example.com/events`, and its **API key**.

For an app on your own network, on the Docker host or on plain HTTP, set up [Private and plain HTTP app servers](#private-and-plain-http-app-servers) first.

1. Go to **Settings > Admin > Apps** and click **Add app** (the plus button).
2. Enter the **App URL** and **API Key**, then click **Continue**. Open WebUI loads the app's details from that URL.
3. Review the scopes the app requests. Switch off any you do not want to grant, then click **Continue**.
4. Check the **Name**, the **App handle** and **Access**. The handle is a short unique ID shown next to the name in the **Apps** list. It takes lowercase letters, digits and hyphens, starts with a letter and has at most 40 characters. The handle and the App URL are fixed once the app is saved; to move an app to a new address, install it again under a new handle.
5. Click **Connect**.

If **Connect** fails, the app is still saved, disabled, with its handle. Fix the cause and click **Connect** again.

If the app does not publish its details, fill in **App URL** and **API Key**, then click **Enter details manually**. Enter the **Name** and the app's Ed25519 **Public key**. Click **Requested scopes**, switch on the scopes the app requests and click **Continue**. Then click **Review** next to **Scopes** and switch on the ones you grant. Set **App handle** to exactly the app's ID (`manifest_id` in oix): for a manually entered app Open WebUI uses the handle as that ID, and the connection fails if the two differ. This needs an app ID that is also a valid handle. An app with any other ID has to publish its details.

The App URL cannot contain credentials, a query (`?`) or a fragment (`#`), and it must answer directly without a redirect. Open WebUI connects to apps directly and ignores `HTTP_PROXY`, `HTTPS_PROXY` and `NO_PROXY`, so the Open WebUI server needs a direct network path to every app.

The API key and the app's connection credential are stored encrypted with a key derived from [`WEBUI_SECRET_KEY`](/reference/env-configuration#webui_secret_key). Keep that value stable and the same on every Open WebUI instance; if it changes, follow [Apps stop connecting after WEBUI_SECRET_KEY changed](#apps-stop-connecting-after-webui_secret_key-changed).

### Private and plain HTTP app servers

By default every app URL must use HTTPS, and every address its hostname resolves to must be public. To allow an app on localhost, a private network or plain HTTP, list its origin in [`APP_ALLOWED_PRIVATE_ORIGINS`](/reference/env-configuration#app_allowed_private_origins) on the Open WebUI server and restart:

```bash
APP_ALLOWED_PRIVATE_ORIGINS=http://127.0.0.1:8000
```

The match is exact on scheme, host and port. A listed `http://` origin may use plain HTTP; a listed origin of either scheme may resolve to private, loopback or reserved addresses. Write every entry with its scheme, for example `http://host.docker.internal:8000`. An entry without a scheme, or with credentials or a fragment, breaks every app, public ones included: loading app details fails with `Invalid app URL` and installed apps stay on **Connecting**.

Inside Docker, `127.0.0.1` is the Open WebUI container itself. For an app running on the Docker host, use `http://host.docker.internal:8000` as the origin (on Linux, start the container with `--add-host=host.docker.internal:host-gateway`). For an app in another container on the same Docker network, use its service or container name, for example `http://hello-app:8000`. For an app on another machine in your network, use its LAN address, for example `http://192.168.1.50:8000`. The App URL then starts with exactly that origin, for example `http://192.168.1.50:8000/events`.

App connections always verify the app's certificate. For an app on your network with a self-signed certificate, list its `http://` origin and use plain HTTP, or give the app a certificate the Open WebUI server trusts.

### Scopes

Scopes limit what an app can do. You pick which scopes to grant when you install the app, and you can change the selection later in **Configure** with **Edit** next to **Scopes**. Both lists offer only the scopes the app requests.

The requested scopes come from the app's details. For an app whose details you entered by hand, change them in **Configure**: click **Edit details manually**, then **Requested scopes**. Switching off a requested scope also removes it from the granted ones.

| Scope | Shown as | What it allows |
|-------|----------|----------------|
| `channels:mentions:read` | Read app mentions in joined channels | Receive messages that mention the app |
| `channels:messages:read` | Read messages and history in joined channels | Receive mentions and every new, edited and deleted message in joined channels. Read message history and threads |
| `channels:messages:write` | Send messages and edit own messages in joined channels | Post channel messages and edit the app's own messages |
| `channels:read` | Read joined channel details | List the channels the app was added to, with name, type and whether they are private |

Receiving mentions needs `channels:mentions:read` or `channels:messages:read`. Answering them needs `channels:messages:write` as well, because the answer is a channel message. Button clicks reach the app with any scopes. Channel replies and button updates need `channels:messages:write`; private replies to a button click need no further scope. Every scope applies only to channels the app was added to.

### Access

**Access** sets who can use the app: mention it, click its buttons and add it to channels. Using it in a channel also needs read access to that channel.

- **Everyone** (the default for a new app): every user.
- **Restricted**: admins plus the users and [groups](/features/authentication-access/rbac/groups) you add. With nobody added, only admins can use the app.

### Connection status

Open WebUI keeps a live connection to each enabled app and reconnects on its own, waiting up to 30 seconds between attempts. Every Open WebUI worker opens its own connection; see [Scaling Open WebUI](/getting-started/advanced-topics/scaling) for workers and Redis. The **Apps** tab shows the state of each enabled app and refreshes every few seconds:

| Status | Meaning |
|--------|---------|
| **Connected** | A verified connection is open. With several workers sharing Redis, at least one of them is connected. |
| **Connecting** | Open WebUI is trying to reach the app and will keep retrying. |
| **Disconnected** | No connection is open. |

Disabled apps are dimmed. Hover the switch to see **Enabled**, **Disabled** or **Uninstalled**.

When an app stays on **Connecting** or **Disconnected**, turn its switch off and on again, then click **Connect** in the dialog that opens. The dialog shows why the connection fails; [Troubleshooting](#troubleshooting) explains each message.

### Update, disable and uninstall

- **Configure** (gear icon) opens the app's settings. **Update app** (the refresh button next to the URL) loads the app's details again, for example after the operator added a scope or changed the profile image. Saving approves the updated details and selected scopes and reconnects the app. When the public key or the API key changes, saving connects the app again from scratch, as on first install.
- **Edit details manually** (below the URL) opens the app's **Public key** and **Requested scopes** for editing. Use it for an app that does not publish its details. Saving approves the edited details and reconnects the app the same way.
- The switch disables an enabled app at once. Turning it back on opens the settings, where **Connect** connects it again.
- **Uninstall**, at the bottom of the **Configure** dialog, removes the API key, the connection credential and the app's channel memberships. Messages the app already posted stay in the channels. The app stays in the list as **Uninstalled**, with its handle, scopes and access. To use it again, turn its switch on, enter the API key, click **Connect** and add it to its channels again.

Rolling the database back past the Apps migration (`c92da83b017f`) is refused while any message posted by an app exists; see [Downgrade (Rollback)](/troubleshooting/manual-database-migration#downgrade-rollback).

---

## Troubleshooting

### In the app settings

These messages appear in the app settings dialog while you install, update or connect an app.

| Message | What to check |
|---------|---------------|
| `App endpoints require HTTPS. For local HTTP, configure APP_ALLOWED_PRIVATE_ORIGINS.` | Use an HTTPS URL, or list the origin in `APP_ALLOWED_PRIVATE_ORIGINS`. |
| `App resolves to a private or reserved address. For local development, configure APP_ALLOWED_PRIVATE_ORIGINS.` | The hostname points to a private address. List the origin in `APP_ALLOWED_PRIVATE_ORIGINS`. |
| `Invalid app URL. Use an HTTP(S) URL without credentials or a fragment.` | Remove credentials and `#fragment` from the URL. If every app URL fails this way, an `APP_ALLOWED_PRIVATE_ORIGINS` entry is missing its scheme. |
| `Invalid app URL` | Shown at **Connect** after entering details manually. The URL uses plain HTTP without an `APP_ALLOWED_PRIVATE_ORIGINS` entry, or contains credentials, a query or a fragment. |
| `App returned an invalid response. Expected JSON.` | The App URL contains a query (`?...`), or the app answered with something other than JSON. Remove the query, or check what the App URL returns. |
| `App response exceeds the allowed size.` | The app's details are larger than 256 KiB. |
| `App rejected the API key. Check the API key configured on the app server.` | The key does not match the app's key. |
| `App manifest endpoint returned HTTP <code>. Check the URL or enter details manually.` | Wrong URL, or the app redirects. Use the final URL, or enter details manually. |
| `App returned an invalid manifest. Check its app details or enter them manually.` | The app's details are malformed (see [Manifest](/features/channels/building-apps#manifest)). |
| `App request timed out. Check that the app server is running and reachable.` | The app did not answer within 10 seconds while its details were loaded. |
| `The app connection failed before a complete response was received.` | The app closed the connection or sent a broken HTTP response while its details loaded. Check the app server logs. |
| `App TLS verification failed. Check its certificate and hostname.` | The app's certificate is invalid or does not match its hostname. |
| `App hostname could not be resolved. Check DNS from the WebUI server.` | DNS lookup failed on the Open WebUI server. |
| `Could not reach the app server. Check its address, port and network access.` | Network path, firewall or port. |
| `App connection failed. Check the API key, pinned public key and Socket.IO endpoint.` | Open WebUI could not complete the connection: the app rejected the API key, the Socket.IO path is wrong, a proxy blocks WebSockets, the certificate, DNS or network failed, the app took longer than 20 seconds or its proof did not verify against the stored public key. For an app entered manually, the handle may differ from the app's ID, or the address is private and not listed in `APP_ALLOWED_PRIVATE_ORIGINS`. Click **Update app** if the app's key changed. If `WEBUI_SECRET_KEY` changed, see [Apps stop connecting after WEBUI_SECRET_KEY changed](#apps-stop-connecting-after-webui_secret_key-changed). |
| `App rejected its connection credential. Review credentials before reconnecting.` | The app no longer accepts the credential it issued at the last **Connect**, usually because its signing key was replaced. In **Configure**, click **Update app** and save; with the new public key Open WebUI connects from scratch and the app keeps its channels. If the app's API key changed, enter the new one and click **Connect**. If neither changed, uninstall the app, connect it again with its API key and add it back to its channels. |
| `App could not complete its bidirectional connection check` | The app did not acknowledge the final connection step correctly (see [Connection](/features/channels/building-apps#connection)). |
| `App slug is already registered` | Another app, possibly an uninstalled one, uses this handle. Pick another handle, or turn the uninstalled app back on. |
| `App identity cannot change` | The app's ID changed. Install it as a new app. |

The TLS, DNS and reachability messages come from loading the app's details. On **Connect**, the same problems show as `App connection failed`.

### In a channel

After a mention, these messages appear in a reply from the app that starts with `App error:`, or under your message when the app cannot post in the channel. After a button click, they appear under the app's message. When the app answers with an error status and its own error text, you see that text, up to 2,000 characters. The status messages below appear when the app sends a status without text.

| Message | What to check |
|---------|---------------|
| `App is disconnected; event was not sent` | Check the status in the **Apps** tab. |
| `App response timed out; execution outcome may be unknown` | The app did not confirm a mention within 10 seconds, did not answer a button click within 3 seconds or lost its connection while Open WebUI waited. It may still have acted. After a mention a second line follows: `Delivery was not confirmed. The app may have accepted the message; check before retrying.` |
| `App returned an invalid delivery receipt` | Shown after a mention. The app answered with something other than its delivery confirmation. An app built with oix needs oix 0.8.0 or newer. |
| `App is inactive` | The app is disabled or uninstalled. |
| `App invocation denied` | You are not allowed to use this app. Check its **Access**. |
| `Channel access denied` | You no longer have access to the channel. |
| `Invite the app into this channel first` | The app is not a member of the channel. |
| `App scope was not granted` | After a mention, the app has neither `channels:mentions:read` nor `channels:messages:read`. After a button click, the app tried to post or update a channel message without `channels:messages:write`. Check its scopes. |
| `App rejected the API key. Update the key in app settings.` | The app refused the event because of its API key. Compare the key in **Configure** with the one on the app server. |
| `App rejected event authorization. Check the app server logs for the verification failure.` | The app could not confirm the mention or click with Open WebUI. The app's log names the reason. |
| `App returned HTTP <code>. Check the app server logs.` | The app answered with an error status, for example after its handler crashed. |
| `App processing timed out; execution outcome may be unknown.` | The app's handler ran out of time. It may still have acted. |
| `App is busy or shutting down. The event was not accepted.` | The app is at capacity or restarting. Try again later. |
| `App returned an invalid response` | Shown after a button click. The app's reply has unknown fields or breaks a field limit (see [Replying to interactions](/features/channels/building-apps#replying-to-interactions)). |
| `App returned an invalid or oversized response` | The app's answer is not a JSON object or is larger than 256 KiB. |
| `Buttons require a channel message` | Shown after a button click. The app sent buttons in a private reply or in a reply other than `message` or `update`. Buttons need `visibility` `channel`. |
| `App event could not be delivered. Check the WebUI server logs.` | The event for the app is larger than 1 MiB, for example a very long message. |

### Apps stop connecting after WEBUI_SECRET_KEY changed

Open WebUI encrypts each app's API key and connection credential with a key derived from `WEBUI_SECRET_KEY`. After that value changes, Open WebUI can no longer read them: every app stays on **Connecting**, and entering the API key again in **Configure** fails too. To recover, for each app:

1. Open **Configure** and click **Uninstall**. This clears the old credentials.
2. Turn the app's switch on, enter its API key and click **Connect**.
3. Add the app back to its channels.

---

## Building an App

An app is a server that Open WebUI connects to. Build one with [oix](https://github.com/open-webui/oix#readme), the Python SDK, or implement the protocol described in [Building Apps](/features/channels/building-apps).
