---
sidebar_position: 13
title: "Customizable Banners"
---

## Overview

Open WebUI allows administrators to display custom banners to logged-in users. Banners are useful for announcements, system-wide alerts, maintenance notices, and other important messages.

Banners are persistent and can optionally be **dismissible** by users. You can configure banners in two ways:

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
2. Navigate to **Admin Panel** → **Settings** → **General**.
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
- **Content:** The main message (HTML only).
- **Dismissible:** If enabled, users can close the banner.

#### How dismissing works

Dismissed banners are stored in the user’s browser (client-side). This means:

- A dismissed banner may reappear if the user clears site data / cache
- A dismissed banner may reappear on a different device or browser
- Dismissal is per-banner `id` (if the `id` changes, the banner is treated as new)

If you need the banner to remain visible for everyone, set `dismissible: false`.

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
- `content` (string, required): Main banner message (HTML only).
- `dismissible` (boolean, required): Whether the user can dismiss the banner.
- `timestamp` (integer, required): Present in configuration, but currently not used by the frontend to control display timing.

### Recommended `id` strategy (important)

Pick an `id` format that supports safe updates and avoids accidental re-showing or permanent hiding:

- Stable `id` for small text edits: `policy-reminder`
- Versioned `id` for "show again to everyone" updates: `incident-2026-03-06-v2`
- Time-bucketed `id` for recurring events: `maintenance-2026-03`

If users dismissed a banner and you want them to see an updated message, change the `id`.

---

## Supported content formatting (HTML only)

Banner `title` and `content` support a subset of **HTML only** — Markdown syntax is not rendered. Unsupported tags may render as plain text or break the layout.

### Text formatting

| HTML | Effect |
| --- | --- |
| `<b>` / `<strong>` | Bold |
| `<i>` / `<em>` | Italic |
| `<u>` | Underline |
| `<s>` / `<del>` | Strikethrough |
| `<mark>` | Highlight |
| `<small>` | Slightly smaller text |
| `<sub>` / `<sup>` | Subscript / Superscript |
| `<code>` / `<kbd>` | Monospace inline code |
| `<abbr title="tooltip">` | Hover tooltip |

### Structure

| HTML | Effect |
| --- | --- |
| `<br>` or literal newlines | Line break |
| `<hr>` | Horizontal rule |
| `<details><summary>Click</summary>...</details>` | Collapsible section |

### Links & media

| HTML | Effect |
| --- | --- |
| `<a href="..." target="_blank">` | Clickable link |
| `<img src="..." width="16" height="16">` | Inline image |

### Custom styling

Inline styles are supported on allowed tags:

```html
<span style="color: #b91c1c;">Colored text</span>
<span style="font-weight: 600;">Heavier weight</span>
<span style="background: linear-gradient(90deg,#e0f2fe,#fef9c3);">Gradient background</span>
```

You can also style a full message area by wrapping the content in a block element:

```html
<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:10px 14px;line-height:1.3;display:block;width:100%;box-sizing:border-box;">
  <b>Notice title</b><br>
  Short supporting message.
</div>
```

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

Color should support the banner type, not compete with it:

- Use soft backgrounds for the full message area.
- Use stronger colors for small accents, labels, or left borders.
- Keep text contrast high enough to read in bright rooms and on dim screens.
- Avoid mixing many unrelated colors in one banner.

A useful pattern is a pale background plus a stronger left border:

```html
<div style="background:#f8fafc;color:#334155;border:1px solid #cbd5e1;border-left:6px solid #64748b;border-radius:12px;padding:10px 14px;line-height:1.3;display:block;width:100%;box-sizing:border-box;">
  <b>Notice title</b><br>
  Short supporting message.
</div>
```

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

The following are not supported in banners and may render as plain text or break the layout:

- Headings (`<h1>`–`<h6>`)
- Lists (`<ul>`, `<ol>`)
- Tables
- Blockquotes
- Markdown syntax

If you need "list-like" content, use short lines separated by `<br>`.

---

## Common pitfalls (and how to avoid them)

### 1) Unexpected spacing from literal newlines

Banner content treats **literal newlines** as line breaks. If you paste nicely formatted/indented HTML with many line breaks, the banner may appear much taller than expected.

**Recommendation:**
- Use `<br>` deliberately, and keep the raw HTML relatively compact.
- Avoid adding blank lines unless you truly want extra spacing.

### 2) Broken links in banner content

If a link appears "broken" or the rest of the banner becomes clickable, it’s usually due to invalid HTML.

Use this exact pattern:

```html
<a href="https://example.com" target="_blank">Open link</a>
```

**Recommendations:**
- Always close anchor tags with `</a>`.
- Use `target="_blank"` (underscore included).
- If your URL contains query parameters, escape `&` as `&amp;` inside the `href` attribute:
  ```html
  <a href="https://example.com/page?x=1&amp;y=2" target="_blank">Example</a>
  ```
- If you need guaranteed underlining, wrap link text with `<u>`:
  ```html
  <a href="https://example.com" target="_blank"><u>Support</u></a>
  ```

### 3) JSON/YAML escaping issues in `WEBUI_BANNERS`

When using `WEBUI_BANNERS`, you are embedding JSON inside a YAML string (or a shell string). Common problems include:

- Unescaped double quotes inside the JSON
- Line breaks inserted into the JSON string
- Copy/paste "smart quotes" (typographic quotes) instead of normal `"`

**Recommendations:**
- Validate the JSON in a JSON validator before deploying.
- Keep `content` strings simple; avoid unescaped `"` characters.
- Prefer using `\"` for quotes inside JSON strings if needed.
- Check server logs if the banner does not appear.

### 4) Overusing `<small>`

`<small>` is useful for secondary text, but wrapping large parts of the banner in `<small>` can make content hard to read.

**Recommendation:** Use normal text for the main message and reserve `<small>` for less important details.

### 5) External images

Images can be embedded via `<img>`, but external images may:
- Fail to load due to network restrictions
- Create inconsistent sizes across devices if not constrained
- Introduce privacy/security concerns if loaded from third-party domains

**Recommendations:**
- Prefer internal/static assets when possible.
- Always set explicit `width` and `height`.
- Keep icons small (e.g., 16×16) to avoid increasing banner height.

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

### Pattern: Styled notice block

Use a full-width styled block when the whole message should read as one announcement area. Keep this HTML compact when pasting it into the banner content field, especially if it also contains `<br>` tags.

```html
<div style="background:#f8fafc;color:#334155;border:1px solid #cbd5e1;border-left:6px solid #64748b;border-radius:12px;padding:10px 14px;line-height:1.3;display:block;width:100%;box-sizing:border-box;"><div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px 8px;margin-bottom:5px;"><span style="display:inline-flex;align-items:center;background:#64748b;color:#fff;padding:1px 7px;border-radius:999px;line-height:1.25;font-size:10px;font-weight:700;letter-spacing:.04em;">NOTICE</span><b>Notice title</b><span style="display:inline-flex;align-items:center;background:#fff;color:#334155;padding:1px 8px;border-radius:999px;line-height:1.25;border:1px solid #cbd5e1;">Key detail</span></div><div>Short supporting message.</div></div>
```

This pattern uses:

- A pale background for the full message area.
- A stronger left border for fast visual recognition.
- A small uppercase label for the event type.
- A compact date/time chip for the most important metadata.
- `flex-wrap` so the header row still works on narrow screens.

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
- If `dismissible` is `false`, the banner is intentionally always visible.

### Banner layout looks broken or too tall

- Remove extra blank lines and indentation from the raw HTML.
- Avoid unsupported HTML (lists, tables, headings).
- Reduce aggressive inline styles (large `padding`, large `font-size`).

---

## FAQ

### Can I use Markdown in banner content?

No. Banner content supports **HTML only**. Markdown syntax is not rendered.

### Does `timestamp` control when a banner shows?

No. The `timestamp` field is currently not used by the frontend to control whether a banner is displayed. If you need time-based behavior, manage it via your deployment automation (add/remove banners on a schedule).

### Can I show content in multiple languages?

Yes. You can include multiple languages in `content`. If you want to keep the banner short, place the secondary language in a `<details>` block.
