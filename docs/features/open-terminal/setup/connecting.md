---
sidebar_position: 2
title: "Connecting to Open WebUI"
---

# Connecting Open Terminal to Open WebUI

Open Terminal is [installed and running](./installation). This guide covers connecting it to Open WebUI.

---

## Recommended: Admin Panel

Recommended for all deployments, including single-user. The Admin Panel keeps the API key server-side.



### 1. Open the Admin Panel

Click your **name** at the bottom of the left sidebar to open the user menu, then click **Admin Panel**.

![User menu showing Admin Panel option](/images/open-terminal-user-menu.png)

### 2. Go to Settings → Integrations

In the Admin Panel, click **Settings** in the top nav, then click **Integrations**.

![Admin Panel — Settings → Integrations](/images/open-terminal-integrations-page.png)

### 3. Find the "Open Terminal" section

Scroll down until you see the **Open Terminal** section.

![The Open Terminal section under Integrations](/images/open-terminal-connected.png)

:::warning Don't confuse it with "Tools"
Open Terminal has its **own section** under Integrations — don't add it under "External Tools" or "Tool Servers". Using the dedicated section gives you the built-in file browser and terminal sidebar.
:::

### 4. Click + and fill in the details

| Field | What to enter |
| :--- | :--- |
| **URL** | `http://localhost:8000` (or `http://open-terminal:8000` if using Docker Compose) |
| **API Key** | The password you chose during installation |
| **Auth Type** | Leave as `Bearer` (the default) |

![Connection form filled in with URL and API key](/images/open-terminal-connection-form.png)

### 5. Save

Click **Save**. A green "Connected" indicator confirms the connection.

![Connected status with green indicator](/images/open-terminal-connected.png)

### 6. (Optional) Restrict access to specific groups

Limit terminal access to specific user groups via the access control button.

{/* TODO: Screenshot — The Access Grants dropdown showing available user groups with checkboxes. */}

### 7. Select a terminal in chat

In the chat input area, click the **terminal button** (cloud icon ☁). Your admin-configured terminals appear under **System**. Select one to activate it for the conversation.

![Terminal dropdown showing Docs Terminal under System](/images/open-terminal-chat-dropdown.png)

The selected terminal name appears next to the cloud icon. The AI can now execute commands, read files, and run code through it.

### 8. Enable native function calling

For the AI to use terminal tools reliably, you need to enable **native function calling** on your model:

1. Go to **Workspace → Models**
2. Click the edit button on the model you're using
3. Under **Capabilities**, enable **Native Function Calling** (also called "tool use")
4. Save

![Model capabilities showing Builtin Tools enabled](/images/open-terminal-model-capabilities.png)

:::warning Without this, tools may not work
Native function calling lets the model invoke tools directly using the provider's built-in tool-calling format. Without it, Open WebUI falls back to prompt-based tool calling, which is less reliable and may not trigger terminal commands at all.
:::

:::tip Performance depends on the model
Not all models are equally capable with tools. Frontier models (GPT-5.4, Claude Sonnet 4.6, Gemini 3.1 Pro) handle multi-step terminal workflows well. Smaller or older models may struggle with complex tasks, fail to invoke tools, or produce malformed tool calls. If results are poor, try a more capable model.
:::

### 9. Try it out

Ask your AI something like:

> "What operating system are you running on?"

The AI should use Open Terminal to run a command and tell you the answer.

![AI using run_command to check the operating system](/images/open-terminal-ai-os-query.png)


:::tip Pre-configure via environment variable
For Docker deployments, you can configure terminal connections automatically using the `TERMINAL_SERVER_CONNECTIONS` environment variable — useful when you want everything set up at startup without manual steps.
:::

---

## Personal Settings (testing only)

:::caution Not recommended for regular use
Adding a terminal connection via personal Settings sends the API key to your browser and routes requests directly from it. This is fine for **quick testing**, but for anything beyond that, use Admin Settings instead — it's more secure and works for all users automatically.
:::

If you need to test a connection without admin access, you can add one from **Settings → Integrations → Open Terminal**. The same URL and API key fields apply.

---

## Troubleshooting

### "Connection failed" or timeout

This almost always means Open WebUI can't reach Open Terminal over the network. What URL to use depends on your setup:

| Your setup | URL to use |
| :--- | :--- |
| Docker Compose (recommended) | `http://open-terminal:8000` |
| Separate Docker containers | `http://host.docker.internal:8000` |
| Both on same machine, no Docker | `http://localhost:8000` |
| Open Terminal on another machine | `http://that-machines-ip:8000` |

{/* TODO: Screenshot — A simple diagram showing Open WebUI and Open Terminal as two boxes, with an arrow between them labeled with the URL. Shows correct URLs for Docker Compose (service name) vs separate containers (host.docker.internal). */}

:::tip Quick check
Run this command to see if Open WebUI can reach Open Terminal:

```bash
docker exec open-webui curl -s http://open-terminal:8000/health
```

If it prints `{"status": "ok"}`, the connection works. If it errors, the containers can't see each other.
:::

### Terminal shows up but AI doesn't use it

Make sure:
- The toggle switch next to the connection is **turned on**
- You've **refreshed the page** after adding the connection
- Your model supports tool calling (most modern models do)

### Wrong API key

If you see "unauthorized" or "invalid key":
- Double-check the key matches what you set during installation
- If you forgot it, run `docker logs open-terminal` and look for the `API key:` line

## Next steps

- **[Code execution](../use-cases/code-execution)**
- **[Document & data analysis](../use-cases/file-analysis)**
- **[Software development](../use-cases/software-development)**
- **[File browser](../file-browser)**
