---
sidebar_position: 50
title: "浏览器搜索引擎"
---

# 浏览器搜索引擎集成

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

Open WebUI 允许你直接集成到 Web 浏览器中。本教程将指导你将 Open WebUI 设置为自定义搜索引擎，让你能够轻松地从浏览器地址栏执行查询。

## 将 Open WebUI 设置为搜索引擎 {#setting-up-open-webui-as-a-search-engine}

### 前提条件 {#prerequisites}

开始之前，请确保：

- 你已安装 Chrome 或其他受支持的浏览器。
- 浏览器可以通过稳定的 URL 访问你的 Open WebUI 实例。
- 如果要使用 Firefox 的一键添加选项，请通过 Docker 环境变量，或按照[快速上手](/reference/env-configuration)指南中的说明在 `.env` 文件中，将 `WEBUI_URL` 环境变量设置为该 URL。

### 第 1 步：设置 WEBUI_URL 环境变量（仅限 Firefox） {#step-1-set-the-webui_url-environment-variable-firefox-only}

下面的 Chrome 设置不需要 `WEBUI_URL`：浏览器会自行打开 `<your-open-webui-url>/?q=%s`。Firefox 的一键添加选项会读取 Open WebUI 的 `/opensearch.xml`，后者根据 `WEBUI_URL`（**Admin Panel > Settings > General** 中的 **WebUI URL** 字段）构建搜索 URL，因此请将其设置为你用于访问 Open WebUI 的地址。

#### 使用 Docker 环境变量 {#using-docker-environment-variables}

如果你使用 Docker 运行 Open WebUI，可以在 `docker run` 命令中设置环境变量：

```bash
docker run -d \
  -p 3000:8080 \
  --add-host=host.docker.internal:host-gateway \
  -v open-webui:/app/backend/data \
  --name open-webui \
  --restart always \
  -e WEBUI_URL="https://<your-open-webui-url>" \
  ghcr.io/open-webui/open-webui:main
```

或者，你可以将该变量添加到 `.env` 文件：

```plaintext
WEBUI_URL=https://<your-open-webui-url>
```

### 第 2 步：将 Open WebUI 添加为自定义搜索引擎 {#step-2-add-open-webui-as-a-custom-search-engine}

### Chrome 浏览器 {#for-chrome}

1. 打开 Chrome 并导航至 **Settings**。
2. 在侧边栏中选择 **Search engine**，然后点击 **Manage search engines**。
3. 点击 **Add** 创建新的搜索引擎。
4. 按如下方式填写详细信息：
    - **Search engine**：Open WebUI Search
    - **Keyword**：webui（或你喜欢的任何关键字）
    - **URL with %s in place of query**：

      ```txt
      https://<your-open-webui-url>/?q=%s
      ```

5. 点击 **Add** 保存配置。

### Firefox 浏览器 {#for-firefox}

1. 在 Firefox 中打开 Open WebUI。
2. 点击地址栏将其展开。
3. 点击展开的地址栏底部绿色圆圈中的加号图标。这会将 Open WebUI 的搜索添加到首选项中的搜索引擎列表。

或者：

1. 在 Firefox 中打开 Open WebUI。
2. 右键点击地址栏。
3. 从上下文菜单中选择“Add Open WebUI”（或类似选项）。

### 可选：使用特定模型 {#optional-using-specific-models}

如果希望在搜索时使用特定模型，请修改 URL 格式以包含模型 ID：

```txt
https://<your-open-webui-url>/?models=<model_id>&q=%s
```

:::note

**注意：**模型 ID 需要进行 URL 编码。空格或斜杠等特殊字符需要编码（例如，`my model` 变为 `my%20model`）。

:::

## 使用示例 {#example-usage}

设置搜索引擎后，即可直接从地址栏执行搜索。只需输入你选择的关键字，然后输入查询：

```txt
webui your search query
```

这会打开 Open WebUI，并将你的查询填入消息输入框。按 Enter 发送。

## 故障排除 {#troubleshooting}

如果遇到任何问题，请检查以下内容：

- 确保浏览器搜索引擎设置中的 URL 指向正在运行的 Open WebUI 实例。
- 对于 Firefox 的一键添加选项，确保将 `WEBUI_URL` 设置为你用于访问 Open WebUI 的地址。
- 仔细检查浏览器设置中输入的搜索引擎 URL 格式是否正确。
- 确认互联网连接正常，并且 Open WebUI 服务运行顺畅。
