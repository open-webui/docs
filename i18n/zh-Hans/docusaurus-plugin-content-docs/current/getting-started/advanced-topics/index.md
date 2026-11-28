---
sidebar_position: 500
title: "高级主题"
---

# 高级主题

**超越默认配置：面向生产环境和项目贡献，扩展、调试及开发 Open WebUI。**

Open WebUI 开箱即可满足个人使用需求，但实际部署往往需要更多能力：生产级数据库、水平扩展、结构化日志和可观测性。本节涵盖从“能在我的笔记本电脑上运行”到“能为整个组织提供服务”之间的各项主题。

---

## 为什么需要高级主题？ {#why-advanced-topics}

### 突破单容器规模 {#scale-beyond-a-single-container}

默认的 SQLite 数据库和单工作进程配置仅适用于小规模团队。了解如何改用 PostgreSQL、添加 Redis 以共享状态、在负载均衡器后运行多个副本，以及选择外部向量数据库，无需重新设计部署架构。

### 有把握地调试 {#debug-with-confidence}

大规模部署出现问题时，第一个问题总是“日志里写了什么？”配置日志级别，为日志聚合系统启用结构化 JSON 输出，并接入 OpenTelemetry，获得覆盖整个技术栈的端到端追踪。

### 为项目做贡献 {#contribute-to-the-project}

搭建具有前端和后端热重载功能的本地开发环境，了解贡献工作流程，并开始提交拉取请求。

---

## 内容概览 {#whats-covered}

| | |
| :--- | :--- |
| **[扩展 Open WebUI](./scaling.md)** | 从 SQLite 迁移到 PostgreSQL，添加 Redis，运行多个副本，配置外部向量数据库，并设置共享存储和可观测性 |
| **[Open WebUI 日志](./logging.md)** | 配置日志级别、启用调试输出，并切换到结构化 JSON 日志，供生产环境日志聚合系统使用 |
| **[开发 Open WebUI](./development.md)** | 克隆仓库，并行运行前端和后端，在其他设备上测试，以及提交拉取请求 |
| **[加固 Open WebUI](./hardening.md)** | 为生产部署加强身份验证、密钥、CORS、安全标头、审计日志和网络访问控制 |
