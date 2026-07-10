---
title: API models or native coding agents
sidebar_position: 1
---

# API models or native coding agents

Open WebUI Computer can run an agent through an API connection, or through a coding agent already installed and signed in on the host. Both work in the selected workspace. The choice is about credentials and control, not a different filesystem.

## Use this when

Use this when you have an OpenAI, Anthropic, Ollama, or OpenAI-compatible endpoint and want a model to inspect or change a project, or already pay for Codex or Claude Code and want that subscription to work in the browser without adding an API key.

## Before you start

- Open a workspace that contains the files the agent should work on.
- For an API model, have its base URL and credential ready.
- For a native coding agent, install and sign in to its CLI on the same host that runs Open WebUI Computer.

## Do it

1. Add an API connection in **Settings → Connections**, or add a native profile in **Settings → Admin → Agents**.
2. Pick the resulting model in the chat model selector.
3. Start with a bounded request: “Read `README.md` and explain the test command. Do not change files.”

Use an API model when you need a provider or local endpoint that is not one of the installed coding-agent backends. Use a native profile for Codex, Claude Code, Cursor, Grok, OpenCode, Cline, or Pi when the host already has its subscription and login. Native profiles are host programs: they can expose the models available to that account and may have their own provider-side permissions.

## Verify it worked

The chosen model appears in the selector and the response identifies a real file in the active workspace. A native profile also shows a ready detection result before you select it.

## If it did not

For API models, recheck the connection URL, credential, and model name in **Connections**. For native models, follow [set up and detect a coding agent](./setup-and-detection); a model that is missing from the selector is not a workspace problem.

## Trust boundary

An API model sends the prompt, selected context, and tool results to its provider. A native agent runs on the host under its installed login. Either can receive workspace content and can be allowed to invoke tools, so use only providers and host accounts you trust.
