---
title: "Browser sessions and local-port previews"
sidebar_position: 6
---

# Browser sessions and local-port previews

Browser tabs and local-port previews look similar, but they answer different questions. Use a browser tab to visit a website. Use a local-port preview to inspect an app that is already listening from a terminal in this workspace.

| You need to | Use |
| --- | --- |
| Open an external or internal URL without leaving Computer | [Browser sessions](./browser-sessions) |
| Check a development server beside its source and terminal logs | [Local-port previews](./local-port-previews) |

Neither is a deployment mechanism. Use a normal deployment path for a public demo or an application that must be reached by people outside the trusted Computer instance.

## Choose deliberately

Browser sessions are temporary runtime sessions. Local-port previews depend on a process that is already running on the host. If Computer, its browser service, or the local process restarts, recover from the focused guide instead of assuming the tab preserved the working state.

## Safety boundary

Both surfaces can expose real, valuable state. A browser session may use a managed browser or, when configured, a personal Chrome source with signed-in websites. Treat it as access to the host browser: only use trusted Computer instances and operators, and do not share a tab or instance that can reach sensitive accounts. A port preview is a private convenience, not a public URL or an authentication layer for the local service.
