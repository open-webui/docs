---
title: "Install the app, share into a workspace, and use shortcuts"
sidebar_position: 10
---

# Install the app, share into a workspace, and use shortcuts

Installing Open WebUI Computer as a PWA makes the private machine feel available from a phone or tablet: it opens in an app-like window, can receive a shared link or file, and keeps the first useful actions close at hand.

## Use this when

Use this after the normal browser workflow already works. Install it to reduce friction for private, repeatable tasks such as opening a workspace, finding a chat, taking a note, or sending a link into the project context. It is not a replacement for securing remote access first.

## Before you start

- Confirm the app is reachable through the private URL you intend to use regularly and that signing in works in the browser.
- On the device, allow the browser or operating system to install web apps. Installation prompts vary by platform.
- Decide where shared files should land. A file import writes to the real workspace, so choose a path you are comfortable receiving data into.

## Do it

1. Open Open WebUI Computer in the device browser and use its install action or the browser's **Add to Home Screen** / install command. Launch the new app icon and sign in.
2. Open Settings and select **PWA** to choose how shared text and links behave: ask each time, create a chat draft, or create a note file.
3. In the same PWA settings, choose file-import behavior: the workspace root, ask for a folder, or a configured folder.
4. If the browser and operating system support PWA share targets, use the operating system's Share action and choose Open WebUI Computer. Confirm the destination before sending a file, URL, or text into the workspace. On unsupported devices, copy the link/text into a new chat or note manually, or upload the file from the workspace file browser.
5. Use keyboard shortcuts when a hardware keyboard is available: `Cmd+K` for quick search and `Cmd+Shift+F` for broad search. On Windows and Linux, use `Ctrl` in place of `Cmd`.

## Verify it worked

The installed icon opens the same private instance and workspace, not a blank unrelated browser profile. On a browser that supports share targets, a harmless shared note or link appears according to the PWA preference you selected. On an unsupported browser, the manual chat/note or file-browser fallback reaches the same workspace. A test file arrives in the selected workspace location, and the search shortcut opens the expected search dialog.

## If it did not

- **No install option appears:** use the browser's menu or verify that the device/browser supports PWA installation. Continue in the browser if it does not.
- **A shared item went to the wrong place:** stop before acting on it, find it in the file browser, and adjust PWA import settings before sending another. Do not delete an unfamiliar file without checking its source.
- **The installed app cannot connect:** verify the private host URL and network path in the regular browser first. Offline fallback does not make the remote host or its files available without a connection.
- **A shortcut does nothing:** check that focus is not inside another input and use the platform's `Ctrl` equivalent where appropriate.

## Trust boundary

The PWA stores a convenient entry point to the same powerful host service; it does not reduce access. Shared files, links, and text may become workspace data, and an installed app on an unlocked device can be a direct path to the instance. Use device lock, sign out when appropriate, and keep the instance on a private network.
