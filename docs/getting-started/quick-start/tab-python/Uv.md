### Installation with `uv`

The `uv` runtime manager ensures seamless Python environment management for applications like Open WebUI. Follow these steps to get started:

#### 1. Install `uv`

Pick the appropriate installation command for your operating system:

- **macOS/Linux**:

  ```bash
  curl -LsSf https://astral.sh/uv/install.sh | sh
  ```

- **Windows**:

  ```powershell
  powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
  ```

#### 2. Run Open WebUI

Once `uv` is installed, running Open WebUI is a breeze. Use the command below, ensuring to set the `DATA_DIR` environment variable to avoid data loss. Example paths are provided for each platform:

- **macOS/Linux**:

  ```bash
  DATA_DIR=~/.open-webui uvx --python 3.11 open-webui@latest serve
  ```

- **Windows** (PowerShell):

  ```powershell
  $env:DATA_DIR="C:\open-webui\data"; uvx --python 3.11 open-webui@latest serve
  ```
