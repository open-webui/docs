---
title: "Open WebUI Tether"
description: "Put AI to work on your own computer. Connect your files, models, and tools to Open WebUI, choose a workspace sandbox, and keep working from any device."
sidebar_position: 3
---

# Open WebUI Tether

**Put AI to work on the computer you already use.**

Your projects, documents, and tools are already on your computer. Open WebUI Tether connects them to your Open WebUI so you can ask your AI to do something with them: turn a folder of exports into a report, test a change in your project, or organize a collection of files. The results land in your workspace, ready to inspect and use.

At your desk, a shortcut brings AI into whatever you are doing. Away from it, open Open WebUI on your phone and pick up work on the same computer. For a team, Tether brings that connection to the Open WebUI instance you already share, with each person's devices connected to their own account.

**[Download for macOS, Windows, and Linux](https://github.com/open-webui/tether/releases/latest)** · **[Get started](#get-started)** · **[GitHub](https://github.com/open-webui/tether)**

## Start with the Work You Want Done

Ask Tether's connected workspace to compare this week's data with last week's, explain what changed, and save a report. Or point it at a repository and ask it to reproduce a bug, make a change, and run the tests. Through **Open Terminal**, your AI can read files, run commands, create outputs, and check its work. You can follow the activity and inspect the result in Open WebUI's [file browser](/features/open-terminal/file-browser).

This is useful for a personal project and for the recurring work a team does every week. You can start with the files, software, and hardware already in place, then choose the model and tools that suit the task. Supported agents such as Claude Code and Codex can also run in the terminal environment; see [Connect an Agent](/getting-started/quick-start/connect-an-agent).

## Give It Room to Work—and Choose the Boundary

**Tether includes an optional workspace sandbox.** Choose a folder for the task, and operating-system restrictions limit Open Terminal and the commands it starts to that workspace, temporary storage, and required program files. Sandboxed commands run without network access by default; you can enable outbound access when the work needs it.

That gives you a practical way to start: put copies of a few documents or a dataset in a dedicated folder, ask for a useful result, and review what changed. Tether checks that the restrictions work before starting the service. If they cannot be established, Open Terminal stays stopped.

The sandbox runs natively on **macOS and supported Windows devices**, without Docker or a VM. It is **unavailable on Linux**. Enable it in **Tether Settings > Open Terminal > Sandbox**, choose **Restrict file access** and a **Workspace folder**, then **Apply and restart**. Wait for **Sandbox active** before starting work.

<details>
<summary>What the sandbox covers</summary>

Files in the selected workspace can still be changed or deleted. The sandbox is configured per device, and its selected folder is shared across that Tether installation's Open WebUI connections.

Open Terminal's browser control, desktop control, and direct HTTP access are disabled while sandboxing is active. Local MCP commands, separately connected terminals, and **Host shell (unrestricted)** operate outside this sandbox. Choosing a home directory or file-browser starting folder does not restrict access.

See the [sandbox guide](https://github.com/open-webui/tether/blob/main/docs/sandbox.md) for platform support, network behavior, and process-lifetime limits.

</details>

## Use the Models and Tools You Already Have

A model running in Ollama or LM Studio can become available in your Open WebUI through Tether. An installed MCP server can bring its tools into chat. An internal service with an OpenAPI interface can let the AI act on business information through the operations you expose. Add them in **Tether Settings > Integrations**; Tether reaches them from your computer through its existing connection to Open WebUI.

You can also connect an Open Terminal server running in Docker or on another machine. That lets you choose a different environment for a task while keeping the same chat interface. For local MCP commands, Tether handles the connection directly, without a separate HTTP bridge. See [MCP setup](https://github.com/open-webui/tether/blob/main/docs/mcp.md).

For browser work, Open Terminal can use a separate Chrome profile or, with your approval and Chrome remote debugging enabled, a running Chrome instance with its existing sign-ins. Desktop viewing and control are available on supported systems. These capabilities require workspace sandboxing to be off.

Integration keys stay on the Tether computer and use encrypted storage when available; otherwise they last until the app quits. Prompts, file content, and tool results used in a conversation still pass through Open WebUI and the model services involved. Choose the connections appropriate for your work.

## Keep Going, Wherever You Are

Press **Cmd+Shift+I** on macOS or **Ctrl+Shift+I** on Windows and Linux to open **Spotlight** over your current application. Ask a question, capture an error message or chart, or attach a clipboard image and send it to your Open WebUI. Use an image-capable model for screenshots. You can change the shortcut in **Tether Settings > General**.

When you step away, open the same Open WebUI instance on another device, sign in with the same account, and select your computer under **Your devices** in the terminal menu. You can check output, ask for a follow-up, and inspect files in the workspace where the work is happening.

Tether connects outward, so this connection needs no inbound port or router forwarding. Keep the computer awake, online, and running Tether. **Run in background** keeps it connected when you close the app window; quitting or sleeping the computer makes it unavailable. Enable **Browser Notifications** in Open WebUI and allow operating-system notifications to hear when a chat finishes or fails.

## Get Started

You need an existing Open WebUI instance and an account you can sign in to.

1. **Install Tether** on the computer you want to use. Choose the appropriate package from the [releases page](https://github.com/open-webui/tether/releases/latest).
2. **Enter your Open WebUI address** and complete sign-in. You can add further accounts or instances with **Add connection**.
3. **Choose Install and connect** to set up Open Terminal for local files and commands. Tether manages its runtime installation. Choose **Not now** if you only want desktop chat, and enable local access later in **Settings > Open Terminal**.
4. **Choose your access settings**, then select the computer under **Your devices** in an Open WebUI chat. Use a capable tool-calling model and open your workspace in the file browser.

![Tether connection screen with the Open WebUI address and optional connection name](/images/tether-connect.png)

For a first task, place a few text files in your chosen workspace and ask:

> Read these files and create summary.md with a short summary of each one. Include the source filenames and leave the original files unchanged.

Open the result and check it against the originals. For a team evaluating Tether, choose a recurring task and compare the time and effort needed to reach a reviewed result.

## Using Tether with a Team

Tether extends your existing Open WebUI sign-in and supports connections behind Cloudflare Access or gateways using custom headers. It manages the local runtime and offers version and update controls, giving teams a path to desktop adoption without manually building each person's execution environment.

Use Tether when the work belongs on people's existing computers. For centrally provisioned workspaces with policies for software, resources, and lifecycle, use [Terminals](/features/open-terminal/terminals). Both connect to Open WebUI.

Personal, non-commercial use is free under the [personal-use exception](https://github.com/open-webui/tether/blob/main/LICENSE). Commercial or organizational production use requires an **[Open WebUI Enterprise License](/enterprise)**. [Talk to the Open WebUI team](/enterprise) about a business deployment.

## Requirements and Help {#requirements}

<details>
<summary>Instance requirements and common connection problems</summary>

Use compatible versions of Tether, Open WebUI, and Open Terminal. The instance needs [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) and, for terminal access, [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers). Deployments with more than one [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) worker require [Redis](/reference/env-configuration#redis_url).

If your computer is missing from **Your devices**, check that Tether and Open Terminal are running and connected, and that both devices use the same instance and account. If the model does not use the workspace, check its [Terminal capability](/features/workspace/models#capabilities-and-bindings) and [native tool-calling mode](/features/open-terminal/setup/connecting#8-enable-native-function-calling).

For missing models or tools, enable their connections in Tether and confirm the services are reachable from that computer. MCP requires matching relay support and external tools enabled in Open WebUI. If a sandbox cannot start, read its displayed error and check the [sandbox guide](https://github.com/open-webui/tether/blob/main/docs/sandbox.md).

</details>

[Client protocol reference](/reference/tether-client-protocol) · [Report an issue](https://github.com/open-webui/tether/issues)
