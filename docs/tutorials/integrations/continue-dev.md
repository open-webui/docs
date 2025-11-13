---
sidebar_position: 13
title: "Continue.dev VS Code Extension with Open WebUI"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/docs/contributing.mdx).

:::

# Integrating Continue.dev VS Code Extension with Open WebUI

## Download Extension

You can download the VS Code extension on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue) or directly via the `EXTENSION:MARKETPLACE` within VS Code by searching for `continue`.
Once installed, you can access the application via the `continue` tab in the side bar of VS Code.

**VS Code side bar icon:**

![continue.dev vscode icon](/images/tutorials/continue-dev/continue_dev_vscode_icon.png)

---

## Setup

Click on the assistant selector to the right of the main chat input. Then hover over `Local Assistant` and click on the settings icon (⚙️).
This will open the `config.yaml` file in your editor. Here you can change the settings of your `Local Assistant`.

![continue.dev chat input](/images/tutorials/continue-dev/continue_dev_extension_input_field.png)

:::info

Currently the `ollama` provider does not support authentication so we cannot use this provider with Open WebUI.
However Ollama and Open WebUI both have compatibility with OpenAI API spec. Read more about the specification in the [Ollama blog post on OpenAI compatibility](https://ollama.com/blog/openai-compatibility).
We can still setup continue.dev to use the openai provider which will allow us to use Open WebUI's authentication token.

:::

### Example config

Below you find an example config for Llama3 as the model with a local Open WebUI setup.

```yaml
name: Local Assistant
version: 1.0.0
schema: v1
models:
  - name: LLama3
    provider: openai
    model: Meta-Llama-3-8B-Instruct-Q4_K_M.gguf
    env:
      useLegacyCompletionsEndpoint: false
    apiBase: http://localhost:3000/api
    apiKey: YOUR_OPEN_WEBUI_API_KEY
    roles:
      - chat
      - edit
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase

```

---

### Miscellaneous Configuration Settings

These values are needed by the extension to work properly. Find more information in the [official config guide](https://docs.continue.dev/reference).

```yaml
name: Local Assistant
version: 1.0.0
schema: v1
```

The context section provides additional information to the models. Find more information in the [official config guide](https://docs.continue.dev/reference#context) and in the [context provider guide](https://docs.continue.dev/customize/custom-providers).

```yaml
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase
```

---

### Models

The models section is where you specify all models you want to add. Find more information in the [official models guide](https://docs.continue.dev/reference#models).

```yaml
models:
  - ...
```

---

### Name

Sets the name for the model you want to use. This will be displayed within the chat input of the extension.

```yaml
name: LLama3
```

![continue.dev chat input](/images/tutorials/continue-dev/continue_dev_extension_input_field.png)

---

### Provider

Specifies the method used to communicate with the API, which in our case is the OpenAI API endpoint provided by Open WebUI.

```yaml
provider: openai
```

---

### Model

This is the actual name of your model in Open WebUI. Navigate to `Admin Panel` > `Settings` > `Models`, and then click on your preferred LLM.
Below the user-given name, you'll find the actual model name.

```yaml
model: Meta-Llama-3-8B-Instruct-Q4_K_M.gguf
```

---

### Legacy completions endpoint

This setting is not needed for Open WebUI, though more information is available in the [original guide](https://platform.openai.com/docs/guides/completions/completions-api-legacy).

```yaml
env:
  useLegacyCompletionsEndpoint: false
```

---

### APIBase

This is a crucial step: you need to direct the continue.dev extension requests to your Open WebUI instance.
Either use an actual domain name if the instance is hosted somewhere (e.g., `https://example.com/api`) or your localhost setup (e.g., `http://localhost:3000/api`).
You can find more information about the URLs in the [API Endpoints guide](/docs/getting-started/api-endpoints.md).

```yaml
apiBase: http://localhost:3000/api
```

---

### API Key

To authenticate with your Open WebUI instance, you'll need to generate an API key.
Follow the instructions in [this guide](https://docs.openwebui.com/getting-started/advanced-topics/monitoring#authentication-setup-for-api-key-) to create it.

```yaml
apiKey: YOUR_OPEN_WEBUI_API_KEY
```

---

### Roles

The roles will allow your model to be used by the extension for certain tasks. For the beginning you can choose `chat` and `edit`.
You can find more information about roles in the [official roles guide](https://docs.continue.dev/customize/model-roles/intro).

```yaml
roles:
  - chat
  - edit
```

The setup is now completed and you can interact with your model(s) via the chat input. Find more information about the features and usage of the continue.dev plugin in the [official documentation](https://docs.continue.dev/getting-started/overview).
