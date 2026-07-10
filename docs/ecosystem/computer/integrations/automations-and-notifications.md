---
title: Automations, notifications, and webhooks
sidebar_position: 3
unlisted: true
---

# Automations, notifications, and webhooks

Automations are useful when a repeated check belongs beside the repository and tools that actually perform it: run a test suite, inspect a build result, or prepare a report in a known workspace. Notifications report what happened; authenticated webhooks trigger a known automation. They are not a safe way to accept arbitrary instructions from the internet.

This legacy combined route remains for existing links. Start with [Schedule trusted work](./automations) for the task itself, then add [Notifications and webhooks](./notifications-and-webhooks) for delivery and secret-trigger handling.

## Use this when

Use this when you need a known prompt to run on a recurring schedule in one known workspace, then want a browser, webhook, or bot notification when it finishes or fails.

## Before you start

- Choose a stable workspace, model, and narrowly written prompt.
- Confirm the host stays on and the selected provider/model is available at the scheduled time.
- Configure the notification target first and use its test action.

## Do it

1. Create and validate the task with [Schedule trusted work](./automations).
2. Create and test its delivery or trigger with [Notifications and webhooks](./notifications-and-webhooks).
3. Review run history before enabling a recurring schedule.

Automations can also have an authenticated webhook trigger. Treat that URL as a secret trigger, revoke it when no longer needed, and do not place it in public clients or issue trackers.

## Verify it worked

The automation displays an upcoming run and **Run now** creates a run-history entry with a linked chat. Its notification target’s test succeeds before you rely on an automatic notification.

## If it did not

Check the schedule’s next-run value, model availability, and run history error. Re-test the notification target and confirm the browser/device permits notifications. If a webhook invocation fails, regenerate the URL rather than weakening authentication.

## Trust boundary

Automations execute with full tool approval/high trust in their configured workspace because no person is present to approve each tool call. Give them only stable, reviewed prompts, models, workspaces, and notification endpoints. Do not use them for untrusted user input, destructive deploys, or a host you cannot monitor.
