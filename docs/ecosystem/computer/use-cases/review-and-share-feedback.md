---
title: "Review a prototype and capture feedback"
sidebar_position: 5
---

# Review a prototype and capture feedback

Use this when a live local prototype needs feedback from the device in your hand, and that feedback belongs with the project rather than in a disconnected message thread. Open WebUI Computer keeps the preview, source files, terminal logs, and a workspace chat or note in one place. A generic chat cannot see the running prototype; a cloud copy may not reproduce it.

## Use this when

You are reviewing a private local app, checking a design on a real phone or tablet, or saving a link, file, or observation into the workspace that owns the work. This is for a trusted personal workflow, not public review collection.

## Before you start

- Complete the [local trial](/ecosystem/computer/getting-started/local-trial) and [first workspace](/ecosystem/computer/getting-started/first-workspace), then start the app and confirm its port using [the real-device preview guide](./real-device-preview).
- Confirm the workspace is the one where review notes or shared files should live.
- If sharing from a phone, check the browser and operating system support the PWA share flow; use a normal chat or note manually if it does not.

## Do it

1. Open the local-port preview on the review device and reproduce the interaction you want to assess.
2. Capture a concise observation in the workspace chat or create a note file that names the page, device, and expected behavior.
3. If your installed app supports it, use the device Share action to send a link, text, or file to Open WebUI Computer, then confirm its destination before saving it.
4. Open the resulting workspace item beside the source file or terminal output so the feedback has immediate technical context.

## Verify it worked

The preview is served by the existing host process, and the observation, shared item, or note appears in the intended workspace. Reopening the workspace shows the feedback beside the project rather than only in a separate phone app.

## If it did not

- If the preview does not load, return to the terminal and confirm the process and port before changing the app.
- If sharing is unsupported or unavailable, copy the link or write the observation in a workspace chat or note instead.
- If an item lands in the wrong folder, move it only after confirming its source and update PWA import preferences before trying again.

## Trust boundary

Shared files, links, and notes become real workspace data. A preview may expose what the local service serves to anyone who can sign in to this trusted instance. Keep both the review group and the instance private.
