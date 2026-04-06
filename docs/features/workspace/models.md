---
sidebar_position: 2
title: "Models"
sidebar_label: "Models"
---

# 🤖 Models

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

Click **+ New Model** in **Workspace > Models**, or click the ellipsis (**...**) on an existing model and select **Edit**.

### Core configuration

| Field | Description |
| :--- | :--- |
| **Avatar** | Upload a custom image. Animated GIF and WebP are supported |
| **Name and ID** | Display name and unique identifier |
| **Base Model** | The actual model that powers this agent |
| **Description** | Short summary shown in the model selector |
| **Tags** | Organize models in the dropdown |
| **Visibility** | Private (specific users/groups) or public |

### System prompt and variables

The system prompt defines the behavior and persona. Use dynamic variables for context-aware instructions:

| Variable | Output example |
| :--- | :--- |
| `{{ CURRENT_DATE }}` | `2024-10-27` |
| `{{ CURRENT_TIME }}` | `14:30:05` |
| `{{ USER_NAME }}` | `Admin` |

```
You are a helpful assistant for {{ USER_NAME }}.
The current date is {{ CURRENT_DATE }}.
```

### Capabilities and bindings

Toggle what the model can do and bind resources:

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
| **Image Generation** | Enable image generation |
| **Builtin Tools** | Control which tool categories are available: Time, Memory, Chats, Notes, Knowledge, Channels |
| **File Context** | When enabled, attached files are processed via RAG. When disabled, no file content is extracted |
| **TTS Voice** | Set a specific voice for this model's responses |

### Advanced parameters

- **Stop Sequences**: Force-stop generation on specific strings (e.g., `<|end_of_text|>`, `User:`). Press Enter after each.
- **Temperature, Top P, etc.**: Adjust creativity and determinism.

### Prompt suggestions

Clickable starter chips that appear when a user opens a fresh chat with this model. Add phrases like "Explain this code step-by-step" or "Summarize this document" to guide users.

---

## Model Management

From the model list, click the ellipsis (**...**) on any model:

| Action | Description |
| :--- | :--- |
| **Edit** | Open the configuration panel |
| **Hide** | Remove from the model selector without deleting |
| **Clone** | Create a copy (appends `-clone`) |
| **Copy Link** | Copy a direct URL to the model settings |
| **Export** | Download the configuration as `.json` |
| **Share** | Share to the Open WebUI community |
| **Delete** | Permanently remove the preset |

### Import and export

- **Import**: From `.json` files or Open WebUI community links
- **Export**: Download all custom model configurations as a single `.json`
- **Discover**: Browse community presets at the bottom of the page

:::info Downloading base models
To download new base models, go to **Settings > Connections > Ollama** or type `ollama run hf.co/{username}/{repository}:{quantization}` in the model selector.
:::

---

## Global Model Defaults (Admin)

Administrators can set baseline capabilities and parameters that apply to all models via **Admin Panel > Settings > Models > ⚙️ (gear icon)**.

- **Default Model Metadata** (`DEFAULT_MODEL_METADATA`): Baseline capabilities (vision, web search, file context, code interpreter, builtin tools). Per-model overrides always win on conflicts.
- **Default Model Params** (`DEFAULT_MODEL_PARAMS`): Baseline inference parameters (temperature, top_p, max_tokens, function_calling). Per-model values take precedence when explicitly set. This value is loaded from the environment as JSON; invalid JSON is ignored and falls back to `{}`.

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

Filter the admin model list by status (Enabled, Disabled, Visible, Hidden) and use **Bulk Actions** to enable or disable all models in the current view at once. Useful when external providers expose hundreds of models.

---

## Model Switching in Chat

Switch models mid-conversation without losing context. Select up to two models simultaneously to compare responses side-by-side, using the arrow buttons to navigate between them.

---

## Use Cases

### Team-specific agents

Create a "Sales Assistant" with your CRM knowledge base, objection-handling prompts, and email drafting tools. Share it with the sales group. Engineering never sees it.

### Onboarding new users

Build models with descriptive prompt suggestions ("Ask me about our company policies", "Help me set up my development environment") so new team members know exactly what to ask.

### Enforcing organizational standards

Set global defaults to disable code interpreter across all models, enforce a consistent temperature, or require function calling. Individual models can override when needed.

---

## Limitations

### Preset, not fine-tune

Model presets configure behavior through system prompts and tool bindings. They do not modify the underlying model weights. For deep behavioral changes, you need actual fine-tuning.

### Fallback requires configuration

If a base model becomes unavailable, the preset will fail unless `ENABLE_CUSTOM_MODEL_FALLBACK` is set to `True` and a default model is configured in Admin Panel > Settings > Models.
