---
sidebar_position: 2
sidebar_label: "OpenAI Codex CLI"
title: "Connect OpenAI Codex CLI with Open Terminal"
description: "Use OpenAI Codex CLI in Open WebUI through Open Terminal. Set up device login, select a Codex model, and verify shell access in your project."
---

# Use OpenAI Codex CLI in Open WebUI

## Set up OpenAI Codex CLI in the terminal

The Open Terminal `:agents` image includes `codex`. For a host install or another image, install Codex CLI in the terminal that holds your project. [Codex CLI installation](https://developers.openai.com/codex/cli/)

For a remote terminal, run `codex login --device-auth` and complete the login in your browser. Device login must be enabled for your account or workspace. Run `codex login status` as the terminal user to check which login the CLI will use. [Codex authentication options](https://developers.openai.com/codex/auth)

## Select Codex in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `codex/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal starts the Codex app server over standard input and output. Ask Codex to run `pwd` and read the README. If you see a `bwrap` namespace error, the CLI has started but its Linux sandbox cannot run the command in that container. [Troubleshoot the terminal runtime](/getting-started/quick-start/connect-an-agent#why-is-my-agent-missing-from-the-model-picker)
