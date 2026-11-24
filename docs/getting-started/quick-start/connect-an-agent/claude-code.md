---
sidebar_position: 1
sidebar_label: "Claude Code"
title: "Connect Claude Code with Open Terminal"
description: "Sign in to Claude Code in your Open Terminal workspace, choose a Claude model in Open WebUI, and review the files it reads and edits."
---

# Use Claude Code in Open WebUI

## Set up Claude Code in the terminal

The Open Terminal `:agents` Docker image includes `claude`. If you use another image or a host terminal, install Claude Code there as the user who runs Open Terminal. [Claude Code quickstart](https://code.claude.com/docs/en/quickstart)

Start `claude` in your project folder. Follow its sign-in prompts, or use `/login` inside Claude Code to choose an account. Ask it to read the project README and quote its first heading. Once it answers, exit the CLI.

## Select Claude Code in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `claude-code/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal launches Claude Code in streaming JSON mode. File reads and edits appear as steps in chat. Try asking Claude to update one sentence in a document, then open the file in **Files** to review the change.
