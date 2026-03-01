---
sidebar_position: 6
title: "Skills"
sidebar_label: "Skills"
---

Skills are reusable, markdown-based instruction sets that you can attach to models or invoke on-the-fly in chat. Unlike [Tools](/features/extensibility/plugin/tools) (which are executable Python scripts), Skills are **plain-text instructions** that teach a model *how* to approach a task — such as code review guidelines, writing style rules, or troubleshooting playbooks.

## How Skills Work

Skills behave differently depending on how they are activated:

### User-Selected Skills ($ Mention)

When you mention a skill in chat with `$`, its **full content is injected directly** into the system prompt. The model has immediate access to the complete instructions without needing any extra tool calls.

### Model-Attached Skills

Skills bound to a model use a **lazy-loading** architecture to keep the context window efficient:

1. **Manifest injection** — Only a lightweight manifest containing the skill's **name** and **description** is injected into the system prompt.
2. **On-demand loading** — The model receives a `view_skill` builtin tool. When it determines it needs a skill's full instructions, it calls `view_skill` with the skill name to load the complete content.

This design means that even if many skills are attached to a model, only the ones the model actually needs are loaded into context.

## Creating a Skill

Navigate to **Workspace → Skills** and click **+ New Skill**.

| Field | Description |
| :--- | :--- |
| **Name** | A human-readable display name (e.g., "Code Review Guidelines"). |
| **Skill ID** | A unique slug identifier, auto-generated from the name (e.g., `code-review-guidelines`). Editable during creation, read-only afterwards. |
| **Description** | A short summary shown in the manifest. For model-attached skills, the model uses this to decide whether to load the full instructions. |
| **Content** | The full skill instructions in **Markdown**. For user-selected skills this is injected directly; for model-attached skills it is loaded on-demand via `view_skill`. |

Click **Save & Create** to finalize.

## Using Skills

### In Chat ($ Mention)

Type `$` in the chat input to open the skill picker. Select a skill, and it will be attached to the message as a **skill mention** (similar to `@` for models or `#` for knowledge). The skill's **full content** is injected directly into the conversation, giving the model immediate access to the complete instructions.

### Bound to a Model

You can permanently attach skills to a model so they are always available:

1. Go to **Workspace → Models**.
2. Edit a model and scroll to the **Skills** section.
3. Check the skills you want this model to always have access to.
4. Click **Save**.

When a user chats with that model, the selected skills' manifests (name and description) are automatically injected, and the model can load the full content on-demand via `view_skill`.

## Import and Export

### Importing from Markdown

Click **Import** on the Skills workspace page and select a `.md` file. If the file contains YAML frontmatter with `name` and/or `description` fields, those values are auto-populated into the creation form.

Example frontmatter:

```yaml
---
name: code-review-guidelines
description: Step-by-step instructions for thorough code reviews
---

# Code Review Guidelines

1. Check for correctness...
```

### Exporting

- **Single skill**: Click the ellipsis menu (**...**) on a skill and select **Export** to download it as a JSON file.
- **Bulk export**: Click the **Export** button at the top of the Skills page to export all accessible skills as a single JSON file.

## Skill Management

From the Skills workspace list, you can perform the following actions via the ellipsis menu (**...**) on each skill:

| Action | Description |
| :--- | :--- |
| **Edit** | Open the skill editor to modify content, name, or description. |
| **Clone** | Create a copy with `-clone` appended to the ID and "(Clone)" to the name. |
| **Export** | Download the skill as a JSON file. |
| **Delete** | Permanently remove the skill. Also available via Shift+Click on the delete icon for quick deletion. |

### Active / Inactive Toggle

Each skill has an **active/inactive toggle** visible on the list page. Inactive skills are excluded from manifests and cannot be loaded by the model, even if they are bound to one or mentioned in chat.

## Code Execution Backends

The backend you choose affects what your skills can do — from simple text transformations (Pyodide) to full OS-level shell access (Open Terminal). Each has different trade-offs in library support, isolation, persistence, and multi-user safety.

See the [Code Execution overview](/features/chat-conversations/chat-features/code-execution) for a detailed comparison of all available backends and guidance on choosing the right one for your deployment.

### Setting Up Open Terminal

Open Terminal is a FastAPI application that automatically exposes an [OpenAPI specification](https://swagger.io/specification/). This means it works out of the box as an OpenAPI Tool Server — Open WebUI auto-discovers its endpoints and registers them as tools. No manual tool creation needed.

**1. Start an Open Terminal instance**

Follow the [Open Terminal setup guide](/features/extensibility/open-terminal#getting-started) to launch an instance using Docker or pip.

**2. Connect to Open WebUI**

Add your Open Terminal instance as a Tool Server by following the [OpenAPI Tool Server Integration Guide](/features/extensibility/plugin/tools/openapi-servers/open-webui). You can connect it as:

- A **User Tool Server** (in **Settings → Tools**) — connects from your browser, ideal for personal or local instances
- A **Global Tool Server** (in **Admin Settings → Integrations**) — connects from the backend, available to all users

Once connected, the Open Terminal tools (execute, file upload, file download) appear automatically in the chat interface.

:::tip
For the best experience, pair Open Terminal with a [Skill](/features/ai-knowledge/skills) that teaches the model how to use the tool effectively — for example, instructing it to always check exit codes, handle errors gracefully, and use streaming for long-running commands.
:::

See the [Open Terminal documentation](/features/extensibility/open-terminal) for the full API reference and detailed setup instructions.

## Access Control

Skills use the same [Access Control](/features/access-security/rbac) system as other workspace resources:

- **Private by default**: Only the creator can see and edit a new skill.
- **Share with users or groups**: Use the **Access** button in the skill editor to grant `read` or `write` access to specific users or groups.
- **Read-only access**: Users with only read access can view the skill content but cannot edit it. The editor displays a "Read Only" badge.

### Required Permissions

- **Workspace → Skills Access**: Required to access the Skills workspace and create/manage skills.
- **Sharing → Share Skills**: Required to share skills with individual users or groups.
- **Sharing → Public Skills**: Required to make skills publicly accessible.

See [Permissions](/features/access-security/rbac/permissions) for details on how to configure these.
