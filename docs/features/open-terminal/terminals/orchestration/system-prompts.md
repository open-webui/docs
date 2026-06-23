---
sidebar_position: 6
title: "System Prompts"
---

# System Prompts

Open Terminal provides a generated system prompt by default. It includes runtime details such as operating system, kernel, architecture, hostname, user, shell, and Python version.

Set `OPEN_TERMINAL_SYSTEM_PROMPT` to replace that generated prompt with your own template.

## Placeholders

These placeholders are expanded inside `OPEN_TERMINAL_SYSTEM_PROMPT`:

| Placeholder | Value |
| :--- | :--- |
| `{{os}}` | Operating system name |
| `{{kernel}}` | Kernel or OS release |
| `{{arch}}` | Machine architecture |
| `{{hostname}}` | Container hostname |
| `{{user}}` | Runtime user when available |
| `{{shell}}` | Shell path |
| `{{python_version}}` | Python version |
| `{{home}}` | Runtime home directory |

Unknown placeholders are left unchanged.

Example:

```text
You are working in {{home}} on {{os}} {{kernel}}.
Use {{shell}} for terminal examples.
```

## OPEN_TERMINAL_INFO

Use `OPEN_TERMINAL_INFO` when you want to keep the generated prompt and append operator-provided context, such as installed tools, lab instructions, or environment notes.

Use `OPEN_TERMINAL_SYSTEM_PROMPT` when you want to replace the generated prompt completely.
