---
title: Get started with Open WebUI Computer
sidebar_position: 1
---

# Get started

Start with the machine and folder where your work already lives. You do not need an AI key, remote networking, Docker, or Git to prove the useful part: Computer can show you that same folder in a browser.

## Recommended learning sequence

Build trust in one layer at a time. Each step has a result you can see before you give the app more reach:

1. **Open a local folder.** Use [Local trial](./local-trial), then [open your first workspace](./first-workspace). Confirm a familiar file is the real file on the host.
2. **Optionally add an agent.** Ask it to explain one real file, then decide whether to let it change anything. Start with [AI and coding agents](/ecosystem/computer/agents).
3. **Optionally reach the host remotely.** Keep the service local by default; when you need another device, add a private route with [Remote access and security](/ecosystem/computer/remote-access).
4. **Only then add unattended or external connections.** Schedules, bots, gateways, and external tool servers are high-trust paths. Start one at a time from [Automations and integrations](/ecosystem/computer/integrations), with a scoped workspace and a harmless proof.

The sequence is intentional, not a required feature checklist. Stop after any step that solves the problem you have today.

## Choose an installation path

**Start with [Local trial](./local-trial) unless you already run personal services in Docker or the host cannot reach the internet.** It is the shortest path: install one package, open one existing folder, and decide whether seeing your real work from a browser is useful.

- **Already use Docker for your own services?** Choose [Docker](./docker). It makes the application runtime repeatable, while you explicitly choose the host project it can access.
- **Does the host have no internet connection?** Choose [Air-gapped installation](./air-gapped). Prepare artifacts on a connected machine first.
- **Is the host Windows?** Follow [Windows host setup](./windows), then continue with [your first workspace](./first-workspace).

After any installation path, open [your first workspace](./first-workspace). A workspace simply means the existing folder you choose to work in. Open WebUI Computer remains useful without an AI connection.

Install the browser app only after private browser access already works; its share, import, and device-specific behavior belongs in [PWA, sharing, and shortcuts](/ecosystem/computer/workspace/pwa-share-shortcuts).
