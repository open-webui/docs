---
title: "Fix a production issue from your phone"
sidebar_position: 1
---

# Fix a production issue from your phone

**Persona: Nora, a Rails consultant.** Her iMac at home has the `payments` branch, a local database, and the terminal that reproduced an invoice bug. A client reports the problem while Nora is on a train with her iPhone. She needs to inspect the real branch and make a small, reviewable correction, not rebuild her environment in the cloud.

This is valuable when the answer is already on your machine. Instead of waiting to reach your desk or creating a second development setup, Open WebUI Computer lets you see the same project state from your phone: the current branch, the files that changed, and the terminal that was already running. A **diff** is simply the list of changed lines that you review before keeping a change.

## Use this when

The repository, local service, credentials, or uncommitted work you need already live on the machine running Open WebUI Computer. This is a good fit for a narrow diagnosis, a one-file correction, or checking a deploy. It is not a reason to merge an unreviewed change from a phone.

## Before you start

- **Not set up yet?** Complete the [local trial](/ecosystem/computer/getting-started/local-trial), add [your first workspace](/ecosystem/computer/getting-started/first-workspace), then configure [private remote access](/ecosystem/computer/remote-access/tailscale-and-tunnels). Do those from the host before you are on the train.
- Open WebUI Computer is already running on Nora's iMac and reachable over a private network path. It must not be exposed as a public service.
- The `payments` workspace is added, and Nora can sign in from her phone.
- Nora knows the affected file or has a reproducible command. If the issue could damage data, she starts with a read-only check and leaves the migration or rollback for a reviewed desktop session.

## Do it

1. From the phone, sign in and open the **payments** workspace. The file browser, git bar, and terminal are the same host workspace Nora left behind.
2. Expand the git status strip at the bottom of the workspace to see the current branch and changed files. Open the relevant diff before editing. If the working tree contains unrelated changes, do not discard them.
3. Open a terminal and run the smallest read-only diagnostic that confirms the report, such as the focused test or log query Nora would use at her desk.
4. Open the affected file from the file browser, make the narrow correction, and save it. Use the git panel to inspect the resulting diff.
5. Run the focused test again. If it passes, stage and commit only the intended files, or leave the diff ready for Nora to review on a larger screen.

For the details of file editing, see [Files, editor, tabs, and splits](/ecosystem/computer/workspace/files-editor). For a fuller git workflow, see [Git, branches, stashes, and worktrees](/ecosystem/computer/workspace/git).

## Verify it worked

The phone shows the same active branch and pre-existing terminal output as the iMac. The git panel shows only Nora's intended changed file and the focused command reports the expected result. Close the browser, reopen the workspace, and confirm the saved file and git diff are still present.

## If it did not

- **The workspace is missing or points at the wrong project:** stop before editing. Check the absolute path in the workspace picker and use [Workspace paths](/ecosystem/computer/workspace/workspace-paths) to add or switch to the correct directory.
- **The terminal is disconnected:** refresh the tab and reopen the terminal. If the host slept, woke, or rebooted, rerun the harmless diagnostic rather than assuming the previous process continued.
- **The diff contains unexpected changes:** do not use a blanket discard action. Copy the paths, inspect them on the host, and preserve changes you did not create.
- **The phone cannot reach the service:** return to [private access setup](/ecosystem/computer/remote-access/tailscale-and-tunnels) or the host network. Do not solve this by publishing the service directly to the internet.

## Trust boundary

Signing in gives Nora the host-level file and shell access that makes this useful. Treat the instance like private SSH: one trusted user on a network she controls. A terminal command may access more than the active workspace, and a commit or push changes the real repository. Keep the task narrow, inspect the diff, and use a desktop review for high-impact work.
