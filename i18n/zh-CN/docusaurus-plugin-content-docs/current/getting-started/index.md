---
sidebar_position: 2
title: "🚀 Getting Started"
---

## 如何安装 🚀

:::info **用户角色和隐私的重要说明**

- **管理员创建：** Open WebUI 上注册的第一个帐户将被授予**管理员权限**。此帐户将对平台拥有全面控制权，包括用户管理和系统设置。

- **用户注册：** 所有随后注册的用户将默认将其帐户状态设置为**待定**。这些帐户需要管理员批准才能访问平台功能。

- **隐私和数据安全：** 我们将您的隐私和数据安全置于首位。请放心，所有输入到 Open WebUI 中的数据都存储在您的设备上。我们的系统旨在以隐私为先，确保不进行任何外部请求，且您的数据不会离开您的本地环境。我们致力于维护最高标准的数据隐私和安全，确保您的信息保持机密并在您的控制之下。

:::

<details>
<summary>开始之前</summary>
### 安装 Docker

#### Windows 和 Mac 用户：

- 从 [Docker 的官方网站](https://www.docker.com/products/docker-desktop) 下载 Docker Desktop。
- 按照网站上提供的安装说明进行操作。安装完成后，打开 Docker Desktop 确保它正常运行。

#### Ubuntu 用户：
1. **打开终端。**

2. **设置 Docker 的 apt 仓库：**
   - 更新您的软件包索引：
     ```bash
     sudo apt-get update
     ```
   - 安装允许 apt 使用 HTTPS 仓库的软件包：
     ```bash
     sudo apt-get install ca-certificates curl
     ```
   - 为 Docker apt 密钥环创建一个目录：
     ```bash
     sudo install -m 0755 -d /etc/apt/keyrings
     ```
   - 添加 Docker 的官方 GPG 密钥：
     ```bash
     sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
     sudo chmod a+r /etc/apt/keyrings/docker.asc
     ```
   - 将 Docker 仓库添加到 Apt 源中：
     ```bash
     echo \
       "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
       $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
       sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
     ```
     注意：如果您使用 Ubuntu 派生版，例如 Linux Mint，您可能需要使用 `UBUNTU_CODENAME` 代替 `VERSION_CODENAME`。
3. **安装 Docker 引擎：**
   - 再次更新软件包索引：
     ```bash
     sudo apt-get update
     ```
   - 安装 Docker 引擎、CLI 和 containerd：
     ```bash
     sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
     ```

4. **验证 Docker 安装：**
   - 使用以下命令运行一个测试镜像：
     ```bash
     sudo docker run hello-world
     ```
     此命令下载一个测试镜像并在容器中运行。如果成功，它将打印一个信息消息，确认 Docker 安装并正常工作。

#### 其他 Linux 发行版：

- 对于其他 Linux 发行版，请参考 [官方 Docker 文档](https://docs.docker.com/engine/install/) 以获取特定于您的发行版的安装说明。

### 确保您拥有最新版本的 Ollama：

- 从 [https://ollama.com/](https://ollama.com/) 下载最新版本。

### 验证 Ollama 安装：

- 安装 Ollama 后，请通过访问 [http://127.0.0.1:11434/](http://127.0.0.1:11434/) 在您的 Web 浏览器中验证其功能。请注意，端口号可能会根据您的安装而有所不同。

</details>

## 一行命令安装 Ollama 和 Open WebUI

#### 使用 Docker Compose

- 如果您尚未安装 Ollama，请使用 Docker Compose 进行简单安装。运行以下命令：

  ```bash
  docker compose up -d --build
  ```

- **对于 GPU 支持：** 使用另一个 Docker Compose 文件：

  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.gpu.yaml up -d --build
  ```

- **公开 Ollama API：** 使用另一个 Docker Compose 文件：

  ```bash
  docker compose -f docker-compose.yaml -f docker-compose.api.yaml up -d --build
  ```

#### 使用 `run-compose.sh` 脚本（Linux 或 Docker-Enabled WSL2 on Windows）

- 为脚本添加执行权限：

  ```bash
  chmod +x run-compose.sh
  ```

- 对于仅 CPU 的容器：

  ```bash
  ./run-compose.sh
  ```

- 对于 GPU 支持（请阅读关于 GPU 兼容性的注意事项）：

  ```bash
  ./run-compose.sh --enable-gpu
  ```

- 要构建最新的本地版本，请添加 `--build`：

  ```bash
  ./run-compose.sh --enable-gpu --build
  ```

## 使用 Docker 快速开始 🐳

:::info
使用 Docker 安装 Open WebUI 时，请确保在 Docker 命令中包含 `-v open-webui:/app/backend/data`。这一步骤至关重要，因为它确保您的数据库正确挂载，避免数据丢失。
:::

- **如果 Ollama 在您的计算机上**，请使用此命令：

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **如果 Ollama 在另一台服务器上**，请使用此命令：

- 要连接到另一台服务器上的 Ollama，请将 `OLLAMA_BASE_URL` 更改为服务器的 URL：

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- 安装完成后，您可以在 [http://localhost:3000](http://localhost:3000) 访问 Open WebUI。享受！ 😄

#### Open WebUI：服务器连接错误

在 Open WebUI Docker 容器和 Ollama 服务器之间遇到连接问题？这个问题经常出现，因为像来自 Ubuntu 仓库的 Docker 的打包版本不支持 `host.docker.internal` 别名直接访问主机。在容器内，引用 `localhost` 或 `127.0.0.1` 通常指向容器本身，而不是主机机器。

为解决此问题，我们建议在 Docker 命令中使用 `--network=host` 标志。此标志允许容器使用主机的网络堆栈，从而使容器中的 `localhost` 或 `127.0.0.1` 指向主机机器。结果，WebUI 可以成功连接到 `127.0.0.1:11434` 上的 Ollama 服务器。请注意，使用 `--network=host`，容器的端口配置直接与主机对齐，将访问链接更改为 `http://localhost:8080`。

**以下是您如何修改 Docker 命令**：

```bash
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

有关 Docker 中的网络和解决常见连接问题的详细信息，请访问我们的 [FAQ 页面](/faq/)。此页面为不同环境中 Open WebUI 的顺利运行提供了额外的背景和解决方案。

## 使用 Podman 安装

<details>
<summary>Rootless（Podman）本地 Open WebUI 与 Systemd 服务和自动更新</summary>

- **重要提示：** 请参考 Docker 文档，因为很多配置和语法与 [Podman](https://github.com/containers/podman) 可互换。另请参阅 [rootless_tutorial](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md)。此示例需要 [slirp4netns](https://github.com/rootless-containers/slirp4netns) 网络后端，以便在仅限于 localhost 时促进服务器监听和 Ollama 通信。

1. 拉取最新镜像：
   ```bash
   podman pull ghcr.io/open-webui/open-webui:main
   ```
2. 使用所需配置创建新容器：

   **注意：** `-p 127.0.0.1:3000:8080` 确保我们仅在 localhost 上监听，`--network slirp4netns:allow_host_loopback=true` 允许容器在 Ollama 也严格监听 localhost 时访问 Ollama。`--add-host=ollama.local:10.0.2.2 --env 'OLLAMA_BASE_URL=http://ollama.local:11434'` 为容器添加主机记录并配置 open-webui 使用友好的主机名。`10.0.2.2` 是用于 localhost 映射的默认 slirp4netns 地址。`--env 'ANONYMIZED_TELEMETRY=False'` 不是必需的，因为 Chroma 遥测已在代码中禁用，但作为示例包含在内。

   ```bash
    podman create -p 127.0.0.1:3000:8080 --network slirp4netns:allow_host_loopback=true --add-host=ollama.local:10.0.2.2 --env 'OLLAMA_BASE_URL=http://ollama.local:11434' --env 'ANONYMIZED_TELEMETRY=False' -v open-webui:/app/backend/data --label io.containers.autoupdate=registry --name open-webui ghcr.io/open-webui/open-webui:main
   ```
3. 为 systemd 用户服务准备：
   ```bash
    mkdir -p ~/.config/systemd/user/
    ```
4. 使用 Podman 生成用户服务：
    ```bash
      podman generate systemd --new open-webui > ~/.config/systemd/user/open-webui.service
    ```
5. 重新加载 systemd 配置：
    ```bash
    systemctl --user daemon-reload
    ```
6. 启用和验证新服务：
    ```bash
    systemctl --user enable open-webui.service
    systemctl --user start open-webui.service
    systemctl --user status open-webui.service
    ```
7. 启用和验证 Podman 自动更新：
    ```bash
    systemctl --user enable podman-auto-update.timer
    systemctl --user enable podman-auto-update.service
    systemctl --user status podman-auto-update
    ```
    使用以下命令进行干预运行（省略 `--dry-run` 以强制更新）：
    ```bash
    podman auto-update --dry-run
    ```
</details>

### 其他安装方法

要了解其他安装方法，例如使用 Kustomize 或 Helm，请查看 [INSTALLATION](/getting-started/installation)。加入我们的 [Open WebUI Discord 社区](https://discord.gg/5rJgQTnV4s) 获取更多帮助和信息。

### 更新 Docker 安装

有关手动更新本地 Docker 安装的详细说明，包括不使用 Watchtower 和通过 Docker Compose 进行更新的步骤，请参考我们的专门指南：[UPDATING](/getting-started/updating)。

要使用 Watchtower 进行快速更新，请使用以下命令。请记住，如果容器名称不同，请将 `open-webui` 替换为实际容器名称。

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once open-webui
```

在命令的最后部分，如果您的容器名称不同，请用您的容器名称替换 `open-webui`。

:::info

更新 Open WebUI 后，您可能需要刷新浏览器缓存以查看更改。

:::

### 构建和安装 🛠️

运行以下命令以安装：

```sh
git clone https://github.com/open-webui/open-webui.git
cd open-webui/

# Copying required .env file
cp -RPp .env.example .env

# Building Frontend Using Node
npm i
npm run build

# Serving Frontend with the Backend
cd ./backend
pip install -r requirements.txt -U
bash start.sh
```

您应该在 http://localhost:8080/ 上成功运行了 Open WebUI。享受！ 😄
