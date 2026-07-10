---
title: "Open WebUI Computer"
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open WebUI Computer

<ThemedImage
  alt="Open WebUI Computer showing a real workspace from a desktop and phone"
  sources={{
    light: useBaseUrl('/images/banners/computer-light.svg'),
    dark: useBaseUrl('/images/banners/computer-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Your project is on your computer. Open WebUI Computer lets you reach that same project from the browser in your hand.**

Imagine your website is running on the computer at home. Its files are there. A task may already be running. You only have your phone. Open WebUI Computer lets you open that **same computer** in a browser. It is not a copy of your project and it is not a blank cloud workspace.

You can see the real files, the real app, the real terminal, and the real progress of an optional AI agent. Pick up the work, check it, guide it, or leave it alone until you are back at your desk.

## Why set up one more thing?

| Without Computer | With Computer |
| --- | --- | --- |
| You recreate context: clone a repo, find the correct branch, restart a service, explain the task again. | You reopen the machine where that context already exists. |
| You can use a chat AI, but it does not naturally have your local files, running app, or browser state. | An optional agent works in the selected real workspace, beside the files and tools you already use. |
| You can SSH or remote-desktop into the host, but it is awkward to inspect a diff, preview an app, or guide an agent from a phone. | You get a mobile-first workspace for files, git, terminals, previews, and agent activity. |
| You stop a small interruption until you can get back to the desk. | You can check the build, review a change, test the app, or answer an agent in a few minutes. |

## See a real job it can solve

Open WebUI Computer is worth installing only if it removes a real interruption or keeps useful work continuous. Browse [real use cases](./use-cases/) before you install it:

- Fix an issue, inspect a log, or check a dirty branch from another device.
- Resume a workspace exactly where you left it.
- Supervise an AI coding task in the actual repository.
- Test a local app or prototype on a real phone or tablet.
- Turn feedback, a note, a file, or a voice memo into context in the same project.
- Triage an on-call interruption, run a recurring check, or use Open WebUI to direct work in a real workspace.

## Start where you are

| If you are... | Start here | What Computer adds |
| --- | --- | --- |
| New to terminals, agents, and self-hosting | [Is it right for me?](./is-it-right) | A local proof that you can see the project you already have, before networking or AI setup. |
| A designer, student, or maker with a live prototype | [Test a local app on a real device](./use-cases/real-device-preview) | The real running prototype and its files, not a screenshot or recreated demo. |
| A developer already using Codex, Claude Code, Cursor, Grok, OpenCode, Cline, or Pi | [AI and coding agents](./agents/) | A browser workspace around the same repository, terminal, git state, and agent session. |
| An Open WebUI user | [Open WebUI, Computer, or both?](./choose) | An optional real-machine workspace behind the AI experience you already use. |
| Comparing agent products such as Hermes Agent or OpenClaw | [What makes Computer different](./choose#for-agent-native-users) | An agent platform rooted in a personal machine and persistent workspace, not a detached agent conversation. |
| A senior engineer or operator | [Remote access and security](./remote-access/) | The actual trust model, persistence, API, logging, and operational boundaries before you adopt it. |

For advanced users, Computer is a workspace-centered control surface for the supported agents, tools, automations, and integrations you connect. You can call that a meta-harness, but the important boundary is simpler: **each task is attached to the Computer workspace selected for it.** Check that workspace before trusting an automation, bot, or gateway request.

## Try the smallest useful version

The first trial stays on the machine in front of you. It needs no remote network, AI key, agent, bot, or account with another service. Start it locally, open one existing folder, and decide whether seeing your real project this way is useful.

[Try Open WebUI Computer locally →](./getting-started/local-trial)

If you have never used a terminal or git, start with [is it right for me?](./is-it-right). It explains the value in plain language and tells you when to stop.

## Run it on your terms

Open WebUI Computer is self-hosted. It runs on a machine you control, and its core workspace does not require a managed cloud account, cloud control plane, or AI provider. Your application state stays on that machine in `~/.cptr` by default, or in the Docker `/data` volume.

You can add model APIs, coding-agent subscriptions, search, git remotes, messaging, and external tools when they are useful. Those services have their own network and data boundaries. The core value remains available without them: your files, terminal, git, editor, and local apps stay on your computer.

## Use Open WebUI and Computer together

Use Open WebUI when you want an AI conversation, models, knowledge, prompts, or team workflows. Use Open WebUI Computer when the work must touch your personal machine. Use both when you want Open WebUI as the AI surface and Computer as the real workspace where the action happens.

[Choose Open WebUI, Computer, or both →](./choose)

## Open WebUI Computer vs Open Terminal

Both products can put AI near a terminal, but the starting point is different. **Open Terminal** gives an Open WebUI chat model a computing environment to drive. **Open WebUI Computer** gives you the existing computer you operate: files, terminal, editor, git, and running sessions, with AI as an optional helper.

Choose Open Terminal when the chat AI needs an execution environment. Choose Open WebUI Computer when you need to reach the machine where the work already exists.

## Is it for you?

It is a strong fit if the project, app, terminal, files, or AI work you care about already exists on a machine you control. It is not the right fit if you need a disposable cloud environment, safely isolated machines for untrusted people, or a public shell service.

Read [the fit guide](./is-it-right) before exposing it remotely. An authenticated user can access the host filesystem and shell, so treat it like private SSH, not a public web app.
