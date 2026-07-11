---
title: "Test your dev server on a real phone"
sidebar_position: 6
---

# Test your dev server on a real phone

The checkout flow looks perfect in Chrome's device emulator. It also looked perfect last time, right up until a real iPhone keyboard covered the submit button. Emulators don't have real keyboards, real safe areas, or real touch physics; your phone does, and your dev server is already running.

**You need:** the quickstart done, and your phone able to reach Computer (same Wi-Fi is enough: [phone access](/ecosystem/computer/phone-and-remote/); Tailscale if you want it to work from anywhere).

## The walkthrough

1. **Start the app where it already lives.** In the project workspace, open a terminal and run the dev server as usual:

   ```bash
   npm run dev
   ```

2. **Find the port.** When a process in a workspace terminal starts listening, the port shows up in the **Ports** row above the file browser. Tap the `:5173` (or whatever it is) to open a preview tab. The preview proxies the real local process; there's nothing to deploy.

3. **Open it on the phone.** Sign in to Computer from the phone and open the same preview tab. You're now driving the dev server on your desk from a real touchscreen.

4. **Fix-and-check loop.** Keep the preview open on the phone while you edit on the desktop (or edit from the phone; it's the same workspace). Hot reload works normally because it's the same server; the terminal tab next to the preview shows the request log and errors as you tap through the flow.

5. **Capture what you find.** When the keyboard covers the button again, write it down where it'll be seen: a note in the workspace, or a chat message with the file mentioned via `@` so the AI has the context when you ask it to fix the CSS.

## What makes this work

The preview reaches the live process through Computer's own authenticated session, so nothing gets exposed to your network and there's no tunnel, QR code, or deploy step. When the server dies or the host restarts, the preview does too; start the process again and re-open the port. It reflects reality, which is the entire point.

**Go deeper:** [Previews and browser](/ecosystem/computer/workspace/previews-and-browser) · [Terminals](/ecosystem/computer/workspace/terminals)
