---
title: Remote access and workspace problems
sidebar_position: 3
---

# Remote access and workspace problems

## Use this when

A phone cannot reach the host, a workspace is missing, or the terminal does not look like the expected project.

## Before you start

Decide whether the failure is local, LAN, or private-remote. `localhost` on a phone means the phone itself, not the machine running Open WebUI Computer.

## Do it

On the host, run `curl http://127.0.0.1:8000/api/health`. For private remote use, keep the existing localhost-bound server running and follow [Tailscale or tunnels](/ecosystem/computer/remote-access/tailscale-and-tunnels).

For intentional LAN-only testing, stop the existing server first, restart it with `cptr run --host 0.0.0.0`, and use the host's private IP from the second device. Verify the host firewall limits the port to the intended private subnet, then restore the default localhost binding when the test is complete.

## Verify it worked

The second device signs in and sees the same workspace path. `pwd` and `git status` in its terminal match the host's normal shell. Closing and reopening the browser does not replace the running host process or workspace with a new copy.

## If it did not

If health fails on the host, return to [install and login](./install-and-login). If it works locally but not through Tailscale Serve, inspect `tailscale serve status` and the tailnet policy before changing the Computer bind address. If intentional LAN testing fails, check the host firewall and private IP. If a workspace is missing, verify the server's OS account can read it and add its real path; do not copy repositories into `~/.cptr`. If the host sleeps, wake it: no remote route can serve a sleeping machine.

## Trust boundary

Do not turn an unreachable host into a publicly forwarded port. Remote access should remain limited to devices and networks you trust.
