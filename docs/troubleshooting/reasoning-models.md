---
sidebar_position: 12
title: "Reasoning / Thinking Models"
---

import { TopBanners } from "@site/src/components/TopBanners";

<TopBanners />

## Overview

Many modern LLMs support **reasoning** or **thinking** capabilities, where the model outputs its internal thought process wrapped in special tags like `<think>...</think>` before providing the final answer. Examples include:

- **DeepSeek-R1** and its distilled variants
- **Qwen3** with thinking mode enabled
- Other reasoning-focused models

Open WebUI supports displaying these reasoning blocks in a collapsible UI section, separating the model's thought process from the final answer. However, proper configuration is required—especially when using Ollama—to ensure the thinking content is parsed correctly.

---

## Common Issues

### Thinking Content Merged with Final Answer

**Symptom:** When using a reasoning model, the entire response (including `<think>...</think>` blocks) is displayed as the final answer, instead of being separated into a hidden/collapsible thinking section.

**Example of incorrect display:**

```text
<think>
Okay, the user wants a code snippet for a sticky header using CSS and JavaScript.
Let me think about how to approach this.
...
I think that's a solid approach. Let me write the code now.
</think>

Here's a complete code snippet that demonstrates a sticky header using CSS and JavaScript...
```

**Expected behavior:** The thinking content should be hidden or collapsible, with only the final answer visible.

---

## Solutions

### For Ollama Users

The most common cause is that Ollama is not configured with the correct **reasoning parser**. When running Ollama, you need to specify the `--reasoning-parser` flag to enable proper parsing of thinking blocks.

#### Step 1: Configure the Reasoning Parser

When starting Ollama, add the `--reasoning-parser` flag:

```bash
# For DeepSeek-R1 style reasoning (recommended for most models)
ollama serve --reasoning-parser deepseek_r1

# Alternative parsers (if the above doesn't work for your model)
ollama serve --reasoning-parser qwen3
ollama serve --reasoning-parser deepseek_v3
```

:::tip Recommended Parser
For most reasoning models, including Qwen3 and DeepSeek variants, use `--reasoning-parser deepseek_r1`. This parser handles the standard `<think>...</think>` format used by most reasoning models.
:::

#### Step 2: Restart Ollama

After adding the flag, restart the Ollama service:

```bash
# Stop Ollama
# On Linux/macOS:
pkill ollama

# On Windows (PowerShell):
Stop-Process -Name ollama -Force

# Start with the reasoning parser
ollama serve --reasoning-parser deepseek_r1
```

#### Step 3: Verify in Open WebUI

1. Go to Open WebUI and start a new chat with your reasoning model
2. Ask a question that requires reasoning (e.g., a math problem or logic puzzle)
3. The response should now show the thinking content in a collapsible section

### Available Reasoning Parsers

| Parser | Description | Use Case |
|--------|-------------|----------|
| `deepseek_r1` | DeepSeek R1 format | Most reasoning models, including Qwen3 |
| `deepseek_v3` | DeepSeek V3 format | Some DeepSeek variants |
| `qwen3` | Qwen3-specific format | If `deepseek_r1` doesn't work with Qwen |

---

## Open WebUI Built-in Settings

Open WebUI provides several built-in settings to configure reasoning model behavior. These can be found in:

- **Chat Controls** (sidebar) → **Advanced Parameters** — per-chat settings
- **Workspace** → **Models** → **Edit Model** → **Advanced Parameters** — per-model settings (Admin only)
- **Admin Panel** → **Settings** → **Models** → select a model → **Advanced Parameters** — alternative per-model settings location

### Reasoning Tags

This setting controls how Open WebUI parses and displays thinking/reasoning blocks:

| Option | Description |
|--------|-------------|
| **Default** | Uses the system default behavior |
| **Enabled** | Explicitly enables reasoning tag detection using default `<think>...</think>` tags |
| **Disabled** | Turns off reasoning tag detection entirely |
| **Custom** | Allows you to specify custom start and end tags |

#### Using Custom Tags

If your model uses non-standard reasoning tags (e.g., `<reasoning>...</reasoning>` or `[思考]...[/思考]`), select **Custom** and enter:

- **Start Tag**: The opening tag (e.g., `<reasoning>`)
- **End Tag**: The closing tag (e.g., `</reasoning>`)

This is useful for:
- Models with localized thinking tags
- Custom fine-tuned models with unique tag formats
- Models that use XML-style reasoning markers

### think (Ollama)

This Ollama-specific setting enables or disables the model's built-in reasoning feature:

| Option | Description |
|--------|-------------|
| **Default** | Uses Ollama's default behavior |
| **On** | Explicitly enables thinking mode for the model |
| **Off** | Disables thinking mode |

:::note
This setting sends the `think` parameter directly to Ollama. It's separate from how Open WebUI parses the response—you may need both this setting AND proper reasoning tags configuration for the full experience.
:::

### Reasoning Effort

For models that support variable reasoning depth (like some API providers), this setting controls how much effort the model puts into reasoning:

- Common values: `low`, `medium`, `high`
- Some providers accept numeric values

:::info
Reasoning Effort is only applicable to models from specific providers that support this parameter. It has no effect on local Ollama models.
:::

---

## Streaming vs Non-Streaming

### Streaming Mode (Default)

In streaming mode (`stream: true`), Open WebUI processes tokens as they arrive and can detect reasoning blocks in real-time. This generally works well without additional configuration.

### Non-Streaming Mode

In non-streaming mode (`stream: false`), the entire response is returned at once. **This is where most parsing issues occur** because:

1. The response arrives as a single block of text
2. Without the reasoning parser, no post-processing separates the `<think>` content
3. The raw response is displayed as-is

:::info Important
If you're using non-streaming requests (via API or certain configurations), **the reasoning parser is essential** for proper thinking block separation.
:::

---

## Troubleshooting Checklist

### 1. Verify Ollama Is Running with Reasoning Parser

Check if Ollama was started with the correct flag:

```bash
# Check the Ollama process
ps aux | grep ollama
# or on Windows:
Get-Process -Name ollama | Format-List *
```

Look for `--reasoning-parser` in the command line arguments.

### 2. Check Model Compatibility

Not all models output reasoning in the same format. Verify your model's documentation for:

- What tags it uses for thinking content (e.g., `<think>`, `<reasoning>`, etc.)
- Whether it requires specific prompting to enable thinking mode

### 3. Test with Streaming Enabled

If non-streaming isn't working, try enabling streaming in your chat:

1. Go to **Chat Controls** (sidebar)
2. Ensure streaming is enabled (this is the default)
3. Test the model again

### 4. Check Open WebUI Version

Ensure you're running the latest version of Open WebUI, as reasoning model support continues to improve:

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

### 5. Verify the Model Response Format

Use the Ollama CLI directly to check what format your model outputs:

```bash
ollama run your-model:tag "Explain step by step: What is 15 + 27?"
```

Look for `<think>` tags in the output. If they're not present, the model may require specific system prompts to enable thinking mode.

---

## API Usage

When using the Open WebUI API with reasoning models:

```json
{
  "model": "qwen3:32b",
  "messages": [
    {"role": "user", "content": "Solve: What is 234 * 567?"}
  ],
  "stream": true
}
```

**Recommendation:** Use `"stream": true` for the most reliable reasoning block parsing.