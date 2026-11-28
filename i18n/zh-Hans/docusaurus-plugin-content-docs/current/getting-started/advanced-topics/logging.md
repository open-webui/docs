---
sidebar_position: 5
title: "Open WebUI 日志"
---

# Open WebUI 日志

**控制 Open WebUI 记录哪些日志、日志发送到哪里以及采用什么格式，覆盖从快速调试到生产日志管道的各种需求。**

Open WebUI 有两个日志来源：用于前端调试的**浏览器控制台**，以及用于记录服务器端事件的 **Python 后端**。大多数配置在后端完成，你既可以通过一个环境变量调整日志详细程度，也可以切换到结构化 JSON 输出，供 Loki、Datadog 或 CloudWatch 等日志聚合系统使用。

---

## 前端日志 {#frontend-logging}

前端使用标准的浏览器 `console` 调用。打开浏览器的开发者工具（按 **F12**，macOS 上按 **Cmd+Option+I**），然后转到 **Console（控制台）**选项卡。除非前端使用 `ENV=dev` 构建，否则生产构建（包括 Docker 镜像）会在构建时移除 `console.log`、`console.debug` 和 `console.error` 调用，因此你主要会看到 `console.warn` 和 `console.info` 的输出，以及浏览器自身的错误。

特定浏览器的文档：

- [Chrome/Chromium DevTools](https://developer.chrome.com/docs/devtools/)
- [Firefox 开发者工具](https://firefox-source-docs.mozilla.org/devtools-user/)
- [Safari 开发者工具](https://developer.apple.com/safari/tools/)

---

## 后端日志 {#backend-logging}

后端使用 Python 内置的 `logging` 模块。默认情况下，日志以 `INFO` 级别写入 **stdout**，因此可以在终端或容器日志中查看。

### 日志级别 {#log-levels}

| 级别 | 值 | 使用场景 |
|---|---|---|
| `CRITICAL` | 50 | 灾难性故障；应用程序可能终止 |
| `ERROR` | 40 | 操作失败；应用程序继续运行，但某些功能已出错 |
| `WARNING` | 30 | 值得调查的异常情况：弃用警告、资源压力 |
| `INFO` | 20 | 正常运行流程：启动、关键事件、请求处理 **（默认）** |
| `DEBUG` | 10 | 详细诊断输出：函数调用、变量值、执行步骤 |

---

### 设置全局日志级别 {#setting-the-global-log-level}

设置 `GLOBAL_LOG_LEVEL` 可更改整个后端的日志详细程度。这会通过 `logging.basicConfig(force=True)` 配置 Python 根日志记录器，影响所有 Open WebUI 日志记录器和大多数第三方库。

**Docker：**

```bash
--env GLOBAL_LOG_LEVEL="DEBUG"
```

**Docker Compose：**

```yaml
environment:
  - GLOBAL_LOG_LEVEL=DEBUG
```

:::tip
开发和故障排除时使用 `DEBUG`。生产环境请使用 `INFO` 或 `WARNING`，将日志量控制在可管理范围内。
:::

Python 的 `logging` 模块无法识别的值（例如 `TRACE`）会回退到 `INFO`。请使用上表中的级别名称：别名 `WARN` 和 `FATAL` 能通过这项检查，但 Loguru 会拒绝它们，导致后端无法启动。

---

### 日志级别的开销 {#what-the-log-level-costs}

提高日志级别既能减少日志量，也能减少处理工作，因为被该级别过滤掉的消息不会被构建。知识搜索仅在 `DEBUG` 级别写入找到的文件名和完整结果，External、Firecrawl、Kagi、Mojeek、SearchApi、SerpApi、Serply 和 Yandex 网络搜索引擎也是如此。`DEBUG` 是运行开销最高的级别，其中还包括完整的聊天请求负载，因此在查明启用它所针对的问题后，请将其调回原来的级别。

---

### 关闭访问日志 {#turning-off-access-logs}

每个 HTTP 请求都会由 uvicorn 的 `uvicorn.access` 日志记录器在 `INFO` 级别写入一条访问日志。启动时，Open WebUI 会接管 `AUDIT_UVICORN_LOGGER_NAMES` 中列出的每个日志记录器，默认包括 `uvicorn.access`：它会用自己的处理器替换这些记录器的处理器，并将其级别设置为 `GLOBAL_LOG_LEVEL`。这就是仅设置 `UVICORN_ACCESS_LOG=false` 仍会保留访问日志的原因。

在通过命令行启动 uvicorn 的 Docker 镜像中，要移除访问日志并保留 `GLOBAL_LOG_LEVEL=INFO`，请同时设置以下两项：

```bash
UVICORN_ACCESS_LOG=false
AUDIT_UVICORN_LOGGER_NAMES=
```

将 `AUDIT_UVICORN_LOGGER_NAMES` 设为空会阻止上述接管，因此 uvicorn 自身的开关会生效。`open-webui serve` 从 Python 启动 uvicorn，不会读取 `UVICORN_ACCESS_LOG`，因此在这种情况下，访问日志遵循 `GLOBAL_LOG_LEVEL`，只有设置为高于 `INFO` 的级别（例如 `WARNING`）才会隐藏它们。[审计日志](/getting-started/advanced-topics/hardening#audit-logging)由 Open WebUI 自身而非 `uvicorn.access` 写入，因此会继续正常工作。

---

### 结构化 JSON 日志 {#structured-json-logging}

对于使用日志聚合系统的生产环境，请设置 `LOG_FORMAT=json`，将所有 stdout 输出切换为单行 JSON 对象。

**Docker：**

```bash
--env LOG_FORMAT="json"
```

**Docker Compose：**

```yaml
environment:
  - LOG_FORMAT=json
```

**JSON 字段：**

| 字段 | 说明 |
|---|---|
| `ts` | ISO 8601 时间戳 |
| `level` | 日志级别（`debug`、`info`、`warn`、`error`、`fatal`） |
| `msg` | 日志消息 |
| `caller` | 源代码位置（`module:function:line`） |
| `extra` | 附加上下文数据（如果有） |
| `error` | 错误详情（如适用）：包含 `type`、`message` 和 `stacktrace` 的对象；在启动早期的日志行中则为普通字符串 |
| `stacktrace` | 堆栈跟踪，仅出现在使用 `stack_info=True` 记录的启动早期日志行中 |

**示例输出：**

```json
{"ts": "2026-02-22T20:14:53.386+00:00", "level": "info", "msg": "GLOBAL_LOG_LEVEL: INFO", "caller": "open_webui.env"}
{"ts": "2026-02-22T20:15:02.245+00:00", "level": "info", "msg": "Context impl SQLiteImpl.", "caller": "alembic.runtime.migration"}
```

:::note
- 默认行为（未设置 `LOG_FORMAT`）保持不变：纯文本输出
- 当 `LOG_FORMAT=json` 时会隐藏 ASCII 横幅，使日志流保持可解析
- JSON 日志同时覆盖启动早期日志（stdlib `logging`）和运行时日志（Loguru）
:::
