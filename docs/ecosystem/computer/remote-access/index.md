---
title: Remote access and security
sidebar_position: 1
---

# Remote access and security

Open WebUI Computer is **your computer, served to you**. An authenticated user can access the host filesystem and shell. There is no per-user filesystem sandbox or isolation.

Start with [local-only access](./local-and-lan). For another network, prefer [Tailscale](./tailscale-and-tunnels). Read the [security model](./security-model) before inviting any other user or publishing a route, and use [authentication and audit logging](./authentication-and-audit) to operate a private instance.

:::danger Not a shared shell service
Do not expose Open WebUI Computer directly to the public internet or let untrusted people share it. Treat it like an open SSH port, not a multi-tenant web application.
:::
