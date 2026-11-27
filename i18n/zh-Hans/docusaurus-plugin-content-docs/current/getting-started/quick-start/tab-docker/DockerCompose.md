将以下内容保存为 `docker-compose.yml`，把密钥替换为 `openssl rand -hex 32` 的输出，然后运行 `docker compose up -d`：

```yaml title="docker-compose.yml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway
    environment:
      - WEBUI_SECRET_KEY=your-secret-key
    restart: unless-stopped

volumes:
  open-webui:
```

`extra_hosts` 使 `host.docker.internal` 在 Linux 上解析到宿主机。未设置 `OLLAMA_BASE_URL` 时，镜像会在 `http://host.docker.internal:11434` 查找 Ollama（随后尝试 `:12434`），因此正是这一行让镜像能够连接到宿主机上运行的 Ollama。

更新时，先运行 `docker compose pull`，然后运行 `docker compose up -d`。“更新”标签页中的 Watchtower 命令以名为 `open-webui` 的容器为目标；除非你在服务中添加 `container_name: open-webui`，否则 Compose 会将此容器命名为 `<project>-open-webui-1`。

镜像标签与 Docker 标签页中的相同：修改 `image:` 行即可。若要试用 `:dev`，请将其添加为第二个服务，并为其配置独立的数据卷和端口；请参阅[运行预发布镜像](/getting-started/quick-start#running-the-pre-release-image)。请使用 Docker Compose v2（`docker compose`，中间有空格）。



以下各节对上面的 `docker-compose.yml` 进行扩展。

:::warning

**警告：** 旧版 Docker Compose 教程可能使用版本 1 语法，其中包含 `docker-compose build` 这类命令。请确保使用版本 2 语法，即 `docker compose build` 这类命令（注意使用空格而不是连字符）。

:::

### 运行预发布镜像 {#running-the-pre-release-image}

`:dev` 是 Open WebUI 的预发布渠道，实际上相当于每晚构建：每项更改都会先进入 `dev` 分支，再进入其他任何地方，而下一个发布版本就是发布日当天的 `dev` 状态。在第二个实例上运行它，可以提前体验该版本；你报告的问题也能在其发布前（而非发布后）得到修复。

修改标签，并且务必为其配置**独立的数据卷和端口**：

```yaml
services:
  openwebui-dev:
    image: ghcr.io/open-webui/open-webui:dev
    ports:
      - "3001:8080"
    volumes:
      - open-webui-dev:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway
    environment:
      - WEBUI_SECRET_KEY=your-dev-secret-key
    restart: unless-stopped
volumes:
  open-webui-dev:
```

:::warning 切勿让 dev 使用生产环境的数据卷
开发版构建可能包含发布版镜像无法读取的数据库迁移，因此共享数据卷可能导致你无法回退到 `:main`。如上所示，请将 `open-webui-dev` 保留为独立的数据卷。
:::

将其作为第二个服务添加到常规服务旁边，两者即可同时运行，分别使用端口 3000 和 3001。发现任何异常，请在 [GitHub](https://github.com/open-webui/open-webui/issues) 上报告。预发布版本的测试充分程度取决于选择安装它的人数，因此这是运维人员所能做出的最有价值的贡献。

### 使用 Compose 支持 GPU {#gpu-support-with-compose}

:::note

**注意：** 要支持 Nvidia GPU，请将镜像从 `ghcr.io/open-webui/open-webui:main` 改为 `ghcr.io/open-webui/open-webui:cuda`，并在 `docker-compose.yml` 文件的服务定义中添加以下配置：

:::

```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: all
          capabilities: [gpu]
```

此设置可确保应用程序在 GPU 资源可用时加以利用。`:cuda` 镜像会将 Open WebUI 自带的本地模型（嵌入、重排序和 Whisper 语音转文本）转移到 GPU 上运行；只有当 Ollama 容器可使用 GPU 时，Ollama 的模型才会使用 GPU。`driver: nvidia` 预留配置要求宿主机安装 [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html)，与 [GPU 支持](#gpu-support-nvidia) 中的 `--gpus all` 相同。如果检测不到 GPU，镜像会回退到 CPU，并记录日志 `CUDA unavailable (USE_CUDA_DOCKER=true), falling back to CPU`。预发布渠道的标签为 `:dev-cuda`。

### 辅助脚本 {#helper-scripts}

代码库附带一组辅助脚本，用于简化常见的 Docker 工作流程：

- `docker-compose-launcher.sh`：交互式 Compose 启动器，支持 GPU 自动检测、可配置的 WebUI/API 端口、用于存放 Ollama 模型的宿主机数据挂载，以及可选的 Playwright 支持。它运行的是仓库自带的 `docker-compose.yaml`，而不是上面的文件；该仓库文件会在 Open WebUI 旁边通过第二个容器启动 Ollama。该 Ollama 不在你的机器上暴露任何端口；`--enable-api` 会添加 `docker-compose.api.yaml`，并将其暴露在 `11435` 端口。`--build` 会从你的检出目录构建镜像，而不是拉取镜像。运行 `./docker-compose-launcher.sh --help` 查看完整的标志列表。使用 `--drop` 拆除项目。对于带方括号的选项，请加引号，例如 `./docker-compose-launcher.sh '--enable-gpu[count=1]'`，否则 zsh（macOS 默认 shell）会因 `no matches found` 而中止。
- `docker-cleanup.sh`：停止 Compose 项目，并通过 `docker compose down -v` **删除所有数据卷**，包括你的聊天数据以及 Ollama 数据卷中所有已下载的模型。销毁数据前会提示确认。
- `docker-run.sh`：构建 Open WebUI 镜像并运行单个容器，通过 `OPEN_WEBUI_PORT`（默认 `3000`）暴露该容器。它不会设置 `WEBUI_SECRET_KEY`，因此在将容器用于快速测试之外的任何用途之前，请在其 `docker run` 命令中添加该变量。
- `docker-ollama.sh`：拉取并运行官方 Ollama 容器，支持可选的 GPU 直通，通过 `OLLAMA_PORT`（默认 `11434`）暴露该容器。
- `docker-update-models.sh`：遍历 Ollama 容器中已安装的每个模型，并拉取最新版本。

---


## 卸载 {#uninstall}



1.  **停止并删除服务：**
    在包含 `docker-compose.yml` 文件的目录中运行以下命令：
    ```bash
    docker compose down
    ```

2.  **删除数据卷（可选，警告：删除所有数据）：**
    如果要彻底删除你的数据（聊天、设置等）：
    ```bash
    docker compose down -v
    ```
    或手动删除：
    ```bash
    docker volume rm <your_project_name>_open-webui
    ```

3.  **删除镜像（可选）：**
    ```bash
    docker rmi ghcr.io/open-webui/open-webui:main
    ```
