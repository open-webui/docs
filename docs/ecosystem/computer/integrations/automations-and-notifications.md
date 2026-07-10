---
title: Schedule trusted work and get notified
sidebar_position: 2
---

# Schedule trusted work and get notified

Automations are useful when a repeated check belongs beside the repository and tools that actually perform it: run a test suite, inspect a build result, or prepare a report in a known workspace. They are not a safe way to accept arbitrary instructions from the internet.

## Use this when

Priya wants a known prompt to run on a recurring schedule in one known workspace, then wants a browser, webhook, or bot notification when it finishes or fails.

## Before you start

- Choose a stable workspace, model, and narrowly written prompt.
- Confirm the host stays on and the selected provider/model is available at the scheduled time.
- Configure the notification target first and use its test action.

## Do it

1. Open **Automations**, create an automation, select its workspace/model, write its prompt, and set its schedule.
2. Save it, inspect the shown next run, then use **Run now** before relying on the schedule.
3. In **Settings → Notifications**, create a browser, webhook, or bot target; select the finished/failed events it should receive.
4. Review run history. Pause the automation before changing a broad prompt or replacing its model.

Automations can also have an authenticated webhook trigger. Treat that URL as a secret trigger, revoke it when no longer needed, and do not place it in public clients or issue trackers.

## Verify it worked

The automation displays an upcoming run and **Run now** creates a run-history entry with a linked chat. That proves the agent task launched; open the linked chat and confirm the terminal/test result before treating the run as a pass or failure. The notification target’s test succeeds before you rely on an automatic notification.

## If it did not

Check the schedule’s next-run value, model availability, and run history error. Re-test the notification target and confirm the browser/device permits notifications. If a webhook invocation fails, regenerate the URL rather than weakening authentication.

## Trust boundary

Automations execute with full tool approval/high trust in their configured workspace because no person is present to approve each tool call. Give them only stable, reviewed prompts, models, workspaces, and notification endpoints. Do not use them for untrusted user input, destructive deploys, or a host you cannot monitor.
