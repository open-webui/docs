---
sidebar_position: 2
title: "🚀 Getting Started"
---

## How to Install 🚀

:::info **Important Note on User Roles and Privacy**

- **Admin Creation:** The very first account to sign up on Open WebUI will be granted **Administrator privileges**. This account will have comprehensive control over the platform, including user management and system settings.

- **User Registrations:** All subsequent users signing up will initially have their accounts set to **Pending** status by default. These accounts will require approval from the Administrator to gain access to the platform functionalities.

- **Privacy and Data Security:** We prioritize your privacy and data security above all. Please be reassured that all data entered into Open WebUI is stored locally on your device. Our system is designed to be privacy-first, ensuring that no external requests are made, and your data does not leave your local environment. We are committed to maintaining the highest standards of data privacy and security, ensuring that your information remains confidential and under your control.

:::

<details>
<summary>Before You Begin</summary>
### Installing Docker

#### For Windows and Mac Users:

- Download Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).
- Follow the installation instructions provided on the website. After installation, open Docker Desktop to ensure it's running properly.

#### For Ubuntu Users:

1. **Open your terminal.**

2. **Set up Docker's apt repository:**

   - Update your package index:
     ```bash
     sudo apt-get update
     ```
   - Install packages to allow apt to use a repository over HTTPS:
     ```bash
     sudo apt-get install ca-certificates curl
     ```
   - Create a directory for the Docker apt keyring:
     ```bash
     sudo install -m 0755 -d /etc/apt/keyrings
     ```
   - Add Docker's official GPG key:
     ```bash
     sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
     sudo chmod a+r /etc/apt/keyrings/docker.asc
     ```
   - Add the Docker repository to Apt sources:
     ```bash
     echo \
       "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
       $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
       sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
     ```
     Note: If you're using an Ubuntu derivative distro, such as Linux Mint, you might need to use `UBUNTU_CODENAME` instead of `VERSION_CODENAME`.

3. **Install Docker Engine:**

   - Update your package index again:
     ```bash
     sudo apt-get update
     ```
   - Install Docker Engine, CLI, and containerd:
     ```bash
     sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
     ```

4. **Verify the Docker installation:**
   - Use the following command to run a test image:
     ```bash
     sudo docker run hello-world
     ```
     This command downloads a test image and runs it in a container. If successful, it prints an informational message confirming that Docker is installed and working correctly.

#### Other Linux Distributions:

- For other Linux distributions, please refer to the [official Docker documentation](https://docs.docker.com/engine/install/) for installation instructions specific to your distro.

### Ensure You Have the Latest Version of Ollama:

- Download the latest version from [https://ollama.com/](https://ollama.com/).

### Verify Ollama Installation:

- After installing Ollama, verify its functionality by accessing [http://127.0.0.1:11434/](http://127.0.0.1:11434/) in your web browser. Note that the port number might be different based on your installation.

</details>

## Quick Start with Docker 🐳

:::info
When using Docker to install Open WebUI, make sure to include the `-v open-webui:/app/backend/data` in your Docker command. This step is crucial as it ensures your database is properly mounted and prevents any loss of data.
:::

- **If Ollama is on your computer**, use this command:

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **If Ollama is on a Different Server**, use this command:

  To connect to Ollama on another server, change the `OLLAMA_BASE_URL` to the server's URL:

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **To run Open WebUI with Nvidia GPU support**, use this command:

  ```bash
  docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
  ```

### Installing Ollama

- **With GPU Support**, Use this command:

  ```bash
  docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
  ```

- **For CPU Only**, Use this command:

  ```bash
  docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
  ```

After installation, you can access Open WebUI at [http://localhost:3000](http://localhost:3000). Enjoy! 😄

### Open WebUI: Server Connection Error

Encountering connection issues between the Open WebUI Docker container and the Ollama server? This problem often arises because distro-packaged versions of Docker—like those from the Ubuntu repository—do not support the `host.docker.internal` alias for reaching the host directly. Inside a container, referring to `localhost` or `127.0.0.1` typically points back to the container itself, not the host machine.

To address this, we recommend using the `--network=host` flag in your Docker command. This flag allows the container to use the host's networking stack, effectively making `localhost` or `127.0.0.1` in the container refer to the host machine. As a result, the WebUI can successfully connect to the Ollama server at `127.0.0.1:11434`. Please note, with `--network=host`, the container's port configuration aligns directly with the host, changing the access link to `http://localhost:8080`.

**Here's how you can modify your Docker command**:

```bash
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

For more details on networking in Docker and addressing common connectivity issues, visit our [FAQ page](/faq/). This page provides additional context and solutions for frequently encountered problems, ensuring a smoother operation of Open WebUI in various environments.

## One-line Command to Install Ollama and Open WebUI Together

#### Using Docker Compose

- If you don't have Ollama yet, use Docker Compose for easy installation. Run this command:

  ```bash
  docker compose up -d --build
  ```

- **For Nvidia GPU Support:** Use an additional Docker Compose file:

  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.gpu.yaml up -d --build
  ```

- **For AMD GPU Support:** Some AMD GPUs require setting an environment variable for proper functionality:

  ```bash
  HSA_OVERRIDE_GFX_VERSION=11.0.0 docker compose -f docker-compose.yaml -f docker-compose.amdgpu.yaml up -d --build
  ```

  <details>
  <summary>AMD GPU Support with HSA_OVERRIDE_GFX_VERSION</summary>

  For AMD GPU users encountering compatibility issues, setting the `HSA_OVERRIDE_GFX_VERSION` environment variable is crucial. This variable instructs the ROCm platform to emulate a specific GPU architecture, ensuring compatibility with various AMD GPUs not officially supported. Depending on your GPU model, adjust the `HSA_OVERRIDE_GFX_VERSION` as follows:

  - **For RDNA1 & RDNA2 GPUs** (e.g., RX 6700, RX 680M): Use `HSA_OVERRIDE_GFX_VERSION=10.3.0`.
  - **For RDNA3 GPUs**: Set `HSA_OVERRIDE_GFX_VERSION=11.0.0`.
  - **For older GCN (Graphics Core Next) GPUs**: The version to use varies. GCN 4th gen and earlier might require different settings, such as `ROC_ENABLE_PRE_VEGA=1` for GCN4, or `HSA_OVERRIDE_GFX_VERSION=9.0.0` for Vega (GCN5.0) emulation.

  Ensure to replace `<version>` with the appropriate version number based on your GPU model and the guidelines above. For a detailed list of compatible versions and more in-depth instructions, refer to the [ROCm documentation](https://rocm.docs.amd.com) and the [openSUSE Wiki on AMD GPGPU](https://en.opensuse.org/SDB:AMD_GPGPU).

  Example command for RDNA1 & RDNA2 GPUs:

  ```bash
  HSA_OVERRIDE_GFX_VERSION=10.3.0 docker compose -f docker-compose.yaml -f docker-compose.amdgpu.yaml up -d --build
  ```

  </details>

- **To Expose Ollama API:** Use another Docker Compose file:

  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.api.yaml up -d --build
  ```

#### Using `run-compose.sh` Script (Linux or Docker-Enabled WSL2 on Windows)

- Give execute permission to the script:

  ```bash
  chmod +x run-compose.sh
  ```

- For CPU-only container:

  ```bash
  ./run-compose.sh
  ```

- For GPU support (read the note about GPU compatibility):

  ```bash
  ./run-compose.sh --enable-gpu
  ```

- To build the latest local version, add `--build`:

  ```bash
  ./run-compose.sh --enable-gpu --build
  ```

## Installing with Podman

<details>
<summary>Rootless (Podman) local-only Open WebUI with Systemd service and auto-update</summary>

:::note
Consult the Docker documentation because much of the configuration and syntax is interchangeable with [Podman](https://github.com/containers/podman). See also [rootless_tutorial](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md). This example requires the [slirp4netns](https://github.com/rootless-containers/slirp4netns) network backend to facilitate server listen and Ollama communication over localhost only.
:::

:::warning
Rootless container execution with Podman (and Docker/ContainerD) does **not** support [AppArmor confinment](https://github.com/containers/podman/pull/19303). This may increase the attack vector due to [requirement of user namespace](https://rootlesscontaine.rs/caveats). Caution should be exercised and judement (in contrast to the root daemon) rendered based on threat model.
:::

1. Pull the latest image:
   ```bash
   podman pull ghcr.io/open-webui/open-webui:main
   ```
2. Create a new container using desired configuration:

   :::note
   `-p 127.0.0.1:3000:8080` ensures that we listen only on localhost, `--network slirp4netns:allow_host_loopback=true` permits the container to access Ollama when it also listens strictly on localhost. `--add-host=ollama.local:10.0.2.2 --env 'OLLAMA_BASE_URL=http://ollama.local:11434'` adds a hosts record to the container and configures open-webui to use the friendly hostname. `10.0.2.2` is the default slirp4netns address used for localhost mapping. `--env 'ANONYMIZED_TELEMETRY=False'` isn't necessary since Chroma telemetry has been disabled in the code but is included as an example.
   :::

   ```bash
   podman create -p 127.0.0.1:3000:8080 --network slirp4netns:allow_host_loopback=true --add-host=ollama.local:10.0.2.2 --env 'OLLAMA_BASE_URL=http://ollama.local:11434' --env 'ANONYMIZED_TELEMETRY=False' -v open-webui:/app/backend/data --label io.containers.autoupdate=registry --name open-webui ghcr.io/open-webui/open-webui:main
   ```

   :::note
   [Podman 5.0](https://www.redhat.com/en/blog/podman-50-unveiled) has updated the default rootless network backend to use the more performant [pasta](https://passt.top/passt/about/). While `slirp4netns:allow_host_loopback=true` still achieves the same local-only intention, it's now recommended use a simple TCP forward instead like: `--network=pasta:-T,11434 --add-host=ollama.local:127.0.0.1`. Full example:
   :::

   ```bash
   podman create -p 127.0.0.1:3000:8080 --network=pasta:-T,11434 --add-host=ollama.local:127.0.0.1 --env 'OLLAMA_BASE_URL=http://ollama.local:11434' --env 'ANONYMIZED_TELEMETRY=False' -v open-webui:/app/backend/data --label io.containers.autoupdate=registry --name open-webui ghcr.io/open-webui/open-webui:main
   ```

3. Prepare for systemd user service:
   ```bash
   mkdir -p ~/.config/systemd/user/
   ```
4. Generate user service with Podman:
   ```bash
   podman generate systemd --new open-webui > ~/.config/systemd/user/open-webui.service
   ```
5. Reload systemd configuration:
   ```bash
   systemctl --user daemon-reload
   ```
6. Enable and validate new service:
   ```bash
   systemctl --user enable open-webui.service
   systemctl --user start open-webui.service
   systemctl --user status open-webui.service
   ```
7. Enable and validate Podman auto-update:
   ```bash
   systemctl --user enable podman-auto-update.timer
   systemctl --user enable podman-auto-update.service
   systemctl --user status podman-auto-update.timer
   ```
   Dry run with the following command (omit `--dry-run` to force an update):
   ```bash
   podman auto-update --dry-run
   ```

:::tip
This process is compatible with Windows 11 WSL deployments when using Ollama within the WSL environment or using the Ollama Windows Preview. When using the native Ollama Windows Preview version, one additional step is required: enable [mirrored networking mode](https://learn.microsoft.com/en-us/windows/wsl/networking#mirrored-mode-networking).
:::

### Enabling Windows 11 mirrored networking

1. Populate `%UserProfile%\.wslconfig` with:
   ```
   [wsl2]
   networkingMode=mirrored
   ```
2. Restart WSL:
   ```
   wsl --shutdown
   ```

</details>

### Alternative Installation Methods

For other ways to install, like using Kustomize or Helm, check out [INSTALLATION](/getting-started/installation). Join our [Open WebUI Discord community](https://discord.gg/5rJgQTnV4s) for more help and information.

### Updating your Docker Installation

For detailed instructions on manually updating your local Docker installation of Open WebUI, including steps for those not using Watchtower and updates via Docker Compose, please refer to our dedicated guide: [UPDATING](/getting-started/updating).

For a quick update with Watchtower, use the command below. Remember to replace `open-webui` with your actual container name if it differs.

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once open-webui
```

In the last part of the command, replace `open-webui` with your container name if it is different.

:::info

After updating Open WebUI, you might need to refresh your browser cache to see the changes.

:::

## How to Install Without Docker

While we strongly recommend using our convenient Docker container installation for optimal support, we understand that some situations may require a non-Docker setup, especially for development purposes. Please note that non-Docker installations are not officially supported, and you might need to troubleshoot on your own.

### Project Components

Open WebUI consists of two primary components: the frontend and the backend (which serves as a reverse proxy, handling static frontend files, and additional features). Both need to be running concurrently for the development environment.

:::info
The backend is required for proper functionality
:::

### Requirements 📦

- 🐰 [Node.js](https://nodejs.org/en) >= 20.10 or [Bun](https://bun.sh) >= 1.0.21
- 🐍 [Python](https://python.org) >= 3.11

### Build and Install 🛠️

Run the following commands to install:

```sh
git clone https://github.com/open-webui/open-webui.git
cd open-webui/

# Copying required .env file
cp -RPp .env.example .env

# Building Frontend Using Node
npm i
npm run build

# Serving Frontend with the Backend
cd ./backend
pip install -r requirements.txt -U
bash start.sh
```

You should have Open WebUI up and running at http://localhost:8080/. Enjoy! 😄
