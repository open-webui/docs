# 在 WSL（适用于 Linux 的 Windows 子系统）中使用 Docker {#using-docker-with-wsl-windows-subsystem-for-linux}

本指南介绍如何在适用于 Linux 的 Windows 子系统（WSL）环境中安装 Docker 并运行 Open WebUI。

## 第 1 步：安装 WSL {#step-1-install-wsl}

如果尚未安装 WSL，请按照 Microsoft 官方文档进行安装：

[安装 WSL](https://learn.microsoft.com/en-us/windows/wsl/install)

## 第 2 步：安装 Docker Desktop {#step-2-install-docker-desktop}

Docker Desktop 是在 WSL 环境中运行 Docker 最简单的方式。它会自动处理 Windows 与 WSL 之间的集成。

1.  **下载 Docker Desktop：**
    [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

2.  **安装 Docker Desktop：**
    按照安装说明操作，确保在安装过程中选择“WSL 2”后端。

## 第 3 步：为 WSL 配置 Docker Desktop {#step-3-configure-docker-desktop-for-wsl}

1.  **打开 Docker Desktop：**
    启动 Docker Desktop 应用程序。

2.  **启用 WSL 集成：**
    - 前往 **设置 > 资源 > WSL 集成（Settings > Resources > WSL Integration）**。
    - 确保选中“启用与我的默认 WSL 发行版的集成（Enable integration with my default WSL distro）”复选框。
    - 如果使用的不是默认 WSL 发行版，请从列表中选择你使用的发行版。

## 第 4 步：运行 Open WebUI {#step-4-run-open-webui}

现在，你可以在 WSL 终端中按照标准 Docker 说明运行 Open WebUI。

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

## 重要注意事项 {#important-notes}

- **在 WSL 中运行 Docker 命令：**
  始终在 WSL 终端中运行 `docker` 命令，不要在 PowerShell 或命令提示符中运行。

- **文件系统访问：**
  使用卷挂载（`-v`）时，确保你的 WSL 发行版可以访问这些路径。
