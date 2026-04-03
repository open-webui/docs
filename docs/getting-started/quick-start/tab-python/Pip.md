### Installation with pip

The simplest way to install Open WebUI with Python.

#### 1. Install Open WebUI

```bash
pip install open-webui
```

#### 2. Start the server

```bash
open-webui serve
```

Open WebUI is now running at [http://localhost:8080](http://localhost:8080).

:::tip 'open-webui: command not found'?
1. If you used a virtual environment, make sure it's activated.
2. Try running directly: `python -m open_webui serve`
3. To store data in a specific location: `DATA_DIR=./data open-webui serve`
:::

## Uninstall

1. **Uninstall the package:**
    ```bash
    pip uninstall open-webui
    ```

2. **Remove data (optional, deletes all data):**
    ```bash
    rm -rf ~/.open-webui
    ```
