---
sidebar_position: 15
title: "与团队共享 Open WebUI"
sidebar_label: "共享 Open WebUI"
description: "让团队访问同一个 Open WebUI 实例，配置账户和资源权限，并以普通用户身份验证访问权限。"
---

# 与团队共享 Open WebUI {#sharing-open-webui}

共享一个 Open WebUI 实例，让团队成员可以通过浏览器使用已连接的模型。邀请用户之前，请配置网络访问、账户和权限。

Open WebUI 专为共享而构建。单个实例即可服务整个组织。用户只需打开浏览器即可开始聊天，无需按席位安装软件，无需客户端依赖，也无需让数据分散在不同机器上。

---

## 搭建小型团队环境 {#set-up-a-small-team}

先准备一个管理员账户和一个 Open WebUI 服务器可以访问的模型端点。小型团队可以从单个实例开始；当工作负载需要更大容量时，请参阅[扩展指南](/getting-started/advanced-topics/scaling)。

1. [安装 Open WebUI](/getting-started/quick-start)并[连接模型](/getting-started/quick-start/connect-a-provider)。确认管理员可以发送消息并收到回答。
2. 选择下方的一种[网络访问方式](#opening-your-instance-to-the-team)，检查团队成员能否打开登录页面。远程访问请使用 HTTPS。
3. [审批用户账户](#the-pending-queue)，或通过你的身份提供方[配置 SSO](/features/authentication-access/auth/sso)。
4. 创建[用户组](/features/authentication-access/rbac/groups)，并授予相应[模型](/features/workspace/models)和[知识库](/features/workspace/knowledge)的访问权限。同时检查[默认权限和组权限](/features/authentication-access/rbac/permissions)：权限可以叠加。
5. 以普通用户身份登录，并按照本页末尾的[访问权限检查](#verify-team-access)操作。管理员看到的界面不能证明团队成员拥有预期的访问权限。

共享实例不会自动共享每个人的文档或对话。请明确授予知识库访问权限；需要共享对话快照时，请使用[聊天共享](/features/chat-conversations/chat-features/chatshare)。

## 为团队协作而生 {#built-for-teams}

### 简化的加入流程 {#streamlined-onboarding}

最终用户无需安装任何软件、管理 Docker 或接触终端。他们只需打开浏览器，访问你的实例 URL 并登录。

### 协作智能 {#collaborative-intelligence}

共享实例意味着共享知识。

| | |
| :--- | :--- |
| **[Channels](/features/channels)** | 团队与 AI 模型实时协作的持久空间 |
| **共享聊天** | 向同事发送精确的对话快照。共享链接仅对你授予权限的用户和组可见；实例范围链接或免登录链接需要公共共享和开放共享聊天权限，这些权限对非管理员用户默认关闭 |
| **全局提示词与知识** | 构建专用 Agent，并立即提供给所有人使用 |

共享对话框还可以将聊天上传到 Open WebUI Community 网站。若要让所有内容仅保留在内部，请在 Settings > General（管理员区域）中关闭 **Community Sharing**（或在首次启动前设置 `ENABLE_COMMUNITY_SHARING=false`）。

### 共享算力 {#shared-compute}

运行本地模型时，一台高性能服务器（或集群）即可服务整个团队，无需每个工位都配备高性能硬件。

### 集中管理 {#centralized-administration}

从一个位置管理所有事务：控制用户可以访问哪些模型、配置[**基于角色的访问控制（RBAC）**](/features/authentication-access/rbac)、审查审计日志，以及按需限制功能。

---

## 向团队开放实例 {#opening-your-instance-to-the-team}

要共享实例，需要让它可以通过网络访问。常见方式有三种，涵盖简单的本地访问和生产级公共域名。

### 1. 零配置局域网（本地网络） {#1-zero-config-lan-local-network}

如果团队位于同一局域网或 VPN 中，他们可以使用你机器的局域网 IP 地址和端口访问 Open WebUI。

> `http://192.168.1.100:3000`

除非 [`HOST`](/reference/env-configuration#host) 或 `--host` 另有指定，否则 Open WebUI 会监听所有网络接口（`0.0.0.0`）。如果团队成员无法加载页面，请先检查以下事项：

- 在团队成员的设备上，使用主机的局域网 IP 地址。那里的 `localhost` 指向团队成员自己的设备。
- 使用主机端口：Docker 快速开始（`-p 3000:8080`）使用 `3000`，`open-webui serve` 使用 `8080`。
- 以 `-p 127.0.0.1:3000:8080` 发布的端口仅接受来自主机自身的连接。如需局域网访问，请以 `-p 3000:8080` 发布。请参阅 [Docker 端口发布](https://docs.docker.com/engine/network/port-publishing/)。
- 在主机防火墙中允许该端口的入站连接。在 Windows 上，检查当前所用网络配置文件（专用或公用）对应的规则。
- 如果 Open WebUI 在 WSL 2 中运行，其他设备默认无法访问它。请启用镜像网络模式，或按照[使用 WSL 访问网络应用程序](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan)中的说明添加 `netsh interface portproxy` 规则。

### 2. 安全专用网络（推荐） {#2-secure-private-networks-recommended}

适用于无需暴露在公共互联网上的远程团队。覆盖网络和安全隧道无需开放防火墙端口即可提供加密访问。

| | |
| :--- | :--- |
| **[Tailscale](/reference/https/tailscale)** | 带 MagicDNS 的私有网状网络（`https://open-webui.tailnet-name.ts.net`） |
| **[Cloudflare Tunnels](/reference/https/cloudflare-tunnel)** | 通过 Cloudflare 边缘节点开放访问，并由 Cloudflare Access（Zero Trust）提供保护 |
| **[ngrok](/reference/https/ngrok)** | 用于开发或测试的快速临时共享 |

### 3. 公共 HTTPS（反向代理） {#3-public-https-reverse-proxy}

对于生产部署，请将 Open WebUI 置于反向代理之后，在你自己的域名（例如 `ai.yourcompany.com`）上终止 SSL/TLS。

| | |
| :--- | :--- |
| **[Nginx](/reference/https/nginx)** | 业界标准的 Web 服务器和反向代理 |
| **[Caddy](/reference/https/caddy)** | 只需极少配置即可自动启用 HTTPS |
| **[HAProxy](/reference/https/haproxy)** | 高性能负载均衡和代理 |

---

## 让团队成员加入 {#onboarding-your-team}

实例可以通过网络访问后，你需要管理用户创建账户和登录的方式。

### 待审批队列 {#the-pending-queue}

第一个注册的用户会成为**管理员**。创建第一个账户会关闭 Settings > Authentication（管理员区域）中的 **New Sign Ups**，因此只有管理员重新开启后，其他用户才能注册。新账户随后会处于 **Pending** 状态，在管理员批准前无法访问模型或使用平台，除非此处的 **Default User Role** 设置为 `user`。`DEFAULT_USER_ROLE` 仅在首次启动时设置该值（之后以已保存的设置为准），而 `ENABLE_SIGNUP` 会在创建第一个账户时被覆盖为关闭。

### 企业单点登录（SSO） {#enterprise-single-sign-on-sso}

对于人工审批难以满足规模的组织，Open WebUI 可以与现有身份提供方集成。

| | |
| :--- | :--- |
| **OAuth / OIDC** | 通过 **Google**、**Microsoft**、**Okta** 或 **Keycloak** 进行身份验证 |
| **组映射** | 将 IdP 组直接映射到 Open WebUI 组 |
| **[SCIM 2.0](/features/authentication-access/auth/scim)** | 自动预配和取消预配用户与组 |

[**了解如何设置 SSO →**](/features/authentication-access/auth/sso)

## 验证团队访问权限 {#verify-team-access}

使用目标组中的普通账户，检查以下事项：

- 获授权的模型可见，并能回答测试消息。
- 共享知识库可以访问，并能回答测试文档中的问题。
- 该账户无法访问受限模型和受限知识库，包括无法通过直接链接访问。

使用组外账户重复检查，确认受限资源仍不可访问。如果任一账户看到的内容超出预期，请检查[组和资源访问权限](/features/authentication-access/rbac/groups#resource-access-rbac)。
