---
sidebar_position: 5
title: "📜 Open WebUI Logging"
---

## Browser Client Logging ##

Client logging generally occurs via [JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/console/log_static) `console.log()` and can be accessed using the built-in browser-specific developer tools:

* Blink
  * [Chrome/Chromium](https://developer.chrome.com/docs/devtools/)
  * [Edge](https://learn.microsoft.com/en-us/microsoft-edge/devtools-guide-chromium/overview)
* Gecko
  * [Firefox](https://firefox-source-docs.mozilla.org/devtools-user/)
* WebKit
  * [Safari](https://developer.apple.com/safari/tools/)

## Application Server/Backend Logging ##

Logging is an ongoing work-in-progress but some level of control is available using environment variables. [Python Logging](https://docs.python.org/3/howto/logging.html) `log()` and `print()` statements send information to the console. The default level is `INFO`. Ideally, sensitive data will only be exposed with `DEBUG` level.

### Logging Levels ###

The following [logging levels](https://docs.python.org/3/howto/logging.html#logging-levels) values are supported:

| Level      | Numeric value |
| ---------- | ------------- |
| `CRITICAL` | 50            |
| `ERROR`    | 40            |
| `WARNING`  | 30            |
| `INFO`     | 20            |
| `DEBUG`    | 10            |
| `NOTSET`   | 0             |

### Global ###

The default global log level of `INFO` can be overridden with the `GLOBAL_LOG_LEVEL` environment variable. When set, this executes a [basicConfig](https://docs.python.org/3/library/logging.html#logging.basicConfig) statement with the `force` argument set to *True* within `config.py`. This results in reconfiguration of all attached loggers:
> *If this keyword argument is specified as true, any existing handlers attached to the root logger are removed and closed, before carrying out the configuration as specified by the other arguments.*

The stream uses standard output (`sys.stdout`). In addition to all Open-WebUI `log()` statements, this also affects any imported Python modules that use the Python Logging module `basicConfig` mechanism including [urllib](https://docs.python.org/3/library/urllib.html).

For example, to set `DEBUG` logging level as a Docker parameter use:

```
--env GLOBAL_LOG_LEVEL="DEBUG"
```

### App/Backend ###

Some level of granularity is possible using any of the following combination of variables. Note that `basicConfig` `force` isn't presently used so these statements may only affect Open-WebUI logging and not 3rd party modules.

| Environment Variable | App/Backend                                                       |
| -------------------- | ----------------------------------------------------------------- |
| `AUDIO_LOG_LEVEL`    | Audio transcription using faster-whisper, TTS etc.                |
| `COMFYUI_LOG_LEVEL`  | ComfyUI integration handling                                      |
| `CONFIG_LOG_LEVEL`   | Configuration handling                                            |
| `DB_LOG_LEVEL`       | Internal Peewee Database                                          |
| `IMAGES_LOG_LEVEL`   | AUTOMATIC1111 stable diffusion image generation                   |
| `LITELLM_LOG_LEVEL`  | LiteLLM proxy                                                     |
| `MAIN_LOG_LEVEL`     | Main (root) execution                                             |
| `MODELS_LOG_LEVEL`   | LLM model interaction, authentication, etc.                       |
| `OLLAMA_LOG_LEVEL`   | Ollama backend interaction                                        |
| `OPENAI_LOG_LEVEL`   | OpenAI interaction                                                |
| `RAG_LOG_LEVEL`      | Retrieval-Augmented Generation using Chroma/Sentence-Transformers |
| `WEBHOOK_LOG_LEVEL`  | Authentication webhook extended logging                           |
