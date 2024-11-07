# Docker Setup
```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```
**Note:** For Nvidia GPU support, add `--gpus all`. You can also use the `:cuda` tag for CUDA or `:ollama` for the bundled Ollama variant.

For the latest bleeding-edge features, with potential bugs or occasional instability, use the `:dev` tag:
```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:dev
```

Access Open WebUI at: [http://localhost:3000](http://localhost:3000)