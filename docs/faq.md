---
sidebar_position: 6
title: "📋 FAQ"
---

# 📋 Frequently Asked Questions

#### **Q: Why am I asked to sign up? Where are my data being sent to?**

**A:** We require you to sign up to become the admin user for enhanced security. This ensures that if the Open WebUI is ever exposed to external access, your data remains secure. It's important to note that everything is kept local. We do not collect your data. When you sign up, all information stays within your server and never leaves your device. Your privacy and security are our top priorities, ensuring that your data remains under your control at all times.

#### **Q: Why can't my Docker container connect to services on the host using `localhost`?**  

**A:** Inside a Docker container, `localhost` refers to the container itself, not the host machine. This distinction is crucial for networking. To establish a connection from your container to services running on the host, you should use the DNS name `host.docker.internal` instead of `localhost`. This DNS name is specially recognized by Docker to facilitate such connections, effectively treating the host as a reachable entity from within the container, thus bypassing the usual `localhost` scope limitation.

#### **Q: How do I make my host's services accessible to Docker containers?**  

**A:** To make services running on the host accessible to Docker containers, configure these services to listen on all network interfaces, using the IP address `0.0.0.0`, instead of `127.0.0.1` which is limited to `localhost` only. This configuration allows the services to accept connections from any IP address, including Docker containers. It's important to be aware of the security implications of this setup, especially when operating in environments with potential external access. Implementing appropriate security measures, such as firewalls and authentication, can help mitigate risks.

#### **Q: Why isn't my Open WebUI updating? I've re-pulled/restarted the container, and nothing changed.**

**A:** Updating Open WebUI requires more than just pulling the new Docker image. Here’s why your updates might not be showing and how to ensure they do:

1. **Updating the Docker Image**: The command `docker pull ghcr.io/open-webui/open-webui:main` updates the Docker image but not the running container or its data.
2. **Persistent Data in Docker Volumes**: Docker volumes store data independently of container lifecycles, preserving your data (like chat histories) through updates.
3. **Applying the Update**: Ensure your update takes effect by removing the existing container (which doesn't delete the volume) and creating a new one with the updated image and existing volume attached.

This process updates the app while keeping your data safe.

#### **Q: Wait, delete my container, won't I lose my data?**

**A:** It's a common concern, but deleting a container doesn't mean you'll lose your data, provided you're using Docker volumes correctly. Here’s why:

- **Volumes Preserve Data**: Docker volumes are designed to persist data outside of container lifecycles. As long as your data is stored in a volume, it remains intact, regardless of what happens to the container.
- **Safe Update Process**: When updating Open WebUI, removing the old container and creating a new one with the updated image does not affect the data stored in volumes. The key is not to explicitly delete the volume with commands like `docker volume rm`.

By following the correct update steps—pulling the new image, removing the old container without deleting the volume, and creating a new container with the updated image and the existing volume—your application code is updated while your data remains unchanged and safe.

If you have any further questions or concerns, please don't hesitate to reach out! 🛡️
