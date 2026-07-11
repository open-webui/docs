---
title: "Git"
sidebar_position: 5
---

# Git

When the workspace is a git repository, a git status strip shows the current branch and the changed files, with added and removed line counts per file. Expand it to stage, diff, commit, branch, and push: the full daily git loop without a command line, which matters most when the device in your hand is a phone.

## Review changes

Open any changed file to see its diff in split or unified view. Word-level highlights mark what changed inside a line, and you can hide whitespace-only changes to cut noise in reformatted files. Images and other non-text files show a clear changed/added/deleted status instead of meaningless line counts.

Stage exactly the files you want; the staged set is what gets committed.

## Commit and sync

Write a commit message, or take the suggested commit title and description generated from your staged changes and edit it before committing. The status strip shows how many commits you are ahead of or behind the remote, with push and pull one tap away.

## Branches and stashes

From the branch picker you can create, switch, rename, and delete branches. If switching requires a clean working tree, Computer offers to stash your changes as part of the switch, and the stash view lets you inspect and restore stashes later. Nothing is silently discarded.

## Worktrees

The worktree picker lists the repository's git worktrees and lets you create new ones. A worktree is its own directory with its own checked-out branch, so opening one opens it as its own workspace, with its own tabs, terminals, and layout. That's the way to work on two branches at once instead of bouncing a single checkout back and forth. See [add and switch workspaces](./workspaces) for how workspaces behave.
