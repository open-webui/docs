---
sidebar_position: 3
title: "图像生成"
---

# 图像生成

Open WebUI 现在通过两个后端支持图像生成：**AUTOMATIC1111** 和 **OpenAI DALL·E** 。本指南将帮助您设置和使用这两个选项。

## AUTOMATIC1111

Open WebUI 支持通过 **AUTOMATIC1111** [API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API)进行图像生成。请按照以下步骤开始：

### 初始设置

1. 确保已安装 [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui) 。
2. 使用附加标志启动 AUTOMATIC1111 以启用 API 访问：
   ```
   ./webui.sh --api --listen
   ```
   对于 Open WebUI 的 Docker 安装，请使用 `--listen` 标志以允许 localhost 之外的连接。

### 配置 Open WebUI

1. 在 Open WebUI 中，导航到 **设置 > 图像** 。 
2. 在 API URL 字段中，输入 AUTOMATIC1111 的 API 可访问地址：
   ```
   http://<your_automatic1111_address>:7860
   ```
   如果您在同一主机上运行 Open WebUI 和 AUTOMATIC1111 的 Docker 安装，请使用 `host.docker.internal` 作为地址。

## OpenAI DALL·E

Open WebUI 也支持通过 **OpenAI DALL·E APIs** 进行图像生成。此选项现在包括一个选择器，可在 DALL·E 2 和 DALL·E 3 之间进行选择，每个选择支持不同的图像大小。

### 初始设置

1. 从 OpenAI 获取 [API 密钥](https://platform.openai.com/api-keys) 。

### 配置 Open WebUI

1. 在 Open WebUI 中，导航到 **设置 > 图像** 。
2. 选择 **OpenAI** 作为您的图像生成后端。
3. 输入您的 OpenAI API 密钥。
4. 选择您希望使用的 DALL·E 模型。请注意，图像大小选项将取决于所选的模型：
   - **DALL·E 2**：支持 `256x256`、`512x512` 或 `1024x1024` 图像。
   - **DALL·E 3**：支持 `1024x1024`、`1792x1024` 或 `1024x1792` 图像。

## 使用图像生成

![图像生成教程](/img/tutorial_image_generation.png)

1. 首先，使用文本生成模型编写用于图像生成的提示。
2. 在响应完成后，您可以单击图片图标生成图像。
