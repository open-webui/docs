---
sidebar_position: 11
title: "Terminal Pane"
---

# The Terminal Pane

Under the [file browser](./file-browser.md) sits a terminal. It is both your own shell on the connected terminal and a live view of what the AI is running, because every command the AI starts gets its own tab next to yours.

It starts collapsed as a single strip labelled **Terminal**. When commands are running, the strip carries a count of how many. Click the strip, or the chevron at its right, to open it.

---

## The Shell tab

The first tab is **Shell**: a real interactive terminal on the connected machine, in the same workspace the AI is working in. Type in it like any other terminal.

Closing it with the **✕** on the tab ends that session and leaves a **+** in its place. Clicking the **+** opens a fresh shell.

---

## A tab per command

Every command the AI runs appears as its own tab, labelled with the command itself. The dot in front of the label is the status:

| Dot | Meaning |
| :--- | :--- |
| Green | Still running |
| Red | Finished with a non-zero exit code |
| Grey | Finished normally, or the terminal no longer knows about it |

Hovering a tab spells the same thing out in words, including the exit code. Select a tab to watch that command's output as it arrives. A command that has produced more output than the pane keeps starts with a line saying earlier output was omitted.

Tabs for commands that have finished carry a **✕** that dismisses them. A running command cannot be dismissed, which is deliberate: the tab is the only place its output is shown. A tab you dismiss stays gone, even though the command itself is still listed by the terminal.

**Arrow keys** move between tabs while the tab strip has focus, and **Home** and **End** jump to the first and last.

---

## Good to know

:::tip It is a window, not a leash
Dismissing a tab, closing the shell, or collapsing the whole pane changes nothing about what the AI is doing. These are your views of the terminal, not controls over it.
:::

:::info Only the tab you are looking at is polled
Output is fetched for the tab currently on screen, and only while the pane is open. Leaving a long command in a background tab does not mean its output is being streamed to your browser the whole time; it is fetched when you switch to it.
:::

:::info One terminal at a time
The pane follows the terminal selected in the chat, the same as the file browser. Switching terminals switches which machine you are looking at.
:::

---

## For self-hosted terminal servers

Open WebUI proxies the interactive terminal over a websocket, and that connection carries `X-User-Id` and `X-Session-Id` headers naming the signed-in user and the chat the terminal belongs to. The HTTP proxy has always sent them; the websocket now does too, so a terminal server that scopes sessions per user sees the same identity on both.

Both values are set by Open WebUI from the authenticated session, so a browser cannot choose them.
