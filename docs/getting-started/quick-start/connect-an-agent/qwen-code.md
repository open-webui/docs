---
sidebar_position: 13
sidebar_label: "Qwen Code"
title: "Connect Qwen Code with Open Terminal"
description: "Connect Qwen Code to Open WebUI with Open Terminal. Install the qwen CLI, configure its provider, and find its models in the chat picker."
---

# Use Qwen Code in Open WebUI

## Set up Qwen Code in the terminal

Install Qwen Code in the terminal environment. With a supported Node.js version, run the following commands.

```bash
npm install -g @qwen-code/qwen-code
qwen
```

Use `/auth` in Qwen Code to choose an authentication method for your account or provider. Send a prompt and check that the model responds before returning to Open WebUI. [Qwen Code installation](https://github.com/QwenLM/qwen-code) · [Authentication options](https://qwenlm.github.io/qwen-code-docs/en/users/configuration/auth/)

## Select Qwen Code in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `qwen/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal launches `qwen --acp`. A Qwen model connected to Open WebUI through Ollama or an OpenAI-compatible endpoint is also available as a regular model. Select the `qwen/` entry when you want Qwen Code itself to read files and run tools in the terminal.
