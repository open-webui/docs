---
title: config.toml
sidebar_position: 4
---

# config.toml

Computer's server configuration lives in `<data-dir>/config.toml`: `~/.cptr/config.toml` by default, `/data/config.toml` in Docker.

```toml
[server]
secret = "..."              # JWT signing secret, generated on first run

[auth]
mode = "password"           # "password" (default), "pam", or "trusted_header"
header = "Remote-User"      # trusted_header mode: which header carries the username
trusted_sources = []        # trusted_header mode: optional IP allowlist for the proxy

[app_config]
# mirror of the app configuration stored in the database
```

## `[server]`: the secret

`secret` signs session JWTs. Rotating it and restarting signs out every session on every device; that's the "log everyone out now" lever.

:::warning Rotating the secret invalidates stored provider keys
Values Computer stores encrypted (prefixed `encrypted:`), such as provider API keys and bot tokens, are keyed off the server secret. After rotating it, re-enter those keys in Settings.
:::

## `[auth]`: how users sign in

| Mode | Behavior |
| --- | --- |
| `password` | Default. Username/password accounts stored in Computer's database. |
| `pam` | Authenticate against Linux system users. Requires `pip install 'cptr[pam]'`; accounts are auto-created on first login. |
| `trusted_header` | Reverse-proxy SSO: Computer trusts the username in the header named by `header` (default `Remote-User`). Optionally restrict which source IPs may assert it with `trusted_sources`. Setup: [Reverse proxy](/ecosystem/computer/phone-and-remote/reverse-proxy). |

There is no localhost bypass in any mode; every request authenticates. More on the overall model: [Security](/ecosystem/computer/phone-and-remote/security).

## `[app_config]`: the mirror

Settings you change in the UI are stored in the database *and* mirrored into this section. On startup the file is re-seeded into the database: **the file wins**. Two consequences:

- Hand-editing `config.toml` is a legitimate way to change app config: stop the server, edit, start. Don't edit it while the server is running, since a UI change can overwrite yours.
- Config survives a lost database. Restore `config.toml` and your settings come back even if `app.db` doesn't.
