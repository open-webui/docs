## Using Docker with WSL (Windows Subsystem for Linux)

This guide provides instructions for setting up Docker and running Open WebUI in a Windows Subsystem for Linux (WSL) environment.

### Step 1: Install WSL

If you haven't already, install WSL by following the official Microsoft documentation:

[Install WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

### Step 2: Install Docker Desktop

Docker Desktop is the easiest way to get Docker running in a WSL environment. It handles the integration between Windows and WSL automatically.

1.  **Download Docker Desktop:**
    [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2.  **Install Docker Desktop:**
    Follow the installation instructions, making sure to select the "WSL 2" backend during the setup process.

### Step 3: Configure Docker Desktop for WSL

1.  **Open Docker Desktop:**
    Start the Docker Desktop application.

2.  **Enable WSL Integration:**
    - Go to **Settings > Resources > WSL Integration**.
    - Make sure the "Enable integration with my default WSL distro" checkbox is selected.
    - If you are using a non-default WSL distribution, select it from the list.

### Step 4: Run Open WebUI

Now you can run Open WebUI by following the standard Docker instructions from within your WSL terminal.

```bash
docker pull ghcr.io/open-webui/open-webui:main
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

### Important Notes

- **Run Docker Commands in WSL:**
  Always run `docker` commands from your WSL terminal, not from PowerShell or Command Prompt.

- **File System Access:**
  When using volume mounts (`-v`), make sure the paths are accessible from your WSL distribution.
