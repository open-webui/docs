---
sidebar_position: 25
title: "Nika Workflows"
---

# Running Checkable AI Workflows on Open WebUI Models with Nika

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

[Nika](https://github.com/supernovae-st/nika) is an open-source workflow
language for AI (Apache-2.0 spec, AGPL engine): a repeatable AI job becomes
one `.nika.yaml` file that is **statically audited before a single token is
spent** (task graph, cost, secret flows, permissions) and leaves a
hash-chained trace after every run. Because Open WebUI exposes an
OpenAI-compatible API, Nika can drive **your own Open WebUI models** —
including Ollama models and Function models — so scheduled or scripted jobs
(daily digests, report pipelines, batch summaries) run against the same
models you chat with, with a receipt.

## Prerequisites

- A running Open WebUI instance (this tutorial assumes `http://localhost:3000`)
- An Open WebUI API key: **Settings > Account** in the WebUI
  (see the [API endpoints guide](/getting-started/api-endpoints))
- The Nika binary:

```bash
# macOS · Linux
brew install supernovae-st/tap/nika
# or, without Homebrew:
curl -LsSf https://nika.sh/install.sh | sh
```

## Point Nika at Open WebUI

Nika's `openai` provider accepts a base-URL override — the value is the
complete chat-completions endpoint, which for Open WebUI is
`/api/chat/completions`:

```bash
export NIKA_OPENAI_BASE_URL="http://localhost:3000/api/chat/completions"
export NIKA_OPENAI_API_KEY="sk-your-open-webui-api-key"
```

No Nika-side catalog change is needed: any model your Open WebUI serves is
addressable as `openai/<model-id>` (the exact IDs are listed by Open WebUI's
`/api/models` endpoint).

## Write a workflow

Save this as `daily-brief.nika.yaml`. It reads your notes with a shell
command, then asks one of your Open WebUI models for a typed summary:

```yaml
nika: v1
workflow: daily-brief
description: "notes → typed brief, on an Open WebUI model"

model: openai/llama3.1     # any model id your Open WebUI serves

tasks:
  - id: notes
    exec:
      command: ["cat", "notes.md"]

  - id: brief
    depends_on: [notes]
    infer:
      max_tokens: 400
      prompt: |
        Summarize these notes into three bullet points and one action item:
        ${{ tasks.notes.output }}

outputs:
  brief: ${{ tasks.brief.output }}
```

## Check it before it runs

```bash
nika check daily-brief.nika.yaml
```

The audit prints the execution plan (which tasks run in parallel), flags
broken references with the exact fix, checks that no secret flows anywhere
it should not, and gives an honest cost line — before any request reaches
your Open WebUI instance.

## Run it

```bash
nika run daily-brief.nika.yaml
```

The run streams live in the terminal, and every run journals a hash-chained
trace under `.nika/traces/`:

```bash
nika trace verify .nika/traces/*.ndjson   # exit 0 = the record is intact
```

That trace is the difference between "the script ran" and a verifiable
record of what ran, in what order, and what it produced — useful when the
job runs on a schedule (cron, CI) rather than in front of you.

## Notes

- **Model names**: whatever Open WebUI serves — Ollama models
  (`openai/llama3.1`), OpenAI passthrough models, or Function models. List
  them with `curl -H "Authorization: Bearer $NIKA_OPENAI_API_KEY" http://localhost:3000/api/models`.
- **Offline preview**: `nika run daily-brief.nika.yaml --model mock/echo`
  exercises the whole workflow deterministically with no server and no key —
  handy for testing the file shape in CI.
- **Editor support**: the [Nika VS Code extension](https://marketplace.visualstudio.com/items?itemName=supernovae.nika-lang)
  paints the same audit as you type and renders the workflow as a live DAG.
- **Budget caps**: add `--max-cost-usd 0.10` to bound a run on metered
  models; local Open WebUI models simply report an unpriced floor.

Docs: [docs.nika.sh](https://docs.nika.sh) · source:
[github.com/supernovae-st/nika](https://github.com/supernovae-st/nika)
