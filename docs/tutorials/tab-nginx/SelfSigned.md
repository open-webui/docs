### Self-Signed Certificate


Using self-signed certificates is suitable for development or internal use where trust is not a critical concern.

#### Steps

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
