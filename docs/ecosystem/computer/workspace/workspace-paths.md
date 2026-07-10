---
title: "Workspace paths"
sidebar_position: 1
---

# Workspace paths

**Useful for Nora and Malik.** A workspace is a directory on the machine running Open WebUI Computer, not an uploaded project copy. Selecting a workspace determines the file browser, editor, git panel, chat context, and the starting context for work in that project.

## Use this when

Add a repository or project directory, switch between existing projects, or verify that a chat and its files refer to the directory you intended. Use a new workspace for a distinct checkout or worktree; do not point two unrelated projects at a convenient parent directory just to make them appear together.

## Before you start

- Know the absolute path on the host, for example `/Users/nora/src/payments`, not a path from the phone or a cloud drive.
- The service account that runs Open WebUI Computer can read the directory and, if you intend to edit, write to it.
- Review what is inside the path. Workspaces are convenience boundaries for the UI and AI file tools, not a sandbox for the terminal.

## Do it

1. Open the workspace picker in the sidebar and add or select the directory on the host.
2. Confirm the displayed workspace name and path, then open the file browser and git bar.
3. For a separate checkout or git worktree, add its own directory as a separate workspace. This preserves the branch and files already checked out there.
4. Switch projects from the workspace list instead of changing directories in an unrelated terminal and assuming the rest of the UI followed.

## Verify it worked

The file browser root, git branch, terminal working directory, and new chats all correspond to the same selected path. Switch away and back: the intended workspace returns with its own open tabs and history rather than showing another repository's files.

## If it did not

- **The path is missing:** check the exact host path and whether the service account can read it. In Docker, confirm the path is mounted into the container.
- **The git bar shows no repository:** select the repository root or a directory beneath a valid checkout, then refresh the workspace.
- **The wrong files appear in chat:** verify the active workspace before adding a file mention or approving agent work. Open a new chat only after selecting the correct path.

## Trust boundary

Adding a path makes that real host directory available through the instance to its trusted user. Do not add a broad home directory or secrets directory merely for convenience. A terminal remains capable of moving outside the active workspace, so the host account and network boundary still matter.
