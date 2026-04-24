---
sidebar_position: 500
title: "API Keys"
---

# 🔑 API Keys

**Programmatic access to Open WebUI, for scripts, bots, and integrations.**

API keys are personal access tokens that let external code call the same endpoints the web UI uses. Anything you can do in a browser - chat completions, model listing, file uploads, RAG queries - your scripts can do with a single `Authorization: Bearer` header. Each key inherits the permissions of the user who created it, so there's no separate permission model to learn.

---

## Why API Keys?

### Automation without a browser

Scripts, CI/CD pipelines, monitoring bots, and third-party tools all need programmatic access. API keys give them a stable credential that doesn't expire with a browser session.

### Same permissions, different interface

An API key acts as you. It inherits your role and group permissions - the same access controls that govern the web UI apply to every API request.

### Revocable and auditable

Name each key descriptively (e.g., "CI Pipeline", "Monitoring Bot") to track usage. Delete a key instantly if it's compromised - no password reset, no session invalidation, just a single click.

---

## Key Features

| | |
| :--- | :--- |
| 🔐 **Bearer token auth** | Standard `Authorization: Bearer` header, works with any HTTP client or SDK |
| 🛡️ **Scoped to user** | Key inherits the creating user's role and group permissions |
| 🚫 **Endpoint restrictions** | Optionally limit which API routes a key can access |
| 👥 **Permission-gated** | Requires a global admin toggle plus per-group feature permission for non-admins |

---

## Getting Started

### Step 1: Enable API Keys Globally (Admin)

1. Log in as an **administrator**
2. Open **Admin Panel > Settings > General**
3. Scroll to the **Authentication** section
4. Toggle **Enable API Keys** on
5. Click **Save**

:::info
This is the global master switch. When it's off, no one - not even admins - can generate keys. When it's on:
- **Admin** users can generate keys immediately
- **Non-admin** users still need the API Keys feature permission (Step 2)
:::

*(Optional)* Enable **API Key Endpoint Restrictions** to limit which routes API keys can call. Specify allowed endpoints as a comma-separated list (e.g., `/api/v1/models,/api/v1/chat/completions`).

### Step 2: Grant Permission to Non-admin Users (Admin)

Non-admin users need the **API Keys** feature permission. Grant it using either method:

#### Option A: Default Permissions (all users)

1. **Admin Panel > Users > Groups > Default Permissions**
2. Under **Features Permissions**, toggle **API Keys** on
3. Click **Save**

:::warning
This grants every user with the "user" role the ability to generate API keys. For tighter control, use Option B.
:::

#### Option B: User Groups (specific users)

1. **Admin Panel > Users > Groups**
2. Select or create a group (e.g., "API Users")
3. Under **Permissions > Features Permissions**, toggle **API Keys** on
4. Click **Save**

:::tip
Create a dedicated "API Users" or "Monitoring" group and add only the accounts that need programmatic access. This follows the principle of least privilege.
:::

### Step 3: Generate a Key

1. Click your **profile icon** (bottom-left sidebar)
2. Select **Settings > Account**
3. In the **API Keys** section, click **Generate New API Key**
4. Give it a descriptive name (e.g., "Monitoring Bot")
5. **Copy the key immediately** - you won't be able to view it again

:::warning
Treat API keys like passwords. Store them in a secrets manager, never commit them to version control, and never share them in public channels. If a key is compromised, delete it immediately and generate a new one.
:::

---

## Using Your API Key

Pass the key as a Bearer token in the `Authorization` header:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://localhost:8080/api/models
```

```python
import requests

response = requests.get(
    "http://localhost:8080/api/models",
    headers={"Authorization": "Bearer YOUR_API_KEY"}
)
print(response.json())
```

For the full endpoint reference - chat completions, Ollama proxy, RAG, file management, and more - see [API Endpoints](/reference/api-endpoints).

### Behind a reverse proxy that consumes `Authorization`?

If Open WebUI sits behind a gateway that uses the `Authorization` header for its own auth (basic auth, SSO sidecar, corporate API gateway, mutual-TLS adapter, etc.), clients can deliver the API key via a dedicated header instead. The middleware checks, in order: `Authorization: Bearer`, the `token` cookie, and a configurable custom header.

The custom header defaults to `x-api-key`, and admins can rename it via the [`CUSTOM_API_KEY_HEADER`](/reference/env-configuration#custom_api_key_header) environment variable to avoid collisions with anything else in the request chain.

```bash
curl -H "X-OpenWebUI-Key: YOUR_API_KEY" \
  http://openwebui.internal/api/models
```

```
# Open WebUI container env
CUSTOM_API_KEY_HEADER=X-OpenWebUI-Key
```

---

## Best Practices

### Dedicated service accounts

Create a **non-admin user** specifically for automation (e.g., `monitoring-bot`, `ci-pipeline`). Generate keys from that account. If a key leaks, the attacker only gets that user's permissions - not admin access.

### Endpoint restrictions

Enable **API Key Endpoint Restrictions** and whitelist only the routes your integration actually needs. A monitoring bot only needs `/api/models` and `/api/chat/completions` - don't give it access to `/api/v1/files/` or admin endpoints.

### Key rotation

Periodically delete old keys and generate new ones, especially for long-lived integrations. Name keys with a date or version to track rotation (`"Monitoring Bot - 2025-Q1"`).

---

## Troubleshooting

**Can't see the API Keys section in Settings > Account?**

- **Check the global toggle:** Verify that an admin has enabled API keys in **Admin Panel > Settings > General > Enable API Keys**. See [`ENABLE_API_KEYS`](/reference/env-configuration#enable_api_keys).
- **Check your permissions (non-admin users):** Verify that your account or group has the **API Keys** feature permission under **Features Permissions**. See [`USER_PERMISSIONS_FEATURES_API_KEYS`](/reference/env-configuration#user_permissions_features_api_keys).

**Getting `401 Unauthorized` responses?**

- Verify the key is formatted correctly: `Authorization: Bearer sk-...`
- Check that the key hasn't been deleted
- If endpoint restrictions are enabled, confirm the route you're calling is in the allowlist

---

## Limitations

### No post-creation viewing

API keys cannot be viewed after creation. If you lose a key, delete it and generate a new one.

### No per-key permissions

Keys inherit the full permissions of the user who created them. You cannot restrict a key to a subset of its owner's permissions (beyond endpoint restrictions).

### No automatic expiration

API keys do not expire automatically. You must manually delete and rotate them.
