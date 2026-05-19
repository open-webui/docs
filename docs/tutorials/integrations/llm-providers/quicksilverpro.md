---
sidebar_position: 3
title: "QuickSilver Pro"
---

[QuickSilver Pro](https://quicksilverpro.io) is an OpenAI-compatible
gateway for 12 frontier open-source models: DeepSeek V4 Flash / V4 Pro /
V3 / R1, Qwen 3.5 / 3.6, Kimi K2.6, and the Gemini 2.5 / 3 family. It
runs ~20% below OpenRouter on the shared model set and works with Open
WebUI through the standard OpenAI connection — once configured, all 12
models appear in the model picker.

This tutorial walks through wiring Open WebUI to QuickSilver Pro in two
fields.

---

## Step 1: Get an API key

Sign in at <https://quicksilverpro.io/dashboard/> and copy your key from
the **Connect your agent** card (it starts with `sk-`). You'll need a
top-up of at least \$5 before the key can serve traffic — new accounts
get \$5 of starter credit on first top-up.

## Step 2: Add the connection in Open WebUI

In Open WebUI, open **Admin Panel → Connections → OpenAI API** and
click **+ Add Connection**, then fill:

```
URL:  https://api.quicksilverpro.io/v1
Key:  <your QSP key>
```

Save and reload the model picker — all 12 QSP models will appear under
the connection.

## Step 3: Pick a model

Common picks:

- `deepseek-v4-flash` — cheap chat, 1M context, fast
- `deepseek-v4-pro` — premium reasoning, multi-file refactors
- `deepseek-r1` — pure math / proof / o1-equivalent
- `qwen3.6-35b` — 262K context, long-doc RAG
- `kimi-k2.6` — Opus-class agentic / planning
- `gemini-3-flash-preview` — Google's latest

Full per-model pricing and selection guidance:
<https://quicksilverpro.io/docs/models/>.

---

## Notes

- **Reasoning-by-default models**: DeepSeek V4 Flash / V4 Pro / R1,
  Qwen 3.6, and Kimi K2.6 all default to chain-of-thought reasoning.
  If you want non-thinking V3-style chat at lower latency, set
  `reasoning: { enabled: false }` in the request body.
- **Streaming, tool calling, and structured outputs** all work
  unmodified — Open WebUI's defaults are correct.
- **Cost per response**: each chat completion includes a synthetic
  `usage.cost` field, so Open WebUI's usage analytics pick it up
  automatically when enabled.

Setup reference for other tools (Aider, Cline, Continue, LobeChat, etc.):
<https://quicksilverpro.io/docs/integrations/>.
