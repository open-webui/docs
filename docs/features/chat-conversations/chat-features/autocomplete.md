---
slug: /features/chat-features/autocomplete
sidebar_position: 5
title: "Autocomplete"
---

# ✨ Autocomplete

Open WebUI offers an **AI-powered Autocomplete** feature that suggests text completions in real-time as you type your prompt. It acts like a "Copilot" for your chat input, helping you craft prompts faster using your configured task model.

## How It Works

When enabled, Open WebUI monitors your input in the chat box. When you pause typing, it sends your current text to a lightweight **Task Model**. This model predicts the likely next words or sentences, which appear as "ghost text" overlaying your input.

- **Accept Suggestion**: Press `Tab` (or the `Right Arrow` key) to accept the suggestion.
- **Reject/Ignore**: Simply keep typing to overwrite the suggestion.

:::info
**Performance Recommendation**

Autocomplete functionality relies heavily on the response speed of your **Task Model**. We recommend using a small, fast, **non-reasoning** model to ensure suggestions appear instantly.

**Recommended Models:**
- **Llama 3.2** (1B or 3B)
- **Qwen 3** (0.6B or 3B)
- **Gemma 3** (1B or 4B)
- **GPT-5 Nano** (Optimized for low latency)

Avoid using "Reasoning" models (e.g., o1, o3) or heavy Chain-of-Thought models for this feature, as the latency will make the autocomplete experience sluggish.
:::

## Configuration

The Autocomplete feature is controlled by a two-layer system: **Global** availability and **User** preference.

### 1. Global Configuration (Admin)

Admins control whether the autocomplete feature is available on the server.

### 1. Configuring Autocomplete (Global)

**Admin Panel Settings:**
Go to **Admin Settings > Interface > Task Model** and toggle **Autocomplete Generation**.

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
4. **Reasoning Models**: Ensure you are **not** using a "Reasoning" model (like o1 or o3), as their internal thought process creates excessive latency that breaks real-time autocomplete.

### Performance Impact
Autocomplete sends a request to your LLM essentially every time you pause typing (debounced).
- **Local Models**: This can consume significant GPU/CPU resources on the host machine.
- **API Providers**: This will generate a high volume of API calls (though usually with very short token counts). Be mindful of your provider's **Rate Limits** (Requests Per Minute/RPM and Tokens Per Minute/TPM) to avoid interruptions.

:::warning
For multi-user instances running on limited local hardware, we recommend **disabling** Autocomplete to prioritize resources for actual chat generation.
:::
