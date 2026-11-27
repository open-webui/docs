---
sidebar_position: 27
title: "OpenSERP"
---

:::tip

有关与网页搜索相关的所有环境变量（包括并发设置、结果数量等）的完整列表，请参阅[环境配置文档](/reference/env-configuration#web-search)。

:::

:::tip 故障排除

网页搜索遇到问题？请查看[网页搜索故障排除指南](/troubleshooting/web-search)，了解代理配置、连接超时和内容为空等常见问题的解决方法。

:::

[OpenSERP](https://github.com/karust/openserp) 是一个自托管抓取器，可返回多个主要搜索引擎的结果。与 [SearXNG](./searxng.md) 和 [YaCy](./yacy.md) 一样，它运行在你自己的基础设施上，**无需 API 密钥**，因此 Open WebUI 只需设置一个可访问的基础 URL。

Open WebUI 会调用其 `/mega/search` 端点，该端点同时查询 Google、Bing、Yandex、Baidu、DuckDuckGo 和 Ecosia，并返回合并后的结果。

## 1. 运行 OpenSERP {#1-run-openserp}

```bash
docker run -d --name openserp -p 7000:7000 karust/openserp serve -a 0.0.0.0 -p 7000
```

验证其是否响应：

```bash
curl "http://localhost:7000/mega/search?text=open+webui&limit=3"
```

如果 Open WebUI 本身运行在 Docker 中，`localhost` 指向的是 Open WebUI 容器，而不是你的主机。请改用 `http://host.docker.internal:7000`，或者将两个容器放在同一个 Docker 网络中并使用服务名称。

## 2. 将 Open WebUI 指向 OpenSERP {#2-point-open-webui-at-it}

1. 前往**设置（Settings）> 网页搜索（Web Search）**（管理员区域）。
2. 启用**网页搜索（Web Search）**。
3. 将**网页搜索引擎（Web Search Engine）**设为 `openserp`。
4. 将 **OpenSERP URL** 设为你的实例地址，例如 `http://localhost:7000`。只有选择 `openserp` 后才会显示此字段。
5. 保存。

也可以通过 [`OPENSERP_BASE_URL`](/reference/env-configuration#openserp_base_url) 设置基础 URL，其默认值为 `http://localhost:7000`。末尾可以带斜杠，发送请求前会将其移除。

## 3. 开始使用 {#3-use-it}

打开一个新聊天，在消息输入框的 **+** 菜单中开启**网页搜索（Web Search）**，然后发送查询。

:::warning 抓取搜索引擎时可能受到速率限制

OpenSERP 通过抓取搜索引擎结果页面获取结果，而不是使用官方 API。在负载较高时，这些搜索引擎可能会限制请求速率、显示验证码或阻止请求地址，在 Open WebUI 中表现为搜索失败。这是其结果获取方式的特性，而不是配置错误，也是无需 API 密钥所需要作出的权衡。

:::
