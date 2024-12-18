---
sidebar_position: 11
title: "🔒 SSO: Federated Authentication Support"
---

# Federated Authentication Support

Open WebUI supports several forms of federated authentication:

1. OAuth2
    1. Google
    1. Microsoft
    1. OIDC
1. Trusted Header

## OAuth

There are several global configuration options for OAuth:

1. `ENABLE_OAUTH_SIGNUP` - if `true`, allows accounts to be created when logging in with OAuth. Distinct from `ENABLE_SIGNUP`.
1. `OAUTH_MERGE_ACCOUNTS_BY_EMAIL` - allows logging into an account that matches the email address provided by the OAuth provider.
    - This is considered insecure as not all OAuth providers verify email addresses, and may allow accounts to be hijacked.

### Google

To configure a Google OAuth client, please refer to [Google's documentation](https://support.google.com/cloud/answer/6158849) on how to create a Google OAuth client for a **web application**.
The allowed redirect URI should include `<open-webui>/oauth/google/callback`.

The following environment variables are required:

1. `GOOGLE_CLIENT_ID` - Google OAuth client ID
1. `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

### Microsoft

To configure a Microsoft OAuth client, please refer to [Microsoft's documentation](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app) on how to create a Microsoft OAuth client for a **web application**.
The allowed redirect URI should include `<open-webui>/oauth/microsoft/callback`.

Support for Microsoft OAuth is currently limited to a single tenant, that is a single Entra organization or personal Microsoft accounts.

The following environment variables are required:

1. `MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID
1. `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth client secret
1. `MICROSOFT_CLIENT_TENANT_ID` - Microsoft tenant ID - use `9188040d-6c67-4c5b-b112-36a304b66dad` for personal accounts

### OIDC

Any authentication provider that supports OIDC can be configured.
The `email` claim is required.
`name` and `picture` claims are used if available.
The allowed redirect URI should include `<open-webui>/oauth/oidc/callback`.

The following environment variables are used:

1. `OAUTH_CLIENT_ID` - OIDC client ID
1. `OAUTH_CLIENT_SECRET` - OIDC client secret
1. `OPENID_PROVIDER_URL` - OIDC well known URL, for example `https://accounts.google.com/.well-known/openid-configuration`
1. `OAUTH_PROVIDER_NAME` - Name of the provider to show on the UI, defaults to SSO
1. `OAUTH_SCOPES` - Scopes to request. Defaults to `openid email profile`

### OAuth Role Management

Any OAuth provider that can be configured to return roles in the access token can be used to manage roles in Open WebUI.
To use this feature set `ENABLE_OAUTH_ROLE_MANAGEMENT` to `true`.
You can configure the following environment variables to match the roles returned by the OAuth provider:

1. `OAUTH_ROLES_CLAIM` - The claim that contains the roles. Defaults to `roles`. Can also be nested, for example `user.roles`.
1. `OAUTH_ALLOWED_ROLES` - A comma-separated list of roles that are allowed to log in (receive open webui role `user`).
1. `OAUTH_ADMIN_ROLES` - A comma-separated list of roles that are allowed to log in as an admin (receive open webui role `admin`).

:::info

If changing the role of a logged in user, they will need to log out and log back in to receive the new role.

:::

## Trusted Header

Open WebUI is able to delegate authentication to an authenticating reverse proxy that passes in the user's details in HTTP headers.
There are several example configurations that are provided in this page.

:::danger

Incorrect configuration can allow users to authenticate as any user on your Open WebUI instance.
Make sure to allow only the authenticating proxy access to Open WebUI, such as setting `HOST=127.0.0.1` to only listen on the loopback interface.

:::

### Generic Configuration

When the `WEBUI_AUTH_TRUSTED_EMAIL_HEADER` environment variable is set, Open WebUI will use the value of the header specified as the email address of the user, handling automatic registration and login.

For example, setting `WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-User-Email` and passing a HTTP header of `X-User-Email: example@example.com` would authenticate the request with the email `example@example.com`.

Optionally, you can also define the `WEBUI_AUTH_TRUSTED_NAME_HEADER` to determine the name of any user being created using trusted headers. This has no effect if the user already exists.

### Tailscale Serve

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
      - WEBUI_AUTH_TRUSTED_NAME_HEADER=Tailscale-User-Name
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

### Cloudflare Tunnel with Cloudflare Access

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
      - WEBUI_AUTH_TRUSTED_EMAIL_HEADER=Cf-Access-Authenticated-User-Email
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

### oauth2-proxy

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
      - 'WEBUI_AUTH_TRUSTED_NAME_HEADER=X-Forwarded-User'
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


### Authentik

To configure a [Authentik](https://goauthentik.io/) OAuth client, please refer to [documentation](https://docs.goauthentik.io/docs/applications) on how to create an application and `OAuth2/OpenID Provider`.
The allowed redirect URI should include `<open-webui>/oauth/oidc/callback`.

While creating provider, please note `App-name`, `Client-ID` and `Client-Secret` and use it for open-webui environment variables:

```
      - 'ENABLE_OAUTH_SIGNUP=true'
      - 'OAUTH_MERGE_ACCOUNTS_BY_EMAIL=true'
      - 'OAUTH_PROVIDER_NAME=Authentik'
      - 'OPENID_PROVIDER_URL=https://<authentik-url>/application/o/<App-name>/.well-known/openid-configuration'
      - 'OAUTH_CLIENT_ID=<Client-ID>'
      - 'OAUTH_CLIENT_SECRET=<Client-Secret>'
      - 'OAUTH_SCOPES=openid email profile'
      - 'OPENID_REDIRECT_URI=https://<open-webui>/oauth/oidc/callback'
```

### Authelia

[Authelia](https://www.authelia.com/) can be configured to return a header for use with trusted header authentication.
Documentation is available [here](https://www.authelia.com/integration/trusted-header-sso/introduction/).

No example configs are provided due to the complexity of deploying Authelia.
