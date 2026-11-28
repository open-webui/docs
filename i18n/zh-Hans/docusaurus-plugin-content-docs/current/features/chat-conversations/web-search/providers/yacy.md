---
sidebar_position: 18
title: "Yacy"
---

:::warning

本教程为社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例自定义 Open WebUI。想要参与贡献？请查看贡献教程。

:::

:::tip

有关与网页搜索相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

## Yacy API {#yacy-api}

### 设置 {#setup}

1. 前往：`Settings` -> `Web Search`（管理员区域）
2. 开启 `Enable Web Search`
3. 在下拉菜单中将 `Web Search Engine` 设为 `yacy`
4. 将 `Yacy Instance URL` 设为以下示例之一：

    - `http://yacy:8090`（使用容器名称和暴露的端口，适用于基于 Docker 的部署）
    - `http://host.docker.internal:8090`（使用 `host.docker.internal` DNS 名称和主机端口，适用于基于 Docker 的部署）
    - `https://<yacy.local>:8443`（使用本地域名，适用于局域网访问）
    - `https://yacy.example.com`（为自托管 Yacy 实例使用自定义域名，适用于公网或私网访问）
    - `https://yacy.example.com:8443`（通过 Yacy 默认 HTTPS 端口使用 HTTPS）

5. 输入 Yacy 用户名；表单要求填写用户名后才能保存。如果你的 Yacy 实例需要身份验证，还需添加密码。Open WebUI 仅在 Yacy 请求身份验证时才发送凭据，因此未启用身份验证的实例可以使用任意用户名和空密码。
6. 点击保存

![显示 Yacy 配置的 Open WebUI 管理员面板](/images/tutorial_yacy.png)
