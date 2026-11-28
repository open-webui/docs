---
sidebar_position: 1
title: "Creating Machines"
---

# Creating Machines

A **machine** is a ready-made workspace the AI can run commands and work with files in. You create it yourself from the chat, give it a name and decide who can use it. Each machine starts one or more **instances**, the containers where the commands run.

Use a machine when the AI needs a real computer to work on, such as running code, editing files or building a project, and each person or chat needs a clean, separate place for it. One machine can serve a whole team through a shared group, or give each user, chat or model its own instance so files never mix. Set an image, resources, a start directory and a setup script once and every instance starts the same way.

Admins add the Terminals server as a connection and give people **Write** access. People with **Write** access create and manage machines. Everyone else uses the machines that are shared with them.

## Connection Access

Add the connection in **Settings > Integrations** (admin section) as described in [Connecting to Open WebUI](/features/open-terminal/setup/connecting) and the [Authentication](/features/open-terminal/terminals#authentication) section. The connection form has the Name, ID, URL, API Key, Auth, **Verify Connection**, Chat Uploads, **Access** and **Advanced** options. Machines themselves are created from the chat or, by an admin, with the **+** on the connection's row in that list (see [Create a Machine](#create-a-machine)).

**Access** on the connection has two permissions:

| Permission | What it lets a user do |
| :--- | :--- |
| **Read** | See and use the machines that are shared with them |
| **Write** | Create and manage machines on this server, and see every machine on it |

## Create a Machine

1. Open the machine menu in the message input (the cloud icon). With **Write** access it shows even before you have a machine.
2. Under **Machines**, click **New machine**.
3. Fill in the dialog and click **Create**.

Admins can also do this in **Settings > Integrations** (admin section). The **+** next to a Terminals connection opens the same dialog, and the connection lists its machines below it, each with a gear for its settings. This suits machines you set up for others, such as one you then make public.

| Field | What it does |
| :--- | :--- |
| **Name** | The name shown in the machine menu |
| **Server** | The Terminals connection that runs the machine. Shown only when you create a machine and more than one Terminals connection is available |
| **Separate instances** | A switch. When on, a dropdown next to it picks **User**, **Chat** or **Model** and starts on **User**. When off, everyone with access shares one instance. See [Machine Scope](#machine-scope). Locked while instances exist, so delete all instances to change it |
| **Start directory** | Under **Advanced**. Folder where commands start. It must be inside the home folder, otherwise commands start in the home folder. Stored as `OPEN_TERMINAL_START_DIR` |
| **Setup script** | Under **Advanced**. Shell script that runs in the start directory every time an instance starts, before it is ready. Only the home folder is kept between restarts, so write the script to be safe to run again. Stored as `OPEN_TERMINAL_SETUP_SCRIPT`. Progress and failures, with the exit code and the end of the log, show in **System info** |
| **Advanced** | **Start directory**, **Setup script**, **Image**, **CPU**, **Memory**, **Storage**, **Network** and **Environment variables**. Empty fields use the server default. Values are checked against the server maximums |

A new machine is private. After creating it, open **Machine settings** from the machine menu and click the **Private** button at the top of the dialog to open **Access**, where you can share the machine with chosen users and groups. An admin can also make it public, which shares it with every user. Shared access is for use only.

:::warning Write access reaches other people's instances
A person with **Write** access to a Terminals connection can open **System info** and the files of any running instance on it, with full access to those files. Give **Write** only to people you trust with everyone's workspaces.
:::

See [Environment Variables](/features/open-terminal/terminals/orchestration/environment-variables) for raw values and reserved keys and [Custom Images](/features/open-terminal/terminals/orchestration/custom-images) for the **Image** field.

People with access to a machine can run commands in it. With **Separate instances** off, everyone with access shares one instance, and with **Model** everyone using the same model shares one. They see that instance's files, so share such a machine only with people who may see those files.

## Machine Scope

| Separate instances | Result |
| :--- | :--- |
| Off | One instance for everyone who uses the machine |
| On, **User** | Each user has their own instance |
| On, **Chat** | Each saved chat has its own instance, with its own files |
| On, **Model** | Each model has its own instance |

- A **Chat** machine needs a saved chat. It works in a saved chat, after the first message is sent.
- A **Model** machine needs access to the model.
- People who can reply in a chat shared with **Allow replies** use that chat's own machine.
- Automations that post to a channel cannot use **Chat** machines.

**Chat** and **User** multiply the number of running instances. Ask an admin to set an idle timeout so instances of abandoned chats are cleaned up, see [Idle Cleanup, Lifetime and Scheduled Resets](/features/open-terminal/terminals/orchestration#idle-cleanup-lifetime-and-scheduled-resets).

## Manage Machines

The **Instances** list in the dialog shows every instance of the machine with its name and whether it is running or stopped. Open the **More options** menu of a row to act on it. A running instance offers **Restart** and **Stop**, plus **System info** and **View files**. A stopped one offers **Start**. Every instance offers **Delete instance**. While an action runs, the row shows what is happening (**Restarting...**, **Stopping...**, **Starting...** or **Deleting...**) with a spinner. **Delete machine** removes the machine and its instances and files.

## Machine Menu

Each machine in the menu has a **More** menu with **Restart** and **Stop** while the instance runs or **Start** while it is stopped. While the instance runs it also lists **System info**, **View files** and **Sessions**. **Machine settings** is there too, except while a reply is generating. During a reply the menu still opens, but you cannot pick another machine and the **More** menu lists only **System info**, **View files** and **Sessions**. **Sessions** lists the shells and commands you have running on the machine, see [Select a machine in chat](/features/open-terminal/setup/connecting#7-select-a-machine-in-chat). **View files** opens the [file browser](/features/open-terminal/file-browser) for that machine without selecting it for the chat. **System info** shows CPU, memory, disk and network use, uptime and top processes, and refreshes every 5 seconds while open.

## Chats

Each chat saves its machine and working folder and restores them when it is reopened. A chat saved without a machine opens without one.
