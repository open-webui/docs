---
sidebar_position: 1
title: "Filters"
---

## Filters

Filters are used to perform actions against incoming user messages and outgoing assistant (LLM) messages. Potential actions that can be taken in a filter include sending messages to monitoring platforms (such as Langfuse or DataDog), modifying message contents, blocking toxic messages, translating messages to another language, or rate limiting messages from certain users. A list of examples is maintained in the [Pipelines repo](https://github.com/open-webui/pipelines/tree/main/examples/filters). Filters can be executed as a Function or on a Pipelines server. The general workflow can be seen in the image below.

<div align="center">
  <a href="#">
    ![Filter Workflow](/images/pipelines/filters.png)
  </a>
</div>

When a filter pipeline is enabled on a model or pipe, the incoming message from the user (or "inlet") is passed to the filter for processing. The filter performs the desired action against the message before requesting the chat completion from the LLM model. Finally, the filter performs post-processing on the outgoing LLM message (or "outlet") before it is sent to the user.
