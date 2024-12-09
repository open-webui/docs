### Host Splash Screen and Favicon Externally

To serve custom splash screen and favicon files from an external website, configure Nginx to proxy these requests.

**Configuration:**

```nginx
location ~* /(splash|favicon)\.(png|ico)$ {
    # Rewrite the requested file to your custom file
    rewrite ^ /custom-openwebui-splash.png break;

    # Proxy the request to the external website
    proxy_pass https://your-external-website.com;
    proxy_ssl_verify off;           # Disable SSL verification if necessary
    access_log off;
    log_not_found on;
    proxy_cache_valid 200 302 10m;  # Cache successful responses for 10 minutes
    proxy_cache_valid 404 1m;       # Cache 404 responses for 1 minute
}
```

**Steps:**

1. **Host Custom Files Externally:**

    Ensure your custom `splash.png` and `favicon.ico` files are hosted on an external website (e.g., `https://your-external-website.com/custom-openwebui-splash.png`).

2. **Update Nginx Configuration:**

    Replace `https://your-external-website.com` with the actual URL where your custom files are hosted.

3. **Reload Nginx:**

    After updating the configuration, reload Nginx to apply the changes:

    ```bash
    sudo systemctl reload nginx  # If running Nginx directly
    ```

    Or, if using Docker Compose:

    ```bash
    docker compose restart nginx
    ```

**Notes:**

- If your external website uses an untrusted SSL certificate, setting `proxy_ssl_verify off` disables SSL verification. Use with caution.
- Ensure that the external website allows requests for your custom files and that they are publicly accessible.

