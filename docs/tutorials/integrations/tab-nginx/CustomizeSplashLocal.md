### Host Splash Screen and Favicon Locally

To serve custom splash screen and favicon files from your server, add the following configuration to your Nginx `server` block in `open-webui.conf`:

```nginx
location ~* /(splash|favicon)\.(png|ico)$ {
    root /path/to/your/custom/files;
    access_log off;
    log_not_found off;
}
```

**Steps:**

1. **Place Custom Files:**

    Place your custom `splash.png` and `favicon.ico` files in the directory specified by `/path/to/your/custom/files`.

2. **Update Nginx Configuration:**

    Ensure the `root` directive points to the directory containing your custom files.

3. **Reload Nginx:**

    After making changes to the Nginx configuration, reload Nginx to apply the changes:

    ```bash
    sudo systemctl reload nginx  # If running Nginx directly
    ```

    Or, if using Docker Compose:

    ```bash
    docker compose restart nginx
    ```
