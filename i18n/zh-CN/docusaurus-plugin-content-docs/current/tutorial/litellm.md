---
sidebar_position: 4
title: "LiteLLM 配置"
---

# LiteLLM 配置

[LiteLLM](https://litellm.vercel.app/docs/proxy/configs#quick-start) 支持各种 API，包括 OpenAI 兼容和其他 API。要集成新的 API 模型，请按照以下说明：

## 初始设置

要允许编辑您的 `config.yaml` 文件，请使用 `-v /path/to/litellm/config.yaml:/app/backend/data/litellm/config.yaml` 将其与 `docker run` 命令绑定挂载：

```bash
docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data -v /path/to/litellm/config.yaml:/app/backend/data/litellm/config.yaml --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

_注意：在首次运行之前，主机上不需要存在 `config.yaml` 文件。_

## 配置 Open WebUI

1. 转到 **设置 > 模型 > 管理 LiteLLM 模型**。
2. 在“简单”模式中，您只会看到输入 **模型** 的选项。
3. 要获取附加配置选项，请单击“简单”切换以切换到“高级”模式。在这里，您可以输入：

   - **模型名称**：您希望模型在模型列表中显示的名称。
   - **API 基本 URL**：API 供应商的基本 URL。除非您的供应商指定自定义端点 URL，否则通常可以将此字段留空。
   - **API 密钥**：您的唯一 API 密钥。用 API 供应商提供的密钥替换。
   - **API RPM**：您的 API 允许的每分钟请求。用适用于您的 API 计划的适当值替换。

4. 在输入所有必需信息后，单击“+”按钮将新模型添加到 LiteLLM。

## 示例

_Ollama API（从 Docker 内部）：_
![LiteLLM Config Ollama](/img/tutorial_litellm_ollama.png)

_Gemini API（MakerSuite/AI Studio）：_
![LiteLLM Config Gemini](/img/tutorial_litellm_gemini.png)

在设置界面中未涵盖的高级配置选项可以在 `config.yaml` 文件中手动编辑。有关特定提供商和高级设置的更多信息，请参考 [LiteLLM 提供商文档](https://litellm.vercel.app/docs/providers)。
