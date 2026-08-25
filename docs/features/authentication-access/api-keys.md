---
sidebar_position: 500
title: "API Keys"
---

# API Keys

**Programmatic access to Open WebUI, for scripts, bots, and integrations.**

An API key is a personal access token that lets external code call the same endpoints the web UI uses. Anything you can do in a browser - chat completions, model listing, file uploads, RAG queries - your scripts can do with a single `Authorization: Bearer` header. The key acts as the user who created it, so there is no separate permission model to learn.

Each account has exactly **one** API key. Creating a key when you already have one replaces it, and the previous key stops working immediately.

---

## Why API Keys?

### Automation without a browser

Scripts, CI/CD pipelines, monitoring bots, and third-party tools all need programmatic access. An API key gives them a stable credential that does not expire with a browser session.

### Same permissions, different interface

An API key acts as you. It inherits your role and group permissions, and those permissions are re-checked on every single request rather than frozen at the moment the key was created.

### Revocable and auditable

A key can be replaced or removed outright. Creating a new key overwrites the old one, and deleting a key leaves the account with none, so a leaked credential can be retired in one step either way and the change takes effect instantly. There is no password reset and no session invalidation involved. Admins can also kill every key at once by turning the global **API Keys** toggle off, or kill one user's key by removing their feature permission. Key creation and deletion are recorded as authentication events.

---

## Key Features

| | |
| :--- | :--- |
| 🔐 **Bearer token auth** | Standard `Authorization: Bearer` header, works with any HTTP client or SDK |
| 🛡️ **Scoped to user** | Key inherits the creating user's role and group permissions |
| 🚫 **Endpoint restrictions** | Optionally limit which API routes API keys can access |
| 👥 **Permission-gated** | Requires a global admin toggle plus a per-group feature permission for non-admins |

---

## Getting Started

### Step 1: Enable API Keys Globally (Admin)

1. Log in as an **administrator**
2. Open **Settings > Admin > Authentication**
3. Toggle **API Keys** on
4. Click **Save**

:::info
This is the global master switch. When it is off, nobody can create or use a key, not even admins, and keys that already exist stop authenticating. When it is on:
- **Admin** users can create a key immediately
- **Non-admin** users still need the API Keys feature permission (Step 2)
:::

*(Optional)* Enable **API Key Endpoint Restrictions** to limit which routes API keys can call, then list the allowed paths as a comma-separated list (e.g., `/api/v1/models,/api/v1/chat/completions`). The restriction applies to every API key on the instance, not per key.

### Step 2: Grant Permission to Non-admin Users (Admin)

Non-admin users need the **API Keys** feature permission. Grant it using either method:

#### Option A: Default Permissions (all users)

1. **Admin Panel > Users > Groups > Default Permissions**
2. Under **Features Permissions**, toggle **API Keys** on
3. Click **Save**

:::warning
This grants every user with the "user" role the ability to create an API key. For tighter control, use Option B.
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
3. Scroll to the **API keys** section and click **Show** next to **Secrets**
4. Click **Create new secret key**
5. Copy the key with the copy button next to the field

Once a key exists, the menu beside it holds **Create new key**, which replaces it, and **Delete**, which removes it after a confirmation. Deleting leaves the account with no key until you create another, and anything still presenting the old one is refused from that moment.

:::info
The **API keys** section is collapsed by default and shows nothing but a **Show** button until you click it. If you see the heading and no key field, that is the collapsed state, not a permission problem.

Admins see their current **JWT Token** in the same block. That is the browser session token, not an API key, and it expires with the session.
:::

:::warning
Treat your API key like a password. Store it in a secrets manager, never commit it to version control, and never share it in public channels. If it is compromised, create a new key immediately, which overwrites the compromised one.
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

Keys are issued in the form `sk-` followed by 32 hex characters.

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

Because an account only ever holds one key, give every integration its own **non-admin user** (e.g., `monitoring-bot`, `ci-pipeline`) and create the key from that account. One key per account is what lets you rotate or revoke a single integration without breaking the others, and a leaked key only exposes that user's permissions rather than admin access.

### Endpoint restrictions

Enable **API Key Endpoint Restrictions** and list only the routes your integrations actually need. A request is allowed when its path exactly matches an entry or sits under one as a path segment, so `/api/v1/models` also covers `/api/v1/models/anything`. A monitoring bot only needs `/api/models` and `/api/chat/completions`, so do not open up `/api/v1/files/` or admin endpoints. The allowlist is instance-wide, so it has to be the union of what every integration needs.

### Key rotation

Rotate long-lived integrations on a schedule by choosing **Create new key** from the integration's account, which replaces the old key in place. Roll one account at a time and update the consumer straight away, because the previous key is rejected the moment the new one is issued.

Retiring an integration for good is a **Delete** rather than a rotation, since that ends the account's access instead of handing it a fresh credential.

---

## Troubleshooting

**The API keys section in Settings > Account looks empty?**

- **Click Show:** the section is collapsed behind the **Show** button next to **Secrets**. The key field and the **Create new secret key** button only render once it is expanded.

**No API keys section at all in Settings > Account?**

- **Check the global toggle:** verify that an admin has enabled API keys in **Settings > Admin > Authentication**. See [`ENABLE_API_KEYS`](/reference/env-configuration#enable_api_keys).
- **Check your permissions (non-admin users):** verify that your account or group has the **API Keys** feature permission under **Features Permissions**. See [`USER_PERMISSIONS_FEATURES_API_KEYS`](/reference/env-configuration#user_permissions_features_api_keys).

**Getting `401 Unauthorized` responses?**

- Verify the key is formatted correctly: `Authorization: Bearer sk-...`
- Check that the key has not been replaced by a newer one on the same account
- Confirm the account still exists and is not pending

**Getting `403 Forbidden` responses?**

- The global **API Keys** toggle may have been turned off, which invalidates existing keys
- The key's owner may have lost the **API Keys** feature permission
- If endpoint restrictions are enabled, confirm the route you are calling is in the allowlist

---

## Limitations

### One key per account

An account holds a single unnamed key. There is no way to run two keys side by side for the same user, and creating a key always overwrites the existing one. Use a separate account per integration.

### No per-key permissions

A key inherits the full permissions of the user who created it. You cannot restrict a key to a subset of its owner's permissions, and endpoint restrictions apply instance-wide rather than per key.

### No automatic expiration

API keys do not expire. Rotating a key is a manual action, and there is no scheduled or time-based expiry to fall back on.
