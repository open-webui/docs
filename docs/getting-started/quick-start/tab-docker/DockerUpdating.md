## Updating

To update your local Docker installation to the latest version, you can either use **Watchtower** or manually update the container.

### Option 1: Using Watchtower (Recommended Fork)

:::info Deprecation Notice
The original `containrrr/watchtower` is **no longer maintained** and may fail with newer Docker versions. We recommend using the `nickfedor/watchtower` fork.
:::

With [Watchtower](https://github.com/nickfedor/watchtower), you can automate the update process:

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
   docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
   ```

Both methods will get your Docker instance updated and running with the latest build.
