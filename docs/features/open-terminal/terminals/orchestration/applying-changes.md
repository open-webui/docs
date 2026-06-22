---
sidebar_position: 3
title: "Applying Changes"
---

# Applying Changes

Policy changes apply when a terminal is newly provisioned. They do not rewrite a container that is already running.

This affects image changes, env var changes, resource changes, storage changes, and reset settings.

You do not need to restart the orchestrator for policy image or env changes. Save the policy, then refresh the affected user terminals. Restart the orchestrator only when you change the orchestrator deployment itself.

## Refresh Terminals

After changing a policy, refresh matching terminals:

```bash
curl -X POST http://terminals-orchestrator:3000/api/v1/terminals/refresh \
  -H "Authorization: Bearer $TERMINALS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "policy_id": "data-science",
    "only_idle": true
  }'
```

`only_idle` defaults to `true`, so active users are not interrupted. Set it to `false` only when you intentionally want to stop matching running terminals immediately.

To refresh one user's terminal:

```json
{
  "user_id": "user-123",
  "policy_id": "data-science"
}
```

To also wipe persisted terminal files during refresh:

```json
{
  "policy_id": "training-lab",
  "only_idle": true,
  "reset": true
}
```
