---
title: "Supervise a coding agent from anywhere"
sidebar_position: 11
---

# Supervise a coding agent from anywhere

Before leaving the house you asked Claude Code to migrate the settings module off a deprecated API. Somewhere around lunch it reaches the part you were worried about: the database schema. You want to see what it's proposing, answer its question, and let it continue, without being at the desk and without giving it a blank check.

**You need:** a [coding agent connected](/ecosystem/computer/ai/coding-agents) (Claude Code, Codex, Cursor, Grok, OpenCode, Cline, or Pi), remote access via [Tailscale](/ecosystem/computer/phone-and-remote/tailscale), and the host set to [stay awake](/ecosystem/computer/phone-and-remote/keep-it-running).

## The walkthrough

1. **Start the task before you leave.** In the project workspace, pick the agent's model in the chat, state the goal and the boundary, and set approval mode from the **+** menu:

   > Migrate `settings/` off the v1 config API. Don't touch the schema or commit anything without asking.

   **auto** is the sweet spot for supervised work: reads proceed, writes and commands wait for you. For unfamiliar or high-impact work, start in [plan mode](/ecosystem/computer/ai/approvals-and-plan-mode) instead and approve the plan first.

2. **Walk away.** The task runs server-side. Closing the laptop lid is the only thing that can stop it, which is why the keep-it-running setup matters.

3. **Check in from your phone.** Open the same chat. You see the full history: every file it read, every edit it made, and the pending approval that's blocking it, rendered as tool cards with **Allow / Deny** buttons.

4. **Review before you approve.** Tap into the diff on the tool card, or open the git panel for the whole picture of what's changed so far. If the proposed schema change isn't what you want, **Deny** and reply in the same chat:

   > Don't create the migration. Keep the old column and write an adapter instead.

   The agent keeps its context and adjusts course. Messages you send while it's working queue for the next turn.

5. **Land it at your desk.** When it reports done, the git panel shows the complete diff. Run the tests from a terminal tab, then stage and commit. Sessions resume automatically, so the same conversation continues on any device if there's follow-up work.

## What makes this work

The agent, the diff, and your approval queue live in one place, so "check on the agent" is a ten-second glance instead of an SSH session and a `git status`. Native backends use your existing subscription and login; nothing new to pay for. And because approvals are per-action, being away doesn't mean giving up control; it just means the control moved to your pocket.

**Go deeper:** [Coding agents](/ecosystem/computer/ai/coding-agents) · [Approvals and plan mode](/ecosystem/computer/ai/approvals-and-plan-mode) · [Chat features](/ecosystem/computer/ai/chat-features)
