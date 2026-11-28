需要安装 [Docker](https://docs.docker.com/get-docker/)。将 `your-secret-key` 替换为 `openssl rand -hex 32` 的输出，然后运行以下命令；该命令会拉取并启动镜像：

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

| 参数 | 作用 |
|---|---|
| `-p 3000:8080` | 界面使用你机器的 3000 端口。如果 3000 已被占用，请修改左侧数字。右侧数字保持为 8080；除非设置 `PORT`，否则这是 Open WebUI 在容器内监听的端口。使用 `-p 3000:3000` 时，页面将始终无法加载。 |
| `-v open-webui:/app/backend/data` | 你的聊天、用户和设置都存储在此数据卷中。更新后数据仍会保留；运行时切勿省略它。请将其挂载到 `/app/backend/data`，而不是 `/app/backend`：挂载到 `/app/backend` 会[覆盖](https://docs.docker.com/engine/storage/volumes/)镜像中的应用程序代码，因此容器会运行挂载内容中的代码，更新看起来也不会带来任何变化。 |
| `--add-host=host.docker.internal:host-gateway` | 让容器能够访问你机器上运行的 Ollama 或其他任何服务。 |
| `--restart always` | 重启后自动恢复运行。 |
| `-e WEBUI_SECRET_KEY=your-secret-key` | 设置一次并妥善保留。如果不使用固定密钥，每次重新创建容器都会使所有用户退出登录。使用 `openssl rand -hex 32` 生成一个密钥。 |

日志行 `Waiting for application startup.` 会在每次正常启动时出现。日志显示 `Uvicorn running on http://0.0.0.0:8080` 后，Open WebUI 才开始接受连接。

## 镜像变体 {#image-variants}

| 标签 | 适用场景 |
|-----|----------|
| `:main` | 标准镜像（推荐）。包含全部内容：应用以及捆绑的语音转文本和嵌入模型。 |
| `:dev` | 来自 `dev` 分支的预发布（每晚）构建。修复和功能会最先出现在这里。请参阅[使用 Dev 分支](#using-the-dev-branch)。 |
| `:slim`、`:main-slim` | 下载量约 **197 MB，而非 1.62 GB**，在 Linux/amd64 上**缩小 88%**。使用你的模型服务提供方时，聊天体验相同。请参阅[为什么选择 slim？](#what-slim-leaves-out) |
| `:cuda` | 在 Nvidia GPU 上运行 Open WebUI 自带的本地模型（嵌入、重排序、本地 Whisper），使用 CUDA 12.8（在 `docker run` 中添加 `--gpus all`）。聊天回复不会因此加快；请参阅 [GPU 支持](#gpu-support-nvidia) |
| `:cuda126` | 与 `:cuda` 相同，但基于 CUDA 12.6 构建 |
| `:ollama` | 在容器内捆绑 Ollama，提供一体化部署 |

每个变体还有开发版构建：`:dev-slim`、`:dev-cuda`、`:dev-cuda126` 和 `:dev-ollama`。短标签 `:slim`、`:cuda`、`:cuda126` 和 `:ollama` 跟随 `main`。请选择一种变体；slim 不能与 CUDA 或捆绑的 Ollama 组合使用。

### 为什么选择 slim？ {#what-slim-leaves-out}

**197 MB，而非 1.62 GB。聊天体验相同。** `:slim` 镜像比 `:main` **小 88%**，全新拉取可节省约 **1.42 GB**。这意味着在配置机器或部署新实例时，下载 Open WebUI 所需的时间更少。可与托管 API、你自己的模型服务器或独立的 Ollama 实例搭配使用，即使该实例位于同一台机器上也可以。

这些是 Linux/amd64 的压缩下载大小，核对日期为 2026 年 10 月 16 日。大小因构建和架构而异。`:slim` 和 `:main-slim` 是同一镜像的两个标签。

<!-- 已于 2026 年 10 月 16 日根据 GHCR 清单层大小验证。main linux/amd64: sha256:d90e4762f94cae56e74d329a176f0dc76c6460ee7cb01ad6e4b91a503aa70d66 = 1,620,712,040 bytes; slim linux/amd64: sha256:c5645947013018ed78b0740ccdb29a01a673dbfd815ac168c641d9a80427ca9f = 197,296,335 bytes。 -->

这些节省来自移除捆绑的机器学习技术栈，包括 PyTorch、本地嵌入和语音运行时，以及文档处理工具和可选的数据库与存储客户端。如果你通过 API 使用 Open WebUI 与模型聊天，这些依赖原本只会在容器中闲置。

**要开始使用，请将上述 Docker 命令中的 `:main` 改为 `:slim`。** 默认 SQLite 数据库和本地文件存储仍可正常工作。连接你的模型服务提供方即可开始聊天；基本聊天配置无需额外服务。

对于知识搜索、文档提取或语音功能，slim 会连接执行相应工作的服务。如果你已经使用这些服务或只需要聊天，slim 很合适。如果希望 Open WebUI 在自己的容器内处理嵌入、语音识别和文档提取，请选择标准镜像。下表列出了各项功能所需的配置。

#### 内存使用量 {#slim-memory-usage}

在我们于 2026 年 10 月 16 日对 Docker Desktop 中 Linux/arm64 上的 Open WebUI 0.12.3 进行的测试中，slim 空闲时**使用约 300 MiB 内存**。此处仅指 Open WebUI 容器；浏览器、Docker 的虚拟机以及任何模型服务器或外部服务都需要各自的内存。请为启动和活跃工作负载预留额外内存：此空闲测量值既不是最低内存要求，也不是容器内存限制。

<details>
<summary>测量方法</summary>

我们运行了三个全新容器，均使用默认 SQLite 数据库和一个 Uvicorn 工作进程，未配置任何模型服务提供方、用户、聊天、上传或插件。每次运行使用新的数据目录，且不设置内存限制。Docker 的 Linux 虚拟机有 16 个 CPU 和 7.65 GiB 可用内存；其他容器保持运行。

`/health` 返回 HTTP 200 后，我们等待 30 秒，然后进行 12 次读数，每次调用间隔 5 秒：

```bash
docker stats --no-stream --format '{{.MemUsage}}' <container-name>
```

在全部 36 个样本中，内存使用量范围为 **291.8 至 292.6 MiB**，中位数为 **292.2 MiB**。

在 Linux 上，[Docker 报告的内存使用量](https://docs.docker.com/reference/cli/docker/container/stats/)不包括非活动文件缓存。这些样本反映空闲实例，不包括模型推理或并发聊天流量。结果因版本、架构、配置和工作负载而异。

固定镜像为 `ghcr.io/open-webui/open-webui@sha256:abd02d41e522d41be389d28d1a73752cd2afc4aa46f980b60d490ecc9379c16b`（Linux/arm64，提交 `91ea4e3421d1d8069f13d4a463fcb5986d94ea60`）。

</details>

#### 将现有部署迁移到 slim {#moving-an-existing-deployment-to-slim}

切换前请检查数据库和文件存储：

- **数据库：** slim 支持 SQLite 和 PostgreSQL，即 Open WebUI 支持的两种数据库。PostgreSQL 的 AWS RDS IAM 身份验证需要标准镜像。
- **文件存储：** 支持本地文件和 S3（`STORAGE_PROVIDER=s3`）。Azure Blob 和 Google Cloud Storage 需要标准镜像。

slim 会在启动时检查这些设置，并对不支持的配置报错。默认安装已使用 SQLite 和本地文件。

#### 各项功能所需配置 {#what-each-feature-needs}

| 如果需要 | 将 slim 指向 | 否则 |
|---|---|---|
| **文档、知识库或 RAG** | 一个嵌入服务提供方：将 `RAG_EMBEDDING_ENGINE` 设置为 `ollama`、`openai` 或 `azure_openai` | 嵌入调用会失败并返回 503，管理员面板会拒绝保存本地引擎配置 |
| | PostgreSQL 与 pgvector，即 slim 默认且唯一的向量存储。当 `DATABASE_URL` 指向 PostgreSQL 时会使用该变量；否则请设置 `PGVECTOR_DB_URL` | 首次运行检索时返回 503。其他功能不受影响，因为只有在使用时才会打开该存储 |
| **PDF 和 Office 文件** | Tika、Docling、外部提取器或云端引擎 | 上传此类文件会返回 503。纯文本格式仍由 slim 自行读取 |
| **语音输入** | 任意外部语音转文本引擎：OpenAI、Deepgram、Azure、Mistral 等 | 不提供本地 Whisper，管理员面板会拒绝选择它 |
| **语音回复** | 任意外部文本转语音引擎 | 不提供本地 Transformers 语音，请求语音时返回 503 |
| **网页搜索** | DDGS 以外的任意服务提供方 | DDGS 在管理员面板中显示为灰色，保存时会被拒绝 |
| **重排序** | 外部重排序器 | 选择本地重排序模型会被拒绝 |
| **代码解释器** | 无需配置，但浏览器会从 `cdn.jsdelivr.net` 而不是你的实例获取 Python 包 | 在浏览器无法访问该 CDN 的环境中，运行代码会失败 |

还不可用的功能包括：**Playwright** 网页加载器，因此页面通过普通 HTTP 或外部网页加载器获取；以及 **Transformers** 文本分割器，因此请使用字符分割器或 tiktoken token 分割器。slim 也不包含 `git`，因此，如果工具或函数的依赖需要直接从代码仓库安装，则需要标准镜像。

如果你将 Open WebUI 用作托管模型的聊天前端，上述限制均不适用，slim 只是更小的镜像。

#### 无需外部服务仍可使用的功能 {#what-still-works-without-a-service}

- **纯文本提取。** slim 本身会读取 `csv`、`html`、`txt`、`md`、`markdown`、`rst`、`xml` 以及任何其他被检测为文本的内容。
- **某种形式的重排序。** 将重排序模型留空，系统会根据已有嵌入通过余弦相似度为结果评分，无需模型运行时。
- **音频直通。** 由于 slim 无法转码，外部服务提供方返回的语音将以其返回的格式提供。如果提供方返回浏览器无法播放的内容，该内容会被拒绝，而不会存储。

#### 自行构建 {#building-it-yourself}

标准镜像和 slim 镜像都会根据哈希固定的锁文件 `backend/requirements.lock` 和 `backend/requirements-slim.lock`，安装除 PyTorch 及其配套包之外的所有 Python 包。如果自定义镜像修改了 `backend/requirements.txt` 或 `backend/requirements-slim.txt`，必须运行 `backend/update-locks.sh`（需要 [uv](https://docs.astral.sh/uv/)）重新生成锁文件，否则修改不会生效。

`USE_SLIM=true` 不能与 `USE_CUDA=true` 或 `USE_OLLAMA=true` 组合使用。构建会报错并停止，而不会生成 GPU 支持或捆绑模型服务器无法实际运行的镜像。

#### 离线与物理隔离环境 {#offline-and-air-gapped}

slim 从不下载模型，因为它无法运行模型；除此之外，物理隔离部署只需能够访问你自己网络上它所使用的服务。`OFFLINE_MODE=true` 仍会阻止 Hugging Face 流量和版本检查。

两项功能首次使用时会访问互联网。**token 文本分割器**会下载其 tiktoken 编码，因此离线实例应使用字符分割器。**代码解释器**会让浏览器从 `cdn.jsdelivr.net` 拉取 Python 包，因为 slim 仅附带 Pyodide 运行时，而标准镜像会捆绑这些包。物理隔离实例应关闭代码解释器，或使用标准镜像。

### 标签的更新方式 {#how-the-tags-update}

`:main` 和 `:latest` 是**同一个滚动镜像**：两者都指向 `main` 分支的最新构建，并且每次有更改进入该分支时都会重新构建，因此其摘要会随着开发不断前移。请注意，`:latest` 跟随 `main`；它**不会**指向最新稳定版本。

`:dev` 对 `dev` 分支采用相同机制，同样也是滚动标签。它是预发布版本，实际上相当于每晚构建，其中的修复和功能会比 `:main` 提前数周出现。

版本标签（例如 `:vX.Y.Z` 和较短的 `:X.Y.Z`）**固定**于一个稳定版本且永不改变。`:X.Y` 跟随该次版本系列的最新补丁版本。`:git-<short-sha>` 固定一个确切的提交。

因此，`:main` 和特定发布标签可能同时显示不同的镜像摘要：`:main` 已包含自该版本发布以来合并的所有内容，而版本标签保持冻结在该版本。

| 标签 | 指向 | 不可变？ |
| :--- | :--- | :--- |
| `:main`、`:latest` | `main` 分支的最新构建 | 否（滚动） |
| `:dev` | `dev` 分支的最新构建，即预发布版本 | 否（滚动） |
| `:vX.Y.Z`、`:X.Y.Z` | 特定稳定版本 | 是 |
| `:X.Y` | 该次版本系列的最新补丁版本 | 否（在次版本内滚动） |
| `:git-<sha>` | 一个确切的提交 | 是 |

对于可复现或生产部署，请固定版本标签。若需最新构建，请使用 `:main`（或与之相同的 `:latest`）。若要在下个版本发布前使用它，请使用 `:dev`。

### 指定发布版本 {#specific-release-versions}

生产环境中，请固定特定版本，而非使用浮动标签。将 `X.Y.Z` 替换为[发布页面](https://github.com/open-webui/open-webui/releases)中的版本：

```bash
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z-slim
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z-cuda
docker pull ghcr.io/open-webui/open-webui:vX.Y.Z-ollama
```

:::info Docker Hub
这些镜像也会同步到 Docker Hub 上的 `openwebui/open-webui`，但仅包含部分标签：`latest`、`latest-<variant>` 和单独的 `<variant>` 标签（例如 `slim`、`cuda`、`ollama`）跟随 `main`；`X.Y.Z` / `X.Y`（无论是否带变体后缀）跟随发布版本。`:main`、`:dev`、`:vX.Y.Z` 和 `:git-<sha>` 仅存在于 ghcr.io，因此本文档中的所有命令都使用 `ghcr.io/open-webui/open-webui`。
:::

---

## 常见配置 {#common-configurations}

### GPU 支持（Nvidia） {#gpu-support-nvidia}

```bash
docker run -d -p 3000:8080 --gpus all --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:cuda
```

`:cuda` 镜像会在 GPU 上运行本地嵌入模型、本地重排序模型以及本地 Whisper 语音转文本。聊天回复来自 Ollama 或你的服务提供方，因此速度取决于模型运行位置：请将 GPU 分配给 Ollama。如果容器无法使用 CUDA，Open WebUI 会记录 `CUDA unavailable (USE_CUDA_DOCKER=true), falling back to CPU` 及原因，然后在 CPU 上运行这些模型。如果启动时未带 `--gpus all`，该日志行会以 `CUDA not available` 结尾。

`--gpus all` 需要宿主机安装 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)。否则，`docker run` 会报错 `could not select device driver "" with capabilities: [[gpu]]`，容器不会启动。安装该工具包，运行 `sudo nvidia-ctk runtime configure --runtime=docker`，使用 `sudo systemctl restart docker` 重启 Docker，然后再次运行该命令。Docker 的 [GPU 访问](https://docs.docker.com/engine/containers/gpu/)页面列出了驱动程序步骤。

Open WebUI 没有 ROCm 镜像。对于 AMD GPU，请运行 `:main` 镜像，并按照 [Ollama 的 Docker 指南](https://docs.ollama.com/docker)将 GPU 分配给 Ollama 的 `rocm` 镜像。

### 捆绑 Ollama {#bundled-with-ollama}

在单个容器中同时运行 Open WebUI 和 Ollama：

**使用 GPU：** `--gpus=all` 会传入 NVIDIA GPU，并且需要 NVIDIA Container Toolkit，与 [GPU 支持](#gpu-support-nvidia) 中所述相同。对于 AMD GPU，请改用其中描述的 ROCm 配置。

```bash
docker run -d -p 3000:8080 --gpus=all -v ollama:/root/.ollama -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
```

**仅使用 CPU：**
```bash
docker run -d -p 3000:8080 -v ollama:/root/.ollama -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:ollama
```

要检查聊天模型是否使用 GPU，请发送一条消息，并在模型仍处于加载状态时运行 `ollama ps`。检查 `PROCESSOR` 列，查看使用的是 CPU、GPU 还是两者分担。

- 对于捆绑的 Ollama，运行 `docker exec open-webui ollama ps`。
- 对于独立的 Ollama 容器，运行 `docker exec ollama ollama ps`，或替换为其容器名称。
- 对于原生安装，在提供模型服务的机器上运行 `ollama ps`。

将实例与**管理员面板 > 设置 > 连接**中的 Ollama URL 对应起来。`nvidia-smi` 等设备检查可确认 GPU 是否可见，而 `ollama ps` 显示 Ollama 将特定模型加载到了哪里。

### 连接到不同服务器上的 Ollama {#connecting-to-ollama-on-a-different-server}

```bash
docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

### 单用户模式（无需登录） {#single-user-mode-no-login}

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -e WEBUI_AUTH=False -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

:::warning
完成此更改后，无法在单用户模式和多账户模式之间切换。
:::

---

## 使用 Dev 分支 {#using-the-dev-branch}

`:dev` 是 Open WebUI 的预发布渠道，实际上相当于每晚构建：随着更改进入 `dev` 分支，镜像会从该分支重新构建，而且每项更改都会先进入该分支，再进入其他任何地方。没有单独的 beta 计划，因为 `dev` 已承担这一角色。进入其中的更改不会被回退，因此下一个发布版本就是发布日当天的 `dev` 状态。

有两个值得了解的后果：

- **如果你在等待某项修复，它很可能已经可用。** 查看 `dev` 上的[更新日志](https://github.com/open-webui/open-webui/blob/dev/CHANGELOG.md)，然后运行 `:dev`，无需等待发布。
- **如果你为他人运行 Open WebUI，测试预发布版本是避免意外的方法。** 在 `:dev` 上运行第二个实例，可以在用户接触下个版本之前先行体验，并确认你的插件、模型和配置是否仍能正常工作。

是否运行完全由你决定，而运行它正是保证发布质量的关键。预发布版本的测试充分程度取决于选择安装它的人数，而目前这一人数还很少。

配置方式与其他镜像相同，只需更改标签：

```bash
docker run -d -p 3001:8080 --add-host=host.docker.internal:host-gateway -v open-webui-dev:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui-dev --restart always ghcr.io/open-webui/open-webui:dev
```

:::warning 使用独立的数据卷
**切勿在 dev 和生产环境之间共享数据卷。** 开发版构建可能包含发布版镜像无法读取的数据库迁移，因此共享数据卷可能导致你无法回退到 `:main`。上面的 `-v open-webui-dev:/app/backend/data` 与快速开始中使用的 `open-webui` 是不同数据卷，这是有意为之。容器名称也不同，因此两者可以同时运行。
:::

`:dev` 上任何看似异常的问题都值得在 [GitHub](https://github.com/open-webui/open-webui/issues) 上报告。在这个阶段报告的问题会在发布前（而非发布后）得到修复，这正是预发布版本存在的意义。

如果你不想使用 Docker，请参阅[开发 Open WebUI](/getting-started/advanced-topics/development)。

---

## 卸载 {#uninstall}

### 使用 docker run {#with-docker-run}

1. **停止并删除容器：**
    ```bash
    docker rm -f open-webui
    ```

2. **删除镜像（可选）：**
    ```bash
    docker rmi ghcr.io/open-webui/open-webui:main
    ```

3. **删除数据卷（可选，删除所有数据）：**
    ```bash
    docker volume rm open-webui
    ```
