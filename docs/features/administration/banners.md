---
sidebar_position: 13
title: "Customizable Banners"
---

## Overview

Open WebUI allows administrators to display custom banners on the new-chat screen. They are shown under the chat header only while no chat is open, and not on workspace, admin or other pages. Banners are useful for announcements, system-wide alerts, maintenance notices, and other important messages.

Users can close any banner for the current page load, and a banner can optionally remember that dismissal. You can configure banners in two ways:

1. **Admin Panel** (recommended for quick edits and experimentation)
2. **Environment variable (`WEBUI_BANNERS`)** (recommended for automated / GitOps-style deployments)

---

## When to use banners

Banners are best for short, high-visibility messages such as:

- Scheduled maintenance and planned downtime windows
- Incident notifications (degraded performance, partial outages)
- Policy reminders (acceptable use, data handling, retention)
- Major changes (new models, feature rollouts, UI changes)
- Links to your internal comms channels for updates and Q&A

**Tip:** Keep banners concise and link to more detailed information (status page, release notes, support channel).

---

## Configuring banners

### Option 1: Using the Admin Panel

This is the most straightforward way to manage banners:

1. Log in to your Open WebUI instance as an administrator.
2. Navigate to **Settings** → **General** (admin section).
3. Locate the **Banners** section.
4. Click the **+** icon to add a new banner.
5. Click **Save** to apply your changes.

You can configure the following options for each banner:

- **Type:** The color and style of the banner:
  - `info` (Blue)
  - `success` (Green)
  - `warning` (Yellow)
  - `error` (Red)
- **Title:** The main heading of the banner.
- **Content:** The main message. Markdown is rendered and inline HTML is allowed, both passed through a sanitizer. Every newline becomes a line break before parsing, so multi-line Markdown blocks (lists, tables, blockquotes) do not form. Use their HTML forms for those.
- **Remember Dismissal:** If enabled, a banner the user closed stays closed. If disabled, it shows again on the next page load.

The globe selector next to the **Banners** heading stores the content per language, so each user reads the banner in the language their interface is set to. See [Translations](/features/administration/translations#banners).

#### How dismissing works

Dismissed banners are stored in the user’s browser (client-side). This means:

- A dismissed banner may reappear if the user clears site data / cache
- A dismissed banner may reappear on a different device or browser
- Dismissal is per-banner `id` (if the `id` changes, the banner is treated as new)

If you need the banner to come back on every page load, set `dismissible: false`.

---

### Option 2: Using environment variables (`WEBUI_BANNERS`)

For automated deployments, configure banners using the `WEBUI_BANNERS` environment variable. The value must be a **JSON string** representing a **list** (array) of banner objects.

**Environment variable:**

- `WEBUI_BANNERS`
  - **Type:** `string` (containing a JSON list of objects)
  - **Default:** `[]`
  - **Description:** A list of banner objects to be displayed to users

#### Example (Docker Compose)

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - 'WEBUI_BANNERS=[{"id":"maintenance-2026-03","type":"warning","title":"Maintenance","content":"A maintenance window is planned this week. Expect brief interruptions. <a href=\"https://intranet.example.com/status\" target=\"_blank\">See status page</a>.","dismissible":true,"timestamp":1772500000}]'
```

> Note: Because `WEBUI_BANNERS` is a JSON string inside YAML, you must ensure it remains valid JSON (see "Common pitfalls" below).

---

## Banner object properties

Each banner object supports the following properties:

- `id` (string, required): Unique identifier for the banner. Used to track whether a user has dismissed it.
- `type` (string, required): Banner style. Must be one of: `info`, `success`, `warning`, `error`.
- `title` (string, optional): Title text.
- `content` (string, required): Main banner message (Markdown, inline HTML allowed).
- `dismissible` (boolean, required): Whether a closed banner stays closed for that user (the **Remember Dismissal** switch).
- `timestamp` (integer, required): Present in configuration, but currently not used by the frontend to control display timing.
- `i18n` (object, optional): Translated content, keyed by language, each entry holding a `content` string. A user is shown the entry matching their interface language, falling back to `content`. See [Translations](/features/administration/translations#banners).

### Recommended `id` strategy (important)

Pick an `id` format that supports safe updates and avoids accidental re-showing or permanent hiding:

- Stable `id` for small text edits: `policy-reminder`
- Versioned `id` for "show again to everyone" updates: `incident-2026-03-06-v2`
- Time-bucketed `id` for recurring events: `maintenance-2026-03`

If users dismissed a banner and you want them to see an updated message, change the `id`.

---

## Supported content formatting

Banner `content` is parsed as Markdown and then sanitized, so inline Markdown (`**bold**`, `[link](url)`, backticks) and inline HTML both render. Because every newline is turned into a line break before parsing, block Markdown that spans lines (multi-line lists, tables, blockquotes, a heading on a later line) does not form. HTML lists, headings, tables and blockquotes do render. `title` is accepted in the JSON but never shown: the editor has no Title field, and the banner displays the type label plus the content.

Inline HTML renders after sanitizing: `<b>`, `<i>`, `<u>`, `<code>`, `<br>`, `<hr>`, `<details>`, `<a href>` (opens in the same tab, because the sanitizer strips `target`), `<img>` and inline `style` attributes.

> Keep styling purposeful. Large padding, large font sizes, or deeply nested layouts can make banners too tall and visually inconsistent across themes.

---

## Designing effective banners

Banners work best when they are easy to scan, visually distinct, and short enough not to interrupt normal work.

### Structure the message

Use a predictable structure:

- Start with the event type or status: `Maintenance`, `Incident`, `Policy update`, `New feature`.
- Put the most important detail first: date, time, impact, or required action.
- Keep the body to one or two short sentences.
- Add one link only if users need more details.

For longer notices, use short sections instead of one long paragraph. For multilingual notices, separate languages with a subtle `<hr>` or use a collapsible `<details>` section.

### Make severity visible

Use the banner `type` consistently:

- `info`: neutral announcements and product updates.
- `success`: resolved incidents or completed changes.
- `warning`: planned maintenance, degraded service, or upcoming action needed.
- `error`: active incidents or urgent action required.

Avoid using `error` for non-urgent announcements. Users learn to ignore alerts when every message looks critical.

### Use color carefully

Keep styling light: a pale background with a stronger accent works well, and text contrast should stay high.

### Keep layouts responsive

Banners are shown inside the application layout and must still work on narrow screens.

- Prefer `display:flex;flex-wrap:wrap` for rows containing labels, dates, or badges.
- Avoid fixed widths.
- Use `width:100%;box-sizing:border-box` for full-width styled blocks.
- Keep icons and badges small so they do not increase banner height.
- Test the banner with a narrow browser window before using it broadly.

### Avoid accidental extra height

Banner content treats literal newlines as line breaks. If you use explicit `<br>` tags, keep the raw HTML compact and avoid adding extra blank lines or indentation in the banner content field.

This compact style:

```html
<b>Notice</b><br>One short sentence.<br>Another short sentence.
```

renders more predictably than heavily formatted HTML with many line breaks.

---

## Unsupported content

Block Markdown that spans several lines (lists, tables, blockquotes, a heading on a later line) does not form, because every newline becomes a line break. HTML lists, headings, tables and blockquotes do render. For list-like content, use short lines separated by `<br>`.

---

## Common pitfalls (and how to avoid them)

### JSON/YAML escaping issues in `WEBUI_BANNERS`

When using `WEBUI_BANNERS`, you are embedding JSON inside a YAML string (or a shell string). Escape double quotes inside the JSON as `\"`, avoid line breaks and "smart quotes", and validate the JSON before deploying. Check server logs if the banner does not appear.

---

## Reusable patterns (copy/paste snippets)

### Pattern: Minimal two-line announcement with a link

```html
<b>Notice</b><br>
Service updates: <a href="https://example.com/status" target="_blank"><u>Status page</u></a>
```

### Pattern: Compact "label" chip (date/impact tag)

```html
<span style="display:inline-block;background:#fff3cd;color:#664d03;padding:2px 8px;border-radius:999px;">
  Scheduled
</span>
```

### Pattern: Collapsible details (keep banners short)

```html
<b>Planned update</b><br>
<details>
  <summary>More details</summary>
  <br>
  This update may cause brief interruptions during the deployment window.
</details>
```

---

## Operational best practices

### Keep banners scannable

A good banner is typically:
- A short title
- One sentence describing the situation
- One link for details and one link for questions (if needed)

### Use banner types consistently

To reduce alert fatigue, consider a consistent mapping:
- `info`: general announcements
- `success`: completed changes / resolved incidents
- `warning`: planned maintenance or partial degradation
- `error`: active incident / outage

### Remove expired banners

If you keep adding banners without removing old ones, users may ignore them. Remove or replace banners after the event is over.

---

## Troubleshooting

### Banner not appearing

- Ensure `WEBUI_BANNERS` is a valid JSON **array** of objects (not a single object).
- Check the server logs for parsing errors related to `WEBUI_BANNERS`.
- If using Admin Panel, confirm you clicked **Save**.

### Banner cannot be dismissed

- Verify that `dismissible` is set to `true`.
- Every banner can be closed with its × button. `dismissible: true` (the **Remember Dismissal** switch in the editor) remembers the closure in the browser, so the banner stays gone. `false` hides it only until the page is reloaded. There is no way to make a banner unclosable.

### Banner layout looks broken or too tall

- Remove extra blank lines and indentation from the raw HTML.
- Avoid unsupported HTML (lists, tables, headings).
- Reduce aggressive inline styles (large `padding`, large `font-size`).

---

## FAQ

### Can I use Markdown in banner content?

Yes, for inline Markdown. Content is parsed with Markdown, then sanitized. Multi-line Markdown blocks do not form because newlines become line breaks first, so use HTML for lists, tables and headings that need more than one line.

### Does `timestamp` control when a banner shows?

No. The `timestamp` field is currently not used by the frontend to control whether a banner is displayed. If you need time-based behavior, manage it via your deployment automation (add/remove banners on a schedule).

### Can I show content in multiple languages?

Yes, and the better way is to translate the banner rather than stacking languages in one message: use the globe selector next to the **Banners** heading and each user reads only their own language. See [Translations](/features/administration/translations#banners). Banners set through `WEBUI_BANNERS` can carry the same thing as an `i18n` object on the banner, keyed by language, with a `content` string in each entry.
