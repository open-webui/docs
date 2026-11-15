---
sidebar_position: 11
title: "Terminal Pane"
---

# The Terminal Pane

Under the [file browser](./file-browser.md) sits a live view of what the AI is running: every command the AI starts gets its own tab. For your own interactive shell, pick **New Terminal** from the **+** menu of the **Tabs**; you can open several side by side.

It appears once the AI has run a command, collapsed as a single strip labelled **Sessions**. When commands are running, the strip carries a count of how many. Click the strip, or the chevron at its right, to open it.

---

## A tab per command

Every command the AI runs appears as its own tab, labelled with the command itself. Select a tab to watch that command's output as it arrives. A dot shows whether it is running, failed or finished, and tabs for finished commands can be dismissed. Dismissing a tab does not affect the command.

## Naming of shell tabs

A **New Terminal** tab is named after the program running in it.

---

## Good to know

:::tip It is a window, not a leash
Dismissing a tab or collapsing the whole pane changes nothing about what the AI is doing. These are your views of the terminal, not controls over it.
:::


:::info One terminal at a time
The pane follows the terminal selected in the chat, the same as the file browser. Switching terminals switches which instance you are looking at.
:::

---

## For self-hosted terminal servers

Open WebUI proxies the interactive terminal over a websocket, and that connection carries `X-User-Id` and `X-Session-Id` headers naming the signed-in user and the chat the terminal belongs to, the same as the HTTP proxy. A terminal server that scopes sessions per user sees the same identity on both.

Open WebUI sets `X-User-Id` from the authenticated session, so a browser cannot choose it. `X-Session-Id` is the chat ID the browser reports.
