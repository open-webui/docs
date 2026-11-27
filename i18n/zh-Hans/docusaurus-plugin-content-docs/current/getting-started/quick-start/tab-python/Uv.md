## 使用 `uv` 安装 {#installation-with-uv}

`uv` 运行时管理器可让 Open WebUI 等应用无缝管理 Python 环境。按以下步骤开始：

### 1. 安装 `uv` {#1-install-uv}

选择适合你的操作系统的安装命令：

- **macOS/Linux**：

  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

- **Windows**：

  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```

### 2. 运行 Open WebUI {#2-run-open-webui}

安装 `uv` 后，即可轻松运行 Open WebUI。使用以下命令，并确保设置 `DATA_DIR` 环境变量以避免数据丢失。下方提供了各平台的路径示例：

- **macOS/Linux**：

  ```bash
  DATA_DIR=~/.open-webui uvx --python 3.12 open-webui@latest serve
  ```

- **Windows**（PowerShell）：

  ```powershell
  $env:DATA_DIR="C:\open-webui\data"; uvx --python 3.12 open-webui@latest serve
  ```

Open WebUI 运行在 [http://localhost:8080](http://localhost:8080)。

:::tip 为什么要设置 DATA_DIR？
设置 `DATA_DIR` 可确保聊天和设置保存在可预期的位置。如果未设置，`uvx` 可能将数据存储在临时文件夹中，该文件夹会在进程结束时被删除。
:::

### 卸载 {#uninstall}

要移除通过 `uvx` 运行的 Open WebUI：

1.  **停止服务器：**
    在运行服务器的终端中按 `Ctrl+C`。

2. **从 UV 卸载：**
    输入 `uv tool uninstall open-webui`

3.  **可用的清理命令：**
    `uvx` 命令以临时方式或从缓存运行应用。要删除缓存的组件：
    ```bash
    uv cache clean
    ```

4.  **删除数据（警告：删除所有数据）：**
    删除你设置为 `DATA_DIR` 的目录。如果未设置，数据位于上文已清理的缓存工具环境中，这正是上方提示你设置该变量的原因：
    ```bash
    rm -rf ~/.open-webui
    ```

---
