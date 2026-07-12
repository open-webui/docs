---
title: "Build your first website with an AI beside you"
sidebar_position: 4
---

# Build your first website with an AI beside you

You want a website: a page for your club, a portfolio for art class, a fan page, whatever. You've never written HTML. The usual advice is a website builder that owns your page, or a YouTube tutorial series. Third option: build it as real files on your own computer, with an AI that writes the first version and explains every line you ask about.

You'll end up with something better than a hosted page: actual code you can read, break, fix, and keep forever.

**You need:** the [quickstart](/ecosystem/computer/quickstart) done and a [model connected](/ecosystem/computer/ai/connect-a-model). Zero coding experience.

## The walkthrough

1. **Make a home for it.** Create a new folder (you can do this right in the workspace picker), call it `my-site`, and open it as a workspace.

2. **Describe what you want.** In the chat:

   > Build me a one-page website for our robotics club. Dark background, big title, a photos section, and a joke at the bottom. Plain HTML and CSS files, no frameworks.

   Approve the file creations as they appear. In a minute you have `index.html` and `style.css` sitting in your file browser. Real files, on your machine.

3. **See it live.** Ask:

   > Start a local web server for this folder so I can preview it.

   The AI runs a tiny server (something like `python3 -m http.server 8080`; you'll see the command it asks to run). The port pops up in the **Ports** row above the file browser. Click it and your site opens in a preview tab.

4. **Now the actual learning part.** Open `index.html` in the editor next to the preview. Change the title text, save, refresh the preview. Break something on purpose. Then interrogate the AI like a tutor:

   > What does the `<div>` on line 14 do? Why is the photo section side-by-side on wide screens?

   It reads *your* file and explains *your* code, which beats a generic tutorial every time.

5. **Show your phone.** If you've set up [phone access](/ecosystem/computer/phone-and-remote/), open the same preview on your phone and watch your site in a real mobile browser. There's your first responsive-design lesson, free of charge.

## What makes this work

Everything stays plain files in one folder: readable, portable, yours. The AI does the intimidating blank-page part; the editor-beside-preview loop does the teaching; and because the chat lives in the workspace, next week's "add a second page" continues right where you left off. When you're ready for the world to see it, ask the AI to walk you through free hosting like GitHub Pages; the files are already exactly what you need.

**Go deeper:** [Previews and browser](/ecosystem/computer/workspace/previews-and-browser) · [Files and editor](/ecosystem/computer/workspace/files-and-editor) · [Chat features](/ecosystem/computer/ai/chat-features)
