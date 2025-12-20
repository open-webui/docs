---
sidebar_position: 25
title: "LibreTranslate Integration"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Overview

LibreTranslate is a free and open-source machine translation API that supports a wide range of languages. LibreTranslate is a self hosted, offline capable, and easy to setup, and unlike other APIs, it doesn't rely on proprietary providers such as Google or Azure to perform translations. Instead, its translation engine is powered by the open source [Argos Translate](https://github.com/argosopentech/argos-translate) library. You can integrate LibreTranslate with Open WebUI to leverage its machine translation capabilities. This documentation provides a step-by-step guide to setting up LibreTranslate in Docker and configuring the integration within Open WebUI.

## Setting up LibreTranslate in Docker

To set up LibreTranslate in Docker, follow these steps:

### Step 1: Create a Docker Compose File

Create a new file named `docker-compose.yml` in a directory of your choice. Add the following configuration to the file:

```yml
services:
  libretranslate:
    container_name: libretranslate
    image: libretranslate/libretranslate:v1.6.0
    restart: unless-stopped
    ports:
      - "5000:5000"
    env_file:
      - stack.env
    volumes:
      - libretranslate_api_keys:/app/db
      - libretranslate_models:/home/libretranslate/.local:rw
    tty: true
    stdin_open: true
    healthcheck:
      test: ['CMD-SHELL', './venv/bin/python scripts/healthcheck.py']

volumes:
  libretranslate_models:
  libretranslate_api_keys:
```

### Step 2: Create a `stack.env` File

Create a new file named `stack.env` in the same directory as your `docker-compose.yml` file. Add the following configuration to the file:

```bash

# LibreTranslate
LT_DEBUG="false"
LT_UPDATE_MODELS="true"
LT_SSL="false"
LT_SUGGESTIONS="false"
LT_METRICS="false"
LT_HOST="0.0.0.0"

LT_API_KEYS="false"

LT_THREADS="12"
LT_FRONTEND_TIMEOUT="2000"
```

### Step 3: Run the Docker Compose File

Run the following command to start the LibreTranslate service:

```bash
docker-compose up -d
```

This will start the LibreTranslate service in detached mode.

## Configuring the Integration in Open WebUI

Once you have LibreTranslate up and running in Docker, you can configure the integration within Open WebUI. There are several community integrations available, including:

- [LibreTranslate Filter Function](https://openwebui.com/f/iamg30/libretranslate_filter)
- [LibreTranslate Action Function](https://openwebui.com/f/jthesse/libretranslate_action)
- [MultiLanguage LibreTranslate Action Function](https://openwebui.com/f/iamg30/multilanguage_libretranslate_action)
- [LibreTranslate Filter Pipeline](https://github.com/open-webui/pipelines/blob/main/examples/filters/libretranslate_filter_pipeline.py)

Choose the integration that best suits your needs and follow the instructions to configure it within Open WebUI.

Supported languages for the LibreTranslate pipeline & function:
Really just all the languages that can be found within LibreTranslate, but here is the list:

```txt
Albanian, Arabic, Azerbaijani, Bengali, Bulgarian, Catalan, Valencian, Chinese, Czech, Danish, Dutch, English, Flemish, Esperanto, Estonian, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Irish, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Persian, Polish, Portuguese, Romanian, Moldavian, Moldovan, Russian, Slovak, Slovenian, Spanish, Castilian, Swedish, Tagalog, Thai, Turkish, Ukrainian, Urdu
```

## Troubleshooting

- Make sure the LibreTranslate service is running and accessible.
- Verify that the Docker configuration is correct.
- Check the LibreTranslate logs for any errors.

## Benefits of Integration

Integrating LibreTranslate with Open WebUI provides several benefits, including:

- Machine translation capabilities for a wide range of languages.
- Improved text analysis and processing.
- Enhanced functionality for language-related tasks.

## Conclusion

Integrating LibreTranslate with Open WebUI is a straightforward process that can enhance the functionality of your Open WebUI instance. By following the steps outlined in this documentation, you can set up LibreTranslate in Docker and configure the integration within Open WebUI.
