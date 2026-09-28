```bash
pip install open-webui
open-webui serve
```

Open WebUI is now on [http://localhost:8080](http://localhost:8080). Set `DATA_DIR` to choose where your data lives, for example `DATA_DIR=~/.open-webui open-webui serve`. Use `--host` and `--port` to change the bind address, for example `open-webui serve --port 3000`.

The command signs sessions with a key it writes to `.webui_secret_key` in the directory you start it from. Set `WEBUI_SECRET_KEY` in the environment, or always start from the same directory; a new key signs everyone out.

**Command not found?** Activate the environment you installed into; the `open-webui` command lives in its `bin` folder (`Scripts` on Windows).

**Need a fix that is not released yet?** PyPI carries releases only. Run the Docker `:dev` image beside your install with its own volume, or run from the `dev` branch as described in [Developing Open WebUI](/getting-started/advanced-topics/development). Installing from a source checkout or a Git URL runs the build hook, which needs Node.js and npm to build the frontend; the PyPI wheel does not.

## Uninstall


1. **Uninstall the package:**
    ```bash
    pip uninstall open-webui
    ```

2. **Remove data (optional, deletes all data):** delete the directory you set as `DATA_DIR`. Without it, the data is in `site-packages/open_webui/data` inside the environment, which `pip uninstall` leaves in place because it was created at run time.
    ```bash
    rm -rf ~/.open-webui
    ```
