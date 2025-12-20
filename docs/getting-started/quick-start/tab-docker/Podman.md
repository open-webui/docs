
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

If networking issues arise (specifically on rootless Podman), you may need to adjust the network bridge settings.

:::warning Slirp4netns Deprecation
Older Podman instructions often recommended `slirp4netns`. However, `slirp4netns` is being **deprecated** and will be removed in **Podman 6**. 

The modern successor is **[pasta](https://passt.top/passt/about/)**, which is the default in Podman 5.0+.
:::

### Accessing the Host (Local Services)

If you are running Ollama or other services directly on your host machine, use the special DNS name **`host.containers.internal`** to point to your computer.

#### Modern Approach (Pasta - Default in Podman 5+)
No special flags are usually needed to access the host via `host.containers.internal`.

#### Legacy Approach (Slirp4netns)
If you are on an older version of Podman and `pasta` is not available:
1. Ensure you have [slirp4netns installed](https://github.com/rootless-containers/slirp4netns).
2. Start the container with the following flag to allow host loopback:

```bash
podman run -d --network=slirp4netns:allow_host_loopback=true --name openwebui -p 3000:8080 -v open-webui:/app/backend/data ghcr.io/open-webui/open-webui:main
```

### Connection Configuration
Once inside Open WebUI, navigate to **Settings > Admin Settings > Connections** and set your Ollama API connection to:
`http://host.containers.internal:11434`

Refer to the Podman [documentation](https://podman.io/) for advanced configurations.
