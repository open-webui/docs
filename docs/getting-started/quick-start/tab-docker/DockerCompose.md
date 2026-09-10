Save this as `docker-compose.yml`, replace the secret key with the output of `openssl rand -hex 32`, then run `docker compose up -d`:

```yaml title="docker-compose.yml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway
    environment:
      - WEBUI_SECRET_KEY=your-secret-key
    restart: unless-stopped

volumes:
  open-webui:
```

The tags are the same as on the Docker tab: change the `image:` line. To try `:dev`, add it as a second service with its own volume and port, see [Running the pre-release image](/getting-started/quick-start#running-the-pre-release-image). Use Docker Compose v2 (`docker compose`, with a space).



The sections below extend the `docker-compose.yml` above.

:::warning

**Warning:** Older Docker Compose tutorials may reference version 1 syntax, which uses commands like `docker-compose build`. Ensure you use version 2 syntax, which uses commands like `docker compose build` (note the space instead of a hyphen).

:::

### Running the pre-release image

`:dev` is Open WebUI's pre-release channel, and in practice a nightly build: every change lands on the `dev` branch before it lands anywhere else, and the next release is `dev` as it stands on release day. Running it on a second instance shows you that release early, and anything you report gets fixed before it ships rather than after.

Change the tag and, importantly, give it a **separate volume and a separate port**:

```yaml
services:
  openwebui-dev:
    image: ghcr.io/open-webui/open-webui:dev
    ports:
      - "3001:8080"
    volumes:
      - open-webui-dev:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway
    environment:
      - WEBUI_SECRET_KEY=your-dev-secret-key
    restart: unless-stopped
volumes:
  open-webui-dev:
```

:::warning Never point dev at your production volume
Dev builds may include database migrations that a release image cannot read back, so a shared volume can leave you unable to go back to `:main`. Keep `open-webui-dev` as its own volume, as above.
:::

Add this as a second service alongside your normal one and both run at the same time, on ports 3000 and 3001. Report anything that looks wrong on [GitHub](https://github.com/open-webui/open-webui/issues). A pre-release is only as well tested as the number of people who choose to install it, so this is the single most useful thing an operator can contribute.

### GPU support with Compose

:::note

**Note:** For Nvidia GPU support, you change the image from `ghcr.io/open-webui/open-webui:main` to `ghcr.io/open-webui/open-webui:cuda` and add the following to your service definition in the `docker-compose.yml` file:

:::

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

This setup ensures that your application can leverage GPU resources when available.

### Helper Scripts

A set of helper scripts is included with the codebase to streamline common Docker workflows:

- `docker-compose-launcher.sh`: Interactive Compose launcher with GPU auto-detection, configurable WebUI/API ports, host data mounts, and optional Playwright support. Run `./docker-compose-launcher.sh --help` for the full list of flags. Use `--drop` to tear down the project.
- `docker-cleanup.sh`: Stops the Compose project and **deletes all volumes**, including persistent data. Prompts for confirmation before destroying data.
- `docker-run.sh`: Builds the Open WebUI image and runs a single container, exposing it on `OPEN_WEBUI_PORT` (default `3000`).
- `docker-ollama.sh`: Pulls and runs the official Ollama container with optional GPU passthrough, exposing it on `OLLAMA_PORT` (default `11434`).
- `docker-update-models.sh`: Iterates through every model installed in the Ollama container and pulls the latest version.

---


## Uninstall



1.  **Stop and Remove the Services:**
    Run this command in the directory containing your `docker-compose.yml` file:
    ```bash
    docker compose down
    ```

2.  **Remove the Volume (Optional, WARNING: Deletes all data):**
    If you want to completely remove your data (chats, settings, etc.):
    ```bash
    docker compose down -v
    ```
    Or manually:
    ```bash
    docker volume rm <your_project_name>_open-webui
    ```

3.  **Remove the Image (Optional):**
    ```bash
    docker rmi ghcr.io/open-webui/open-webui:main
    ```
