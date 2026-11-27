---
sidebar_position: 19
title: "可视化"
---

# 可视化

可视化功能让模型能够直接在聊天中绘制交互式图表、示意图、计算器和讲解内容。

粘贴一个表格并要求生成图表，要求绘制流程图或时间线、带有可修改字段的小型计算器，或者带滑块的交互式讲解内容。只要图片或可点击的内容比纯文本更能解释答案，就可以使用此功能。管理员和模型所有者可以按模型启用它。

## 工作原理 {#how-it-works}

模型通过 `render_visualization` 内置工具编写一小段 HTML、SVG 和 JavaScript，聊天会在简短标题下方显示结果。图表可以使用 Chart.js。拥有该工具的模型会在视觉内容比纯文本更有帮助时使用它。

## 启用可视化 {#turn-it-on}

可视化默认关闭。在模型编辑器中的 **内置工具** > **可视化** 下按模型启用。对于基础模型，请在 **设置 > 模型**（管理员区域）中打开编辑器；对于自己的模型，请在 **工作区 > 模型** 中打开编辑器。该工具需要[原生函数调用](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)以及模型的 **内置工具** 能力。

## 修改指令 {#change-the-instructions}

模型收到的工具指令决定它何时以及如何绘图。管理员可以在 **设置 > 界面 > 可视化提示词**（管理员区域）中重写这些指令，也可以使用 [`VISUALIZATION_PROMPT_TEMPLATE`](/reference/env-configuration#visualization_prompt_template)。留空时使用默认值。

## 隔离与安全 {#isolation-and-security}

可视化内容在隔离的框架中渲染。两个控制项决定它可以执行哪些操作：

- [`IFRAME_CSP`](/reference/env-configuration#iframe_csp) 像应用于其他 `srcdoc` iframe 一样应用于该框架。
- 只有在 **设置 > 界面** 中开启 **允许 iframe 沙箱执行脚本（iframe Sandbox Allow Scripts）** 时，脚本才会运行。请参阅[预览可以执行哪些操作](/features/chat-conversations/chat-features/code-execution/artifacts#what-a-preview-is-allowed-to-do)。

当可视化内容希望向聊天发送消息时，用户必须先进行确认。
