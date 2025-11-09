---
sidebar_position: 6
title: "Jina"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# Jina Web Search Integration

This guide provides instructions on how to integrate [Jina AI](https://jina.ai/), a powerful AI-driven search foundation, with Open WebUI. The integration uses Jina's `DeepSearch` API to provide web search capabilities.

## Overview

Jina AI's `DeepSearch` is more than a simple search API; it's an autonomous agent that combines web searching, reading, and reasoning to conduct comprehensive investigations. Unlike standard LLMs that rely on pre-trained knowledge or RAG systems that perform a single-pass search, DeepSearch iteratively searches, reads, and reasons, dynamically deciding its next steps based on its findings. It can perform deep dives into topics through multiple search and reasoning cycles and self-evaluates the quality of its answers before returning a result.

:::tip OpenAI API Compatibility
The Jina DeepSearch API is fully compatible with the OpenAI Chat API schema. This means you can use it with any OpenAI-compatible client by simply swapping the API endpoint to `https://deepsearch.jina.ai/v1/chat/completions` and using `jina-deepsearch-v1` as the model name.
:::

## Pricing and API Key

Jina's `DeepSearch` API requires an API key for use with Open WebUI. Jina offers a free tier for new users, which includes **10 million tokens** to use with any of their models. You can obtain your free API key by creating an account on the Jina AI platform.

- **API Key:** A Jina API key is required. You can get a key by logging into the [Jina API Dashboard](https://jina.ai/api-dashboard).

## Configuration Steps

### 1. Obtain a Jina API Key

Follow these steps to get an API key:

1. **Visit the Jina API Dashboard:** Go to [jina.ai/api-dashboard](https://jina.ai/api-dashboard).
2. **Log In or Sign Up:** Create a new account or log in to your existing one.
3. **Get Your API Key:** Once logged in, your unique API key will be displayed on the dashboard. Copy this key.

### 2. Configure Open WebUI

To enable the Jina web search integration, follow these steps in the Open WebUI admin settings:

1. **Log in as an Administrator:** Access your Open WebUI instance and log in with an administrator account.
2. **Navigate to Web Search Settings:** Go to the **Admin Panel**, then click on **Settings** > **Web Search**.
3. **Select Jina as the Search Engine:** In the "Web Search Engine" dropdown menu, select **Jina**.
4. **Enter Your API Key:** Paste your Jina API key into the **Jina API Key** input field.
5. **Save Changes:** Scroll down and click the **Save** button to apply the changes.

### 3. Environment Variable Configuration

For Docker-based deployments, you can configure the Jina integration using an environment variable.

Set the following environment variable for your Open WebUI instance:

- `JINA_API_KEY`: Your Jina API key.

**Example Docker `run` command:**

```bash
docker run -d \\
  -p 3000:8080 \\
  -e JINA_API_KEY="your-jina-api-key-here" \\
  --name open-webui \\
  ghcr.io/open-webui/open-webui:main
```

## Advanced Configuration (Jina API)

While Open WebUI provides a straightforward integration, the Jina DeepSearch API itself offers a rich set of parameters for fine-tuning its behavior. These parameters are part of the Jina API and are not directly exposed in the Open WebUI settings, but they are useful to understand for advanced use cases.

### Quality Control

You can control the trade-off between the quality of the results and token consumption using the following parameters:

- **`reasoning_effort`**: A preset that adjusts `budget_tokens` and `max_attempts`. Options are `low`, `medium`, and `high`. This is the simplest way to control quality.
- **`budget_tokens`**: Sets the maximum number of tokens allowed for the entire DeepSearch process. Larger budgets can lead to better response quality.
- **`max_attempts`**: The number of times the system will retry to solve a problem.
- **`team_size`**: The number of agents that will work on the problem in parallel, allowing for broader research.

### Source Control

You can control where DeepSearch gets its information from:

- **`no_direct_answer`**: Forces the system to always search the web, even for simple questions.
- **`boost_hostnames`**: A list of domains that are given a higher priority.
- **`bad_hostnames`**: A list of domains to be strictly excluded.
- **`only_hostnames`**: A list of domains to be exclusively included.

For more details on these parameters, refer to the [official Jina DeepSearch documentation](https://jina.ai/deepsearch/).

## Verify the Integration

After configuring the settings, you can test the integration. Enable the web search feature in a chat and ask a question. Open WebUI will now use Jina's `DeepSearch` to retrieve and process web content to answer your query.
