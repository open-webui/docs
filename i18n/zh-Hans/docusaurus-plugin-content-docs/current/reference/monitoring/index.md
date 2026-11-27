---
sidebar_position: 6
sidebar_key: reference-monitoring
title: "监控"
---

# 监控

**在用户发现问题之前，先了解故障。**

Open WebUI 提供健康和模型端点，可以轻松接入可用性监控、模型连接检查和端到端响应测试。无论你运行的是单个实例还是多节点部署，这些检查都能让你确信服务已启动、模型可访问，并且推理确实正常工作。

---

## 为什么要监控？ {#why-monitor}

### 快速发现中断 {#catch-outages-quickly}

每 60 秒运行一次健康检查，意味着你可以在一分钟内发现停机，而不是等到用户投诉时才知道。

### 验证模型连接 {#verify-model-connectivity}

Open WebUI 可能运行正常，而你的模型服务提供方却已宕机。监控 `/api/models` 端点可以发现这种断层。

### 端到端可靠性验证 {#end-to-end-confidence}

最深入的检查会发送真实提示词并验证响应。如果检查通过，你就知道整个管道都在工作：API、后端、模型服务提供方和推理。

---

## 关键功能 {#key-features}

| | |
| :--- | :--- |
| **健康端点** | 无需身份验证的 `/health` 检查，服务启动时返回 `200` |
| **模型连接** | 经过身份验证的 `/api/models` 检查可验证提供方连接 |
| **深度健康检查** | 发送真实的聊天补全并验证响应 |
| **Uptime Kuma 配置方案** | 为每个监控级别提供可直接使用的配置 |

---

## 级别 1：基本健康检查 {#level-1-basic-health-check}

`/health` 端点可公开访问（无需身份验证），并在服务运行时返回 `200 OK`。

```bash
curl http://your-open-webui-instance:8080/health
```

这只能验证 Web 服务器是否正在响应：`/health` 会无条件返回 `{"status": true}`。`GET /health/db` 会 ping 数据库，而 `GET /ready` 在启动完成并且数据库（以及配置时的 Redis）响应之前会返回 503，因此请使用 `/ready` 进行就绪探测。

### Uptime Kuma 设置 {#uptime-kuma-setup}

1. **添加新监控器**，类型选择 **HTTP(s)**
2. **URL：** `http://your-open-webui-instance:8080/health`
3. **间隔：** `60 seconds`
4. **重试次数：** `3`

---

## 级别 2：模型连接检查 {#level-2-model-connectivity-check}

`/api/models` 端点**需要身份验证**，可确认 Open WebUI 能否访问你的模型服务提供方并列出可用模型。

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
  http://your-open-webui-instance:8080/api/models
```

你需要一个 API 密钥。有关设置说明，请参阅 [API 密钥](/features/authentication-access/api-keys)。

:::tip 专用监控账户
创建一个**非管理员用户**（例如 `monitoring-bot`），从该账户生成 API 密钥，并将其用于所有监控请求。这样可以在密钥泄露时限制影响范围。
:::

### Uptime Kuma 设置 {#uptime-kuma-setup-1}

1. **监控器类型：** HTTP(s) - JSON Query
2. **URL：** `http://your-open-webui-instance:8080/api/models`
3. **方法：** GET
4. **标头：** `Authorization: Bearer YOUR_API_KEY`
5. **JSON 查询：** `$count(data[*])>0`
6. **预期值：** `true`
7. **间隔：** `300 seconds`（5 分钟）

### 高级 JSONata 查询 {#advanced-jsonata-queries}

| 目标 | 查询 |
| :--- | :--- |
| 至少一个 Ollama 模型 | `$count(data[owned_by='ollama'])>0` |
| 特定模型存在 | `$exists(data[id='gpt-5.6-sol'])` |
| 多个模型存在 | `$count(data[id in ['gpt-5.6-sol', 'gpt-5.6-luna']]) = 2` |

使用示例 API 响应，在 [jsonata.org](https://try.jsonata.org/) 上测试查询。

---

## 级别 3：深度健康检查 {#level-3-deep-health-check}

发送真实的聊天补全，对整个推理管道进行端到端验证。

```bash
curl -X POST http://your-open-webui-instance:8080/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Respond with the word HEALTHY"}],
    "model": "qwen3.6:27b",
    "temperature": 0
  }'
```

成功的响应会返回 `200 OK`，其中的聊天补全包含“HEALTHY”。这可以发现级别 1 和级别 2 会遗漏的模型加载失败、后端处理错误和提供方侧问题。

:::info
在 Uptime Kuma 中设置级别 3，需要一个带 POST 正文、身份验证标头和用于验证响应的 JSON 查询的 HTTP(s) 监控器。有关 POST 监控器配置，请参阅 [Uptime Kuma 文档](https://github.com/louislam/uptime-kuma)。
:::

---

## 后续步骤 {#next-steps}

- **[OpenTelemetry](/reference/monitoring/otel)** - 使用 Grafana、Prometheus、Jaeger 等进行分布式追踪、指标和日志记录
- **[API 密钥](/features/authentication-access/api-keys)** - 关于启用和生成 API 密钥以进行编程访问的完整指南
