---
sidebar_position: 6
title: "Skills"
sidebar_label: "Skills"
---

# 🧩 Skills

**Teach your AI how to approach a task with plain-text instructions.**

Skills are reusable, markdown-based instruction sets that you attach to models or invoke on-the-fly in chat. Unlike [Tools](/features/extensibility/plugin/tools) (executable Python scripts), Skills are plain-text instructions: code review guidelines, writing style rules, troubleshooting playbooks, data analysis workflows. The model reads them and follows them.

Mention a skill with `$` in chat to inject its full content immediately. Or bind skills to a model so they're always available, loaded on-demand to keep the context window efficient.

---

## Why Skills?

### Instructions without code

Write guidelines in Markdown. No Python, no API calls, no deployment. If you can write a document, you can create a skill.

### On-demand context loading

Model-attached skills use lazy loading. Only a lightweight manifest (name + description) is injected by default. The model loads the full instructions only when it needs them via the `view_skill` tool.

### Reusable across models

Create one "Code Review Guidelines" skill and attach it to every coding model. Update the skill once, and every model gets the new version.

### Composable with tools

Pair a skill with [Open Terminal](/features/open-terminal) or any tool server. The skill teaches the model *how* to use the tool (check exit codes, handle errors, use streaming for long-running commands), while the tool provides the *capability*.

---

## Key Features

| | |
| :--- | :--- |
| 📝 **Markdown content** | Write instructions in plain Markdown |
| ⚡ **$ mention in chat** | Type `$` to inject a skill's full content into the current message |
| 🤖 **Model binding** | Attach skills to models so they're always available |
| 📦 **Lazy loading** | Model-attached skills inject only a manifest; full content loads on-demand |
| 📥 **Import/Export** | Import `.md` files with YAML frontmatter; export as JSON |
| 🔒 **Access control** | Private by default, shareable with users or groups |
| 🔀 **Active/Inactive toggle** | Deactivate skills without deleting them |

---

## How Skills Work

### User-selected skills ($ mention)

Type `$` in the chat input to open the skill picker. Select a skill, and its **full content is injected directly** into the system prompt. The model has immediate access to the complete instructions.

### Model-attached skills

Skills bound to a model use lazy loading:

1. **Manifest injection** - Only the skill's name and description are added to the system prompt.
2. **On-demand loading** - The model receives a `view_skill` builtin tool. When it determines it needs a skill's full instructions, it calls `view_skill(skill_name)` to load them.

This means many skills can be attached to a model without consuming context window space until actually needed.

---

## Creating a Skill

Navigate to **Workspace > Skills** and click **+ New Skill**.

| Field | Description |
| :--- | :--- |
| **Name** | Human-readable display name (e.g., "Code Review Guidelines") |
| **Skill ID** | Unique slug, auto-generated from the name. Editable during creation, read-only afterwards |
| **Description** | Short summary shown in the manifest. For model-attached skills, the model uses this to decide whether to load the full instructions |
| **Content** | Full skill instructions in Markdown |

### Importing from Markdown

Click **Import** and select a `.md` file. If the file contains YAML frontmatter with `name` and/or `description` fields, those values are auto-populated:

```yaml
---
name: code-review-guidelines
description: Step-by-step instructions for thorough code reviews
---

# Code Review Guidelines

1. Check for correctness...
```

---

## Binding Skills to a Model

1. Go to **Workspace > Models**.
2. Edit a model and scroll to the **Skills** section.
3. Check the skills you want this model to always have access to.
4. Click **Save**.

The selected skills' manifests are automatically injected, and the model can load full content on-demand via `view_skill`.

---

## Skill Management

From the Skills workspace list, use the ellipsis menu (**...**):

| Action | Description |
| :--- | :--- |
| **Edit** | Modify content, name, or description |
| **Clone** | Create a copy with `-clone` appended to the ID |
| **Export** | Download as JSON |
| **Delete** | Permanently remove (Shift+Click for quick deletion) |

**Bulk export**: Click the **Export** button at the top of the Skills page to export all accessible skills as a single JSON file.

**Active/Inactive toggle**: Inactive skills are excluded from manifests and cannot be loaded by the model, even if bound to one or mentioned in chat.

---

## Access Control

Skills use the same [Access Control](/features/access-security/rbac) system as other workspace resources:

- **Private by default**: Only the creator can see and edit a new skill.
- **Share with users or groups**: Grant `read` or `write` access via the **Access** button.
- **Read-only access**: Users with read access can view but not edit. The editor shows a "Read Only" badge.

:::caution Attached skills still require user access
Attaching a skill to a model does **not** bypass access control. When a user chats with the model, Open WebUI checks whether that user has read access to each attached skill. Skills the user can't access are silently excluded.

**Example**: An admin creates a private skill and attaches it to a shared model. Regular users chatting with this model will not get the skill because they don't have read access.

**Solution**: Make sure users who need the model's skills also have read access to each skill (via access grants, group permissions, or by making the skill public).
:::

### Required permissions

| Permission | What it controls |
| :--- | :--- |
| **Workspace > Skills Access** | Access the Skills workspace and create/manage skills |
| **Sharing > Share Skills** | Share skills with individual users or groups |
| **Sharing > Public Skills** | Make skills publicly accessible |

See [Permissions](/features/access-security/rbac/permissions) for configuration details.

---

## Use Cases

### Code review standards

Write your team's review checklist as a skill: naming conventions, error handling patterns, test coverage requirements. Attach it to your coding models so every review follows the same bar.

### Writing style guide

Document tone, formatting rules, and terminology in a skill. Attach it to content-writing models. Every draft follows your brand voice.

### Troubleshooting playbooks

Encode your runbook for common issues: "check logs first, verify config, test connectivity, escalate if X." The model follows the same diagnostic steps your senior engineers would.

### Tool usage instructions

Pair a skill with Open Terminal to teach the model *how* to use it well. "Always check exit codes. Use `set -e` in scripts. Stream output for commands that take more than 10 seconds."

---

## Limitations

### Plain text only

Skills are instructions, not executable code. For actions that require computation, API calls, or system access, use [Tools](/features/extensibility/plugin/tools) instead.

### Context window with $ mention

When injected via `$` mention, the full skill content goes into the system prompt. A very long skill attached to a model with a small context window may crowd out conversation history.

### Lazy loading requires function calling

Model-attached skills depend on the `view_skill` builtin tool, which requires [native function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) to be enabled. Without it, the model receives only the manifest and cannot load the full instructions.
