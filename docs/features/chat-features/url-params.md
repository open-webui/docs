---
sidebar_position: 5
title: "URL Parameters"
---

In Open WebUI, chat sessions can be customized through various URL parameters. These parameters allow you to set specific configurations, enable features, and define model settings on a per-chat basis. This approach provides flexibility and control over individual chat sessions directly from the URL.

## URL Parameter Overview

The following table lists the available URL parameters, their function, and example usage.

| **Parameter**         | **Description**                                                                   | **Example**                      |
|-----------------------|-----------------------------------------------------------------------------------|----------------------------------|
| `models`              | Specifies the models to be used, as a comma-separated list. | `/?models=model1,model2`         |
| `model`               | Specifies a single model to be used for the chat session. | `/?model=model1`                 |
| `youtube`             | Specifies a YouTube video ID to be transcribed within the chat. | `/?youtube=VIDEO_ID`             |
| `load-url`            | Specifies a Website URL to be fetched and uploaded as a document within the chat. | `/?load-url=https://google.com`  |
| `web-search`          | Enables web search functionality if set to `true`. | `/?web-search=true`              |
| `tools` or `tool-ids` | Specifies a comma-separated list of tool IDs to activate in the chat. | `/?tools=tool1,tool2`            |
| `call`                | Enables a call overlay if set to `true`. | `/?call=true`                    |
| `q`                   | Sets an initial query or prompt for the chat. | `/?q=Hello%20there`              |
| `temporary-chat`      | Marks the chat as temporary if set to `true`, for one-time sessions. | `/?temporary-chat=true`          |
| `code-interpreter`    | Enables the code interpreter feature if set to `true`. | `/?code-interpreter=true`        |
| `image-generation`    | Enables the image generation feature if set to `true`. | `/?image-generation=true`        |

### 1. **Models and Model Selection**

- **Description**: The `models` and `model` parameters allow you to specify which [language models](/features/workspace/models.md) should be used for a particular chat session.
- **How to Set**: You can use either `models` for multiple models or `model` for a single model.
- **Example**:
  - `/?models=model1,model2` – This initializes the chat with `model1` and `model2`.
  - `/?model=model1` – This sets `model1` as the sole model for the chat.

### 2. **YouTube Transcription**

- **Description**: The `youtube` parameter takes a YouTube video ID, enabling the chat to transcribe the specified video.
- **How to Set**: Use the YouTube video ID as the value for this parameter.
- **Example**: `/?youtube=VIDEO_ID`
- **Behavior**: This triggers transcription functionality within the chat for the provided YouTube video.

### 3. **Website Insertion**

- **Description**: The `load-url` parameter downloads the specified website and extracts the content to upload it as a document into the chat.
- **How to Set**: Use the full website URL as the value for this parameter.
- **Example**: `/?load-url=https://google.com`
- **Behavior**: This triggers insertion of the specified website url.

### 4. **Web Search**

- **Description**: Enabling `web-search` allows the chat session to access [web search](/category/web-search/) functionality.
- **How to Set**: Set this parameter to `true` to enable web search.
- **Example**: `/?web-search=true`
- **Behavior**: If enabled, the chat can retrieve web search results as part of its responses.

### 5. **Tool Selection**

- **Description**: The `tools` or `tool-ids` parameters specify which [tools](/features/plugin/tools) to activate within the chat.
- **How to Set**: Provide a comma-separated list of tool IDs as the parameter’s value.
- **Example**: `/?tools=tool1,tool2` or `/?tool-ids=tool1,tool2`
- **Behavior**: Each tool ID is matched and activated within the session for user interaction.

### 6. **Call Overlay**

- **Description**: The `call` parameter enables a video or call overlay in the chat interface.
- **How to Set**: Set the parameter to `true` to enable the call overlay.
- **Example**: `/?call=true`
- **Behavior**: Activates a call interface overlay, allowing features such as live transcription and video input.

### 7. **Initial Query Prompt**

- **Description**: The `q` parameter allows setting an initial query or prompt for the chat.
- **How to Set**: Specify the query or prompt text as the parameter value.
- **Example**: `/?q=Hello%20there`
- **Behavior**: The chat starts with the specified prompt, automatically submitting it as the first message.

### 8. **Temporary Chat Sessions**

- **Description**: The `temporary-chat` parameter marks the chat as a temporary session. This may limit features such as saving chat history or applying persistent settings.
- **How to Set**: Set this parameter to `true` for a temporary chat session.
- **Example**: `/?temporary-chat=true`
- **Behavior**: This initiates a disposable chat session without saving history or applying advanced configurations.

### 9. **Code Interpreter**

- **Description**: The `code-interpreter` parameter enables the code interpreter feature.
- **How to Set**: Set this parameter to `true` to enable the code interpreter feature for this new chat session.
- **Example**: `/?code-interpreter=true`
- **Behavior**: Activates the code interpreter button to execute the code interpreter with the next prompt sent to the LLM.

### 10. **Image Generation**

- **Description**: The `image-generation` parameter enables the image generation for the provided prompt.
- **How to Set**: Set this parameter to `true` to enable image generation for the chat.
- **Example**: `/?image-generation=true`
- **Behavior**: Activates the image generation button to generate an image.

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>Example Use Case</summary>

:::tip

**Temporary Chat Session**
Suppose a user wants to initiate a quick chat session without saving the history. They can do so by setting `temporary-chat=true` in the URL. This provides a disposable chat environment ideal for one-time interactions.

:::
</details>

## Using Multiple Parameters Together

These URL parameters can be combined to create highly customized chat sessions. For example:

```bash
/?models=model1,model2&youtube=VIDEO_ID&web-search=true&tools=tool1,tool2&call=true&q=Hello%20there&temporary-chat=true
```

This URL will:

- Initialize the chat with `model1` and `model2`.
- Enable YouTube transcription, web search, and specified tools.
- Display a call overlay.
- Set an initial prompt of "Hello there."
- Mark the chat as temporary, avoiding any history saving.
