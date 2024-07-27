---
sidebar_position: 4
title: "Functions"
---

# Functions
Functions enable you to utilize filters (middleware) and pipe (model) functions directly within the WebUI. While largely compatible with Pipelines, these native functions can be executed easily within Open WebUI. Example use cases for filter functions include usage monitoring, real-time translation, moderation, and automemory. For pipe functions, the scope ranges from Cohere and Anthropic integration directly within Open WebUI, enabling "Valves" for per-user OpenAI API key usage, and much more. 

Many Functions are available to use on the [Community Website](https://openwebui.com/functions) and can easily be imported into your Open WebUI instance. 

<p align="center">
  <a href="#">
    <img src="/img/pipelines/community-functions.png" alt="Community Functions" />
  </a>
</p>

While many Pipes and Filters that run on a Pipelines server can be executed as Functions, the main limitation is that Functions are unable to install new Python dependencies that are not already packaged into Open WebUI. As a result, Pipelines are more extensible than Functions, while Functions have the added benefit of executing directly on the Open WebUI server without needing a separate Pipelines server for execution. 