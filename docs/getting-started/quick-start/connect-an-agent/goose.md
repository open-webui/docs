---
sidebar_position: 8
sidebar_label: "Goose"
title: "Connect Goose with Open Terminal"
description: "Configure a Goose provider and model in your Open Terminal workspace and use that Goose session from an Open WebUI chat."
---

# Use Goose in Open WebUI

## Set up Goose in the terminal

Install the Goose CLI for the terminal's operating system, then configure a provider and model as the terminal user.

```bash
goose configure
goose session
```

In the new session, ask Goose to summarize a file you recognize. This checks both the provider configuration and Goose's access to the workspace. Exit the session once it answers. [Goose CLI installation and provider setup](https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/installation.md)

## Select Goose in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `goose/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal launches `goose acp` and asks Goose for its available models. If the provider works on your laptop but the chat runs in a container, run `goose configure` inside that container with its own provider credentials.
