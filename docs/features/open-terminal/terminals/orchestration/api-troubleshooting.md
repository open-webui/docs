---
sidebar_position: 10
title: "API and Troubleshooting"
---

# API and Troubleshooting

## Open WebUI Terminals API

Terminals can also be managed through the Open WebUI API with a user token. Read and write rules follow [Connection Access](/features/open-terminal/terminals/orchestration/creating-terminals#connection-access). The endpoints change often, so they are not listed here. Point an AI agent at the Open WebUI backend to read the latest endpoints and specs.

## Headers Sent to the Terminals Server

Open WebUI sends these headers with requests that run in a terminal:

| Header | Value |
| :--- | :--- |
| `X-User-Id` | The verified ID of the user making the request |
| `X-Session-Id` | The chat ID, when the request belongs to a chat |
| `X-Terminal-Template-Id` | The ID of the terminal on the Terminals server |
| `X-Terminal-Chat-Id` | The saved chat ID, whenever the request belongs to a saved chat |
| `X-Terminal-Model-Id` | The model ID, for a **Model** terminal |

## Troubleshooting

### Do I need quotes around env vars?

No. Enter the value exactly as the container should receive it. Quotes are only needed when quote characters are part of the intended value.

### Can I pass env vars to the orchestrator and have it forward them?

Use the terminal's **Environment variables**, see [Forwarding Behavior](/features/open-terminal/terminals/orchestration/environment-variables#forwarding-behavior).

### Why did my env var or image change not apply?

The machine was probably already running. Restart it from the **Machines** list of the terminal, or wait for idle cleanup.

### Why can't users browse to `/etc` in the file browser?

For orchestrated terminals, the file browser starts in the home folder, shown as `Home`, and hides the folders above it. To change or remove that root, see [File Browser Root](/features/open-terminal/terminals/orchestration/file-browser-home-boundary#configure-the-root).
