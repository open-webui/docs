## 使用虚拟环境 {#using-virtual-environments}

使用 `venv` 创建隔离的 Python 环境。

### Venv 步骤 {#venv-steps}

1. **创建虚拟环境：**

   安装 Python 3.12 后，请明确选择该版本：

   - 在 Linux/macOS 上：

     ```bash
     python3.12 -m venv venv
     ```

   - 在 Windows 上使用 Python 启动器：

     ```powershell
     py -3.12 -m venv venv
     ```

2. **激活虚拟环境：**

   - 在 Linux/macOS 上：

     ```bash
     source venv/bin/activate
     ```

   - 在 Windows 上：

     ```bash
     venv\Scripts\activate
     ```

3. **安装 Open WebUI：**

   ```bash
   python -m pip install open-webui
   ```

4. **启动服务器：**

   ```bash
   open-webui serve
   ```

:::tip 出现 'open-webui: command not found'？
如果终端提示该命令不存在：
1. 确保已**激活**虚拟环境（第 2 步）。
2. 如果要将数据存储在特定位置，请使用：`DATA_DIR=./data open-webui serve`
:::

### 卸载 {#uninstall}

1.  **删除虚拟环境：**
    直接删除 `venv` 文件夹：
    ```bash
    rm -rf venv
    ```

2.  **删除数据（警告：删除所有数据）：**
    如果未设置 `DATA_DIR`，数据目录位于 venv 内部（`.../site-packages/open_webui/data`），因此上文删除 `venv` 文件夹的操作已将其删除。如果设置了 `DATA_DIR`，请删除该目录：
    ```bash
    rm -rf ~/.open-webui
    ```

---
