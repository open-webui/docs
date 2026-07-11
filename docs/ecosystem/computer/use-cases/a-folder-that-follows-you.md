---
title: "A project folder that follows you"
sidebar_position: 8
---

# A project folder that follows you

A thesis chapter, a research project, a zine: twelve PDFs, a pile of notes, screenshots from your phone, and ideas that arrive on the bus. None of this needs a terminal or git. It needs one real folder that's the same folder no matter which device you're holding.

**You need:** the quickstart done with the project folder as a workspace, remote access if you want it beyond the house ([Tailscale](/ecosystem/computer/phone-and-remote/tailscale)), and the [PWA installed](/ecosystem/computer/phone-and-remote/phone-app) on your phone.

## The walkthrough

1. **Give the project a shape.** In the file browser, make `sources/`, `notes/`, and `drafts/`. Drop the PDFs into `sources/`; drag-and-drop upload works, and PDFs, images, and Office files preview right in the editor.

2. **Keep one live note.** Create `notes/next.md` with what you're doing and what's next. It opens in a tab beside the PDF you're reading, and it's the first thing you see when you come back tomorrow, on any device.

3. **Capture from your phone.** Found a relevant article while out? Use the OS share sheet → Computer, and choose whether it lands as a note, a chat draft, or a file import into the folder you configured in **Settings → PWA**. A thought instead of a link? Record a voice memo; it's saved into the workspace, with a transcript if [speech-to-text is configured](/ecosystem/computer/ai/voice-and-audio).

4. **Let AI read the pile, if you want.** With a model connected, ask in the workspace chat:

   > Read sources/kim2024.pdf and sources/tanaka2023.pdf. Where do their conclusions disagree? Don't edit any files.

   Mention files precisely with `@`. The answer sits in the chat history next to the sources it came from, and chats are just files in the workspace's `.cptr/` folder, so they travel with the project.

5. **Find it all later.** **Cmd+K** searches file names, contents, and chat history in the workspace. "That thing the second paper said about sample size" is findable even when you can't remember which paper.

## What makes this work

Everything is plain files in one folder on your machine: the sources, the notes, the memos, even the AI conversations. No app silo, no sync service, no export lock-in. Back up the folder and you've backed up the project. If sensitive documents shouldn't leave the machine, don't connect a hosted model; the folder, previews, notes, and search all work with no AI at all.

**Go deeper:** [Notes and sharing](/ecosystem/computer/workspace/notes-and-sharing) · [Files and editor](/ecosystem/computer/workspace/files-and-editor) · [Search and chats](/ecosystem/computer/workspace/search-and-chats)
