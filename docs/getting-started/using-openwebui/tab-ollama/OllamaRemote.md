
### 🛠️ Bring Your Own Ollama (BYO Ollama)

If Ollama is running on the **host machine** or another server on your network, follow these steps.

#### Step 1: Check Available Models

- If Ollama is **local**, run:

  ```bash
  curl http://localhost:11434/v1/models
  ```

- If Ollama is **remote**, use:

  ```bash
  curl http://<remote-ip>:11434/v1/models
  ```

This confirms that Ollama is available and lists the available models.

#### Step 2: Set the OLLAMA_BASE_URL

If Ollama is running **remotely** or on the host, set the following environment variable:

```bash
export OLLAMA_HOST=<remote-ip>:11434
```

This ensures Open WebUI can reach the remote Ollama instance.

#### Step 3: Download Llama 3.2

From your local or remote machine, run:

```bash
ollama pull llama3.2
```

**Tip:** Use this command to download the 8-bit version from Hugging Face:

```bash
ollama pull hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:Q8_0
```

#### Step 4: Access the WebUI

You can now access the WebUI at:

[http://localhost:3000](http://localhost:3000)
