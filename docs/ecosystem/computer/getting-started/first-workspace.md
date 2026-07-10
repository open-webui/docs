---
title: Your first workspace
sidebar_position: 6
---

# Open your first workspace

This is where Computer becomes useful: you select a folder already on the machine and see that same folder, with its existing files, in the browser.

## Use this when

The server is running and you want to choose the folder that should appear in Computer. Do this even if the folder is notes, design files, or another non-code project.

## Before you start

- A **workspace** means an existing folder on the machine, not an uploaded copy.
- Choose a small, non-sensitive folder you recognize while learning.
- Connecting AI is optional. Skip it until the folder view itself is useful.

## Do it

In the setup wizard, choose **Open folder** and select the folder. Choose **Skip** when asked to connect AI, then finish setup. In the file browser, open one familiar file.

## Verify it worked

The sidebar shows the folder you selected, and the file browser shows a familiar file with the same contents as the original. Close the browser tab, reopen the server URL, and confirm the same folder remains available.

### Optional developer check

If the folder is a Git repository, open the Git view or a terminal tab and compare its branch and changes with your usual development tools. This is an extra confirmation, not a requirement for using Computer.

## If it did not

If the folder picker cannot reach the project, run the server under the OS account that owns or can read that folder. If the wrong folder opens, use the workspace picker to add the intended path instead of moving files into the data directory. If you cannot tell which folder is correct, stop here and choose a smaller folder you can recognize before adding AI or remote access.

## Trust boundary

Adding a workspace makes its files available to the signed-in user and to any configured AI or integration acting in that workspace. It does not copy the project into a protected sandbox.
