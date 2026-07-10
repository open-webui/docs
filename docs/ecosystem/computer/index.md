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

**A private browser workspace for the computer where your work already is.**

Your files, project, local app, terminal, and an agent already working on them do not disappear when you leave your desk. Open WebUI Computer lets you reach that same machine from another browser. You see the work as it is, not a copied project, a fresh cloud machine, or a chat that has to be brought up to speed.

## Start with the interruption you want to avoid

### “The thing I need is on my computer, but I only have my phone.”

Open the existing folder, terminal, and running app from another device. Check what is true before you decide whether the interruption needs your full desk session.

[See the remote-workspace path](./use-cases/remote-fix)

### “An agent is working, but it needs my judgment.”

See its activity and the real changes in the selected workspace. Give it a narrow instruction, review the result, and continue the same work later.

[See agent supervision](./use-cases/agent-supervision)

### “I need to review something real, not a screenshot or a recreated demo.”

Open the prototype, files, note, image, document, or recording already on the host. Keep feedback beside the work instead of scattering it across devices and chats.

[See file review and feedback](./use-cases/review-and-share-feedback)

For more paths, including recurring checks, on-call triage, local-device preview, and Open WebUI workflows, visit [real jobs Computer can solve](./use-cases/).

## Why this is different

| Without Computer | With Computer |
| --- | --- |
| Recreate context: find the right files, restart a service, locate the terminal, and explain the job again. | Reopen the machine where the useful context already exists. |
| A chat AI can help, but it does not naturally have your local project or running application. | A configured agent can work in one selected real workspace beside the files and tools you already use. |
| SSH and remote desktop can reach the host, but are clumsy for reviewing a diff, checking an app, or steering work from a phone. | A browser workspace brings together files, git, terminals, previews, chats, and agent activity. |

## What Open WebUI Computer is

Computer is a private control surface for work on one machine you operate. It keeps a chosen workspace, its files, terminal and git state, supported agents, and their review history together. It is a self-hosted personal agent platform, not an adapter that turns every installed agent CLI into a first-class backend, and not a shared isolated computer service.

It is useful with no AI at all. Add a model, coding-agent subscription, browser tool, automation, bot, or external tool only when that improves a job you actually have. Each extra connection brings its own data and trust boundary.

## Your first proof should be small

Run it locally, open one familiar folder, and confirm that you can see the real files. No remote access, AI provider, bot, or automation is required for this first check.

You need permission to run one install command on the machine that holds the work. If it is not your machine, ask its owner to do the local setup with you. You do not need to know git or use a terminal after the initial install.

[Try it locally](./getting-started/local-trial)

## Choose the path that fits how you work

| You are here because… | Start here |
| --- | --- |
| You are new to self-hosting, terminals, and agents | [Is Computer right for me?](./is-it-right) |
| You make or review visual work, school work, research, or independent projects | [Explore real jobs](./use-cases/) |
| You use a coding agent or want an AI to work in a real project | [AI and coding agents](./agents/) |
| You already use Open WebUI | [Open WebUI, Computer, or both?](./choose) |
| You are evaluating personal-agent tools such as Hermes Agent or OpenClaw | [Can Computer manage the agent CLI I already use?](./choose#can-computer-manage-the-agent-cli-i-already-use) |
| You need remote access, backups, or a full security model before adopting it | [Remote access and security](./remote-access/) |

## Open WebUI, Computer, or both?

Open WebUI is an AI interface and workflow platform that works well for one person and scales naturally to shared models, knowledge, prompts, and workflows. Open WebUI Computer is for the particular machine where personal work is alive. Use both when you want Open WebUI's conversation interface while Computer's configured model or agent performs work in one real workspace.

[Choose the right product for the job](./choose)

## Open WebUI Computer vs Open Terminal

Open Terminal gives an Open WebUI chat model a computing environment to drive. Open WebUI Computer gives you the existing computer you already operate, including its files, terminal, editor, git state, and running sessions. Choose Open Terminal when a chat needs somewhere to execute. Choose Computer when the machine with the useful context already exists.

## Keep it private

Computer runs on a machine you control. Its core workspace needs no managed cloud account, cloud control plane, or AI provider. An authenticated user can access the host filesystem and shell, so treat remote access like private SSH, not a public web app. It is a strong fit for one trusted owner, not for giving untrusted people separate isolated machines.

[Read the security model](./remote-access/security-model)
