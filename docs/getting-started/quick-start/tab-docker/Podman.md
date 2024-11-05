
# Using Podman

Podman is a daemonless container engine for developing, managing, and running OCI Containers.

## Basic Commands

- **Run a Container:**

  ```bash
  podman run -d --name openwebui -p 3000:8080 ghcr.io/open-webui/open-webui:main
  ```

- **List Running Containers:**

  ```bash
  podman ps
  ```

## Networking with Podman

If networking issues arise, you may need to adjust your network settings:

```bash
--network=slirp4netns:allow_host_loopback=true
```

Refer to the Podman [documentation](https://podman.io/) for advanced configurations.
