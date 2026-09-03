---
sidebar_position: 40
title: "ZeroSignal"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the [contributing tutorial](/contributing).

:::

## Overview

[ZeroSignal](https://zerosignal.ai) is a private, pay-per-use inference network. Its `zs-proxy` daemon runs on your machine and exposes the network as an OpenAI-compatible API, so Open WebUI can use it as a single **OpenAI API** connection. Every request is encrypted end to end and paid from your ZeroSignal wallet, and the models served on the network show up in the model selector next to any other connection you have.

There is no API key. The proxy ignores the `Authorization` header, so any non-empty value satisfies the connection form.

## Prerequisites

1. Create and fund an account at [zerosignal.ai](https://zerosignal.ai).
2. Install `zs-proxy` following the [proxy quick start](https://docs.zerosignal.ai/using-the-proxy/quick-start). On macOS:

   ```bash
   brew install txnlab/tap/zs-proxy
   ```

3. Import your account and start the proxy:

   ```bash
   zs-proxy wallet login
   zs-proxy proxy start
   ```

4. Confirm it is serving models:

   ```bash
   curl http://localhost:9376/v1/models
   ```

## Docker networking

Open WebUI usually runs in Docker, and a container cannot reach `localhost` on the host. Two things change:

- Point Open WebUI at `http://host.docker.internal:9376/v1` instead of `localhost`.
- Bind the proxy off loopback so the container can reach it:

  ```bash
  PROXY_SERVER_LISTEN=0.0.0.0:9376 zs-proxy proxy start
  ```

:::warning
Binding to `0.0.0.0` exposes the proxy to your whole network, and anyone who can reach it can spend from your wallet. Keep it behind a firewall, or bind to the Docker bridge address only.
:::

On Linux, also pass `--add-host=host.docker.internal:host-gateway` to `docker run` so the hostname resolves.

If you run Open WebUI natively (pip or `uv`), use plain `http://localhost:9376/v1` and skip this section.

## Add the connection

1. Click your avatar, then **Admin Panel** > **Settings** > **Connections**.
2. Under **OpenAI API**, click **+** to add a connection.
3. Fill in the form:

   | Setting | Value |
   |---|---|
   | **URL** | `http://host.docker.internal:9376/v1` (Docker) or `http://localhost:9376/v1` (native) |
   | **API Key** | Any non-empty value, for example `zerosignal` |
   | **Model IDs** | Leave empty to import the whole catalog |

4. Click **Save**. Open WebUI reads `/v1/models` and imports the live catalog.

The network serves many models. If you only want a few in the switcher, add their ids to the connection's **Model IDs (Filter)** allowlist. `curl http://localhost:9376/v1/models` lists the ids together with each model's context window and price.

## Start a chat

Open a new chat, pick a ZeroSignal model from the selector, and send a message. The first reply confirms the whole path (encrypt, pay, route) is working.

## Troubleshooting

| Symptom | Fix |
|---|---|
| Connection test fails or no models appear | The container cannot reach the proxy. Use `host.docker.internal` **and** bind the proxy to `0.0.0.0:9376`. On Linux add `--add-host=host.docker.internal:host-gateway`. |
| `curl http://localhost:9376/healthz` works on the host but Open WebUI still cannot connect | The proxy is bound to loopback only. Restart it with `PROXY_SERVER_LISTEN=0.0.0.0:9376`. |
| The model list is huge | Use the connection's **Model IDs (Filter)** allowlist. |
| `wallet_unfunded` or payment errors | Add funds with `zs-proxy fund`. See [Wallet and funding](https://docs.zerosignal.ai/using-the-proxy/wallet-and-funding). |

## Further reading

- [Connecting AI tools](https://docs.zerosignal.ai/using-the-proxy/connecting-tools) covers the proxy's full HTTP surface.
- [Proxy configuration](https://docs.zerosignal.ai/using-the-proxy/configuration) covers `server.listen`, spend caps, and the output ceiling.
- [Running as a service](https://docs.zerosignal.ai/using-the-proxy/running-as-a-service) keeps the proxy up alongside your Docker stack.
