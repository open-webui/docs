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

Set the **Ollama Base URL** under **Settings -> Connections** (it defaults to http://localhost:11434) and click the **Refresh** button to confirm the connection; a successful check shows `Service Connection Verified`.

