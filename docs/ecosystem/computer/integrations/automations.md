---
title: Schedule trusted work
sidebar_position: 4
---

# Schedule trusted work

Schedule a known task when its prompt, workspace, model, and expected output are stable. A good first automation runs one focused test or produces one report. It is not a substitute for reviewing a vague instruction later.

## Use this when

You need a recurring task to run in one workspace, such as a morning test, build check, or report.

## Before you start

- Choose the exact workspace, model, schedule, and bounded prompt.
- Confirm the host and model will be available at the scheduled time.

## Do it

1. Open **Automations** and create the task with its workspace, model, prompt, and schedule.
2. Save it, inspect the displayed next run, then use **Run now**.
3. Open the resulting run-history entry and linked chat before enabling recurring use.

## Verify it worked

**Run now** produces a run-history entry and linked chat. Read the chat's terminal/test output to establish what a successful future run looks like.

## If it did not

Check the next-run value, the model connection, and the run-history error. Pause the automation while correcting its prompt or model; do not leave a failing task enabled.

## Trust boundary

Automations run with full tool approval/high trust because no person is present to approve tools. Never feed them untrusted input or use them for destructive actions you cannot monitor.
