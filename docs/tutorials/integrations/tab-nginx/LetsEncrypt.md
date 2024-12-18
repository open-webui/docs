### Let's Encrypt

Let's Encrypt provides free SSL certificates trusted by most browsers, ideal for production environments.

#### Prerequisites

- **Certbot** installed on your system.
- DNS records properly configured to point to your server.

#### Steps

1. **Create Directories for Nginx Files:**

    ```bash
    mkdir -p conf.d ssl
    ```

2. **Create Nginx Configuration File:**

    **`conf.d/open-webui.conf`:**

    ```nginx
    server {
        listen 80;
        server_name your_domain_or_IP;

        location / {
            proxy_pass http://host.docker.internal:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # (Optional) Disable proxy buffering for better streaming response from models
            proxy_buffering off;
        }
    }
    ```

3. **Simplified Let's Encrypt Script:**

    **`enable_letsencrypt.sh`:**

    ```bash
    #!/bin/bash

    # Description: Simplified script to obtain and install Let's Encrypt SSL certificates using Certbot.

    DOMAIN="your_domain_or_IP"
    EMAIL="your_email@example.com"

    # Install Certbot if not installed
    if ! command -v certbot &> /dev/null; then
        echo "Certbot not found. Installing..."
        sudo apt-get update
        sudo apt-get install -y certbot python3-certbot-nginx
    fi

    # Obtain SSL certificate
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"

    # Reload Nginx to apply changes
    sudo systemctl reload nginx

    echo "Let's Encrypt SSL certificate has been installed and Nginx reloaded."
    ```

    **Make the script executable:**

    ```bash
    chmod +x enable_letsencrypt.sh
    ```

4. **Update Docker Compose Configuration:**

    Add the Nginx service to your `docker-compose.yml`:

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./conf.d:/etc/nginx/conf.d
          - ./ssl:/etc/nginx/ssl
        depends_on:
          - open-webui
    ```

5. **Start Nginx Service:**

    ```bash
    docker compose up -d nginx
    ```

6. **Run the Let's Encrypt Script:**

    Execute the script to obtain and install the SSL certificate:

    ```bash
    ./enable_letsencrypt.sh
    ```

#### Access the WebUI

Access Open WebUI via HTTPS at:

[https://your_domain_or_IP](https://your_domain_or_IP)
