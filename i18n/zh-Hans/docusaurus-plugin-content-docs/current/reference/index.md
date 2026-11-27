---
sidebar_position: 150
title: "参考资料"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 参考资料

<ThemedImage
  alt="参考资料：四个叠放的抽屉，其中一个被拉出"
  sources={{
    light: useBaseUrl('/images/banners/reference-light.svg'),
    dark: useBaseUrl('/images/banners/reference-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**每个开关、端点和配置选项背后的技术细节。**

Open WebUI 具有高度可配置性。本节是环境变量、API 端点、网络架构、反向代理设置和生产环境监控的权威信息来源。无论你是在调整单项设置，还是设计多节点部署架构，都可以从这里开始。

---

## 环境变量配置 {#environment-variable-configuration}

**Open WebUI 启动时读取的每个开关、路径和机密，尽在一处。**

超过 200 个环境变量控制着身份验证、模型路由、存储、日志等功能。了解 `ConfigVar` 的行为，排查被忽略的设置，并找到你所需的确切变量。

| | |
| :--- | :--- |
| **身份验证与注册** | `ENABLE_SIGNUP`、`ENABLE_LOGIN_FORM`、`WEBUI_ADMIN_EMAIL`、OIDC/LDAP/SCIM |
| **模型连接** | Ollama、OpenAI、直接管道 URL、超时、负载均衡 |
| **存储与数据库** | SQLite、PostgreSQL、S3/GCS/Azure Blob、Redis |
| **日志与审计** | `GLOBAL_LOG_LEVEL`、JSON 日志、审计日志级别和路径 |
| **RAG 与检索** | 分块大小、重叠、嵌入引擎、重排序、向量数据库选择 |

[**浏览所有环境变量 →**](/reference/env-configuration)

---

## API 端点 {#api-endpoints}

**OpenAI 兼容和 Anthropic 兼容的 API，以及 RAG、文件管理和 Ollama 代理路由。**

Open WebUI 提供完整的 REST API，通过 Bearer 令牌或 JWT 进行身份验证。使用与 Web 界面相同的端点来构建自动化、聊天机器人和自定义集成。

| | |
| :--- | :--- |
| **聊天补全** | `POST /api/chat/completions`，兼容 OpenAI |
| **Anthropic 消息** | `POST /api/v1/messages`，可与 Anthropic SDK 和 Claude Code 配合使用 |
| **Ollama 代理** | `/ollama/api/*`，直通原生 Ollama 端点 |
| **文件与知识** | 上传文件、构建知识库、通过 RAG 查询 |
| **过滤器（入口/流/出口）** | 每个请求的入口、流和出口钩子 |

[**探索 API →**](/reference/api-endpoints)

---

## 服务器端工具调用 {#server-side-tool-calling}

**发送提示词，让 Open WebUI 运行工具，然后获得最终答案。**

这里提供了让模型在服务器上调用内置工具、工作区工具、MCP 服务器和 Open Terminal 所需的所有请求，调用时使用你的用户自身权限。涵盖流式和非流式、保存和不保存聊天，并最终给出一个可复用脚本。

| | |
| :--- | :--- |
| **完整的智能体循环** | 多轮原生工具调用，从聊天中读回结果 |
| **单请求模式** | 一次 HTTP 调用输入，一次补全输出，工具结果已应用 |
| **逐字段说明** | `chat_id`、`id`、`session_id`、`tool_ids`、`machine_id`、`features` |

[**在服务器端运行工具 →**](/reference/server-side-tool-calling)

---

## HTTPS 配置 {#https-configuration}

**使用 Nginx、Caddy 或 HAProxy 在 Open WebUI 前面终止 TLS。**

通过逐步的反向代理配置，使用 HTTPS 保护你的部署。每份指南都包括证书处理、WebSocket 支持和面向生产环境的安全加固设置。

| | |
| :--- | :--- |
| **Nginx** | 完整配置，包括 SSL 终止、WebSocket 代理和标头 |
| **Caddy** | 以最少的配置自动启用 HTTPS |
| **HAProxy** | 企业级负载均衡与 TLS 卸载 |
| **Cloudflare Tunnel** | 无需开放端口即可安全地公开 Open WebUI |
| **Tailscale** | 跨设备的私有加密访问，不向公共网络暴露 |
| **ngrok** | 用于开发和测试的即时 HTTPS 隧道 |

[**设置 HTTPS →**](/reference/https)

---

## API 密钥 {#api-keys}

**供脚本、机器人和集成以编程方式访问 Open WebUI。**

生成个人访问令牌，让外部代码可以调用与 Web 界面相同的端点。每个密钥都会继承创建它的用户的权限。

| | |
| :--- | :--- |
| **Bearer 令牌身份验证** | 标准 `Authorization: Bearer` 标头，适用于任何 HTTP 客户端 |
| **权限范围限定为用户** | 密钥继承你的角色和组权限 |
| **端点限制** | 可选择限制密钥能够访问的 API 路由 |

[**设置 API 密钥 →**](/features/authentication-access/api-keys)

---

## 监控 {#monitoring}

**使用 Uptime Kuma、OpenTelemetry、Prometheus 和 Grafana 观察你的部署。**

生产环境监控指南涵盖健康检查、模型连接验证、分布式追踪、指标和结构化日志。可以集成到现有的可观测性技术栈中，也可以从头搭建一套新的技术栈。

| | |
| :--- | :--- |
| **健康检查** | 使用 Uptime Kuma 进行基本检查、模型连接检查和深度健康检查 |
| **OpenTelemetry** | 将追踪、指标和日志传输到任何兼容 OTLP 的后端 |
| **仪表板** | 使用 Prometheus + Grafana 查看实时系统和模型指标 |

[**设置监控 →**](/reference/monitoring)

---

## 网络图 {#network-diagrams}

**了解 Open WebUI、Ollama 和 Docker 在不同部署拓扑中的通信方式。**

可视化 C4 图涵盖主机网络、Docker Compose 堆栈、独立网络和平台特定差异，可用于排查连接问题或规划架构。

| | |
| :--- | :--- |
| **macOS / Windows** | 主机上的 Ollama、Compose 堆栈、独立网络、主机网络陷阱 |
| **Linux** | 相同拓扑及 Linux 特定的网络行为 |

[**查看网络图 →**](/reference/network-diagrams)
