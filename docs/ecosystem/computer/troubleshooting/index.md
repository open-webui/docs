---
title: Troubleshooting
sidebar_position: 1
---

# Troubleshooting

Start with the observable state. A healthy process answers `/api/health`; a useful workspace shows the same path, git state, and terminal as the host. These pages separate installation, network, and persistent-state problems so you do not erase the wrong thing.

Follow the same order as setup: repair local startup and folder access first, then private remote access, then any agent or integration problem. Do not expose a port, reset state, or add an integration as a workaround for an earlier step.

- [Install and login](./install-and-login)
- [Access and workspaces](./access-and-workspaces)
- [Docker and persistent state](./docker-and-state)

If the host is publicly reachable or an untrusted user can sign in, stop and read [the security model](/ecosystem/computer/remote-access/security-model) before debugging further.
