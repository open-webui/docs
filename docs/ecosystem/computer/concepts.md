---
title: "Core concepts"
unlisted: true
---

# Core concepts

Open WebUI Computer is easiest to understand when you separate the machine from the view of that machine.

| Term | Meaning |
| --- | --- |
| **Host** | The macOS, Linux, or Windows machine where Open WebUI Computer runs. Its filesystem and shell are the real ones. |
| **Instance** | One running Open WebUI Computer server and its local application state. |
| **User** | A person authenticated to that instance. App users do not make the host a sandbox or grant isolation from the host account. |
| **Workspace** | An existing directory on the host. It has a path, name, and remembered browser layout for each user. |
| **Tab and layout** | The saved working view: files, chats, terminals, browser sessions, and split panes. |
| **Terminal session** | A PTY-backed shell that can keep running after the browser tab closes. |
| **Chat** | A workspace-associated conversation that can use an AI provider or native coding agent. |
| **Native agent** | A locally installed coding-agent CLI, such as Codex or Claude Code, selected as an AI backend. |
| **Gateway** | The optional `/v1` interface that lets Open WebUI or another OpenAI-compatible client drive a selected workspace. |

## The important mental model

Open WebUI Computer does not reconstruct a project somewhere else. It reconnects you to the host and directory you chose. That is why you can see the same dirty branch from a phone or continue an agent session that started at your desk.

## Verify it worked

Open any workspace, create a terminal, close the browser tab, and open the same workspace again. The terminal tab and its output should still be available.

If the workspace or session is missing, first confirm that you reopened the same host and workspace path; then use [workspace troubleshooting](./troubleshooting/access-and-workspaces).

## Trust boundary

A workspace is a useful organizing surface, not a security sandbox. The terminal and authenticated user can access the host according to the host account's permissions. Read [the security model](./remote-access/security-model) before making the instance remotely reachable.
