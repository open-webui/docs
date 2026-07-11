---
title: "Preview local apps and browse"
sidebar_position: 6
---

# Preview local apps and browse

Two ways to get a web page next to your work: a **port preview** opens a dev server that's running on the host, and a **browser tab** opens any URL. Both live in the same tab-and-split layout as your files and terminals.

## Preview a local dev server

Start your app in a workspace terminal the way you always do:

```bash
npm run dev
```

When Computer detects the process listening on a port, that port appears in the **Ports** row of the file browser. Click the `:port` to open the app in a preview tab, right beside the terminal that's producing its logs.

The preview connects to the live process. Edit a file, let the dev server reload, and the preview shows the result. If the process exits (crash, host restart, `cptr` restart), the port disappears; start the server again and reopen it.

### Test on a real device

Because the preview works from any device signed in to your instance, this is the easy way to test on real hardware: the dev server runs on the machine at your desk, and you open its port preview on your actual phone or tablet to check touch targets, viewport behavior, and layout. No deploy, no copying the project anywhere. Keep the terminal open in a split on the desktop to watch logs while you tap around on the phone.

A port preview is for people signed in to your instance; it's not a public URL, and it doesn't add authentication to the app it serves.

## Browse any URL

Add a Browser tab to visit any website (a staging site, an API's docs, an issue tracker) next to your work without leaving the workspace. Back, forward, and reload work as expected, and the tab sits in your layout like everything else.

Browser sessions are live sessions, not a durable profile: after a `cptr` restart you may need to reload the page and sign in to sites again.

The browser behind these tabs can be a managed browser or your personal Chrome, depending on how the instance is configured in its settings. The AI's web-browsing tools use the same source.

:::warning
A signed-in browser session is real access to those accounts: anyone who can use your Computer instance can act as you on any site you're logged into there. Keep the instance private, and don't stay signed in to sensitive accounts on an instance other people can reach.
:::
