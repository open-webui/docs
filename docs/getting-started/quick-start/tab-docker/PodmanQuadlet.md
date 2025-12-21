# Podman Quadlets (systemd)

Podman Quadlets allow you to manage containers as native systemd services. This is the recommended way to run production containers on Linux distributions that use systemd (like Fedora, RHEL, Ubuntu, etc.).

## 🛠️ Setup

1. **Create the configuration directory:**
   For a rootless user deployment:
   ```bash
   mkdir -p ~/.config/containers/systemd/
   ```

2. **Create the container file:**
   Create a file named `~/.config/containers/systemd/open-webui.container` with the following content:

   ```ini title="open-webui.container"
   [Unit]
   Description=Open WebUI Container
   After=network-online.target

   [Container]
   Image=ghcr.io/open-webui/open-webui:main
   ContainerName=open-webui
   PublishPort=3000:8080
   Volume=open-webui:/app/backend/data
   
   # Networking: Pasta is used by default in Podman 5+
   # If you need to access host services (like Ollama on the host):
   AddHost=host.containers.internal:host-gateway

   [Service]
   Restart=always

   [Install]
   WantedBy=default.target
   ```

3. **Reload systemd and start the service:**
   ```bash
   systemctl --user daemon-reload
   systemctl --user start open-webui
   ```

4. **Enable auto-start on boot:**
   ```bash
   systemctl --user enable open-webui
   ```

## 📊 Management

- **Check status:**
  ```bash
  systemctl --user status open-webui
  ```

- **View logs:**
  ```bash
  journalctl --user -u open-webui -f
  ```

- **Stop service:**
  ```bash
  systemctl --user stop open-webui
  ```

:::tip Updating
To update the image, simply pull the new version (`podman pull ghcr.io/open-webui/open-webui:main`) and restart the service (`systemctl --user restart open-webui`).
:::
