---
sidebar_position: 4
title: "SSH Machines"
---

# Add a Machine over SSH

Use your own server, a spare computer or a laptop as an Open Terminal machine without running Docker and without opening a port. Give Open WebUI an SSH address, and it installs Open Terminal on that machine, starts it and reaches it through SSH.

The AI then works with the files and tools of the SSH user on that machine, the same as a [bare metal install](./installation.mdx).

---

## Requirements

- The Open WebUI server can reach the machine over SSH.
- The machine runs Linux (x86_64 or aarch64) or macOS (Apple silicon).
- `curl` and `tar` are installed on the machine.
- The machine has internet access to download uv, Python 3.12 and Open Terminal.
- You are an admin in Open WebUI.

---

## Add the machine

### 1. Open the Machines section

Go to **Settings > Integrations**, scroll to **Machines** and click **+**, as in [Connecting Open Terminal](./connecting.md).

### 2. Enter the address

Type the machine into the URL field as `ssh://user@host` or `ssh://user@host:port` (the port defaults to 22). Give the machine a **Name** (required). The form then asks how Open WebUI should sign in.

### 3. Choose how to sign in

Open WebUI creates its own SSH key for the machine and needs it added to `~/.ssh/authorized_keys` of that user. Pick one way to get it there under **Sign in with**.

| Option | What happens |
| :--- | :--- |
| **Password** | Enter the SSH password of the user. Open WebUI logs in once, adds its key and forgets the password. |
| **Private key** | Paste or upload a private key the machine already accepts, with its passphrase if it has one. Open WebUI uses it once to add its key, then discards it. |
| **Add key myself** | Open WebUI shows a command. Run it on the machine as that user, then click **Continue**. |

### 4. Choose an Open Terminal version

Leave **Open Terminal version** empty to install the latest release, or enter a version such as `0.17.21` to pin one. `0.17.21` is the oldest version Open WebUI works with.

Leave **Packages** empty, or list what to add on the machine, such as `desktop browser ffmpeg`. `desktop` adds a desktop and `browser` adds Chrome, which give you the [Desktop and Browser tabs](../use-cases/web-development.md). Any other name is installed as an apt package. This needs a user that can run `sudo` without a password.

### 5. Check the fingerprint and install

Click **Install**. Open WebUI shows the host key fingerprint of the machine. Compare it with the fingerprint you expect, then click **Trust and install**. Open WebUI remembers this fingerprint and refuses to connect if it ever changes.

A progress list shows the install. When it reaches **Ready**, the machine appears under **Machines** and works like any other machine. Open Terminal lives in `~/.open-webui/` in the home directory of the SSH user. If a package fails to install, the machine still works and shows a warning with the command to run on the machine yourself.

:::warning Who can use it
Everyone who has access to the machine can run commands and see every file the SSH user can. Use a dedicated user for machines you share, and set who gets access in the **Access** section of the machine, as in [Connecting Open Terminal](./connecting.md#6-optional-restrict-access-to-specific-groups).
:::

---

## Manage the machine

Open the machine from the **Machines** list to see its Open Terminal version and these buttons.

| Button | What it does |
| :--- | :--- |
| **Upgrade** | Installs the version in the version field. Empty means the newest release. Also repairs a broken install. Installs the names in **Packages** too. |
| **Install** (next to **Packages**) | Installs the names in **Packages** on the machine without upgrading. |
| **Restart** | Restarts Open Terminal on the machine. |
| **Logs** | Shows the latest lines of the Open Terminal log. Start here when a machine shows an error. |

**Start directory** is where terminal sessions start, the home folder of the SSH user when empty. To start somewhere else, enter an absolute path that exists on the machine, such as `/home/user/project`, when you add the machine or later by editing it. Changing it restarts Open Terminal in the new directory.

To remove the machine, delete it and confirm. Open WebUI uninstalls Open Terminal from the machine and forgets its own key. If the machine cannot be reached, Open WebUI offers to remove it from Open WebUI anyway, and the files under `~/.open-webui/` stay on the machine until you delete them yourself.

Open WebUI's key always stays in `~/.ssh/authorized_keys` on the machine. Its line ends with `open-webui-` plus the machine ID. Delete that line to revoke the key.
