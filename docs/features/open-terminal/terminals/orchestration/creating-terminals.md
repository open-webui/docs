---
sidebar_position: 1
title: "Creating Terminals"
---

# Creating Terminals

A **terminal** is a ready-made workspace the AI can run commands and work with files in. You create it yourself from the chat, give it a name and decide who can use it. Each terminal starts one or more **instances**, the containers where the commands run.

Use a terminal when the AI needs a real computer to work on, such as running code, editing files or building a project, and each person or chat needs a clean, separate place for it. One terminal can serve a whole team through a shared group, or give each user, chat or model its own instance so files never mix. Set an image, resources, a start directory and a setup script once and every instance starts the same way.

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
| **Separate instances** | A switch. When on, a dropdown next to it picks **User**, **Chat** or **Model** and starts on **User**. When off, everyone with access shares one instance. See [Machine Scope](#machine-scope). Locked while instances exist, so delete all instances to change it |
| **Start directory** | Under **Advanced**. Folder where commands start. It must be inside the home folder, otherwise commands start in the home folder. Stored as `OPEN_TERMINAL_START_DIR` |
| **Setup script** | Under **Advanced**. Shell script that runs in the start directory every time an instance starts, before it is ready. Only the home folder is kept between restarts, so write the script to be safe to run again. Stored as `OPEN_TERMINAL_SETUP_SCRIPT`. Progress and failures, with the exit code and the end of the log, show in **System info** |
| **Advanced** | **Start directory**, **Setup script**, **Image**, **CPU**, **Memory**, **Storage**, **Network** and **Environment variables**. Empty fields use the server default. Values are checked against the server maximums |

A new terminal is private. After creating it, open **Terminal settings** from the terminal menu and click the **Private** button at the top of the dialog to open **Access**, where you can share the terminal with chosen users and groups. Shared access is for use only.

See [Environment Variables](/features/open-terminal/terminals/orchestration/environment-variables) for raw values and reserved keys and [Custom Images](/features/open-terminal/terminals/orchestration/custom-images) for the **Image** field.

People with access to a terminal can run commands in it. With **Separate instances** off, everyone with access shares one instance, and with **Model** everyone using the same model shares one. They see that instance's files, so share such a terminal only with people who may see those files.

## Machine Scope

| Separate instances | Result |
| :--- | :--- |
| Off | One instance for everyone who uses the terminal |
| On, **User** | Each user has their own instance |
| On, **Chat** | Each saved chat has its own instance, with its own files |
| On, **Model** | Each model has its own instance |

- A **Chat** terminal needs a saved chat. It works in a saved chat, after the first message is sent.
- A **Model** terminal needs access to the model.
- People who can reply in a chat shared with **Allow replies** use that chat's own terminal.
- Automations that post to a channel cannot use **Chat** terminals.

**Chat** and **User** multiply the number of running instances. Ask an admin to set an idle timeout so instances of abandoned chats are cleaned up, see [Idle Cleanup, Lifetime and Scheduled Resets](/features/open-terminal/terminals/orchestration#idle-cleanup-lifetime-and-scheduled-resets).

## Manage Machines

The **Instances** list in the dialog shows every instance of the terminal with its name and whether it is running or stopped. Open the **More options** menu of a row to act on it. A running instance offers **Restart** and **Stop**, plus **System info** and **View files** unless it belongs to another user. A stopped one offers **Start**. Every instance offers **Delete instance**. While an action runs, the row shows what is happening (**Restarting...**, **Stopping...**, **Starting...** or **Deleting...**) with a spinner. **Delete terminal** removes the terminal and its instances and files.

## Terminal Menu

Each terminal in the menu has a **More** menu with **Restart** and **Stop** while the instance runs or **Start** while it is stopped. While the instance runs it also lists **System info** and **View files**. **Terminal settings** is always there. **View files** opens the [file browser](/features/open-terminal/file-browser) for that terminal without selecting it for the chat. **System info** shows CPU, memory, disk and network use, uptime and top processes, and refreshes every 5 seconds while open.

## Chats

Each chat saves its terminal and working folder and restores them when it is reopened. A chat saved without a terminal opens without one.
