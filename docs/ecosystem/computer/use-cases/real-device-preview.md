---
title: "Test a local app on a real device"
sidebar_position: 6
---

# Test a local app on a real device

Your machine is already running a local app server. You need to verify a touch interaction on a phone or tablet without copying the project to another service or guessing from a desktop viewport.

This is valuable because a phone or tablet can reveal problems a desktop browser hides. A **local app server** is the development copy of an app that is already running on your machine. Open WebUI Computer lets you open that same running app from another device, while keeping the source files and terminal logs from the original machine close by.

## Use this when

Use this when a process in a workspace has opened a local port and you want to view that process through Open WebUI Computer from another signed-in device. This is especially useful for checking a real browser, touch layout, or a quick private preview.

## Before you start

- **Not set up yet?** Complete the [local trial](/ecosystem/computer/getting-started/local-trial), add [your first workspace](/ecosystem/computer/getting-started/first-workspace), then configure [private remote access](/ecosystem/computer/remote-access/tailscale-and-tunnels) before testing from the iPad.
- The app is started from the intended workspace on the host. Note its usual port and command.
- You can sign in to Open WebUI Computer from the test device through a private network path.
- The app itself is safe to view in this context. A preview can expose whatever the local process serves to every user who can use this trusted instance.

## Do it

1. Open the workspace and start the app in the terminal if it is not already running.
2. In the file browser, find the **Ports** row above the file list. Select the detected `:port` for the process, or use the port notification when it appears.
3. Open the preview tab on the iPad and exercise the real interaction. Keep the terminal visible in another tab or split when watching logs.
4. Make a small code change if needed, save it, and refresh the preview if the development server does not hot-reload.

For the underlying terminal behavior, see [Persistent terminals](/ecosystem/computer/workspace/terminals). For browser and preview details, see [Browser sessions and local-port previews](/ecosystem/computer/workspace/browser-port-preview).

## Verify it worked

The file browser lists the running port, the preview opens content served by the existing process, and the terminal continues to show the same process output. Close and reopen the browser session: the process is still running unless you deliberately stopped it or the host changed state.

## If it did not

- **No port appears:** confirm the process is still running and listening on a port from its terminal output. Restart it from the workspace if needed.
- **The preview is blank or wrong:** verify the selected port and app route. Check the terminal logs before changing the app.
- **The process stopped when the browser closed:** inspect the terminal session and host sleep/restart history. Start the process again and use the terminal output as the source of truth.
- **The test device cannot open the app:** confirm it is signed in to the same private Open WebUI Computer instance; do not bind the service publicly as a workaround.

## Trust boundary

The preview proxies a service running on the host. It is not a public deployment mechanism or a substitute for application authentication. Anyone who can use the trusted Computer instance may be able to open that preview, so do not run an unsafe debug server or disclose a preview URL outside that trust boundary.
