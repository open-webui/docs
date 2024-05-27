---
sidebar_position: 6
title: "Monitoring with Langfuse"
---

# Monitoring with Langfuse

Integrating [Langfuse](https://cloud.langfuse.com) with LiteLLM allows for detailed observation and recording of API calls.
This guide walks you through setting up Langfuse callbacks with LiteLLM.

The local deployment of Langfuse is an option available through their open-source alternative. However, for the convenience of this tutorial, we will utilize the free limited version of their Cloud service. If data privacy is a concern for you, it is recommended to install the local version instead.

## Getting Started with Langfuse

Begin by setting up your Langfuse account and acquiring necessary keys:

1. Create an account at [Langfuse](https://cloud.langfuse.com/auth/sign-up).
2. Generate and copy your public and private keys.

## Configuring OpenWebUI LiteLLM Proxy for Langfuse

To integrate Langfuse with LiteLLM, you'll need to modify the LiteLLM `config.yaml` file and set environment variables for your Docker container.

### Editing the LiteLLM Configuration File

Edit the LiteLLM `config.yaml` file, located in your host Docker mount point at `/data/litellm/config.yaml`.
Add the following under the general settings as shown in the [LiteLLM official documentation](https://litellm.vercel.app/docs/observability/langfuse_integration):

```yaml
general_settings: {}
litellm_settings:
  success_callback: ["langfuse"]
  failure_callback: ["langfuse"]
```

### Setting Environment Variables in Docker

When launching the Docker container, pass the Langfuse API keys as environment variables:

```bash
LANGFUSE_PUBLIC_KEY: Replace "xxxxx" with your actual public key.
LANGFUSE_SECRET_KEY: Replace "xxxxx" with your actual secret key.
These variables can be set directly in the docker run command or through a Docker Compose YAML file.
```

## Testing the Integration

Once setup is complete, your Langfuse dashboard should start recording every API call made through the LiteLLM integration. This allows for efficient monitoring and troubleshooting of API interactions.

![Langfuse Dashboard](/img/tutorial_langfuse.png)

## Note

Ensure that all configurations are correctly set, and environment variables are properly passed to avoid integration issues.
