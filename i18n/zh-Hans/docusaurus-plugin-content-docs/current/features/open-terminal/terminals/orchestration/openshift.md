---
sidebar_position: 9
title: "OpenShift"
---

# OpenShift

终端可以作为受限的每用户终端沙箱在 OpenShift 上运行。

受限的 OpenShift 配置以非 root Pod 运行终端。请使用预构建的终端镜像，并通过每个实例一个 Pod 的方式让 OpenShift 提供隔离边界。

## 支持的模式 {#supported-model}

- 每个实例一个 Open Terminal Pod。
- 通过 PVC 持久化用户文件。
- 可为每个终端配置镜像、环境变量、CPU、内存、存储和空闲超时。
- 文件浏览器、命令执行、笔记本以及镜像中已安装的工具。

## 受限 SCC 的限制 {#restricted-scc-limits}

受限的 OpenShift 路径在没有 root 权限的情况下运行，因此以下功能不可用：

- 使用 `OPEN_TERMINAL_PACKAGES` 在运行时安装操作系统软件包。
- 使用 `OPEN_TERMINAL_PIP_PACKAGES` 或 `OPEN_TERMINAL_NPM_PACKAGES` 在运行时进行全局安装。
- `sudo`、动态创建 Linux 用户或 `OPEN_TERMINAL_MULTI_USER=true`。
- 访问 Docker socket 或使用 Docker-in-Docker 工作流。
- 来自 `OPEN_TERMINAL_ALLOWED_DOMAINS` 的 iptables/dnsmasq 出口防火墙。

当终端的环境变量包含 `OPEN_TERMINAL_ALLOWED_DOMAINS`、`OPEN_TERMINAL_PACKAGES`、`OPEN_TERMINAL_PIP_PACKAGES` 或 `OPEN_TERMINAL_NPM_PACKAGES` 时，编排器会拒绝在受限模式下运行该终端。请构建包含用户所需工具的自定义 Open Terminal 镜像。

## 数据库 {#database}

Terminals 默认使用 SQLite，并将其存储在 Terminals 数据目录下。为 Terminals 服务在 `/app/data` 挂载持久化存储以保留数据库。设置 `TERMINALS_DATABASE_URL` 可使用 PostgreSQL 等外部数据库。

## 部署 {#deployment}

安装 CRD 和 Operator：

```bash
oc apply -f manifests/terminal-crd.yaml
oc apply -f manifests/operator-deployment.yaml
```

使用 Operator 后端和受限模式运行 Terminals 服务：

```yaml
env:
  - name: TERMINALS_BACKEND
    value: kubernetes-operator
  - name: TERMINALS_KUBERNETES_NAMESPACE
    value: terminals
  - name: TERMINALS_KUBERNETES_RESTRICTED
    value: "true"
  - name: TERMINALS_API_KEY
    valueFrom:
      secretKeyRef:
        name: terminals
        key: api-key
```

创建包含该密钥的 `terminals` Secret，并在 Open WebUI 中将同一密钥用作连接的 **API Key**。

在终端中使用兼容 OpenShift 的 Open Terminal 镜像。将 **Image** 设置为 `ghcr.io/open-webui/open-terminal:openshift`，将 **CPU** 设置为 `1`，**Memory** 设置为 `1Gi`，**Storage** 设置为 `5Gi`，并将环境变量 `OPEN_TERMINAL_FILE_BROWSER_ROOT` 设置为 `home`。

受限模式会应用适合受限 OpenShift 部署的 Kubernetes security-context 默认值。如果集群需要不同的值，请使用 `TERMINALS_KUBERNETES_POD_SECURITY_CONTEXT` 和 `TERMINALS_KUBERNETES_CONTAINER_SECURITY_CONTEXT` 覆盖这些默认值。

在 OpenShift 上使用集群网络策略控制出口流量。
