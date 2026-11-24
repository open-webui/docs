---
sidebar_position: 11
sidebar_label: "OpenCode"
title: "Connect OpenCode with Open Terminal"
description: "Connect OpenCode to Open WebUI over ACP. Configure its provider inside Open Terminal and find provider-qualified models in the picker."
---

# Use OpenCode in Open WebUI

## Set up OpenCode in the terminal

Install OpenCode in your terminal workspace. Run `opencode` and use `/connect` to configure a provider, then `/models` to select a model. For a local model server, configure an address reachable from the terminal. Ask the model to read a file to verify the provider and workspace together. [OpenCode installation](https://opencode.ai/docs/) · [OpenCode providers](https://opencode.ai/docs/providers/)

## Select OpenCode in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `opencode/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

OpenCode can include the provider in a model name, so the full picker entry can look like `opencode/<provider>/<model>`. Open Terminal starts `opencode acp` automatically. Running that command by hand leaves the process waiting for protocol messages. Use the interactive `opencode` command to test your login. [OpenCode ACP guide](https://opencode.ai/docs/cli/acp/)
