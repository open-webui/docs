# Updating

## Updating your Docker Installation

Keeping your Open WebUI Docker installation up-to-date ensures you have the latest features and security updates. You can update your installation manually or use [Watchtower](https://containrrr.dev/watchtower/) for automatic updates.

### Manual Update

Follow these steps to manually update your Open WebUI:

1. **Pull the Latest Docker Image**:
   ```bash
   docker pull ghcr.io/open-webui/open-webui:main
   ```

2. **Stop and Remove the Existing Container**:
   - This step ensures that you can create a new container from the updated image.
   ```bash
   docker stop open-webui
   docker rm open-webui
   ```

3. **Create a New Container with the Updated Image**:
   - Use the same `docker run` command you used initially to create the container, ensuring all your configurations remain the same.
   ```bash
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
   ```

This process updates your Open WebUI container to the latest version while preserving your data stored in Docker volumes.

### Updating with Watchtower

For those who prefer automated updates, Watchtower can monitor your Open WebUI container and automatically update it to the latest version. You have two options with Watchtower: running it once for an immediate update, or deploying it persistently to automate future updates.

#### Running Watchtower Once

To update your container immediately without keeping Watchtower running continuously, use the following command. Replace `open-webui` with your container name if it differs.

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once open-webui
```

#### Deploying Watchtower Persistently

If you prefer Watchtower to continuously monitor and update your container whenever a new version is available, you can run Watchtower as a persistent service. This method ensures your Open WebUI always stays up to date without any manual intervention. Use the command below to deploy Watchtower in this manner:

```bash
docker run -d --name watchtower --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower open-webui
```

Remember to replace `open-webui` with the name of your container if you have named it differently. This configuration allows you to benefit from the latest improvements and security patches with minimal downtime and manual effort.

### Updating Docker Compose Installation

If you installed Open WebUI using Docker Compose, follow these steps to update:

1. **Pull the Latest Images**:
   - This command fetches the latest versions of the images specified in your `docker-compose.yml` files.
   ```bash
   docker compose pull
   ```

2. **Recreate the Containers with the Latest Images**:
   - This command recreates the containers based on the newly pulled images, ensuring your installation is up-to-date. No build step is required for updates.
   ```bash
   docker compose up -d
   ```

This method ensures your Docker Compose-based installation of Open WebUI (and any associated services, like Ollama) is updated efficiently and without the need for manual container management.

## Updating Your Direct Install

For those who have installed Open WebUI directly without using Docker, updates are just as important to ensure access to the latest features and security patches. Remember, direct installations are not officially supported, and you might need to troubleshoot on your own. Here's how to update your installation:

### Pull the Latest Changes

Navigate to your Open WebUI project directory and pull the latest changes from the repository:

```sh
cd path/to/open-webui/
git pull origin main
```

Replace `path/to/open-webui/` with the actual path to your Open WebUI installation.

### Update Dependencies

After pulling the latest changes, update your project dependencies. This step ensures that both frontend and backend dependencies are up to date.

- **For Node.js (Frontend):**

```sh
npm install
npm run build
```

- **For Python (Backend):**

```sh
cd backend
pip install -r requirements.txt -U
```

### Restart the Backend Server

To apply the updates, you need to restart the backend server. If you have a running instance, stop it first and then start it again using the provided script.

```sh
bash start.sh
```

This command should be run from within the `backend` directory of your Open WebUI project.

:::info
Direct installations require more manual effort to update compared to Docker-based installations. If you frequently need updates and want to streamline the process, consider transitioning to a Docker-based setup for easier management.
:::

By following these steps, you can update your direct installation of Open WebUI, ensuring you're running the latest version with all its benefits. Remember to back up any critical data or custom configurations before starting the update process to prevent any unintended loss.