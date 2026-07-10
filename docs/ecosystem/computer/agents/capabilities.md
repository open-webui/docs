---
title: Skills, memory, sub-agents, web, voice, and images
sidebar_position: 5
---

# Extend an agent’s useful context

## Use this when

Rina repeats a workflow, wants the agent to remember durable project facts, needs parallel investigation, or wants to supply web, voice, or image input rather than typing everything.

## Before you start

- Connect any required model, search, speech, image, browser, MCP, or OpenAPI provider in Settings.
- Decide whether the task may leave the host: web search, hosted speech/image APIs, and browser automation have their own external endpoints.
- Keep reusable skills in a workspace when they are project-specific; use global skills only for instructions you want available everywhere.

## Do it

1. Add a `SKILL.md` to the workspace or a configured global location; type `$` in chat to mention a discovered skill.
2. Enable Memory in Settings when durable user/project facts should be recalled in future chats. Review, edit, or delete memories there.
3. Ask for parallel investigation only when each subtask is independent; sub-agent work is represented as inspectable chat work.
4. Use web search/browser tools for current external facts, voice for hands-free chat or memos, and image features for supported image input or generation/editing.

## Verify it worked

A skill appears in the `$` suggestions and its instructions affect the next task. Memory items are visible in the Memory view. A sub-agent produces a distinct result/chat; web/browser, voice, or image output appears as a tool/result row or saved workspace artifact.

## If it did not

Check the file is named `SKILL.md` and is in a discovered scope, then start a chat with real prior context before trying skill authoring. For memory, confirm it is enabled and review settings. For media/web failures, check the configured endpoint/credential and the host’s browser availability.

## Trust boundary

Skills are executable guidance, not harmless labels: they can steer an agent toward tools. Sub-agents receive full tool access for their workspace task. Web, browser, speech, and image integrations can disclose prompt content or captured data to their configured providers.
