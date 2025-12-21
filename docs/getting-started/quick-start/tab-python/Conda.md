
# Install with Conda

1. **Create a Conda Environment:**

   ```bash
   conda create -n open-webui python=3.11
   ```

2. **Activate the Environment:**

   ```bash
   conda activate open-webui
   ```

3. **Install Open WebUI:**

   ```bash
   pip install open-webui
   ```

4. **Start the Server:**

   ```bash
   open-webui serve
   ```

:::tip 'open-webui: command not found'?
If your terminal says the command doesn't exist:
1. Ensure your conda environment is **activated** (`conda activate open-webui`).
2. If you still get an error, try running it via Python directly: `python -m open_webui serve`
3. If you want to store your data in a specific place, use (Linux/Mac): `DATA_DIR=./data open-webui serve` or (Windows): `$env:DATA_DIR=".\data"; open-webui serve`
:::

## Uninstall

1.  **Remove the Conda Environment:**
    ```bash
    conda remove --name open-webui --all
    ```

2.  **Remove Data (WARNING: Deletes all data):**
    Delete your data directory (usually `~/.open-webui` unless configured otherwise):
    ```bash
    rm -rf ~/.open-webui
    ```
