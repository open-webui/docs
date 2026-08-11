---
sidebar_position: 2
title: "Models"
sidebar_label: "Models"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Models

<ThemedImage
  alt="Workspace map with the Models cell highlighted: Models, Knowledge, Prompts, Skills and Tools around the Open WebUI core"
  sources={{
    light: useBaseUrl('/images/banners/workspace-models-light.svg'),
    dark: useBaseUrl('/images/banners/workspace-models-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Wrap any model with custom instructions, tools, and knowledge to build specialized agents.**

The Models workspace lets you create configuration presets that sit on top of any base model. Pick GPT-4o, Claude, Llama 3, or anything else connected to Open WebUI, then bind a system prompt, knowledge bases, tools, skills, and parameter overrides to it. The result is a purpose-built agent that behaves exactly the way you need without modifying the underlying model.

A "Python Tutor" that always uses your style guide. A "Meeting Summarizer" with your company's template. A "Code Reviewer" with your linting rules baked in. Every agent is a thin wrapper: pick a base model, configure it, and share it with your team.

---

## Why Models?

### One base model, many personas

The same GPT-4o can power a coding assistant, a customer support bot, and a creative writer. Each preset has its own system prompt, tools, and knowledge, so the model behaves differently depending on which preset is selected.

### Knowledge and tools come pre-attached

Instead of manually attaching documents and enabling tools every chat, bind them once to the model preset. Users get a fully configured agent out of the box.

### Granular access control

Restrict models to specific users or groups. A finance team sees their models; engineering sees theirs. Admins control what's available instance-wide.

### Dynamic system prompts

Use Jinja2-style variables like `{{ USER_NAME }}` and `{{ CURRENT_DATE }}` so the system prompt adapts to each user and session automatically.

---

## Key Features

| | |
| :--- | :--- |
| 🧩 **Model presets** | System prompt, tools, knowledge, skills, and parameters in one package |
| 🏷️ **Dynamic variables** | `{{ USER_NAME }}`, `{{ CURRENT_DATE }}`, `{{ CURRENT_TIME }}` injected automatically |
| 🔧 **Bound tools** | Force-enable specific tools per model |
| 📚 **Attached knowledge** | Knowledge bases and files always available via RAG or full context |
| 🎭 **Skills** | Bind markdown instruction sets loaded on-demand via `view_skill` |
| 👥 **Access control** | Restrict to specific users or groups |
| 📊 **Global defaults** | Set baseline capabilities and parameters for all models at once |
| 🔊 **Per-model TTS voice** | Give each persona its own voice |

---

## Creating a Model

Click **Create** in the **Workspace** header while the **Models** tab is selected, or click the ellipsis (**...**) on an existing model and select **Edit**.

### Core configuration

| Field | Description |
| :--- | :--- |
| **Avatar** | Upload a custom image. Animated GIF and WebP are supported |
| **Name and ID** | Display name and unique identifier |
| **Base Model** | The actual model that powers this agent |
| **Description** | Short summary shown in the model selector |
| **Tags** | Organize models in the dropdown |
| **Visibility** | Private (specific users/groups) or public |

![The model editor with base model, description and system prompt](/images/workspace/model-editor.png)

### System prompt and variables

The system prompt defines the behavior and persona. Use dynamic variables for context-aware instructions:

| Variable | Output example |
| :--- | :--- |
| `{{ CURRENT_DATE }}` | `2024-10-27` |
| `{{ CURRENT_TIME }}` | `14:30:05` |
| `{{ USER_NAME }}` | `Admin` |
| `{{ USER_GROUPS }}` | `Engineering, Beta Testers` (comma-separated; empty if the user is in no groups) |

```
You are a helpful assistant for {{ USER_NAME }}.
The current date is {{ CURRENT_DATE }}.
```

:::tip Group-aware system prompts
`{{ USER_GROUPS }}` lets a single shared model adapt its behavior to the caller's RBAC groups, e.g. *"You may discuss internal roadmap items only when `{{ USER_GROUPS }}` contains 'Engineering'."* The placeholder is resolved server-side at chat time, and the database lookup runs only when the variable is actually referenced in the template.
:::

### Capabilities and bindings

Toggle what the model can do and bind resources:

![Capabilities and builtin tool categories in the model editor](/images/workspace/model-editor-capabilities.png)

| Setting | What it controls |
| :--- | :--- |
| **Knowledge** | Bind collections or files. Click attached items to toggle between Focused Retrieval and Full Context. See [Retrieval Modes](/features/workspace/knowledge#retrieval-modes) |
| **Tools** | Force-enable specific tools (e.g., Calculator for a Math Bot) |
| **Skills** | Bind [Skills](/features/workspace/skills) so their manifests are always injected |
| **Filters** | Attach pipeline filters (e.g., PII redaction) |
| **Actions** | Attach action scripts (e.g., "Add to Memories") |
| **Vision** | Enable image analysis (requires a vision-capable base model) |
| **Web Search** | Enable the configured search provider |
| **Code Interpreter** | Enable Python code execution |
| **Terminal** | Let the model drive an attached [Open Terminal](/features/open-terminal) server to run commands and work with files. On by default; with it off, a chat's terminal is never handed to the model |
| **Image Generation** | Enable image generation |
| **Usage** | Ask the provider to report token counts on streamed replies (`stream_options.include_usage`). Off by default. Most OpenAI-compatible providers report nothing unless asked, so without it a response has no token figures to show and none to aggregate in [Analytics](/features/administration/analytics) |
| **Citations** | Show the sources behind a reply, from knowledge, web search and the builtin tools that return them. On by default; with it off no sources are shown |
| **Status Updates** | Show the progress lines a reply emits while it works, web search steps for example. On by default |
| **Memory** | Whether the user's stored memories are injected into this model's context (on by default). Turn it off for a model that should answer without personal context; it does not delete anything, and it is separate from the **Memory** builtin tool category, which is about the model reading and writing memories itself |
| **Builtin Tools** | Control which tool categories are available: Time, Memory, Chats, Notes, Knowledge, Channels, Files, Task Management, Automations |
| **File Upload** | Whether files can be attached to a message at all. On by default; with it off an upload in a chat using this model is refused, and **File Context** disappears from this editor since there is nothing to extract |
| **File Context** | When enabled, attached files are processed via RAG. When disabled, no file content is extracted |
| **TTS Voice** | Set a specific voice for this model's responses |

:::info Usage covers every chat the model runs
The request for token counts is added server-side, so it applies wherever the model is used: the chat interface, the API and the chats Open WebUI starts on your behalf through [automations](/features/chat-conversations/chat-features/automations), [timers](/features/chat-conversations/chat-features/timers), [sub-agents](/features/chat-conversations/chat-features/subagents) and [channels](/features/channels). Nothing needs to be set per request. Only streaming requests are touched, so a model with **Stream Chat Response** turned off is left alone.
:::

### Advanced parameters

- **Stop Sequences**: Force-stop generation on specific strings (e.g., `<|end_of_text|>`, `User:`). Press Enter after each.
- **Temperature, Top P, etc.**: Adjust creativity and determinism.

### Prompt suggestions

Clickable starter chips that appear when a user opens a fresh chat with this model. Add phrases like "Explain this code step-by-step" or "Summarize this document" to guide users.

---

## Model Management

From the model list, click the ellipsis (**...**) on any model:

![The model list in Workspace > Models](/images/workspace/models-list.png)

| Action | Description |
| :--- | :--- |
| **Edit** | Open the configuration panel |
| **Hide** | Remove from the model selector without deleting |
| **Clone** | Create an editable copy you can rename and reconfigure |
| **Copy Link** | Copy a direct URL to the model settings |
| **Export** | Download the configuration as `.json` |
| **Share** | Share to the Open WebUI community |
| **Delete** | Permanently remove the preset |

### Enabled and disabled

Rows you can edit also carry an **Enabled** switch, in **Workspace > Models** and in **Settings > Admin > Models** alike. Switching it off pulls that one model out of the model list for everyone: it leaves the selector, and a request that names it fails with **Model not found**. Nothing is deleted, every other model stays where it was, and switching it back on brings the model straight back.

**Hide** is the lighter option. It keeps the model in the list and only takes it out of the selector, which is why a hidden base model still powers the presets built on it.

### Import and export

- **Import**: From `.json` files or Open WebUI community links
- **Export**: Download all custom model configurations as a single `.json`
- **Discover**: Browse community presets at the bottom of the page

:::info Downloading base models
To download new base models, go to **Settings > Connections > Ollama** or type `ollama run hf.co/{username}/{repository}:{quantization}` in the model selector.
:::

---

## Global Model Defaults (Admin)

Administrators can set baseline capabilities and parameters that apply to all models via **Settings > Admin > Models > Model Defaults > Configure**.

- **Default Model Metadata** (`DEFAULT_MODEL_METADATA`): Baseline capabilities (vision, web search, file context, code interpreter, builtin tools). Per-model overrides always win on conflicts.
- **Default Model Params** (`DEFAULT_MODEL_PARAMS`): Baseline inference parameters (temperature, top_p, max_tokens, function_calling). Per-model values take precedence when explicitly set. This value is loaded from the environment as JSON; invalid JSON is ignored and falls back to `{}`.

These cover chat completions. Background task requests (titles, tags, follow-ups, search queries, autocomplete, context compaction summaries) do not go through them; their parameters are set separately, in [Task Models](/features/administration/task-models).

### Merge behavior

| Setting type | Strategy | Example |
|---|---|---|
| **Capabilities** | Deep merge | Global sets `file_context: false`, model sets `vision: true` > model gets both |
| **Other metadata** | Fill-only | Global sets description, model has none > model gets the global value |
| **Parameters** | Simple merge | Global sets `temperature: 0.7`, model sets `0.3` > model gets `0.3` |

:::warning Knowledge base + function calling interaction
Setting `function_calling: native` in global params changes how **all** models handle attached knowledge bases. In native mode, model-attached KBs are not auto-injected. The model must call builtin tools to retrieve knowledge. If your knowledge bases suddenly stop working, check global defaults first.

See [Knowledge Base troubleshooting](/troubleshooting/rag#13-knowledge-base-attached-to-model-not-working).
:::

### Bulk management

Filter the admin model list by status (Enabled, Disabled, Visible, Hidden, Public, Private, Selected, Pinned) and use the **Actions** menu to enable, disable, show or hide every model in the current view at once. Useful when external providers expose hundreds of models. Manual drag-to-reorder is only available with no search text and no filter applied.

---

## Selected and Pinned Models (Admin)

These are the two instance-wide settings that decide which model or models a user starts out with. They were previously called **default models**; the interface now calls them **Selected** and **Pinned** models. The configuration keys behind them are unchanged, so existing environment configuration keeps working.

| Setting | Menu action | What it does | Config key |
| :--- | :--- | :--- | :--- |
| **Selected Model** | **Set as Selected Model** | Pre-selects this model in a new chat for users who have no model preference of their own | [`DEFAULT_MODELS`](/reference/env-configuration#default_models) |
| **Pinned Model** | **Set as Pinned Model** | Pre-fills the model shortcuts in the sidebar for users who have not pinned any models themselves | [`DEFAULT_PINNED_MODELS`](/reference/env-configuration#default_pinned_models) |

Both accept more than one model, so you can hand users a small starting set rather than a single model.

:::info Not the same as Model Defaults
The **Model Defaults** panel at the top of the same page is a different feature: it sets baseline capabilities, parameters and prompt suggestions for all models. See [Global Model Defaults](#global-model-defaults-admin).
:::

### Setting a selected or pinned model

1. Go to **Settings > Admin > Models**.
2. Find the model with **Search Models**, or narrow the list with the view filter.
3. Click the ellipsis (**...**) at the end of the model's row.
4. Choose **Set as Selected Model** or **Set as Pinned Model**.

![Set as Selected Model and Set as Pinned Model in a model's ellipsis menu](/images/features/models/model-row-menu.png)

The change is saved immediately, no separate save step, and the row picks up a **Selected** or **Pinned** label next to the model name. Repeat on as many models as you want. To take one back out, open the same menu and choose **Remove Selected Model** or **Remove Pinned Model**.

:::tip Faster toggling
Hold **Shift** while the model list is open and every row exposes inline icon buttons for the same actions: the eye toggles visibility, the check toggles Selected, the pin toggles Pinned, the globe or lock toggles public access, and the pencil opens the model. A model that is already pinned shows a crossed-out pin, because clicking it removes the pin. Releasing Shift hides the icons again.

![Inline quick-action icons revealed by holding Shift](/images/features/models/model-quick-actions.png)
:::

### Reviewing what is configured

Open the view filter (the **All** dropdown next to **Actions**) and pick **Selected** or **Pinned** to list only the models currently configured as such. The same dropdown also filters by Enabled, Disabled, Visible, Hidden, Public and Private.

![The view filter with the Selected and Pinned options](/images/features/models/model-view-filter.png)

### How a selected model resolves for a user

For a new chat, Open WebUI takes the first of these that yields a model the user can actually use:

1. A `model` or `models` [URL parameter](/features/chat-conversations/chat-features/url-params).
2. The models bound to the folder the chat is started in, if any.
3. The user's own default model, saved from the model selector in a chat with **Set as default**.
4. The instance's **Selected Models**.
5. The first available model in the list.

Models that have been hidden or removed are dropped at every step, so a user whose last-used model disappeared lands on a working one instead of an empty selector.

**Pinned Models** work differently: they seed the user's sidebar shortcuts once, only when the user has no pinned models of their own. From then on the user's own pins win, and pins pointing at hidden or deleted models are cleaned up automatically.

:::warning Selected is a starting point, not a restriction
Setting a model as Selected does not stop anyone from switching to another model they have access to. To control what a user can reach, use per-model access control or **Hide**, described in [Curated-Interface Deployments](#curated-interface-deployments).
:::

---

## Model Switching in Chat

Switch models mid-conversation without losing context. Select up to two models simultaneously to compare responses side-by-side, using the arrow buttons to navigate between them. The model picker is **searchable**, type in the **Search a model** box to filter a long list, and a custom model is only selectable when its **base model** is available.

![The model selector, searchable and showing pinned models](/images/features/chat/model-selector.png)

You can also switch without opening the picker. Send `/model` followed by a model id, for example `/model gpt-5.1`, and the chat moves to that model; send `/model` on its own and it tells you which model the chat is on. The id has to match exactly, the display name will not do, and an id you cannot reach reports `Model not found`. Picking **Model** from the `/` menu opens the picker with its search box focused instead. See [Chat Features](/features/chat-conversations/chat-features/) for the other built-in slash commands.

---

## Use Cases

### Team-specific agents

Create a "Sales Assistant" with your CRM knowledge base, objection-handling prompts, and email drafting tools. Share it with the sales group. Engineering never sees it.

### Onboarding new users

Build models with descriptive prompt suggestions ("Ask me about our company policies", "Help me set up my development environment") so new team members know exactly what to ask.

### Enforcing organizational standards

Set global defaults to disable code interpreter across all models, enforce a consistent temperature, or require function calling. Individual models can override when needed.

---

## Curated-Interface Deployments

A common deployment pattern is to present regular users with a curated model (a preconfigured agent with a specific name, icon, system prompt and tools) while keeping the raw base model out of their way.

Before picking an approach, understand the one rule that governs all of this.

### The rule: a custom model always requires access to its base model

Every model you create under **Workspace > Models** is a *workspace model*: it points at a base model and stores a reference to it, rather than being a standalone copy of that base. Creating one never produces a second, independent base model. It always sits on top of an existing base.

When a user runs a workspace model, Open WebUI checks access to **both** the workspace model **and** its underlying base model. If the user cannot access the base model, the request fails with **"Model not found"**, even when the workspace model itself is shared publicly with them.

This is by design. Without it, anyone could bypass a base model's access control by building a workspace model on a restricted base and sharing that wrapper publicly. A shared wrapper can never grant access that the base model withholds.

:::warning
If you previously relied on a workspace model to hand users a base model they could not otherwise see, that depended on an access-control gap that has since been patched. It no longer works, and it was never safe.
:::

The practical consequence: anyone who should use your curated model must also have access to its base model. You **hide** the base from those users, you do not restrict it away from them.

### Recommended: a hidden public base model with a curated model on top

This is the reliable way to give everyone a single curated experience:

1. Set the base model (for example "GPT-4o") to **Public**, so every intended user passes the base-access check.
2. **Hide** the base model (ellipsis **...** > **Hide**) so it does not appear in the model selector.
3. Create a curated workspace model on top of that base. Give it its own name, avatar, system prompt, knowledge and tools, then share it with your users (or leave it public).

Regular users now see only the curated model in the picker. The base model stays reachable under the hood, which is what lets the curated model run, but it is invisible in the list. Admins can still open a hidden base model through its direct URL.

:::tip Upgrading the upstream model
When you move to a newer LLM, update the base model selection on the curated workspace model, and re-point anything else built on the old base. **Export** and **Import** help you carry settings across entries.
:::

### If some users must also see the raw base model

**Hide** is global: a hidden base model is hidden for everyone, so you cannot use it to show the raw model to power users while keeping it out of regular users' pickers. A workspace model cannot do this either, because it inherits base access as described above.

To give one group the raw model in their picker while everyone else gets only the curated model, the same upstream LLM has to appear as **two independent base models**, each with its own access control. That is a connection-level setup (for example, adding the model through a second connection), not something you can create from **Workspace > Models**. Restrict one base entry to your power users and make the curated one public. Because both are base models, neither inherits the other's access.

---

## Limitations

### Preset, not fine-tune

Model presets configure behavior through system prompts and tool bindings. They do not modify the underlying model weights. For deep behavioral changes, you need actual fine-tuning.

### Fallback requires configuration

If a base model becomes unavailable, the preset will fail unless `ENABLE_CUSTOM_MODEL_FALLBACK` is set to `True` and at least one [Selected Model](#selected-and-pinned-models-admin) is configured in **Settings > Admin > Models**. The fallback uses the first Selected Model.
