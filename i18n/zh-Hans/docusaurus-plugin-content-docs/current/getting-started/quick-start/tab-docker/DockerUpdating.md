## 更新 {#updating}

要将本地 Docker 安装更新到最新版本，可以使用 **Watchtower**，也可以手动更新容器。

### 方式 1：使用 Watchtower {#option-1-using-watchtower}

借助 [Watchtower](https://github.com/nicholas-fedor/watchtower)，你可以自动完成更新过程：

```bash
docker run --rm --volume /var/run/docker.sock:/var/run/docker.sock nickfedor/watchtower --run-once open-webui
```

*（如果容器名称不同，请将 `open-webui` 替换为你的容器名称。）*

### 方式 2：手动更新 {#option-2-manual-update}

1. 停止并删除当前容器：

   ```bash
   docker rm -f open-webui
   ```

2. 拉取最新版本：

   ```bash
   docker pull ghcr.io/open-webui/open-webui:main
   ```

   请拉取与当前运行容器相同的标签，例如 `:cuda`、`:ollama` 或某个版本标签，并在第 3 步中再次使用该标签。拉取 `:main` 不会更新从 `:cuda` 启动的容器所用镜像，因此该容器仍会启动旧版本。

3. 重新启动容器：

   ```bash
   docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data \
     -e WEBUI_SECRET_KEY="your-secret-key" \
     --name open-webui --restart always \
     ghcr.io/open-webui/open-webui:main
   ```

:::warning 设置 WEBUI_SECRET_KEY
如果未持久设置 `WEBUI_SECRET_KEY`，每次重新创建容器后你都会退出登录。可使用 `openssl rand -hex 32` 生成一个密钥。
:::

有关版本固定、回滚、自动更新工具和备份流程，请参阅[完整更新指南](/getting-started/updating)。
