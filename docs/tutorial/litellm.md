# LiteLLM Config

**LiteLLM** supports a variety of APIs, both OpenAI-compatible and others. To integrate a new API model, follow these instructions:

*Ollama API (from inside Docker):*
![LiteLLM Config Ollama](/img/tutorial_litellm_ollama.png)

*Gemini API (MakerSuite/AI Studio):*
![LiteLLM Config Gemini](/img/tutorial_litellm_gemini.png)

1. Go to the Settings > Models > LiteLLM model management interface.
2. In 'Simple' mode, you will only see the option to enter a **Model**.
3. For additional configuration options, click on the 'Simple' toggle to switch to 'Advanced' mode. Here you can enter:
   - **Model Name**: The name of the model as you want it to appear in the models list.
   - **API Base URL**: The base URL for your API provider. This field can usually be left blank unless your provider specifies a custom endpoint URL.
   - **API Key**: Your unique API key. Replace with the key provided by your API provider.
   - **API RPM**: The allowed requests per minute for your API. Replace with the appropriate value for your API plan.

4. After entering all the required information, click the '+' button to add the new model to LiteLLM.

For more information on the specific providers and advanced settings, consult the [LiteLLM Providers Documentation](https://litellm.vercel.app/docs/providers).