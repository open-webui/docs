---
sidebar_position: 2
title: "Pipes"
---

# Pipes
Pipes are functions that can be used to perform actions prior to returning LLM messages to the user. Examples of potential actions you can take with Pipes are Retrieval Augmented Generation (RAG), sending requests to non-OpenAI LLM providers (such as Anthropic, Azure OpenAI, or Google), or executing functions right in your web UI. Pipes can be hosted as a Function or on a Pipelines server. A list of examples is maintained in the [Pipelines repo](https://github.com/open-webui/pipelines/tree/main/examples/pipelines). The general workflow can be seen in the image below.

<p align="center">
  <a href="#">
    <img src="/img/pipelines/pipes.png" alt="Pipe Workflow" />
  </a>
</p>

Pipes that are defined in your WebUI show up as a new model with an "External" designation attached to them. An example of two Pipe models, `Database RAG Pipeline` and `DOOM`, can be seen below next to two self-hosted models:

<p align="center">
  <a href="#">
    <img src="/img/pipelines/pipe-model-example.png" alt="Pipe Models in WebUI" />
  </a>
</p>
