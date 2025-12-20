---
sidebar_position: 14
title: "Tavily"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](https://docs.openwebui.com/contributing).

:::

## Overview

Integrating Tavily with Open WebUI allows your language model to perform real-time web searches, providing up-to-date and relevant information. This tutorial guides you through configuring Tavily as a web search provider in Open WebUI.

Tavily is a search API optimized for AI applications, delivering curated and structured results. By following these steps, you can enable Open WebUI to leverage Tavily for web searches within the chat interface.

## Prerequisites

Ensure you have:

- **Open WebUI Installed**: A running instance of Open WebUI (local or Docker). See the [Getting Started guide](https://docs.openwebui.com/getting-started).
- **Tavily Account**: An account with an API key from [Tavily](https://app.tavily.com/sign-in).
- **Admin Access**: Administrative access to your Open WebUI instance.
- **Internet Connection**: Required for Tavily API requests.
- **WEBUI_URL Environment Variable**: Configured to point to your Open WebUI instance. Refer to [Environment Variable Configuration](https://docs.openwebui.com/environment).

## Step-by-Step Configuration

### 1. Obtain a Tavily API Key

1. Log in or sign up at [Tavily](https://app.tavily.com/sign-in).
2. Go to the **Dashboard** or **API Keys** section.
3. Copy or generate a new API key. Keep it secure.

> **Note**: Check your Tavily plan’s query limits at [Tavily Pricing](https://tavily.com/#pricing).

### 2. Configure Open WebUI

1. Log in to Open WebUI with an admin account.
2. Click the **user icon** (bottom left) and select **Settings**.
3. Go to the **Web Search** tab.
4. Enable **Web Search** by toggling it **On**.
5. Select **tavily** from the **Web Search Engine** dropdown.
6. Paste your Tavily API key into the **Tavily API Key** field.
7. (Optional) Adjust settings like maximum search results, if available.

> **Tip**: Verify your API key is correct to avoid configuration errors.

### 3. Test the Integration

1. Save your settings.
2. Start a chat session in Open WebUI.
3. Click the **plus (+)** button in the prompt field to enable web search.
4. Enter a query (e.g., `+latest AI news`) and confirm Tavily returns real-time results.

> **Example**: `+latest AI news` triggers a Tavily search, embedding results in the response.

## Optional Configurations

- **Search Parameters**: Explore advanced options (e.g., domain filtering) in the [Tavily API Documentation](https://docs.tavily.com/docs/introduction).
- **Environment Variables**: Set the `TAVILY_API_KEY` in your `.env` file or Docker command:

  ```bash
  -e TAVILY_API_KEY="your_tavily_api_key"
  ```

  See [Environment Variable Configuration](https://docs.openwebui.com/environment).
- **RAG Integration**: Combine Tavily results with local data using Retrieval Augmented Generation. Refer to [RAG Documentation](https://docs.openwebui.com/features/rag).

## Troubleshooting

- **Invalid API Key**: Ensure the key is copied correctly, without extra spaces.
- **No Results**: Confirm the web search toggle (`+`) is enabled and your internet is active.
- **Quota Exceeded**: Check your Tavily plan at [Tavily Pricing](https://tavily.com/#pricing).
- **Settings Not Saved**: Verify admin privileges and that `webui.db` is writable.

For further help, visit the [Open WebUI Community](https://openwebui.com/community) or [Tavily Support](https://tavily.com/#contact).

## Additional Resources

- [Tavily API Documentation](https://docs.tavily.com/docs/introduction): API reference and advanced options.
- [Open WebUI Features](https://docs.openwebui.com/features): Details on RAG and web search.
- [Contributing to Open WebUI](https://docs.openwebui.com/contributing): Share improvements or report issues.

By completing this tutorial, you’ve enabled Tavily web search in Open WebUI, enhancing your AI with real-time data. Happy searching!
