---
sidebar_position: 31
title: "Integrate with Amazon Bedrock"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

---

# Integrating Open WebUI with Amazon Bedrock

In this tutorial, we'll explore the most common and popular approaches to integrate Open WebUI with Amazon Bedrock.

## What is Amazon Bedrock

Direct from AWS' website:

"Amazon Bedrock is a fully managed service that offers a choice of high-performing foundation models (FMs) from leading AI companies like AI21 Labs, Anthropic, Cohere, Luma, Meta, Mistral AI, poolside (coming soon), Stability AI, and Amazon through a single API, along with a broad set of capabilities you need to build generative AI applications with security, privacy, and responsible AI. Using Amazon Bedrock, you can easily experiment with and evaluate top FMs for your use case, privately customize them with your data using techniques such as fine-tuning and Retrieval Augmented Generation (RAG), and build agents that execute tasks using your enterprise systems and data sources. Since Amazon Bedrock is serverless, you don't have to manage any infrastructure, and you can securely integrate and deploy generative AI capabilities into your applications using the AWS services you are already familiar with."

To learn more about Bedrock, visit the [Amazon Bedrock official page](https://aws.amazon.com/bedrock/).

# Integration Options

There are multiple OpenAI-compatible ways to connect Open WebUI to AWS Bedrock:

* **Bedrock Access Gateway** (BAG)
* **stdapi.ai**
* **LiteLLM** with its Bedrock provider (LiteLLM is not dedicated to AWS).
* **Bedrock Mantle** - AWS native solution, no installation required

## Feature Comparison

| Capability                   | Bedrock Access Gateway (BAG) | stdapi.ai | LiteLLM (Bedrock provider) | AWS Bedrock Mantle |
|------------------------------| --- | --- | --- | --- |
| Automatic models discovery   | ✅ | ✅ | — | ✅ |
| Chat completion              | ✅ | ✅ | ✅ | ✅ |
| Embeddings                   | ✅ | ✅ | ✅ | — |
| Text to speech               | — | ✅ | — | — |
| Speech to text               | — | ✅ | — | — |
| Image generation             | — | ✅ | ✅ | — |
| Image editing                | — | ✅ | — | — |
| Models from multiple regions | — | ✅ | ✅ | — |
| No installation required     | — | — | — | ✅ |
| License                      | MIT | AGPL or Commercial | MIT or Commercial | AWS Service |

# Integration Steps

## Solution 1: Bedrock Access Gateway (BAG)

### Prerequisites

In order to follow this tutorial, you must have the following:

- An active AWS account
- An active AWS Access Key and Secret Key
- IAM permissions in AWS to enable Bedrock models or already enabled models
- Docker installed on your system

### Step 1: Configure the Bedrock Access Gateway

We need to configure the Bedrock Access Gateway, or BAG. You can think of the BAG as kind of proxy or middleware developed by AWS that wraps around AWS native endpoints/SDK for Bedrock and, in turn, exposes endpoints that are compatible with OpenAI's schema, which is what Open-WebUI requires.

For reference, here is a simple mapping between the endpoints:

| OpenAI Endpoint       | Bedrock Method         |
|-----------------------|------------------------|
| `/models`               | list_inference_profiles    |
| `/models/{model_id}`    | list_inference_profiles    |
| `/chat/completions`     | converse or converse_stream    |
| `/embeddings`           | invoke_model           |

The BAG repo can be found in the [Bedrock Access Gateway Repo](https://github.com/aws-samples/bedrock-access-gateway)

To set-up the BAG, follow the below steps:

- Clone the BAG repo
- Remove the default `dockerfile`
- Change the name of the `Dockerfile_ecs` to `Dockerfile`

We're now ready to build and launch the docker container using:

```bash
docker build . -f Dockerfile -t bedrock-gateway

docker run -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN -e AWS_REGION=us-east-1 -d -p 8000:80 bedrock-gateway
```

You should now be able to access the BAG's swagger page at: http://localhost:8000/docs

:::warning Troubleshooting: Container Exits Immediately

If the Bedrock Gateway container starts and immediately exits (especially on Windows), check the logs with `docker logs <container_id>`. If you see Python/Uvicorn errors, this is likely a **Python 3.13 compatibility issue** with the BAG's Dockerfile.

**Workaround:** Edit the `Dockerfile` before building and change the Python version from 3.13 to 3.12:

```dockerfile
# Change this line:
FROM python:3.13-slim
# To:
FROM python:3.12-slim
```

Then rebuild with `docker build . -f Dockerfile -t bedrock-gateway`.

:::

![Bedrock Access Gateway Swagger](/images/tutorials/amazon-bedrock/amazon-bedrock-proxy-api.png)

### Step 2: Add Connection in Open WebUI

Now that you the BAG up-and-running, it's time to add it as a new connection in Open WebUI.

- Under the Admin Panel, go to Settings -> Connections.
- Use the "+" (plus) button to add a new connection under the OpenAI
- For the URL, use "http://host.docker.internal:8000/api/v1"
- For the password, the default password defined in BAG is "bedrock". You can always change this password in the BAG settings (see DEFAULT_API_KEYS)
- Click the "Verify Connection" button and you should see "Server connection verified" alert in the top-right

![Add New Connection](/images/tutorials/amazon-bedrock/amazon-bedrock-proxy-connection.png)

### Other Helpful Tutorials

These are a few other very helpful tutorials when working to integrate Open WebUI with Amazon Bedrock using the Bedrock Access Gateway.

- https://gauravve.medium.com/connecting-open-webui-to-aws-bedrock-a1f0082c8cb2
- https://jrpospos.blog/posts/2024/08/using-amazon-bedrock-with-openwebui-when-working-with-sensitive-data/

## Solution 2: stdapi.ai

[stdapi.ai](https://stdapi.ai/) is an OpenAI-compatible API gateway you deploy in your AWS account, or run locally using Docker.

Open WebUI connects to it as if it were OpenAI, and stdapi.ai routes requests to Bedrock and other AWS AI services such as Amazon Polly and Transcribe. It also supports multi-region access to Bedrock, making it easier to reach more models that may only be available in specific AWS regions.

### stdapi.ai Deployment

#### Deploying on AWS

stdapi.ai provides a full Terraform sample that provisions Open WebUI on ECS Fargate, connects it to stdapi.ai, and includes supporting services like Elasticache Valkey, Aurora PostgreSQL with vector extension, SearXNG, and Playwright.
This method handles both the stdapi.ai and Open WebUI configuration:

- [stdapi.ai Documentation - Open WebUI integration](https://stdapi.ai/use_cases_openwebui/)
- [stdapi-ai GitHub - Open WebUI Terraform sample](https://github.com/stdapi-ai/samples/tree/main/getting_started_openwebui)

stdapi.ai also provides documentation and Terraform samples to deploy it independently if you prefer to connect it to an existing Open WebUI instance.

- [stdapi.ai Documentation - Getting started](https://stdapi.ai/operations_getting_started/)
 
#### Deploying Locally

stdapi.ai also provides a Docker image for local usage.

Here is a minimal command to run it using your AWS access key:
```bash
docker run \
  -e AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
  -e AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
  -e AWS_SESSION_TOKEN=$AWS_SESSION_TOKEN \
  -e AWS_BEDROCK_REGIONS=us-east-1,us-west-2 \
  -e ENABLE_DOCS=true \
  --rm \
  -p 8000:8000 \
  ghcr.io/stdapi-ai/stdapi.ai-community:latest
```
The application is now available at http://localhost:8000 (use it as `YOUR_STDAPI_URL` in the Open WebUI configuration below).

The `AWS_BEDROCK_REGIONS` variable lets you select regions where you want to load models, in this case `us-east-1` and `us-west-2`.

If you pass the `ENABLE_DOCS=true` variable, an interactive Swagger documentation page is available at http://localhost:8000/docs.

`API_KEY=my_secret_password` can also be used to set a custom API key for the application (defaults to no API key required). This is highly recommended if the server is reachable from elsewhere. Use this API key as `YOUR_STDAPI_KEY` in the Open WebUI configuration below.

Many other configuration options are available; see [the documentation](https://stdapi.ai/operations_configuration/) for more information.

### Open WebUI Configuration

Open WebUI is configured via environment variables, and you can also set the same values from the Open WebUI admin panel.

Use the same stdapi.ai key for all `*_OPENAI_API_KEY` entries.

#### Core connection (chat + background tasks)

```bash
OPENAI_API_BASE_URL=YOUR_STDAPI_URL/v1
OPENAI_API_KEY=YOUR_STDAPI_KEY
TASK_MODEL_EXTERNAL=amazon.nova-micro-v1:0
```

Use a fast, low-cost chat model for `TASK_MODEL_EXTERNAL`.

#### RAG embeddings

```bash
RAG_EMBEDDING_ENGINE=openai
RAG_OPENAI_API_BASE_URL=YOUR_STDAPI_URL/v1
RAG_OPENAI_API_KEY=YOUR_STDAPI_KEY
RAG_EMBEDDING_MODEL=cohere.embed-v4:0
```

Pick any embedding model you prefer. 

#### Image generation

```bash
ENABLE_IMAGE_GENERATION=true
IMAGE_GENERATION_ENGINE=openai
IMAGES_OPENAI_API_BASE_URL=YOUR_STDAPI_URL/v1
IMAGES_OPENAI_API_KEY=YOUR_STDAPI_KEY
IMAGE_GENERATION_MODEL=stability.stable-image-core-v1:1
```

Choose any image generation model you prefer.

#### Image editing

```bash
ENABLE_IMAGE_EDIT=true
IMAGE_EDIT_ENGINE=openai
IMAGES_EDIT_OPENAI_API_BASE_URL=YOUR_STDAPI_URL/v1
IMAGES_EDIT_OPENAI_API_KEY=YOUR_STDAPI_KEY
IMAGE_EDIT_MODEL=stability.stable-image-control-structure-v1:0
```

Pick any image-editing model that supports edits without a mask. 

#### Speech to text (STT)

```bash
AUDIO_STT_ENGINE=openai
AUDIO_STT_OPENAI_API_BASE_URL=YOUR_STDAPI_URL/v1
AUDIO_STT_OPENAI_API_KEY=YOUR_STDAPI_KEY
AUDIO_STT_MODEL=amazon.transcribe
```

#### Text to speech (TTS)

```bash
AUDIO_TTS_ENGINE=openai
AUDIO_TTS_OPENAI_API_BASE_URL=YOUR_STDAPI_URL/v1
AUDIO_TTS_OPENAI_API_KEY=YOUR_STDAPI_KEY
AUDIO_TTS_MODEL=amazon.polly-neural
```

If you see inconsistent auto-detection for TTS languages, set a fixed language in stdapi.ai (for example, `DEFAULT_TTS_LANGUAGE=en-US`).

## Solution 3: AWS Bedrock Mantle

[Bedrock Mantle](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html) is an AWS-native solution that provides an OpenAI-compatible API endpoint for Amazon Bedrock without requiring any additional infrastructure or installation. This makes it the simplest integration option for accessing Bedrock models.

### Key Advantages

- **No installation required** - Uses AWS-managed endpoints directly
- **Simple configuration** - Just requires an API key
- **Native AWS integration** - Fully managed by AWS

### Limitations

- **Chat completion only** - Does not support embeddings, image generation, or other features
- **Subset of models** - Only provides access to a limited selection of Bedrock models (Open weight models)
- **Single region** - Does not support multi-region access

### Prerequisites

- An active AWS account
- An [Amazon Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) (create one from the AWS console)
- IAM permissions to use Bedrock models (recommended: `AmazonBedrockMantleInferenceAccess` IAM policy)

### Configuration

Configure Open WebUI using environment variables:

```bash
OPENAI_API_BASE_URL=https://bedrock.us-east-1.api.aws/v1
OPENAI_API_KEY=your_bedrock_api_key
```

Replace `your_bedrock_api_key` with the [Amazon Bedrock API key](https://docs.aws.amazon.com/bedrock/latest/userguide/api-keys.html) you created.

Replace `us-east-1` in the URL with your preferred AWS region (e.g., `us-west-2`, `eu-west-1`, etc.).

You can also set the same values from the Open WebUI admin panel.

For more information, see the [Bedrock Mantle documentation](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-mantle.html).

# Start using Bedrock Base Models

You should now see all your Bedrock models available!

![Use Bedrock Models](/images/tutorials/amazon-bedrock/amazon-bedrock-models-in-oui.png)
