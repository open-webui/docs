```bash
python -m pip install open-webui
open-webui serve
```

Open WebUI 运行在 [http://localhost:8080](http://localhost:8080)。设置 `DATA_DIR` 可指定数据的存储位置，例如 `DATA_DIR=~/.open-webui open-webui serve`。使用 `--host` 和 `--port` 可更改绑定地址，例如 `open-webui serve --port 3000`。

该命令会将一个密钥写入启动目录中的 `.webui_secret_key`，并用它为会话签名。请在环境中设置 `WEBUI_SECRET_KEY`，或始终从同一目录启动；密钥变更会使所有用户退出登录。

**找不到命令？** 请激活安装 Open WebUI 时使用的环境；`open-webui` 命令位于该环境的 `bin` 文件夹中（Windows 上为 `Scripts`）。

**需要尚未发布的修复？** PyPI 只提供正式版本。你可以在现有安装之外运行使用独立卷的 Docker `:dev` 镜像，或按照[开发 Open WebUI](/getting-started/advanced-topics/development)中的说明从 `dev` 分支运行。从源码检出目录或 Git URL 安装会运行构建钩子，需要 Node.js 和 npm 来构建前端；PyPI wheel 则不需要。

## 卸载 {#uninstall}


1. **卸载软件包：**
    ```bash
    pip uninstall open-webui
    ```

2. **删除数据（可选，删除所有数据）：** 删除你设置为 `DATA_DIR` 的目录。如果未设置，数据位于环境内部的 `site-packages/open_webui/data`；由于该目录是在运行时创建的，`pip uninstall` 会将其保留。
    ```bash
    rm -rf ~/.open-webui
    ```
