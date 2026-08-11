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

To refresh one user's terminals:

```json
{
  "user_id": "user-123",
  "policy_id": "data-science"
}
```

That covers every terminal the user has under that policy. On a connection using [Terminal Contexts](/features/open-terminal/terminals/orchestration/contexts) they have more than one, so add `context_id` to refresh just one of them:

```json
{
  "user_id": "user-123",
  "policy_id": "data-science",
  "context_id": "chat:0f3c1a2b-7d55-4a19-9c0e-2b8f6d4e1a37"
}
```

Use `default` for the shared terminal, `chat:<chat-id>` for one chat's terminal and `automation:<automation-id>` for one automation's terminal.

To also wipe persisted terminal files during refresh:

```json
{
  "policy_id": "training-lab",
  "only_idle": true,
  "reset": true
}
```
