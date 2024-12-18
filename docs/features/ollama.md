---
sidebar_position: 6
title: "⚖️ Ollama Load Balancing"
---

# Ollama Load Balancing Setup

This guide demonstrates how to configure Open WebUI to connect to multiple Ollama instances for load balancing within your deployment. This approach enables you to distribute processing loads across several nodes, enhancing both performance and reliability. The configuration leverages environment variables to manage connections between container updates, rebuilds, or redeployments seamlessly.

## Docker Run

To connect to multiple Ollama instances with Docker, use the following example command:

```bash
docker run -d -p 3000:8080 \
  -v open-webui:/app/backend/data \
  -e OLLAMA_BASE_URLS="http://ollama-one:11434;http://ollama-two:11434" \
  --name open-webui \
  --restart always \
  ghcr.io/open-webui/open-webui:main
```

This command configures your Docker container with these key environment variables:

- `OLLAMA_BASE_URLS`: Specifies the base URLs for each Ollama instance, separated by semicolons (`;`). This example uses two instances, but you can adjust this to fit your setup.

Ensure both Ollama instances are of the same version and have matching tags for each model they share. Discrepancies in model versions or tags across instances can lead to errors due to how WebUI de-duplicates and merges model lists.

## Docker Compose

For those preferring `docker-compose`, here's an abridged version of a `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      - OLLAMA_BASE_URLS=http://ollama-one:11434;http://ollama-two:11434
```

To further streamline this setup, you can define `OLLAMA_BASE_URLS` in an `.env` file located in the same directory as your `docker-compose.yaml`. Your `.env` file might look like this:

```ini
OLLAMA_BASE_URLS="http://ollama-one:11434;http://ollama-two:11434"
```

## Ensuring Model Consistency

Both Ollama instances must run identical versions and tags for each shared model to prevent issues. The system allows for models to be present on one server and not the other, smartly routing requests to the server containing the requested model. However, having different versions or hashes for the same model tag across instances can cause inconsistencies.

Utilize the `Update All Models` button beside the server selector drop-down within the **Settings > Models** screen to keep models synchronized across instances.

By following these steps, you can effectively distribute the computational load across multiple Ollama instances, ensuring a robust and efficient deployment with Open WebUI.
