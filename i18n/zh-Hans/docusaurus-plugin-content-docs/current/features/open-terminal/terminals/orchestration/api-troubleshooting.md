---
sidebar_position: 10
title: "API 与故障排除"
---

# API 与故障排除

## Open WebUI Terminals API {#open-webui-terminals-api}

也可以通过 Open WebUI API 使用用户令牌管理 Terminals。读取和写入规则遵循[连接访问权限](/features/open-terminal/terminals/orchestration/creating-terminals#connection-access)。端点经常变化，因此本文不予列出。可以让 AI 智能体查看 Open WebUI 后端，以读取最新的端点和规范。

## 发送到 Terminals 服务器的标头 {#headers-sent-to-the-terminals-server}

Open WebUI 会随在终端中运行的请求发送以下标头：

| 标头 | 值 |
| :--- | :--- |
| `X-User-Id` | 发起请求且已通过验证的用户 ID |
| `X-Session-Id` | 请求属于某个聊天时，该聊天的 ID |
| `X-Terminal-Template-Id` | Terminals 服务器上的终端 ID |
| `X-Terminal-Chat-Id` | 请求属于已保存聊天时，该聊天的 ID |
| `X-Terminal-Model-Id` | **模型**终端的模型 ID |

## 故障排除 {#troubleshooting}

### 环境变量值需要加引号吗？ {#do-i-need-quotes-around-env-vars}

不需要。请准确输入希望容器接收的值。仅当引号字符本身是预期值的一部分时，才需要添加引号。

### 能否将环境变量传给编排器并让它转发？ {#can-i-pass-env-vars-to-the-orchestrator-and-have-it-forward-them}

请使用终端的**环境变量**，参见[转发行为](/features/open-terminal/terminals/orchestration/environment-variables#forwarding-behavior)。

### 为什么环境变量或镜像的更改没有生效？ {#why-did-my-env-var-or-image-change-not-apply}

实例很可能已经在运行。请从终端的**实例**列表中重启实例，或等待空闲清理。

### 为什么用户无法在文件浏览器中浏览 `/etc`？ {#why-cant-users-browse-to-etc-in-the-file-browser}

对于由编排器管理的终端，文件浏览器从主目录开始，主目录显示为 `Home`，并隐藏其上层的文件夹。若要更改或移除该根目录，请参阅[文件浏览器根目录](/features/open-terminal/terminals/orchestration/file-browser-home-boundary#configure-the-root)。
