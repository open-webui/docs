---
sidebar_position: 2
title: "Environment Variables"
---

# Environment Variables

Policy environment variables are passed into the per-user Open Terminal container. They are raw strings, not shell commands.

Use raw values in the Open WebUI admin panel:

| Desired value inside the container | Enter this in the admin panel |
| :--- | :--- |
| `sk-proj-abc` | `sk-proj-abc` |
| `*.pypi.org,github.com` | `*.pypi.org,github.com` |
| `hello world` | `hello world` |
| `"hello world"` including quote characters | `"hello world"` |

Do not add `'` or `"` around a value unless the quote characters are part of the value you want the container to see.

## Forwarding Behavior

Use policy `env` for values that should appear inside per-user Open Terminal containers. Orchestrator process env vars configure the orchestrator itself.

The orchestrator refuses to forward `OPEN_TERMINAL_API_KEY` from policy env. It generates a private API key per terminal instance and uses that key to proxy requests safely.

:::warning
Policy env vars are visible to the user inside their terminal. Do not put secrets in a policy unless users are allowed to see and use them.
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
