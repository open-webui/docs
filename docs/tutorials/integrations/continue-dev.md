---
sidebar_position: 13
title: "Continue.dev VSCode Extension with Open WebUI"
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# Integrating Continue.dev VSCode Extension with Open WebUI

### Download Extension

You can download the VSCode extension here on the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue)

Once installed you should now have a 'continue' tab in the side bar.

Open this. Down at the bottom right you should see a settings icon (looks like a cog).

Once you click on the settings icon a `config.json` should open up in the editor.

Here you'll be able to configure continue to use Open WebUI.

---

Currently the 'ollama' provider does not support authentication so we cannot use this provider with Open WebUI.

However Ollama and Open WebUI both have compatibily with OpenAI API spec. You can see a blog post from Ollama [here](https://ollama.com/blog/openai-compatibility) on this.

We can still setup Continue to use the openai provider which will allow us to use Open WebUI's authentication token.

---

## Config

In `config.json` all you will need to do is add/change the following options.

### Change provider to openai

```json
"provider": "openai"
```

### Add or update apiBase

Set this to your Open Web UI domain + /ollama/v1 on the end.

```json
"apiBase": "http://localhost:3000/ollama/v1" #If you followed Getting Started Docker
```

### Add apiKey

```json
"apiKey": "sk-79970662256d425eb274fc4563d4525b" # Replace with your API key
```

You can find and generate your api key from Open WebUI -> Settings -> Account -> API Keys

You'll want to copy the "API Key" (this starts with sk-)

## Example Config

Here is a base example of config.json using Open WebUI via an openai provider. Using Granite Code as the model.
Make sure you pull the model into your ollama instance/s beforehand.

```json
{
  "models": [
    {
      "title": "Granite Code",
      "provider": "openai",
      "model": "granite-code:latest",
      "useLegacyCompletionsEndpoint": false,
      "apiBase": "http://YOUROPENWEBUI/ollama/v1",
      "apiKey": "sk-YOUR-API-KEY"
    }
  ],
  "customCommands": [
    {
      "name": "test",
      "prompt": "{{{ input }}}\n\nWrite a comprehensive set of unit tests for the selected code. It should setup, run tests that check for correctness including important edge cases, and teardown. Ensure that the tests are complete and sophisticated. Give the tests just as chat output, don't edit any file.",
      "description": "Write unit tests for highlighted code"
    }
  ],
  "tabAutocompleteModel": {
    "title": "Granite Code",
    "provider": "openai",
    "model": "granite-code:latest",
    "useLegacyCompletionsEndpoint": false,
    "apiBase": "http://localhost:3000/ollama/v1",
    "apiKey": "sk-YOUR-API-KEY"
  }
}
```

Save your `config.json` and thats it!

You should now see your model in the Continue tab model selection.

Select it and you should now be chatting via Open WebUI (and or any [pipelines](/pipelines) you have setup )

You can do this for as many models you would like to use, altough any model should work, you should use a model that is designed for code.

See the continue documentation for additional continue configuration, [Continue Documentation](https://docs.continue.dev/reference/Model%20Providers/openai)
