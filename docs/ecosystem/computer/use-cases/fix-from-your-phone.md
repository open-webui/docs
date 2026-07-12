---
title: "Ship a fix from your phone"
sidebar_position: 6
---

# Ship a fix from your phone

A user reports that the signup form rejects valid emails. You're on a train. The repo, the branch you were working on, and the dev database are all on the machine at your desk. Instead of waiting two hours or rebuilding the context in some cloud IDE, you open the machine itself.

**You need:** the [quickstart](/ecosystem/computer/quickstart) done on the desk machine, [Tailscale](/ecosystem/computer/phone-and-remote/tailscale) (or another remote route) set up, and ideally the [PWA installed](/ecosystem/computer/phone-and-remote/phone-app) so this is one tap. About 15 minutes of setup, once.

## The walkthrough

1. **Open the workspace.** Tap the home-screen icon, sign in if your session expired, and pick the project workspace. Your tabs and layout are exactly as you left them, including the terminal from this morning.

2. **Confirm where you are.** The git strip at the bottom shows the branch and any uncommitted changes. If the working tree has changes you left behind, look at the diff before touching anything; they're real files, not a sandbox.

3. **Reproduce it.** Open a terminal tab and run the focused test or a quick check:

   ```bash
   npm test -- --grep "email validation"
   ```

   Terminal output persists, so if the run is slow you can lock the phone and come back to it.

4. **Make the edit.** Find the file with **Cmd+K** search (the on-screen search button on mobile), open it in the editor, and fix the regex. Syntax highlighting and tabs work the same as on desktop; the screen is just smaller.

5. **Verify and commit.** Re-run the test, then open the git panel: review the diff (split or unified view), stage just that file, and commit. Computer can suggest a commit title and description from the staged change. Push if the branch is yours to push.

6. **Or hand it to the AI.** If the fix is bigger than a one-liner, open the chat, mention the file with `@`, and describe the bug. Keep approval mode on **ask** and approve each edit from the tool cards. See [approvals](/ecosystem/computer/ai/approvals-and-plan-mode).

## What makes this work

The terminal, editor, and git panel are all talking to the same real checkout, so there is nothing to sync and no second environment to trust. The risky parts (an unfamiliar diff, a push) sit behind the same review you'd do at your desk, just on a smaller screen. For anything genuinely heavy, leave the branch ready and finish on the desktop later; the workspace will be waiting.

**Go deeper:** [Git](/ecosystem/computer/workspace/git) · [Terminals](/ecosystem/computer/workspace/terminals) · [Phone & remote access](/ecosystem/computer/phone-and-remote/)
