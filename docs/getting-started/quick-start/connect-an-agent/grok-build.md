---
sidebar_position: 9
sidebar_label: "Grok Build"
title: "Connect Grok Build with Open Terminal"
description: "Connect the Grok Build CLI to Open WebUI, use device login on a remote Open Terminal, and choose a Grok model for a project chat."
---

# Use Grok Build in Open WebUI

## Set up Grok Build in the terminal

Install Grok Build inside the terminal environment and run `grok` to sign in. If the workspace is remote, start device login from that workspace.

```bash
grok login --device-auth
```

Complete the browser step, then return to the terminal and verify a prompt in `grok`. If you use an API key instead, make `XAI_API_KEY` available to the process running Open Terminal. [Grok Build installation and authentication](https://docs.x.ai/build/overview)

## Select Grok in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `grok/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal starts Grok in its `agent stdio` mode. Ask it to inspect a project file and expand its steps in chat. On versions that support automatic tool review, Grok can handle routine requests and forward escalated actions to Open WebUI. [Tool approval modes](/features/extensibility/plugin/tools#tool-approval)
