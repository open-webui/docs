---
sidebar_position: 12
title: "SearXNG"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

:::tip

For a comprehensive list of all environment variables related to Web Search (including concurrency settings, result counts, and more), please refer to the [Environment Configuration documentation](/reference/env-configuration#web-search).

:::

This guide provides instructions on how to set up web search capabilities in Open WebUI using SearXNG in Docker.

## SearXNG (Docker)

> "**SearXNG is a free internet metasearch engine which aggregates results from various search services and databases. Users are neither tracked nor profiled.**"

## 1. SearXNG Configuration

To configure SearXNG optimally for use with Open WebUI, follow these steps:

**Step 1: `git clone` SearXNG Docker and navigate to the folder:**

1. Clone the repository `searxng-docker`

 Clone the searxng-docker repository. This will create a new directory called `searxng-docker`, which will contain your SearXNG configuration files. Refer to the [SearXNG documentation](https://docs.searxng.org/) for configuration instructions.

```bash
git clone https://github.com/searxng/searxng-docker.git
```

Navigate to the `searxng-docker` repository, and run all commands from there:

```bash
cd searxng-docker
```

**Step 2: Locate and and modify the `.env` file:**

1. Uncomment `SEARXNG_HOSTNAME` from the `.env` file and set it accordingly:

```bash

# By default listen on https://localhost

# To change this:

# * uncomment SEARXNG_HOSTNAME, and replace <host> by the SearXNG hostname

# * uncomment LETSENCRYPT_EMAIL, and replace <email> by your email (require to create a Let's Encrypt certificate)

SEARXNG_HOSTNAME=localhost

# LETSENCRYPT_EMAIL=<email>

# Optional:

# If you run a very small or a very large instance, you might want to change the amount of used uwsgi workers and threads per worker

# More workers (= processes) means that more search requests can be handled at the same time, but it also causes more resource usage

# SEARXNG_UWSGI_WORKERS=4

# SEARXNG_UWSGI_THREADS=4
```

**Step 3: Modify the `docker-compose.yaml` file**

3. Remove the `localhost` restriction by modifying the `docker-compose.yaml` file:

If port 8080 is already in use, change `0.0.0.0:8080` to `0.0.0.0:[available port]` in the command before running it.

Run the appropriate command for your operating system:

- **Linux**
```bash
sed -i 's/127.0.0.1:8080/0.0.0.0:8080/' docker-compose.yaml
```

- **macOS**:
```bash
sed -i '' 's/127.0.0.1:8080/0.0.0.0:8080/' docker-compose.yaml
```

**Step 4: Grant Necessary Permissions**

4. Allow the container to create new config files by running the following command in the root directory:

```bash
sudo chmod a+rwx searxng
```

**Step 5: Create a Non-Restrictive `limiter.toml` File**

5. Create a non-restrictive `searxng-docker/searxng/limiter.toml` config file:

*If the file already exists, append the missing lines to it.*

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>searxng-docker/searxng/limiter.toml</summary>

```bash

# This configuration file updates the default configuration file

# See https://github.com/searxng/searxng/blob/master/searx/limiter.toml

[botdetection.ip_limit]

# activate link_token method in the ip_limit method
link_token = false

[botdetection.ip_lists]
block_ip = []
pass_ip = []
```

</details>

**Step 6: Remove the Default `settings.yml` File**

6. Delete the default `searxng-docker/searxng/settings.yml` file if it exists, as it will be regenerated on the first launch of SearXNG:

```bash
rm searxng/settings.yml
```

**Step 7: Create a Fresh `settings.yml` File**

7. Bring up the container momentarily to generate a fresh settings.yml file:

If you have multiple containers running with the same name, such as caddy, redis, or searxng, you need to rename them in the docker-compose.yaml file to avoid conflicts.

```bash
docker compose up -d ; sleep 10 ; docker compose down
```

After the initial run, add `cap_drop: - ALL` to the `docker-compose.yaml` file for security reasons.

If Open WebUI is running in the same Docker network as Searxng, you may remove the `0.0.0.0` and only specify the port mapping. In this case, Open WebUI can access Searxng directly using the container name.

**Step 8: Add Formats**

8. Add HTML and JSON formats to the `searxng-docker/searxng/settings.yml` file:

- **Linux**
```bash
sed -i 's/- html/- html\n    - json/' searxng/settings.yml
```

- **macOS**
```bash
sed -i '' 's/- html/- html\n    - json/' searxng/settings.yml
```

**Step 9: Run the Server**

9. Start the container with the following command:

```bash
docker compose up -d
```

The searXNG will be available at http://localhost:8080 (or the port number you set earlier).

## 2. Alternative Setup

### Docker Compose Setup

Add the following environment variables to your Open WebUI `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "searxng"
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 10
      SEARXNG_QUERY_URL: "http://searxng:8080/search"
```

SearXNG must list `json` under `formats` in its `settings.yml` (Step 8 above). Without it, SearXNG blocks queries from Open WebUI and the logs show `403 Client Error: Forbidden`.

## 3. Confirm Connectivity

Confirm connectivity to SearXNG from your Open WebUI container instance in your command line interface:

```bash
docker exec -it open-webui curl http://host.docker.internal:8080/search?q=this+is+a+test+query&format=json
```

## 4. GUI Configuration

1. Navigate to: `Settings` -> `Web Search` (admin section)
2. Toggle `Enable Web Search`
3. Set `Web Search Engine` from dropdown menu to `searxng`
4. Set `Searxng Query URL` to one of the following examples:

- `http://localhost:8080/search` (using the host and host port, suitable for Docker-based setups)
- `http://searxng:8080/search` (using the container name and exposed port, suitable for Docker-based setups)
- `http://host.docker.internal:8080/search` (using the `host.docker.internal` DNS name and the host port, suitable for Docker-based setups)
- `http://<searxng.local>/search` (using a local domain name, suitable for local network access)
- `https://<search.domain.com>/search` (using a custom domain name for a self-hosted SearXNG instance, suitable for public or private access)

Point the URL at the `/search` endpoint. Open WebUI adds the query parameters itself (`q`, `format=json`, `language` and the rest). The older `/search?q=<query>` form still works, since Open WebUI strips the query string when it sees `<query>`, but it is not required.

A **Searxng search language** field (`SEARXNG_LANGUAGE`, default `all`) is sent as SearXNG's `language` parameter.

5. Adjust the `Search Result Count` and `Concurrent Requests` values accordingly
6. Save changes

### Mutual TLS

If your SearXNG instance sits behind a proxy that requires a client certificate, point Open WebUI at one with these environment variables:

```bash
SEARXNG_CLIENT_CERT_FILE=/certs/searxng-client.pem
SEARXNG_CLIENT_KEY_FILE=/certs/searxng-client.key
```

Drop `SEARXNG_CLIENT_KEY_FILE` if the certificate file already contains the key. Mount the files into the container (`-v /path/to/certs:/certs:ro`) so the paths resolve inside it. Only SearXNG requests use this certificate; every other outbound connection keeps its normal TLS settings. The certificate is read once at first use, so replacing it on disk requires a restart.

![SearXNG GUI Configuration](/images/tutorial_searxng_config.png)

:::tip Troubleshooting

Having issues with web search? Check out the [Web Search Troubleshooting Guide](/troubleshooting/web-search) for solutions to common problems, including proxy configuration, connection timeouts, and empty content issues.

:::

## 5. Using Web Search in a Chat

To use Web Search, open the **+** menu and turn on **Web Search**.

![Web Search UI Toggle](/images/web_search_toggle.png)

By following these steps, you will have successfully set up SearXNG with Open WebUI, enabling you to perform web searches using the SearXNG engine.

#### Note

You will have to explicitly toggle this On/Off in a chat.

This is enabled on a per session basis eg. reloading the page, changing to another chat will toggle off.
