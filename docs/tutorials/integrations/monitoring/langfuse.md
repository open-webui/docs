---
sidebar_position: 20
title: "Langfuse"
---

## Langfuse Integration with Open WebUI

[Langfuse](https://langfuse.com/) ([GitHub](https://github.com/langfuse/langfuse)) offers open source observability and evaluations for Open WebUI. With the Langfuse filter turned on, every model reply in Open WebUI is sent to Langfuse, which gives you:

- Application [traces](https://langfuse.com/docs/tracing) with the full input and output of each reply
- Token usage and latency per reply
- Cost data by user and model
- Sessions that group all replies of one chat
- [Evaluations](https://langfuse.com/docs/scores/overview)

## How to integrate Langfuse with Open WebUI

The integration is a [Filter Function](/features/extensibility/plugin/functions/filter) that runs inside Open WebUI. Its `inlet` starts a Langfuse generation when a message goes to the model, and its `outlet` completes that generation with the reply and its token counts once the reply is finished.

## Quick Start Guide

### Step 1: Setup Open WebUI

You need a running Open WebUI instance and an admin account on it. See [Getting Started](/getting-started) if you do not have one yet.

### Step 2: Get your Langfuse API keys

Sign up at [Langfuse Cloud](https://cloud.langfuse.com) or use your own [self-hosted Langfuse](https://langfuse.com/self-hosting), create a project and create an API key pair for it. You need three values:

- the **public key** (`pk-lf-...`)
- the **secret key** (`sk-lf-...`)
- the **Langfuse URL**: `https://cloud.langfuse.com` for Langfuse Cloud, or the URL of the Langfuse region or server your keys belong to

### Step 3: Add the Langfuse filter

1. Go to **Admin Panel > Functions**.
2. Click **Create** (the **+** button) and choose **New Function**.
3. Paste the code below and click **Save**.

Open WebUI installs the `langfuse` package from the `requirements` line when you save. If package installs are turned off on your server ([`ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS`](/reference/env-configuration#enable_pip_install_frontmatter_requirements) or [`OFFLINE_MODE`](/reference/env-configuration#offline_mode)), install `langfuse~=3.11` into the Open WebUI environment yourself.

```python
"""
title: Langfuse
author: open-webui
version: 1.0.0
license: MIT
description: Sends every chat reply to Langfuse, with its input, output, model, token usage, user and chat.
requirements: langfuse~=3.11
"""

import logging
from typing import Optional

from langfuse import Langfuse, propagate_attributes
from pydantic import BaseModel, Field

log = logging.getLogger(__name__)


class Filter:
    class Valves(BaseModel):
        public_key: str = Field(default="", description="Langfuse public key (pk-lf-...)")
        secret_key: str = Field(default="", description="Langfuse secret key (sk-lf-...)")
        host: str = Field(default="https://cloud.langfuse.com", description="Langfuse URL")

    def __init__(self):
        self.valves = self.Valves()
        self.langfuse = None
        self.langfuse_settings = None

    def get_langfuse(self) -> Optional[Langfuse]:
        settings = (self.valves.public_key, self.valves.secret_key, self.valves.host)
        if not (self.valves.public_key and self.valves.secret_key):
            return None
        if settings != self.langfuse_settings:
            self.langfuse = Langfuse(
                public_key=self.valves.public_key,
                secret_key=self.valves.secret_key,
                host=self.valves.host,
            )
            self.langfuse_settings = settings
        return self.langfuse

    async def inlet(
        self,
        body: dict,
        __user__: Optional[dict] = None,
        __metadata__: Optional[dict] = None,
        __model__: Optional[dict] = None,
    ) -> dict:
        langfuse = self.get_langfuse()
        if langfuse is None or __metadata__ is None:
            return body

        try:
            chat_id = __metadata__.get("chat_id") or None
            model = __model__ or {}
            # Langfuse prices a reply by model id, so report the base model behind a workspace model
            model_id = model.get("info", {}).get("base_model_id") or body.get("model")

            with propagate_attributes(
                user_id=(__user__ or {}).get("email"),
                session_id=chat_id,
                trace_name="Open WebUI chat",
                tags=["open-webui"],
            ):
                __metadata__["langfuse_generation"] = langfuse.start_observation(
                    trace_context={"trace_id": Langfuse.create_trace_id(seed=chat_id)} if chat_id else None,
                    name="chat-reply",
                    as_type="generation",
                    model=model_id,
                    input=body.get("messages"),
                    metadata={"model_name": model.get("name")},
                )
        except Exception:
            log.exception("Langfuse: could not start the generation")

        return body

    async def outlet(self, body: dict, __metadata__: Optional[dict] = None) -> dict:
        generation = (__metadata__ or {}).pop("langfuse_generation", None)
        if generation is None:
            return body

        try:
            reply = body["messages"][-1]
            usage = reply.get("usage") or {}
            usage_details = None
            if usage.get("input_tokens") is not None:
                usage_details = {
                    "input": usage["input_tokens"],
                    "output": usage["output_tokens"],
                    "total": usage["total_tokens"],
                }

            generation.update(output=reply.get("content"), usage_details=usage_details)
            generation.end()
        except Exception:
            log.exception("Langfuse: could not finish the generation")

        return body
```

:::note

The filter stays on version 3 of the Langfuse Python SDK. Version 4 requires newer OpenTelemetry packages than the ones Open WebUI ships, and installing it replaces them, which breaks Open WebUI's own [OpenTelemetry support](/reference/monitoring/otel). Version 3 works with Langfuse server version 4.

:::

### Step 4: Set the valves and turn the filter on

1. In **Admin Panel > Functions**, click the gear icon (**Valves**) next to the Langfuse filter.
2. Enter your **Public Key**, **Secret Key** and **Host** (the Langfuse URL) and save.
3. Turn the filter on with its switch.
4. Choose where it runs:
   - **All models**: open the filter's **⋮** menu and turn on **Global**.
   - **Selected models**: go to **Workspace > Models**, edit a model and add the Langfuse filter under **Filters**.

The filter connects to Langfuse on its first traced reply. If you later change the **Host** or **Secret Key** but keep the same **Public Key**, restart Open WebUI to apply the change.

:::note

Most OpenAI-compatible providers only report token counts for a streamed reply when asked. Turn on the **Usage** capability of each model you want token counts and costs for, see [Capabilities and bindings](/features/workspace/models#capabilities-and-bindings).

:::

### Step 5: See your traces in Langfuse

Chat with any model that has the filter enabled, then open your project in Langfuse:

- Each chat is one trace named **Open WebUI chat**, tagged `open-webui`.
- Each model reply in that chat is a generation named **chat-reply** with the messages sent as input, the reply as output, the token usage and the latency.
- The generation's model is the model ID. For a workspace model it is the ID of the base model it is built on, so Langfuse can match it to its price list. The name of the model the user picked is in the generation's metadata.
- The user is the Open WebUI user's email address, and the session is the chat ID, so Langfuse can group replies by chat and by person.

Direct calls to the Open WebUI API are traced too, one trace per call, while [`ENABLE_API_OUTLET_FILTERS`](/reference/env-configuration#enable_api_outlet_filters) is on (the default).

## Learn more

- [Filter Function](/features/extensibility/plugin/functions/filter) for how filters work in Open WebUI
- [Langfuse documentation](https://langfuse.com/docs)
