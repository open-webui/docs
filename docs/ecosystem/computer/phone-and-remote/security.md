---
title: "Security model"
sidebar_position: 7
---

# Security model

The model in one sentence: **a signed-in user has full access to everything Computer can reach: filesystem and shell, equivalent to an SSH session.** How much that is, you decide at install time: bare on the host, it's the whole machine; [in Docker](/ecosystem/computer/install/docker), it's exactly the folders you mount. Inside that boundary there is no per-user isolation. Computer is built for one trusted owner (or a small set of people you'd give SSH access to), and everything below follows from that.

That's why the [remote-access options](./index.md) all reduce to the same question: who can reach the login page?

## How authentication works

- **Password mode (default).** On first run, `cptr` prints a one-time setup URL (`/?token=...`) that only works while no user exists; the account it creates is the admin. Passwords are at least 6 characters and stored bcrypt-hashed. Login is rate-limited to 5 attempts per minute per IP.
- **Sessions.** Signing in sets a JWT cookie (`cptr_session`) valid for 30 days, renewed on use past the halfway point. Every request authenticates; there is no localhost bypass.
- **Signup.** Admins can enable self-registration (**Settings → Admin**). New signups get the **pending** role and cannot log in until an admin approves them. Roles gate admin settings; they do not create filesystem isolation between users.
- **Other modes.** `pam` (Linux system users) and `trusted_header` (reverse-proxy SSO) exist for proxy setups; see [Reverse proxy and SSO](./reverse-proxy).

## Sign every session out

Logging out only deletes that browser's cookie, and changing a password does not invalidate existing sessions. To revoke everything at once: replace `[server] secret` in `config.toml` (in the data directory, `~/.cptr` by default) with a new random value and restart `cptr`. Then rotate anything else that grants access: gateway API keys, messaging-bot tokens.

## Unattended paths act with full approval

The gateway API, [messaging bots](/ecosystem/computer/automate/messaging-bots), and scheduled tasks run with full tool approval: no human confirms each command. Anyone who can trigger them (an allowed bot sender, a client holding a gateway key) is acting as you on the machine. Guard those credentials like the login password.

## Audit logging

Off by default. When enabled it records mutating API requests (with sensitive data redacted). That's useful for reviewing what happened, but it is not a full terminal transcript. Setup: [logs and health](/ecosystem/computer/operate/logs-and-health).

## What not to do

- **Don't expose it raw to the public internet.** A public URL with only the password gate is an open invitation; use [Tailscale](./tailscale) or put [provider auth in front of a tunnel](./cloudflare-and-ngrok).
- **Don't share an instance with people you wouldn't give shell access.** Accounts are not isolation.
- **Don't run `trusted_header` mode behind a proxy that passes client headers through.** The proxy must strip and own the identity header; see [Reverse proxy and SSO](./reverse-proxy).

:::info If it was exposed
Bind back to `127.0.0.1` (or stop the tunnel), rotate `[server] secret` and restart, reset passwords and rotate gateway keys and bot tokens, then review the [audit logs](/ecosystem/computer/operate/logs-and-health) if you had them enabled.
:::
