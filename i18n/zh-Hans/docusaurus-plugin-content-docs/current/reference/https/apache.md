---
sidebar_position: 203
title: "使用 Apache、Synology 或 IIS 配置 HTTPS"
---

# 使用 Apache、Synology 或 IIS 配置 HTTPS

Open WebUI 通过 `/ws/socket.io` 上的 Socket.IO 连接流式传输聊天回复和实时更新。默认情况下，浏览器仅使用 WebSocket 传输进行连接，不回退到轮询。Apache httpd、Synology DSM 反向代理和 IIS 都需要先进行一项设置，才能转发 WebSocket 升级。如果没有该设置，页面可以加载，但实时连接无法建立。

## 症状 {#symptoms}

- 在 **DevTools > Network** 中，对 `/ws/socket.io/` 的请求失败，或以 `101 Switching Protocols` 之外的状态结束，例如 `400`。
- 浏览器控制台记录 `connect_error`。

请从独立主机名的根路径提供 Open WebUI，并原样转发每个路径。系统[不支持](/faq#q-can-i-serve-open-webui-under-a-subpath-such-as-examplecomopenwebui)在子路径下提供它。

## Apache httpd {#apache-httpd}

加载 `mod_proxy`、`mod_proxy_http` 和 `mod_headers`。在 Apache 2.4.46 及更早版本上，还要加载 `mod_proxy_wstunnel`。按照 Apache 的 [SSL/TLS 操作指南](https://httpd.apache.org/docs/2.4/ssl/ssl_howto.html)，使用 `mod_ssl` 设置 TLS。

### Apache 2.4.47 及更高版本 {#apache-2447-and-later}

从 2.4.47 开始，`mod_proxy_http` 可以通过 `ProxyPass` 的 `upgrade` 参数端到端隧道传输协议升级（[mod_proxy：协议升级](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#protoupgrade)）。只有后端响应 `101 Switching Protocols` 时，Apache 才会隧道传输连接；Open WebUI 会在 `/ws/socket.io` 上返回此响应，因此一条规则即可覆盖整个站点：

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

### Apache 2.4.46 及更早版本 {#apache-2446-and-earlier}

将 `mod_proxy_wstunnel` 与 WebSocket 路径的 `ws://` 规则结合使用（[mod_proxy_wstunnel](https://httpd.apache.org/docs/2.4/mod/mod_proxy_wstunnel.html)）。Open WebUI 在 `/ws` 下提供 Socket.IO，因此 `/ws/` 规则可以覆盖 `/ws/socket.io`。请将其放在通用 `/` 规则之前：Apache 按 `ProxyPass` 规则的出现顺序进行检查，并采用第一个匹配项（[ProxyPass](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#proxypass)）。

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

### 各指令的作用 {#what-each-directive-does}

- `ProxyPreserveHost On` 将浏览器的 `Host` 标头传递给 Open WebUI，而不是传递 `127.0.0.1:8080`。Apache 默认关闭此选项。
- `mod_proxy_http` 会自行添加 `X-Forwarded-For`、`X-Forwarded-Host` 和 `X-Forwarded-Server`（[反向代理请求标头](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html#x-headers)），但不会添加 `X-Forwarded-Proto`。`RequestHeader set X-Forwarded-Proto "https"` 会添加该标头，让 Open WebUI 知道浏览器使用了 HTTPS。
- `ProxyTimeout 300` 按照[关键配置说明](/reference/https#key-configuration-notes)中的建议，为长时间请求提供 300 秒的超时时间。
- Web 界面通过 `/ws/socket.io` 接收流式回复，因此 WebSocket 正常工作时，Apache 的响应缓冲不会影响它。`ProxyPass` 的 `flushpackets` 参数仅适用于 AJP 和 FastCGI 后端，因此将其添加到 `http://` 后端不会产生任何变化。

## Synology DSM {#synology-dsm}

只有在规则中添加 WebSocket 标头后，DSM 反向代理才会转发 WebSocket（[Synology：登录门户 > 高级](https://kb.synology.com/en-global/DSM/help/DSM/AdminCenter/system_login_portal_advanced?version=7)）：

1. 前往 **Control Panel > Login Portal > Advanced**（控制面板 > 登录门户 > 高级），点击 **Reverse Proxy > Create**（反向代理 > 新增）。
2. 在 **Source**（来源）下，选择 HTTPS、你的主机名和端口 443。在 **Destination**（目的地）下，选择 HTTP、运行 Open WebUI 的主机及其监听端口（例如，当容器映射 `3000:8080` 时，使用 `localhost` 和 `3000`）。
3. 打开 **Custom Header**（自定义标头）选项卡，点击 **Create**（新增），然后选择 **WebSocket**。
4. 在 **Advanced Settings**（高级设置）下，为长时间请求调高 **Proxy read timeout (sec.)**（代理读取超时时间，秒）。
5. 点击 **Save**（保存）。

## IIS {#iis}

IIS 需要 IIS 8.0 引入的 WebSocket Protocol 功能，以及 URL Rewrite 和 Application Request Routing（ARR），才能充当反向代理：

1. 安装 **WebSocket Protocol**：在 **Server Manager** 中打开 **Add Roles and Features**，然后选择 **Web Server (IIS) > Web Server > Application Development > WebSocket Protocol**（[IIS 8.0 WebSocket 协议支持](https://learn.microsoft.com/en-us/iis/get-started/whats-new-in-iis-8/iis-80-websocket-protocol-support)）。
2. 安装 URL Rewrite 和 ARR。在 IIS 管理器中选择服务器节点，打开 **Application Request Routing**，然后勾选 **Enable proxy**（[将 URL Rewrite v2 和 Application Request Routing 用于反向代理](https://learn.microsoft.com/en-us/iis/extensions/url-rewrite-module/reverse-proxy-with-url-rewrite-v2-and-application-request-routing)）。
3. 在站点的 `web.config` 中，在 `system.webServer` 下添加一条规则，将每个路径都转发到 Open WebUI：

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

Microsoft 的 ARR 演练未涵盖 WebSocket 流量，因此请按照[检查连接](#check-the-connection)中的说明确认连接。

## 如果代理无法转发 WebSocket {#if-the-proxy-cannot-forward-websocket}

设置 `ENABLE_WEBSOCKET_SUPPORT=false` 并重启 Open WebUI。此后，服务器仅接受 HTTP 长轮询并拒绝升级，浏览器则使用长轮询进行连接；任何能够转发普通请求的代理都可以传递这种连接。有两项功能需要 WebSocket 传输，并会停止工作：[Tether](/ecosystem/tether) 和[加密聊天](/features/channels/encrypted-chats)。

## 检查连接 {#check-the-connection}

打开 **DevTools > Network**，按 **WS** 筛选并重新加载页面。代理正常工作时，会显示一个状态为 `101` 的 `/ws/socket.io/` 请求。

有关 `WEBUI_URL`、`CORS_ALLOW_ORIGIN`、上传大小限制、超时和安全 Cookie，请参阅[关键配置说明](/reference/https#key-configuration-notes)。
