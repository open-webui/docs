---
title: "TrueFoundry AI Gateway"
sidebar_position: 1
---

# TrueFoundry AI Gateway Integration with Open WebUI

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/tutorials/contributing-tutorial).

:::

[TrueFoundry AI Gateway](https://www.truefoundry.com/ai-gateway) is the proxy layer that sits between your applications and the LLM providers and MCP Servers. It is an enterprise-grade platform that enables users to access 1000+ LLMs using a unified interface while taking care of observability and governance.

By integrating Open WebUI with TrueFoundry AI Gateway, you can route all LLM requests from your chat interface through a single, governed endpoint — without changing how your users interact with Open WebUI.

- **Unified model access**: Call models from OpenAI, Anthropic, Google, and more through one OpenAI-compatible API
- **Enterprise governance**: Enforce access controls, rate limits, and routing policies across your organization
- **Built-in observability**: Monitor usage, latency, and costs for every request made through Open WebUI
- **Production-ready routing**: Load balancing, failover, and cost management handled by the gateway

## Prerequisites

Before integrating Open WebUI with TrueFoundry, ensure you have:

1. **TrueFoundry Account**: Create a [TrueFoundry account](https://www.truefoundry.com/register) and follow the [Gateway Quick Start Guide](https://www.truefoundry.com/docs/ai-gateway/quick-start)
2. **Open WebUI Instance**: Deploy Open WebUI by following the [official documentation](https://docs.openwebui.com/getting-started/) for local or cloud deployment

This guide assumes you have an active Open WebUI instance and have obtained your TrueFoundry AI Gateway base URL, API key, and model IDs from the TrueFoundry Playground.

## Step 1: Configure Open WebUI to Use TrueFoundry Gateway

1. Open the Open WebUI settings page.

2. Navigate to the **Admin Panel** from the top-right icon.

   ![Navigate to the Open WebUI Admin Panel](https://mintcdn.com/truefoundry/n3EuZuJ0K8wBFp1G/images/open-webui-1.jpeg?fit=max&auto=format&n=n3EuZuJ0K8wBFp1G&q=85&s=71360b3de21d86f66a0b469c3c959114)

3. Add a new connection from **Settings → Connections → Manage OpenAI API Connections** (+).

   ![Open WebUI Admin Panel showing the Connections section](https://mintcdn.com/truefoundry/n3EuZuJ0K8wBFp1G/images/open-webui-2.jpeg?fit=max&auto=format&n=n3EuZuJ0K8wBFp1G&q=85&s=a2faad0b115d40cf2b73a079cbe7eb4e)

4. Add the following details:

   - **API Base URL**: Your TrueFoundry Gateway base URL (e.g. `https://gateway.truefoundry.ai` for SaaS, or your self-hosted endpoint)
   - **API Key**: Your TrueFoundry Personal Access Token (PAT) or Virtual Account Token (VAT)
   - **Model ID**: Add the model IDs from the unified code snippet in the TrueFoundry Playground (press the **+** button on the right to add each model)

   You can find the base URL, API key, and model name in the **Code Snippets** tab of the TrueFoundry Playground:

   ![TrueFoundry playground showing unified code snippet with base URL and model name](https://mintcdn.com/truefoundry/n3EuZuJ0K8wBFp1G/images/new-code-snippet.png?fit=max&auto=format&n=n3EuZuJ0K8wBFp1G&q=85&s=3634c2dc8c3565fd77ab896d3fd07ed9)

   ![Open WebUI connection form with TrueFoundry configuration settings](https://mintcdn.com/truefoundry/n3EuZuJ0K8wBFp1G/images/open-webui-3.jpeg?fit=max&auto=format&n=n3EuZuJ0K8wBFp1G&q=85&s=63b84cb3a781447f7e6e8d349aea6cb2)

5. Click **Save**.

:::tip

If connection verification fails, you can still proceed — add your model IDs manually to the **Model IDs (Filter)** allowlist. TrueFoundry uses the standard OpenAI Chat Completions protocol, so chat will work even if auto-detection does not.

:::

## Step 2: Test the Integration

1. Open a new chat in Open WebUI.
2. Select a TrueFoundry-routed model from the dropdown in the top-left corner.
3. Send a prompt to verify that requests are routed through TrueFoundry's Gateway.

Your Open WebUI instance is now integrated with TrueFoundry AI Gateway and ready for secure, governed LLM usage.

## Learn more

- [TrueFoundry Open WebUI integration guide](https://www.truefoundry.com/docs/ai-gateway/open-webui)
- [TrueFoundry AI Gateway](https://www.truefoundry.com/ai-gateway)
- [Gateway Quick Start](https://www.truefoundry.com/docs/ai-gateway/quick-start)
- [Integrate Gateway to your Apps](https://www.truefoundry.com/docs/ai-gateway/integrate-gateway-to-your-apps)
