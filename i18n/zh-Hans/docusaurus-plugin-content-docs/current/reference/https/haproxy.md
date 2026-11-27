---
sidebar_position: 201
title: "使用 HAProxy 配置 HTTPS"
---


# 为 Open WebUI 配置 HAProxy

HAProxy（High Availability Proxy，高可用性代理）是一种专用的负载均衡和反向代理解决方案，具有高度可配置性，能够以相对较低的资源占用处理大量连接。更多信息请参阅：https://www.haproxy.org/

## 安装 HAProxy 和 Let's Encrypt {#install-haproxy-and-lets-encrypt}

首先，安装 HAProxy 和 Let's Encrypt 的 certbot：

### Redhat 衍生发行版 {#redhat-derivatives}

```sudo dnf install haproxy certbot openssl -y```

### Debian 衍生发行版 {#debian-derivatives}

```sudo apt install haproxy certbot openssl -y```

## HAProxy 配置基础 {#haproxy-configuration-basics}

HAProxy 的配置默认存储在 ```/etc/haproxy/haproxy.cfg``` 中。此文件包含决定 HAProxy 运行方式的所有配置指令。

让 HAProxy 与 Open WebUI 配合使用的基础配置相当简单。

```shell
 #---------------------------------------------------------------------

# 全局设置

#---------------------------------------------------------------------
global
    # 要让这些消息最终写入 /var/log/haproxy.log，你需要：
    #
    # 1) 配置 syslog 以接受网络日志事件。具体做法是
    #    在 /etc/sysconfig/syslog 的 SYSLOGD_OPTIONS 中
    #    添加 '-r' 选项
    #
    # 2) 配置将 local2 事件写入 /var/log/haproxy.log
    #    文件。可以在 /etc/sysconfig/syslog 中
    #    添加如下一行：
    #
    #    local2.*                       /var/log/haproxy.log
    #
    log         127.0.0.1 local2

    chroot      /var/lib/haproxy
    pidfile     /var/run/haproxy.pid
    maxconn     4000
    user        haproxy
    group       haproxy
    daemon

 # 如果 dh-param 过低，请进行调整
    tune.ssl.default-dh-param 2048

#---------------------------------------------------------------------

# 所有 'listen' 和 'backend' 节共用的默认设置

# 如果各块中未指定，则使用这些设置

#---------------------------------------------------------------------
defaults
    mode                    http
    log                     global
    option                  httplog
    option                  dontlognull
    option http-server-close
    option forwardfor       #except 127.0.0.0/8
    option                  redispatch
    retries                 3
    timeout http-request    300s
    timeout queue           2m
    timeout connect         120s
    timeout client          10m
    timeout server          10m
    timeout http-keep-alive 120s
    timeout check           10s
    maxconn                 3000

#http
frontend web
 # 非 SSL
    bind 0.0.0.0:80
 # SSL/TLS
 bind 0.0.0.0:443 ssl crt /path/to/ssl/folder/

    # Let's Encrypt SSL
    acl letsencrypt-acl path_beg /.well-known/acme-challenge/
    use_backend letsencrypt-backend if letsencrypt-acl

 # 子域名方式
    acl chat-acl hdr(host) -i subdomain.domain.tld
    use_backend owui_chat if chat-acl

# 将 SSL 请求传递给 Lets Encrypt
backend letsencrypt-backend
    server letsencrypt 127.0.0.1:8688

# OWUI 聊天
backend owui_chat
    # 添加 X-Forwarded-For；Open WebUI 会读取它和 X-Forwarded-Proto，用于客户端 IP 和 SSO 回调 URL
    option forwardfor
    option httpchk GET /health
 http-request set-header X-Forwarded-Proto https if { ssl_fc }
    server chat <ip>:3000 check
```

:::note 对多个实例进行负载均衡
Socket.IO 状态保存在每个进程中。要在多个 Open WebUI 容器之间进行负载均衡，或将 `UVICORN_WORKERS` 设置为大于 1，请设置 `WEBSOCKET_MANAGER=redis` 和 `REDIS_URL`、使用共享数据库，并在每个实例上设置相同的 `WEBUI_SECRET_KEY`。
:::

## WebSocket 和 HTTP/2 兼容性 {#websocket-and-http2-compatibility}

从较新的版本（包括 HAProxy 3.x）开始，HAProxy 可能默认启用 HTTP/2。虽然 HTTP/2 支持 WebSocket（RFC 8441），但当图标或数据开始通过 H2 隧道上的 WebSocket 加载时，某些客户端或后端配置可能会出现“冻结”或失去响应的情况。

如果遇到这些问题：
1. **为 WebSocket 强制使用 HTTP/1.1**：将 `option h2-workaround-bogus-websocket-clients` 添加到你的 `frontend` 或 `defaults` 节。这会阻止 HAProxy 向客户端通告 RFC 8441 支持，强制回退到更稳定的 HTTP/1.1 Upgrade 机制。
2. **后端版本**：确保后端连接使用 HTTP/1.1（`mode http` 的默认设置）。

在 `defaults` 或 `frontend` 中添加的示例：
```shell
defaults
    # ... 其他设置
    option h2-workaround-bogus-websocket-clients
```

你会看到，我们为 Open WebUI 和 Let's Encrypt 都配置了 ACL 记录（路由器）。WebSocket 不需要 TLS（`ws://` 通过普通 HTTP 即可工作）；HTTPS 是麦克风等浏览器功能所要求的，而获取 HTTPS 最简单的方式就是 Let's Encrypt。

Open WebUI 必须从主机名的根路径提供：前端会从域名根路径请求 `/api/...`、`/ws/socket.io` 和 `/_app/...`，且没有基础路径设置，因此请按子域名（例如 `chat.yourdomain.com`）路由，而不要按 `/owui/` 之类的路径路由。

:::info

你需要在 HAProxy 服务器上开放端口 80 和 443。Let's Encrypt 验证你的域名以及 HTTPS 流量都需要这些端口。你还需要确保 DNS 记录已正确配置为指向你的 HAProxy 服务器。如果你在家中运行 HAProxy，则需要在路由器上使用端口转发，将端口 80 和 443 转发到你的 HAProxy 服务器。

:::

## 使用 Let's Encrypt 签发 SSL 证书 {#issuing-ssl-certificates-with-lets-encrypt}

在启动 HAProxy 之前，你需要生成一个自签名证书作为占位符，直到 Let's Encrypt 签发正式证书。生成自签名证书的方法如下：

```shell
openssl req -x509 -newkey rsa:2048 -keyout /tmp/haproxy.key -out /tmp/haproxy.crt -days 3650 -nodes -subj "/CN=localhost"
```

然后，将密钥和证书合并为 HAProxy 可以使用的 PEM 文件：

```cat /tmp/haproxy.crt /tmp/haproxy.key > /etc/haproxy/certs/haproxy.pem```

:::info

请务必根据你的需求和配置更新 HAProxy 配置。

:::

设置好 HAProxy 配置后，就可以使用 certbot 获取和管理 SSL 证书。Certbot 会处理与 Let's Encrypt 的验证过程，并在证书即将到期时自动更新证书（前提是你使用 certbot 自动续期服务）。

你可以通过运行 `haproxy -c -f /etc/haproxy/haproxy.cfg` 来验证 HAProxy 配置。如果没有错误，可以使用 `systemctl start haproxy` 启动 HAProxy，并使用 `systemctl status haproxy` 验证它正在运行。

要确保 HAProxy 随系统启动，请运行 `systemctl enable haproxy`。

配置好 HAProxy 后，就可以使用 Let's Encrypt 签发有效的 SSL 证书。
首先，你需要在 Let's Encrypt 注册。此操作只需进行一次：

`certbot register --agree-tos --email your@email.com --non-interactive`

然后，你可以申请证书：

```shell
certbot certonly -n --standalone --preferred-challenges http --http-01-port-8688 -d yourdomain.com
```

证书签发后，你需要将证书和私钥文件合并为 HAProxy 可以使用的单个 PEM 文件。

```shell
cat /etc/letsencrypt/live/{domain}/fullchain.pem /etc/letsencrypt/live/{domain}/privkey.pem > /etc/haproxy/certs/{domain}.pem
chmod 600 /etc/haproxy/certs/{domain}.pem
chown haproxy:haproxy /etc/haproxy/certs/{domain}.pem
```

然后，你可以重启 HAProxy 以应用新证书：
`systemctl restart haproxy`

## HAProxy Manager（简便部署方案） {#haproxy-manager-easy-deployment-option}

如果你希望自动管理 HAProxy 配置和 Let's Encrypt SSL 证书，我编写了一个简单的 Python 脚本并创建了一个 Docker 容器，你可以用它来创建和管理 HAProxy 配置，以及管理 Let's Encrypt 证书的生命周期。

https://github.com/shadowdao/haproxy-manager

:::warning

如果使用该脚本或容器，请不要公开暴露端口 8000！

:::
