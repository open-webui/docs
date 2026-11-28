---
sidebar_position: 30
title: "LibreTranslate"
---

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

## 概述 {#overview}

LibreTranslate 是一个免费的开源机器翻译 API，支持多种语言。LibreTranslate 支持自托管和离线使用，并且易于设置；与其他 API 不同，它不依赖 Google 或 Azure 等专有提供方来执行翻译。其翻译引擎由开源的 [Argos Translate](https://github.com/argosopentech/argos-translate) 库提供支持。你可以将 LibreTranslate 与 Open WebUI 集成，以利用其机器翻译能力。本文档提供分步指南，介绍如何在 Docker 中设置 LibreTranslate 并在 Open WebUI 中配置集成。

## 在 Docker 中设置 LibreTranslate {#setting-up-libretranslate-in-docker}

要在 Docker 中设置 LibreTranslate，请按照以下步骤操作：

### 第 1 步：创建 Docker Compose 文件 {#step-1-create-a-docker-compose-file}

在你选择的目录中创建一个名为 `docker-compose.yml` 的新文件。将以下配置添加到文件中：

```yml
services:
  libretranslate:
    container_name: libretranslate
    image: libretranslate/libretranslate:v1.6.0
    restart: unless-stopped
    ports:
      - "5000:5000"
    env_file:
      - stack.env
    volumes:
      - libretranslate_api_keys:/app/db
      - libretranslate_models:/home/libretranslate/.local:rw
    tty: true
    stdin_open: true
    healthcheck:
      test: ['CMD-SHELL', './venv/bin/python scripts/healthcheck.py']

volumes:
  libretranslate_models:
  libretranslate_api_keys:
```

### 第 2 步：创建 `stack.env` 文件 {#step-2-create-a-stackenv-file}

在 `docker-compose.yml` 文件所在的目录中创建一个名为 `stack.env` 的新文件。将以下配置添加到文件中：

```bash

# LibreTranslate
LT_DEBUG="false"
LT_UPDATE_MODELS="true"
LT_SSL="false"
LT_SUGGESTIONS="false"
LT_METRICS="false"
LT_HOST="0.0.0.0"

LT_API_KEYS="false"

LT_THREADS="12"
LT_FRONTEND_TIMEOUT="2000"
```

### 第 3 步：运行 Docker Compose 文件 {#step-3-run-the-docker-compose-file}

运行以下命令启动 LibreTranslate 服务：

```bash
docker compose up -d
```

这将在分离模式下启动 LibreTranslate 服务。

## 在 Open WebUI 中配置集成 {#configuring-the-integration-in-open-webui}

在 Docker 中启动并运行 LibreTranslate 后，即可在 Open WebUI 中配置集成。有多种社区集成可供选择，包括：

- [LibreTranslate 过滤器函数](https://openwebui.com/posts/4993ae7e-bd2a-41dc-9e88-9941854495cc)
- [LibreTranslate 操作函数](https://openwebui.com/posts/103a14c1-174a-4445-bb9b-d48640e43b07)
- [多语言 LibreTranslate 操作函数](https://openwebui.com/posts/f250971e-8163-4a0b-a30c-45fdfb2ba4f8)
- [LibreTranslate 过滤器管道](https://github.com/open-webui/pipelines/blob/main/examples/filters/libretranslate_filter_pipeline.py)

选择最适合你需求的集成，并按照说明在 Open WebUI 中进行配置。

LibreTranslate 管道和函数支持的语言：
实际上就是 LibreTranslate 中提供的所有语言，列表如下：

```txt
Albanian, Arabic, Azerbaijani, Bengali, Bulgarian, Catalan, Valencian, Chinese, Czech, Danish, Dutch, English, Flemish, Esperanto, Estonian, Finnish, French, German, Greek, Hebrew, Hindi, Hungarian, Indonesian, Irish, Italian, Japanese, Korean, Latvian, Lithuanian, Malay, Persian, Polish, Portuguese, Romanian, Moldavian, Moldovan, Russian, Slovak, Slovenian, Spanish, Castilian, Swedish, Tagalog, Thai, Turkish, Ukrainian, Urdu
```

## 故障排除 {#troubleshooting}

- 确保 LibreTranslate 服务正在运行且可以访问。
- 验证 Docker 配置是否正确。
- 检查 LibreTranslate 日志中是否存在错误。

## 集成优势 {#benefits-of-integration}

将 LibreTranslate 与 Open WebUI 集成可带来多项优势，包括：

- 支持多种语言的机器翻译能力。
- 改进文本分析和处理。
- 增强语言相关任务的功能。

## 总结 {#conclusion}

将 LibreTranslate 与 Open WebUI 集成的过程简单直接，可以增强 Open WebUI 实例的功能。按照本文档中的步骤操作，即可在 Docker 中设置 LibreTranslate，并在 Open WebUI 中配置集成。
