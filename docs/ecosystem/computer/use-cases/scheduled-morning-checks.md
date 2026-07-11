---
title: "A morning check that reports to you"
sidebar_position: 12
---

# A morning check that reports to you

Every morning you run the test suite on the side project before work, skim the output, and forget about it. That's a job for a schedule: run the tests at 7:30, and only make noise when something's red.

**You need:** the quickstart done, a [model connected](/ecosystem/computer/ai/), and the host machine [awake at 7:30](/ecosystem/computer/phone-and-remote/keep-it-running).

## The walkthrough

1. **Create the task.** Open the **Scheduled** page and create a task:

   - **Workspace:** the project repo
   - **Model:** whatever you'd use in chat
   - **Schedule:** the builder covers daily/weekly/hourly; under the hood it's an RRULE like `RRULE:FREQ=DAILY;BYHOUR=7;BYMINUTE=30`
   - **Prompt:** be boring and specific:

   > Run the test suite in this workspace. Don't change any files. If everything passes, reply "all green" with the test count. If anything fails, name the failing tests and include the relevant error output.

2. **Rehearse it.** Hit **Run now** and open the run it creates. Every run is a real chat in the workspace, so you can see exactly what it did: the command it ran, the output it read, the summary it wrote. If the summary isn't judgeable at a glance, tighten the prompt now, not after a week of noise.

3. **Wire up the ping.** In **Settings → Notifications**, add a target: a webhook (Slack, Discord, Google Chat, and Teams URLs get formatted automatically) or one of your [messaging bots](/ecosystem/computer/automate/messaging-bots). Pick the **chat failed** and **chat finished** events, set delivery to **away** so it only pings you when you're not already looking at Computer, and use the test button once.

4. **Let it run.** Run history keeps every morning's result with its linked chat, so "wait, when did that test start failing?" has an answer with receipts.

Bonus: you don't have to visit the Scheduled page at all. Ask the agent in chat to "run the tests every weekday at 7:30 and tell me only about failures" and it creates the task itself; review it on the Scheduled page after.

## What makes this work

Scheduled runs execute with full tool approval and nobody watching, which is exactly why the prompt should be narrow, read-only, and verifiable, and why the run's linked chat matters: you're never trusting a green checkmark, you're reading what actually happened. Once the pattern feels safe, the same recipe covers dependency audits, backup checks, or a nightly "summarize what changed in this repo."

**Go deeper:** [Scheduled tasks](/ecosystem/computer/automate/scheduled-tasks) · [Notifications](/ecosystem/computer/automate/notifications)
