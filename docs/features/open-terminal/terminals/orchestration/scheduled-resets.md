---
sidebar_position: 5
title: "Scheduled Resets"
---

# Scheduled Resets

Each orchestrated terminal can keep persisted files across idle cleanup and container recreation.

- Docker stores files under the orchestrator's `TERMINALS_DATA_DIR`.
- Kubernetes `per-user` mode gives each user/policy a PVC.
- Kubernetes `shared` and `shared-rwo` use a shared PVC with a per-user subpath.

Configure policy lifecycle when users should periodically return to a clean set of terminal files. Lifecycle config is separate from policy config because it describes maintenance over time, not the terminal environment that gets provisioned.

```bash
curl -X PUT http://terminals-orchestrator:3000/api/v1/policies/training-lab/lifecycle \
  -H "Authorization: Bearer $TERMINALS_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "reset": {
      "schedule": "@weekly",
      "timezone": "UTC"
    }
  }'
```

## Reset Schedules

Supported schedules:

| Schedule | Meaning |
| :--- | :--- |
| `2026-07-01T09:00:00Z` | One-time reset at an exact datetime |
| `@weekly` | Weekly reset at 00:00 Sunday in the configured timezone |
| `@monthly` | Monthly reset at 00:00 on the first day of the month |
| `0 3 * * 1` | Standard 5-field cron expression |

Set `reset.timezone` to control cron-like schedules. Use `UTC` unless your reset policy is tied to a local operating schedule.

## When Reset Happens

Resets are idle-safe.

When a reset becomes due, the orchestrator waits until the user's terminal is not running or has been reaped by idle timeout. It then deletes the contents of the persisted terminal file storage.

The reset does not delete:

- the policy
- the Open WebUI connection
- the user's account
- the terminal image

## Manual Reset During Refresh

You can also reset persisted terminal files while refreshing:

```json
{
  "policy_id": "training-lab",
  "only_idle": true,
  "reset": true
}
```

Keep `only_idle` enabled for normal operations so users are not interrupted while actively working.
