
# Using Virtual Environments

Create isolated Python environments using `venv`.

## Venv Steps

1. **Create a Virtual Environment:**

   ```bash
   python3 -m venv venv
   ```

2. **Activate the Virtual Environment:**

   - On Linux/macOS:

     ```bash
     source venv/bin/activate
     ```

   - On Windows:

     ```bash
     venv\Scripts\activate
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
1. Ensure your virtual environment is **activated** (Step 2).
2. If you still get an error, try running it via Python directly: `python -m open_webui serve`
3. If you want to store your data in a specific place, use: `DATA_DIR=./data open-webui serve`
:::
