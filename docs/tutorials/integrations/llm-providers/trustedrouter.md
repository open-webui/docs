---
sidebar_position: 31
title: "TrustedRouter"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

## Connect Open WebUI to TrustedRouter

[TrustedRouter](https://trustedrouter.com) is an OpenAI-compatible LLM router that serves many models behind one endpoint through an open-source, verifiable attested gateway. It does not log prompts or outputs by default, which makes it a fit for privacy-sensitive deployments.

Because the API is OpenAI-compatible, it plugs into Open WebUI as a standard OpenAI connection.

### 1. Get an API key

Create an account at [trustedrouter.com](https://trustedrouter.com) and generate an API key.

### 2. Add the connection

1. In Open WebUI, go to **Admin Panel** → **Settings** → **Connections**.
2. Under **OpenAI API**, click **+** to add a connection.
3. Set the **API Base URL** to:

   ```
   https://api.trustedrouter.com/v1
   ```

4. Paste your TrustedRouter API key into the **API Key** field.
5. Click **Save**.

Open WebUI fetches the model catalog automatically from `/v1/models`, so TrustedRouter models appear in the model selector after saving.

### 3. Pick a model

Routing model ids include:

- `trustedrouter/auto` — routes each request to a suitable model
- `trustedrouter/zdr` — zero-data-retention routing
- `trustedrouter/confidential` — confidential-computing-backed routing

Individually addressable models are also listed in the selector.

### Environment-variable alternative

For scripted or Docker deployments, the same connection can be preconfigured:

```bash
docker run -d -p 3000:8080 \
  -e OPENAI_API_BASE_URL=https://api.trustedrouter.com/v1 \
  -e OPENAI_API_KEY=your-trustedrouter-key \
  -v open-webui:/app/backend/data \
  --name open-webui \
  ghcr.io/open-webui/open-webui:main
```
