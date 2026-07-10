---
title: Security, permissions, and configuration
sidebar_position: 2
---

# Security, permissions, and configuration

Open WebUI Computer is a private window into a real host. That is why it is useful for a dirty branch, local credentials, running process, or existing terminal session. It is also why its primary security rule is simple: treat an authenticated Computer user like an SSH user on that host.

## Use this when

Use this reference when deciding how to reach Computer from another device, set authentication/logging, or determine whether an instance is appropriate for a team or public network.

## Before you start

- Confirm every intended user is trusted with the host filesystem and shell.
- Prefer local-only use first, then a private VPN/tunnel such as Tailscale for remote access.
- Decide whether structured/audit logging is needed and where those logs will be retained.

## Do it

1. Keep the default loopback bind for a local trial.
2. For remote use, put Computer behind a private, authenticated network path; then test from a second trusted device.
3. Configure username/password setup and, if used, reverse-proxy trusted-header authentication only when the proxy prevents spoofed headers.
4. Set `CPTR_AUDIT_LOG_LEVEL` for mutation audit records and `CPTR_LOG_LEVEL`/`CPTR_LOG_FORMAT` for diagnostics. Set `CPTR_CORS_ALLOWED_ORIGINS` deliberately when embedding/cross-origin access is needed.

Not a fit: Computer is not a multi-tenant host, a browser-only sandbox, or a service to place on the open internet for strangers. Use an isolated developer environment, traditional SSH access controls, or a purpose-built multi-user platform instead.

## Verify it worked

The second trusted device can log in through the private route, while an untrusted/public route cannot reach the service. A permitted mutation produces an audit entry when enabled, without recording plaintext passwords or API keys.

## If it did not

Return to localhost-only access while you diagnose network and proxy configuration. Do not solve a failed trusted-header setup by accepting arbitrary inbound headers. If logs are absent, verify the configured path is writable and audit logging is not set to `NONE`.

## Trust boundary

There is no path sandboxing or per-user isolation. Terminal and shell-capable agent tools have host-level effects. Built-in agent file tools place some limits on ordinary workspace file operations, but those are not a substitute for host isolation or a safe public deployment.
