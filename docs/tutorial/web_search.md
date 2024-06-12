---
sidebar_position: 0
title: "Web Search"
---

# Web Search

## SearXNG (Docker)

This guide outlines how to connect SearXNG to Open WebUI for web search capabilities.

### 1. Searxng Configuration

Create a folder named `searxng` in the same directory as your compose files. This folder will contain your Searxng configuration files. Refer to the [Searxng documentation](https://docs.searxng.org/) for configuration instructions.

#### Configuration Files:

<details>
<summary>searxng/settings.yml</summary>

```yaml
# see https://docs.searxng.org/admin/settings/settings.html#settings-use-default-settings
use_default_settings: true

server:
  secret_key: "f9e603d4191caab069b021fa0568391a33c8a837b470892c64461b5dd12464f4"
  limiter: false
  image_proxy: true
  port: 8080
  bind_address: "0.0.0.0"

ui:
  static_use_hash: true

search:
  safe_search: 0
  autocomplete: ""
  default_lang: ""
  formats:
    - html
    - json
```

</details>

<details>
<summary>searxng/limiter.toml</summary>

```toml
[botdetection.ip_limit]
# activate link_token method in the ip_limit method
link_token = true
```

</details>

<details>
<summary>searxng/uwsgi.ini</summary>

```ini
[uwsgi]
# Who will run the code
uid = searxng
gid = searxng

# Number of workers (usually CPU count)
# default value: %k (= number of CPU core, see Dockerfile)
workers = %k

# Number of threads per worker
# default value: 4 (see Dockerfile)
threads = 4

# The right granted on the created socket
chmod-socket = 666

# Plugin to use and interpreter config
single-interpreter = true
master = true
plugin = python3
lazy-apps = true
enable-threads = 4

# Module to import
module = searx.webapp

# Virtualenv and python path
pythonpath = /usr/local/searxng/
chdir = /usr/local/searxng/searx/

# automatically set processes name to something meaningful
auto-procname = true

# Disable request logging for privacy
disable-logging = true
log-5xx = true

# Set the max size of a request (request-body excluded)
buffer-size = 8192

# No keep alive
# See https://github.com/searx/searx-docker/issues/24
add-header = Connection: close

# uwsgi serves the static files
static-map = /static=/usr/local/searxng/searx/static
# expires set to one day
static-expires = /* 86400
static-gzip-all = True
offload-threads = 4
```

</details>

### 2. Docker Compose Setup

Add the following to a file named `docker-compose.searxng.yaml` alongside your existing `docker-compose.yaml`:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "searxng"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
      SEARXNG_QUERY_URL: "http://searxng:8080/search?q=<query>"

  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    ports:
      - "8080:8080"
    volumes:
      - ./searxng:/etc/searxng
    restart: always
```

Launch your updated stack with:

```bash
docker compose -f docker-compose.yaml -f docker-compose.searxng.yaml up -d
```

### 3. Alternative: Docker Run

You can run SearXNG directly using `docker run`:

```bash
docker run -d --name searxng -p 8080:8080 -v ./searxng:/etc/searxng --restart always searxng/searxng:latest
```

### 4. GUI configuration

Navigate to **Admin Settings > Web Search**:
![SearXNG GUI Configuration](/img/tutorial_searxng_config.png)

### 5. Using Web Search in a Chat

To access Web Search, Click on the + next to the message input field.

Here you can toggle Web Search On/Off.

![Web Search UI Toggle](/img/web_search_toggle.png)

#### Note

You will have to expicitly toggle this On/Off in a chat.

This is enabled on a per session basis eg. reloading the page, changing to another chat will toggle off.

## Google PSE API

## Serper API

## Serpstack API

## Brave API
