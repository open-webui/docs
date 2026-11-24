---
sidebar_position: 12
sidebar_label: "Pi"
title: "Connect Pi with Open Terminal"
description: "Connect the Pi agent to Open WebUI through Open Terminal using Pi’s native RPC mode. Sign in to a provider and select a Pi model in chat."
---

# Use Pi in Open WebUI

## Set up Pi in the terminal

Install Pi's terminal application in the workspace, then run `pi` from your project. Enter `/login` to connect a supported provider, or configure the provider's API key in the environment used by Open Terminal. Use `/model` to select a model and send a test message. [Pi installation](https://pi.dev/) · [Pi commands](https://docs.pi.dev/latest/usage)

## Select Pi in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `pi/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal starts `pi --mode rpc` to discover models and exchange messages. Pi has a native integration, so there is no ACP registration step. For a first task, ask Pi to read two files and identify a difference you can verify in the workspace.
