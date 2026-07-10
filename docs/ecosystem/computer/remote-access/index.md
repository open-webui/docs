---
title: Remote access and security
sidebar_position: 1
---

# Remote access and security

Remote access is the third learning step, after you have verified a local folder and optionally tried an agent. It makes the same host workspace and ongoing terminal reachable from another device; it does not create a second machine or a safer copy of the project.

Open WebUI Computer is **your computer, served to you**. An authenticated user can access the host filesystem and shell. There is no per-user filesystem sandbox or isolation.

## Choose the smallest route that works

1. Stay on the host when local browser access solves the problem.
2. For a one-network test, use [local-only and LAN access](./local-and-lan) on a network you control.
3. For regular access away from home, keep Computer bound to localhost and use [private remote access with Tailscale](./tailscale-and-tunnels).
4. After remote access is working, consider [automations and integrations](/ecosystem/computer/integrations) only when you are ready to trust an external or unattended trigger with the selected workspace.

Start with [local-only access](./local-and-lan). For another network, prefer [Tailscale](./tailscale-and-tunnels). Read the [security model](./security-model) before inviting any other user or publishing a route, and use [authentication and audit logging](./authentication-and-audit) to operate a private instance.

:::danger Not a shared shell service
Do not expose Open WebUI Computer directly to the public internet or let untrusted people share it. Treat it like an open SSH port, not a multi-tenant web application.
:::
