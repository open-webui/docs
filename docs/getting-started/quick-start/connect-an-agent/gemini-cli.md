---
sidebar_position: 5
sidebar_label: "Gemini CLI"
title: "Connect Gemini CLI with Open Terminal"
description: "Set up Google Gemini CLI in Open Terminal, authenticate it for your project, and choose its Gemini model from an Open WebUI chat."
---

# Use Gemini CLI in Open WebUI

## Set up Gemini CLI in the terminal

Install the CLI in the terminal where you keep your project. With Node.js and npm available, run the following commands.

```bash
npm install -g @google/gemini-cli
gemini
```

Choose an authentication method available to your account, such as a Gemini API key or Vertex AI. If the method uses environment variables, supply them to the Open Terminal process so that the CLI it starts can use them. Verify that a prompt succeeds with the same project and credentials. [Gemini CLI installation](https://geminicli.com/docs/get-started/installation/) · [Authentication methods](https://geminicli.com/docs/get-started/authentication/)

## Select Gemini CLI in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `gemini/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal runs `gemini --acp`. If you have both Gemini CLI and Google Antigravity installed, each has its own picker prefix. Select `gemini/` for this CLI or follow the [Antigravity guide](./antigravity.md) to use `agy`.
