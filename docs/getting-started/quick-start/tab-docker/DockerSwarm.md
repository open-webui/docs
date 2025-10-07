## Docker Swarm

This installation method requires knowledge on Docker Swarms, as it utilizes a stack file to deploy 3 seperate containers as services in a Docker Swarm.

It includes isolated containers of ChromaDB, Ollama, and OpenWebUI.
Additionally, there are pre-filled [Environment Variables](https://docs.openwebui.com/getting-started/env-configuration) to further illustrate the setup.

Choose the appropriate command based on your hardware setup:

- **Before Starting**:

  Directories for your volumes need to be created on the host, or you can specify a custom location or volume.

  The current example utilizes an isolated dir `data`, which is within the same dir as the `docker-stack.yaml`.

      - **For example**:

        ```bash
        mkdir -p data/open-webui data/chromadb data/ollama
        ```

- **With GPU Support**:

#### Docker-stack.yaml

    ```yaml
    version: '3.9'

    services:
      openWebUI:
        image: ghcr.io/open-webui/open-webui:main
        depends_on:
            - chromadb
            - ollama
        volumes:
          - ./data/open-webui:/app/backend/data
        environment:
          DATA_DIR: /app/backend/data
          OLLAMA_BASE_URLS: http://ollama:11434
          CHROMA_HTTP_PORT: 8000
          CHROMA_HTTP_HOST: chromadb
          CHROMA_TENANT: default_tenant
          VECTOR_DB: chroma
          WEBUI_NAME: Awesome ChatBot
          CORS_ALLOW_ORIGIN: "*" # This is the current Default, will need to change before going live
          RAG_EMBEDDING_ENGINE: ollama
          RAG_EMBEDDING_MODEL: nomic-embed-text-v1.5
          RAG_EMBEDDING_MODEL_TRUST_REMOTE_CODE: "True"
        ports:
          - target: 8080
            published: 8080
            mode: overlay
        deploy:
          replicas: 1
          restart_policy:
            condition: any
            delay: 5s
            max_attempts: 3

      chromadb:
        hostname: chromadb
        image: chromadb/chroma:0.5.15
        volumes:
          - ./data/chromadb:/chroma/chroma
        environment:
          - IS_PERSISTENT=TRUE
          - ALLOW_RESET=TRUE
          - PERSIST_DIRECTORY=/chroma/chroma
        ports:
          - target: 8000
            published: 8000
            mode: overlay
        deploy:
          replicas: 1
          restart_policy:
            condition: any
            delay: 5s
            max_attempts: 3
        healthcheck:
          test: ["CMD-SHELL", "curl localhost:8000/api/v1/heartbeat || exit 1"]
          interval: 10s
          retries: 2
          start_period: 5s
          timeout: 10s

      ollama:
        image: ollama/ollama:latest
        hostname: ollama
        ports:
          - target: 11434
            published: 11434
            mode: overlay
        deploy:
          resources:
            reservations:
              generic_resources:
                - discrete_resource_spec:
                    kind: "NVIDIA-GPU"
                    value: 0
          replicas: 1
          restart_policy:
            condition: any
            delay: 5s
            max_attempts: 3
        volumes:
          - ./data/ollama:/root/.ollama

    ```

- **Additional Requirements**:

      1. Ensure CUDA is Enabled, follow your OS and GPU instructions for that.
      2. Enable Docker GPU support, see [Nvidia Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html " on Nvidia's site.")
      3. Follow the [Guide here on configuring Docker Swarm to with with your GPU](https://gist.github.com/tomlankhorst/33da3c4b9edbde5c83fc1244f010815c#configuring-docker-to-work-with-your-gpus)
  - Ensure *GPU Resource* is enabled in `/etc/nvidia-container-runtime/config.toml` and enable GPU resource advertising by uncommenting the `swarm-resource = "DOCKER_RESOURCE_GPU"`. The docker daemon must be restarted after updating these files on each node.

- **With CPU Support**:

    Modify the Ollama Service within `docker-stack.yaml` and remove the lines for `generic_resources:`

    ```yaml
        ollama:
      image: ollama/ollama:latest
      hostname: ollama
      ports:
        - target: 11434
          published: 11434
          mode: overlay
      deploy:
        replicas: 1
        restart_policy:
          condition: any
          delay: 5s
          max_attempts: 3
      volumes:
        - ./data/ollama:/root/.ollama
    ```

- **Deploy Docker Stack**:

  ```bash
  docker stack deploy -c docker-stack.yaml -d super-awesome-ai
  ```
