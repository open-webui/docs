---
sidebar_position: 3
title: "Open Terminal"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open Terminal

<ThemedImage
  alt="Open Terminal: the Open WebUI core driving a real terminal session in a loop, running commands and reading the output"
  sources={{
    light: useBaseUrl('/images/banners/terminal-light.svg'),
    dark: useBaseUrl('/images/banners/terminal-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Give your agents a real computer substrate.**

Open WebUI gives you the agent front door: models, chats, knowledge, prompts, users, permissions, builtin tools, MCP connections, automations, and shared workflows. Open Terminal adds the missing computer substrate: a working environment with a filesystem, shell, package manager, running processes, document and data handling, generated artifacts, and live previews.

That means the agent can do real work. Not just answer questions about a task, and not just emit code you run somewhere else. It can plan, create files, run code, inspect output, install dependencies, start servers, render previews, recover from errors, and continue until there is an artifact you can use: a script, report, patch, chart, website, migration, or organized folder.

Despite the name, Open Terminal is not just a terminal panel. It is the computer-like workspace the agent acts inside. Run it in Docker for isolation, or bare metal when the agent should work directly on the host.

![Open WebUI with Open Terminal, file browser sidebar and chat](/images/open-terminal-file-browser.png)

:::tip Looking for "your computer in a browser" instead?
Open Terminal is the computer substrate an **AI agent** drives from chat. If you want to operate your own machine from any browser, with files, editor, terminal, git, and AI as an optional helper, see [**Open WebUI Computer**](/ecosystem/computer), a separate Open WebUI project. [Choose the right execution environment](/ecosystem/computer/choose).
:::

---

## What Open WebUI Adds, and What Open Terminal Adds

| | Open WebUI | Open Terminal |
| :--- | :--- | :--- |
| Agent interface | Chat, models, prompts, knowledge, users, permissions, and workflow UI | A computer-like workspace the model can act inside |
| Context | Conversations, uploaded files, knowledge bases, memories, notes, channels | Files, folders, terminal output, logs, previews, documents, and generated artifacts |
| Action | Builtin tools, MCP/OpenAPI tools, automations, sub-agents | Create files, run commands, install packages, execute code, start servers, use Git, process documents |
| Feedback loop | Tool calls and chat state | Observe the workspace, change it, run it, inspect the result, fix, retry, verify |
| Boundary | Open WebUI permissions and configuration | Docker sandbox or direct host access |

Open WebUI is the control plane. Open Terminal is the agent's computer substrate for real work that needs an operating system, not just a prompt.

---

## The Terms People Use

Different teams describe this stack with different language. Open Terminal fits the vocabulary people already use for agentic systems:

| Term people use | What it means here |
| :--- | :--- |
| **Agentic AI** | A model that can take multi-step actions, observe results, and keep going |
| **AI agent** | The model plus instructions, tools, memory/context, and an execution loop |
| **Agent harness** | The surrounding system that gives the model tools, context, permissions, state, and feedback |
| **Agent runtime** | The place where agent actions actually run: files, code, commands, servers, documents, and processes |
| **Computer substrate** | A real working environment the agent can modify, execute within, and observe |
| **Tool calling / function calling** | The model choosing a structured tool action instead of only writing text |
| **Computer use** | An agent operating a computer-like environment through files, commands, UI, or browser actions |
| **Code interpreter** | A narrower execution surface for running code; Open Terminal is broader because it includes the filesystem, shell, packages, processes, and previews |
| **MCP / tool servers** | Standard or API-backed ways to expose capabilities to the model |
| **Orchestration** | The loop of choosing tools, sequencing steps, handling failures, and verifying results |
| **Sandbox** | The isolation boundary around the agent's filesystem, processes, and network access |

The practical point is simple: models got good enough to use tools, but agents need a computer-shaped place to do real work. Open Terminal gives Open WebUI that place.

---

## Agent Workloads

### Data analysis and reporting

Upload spreadsheets, CSVs, databases, or exported logs. The agent can inspect the files, write analysis code, install libraries, generate charts, and return a finished report.

![AI analyzing data from a spreadsheet](/images/open-terminal-ai-csv-analysis.png)

### Document search and extraction

Point the agent at a folder of PDFs, Word docs, spreadsheets, or emails. It can search, extract, convert, summarize, cross-reference, and produce structured output.

{/* TODO: Screenshot — A chat where the user asks about the Johnson contract. The AI lists the files it found in a folder (contract_v2.docx, notes.pdf, invoice.xlsx) and provides a consolidated summary of relevant information from each. */}

### Web development with live preview

Describe a site or app. The agent can create the files, install dependencies, start a dev server, and render the result inside Open WebUI. Iterate by describing changes in chat.

{/* TODO: Screenshot — A chat on the left side of the screen. On the right, a live website preview panel shows a clean event landing page with a banner, date, and registration button. */}

### Software development

Clone repos, inspect architecture, run test suites, debug failures, refactor code, and work with Git. The key capability is not just writing code; it is running and verifying it.

### File and system automation

Bulk rename, sort, deduplicate, convert, compress, and organize files. Manage disk usage, process logs, prepare exports, and automate repeatable operations.

{/* TODO: Screenshot — A chat where the user asks "rename all the photos to include the date". The AI responds confirming "Renamed 43 files" with a before/after example: IMG_4521.jpg → 2025-03-15_IMG_4521.jpg. */}

---

## What Agents Can Do With This Substrate

| | |
| :--- | :--- |
| 🖥️ **Use a real shell** | Run commands, scripts, CLIs, tests, build tools, and package managers |
| 📁 **Own a workspace** | Browse, upload, download, edit, create, rename, convert, and organize files |
| 📄 **Process documents and data** | Handle PDF, Word, Excel, PowerPoint, RTF, EPUB, email, text, code, and data files |
| 🌐 **Run and preview software** | Start local servers and show live previews inside Open WebUI |
| 🔁 **Iterate from feedback** | Read output, inspect artifacts, fix errors, retry, and verify the result |
| 🔒 **Choose the boundary** | Run isolated in Docker, or bare metal when direct host access is intentional |

---

## Get Started

**[Installation →](./setup/installation)** · **[Connect to Open WebUI →](./setup/connecting)**

:::info Model requirements
Open Terminal needs a model that performs tool calling at agentic quality, not just one that technically supports tools. Working inside a computer substrate is a multi-step loop: choose an action, observe files or output, decide what changed, recover from errors, and repeat across many turns. Small models often fail at that loop even when they can emit a valid tool call. Use a capable frontier model for complex software, data, and automation work. Native tool calling is the default as of v0.10.0; [check the model's tool-calling mode](./setup/connecting#8-enable-native-function-calling) if tools are not firing.
:::

---

## Use Cases

- **[Code execution](./use-cases/code-execution)**: write, run, and debug scripts
- **[Software development](./use-cases/software-development)**: repos, tests, debugging, refactoring, Git
- **[Document & data analysis](./use-cases/file-analysis)**: spreadsheets, PDFs, Word docs, emails
- **[Web development](./use-cases/web-development)**: build and preview websites
- **[System automation](./use-cases/system-automation)**: file management, backups, batch operations
- **[Advanced workflows](./use-cases/advanced-workflows)**: skills for data reports, research, code review, and more
- **[File browser](./file-browser)**: uploading, previewing, editing files

---

## Enterprise Multi-User

Need isolated, per-user agent workspaces for your team? **[Terminals](./terminals/)** is the orchestrator for Open Terminal. It provisions a dedicated computer substrate for every user and policy, with automatic lifecycle management, resource limits, custom images, persistent storage, scheduled resets, and policy-controlled environments.

---

## Your Whole Machine

Open Terminal adds a computer substrate to Open WebUI for the agent to use. [**Open WebUI Computer**](/ecosystem/computer) is the computer itself for you to use: files, terminal, git, editor, and AI in a browser tab, accessible from any device.
