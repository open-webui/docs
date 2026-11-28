---
sidebar_position: 3
title: "环境变量"
---

# 环境变量

[终端对话框](/features/open-terminal/terminals/orchestration/creating-terminals)中**高级**下的**环境变量**会传入该终端启动的每个 Open Terminal 实例。它们是原始字符串，而不是 shell 命令。

请在对话框中使用原始值：

| 容器内所需的值 | 在对话框中输入 |
| :--- | :--- |
| `sk-proj-abc` | `sk-proj-abc` |
| `*.pypi.org,github.com` | `*.pypi.org,github.com` |
| `hello world` | `hello world` |
| 包含引号字符的 `"hello world"` | `"hello world"` |

除非引号字符本身就是希望容器看到的值的一部分，否则不要在值两侧添加 `'` 或 `"`。

## 转发行为 {#forwarding-behavior}

对于需要出现在 Open Terminal 实例内的值，请使用终端的**环境变量**。编排器进程的环境变量用于配置编排器本身。唯一例外是编排器自身环境中的 `OPEN_TERMINAL_SYSTEM_PROMPT`：每个实例都会将其作为默认值接收，而终端自己设置的值会替换该默认值。

编排器会从终端的环境变量中移除 `OPEN_TERMINAL_API_KEY`。它会为每个终端实例生成专用 API 密钥，并使用该密钥代理请求。

:::warning
环境变量对使用该终端的所有人可见。除非共享该终端的每个人员都可以查看和使用其中的机密，否则不要将机密放入终端。
:::

## 常用 Open Terminal 环境变量 {#common-open-terminal-env-vars}

| 变量 | 用途 |
| :--- | :--- |
| `OPEN_TERMINAL_ALLOWED_DOMAINS` | 限制出站网络访问，例如 `*.pypi.org,github.com` |
| `OPEN_TERMINAL_EXECUTE_TIMEOUT` | 默认的命令等待超时时间，单位为秒 |
| `OPEN_TERMINAL_EXECUTE_DESCRIPTION` | 向模型显示的附加工具描述文本 |
| `OPEN_TERMINAL_SYSTEM_PROMPT` | 自定义系统提示词模板 |
| `OPEN_TERMINAL_INFO` | 追加到生成的提示词中的额外环境信息 |
| `OPEN_TERMINAL_FILE_BROWSER_ROOT` | 文件浏览器的可视根目录。使用 `home`、`/workspace` 等显式路径，或使用 `filesystem` 取消根目录限制 |
| `OPEN_TERMINAL_PACKAGES` | 容器启动时安装的 apt 软件包，以空格分隔 |
| `OPEN_TERMINAL_PIP_PACKAGES` | 容器启动时安装的 Python 软件包，以空格分隔 |
| `OPEN_TERMINAL_NPM_PACKAGES` | 容器启动时全局安装的 npm 软件包，以空格分隔 |

## 自动注入的资源变量 {#automatically-injected-resource-vars}

对于 **CPU** 和**内存**下填写的每个字段，编排器都会自动设置以下变量，使系统提示词或工具能够读取容器的资源预算。这些变量包含工作区的实际限制。

| 变量 | 用途 |
| :--- | :--- |
| `OPEN_TERMINAL_CPU_LIMIT` | 来自终端 **CPU** 设置的 CPU 限制 |
| `OPEN_TERMINAL_CPU_COUNT` | 根据终端 **CPU** 设置得出的 CPU 数量 |
| `OPEN_TERMINAL_MEMORY_LIMIT` | 来自终端**内存**设置的内存限制 |
| `OPEN_TERMINAL_MEMORY_BYTES` | 根据终端**内存**设置得出的内存限制，单位为字节 |
