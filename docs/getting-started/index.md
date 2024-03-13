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
1. **Installing Docker:**

- **For Windows and Mac Users:**

  - Download Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).
  - Follow the installation instructions provided on the website. After installation, open Docker Desktop to ensure it's running properly.

- **For Ubuntu and Other Linux Users:**
  - Open your terminal.
  - Set up your Docker apt repository according to the [Docker documentation](https://docs.docker.com/engine/install/ubuntu/#install-using-the-repository)
  - Update your package index:
    ```bash
    sudo apt-get update
    ```
  - Install Docker using the following command:
    ```bash
    sudo apt-get install docker-ce docker-ce-cli containerd.io
    ```
  - Verify the Docker installation with:
    ```bash
    sudo docker run hello-world
    ```
    This command downloads a test image and runs it in a container, which prints an informational message.

2. **Ensure You Have the Latest Version of Ollama:**

   - Download the latest version from [https://ollama.com/](https://ollama.com/).

3. **Verify Ollama Installation:**
   - After installing Ollama, check if it's working by visiting [http://127.0.0.1:11434/](http://127.0.0.1:11434/) in your web browser. Remember, the port number might be different for you.

</details>

## One-line Command to Install Ollama and Open WebUI Together

#### Using Docker Compose

- If you don't have Ollama yet, use Docker Compose for easy installation. Run this command:

  ```bash
  docker compose up -d --build
  ```

- **For GPU Support:** Use an additional Docker Compose file:

  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.gpu.yaml up -d --build
  ```

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

## Quick Start with Docker 🐳

:::info
When using Docker to install Open WebUI, make sure to include the `-v open-webui:/app/backend/data` in your Docker command. This step is crucial as it ensures your database is properly mounted and prevents any loss of data.
:::

- **If Ollama is on your computer**, use this command:

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **If Ollama is on a Different Server**, use this command:

- To connect to Ollama on another server, change the `OLLAMA_BASE_URL` to the server's URL:

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- After installation, you can access Open WebUI at [http://localhost:3000](http://localhost:3000). Enjoy! 😄

#### Open WebUI: Server Connection Error

If you're experiencing connection issues, it’s often due to the WebUI docker container not being able to reach the Ollama server at 127.0.0.1:11434 (host.docker.internal:11434) inside the container . Use the `--network=host` flag in your docker command to resolve this. Note that the port changes from 3000 to 8080, resulting in the link: `http://localhost:8080`.

**Example Docker Command**:

```bash
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

## Installing with Podman

<details>
<summary>Rootless (Podman) local-only Open WebUI with Systemd service and auto-update</summary>

- **Important:** Consult the Docker documentation because much of the configuration and syntax is interchangeable with [Podman](https://github.com/containers/podman). See also [rootless_tutorial](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md). This example requires the [slirp4netns](https://github.com/rootless-containers/slirp4netns) network backend to facilitate server listen and Ollama communication over localhost only.

1. Pull the latest image:
   ```bash
   podman pull ghcr.io/open-webui/open-webui:main
   ```
2. Create a new container using desired configuration:

   **Note:** `-p 127.0.0.1:3000:8080` ensures that we listen only on localhost, `--network slirp4netns:allow_host_loopback=true` permits the container to access Ollama when it also listens strictly on localhost. `--add-host=ollama.local:10.0.2.2 --env 'OLLAMA_BASE_URL=http://ollama.local:11434'` adds a hosts record to the container and configures open-webui to use the friendly hostname. `10.0.2.2` is the default slirp4netns address used for localhost mapping. `--env 'ANONYMIZED_TELEMETRY=False'` isn't necessary since Chroma telemetry has been disabled in the code but is included as an example.

   ```bash
   podman create -p 127.0.0.1:3000:8080 --network slirp4netns:allow_host_loopback=true --add-host=ollama.local:10.0.2.2 --env 'OLLAMA_BASE_URL=http://ollama.local:11434' --env 'ANONYMIZED_TELEMETRY=False' -v open-webui:/app/backend/data --label io.containers.autoupdate=registry --name open-webui ghcr.io/open-webui/open-webui:main
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

</details>

### Alternative Installation Methods

For other ways to install, like using Kustomize or Helm, check out [INSTALLATION](/getting-started/installation). Join our [Open WebUI Discord community](https://discord.gg/5rJgQTnV4s) for more help and information.

### Updating your Docker Installation

In case you want to update your local Docker installation to the latest version, you can do it with [Watchtower](https://containrrr.dev/watchtower/):

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once open-webui
```

In the last part of the command, replace `open-webui` with your container name if it is different.

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
