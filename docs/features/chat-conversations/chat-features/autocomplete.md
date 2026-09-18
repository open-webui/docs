---
sidebar_position: 5
title: "Autocomplete"
---

# Autocomplete

Open WebUI offers an **AI-powered Autocomplete** feature that suggests text completions in real-time as you type your prompt. It acts like a "Copilot" for your chat input, helping you craft prompts faster using your configured task model.

## How It Works

When enabled, Open WebUI monitors your input in the chat box. When you pause typing, it sends your current text to a lightweight **Task Model**. This model predicts the likely next words or sentences, which appear as "ghost text" overlaying your input.

- **Accept Suggestion**: Press `Tab` to accept the suggestion. Right Arrow only moves the caret.
- **Reject/Ignore**: Simply keep typing to overwrite the suggestion.

:::info
**Performance Recommendation**

Autocomplete functionality relies heavily on the response speed of your **Task Model**. We recommend using a small, fast, **non-reasoning** model to ensure suggestions appear instantly.

**Recommended Models:**
- **Qwen 3.5** (`qwen3.5:0.8b` or `qwen3.5:2b`)
- **GPT-5.6 Luna** (optimized for low latency and cost)
- **Gemini 3.5 Flash-Lite**

Avoid reasoning models and heavy Chain-of-Thought models for this feature — the latency will make the autocomplete experience sluggish.
:::

## Configuration

The Autocomplete feature is controlled by a two-layer system: **Global** availability and **User** preference.

### 1. Global Configuration (Admin)

Admins control whether the autocomplete feature is available on the server.

### 1. Configuring Autocomplete (Global)

**Admin Panel Settings:**
Go to **Settings > Admin > Interface > Task Model** and toggle **Autocomplete Generation**.

### 2. User Configuration (Personal)

Even if enabled globally, individual users can turn it off for themselves if they find it distracting.

- Go to **Settings > Interface**.
- Toggle **Prompt Autocompletion**.

The personal setting carries a different label from the administrator one, which reads **Autocomplete Generation**. They control the same feature.

:::note
If the Admin has disabled Autocomplete globally, users will **not** be able to enable it in their personal settings.
:::

## Performance & Troubleshooting

### Why aren't suggestions appearing?
1. **Check Settings**: Ensure it is enabled in **both** Admin and User settings.
2. **Task Model**: Go to **Settings > Admin > Interface** and check which **Task Model** is selected. When none is set, the chat's current model generates the suggestions, so what blocks generation is having no model selected in the chat. Two fields sit under the admin toggle: **Autocomplete Generation Input Max Length** (`AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH`, default `-1` for no limit) and **Autocomplete Generation Prompt**. The feature is off by default on both sides: the admin toggle (`ENABLE_AUTOCOMPLETE_GENERATION`, default `False`) and each user's **Prompt Autocompletion** switch.
3. **Latency**: If your Task Model is large or running on slow hardware, predictions might arrive too late to be useful. Switch to a smaller model.
4. **Reasoning Models**: Ensure you are **not** using a "Reasoning" model (like o1 or o3), as their internal thought process creates excessive latency that breaks real-time autocomplete. If you are stuck with one, you can turn its `reasoning_effort` down under **Task Model Parameters** in **Settings > Admin > Interface**. That setting is shared by every background task, so read [Task Models](/features/administration/task-models#task-model-parameters) first.

### Performance Impact
Autocomplete sends a request to your LLM essentially every time you pause typing (debounced).
- **Local Models**: This can consume significant GPU/CPU resources on the host machine.
- **API Providers**: This will generate a high volume of API calls (though usually with very short token counts). Be mindful of your provider's **Rate Limits** (Requests Per Minute/RPM and Tokens Per Minute/TPM) to avoid interruptions.

:::warning
For multi-user instances running on limited local hardware, we recommend **disabling** Autocomplete to prioritize resources for actual chat generation.
:::
