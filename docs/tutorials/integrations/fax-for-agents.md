---
sidebar_position: 33
title: "Fax for Agents"
sidebar_label: Fax for Agents Tool
description: Send and read faxes from an Open WebUI chat with the Fax for Agents tool. The tool prepares the page, gets a quote and sends within limits the account owner sets.
keywords: [fax, tools, workspace tools, valves, fax for agents, integration]
---

:::warning Community Contribution

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/tutorials/contributing-tutorial/).

:::

[Fax for Agents](https://faxforagents.com) is a fax API built for AI agents. Its Open WebUI tool lets a model send a fax and read received faxes from a chat. You add the tool once, each user enters their own API key in the tool's Valves, and then you describe the fax in plain words.

By default a connected app sends inside the limits the account owner set, with no approval per fax. The owner can turn that off so that every send waits for a person.

## Before you start

- A Fax for Agents account and a Sandbox API key from the dashboard. When you create the key, tick the box that marks it as a key for a connected app. Sandbox sends never reach a real fax line.
- A model that supports function calling.
- An administrator, or a user allowed to create tools.
- The tool file `fax_for_agents.py` from [faxforagents/openwebui-tool](https://github.com/faxforagents/openwebui-tool) (MIT).

## 1. Add the tool

1. Open **Workspace > Tools** and select **Create**.
2. Name it `Fax for Agents`. The ID fills in by itself.
3. Paste the whole of `fax_for_agents.py` into the editor.
4. Select **Save & Create**, read the standard warning about tools that run code, and select **Confirm**.

The Tools list now shows Fax for Agents with its version and its switch on. The tool is added once for everyone on the instance.

## 2. Enter your API key

1. Start a new chat and open **Integrations > Tools**.
2. Select the Valves icon next to Fax for Agents.
3. Change **Default** to **Custom**, enter your own Sandbox API key and select **Save**.

The key is stored in your user's Valves and never appears in the chat.

## 3. Send a fax

Switch Fax for Agents on for the chat, then type what the fax should say and where it goes. The tool prepares a page, gets a quote and sends it when the quote is inside your limits. The first reply says the fax is queued. Ask for the delivery evidence when you want the full record of the attempt.

To read received faxes, ask for your inbox. The tool lists them and reads the newest one as text.

## Approve every fax instead

In the Fax for Agents dashboard, open **Settings** and turn off **Let connected apps send without asking**. A quote then comes back denied and asks for a person. Someone approves it in the dashboard, and you tell the model to send with the approval id. The Open WebUI tool cannot create approval requests itself.

## Troubleshooting

| What you see | What it means |
|---|---|
| "Set your own API_KEY in this tool's UserValves" | Enter your key in the tool's Valves (step 2). |
| "Authorization required: yes" and "Policy evaluation: denied" | The owner turned the connected apps switch off, or the fax is above a limit. Check the dashboard settings. |
| A question box asking whether to send | The model wants a word from you first. Choose to send, then submit. |

The full guide with screenshots is at [faxforagents.com/docs/guides/open-webui](https://faxforagents.com/docs/guides/open-webui/).
