---
sidebar_position: 4
title: "Hardening Open WebUI"
---

# Hardening Open WebUI

Open WebUI is a self-hosted application built for private, trusted networks. It gives authenticated users access to powerful capabilities including model inference, tool execution, and code pipelines. The security model assumes that anyone who can reach the instance has been intentionally granted access by an administrator.

This guide covers the configuration options available for hardening your deployment. Each section explains what a setting does, what the default is, and how to change it. It is not an exhaustive security guide, and securing your deployment is ultimately your responsibility. Your environment and threat model will determine which of these are relevant to you.

:::tip Network Placement

Open WebUI is built for private, trusted networks. While it can be made accessible over the public internet, doing so means relying solely on application-level authentication to protect access to your models, tools, and data. If you do expose it publicly, at minimum you should place it behind a VPN (WireGuard, Tailscale), a zero-trust proxy (Cloudflare Access, Pomerium), or a reverse proxy with authentication and IP allowlisting.

DDoS protection and brute-force prevention (rate limiting on login endpoints, connection throttling, fail2ban) should also be handled at the proxy or network layer.

:::

If you are deploying Open WebUI for the first time, start with the [Quick Reference](#quick-reference) at the bottom of this page for a prioritized summary, then read the sections relevant to your setup.

---

## Secret Key

The `WEBUI_SECRET_KEY` is used to sign JWTs (login tokens) and derive encryption keys for OAuth session data.

**How the default works:**

When running via Docker (`start.sh`) or `open-webui serve`, the application checks whether `WEBUI_SECRET_KEY` is set as an environment variable. If it is not, a random key is generated automatically and saved to `.webui_secret_key` inside the data directory. On subsequent restarts, the saved key is reloaded. This means that for single-instance deployments, no manual configuration is needed.

**When you need to set it explicitly:**

If you run multiple Open WebUI instances behind a load balancer, every instance must share the same key. Otherwise, a token signed by one instance will be rejected by another, causing login failures. Generate a key with `openssl rand -base64 32` and pass it as an environment variable to all replicas.

**Rotation:** Changing the key invalidates all existing sessions. Users will need to sign in again.

---

## Authentication and Signup

### Registration

By default, signup is open and the first user to register becomes the administrator. After your admin account exists, you can control registration:

```bash
# Disable new signups entirely
ENABLE_SIGNUP=false
```

If you want to allow signups but require manual approval, leave signups enabled and rely on the default user role:

```bash
# New users are placed in "pending" status until an admin approves them (this is the default)
DEFAULT_USER_ROLE=pending
```

### Password validation

Open WebUI does not enforce password complexity by default. To enable it:

```bash
ENABLE_PASSWORD_VALIDATION=true
PASSWORD_VALIDATION_REGEX_PATTERN='^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$'
PASSWORD_VALIDATION_HINT='Minimum 8 characters with uppercase, lowercase, number, and special character.'
```

Passwords are hashed with bcrypt before storage. Bcrypt truncates inputs at 72 bytes, and Open WebUI enforces this limit.

### Admin account from environment variables

For automated deployments, you can create the admin account at startup:

```bash
WEBUI_ADMIN_EMAIL=admin@yourcompany.com
WEBUI_ADMIN_PASSWORD=your-strong-password
WEBUI_ADMIN_NAME=Admin
```

This only takes effect when no users exist in the database. Once the admin is created, signup is automatically disabled.

### SSO-only environments

If all authentication is handled by an OAuth/OIDC provider, you can hide the local login form entirely:

```bash
ENABLE_LOGIN_FORM=false
```

This removes the email/password form from the UI, steering all users through your SSO flow. You can also disable local password authentication at the backend level:

```bash
ENABLE_PASSWORD_AUTH=false
```

---

## Session and Cookie Security

### Cookie settings

When serving Open WebUI over HTTPS (see [HTTPS Configuration](/reference/https)), configure cookies accordingly:

```bash
WEBUI_SESSION_COOKIE_SECURE=true
WEBUI_SESSION_COOKIE_SAME_SITE=strict
```

| Variable | Default | What it does |
|---|---|---|
| `WEBUI_SESSION_COOKIE_SECURE` | `false` | When `true`, cookies are only sent over HTTPS connections. |
| `WEBUI_SESSION_COOKIE_SAME_SITE` | `lax` | Controls whether cookies are sent with cross-site requests. `strict` offers the most protection. |

These also apply to OAuth cookies unless overridden with `WEBUI_AUTH_COOKIE_SECURE` and `WEBUI_AUTH_COOKIE_SAME_SITE`.

### Token expiry

JWTs control how long a user stays logged in. The default is `4w` (4 weeks). You can shorten this:

```bash
JWT_EXPIRES_IN=24h
```

Setting `JWT_EXPIRES_IN=-1` disables token expiration entirely. Open WebUI will log a warning if this is set.

### Token revocation

:::warning Token Revocation Requires Redis

Without Redis, **signing out does not invalidate a user's token**. The token remains valid and usable until it expires naturally (default: 4 weeks). This means:

- A stolen or leaked token cannot be revoked by signing out
- Changing a user's password does not invalidate their existing sessions
- Admin-initiated account deactivation does not immediately block access
- OIDC back-channel logout cannot revoke tokens

With Redis configured, Open WebUI supports per-token revocation. When a user signs out, changes their password, or is deactivated by an admin, their token is added to a revocation list that auto-expires. This is the intended production behavior.

**If you cannot deploy Redis**, shorten `JWT_EXPIRES_IN` (e.g., `1h` or `4h`) to limit the window of exposure. See the [Redis tutorial](/tutorials/integrations/redis) for setup instructions.

:::

---

## CORS

Cross-Origin Resource Sharing (CORS) controls which websites can make requests to your Open WebUI API from a browser. For example, if your Open WebUI instance is at `https://chat.yourcompany.com`, CORS determines whether a script running on a different domain can interact with it.

The default `CORS_ALLOW_ORIGIN` is `*`, which allows any origin. Open WebUI logs a warning at startup when this is the case.

To restrict it to your domain:

```bash
CORS_ALLOW_ORIGIN=https://chat.yourcompany.com
```

Multiple origins are separated with semicolons:

```bash
CORS_ALLOW_ORIGIN=https://chat.yourcompany.com;https://internal.yourcompany.com
```

If you use a desktop app with a custom URL scheme, add it via:

```bash
CORS_ALLOW_CUSTOM_SCHEME=app
```

---

## Security Headers

Open WebUI includes a `SecurityHeadersMiddleware` that injects HTTP security headers into responses. None are set by default, so you opt in to each one via environment variables.

The following is a recommended starting configuration for production deployments:

```bash
# HTTP Strict Transport Security: tells browsers to only use HTTPS
HSTS=max-age=31536000;includeSubDomains

# Prevents the page from being embedded in iframes on other sites
XFRAME_OPTIONS=DENY

# Prevents browsers from MIME-type sniffing
XCONTENT_TYPE=nosniff

# Controls how much referrer information is sent with requests
REFERRER_POLICY=strict-origin-when-cross-origin

# Restricts access to browser features
PERMISSIONS_POLICY=camera=(),microphone=(),geolocation=()

# Content Security Policy
CONTENT_SECURITY_POLICY=default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
```

:::tip

If you set a Content Security Policy, start permissive and tighten incrementally. An overly strict CSP will break the frontend. Browser dev tools will show you which resources are being blocked.

:::

---

## HTTPS and TLS

Open WebUI does not terminate TLS itself. Place it behind a reverse proxy (Nginx, Caddy, HAProxy) that handles HTTPS. See the [HTTPS Reference](/reference/https) for step-by-step proxy configurations.

Once HTTPS is in place:

```bash
WEBUI_SESSION_COOKIE_SECURE=true
HSTS=max-age=31536000;includeSubDomains
```

### Trusted proxy IPs

Open WebUI uses `--forwarded-allow-ips` to determine which proxies are trusted to send `X-Forwarded-For` headers. By default, this is set to `*` (trust all), which is appropriate when Open WebUI is on an isolated network behind a single reverse proxy. If your network topology is more complex, restrict it to your proxy's IP:

```bash
FORWARDED_ALLOW_IPS=192.168.1.100
```

---

## OAuth and SSO

If you use an OAuth/OIDC provider for authentication, several options help you control access.

### Domain and group restrictions

```bash
# Only allow users with email addresses from specific domains
OAUTH_ALLOWED_DOMAINS=yourcompany.com

# Block specific IdP groups
OAUTH_BLOCKED_GROUPS='["contractors-external", "temp-accounts"]'
```

### Role mapping

Map IdP roles to Open WebUI roles so access is managed at the identity provider:

```bash
ENABLE_OAUTH_ROLE_MANAGEMENT=true
OAUTH_ROLES_CLAIM=roles
OAUTH_ADMIN_ROLES=admin,superadmin
OAUTH_ALLOWED_ROLES=user,admin,superadmin
```

### Account merging

```bash
OAUTH_MERGE_ACCOUNTS_BY_EMAIL=false
```

When enabled, an OAuth login with an email matching an existing local account will merge the two. **This is not recommended.** It depends on your OAuth provider reliably verifying email addresses. If your provider does not guarantee email verification, a user who controls a matching email could gain access to the existing account — effectively an account takeover. Keep this set to `false` unless you have verified that your provider enforces email verification.

### Session limits

```bash
# Maximum concurrent OAuth sessions per user per provider (default: 10)
OAUTH_MAX_SESSIONS_PER_USER=5

# Enable IdP-initiated back-channel logout (requires Redis)
ENABLE_OAUTH_BACKCHANNEL_LOGOUT=true
```

---

## Trusted Header Authentication

If your reverse proxy handles authentication (Authelia, Authentik, oauth2-proxy), you can pass the authenticated identity to Open WebUI via HTTP headers. **This is possible but risky depending on your setup** — incorrect configuration allows any client to authenticate as any user by forging the header:

```bash
WEBUI_AUTH_TRUSTED_EMAIL_HEADER=X-Forwarded-Email
WEBUI_AUTH_TRUSTED_NAME_HEADER=X-Forwarded-Name
```

:::warning

When using trusted headers, your proxy must strip these headers from incoming client requests before injecting its own values. If the proxy does not strip them, any client can send a forged header and authenticate as any user. This is the most common misconfiguration with trusted header auth. Consult your proxy's documentation for how to strip upstream headers.

:::

---

## LDAP

When using LDAP for authentication, enable TLS to protect credentials in transit:

```bash
ENABLE_LDAP=true
LDAP_USE_TLS=true
LDAP_VALIDATE_CERT=true
LDAP_CA_CERT_FILE=/path/to/ca-cert.pem
```

Without TLS, LDAP credentials are transmitted in plaintext. You can restrict cipher suites with `LDAP_CIPHERS` if needed.

---

## Database

### PostgreSQL

For production deployments, PostgreSQL provides better concurrency and reliability than the default SQLite:

```bash
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui
```

See the [Scaling Guide](/getting-started/advanced-topics/scaling#step-1--switch-to-postgresql) for migration details. Use strong, unique credentials and keep the database on an internal network.

### SQLCipher

For SQLite deployments that need encryption at rest, Open WebUI supports SQLCipher:

```bash
DATABASE_TYPE=sqlite+sqlcipher
```

### Connection pool tuning

For PostgreSQL, tune the connection pool to match your usage:

```bash
DATABASE_POOL_SIZE=15
DATABASE_POOL_MAX_OVERFLOW=20
DATABASE_POOL_TIMEOUT=30
DATABASE_POOL_RECYCLE=3600
```

Total connections across your deployment = pool size x number of instances. Keep this below your PostgreSQL `max_connections` limit (default 100).

---

## API Keys

API keys provide programmatic access to Open WebUI with the same permissions as the user who created them.

```bash
# Enable API key creation (default: disabled for non-admin users)
ENABLE_API_KEYS=true
```

### Endpoint restrictions

You can limit which API routes a key is allowed to call:

```bash
ENABLE_API_KEYS_ENDPOINT_RESTRICTIONS=true
API_KEYS_ALLOWED_ENDPOINTS=/api/chat/completions,/api/v1/models
```

This is useful when distributing keys to external services or automations, where you want to limit what a compromised key can access.

### User permissions

By default, only admins can create API keys. To allow regular users:

```bash
USER_PERMISSIONS_FEATURES_API_KEYS=true
```

---

## Access Control

Open WebUI uses a layered permission system with roles, groups, and per-resource access grants.

### Roles

| Role | Capabilities |
|---|---|
| `admin` | Full system access, user management, all configuration |
| `user` | Chat access, permitted models and resources |
| `pending` | No access until approved by admin |

### Key settings

```bash
# Default role for new users (default: pending)
DEFAULT_USER_ROLE=pending

# Whether admins bypass resource-level access control (default: true)
BYPASS_ADMIN_ACCESS_CONTROL=true

# Whether admins can view all user chats (default: true)
ENABLE_ADMIN_CHAT_ACCESS=true

# Whether all users can access all models regardless of group restrictions (default: false)
BYPASS_MODEL_ACCESS_CONTROL=false
```

### Data sharing and export

Several features control how data can be shared or exported:

```bash
# Allow users to share chats with other authenticated users (default: true)
ENABLE_COMMUNITY_SHARING=true

# Allow admins to bulk export all user chats from the database (default: true)
ENABLE_ADMIN_EXPORT=true

# Allow users to connect directly to model providers with their own API keys,
# bypassing the server-side proxy (default: false)
ENABLE_DIRECT_CONNECTIONS=false
```

`ENABLE_COMMUNITY_SHARING` lets users generate share links for their chats. Any authenticated user with the link can view the chat. If your deployment contains sensitive conversations, consider setting this to `false`.

`ENABLE_DIRECT_CONNECTIONS`, when enabled, allows users to configure their own API keys and model endpoints in the browser. These connections are made from the backend, so the user's API key is sent to the Open WebUI server. This is off by default.

### Workspace permissions

These settings control what regular users can do in the shared workspace:

```bash
USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS=false
USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS=false
USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS=false
USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS=false
```

All default to `false`. Group-level overrides can enable specific permissions for specific user groups.

---

## Audit Logging

Audit logging records API activity for compliance, debugging, and usage analysis. It is disabled by default.

```bash
AUDIT_LOG_LEVEL=METADATA
```

| Level | What is logged |
|---|---|
| `NONE` | Nothing (default) |
| `METADATA` | User, IP, user agent, method, URL, timestamp |
| `REQUEST` | Metadata plus request body |
| `REQUEST_RESPONSE` | Metadata plus request and response bodies |

### Output configuration

```bash
# Write to a file (default path: /app/backend/data/audit.log)
ENABLE_AUDIT_LOGS_FILE=true
AUDIT_LOGS_FILE_PATH=/app/backend/data/audit.log
AUDIT_LOG_FILE_ROTATION_SIZE=10MB

# Also send to stdout, useful for log aggregators
ENABLE_AUDIT_STDOUT=true

# Maximum bytes captured per request/response body (default: 2048)
MAX_BODY_LOG_SIZE=2048
```

### Path filtering

```bash
# Only audit specific paths (whitelist mode)
AUDIT_INCLUDED_PATHS=auths,users,configs

# Exclude specific paths (blacklist mode, default)
AUDIT_EXCLUDED_PATHS=/chats,/chat,/folders
```

Authentication endpoints (signin, signout, signup) are always audited regardless of path exclusions. Passwords in request bodies are automatically redacted.

---

## Network and Outbound Requests

### Outbound TLS

Open WebUI makes outbound HTTPS requests to model APIs, embedding providers, tool servers, and web search services. Certificate verification is on by default:

```bash
REQUESTS_VERIFY=true
AIOHTTP_CLIENT_SESSION_SSL=true
AIOHTTP_CLIENT_SESSION_TOOL_SERVER_SSL=true
ENABLE_WEB_LOADER_SSL_VERIFICATION=true
```

### Offline mode

For air-gapped environments:

```bash
OFFLINE_MODE=true
```

This disables HuggingFace Hub downloads, version update checks, and other outbound calls. Models and embeddings must be available locally.

### SSRF prevention

The RAG web loader can fetch content from URLs. By default, it cannot access local network addresses:

```bash
ENABLE_RAG_LOCAL_WEB_FETCH=false
```

Setting this to `true` allows the web loader to fetch content from private IP ranges, which may be necessary in some environments but introduces SSRF risk.

Open WebUI also blocks cloud provider metadata endpoints by default (AWS `169.254.169.254`, GCP `metadata.google.internal`, Azure `metadata.azure.com`, and Alibaba Cloud `100.100.100.200`). You can extend this blocklist with additional domains or IPs:

```bash
WEB_FETCH_FILTER_LIST=!internal.yourcompany.com,!10.0.0.0/8
```

Prefix entries with `!` to block them.

### File upload limits

By default, there are no size or count limits on uploaded files. To prevent storage exhaustion:

```bash
# Maximum file size in MB (no default limit)
RAG_FILE_MAX_SIZE=50

# Maximum number of files per upload operation (no default limit)
RAG_FILE_MAX_COUNT=10

# Restrict allowed file extensions (empty = all allowed)
RAG_ALLOWED_FILE_EXTENSIONS=.pdf,.txt,.md,.docx,.csv
```

---

## Tools, Functions, and Pipelines

Tools and Functions run arbitrary Python code on your server with the same access as the Open WebUI process. This is fundamental to how they work, and it means they can read files, make network requests, access environment variables, and interact with the database.

For details on the security model, see the [Security Policy](/security#tools-functions-and-pipelines-security).

### Code execution

Open WebUI has two code execution features enabled by default:

```bash
# Allows code blocks in chat responses to be executed (default: true, engine: pyodide)
ENABLE_CODE_EXECUTION=true
CODE_EXECUTION_ENGINE=pyodide

# Allows the model to run code as part of its reasoning (default: true, engine: pyodide)
ENABLE_CODE_INTERPRETER=true
CODE_INTERPRETER_ENGINE=pyodide
```

The default engine is `pyodide`, which runs Python in the browser via WebAssembly and does not execute code on the server. If you switch to Jupyter (`jupyter`), code runs on the Jupyter server, which has server-side access. Secure the Jupyter instance accordingly if using this engine.

### Safe Mode

If a Function causes problems at startup, you can deactivate all Functions by starting in Safe Mode:

```bash
SAFE_MODE=true
```

This lets you access the admin panel and disable the problematic function.

### Dependency installation

Tools and Functions can declare Python dependencies in their frontmatter. By default, these are installed automatically via pip:

```bash
# Set to false to prevent automatic pip installs from tool/function frontmatter
ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS=false
```

### Workspace access

Control who can create, import, and share Tools and Functions:

```bash
USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS=false
USER_PERMISSIONS_WORKSPACE_TOOLS_IMPORT=false
USER_PERMISSIONS_WORKSPACE_SKILLS_ACCESS=false
```

---

## Container Hardening

### Base image

The default Dockerfile uses `python:3.11-slim-bookworm`. If your organization requires a hardened or approved base image, you can swap it by modifying the `FROM` line in the Dockerfile. This is common in enterprise environments that mandate minimal, vulnerability-scanned base images.

### Non-root execution

The Dockerfile supports running as a non-root user:

```bash
docker build --build-arg UID=1000 --build-arg GID=1000 .
```

### OpenShift compatibility

For environments that run containers with arbitrary UIDs (OpenShift):

```bash
docker build --build-arg USE_PERMISSION_HARDENING=true .
```

### Data directory

The data directory (`/app/backend/data`) contains the database, uploaded files, cached plugins, and the auto-generated secret key. Protect this directory with appropriate filesystem permissions and include it in your backup strategy.

### Development features

The Docker image sets `ENV=prod` by default, which disables the Swagger/OpenAPI documentation UI at `/docs`. If running manually, set `ENV=prod` to ensure these endpoints are not exposed.

---

## Observability

### Structured logging

```bash
LOG_FORMAT=json
GLOBAL_LOG_LEVEL=INFO
```

JSON logging is designed for log aggregators like ELK, Datadog, or Splunk.

### OpenTelemetry

```bash
ENABLE_OTEL=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4317
OTEL_SERVICE_NAME=open-webui
```

For complete setup, see [Monitoring](/reference/monitoring) and [Logging Open WebUI](/getting-started/advanced-topics/logging).

---

## SCIM Provisioning

SCIM 2.0 allows your identity provider to automatically manage user accounts:

```bash
ENABLE_SCIM=true
SCIM_TOKEN=your-bearer-token
SCIM_AUTH_PROVIDER=oidc
```

The SCIM token is a static bearer token that grants full user management access. Treat it with the same care as admin credentials, rotate it periodically, and only transmit it over HTTPS.

---

## Keeping Open WebUI Updated

Running the latest version of Open WebUI ensures you have the most recent security patches and fixes. Check the [changelog](https://github.com/open-webui/open-webui/releases) for security-related updates and apply them promptly.

For Docker deployments, pull the latest image and recreate the container:

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

For multi-replica deployments, follow the [rolling update procedure](/troubleshooting/multi-replica#updates-and-migrations) to avoid downtime.

---

## Quick Reference

The table below summarizes the key hardening actions covered in this guide. Each row links to the relevant section for details.

| Action | Default | Recommended for production |
|---|---|---|
| [Keep on private network](#) | No restriction | VPN, firewall, or zero-trust proxy |
| [Serve over HTTPS](#https-and-tls) | HTTP | HTTPS via reverse proxy |
| [Set `WEBUI_SECRET_KEY`](#secret-key) (multi-replica) | Auto-generated | Explicit shared key |
| [Disable open signup](#registration) | `ENABLE_SIGNUP=true` | `ENABLE_SIGNUP=false` |
| [Enable password validation](#password-validation) | Disabled | `ENABLE_PASSWORD_VALIDATION=true` |
| [Secure cookies](#cookie-settings) | `Secure=false`, `SameSite=lax` | `Secure=true`, `SameSite=strict` |
| [Enable token revocation](#token-revocation) | No revocation (no Redis) | Configure Redis or shorten `JWT_EXPIRES_IN` |
| [Restrict CORS](#cors) | `*` | Your specific domain(s) |
| [Set security headers](#security-headers) | None | HSTS, X-Frame-Options, CSP |
| [Restrict OAuth domains](#domain-and-group-restrictions) | All allowed | `OAUTH_ALLOWED_DOMAINS=yourdomain.com` |
| [Enable audit logging](#audit-logging) | `NONE` | `METADATA` or higher |
| [Restrict API key endpoints](#endpoint-restrictions) | All endpoints | `ENABLE_API_KEYS_ENDPOINT_RESTRICTIONS=true` |
| [Disable auto pip install](#dependency-installation) | Enabled | `ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS=false` |
| [Review community sharing](#data-sharing-and-export) | `true` | Disable if sensitive data |
| [Review direct connections](#data-sharing-and-export) | `false` | Keep disabled unless needed |
| [Use PostgreSQL](#postgresql) | SQLite | PostgreSQL |
| [Verify outbound TLS](#outbound-tls) | Enabled | Keep enabled |
| [Enable offline mode](#offline-mode) | Disabled | `OFFLINE_MODE=true` for air-gapped environments |
| [Structured logging](#structured-logging) | Text | `LOG_FORMAT=json` |
| [Keep updated](#keeping-open-webui-updated) | N/A | Latest stable release |
