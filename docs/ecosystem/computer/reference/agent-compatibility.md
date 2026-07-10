---
title: Agent and feature compatibility
sidebar_position: 3
---

# Agent and feature compatibility

Use this page to identify the host-side requirement behind a model choice. “Supported” means Computer has an adapter path; it does not mean the host already has the program, login, dependency, or entitlement required to use it.

| Backend | What Computer checks | Common corrective action |
|---|---|---|
| API connection | Provider URL, credential, selected model | Correct endpoint/key/model in Connections |
| Codex | Command, app-server capability, available models | Update/install Codex and sign in on the host |
| Claude Code | Command, version, local SDK support, models | Install/update CLI and required SDK, then sign in |
| Cursor | Command, agent setup/login, discoverable models | Complete Cursor CLI setup/login |
| Grok, OpenCode, Cline, Pi | Command and provider/login/model discovery | Configure that agent’s provider/authentication on the host |

Native profiles run through their installed host command. Other terminal agents can still be used in a normal Computer terminal tab even when they are not configured as a native chat backend.

## Use this when

Jules sees an empty model list, a “not found” status, or needs to decide whether a normal terminal workflow is sufficient.

## Before you start

Know which host owns the CLI. A browser connected from a phone cannot supply a CLI installed only on that phone.

## Do it

Run the profile’s detection in **Settings → Admin → Agents**, correct the reported dependency/authentication issue, then rerun detection. Use the native profile for conversational, supervised agent work; use a terminal tab if you want to operate an unsupported or manually controlled CLI directly.

## Verify it worked

Detection is **ready** and at least one intended model is selectable. A short read-only task completes inside the expected workspace.

## If it did not

Use the detection status as the source of truth. Do not replace a missing local login with a random API key unless you deliberately want to switch to the API connection model.

## Trust boundary

Compatibility detection establishes host capability, not security. Every ready native backend still inherits the host account, workspace content, and configured permission mode.
