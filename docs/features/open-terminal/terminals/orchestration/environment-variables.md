---
sidebar_position: 3
title: "Environment Variables"
---

# Environment Variables

The **Environment variables** of a terminal, under **Advanced** in the [terminal dialog](/features/open-terminal/terminals/orchestration/creating-terminals), are passed into every Open Terminal instance it starts. They are raw strings, not shell commands.

Use raw values in the dialog:

| Desired value inside the container | Enter this in the dialog |
| :--- | :--- |
| `sk-proj-abc` | `sk-proj-abc` |
| `*.pypi.org,github.com` | `*.pypi.org,github.com` |
| `hello world` | `hello world` |
| `"hello world"` including quote characters | `"hello world"` |

Do not add `'` or `"` around a value unless the quote characters are part of the value you want the container to see.

## Forwarding Behavior

Use the terminal's **Environment variables** for values that should appear inside Open Terminal instances. Orchestrator process env vars configure the orchestrator itself. The exception is `OPEN_TERMINAL_SYSTEM_PROMPT` in the orchestrator's own environment: every instance receives it as a default, and a terminal's own value replaces it.

The orchestrator drops `OPEN_TERMINAL_API_KEY` from a terminal's environment variables. It generates a private API key per terminal instance and uses that key to proxy requests.

:::warning
Environment variables are visible to everyone who uses the terminal. Do not put secrets in a terminal unless every person it is shared with may see and use them.
:::

## Common Open Terminal Env Vars

| Variable | Purpose |
| :--- | :--- |
| `OPEN_TERMINAL_ALLOWED_DOMAINS` | Restrict outbound network access, for example `*.pypi.org,github.com` |
| `OPEN_TERMINAL_EXECUTE_TIMEOUT` | Default command wait timeout in seconds |
| `OPEN_TERMINAL_EXECUTE_DESCRIPTION` | Extra tool-description text shown to the model |
| `OPEN_TERMINAL_SYSTEM_PROMPT` | Custom system prompt template |
| `OPEN_TERMINAL_INFO` | Extra environment information appended to the generated prompt |
| `OPEN_TERMINAL_FILE_BROWSER_ROOT` | File-browser visual root. Use `home`, an explicit path such as `/workspace`, or `filesystem` to opt out |
| `OPEN_TERMINAL_PACKAGES` | Space-separated apt packages installed at container startup |
| `OPEN_TERMINAL_PIP_PACKAGES` | Space-separated Python packages installed at container startup |
| `OPEN_TERMINAL_NPM_PACKAGES` | Space-separated npm packages installed globally at container startup |

## Automatically Injected Resource Vars

The orchestrator sets these automatically for each field that is filled in under **CPU** and **Memory**, so a system prompt or tool can read the container's resource budget. They carry the workspace's real limits.

| Variable | Purpose |
| :--- | :--- |
| `OPEN_TERMINAL_CPU_LIMIT` | CPU limit from the terminal's **CPU** |
| `OPEN_TERMINAL_CPU_COUNT` | CPU count derived from the terminal's **CPU** |
| `OPEN_TERMINAL_MEMORY_LIMIT` | Memory limit from the terminal's **Memory** |
| `OPEN_TERMINAL_MEMORY_BYTES` | Memory limit in bytes derived from the terminal's **Memory** |
