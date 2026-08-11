---
sidebar_position: 3
title: "Open WebUI as an App"
---

# Open WebUI as an App

Every Open WebUI instance is a **Progressive Web App (PWA)**. You can install it as a standalone app on your phone, tablet, or desktop, directly from the browser. No separate download required.

## What You Get

- **App icon** on your home screen, taskbar, or dock
- **Full-screen experience** with no browser toolbar or address bar
- **Standalone window** on desktop, full-screen on mobile
- **Separate from the browser** with its own window and task entry
- **Push notifications** (when enabled by your admin)

---

## Install on Your Device

### Chrome / Edge (Desktop)

1. Open your Open WebUI instance in Chrome or Edge.
2. Click the **install icon** (⊕) in the address bar, or go to **Menu → Install Open WebUI**.
3. Click **Install**.

Open WebUI now appears in your app launcher and runs in its own window.

### Chrome (Android)

1. Open your Open WebUI instance in Chrome.
2. Tap **Menu (⋮) → Add to Home Screen** or **Install app**.
3. Tap **Install**.

### Safari (iPhone / iPad)

1. Open your Open WebUI instance in Safari.
2. Tap the **Share button** (↑).
3. Scroll down and tap **Add to Home Screen**.
4. Tap **Add**.

:::info
Safari is the only browser that supports PWA installation on iOS. Chrome and Firefox on iOS cannot install PWAs.
:::

### Firefox (Android)

1. Open your Open WebUI instance in Firefox.
2. Tap **Menu (⋮) → Install**.

---

## Customizing the PWA (Admins)

Admins can white-label the PWA by pointing to a custom manifest with the [`EXTERNAL_PWA_MANIFEST_URL`](/reference/env-configuration#external_pwa_manifest_url) environment variable. This lets you set a custom app name, icon, and theme color.
