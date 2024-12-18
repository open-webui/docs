---
sidebar_position: 9
title: "🖇 OpenAI Connections"
---

In this tutorial, we will demonstrate how to configure multiple OpenAI (or compatible) API endpoints using environment variables. This setup allows you to easily switch between different API providers or use multiple providers simultaneously, while keeping your configuration between container updates, rebuilds or redeployments.

## Docker Run

Here's an example `docker run` command similar to what you might use for Open WebUI:

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OPENAI_API_BASE_URLS="https://api.openai.com/v1;https://api.mistral.ai/v1" \
  -e OPENAI_API_KEYS="<OPENAI_API_KEY_1>;<OPENAI_API_KEY_2>" \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

This command sets the following environment variables:

* `OPENAI_API_BASE_URLS`: A list of API base URLs separated by semicolons (;). In this example, we use OpenAI and Mistral.
* `OPENAI_API_KEYS`: A list of API keys corresponding to the base URLs specified in `OPENAI_API_BASE_URLS`. Make sure to replace `<OPENAI_API_KEY_1>` and `<OPENAI_API_KEY_2>` with your actual API keys.

You can adapt this command to your own needs, and add even more endpoint/key pairs, but make sure to include the environment variables as shown above.

## Docker Compose

Alternatively, you can use a `docker-compose.yaml` file to define and run the Open WebUI container. Here's an abridged version of what that might look like:

```yaml
services:
  open-webui:
    environment:
      - 'OPENAI_API_BASE_URLS=${OPENAI_API_BASE_URLS}'
      - 'OPENAI_API_KEYS=${OPENAI_API_KEYS}'
```

You can edit the `${VARIABLES}` directly, or optionally define the values of these variables in an `.env` file, which should be placed in the same directory as the `docker-compose.yaml` file:

```ini
OPENAI_API_BASE_URLS="https://api.openai.com/v1;https://api.mistral.ai/v1"
OPENAI_API_KEYS="<OPENAI_API_KEY_1>;<OPENAI_API_KEY_2>"
```
