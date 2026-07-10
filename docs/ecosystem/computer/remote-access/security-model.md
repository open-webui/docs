---
title: Security model and non-supported deployments
sidebar_position: 2
---

# Security model

## Use this when

You are deciding whether a device, person, network, automation, or agent should be allowed to reach an instance.

## Before you start

Understand the core boundary: Open WebUI Computer runs commands and accesses files as the operating-system account that starts it. That is why it can resume the work you left on a machine, including its dirty checkout and local service. Browser login controls access to the application; it does not turn the host into a sandbox.

## Do it

Keep the default localhost binding for first use. If you need another device, put access behind a private network you control, such as Tailscale. Give every automation and messaging bot a narrowly selected workspace and constrained prompt. Bots use full approval; enter at least one exact Allowed sender ID because an empty list accepts every sender. Review configured AI providers and tool servers because they may receive workspace data or perform external actions.

## Verify it worked

From an untrusted network or unsigned-in browser, protected API calls return `401 unauthorized`. From the approved device, sign in and verify only the intended existing workspace is accessible. Confirm the server is not listening on a public address with your normal host firewall or network inspection tooling.

## If it did not

If access works from a network or user you did not intend, stop the service or return it to `127.0.0.1`, revoke affected credentials, and inspect [audit logs](./authentication-and-audit). Do not solve an exposure problem by adding more application users.

## Trust boundary

The supported model is one trusted owner on a controlled network. The following are not supported safe deployments: untrusted multi-user instances, direct public-internet exposure, or a reverse proxy that passes spoofable identity headers. Do not use trusted-header authentication as a deployment recipe until you have independently validated its entire proxy boundary.
