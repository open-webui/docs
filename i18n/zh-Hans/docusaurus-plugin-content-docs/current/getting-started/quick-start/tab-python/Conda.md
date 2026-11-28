## 使用 Conda 安装 {#install-with-conda}

1. **创建 Conda 环境：**

   ```bash
   conda create -n open-webui python=3.12
   ```

2. **激活环境：**

   ```bash
   conda activate open-webui
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
1. 确保已**激活** Conda 环境（`conda activate open-webui`）。
2. 如果要将数据存储在特定位置，请使用（Linux/Mac）：`DATA_DIR=./data open-webui serve`；或（Windows）：`$env:DATA_DIR=".\data"; open-webui serve`
:::

### 卸载 {#uninstall}

1.  **删除 Conda 环境：**
    ```bash
    conda remove --name open-webui --all
    ```

2.  **删除数据（警告：删除所有数据）：**
    如果未设置 `DATA_DIR`，数据目录位于环境内部（`.../site-packages/open_webui/data`），因此上文删除环境的操作已将其删除。如果设置了 `DATA_DIR`，请删除该目录：
    ```bash
    rm -rf ~/.open-webui
    ```

---
