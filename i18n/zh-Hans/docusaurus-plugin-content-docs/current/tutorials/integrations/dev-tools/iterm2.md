---
title: "iTerm2"
---

# 在 iTerm2 中使用你的 Open WebUI 模型

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看[贡献教程](/contributing)。

:::

你可以在 iTerm2 AI 插件中使用自己的 Open WebUI 模型。本指南介绍如何设置必要的配置。

## 为什么使用 iTerm2 AI 插件？ {#why-use-the-iterm2-ai-plugin}

每当你忘记某个命令，或需要为重复任务快速编写 bash 脚本时，你可能已经在使用 AI 生成的回答。为简化这一工作流程，iTerm2 AI 插件允许你向指定的 AI 提供方或你的 Open WebUI 发送请求。

## 为什么连接到你的 Open WebUI 实例？ {#why-connect-to-your-open-webui-instance}

Open WebUI 提供了一种简单直接的方式，让你通过其 [API 端点](/reference/api-endpoints)与 LLM 交互。如果你在本地运行自己的 LLM，这一点尤其有用。此外，你还可以利用自己实现的所有功能、监控和其他能力。

## 前提条件 {#prerequisites}

### 1. 下载 iTerm2 AI 插件 {#1-download-the-iterm2-ai-plugin}

如果尚未安装 iTerm2 AI 插件，需要先从[其页面](https://iterm2.com/ai-plugin.html)下载。
解压文件，并将应用程序移动到 **Applications** 文件夹。

### 2. 生成 Open WebUI API 密钥 {#2-generate-your-open-webui-api-key}

要向 Open WebUI 实例进行身份验证，你需要生成一个 API 密钥。API 密钥默认关闭：管理员必须将其启用（[`ENABLE_API_KEYS`](/reference/env-configuration#enable_api_keys)），非管理员用户还需要 **API Keys** 权限（[`USER_PERMISSIONS_FEATURES_API_KEYS`](/reference/env-configuration#user_permissions_features_api_keys)，默认关闭）。如果启用了端点限制，`/api/chat/completions` 必须列在 `API_KEYS_ALLOWED_ENDPOINTS` 中。
按照 [API 端点指南](/reference/api-endpoints)中的说明创建密钥。

## 配置 {#configuration}

打开 iTerm2 终端，从 **iTerm2** 菜单进入 **Settings**（⌘,），然后选择 **AI** 选项卡。

![设置前的 iTerm2 菜单](/images/tutorials/iterm2/iterm2_ai_plugin_before.png)

### 验证已安装的插件 {#verify-the-installed-plugin}

安装 iTerm2 AI 插件后，验证 **Plugin** 部分是否显示 `Plugin installed and working`。

---

### 同意使用生成式 AI 功能 {#give-consent-for-generative-ai-features}

在 **Consent** 部分，勾选 `Enable generative AI features` 复选框表示同意。

---

### 设置 API 密钥 {#set-api-key}

将先前创建的 Open WebUI API 令牌输入 **API Key** 字段。

---

### 可选：自定义提示词 {#optional-customize-your-prompt}

如果希望向 LLM 发送专门的提示词，可以编辑 `Prompt template`。

**原始提示词示例：**

```text
Return commands suitable for copy/pasting into \(shell) on \(uname). Do
NOT include commentary NOR Markdown triple-backtick code blocks as your
whole response will be copied into my terminal automatically.

The script should do this: \(ai.prompt)
```

你可以在 [iTerm2 文档](https://gitlab.com/gnachman/iterm2/-/wikis/AI-Prompt)中阅读有关 iTerm2 提示词的更多信息。

---

### 选择你的 LLM {#select-your-llm}

由于 iTerm2 AI 插件不会自动列出你的自定义模型，因此需要手动添加首选模型。
在你的 Open WebUI 实例中，导航至 `Settings` > `Models`（管理员区域），然后点击你偏好的 LLM。
在用户指定的名称下方，你会找到需要输入 iTerm2 的实际模型名称（例如，名称：Gemma3；模型名称：`/models/gemma3-27b-it-Q4_K_M.gguf`）。

---

### 调整 Token 数量 {#adjust-the-tokens}

在此处设置你偏好的 Token 数量。通常，你的推理工具已经设置了限制。

---

### 调整 URL {#adjust-the-url}

这是关键的一步：你需要将 iTerm2 AI 插件的请求指向你的 Open WebUI 实例。
如果实例托管在某个位置，请使用实际域名（例如 `https://example.com/api/chat/completions`）；如果使用本地部署，则使用 localhost 地址（例如 `http://localhost:8080/api/chat/completions`）。
有关 URL 的更多信息，请参阅 [API 端点指南](/reference/api-endpoints)。

---

### 旧版 Completions API {#legacy-completions-api}

Open WebUI 不需要此设置，不过你可以在[原始指南](https://platform.openai.com/docs/guides/completions)中了解更多信息。

---

设置完成后，**AI** 部分将如下所示：

![设置后的 iTerm2 菜单](/images/tutorials/iterm2/iterm2_ai_plugin_after.png)

## 使用方法 {#usage}

在终端会话中，按 **command + y**（⌘y）打开提示词输入框。编写提示词，然后点击 **OK** 按钮或按 **shift + enter**（⇧⌤）发送。

![iTerm2 提示词窗口](/images/tutorials/iterm2/iterm2_ai_plugin_prompt_window.png)

---

这会带你返回终端，并在会话框架中附加一个窗口。查询结果将显示在此浮层中。要将命令发送到终端，请将光标移动到目标行，然后按 **shift + enter**（⇧⌤）。

:::info

回答可能包含多行。如果是这样，你可以使用方向键导航，并根据需要编辑命令。

:::

![iTerm2 提示词窗口](/images/tutorials/iterm2/iterm2_ai_plugin_result_window.png)
