---
sidebar_position: 6
sidebar_label: "GitHub Copilot CLI"
title: "Connect GitHub Copilot CLI with Open Terminal"
description: "Install GitHub Copilot CLI in Open Terminal, sign in with GitHub, and select a Copilot model in Open WebUI to work on repository files."
---

# Use GitHub Copilot CLI in Open WebUI

## Set up GitHub Copilot CLI in the terminal

Install the standalone `copilot` executable on the terminal. With a supported Node.js version, you can install and open it with npm.

```bash
npm install -g @github/copilot
copilot
```

Enter `/login` if prompted and authorize a GitHub account with Copilot access. Check that the CLI can answer a prompt in your repository. A working `gh` command verifies GitHub CLI installation only. Open Terminal needs `copilot` for this integration. [Install GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli)

## Select GitHub Copilot in Open WebUI

In a new saved chat, select your **Terminal**, then use **Choose working directory** to pick your project. Open the model picker and choose a model beginning with `copilot/`. If you still need to connect the workspace, follow the [Open Terminal quick start](/getting-started/quick-start/connect-an-agent#quick-start-with-open-terminal).

Open Terminal starts `copilot --acp` in the selected workspace. For a first task, ask which files define the repository's CI checks and have Copilot quote the relevant lines. Compare its answer with the workflow files in **Files**.
