---
title: "Git, branches, stashes, and worktrees"
sidebar_position: 4
---

# Git, branches, stashes, and worktrees

The git bar reflects the repository in the selected workspace. It gives you a fast answer to the question that matters during remote work: what changed here, on which branch, and is this safe to continue?

## Use this when

Inspect a diff, stage and commit a small fix, switch branches with uncommitted work, recover a known stash, or move to a separate git worktree. Use a worktree when two tasks need separate checked-out files at the same time; it is safer than repeatedly switching a busy working tree.

## Before you start

- Select the workspace that contains the actual checkout and read the branch name and changed-file count.
- Inspect the diff before staging. A dirty working tree may include work made earlier on the host.
- Ensure you understand the repository's branch and push policy. The UI does not make a remote push or a migration review safe by itself.

## Do it

1. Expand the git bar to review changed files, diffs, staged state, and ahead/behind status.
2. Stage only the paths that belong to the task, write a specific commit message, and commit after the focused test passes.
3. Use the branch picker to create, find, rename, delete, or switch branches. When a switch needs a clean tree, review the offered stash behavior and name the stash so it is recoverable.
4. Use the worktree picker to see existing worktrees or create a branch-backed worktree. Switch to it as its own workspace path; it contains a distinct checkout, not a magic view of the first branch.
5. Use the stash view to inspect and restore the intended stash. Resolve conflicts in the real files and re-check the diff.

## Verify it worked

The git bar shows the intended branch or worktree path, the diff matches only the files you selected, and the commit appears in history. After a worktree switch, the file browser and terminal show that worktree's files and branch. After restoring a stash, the expected changes appear in the diff rather than silently disappearing.

## If it did not

- **A branch cannot switch:** inspect uncommitted changes and either commit, preserve them in a clearly named stash, or use a separate worktree. Do not discard work to force a switch.
- **A worktree is missing:** refresh the worktree picker and confirm it exists in git. Add its target path as a workspace if it is not already available.
- **A stash will not apply cleanly:** stop and resolve the conflict from the checkout. Keep the stash until the result is verified.
- **The diff is surprising:** unstage first, inspect paths and history, and avoid pushing until you can explain every change.

## Trust boundary

Git commands alter the real checkout and may communicate with configured remotes. A worktree reduces collisions between tasks; it does not isolate credentials, hooks, or shell access. Treat every stage, commit, branch deletion, and push as a host and repository action.
