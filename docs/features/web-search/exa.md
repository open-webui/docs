---
sidebar_position: 4
title: "Exa AI"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# Exa AI Web Search Integration

This guide provides instructions on how to integrate [Exa AI](https://exa.ai/), a modern AI-powered search engine, with Open WebUI for web search capabilities.

## Overview

Exa AI is a search engine designed for AI applications, providing a suite of tools through its API, including web search, website crawling, and deep research functionalities. By integrating Exa AI with Open WebUI, you can leverage its powerful search capabilities directly within your chat interface.

## Pricing Model

Exa AI operates on a credit-based, pay-as-you-go pricing model. It is not a permanently free service, but it offers a trial for new users to evaluate the API.

- **Initial Free Credits:** New users receive an initial grant of $10 worth of credits to test the API.
- **Pay-as-you-go:** Once the initial credits are depleted, you must move to a paid plan to continue using the service. The free tier is intended for evaluation purposes only and does not include a fixed monthly allowance.

For detailed and up-to-date pricing information, please visit the [Exa AI pricing page](https://exa.ai/pricing).

## Configuration Steps

### 1. Obtain an Exa AI API Key

First, you need to sign up for an Exa AI account and get an API key.

1.  **Sign Up:** Go to the [Exa AI website](https://exa.ai/) and create a new account.
2.  **Navigate to API Keys:** Once you have signed up and logged in, navigate to the **API Keys** page in your user dashboard.
3.  **Copy Your API Key:** On the API Keys page, you will find your unique API key. Copy this key to your clipboard, as you will need it to configure Open WebUI.

### 2. Configure Open WebUI

Next, you need to configure the Exa AI integration in the Open WebUI admin settings.

1.  **Log in as an Administrator:** Access your Open WebUI instance and log in with an administrator account.
2.  **Navigate to Web Search Settings:** Go to the **Admin Panel**, then click on **Settings** > **Web Search**.
3.  **Select Exa as the Search Engine:** In the "Web Search Engine" dropdown menu, select **Exa**.
4.  **Enter Your API Key:** In the **Exa API Key** input field that appears, paste the API key you copied from the Exa AI dashboard.
5.  **Save Changes:** Scroll down and click the **Save** button to apply the changes.

### 3. (Optional) Environment Variable Configuration

Alternatively, you can configure the Exa AI integration using an environment variable. This is particularly useful for Docker-based deployments.

Set the following environment variable for your Open WebUI instance:

- `EXA_API_KEY`: Your Exa AI API key.

When this environment variable is set, the "Exa API Key" field in the admin settings will be automatically populated.

**Example Docker `run` command:**

```bash
docker run -d \\
  -p 3000:8080 \\
  -e EXA_API_KEY="your-exa-api-key-here" \\
  --name open-webui \\
  ghcr.io/open-webui/open-webui:main
```

## Verify the Integration

Once you have configured the API key, you can test the integration by enabling the web search feature in a chat and asking a question that requires up-to-date information from the web. If the integration is successful, Open WebUI will use Exa AI to fetch search results and provide an informed response.
