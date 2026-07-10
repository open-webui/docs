---
title: Put a small, predictable job on a schedule
sidebar_position: 4
---

# Put a small, predictable job on a schedule

An automation is a Computer task you set up once and let start at a known time in a chosen workspace. It is useful for the work you would otherwise remember to check: a morning test run, a status report, or a repeatable review of files that are already on your machine.

The point is not to make an agent "handle everything." The point is to come back to a linked chat with evidence from the real workspace, instead of wondering whether a routine job happened.

## A useful first job

If a small service runs from a home-lab machine, a useful morning question is simple: did the existing test suite pass? The test command, repository, and expected evidence already live on that machine. An automation lets you receive an answer without keeping a browser open.

Start with that kind of job: one workspace, one existing command, and one result you can judge in seconds. Do not start with a release, a cleanup, or an open-ended request to improve the project.

## Start with one result you can recognize

Use this when the job has all four of these qualities:

- It belongs in one workspace.
- You know what a good result looks like.
- The instruction can be narrow and repeatable.
- You can safely leave it running without approving individual tool calls.

Good first automations are deliberately boring:

| A useful first job | Why it is a good fit |
| --- | --- |
| Run an existing test command every weekday morning | The command and pass or fail result are easy to recognize. |
| Create a short report from a known folder | The workspace and expected output are bounded. |
| Check whether a local build still completes | You can inspect the same build output you would see at your desk. |

Do not start with "keep this project on track," "clean up anything wrong," or a task that can publish, delete, spend money, or act on incoming messages. Those are vague or high-impact jobs, not a first scheduled task.

## Build it while you are watching

Before you start, choose the exact workspace and model, make sure the host and model can be available at the chosen time, and write down the result you expect to see.

1. Open **Automations** and create an automation.
2. Give it a name that says what it does, such as `Weekday test check`.
3. Select the workspace that contains the files and command it needs. This choice matters more than a clever prompt.
4. Select a model, choose a schedule, and write one bounded instruction. For example:

   ```text
   Run the existing test suite in this workspace. Do not change files. State whether it passed. If it failed, name the failing test and include the relevant error output.
   ```

5. Save it. Check the displayed next-run time, then use the play button, **Run now**, once.

For a test check, add a [notification target](./notifications-and-webhooks) only after the manual run is useful. A notification should tell you to open the linked chat, not replace the evidence in it.

## Read the first run like a rehearsal

Open the new run-history entry and its linked chat. You should be able to see the selected workspace, the task activity, and the terminal or tool output that supports the result.

If the report says the test passed, but the linked chat does not show the test command or its output, improve the prompt or model setup before you schedule it. A successful schedule is not enough. You need a result you can judge later in seconds.

## Decide whether to leave it on

Keep the automation enabled only after its manual run answers all of these:

- Did it use the intended workspace?
- Did it produce the expected linked chat and run-history entry?
- Can you tell success from failure without guessing?
- Would you be comfortable with those exact tools running when you are away?

When any answer is no, pause the automation. Check the next-run time, model connection, and the run-history error; tighten the prompt or fix the model, then repeat **Run now**. Do not leave a failing or ambiguous task enabled and hope the schedule fixes it.

## What you are trusting

Automations are unattended, high-trust work. They run with full tool approval because nobody is present to approve each action. Keep them in a scoped workspace, use constrained prompts, and do not feed them untrusted input. Avoid destructive actions unless you can monitor and recover from them.

For an alert about a run, see [notifications and webhooks](./notifications-and-webhooks). For a recurring task that needs a person to steer the work, begin with [supervise agent work](../agents/supervise-work) instead.
