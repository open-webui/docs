---
sidebar_position: 7
title: "系统提示词"
---

# 系统提示词

Open Terminal 默认提供生成的系统提示词。其中包含操作系统、内核、架构、主机名、用户、Shell 和 Python 版本等运行时详细信息。

设置 `OPEN_TERMINAL_SYSTEM_PROMPT`，即可用你自己的模板替换生成的提示词。

## 占位符 {#placeholders}

以下占位符会在 `OPEN_TERMINAL_SYSTEM_PROMPT` 中展开：

| 占位符 | 值 |
| :--- | :--- |
| `{{os}}` | 操作系统名称 |
| `{{kernel}}` | 内核或操作系统发行版本 |
| `{{arch}}` | 机器架构 |
| `{{hostname}}` | 容器主机名 |
| `{{user}}` | 可用时的运行时用户 |
| `{{shell}}` | Shell 路径 |
| `{{python_version}}` | Python 版本 |
| `{{home}}` | 运行时主目录 |

未知占位符保持原样。

示例：

```text
You are working in {{home}} on {{os}} {{kernel}}.
Use {{shell}} for terminal examples.
```

## OPEN_TERMINAL_INFO {#open_terminal_info}

如果要保留生成的提示词并追加操作员提供的上下文（例如已安装的工具、实验说明或环境备注），请使用 `OPEN_TERMINAL_INFO`。

如果要完全替换生成的提示词，请使用 `OPEN_TERMINAL_SYSTEM_PROMPT`。
