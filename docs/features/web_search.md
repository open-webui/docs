---
sidebar_position: 5
title: "🌐 Web Search"
---

## Overview

This guide provides instructions on how to set up web search capabilities in Open WebUI using various search engines.

## SearXNG (Docker)

> "**SearXNG is a free internet metasearch engine which aggregates results from various search services and databases. Users are neither tracked nor profiled.**"

### 1. SearXNG Configuration

If you want to modify the default configuration, follow these steps:

1. Create a new directory `searxng-docker` by cloning the searxng-docker repository. This folder will contain your SearXNG configuration files. Refer to the [SearXNG documentation](https://docs.searxng.org/) for configuration instructions.

```bash
git clone https://github.com/searxng/searxng-docker.git
```

1. Navigate to the `searxng-docker` repository:

```bash
cd searxng-docker
```

3. Remove the `localhost` restriction and define a less used port by modifying the `docker-compose.yaml` file:

```bash
sed -i "s/127.0.0.1:8080/1337/" docker-compose.yaml
```

4. Allow the container to create new config files:

```bash
sudo chmod a+rwx searxng-docker/
```

5. Create a non-restrictive `searxng-docker/limiter.toml` config file:

<details>
<summary>searxng-docker/limiter.toml</summary>

```bash
cat > searxng-docker/limiter.toml << EOF
[botdetection.ip_limit]
# activate link_token method in the ip_limit method
link_token = false

[botdetection.ip_lists]
block_ip = []
pass_ip = []
EOF
```

</details>

6. Delete the default `searxng-docker/settings.yml` file, it will be regenerated on first launch:

```bash
rm searxng-docker/settings.yml
```

7. Bring up the container momentarily to generate a fresh settings.yml file:

```bash
docker compose up searxng-docker -d ; sleep 10 ; docker compose down searxng-docker
```

8. Add HTML and JSON formats to the `searxng-docker/settings.yml` file:

```bash
sed -i 's/formats: \[\"html\"\/]/formats: [\"html\", \"json\"]/' searxng-docker/settings.yml
```

#### Configuration Files

#### searxng/settings.yml (Extract)

The default `settings.yml` file contains many engine settings. Below is an extract of what the default `settings.yml` file might look like:

<details>
<summary>searxng-docker/settings.yml</summary>

```yaml
# see https://docs.searxng.org/admin/settings/settings.html#settings-use-default-settings
use_default_settings: true

server:
  secret_key: "Generate a secret key and provide it here"
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
    # json is required
```

</details>

8. Your `searxng-docker/uwsgi.ini` file for SearXNG should look like:

<details>
<summary>searxng-docker/uwsgi.ini</summary>

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

Now, copy the modified `searxng-docker` folder to the same directory as your compose files.

Alternatively, if you don't want to modify the default configuration, you can simply create an empty `searxng-docker` folder and follow the rest of the setup instructions.

### 2. Docker Compose Setup

Add the following to your `docker-compose.yaml` file:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "searxng"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
      SEARXNG_QUERY_URL: "http://searxng:1337/search?q=<query>"

  searxng:
    image: searxng/searxng:latest
    container_name: searxng
    ports:
      - "1337:8080"
    volumes:
      - ./searxng:/etc/searxng
    restart: unless-stopped
```

Launch your updated stack with:

```bash
docker compose up -d
```

Alternatively, you can run SearXNG directly using `docker run`:

```bash
docker run -d --name searxng -p 1337:8080 -v ./searxng:/etc/searxng --restart always searxng/searxng:latest
```

Confirm connectivity from Open-WebUI container instance:

```bash
docker exec -it open-webui curl 'http://host.docker.internal:1337/search?q=this+is+a+test+query&format=json'
```

### 3. GUI Configuration

1. Navigate to: `Admin Panel` -> `Settings` -> `Web Search`
2. Toggle `Enable Web Search`
3. Set `Web Search Engine` from dropdown menu to `searxng`
4. Set `Searxng Query URL` to examples given: `https://<search.domain.com>/search?q=<query>` or `http://<searxng.local>/search?q=<query>`. **Do note the `/search?q=<query>` part is mandatory.**
5. Adjust the `Search Result Count` and `Concurrent Requests` values accordingly
6. Save changes

![SearXNG GUI Configuration](/img/tutorial_searxng_config.png)

### 4. Using Web Search in a Chat

To access Web Search, Click on the + next to the message input field.

Here you can toggle Web Search On/Off.

![Web Search UI Toggle](/img/web_search_toggle.png)

#### Note

You will have to explicitly toggle this On/Off in a chat.

This is enabled on a per session basis eg. reloading the page, changing to another chat will toggle off.

## Google PSE API

### Setup

1. Go to Google Developers, use [Programmable Search Engine](https://developers.google.com/custom-search), and log on or create account.
2. Go to [control panel](https://programmablesearchengine.google.com/controlpanel/all) and click `Add` button
3. Enter a search engine name, set the other properties to suit your needs, verify you're not a robot and click `Create` button.
4. Generate `API key` and get the `Search engine ID`. (Available after the engine is created)
5. With `API key` and `Search engine ID`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`
6. Enable `Web search` and Set `Web Search Engine` to `google_pse`
7. Fill `Google PSE API Key` with the `API key` and `Google PSE Engine Id` (# 4)
8. Click `Save`

![Open WebUI Admin panel](/img/tutorial_google_pse1.png)

#### Note

You have to enable `Web search` in the prompt field, using plus (`+`) button.
Search the web ;-)

![enable Web search](/img/tutorial_google_pse2.png)

## Brave API

### Docker Compose Setup

Add the following to a file named `docker-compose.yaml`:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "brave"
      BRAVE_SEARCH_API_KEY: "YOUR_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```

## Mojeek Search API

### Setup

1. Please visit [Mojeek Search API page](https://www.mojeek.com/services/search/web-search-api/) to obtain an `API key`
2. With `API key`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`
3. Enable `Web search` and Set `Web Search Engine` to `mojeek`
4. Fill `Mojeek Search API Key` with the `API key`
5. Click `Save`

### Docker Compose Setup

Add the following to a file named `docker-compose.yaml`:

```yaml
services:
  open-webui:
    environment:
      ENABLE_RAG_WEB_SEARCH: True
      RAG_WEB_SEARCH_ENGINE: "mojeek"
      BRAVE_SEARCH_API_KEY: "YOUR_MOJEEK_API_KEY"
      RAG_WEB_SEARCH_RESULT_COUNT: 3
      RAG_WEB_SEARCH_CONCURRENT_REQUESTS: 10
```

## SearchApi API

[SearchApi](https://searchapi.io) is a collection of real-time SERP APIs. Any existing or upcoming SERP engine that returns `organic_results` is supported. The default web search engine is `google`, but it can be changed to `bing`, `baidu`, `google_news`, `bing_news`, `google_scholar`, `google_patents`, and others.

### Setup

1. Go to [SearchApi](https://searchapi.io), and log on or create a new account.
2. Go to `Dashboard` and copy the API key.
3. With `API key`, open `Open WebUI Admin panel` and click `Settings` tab, and then click `Web Search`.
4. Enable `Web search` and set `Web Search Engine` to `searchapi`.
5. Fill `SearchApi API Key` with the `API key` that you copied in step 2 from [SearchApi](https://www.searchapi.io/) dashboard.
6. [Optional] Enter the `SearchApi engine` name you want to query. Example, `google`, `bing`, `baidu`, `google_news`, `bing_news`, `google_videos`, `google_scholar` and `google_patents.` By default, it is set to `google`.
7. Click `Save`.

![Open WebUI Admin panel](/img/tutorial_searchapi_search.png)

#### Note

You have to enable `Web search` in the prompt field, using plus (`+`) button to search the web using [SearchApi](https://www.searchapi.io/) engines.

![enable Web search](/img/enable_web_search.png)

## Kagi API

Coming Soon

### Setup

## Serpstack API

Coming Soon

### Setup

## Serper API

Coming Soon

### Setup

## Serply API

Coming Soon

### Setup

## DuckDuckGo API

### Setup

No setup required! DuckDuckGo works out of the box in Open WebUI. Note that there is a possibility of your searches being rate limited.

## Tavily API

Coming Soon

### Setup

## Jina API

Coming Soon

### Setup

## Bing API

Coming Soon

### Setup
