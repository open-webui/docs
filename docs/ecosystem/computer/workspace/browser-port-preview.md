---
title: "Browser sessions and local-port previews"
sidebar_position: 5
---

# Browser sessions and local-port previews

Open WebUI Computer can show a local service that is already running on the host through a workspace preview tab. This lets you check an app from a phone or tablet while keeping the original terminal, logs, and source files in reach.

## Use this when

Preview a development server, inspect a local web UI, or pair a browser view with terminal output. Use a normal deployment path for a public demo or an application that must be reached by people outside the trusted Computer instance.

## Before you start

- Start the service in the intended workspace and confirm the listening port from its output.
- Sign in to the same private Open WebUI Computer instance from the browser or device you will use for testing.
- Know whether the local app assumes `localhost`, a particular origin, or its own authentication. The preview does not rewrite the app's security model.

## Do it

1. Open the file browser in the workspace. When a process opens a port, its `:port` appears in the **Ports** row.
2. Select the port to open a preview tab. Switch back to the terminal or arrange the preview beside source files as needed.
3. Navigate through the app and inspect terminal logs while testing. Save source edits and let the development server reload, or refresh the preview when its toolchain requires it.
4. Close the preview when finished; stop the server separately from the terminal if it should no longer run.

## Verify it worked

The preview displays content from the expected local process, and requests or logs appear in that process's terminal. A change made in the selected workspace is reflected after the normal reload path. Reopening the preview shows the same host service while it remains running.

## If it did not

- **There is no Ports row:** inspect the terminal for a failed start or a different port. Ensure the process is listening rather than merely compiling.
- **The page fails to load:** try the displayed port again and check server logs. Some apps need their configured host or origin adjusted for proxying; fix the app deliberately rather than exposing the service publicly.
- **A page works on desktop but not the test device:** check the device browser, app authentication, and responsive behavior. The preview proves the real-device request path, not every platform-specific behavior.

## Trust boundary

The preview is a private convenience for services on the host. It can make a development server visible to anyone able to use this instance. Do not use it as a public URL, and do not assume it protects a service that lacks its own authentication.
