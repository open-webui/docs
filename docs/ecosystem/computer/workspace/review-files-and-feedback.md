---
title: Save notes, shares, and imports in a workspace
sidebar_position: 2
---

# Save notes, shares, and imports in a workspace

Use the selected workspace as the destination for project material you want Computer to keep: a note, an imported file, a shared link or text, or a chat message that records a decision. This page covers where each kind of material goes and what to check before you save it. For the end-to-end review workflow, see [Review a prototype and capture feedback](/ecosystem/computer/use-cases/review-and-share-feedback).

## Choose the right destination

| Material | Keep it as | Check before saving |
| --- | --- | --- |
| A decision, question, or written feedback | A workspace chat message or note | The selected workspace path and the file or screen it refers to |
| A file you want the project to own | An import in the chosen workspace folder | The destination folder and whether the file contains sensitive material |
| A link or shared text from a supported installed web app | A chat draft or note, depending on the selected share action | The workspace chosen by the share flow and the resulting draft before you send it |
| A voice or image input | The relevant chat or configured media workflow | The configured provider and what data it may receive |

Open real project files with the [file editor and browser](./files-editor). Open a running app with a [local-port preview](./local-port-previews). For voice, images, and memos, see [Voice, images, and memos](/ecosystem/computer/agents/voice-images-and-memos).

## Use the installed app's share flow

When the browser and device support the installed web app, you can share supported text, links, images, PDFs, or code into Computer. The share flow asks whether to create a chat draft or workspace note, or to import a file into a destination folder. It opens Computer with that pending item; review the destination and content before completing the action.

If sharing is unavailable on the device, copy the text into the workspace chat or note, or import the file through Computer instead. The share payload is held locally by the browser until it opens Computer; it is not a background sync service.

## Limits and recovery

Computer can only preview formats and share behaviors supported by the current browser and device. Sharing or importing writes real data to the selected workspace. If an item appears in the wrong project, stop before acting on it, switch to the correct workspace, and move or import it deliberately rather than repeatedly resending it. Hosted speech or image features can send media to their configured provider, so keep the instance private and do not use notes or media input for secrets.
