### Nginx Proxy Manager

Nginx Proxy Manager (NPM) allows you to easily manage reverse proxies and secure your local applications, like Open WebUI, with valid SSL certificates from Let's Encrypt.
This setup enables HTTPS access, which is necessary for using voice input features on many mobile browsers due to their security requirements, without exposing the application's specific port directly to the internet.

#### Prerequisites

- A home server running Docker and open-webui container running.
- A domain name (free options like DuckDNS or paid ones like Namecheap/GoDaddy).
- Basic knowledge of Docker and DNS configuration.

#### Nginx Proxy Manager Steps

1. **Create Directories for Nginx Files:**

    ```bash
    mkdir ~/nginx_config
    cd ~/nginx_config
    ```

2. **Set Up Nginx Proxy Manager with Docker:**

    ```bash
    nano docker-compose.yml
    ```

```yaml
services:
  app:
    image: 'jc21/nginx-proxy-manager:latest'
    restart: unless-stopped
    ports:
      - '80:80'
      - '81:81'
      - '443:443'
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

Run the container:

```bash
docker-compose up -d
```

3. **Configure DNS and Domain:**

    - Log in to your domain provider (e.g., DuckDNS) and create a domain.
    - Point the domain to your proxy’s local IP (e.g., 192.168.0.6).
    - If using DuckDNS, get an API token from their dashboard.

###### Here is a simple example how it's done in https://www.duckdns.org/domains

4. **Set Up SSL Certificates:**

- Access Nginx Proxy Manager at http://server_ip:81. For example: ``192.168.0.6:81``

- Log in with the default credentials (admin@example.com / changeme). Change them as asked.
- Go to SSL Certificates → Add SSL Certificate → Let's Encrypt.
- Write your email and domain name you got from DuckDNS. One domain name contains an asterisk and another does not. Example: ``*.hello.duckdns.org`` and ``hello.duckdns.org``.
- Select Use a DNS challenge, choose DuckDNS, and paste your API token. example:
```dns_duckdns_token=f4e2a1b9-c78d-e593-b0d7-67f2e1c9a5b8```
- Agree to Let’s Encrypt terms and save. Change propagation time **if needed** (120 seconds).

5. **Create Proxy Hosts:**

- For each service (e.g., openwebui, nextcloud), go to Hosts → Proxy Hosts → Add Proxy Host.

- Fill in the domain name (e.g., openwebui.hello.duckdns.org).
- Set the scheme to HTTP (default), enable ``Websockets support`` and point to your Docker IP (if docker with open-webui is running on the same computer as NGINX manager, this will be the same IP as earlier (example: ``192.168.0.6``)
- Select the SSL certificate generated earlier, force SSL, and enable HTTP/2.

:::danger Critical: Configure CORS for WebSocket Connections

A very common and difficult-to-debug issue with WebSocket connections is a misconfigured Cross-Origin Resource Sharing (CORS) policy. When running Open WebUI behind a reverse proxy like Nginx Proxy Manager, you **must** set the `CORS_ALLOW_ORIGIN` environment variable in your Open WebUI configuration.

Failure to do so will cause WebSocket connections to fail, even if you have enabled "Websockets support" in Nginx Proxy Manager.

:::

:::tip Caching Best Practice

While Nginx Proxy Manager handles most configuration automatically, be aware that:

- **Static assets** (CSS, JS, images) are cached by default for better performance
- **Authentication endpoints** should never be cached
- If you add custom caching rules in NPM's "Advanced" tab, ensure you exclude paths like `/api/`, `/auth/`, `/signup/` , `/signin/`, `/sso/`, `/admin/`, `/signout/`, `/oauth/`, `/login/`, and `/logout/`

The default NPM configuration handles this correctly - only modify caching if you know what you're doing.

:::

**Example:**
If you access your UI at `https://openwebui.hello.duckdns.org`, you must set:

```bash
CORS_ALLOW_ORIGIN="https://openwebui.hello.duckdns.org"
```

You can also provide a semicolon-separated list of allowed domains. **Do not skip this step.**

:::

6. **Add your url to open-webui (otherwise getting HTTPS error):**

- Go to your open-webui → Admin Panel → Settings → General
- In the **Webhook URL** text field, enter your URL through which you will connect to your open-webui via Nginx reverse proxy. Example: ``hello.duckdns.org`` (not essential with this one) or ``openwebui.hello.duckdns.org`` (essential with this one).

#### Access the WebUI

Access Open WebUI via HTTPS at either ``hello.duckdns.org`` or ``openwebui.hello.duckdns.org`` (in whatever way you set it up).

:::note

Firewall Note: Be aware that local firewall software (like Portmaster) might block internal Docker network traffic or required ports. If you experience issues, check your firewall rules to ensure necessary communication for this setup is allowed.

:::
