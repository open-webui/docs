---
title: Web search and browser work
sidebar_position: 8
---

# Web search and browser work

Use web tools when the answer is not on the machine: a current release note, a public page, or a site interaction that needs a real browser. This complements the workspace. It does not turn web output into a trusted source or make the browser's login state safe to share.

## Pick the smallest useful web capability

- Use search or URL reading for current facts and public pages.
- Use browser work when the agent must navigate, click, type, or capture a page.
- Keep the task in the workspace when the answer is already in local files, logs, or the running app.

## Make a safe first request

1. Configure the search or browser provider required by the feature.
2. Ask for one read-only action, such as finding an official release note or opening a public page and summarizing its visible content.
3. Review the tool result before asking the agent to sign in, submit a form, or use a browser session with sensitive state.

## Check the result

The chat shows a search, read, or browser tool result with the expected page or answer. If it fails, check the configured endpoint or browser availability before retrying. If a page is wrong or stale, correct the source rather than treating the first result as proof.

## What to trust

Search providers, web readers, and browser services can receive the query, URL, page content, screenshots, or other task context. Browser automation can act as the logged-in host browser. Do not use it with an account or external action you would not approve yourself.
