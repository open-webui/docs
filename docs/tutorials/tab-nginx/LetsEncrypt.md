### Let's Encrypt

Let's Encrypt provides free SSL certificates trusted by most browsers, ideal for production environments.

#### Prerequisites

- `DNS A` records properly configured to point to your server's IP address.
- `Docker` and `Docker Compose` installed on your server.
- Basic understanding of `Nginx` and `Docker Compose`.

:::info
You will need to have a domain name pointing to your server's IP address to use Let's Encrypt. Certbot requires a valid domain to issue SSL certificates, and it won't work with just an IP address.
:::


#### Steps

1. **Make sure you followed the `Prerequisites` section.**

2. **Create Directory in Project Root Folder for Nginx Files:**

    ```bash
    mkdir -p nginx/conf.d ssl/certbot/conf ssl/certbot/www
    ```

3. **Create Nginx Configuration File:**

    **`nginx/conf.d/open-webui.conf`:**
    
    And replace `<YOUR_DOMAIN_NAME>` with your actual domain name.

    ```nginx
    # This block redirects all HTTP traffic to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name <YOUR_DOMAIN_NAME>;
    
        # Renewal location for Certbot challenges
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
    
        # Any other HTTP request gets redirected.
        location / {
            return 404;
        }
    }
    ```

4. **Simplified Let's Encrypt Script:**
    
    Create a script file in the project root folder:
    **`enable_letsencrypt.sh`:**

    And replace `<YOUR_DOMAIN_NAME>` and `<YOUR_EMAIL_ADDRESS>` with your actual domain and email address.

    ```bash
    #!/bin/bash

    # Description: Simplified script to obtain and install Let's Encrypt SSL certificates using Certbot.
    
    DOMAIN="<YOUR_DOMAIN_NAME>"   # Your actual domain (e.g., example.com)
    EMAIL="<YOUR_EMAIL_ADDRESS>"  # Your email address for urgent renewal and security notices (e.g., your@email.com)
    
    # Obtain SSL certificate
    sudo docker run --rm \
      -v "./ssl/certbot/conf:/etc/letsencrypt" \
      -v "./ssl/certbot/www:/var/www/certbot" \
      certbot/certbot certonly \
      --webroot \
      --webroot-path=/var/www/certbot \
      --email "$EMAIL" \
      --non-interactive \
      --agree-tos \
      --no-eff-email \
      -d "$DOMAIN"
   
    if [[ $? != 0 ]]; then
        echo "Error: Failed to obtain SSL certificate."
        exit 1
    fi
    echo "Let's Encrypt SSL certificate has been installed."
    ```

    **Make the script executable:**

    ```bash
    chmod +x enable_letsencrypt.sh
    ```

5. **Update Docker Compose Configuration:**

    Add the Nginx service to your `docker-compose.yml`:

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        restart: always
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - ./nginx/conf.d:/etc/nginx/conf.d
          - ./ssl/certbot/conf:/etc/letsencrypt
          - ./ssl/certbot/www:/var/www/certbot
        depends_on:
          - open-webui
        networks:
          - open-webui-network
   
    networks:
        open-webui-network:
            driver: bridge
    ```
   
   And ensure your `open-webui` service is also connected to the same Docker network and exposes the correct port within that network, since Nginx will proxy requests to it (this means that you do NOT need to expose port 8080 to the host, e.g., `ports: - "3000:8080"` is NOT needed):

    ```yaml
    services:
      open-webui:
        ...
        networks:
          - open-webui-network
        expose:
          - 8080
    ```

6. **Start Nginx Service:**

    ```bash
    docker compose up -d nginx
    ```

7. **Run the Let's Encrypt Script:**

    Execute the script to obtain and install the SSL certificate:

    ```bash
    ./enable_letsencrypt.sh
    ```
   
8. **Stop Nginx Service:**

    ```bash
    docker compose stop nginx
    ```
   
9. **Update Nginx Configuration for SSL:**

    After obtaining the certificate, update the Nginx configuration file `nginx/conf.d/open-webui.conf` to include SSL settings.

    And replace `<YOUR_DOMAIN_NAME>` with your actual domain name in all `4` instances.

    ```nginx
    # This block redirects all HTTP traffic to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name <YOUR_DOMAIN_NAME>;
    
        # Handle Certbot challenges for renewals
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
    
        # Redirect all other traffic
        location / {
            return 301 https://$host$request_uri;
        }
    }
    
    # This is the main server block for your application
    server {
        # Define the listening port and enable SSL
        listen 443 ssl;
        listen [::]:443 ssl;
    
        # Enable HTTP/2
        http2 on;
    
        server_name <YOUR_DOMAIN_NAME>;
    
        # Use the certificate files provided by Certbot
        ssl_certificate /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/privkey.pem;
    
        # Security enhancements
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256';
        ssl_prefer_server_ciphers off;
    
        location / {
            proxy_pass http://open-webui:8080;
    
            # Add full WebSocket support
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
    
            # Standard headers for proxying
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
    
            # Useful settings for apps like Open WebUI
            proxy_read_timeout 10m;
            proxy_buffering off;
            client_max_body_size 20M;
        }
    }
    ```

10. **Run Docker Compose to Start Nginx and Open WebUI:**

    ```bash
    docker compose up -d
    ```

#### Access the WebUI

Access Open WebUI via HTTPS at:

[https://your_domain_or_IP](https://your_domain_or_IP)
