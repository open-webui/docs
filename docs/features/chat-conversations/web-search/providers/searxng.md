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

This guide sets up web search in Open WebUI with a self-hosted SearXNG container.

> "**SearXNG is a free internet metasearch engine which aggregates results from various search services and databases. Users are neither tracked nor profiled.**"

SearXNG deprecated the [`searxng-docker`](https://github.com/searxng/searxng-docker) repository in March 2026. Cloning it and editing `docker-compose.yaml` no longer works: the repository no longer contains that file, and its README points at the current install. The compose template lives in the SearXNG repository, and the container runs [Granian](https://docs.searxng.org/admin/installation-granian.html) instead of uWSGI. There is no `uwsgi.ini` to create, and the old `cap_drop` workaround for that file does not apply.

The steps below follow [SearXNG's compose installation](https://docs.searxng.org/admin/installation-docker.html#compose-instancing). If you already have a `searxng-docker` directory, [move that install](https://docs.searxng.org/admin/installation-docker.html#migrate-from-searxng-docker) onto the new template first, then enable JSON as described here.

## 1. Install SearXNG

**Step 1: Fetch the compose template**

```bash
mkdir -p ./searxng/core-config/
cd ./searxng/
curl -fsSL \
    -O https://raw.githubusercontent.com/searxng/searxng/master/container/docker-compose.yml \
    -O https://raw.githubusercontent.com/searxng/searxng/master/container/.env.example
cp -i .env.example .env
```

The template publishes port 8080 on the host and listens on 8080 inside the container. If 8080 is already in use, set another port in `.env`:

```bash
SEARXNG_PORT=8888
```

Use that same port in the Open WebUI query URL later. Leave `SEARXNG_HOST` unset unless you want to bind to a single address. The template also starts Valkey (`searxng-valkey`), which SearXNG uses only if you turn the limiter on.

**Step 2: Start SearXNG so it can write `settings.yml`**

```bash
docker compose up -d
```

On first start the image creates `core-config/settings.yml` from its template and replaces the placeholder `secret_key`. Do not create that file yourself before the first start, or the container will keep whatever secret you put there. Confirm the file exists, then continue:

```bash
docker compose ps
ls core-config/settings.yml
```

`docker compose ps` should show `searxng-core` as running. The generated file is short. It turns on `use_default_settings` and does not list search formats, so the `sed` edits from older copies of this guide (they look for a line `- html`) change nothing.

If your editor cannot save the file, the entrypoint created it as a different user. Edit it with `sudo`.

**Step 3: Enable the JSON format**

Open WebUI calls the [SearXNG search API](https://docs.searxng.org/dev/search_api.html) with `format=json`. SearXNG returns `403 Forbidden` for a format that is not listed, and the built-in list is only `html`.

Add a `search` block to `core-config/settings.yml`. Keep `use_default_settings: true` and the generated `server.secret_key`:

```yaml
search:
  formats:
    - html
    - json
```

Leave `server.limiter` unset. It defaults to off. The [limiter](https://docs.searxng.org/admin/searx.limiter.html) is for public instances and rejects the JSON requests Open WebUI sends, including when `SEARXNG_LIMITER=true`.

Restart so SearXNG reads the file:

```bash
docker compose restart core
```

**Step 4: Confirm JSON on the host**

Quote the URL. An unquoted `&` makes the shell run `format=json` as a separate command.

```bash
curl -fsS 'http://127.0.0.1:8080/search?q=test&format=json'
```

A JSON object means the format is enabled. An HTML page or `403` means `settings.yml` was not picked up. Check `docker compose logs core`.

## 2. Point Open WebUI at SearXNG

The official compose file does not put Open WebUI on its network. From another container, `localhost` is that container, not SearXNG.

When Open WebUI runs in Docker, publish SearXNG's port and call it through the host. Add the query URL to the Open WebUI service:

```yaml
services:
  open-webui:
    environment:
      ENABLE_WEB_SEARCH: True
      WEB_SEARCH_ENGINE: "searxng"
      WEB_SEARCH_RESULT_COUNT: 3
      WEB_SEARCH_CONCURRENT_REQUESTS: 10
      SEARXNG_QUERY_URL: "http://host.docker.internal:8080/search"
```

`host.docker.internal` is provided by Docker Desktop. On Linux Docker Engine, add it to the Open WebUI service:

```yaml
extra_hosts:
  - "host.docker.internal:host-gateway"
```

To use the container name instead, attach Open WebUI to the network created by the template. The template sets the Compose project name to `searxng`, so that network is `searxng_default` and the container name is `searxng-core` (not `searxng`):

```yaml
services:
  open-webui:
    environment:
      SEARXNG_QUERY_URL: "http://searxng-core:8080/search"
    networks:
      - searxng

networks:
  searxng:
    external: true
    name: searxng_default
```

## 3. Confirm Connectivity

From the Open WebUI container, the same quoted URL should return JSON:

```bash
docker exec open-webui curl -fsS 'http://host.docker.internal:8080/search?q=test&format=json'
```

Use `http://searxng-core:8080/search?q=test&format=json` instead when the container is on `searxng_default`.

## 4. GUI Configuration

1. Navigate to: `Settings` -> `Admin` -> `Web Search`
2. Toggle `Enable Web Search`
3. Set `Web Search Engine` from dropdown menu to `searxng`
4. Set `Searxng Query URL` to one of the following examples:

- `http://127.0.0.1:8080/search` when Open WebUI runs on the host
- `http://host.docker.internal:8080/search` when Open WebUI runs in Docker and SearXNG's port is published on the host
- `http://searxng-core:8080/search` when Open WebUI is attached to the `searxng_default` network
- `http://<searxng.local>/search` (using a local domain name, suitable for local network access)
- `https://<search.domain.com>/search` (using a custom domain name for a self-hosted SearXNG instance)

Replace `8080` with `SEARXNG_PORT` if you changed it.

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

To access Web Search, Click the Integrations button next to the + icon.

Here you can toggle Web Search On/Off.

![Web Search UI Toggle](/images/web_search_toggle.png)

By following these steps, you will have successfully set up SearXNG with Open WebUI, enabling you to perform web searches using the SearXNG engine.

#### Note

You will have to explicitly toggle this On/Off in a chat.

This is enabled on a per session basis eg. reloading the page, changing to another chat will toggle off.
