### Self-Signed Certificate

Using self-signed certificates is suitable for development or internal use where trust is not a critical concern.

#### Self-Signed Certificate Steps

1. **Create Directories for Nginx Files:**

    ```bash
    mkdir -p conf.d ssl
    ```

2. **Create Nginx Configuration File:**

    **`conf.d/open-webui.conf`:**

    ```nginx
    server {
        listen 443 ssl;
        server_name your_domain_or_IP;

        ssl_certificate /etc/nginx/ssl/nginx.crt;
        ssl_certificate_key /etc/nginx/ssl/nginx.key;
        ssl_protocols TLSv1.2 TLSv1.3;

        location ~* ^/(auth|api|oauth|admin|signin|signup|signout|login|logout|sso)/ {
            proxy_pass http://host.docker.internal:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_buffering off;
            client_max_body_size 20M;
            proxy_read_timeout 10m;

            # Disable caching for auth endpoints
            proxy_no_cache 1;
            proxy_cache_bypass 1;
            add_header Cache-Control "no-store, no-cache, must-revalidate" always;
            expires -1;
        }

        location ~* \.(css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://host.docker.internal:3000;
            proxy_http_version 1.1;
            proxy_set_header Host $host;

            expires 7d;
            add_header Cache-Control "public, immutable";
        }

        location / {
            proxy_pass http://host.docker.internal:3000;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_buffering off;

            client_max_body_size 20M;
            proxy_read_timeout 10m;

            add_header Cache-Control "public, max-age=300, must-revalidate";
        }
    }
    ```

3. **Generate Self-Signed SSL Certificates:**

    ```bash
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout ssl/nginx.key \
    -out ssl/nginx.crt \
    -subj "/CN=your_domain_or_IP"
    ```

4. **Update Docker Compose Configuration:**

    Add the Nginx service to your `docker-compose.yml`:

    ```yaml
    services:
      nginx:
        image: nginx:alpine
        ports:
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

#### Access the WebUI

Access Open WebUI via HTTPS at:

[https://your_domain_or_IP](https://your_domain_or_IP)

---
