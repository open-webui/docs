---
sidebar_position: 8
title: "API and Troubleshooting"
---

# API and Troubleshooting

All orchestrator policy and lifecycle endpoints require:

```http
Authorization: Bearer {TERMINALS_API_KEY}
```

## Policy API

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/v1/policies` | List policies |
| `POST` | `/api/v1/policies` | Create a policy |
| `GET` | `/api/v1/policies/{policy_id}` | Read a policy |
| `PUT` | `/api/v1/policies/{policy_id}` | Create or update a policy |
| `DELETE` | `/api/v1/policies/{policy_id}` | Delete a policy |

Example policy payload:

```json
{
  "image": "ghcr.io/acme/open-terminal:python-ds",
  "cpu_limit": "4",
  "memory_limit": "16Gi",
  "storage": "20Gi",
  "storage_mode": "per-user",
  "env": {
    "OPEN_TERMINAL_ALLOWED_DOMAINS": "*.pypi.org,github.com",
    "OPEN_TERMINAL_SYSTEM_PROMPT": "You are working on {{os}} at {{home}}."
  },
  "idle_timeout_minutes": 60
}
```

## Policy Lifecycle API

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `GET` | `/api/v1/policies/{policy_id}/lifecycle` | Read policy lifecycle config |
| `PUT` | `/api/v1/policies/{policy_id}/lifecycle` | Create or update policy lifecycle config |

Example lifecycle payload:

```json
{
  "reset": {
    "schedule": "@weekly",
    "timezone": "UTC"
  }
}
```

## Refresh API

| Method | Endpoint | Purpose |
| :--- | :--- | :--- |
| `POST` | `/api/v1/terminals/refresh` | Stop matching terminals so they provision fresh next time |

Request body:

```json
{
  "user_id": "optional-user-id",
  "policy_id": "optional-policy-id",
  "only_idle": true,
  "reset": false
}
```

`only_idle` defaults to `true`. `reset` defaults to `false`.

## Troubleshooting

### Do I need quotes around env vars?

No. Enter the value exactly as the container should receive it. Quotes are only needed when quote characters are part of the intended value.

### Can I pass env vars to the orchestrator and have it forward them?

Use policy `env` for values that should appear inside per-user Open Terminal containers. Orchestrator process env vars configure the orchestrator itself.

### Why did my env var or image change not apply?

The user probably already had a running terminal. Save the policy, then refresh matching terminals or wait for idle teardown.

### Why can users no longer browse to `/etc` in the file browser?

For orchestrated terminals, the file browser intentionally starts inside the root reported by Open Terminal and hides parents above that root. By default that root is `Home`. This prevents confusing support cases. It is not a security boundary.

To use a different visual root, set `OPEN_TERMINAL_FILE_BROWSER_ROOT` to an explicit path such as `/workspace`. To opt out, set `OPEN_TERMINAL_FILE_BROWSER_ROOT=filesystem` in policy `env` and refresh affected terminals.
