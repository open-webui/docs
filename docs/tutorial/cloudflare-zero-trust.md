---
sidebar_position: 13
title: "Deploying Open-WebUI with Cloudflare Zero Trust"
---

# Deploying Open-WebUI with Cloudflare Zero Trust

## Introduction

This tutorial will guide you through the process of deploying Open-WebUI using a Cloudflare tunnel with Zero Trust. This setup allows you to securely access your locally hosted Open-WebUI instance from anywhere in the world, without exposing your  directly to the internet.

![Open-WebUI using a Cloudflare tunnel with Zero Trust](https://github.com/user-attachments/assets/a9c165f3-a0f5-4962-ad1a-6d6bdc484e17)

*Open-WebUI using a Cloudflare tunnel with Zero Trust*

## Prerequisites

- Open-WebUI configured on your machine with Docker compose: [Getting Started Guide](https://docs.openwebui.com/getting-started/#docker-compose)
- A domain name
- A Cloudflare account to enable Zero Trust and manage the DNS of your domain name: [Cloudflare One Documentation](https://developers.cloudflare.com/cloudflare-one/)

---

## Step-by-Step Guide

### Step 1: Configure Your Domain in Cloudflare

First, ensure your domain is properly configured in Cloudflare.

1. Log into your Cloudflare account
2. Add your domain if it's not already there
3. Ensure your DNS records are properly set up

![Domain configured with Cloudflare DNS](https://github.com/user-attachments/assets/32f51074-6618-4d87-b050-b8da15f0d579)

*Domain configured with Cloudflare DNS*

### Step 2: Create a Cloudflare Tunnel

Create a tunnel in the Cloudflare Zero Trust dashboard.

1. Navigate to the Zero Trust dashboard
2. Go to "Networks" > "Tunnels"
3. Click "Create a tunnel"
4. Name your tunnel (e.g., "open-webui-tunnel")
5. Copy the token provided - you'll need this later

![Creating a new Cloudflare Tunnel](https://github.com/user-attachments/assets/563f81b1-0810-41a5-87a0-038c985eed2b)

*Creating a new Cloudflare Tunnel*

### Step 3: Modify Your Docker Compose File

Modify the default Docker Compose file to include the Cloudflare tunnel service.

```yaml
services:
  ollama:
    # ... (keep existing ollama configuration)
  open-webui:
    # ... (keep existing open-webui configuration)
    networks:
      - app-network
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    command: tunnel run
    environment:
      - TUNNEL_TOKEN=${CLOUDFLARE_TUNNEL_TOKEN}
    depends_on:
      - open-webui
    networks:
      - app-network

volumes:
  ollama: {}
  open-webui: {}

networks:
  app-network:
    driver: bridge
```

### Step 4: Create a .env File

Create a `.env` file in the same directory as your `docker-compose.yaml` to store your Cloudflare tunnel token.

```plaintext
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token_here
```

> **Important:** Never share or commit your `.env` file containing sensitive information.

### Step 5: Configure the Cloudflare Tunnel

Configure your tunnel in the Cloudflare Zero Trust dashboard.

1. In the dashboard, go to your tunnel's configuration
2. Add a public hostname:
   - Subdomain: e.g., "chat"
   - Domain: Your domain (e.g., "yourdomain.com")
   - Service: `http://open-webui:8080`

![Configuring the Cloudflare Tunnel](https://github.com/user-attachments/assets/836958a4-7410-41cb-80bf-50b6fc82dda0)

*Configuring the Cloudflare Tunnel*

### Step 6: Update Open-WebUI Configuration

Modify the open-webui service in your Docker Compose file to work behind the Cloudflare tunnel.

```yaml
open-webui:
  # ... (keep existing configuration)
  environment:
    - 'OLLAMA_BASE_URL=http://ollama:11434'
    - 'WEBUI_SECRET_KEY='
    - 'WEBUI_SSL=false'
    - 'WEBUI_ROOT_PATH='
  networks:
    - app-network
```

### Step 7: Deploy Your Services

Deploy your services using Docker Compose.

1. Save all changes to your `docker-compose.yaml` and `.env` files
2. Run the following commands:

   ```bash
   docker-compose down
   docker-compose up -d
   ```

3. Check the logs to ensure everything is running correctly:

   ```bash
   docker-compose logs -f cloudflared open-webui
   ```

![Example of Docker Compose logs showing successful deployment](https://github.com/user-attachments/assets/57b5a9d7-0175-4e3e-985b-dac727d7accd)

*Example of Docker Compose logs showing successful deployment*

---

## Conclusion

You should now have Open-WebUI running behind a Cloudflare tunnel with Zero Trust. You can access your instance securely from anywhere using the URL you configured (e.g., `https://chat.yourdomain.com`).

> **Remember:** Keep your `.env` file and Cloudflare tunnel token secure, as they provide access to your tunnel.
