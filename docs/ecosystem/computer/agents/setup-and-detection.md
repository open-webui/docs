---
title: Set up and detect a coding agent
sidebar_position: 2
---

# Set up and detect a coding agent

Native profiles connect the browser UI to a coding-agent command already present on the Computer host. Detection checks the command, its version, required local dependency where applicable, and whether models can be discovered.

## Use this when

Jules has a Codex, Claude Code, Cursor, Grok, OpenCode, Cline, or Pi subscription and wants to use it from a Computer chat in the same repository.

## Before you start

- Install the agent CLI and complete its normal login on the host, not merely on the phone or browser you will use later.
- Know the executable path if it is not on `PATH`.
- Open **Settings → Admin → Agents** as an administrator.

## Do it

1. Add or edit the profile for the agent.
2. Set its command path; set the agent-specific home path only when the profile needs a non-default login/configuration directory.
3. Run detection, then save the profile after it reports **ready**.
4. Select one of its discovered models in a workspace chat and send a small read-only request.

Detection is deliberately separate from starting a task: it prevents a remote browser session from discovering halfway through work that its host command or login is unavailable.

## Verify it worked

The profile reports **ready**, with the resolved command/version and available models where that backend can discover them. The selected model streams a response in the workspace chat.

## If it did not

- **Command not found:** install the CLI or provide its absolute executable path.
- **Missing dependency:** install the dependency named in the result; Claude Code additionally requires its local SDK support.
- **Auth unknown/no models:** run the agent’s normal login or provider configuration on the host, then detect again.
- **Unsupported app-server capability:** update the agent CLI and rerun detection.

## Trust boundary

Detection starts local commands to inspect their version and capability. A ready profile confirms local availability, not that a task is safe: the agent still receives the active workspace and can be given host tool permissions.
