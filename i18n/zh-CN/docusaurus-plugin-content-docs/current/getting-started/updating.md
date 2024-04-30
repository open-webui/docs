# 更新

## 更新您的 Docker 镜像

确保您的 Open WebUI Docker 镜像安装保持最新，以确保您拥有最新的功能和安全更新。您可以手动更新您的安装，或使用 [Watchtower](https://containrrr.dev/watchtower/) 进行自动更新。

### 手动更新

按照以下步骤手动更新您的 Open WebUI：

1. **拉取最新的 Docker 镜像**：
   ```bash
   docker pull ghcr.io/open-webui/open-webui:main
   ```

2. **停止并删除现有容器**：
   - 此步骤确保您可以从更新后的镜像创建新容器。
   ```bash
   docker stop open-webui
   docker rm open-webui
   ```

3. **使用更新后的镜像创建新容器**：
   - 使用您最初用来创建容器的相同 `docker run` 命令，确保所有配置保持不变。
   ```bash
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
   ```

这个过程将您的 Open WebUI 容器更新到最新版本，同时保留您存储在 Docker 卷中的数据。

### 使用 Watchtower 更新

对于那些喜欢自动更新的人，Watchtower 可以监视您的 Open WebUI 容器并自动更新到最新版本。您有两种选择：运行一次以立即更新，或部署为持续自动化未来更新。

#### 运行一次 Watchtower

要立即更新容器而不持续运行 Watchtower，请使用以下命令。如果容器名称不同，请将 `open-webui` 替换为您的容器名称。

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower --run-once open-webui
```

#### 持续部署 Watchtower

如果您希望 Watchtower 持续监视并更新容器，无论何时有新版本可用，您可以将 Watchtower 作为持续服务运行。这种方法确保您的 Open WebUI 始终保持最新，无需任何手动干预。使用以下命令以这种方式部署 Watchtower：

```bash
docker run -d --name watchtower --volume /var/run/docker.sock:/var/run/docker.sock containrrr/watchtower open-webui
```

请记住，如果您的容器名称不同，请将 `open-webui` 替换为您的容器名称。这种配置允许您从最新的改进和安全补丁中获益，同时最大限度地减少停机时间和手动工作。

### 更新 Docker Compose 安装

如果您使用 Docker Compose 安装 Open WebUI，请按照以下步骤更新：

1. **拉取最新镜像**：
   - 此命令获取 `docker-compose.yml` 文件中指定的镜像的最新版本。
   ```bash
   docker compose pull
   ```

2. **使用最新镜像重新创建容器**：
   - 此命令基于新拉取的镜像重新创建容器，确保您的安装是最新的。更新不需要构建步骤。
   ```bash
   docker compose up -d
   ```

这种方法确保您的 Open WebUI 的 Docker Compose 安装（以及任何相关服务，如 Ollama）高效更新，无需手动管理容器。

## 更新您的直接安装

对于直接安装 Open WebUI 而未使用 Docker 的用户，更新同样重要，以确保访问最新功能和安全补丁。请记住，直接安装不受官方支持，您可能需要自行解决问题。以下是更新安装的方法：

### 拉取最新更改

导航到您的 Open WebUI 项目目录，并从存储库中拉取最新更改：

```sh
cd path/to/open-webui/
git pull origin main
```

将 `path/to/open-webui/` 替换为您的 Open WebUI 安装的实际路径。

### 更新依赖项

拉取最新更改后，更新项目依赖项。此步骤确保前端和后端依赖项都是最新的。

- **对于 Node.js（前端）**：

```sh
npm install
npm run build
```

- **对于 Python（后端）**：

```sh
cd backend
pip install -r requirements.txt -U
```

### 重新启动后端服务器

为了应用更新，您需要重新启动后端服务器。如果有正在运行的实例，请先停止它，然后再使用提供的脚本启动它。

```sh
bash start.sh
```

此命令应该在您的 Open WebUI 项目的 `backend` 目录中运行。

:::info

与基于 Docker 的安装相比，直接安装需要更多手动工作来更新。如果您经常需要更新并希望简化流程，请考虑过渡到基于 Docker 的设置以更轻松地管理。

:::

通过按照这些步骤，您可以更新 Open WebUI 的直接安装，确保您运行最新版本并获得所有好处。在开始更新过程之前，请记得备份任何关键数据或自定义配置，以防发生意外损失。

