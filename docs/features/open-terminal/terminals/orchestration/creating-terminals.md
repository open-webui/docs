---
sidebar_position: 1
title: "Creating Terminals"
---

# Creating Terminals

A **terminal** is a ready-made workspace the AI can run commands and work with files in. You create it yourself from the chat, give it a name and decide who can use it. Each terminal starts one or more **machines**, the containers where the commands run.

## What You Can Do With It

- **Give a team a shared workspace.** Create one terminal with the tools and files everyone needs and share it with a group.
- **Keep people apart.** Give each user, chat or model its own machine, so files never mix.
- **Start every machine the same way.** Set an image, resources, a start folder and a setup script once.

## When to Use It

Use a terminal when the AI needs a real computer to work on, such as running code, editing files or building a project, and each person or chat needs a clean, separate place for it.

## Who It Is For

Admins add the Terminals server as a connection and give people **Write** access. People with **Write** access create and manage terminals. Everyone else uses the terminals that are shared with them.

## Connection Access

Add the connection in **Settings > Admin > Integrations** as described in [Connecting to Open WebUI](/features/open-terminal/setup/connecting) and the [Authentication](/features/open-terminal/terminals#authentication) section. The connection form has the Name, ID, URL, API Key, Auth, **Verify Connection**, Chat Uploads, **Access** and **Advanced** options. Terminals themselves are created from the chat.

**Access** on the connection has two permissions:

| Permission | What it lets a user do |
| :--- | :--- |
| **Read** | See and use the terminals that are shared with them |
| **Write** | Create and manage terminals on this server, and see every terminal on it |

## Create a Terminal

1. Open the terminal menu in the message input (the cloud icon).
2. Under **Terminals**, click **New terminal**.
3. Fill in the dialog and click **Create**.

| Field | What it does |
| :--- | :--- |
| **Name** | The name shown in the terminal menu |
| **Server** | The Terminals connection that runs the terminal. Shown only when you create a terminal and more than one Terminals connection is available |
| **Separate machine per** | **None**, **User**, **Chat** or **Model**. Decides what gets its own machine, see [Machine Scope](#machine-scope). Locked while machines exist. Delete all machines to change it |
| **Start directory** | Under **Advanced**. Folder where commands start. It must be inside the home folder, otherwise commands start in the home folder. Stored as `OPEN_TERMINAL_START_DIR` |
| **Setup script** | Under **Advanced**. Shell script that runs in the start directory every time a machine starts, before it is ready. Only the home folder is kept between restarts, so write the script to be safe to run again. Stored as `OPEN_TERMINAL_SETUP_SCRIPT`. Progress and failures, with the exit code and the end of the log, show in **System info** |
| **Advanced** | **Start directory**, **Setup script**, **Image**, **CPU**, **Memory**, **Storage**, **Network** and **Environment variables**. Empty fields use the server default. Values are checked against the server maximums |

A new terminal is private. After creating it, open **Terminal settings** from the terminal menu and click the **Private** button at the top of the dialog to open **Access**, where you can share the terminal with chosen users and groups. Shared access is for use only.

See [Environment Variables](/features/open-terminal/terminals/orchestration/environment-variables) for raw values and reserved keys and [Custom Images](/features/open-terminal/terminals/orchestration/custom-images) for the **Image** field.

People with access to a terminal can run commands in it. With **None** or **Model** machine scope they all work on the same machine and see its files, so share such a terminal only with people who may see those files.

## Machine Scope

| Separate machine per | Result |
| :--- | :--- |
| **None** | One machine for everyone who uses the terminal |
| **User** | Each user has their own machine |
| **Chat** | Each saved chat has its own machine, with its own files |
| **Model** | Each model has its own machine |

- A **Chat** terminal needs a saved chat. It works in a saved chat, after the first message is sent.
- A **Model** terminal needs access to the model.
- People who can reply in a chat shared with **Allow replies** use that chat's own terminal.
- Automations that post to a channel cannot use **Chat** terminals.

**Chat** and **User** multiply the number of running machines. Ask an admin to set an idle timeout so machines of abandoned chats are cleaned up, see [Idle Cleanup, Lifetime and Scheduled Resets](/features/open-terminal/terminals/orchestration#idle-cleanup-lifetime-and-scheduled-resets).

## Manage Machines

The **Machines** list in the dialog shows every machine of the terminal. A running machine has **System info**, **View files**, **Restart** and **Stop**. A stopped machine has **Start**. Every machine has **Delete machine**. **Delete terminal** removes the terminal and its machines and files.

## Terminal Menu

Each terminal in the menu has a **More** menu with **Restart** and **Stop** while the machine runs or **Start** while it is stopped. While the machine runs it also lists **System info** and **View files**. **Terminal settings** is always there. **View files** opens the [file browser](/features/open-terminal/file-browser) for that terminal without selecting it for the chat. **System info** shows CPU, memory, disk and network use, uptime and top processes, and refreshes every 5 seconds while open.

## Chats

Each chat saves its terminal and working folder and restores them when it is reopened. A chat saved without a terminal opens without one.
