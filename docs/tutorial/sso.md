---
title: "Federated Authentication Support"
---

# Federated Authentication Support

Open WebUI itself does not have support for federated authentication schemes such as SSO, OAuth, SAML, or OIDC.
However, it is able to delegate authentication to an authenticating reverse proxy to achieve a similar effect as SSO.
There are several example configurations that are provided in this page.

:::danger

Incorrect configuration can allow users to authenticate as any user on your Open WebUI instance.
Make sure to allow only the authenticating proxy access to Open WebUI, such as setting `HOST=127.0.0.1` to only listen on the loopback interface.

:::

## Generic Configuration

When the `WEBUI_AUTH_TRUSTED_EMAIL_HEADER` environment variable is set, Open WebUI will use the value of the header specified as the email address of the user, handling automatic registration and login.

For example, setting `WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-User-Email` and passing a HTTP header of `X-User-Email: example@example.com` would authenticate the request with the email `example@example.com`.

## Tailscale Serve

[Tailscale Serve](https://tailscale.com/kb/1242/tailscale-serve) allows you to share a service within your tailnet, and Tailscale will set the header `Tailscale-User-Login` with the email address of the requester.

Below is an example serve config with a corresponding Docker Compose file that starts a Tailscale sidecar, exposing Open WebUI to the tailnet with the tag `open-webui` and hostname `open-webui`, and can be reachable at `https://open-webui.TAILNET_NAME.ts.net`.
You will need to create an OAuth client with device write permission to pass into the Tailscale container as `TS_AUTHKEY`.

```json title="tailscale/serve.json"
{
    "TCP": {
        "443": {
            "HTTPS": true
        }
    },
    "Web": {
        "${TS_CERT_DOMAIN}:443": {
            "Handlers": {
                "/": {
                    "Proxy": "http://open-webui:8080"
                }
            }
        }
    }
}

```

```yaml title="docker-compose.yaml"
---
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - open-webui:/app/backend/data
    environment:
      - HOST=127.0.0.1
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Tailscale-User-Login
    restart: unless-stopped
  tailscale:
    image: tailscale/tailscale:latest
    environment:
      - TS_AUTH_ONCE=true
      - TS_AUTHKEY=${TS_AUTHKEY}
      - TS_EXTRA_ARGS=--advertise-tags=tag:open-webui
      - TS_SERVE_CONFIG=/config/serve.json
      - TS_STATE_DIR=/var/lib/tailscale
      - TS_HOSTNAME=open-webui
    volumes:
      - tailscale:/var/lib/tailscale
      - ./tailscale:/config
      - /dev/net/tun:/dev/net/tun
    cap_add:
      - net_admin
      - sys_module
    restart: unless-stopped

volumes:
  open-webui: {}
  tailscale: {}
```

:::warning

If you run Tailscale in the same network context as Open WebUI, then by default users will be able to directly reach out to Open WebUI without going through the Serve proxy.
You will need use Tailscale's ACLs to restrict access to only port 443.

:::

## Cloudflare Tunnel with Cloudflare Access

[Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/create-remote-tunnel/) can be used with [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/) to protect Open WebUI with SSO.
This is barely documented by Cloudflare, but `Cf-Access-Authenticated-User-Email` is set with the email address of the authenticated user.

Below is an example Docker Compose file that sets up a Cloudflare sidecar.
Configuration is done via the dashboard.
From the dashboard, get a tunnel token, set the tunnel backend to `http://open-webui:8080`, and ensure that "Protect with Access" is checked and configured.

```yaml title="docker-compose.yaml"
---
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - open-webui:/app/backend/data
    environment:
      - HOST=127.0.0.1
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Tailscale-User-Login
    restart: unless-stopped
  cloudflared:
    image: cloudflare/cloudflared:latest
    environment:
      - TUNNEL_TOKEN=${TUNNEL_TOKEN}
    command: tunnel run
    restart: unless-stopped

volumes:
  open-webui: {}

```

## oauth2-proxy

[oauth2-proxy](https://oauth2-proxy.github.io/oauth2-proxy/) is an authenticating reverse proxy that implements social OAuth providers and OIDC support.

Given the large number of potential configurations, below is an example of a potential setup with Google OAuth.
Please refer to `oauth2-proxy`'s documentation for detailed setup and any potential security gotchas.

```yaml title="docker-compose.yaml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - open-webui:/app/backend/data
    environment:
      - 'HOST=127.0.0.1'
      - 'WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-Forwarded-Email'
    restart: unless-stopped
  oauth2-proxy:
    image: quay.io/oauth2-proxy/oauth2-proxy:v7.6.0
    environment:
      OAUTH2_PROXY_HTTP_ADDRESS: 0.0.0.0:4180
      OAUTH2_PROXY_UPSTREAMS: http://open-webui:8080/
      OAUTH2_PROXY_PROVIDER: google
      OAUTH2_PROXY_CLIENT_ID: REPLACEME_OAUTH_CLIENT_ID
      OAUTH2_PROXY_CLIENT_SECRET: REPLACEME_OAUTH_CLIENT_ID
      OAUTH2_PROXY_EMAIL_DOMAINS: REPLACEME_ALLOWED_EMAIL_DOMAINS
      OAUTH2_PROXY_REDIRECT_URL: REPLACEME_OAUTH_CALLBACK_URL
      OAUTH2_PROXY_COOKIE_SECRET: REPLACEME_COOKIE_SECRET
      OAUTH2_PROXY_COOKIE_SECURE: "false"
    restart: unless-stopped
    ports:
      - 4180:4180/tcp
```

## Authelia

[Authelia](https://www.authelia.com/) can be configured to return a header for use with trusted header authentication.
Documentation is available [here](https://www.authelia.com/integration/trusted-header-sso/introduction/).

No example configs are provided due to the complexity of deploying Authelia.

## Authentik

[Authentik](https://goauthentik.io/) can be configured to return a header for use with trusted header authentication.
Documentation is available [here](https://docs.goauthentik.io/docs/providers/proxy/). 

No example configs are provided due to the complexity of deploying Authentik.
