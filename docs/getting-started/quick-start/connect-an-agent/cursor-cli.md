---
sidebar_position: 4
sidebar_label: "Cursor CLI"
title: "Connect Cursor CLI with Open Terminal"
description: "Run Cursor CLI from Open WebUI. Authenticate the agent executable in a local or remote Open Terminal and find Cursor models in the chat picker."
---

# Use Cursor CLI in Open WebUI

## Set up Cursor CLI in the terminal

Install Cursor CLI in the environment running Open Terminal. Its executable is named `agent`. On a remote machine, print the sign-in URL and open it in your own browser.

```bash
NO_OPEN_BROWSER=1 agent login
agent status
```

On a computer with a browser, use `agent login` directly. Check that `agent status` shows the intended account. [Cursor CLI installation](https://cursor.com/docs/cli/installation) · [Cursor authentication](https://cursor.com/docs/cli/reference/authentication)

## Select Cursor in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `cursor/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal starts `agent acp` using the Cursor login. If the picker has no Cursor entries, run `command -v agent` in the terminal where the project lives. Installing the desktop editor on another computer does not put the CLI in that workspace.
