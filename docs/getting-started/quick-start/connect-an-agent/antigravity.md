---
sidebar_position: 7
sidebar_label: "Google Antigravity CLI"
title: "Connect Google Antigravity CLI with Open Terminal"
description: "Use Google Antigravity CLI in Open WebUI. Install agy, sign in on the computer running Open Terminal, and select an Antigravity model."
---

# Use Google Antigravity CLI in Open WebUI

## Set up Google Antigravity CLI in the terminal

Install the Antigravity CLI on the computer or in the container running Open Terminal. Run `agy --version` there, then launch `agy` in your project folder. [Antigravity CLI installation](https://antigravity.google/docs/cli-getting-started)

On a local computer, follow the browser sign-in flow if the CLI has no saved credentials. Over SSH, `agy` can print an authorization URL. Open it on your computer and enter the resulting code in the remote terminal. Ask a short question in the CLI to confirm the account works there. [Antigravity authentication](https://antigravity.google/docs/install?tab=cli)

## Select Antigravity in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `antigravity/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal starts `agy acp` for the conversation. If the model picker shows only `gemini/` entries, check that the selected terminal has the `agy` executable. Gemini CLI uses a separate integration.
