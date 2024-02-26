# LiteLLM Configuration

[LiteLLM](https://litellm.vercel.app/docs/proxy/configs#quick-start) supports a variety of APIs, both OpenAI-compatible and others. To integrate a new API model, follow these instructions:

## Initial Setup

To allow editing of your `config.yaml` file, use `-v /path/to/litellm/config.yaml:/app/backend/data/litellm/config.yaml` to bind-mount it with your `docker run` command:

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -v /path/to/litellm/config.yaml:/app/backend/data/litellm/config.yaml --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

_Note: `config.yaml` does not need to exist on the host before running for the first time._

## Configuring Open WebUI

1. Go to the Settings > Models > LiteLLM model management interface.
2. In 'Simple' mode, you will only see the option to enter a **Model**.
3. For additional configuration options, click on the 'Simple' toggle to switch to 'Advanced' mode. Here you can enter:

   - **Model Name**: The name of the model as you want it to appear in the models list.
   - **API Base URL**: The base URL for your API provider. This field can usually be left blank unless your provider specifies a custom endpoint URL.
   - **API Key**: Your unique API key. Replace with the key provided by your API provider.
   - **API RPM**: The allowed requests per minute for your API. Replace with the appropriate value for your API plan.

4. After entering all the required information, click the '+' button to add the new model to LiteLLM.

## Examples

_Ollama API (from inside Docker):_
![LiteLLM Config Ollama](/img/tutorial_litellm_ollama.png)

_Gemini API (MakerSuite/AI Studio):_
![LiteLLM Config Gemini](/img/tutorial_litellm_gemini.png)

Advanced configuration options not covered in the settings interface can be edited in the `config.yaml` file manually. For more information on the specific providers and advanced settings, consult the [LiteLLM Providers Documentation](https://litellm.vercel.app/docs/providers).
