---
title: "Clean up a messy folder with AI"
sidebar_position: 2
---

# Clean up a messy folder with AI

Your Downloads folder has 400 files in it: screenshots named `Screen Shot 2025-11-03 at 9.41.12 PM.png`, six copies of the same PDF, homework from two school years, and installers you'll never run again. Sorting it by hand is an afternoon. Instead, you're going to point an AI at it and approve its plan, file by file, without touching a terminal or writing any code.

If you've never used Computer before, this is a good first project: you'll see exactly what the AI wants to do before it does anything.

**You need:** the [quickstart](/ecosystem/computer/quickstart) done (installing Computer is copy-pasting two commands) and a [model connected](/ecosystem/computer/ai/connect-a-model). Any decent model works. Ten minutes.

## The walkthrough

1. **Open the messy folder as a workspace.** In the workspace picker, choose your Downloads folder (or a copy of it, if you want to practice safely first). The file browser now shows the chaos in all its glory, with icons and file sizes.

2. **Keep the AI on a leash.** In the chat, open the **+** menu and make sure approval mode is **ask**. This means the AI must show you every single change and wait for your tap before making it. Nothing moves without your say-so.

3. **Ask for a plan first, not action.** Type something like:

   > Look through this folder and tell me what's in it. Propose a folder structure (like Screenshots, Documents, Installers, Old homework) and tell me what you'd move where. Don't move anything yet.

   Watch it work: you'll see it listing files and reading names, then it answers with a plan you can react to. "Actually, keep anything from 2026 where it is" is a perfectly good reply.

4. **Let it execute, with you approving.** When the plan looks right:

   > Go ahead. Create the folders and move the files as planned.

   Each action shows up as a card with **Allow** and **Deny** buttons. Tap through them. If it wants to do something weird, deny that one card and tell it why; the rest continues.

5. **Check the result like a human.** The file browser updates as it works. Open a couple of moved files to confirm they're what the AI said they were. Duplicates it found? Ask it to list them side by side with sizes before you let it delete anything.

## What makes this work

This is real AI-with-hands, but with the safety dialed all the way up: **ask** mode turns "an AI reorganized my files" from scary into a series of small decisions you watched happen. These are your real files, so start with a folder you can afford to practice on, keep deletions behind an extra "show me first," and skip hosted AI for folders with private documents (a [local model via Ollama](/ecosystem/computer/ai/connect-a-model) keeps everything on your machine).

**Go deeper:** [Approvals](/ecosystem/computer/ai/approvals-and-plan-mode) · [Files and editor](/ecosystem/computer/workspace/files-and-editor) · [Connect a model](/ecosystem/computer/ai/connect-a-model)
