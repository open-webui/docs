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
| `:main-slim` | Smaller image without the pre-downloaded models, see [What slim leaves out](#what-slim-leaves-out) |
| `:cuda` | Nvidia GPU support, CUDA 12.8 (add `--gpus all` to `docker run`) |
| `:cuda126` | Same as `:cuda`, built against CUDA 12.6 |
| `:ollama` | Bundles Ollama inside the container for an all-in-one setup |

Channel and variant combine: `:dev-slim`, `:dev-cuda`, `:dev-cuda126` and `:dev-ollama` all exist. Slim is a variant of its own, so there is no `cuda-slim` or `ollama-slim`. The bare variant names `:slim`, `:cuda`, `:cuda126` and `:ollama` are aliases of the `main` build.

### What slim leaves out

The slim image is the standard image without the pre-downloaded model files. The Python packages, ffmpeg and pandoc are identical, and on the amd64 build the download shrinks from roughly 1.8 GB to 1.5 GB.

| Left out | Downloaded when |
|---|---|
| RAG embedding model `sentence-transformers/all-MiniLM-L6-v2` | **First start** (it is loaded at boot), from Hugging Face |
| Speech-to-text model `faster-whisper` `base` | First local speech-to-text request, from Hugging Face |
| Auxiliary embedding model `TaylorAI/bge-micro-v2` | First leaderboard search, from Hugging Face |
| `tiktoken` `cl100k_base` encoding | When the token text splitter is selected, from OpenAI |

So slim reaches out to the internet on first start and again on first use of local speech-to-text. Offline, air-gapped, behind a proxy that blocks Hugging Face, or with `OFFLINE_MODE=true`, it still works, as long as the default local embedding engine is not in use: set `RAG_EMBEDDING_ENGINE` to `ollama`, `openai` or `azure_openai` before the first start, or supply the model files yourself.

Otherwise the container starts, but the first document upload or RAG query fails with `ValueError: No embedding model is loaded` (0.9.6 aborted startup instead, fixed in 0.10.0); switch `RAG_EMBEDDING_ENGINE` or supply the model files, see [Startup & Docker Failures](/troubleshooting/startup#valueerror-no-embedding-model-is-loaded-with-offline-mode-on-a-fresh-install).

### When slim saves anything

The slim image is always about 0.3 GB smaller on disk. The bandwidth saving only holds if the models never get downloaded: with default settings slim pulls the embedding model into your volume at first start, and the first local speech-to-text request pulls Whisper, so the total transfer ends up about the same as `:main`. To keep the downloads at zero, start the container with `OFFLINE_MODE=true`. It blocks every Hugging Face download (the embedding models and Whisper) and the version check, and the container boots normally; document upload and RAG just fail until you open your avatar > **Settings > Admin > Documents** and set **Embedding Model Engine** to Ollama, OpenAI or Azure OpenAI. The change takes effect immediately, persists, and nothing is ever downloaded. Speech-to-text works the same way: pick an external engine in the admin settings, or leave it unused. Two things to leave alone: the `token` text splitter pulls the tiktoken encoding, which `OFFLINE_MODE` does not block, and leaderboard searches fail offline because they need the auxiliary embedding model.

If your data volume already holds the models from an earlier `:main` run, slim costs you nothing either.

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

