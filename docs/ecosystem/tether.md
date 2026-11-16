---
title: "Open WebUI Tether"
description: "Put AI to work on your computer, check the results from your phone, and bring your own models and tools. Download Tether for macOS, Windows, and Linux."
sidebar_position: 3
---

# Open WebUI Tether

**Put your AI to work on your computer, even when you're away.**

Ask it to turn a folder of exports into a report, fix a bug in your project, or organize your files. Check the result from your phone. Come back to the files it created on your computer.

Tether is the desktop app that connects your computer to your Open WebUI. It brings your files, tools, and local models into chat, with an optional workspace sandbox to choose where the AI can work.

**[Download for macOS, Windows, and Linux](https://github.com/open-webui/tether/releases/latest)** · **[Get started](#get-started)**

## Your Workspace, Within Reach

Your project already has its dependencies, your documents are in their folders, and your tools are installed. Tether lets your AI work in that environment through **Open Terminal**. Follow the commands, inspect the files, and ask for changes in Open WebUI. You can also use [supported agents such as Claude Code and Codex](/getting-started/quick-start/connect-an-agent) after installing and signing in to them in the terminal environment.

Open the same Open WebUI instance on another device, sign in with the same account, and select your computer under **Your devices** in the terminal menu. The work runs on the connected computer. For a team, each person's devices connect to their own account on the shared Open WebUI instance.

Tether connects outward, so you need no inbound port or router forwarding. Keep the computer awake, online, and running Tether. Enable **Run in background** to stay connected when you close its window, and **Browser Notifications** in Open WebUI to hear when a chat finishes or fails. Allow notifications in your operating system too.

## Ask About What's on Your Screen

An error you don't recognize. A chart you want explained. Something you would otherwise have to describe from scratch.

Press **Cmd+Shift+I** on macOS or **Ctrl+Shift+I** on Windows and Linux to open **Spotlight** over your current app. Capture a screen region or attach a clipboard image, ask your question, and send it to Open WebUI. Use an image-capable model for screenshots; customize the shortcut in **Tether Settings > General**.

## Give It a Folder to Work In

Tether's optional **workspace sandbox** lets you start with a defined set of files. Operating-system restrictions limit Open Terminal and its commands to the chosen workspace, temporary storage, and required program files. Sandboxed commands have network access off by default; enable it when the task needs it.

The sandbox runs natively on **macOS and supported Windows devices**, without Docker or a VM. It is **unavailable on Linux**. Under **Tether Settings > Open Terminal > Sandbox**, choose **Restrict file access**, select a folder, and **Apply and restart**. Tether checks the restrictions before starting; wait for **Sandbox active**.

<details>
<summary>Sandbox scope</summary>

Files inside the workspace can still be changed or deleted. All WebUI connections in that Tether installation share the selected folder. Browser control, desktop control, and direct HTTP access are disabled while sandboxing is active.

Local MCP commands, separately connected terminals, and **Host shell (unrestricted)** are outside this sandbox. A file-browser starting folder alone does not restrict access. See the [sandbox guide](https://github.com/open-webui/tether/blob/main/docs/sandbox.md) for platform and process-lifetime details.

</details>

## Bring Your Own Models and Tools

Use the model running in Ollama or LM Studio from your Open WebUI. Bring an installed MCP server's tools into chat, or connect an internal service through OpenAPI. Add them in **Tether Settings > Integrations**; Tether reaches them from your computer through its existing connection. Local MCP commands need no separate HTTP bridge. See [MCP setup](https://github.com/open-webui/tether/blob/main/docs/mcp.md).

For browser work, Open Terminal can use a separate Chrome profile or, with remote debugging enabled and your approval, your running Chrome session. Desktop control is available on supported systems. Both require workspace sandboxing to be off.

Integration keys stay on the Tether computer. Prompts, file content, and tool results used in chat still pass through Open WebUI and the model services involved.

## Get Started

You need an existing Open WebUI instance and an account.

1. **[Install Tether](https://github.com/open-webui/tether/releases/latest)** on the computer you want to use.
2. **Enter your Open WebUI address** and sign in.
3. **Choose Install and connect** to enable local files and commands. Tether installs Open Terminal for you. Choose **Not now** to use desktop chat without local execution.
4. **Set your access preferences**, then select the computer under **Your devices** in chat. Choose a capable tool-calling model and open your folder in the [file browser](/features/open-terminal/file-browser).

![Tether connection screen with the Open WebUI address and optional connection name](/images/tether-connect.png)

Try this with a few text documents in your workspace:

> Read these files and create summary.md with a short summary of each one. Include the source filenames and leave the originals unchanged.

Open the result, check it, and ask for the next change.

Personal, non-commercial use is free under the [personal-use exception](https://github.com/open-webui/tether/blob/main/LICENSE). Commercial or organizational production use requires an [Open WebUI Enterprise License](/enterprise).

## Requirements and Help {#requirements}

<details>
<summary>Connection requirements and troubleshooting</summary>

Use compatible versions of Tether, Open WebUI, and Open Terminal. The instance needs [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) and, for terminal access, [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers). More than one [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) worker requires [Redis](/reference/env-configuration#redis_url).

If your computer is missing, check that Tether and Open Terminal are running and connected, and that both devices use the same instance and account. If the model does not use it, check its [Terminal capability](/features/workspace/models#capabilities-and-bindings) and [native tool-calling mode](/features/open-terminal/setup/connecting#8-enable-native-function-calling).

For missing models or tools, enable their connections in Tether and confirm the services are reachable from that computer. MCP requires matching relay support and external tools enabled in Open WebUI.

</details>

[GitHub](https://github.com/open-webui/tether) · [Client protocol reference](/reference/tether-client-protocol) · [Report an issue](https://github.com/open-webui/tether/issues)
