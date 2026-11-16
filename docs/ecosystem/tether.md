---
title: "Open WebUI Tether"
description: "Use Open WebUI from your desktop and connect your own computer's files, commands, and tools to chats on any device."
sidebar_position: 3
---

# Open WebUI Tether

**Your Open WebUI, connected to the computer where your work lives.**

Tether is the desktop app for Open WebUI on macOS, Windows, and Linux. Bring up a prompt with a keyboard shortcut, attach a screenshot, and get back to what you were doing. When you enable local access, you can also open Open WebUI on your phone or another computer and ask your AI to work with files and run commands on the connected machine.

That means you can check a project, process a folder of documents, or run tests in the workspace you already use. Tether connects outward to your Open WebUI instance, so you do not need to open an inbound port on your computer or configure your router.

**[Download Tether](https://github.com/open-webui/tether/releases/latest)** · **[View on GitHub](https://github.com/open-webui/tether)**

## Get Connected

You need an existing Open WebUI instance and an account you can sign in to. Install Tether on the computer whose files and tools you want to use.

### 1. Install the desktop app

Choose a download from the [latest release](https://github.com/open-webui/tether/releases/latest):

| Your computer | Download |
| :--- | :--- |
| **macOS** | `.dmg` for Apple Silicon or Intel |
| **Windows** | Setup `.exe` for x64 or ARM64 |
| **Debian, Ubuntu, or Mint** | `.deb` for AMD64 or ARM64 |
| **Other Linux distributions** | AppImage; Snap and Flatpak packages are also available |

### 2. Sign in to Open WebUI

Open Tether and enter the address you normally use for Open WebUI, such as `https://chat.example.com`. Complete sign-in in the browser with the account you want to use, then return to Tether.

![Tether's connection screen, with fields for the Open WebUI address and an optional connection name](/images/tether-connect.png)

You can now use Open WebUI in the desktop app. To connect another instance or account, choose **Add connection**.

### 3. Choose whether to enable local access

Tether offers to install **Open Terminal**, the service that lets your AI read and write files and run commands on this computer. Choose **Install and connect** to enable it, or **Not now** to keep using the desktop chat app without that local service. You can install it later in **Tether Settings > Open Terminal**.

The three pieces work together:

| Component | What it does |
| :--- | :--- |
| **Open WebUI** | Your chat interface, models, and tools |
| **Tether** | The desktop app connecting this computer to your account |
| **Open Terminal** | The local environment where file operations and commands run |

When local setup is ready, Tether shows **Connected to WebUI**. Tether manages this connection for you. A [standalone Open Terminal installation](/features/open-terminal/setup/installation) is useful when you want to manage a separate server or container workspace instead.

### Choose the workspace you share

Local access lets the AI change files and run commands with the terminal user's permissions. Connect to an Open WebUI instance you trust. Files and command results used in a chat can be sent to Open WebUI and the model handling that chat.

On **macOS and supported Windows devices**, you can restrict Open Terminal to a folder:

1. Open **Tether Settings > Open Terminal > Sandbox**.
2. Turn on **Restrict file access** and choose a **Workspace folder**.
3. Select **Apply and restart**, then wait for **Sandbox active**.

Files inside that folder can still be changed or deleted. Sandboxed commands run offline unless you enable **Network access**; browser and desktop control are disabled while sandboxing is active. Workspace sandboxing is unavailable on Linux. See the [sandbox guide](https://github.com/open-webui/tether/blob/main/docs/sandbox.md) for platform support and limitations.

The **Home directory** and **File browser starts at** settings choose where work begins; they do not restrict access. Use **Sandbox** when you want a file-access boundary.

## Try It from Another Device

Keep Tether running and the computer awake and online. Your other device must be able to reach the same Open WebUI instance.

1. Open Open WebUI on your phone, tablet, or another computer and sign in with the **same account**.
2. Start a chat, click the **terminal button** (cloud icon), and select your computer under **Your devices**. You can give it a recognizable name in **Tether Settings > General > Device name**.
3. Choose a model that works well with [native tool calling](/features/open-terminal/setup/connecting#8-enable-native-function-calling). Open the [file browser](/features/open-terminal/file-browser) and navigate to a folder containing a few text documents you want to work with.
4. Ask:

> Read the text documents in this folder and create summary.md with a short summary of each one. Leave the original files unchanged.

Watch the tool activity in chat, then open `summary.md` in the file browser to inspect the result. The file is created on the connected computer. You can continue working with it when you return to that machine.

For a software project, try asking the AI to run the existing tests and explain any failures. For data work, ask it to inspect a CSV and create a chart. See [Open Terminal use cases](/features/open-terminal#use-cases) for more examples.

If you use a coding agent such as Claude Code or Codex, install and sign in to its CLI in the terminal environment. Supported agents can then appear in the model picker when that terminal is selected; see [Connect an Agent](/getting-started/quick-start/connect-an-agent).

## Use It at Your Desk

### Ask about what is on your screen

Press **Cmd+Shift+I** on macOS or **Ctrl+Shift+I** on Windows and Linux to open **Spotlight**, Tether's small prompt window. Type a question, capture a screen region, or attach an image from your clipboard, then send it to your chosen Open WebUI connection.

For example, capture an error message and ask what it means, or share a chart and ask for an explanation. Use a model that supports images when sending a screenshot.

Set your own shortcut under **Tether Settings > General > Open Spotlight shortcut**. The separate **Open Open WebUI Tether shortcut** brings the main app forward; its default is **Cmd/Ctrl+Shift+T**.

### Get notified when work finishes

In **Open WebUI Settings > Notifications**, enable **Browser Notifications**, and allow Tether notifications in your operating system. Tether can notify you when a chat finishes or fails, as well as deliver calendar alerts and channel notifications. Keep the app running to receive them.

## Bring Your Local Models and Tools

Tether can also make services reachable from your computer available to your signed-in Open WebUI connections. Configure these in **Tether Settings > Integrations**:

| Integration | What you can connect |
| :--- | :--- |
| **Models** | OpenAI-compatible model servers, such as Ollama or LM Studio |
| **Tools** | OpenAPI tool servers and MCP servers |
| **Terminals** | Other Open Terminal servers, such as one running in Docker or on another machine |

For an MCP server, choose **MCP** under **Tools**, configure either **Local command (stdio)** or **Streamable HTTP**, then save and enable it. Select the server from the tools menu in Open WebUI. See the [MCP setup guide](https://github.com/open-webui/tether/blob/main/docs/mcp.md) for examples and version requirements.

Local MCP commands run with your account's permissions. Open Terminal's workspace sandbox does not apply to them.

## Keep Your Computer Available

In **Tether Settings > General**, enable **Run in background** to keep Tether connected when you close its window. Enable **Launch at login** if you want it to start when you sign in to your computer.

Closing the window with background operation enabled leaves Tether running. **Quitting Tether**, putting the computer to sleep, or losing its network connection makes that computer unavailable through Tether. Remote access requires the computer to remain awake and connected.

To disconnect an account, remove its connection and choose **Remove and sign out**. To remove the local execution service, use **Tether Settings > Open Terminal > Uninstall**. Uninstalling Open Terminal keeps your files and saved WebUI connections.

## Troubleshooting

| What you see | What to check |
| :--- | :--- |
| **Sign-in does not complete** | Open the instance address in your browser and confirm you can sign in. Enter the final address after any redirects, including `https://` when required. |
| **Running locally · Not connected to WebUI** | Open Terminal is running, but Tether has not connected it to your instance. Check the connection in Tether and sign in if requested. |
| **Your computer is missing from Your devices** | Check that Tether is running, Open Terminal is installed and connected, and both devices use the same Open WebUI instance and account. If no terminals are available, the cloud button may be absent. |
| **The model answers without using the computer** | Confirm you selected the terminal, check the model's [Terminal capability](/features/workspace/models#capabilities-and-bindings), and use a model with capable native tool calling. Ask for a specific file or command operation. |
| **A sandboxed task cannot reach the internet** | Enable **Network access** in the sandbox settings if the task needs it, then apply and restart. |
| **Screen capture fails** | Check your operating system's screen-capture permissions for Tether. On macOS, allow screen recording access. |
| **Notifications do not arrive** | Check Open WebUI's Browser Notifications setting, the operating system's notification permissions, and that Tether is still running. |

If the app is connected but the instance will not offer Tether devices, ask its administrator to check the requirements below.

## Instance Requirements {#requirements}

<details>
<summary>For Open WebUI administrators</summary>

Use compatible versions of Open WebUI and Tether, including support for the integrations you enable. On the Open WebUI instance:

- [`ENABLE_WEBSOCKET_SUPPORT`](/reference/env-configuration#enable_websocket_support) must be enabled.
- Local terminal access requires [`ENABLE_TOOL_SERVERS`](/reference/env-configuration#enable_tool_servers).
- Deployments with more than one [`UVICORN_WORKERS`](/reference/env-configuration#uvicorn_workers) worker require [Redis](/reference/env-configuration#redis_url) for Tether connections.
- The Tether computer must be able to reach the instance. The connection is initiated from that computer.

Devices are associated with the signed-in account. A user's Tether terminal is offered to that user, rather than added as a shared system terminal.

</details>

For native-client authentication and connection details, see [Tether Client Protocol](/reference/tether-client-protocol).

## License and Support

Tether is free for personal, non-commercial use. Commercial or organizational production use requires an [Open WebUI Enterprise License](/enterprise).

Report app issues in the [Tether repository](https://github.com/open-webui/tether/issues). Include your operating system, Tether version, Open WebUI version, and the status or error you see.
