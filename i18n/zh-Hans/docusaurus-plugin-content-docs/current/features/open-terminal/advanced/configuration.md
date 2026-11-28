---
sidebar_position: 2
title: "配置"
---

# 配置参考

Open Terminal 开箱即有合理的默认设置。本页介绍需要时可以自定义的所有设置。

设置按以下顺序应用（后应用的设置会覆盖先应用的设置）：

1. 内置默认值
2. 系统配置文件（`/etc/open-terminal/config.toml`）
3. 用户配置文件（`~/.config/open-terminal/config.toml`）
4. 环境变量（`OPEN_TERMINAL_*`）
5. CLI 参数（`--host`、`--port` 等）

---

## 所有设置 {#all-settings}

| 设置 | 默认值 | 环境变量 | 描述 |
| :--- | :--- | :--- | :--- |
| **主机** | `0.0.0.0` | 无 | 要监听的网络地址 |
| **端口** | `8000` | 无 | 端口号 |
| **API 密钥** | 自动生成 | `OPEN_TERMINAL_API_KEY` | 用于连接的密码 |
| **API 密钥文件** | 无 | `OPEN_TERMINAL_API_KEY_FILE` | 从文件加载密钥（用于 Docker secrets） |
| **日志目录** | `~/.local/state/open-terminal/logs` | `OPEN_TERMINAL_LOG_DIR` | 日志文件的保存位置 |
| **最大会话数** | `16` | `OPEN_TERMINAL_MAX_SESSIONS` | 最大并发终端会话数 |
| **启用终端** | `true` | `OPEN_TERMINAL_ENABLE_TERMINAL` | 开启或关闭交互式终端 |
| **启用 Notebook** | `true` | `OPEN_TERMINAL_ENABLE_NOTEBOOKS` | 开启或关闭 Jupyter Notebook 执行 |
| **TERM** | `xterm-256color` | `OPEN_TERMINAL_TERM` | 终端颜色支持 |
| **执行超时** | 未设置 | `OPEN_TERMINAL_EXECUTE_TIMEOUT` | 当调用未发送 `wait` 值时，`run_command` 和 `get_process_status` 等待命令完成的秒数。未设置时，`run_command` 会立即返回命令 ID，通常状态为 `running` 且尚无输出（[命令输出为空](/features/open-terminal/setup/connecting#command-output-is-empty)） |
| **执行描述** | 无 | `OPEN_TERMINAL_EXECUTE_DESCRIPTION` | 向 AI 说明已安装工具的自定义文本 |
| **启用系统提示词** | `true` | `OPEN_TERMINAL_ENABLE_SYSTEM_PROMPT` | 公开 `/system` 提示词端点 |
| **系统提示词** | 自动生成 | `OPEN_TERMINAL_SYSTEM_PROMPT` | 使用自定义模板替换生成的提示词 |
| **环境信息** | 无 | `OPEN_TERMINAL_INFO` | 将运维方提供的环境上下文追加到生成的提示词中 |
| **文件浏览器根目录** | `home` | `OPEN_TERMINAL_FILE_BROWSER_ROOT` | 使用 `home`、显式路径（如 `/workspace`），或使用 `filesystem` 选择退出 |
| **多用户** | `false` | `OPEN_TERMINAL_MULTI_USER` | 在一个共享容器中为每位用户提供独立账户和主目录（[多用户设置](./multi-user.md)） |
| **CORS 来源** | `*` | `OPEN_TERMINAL_CORS_ALLOWED_ORIGINS` | 允许的跨源域。默认值 `*` 允许所有来源（宽松）；未设置时会在启动时打印警告 |
| **允许的域** | 无 | `OPEN_TERMINAL_ALLOWED_DOMAINS` | [出站防火墙](./security.md#egress-filtering)：只允许与这些域建立出站连接 |
| **会话 CWD TTL** | `604800`（7 天） | `OPEN_TERMINAL_SESSION_CWD_TTL` | 会话已保存工作目录的保留时长 |
| **最大日志大小** | `50000000`（50 MB） | `OPEN_TERMINAL_MAX_LOG_SIZE` | 会话日志轮换前的最大大小 |
| **日志保留时间** | `604800`（7 天） | `OPEN_TERMINAL_LOG_RETENTION` | 会话日志的保留时长 |
| **日志刷新间隔** | `0` | `OPEN_TERMINAL_LOG_FLUSH_INTERVAL` | 日志刷新之间的秒数（0 = 立即刷新）；在慢速存储（ARM/eMMC）上可增大该值以批量写入 |
| **日志刷新缓冲区** | `0` | `OPEN_TERMINAL_LOG_FLUSH_BUFFER` | 强制刷新前缓冲的字节数（与刷新间隔配合使用） |
| **二进制 MIME 前缀** | `image` | `OPEN_TERMINAL_BINARY_MIME_PREFIXES` | 在文件浏览器中视为二进制的 MIME 前缀 |
| **用户前缀** | 空 | `OPEN_TERMINAL_USER_PREFIX` | 添加到预配多用户账户名称的前缀 |

---

## 仅限 Docker 的设置 {#docker-only-settings}

以下设置仅适用于 Docker 镜像：

| 设置 | 环境变量 | 描述 |
| :--- | :--- | :--- |
| **系统软件包** | `OPEN_TERMINAL_PACKAGES` | 启动时要安装的系统软件包列表，以空格分隔 |
| **Python 软件包** | `OPEN_TERMINAL_PIP_PACKAGES` | 启动时要安装的 Python 软件包列表，以空格分隔 |
| **npm 软件包** | `OPEN_TERMINAL_NPM_PACKAGES` | 启动时要安装的 npm 软件包列表，以空格分隔 |

:::note
每次容器启动时都会重新安装这些软件包。如果需要大量软件包，请考虑改为[构建自定义镜像](https://github.com/open-webui/open-terminal)。
:::

:::note OpenShift 镜像
`ghcr.io/open-webui/open-terminal:openshift` 镜像不支持运行时软件包安装、`OPEN_TERMINAL_ALLOWED_DOMAINS`、Docker 套接字工作流程或 `OPEN_TERMINAL_MULTI_USER=true`。部署到 OpenShift 前，请在自定义镜像中安装所需工具。
:::

---

## 配置文件 {#config-file}

除了使用环境变量，还可以将设置写入文件：

```toml title="~/.config/open-terminal/config.toml"
host = "0.0.0.0"
port = 8000
api_key = "your-secret-key"
log_dir = "/var/log/open-terminal"
max_terminal_sessions = 16
enable_terminal = true
enable_notebooks = true
execute_timeout = 5
execute_description = "This terminal has ffmpeg and ImageMagick installed."
```

{/* TODO：截图：文本编辑器中显示格式规范的 config.toml 文件。 */}

:::tip 为什么使用配置文件？
它可以避免 API 密钥出现在命令行和 shell 历史记录中。在机器上运行 `ps` 或 `htop` 的任何人都不会看到它。
:::

要使用自定义位置的配置文件：

```bash
open-terminal run --config /path/to/my-config.toml
```

### 系统提示词占位符 {#system-prompt-placeholders}

设置 `OPEN_TERMINAL_SYSTEM_PROMPT` 后，Open Terminal 会展开以下占位符：

| 占位符 | 值 |
| :--- | :--- |
| `{{os}}` | 操作系统名称 |
| `{{kernel}}` | 内核或操作系统版本 |
| `{{arch}}` | 机器架构 |
| `{{hostname}}` | 主机名 |
| `{{user}}` | 可用时的运行时用户 |
| `{{shell}}` | Shell 路径 |
| `{{python_version}}` | Python 版本 |
| `{{home}}` | 运行时主目录 |

未知占位符保持原样。

---

## Docker secrets {#docker-secrets}

对于生产环境的 Docker 部署，可以从 secret 文件加载 API 密钥：

```yaml title="docker-compose.yml"
services:
  open-terminal:
    image: ghcr.io/open-webui/open-terminal
    environment:
      - OPEN_TERMINAL_API_KEY_FILE=/run/secrets/terminal_api_key
    secrets:
      - terminal_api_key

secrets:
  terminal_api_key:
    file: ./terminal_api_key.txt
```

{/* TODO：截图：编辑器中的 Docker Compose 文件，突出显示 secrets 部分。 */}

---

## 镜像变体 {#image-variants}

Open Terminal 提供三种规格：

| | `latest` | `slim` | `alpine` |
| :--- | :--- | :--- | :--- |
| **适用场景** | 通用用途、AI 智能体 | 较小占用空间 | 最小占用空间 |
| **大小** | ~4 GB | ~430 MB | ~230 MB |
| **包含** | Node.js、Python、编译器、ffmpeg、Docker CLI、数据科学库 | git、curl、jq | git、curl、jq |
| **可安装软件包** | 是（支持 sudo） | 否 | 否 |
| **多用户** | 是 | 否 | 否 |

**如果不确定，请使用 `latest`。**它已预装所有内容，AI 可以使用任何工具，无需等待安装。

{/* TODO：截图：直观比较三种镜像变体的相对大小和功能。 */}

## 相关内容 {#related}

- [安全最佳实践 →](./security.md)
- [多用户设置 →](./multi-user.md)
