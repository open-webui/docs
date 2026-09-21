Requires [Docker](https://docs.docker.com/get-docker/). Replace `your-secret-key` with the output of `openssl rand -hex 32`, then run the command below; it pulls the image and starts it:

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

| Flag | What it does |
|---|---|
| `-p 3000:8080` | The UI is on port 3000 of your machine. Change the left number if 3000 is taken. |
| `-v open-webui:/app/backend/data` | Your chats, users and settings live in this volume. It survives updates; never run without it. |
| `--add-host=host.docker.internal:host-gateway` | Lets the container reach Ollama, or anything else, running on your machine. |
| `--restart always` | Comes back after a reboot. |
| `-e WEBUI_SECRET_KEY=your-secret-key` | Set it once and keep it. Without a fixed key, every recreated container logs everyone out. Generate one with `openssl rand -hex 32`. |



## Image Variants

| Tag | Use case |
|-----|----------|
| `:main` | Standard image (recommended). Everything included: the app plus the bundled speech-to-text and embedding models. |
| `:dev` | Pre-release (nightly) build from the `dev` branch. Fixes and features arrive here first. See [Using the Dev Branch](#using-the-dev-branch). |
| `:main-slim` | Smaller image with the local machine-learning stack removed, see [What slim leaves out](#what-slim-leaves-out) |
| `:cuda` | Nvidia GPU support, CUDA 12.8 (add `--gpus all` to `docker run`) |
| `:cuda126` | Same as `:cuda`, built against CUDA 12.6 |
| `:ollama` | Bundles Ollama inside the container for an all-in-one setup |

Channel and variant combine: `:dev-slim`, `:dev-cuda`, `:dev-cuda126` and `:dev-ollama` all exist. Slim is a variant of its own, so there is no `cuda-slim` or `ollama-slim`. The bare variant names `:slim`, `:cuda`, `:cuda126` and `:ollama` are aliases of the `main` build.

### What slim leaves out

Slim is the standard image with the local machine-learning stack removed: no `torch`, no `sentence-transformers`, no `transformers`, no `faster-whisper`, no `unstructured`, and no `ffmpeg`, `pandoc` or build toolchain in the base system. It also carries one client where the standard image carries many: PostgreSQL and pgvector for data and vectors, local files for storage, and no Playwright browser. Dozens of Python packages are gone, `torch` among them, which is where the size saving comes from.

**Nothing extra is required to run it.** It starts on its own and chatting works exactly as it does on `:main`, with the model provider you were going to configure anyway. What changes is that the work slim can no longer do itself has to come from a service you point it at, and only for the features you actually use.

#### What it will not start without

Two settings are checked at boot, and slim refuses to start rather than failing later:

- **The application database** has to be SQLite or PostgreSQL. MySQL, MariaDB and Oracle need the standard image, and so does AWS RDS IAM authentication.
- **File storage** has to be local. S3, Azure Blob and Google Cloud Storage need the standard image.

Neither matters on a default install, which is SQLite and local files. They matter when you move a standard-image deployment onto slim.

#### What each feature needs

| If you want | Point slim at | Otherwise |
|---|---|---|
| **Documents, knowledge or RAG** | An embedding provider: `RAG_EMBEDDING_ENGINE` set to `ollama`, `openai` or `azure_openai` | Embedding calls fail with 503, and the admin panel refuses to save the local engine |
| | PostgreSQL with pgvector: `VECTOR_DB=pgvector` and `PGVECTOR_DB_URL`. It is the only vector store slim carries a client for | 503 the first time retrieval runs. Nothing else is affected, the store is only opened when it is used |
| **PDFs and Office files** | Tika, Docling, an external extractor or a cloud engine | Uploading one returns 503. Plain text formats are still read by slim itself |
| **Voice input** | Any external speech-to-text engine: OpenAI, Deepgram, Azure, Mistral and so on | Local Whisper is not offered, and the admin panel refuses to select it |
| **Spoken replies** | Any external text-to-speech engine | The local Transformers voice is not offered, and requesting speech returns 503 |
| **Web search** | Any provider other than DDGS | DDGS is greyed out in the admin panel and refused on save |
| **Reranking** | An external reranker | Selecting a local reranking model is refused |
| **Code interpreter** | Nothing, but the browser fetches the Python packages from `cdn.jsdelivr.net` rather than from your instance | Running code fails where the browser cannot reach that CDN |

Also unavailable: the **Playwright** web loader, so pages are fetched over plain HTTP or by an external web loader, and the **Transformers** text splitter, so use the character or the tiktoken token splitter. Slim carries no `git` either, so a tool or function whose requirements install straight from a repository needs the standard image.

If you use Open WebUI as a chat front end for hosted models, none of the above applies and slim is simply the smaller image.

#### What still works without a service

- **Plain text extraction.** `csv`, `html`, `txt`, `md`, `markdown`, `rst`, `xml` and anything else detected as text are read by slim itself.
- **Reranking, in a fashion.** Leave the reranking model empty and results are scored by cosine similarity against the embeddings you already have, which needs no model runtime.
- **Audio passthrough.** Speech from an external provider is served in the format that provider returned, since slim cannot transcode. A provider that answers with something a browser cannot play is rejected rather than stored.

#### Building it yourself

`USE_SLIM=true` cannot be combined with `USE_CUDA=true` or `USE_OLLAMA=true`. The build stops with an error rather than producing an image whose GPU support or bundled model server has nothing to run.

#### Offline and air-gapped

Slim never downloads a model, because it cannot run one, and an air-gapped deployment otherwise only has to reach whichever services it uses on your own network. `OFFLINE_MODE=true` still blocks the Hugging Face traffic and the version check.

The one exception is the **code interpreter**. The standard image bundles the Python packages it runs; slim ships only the Pyodide runtime and points the package list at `cdn.jsdelivr.net`, so the browser pulls them from the internet on first use. Air-gapped instances should leave the code interpreter off, or use the standard image.

### How the tags update

`:main` and `:latest` are the **same rolling image**: both point to the newest build from the `main` branch and are rebuilt every time a change lands there, so their digest moves forward as development continues. Note that `:latest` follows `main`; it does **not** point to the newest stable release.

`:dev` is the same idea for the `dev` branch, also rolling. That is the pre-release, effectively a nightly build, and it carries fixes and features weeks before they appear under `:main`.

Version tags, such as `:vX.Y.Z` and the shorter `:X.Y.Z`, are **pinned** to one stable release and never change. `:X.Y` follows the newest patch release of that minor line. `:git-<short-sha>` pins one exact commit.

This is why `:main` and a specific release tag can show different image digests at the same time: `:main` already includes everything merged since that release, while the version tag stays frozen at it.

| Tag | Points to | Immutable? |
| :--- | :--- | :--- |
| `:main`, `:latest` | Newest build of the `main` branch | No (rolling) |
| `:dev` | Newest build of the `dev` branch, the pre-release | No (rolling) |
| `:vX.Y.Z`, `:X.Y.Z` | A specific stable release | Yes |
| `:X.Y` | The newest patch release of that minor line | No (rolling within the minor) |
| `:git-<sha>` | One exact commit | Yes |

For reproducible or production deployments, pin a version tag. For the newest build, use `:main` (or the identical `:latest`). For the next release before it is released, use `:dev`.

### Specific release versions

For production environments, pin a specific version instead of using floating tags. Replace `X.Y.Z` with a version from the [releases page](https://github.com/open-webui/open-webui/releases):

```bash
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z-cuda
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z-ollama
```

:::info Docker Hub
The same images are mirrored to Docker Hub as `openwebui/open-webui`, but only a subset: `latest`, `latest-<variant>` and the bare `<variant>` tags (for example `slim`, `cuda`, `ollama`) follow `main`, and `X.Y.Z` / `X.Y`, with or without a variant suffix, follow releases. `:main`, `:dev`, `:vX.Y.Z` and `:git-<sha>` exist on ghcr.io only, which is why every command in these docs uses `ghcr.io/open-webui/open-webui`.
:::

---

## Common Configurations

### GPU support (Nvidia)

```bash
docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
```

### Bundled with Ollama

A single container with Open WebUI and Ollama together:

**With GPU:**
```bash
docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
```

**CPU only:**
```bash
docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
```

### Connecting to Ollama on a different server

```bash
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### Single-user mode (no login)

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e WEBUI_AUTH=False -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

:::warning
You cannot switch between single-user mode and multi-account mode after this change.
:::

---

## Using the Dev Branch

`:dev` is Open WebUI's pre-release channel, and in practice a nightly build: the image is rebuilt from the `dev` branch as changes land, and every change lands there before it lands anywhere else. There is no separate beta programme, because `dev` fills that role. Changes that reach it are not reverted, so the next release is `dev` as it stands on release day.

That has two consequences worth knowing:

- **If you are waiting on a fix, it is probably already available.** Check the [changelog](https://github.com/open-webui/open-webui/blob/dev/CHANGELOG.md) on `dev`, then run `:dev` rather than waiting for the release.
- **If you run Open WebUI for other people, testing the pre-release is how you avoid surprises.** A second instance on `:dev` shows you the next release before your users meet it, and tells you whether your plugins, your models and your configuration still behave.

Whether to run it is entirely your decision, and running it is what makes releases good. A pre-release is only as well tested as the number of people who choose to install it, and that number is currently small.

Setup is the same as any other image, with the tag changed:

```bash
docker run -d -p 3001:8080 --add-host=host.docker.internal:host-gateway -v open-webui-dev:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui-dev --restart always ghcr.io/open-webui/open-webui:dev
```

:::warning Use a separate volume
**Never share a data volume between dev and production.** Dev builds may include database migrations that a release image cannot read back, so a shared volume can leave you unable to go back to `:main`. The `-v open-webui-dev:/app/backend/data` above is a different volume from the `open-webui` one used on the Quick Start, and that is deliberate. The container name differs too, so both can run at once.
:::

Anything that looks wrong on `:dev` is worth reporting on [GitHub](https://github.com/open-webui/open-webui/issues). Reports at that stage get fixed before the release instead of after it, which is the whole point of a pre-release existing.

If Docker is not your preference, follow the [Developing Open WebUI](/getting-started/advanced-topics/development).

---

## Uninstall

### With docker run

1. **Stop and remove the container:**
    ```bash
    docker rm -f open-webui
    ```

2. **Remove the image (optional):**
    ```bash
    docker rmi ghcr.io/open-webui/open-webui:main
    ```

3. **Remove the volume (optional, deletes all data):**
    ```bash
    docker volume rm open-webui
    ```

