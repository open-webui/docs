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

**Your actual computer, available from the browser you have with you.**

Open WebUI Computer runs on a machine you control and gives you its real workspaces: files, terminal sessions, git state, local services, and optional AI agents. It does not copy your project into a new cloud environment. When you open a workspace from another device, you are looking at the same checkout, branch, process, and agent work that were already there.

New here? Start with [Is Open WebUI Computer right for me?](./is-it-right) before learning any product terms.

## Start with the problem in front of you

| If this sounds like you | Start here | You will know it worked when |
| --- | --- | --- |
| **Avery** has never used a terminal or git, but a project already lives on her laptop and she wants to understand whether Computer is useful before changing anything. | [Is Open WebUI Computer right for me?](./is-it-right) | She opens her existing folder locally and sees that Computer did not make a copy somewhere else. |
| **Mira** is a product designer with a live prototype and assets on her Mac; she wants to test it on a real phone and capture feedback without learning a terminal workflow. | [Preview a local app on another device](./use-cases/theo-real-device-preview) | She sees the live prototype on the device and sends a note or link into the same project. |
| **Nora** has ten minutes on a train to investigate a bug in the dirty branch on her home iMac. | [Fix something away from your desk](./use-cases/nora-remote-fix) | Your phone shows the existing branch, terminal output, and changed diff. |
| **Malik** needs to decide what a coding agent should do while he is away from his mini PC. | [Supervise an agent from anywhere](./use-cases/malik-agent-supervision) | You can inspect the existing chat and continue the same task. |
| **Theo** needs to check a local app on a real iPad. | [Preview a local app on another device](./use-cases/theo-real-device-preview) | The live app opens while its original terminal keeps running. |
| **Jules** already uses Open WebUI but needs an AI to work in a particular machine and repository. | [Open WebUI, Computer, or both?](./choose) | You know which product owns the job and why. |
| **Elena** needs a private machine to run a repeatable check and alert her when it fails. | [Run and verify an automation](./integrations/automations-and-notifications) | A manual run creates a linked chat and a test alert arrives. |
| **Ravi** already runs private infrastructure, coding agents, and Open WebUI; he is excited to compose them around his own machine without giving up control of the workspace. | [Connect Open WebUI to a Computer workspace](./integrations/open-webui-gateway) | A bounded workspace appears as a model, with its real activity visible in Computer. |

## Try it locally first

The quickest safe trial stays on the machine in front of you. Install the `cptr` package, start it on localhost, and open one existing project before thinking about remote access or AI providers.

```bash
pip install cptr
cptr run
```

[Try Open WebUI Computer locally →](./getting-started/local-trial)

**Verify it worked:** the command prints a one-time setup URL. Open it on the host, finish setup, choose an existing folder, and create a terminal. If you cannot reach the page, use [install and login troubleshooting](./troubleshooting/install-and-login) before changing network settings.

## What Open WebUI Computer is—and is not

It is a persistent workstation surface and an optional agent harness for the machine where your work already lives. It is useful even with no AI configured.

It is not a disposable cloud IDE, a sandbox around an untrusted user, or a service to expose directly to the public internet. An authenticated user can access the host filesystem and shell, so treat it like an SSH endpoint you own.

[Read the security model →](./remote-access/security-model) · [Learn the core concepts →](./concepts) · [See who it is for →](./personas)

## Use it with Open WebUI

Many people should use both products. Keep Open WebUI as the place to choose models, organize AI conversations, and work with knowledge. Connect Open WebUI Computer when the request must inspect or change the selected workspace on your own machine. The [gateway guide](./integrations/open-webui-gateway) shows the combined workflow and its high-trust boundary.

## Open WebUI Computer vs Open Terminal

Both products can put AI near a terminal, but the starting point is different. **Open Terminal** gives an Open WebUI chat model a computing environment to drive. **Open WebUI Computer** gives you the existing computer you operate—files, terminal, editor, git, and running sessions—with AI as an optional helper.

Choose Open Terminal when the chat AI needs an execution environment. Choose Open WebUI Computer when you need to reach the machine where the work already exists.

## Explore the documentation

- [Get started](./getting-started/local-trial): install, sign in, open a workspace, and return from another device.
- [Is it right for me?](./is-it-right): understand the value in plain language and recognize a bad fit early.
- [Use cases](./use-cases/nora-remote-fix): solve a real interruption, not a toy exercise.
- [Your workspace](./workspace/workspace-paths): files, terminal, git, tabs, browser preview, search, and PWA behavior.
- [AI and coding agents](./agents/models): choose, supervise, and continue agent work in a real workspace.
- [Remote access and security](./remote-access/security-model): reach your machine without pretending it is safe for everyone.
- [Automations and integrations](./integrations/open-webui-gateway): connect Open WebUI, notifications, bots, and external tools.
- [Operate Open WebUI Computer](./operate/data-and-backups): keep state, logs, upgrades, and recovery under control.
- [Reference](./reference/cli-and-storage): exact commands, configuration, permissions, and API contracts.
- [Troubleshooting](./troubleshooting/install-and-login): diagnose a concrete failed verification.

## Next step

Start with [Open WebUI, Open WebUI Computer, or both?](./choose) if you are choosing a product. Otherwise, [try it locally](./getting-started/local-trial) and prove that it can open the workspace you already use.
