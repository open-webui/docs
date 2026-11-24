---
sidebar_position: 203
title: "HTTPS using Apache, Synology or IIS"
---

# HTTPS using Apache, Synology or IIS

Open WebUI streams chat replies and live updates over a Socket.IO connection at `/ws/socket.io`. By default the browser connects with the WebSocket transport only, with no polling fallback. Apache httpd, the Synology DSM reverse proxy and IIS each need a setting before they forward the WebSocket upgrade. Without it the page loads, but the live connection does not.

## Symptoms

- In **DevTools > Network**, requests to `/ws/socket.io/` fail or end with a status other than `101 Switching Protocols`, such as `400`.
- The browser console logs `connect_error`.

Serve Open WebUI from the root of its own hostname and forward every path unchanged. Serving it under a subpath is [not supported](/faq#q-can-i-serve-open-webui-under-a-subpath-such-as-examplecomopenwebui).

## Apache httpd

Load `mod_proxy`, `mod_proxy_http` and `mod_headers`. On Apache 2.4.46 and earlier, also load `mod_proxy_wstunnel`. Set up TLS with `mod_ssl` as described in Apache's [SSL/TLS how-to](https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html).

### Apache 2.4.47 and later

Since 2.4.47, `mod_proxy_http` can tunnel a protocol upgrade end to end through the `upgrade` parameter of `ProxyPass` ([mod_proxy: Protocol Upgrade](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#protoupgrade)). Apache tunnels the connection only when the backend answers `101 Switching Protocols`, which Open WebUI does on `/ws/socket.io`, so one rule covers the whole site:

```apache
<VirtualHost *:443>
    ServerName chat.example.com

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    ProxyTimeout 300

    ProxyPass        "/" "http://127.0.0.1:8080/" upgrade=websocket
    ProxyPassReverse "/" "http://127.0.0.1:8080/"
</VirtualHost>
```

### Apache 2.4.46 and earlier

Use `mod_proxy_wstunnel` with a `ws://` rule for the WebSocket path ([mod_proxy_wstunnel](https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html)). Open WebUI serves Socket.IO under `/ws`, so a `/ws/` rule covers `/ws/socket.io`. Place it before the catch-all `/` rule: Apache checks `ProxyPass` rules in the order they appear and the first match wins ([ProxyPass](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxypass)).

```apache
<VirtualHost *:443>
    ServerName chat.example.com

    ProxyPreserveHost On
    RequestHeader set X-Forwarded-Proto "https"
    ProxyTimeout 300

    ProxyPass        "/ws/" "ws://127.0.0.1:8080/ws/"
    ProxyPass        "/"    "http://127.0.0.1:8080/"
    ProxyPassReverse "/"    "http://127.0.0.1:8080/"
</VirtualHost>
```

### What each directive does

- `ProxyPreserveHost On` passes the browser's `Host` header to Open WebUI instead of `127.0.0.1:8080`. Apache turns this off by default.
- `mod_proxy_http` adds `X-Forwarded-For`, `X-Forwarded-Host` and `X-Forwarded-Server` on its own ([Reverse Proxy Request Headers](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#x-headers)), but not `X-Forwarded-Proto`. `RequestHeader set X-Forwarded-Proto "https"` adds it, so Open WebUI knows the browser used HTTPS.
- `ProxyTimeout 300` gives long requests the 300 seconds recommended in [Key configuration notes](/reference/https#key-configuration-notes).
- The web UI receives streamed replies over `/ws/socket.io`, so Apache's response buffering does not affect it while the WebSocket works. The `flushpackets` parameter of `ProxyPass` applies only to AJP and FastCGI backends, so adding it to an `http://` backend changes nothing.

## Synology DSM

The DSM reverse proxy forwards WebSocket only after you add the WebSocket header to the rule ([Synology: Login Portal > Advanced](https://kb.synology.com/en-global/DSM/help/DSM/AdminCenter/system_login_portal_advanced?version=7)):

1. Go to **Control Panel > Login Portal > Advanced** and click **Reverse Proxy > Create**.
2. Under **Source**, choose HTTPS, your hostname and port 443. Under **Destination**, choose HTTP, the host running Open WebUI and the port it listens on (for example `localhost` and `3000` when the container maps `3000:8080`).
3. Open the **Custom Header** tab, click **Create** and choose **WebSocket**.
4. Under **Advanced Settings**, raise **Proxy read timeout (sec.)** for long requests.
5. Click **Save**.

## IIS

IIS needs the WebSocket Protocol feature, introduced in IIS 8.0, plus URL Rewrite and Application Request Routing (ARR) to act as a reverse proxy:

1. Install **WebSocket Protocol**: in **Server Manager**, open **Add Roles and Features** and select **Web Server (IIS) > Web Server > Application Development > WebSocket Protocol** ([IIS 8.0 WebSocket Protocol Support](https://learn.microsoft.com/en-us/iis/get-started/whats-new-in-iis-8/iis-80-websocket-protocol-support)).
2. Install URL Rewrite and ARR. In IIS Manager, select the server node, open **Application Request Routing** and check **Enable proxy** ([Reverse Proxy with URL Rewrite v2 and Application Request Routing](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/reverse-proxy-with-url-rewrite-v2-and-application-request-routing)).
3. Add a rule to the site's `web.config`, under `system.webServer`, that forwards every path to Open WebUI:

```xml
<rewrite>
    <rules>
        <rule name="Open WebUI" stopProcessing="true">
            <match url="(.*)" />
            <action type="Rewrite" url="http://localhost:8080/{R:1}" />
        </rule>
    </rules>
</rewrite>
```

Microsoft's ARR walkthrough does not cover WebSocket traffic, so confirm the connection as described in [Check the connection](#check-the-connection).

## If the proxy cannot forward WebSocket

Set `ENABLE_WEBSOCKET_SUPPORT=false` and restart Open WebUI. The server then accepts only HTTP long-polling and refuses upgrades, and the browser connects with long-polling, which passes through any proxy that forwards ordinary requests. Two features need the WebSocket transport and stop working: [Tether](/ecosystem/tether) and [encrypted chats](/features/channels/encrypted-chats).

## Check the connection

Open **DevTools > Network**, filter by **WS** and reload the page. A working proxy shows a request to `/ws/socket.io/` with status `101`.

For `WEBUI_URL`, `CORS_ALLOW_ORIGIN`, upload size limits, timeouts and secure cookies, see [Key configuration notes](/reference/https#key-configuration-notes).
