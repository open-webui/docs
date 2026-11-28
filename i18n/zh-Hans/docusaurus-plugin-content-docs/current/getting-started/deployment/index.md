---
slug: /deployment/
sidebar_position: 0
title: "部署 Open WebUI"
---

# 部署 Open WebUI

选择在你的环境中运行 Open WebUI 的方式。可以从单个实例开始，也可以在需要多个应用副本时使用共享基础设施。

## 选择部署方式 {#choose-a-deployment}

| 部署方式 | 适用场景 | 指南 |
| :--- | :--- | :--- |
| Docker 或 Python | 你希望在自己管理的机器上运行一个实例。 | [快速开始](/getting-started/quick-start) |
| Kubernetes | 你的团队运营一个集群，并希望使用 Helm 部署。 | [Kubernetes 部署](/deployment/kubernetes) |
| AWS ECS / Fargate | 你希望使用由 AWS 管理、带 Application Load Balancer 的容器任务。 | [AWS ECS / Fargate](/deployment/aws-ecs) |
| Azure Container Apps | 你希望使用与 Azure 网络和服务集成的托管容器。 | [Azure Container Apps](/deployment/azure-container-apps) |
| Google Cloud Run | 你希望使用 Google Cloud 托管容器，并且能够适应请求时长和实例生命周期限制。 | [Google Cloud Run](/deployment/google-cloud-run) |
| 托管容器服务 | 你的组织在托管容器平台上运行应用。 | [容器服务](/enterprise/deployment/container-service) |
| 虚拟机上的 Python | 你在 VM 上管理应用进程和扩缩容。 | [VM 上的 Python / Pip](/enterprise/deployment/python-pip) |

### Docker Swarm {#docker-swarm}

| 指南 | 内容介绍 |
| :--- | :--- |
| [Docker Swarm](/deployment/docker-swarm) | 跨节点的 Swarm 栈，包含有 GPU 和无 GPU 两种情况 |

在你管理的机器上运行**单个实例**时，无论使用 Podman、WSL、Docker Desktop 扩展还是普通 Python 环境，均可参阅[快速开始选项卡](/getting-started/quick-start)。标签参考（包括 GPU、Ollama 和 slim 变体）请参阅 [Docker 镜像和标签](/getting-started/quick-start#image-variants)。

Kubernetes 指南既包含持久化的单副本安装，也包含使用共享 PostgreSQL、Redis 和对象存储的生产环境配置。

AWS、Azure 和 Google Cloud 指南介绍各平台的网络、密钥、数据库初始化和更新流程。它们使用外部数据库和对象存储，因此替换应用不会丢弃持久数据。

## 生产环境规划 {#plan-for-production}

在向用户开放部署之前，请配置身份验证、持久化、备份和监控。请参阅[加固指南](/getting-started/advanced-topics/hardening)、[扩缩容指南](/getting-started/advanced-topics/scaling)和[监控参考](/reference/monitoring)，了解相关配置。

模型推理与 Open WebUI 应用分开配置。通过[连接模型服务提供方](/getting-started/quick-start/connect-a-provider)连接现有模型服务器或托管 API。
