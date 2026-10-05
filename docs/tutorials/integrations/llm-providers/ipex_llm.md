---
sidebar_position: 30
title: "Intel GPU (IPEX-LLM)"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

:::note

This guide is verified with Open WebUI setup through [Manual Installation](/getting-started/).

:::

## Local LLM Setup with IPEX-LLM on Intel GPU

:::info

[**IPEX-LLM**](https://github.com/intel-analytics/ipex-llm) is a PyTorch library for running LLM on Intel CPU and GPU (e.g., local PC with iGPU, discrete GPU such as Arc A-Series, Flex and Max) with very low latency.

:::

This tutorial demonstrates how to setup Open WebUI with **IPEX-LLM accelerated Ollama backend hosted on Intel GPU**. By following this guide, you will be able to setup Open WebUI even on a low-cost PC (i.e. only with integrated GPU) with a smooth experience.

## Start Ollama Serve on Intel GPU

Refer to [this guide](https://ipex-llm.readthedocs.io/en/latest/doc/LLM/Quickstart/ollama_quickstart.html) from IPEX-LLM official documentation about how to install and run Ollama serve accelerated by IPEX-LLM on Intel GPU.

:::tip

If you would like to reach the Ollama service from another machine, make sure you set or export the environment variable `OLLAMA_HOST=0.0.0.0` before executing the command `ollama serve`.

:::

## Configure Open WebUI

Access the Ollama settings through **Admin Panel > Settings > Connections**. The **Ollama API** connection defaults to `http://localhost:11434` (`http://host.docker.internal:11434` in the standard Docker image; `http://localhost:11434` in the bundled `:ollama` image), as illustrated in the snapshot below. To verify the status of the Ollama service connection, click **Configure** (the gear) on the Ollama connection, then **Verify Connection** (the circular-arrows button next to the URL). If the WebUI is unable to establish a connection with the Ollama server, you will see a connection error toast.

![Open WebUI Ollama Setting Failure](https://llm-assets.readthedocs.io/en/latest/_images/open_webui_settings_0.png)

If the connection is successful, you will see a message stating `Server connection verified`, as illustrated below.

![Open WebUI Ollama Setting Success](https://llm-assets.readthedocs.io/en/latest/_images/open_webui_settings.png)

:::tip

If you want to use an Ollama server hosted at a different URL, click **Configure** (the gear) on the Ollama connection, change the **URL**, click **Verify Connection**, then save.

:::
