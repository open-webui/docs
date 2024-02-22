---
sidebar_position: 5
title: "🚀 Migration"
---

# Moving from Ollama WebUI to Open WebUI

Given recent name changes from [Ollama WebUI to Open WebUI](https://github.com/open-webui/open-webui/discussions/602), the docker image has been renamed. Additional steps are required to update for those people that used Ollama WebUI previously and want to start using the new images.

## Updating to Open WebUI without keeping your data

If you want to update to the new image but don't want to keep any previous data like conversations, prompts, documents, etc. you can perform the following steps:

:::danger

Performing these steps will erase all your current configuration options, chat history, etc. Only LLM Models will be preserved

:::

```bash
docker rm -f ollama-webui
docker pull ghcr.io/open-webui/open-webui:main
[insert the equivalent command that you used to install with the new Docker image name]
docker volume rm ollama-webui
```

For example, for local installation it would be `docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main`. For other installation commands, check the relevant parts of this README document.

## Migrating your contents from Ollama WebUI to Open WebUI

If you want to update to the new image migrating all your previous settings like conversations, prompts, documents, etc. you can perform the following steps:

```bash
docker rm -f ollama-webui
docker pull ghcr.io/open-webui/open-webui:main
# Creates a new volume and uses a temporary container to copy from one volume to another as per https://github.com/moby/moby/issues/31154#issuecomment-360531460
docker volume create --name open-webui
docker run --rm -v ollama-webui:/from -v open-webui:/to alpine ash -c "cd /from ; cp -av . /to"
[insert the equivalent command that you used to install with the new Docker image name]
```

Once you verify that all the data has been migrated you can erase the old volumen using the following command:

```bash
docker volume rm ollama-webui
```
