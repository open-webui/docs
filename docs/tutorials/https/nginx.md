---
sidebar_position: 200
title: "HTTPS using Nginx"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# HTTPS using Nginx

Ensuring secure communication between your users and the Open WebUI is paramount. HTTPS (HyperText Transfer Protocol Secure) encrypts the data transmitted, protecting it from eavesdroppers and tampering. By configuring Nginx as a reverse proxy, you can seamlessly add HTTPS to your Open WebUI deployment, enhancing both security and trustworthiness.

This guide provides three methods to set up HTTPS:

- **Self-Signed Certificates**: Ideal for development and internal use, using docker.
- **Let's Encrypt**: Perfect for production environments requiring trusted SSL certificates, using docker.
- **Windows+Self-Signed**: Simplified instructions for development and internal use on windows, no docker required.

:::danger Critical: Configure CORS for WebSocket Connections

A very common and difficult-to-debug issue with WebSocket connections is a misconfigured Cross-Origin Resource Sharing (CORS) policy. When running Open WebUI behind a reverse proxy like Nginx Proxy Manager, you **must** set the `CORS_ALLOW_ORIGIN` environment variable in your Open WebUI configuration.

Failure to do so will cause WebSocket connections to fail, even if you have enabled "Websockets support" in Nginx Proxy Manager.

### HTTP/2 and WebSockets

If you enable **HTTP/2** on your Nginx server, ensure that your proxy configuration still uses **HTTP/1.1** for the connection to the Open WebUI backend. This is crucial as most WebUI features (like streaming and real-time updates) rely on WebSockets, which are more stable when handled via HTTP/1.1 `Upgrade` than over the newer RFC 8441 (WebSockets over H2) in many proxy environments.

In your Nginx location block, always include:
```nginx
proxy_http_version 1.1;
proxy_set_header Upgrade $http_upgrade;
proxy_set_header Connection "upgrade";
```

:::

:::danger Critical: Disable Proxy Buffering for SSE Streaming

**This is the most common cause of garbled markdown and broken streaming responses.**

When Nginx's `proxy_buffering` is enabled (the default!), it re-chunks SSE streams arbitrarily. This breaks markdown tokens across chunk boundaries—for example, `**bold**` becomes `**` + `bold` + `**`—causing corrupted output with visible `##`, `**`, or missing words.

**You MUST include these directives in your Nginx location block:**

```nginx
# CRITICAL: Disable buffering for SSE streaming
proxy_buffering off;
proxy_cache off;
```

**Symptoms if you forget this:**
- Raw markdown tokens visible (`##`, `**`, `###`)
- Bold/heading markers appearing incorrectly
- Words or sections randomly missing from responses
- Streaming works perfectly when disabled, breaks when enabled

**Bonus:** Disabling buffering also makes streaming responses **significantly faster**, as content flows directly to the client without Nginx's buffering delay.

:::

Choose the method that best fits your deployment needs.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import NginxProxyManager from '../tab-nginx/NginxProxyManager.md';
import SelfSigned from '../tab-nginx/SelfSigned.md';
import LetsEncrypt from '../tab-nginx/LetsEncrypt.md';
import Windows from '../tab-nginx/Windows.md';

<!-- markdownlint-disable-next-line MD033 -->
<Tabs>
  <TabItem value="NginxProxyManager" label="Nginx Proxy Manager">
    <NginxProxyManager />
  </TabItem>
  <TabItem value="letsencrypt" label="Let's Encrypt">
    <LetsEncrypt />
  </TabItem>
  <TabItem value="selfsigned" label="Self-Signed">
    <SelfSigned />
  </TabItem>
  <TabItem value="windows" label="Windows">
    <Windows />
  </TabItem>
</Tabs>


## Caching Configuration

Proper caching significantly improves Open WebUI performance by reducing backend load and speeding up page loads. This section provides guidance for advanced users who want to implement server-side and client-side caching.

### Cache Zones

Define cache zones in your nginx `http` block to store cached responses:

```nginx
# General cache for pages and assets
proxy_cache_path /var/cache/nginx/openwebui levels=1:2 
    keys_zone=OPENWEBUI_CACHE:10m max_size=1g inactive=60m use_temp_path=off;

# Dedicated cache for images (profile pictures, model avatars)
proxy_cache_path /var/cache/nginx/openwebui_images levels=1:2 
    keys_zone=OPENWEBUI_IMAGES:10m max_size=2g inactive=7d use_temp_path=off;
```

:::note Create Cache Directories

You must create these directories and set proper ownership before nginx can use them:

```bash
sudo mkdir -p /var/cache/nginx/openwebui /var/cache/nginx/openwebui_images
sudo chown -R www-data:www-data /var/cache/nginx
```

Replace `www-data` with your nginx user (check with `ps aux | grep nginx`). Common alternatives: `nginx`, `nobody`.

:::

### What to Cache

| Content Type | Cache Duration | Notes |
|--------------|----------------|-------|
| Static assets (CSS, JS, fonts) | 7-30 days | Use `immutable` for versioned assets |
| Profile/model images | 1 day | Balance freshness vs performance |
| Static files (/static/) | 7 days | Favicons, default avatars |
| HTML pages | 5 minutes | Short cache with revalidation |
| Uploaded file content | 1 day | User uploads, generated images |

### What to Never Cache

:::danger Critical: Never Cache Authentication

These paths must **never** be cached to prevent security issues and broken logins:

- `/api/v1/auths/` - Authentication endpoints
- `/oauth/` - OAuth/SSO callbacks
- `/api/` (general) - Dynamic API responses
- `/ws/` - WebSocket connections

Always include these directives for auth endpoints:

```nginx
proxy_no_cache 1;
proxy_cache_bypass 1;
add_header Cache-Control "no-store, no-cache, must-revalidate";
```

:::

### Example: Image Caching

Profile images and model avatars benefit greatly from caching:

```nginx
# User and model profile images
location ~ ^/api/v1/(users/[^/]+/profile/image|models/model/profile/image)$ {
    proxy_pass http://your_backend;
    
    proxy_cache OPENWEBUI_IMAGES;
    proxy_cache_valid 200 302 1d;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    proxy_cache_key "$request_uri$is_args$args";
    
    # Force caching even without backend cache headers
    proxy_ignore_headers Cache-Control Expires Set-Cookie;
    proxy_hide_header Set-Cookie;
    
    # Client-side caching
    add_header Cache-Control "public, max-age=86400, stale-while-revalidate=604800" always;
    add_header X-Cache-Status $upstream_cache_status always;
    
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### Example: Static Asset Caching

```nginx
location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff|woff2|ttf|otf|eot)$ {
    proxy_pass http://your_backend;
    
    proxy_cache OPENWEBUI_CACHE;
    proxy_cache_valid 200 302 60m;
    proxy_cache_valid 404 1m;
    proxy_cache_use_stale error timeout updating http_500 http_502 http_503 http_504;
    proxy_cache_lock on;
    
    add_header Cache-Control "public, max-age=2592000";  # 30 days
    add_header X-Cache-Status $upstream_cache_status;
    
    etag on;
    if_modified_since exact;
}
```

### Cache Debugging

Add the `X-Cache-Status` header to verify caching is working:

```nginx
add_header X-Cache-Status $upstream_cache_status always;
```

Check the header in browser DevTools:
- `HIT` - Served from cache
- `MISS` - Fetched from backend, now cached
- `EXPIRED` - Cache expired, refreshed
- `BYPASS` - Cache intentionally skipped

### Trade-offs

:::warning Cache Invalidation

When images are cached aggressively, users may not see immediate updates after changing their profile picture. Consider:

- **Shorter cache times** (e.g., 1 hour) if users frequently update images
- **Longer cache times** (e.g., 1 day) for better performance in stable deployments
- Cache can be manually cleared with: `rm -rf /var/cache/nginx/openwebui_images/*`

:::

---

## Next Steps


After setting up HTTPS, access Open WebUI securely at:

- [https://localhost](https://localhost)

Ensure that your DNS records are correctly configured if you're using a domain name. For production environments, it's recommended to use Let's Encrypt for trusted SSL certificates.

---
