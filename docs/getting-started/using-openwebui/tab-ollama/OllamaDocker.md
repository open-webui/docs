
### 🐳 Ollama Inside Docker

If **Ollama is deployed inside Docker** (e.g., using Docker Compose or Kubernetes), the service will be available:

- **Inside the container**: `http://127.0.0.1:11434`
- **From the host**: `http://localhost:11435` (if exposed via host network)

#### Step 1: Check Available Models

- Inside the container:

  ```bash
  docker exec -it openwebui curl http://ollama:11434/v1/models
  ```

- From the host (if exposed):

  ```bash
  curl http://localhost:11435/v1/models
  ```

This command lists all available models and confirms that Ollama is running.

#### Step 2: Download Llama 3.2

Run the following command:

```bash
docker exec -it ollama ollama pull llama3.2
```

**Tip:** You can download other models from Hugging Face by specifying the appropriate URL. For example, to download a higher-quality **8-bit version of Llama 3.2**:

```bash
ollama pull hf.co/bartowski/Llama-3.2-3B-Instruct-GGUF:Q8_0
```

#### Step 3: Access the WebUI

Once everything is set up, access the WebUI at:

[http://localhost:3000](http://localhost:3000)
