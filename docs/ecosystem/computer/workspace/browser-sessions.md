---
title: Browser sessions
sidebar_position: 7
---

# Browser sessions

Use a Browser tab when you need to visit an external or internal site while keeping the related chat, files, and terminal visible in Computer. It is useful for checking a staging site, following a research link, or reproducing a browser-only problem alongside the project.

## Open and use a browser tab

1. In the workspace tab bar, create a **Browser** tab.
2. Enter the full URL in its address field and press Enter.
3. Use the browser tab's Back, Forward, and Reload controls while you inspect the site. Its label updates as the page title becomes available.
4. Keep the browser beside the relevant chat or terminal when you need to compare a result with the work that produced it.

This is a browsing surface, not a durable browser profile. Its configured browser source may be a managed browser or a personal Chrome source, depending on how the Computer instance is set up.

## What survives and what does not

The workspace can remember that a Browser tab belongs in the layout, but the live browser session and its proxy cookie state exist only while the Computer server is running. A tab that has expired or is reopened after a Computer restart may need a fresh session, URL, and sign-in.

Agent-driven browser work has the same practical limit: it is a live session and can expire when idle or close when the server stops.

## Recover a browser tab

- **The tab says it expired or no longer loads:** create a new Browser tab and enter the URL again.
- **A signed-in site is logged out:** sign in again only if this is a trusted instance and browser source. Do not assume cookies or personal-browser state were retained.
- **The expected personal browser is unavailable:** use the configured managed browser or ask the instance operator to check the browser source. Do not work around it by exposing the site or sharing credentials in chat.

## Signed-in browser safety

A signed-in website can perform real actions, including actions the website permits for that account. Treat browser access as host access. Keep Computer private, limit access to trusted people, and do not use shared or public deployments for sensitive accounts. Close the Browser tab when the work is complete.
