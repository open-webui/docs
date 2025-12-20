---
sidebar_position: 10
title: "Autocomplete"
---

# ✨ Autocomplete

Open WebUI offers an **AI-powered Autocomplete** feature that suggests text completions in real-time as you type your prompt. It acts like a "Copilot" for your chat input, helping you craft prompts faster using your configured task model.

![Autocomplete Example](/images/features/autocomplete-example.png)

## How It Works

When enabled, Open WebUI monitors your input in the chat box. When you pause typing, it sends your current text to a lightweight **Task Model**. This model predicts the likely next words or sentences, which appear as "ghost text" overlaying your input.

- **Accept Suggestion**: Press `Tab` (or the `Right Arrow` key) to accept the suggestion.
- **Reject/Ignore**: Simply keep typing to overwrite the suggestion.

:::info
Autocomplete functionality relies heavily on the response speed of your **Task Model**. We recommend using a small, fast model (e.g., `Llama 3.2 3B`, `Qwen 2.5 3B`, or `GPT-4o-mini`) to ensure suggestions appear instantly.
:::

## Configuration

The Autocomplete feature is controlled by a two-layer system: **Global** availability and **User** preference.

### 1. Global Configuration (Admin)

Admins control whether the autocomplete feature is available on the server.

- **Option 1: Admin Panel**
  Go to **Admin Settings > Interface > Task Model** and toggle **Autocomplete Generation**.
  
- **Option 2: Environment Variable**
  Set the following environment variable to `True` (default is `False` in some versions, or `True` in others depending on release).
  
  ```bash
  ENABLE_AUTOCOMPLETE_GENERATION=True
  ```

### 2. User Configuration (Personal)

Even if enabled globally, individual users can turn it off for themselves if they find it distracting.

- Go to **Settings > Interface**.
- Toggle **Autocomplete Generation**.

:::note
If the Admin has disabled Autocomplete globally, users will **not** be able to enable it in their personal settings.
:::

## Performance & Troubleshooting

### Why aren't suggestions appearing?
1. **Check Settings**: Ensure it is enabled in **both** Admin and User settings.
2. **Task Model**: Go to **Admin Settings > Interface** and verify a **Task Model** is selected. If no model is selected, the feature cannot generate predictions.
3. **Latency**: If your Task Model is large or running on slow hardware, predictions might arrive too late to be useful. Switch to a smaller model.

### Performance Impact
Autocomplete sends a request to your LLM essentially every time you pause typing (debounced).
- **Local Models**: This can consume significant GPU/CPU resources on the host machine.
- **API Providers**: This will generate a high volume of API calls (though usually with very short token counts).

:::warning
For multi-user instances running on limited local hardware, we recommend **disabling** Autocomplete to prioritize resources for actual chat generation.
:::
