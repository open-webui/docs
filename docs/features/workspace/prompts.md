---
sidebar_position: 3
title: "Prompts"
---

# 📝 Prompts

**Reusable slash commands that turn complex instructions into one-click forms.**

Prompts let you save frequently used instructions as slash commands. Type `/summarize` in any chat and the full prompt fires instantly. Add custom input variables and users get a popup form with dropdowns, date pickers, and text fields before the prompt is sent. No one needs to remember the exact wording or structure.

Every change is tracked with full version history. Roll back to a previous version, compare changes, and share prompts across your team with access controls.

---

## Why Prompts?

### Stop retyping the same instructions

Save the prompt once, use it with `/command`. Bug report templates, meeting minutes, code reviews, content briefs: anything you type more than twice should be a prompt.

### Turn prompts into interactive forms

Add typed input variables (dropdowns, date pickers, number fields, checkboxes) and users get a clean form instead of editing raw text. Non-technical users can run complex prompts without understanding the syntax.

### Version history with rollback

Every change creates a new version. Compare versions side-by-side, restore a previous version to production, and track who changed what.

### Controlled sharing

Share prompts with specific users or groups. Public prompts appear in everyone's `/` suggestions. Private prompts stay in your own workspace.

---

## Key Features

| | |
| :--- | :--- |
| ⚡ **Slash commands** | Type `/command` to insert the full prompt |
| 📋 **Input variable forms** | Typed fields (text, dropdown, date, number, checkbox, and more) generate a popup form |
| 🕑 **Version history** | Full change tracking with commit messages, rollback, and production pinning |
| 🔄 **System variables** | `{{CURRENT_DATE}}`, `{{USER_NAME}}`, `{{CLIPBOARD}}` auto-replaced at runtime |
| 🔒 **Access control** | Share with specific users, groups, or make public |
| 🔀 **Enable/Disable toggle** | Deactivate prompts without deleting them |
| 🏷️ **Tags** | Organize and filter your prompt library |

---

## Creating a Prompt

Navigate to **Workspace > Prompts** and click **+ New Prompt**.

| Field | Description |
| :--- | :--- |
| **Name** | Descriptive title for identification |
| **Tags** | Categorize for filtering |
| **Access** | Control who can view and use the prompt |
| **Command** | The slash command trigger (e.g., `/summarize`) |
| **Prompt Content** | The actual text sent to the model, with variables |
| **Commit Message** | Optional description of changes for version tracking |

Use clear variable names (`{{your_name}}` not `{{var1}}`), add descriptive `placeholder` text, provide `default` values where sensible, and mark only truly essential fields as `:required`. Public prompts appear in every user's `/` suggestions, so be selective about what you make public. Use the enable/disable toggle to shelve prompts you're not actively using.

---

## Variables

### System variables

Automatically replaced with their value at runtime:

| Variable | Description |
| :--- | :--- |
| `{{CLIPBOARD}}` | Content from your clipboard (requires clipboard permission) |
| `{{CURRENT_DATE}}` | Current date |
| `{{CURRENT_DATETIME}}` | Current date and time |
| `{{CURRENT_TIME}}` | Current time |
| `{{CURRENT_TIMEZONE}}` | Current timezone |
| `{{CURRENT_WEEKDAY}}` | Current day of the week |
| `{{USER_NAME}}` | Your display name |
| `{{USER_EMAIL}}` | Your email address |
| `{{USER_BIO}}` | Bio from Settings > Account > User Profile (unreplaced if not set) |
| `{{USER_GENDER}}` | Gender from Settings > Account > User Profile (unreplaced if not set) |
| `{{USER_BIRTH_DATE}}` | Birth date from Settings > Account > User Profile (unreplaced if not set) |
| `{{USER_AGE}}` | Age calculated from birth date (unreplaced if not set) |
| `{{USER_LANGUAGE}}` | Your selected language |
| `{{USER_LOCATION}}` | Your location (requires HTTPS + Settings > Interface toggle) |

### Custom input variables

Add variables to your prompt content and users get a popup form when they use the slash command.

**Simple input** creates a single-line text field:
```
{{variable_name}}
```

**Typed input** creates a specific field type with configured properties:
```
{{variable_name | type:property="value"}}
```

All custom variables are **optional by default**. Add `:required` to make a field mandatory:
```
{{title | text:required}}
{{notes | textarea:placeholder="Additional context (optional)"}}
```

### Available input types

| Type | Description | Example |
| :--- | :--- | :--- |
| **text** | Single-line text (default) | `{{name \| text:placeholder="Enter name":required}}` |
| **textarea** | Multi-line text | `{{description \| textarea:required}}` |
| **select** | Dropdown menu | `{{priority \| select:options=["High","Medium","Low"]:required}}` |
| **number** | Numeric input | `{{count \| number:min=1:max=100:default=5}}` |
| **checkbox** | Boolean toggle | `{{include_details \| checkbox:label="Include analysis"}}` |
| **date** | Date picker | `{{start_date \| date:required}}` |
| **datetime-local** | Date and time picker | `{{appointment \| datetime-local}}` |
| **color** | Color picker | `{{brand_color \| color:default="#FFFFFF"}}` |
| **email** | Email field with validation | `{{email \| email:required}}` |
| **range** | Slider | `{{rating \| range:min=1:max=10}}` |
| **tel** | Phone number | `{{phone \| tel}}` |
| **time** | Time picker | `{{meeting_time \| time}}` |
| **url** | URL with validation | `{{website \| url:required}}` |
| **month** | Month and year (Chrome/Edge only, falls back to text in Firefox/Safari) | `{{billing_month \| month}}` |
| **map** | Interactive map for coordinates (experimental) | `{{location \| map}}` |

---

## Message and Prompt Modifiers

These modifiers are especially useful for task model prompts (title generation, tag generation, follow-up suggestions) where conversations contain long messages like pasted documents or code.

### Prompt truncation

The `{{prompt}}` variable supports character-based truncation:

| Modifier | What it does |
| :--- | :--- |
| `{{prompt:start:N}}` | First N characters |
| `{{prompt:end:N}}` | Last N characters |
| `{{prompt:middletruncate:N}}` | First half + last half, N characters total |

### Message selectors vs pipe filters

The `{{MESSAGES}}` variable has two distinct modifier types that work at different levels:

**Message selectors** (colon `:`) control **how many messages** to include:

| Selector | What it does | Example |
| :--- | :--- | :--- |
| `START:N` | First N messages | `{{MESSAGES:START:5}}` |
| `END:N` | Last N messages | `{{MESSAGES:END:5}}` |
| `MIDDLETRUNCATE:N` | First N/2 + last N/2 messages | `{{MESSAGES:MIDDLETRUNCATE:6}}` |

With 20 messages, `{{MESSAGES:MIDDLETRUNCATE:6}}` keeps messages 1-3 and 18-20, skipping the 14 in the middle.

**Pipe filters** (pipe `|`) truncate the **content of each individual message** to a character limit:

| Filter | What it does | Example |
| :--- | :--- | :--- |
| `\|start:N` | First N characters of each message | `\{\{MESSAGES\|start:300\}\}` |
| `\|end:N` | Last N characters of each message | `\{\{MESSAGES\|end:300\}\}` |
| `\|middletruncate:N` | First + last half of each message | `\{\{MESSAGES\|middletruncate:500\}\}` |

**Combine both** to control which messages are included and how long each one is:

| Syntax | What it does |
| :--- | :--- |
| `\{\{MESSAGES:END:2\|middletruncate:500\}\}` | Last 2 messages, each capped at 500 characters |
| `\{\{MESSAGES:START:5\|start:200\}\}` | First 5 messages, each capped at 200 characters |
| `\{\{MESSAGES:MIDDLETRUNCATE:10\|middletruncate:50\}\}` | First 5 + last 5 messages, each capped at 50 characters |

:::warning Selectors count messages, not characters
`{{MESSAGES:MIDDLETRUNCATE:500}}` selects **500 messages**. To limit characters per message, use a pipe filter: `\{\{MESSAGES\|middletruncate:500\}\}`. Without pipe filters, a single pasted document can consume the entire context window.
:::

---

## Version History

Every save creates a new version. When editing a prompt, the **History sidebar** shows all versions with the commit message, author, timestamp, and a "Live" badge on the active production version.

**Preview** any version by clicking it. **Set as Production** to restore it as the active version. **Delete** old versions from the menu (the current production version cannot be deleted).

:::note Migration
Prompts created before the versioning update were automatically migrated with their content preserved as the initial "Live" version. The URL structure changed from command-based to ID-based, so existing bookmarks may need updating. As of v0.5.0, all variables are optional by default.
:::

---

## Examples

### Bug report generator (`/bug_report`)

A structured form with required summary, priority dropdown, and reproduction steps, plus optional context fields:

```txt
Generate a bug report with the following details:

**Summary:** {{summary | text:placeholder="A brief summary of the issue":required}}
**Priority:** {{priority | select:options=["Critical","High","Medium","Low"]:default="Medium":required}}
**Steps to Reproduce:**
{{steps | textarea:placeholder="1. Go to...\n2. Click on...\n3. See error...":required}}

**Additional Context:** {{additional_context | textarea:placeholder="Browser version, OS, screenshots, etc."}}
**Workaround:** {{workaround | textarea:placeholder="Any temporary solutions found"}}

Please format this into a clear and complete bug report document.
```

### Meeting minutes (`/meeting_minutes`)

Date and time pickers, required attendees and agenda, optional decisions and action items:

```txt
# Meeting Minutes

**Date:** {{meeting_date | date:required}}
**Time:** {{meeting_time | time:required}}
**Title:** {{title | text:placeholder="e.g., Weekly Team Sync":required}}
**Attendees:** {{attendees | text:placeholder="Comma-separated list of names":required}}

## Agenda / Key Discussion Points
{{agenda_items | textarea:placeholder="Paste the agenda or list the key topics discussed.":required}}

## Decisions Made
{{decisions | textarea:placeholder="Key decisions and outcomes"}}

## Action Items
{{action_items | textarea:placeholder="Action item, assignee, and deadline for each."}}

## Next Meeting
**Date:** {{next_meeting | date}}
**Topics:** {{next_topics | text:placeholder="Items to discuss next time"}}

Please format this into a clean and professional meeting summary.
```

### Title generation (task model template)

Uses message selectors + pipe filters to keep context small:

```txt
Chat history:
<chat_history>
{{MESSAGES:END:2|middletruncate:500}}
</chat_history>

Generate a short title for this conversation.
```

Sends only the last 2 messages, each capped at 500 characters.

---

## Limitations

### Slash command namespace

Public prompts appear in every user's `/` suggestions. Too many public prompts clutter the menu. Use the enable/disable toggle to keep inactive prompts out of suggestions.

### Optional by default

All custom input variables are optional unless marked `:required`. If your prompt depends on a field, add `:required` explicitly.
