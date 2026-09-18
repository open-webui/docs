```bash
pip install open-webui
open-webui serve
```

Open WebUI is now on [http://localhost:8080](http://localhost:8080). Set `DATA_DIR` to choose where your data lives, for example `DATA_DIR=~/.open-webui open-webui serve`.

**Command not found?** Activate the environment you installed into; the `open-webui` command lives in its `bin` folder (`Scripts` on Windows).

**Need a fix that is not released yet?** PyPI carries releases only. Run the Docker `:dev` image beside your install with its own volume, or run from the `dev` branch as described in [Developing Open WebUI](/getting-started/advanced-topics/development).

## Uninstall


1. **Uninstall the package:**
    ```bash
    pip uninstall open-webui
    ```

2. **Remove data (optional, deletes all data):**
    ```bash
    rm -rf ~/.open-webui
    ```
