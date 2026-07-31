---
title: "Open Terminal & Terminals"
sidebar_position: 2
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open Terminal & Terminals

<ThemedImage
  alt="Open Terminal: the Open WebUI core driving a real computer substrate for agent work"
  sources={{
    light: useBaseUrl('/images/banners/terminal-light.svg'),
    dark: useBaseUrl('/images/banners/terminal-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Turn Open WebUI into an agentic workbench: tool use plus a stateful computer substrate where the model can write files, run commands, observe results, recover from errors, and return artifacts.**

[Open Terminal](/features/open-terminal) is the computer substrate for Open WebUI agents: files, shell, package manager, running processes, document and data handling, generated artifacts, and live previews. It is named after the terminal, but the point is broader than a shell panel. It gives the model a stateful workspace where it can create, run, inspect, repair, and hand back something usable.

Use it when a chat needs more than a text answer: analyze a spreadsheet, write a script, build a small app, render a report, inspect logs, run tests, organize files, or start a server and preview the result. Open WebUI stays the interface; Open Terminal gives the agent a workspace where those results can actually be produced.

[Terminals](/features/open-terminal/terminals/) is the enterprise orchestrator for Open Terminal. It turns one agent workspace into a managed fleet: separate workspaces per user and policy, controlled images, resource limits, storage, environment variables, security context, idle cleanup, refreshes, and scheduled resets.

:::tip Looking for your own machine in a browser?
Open Terminal gives **AI** an execution workspace inside Open WebUI. [Open WebUI Computer](/ecosystem/computer) gives **you** your real machine in a browser: files, editor, terminal, git, and optional AI. See [Computer, Open WebUI, or Open Terminal?](/ecosystem/computer/choose) for the short comparison.
:::

## The Familiar Words

If you have heard people talk about agentic workflows, tool use, computer use, runtimes, guardrails, and orchestration, this is where Open Terminal and Terminals fit.

| Term people use | What it means here |
| :--- | :--- |
| **Agentic workflow** | The model plans, takes an action, observes the result, and keeps going instead of returning one static answer |
| **Tool use / function calling** | Open WebUI lets the model call tools; Open Terminal gives those tools a real filesystem, shell, and process environment |
| **Computer use** | The agent works inside a computer-like workspace: files, commands, packages, previews, and generated artifacts |
| **Agent runtime** | Open Terminal is the execution runtime where stateful, tool-heavy work happens between model calls |
| **Stateful session** | The workspace keeps files, output, processes, and task context around long enough for multi-step work |
| **Guardrails / human review** | Open WebUI controls the user, model, tool, and approval layer; Terminals controls the workspace boundary by policy |
| **Orchestration** | Terminals provisions, routes, isolates, refreshes, and cleans up Open Terminal workspaces for teams |
| **Observability / auditability** | Admins can reason about which user, policy, workspace, image, limits, and lifecycle produced a result |

## Start With Open Terminal

| I want to... | Go to |
| :--- | :--- |
| Understand the product positioning | [Open Terminal overview](/features/open-terminal) |
| Install Open Terminal | [Installation](/features/open-terminal/setup/installation) |
| Connect it to Open WebUI | [Connecting](/features/open-terminal/setup/connecting) |
| Browse, upload, preview, and edit files | [File browser](/features/open-terminal/file-browser) |
| Run code and debug scripts | [Code execution](/features/open-terminal/use-cases/code-execution) |
| Work on software projects | [Software development](/features/open-terminal/use-cases/software-development) |
| Analyze documents and data | [Document and data analysis](/features/open-terminal/use-cases/file-analysis) |
| Build and preview web apps | [Web development](/features/open-terminal/use-cases/web-development) |
| Automate folders and system tasks | [System automation](/features/open-terminal/use-cases/system-automation) |
| See more complete workflows | [Advanced workflows](/features/open-terminal/use-cases/advanced-workflows) |

## Scale With Terminals

Use Terminals when agent workspaces need to be provisioned, isolated, reused, refreshed, and reset by policy instead of hand-wired one environment at a time.

| I want to... | Go to |
| :--- | :--- |
| Read the Terminals overview | [Terminals overview](/features/open-terminal/terminals/) |
| Understand the provisioning flow | [Orchestration](/features/open-terminal/terminals/orchestration) |
| Configure images, resources, storage, env vars, and idle timeout | [Policies](/features/open-terminal/terminals/orchestration/policies) |
| Understand env var forwarding and reserved keys | [Environment variables](/features/open-terminal/terminals/orchestration/environment-variables) |
| Build and roll out custom workspace images | [Custom images](/features/open-terminal/terminals/orchestration/custom-images) |
| Refresh users after policy changes | [Applying changes](/features/open-terminal/terminals/orchestration/applying-changes) |
| Reset persisted workspaces on a schedule | [Scheduled resets](/features/open-terminal/terminals/orchestration/scheduled-resets) |
| Run on OpenShift | [OpenShift](/features/open-terminal/terminals/orchestration/openshift) |
| Tune generated system prompts | [System prompts](/features/open-terminal/terminals/orchestration/system-prompts) |
| Expose a clean file-browser root | [File browser root](/features/open-terminal/terminals/orchestration/file-browser-home-boundary) |
| Debug APIs and support issues | [API and troubleshooting](/features/open-terminal/terminals/orchestration/api-troubleshooting) |

## How To Think About It

Open WebUI is the front door for models, chats, prompts, knowledge, users, permissions, automations, tools, approvals, and shared workflows. Open Terminal supplies the missing operating-system-shaped runtime behind the chat.

That one addition changes what Open WebUI can be used for. A model can move from explaining the next step to taking the next step: create the file, run the command, inspect the failure, fix it, and return the finished artifact.

The agent loop becomes concrete:

1. Inspect the workspace.
2. Choose an action.
3. Create or edit files.
4. Run code, commands, tools, or servers.
5. Read the output.
6. Fix what failed.
7. Return the artifact.

That is the difference between an answer about the work and an agent doing the work.

For teams, the same model becomes infrastructure:

| Layer | Role |
| :--- | :--- |
| Open WebUI | Chat, users, permissions, model selection, tools, and the visible workflow |
| Terminals | Auth, routing, policy resolution, provisioning, lifecycle, refresh, and cleanup |
| Open Terminal workspace | Files, shell, processes, packages, code execution, previews, and artifacts |
| Policy | Image, tools, limits, storage, env vars, security context, and idle timeout |

In agentic-infrastructure terms: Open WebUI is the control plane, Open Terminal is the computer substrate, and Terminals is the fleet manager for those substrates.

## Operate It Safely

Open Terminal can run isolated in Docker or directly on a host, depending on how much access the agent should have. Terminals adds policy, lifecycle, and per-user isolation for shared deployments. Start with the security and configuration pages before giving agents broad filesystem, process, or network access.

| Need | Go to |
| :--- | :--- |
| Security model and deployment boundaries | [Security](/features/open-terminal/advanced/security) |
| Configuration options | [Configuration](/features/open-terminal/advanced/configuration) |
| Multi-user setup choices | [Multi-user](/features/open-terminal/advanced/multi-user) |
| Terminals troubleshooting | [Troubleshooting](/features/open-terminal/terminals/#troubleshooting) |

## Related Ecosystem Projects

- [**Open WebUI Computer**](/ecosystem/computer): serves your real computer to any browser, with files, terminal, editor, git, and AI as an optional helper.

Terminals requires an [Open WebUI Enterprise License](https://openwebui.com/enterprise) for production use. The project lives at [github.com/open-webui/terminals](https://github.com/open-webui/terminals).
