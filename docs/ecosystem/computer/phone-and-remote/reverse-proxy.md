---
title: "Reverse proxy and SSO"
sidebar_position: 4
---

# Reverse proxy and SSO

`cptr` has no TLS of its own: the proxy terminates HTTPS and forwards plain HTTP to `127.0.0.1:8000`. The one thing that trips people up: Computer is Socket.IO-based, so the proxy **must** forward WebSocket upgrades, or terminals and streaming break.

## nginx

```nginx
server {
    listen 443 ssl;
    server_name computer.example.com;

    # ssl_certificate / ssl_certificate_key as usual

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;   # long-lived terminal WebSockets
    }
}
```

## Caddy

Caddy handles TLS and WebSocket upgrades automatically:

```caddyfile
computer.example.com {
    reverse_proxy 127.0.0.1:8000
}
```

## Traefik

Point a router at a service targeting `http://127.0.0.1:8000`. Traefik forwards WebSocket upgrades by default; no extra middleware needed.

## Single sign-on with trusted-header auth

If your proxy already authenticates users (Authentik, Authelia, oauth2-proxy, ...), Computer can trust the identity header it injects instead of showing its own login. In `config.toml` (in the data directory, `~/.cptr` by default):

```toml
[auth]
mode = "trusted_header"
header = "Remote-User"          # default header name
trusted_sources = ["127.0.0.1"] # optional: only accept the header from these IPs
```

Restart `cptr` after editing. See the [configuration reference](/ecosystem/computer/reference/configuration) for all options.

:::warning The proxy must own that header
In `trusted_header` mode, whoever sets `Remote-User` is signed in. Your proxy must strip the header from incoming requests and set it only after its own authentication succeeds. Computer should also only be reachable through the proxy (keep the default `127.0.0.1` binding). A proxy that passes client-supplied headers through is an unauthenticated shell.
:::

## PAM: log in with system users

On Linux you can authenticate against the host's own user accounts instead:

```toml
[auth]
mode = "pam"
```

Requires the PAM extra (`pip install 'cptr[pam]'`). Users are created in Computer automatically on their first successful login.
