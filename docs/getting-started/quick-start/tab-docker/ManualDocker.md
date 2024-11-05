
# Manual Docker Setup

If you prefer to set up Docker manually, follow these steps.

## Step 1: Pull the Open WebUI Image

```bash
docker pull ghcr.io/open-webui/open-webui:main
```

## Step 2: Run the Container

```bash
docker run -d -p 3000:8080 -v open-webui:/app/backend/data --name open-webui ghcr.io/open-webui/open-webui:main
```

**Note:** For Nvidia GPU support, add `--gpus all` to the `docker run` command.

## Access the WebUI

After the container is running, access Open WebUI at:

[http://localhost:3000](http://localhost:3000)
