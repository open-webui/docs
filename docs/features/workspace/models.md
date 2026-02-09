---
sidebar_position: 2
title: "Models"
sidebar_label: "Models"
---

The `Models` section of the `Workspace` within Open WebUI is a powerful tool that allows you to create and manage custom models tailored to specific purposes.

While backends like Ollama have their own `Modelfile` format, Open WebUI employs a robust internal **Preset System**. This allows you to "wrap" any model (including GPT-4, Claude, or local Llama 3) to bind specific **System Prompts**, **Knowledge Collections**, **Tools**, and **Dynamic Variables** to it.

This section serves as a central hub for all your models, providing a range of features to edit, clone, share, export, and hide your custom agents.

## Creating and Editing Models

When you create a new model or edit an existing one, you are building a configuration wrapper around a "Base Model".
To access the model configuration interface, you have two primary entry points from the main Models list:

1. **New Model**: Click the **+ New Model** button in the top-right corner. This opens a blank configuration page to create a preset from scratch.
2. **Edit Model**: Click the ellipsis (**...**) on an existing model card and select **Edit**. This opens the configuration page pre-filled with that model's current settings.

Both actions lead to the same Model Builder interface, where you can configure the settings below.

### Core Configuration

- **Avatar Photo**: Upload a custom image to represent your model in the chat interface. **Animated formats** (GIF and WebP) are supported and their animations will be preserved during the upload process.
- **Model Name & ID**: The display name and unique identifier for your custom preset (e.g., "Python Tutor" or "Meeting Summarizer").
- **Base Model**: The actual model beneath the hood that powers the agent. You can choose *any* model connected to Open WebUI. You can create a custom preset for `gpt-4o` just as easily as `llama3`.
  - **Fallback Behavior**: If the configured Base Model is unavailable and the `ENABLE_CUSTOM_MODEL_FALLBACK` environment variable is set to `True`, the system will automatically fall back to the first configured default model (set in Admin Panel > Settings > Models > Default Models). This ensures mission-critical custom models remain functional even if their specific base model is removed or temporarily unavailable.
- **Description**: A short summary of what the model does.
- **Tags**: Add tags to organize models in the selector dropdown.
- **Visibility & Groups**:
  - **Private**: Restricts access to specific users or groups.
  - **Access Control Selector**: Use the access control panel to grant access to specific groups (e.g., "Admins", "Developers") or individual users without making the model public to everyone. The redesigned interface makes it easy to add multiple groups and users at once.

### System Prompt & Dynamic Variables

The **System Prompt** defines the behavior and persona of the model. Unlike standard prompts, Open WebUI supports **Dynamic Variable Injection** using Jinja2-style placeholders. This allows the model to be aware of time, date, and user details.

| Variable | Description | Output Example |
| :--- | :--- | :--- |
| `{{ CURRENT_DATE }}` | Injects today's date (YYYY-MM-DD). | `2024-10-27` |
| `{{ CURRENT_TIME }}` | Injects the current time (24hr). | `14:30:05` |
| `{{ USER_NAME }}` | The display name of the logged-in user. | `Admin` |

**Example System Prompt:**

```
You are a helpful assistant for {{ USER_NAME }}.
The current date is {{ CURRENT_DATE }}.
```

### Advanced Parameters

Clicking **Show** on **Advanced Params** allows you to fine-tune the inference generation.

- **Stop Sequences**: A powerful feature that tells the model to force-stop generating text when it hits specific characters. This is vital for roleplay or coding models to prevent them from hallucinating both sides of a conversation.
  - *Format:* Enter the string (e.g., `<|end_of_text|>`, `User:`) and press `Enter`.
- **Temperature, Top P, etc.**: Adjust the creativity and determinism of the model.

### Prompt Suggestions

**Prompt Suggestions** are clickable "starter chips" that appear above the input bar when a user opens a fresh chat with this model. These are vital for onboarding users to specialized agents.

- **Purpose**: To guide the user on what the model is capable of or to provide one-click shortcuts for common tasks.
- **How to add**: Type a phrase (e.g., "Summarize this text") and click the **+** button. You can add multiple suggestions.
- **Example**: For a "Python Tutor" model, you might add:
  - *"Explain this code step-by-step"*
  - *"Find bugs in the following script"*
  - *"Write a Unit Test for this function"*

### Capabilities, Binding & Defaults

You can transform a generic model into a specialized agent by toggling specific capabilities and binding resources.

- **Knowledge**: Instead of manually selecting documents for every chat, you can bind a specific knowledgebase **Collection** or **File** to this model. Whenever this model is selected, RAG (Retrieval Augmented Generation) is automatically active for those specific files. Click on attached items to toggle between **Focused Retrieval** (RAG chunks) and **Using Entire Document** (full content injection). See [Full Context vs Focused Retrieval](/features/workspace/knowledge#full-context-vs-focused-retrieval) for details.
- **Tools**: Force specific tools to be enabled by default (e.g., always enable the **Calculator** tool for a "Math Bot").
- **Filters**: Attach specific Pipelines/Filters (e.g., a Profanity Filter or PII Redaction script) to run exclusively on this model.
- **Actions**: Attach actionable scripts like `Add to Memories` or `Button` triggers.
- **Capabilities**: Granularly control what the model is allowed to do:
  - **Vision**: Toggle to enable image analysis capabilities (requires a vision-capable Base Model).
  - **Web Search**: Enable the model to access the configured search provider (e.g., Google, SearxNG) for real-time information.
  - **File Upload**: Allow users to upload files to this model.
  - **File Context**: When enabled (default), attached files are processed via RAG and their content is injected into the conversation. When disabled, file content is **not** extracted or injected—the model receives no file content unless it retrieves it via builtin tools. Only visible when File Upload is enabled. See [File Context vs Builtin Tools](../rag/index.md#file-context-vs-builtin-tools) for details.
  - **Code Interpreter**: Enable Python code execution. See [Python Code Execution](../chat-features/code-execution/python.md) for details.
  - **Image Generation**: Enable image generation integration.
  - **Usage / Citations**: Toggle usage tracking or source citations.
  - **Status Updates**: Show visible progress steps in the chat UI (e.g., "Searching web...", "Reading file...") during generation. Useful for slower, complex tasks.
  - **Builtin Tools**: When enabled (default), automatically injects system tools (timestamps, memory, chat history, knowledge base queries, notes, etc.) in [Native Function Calling mode](../plugin/tools/index.mdx#disabling-builtin-tools-per-model). When enabled, you can further control which **tool categories** are available (Time, Memory, Chats, Notes, Knowledge, Channels) via checkboxes in the Model Editor. Disable the main toggle if the model doesn't support function calling or you need to save context window tokens. Note: This is separate from **File Context**—see [File Context vs Builtin Tools](../rag/index.md#file-context-vs-builtin-tools) for the difference.
- **TTS Voice**: Set a specific Text-to-Speech voice for this model. When users read responses aloud, this voice will be used instead of the global default. Useful for giving different personas distinct voices. Leave empty to use the user's settings or system default. See [Per-Model TTS Voice](../audio/text-to-speech/openai-tts-integration#per-model-tts-voice) for details.
- **Default Features**: Force specific toggles (like Web Search) to be "On" immediately when a user starts a chat with this model.

## Model Management

From the main list view in the `Models` section, click the ellipsis (`...`) next to any model to perform actions:

- **Edit**: Open the configuration panel for this model.
- **Hide**: Hide the model from the model selector dropdown within chats (useful for deprecated models) without deleting it.
- **Clone**: Create a copy of a model configuration, which will be appended with `-clone`.

:::note
A raw Base Model can be cloned as a custom Workspace model, but it will not clone the raw Base Model itself.
:::

- **Copy Link**: Copies a direct URL to the model settings.
- **Export**: Download the model configuration as a `.json` file.
- **Share**: Share your model configuration with the Open WebUI community by clicking the `Share` button (redirects to [openwebui.com](https://openwebui.com/models/create)).
- **Delete**: Permanently remove the preset.

### Import and Export

- **Import Models**: Import models from a `.json` file or from Open WebUI community links.
- **Export Models**: Export all your custom model configurations into a single `.json` file for backup or migration.
- **Discover a Model**: At the bottom of the page, you can explore and download presets made by the Open WebUI community.

:::info Downloading Raw Models
To download new raw Base Models (like `Llama-3.2-3B-Instruct-GGUF:Q8_0` or `Mistral-7B-Instruct-v0.2-GGUF:Q4_K_M`), navigate to **Settings > Connections > Ollama**. Alternatively, type `ollama run hf.co/{username}/{repository}:{quantization}` in the model selector to pull directly from Hugging Face. This action will create a button within the model selector labeled "Pull [Model Name]" that will begin downloading the model from its source once clicked.
:::

## Global Model Management (Admin)

Administrators have access to a centralized management interface via **Admin Panel > Settings > Models**. This page provides powerful tools for decluttering and organizing the model list, especially when connected to providers with hundreds of available models.

### View Filtering

The **Admin View Selector** allows you to filter the entire list of models by their operational status. This is located next to the search bar and includes the following views:

- **All**: Shows every model available to the system.
- **Enabled**: Displays only models that are currently active and selectable by users.
- **Disabled**: Shows models that have been deactivated.
- **Visible**: Shows models that are currently visible in the user model selector.
- **Hidden**: Displays only the models that have been hidden (these appear with reduced opacity in the list).

### Bulk Actions

To streamline the management of large model collections, the Admin Panel includes **Bulk Actions** that apply to the models currently visible in your filtered view.

1.  **Filter your view** (e.g., select "Disabled" or "Hidden").
2.  **Open the Actions menu** (Ellipsis icon next to the search bar).
3.  **Select an action**:
    - **Enable All**: Activates all models in the current filtered list simultaneously.
    - **Disable All**: Deactivates all models in the current filtered list.

These tools are specifically designed to help administrators quickly manage external providers (like OpenAI or Anthropic) that expose a high volume of models, allowing for instant site-wide configuration changes.

## Model Switching in Chat

Open WebUI allows for dynamic model switching and parallel inference within a chat session.

**Example**: Switching between **Mistral**, **LLaVA**, and **GPT-4** in a Multi-Stage Task.

- **Scenario**: A multi-stage conversation involves different task types, such as starting with a simple FAQ, interpreting an image, and then generating a creative response.
- **Reason for Switching**: The user can leverage each model's specific strengths for each stage:
  - **Mistral** for general questions to reduce computation time and costs.
  - **LLaVA** for visual tasks to gain insights from image-based data.
  - **GPT-4** for generating more sophisticated and nuanced language output.
- **Process**: The user switches between models, depending on the task type, to maximize efficiency and response quality.

**How To:**

1. **Select the Model**: Within the chat interface, select the desired models from the model switcher dropdown. You can select up to two models simultaneously, and both responses will be generated. You can then navigate between them by using the back and forth arrows.
2. **Context Preservation**: Open WebUI retains the conversation context across model switches, allowing smooth transitions.
