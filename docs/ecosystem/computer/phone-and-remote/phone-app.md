---
title: "Install the app (PWA)"
sidebar_position: 5
---

# Install the app (PWA)

Open WebUI Computer is a PWA: install it from the browser and it gets a home-screen icon, opens in its own app window, and shows up in your phone's Share sheet so you can send links and files straight into a workspace.

## Add it to your home screen

Open your Computer URL in the phone's browser (use the URL from your [remote-access setup](./index.md), the same one every time, so the app keeps pointing at the same instance):

- **iPhone/iPad (Safari):** Share button → **Add to Home Screen**.
- **Android (Chrome):** menu → **Add to Home screen** / **Install app**.
- **Desktop (Chrome/Edge):** install icon in the address bar, or menu → **Install**.

Launch the new icon and sign in once. The session lasts, so from then on it opens straight into your workspace. If no install option appears, your browser doesn't support PWA installation; everything still works in a normal tab.

## Choose what "Share" does

In **Settings → PWA**, pick how shared text and links are handled:

- **Ask each time**
- **Create a chat draft**: the link lands as a message ready to send to the AI
- **Create a note file**: it's saved as a file in the workspace

And where shared files land: the workspace root, ask for a folder each time, or a folder you configure.

## Share from any app into your workspace

Where the OS and browser support PWA share targets, Open WebUI Computer appears in the system Share sheet. Share a URL, text, or file from any app, choose Computer, and it arrives according to your PWA settings: an article into a chat draft, a PDF into the project folder. On devices without share-target support, paste into a new chat or note, or upload through the file browser instead.

## Keyboard shortcuts

With a hardware keyboard (tablet or desktop):

| Shortcut | Action |
|---|---|
| `Cmd+K` | Quick search (find anything) |
| `Cmd+Shift+F` | Search across file contents |

Use `Ctrl` instead of `Cmd` on Windows and Linux.

Next: make sure the machine is still awake when you pull your phone out. See [Keep it running](./keep-it-running).
