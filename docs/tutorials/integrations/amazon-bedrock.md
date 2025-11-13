---
sidebar_position: 31
title: "Integrate with Amazon Bedrock"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

---

# Integrating Open-WebUI with Amazon Bedrock

In this tutorial, we'll explore one of the most common and popular approaches to integrate Open-WebUI with Amazon Bedrock.

## Prerequisites

In order to follow this tutorial, you must have the following:

- An active AWS account
- An active AWS Access Key and Secret Key
- IAM permissions in AWS to enable Bedrock models or already enabled models
- Docker installed on your system

## What is Amazon Bedrock

Direct from AWS' website:

"Amazon Bedrock is a fully managed service that offers a choice of high-performing foundation models (FMs) from leading AI companies like AI21 Labs, Anthropic, Cohere, Luma, Meta, Mistral AI, poolside (coming soon), Stability AI, and Amazon through a single API, along with a broad set of capabilities you need to build generative AI applications with security, privacy, and responsible AI. Using Amazon Bedrock, you can easily experiment with and evaluate top FMs for your use case, privately customize them with your data using techniques such as fine-tuning and Retrieval Augmented Generation (RAG), and build agents that execute tasks using your enterprise systems and data sources. Since Amazon Bedrock is serverless, you don't have to manage any infrastructure, and you can securely integrate and deploy generative AI capabilities into your applications using the AWS services you are already familiar with."

To learn more about Bedrock, visit: [Amazon Bedrock's Official Page](https://aws.amazon.com/bedrock/)

# Integration Steps

## Step 1: Verify access to Amazon Bedrock Base Models

Before we can integrate with Bedrock, you first have to verify that you have access to at least one, but preferably many, of the available Base Models. At the time of this writing (Feb 2025), there were 47 base models available. You can see in the screenshot below that I have access to multiple models. You'll know if you have access to a model if it says "✅ Access Granted" next to the model. If you don't have access to any models, you will get an error on the next step.

AWS provides good documentation for request accessing / enabling these models in the [Amazon Bedrock's Model Access Docs](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access-modify.html)

![Amazon Bedrock Base Models](/images/tutorials/amazon-bedrock/amazon-bedrock-base-models.png)

## Step 2: Configure the Bedrock Access Gateway

Now that we have access to at least one Bedrock base model, we need to configure the Bedrock Access Gateway, or BAG. You can think of the BAG as kind of proxy or middleware developed by AWS that wraps around AWS native endpoints/SDK for Bedrock and, in turn, exposes endpoints that are compatible with OpenAI's schema, which is what Open-WebUI requires.

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

![Bedrock Access Gateway Swagger](/images/tutorials/amazon-bedrock/amazon-bedrock-proxy-api.png)

## Step 3: Add Connection in Open-WebUI

Now that you the BAG up-and-running, it's time to add it as a new connection in Open-WebUI.

- Under the Admin Panel, go to Settings -> Connections.
- Use the "+" (plus) button to add a new connection under the OpenAI
- For the URL, use "http://host.docker.internal:8000/api/v1"
- For the password, the default password defined in BAG is "bedrock". You can always change this password in the BAG settings (see DEFAULT_API_KEYS)
- Click the "Verify Connection" button and you should see "Server connection verified" alert in the top-right

![Add New Connection](/images/tutorials/amazon-bedrock/amazon-bedrock-proxy-connection.png)

## Step 4: Start using Bedrock Base Models

You should now see all your Bedrock models available!

![Use Bedrock Models](/images/tutorials/amazon-bedrock/amazon-bedrock-models-in-oui.png)

## Other Helpful Tutorials

These are a few other very helpful tutorials when working to integrate Open-WebUI with Amazon Bedrock.

- https://gauravve.medium.com/connecting-open-webui-to-aws-bedrock-a1f0082c8cb2
- https://jrpospos.blog/posts/2024/08/using-amazon-bedrock-with-openwebui-when-working-with-sensitive-data/
