---
title: Your first workspace
sidebar_position: 6
---

# Open your first workspace

Use this to answer the important question: “Am I looking at the actual checkout that has the issue, not a disposable cloud copy?”

## Use this when

The server is running and you need to complete first-time setup around an existing project.

## Before you start

Know the folder you want to expose. Choose a small non-sensitive project first if you are learning the interface. An AI connection is optional and can be skipped in the setup wizard.

## Do it

Use the wizard's **Open folder** step to select the project, then either connect an AI provider or choose **Skip**. Finish setup. Create a terminal tab, inspect a file, and open the Git view.

## Verify it worked

The workspace path is visible in the sidebar. In its terminal, `pwd` identifies that path and `git status` shows the branch and changes you see in your regular shell. Close the browser tab, reopen the server URL, and verify the workspace remains available.

## If it did not

If the folder picker cannot reach the project, run the server under the OS account that owns or can read that folder. If the wrong workspace opens, use the workspace picker to add the intended path instead of moving files into the data directory.

## Trust boundary

Adding a workspace makes its files available to the signed-in user and to any configured AI or integration acting in that workspace. It does not copy the project into a protected sandbox.
