## Updating

To update your local Docker installation to the latest version, you can either use **Watchtower** or manually update the container.

### Option 1: Using Watchtower

With [Watchtower](https://github.com/nicholas-fedor/watchtower), you can automate the update process:

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock nickfedor/watchtower --run-once open-webui
```

*(Replace `open-webui` with your container's name if it's different.)*

### Option 2: Manual Update

1. Stop and remove the current container:

   ```bash
   docker rm -f open-webui
   ```

2. Pull the latest version:

   ```bash
   docker pull ghcr.io/open-webui/open-webui:main
   ```

3. Start the container again:

   ```bash
   docker run -d -p 3000:8080 -v open-webui:/app/backend/data \
     -e WEBUI_SECRET_KEY="your-secret-key" \
     --name open-webui --restart always \
     ghcr.io/open-webui/open-webui:main
   ```

:::warning Set WEBUI_SECRET_KEY
Without a persistent `WEBUI_SECRET_KEY`, you'll be logged out every time the container is recreated. Generate one with `openssl rand -hex 32`.
:::

For version pinning, rollback, automated update tools, and backup procedures, see the [full update guide](/getting-started/updating).
