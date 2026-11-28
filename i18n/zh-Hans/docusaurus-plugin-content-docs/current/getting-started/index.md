---
sidebar_position: 100
title: "快速上手"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open WebUI 快速上手 {#getting-started-with-open-webui}

<ThemedImage
  alt="快速上手：一排逐级升高的台阶，第一级带有标记"
  sources={{
    light: useBaseUrl('/images/banners/getting-started-light.svg'),
    dark: useBaseUrl('/images/banners/getting-started-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**从零开始，在五分钟内完成第一次 AI 对话。**

Open WebUI 可运行在任何环境（Docker、Kubernetes、pip、裸机），并开箱即用地支持连接 Ollama、OpenAI 兼容和 Open Responses 模型服务提供方。选择一种安装方式，连接模型服务提供方，即可开始聊天。

---

## 快速开始 {#quick-start}

**安装 Open WebUI，连接模型，开始聊天。**

涵盖完成可用部署所需的一切。选择 Docker 可走最快路径，选择 Python 可进行轻量安装，选择 Kubernetes 可进行生产编排。每份指南都包含连接首个模型服务提供方的步骤。

| | |
| :--- | :--- |
| **Docker** | 单命令部署，官方推荐方式 |
| **Python（pip / uv）** | 适用于低资源环境或手动部署的轻量安装 |
| **Kubernetes（Helm）** | 支持扩展的生产级编排 |
| **桌面应用** | 原生应用，无需 Docker |
| **连接模型服务提供方** | Ollama、OpenAI、Anthropic、llama.cpp、vLLM 等 |
| **了解设置** | 了解管理员设置与用户设置如何协同工作 |

[**开始安装 →**](/getting-started/quick-start)

---

## 将 Open WebUI 作为应用使用 {#open-webui-as-an-app}

**已经在运行 Open WebUI？将它作为应用安装到任何设备上。**

Open WebUI 是一个渐进式 Web 应用（PWA）。你可以将它添加到手机主屏幕、桌面任务栏或程序坞，无需单独下载，即可通过任何浏览器获得全屏、接近原生应用的体验。

| | |
| :--- | :--- |
| **iPhone / iPad** | 分享（Share）→ 添加到主屏幕（Add to Home Screen） |
| **Android** | 菜单（Menu）→ 安装应用（Install app） |
| **Chrome / Edge** | 地址栏中的安装图标 |

[**安装为应用 →**](/getting-started/open-webui-as-app)

---

## Open WebUI 基础使用 {#essentials-for-open-webui}

**已安装并开始聊天，接下来呢？**

这些简短章节涵盖每位新用户最终都会希望自己第一天就了解的内容：插件是什么以及如何安装、为什么长对话最终会报错（以及上下文压缩如何处理这一问题）、为标题和自动补全提供支持的“隐形”任务模型、如何基于自己的文档开始使用检索增强生成（RAG）、Web 搜索、原生工具调用和 Open Terminal。

| | |
| :--- | :--- |
| **插件** | 工具（Tools）、管道（Pipes）、过滤器（Filters）、操作（Actions）：可扩展性概览 |
| **上下文管理** | 为什么长对话会遇到瓶颈以及如何处理 |
| **任务模型** | 将标题、标签和自动补全任务交给主模型以外的模型 |
| **基础 RAG** | 与自己的文档聊天 |
| **工具调用** | 原生模式和首批要安装的工具 |
| **Web 搜索** | 选择一个服务提供方，模型会在需要时进行搜索 |
| **Open Terminal** | 模型可在其中构建和运行内容的沙箱 Shell |

[**阅读基础使用指南 →**](/getting-started/essentials)

---

## 连接智能体 {#connect-an-agent}

**不止于简单的模型服务提供方，连接自主 AI 智能体。**

Hermes Agent 和 OpenClaw 等 AI 智能体自带工具（终端、文件操作、Web 搜索、记忆），并将 Open WebUI 用作功能丰富的聊天前端。智能体决定何时使用工具并执行工具，然后将结果流式返回给你。

| | |
| :--- | :--- |
| **Hermes Agent** | Nous Research 的智能体，具备终端、文件操作、Web 搜索和技能 |
| **OpenClaw** | 自托管智能体框架，支持 Shell 访问、Web 浏览和频道机器人 |

[**连接智能体 →**](/getting-started/quick-start/connect-an-agent)

---

## 共享 Open WebUI {#sharing-open-webui}

**通过一次部署，为整个组织提供 AI。**

Open WebUI 不只是一个本地 AI 界面。它旨在成为团队集中式 AI 操作系统。只需部署一次，即可获得简化的成员接入、协作智能、资源池化和集中式安全管理。

| | |
| :--- | :--- |
| **局域网与隧道** | Tailscale、Cloudflare Tunnels 和本地 IP 访问 |
| **反向代理** | 使用 Nginx、Caddy 或 HAProxy 保护实例 |
| **团队成员接入** | 管理员审批流程和企业版 SSO 集成 |
| **共享上下文** | 频道、共享聊天和公共知识库 |

[**了解如何共享 Open WebUI →**](/getting-started/sharing)

---

## 高级主题 {#advanced-topics}

**扩展、观测和自定义部署。**

超越基础用法。配置环境变量、连接外部数据库、添加云存储、启用 OpenTelemetry，或借助 Redis 和多个副本进行水平扩展。

| | |
| :--- | :--- |
| **扩展** | 多副本、多节点、基于 Redis 的会话 |
| **日志与可观测性** | OpenTelemetry 追踪、指标和结构化日志 |
| **开发环境搭建** | 从源码运行，用于本地开发和测试 |

[**探索高级主题 →**](/getting-started/advanced-topics)

---

## 更新 {#updating}

**持续获取最新功能和安全补丁。**

使用单条 Docker 或 pip 命令手动更新，或使用 Watchtower、WUD 或 Diun 自动更新。包含备份与恢复流程以及面向生产环境的版本固定。

| | |
| :--- | :--- |
| **手动更新** | Docker 拉取并重新创建，或 pip 升级 |
| **自动更新** | Watchtower、WUD 或 Diun |
| **版本固定** | 锁定特定版本以保持稳定 |
| **备份与恢复** | 单命令备份和恢复数据卷 |

[**更新指南 →**](/getting-started/updating)
