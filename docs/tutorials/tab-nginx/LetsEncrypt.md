### Let's Encrypt

Let's Encrypt provides free SSL certificates trusted by most browsers, ideal for securing your production environment. 🔐

This guide uses a two-phase approach:

1.  **Phase 1:** Temporarily run Nginx to prove you own the domain and get a certificate from Let's Encrypt.
2.  **Phase 2:** Reconfigure Nginx to use the new certificate for a secure HTTPS connection.

#### Prerequisites

  * A **domain name** (e.g., `my-webui.com`) with a **DNS `A` record** pointing to your server's public IP address.
  * **Docker** and **Docker Compose** installed on your server.
  * Basic understanding of running commands in a terminal.

:::info
**Heads up\!** Let's Encrypt **cannot** issue certificates for an IP address. You **must** use a domain name.
:::

-----

### Step 1: Initial Setup for Certificate Validation

First, we'll set up the necessary files and a temporary Nginx configuration that allows Let's Encrypt's servers to verify your domain.

1. **Make sure you followed the [Prerequisites](#prerequisites) above.**

2. **Create the Directory Structure**

    From your project's root directory, run this command to create folders for your Nginx configuration and Let's Encrypt certificates:

    ```bash
    mkdir -p nginx/conf.d ssl/certbot/conf ssl/certbot/www
    ```

3. **Create a Temporary Nginx Configuration**

    Create the file `nginx/conf.d/open-webui.conf`. This initial config only listens on port 80 and serves the validation files for Certbot.

    ⚠️ **Remember to replace `<YOUR_DOMAIN_NAME>`** with your actual domain.

    ```nginx
    # nginx/conf.d/open-webui.conf

    server {
        listen 80;
        listen [::]:80;
        server_name <YOUR_DOMAIN_NAME>;

        # Route for Let's Encrypt validation challenges
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        # All other requests will be ignored for now
        location / {
            return 404;
        }
    }
    ```

4. **Update Your `docker-compose.yml`**

    Add the `nginx` service to your `docker-compose.yml` and ensure your `open-webui` service is configured to use the shared Docker network.

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        restart: always
        ports:
          # Expose HTTP and HTTPS ports to the host machine
          - "80:80"
          - "443:443"
        volumes:
          # Mount Nginx configs and SSL certificate data
          - ./nginx/conf.d:/etc/nginx/conf.d
          - ./ssl/certbot/conf:/etc/letsencrypt
          - ./ssl/certbot/www:/var/www/certbot
        depends_on:
          - open-webui
        networks:
          - open-webui-network

      open-webui:
        # Your existing open-webui configuration...
        # ...
        # Ensure it's on the same network
        networks:
          - open-webui-network
        # Expose the port internally to the Docker network.
        # You do NOT need to publish it to the host (e.g., no `ports` section is needed here).
        expose:
          - 8080

    networks:
        open-webui-network:
            driver: bridge
    ```

-----

### Step 2: Obtain the SSL Certificate

Now we'll run a script that uses Docker to fetch the certificate.

1.  **Create the Certificate Request Script**

    Create an executable script named `enable_letsencrypt.sh` in your project root.

    ⚠️ **Remember to replace `<YOUR_DOMAIN_NAME>` and `<YOUR_EMAIL_ADDRESS>`** with your actual information.

    ```bash
    #!/bin/bash
    # enable_letsencrypt.sh

    DOMAIN="<YOUR_DOMAIN_NAME>"
    EMAIL="<YOUR_EMAIL_ADDRESS>"

    echo "### Obtaining SSL certificate for $DOMAIN ###"

    # Start Nginx to serve the challenge
    docker compose up -d nginx

    # Run Certbot in a container to get the certificate
    docker run --rm \
      -v "./ssl/certbot/conf:/etc/letsencrypt" \
      -v "./ssl/certbot/www:/var/www/certbot" \
      certbot/certbot certonly \
      --webroot \
      --webroot-path=/var/www/certbot \
      --email "$EMAIL" \
      --agree-tos \
      --no-eff-email \
      --force-renewal \
      -d "$DOMAIN"

    if [[ $? != 0 ]]; then
        echo "Error: Failed to obtain SSL certificate."
        docker compose stop nginx
        exit 1
    fi

    # Stop Nginx before we apply the final config
    docker compose stop nginx
    echo "### Certificate obtained successfully! ###"
    ```

2.  **Make the Script Executable**

    ```bash
    chmod +x enable_letsencrypt.sh
    ```

3.  **Run the Script**

    Execute the script. It will automatically start Nginx, request the certificate, and then stop Nginx.

    ```bash
    ./enable_letsencrypt.sh
    ```

-----

### Important: Caching Configuration

When using NGINX with Open WebUI, proper caching is crucial for performance while ensuring authentication remains secure. The configuration below includes:

- **Cached**: Static assets (CSS, JS, fonts, images) for better performance
- **Not Cached**: Authentication endpoints, API calls, SSO/OAuth callbacks, and session data
- **Result**: Faster page loads without breaking login functionality

The configuration below implements these rules automatically.

### Step 3: Finalize Nginx Configuration for HTTPS

With the certificate saved in your `ssl` directory, you can now update the Nginx configuration to enable HTTPS.

1.  **Update the Nginx Configuration for SSL**

    **Replace the entire contents** of `nginx/conf.d/open-webui.conf` with the final configuration below.

    ⚠️ **Replace all 4 instances of `<YOUR_DOMAIN_NAME>`** with your domain.

    ```nginx
    # nginx/conf.d/open-webui.conf

    # Redirect all HTTP traffic to HTTPS
    server {
        listen 80;
        listen [::]:80;
        server_name <YOUR_DOMAIN_NAME>;

        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }

        location / {
            return 301 https://$host$request_uri;
        }
    }

    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        http2 on;
        server_name <YOUR_DOMAIN_NAME>;

        ssl_certificate /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/<YOUR_DOMAIN_NAME>/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers 'TLS_AES_128_GCM_SHA256:TLS_AES_256_GCM_SHA384:ECDHE-RSA-AES128-GCM-SHA256';
        ssl_prefer_server_ciphers off;

        location ~* ^/(auth|api|oauth|admin|signin|signup|signout|login|logout|sso)/ {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 10m;
            proxy_buffering off;
            client_max_body_size 20M;

            proxy_no_cache 1;
            proxy_cache_bypass 1;
            add_header Cache-Control "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0" always;
            add_header Pragma "no-cache" always;
            expires -1;
        }

        location ~* \.(css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            # Cache static assets for 7 days
            expires 7d;
            add_header Cache-Control "public, immutable";
        }

        location / {
            proxy_pass http://open-webui:8080;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_read_timeout 10m;
            proxy_buffering off;
            client_max_body_size 20M;

            add_header Cache-Control "public, max-age=300, must-revalidate";
        }
    }
    ```

2.  **Launch All Services**

    Start both Nginx and Open WebUI with the final, secure configuration.

    ```bash
    docker compose up -d
    ```

-----

### Step 4: Access Your Secure WebUI

You can now access your Open WebUI instance securely via HTTPS.

➡️ **`https://<YOUR_DOMAIN_NAME>`**

-----

### (Optional) Step 5: Setting Up Automatic Renewal

Let's Encrypt certificates expire every 90 days. You should set up a `cron` job to renew them automatically.

1.  Open the crontab editor:

    ```bash
    sudo crontab -e
    ```

2.  Add the following line to run a renewal check every day at 3:30 AM. It will only renew if the certificate is close to expiring.

    ```cron
    30 3 * * * /usr/bin/docker run --rm -v "<absolute_path>/ssl/certbot/conf:/etc/letsencrypt" -v "<absolute_path>/ssl/certbot/www:/var/www/certbot" certbot/certbot renew --quiet --webroot --webroot-path=/var/www/certbot --deploy-hook "/usr/bin/docker compose -f <absolute_path>/docker-compose.yml restart nginx"
    ```
