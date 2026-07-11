---
title: "Give Open WebUI real hands"
sidebar_position: 13
---

# Give Open WebUI real hands

Open WebUI is where you already chat: your models, your prompts, your history. But when you ask it "what does our rate limiter actually do?", a plain model can only guess. Connect Computer's gateway and that same Open WebUI chat can read the real repo, run the real tests, and answer from the code, because the workspace itself becomes a model in the picker.

**You need:** both apps running where Open WebUI can reach Computer's port, a workspace with a [model or agent configured](/ecosystem/computer/ai/) in Computer, and one gateway key.

## The walkthrough

1. **Mint the key.** In Computer, go to **Settings → Admin → Gateway** and create an API key. Copy it now; it's shown once and stored hashed.

2. **Add the connection in Open WebUI.** Admin Settings → Connections → add an OpenAI API connection:

   - **Base URL:** `http://<computer-host>:8000/v1`
   - **API Key:** the `sk-cptr-...` key

3. **Add the continuity headers.** Copy the custom-headers block from Computer's Gateway settings into the Open WebUI connection. They carry chat identity (`X-OpenWebUI-Chat-Id` and friends), which is what makes follow-up turns continue the same Computer conversation and keeps edits and regenerations as proper branches.

4. **Pick the workspace as a model.** Your workspaces now appear in Open WebUI's model picker as `cptr/<folder-name>`. Start a chat with one and ask something grounded:

   > Read the rate limiter implementation and explain what happens when Redis is down. Don't change anything.

5. **Watch both sides.** The answer streams into Open WebUI with the tool activity summarized inline. Over in Computer, the same conversation appears in that workspace's sidebar, with the full file-by-file detail, and you can continue it from either app.

## What makes this work

Open WebUI stays your front door; Computer supplies the machine. Nothing is copied or synced: no cloned repo, no uploaded context, no knowledge-base import. Two honest caveats. Gateway tasks run with **full tool approval** (an OpenAI-compatible API has no way to pause for an Allow button), so connect trusted clients to deliberately chosen workspaces. And Open WebUI's own knowledge bases, tools, and prompts don't ride along; if the workspace task needs a capability, configure it in Computer.

**Go deeper:** [Open WebUI setup in detail](/ecosystem/computer/automate/open-webui) · [Gateway API reference](/ecosystem/computer/reference/gateway-api) · [Which tool when?](/ecosystem/computer/choose)
