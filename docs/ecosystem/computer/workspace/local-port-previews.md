---
title: Local-port previews
sidebar_position: 8
---

# Local-port previews

Use a local-port preview to inspect a development server that is already running from a terminal in the selected workspace. This keeps the app, source files, and the terminal producing its logs in one place, including when you check the Computer instance from another device.

## Open a running local app

1. Start the app in a terminal in the intended workspace and confirm from its output that it is listening on a port.
2. Open the workspace file browser. When Computer detects a listening workspace terminal port, it appears in the **Ports** row.
3. Select the displayed `:port` to create a preview tab.
4. Make a source change, follow the app's usual reload path, and check the preview and terminal logs together.

The preview connects to the real process already listening on the host. It does not start, deploy, or secure that app for you.

## What survives and what does not

The preview can be reopened while the same Computer server and local process remain alive. If the terminal process exits, the host restarts, or Computer restarts, the app and preview connection do not resume on their own. Start the service again, then reopen the port.

## Recover a preview

- **No port appears:** inspect the terminal for a failed start, a different port, or a process that is compiling but not listening.
- **The preview cannot load:** check the server logs, refresh the tab, and verify the app's host, origin, and authentication settings. Fix those settings in the app rather than exposing the port publicly.
- **It worked before a restart:** reopen the workspace terminal, restart the development server, wait for its port to appear, and select it again.
- **It differs on another device:** check the device browser, app authentication, and responsive behavior. The preview reaches the live local app, but it does not remove platform-specific differences.

## Trust boundary

A port preview is a private convenience for people who can use this Computer instance. Do not treat it as a public URL, and do not assume it protects a local service that lacks its own authentication.
