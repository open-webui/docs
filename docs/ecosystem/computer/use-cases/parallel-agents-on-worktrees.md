---
title: "Run parallel agents on git worktrees"
sidebar_position: 14
---

# Run parallel agents on git worktrees

You have three independent tasks queued on one repo: a flaky-test fix, a dependency bump with API fallout, and a docs pass. One agent doing them sequentially wastes the parallelism; three agents in one working tree would trample each other's files. The clean answer is one worktree per task, one workspace per worktree, one agent per workspace, all supervised from a single browser tab.

**You need:** a [coding agent](/ecosystem/computer/ai/coding-agents) or API model configured, and a repo where the three tasks genuinely don't share files. Native agent backends resume per-chat sessions independently, which is what makes this sane to supervise.

## The walkthrough

1. **Cut the worktrees.** In the repo's workspace, open the worktree picker in the git panel and create a branch-backed worktree per task (`fix/flaky-upload-test`, `chore/bump-sdk`, `docs/cli-reference`). Each is a separate checkout on disk. Terminal equivalent, if you prefer: `git worktree add ../repo-flaky fix/flaky-upload-test`.

2. **One workspace each.** Add each worktree directory as its own workspace. Workspaces scope everything (files, git panel, terminals, chats), so the three efforts can't contaminate each other's diffs, and each chat's file mentions and history stay per-task.

3. **Brief each agent tightly.** Open a chat in each workspace, pick the agent model, set approval mode to **auto** (reads free, writes gated), and give each a bounded brief with a definition of done:

   > Fix the flaky `test_upload_retry`. Reproduce it first (run it 20x), identify the race, fix, then run 50x clean. Don't touch anything outside the test and the retry module.

4. **Supervise all three from one screen.** Split the layout: three chats side by side, or chats stacked with a git panel. Pending approvals surface inline in each chat as they arrive, so the loop is: skim, tap into a diff, allow or deny with a correction. Messages you send mid-run queue for that agent's next turn. Within one chat, an agent can also fan out read-only [sub-agents](/ecosystem/computer/ai/subagents) for investigation, which keeps the write-path serialized per worktree while research parallelizes.

5. **Land serially, like an adult.** As each finishes: run the focused tests in that workspace's terminal, review the full diff in the git panel, commit on the branch, then merge or PR from the main checkout in whatever order makes sense. Worktrees keep merges honest because each branch's tree was never shared.

6. **Walk away mid-flight if you want.** All three tasks run server-side, sessions resume per chat, and pending approvals wait for you. Checking in from a phone is the same three chats, smaller.

## What makes this work

The isolation is doing the real work: worktrees give each agent a private filesystem reality, and workspaces give each one a private context, so parallelism costs no correctness. Approval mode is per chat, so you can run the docs agent on **full** while the dependency bump stays on **auto**. The bottleneck honestly becomes your review bandwidth; three is a comfortable ceiling, and the git panel, not agent optimism, is always the source of truth.

**Go deeper:** [Git and worktrees](/ecosystem/computer/workspace/git) · [Workspaces](/ecosystem/computer/workspace/workspaces) · [Sub-agents](/ecosystem/computer/ai/subagents) · [Approvals](/ecosystem/computer/ai/approvals-and-plan-mode)
