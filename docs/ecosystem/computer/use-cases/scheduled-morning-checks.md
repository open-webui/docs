---
title: "A morning check that reports to you"
sidebar_position: 12
---

# A morning check that reports to you

Every morning you run the test suite on the side project before work, skim the output, and forget about it. That's a job for a schedule: run the tests at 7:30, and only make noise when something's red.

**You need:** the quickstart done, a [model connected](/ecosystem/computer/ai/), and the host machine [awake at 7:30](/ecosystem/computer/phone-and-remote/keep-it-running).

## The walkthrough

1. **Give it somewhere to reach you.** One-time setup: in **Settings → Notifications**, add a target: a webhook (Slack, Discord, Google Chat, and Teams URLs get formatted automatically) or one of your [messaging bots](/ecosystem/computer/automate/messaging-bots). Hit the test button once.

2. **Ask for it.** In the project workspace chat, say what you want, including when to bother you:

   > Every weekday at 7:30, run the test suite in this workspace. Don't change any files. If anything fails, notify me with the failing test names and the relevant error output. If everything passes, don't ping me.

   The agent creates the scheduled task itself (approve the tool call and it's done). The notify part isn't configuration; the agent has a notify tool and sends to your target only when your condition is met. Red tests buzz your phone; green mornings stay silent.

3. **Rehearse it.** Open the **Scheduled** page: your new task is there with its next-run time. Hit **Run now** and read the run it creates. Every run is a real chat in the workspace, so you can see exactly what it did: the command it ran, the output it read, the decision to notify or stay quiet. If any of that isn't judgeable at a glance, tell the agent to tighten the task now, not after a week of noise.

4. **Let it run.** Run history keeps every morning's result with its linked chat, so "wait, when did that test start failing?" has an answer with receipts. (If you'd rather get a blanket ping for every run, event notifications on **chat finished** / **chat failed** exist too; see [notifications](/ecosystem/computer/automate/notifications).)

The Scheduled page is also where you pause a task, tweak its schedule with the frequency builder, or write one by hand if you prefer forms to sentences.

## What makes this work

Scheduled runs execute with full tool approval and nobody watching, which is exactly why the prompt should be narrow, read-only, and verifiable, and why the run's linked chat matters: you're never trusting a green checkmark, you're reading what actually happened. Once the pattern feels safe, the same recipe covers dependency audits, backup checks, or a nightly "summarize what changed in this repo."

**Go deeper:** [Scheduled tasks](/ecosystem/computer/automate/scheduled-tasks) · [Notifications](/ecosystem/computer/automate/notifications)
