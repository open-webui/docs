---
title: Scheduled tasks
sidebar_position: 3
---

# Scheduled tasks

Run a prompt on a schedule: "run the tests every weekday at 9", "summarize new files every Monday", "check the deploy hourly". Each run is a real chat in the workspace you choose, so you can read exactly what happened.

## Create a task

The fastest way is to ask. In any chat, in the workspace where the work should happen:

> Schedule a task that runs the test suite every weekday at 9 and reports failures with the error output.

The agent has a tool for this; approve the tool call and the task exists, workspace and model already set from the chat. Then open the **Scheduled** page to check the next-run time and click **Run now** once before trusting the schedule.

The Scheduled page is also where you create and manage tasks by hand: name, prompt, model, workspace, and a schedule from the frequency builder (hourly, daily, weekly, ...) or a raw RRULE. Schedules are iCalendar RRULEs; the raw field takes anything RRULE supports:

| Schedule | RRULE |
| --- | --- |
| Every day at 09:00 | `RRULE:FREQ=DAILY;BYHOUR=9;BYMINUTE=0` |
| Every Monday | `RRULE:FREQ=WEEKLY;BYDAY=MO` |
| Every hour | `RRULE:FREQ=HOURLY;INTERVAL=1` |
| Once, then never again | `RRULE:FREQ=DAILY;COUNT=1` |

:::info Runs are unattended
Scheduled runs execute with full tool approval: nobody is there to click Allow. Give the task a workspace you're comfortable with and a prompt that says exactly what to do (and what not to).
:::

## What a run produces

Every run creates:

- a **real chat** in the selected workspace, visible in the sidebar with the full task activity, and
- a **run-history entry** on the task showing success or error (with the error text).

To get pinged when a run finishes or fails, add a notification target; see [notifications and webhooks](./notifications).

## Trigger a task with a webhook

Any scheduled task can also be started from outside (CI, a cron job, another service) without a browser session:

1. On the task, generate its webhook URL. It contains a secret token.
2. `POST` to that URL to run the task immediately.
3. Revoke or regenerate the URL anytime if it leaks.

If the POST has a JSON body, the prompt can use it via the `{{webhook_payload}}` placeholder, so a CI failure payload, form submission, or alert can flow straight into the task's instructions.

## A good first task

Name: `Morning test check`. Schedule: `RRULE:FREQ=DAILY;BYHOUR=9;BYMINUTE=0`. Prompt:

```text
Run the test suite in this workspace. Don't change any files.
Report pass or fail; if it failed, include the failing test and error output.
```

Click **Run now**, read the chat it creates, and leave it enabled once the output is something you can judge in a few seconds.
