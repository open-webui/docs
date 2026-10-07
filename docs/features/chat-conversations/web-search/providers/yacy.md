---
sidebar_position: 18
title: "Yacy"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems like proxy configuration, connection timeouts, and empty content.

:::

## Yacy API

### Setup

1. Navigate to: `Settings` -> `Admin` -> `Tools` -> `Web Search`
2. Toggle `Enable Web Search`
3. Set `Web Search Engine` from dropdown menu to `yacy`
4. Set `Yacy Instance URL` to one of the following examples:

    - `http://yacy:8090` (using the container name and exposed port, suitable for Docker-based setups)
    - `http://host.docker.internal:8090` (using the `host.docker.internal` DNS name and the host port, suitable for Docker-based setups)
    - `https://<yacy.local>:8443` (using a local domain name, suitable for local network access)
    - `https://yacy.example.com` (using a custom domain name for a self-hosted Yacy instance, suitable for public or private access)
    - `https://yacy.example.com:8443` (using https over the default Yacy https port)

5. Enter a Yacy username, which the form requires before it saves. Add the password if your Yacy instance requires authentication. Open WebUI only sends the credentials when Yacy asks for them, so an instance without authentication works with any username and an empty password
6. Press save

![Open WebUI Admin panel showing Yacy config](/images/tutorial_yacy.png)
