---
sidebar_position: 5
title: "Logging in Open WebUI"
---

# Understanding Open WebUI Logging 🪵

Logging is essential for debugging, monitoring, and understanding how Open WebUI is behaving. This guide explains how logging works in both the **browser client** (frontend) and the **application server/backend**.

## 🖥️ Browser Client Logging (Frontend)

For frontend development and debugging, Open WebUI utilizes standard browser console logging. This means you can see logs directly within your web browser's built-in developer tools.

**How to Access Browser Logs:**

1. **Open Developer Tools:** In most browsers, you can open developer tools by:
   - **Right-clicking** anywhere on the Open WebUI page and selecting "Inspect" or "Inspect Element".
   - Pressing **F12** (or Cmd+Opt+I on macOS).

2. **Navigate to the "Console" Tab:**  Within the developer tools panel, find and click on the "Console" tab.

**Types of Browser Logs:**

Open WebUI primarily uses [JavaScript's](https://developer.mozilla.org/en-US/docs/Web/API/console/log_static) `console.log()` for client-side logging. You'll see various types of messages in the console, including:

- **Informational messages:**  General application flow and status.
- **Warnings:** Potential issues or non-critical errors.
- **Errors:**  Problems that might be affecting functionality.

**Browser-Specific Developer Tools:**

Different browsers offer slightly different developer tools, but they all provide a console for viewing JavaScript logs. Here are links to documentation for popular browsers:

- **[Blink] Chrome/Chromium (e.g., Chrome, Edge):** [Chrome DevTools Documentation](https://developer.chrome.com/docs/devtools/)
- **[Gecko] Firefox:** [Firefox Developer Tools Documentation](https://firefox-source-docs.mozilla.org/devtools-user/)
- **[WebKit] Safari:** [Safari Developer Tools Documentation](https://developer.apple.com/safari/tools/)

## ⚙️ Application Server/Backend Logging (Python)

The backend of Open WebUI uses Python's built-in `logging` module to record events and information on the server side. These logs are crucial for understanding server behavior, diagnosing errors, and monitoring performance.

**Key Concepts:**

- **Python `logging` Module:** Open WebUI leverages the standard Python `logging` library. If you're familiar with Python logging, you'll find this section straightforward. (For more in-depth information, see the [Python Logging Documentation](https://docs.python.org/3/howto/logging.html#logging-levels)).
- **Console Output:** By default, backend logs are sent to the console (standard output), making them visible in your terminal or Docker container logs.
- **Logging Levels:**  Logging levels control the verbosity of the logs. You can configure Open WebUI to show more or less detailed information based on these levels.

### 🚦 Logging Levels Explained

Python logging uses a hierarchy of levels to categorize log messages by severity. Here's a breakdown of the levels, from most to least severe:

| Level       | Numeric Value | Description                                                                 | Use Case                                                                    |
| ----------- | ------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `CRITICAL`  | 50            | **Severe errors** that may lead to application termination. | Catastrophic failures, data corruption. |
| `ERROR`     | 40            | **Errors** that indicate problems but the application might still function. | Recoverable errors, failed operations. |
| `WARNING`   | 30            | **Potential issues** or unexpected situations that should be investigated. | Deprecation warnings, resource constraints. |
| `INFO`      | 20            | **General informational messages** about application operation. | Startup messages, key events, normal operation flow. |
| `DEBUG`     | 10            | **Detailed debugging information** for developers. | Function calls, variable values, detailed execution steps. |
| `NOTSET`    | 0             | **All messages are logged.**  (Usually defaults to `WARNING` if not set). | Useful for capturing absolutely everything, typically for very specific debugging. |

**Default Level:** Open WebUI's default logging level is `INFO`.

### 🌍 Global Logging Level (`GLOBAL_LOG_LEVEL`)

You can change the **global** logging level for the entire Open WebUI backend using the `GLOBAL_LOG_LEVEL` environment variable. This is the most straightforward way to control overall logging verbosity.

**How it Works:**

Setting `GLOBAL_LOG_LEVEL` configures the root logger in Python, affecting all loggers in Open WebUI and potentially some third-party libraries that use [basicConfig](https://docs.python.org/3/library/logging.html#logging.basicConfig). It uses `logging.basicConfig(force=True)`, which means it will override any existing root logger configuration.

**Example: Setting to `DEBUG`**

- **Docker Parameter:**

  ```bash
  --env GLOBAL_LOG_LEVEL="DEBUG"
  ```

- **Docker Compose (`docker-compose.yml`):**

  ```yaml
  environment:
    - GLOBAL_LOG_LEVEL=DEBUG
  ```

**Impact:** Setting `GLOBAL_LOG_LEVEL` to `DEBUG` will produce the most verbose logs, including detailed information that is helpful for development and troubleshooting. For production environments, `INFO` or `WARNING` might be more appropriate to reduce log volume.

### ⚙️ App/Backend Specific Logging Levels

For more granular control, Open WebUI provides environment variables to set logging levels for specific backend components. Logging is an ongoing work-in-progress, but some level of control is made available using these environment variables. These variables allow you to fine-tune logging for different parts of the application.

**Available Environment Variables:**

| Environment Variable | Component/Module                                                    | Description                                                                                                |
| -------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `AUDIO_LOG_LEVEL`    | Audio processing                                                    | Logging related to audio transcription (faster-whisper), text-to-speech (TTS), and audio handling. |
| `COMFYUI_LOG_LEVEL`  | ComfyUI Integration                                                 | Logging for interactions with ComfyUI, if you are using this integration. |
| `CONFIG_LOG_LEVEL`   | Configuration Management                                              | Logging related to loading and processing Open WebUI configuration files. |
| `DB_LOG_LEVEL`       | Database Operations (Peewee)                                        | Logging for database interactions using the Peewee ORM (Object-Relational Mapper). |
| `IMAGES_LOG_LEVEL`   | Image Generation (AUTOMATIC1111/Stable Diffusion)                   | Logging for image generation tasks, especially when using AUTOMATIC1111 Stable Diffusion integration. |
| `MAIN_LOG_LEVEL`     | Main Application Execution (Root Logger)                             | Logging from the main application entry point and root logger. |
| `MODELS_LOG_LEVEL`   | Model Management                                                    | Logging related to loading, managing, and interacting with language models (LLMs), including authentication. |
| `OLLAMA_LOG_LEVEL`   | Ollama Backend Integration                                          | Logging for communication and interaction with the Ollama backend. |
| `OPENAI_LOG_LEVEL`   | OpenAI API Integration                                              | Logging for interactions with the OpenAI API (e.g., for models like GPT). |
| `RAG_LOG_LEVEL`      | Retrieval-Augmented Generation (RAG)                                | Logging for the RAG pipeline, including Chroma vector database and Sentence-Transformers. |
| `WEBHOOK_LOG_LEVEL`  | Authentication Webhook                                                | Extended logging for authentication webhook functionality. |

**How to Use:**

You can set these environment variables in the same way as `GLOBAL_LOG_LEVEL` (Docker parameters, Docker Compose `environment` section). For example, to get more detailed logging for Ollama interactions, you could set:

```yaml
environment:
  - OLLAMA_LOG_LEVEL=DEBUG
```

:::note

**Important Note:** Unlike `GLOBAL_LOG_LEVEL`, these app-specific variables might not affect logging from *all* third-party modules. They primarily control logging within Open WebUI's codebase.

:::

By understanding and utilizing these logging mechanisms, you can effectively monitor, debug, and gain insights into your Open WebUI instance.
