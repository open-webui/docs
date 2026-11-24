---
sidebar_position: 3
sidebar_label: "Cline CLI"
title: "Connect Cline CLI with Open Terminal"
description: "Connect Cline CLI to Open WebUI with Open Terminal. Configure a model provider with cline auth and select a Cline model in chat."
---

# Use Cline CLI in Open WebUI

## Set up Cline CLI in the terminal

Install Cline CLI in your terminal workspace. If you use npm, run the following commands as the terminal user.

```bash
npm install -g cline
cline auth
```

Choose your provider in the authentication flow, then run `cline` from the project folder and send a short prompt. If you've already configured Cline in your editor, still check that this terminal user's CLI can reach the provider. [Cline CLI setup](https://docs.cline.bot/usage/cli-overview)

## Select Cline in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `cline/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal runs `cline --acp` to start a session using the Agent Client Protocol (ACP). Ask Cline to find the project’s test command and show where it found it. You can review any tool requests in the same conversation.
