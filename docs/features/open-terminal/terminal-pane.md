---
sidebar_position: 11
title: "Terminal Pane"
---

# The Terminal Pane

Under the [file browser](./file-browser.md) sits a live view of what the AI is running: every command the AI starts gets its own tab. For your own interactive shell, pick **New Terminal** from the **+** menu of the **Tabs**; you can open several side by side.

It appears once the AI has run a command, collapsed as a single strip labelled **Sessions**. When commands are running, the strip carries a count of how many. Click the strip, or the chevron at its right, to open it.

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

## Naming of shell tabs

A **New Terminal** tab is named after the title the running program sets, so a tab with an editor, a dev server or a coding agent in it says so, and an idle shell shows its own title. Next to the name, an icon shows what the tab is running. Claude Code, Codex, Python, Node.js, npm, git, Docker and a few other well-known programs have their own icons, and any other program gets the plain terminal icon. The icon follows the program that Open Terminal reports as running in the foreground, which it does on Unix-like systems. Keep Open Terminal up to date, see [Updating](/features/open-terminal/setup/updating).

---

## Good to know

:::tip It is a window, not a leash
Dismissing a tab or collapsing the whole pane changes nothing about what the AI is doing. These are your views of the terminal, not controls over it.
:::

:::info Only the tab you are looking at sends output
The command list streams live, and so does the output of the tab on screen while the pane is open. A command in a background tab sends no output to your browser until you switch to it.
:::

:::info One terminal at a time
The pane follows the terminal selected in the chat, the same as the file browser. Switching terminals switches which instance you are looking at.
:::

---

## For self-hosted terminal servers

Open WebUI proxies the interactive terminal over a websocket, and that connection carries `X-User-Id` and `X-Session-Id` headers naming the signed-in user and the chat the terminal belongs to, the same as the HTTP proxy. A terminal server that scopes sessions per user sees the same identity on both.

Open WebUI sets `X-User-Id` from the authenticated session, so a browser cannot choose it. `X-Session-Id` is the chat ID the browser reports.
