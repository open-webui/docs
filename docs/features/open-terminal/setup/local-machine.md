---
sidebar_position: 5
title: "Local Machine"
---

# Add a Local Machine

:::warning Experimental
Local machines are experimental and can change.
:::

Let Open WebUI install and run Open Terminal on the server it runs on, with a name and a click. The AI then works with the files and tools of the user that runs Open WebUI, the same as a [bare metal install](./installation.mdx) on that server.

:::warning Who can use it
Anyone who has access to a local machine can run commands on the Open WebUI server itself, with the same user as the Open WebUI process, and can see every file that user can. Share it only with people you trust that far, and set who gets access in the **Access** section of the machine, as in [Connecting Open Terminal](./connecting.md#6-optional-restrict-access-to-specific-groups).
:::

---

## Requirements

- You are an admin in Open WebUI.
- The Open WebUI server runs Linux (x86_64 or aarch64) or macOS (Apple silicon).
- `curl` and `tar` are installed on the server.
- The server has internet access to download uv, Python 3.12 and Open Terminal.

---

## Add the machine

### 1. Open the Machines section

Go to **Settings > Integrations**, scroll to **Machines** and click **+**, as in [Connecting Open Terminal](./connecting.md).

### 2. Choose the Local type

Click **Remote** next to **Type** and pick **Local**. The name is optional.

Only one local machine can exist per Open WebUI instance, so **Type** is gone once you have added one.

### 3. Choose a folder and a version

**Start directory** is where terminal sessions start. Leave it empty to start in the project folder, which is `/workspace` if that folder exists. Otherwise it is a `workspace` folder in the data volume when Open WebUI runs in Docker, or the folder Open WebUI was started from. To use another folder, enter an absolute path that exists, such as `/home/user/project`.

Leave **Open Terminal version** empty to install the latest release, or enter a version such as `0.17.21` to pin one. `0.17.21` is the oldest version Open WebUI works with.

### 4. Install

Click **Install**. A progress list shows the install. When it reaches **Ready**, the machine appears under **Machines** and works like any other machine.

Open Terminal is installed in `~/.open-webui/` in the home directory of the Open WebUI user. In Docker it is installed in the data volume, so it survives container updates.

---

## Manage the machine

Open the machine from the **Machines** list to change **Start directory** and to upgrade, restart or read the logs, as described in [SSH Machines](./ssh-machines.md#manage-the-machine). Changing **Start directory** restarts Open Terminal in the new directory. **Open Terminal flags** works as on [SSH machines](./ssh-machines.md).

When you delete the machine, Open WebUI uninstalls Open Terminal. Your files in the session folder stay.
