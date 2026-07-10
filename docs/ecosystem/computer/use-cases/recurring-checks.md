---
title: "Run recurring checks with a real workspace"
sidebar_position: 8
---

# Run recurring checks with a real workspace

Use this when a repeated check belongs beside the repository and tools that actually perform it: a test suite, build report, or known maintenance task. Open WebUI Computer runs the work in the chosen workspace instead of a generic chat with no local context or a separate automation environment that must be kept in sync.

## Use this when

You want a narrow, reviewed prompt to run on a schedule and alert you about completion or failure. Start with a task that is safe to repeat and has an observable outcome.

## Before you start

- Complete the [local trial](/ecosystem/computer/getting-started/local-trial) and [first workspace](/ecosystem/computer/getting-started/first-workspace), then confirm the task works manually in the selected workspace.
- Choose a stable workspace, model, short prompt, and notification target.
- Treat automations as high-trust: they can use tools without someone present to approve every action.

## Do it

1. Open **Automations**, create the task, choose its workspace and model, write the constrained prompt, and set a schedule.
2. Save it and use **Run now** before trusting the schedule.
3. Configure a browser, webhook, or bot notification target and use its test action.
4. Review run history before widening the prompt, changing the model, or allowing it to perform a more consequential task.

## Verify it worked

**Run now** creates a run-history entry with a linked workspace chat or result. The notification test succeeds, and a completed or failed run produces the selected notification. Only then is the schedule worth relying on.

## If it did not

- Check the next-run value, selected workspace, model availability, and error shown in run history.
- Re-test the notification target and confirm the device/browser permits notifications.
- If a webhook trigger fails, regenerate its secret URL instead of weakening its authentication.

## Trust boundary

An automation runs without interactive per-tool approval. Give it only a stable workspace, reviewed prompt, trusted model, and narrowly scoped notification endpoint. Do not feed it untrusted input or use it for destructive deployment work.
