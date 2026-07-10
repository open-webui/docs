---
title: Skills and memory
sidebar_position: 6
---

# Skills and memory

Skills help an agent repeat a method you trust. Memory helps it retain durable facts about you or a project. They solve different problems: use a skill for a reusable procedure, and memory for information that should remain useful after the current chat ends. Neither replaces a project file or a direct instruction when that is the source of truth.

## Choose the right kind of context

| If the agent needs... | Use |
| --- | --- |
| “Follow our release checklist every time.” | A skill |
| “This project uses this test command and this naming rule.” | A skill, and optionally a durable memory |
| “Remember my preferred review style.” | Memory |
| One fact only for this task | Say it in the chat or mention the file |

## Add one small skill or memory

1. Put a project-specific `SKILL.md` in the workspace, or use the configured global skill location only for instructions that belong everywhere.
2. Start a chat with real task context, then type `$` to mention a discovered skill.
3. Enable Memory in Settings only if future chats should recall durable user or workspace facts. Review, edit, or delete those entries there.

## Check the result

A discovered skill appears in the `$` suggestions and changes the next task's approach. Memory entries appear in the Memory view and can be inspected or removed. If a skill is missing, confirm its filename and scope; if memory is missing, confirm it is enabled for the intended workspace.

## What to trust

Skills are instructions that can influence tool use, not harmless labels. Memory can be included in later agent context. Do not put passwords, tokens, or temporary sensitive details into either one.
