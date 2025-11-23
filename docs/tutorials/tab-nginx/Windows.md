### Using a Self-Signed Certificate and Nginx on Windows without Docker

For basic internal/development installations, you can use nginx and a self-signed certificate to proxy Open WebUI to https, allowing use of features such as microphone input over LAN. (By default, most browsers will not allow microphone input on insecure non-localhost urls)

This guide assumes you installed Open WebUI using pip and are running `open-webui serve`

#### Step 1: Installing openssl for certificate generation

You will first need to install openssl

You can download and install precompiled binaries from the [Shining Light Productions (SLP)](https://slproweb.com/) website.

Alternatively, if you have [Chocolatey](https://chocolatey.org/) installed, you can use it to install OpenSSL quickly:

1. Open a command prompt or PowerShell.
2. Run the following command to install OpenSSL:

   ```bash
   choco install openssl -y
   ```

---

### **Verify Installation**

After installation, open a command prompt and type:

```bash
openssl version
```

If it displays the OpenSSL version (e.g., `OpenSSL 3.x.x ...`), it is installed correctly.

#### Step 2: Installing nginx

Download the official Nginx for Windows from [nginx.org](https://nginx.org) or use a package manager like Chocolatey.
 Extract the downloaded ZIP file to a directory (e.g., C:\nginx).

#### Step 3: Generate certificate

Run the following command:

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx.key -out nginx.crt
```

Move the generated nginx.key and nginx.crt files to a folder of your choice, or to the C:\nginx directory

#### Step 4: Configure nginx

Open C:\nginx\conf\nginx.conf in a text editor

If you want Open WebUI to be accessible over your local LAN, be sure to note your LAN ip address using `ipconfig` e.g., 192.168.1.15

Set it up as follows:

```conf

#user  nobody;
worker_processes  1;

#error_log  logs/error.log;

#error_log  logs/error.log  notice;

#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    sendfile        on;
    keepalive_timeout  120;

    map $http_upgrade $connection_upgrade {
        default upgrade;
        ''      close;
    }

    server {
        listen 80;
        server_name 192.168.1.15;

        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl;
        server_name 192.168.1.15;

        ssl_certificate C:\\nginx\\nginx.crt;
        ssl_certificate_key C:\\nginx\\nginx.key;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
        ssl_prefer_server_ciphers on;

        location ~* ^/(auth|api|oauth|admin|signin|signup|signout|login|logout|sso)/ {
            proxy_pass http://localhost:8080;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;

            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_buffering off;
            client_max_body_size 20M;
            proxy_read_timeout 10m;

            add_header Cache-Control "no-store, no-cache, must-revalidate" always;
            expires -1;
        }

        location ~* \.(css|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://localhost:8080;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            
            expires 7d;
            add_header Cache-Control "public, immutable";
        }

        location / {
            proxy_pass http://localhost:8080;

            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection $connection_upgrade;

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
}
```

Save the file, and check the configuration has no errors or syntax issues by running `nginx -t`. You may need to `cd C:\nginx` first depending on how you installed it

Run nginx by running `nginx`. If an nginx service is already started, you can reload new config by running `nginx -s reload`

---

You should now be able to access Open WebUI on https://192.168.1.15 (or your own LAN ip as appropriate). Be sure to allow windows firewall access as needed.
