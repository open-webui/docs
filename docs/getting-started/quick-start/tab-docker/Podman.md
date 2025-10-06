
# Using Podman

Podman is a daemonless container engine for developing, managing, and running OCI Containers.

## Basic Commands

- **Run a Container:**

  ```bash
  podman run -d --name openwebui -p 3000:8080 -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main
  ```

- **List Running Containers:**

  ```bash
  podman ps
  ```

## Networking with Podman

If networking issues arise, use slirp4netns to adjust the pod's network settings to allow the container to access your computer's ports.

Ensure you have [slirp4netns installed](https://github.com/rootless-containers/slirp4netns?tab=readme-ov-file#install), remove the previous container if it exists using `podman rm`, and start a new container with

```bash
  podman run -d --network=slirp4netns:allow_host_loopback=true --name openwebui -p 3000:8080 -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main
```

If you are using Ollama from your computer (not running inside a container),

Once inside open-webui, navigate to Settings > Admin Settings > Connections and create a new Ollama API connection to `http://10.0.2.2:[OLLAMA PORT]`. By default, the Ollama port is 11434.

Refer to the Podman [documentation](https://podman.io/) for advanced configurations.
