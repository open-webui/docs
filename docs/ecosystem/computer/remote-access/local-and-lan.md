---
title: Local-only and LAN access
sidebar_position: 3
---

# Local-only and LAN access

## Use this when

Theo is at home with an iPad and needs the local app and terminal running on his Mac, or you are testing access before setting up a private remote network.

## Before you start

`cptr run` binds to `127.0.0.1` by default. Only use LAN access on a network you control. Know the host's private IP address and ensure the host firewall permits the chosen port only as broadly as intended.

## Do it

Start the service on all network interfaces:

```bash
cptr run --host 0.0.0.0
```

On the other device, open `http://<host-private-ip>:8000` and sign in. Keep the host powered and awake while you use it.

## Verify it worked

On the second device, open the same existing workspace and terminal. Run a harmless command such as `pwd`; it reports the host workspace, not a new environment. Back on the host, run `curl http://127.0.0.1:8000/api/health` and confirm it remains healthy.

## If it did not

If the second device cannot connect, confirm both devices are on the same private network, use the host's LAN address rather than `localhost`, and inspect the host firewall. If the host sleeps, wake it and reconnect; Open WebUI Computer cannot serve a powered-off machine.

## Trust boundary

`0.0.0.0` makes the service reachable by devices that can route to the host. It is not authentication, encryption, or a recommendation to forward the port from your router.
