# 使用 Podman {#using-podman}

Podman 是一个无守护进程的容器引擎，用于开发、管理和运行 OCI 容器。

## 基本命令 {#basic-commands}

- **运行容器：**

  ```bash
  podman run -d --name openwebui -p 3000:8080 -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key ghcr.io/open-webui/open-webui:main
  ```

- **列出正在运行的容器：**

  ```bash
  podman ps
  ```

## Podman 网络配置 {#networking-with-podman}

如果出现网络问题（尤其是在无根 Podman 中），可能需要调整网桥设置。

:::warning Slirp4netns 弃用
旧版 Podman 说明通常建议使用 `slirp4netns`。但 `slirp4netns` 已被**弃用**，并将在 **Podman 6** 中移除。

现代替代方案是 **[pasta](https://passt.top/passt/about/)**，它是 Podman 5.0 及更高版本的默认方案。
:::

### 访问宿主机（本地服务） {#accessing-the-host-local-services}

如果 Ollama 或其他服务直接运行在你的宿主机上，请使用特殊 DNS 名称 **`host.containers.internal`** 指向你的计算机。

#### 现代方式（Pasta——Podman 5 及更高版本的默认方案） {#modern-approach-pasta---default-in-podman-5}
通过 `host.containers.internal` 访问宿主机通常不需要任何特殊参数。

#### 旧版方式（Slirp4netns） {#legacy-approach-slirp4netns}
如果你使用较旧版本的 Podman，且无法使用 `pasta`：
1. 确保已安装 [slirp4netns](https://github.com/rootless-containers/slirp4netns)。
2. 启动容器时添加以下参数，以允许访问宿主机回环地址：

```bash
podman run -d --network=slirp4netns:allow_host_loopback=true --name openwebui -p 3000:8080 -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key ghcr.io/open-webui/open-webui:main
```

### 连接配置 {#connection-configuration}
进入 Open WebUI 后，前往你的头像 > **设置 > 连接（Settings > Connections）**（管理员部分），将 Ollama API 连接设置为：
`http://host.containers.internal:11434`

如果要在首次启动前完成设置，请在 `podman run` 命令中添加 `-e OLLAMA_BASE_URL=http://host.containers.internal:11434`。镜像默认值 `http://host.docker.internal:11434` 在 Podman 下无法解析。

高级配置请参阅 Podman [文档](https://podman.io/)。

## 卸载 {#uninstall}

要卸载通过 Podman 运行的 Open WebUI，请按以下步骤操作：

1.  **停止并删除容器：**
    ```bash
    podman rm -f openwebui
    ```

2.  **删除镜像（可选）：**
    ```bash
    podman rmi ghcr.io/open-webui/open-webui:main
    ```

3.  **删除卷（可选，警告：删除所有数据）：**
    如果要彻底删除你的数据（聊天、设置等）：
    ```bash
    podman volume rm open-webui
    ```
