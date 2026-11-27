---
sidebar_position: 10
title: "Continue.dev"
---

# 将 Continue.dev VS Code 扩展与 Open WebUI 集成

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看[贡献教程](/contributing)。

:::

## 下载扩展 {#download-extension}

你可以在 [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=Continue.continue) 下载 VS Code 扩展，也可以直接在 VS Code 中通过 `EXTENSION:MARKETPLACE` 搜索 `continue` 进行下载。
安装后，你可以通过 VS Code 侧边栏中的 `continue` 选项卡访问该应用程序。

**VS Code 侧边栏图标：**

![continue.dev VS Code 图标](/images/tutorials/continue-dev/continue_dev_vscode_icon.png)

---

## 设置 {#setup}

点击主聊天输入框右侧的助手选择器。然后将鼠标悬停在 `Local Assistant` 上，并点击设置图标。
这会在编辑器中打开 `config.yaml` 文件。你可以在这里更改 `Local Assistant` 的设置。

![continue.dev 聊天输入框](/images/tutorials/continue-dev/continue_dev_extension_input_field.png)

:::info

目前，`ollama` 提供方不支持身份验证，因此我们无法将此提供方与 Open WebUI 一起使用。
不过，Ollama 和 Open WebUI 都兼容 OpenAI API 规范。如需详细了解该规范，请阅读 [Ollama 关于 OpenAI 兼容性的博客文章](https://ollama.com/blog/openai-compatibility)。
我们仍然可以将 continue.dev 设置为使用 openai 提供方，这样就可以使用 Open WebUI 的身份验证令牌。

:::

### 配置示例 {#example-config}

下面是一个本地 Open WebUI 部署的配置示例。

```yaml
name: Local Assistant
version: 1.0.0
schema: v1
models:
  - name: Qwen3.6
    provider: openai
    model: qwen3.6:27b
    env:
      useLegacyCompletionsEndpoint: false
    apiBase: http://localhost:3000/api
    apiKey: YOUR_OPEN_WEBUI_API_KEY
    roles:
      - chat
      - edit
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase

```

---

### 其他配置设置 {#miscellaneous-configuration-settings}

扩展正常工作需要这些值。更多信息请参阅[官方配置指南](https://docs.continue.dev/reference)。

```yaml
name: Local Assistant
version: 1.0.0
schema: v1
```

context 部分为模型提供附加信息。更多信息请参阅[官方配置指南](https://docs.continue.dev/reference#context)和[上下文提供方指南](https://docs.continue.dev/customize/model-providers/overview)。

```yaml
context:
  - provider: code
  - provider: docs
  - provider: diff
  - provider: terminal
  - provider: problems
  - provider: folder
  - provider: codebase
```

---

### 模型 {#models}

models 部分用于指定要添加的所有模型。更多信息请参阅[官方模型指南](https://docs.continue.dev/reference#models)。

```yaml
models:
  - ...
```

---

### 名称 {#name}

设置要使用的模型名称。该名称会显示在扩展的聊天输入框中。

```yaml
name: Qwen3.6
```

![continue.dev 聊天输入框](/images/tutorials/continue-dev/continue_dev_extension_input_field.png)

---

### 提供方 {#provider}

指定用于与 API 通信的方法；在本例中，即 Open WebUI 提供的 OpenAI API 端点。

```yaml
provider: openai
```

---

### 模型 {#model}

这是模型在 Open WebUI 中的实际名称。导航至 `Settings` > `Models`（管理员区域），然后点击你偏好的 LLM。
在用户指定的名称下方，你可以找到实际的模型名称。

```yaml
model: qwen3.6:27b
```

---

### 旧版 Completions 端点 {#legacy-completions-endpoint}

Open WebUI 不需要此设置，不过你可以在[原始指南](https://platform.openai.com/docs/guides/completions)中了解更多信息。

```yaml
env:
  useLegacyCompletionsEndpoint: false
```

---

### APIBase {#apibase}

这是关键的一步：你需要将 continue.dev 扩展的请求指向你的 Open WebUI 实例。
如果实例托管在某个位置，请使用实际域名（例如 `https://example.com/api`）；如果使用本地部署，则使用 localhost 地址（例如 `http://localhost:3000/api`）。
有关 URL 的更多信息，请参阅 [API 端点指南](/reference/api-endpoints)。

```yaml
apiBase: http://localhost:3000/api
```

---

### API 密钥 {#api-key}

要向 Open WebUI 实例进行身份验证，你需要生成一个 API 密钥。API 密钥默认关闭：管理员必须将其启用（[`ENABLE_API_KEYS`](/reference/env-configuration#enable_api_keys)），非管理员用户还需要 **API Keys** 权限（[`USER_PERMISSIONS_FEATURES_API_KEYS`](/reference/env-configuration#user_permissions_features_api_keys)，默认关闭）。
按照 [API 端点指南](/reference/api-endpoints)中的说明创建密钥。

```yaml
apiKey: YOUR_OPEN_WEBUI_API_KEY
```

---

### 角色 {#roles}

角色决定扩展可以将模型用于哪些任务。开始时，你可以选择 `chat` 和 `edit`。
有关角色的更多信息，请参阅[官方角色指南](https://docs.continue.dev/customize/model-roles/intro)。

```yaml
roles:
  - chat
  - edit
```

现在设置已完成，你可以通过聊天输入框与模型交互。有关 continue.dev 插件功能和使用方法的更多信息，请参阅[官方文档](https://docs.continue.dev/getting-started/overview)。
