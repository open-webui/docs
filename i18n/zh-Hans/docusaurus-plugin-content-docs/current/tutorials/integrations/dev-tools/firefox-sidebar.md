---
sidebar_position: 40
title: "Firefox 侧边栏"
---

## Firefox AI 聊天机器人侧边栏 {#firefox-ai-chatbot-sidebar}

# 在 Mozilla Firefox 中将 Open WebUI 集成为本地 AI 聊天机器人浏览器助手

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 前提条件 {#prerequisites}

在将 Open WebUI 集成为 Mozilla Firefox 的 AI 聊天机器人浏览器助手之前，请确保你具备：

- Open WebUI 实例 URL（本地地址或域名）
- 已安装 Firefox 浏览器

## 在 Firefox 中启用 AI 聊天机器人 {#enabling-ai-chatbot-in-firefox}

1. 点击汉堡菜单按钮（右上角、`X` 按钮正下方的三条横线按钮）
2. 打开 Firefox 设置
3. 点击 `Firefox Labs` 部分
4. 开启 `AI Chatbot`

或者，你也可以通过 `about:config` 页面启用 AI 聊天机器人（下一节将介绍）。

## 配置 about:config 设置 {#configuring-about-settings}

1. 在 Firefox 地址栏中输入 `about:config`
2. 点击 `Accept the Risk and Continue`
3. 搜索 `browser.ml.chat.enabled`；如果尚未通过 Firefox Labs 启用，请将其切换为 `true`
4. 搜索 `browser.ml.chat.hideLocalhost` 并将其切换为 `false`

### browser.ml.chat.prompts.{#}

要添加自定义提示词，请按照以下步骤操作：

1. 搜索 `browser.ml.chat.prompts.{#}`（将 `{#}` 替换为数字，例如 `0`、`1`、`2` 等）
2. 点击 `+` 按钮添加新提示词
3. 输入提示词标签、值和 ID（例如 `{"id":"My Prompt", "value": "This is my custom prompt.", "label": "My Prompt"}`）
4. 根据需要重复此过程以添加更多提示词

### browser.ml.chat.provider {#browsermlchatprovider}

1. 搜索 `browser.ml.chat.provider`
2. 输入你的 Open WebUI 实例 URL，包括任何可选参数（例如 `https://my-open-webui-instance.com/?model=browser-productivity-assistant&temporary-chat=true&tools=jina_web_scrape`）

## Open WebUI 的 URL 参数 {#url-parameters-for-open-webui}

以下 URL 参数可用于自定义你的 Open WebUI 实例：

### 模型和模型选择 {#models-and-model-selection}

- `models`：为聊天会话指定多个模型（以逗号分隔的列表）（例如 `/?models=model1,model2`）
- `model`：为聊天会话指定单个模型（例如 `/?model=model1`）

### YouTube 转录 {#youtube-transcription}

- `youtube`：提供 YouTube 视频 ID，确认链接后在聊天中转录该视频（例如 `/?youtube=VIDEO_ID`）

### Web 搜索 {#web-search}

- `web-search`：将此参数设置为 `true` 以启用 Web 搜索功能（例如 `/?web-search=true`）

### 工具选择 {#tool-selection}

- `tools` 或 `tool-ids`：指定以逗号分隔的工具 ID 列表，以便在聊天中激活（例如 `/?tools=tool1,tool2` 或 `/?tool-ids=tool1,tool2`）

### 通话浮层 {#call-overlay}

- `call` 或 `voice`：确认麦克风提示后，将此参数设置为 `true` 可启动语音模式（例如 `/?call=true`）

### 初始查询提示词 {#initial-query-prompt}

- `q`：在消息输入框中填入提示词，准备发送（例如 `/?q=Hello%20there`）

### 临时聊天会话 {#temporary-chat-sessions}

- `temporary-chat`：将此参数设置为 `true`，将聊天标记为临时会话（例如 `/?temporary-chat=true`）
  - 有关浏览器提取哪些内容以及哪些内容会发送到后端，请参阅[临时聊天中的文档附件](/features/chat-conversations/rag/document-extraction#document-attachments-in-temporary-chats)。

有关 URL 参数及其使用方法的更多信息，请参阅 /features/chat-conversations/chat-features/url-params。

## 其他 about:config 设置 {#additional-about-settings}

可以调整以下 `about:config` 设置以进一步自定义：

- `browser.ml.chat.shortcuts`：为 AI 聊天机器人侧边栏启用自定义快捷方式
- `browser.ml.chat.shortcuts.custom`：为 AI 聊天机器人侧边栏启用自定义快捷键
- `browser.ml.chat.shortcuts.longPress`：设置快捷键的长按延迟
- `browser.ml.chat.sidebar`：启用 AI 聊天机器人侧边栏
- `browser.ml.checkForMemory`：加载模型前检查可用内存
- `browser.ml.defaultModelMemoryUsage`：设置模型的默认内存用量
- `browser.ml.enable`：启用 Firefox 中的机器学习功能
- `browser.ml.logLevel`：设置机器学习功能的日志级别
- `browser.ml.maximumMemoryPressure`：设置最大内存压力阈值
- `browser.ml.minimumPhysicalMemory`：设置所需的最低物理内存
- `browser.ml.modelCacheMaxSize`：设置模型缓存的最大大小
- `browser.ml.modelCacheTimeout`：设置模型缓存的超时时间
- `browser.ml.modelHubRootUrl`：设置模型中心的根 URL
- `browser.ml.modelHubUrlTemplate`：设置模型中心的 URL 模板
- `browser.ml.queueWaitInterval`：设置队列等待间隔
- `browser.ml.queueWaitTimeout`：设置队列等待超时时间

## 访问 AI 聊天机器人侧边栏 {#accessing-the-ai-chatbot-sidebar}

要访问 AI 聊天机器人侧边栏，请使用以下方法之一：

- 按 `CTRL+B` 打开书签侧边栏，然后切换到 AI 聊天机器人
- 按 `CTRL+Alt+X` 直接打开 AI 聊天机器人侧边栏
