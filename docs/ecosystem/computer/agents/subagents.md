---
title: Sub-agents for independent work
sidebar_position: 7
---

# Sub-agents for independent work

Sub-agents are useful when one task naturally separates into independent questions, such as checking tests, locating affected files, and reviewing a deployment log. They are not useful when each step depends on the previous answer. In that case, one supervised agent is easier to understand and safer to review.

## Decide whether to split the task

Split work when each assignment has a clear output and does not need to edit the same files. Keep one task when it needs a shared plan, a single decision, or a sequential change.

## Start with a reviewable request

1. State the parent goal and the independent questions, for example: “Find the failing test, identify callers, and inspect recent log errors. Do not edit files.”
2. Ask the agent to delegate only those independent questions.
3. Read the returned results and open the related work before approving a change in the main task.

## Check the result

Each sub-agent produces an inspectable result or chat record. The main task can summarize those findings without losing the selected workspace. If results are incomplete or overlap, cancel the unnecessary work and continue with one bounded task rather than adding more workers.

## What to trust

Sub-agents can use the workspace tools available to their task. More workers do not create isolation, and they can multiply external requests or conflicting edits. Keep write work sequential unless the files and outcomes are genuinely separate.
