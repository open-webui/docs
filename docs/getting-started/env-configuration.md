---
sidebar_position: 4
title: "🌍 Environment Variable Configuration"
---


## Overview

Open WebUI provides a large range of environment variables that allow you to customize and configure
various aspects of the application. This page serves as a comprehensive reference for all available
environment variables, providing their types, default values, and descriptions.
As new variables are introduced, this page will be updated to reflect the growing configuration options.

:::info

This page is up-to-date with Open WebUI release version [v0.6.9](https://github.com/open-webui/open-webui/releases/tag/v0.6.9), but is still a work in progress to later include more accurate descriptions, listing out options available for environment variables, defaults, and improving descriptions.

:::

### Important Note on `PersistentConfig` Environment Variables

:::note

When launching Open WebUI for the first time, all environment variables are treated equally and can be used to configure the application. However, for environment variables marked as `PersistentConfig`, their values are persisted and stored internally.

After the initial launch, if you restart the container, `PersistentConfig` environment variables will no longer use the external environment variable values. Instead, they will use the internally stored values.

In contrast, regular environment variables will continue to be updated and applied on each subsequent restart.

You can update the values of `PersistentConfig` environment variables directly from within Open WebUI, and these changes will be stored internally. This allows you to manage these configuration settings independently of the external environment variables.

Please note that `PersistentConfig` environment variables are clearly marked as such in the documentation below, so you can be aware of how they will behave.

To disable `PersistentConfig` and have Open WebUI treat all variables equally, you can set `ENABLE_PERSISTENT_CONFIG` to `False`.

:::

## App/Backend

The following environment variables are used by `backend/open_webui/config.py` to provide Open WebUI startup
configuration. Please note that some variables may have different default values depending on
whether you're running Open WebUI directly or via Docker. For more information on logging
environment variables, see our [logging documentation](https://docs.openwebui.com/getting-started/advanced-topics/logging).

### General

#### `WEBUI_URL`

- Type: `str`
- Default: `http://localhost:3000`
- Description: Specifies the URL where your Open WebUI installation is reachable. Needed for search engine support and OAuth/SSO.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::warning

This variable has to be set before you start using OAuth/SSO for authentication.
Since this is a persistent config environment variable, you can only change it through one of the following options:

 - Temporarily disabling persistent config using `ENABLE_PERSISTENT_CONFIG`
 - Changing `WEBUI_URL` in the admin panel > settings and changing "WebUI URL".

Failure to set WEBUI_URL before using OAuth/SSO will result in failure to log in.

:::

#### `ENABLE_SIGNUP`

- Type: `bool`
- Default: `True`
- Description: Toggles user account creation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_LOGIN_FORM`

- Type: `bool`
- Default: `True`
- Description: Toggles email, password, sign-in and "or" (only when `ENABLE_OAUTH_SIGNUP` is set to True) elements.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::danger

This should **only** ever be set to `False` when [ENABLE_OAUTH_SIGNUP](https://docs.openwebui.com/getting-started/env-configuration/#enable_oauth_signup)
is also being used and set to `True`. Failure to do so will result in the inability to login.

:::

#### `DEFAULT_LOCALE`

- Type: `str`
- Default: `en`
- Description: Sets the default locale for the application.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DEFAULT_MODELS`

- Type: `str`
- Default: Empty string (' '), since `None`.
- Description: Sets a default Language Model.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DEFAULT_USER_ROLE`

- Type: `str`
- Options:
  - `pending` - New users are pending until their accounts are manually activated by an admin.
  - `user` - New users are automatically activated with regular user permissions.
  - `admin` - New users are automatically activated with administrator permissions.
- Default: `pending`
- Description: Sets the default role assigned to new users.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `PENDING_USER_OVERLAY_TITLE`

- Type: `str`
- Default: Empty string (' ')
- Description: Sets a custom title for the pending user overlay.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `PENDING_USER_OVERLAY_CONTENT`

- Type: `str`
- Default: Empty string (' ')
- Description: Sets a custom text content for the pending user overlay.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_CHANNELS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables channel support.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WEBHOOK_URL`

- Type: `str`
- Description: Sets a webhook for integration with Discord/Slack/Microsoft Teams.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_ADMIN_EXPORT`

- Type: `bool`
- Default: `True`
- Description: Controls whether admin users can export data.

#### `ENABLE_ADMIN_CHAT_ACCESS`

- Type: `bool`
- Default: `True`
- Description: Enables admin users to access all chats.

#### `ENABLE_USER_WEBHOOKS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user webhooks.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RESPONSE_WATERMARK`

- Type: `str`
- Default: Empty string (' ')
- Description: Sets a custom text that will be included when you copy a message in the chat. E.g. `"This text is AI generated"` -> will add "This text is AI generated" to every message, when copied.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `THREAD_POOL_SIZE`

- Type: `int`
- Default: `0`
- Description: Sets the thread pool size for FastAPI/AnyIO blocking calls. By default (when set to `0`) FastAPI/AnyIO use `40` threads. In case of large instances and many concurrent users, it may be needed to increase `THREAD_POOL_SIZE` to prevent blocking.

#### `SHOW_ADMIN_DETAILS`

- Type: `bool`
- Default: `True`
- Description: Toggles whether to show admin user details in the interface.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ADMIN_EMAIL`

- Type: `str`
- Description: Sets the admin email shown by `SHOW_ADMIN_DETAILS`
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENV`

- Type: `str`
- Options:
  - `dev` - Enables the FastAPI API documentation on `/docs`
  - `prod` - Automatically configures several environment variables
- Default:
  - **Backend Default**: `dev`
  - **Docker Default**: `prod`
- Description: Environment setting.

#### `ENABLE_PERSISTENT_CONFIG`

- Type: `bool`
- Default: `True`
- Description: If set to `False`, all `PersistentConfig` variables are treated as regular variables.

#### `CUSTOM_NAME`

- Type: `str`
- Description: Sets `WEBUI_NAME` but polls **api.openwebui.com** for metadata.

#### `WEBUI_NAME`

- Type: `str`
- Default: `Open WebUI`
- Description: Sets the main WebUI name. Appends `(Open WebUI)` if overridden.

#### `PORT`

- Type: `int`
- Default: `8080`
- Description: Sets the port to run Open WebUI from.

:::info
If you're running the application via Python and using the `open-webui serve` command, you cannot set the port using the `PORT` configuration. Instead, you must specify it directly as a command-line argument using the `--port` flag. For example:

```bash
open-webui serve --port 9999
```

This will run the Open WebUI on port `9999`. The `PORT` environment variable is disregarded in this mode.
:::

#### `ENABLE_REALTIME_CHAT_SAVE`

- Type: `bool`
- Default: `False`
- Description: When enabled, the system saves each chunk of streamed chat data to the database in real time to ensure maximum data persistency. This feature provides robust data recovery and allows accurate session tracking. However, the tradeoff is increased latency, as saving to the database introduces a delay. Disabling this feature can improve performance and reduce delays, but it risks potential data loss in the event of a system failure or crash. Use based on your application's requirements and acceptable tradeoffs.

#### `BYPASS_MODEL_ACCESS_CONTROL`

- Type: `bool`
- Default: `False`
- Description: Bypasses model access control.

#### `WEBUI_BUILD_HASH`

- Type: `str`
- Default: `dev-build`
- Description: Used for identifying the Git SHA of the build for releases.

#### `WEBUI_BANNERS`

- Type: `list` of `dict`
- Default: `[]`
- Description: List of banners to show to users. The format for banners are:

```json
[{"id": "string", "type": "string [info, success, warning, error]", "title": "string", "content": "string", "dismissible": false, "timestamp": 1000}]
```

- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

When setting this environment variable in a `.env` file, make sure to escape the quotes by wrapping the entire value in double quotes and using escaped quotes (`\"`) for the inner quotes. Example:

```
WEBUI_BANNERS="[{\"id\": \"1\", \"type\": \"warning\", \"title\": \"Your messages are stored.\", \"content\": \"Your messages are stored and may be reviewed by human people. LLM's are prone to hallucinations, check sources.\", \"dismissible\": true, \"timestamp\": 1000}]"
```

:::

#### `USE_CUDA_DOCKER`

- Type: `bool`
- Default: `False`
- Description: Builds the Docker image with NVIDIA CUDA support. Enables GPU acceleration for local Whisper and embeddings.

#### `EXTERNAL_PWA_MANIFEST_URL`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: When defined as a fully qualified URL (e.g., https://path/to/manifest.webmanifest), requests sent to /manifest.json will use the external manifest file. When not defined, the default manifest.json file will be used.

#### `ENABLE_TITLE_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables chat title generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LICENSE_KEY`

- Type: `str`
- Default: `None`
- Description: Specifies the license key to use (for Enterprise users only).
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SSL_ASSERT_FINGERPRINT`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the SSL assert fingerprint to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DEFAULT_PROMPT_SUGGESTIONS`

- Type: `list` of `dict`
- Default: `[]` (which means to use the built-in default prompt suggestions)
- Description: List of prompt suggestions. The format for prompt suggestions are:

```json
[{"title": ["Title part 1", "Title part 2"], "content": "prompt"}]
```

### AIOHTTP Client

#### `AIOHTTP_CLIENT_TIMEOUT`

- Type: `int`
- Default: `300`
- Description: Specifies the timeout duration in seconds for the AIOHTTP client. This impacts things
such as connections to Ollama and OpenAI endpoints.

:::info

This is the maximum amount of time the client will wait for a response before timing out.
If set to an empty string (' '), the timeout will be set to `None`, effectively disabling the timeout and
allowing the client to wait indefinitely.

:::

#### `AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST`

- Type: `int`
- Default: `10`
- Description: Sets the timeout in seconds for fetching the model list. This can be useful in cases where network latency requires a longer timeout duration to successfully retrieve the model list.

:::note
The AIOHTTP_CLIENT_TIMEOUT_MODEL_LIST is set to 10 seconds by default to help ensure that all necessary connections are available when opening the web UI. This duration allows enough time for retrieving the model list even in cases of higher network latency. You can lower this value if quicker timeouts are preferred, but keep in mind that doing so may lead to some connections being dropped, depending on your network conditions.
:::

#### `AIOHTTP_CLIENT_TIMEOUT_OPENAI_MODEL_LIST`

- Type: `int`
- Description: Sets the timeout in seconds for fetching the model list. This can be useful in cases where network latency requires a longer timeout duration to successfully retrieve the model list.

### Directories

#### `DATA_DIR`

- Type: `str`
- Default: `./data`
- Description: Specifies the base directory for data storage, including uploads, cache, vector database, etc.

#### `FONTS_DIR`

- Type: `str`
- Description: Specifies the directory for fonts.

#### `FRONTEND_BUILD_DIR`

- Type: `str`
- Default: `../build`
- Description: Specifies the location of the built frontend files.

#### `STATIC_DIR`

- Type: `str`
- Default: `./static`
- Description: Specifies the directory for static files, such as the favicon.

### Ollama

#### `ENABLE_OLLAMA_API`

- Type: `bool`
- Default: `True`
- Description: Enables the use of Ollama APIs.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OLLAMA_BASE_URL` (`OLLAMA_API_BASE_URL` is deprecated) {#ollama_base_url}

- Type: `str`
- Default: `http://localhost:11434`
- Docker Default:
  - If `K8S_FLAG` is set: `http://ollama-service.open-webui.svc.cluster.local:11434`
  - If `USE_OLLAMA_DOCKER=True`: `http://localhost:11434`
  - Else `http://host.docker.internal:11434`
- Description: Configures the Ollama backend URL.

#### `OLLAMA_BASE_URLS`

- Type: `str`
- Description: Configures load-balanced Ollama backend hosts, separated by `;`. See
[`OLLAMA_BASE_URL`](#ollama_base_url). Takes precedence over[`OLLAMA_BASE_URL`](#ollama_base_url).
- Example: `http://host-one:11434;http://host-two:11434`
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USE_OLLAMA_DOCKER`

- Type: `bool`
- Default: `False`
- Description: Builds the Docker image with a bundled Ollama instance.

#### `K8S_FLAG`

- Type: `bool`
- Default: `False`
- Description: If set, assumes Helm chart deployment and sets [`OLLAMA_BASE_URL`](#ollama_base_url) to `http://ollama-service.open-webui.svc.cluster.local:11434`

### OpenAI

#### `ENABLE_OPENAI_API`

- Type: `bool`
- Default: `True`
- Description: Enables the use of OpenAI APIs.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OPENAI_API_BASE_URL`

- Type: `str`
- Default: `https://api.openai.com/v1`
- Description: Configures the OpenAI base API URL.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OPENAI_API_BASE_URLS`

- Type: `str`
- Description: Supports balanced OpenAI base API URLs, semicolon-separated.
- Example: `http://host-one:11434;http://host-two:11434`
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OPENAI_API_KEY`

- Type: `str`
- Description: Sets the OpenAI API key.
- Example: `sk-124781258123`
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OPENAI_API_KEYS`

- Type: `str`
- Description: Supports multiple OpenAI API keys, semicolon-separated.
- Example: `sk-124781258123;sk-4389759834759834`
- Persistence: This environment variable is a `PersistentConfig` variable.

### Tasks

#### `TASK_MODEL`

- Type: `str`
- Description: The default model to use for tasks such as title and web search query generation
when using Ollama models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TASK_MODEL_EXTERNAL`

- Type: `str`
- Description: The default model to use for tasks such as title and web search query generation
when using OpenAI-compatible endpoints.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TITLE_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when generating chat titles.
- Default: The value of `DEFAULT_TITLE_GENERATION_PROMPT_TEMPLATE` environment variable.

`DEFAULT_TITLE_GENERATION_PROMPT_TEMPLATE`:

```
### Task:
Generate a concise, 3-5 word title with an emoji summarizing the chat history.
### Guidelines:
- The title should clearly represent the main theme or subject of the conversation.
- Use emojis that enhance understanding of the topic, but avoid quotation marks or special formatting.
- Write the title in the chat's primary language; default to English if multilingual.
- Prioritize accuracy over excessive creativity; keep it clear and simple.
### Output:
JSON format: { "title": "your concise title here" }
### Examples:
- { "title": "📉 Stock Market Trends" },
- { "title": "🍪 Perfect Chocolate Chip Recipe" },
- { "title": "Evolution of Music Streaming" },
- { "title": "Remote Work Productivity Tips" },
- { "title": "Artificial Intelligence in Healthcare" },
- { "title": "🎮 Video Game Development Insights" }
### Chat History:
<chat_history>
{{MESSAGES:END:2}}
</chat_history>
```

- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_FOLLOW_UP_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables follow up generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `FOLLOW_UP_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use for generating several relevant follow-up questions.
- Default: The value of `DEFAULT_FOLLOW_UP_GENERATION_PROMPT_TEMPLATE` environment variable.

`DEFAULT_FOLLOW_UP_GENERATION_PROMPT_TEMPLATE`:

```
### Task:
Suggest 3-5 relevant follow-up questions or prompts that the user might naturally ask next in this conversation as a **user**, based on the chat history, to help continue or deepen the discussion.
### Guidelines:
- Write all follow-up questions from the user’s point of view, directed to the assistant.
- Make questions concise, clear, and directly related to the discussed topic(s).
- Only suggest follow-ups that make sense given the chat content and do not repeat what was already covered.
- If the conversation is very short or not specific, suggest more general (but relevant) follow-ups the user might ask.
- Use the conversation's primary language; default to English if multilingual.
- Response must be a JSON array of strings, no extra text or formatting.
### Output:
JSON format: { "follow_ups": ["Question 1?", "Question 2?", "Question 3?"] }
### Chat History:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>"
```

- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`

- Type: `str`
- Description: Prompt to use when calling tools.
- Default: The value of `DEFAULT_TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE` environment variable.

`DEFAULT_TOOLS_FUNCTION_CALLING_PROMPT_TEMPLATE`:

```
Available Tools: {{TOOLS}}

Your task is to choose and return the correct tool(s) from the list of available tools based on the query. Follow these guidelines:

- Return only the JSON object, without any additional text or explanation.

- If no tools match the query, return an empty array: 
   {
     "tool_calls": []
   }

- If one or more tools match the query, construct a JSON response containing a "tool_calls" array with objects that include:
   - "name": The tool's name.
   - "parameters": A dictionary of required parameters and their corresponding values.

The format for the JSON response is strictly:
{
  "tool_calls": [
    {"name": "toolName1", "parameters": {"key1": "value1"}},
    {"name": "toolName2", "parameters": {"key2": "value2"}}
  ]
}
```

- Persistence: This environment variable is a `PersistentConfig` variable.

### Code Execution

#### `ENABLE_CODE_EXECUTION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables code execution.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_EXECUTION_ENGINE`

- Type: `str`
- Default: `pyodide`
- Description: Specifies the code execution engine to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_EXECUTION_JUPYTER_URL`

- Type: `str`
- Default: `None`
- Description: Specifies the Jupyter URL to use for code execution.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_EXECUTION_JUPYTER_AUTH`

- Type: `str`
- Default: `None`
- Description: Specifies the Jupyter authentication method to use for code execution.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_EXECUTION_JUPYTER_AUTH_TOKEN`

- Type: `str`
- Default: `None`
- Description: Specifies the Jupyter authentication token to use for code execution.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_EXECUTION_JUPYTER_AUTH_PASSWORD`

- Type: `str`
- Default: `None`
- Description: Specifies the Jupyter authentication password to use for code execution.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_EXECUTION_JUPYTER_TIMEOUT`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the timeout for Jupyter code execution.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Code Interpreter

#### `ENABLE_CODE_INTERPRETER`

- Type: `bool`
- Default: `True`
- Description: Enables or disables code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_ENGINE`

- Type: `str`
- Default: `pyodide`
- Description: Specifies the code interpreter engine to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_PROMPT_TEMPLATE`

- Type: `str`
- Default: `None`
- Description: Specifies the prompt template to use for code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_JUPYTER_URL`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the Jupyter URL to use for code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_JUPYTER_AUTH`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the Jupyter authentication method to use for code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_JUPYTER_AUTH_TOKEN`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the Jupyter authentication token to use for code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_JUPYTER_AUTH_PASSWORD`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the Jupyter authentication password to use for code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CODE_INTERPRETER_JUPYTER_TIMEOUT`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the timeout for the Jupyter code interpreter.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Direct Connections (OpenAPI/MCPO Tool Servers)

#### `ENABLE_DIRECT_CONNECTIONS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables direct connections.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Autocomplete

#### `ENABLE_AUTOCOMPLETE_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables autocomplete generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

When enabling `ENABLE_AUTOCOMPLETE_GENERATION`, ensure that you also configure `AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH` and `AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE` accordingly.

:::

#### `AUTOCOMPLETE_GENERATION_INPUT_MAX_LENGTH`

- Type: `int`
- Default: `-1`
- Description: Sets the maximum input length for autocomplete generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Default: The value of the `DEFAULT_AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE` environment variable.

`DEFAULT_AUTOCOMPLETE_GENERATION_PROMPT_TEMPLATE`:

```
### Task:
You are an autocompletion system. Continue the text in `<text>` based on the **completion type** in `<type>` and the given language.  

### **Instructions**:
1. Analyze `<text>` for context and meaning.  
2. Use `<type>` to guide your output:  
   - **General**: Provide a natural, concise continuation.  
   - **Search Query**: Complete as if generating a realistic search query.  
3. Start as if you are directly continuing `<text>`. Do **not** repeat, paraphrase, or respond as a model. Simply complete the text.  
4. Ensure the continuation:
   - Flows naturally from `<text>`.  
   - Avoids repetition, overexplaining, or unrelated ideas.  
5. If unsure, return: `{ "text": "" }`.  

### **Output Rules**:
- Respond only in JSON format: `{ "text": "<your_completion>" }`.

### **Examples**:
#### Example 1:  
Input:  
<type>General</type>  
<text>The sun was setting over the horizon, painting the sky</text>  
Output:  
{ "text": "with vibrant shades of orange and pink." }

#### Example 2:  
Input:  
<type>Search Query</type>  
<text>Top-rated restaurants in</text>  
Output:  
{ "text": "New York City for Italian cuisine." }  

---
### Context:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
<type>{{TYPE}}</type>  
<text>{{PROMPT}}</text>  
#### Output:
```

- Description: Sets the prompt template for autocomplete generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Evaluation Arena Model

#### `ENABLE_EVALUATION_ARENA_MODELS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables evaluation arena models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_MESSAGE_RATING`

- Type: `bool`
- Default: `True`
- Description: Enables message rating feature.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_COMMUNITY_SHARING`

- Type: `bool`
- Default: `True`
- Description: Controls whether users are shown the share to community button.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Tags Generation

#### `ENABLE_TAGS_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables tag generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TAGS_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Default: The value of `DEFAULT_TAGS_GENERATION_PROMPT_TEMPLATE` environment variable.

`DEFAULT_TAGS_GENERATION_PROMPT_TEMPLATE`:

```
### Task:
Generate 1-3 broad tags categorizing the main themes of the chat history, along with 1-3 more specific subtopic tags.

### Guidelines:
- Start with high-level domains (e.g. Science, Technology, Philosophy, Arts, Politics, Business, Health, Sports, Entertainment, Education)
- Consider including relevant subfields/subdomains if they are strongly represented throughout the conversation
- If content is too short (less than 3 messages) or too diverse, use only ["General"]
- Use the chat's primary language; default to English if multilingual
- Prioritize accuracy over specificity

### Output:
JSON format: { "tags": ["tag1", "tag2", "tag3"] }

### Chat History:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
```

- Description: Sets the prompt template for tag generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

### API Key Endpoint Restrictions

#### `ENABLE_API_KEY`

- Type: `bool`
- Default: `True`
- Description: Enables API key authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_API_KEY_ENDPOINT_RESTRICTIONS`

- Type: `bool`
- Default: `False`
- Description: Enables API key endpoint restrictions for added security and configurability.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `API_KEY_ALLOWED_ENDPOINTS`

- Type: `str`
- Description: Specifies a comma-separated list of allowed API endpoints when API key endpoint restrictions are enabled.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::note

The value of `API_KEY_ALLOWED_ENDPOINTS` should be a comma-separated list of endpoint URLs, such as `/api/v1/messages, /api/v1/channels`.

:::

#### `JWT_EXPIRES_IN`

- Type: `str`
- Default: `-1`
- Description: Sets the JWT expiration time in seconds. Valid time units: `s`, `m`, `h`, `d`, `w` or `-1` for no expiration.
- Persistence: This environment variable is a `PersistentConfig` variable.

## Security Variables

#### `ENABLE_FORWARD_USER_INFO_HEADERS`

- type: `bool`
- Default: `False`
- Description: Forwards user information (name, ID, email, and role) as X-headers to OpenAI API and Ollama API.
If enabled, the following headers are forwarded:
  - `X-OpenWebUI-User-Name`
  - `X-OpenWebUI-User-Id`
  - `X-OpenWebUI-User-Email`
  - `X-OpenWebUI-User-Role`

#### `ENABLE_WEB_LOADER_SSL_VERIFICATION`

- Type: `bool`
- Default: `True`
- Description: Bypass SSL Verification for RAG on Websites.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WEBUI_SESSION_COOKIE_SAME_SITE`

- Type: `str`
- Options:
  - `lax` - Sets the `SameSite` attribute to lax, allowing session cookies to be sent with
requests initiated by third-party websites.
  - `strict` - Sets the `SameSite` attribute to strict, blocking session cookies from being sent
with requests initiated by third-party websites.
  - `none` - Sets the `SameSite` attribute to none, allowing session cookies to be sent with
requests initiated by third-party websites, but only over HTTPS.
- Default: `lax`
- Description: Sets the `SameSite` attribute for session cookies.

:::warning

When `ENABLE_OAUTH_SIGNUP` is enabled, setting `WEBUI_SESSION_COOKIE_SAME_SITE` to `strict` can cause login failures. This is because Open WebUI uses a session cookie to validate the callback from the OAuth provider, which helps prevent CSRF attacks.

However, a `strict` session cookie is not sent with the callback request, leading to potential login issues. If you experience this problem, use the default `lax` value instead.

:::

#### `WEBUI_SESSION_COOKIE_SECURE`

- Type: `bool`
- Default: `False`
- Description: Sets the `Secure` attribute for session cookies if set to `True`.

#### `WEBUI_AUTH_COOKIE_SAME_SITE`

- Type: `str`
- Options:
  - `lax` - Sets the `SameSite` attribute to lax, allowing auth cookies to be sent with
requests initiated by third-party websites.
  - `strict` - Sets the `SameSite` attribute to strict, blocking auth cookies from being sent
with requests initiated by third-party websites.
  - `none` - Sets the `SameSite` attribute to none, allowing auth cookies to be sent with
requests initiated by third-party websites, but only over HTTPS.
- Default: `lax`
- Description: Sets the `SameSite` attribute for auth cookies.

:::info

If the value is not set, `WEBUI_SESSION_COOKIE_SAME_SITE` will be used as a fallback.

:::

#### `WEBUI_AUTH_COOKIE_SECURE`

- Type: `bool`
- Default: `False`
- Description: Sets the `Secure` attribute for auth cookies if set to `True`.

:::info

If the value is not set, `WEBUI_SESSION_COOKIE_SECURE` will be used as a fallback.

:::

#### `WEBUI_AUTH`

- Type: `bool`
- Default: `True`
- Description: This setting enables or disables authentication.

:::danger

If set to `False`, authentication will be disabled for your Open WebUI instance. However, it's
important to note that turning off authentication is only possible for fresh installations without
any existing users. If there are already users registered, you cannot disable authentication
directly. Ensure that no users are present in the database if you intend to turn off `WEBUI_AUTH`.

:::

#### `WEBUI_SECRET_KEY`

- Type: `str`
- Default: `t0p-s3cr3t`
- Docker Default: Randomly generated on first start
- Description: Overrides the randomly generated string used for JSON Web Token.

:::info

When deploying Open WebUI in a multi-node/worker cluster with a load balancer, you must ensure that the WEBUI_SECRET_KEY value is the same across all instances in order to enable users to continue working if a node is recycled or their session is transferred to a different node. Without it, they will need to sign in again each time the underlying node changes.

:::

#### `ENABLE_VERSION_UPDATE_CHECK`

- Type: `bool`
- Default: `True`
- Description: When enabled, the application makes automatic update checks and notifies you about version updates.

:::info

If `OFFLINE_MODE` is enabled, this `ENABLE_VERSION_UPDATE_CHECK` flag is always set to `false` automatically.

:::

#### `OFFLINE_MODE`

- Type: `bool`
- Default: `False`
- Description: Disables Open WebUI's network connections for update checks and automatic model downloads.

:::info

**Disabled when enabled:**

- Automatic version update checks (see flag `ENABLE_VERSION_UPDATE_CHECK`)
- Downloads of embedding models from Hugging Face Hub
  - If you did not download an embedding model prior to activating `OFFLINE_MODE` any RAG, web search and document analysis functionality may not work properly
- Update notifications in the UI (see flag `ENABLE_VERSION_UPDATE_CHECK`)

**Still functional:**

- External LLM API connections (OpenAI, etc.)
- OAuth authentication providers
- Web search and RAG with external APIs

Read more about `offline mode` in this [guide](/docs/tutorials/offline-mode.md).

:::

#### `RESET_CONFIG_ON_START`

- Type: `bool`
- Default: `False`
- Description: Resets the `config.json` file on startup.

#### `SAFE_MODE`

- Type: `bool`
- Default: `False`
- Description: Enables safe mode, which disables potentially unsafe features, deactivating all functions.

#### `CORS_ALLOW_ORIGIN`

- Type: `str`
- Default: `*`
- Description: Sets the allowed origins for Cross-Origin Resource Sharing (CORS).

#### `RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE`

- Type: `bool`
- Default: `False`
- Description: Determines whether to allow custom models defined on the Hub in their own modeling files.

#### `RAG_RERANKING_MODEL_TRUST_REMOTE_CODE`

- Type: `bool`
- Default: `False`
- Description: Determines whether to allow custom models defined on the Hub in their own.
modeling files for reranking.

#### `RAG_EMBEDDING_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `True`
- Description: Toggles automatic update of the Sentence-Transformer model.

#### `RAG_RERANKING_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `True`
- Description: Toggles automatic update of the reranking model.

## Vector Database

#### `VECTOR_DB`

- Type: `str`
- Options:
- `chroma`, `elasticsearch`, `milvus`, `opensearch`, `pgvector`, `qdrant`, `pinecone`
- Default: `chroma`
- Description: Specifies which vector database system to use. This setting determines which vector storage system will be used for managing embeddings.

### ChromaDB

#### `CHROMA_TENANT`

- Type: `str`
- Default: The value of `chromadb.DEFAULT_TENANT` (a constant in the `chromadb` module)
- Description: Sets the tenant for ChromaDB to use for RAG embeddings.

#### `CHROMA_DATABASE`

- Type: `str`
- Default: The value of `chromadb.DEFAULT_DATABASE` (a constant in the `chromadb` module)
- Description: Sets the database in the ChromaDB tenant to use for RAG embeddings.

#### `CHROMA_HTTP_HOST`

- Type: `str`
- Description: Specifies the hostname of a remote ChromaDB Server. Uses a local ChromaDB instance if not set.

#### `CHROMA_HTTP_PORT`

- Type: `int`
- Default: `8000`
- Description: Specifies the port of a remote ChromaDB Server.

#### `CHROMA_HTTP_HEADERS`

- Type: `str`
- Description: A comma-separated list of HTTP headers to include with every ChromaDB request.
- Example: `Authorization=Bearer heuhagfuahefj,User-Agent=OpenWebUI`.

#### `CHROMA_HTTP_SSL`

- Type: `bool`
- Default: `False`
- Description: Controls whether or not SSL is used for ChromaDB Server connections.

#### `CHROMA_CLIENT_AUTH_PROVIDER`

- Type: `str`
- Description: Specifies an authentication provider for remote ChromaDB Server.
- Example: `chromadb.auth.basic_authn.BasicAuthClientProvider`

#### `CHROMA_CLIENT_AUTH_CREDENTIALS`

- Type: `str`
- Description: Specifies auth credentials for remote ChromaDB Server.
- Example: `username:password`

### Elasticsearch

#### `ELASTICSEARCH_API_KEY`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the Elasticsearch API key.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ELASTICSEARCH_CA_CERTS`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the path to the CA certificates for Elasticsearch.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ELASTICSEARCH_CLOUD_ID`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the Elasticsearch cloud ID.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ELASTICSEARCH_INDEX_PREFIX`

- Type: `str`
- Default: `open_webui_collections`
- Description: Specifies the prefix for the Elasticsearch index.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ELASTICSEARCH_PASSWORD`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the password for Elasticsearch.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ELASTICSEARCH_URL`

- Type: `str`
- Default: `https://localhost:9200`
- Description: Specifies the URL for the Elasticsearch instance.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ELASTICSEARCH_USERNAME`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the username for Elasticsearch.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Milvus

#### `MILVUS_URI`

- Type: `str`
- Default: `${DATA_DIR}/vector_db/milvus.db`
- Description: Specifies the URI for connecting to the Milvus vector database. This can point to a local or remote Milvus server based on the deployment configuration.

#### `MILVUS_DB`

- Type: `str`
- Default: `default`
- Description: Specifies the database to connect to within a Milvus instance.

#### `MILVUS_TOKEN`

- Type: `str`
- Default: `None`
- Description: Specifies an optional connection token for Milvus.

#### `MILVUS_INDEX_TYPE`

- Type: `str`
- Default: `HNSW`
- Options: `AUTOINDEX`, `FLAT`, `IVF_FLAT`, `HNSW`
- Description: Specifies the index type to use when creating a new collection in Milvus. `AUTOINDEX` is generally recommended for Milvus standalone. `HNSW` may offer better performance but typically requires a clustered Milvus setup.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MILVUS_METRIC_TYPE`

- Type: `str`
- Default: `COSINE`
- Options: `COSINE`, `IP`, `L2`
- Description: Specifies the metric type for vector similarity search in Milvus.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MILVUS_HNSW_M`

- Type: `int`
- Default: `16`
- Description: Specifies the `M` parameter for the HNSW index type in Milvus. This influences the number of bi-directional links created for each new element during construction. Only applicable if `MILVUS_INDEX_TYPE` is `HNSW`.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MILVUS_HNSW_EFCONSTRUCTION`

- Type: `int`
- Default: `100`
- Description: Specifies the `efConstruction` parameter for the HNSW index type in Milvus. This influences the size of the dynamic list for the nearest neighbors during index construction. Only applicable if `MILVUS_INDEX_TYPE` is `HNSW`.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MILVUS_IVF_FLAT_NLIST`

- Type: `int`
- Default: `128`
- Description: Specifies the `nlist` parameter for the IVF_FLAT index type in Milvus. This is the number of cluster units. Only applicable if `MILVUS_INDEX_TYPE` is `IVF_FLAT`.
- Persistence: This environment variable is a `PersistentConfig` variable.

### OpenSearch

#### `OPENSEARCH_CERT_VERIFY`

- Type: `bool`
- Default: `False`
- Description: Enables or disables OpenSearch certificate verification.

#### `OPENSEARCH_PASSWORD`

- Type: `str`
- Default: `None`
- Description: Sets the password for OpenSearch.

#### `OPENSEARCH_SSL`

- Type: `bool`
- Default: `True`
- Description: Enables or disables SSL for OpenSearch.

#### `OPENSEARCH_URI`

- Type: `str`
- Default: `https://localhost:9200`
- Description: Sets the URI for OpenSearch.

#### `OPENSEARCH_USERNAME`

- Type: `str`
- Default: `None`
- Description: Sets the username for OpenSearch.

### PGVector

#### `PGVECTOR_DB_URL`

- Type: `str`
- Default: The value of the `DATABASE_URL` environment variable
- Description: Sets the database URL for model storage.

#### `PGVECTOR_INITIALIZE_MAX_VECTOR_LENGTH`

- Type: `str`
- Default: `1536`
- Description: Specifies the maximum vector length for PGVector initialization.

### Qdrant

#### `QDRANT_API_KEY`

- Type: `str`
- Description: Sets the API key for Qdrant.

#### `QDRANT_URI`

- Type: `str`
- Description: Sets the URI for Qdrant.

#### `QDRANT_ON_DISK`

- Type: `bool`
- Default: `False`
- Description: Enable the usage of memmap(also known as on-disk) storage

#### `QDRANT_PREFER_GRPC`

- Type: `bool`
- Default: `False`
- Description: Use gPRC interface whenever possible

#### `QDRANT_GRPC_PORT`

- Type: `int`
- Default: `6334`
- Description: Sets the gRPC port number for Qdrant.

#### `ENABLE_QDRANT_MULTITENANCY_MODE`

- Type: `bool`
- Default: `False`
- Description: Enables multitenancy pattern for Qdrant collections management, which significantly reduces RAM usage and computational overhead by consolidating similar vector data structures. Recommend turn on

:::info

This will disconect all Qdrant collections created in the previous pattern, which is non-multitenancy. Go to  `Admin Settings` > `Documents` > `Reindex Knowledge Base` to migrate existing knowledges.

The Qdrant collections created in the previous pattern will still consume resources.

Currently, there is no button in the UI to only reset the vector DB. If you want to migrate knowledge to multitenancy:
- Remove all collections with the `open_webui-knowledge` prefix (or `open_webui` prefix to remove all collections related to Open WebUI) using the native Qdrant client
- Go to `Admin Settings` > `Documents` > `Reindex Knowledge Base` to migrate existing knowledge base

`Reindex Knowledge Base` will ONLY migrate the knowledge base

:::

:::danger

If you decide to use the multitenancy pattern as your default and you don't need to migrate old knowledge, go to `Admin Settings` > `Documents` to reset vector and knowledge, which will delete all collections with the `open_webui` prefix and all stored knowledge.

:::

#### `QDRANT_COLLECTION_PREFIX`

- Type: `str`
- Default: `open-webui`
- Description: Sets the prefix for Qdrant collection names. Useful for namespacing or isolating collections, especially in multitenancy mode. Changing this value will cause the application to use a different set of collections in Qdrant. Existing collections with a different prefix will not be affected.

### Pinecone

When using Pinecone as the vector store, the following environment variables are used to control its behavior. Make sure to set these variables in your `.env` file or deployment environment.

#### `PINECONE_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key used to authenticate with the Pinecone service.

#### `PINECONE_ENVIRONMENT`

- Type: `str`
- Default: `None`
- Description: Specifies the Pinecone environment to connect to (e.g., `us-west1-gcp`, `gcp-starter`, etc.).

#### `PINECONE_INDEX_NAME`

- Type: `str`
- Default: `open-webui-index`
- Description: Defines the name of the Pinecone index that will be used to store and query vector embeddings.

#### `PINECONE_DIMENSION`

- Type: `int`
- Default: `1536`
- Description: The dimensionality of the vector embeddings. Must match the dimension expected by the index (commonly 768, 1024, 1536, or 3072 based on model used).

#### `PINECONE_METRIC`

- Type: `str`
- Default: `cosine`
- Options: `cosine`, `dotproduct`, `euclidean`
- Description: Specifies the similarity metric to use for vector comparisons within the Pinecone index.

#### `PINECONE_CLOUD`

- Type: `str`
- Default: `aws`
- Options: `aws`, `gcp`, `azure`
- Description: Specifies the cloud provider where the Pinecone index is hosted.

## RAG Content Extraction Engine

#### `CONTENT_EXTRACTION_ENGINE`

- Type: `str`
- Options:
  - Leave empty to use default
  - `external` - Use external loader
  - `tika` - Use a local Apache Tika server
  - `docling` - Use Docling engine
  - `document_intelligence` - Use Document Intelligence engine
  - `mistral_ocr` - Use Mistral OCR engine
- Description: Sets the content extraction engine to use for document ingestion.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MISTRAL_OCR_API_KEY`

- Type: `str`
- Default: `None`
- Description: Specifies the Mistral OCR API key to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `EXTERNAL_DOCUMENT_LOADER_URL`

- Type: `str`
- Default: `None`
- Description: Sets the URL for the external document loader service.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `EXTERNAL_DOCUMENT_LOADER_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key for authenticating with the external document loader service.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TIKA_SERVER_URL`

- Type: `str`
- Default: `http://localhost:9998`
- Description: Sets the URL for the Apache Tika server.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DOCLING_SERVER_URL`

- Type: `str`
- Default: `http://docling:5001`
- Description: Specifies the URL for the Docling server.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DOCLING_OCR_ENGINE`

- Type: `str`  
- Default: `tesseract`  
- Description: Specifies the OCR engine used by Docling.  
  Supported values include: `tesseract` (default), `easyocr`, `ocrmac`, `rapidocr`, and `tesserocr`.  
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DOCLING_OCR_LANG`

- Type: `str`  
- Default: `eng,fra,deu,spa` (when using the default `tesseract` engine)  
- Description: Specifies the OCR language(s) to be used with the configured `DOCLING_OCR_ENGINE`.  
  The format and available language codes depend on the selected OCR engine.  
- Persistence: This environment variable is a `PersistentConfig` variable.

## Retrieval Augmented Generation (RAG)

#### `RAG_EMBEDDING_ENGINE`

- Type: `str`
- Options:
  - Leave empty for `Default (SentenceTransformers)` - Uses SentenceTransformers for embeddings.
  - `ollama` - Uses the Ollama API for embeddings.
  - `openai` - Uses the OpenAI API for embeddings.
- Description: Selects an embedding engine to use for RAG.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_EMBEDDING_MODEL`

- Type: `str`
- Default: `sentence-transformers/all-MiniLM-L6-v2`
- Description: Sets a model for embeddings. Locally, a Sentence-Transformer model is used.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_RAG_HYBRID_SEARCH`

- Type: `bool`
- Default: `False`
- Description: Enables the use of ensemble search with `BM25` + `ChromaDB`, with reranking using
`sentence_transformers` models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_TOP_K`

- Type: `int`
- Default: `3`
- Description: Sets the default number of results to consider for the embedding when using RAG.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_TOP_K_RERANKER`

- Type: `int`
- Default: `3`
- Description: Sets the default number of results to consider for the reranker when using RAG.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_RELEVANCE_THRESHOLD`

- Type: `float`
- Default: `0.0`
- Description: Sets the relevance threshold to consider for documents when used with reranking.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_HYBRID_BM25_WEIGHT`

- Type: `float`
- Default: `0.5`
- Description: Sets the weight given to the keyword search (BM25) during hybrid search. 1 means only keyword serach, 0 means only vector search.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_TEMPLATE`

- Type: `str`
- Default: The value of `DEFAULT_RAG_TEMPLATE` environment variable.

`DEFAULT_RAG_TEMPLATE`:

```
### Task:
Respond to the user query using the provided context, incorporating inline citations in the format [id] **only when the <source> tag includes an explicit id attribute** (e.g., <source id="1">).

### Guidelines:
- If you don't know the answer, clearly state that.
- If uncertain, ask the user for clarification.
- Respond in the same language as the user's query.
- If the context is unreadable or of poor quality, inform the user and provide the best possible answer.
- If the answer isn't present in the context but you possess the knowledge, explain this to the user and provide the answer using your own understanding.
- **Only include inline citations using [id] (e.g., [1], [2]) when the <source> tag includes an id attribute.**
- Do not cite if the <source> tag does not contain an id attribute.
- Do not use XML tags in your response.
- Ensure citations are concise and directly related to the information provided.

### Example of Citation:
If the user asks about a specific topic and the information is found in a source with a provided id attribute, the response should include the citation like in the following example:
* "According to the study, the proposed method increases efficiency by 20% [1]."

### Output:
Provide a clear and direct response to the user's query, including inline citations in the format [id] only when the <source> tag with id attribute is present in the context.

<context>
{{CONTEXT}}
</context>

<user_query>
{{QUERY}}
</user_query>
```

- Description: Template to use when injecting RAG documents into chat completion
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_TEXT_SPLITTER`

- Type: `str`
- Options:
  - `character`
  - `token`
- Default: `character`
- Description: Sets the text splitter for RAG models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TIKTOKEN_CACHE_DIR`

- Type: `str`
- Default: `{CACHE_DIR}/tiktoken`
- Description: Sets the directory for TikToken cache.

#### `TIKTOKEN_ENCODING_NAME`

- Type: `str`
- Default: `cl100k_base`
- Description: Sets the encoding name for TikToken.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CHUNK_SIZE`

- Type: `int`
- Default: `1000`
- Description: Sets the document chunk size for embeddings.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `CHUNK_OVERLAP`

- Type: `int`
- Default: `100`
- Description: Specifies how much overlap there should be between chunks.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `PDF_EXTRACT_IMAGES`

- Type: `bool`
- Default: `False`
- Description: Extracts images from PDFs using OCR when loading documents.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_FILE_MAX_SIZE`

- Type: `int`
- Description: Sets the maximum size of a file in megabytes that can be uploaded for document ingestion.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_FILE_MAX_COUNT`

- Type: `int`
- Description: Sets the maximum number of files that can be uploaded at once for document ingestion.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

When configuring `RAG_FILE_MAX_SIZE` and `RAG_FILE_MAX_COUNT`, ensure that the values are reasonable to prevent excessive file uploads and potential performance issues.

:::

#### `RAG_ALLOWED_FILE_EXTENSIONS`

- Type: `list` of `str`
- Default: `[]` (which means all supported file types are allowed)
- Description: Specifies which file extensions are permitted for upload. 

```json
["pdf,docx,txt"]
```

- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_RERANKING_MODEL`

- Type: `str`
- Description: Sets a model for reranking results. Locally, a Sentence-Transformer model is used.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI base API URL to use for RAG embeddings.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for RAG embeddings.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_EMBEDDING_OPENAI_BATCH_SIZE`

- Type: `int`
- Default: `1`
- Description: Sets the batch size for OpenAI embeddings.

#### `RAG_EMBEDDING_BATCH_SIZE`

- Type: `int`
- Default: `1`
- Description: Sets the batch size for embedding in RAG (Retrieval-Augmented Generator) models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_OLLAMA_API_KEY`

- Type: `str`
- Description: Sets the API key for Ollama API used in RAG models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_OLLAMA_BASE_URL`

- Type: `str`
- Description: Sets the base URL for Ollama API used in RAG models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_RETRIEVAL_QUERY_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables retrieval query generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `QUERY_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Default: The value of `DEFAULT_QUERY_GENERATION_PROMPT_TEMPLATE` environment variable.

`DEFAULT_QUERY_GENERATION_PROMPT_TEMPLATE`:

```
### Task:
Analyze the chat history to determine the necessity of generating search queries, in the given language. By default, **prioritize generating 1-3 broad and relevant search queries** unless it is absolutely certain that no additional information is required. The aim is to retrieve comprehensive, updated, and valuable information even with minimal uncertainty. If no search is unequivocally needed, return an empty list.

### Guidelines:
- Respond **EXCLUSIVELY** with a JSON object. Any form of extra commentary, explanation, or additional text is strictly prohibited.
- When generating search queries, respond in the format: { "queries": ["query1", "query2"] }, ensuring each query is distinct, concise, and relevant to the topic.
- If and only if it is entirely certain that no useful results can be retrieved by a search, return: { "queries": [] }.
- Err on the side of suggesting search queries if there is **any chance** they might provide useful or updated information.
- Be concise and focused on composing high-quality search queries, avoiding unnecessary elaboration, commentary, or assumptions.
- Today's date is: {{CURRENT_DATE}}.
- Always prioritize providing actionable and broad queries that maximize informational coverage.

### Output:
Strictly return in JSON format: 
{
  "queries": ["query1", "query2"]
}

### Chat History:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
```

- Description: Sets the prompt template for query generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `BYPASS_EMBEDDING_AND_RETRIEVAL`

- Type: `bool`
- Default: `False`
- Description: Bypasses the embedding and retrieval process.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DOCUMENT_INTELLIGENCE_ENDPOINT`

- Type: `str`
- Default: `None`
- Description: Specifies the endpoint for document intelligence.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `DOCUMENT_INTELLIGENCE_KEY`

- Type: `str`
- Default: `None`
- Description: Specifies the key for document intelligence.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_RAG_LOCAL_WEB_FETCH`

- Type: `bool`
- Default: `False`
- Description: Enables or disables local web fetch for RAG.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_EMBEDDING_CONTENT_PREFIX`

- Type: `str`
- Default: `None`
- Description: Specifies the prefix for the RAG embedding content.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_EMBEDDING_PREFIX_FIELD_NAME`

- Type: `str`
- Default: `None`
- Description: Specifies the field name for the RAG embedding prefix.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_EMBEDDING_QUERY_PREFIX`

- Type: `str`
- Default: `None`
- Description: Specifies the prefix for the RAG embedding query.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `RAG_FULL_CONTEXT`

- Type: `bool`
- Default: `False`
- Description: Specifies whether to use the full context for RAG.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Google Drive

#### `ENABLE_GOOGLE_DRIVE_INTEGRATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables Google Drive integration. If set to true, and `GOOGLE_DRIVE_CLIENT_ID` & `GOOGLE_DRIVE_API_KEY` are both configured, Google Drive will appear as an upload option in the chat UI.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

When enabling `GOOGLE_DRIVE_INTEGRATION`, ensure that you have configured `GOOGLE_DRIVE_CLIENT_ID` and `GOOGLE_DRIVE_API_KEY` correctly, and have reviewed Google's terms of service and usage guidelines.

:::

#### `GOOGLE_DRIVE_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for Google Drive (client must be configured with Drive API and Picker API enabled).
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GOOGLE_DRIVE_API_KEY`

- Type: `str`
- Description: Sets the API key for Google Drive integration.
- Persistence: This environment variable is a `PersistentConfig` variable.

### OneDrive

#### `ENABLE_ONEDRIVE_INTEGRATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables OneDrive integration.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ONEDRIVE_CLIENT_ID`

- Type: `str`
- Default: `None`
- Description: Specifies the client ID for OneDrive integration.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ONEDRIVE_SHAREPOINT_URL`

- Type: `str`
- Default: `None`
- Description: Specifies the SharePoint site URL for OneDrive integration e.g. https://companyname.sharepoint.com.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ONEDRIVE_SHAREPOINT_TENANT_ID`

- Type: `str`
- Default: `None`
- Description: Specifies the SharePoint tenant ID for OneDrive integration.
- Persistence: This environment variable is a `PersistentConfig` variable.

## Web Search

#### `ENABLE_WEB_SEARCH`

- Type: `bool`
- Default: `False`
- Description: Enable web search toggle.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_SEARCH_QUERY_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables search query generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WEB_SEARCH_TRUST_ENV`

- Type: `bool`
- Default: `False`
- Description: Enables proxy set by `http_proxy` and `https_proxy` during web search content fetching.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WEB_SEARCH_RESULT_COUNT`

- Type: `int`
- Default: `3`
- Description: Maximum number of search results to crawl.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WEB_SEARCH_CONCURRENT_REQUESTS`

- Type: `int`
- Default: `10`
- Description: Number of concurrent requests to crawl web pages returned from search results.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WEB_SEARCH_ENGINE`

- Type: `str`
- Options:
  - `searxng` - Uses the [SearXNG](https://github.com/searxng/searxng) search engine.
  - `google_pse` - Uses the [Google Programmable Search Engine](https://programmablesearchengine.google.com/about/).
  - `brave` - Uses the [Brave search engine](https://brave.com/search/api/).
  - `kagi` - Uses the [Kagi](https://www.kagi.com/) search engine.
  - `mojeek` - Uses the [Mojeek](https://www.mojeek.com/) search engine.
  - `bocha` - Uses the Bocha search engine.
  - `serpstack` - Uses the [Serpstack](https://serpstack.com/) search engine.
  - `serper` - Uses the [Serper](https://serper.dev/) search engine.
  - `serply` - Uses the [Serply](https://serply.io/) search engine.
  - `searchapi` - Uses the [SearchAPI](https://www.searchapi.io/) search engine.
  - `serpapi` - Uses the [SerpApi](https://serpapi.com/) search engine.
  - `duckduckgo` - Uses the [DuckDuckGo](https://duckduckgo.com/) search engine.
  - `tavily` - Uses the [Tavily](https://tavily.com/) search engine.
  - `jina` - Uses the [Jina](https://jina.ai/) search engine.
  - `bing` - Uses the [Bing](https://www.bing.com/) search engine.
  - `exa` - Uses the [Exa](https://exa.ai/) search engine.
  - `perplexity` - Uses the [Perplexity AI](https://www.perplexity.ai/) search engine.
  - `sougou` - Uses the [Sougou](https://www.sogou.com/) search engine.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `BYPASS_WEB_SEARCH_EMBEDDING_AND_RETRIEVAL`

- Type: `bool`
- Default: `False`
- Description: Bypasses the web search embedding and retrieval process.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SEARXNG_QUERY_URL`

- Type: `str`
- Description: The [SearXNG search API](https://docs.searxng.org/dev/search_api.html) URL supporting JSON output. `<query>` is replaced with
the search query. Example: `http://searxng.local/search?q=<query>`
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GOOGLE_PSE_API_KEY`

- Type: `str`
- Description: Sets the API key for the Google Programmable Search Engine (PSE) service.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GOOGLE_PSE_ENGINE_ID`

- Type: `str`
- Description: The engine ID for the Google Programmable Search Engine (PSE) service.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `BRAVE_SEARCH_API_KEY`

- Type: `str`
- Description: Sets the API key for the Brave Search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `KAGI_SEARCH_API_KEY`

- Type: `str`
- Description: Sets the API key for Kagi Search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MOJEEK_SEARCH_API_KEY`

- Type: `str`
- Description: Sets the API key for Mojeek Search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SERPSTACK_API_KEY`

- Type: `str`
- Description: Sets the API key for Serpstack search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SERPSTACK_HTTPS`

- Type: `bool`
- Default: `True`
- Description: Configures the use of HTTPS for Serpstack requests. Free tier requests are restricted to HTTP only.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SERPER_API_KEY`

- Type: `str`
- Description: Sets the API key for Serper search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SERPLY_API_KEY`

- Type: `str`
- Description: Sets the API key for Serply search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SEARCHAPI_API_KEY`

- Type: `str`
- Description: Sets the API key for SearchAPI.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SEARCHAPI_ENGINE`

- Type: `str`
- Description: Sets the SearchAPI engine.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TAVILY_API_KEY`

- Type: `str`
- Description: Sets the API key for Tavily search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `JINA_API_KEY`

- Type: `str`
- Description: Sets the API key for Jina.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `BING_SEARCH_V7_ENDPOINT`

- Type: `str`
- Description: Sets the endpoint for Bing Search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `BING_SEARCH_V7_SUBSCRIPTION_KEY`

- Type: `str`
- Default: `https://api.bing.microsoft.com/v7.0/search`
- Description: Sets the subscription key for Bing Search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `BOCHA_SEARCH_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key for Bocha Search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `EXA_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key for Exa search API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SERPAPI_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key for SerpAPI.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SERPAPI_ENGINE`

- Type: `str`
- Default: `None`
- Description: Specifies the search engine to use for SerpAPI.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SOUGOU_API_SID`

- Type: `str`
- Default: `None`
- Description: Sets the Sogou API SID.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `SOUGOU_API_SK`

- Type: `str`
- Default: `None`
- Description: Sets the Sogou API SK.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `TAVILY_EXTRACT_DEPTH`

- Type: `str`
- Default: `basic`
- Description: Specifies the extract depth for Tavily search results.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Web Loader Configuration

#### `WEB_LOADER_ENGINE`

- Type: `str`
- Default: `safe_web`
- Description: Specifies the loader to use for retrieving and processing web content.
- Options:
  - `requests` - Uses the Requests module with enhanced error handling.
  - `playwright` - Uses Playwright for more advanced web page rendering and interaction.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

When using `playwright`, you have two options:

1. If `PLAYWRIGHT_WS_URI` is not set, Playwright with Chromium dependencies will be automatically installed in the Open WebUI container on launch.
2. If `PLAYWRIGHT_WS_URI` is set, Open WebUI will connect to a remote browser instance instead of installing dependencies locally.

:::

#### `PLAYWRIGHT_WS_URL`

- Type: `str`
- Default: `None`
- Description: Specifies the WebSocket URI of a remote Playwright browser instance. When set, Open WebUI will use this remote browser instead of installing browser dependencies locally. This is particularly useful in containerized environments where you want to keep the Open WebUI container lightweight and separate browser concerns. Example: `ws://playwright:3000`
- Persistence: This environment variable is a `PersistentConfig` variable.

:::tip

Using a remote Playwright browser via `PLAYWRIGHT_WS_URL` can be beneficial for:

- Reducing the size of the Open WebUI container
- Using a different browser other than the default Chromium
- Connecting to a non-headless (GUI) browser

:::

#### `FIRECRAWL_API_BASE_URL`

- Type: `str`
- Default: `https://api.firecrawl.dev`
- Description: Sets the base URL for Firecrawl API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `FIRECRAWL_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key for Firecrawl API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `PERPLEXITY_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the API key for Perplexity API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `PLAYWRIGHT_TIMEOUT`

- Type: `int`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the timeout for Playwright requests.
- Persistence: This environment variable is a `PersistentConfig` variable.

### YouTube Loader

#### `YOUTUBE_LOADER_PROXY_URL`

- Type: `str`
- Description: Sets the proxy URL for YouTube loader.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `YOUTUBE_LOADER_LANGUAGE`

- Type: `str`
- Default: `en`
- Description: Comma-separated list of language codes to try when fetching YouTube video transcriptions, in priority order.
- Example: If set to `es,de`, Spanish transcriptions will be attempted first, then German if Spanish was not available, and lastly English. Note: If none of the specified languages are available and `en` was not in your list, the system will automatically try English as a final fallback.
- Persistence: This environment variable is a `PersistentConfig` variable.

## Audio

### Whisper Speech-to-Text (Local)

#### `WHISPER_MODEL`

- Type: `str`
- Default: `base`
- Description: Sets the Whisper model to use for Speech-to-Text. The backend used is faster_whisper with quantization to `int8`.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WHISPER_MODEL_DIR`

- Type: `str`
- Default: `${DATA_DIR}/cache/whisper/models`
- Description: Specifies the directory to store Whisper model files.

#### `WHISPER_VAD_FILTER`

- Type: `bool`
- Default: `False`
- Description: Specifies whether to apply a Voice Activity Detection (VAD) filter to Whisper Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `WHISPER_MODEL_AUTO_UPDATE`

- Type: `bool`
- Default: `False`
- Description: Toggles automatic update of the Whisper model.

#### `WHISPER_LANGUAGE`

- Type: `str`
- Default: `None`
- Description: Specifies the ISO 639-1 language Whisper uses for STT (ISO 639-2 for Hawaiian and Cantonese). Whisper predicts the language by default.

### Speech-to-Text (OpenAI)

#### `AUDIO_STT_ENGINE`

- Type: `str`
- Options:
  - Leave empty to use the built-in local Whisper engine for Speech-to-Text.
  - `openai` - Uses OpenAI engine for Speech-to-Text.
  - `deepgram`- Uses Deepgram engine for Speech-to-Text.
  - `azure` Uses Azure engine for Speech-to-Text.
- Description: Specifies the Speech-to-Text engine to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_STT_MODEL`

- Type: `str`
- Default: `whisper-1`
- Description: Specifies the Speech-to-Text model to use for OpenAI-compatible endpoints.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_STT_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_STT_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the OpenAI API key to use for Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Speech-to-Text (Azure)

#### `AUDIO_STT_AZURE_API_KEY`

- Type: `str`
- Default: `None`
- Description: Specifies the Azure API key to use for Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_STT_AZURE_REGION`

- Type: `str`
- Default: `None`
- Description: Specifies the Azure region to use for Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_STT_AZURE_LOCALES`

- Type: `str`
- Default: `None`
- Description: Specifies the locales to use for Azure Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Speech-to-Text (Deepgram)

#### `DEEPGRAM_API_KEY`

- Type: `str`
- Default: `None`
- Description: Specifies the Deepgram API key to use for Speech-to-Text.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Text-to-Speech

#### `AUDIO_TTS_API_KEY`

- Type: `str`
- Description: Sets the API key for Text-to-Speech.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_TTS_ENGINE`

- Type: `str`
- Options:
  - Leave empty to use the built-in WebAPI engine for Text-to-Speech.
  - `azure` - Uses Azure engine for Text-to-Speech.
  - `elevenlabs` - Uses ElevenLabs engine for Text-to-Speech
  - `openai` - Uses OpenAI engine for Text-to-Speech.
  - `transformers` - Uses SentenceTransformers for Text-to-Speech.
- Description: Specifies the Text-to-Speech engine to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_TTS_MODEL`

- Type: `str`
- Default: `tts-1`
- Description: Specifies the OpenAI text-to-speech model to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_TTS_VOICE`

- Type: `str`
- Default: `alloy`
- Description: Sets the OpenAI text-to-speech voice to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_TTS_SPLIT_ON`

- Type: `str`
- Default: `punctuation`
- Description: Sets the OpenAI text-to-speech split on to use.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Azure Text-to-Speech

#### `AUDIO_TTS_AZURE_SPEECH_REGION`

- Type: `str`
- Description: Sets the region for Azure Text to Speech.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT`

- Type: `str`
- Description: Sets the output format for Azure Text to Speech.
- Persistence: This environment variable is a `PersistentConfig` variable.

### OpenAI Text-to-Speech

#### `AUDIO_TTS_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for text-to-speech.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUDIO_TTS_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for text-to-speech.
- Persistence: This environment variable is a `PersistentConfig` variable.

## Image Generation

#### `IMAGE_GENERATION_ENGINE`

- Type: `str`
- Options:
  - `openai` - Uses OpenAI DALL-E for image generation.
  - `comfyui` - Uses ComfyUI engine for image generation.
  - `automatic1111` - Uses AUTOMATIC1111 engine for image generation.
  - `gemini` - Uses Gemini for image generation.
- Default: `openai`
- Description: Specifies the engine to use for image generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_IMAGE_GENERATION`

- Type: `bool`
- Default: `False`
- Description: Enables or disables image generation features.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_IMAGE_PROMPT_GENERATION`

- Type: `bool`
- Default: `True`
- Description: Enables or disables image prompt generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE`

- Type: `str`
- Default: `None`
- Description: Specifies the template to use for generating image prompts.
- Persistence: This environment variable is a `PersistentConfig` variable.

`DEFAULT_IMAGE_PROMPT_GENERATION_PROMPT_TEMPLATE`:

```
### Task:
Generate a detailed prompt for am image generation task based on the given language and context. Describe the image as if you were explaining it to someone who cannot see it. Include relevant details, colors, shapes, and any other important elements.

### Guidelines:
- Be descriptive and detailed, focusing on the most important aspects of the image.
- Avoid making assumptions or adding information not present in the image.
- Use the chat's primary language; default to English if multilingual.
- If the image is too complex, focus on the most prominent elements.

### Output:
Strictly return in JSON format:
{
    "prompt": "Your detailed description here."
}

### Chat History:
<chat_history>
{{MESSAGES:END:6}}
</chat_history>
```

#### `IMAGE_SIZE`

- Type: `str`
- Default: `512x512`
- Description: Sets the default image size to generate.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `IMAGE_STEPS`

- Type: `int`
- Default: `50`
- Description: Sets the default iteration steps for image generation. Used for ComfyUI and AUTOMATIC1111.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `IMAGE_GENERATION_MODEL`

- Type: `str`
- Description: Default model to use for image generation
- Persistence: This environment variable is a `PersistentConfig` variable.

### AUTOMATIC1111

#### `AUTOMATIC1111_BASE_URL`

- Type: `str`
- Description: Specifies the URL to AUTOMATIC1111's Stable Diffusion API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUTOMATIC1111_API_AUTH`

- Type: `str`
- Description: Sets the AUTOMATIC1111 API authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUTOMATIC1111_CFG_SCALE`

- Type: `float`
- Description: Sets the scale for AUTOMATIC1111 inference.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUTOMATIC1111_SAMPLER`

- Type: `str`
- Description: Sets the sampler for AUTOMATIC1111 inference.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `AUTOMATIC1111_SCHEDULER`

- Type: `str`
- Description: Sets the scheduler for AUTOMATIC1111 inference.
- Persistence: This environment variable is a `PersistentConfig` variable.

### ComfyUI

#### `COMFYUI_BASE_URL`

- Type: `str`
- Description: Specifies the URL to the ComfyUI image generation API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `COMFYUI_API_KEY`

- Type: `str`
- Description: Sets the API key for ComfyUI.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `COMFYUI_WORKFLOW`

- Type: `str`
- Default:

```
{
  "3": {
    "inputs": {
      "seed": 0,
      "steps": 20,
      "cfg": 8,
      "sampler_name": "euler",
      "scheduler": "normal",
      "denoise": 1,
      "model": [
        "4",
        0
      ],
      "positive": [
        "6",
        0
      ],
      "negative": [
        "7",
        0
      ],
      "latent_image": [
        "5",
        0
      ]
    },
    "class_type": "KSampler",
    "_meta": {
      "title": "KSampler"
    }
  },
  "4": {
    "inputs": {
      "ckpt_name": "model.safetensors"
    },
    "class_type": "CheckpointLoaderSimple",
    "_meta": {
      "title": "Load Checkpoint"
    }
  },
  "5": {
    "inputs": {
      "width": 512,
      "height": 512,
      "batch_size": 1
    },
    "class_type": "EmptyLatentImage",
    "_meta": {
      "title": "Empty Latent Image"
    }
  },
  "6": {
    "inputs": {
      "text": "Prompt",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "7": {
    "inputs": {
      "text": "",
      "clip": [
        "4",
        1
      ]
    },
    "class_type": "CLIPTextEncode",
    "_meta": {
      "title": "CLIP Text Encode (Prompt)"
    }
  },
  "8": {
    "inputs": {
      "samples": [
        "3",
        0
      ],
      "vae": [
        "4",
        2
      ]
    },
    "class_type": "VAEDecode",
    "_meta": {
      "title": "VAE Decode"
    }
  },
  "9": {
    "inputs": {
      "filename_prefix": "ComfyUI",
      "images": [
        "8",
        0
      ]
    },
    "class_type": "SaveImage",
    "_meta": {
      "title": "Save Image"
    }
  }
}
```

- Description: Sets the ComfyUI workflow.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Gemini

#### `GEMINI_API_BASE_URL`

- Type: `str`
- Default: `None`
- Description: Specifies the URL to Gemini's API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GEMINI_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the Gemini API key.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `IMAGES_GEMINI_API_BASE_URL`

- Type: `str`
- Default: `None`
- Description: Specifies the URL to Gemini's image generation API.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `IMAGES_GEMINI_API_KEY`

- Type: `str`
- Default: `None`
- Description: Sets the Gemini API key for image generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

### OpenAI DALL-E

#### `IMAGES_OPENAI_API_BASE_URL`

- Type: `str`
- Default: `${OPENAI_API_BASE_URL}`
- Description: Sets the OpenAI-compatible base URL to use for DALL-E image generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `IMAGES_OPENAI_API_KEY`

- Type: `str`
- Default: `${OPENAI_API_KEY}`
- Description: Sets the API key to use for DALL-E image generation.
- Persistence: This environment variable is a `PersistentConfig` variable.

## OAuth

#### `ENABLE_OAUTH_SIGNUP`

- Type: `bool`
- Default: `False`
- Description: Enables account creation when signing up via OAuth. Distinct from `ENABLE_SIGNUP`.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::danger

`ENABLE_LOGIN_FORM` must be set to `False` when `ENABLE_OAUTH_SIGNUP` is set to `True`. Failure to do so will result in the inability to login.

:::

#### `OAUTH_MERGE_ACCOUNTS_BY_EMAIL`

- Type: `bool`
- Default: `False`
- Description: If enabled, merges OAuth accounts with existing accounts using the same email
address. This is considered unsafe as not all OAuth providers will verify email addresses and can lead to potential account takeovers.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_UPDATE_PICTURE_ON_LOGIN`

- Type: `bool`
- Default: `False`
- Description: If enabled, updates the local user profile picture with the OAuth-provided picture on login.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

If the OAuth picture claim is disabled by setting `OAUTH_PICTURE_CLAIM` to `''` (empty string), then setting this variable to `true` will not update the user profile pictures.

:::

#### `WEBUI_AUTH_TRUSTED_EMAIL_HEADER`

- Type: `str`
- Description: Defines the trusted request header for authentication. See [SSO docs](/features/sso).

#### `WEBUI_AUTH_TRUSTED_NAME_HEADER`

- Type: `str`
- Description: Defines the trusted request header for the username of anyone registering with the
`WEBUI_AUTH_TRUSTED_EMAIL_HEADER` header. See [SSO docs](/features/sso).

#### `WEBUI_AUTH_TRUSTED_GROUPS_HEADER`

- Type: `str`
- Description: Defines the trusted request header containing a comma-separated list of group memberships for the user when using trusted header authentication. See [SSO docs](/features/sso).

### Google

See https://support.google.com/cloud/answer/6158849?hl=en

#### `GOOGLE_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for Google OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GOOGLE_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for Google OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GOOGLE_OAUTH_SCOPE`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for Google OAuth authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GOOGLE_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/google/callback`
- Description: Sets the redirect URI for Google OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Microsoft

See https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app

#### `MICROSOFT_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for Microsoft OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MICROSOFT_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for Microsoft OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MICROSOFT_CLIENT_TENANT_ID`

- Type: `str`
- Description: Sets the tenant ID for Microsoft OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MICROSOFT_OAUTH_SCOPE`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for Microsoft OAuth authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `MICROSOFT_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/microsoft/callback`
- Description: Sets the redirect URI for Microsoft OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

### GitHub

See https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps

#### `GITHUB_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for GitHub OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GITHUB_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for GitHub OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GITHUB_CLIENT_SCOPE`

- Type: `str`
- Default: `user:email`
- Description: Specifies the scope for GitHub OAuth authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `GITHUB_CLIENT_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/github/callback`
- Description: Sets the redirect URI for GitHub OAuth.
- Persistence: This environment variable is a `PersistentConfig` variable.

### OpenID (OIDC)

#### `OAUTH_CLIENT_ID`

- Type: `str`
- Description: Sets the client ID for OIDC.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_CLIENT_SECRET`

- Type: `str`
- Description: Sets the client secret for OIDC.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OPENID_PROVIDER_URL`

- Type: `str`
- Description: Path to the `.well-known/openid-configuration` endpoint
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OPENID_REDIRECT_URI`

- Type: `str`
- Default: `<backend>/oauth/oidc/callback`
- Description: Sets the redirect URI for OIDC
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_SCOPES`

- Type: `str`
- Default: `openid email profile`
- Description: Sets the scope for OIDC authentication. `openid` and `email` are required.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_CODE_CHALLENGE_METHOD`

- Type: `str`
- Default: Empty string (' '), since `None` is set as default.
- Description: Specifies the code challenge method for OAuth authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_PROVIDER_NAME`

- Type: `str`
- Default: `SSO`
- Description: Sets the name for the OIDC provider.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_USERNAME_CLAIM`

- Type: `str`
- Default: `name`
- Description: Set username claim for OpenID.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_EMAIL_CLAIM`

- Type: `str`
- Default: `email`
- Description: Set email claim for OpenID.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_PICTURE_CLAIM`

- Type: `str`
- Default: `picture`
- Description: Set picture (avatar) claim for OpenID.
- Persistence: This environment variable is a `PersistentConfig` variable.

:::info

If `OAUTH_PICTURE_CLAIM` is set to `''` (empty string), then the OAuth picture claim is disabled and the user profile pictures will not be saved.

:::

#### `OAUTH_GROUP_CLAIM`

- Type: `str`
- Default: `groups`
- Description: Specifies the group claim for OAuth authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_OAUTH_ROLE_MANAGEMENT`

- Type: `bool`
- Default: `False`
- Description: Enables role management for OAuth delegation.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_OAUTH_GROUP_MANAGEMENT`

- Type: `bool`
- Default: `False`
- Description: Enables or disables OAuth group management.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_ROLES_CLAIM`

- Type: `str`
- Default: `roles`
- Description: Sets the roles claim to look for in the OIDC token.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_ALLOWED_ROLES`

- Type: `str`
- Default: `user,admin`
- Description: Sets the roles that are allowed access to the platform.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_ADMIN_ROLES`

- Type: `str`
- Default: `admin`
- Description: Sets the roles that are considered administrators.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `OAUTH_ALLOWED_DOMAINS`

- Type: `str`
- Default: `*`
- Description: Specifies the allowed domains for OAuth authentication. (e.g. "example1.com,example2.com").
- Persistence: This environment variable is a `PersistentConfig` variable.

## LDAP

#### `ENABLE_LDAP`

- Type: `bool`
- Default: `False`
- Description: Enables or disables LDAP authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_SERVER_LABEL`

- Type: `str`
- Description: Sets the label of the LDAP server.
- Persistence: This environment variable is a `PersistentConfig` variable.


#### `LDAP_SERVER_HOST`

- Type: `str`
- Default: `localhost`
- Description: Sets the hostname of the LDAP server.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_SERVER_PORT`

- Type: `int`
- Default: `389`
- Description: Sets the port number of the LDAP server.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_ATTRIBUTE_FOR_MAIL`

- Type: `str`
- Description: Sets the attribute to use as mail for LDAP authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_ATTRIBUTE_FOR_USERNAME`

- Type: `str`
- Description: Sets the attribute to use as a username for LDAP authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_APP_DN`

- Type: `str`
- Description: Sets the distinguished name for the LDAP application.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_APP_PASSWORD`

- Type: `str`
- Description: Sets the password for the LDAP application.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_SEARCH_BASE`

- Type: `str`
- Description: Sets the base to search for LDAP authentication.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_SEARCH_FILTER`

- Type: `str`
- Default: `None`
- Description: Sets a single filter to use for LDAP search. Alternative to `LDAP_SEARCH_FILTERS`.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_SEARCH_FILTERS`

- Type: `str`
- Description: Sets the filter to use for LDAP search.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_USE_TLS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables TLS for LDAP connection.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_CA_CERT_FILE`

- Type: `str`
- Description: Sets the path to the LDAP CA certificate file.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_VALIDATE_CERT`

- Type: `bool`
- Description: Sets whether to validate the LDAP CA certificate.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_CIPHERS`

- Type: `str`
- Default: `ALL`
- Description: Sets the ciphers to use for LDAP connection.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_LDAP_GROUP_MANAGEMENT`

- Type: `bool`
- Default: `False`
- Description: Enables the group management feature.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `ENABLE_LDAP_GROUP_CREATION`

- Type: `bool`
- Default: `False`
- Description: If a group from LDAP does not exist in Open WebUI, it will be created automatically.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `LDAP_ATTRIBUTE_FOR_GROUPS`

- Type: `str`
- Default: `memberOf`
- Description: Specifies the LDAP attribute that contains the user's group memberships. `memberOf` is a standard attribute for this purpose in Active Directory environments.
- Persistence: This environment variable is a `PersistentConfig` variable.

## User Permissions

### Chat Permissions

#### `USER_PERMISSIONS_CHAT_CONTROLS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to access chat controls.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_FILE_UPLOAD`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to upload files to chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_DELETE`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to delete chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_EDIT`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to edit chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_STT`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to use Speech-to-Text in chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_TTS`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to use Text-to-Speech in chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_CALL`

- Type: `str`
- Default: `True`
- Description: Enables or disables user permission to make calls in chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_MULTIPLE_MODELS`

- Type: `str`
- Default: `True`
- Description: Enables or disables user permission to use multiple models in chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_TEMPORARY`

- Type: `bool`
- Default: `True`
- Description: Enables or disables user permission to create temporary chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED`

- Type: `str`
- Default: `False`
- Description: Enables or disables enforced temporary chats for users.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_CHAT_SYSTEM_PROMPT`

- Type: `str`
- Default: `True`
- Description: Allows or disallows users to set a custom system prompt for all of their chats.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Feature Permissions

#### `USER_PERMISSIONS_FEATURES_DIRECT_TOOL_SERVERS`

- Type: `str`
- Default: `False`
- Description: Enables or disables user permission to access direct tool servers.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_FEATURES_WEB_SEARCH`

- Type: `str`
- Default: `True`
- Description: Enables or disables user permission to use the web search feature.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_FEATURES_IMAGE_GENERATION`

- Type: `str`
- Default: `True`
- Description: Enables or disables user permission to use the image generation feature.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_FEATURES_CODE_INTERPRETER`

- Type: `str`
- Default: `True`
- Description: Enables or disables user permission to use code interpreter feature.
- Persistence: This environment variable is a `PersistentConfig` variable.

### Workspace Permissions

#### `USER_PERMISSIONS_WORKSPACE_MODELS_ACCESS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables user permission to access workspace models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables user permission to access workspace knowledge.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables user permission to access workspace prompts.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_TOOLS_ACCESS`

- Type: `bool`
- Default: `False`
- Description: Enables or disables user permission to access workspace tools.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_MODELS_ALLOW_PUBLIC_SHARING`

- Type: `str`
- Default: `False`
- Description: Enables or disables public sharing of workspace models.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ALLOW_PUBLIC_SHARING`

- Type: `str`
- Default: `False`
- Description: Enables or disables public sharing of workspace knowledge.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_PROMPTS_ALLOW_PUBLIC_SHARING`

- Type: `str`
- Default: `False`
- Description: Enables or disables public sharing of workspace prompts.
- Persistence: This environment variable is a `PersistentConfig` variable.

#### `USER_PERMISSIONS_WORKSPACE_TOOLS_ALLOW_PUBLIC_SHARING`

- Type: `str`
- Default: `False`
- Description: Enables or disables public sharing of workspace tools.
- Persistence: This environment variable is a `PersistentConfig` variable.

## Misc Environment Variables

These variables are not specific to Open WebUI but can still be valuable in certain contexts.

### Cloud Storage

#### `STORAGE_PROVIDER`

- Type: `str`
- Options:
  - `s3` - uses the S3 client library and related environment variables mentioned in [Amazon S3 Storage](#amazon-s3-storage)
  - `gcs` - uses the GCS client library and related environment variables mentioned in [Google Cloud Storage](#google-cloud-storage)
  - `azure` - uses the Azure client library and related environment variables mentioned in [Microsoft Azure Storage](#microsoft-azure-storage)
- Default: empty string (' '), which defaults to `local`
- Description: Sets the storage provider.

#### Amazon S3 Storage

#### `S3_ACCESS_KEY_ID`

- Type: `str`
- Description: Sets the access key ID for S3 storage.

#### `S3_ADDRESSING_STYLE`

- Type: `str`
- Default: `None`
- Description: Specifies the addressing style to use for S3 storage (e.g., 'path', 'virtual').

#### `S3_BUCKET_NAME`

- Type: `str`
- Description: Sets the bucket name for S3 storage.

#### `S3_ENDPOINT_URL`

- Type: `str`
- Description: Sets the endpoint URL for S3 storage.

#### `S3_KEY_PREFIX`

- Type: `str`
- Description: Sets the key prefix for a S3 object.

#### `S3_REGION_NAME`

- Type: `str`
- Description: Sets the region name for S3 storage.

#### `S3_SECRET_ACCESS_KEY`

- Type: `str`
- Description: Sets the secret access key for S3 storage.

#### `S3_USE_ACCELERATE_ENDPOINT`

- Type: `str`
- Default: `False`
- Description: Specifies whether to use the accelerated endpoint for S3 storage.

#### `S3_ENABLE_TAGGING`

- Type: `str`
- Default: `False`
- Description: Enables S3 object tagging after uploads for better organization, searching, and integration with file management policies. Always set to `False` when using Cloudflare R2, as R2 does not support object tagging.

#### Google Cloud Storage

#### `GOOGLE_APPLICATION_CREDENTIALS_JSON`

- Type: `str`
- Description: Contents of Google Application Credentials JSON file.
  - Optional - if not provided, credentials will be taken from the environment. User credentials if run locally and Google Metadata server if run on a Google Compute Engine.
  - A file can be generated for a service account following this [guide.](https://developers.google.com/workspace/guides/create-credentials#service-account)

#### `GCS_BUCKET_NAME`

- Type: `str`
- Description: Sets the bucket name for Google Cloud Storage. Bucket must already exist.

#### Microsoft Azure Storage

#### `AZURE_STORAGE_ENDPOINT`

- Type: `str`
- Description: Sets the endpoint URL for Azure Storage.

#### `AZURE_STORAGE_CONTAINER_NAME`

- Type: `str`
- Description: Sets the container name for Azure Storage.

#### `AZURE_STORAGE_KEY`

- Type: `str`
- Description: Set the access key for Azure Storage.
  - Optional - if not provided, credentials will be taken from the environment. User credentials if run locally and Managed Identity if run in Azure services.

### Database Pool

#### `DATABASE_URL`

- Type: `str`
- Default: `sqlite:///${DATA_DIR}/webui.db`
- Description: Specifies the database URL to connect to.

:::info

Supports SQLite and Postgres. Changing the URL does not migrate data between databases.
Documentation on the URL scheme is available available [here](https://docs.sqlalchemy.org/en/20/core/engines.html#database-urls).

If your database password contains special characters, please ensure they are properly URL-encoded. For example, a password like `p@ssword` should be encoded as `p%40ssword`.

:::

#### `DATABASE_SCHEMA`

- Type: `str`
- Default: `None`
- Description: Specifies the database schema to connect to.

#### `DATABASE_POOL_SIZE`

- Type: `int`
- Default: `None`
- Description: Specifies the pooling strategy and size of the database pool. By default SQLAlchemy will automatically chose the proper pooling strategy for the selected database connection. A value of `0` disables pooling. A value larger `0` will set the pooling strategy to `QueuePool` and the pool size accordingly.

#### `DATABASE_POOL_MAX_OVERFLOW`

- Type: `int`
- Default: `0`
- Description: Specifies the database pool max overflow.

:::info

More information about this setting can be found [here](https://docs.sqlalchemy.org/en/20/core/pooling.html#sqlalchemy.pool.QueuePool.params.max_overflow).

:::

#### `DATABASE_POOL_TIMEOUT`

- Type: `int`
- Default: `30`
- Description: Specifies the database pool timeout in seconds to get a connection.

:::info

More information about this setting can be found [here](https://docs.sqlalchemy.org/en/20/core/pooling.html#sqlalchemy.pool.QueuePool.params.timeout).

:::

#### `DATABASE_POOL_RECYCLE`

- Type: `int`
- Default: `3600`
- Description: Specifies the database pool recycle time in seconds.

:::info

More information about this setting can be found [here](https://docs.sqlalchemy.org/en/20/core/pooling.html#setting-pool-recycle).

:::

### Redis

#### `REDIS_URL`

- Type: `str`
- Example: `redis://localhost:6379/0`
- Example with TLS: `rediss://localhost:6379/0`
- Description: Specifies the URL of the Redis instance for the app state.

:::info

When deploying Open WebUI in a multi-node/worker cluster with a load balancer, you must ensure that the REDIS_URL value is set. Without it, session, persistency and consistency issues in the app state will occur as the workers would be unable to communicate.

:::

#### `REDIS_SENTINEL_HOSTS`

- Type: `str`
- Description: Comma-separated list of Redis Sentinels for app state. If specified, the "hostname" in `REDIS_URL` will be interpreted as the Sentinel service name.

#### `REDIS_SENTINEL_PORT`

- Type: `int`
- Default: `26379`
- Description: Sentinel port for app state Redis.

#### `REDIS_KEY_PREFIX`

- Type: `str`
- Default: `open-webui`
- Description: Customizes the Redis key prefix used for storing configuration values. This allows multiple Open WebUI instances to share the same Redis instance without key conflicts. When operating in Redis cluster mode, the prefix is formatted as `{prefix}:` (e.g., `{open-webui}:config:*`) to enable multi-key operations on configuration keys within the same hash slot.

#### `ENABLE_WEBSOCKET_SUPPORT`

- Type: `bool`
- Default: `True`
- Description: Enables websocket support in Open WebUI.

:::info

When deploying Open WebUI in a multi-node/worker cluster with a load balancer, you must ensure that the ENABLE_WEBSOCKET_SUPPORT value is set. Without it, websocket consistency and persistency issues will occur.

:::

#### `WEBSOCKET_MANAGER`

- Type: `str`
- Default: `redis`
- Description: Specifies the websocket manager to use (in this case, Redis).

:::info

When deploying Open WebUI in a multi-node/worker cluster with a load balancer, you must ensure that the WEBSOCKET_MANAGER value is set and a key-value NoSQL database like Redis is used. Without it, websocket consistency and persistency issues will occur.

:::

#### `WEBSOCKET_REDIS_URL`

- Type: `str`
- Default: `${REDIS_URL}`
- Description: Specifies the URL of the Redis instance for websocket communication. It is distinct from `REDIS_URL` and in practice, it is recommended to set both.

:::info

When deploying Open WebUI in a multi-node/worker cluster with a load balancer, you must ensure that the WEBSOCKET_REDIS_URL value is set and a key-value NoSQL database like Redis is used. Without it, websocket consistency and persistency issues will occur.

:::

#### `WEBSOCKET_SENTINEL_HOSTS`

- Type: `str`
- Description: Comma-separated list of Redis Sentinels for websocket. If specified, the "hostname" in `WEBSOCKET_REDIS_URL` will be interpreted as the Sentinel service name.

#### `WEBSOCKET_SENTINEL_PORT`

- Type: `int`
- Default: `26379`
- Description: Sentinel port for websocket Redis.

### Uvicorn Settings

#### `UVICORN_WORKERS`

- Type: `int`
- Default: `1`
- Description: Controls the number of worker processes that Uvicorn spawns to handle requests. Each worker runs its own instance of the application in a separate process.

:::info

When deploying in orchestrated environments like Kubernetes or using Helm charts, it's recommended to keep UVICORN_WORKERS set to 1. Container orchestration platforms already provide their own scaling mechanisms through pod replication, and using multiple workers inside containers can lead to resource allocation issues and complicate horizontal scaling strategies.

If you use UVICORN_WORKERS, you also need to ensure that related environment variables for scalable multi-instance setups are set accordingly.

:::

### Proxy Settings

Open WebUI supports using proxies for HTTP and HTTPS retrievals. To specify proxy settings,
Open WebUI uses the following environment variables:

#### `http_proxy`

- Type: `str`
- Description: Sets the URL for the HTTP proxy.

#### `https_proxy`

- Type: `str`
- Description: Sets the URL for the HTTPS proxy.

#### `no_proxy`

- Type: `str`
- Description: Lists domain extensions (or IP addresses) for which the proxy should not be used,
separated by commas. For example, setting no_proxy to '.mit.edu' ensures that the proxy is
bypassed when accessing documents from MIT.

### Install Required Python Packages

Open WebUI provides environment variables to customize the pip installation process. Below are the environment variables used by Open WebUI for adjusting package installation behavior:

#### `PIP_OPTIONS`

- Type: `str`
- Description: Specifies additional command-line options that pip should use when installing packages. For example, you can include flags such as `--upgrade`, `--user`, or `--no-cache-dir` to control the installation process.

#### `PIP_PACKAGE_INDEX_OPTIONS`

- Type: `str`
- Description: Defines custom package index behavior for pip. This can include specifying additional or alternate index URLs (e.g., `--extra-index-url`), authentication credentials, or other parameters to manage how packages are retrieved from different locations.
