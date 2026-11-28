---
sidebar_position: 20
title: "Langfuse"
---

## Langfuse 与 Open WebUI 集成 {#langfuse-integration-with-open-webui}

[Langfuse](https://langfuse.com/)（[GitHub](https://github.com/langfuse/langfuse)）为 Open WebUI 提供开源可观测性和评估功能。启用 Langfuse 过滤器后，Open WebUI 中的每次模型回复都会发送到 Langfuse，为你提供：

- 应用程序[跟踪记录](https://langfuse.com/docs/tracing)，包含每次回复的完整输入和输出
- 每次回复的 Token 用量和延迟
- 按用户和模型统计的成本数据
- 将同一次聊天的所有回复归为一组的会话
- [评估](https://langfuse.com/docs/scores/overview)

## 如何将 Langfuse 与 Open WebUI 集成 {#how-to-integrate-langfuse-with-open-webui}

该集成是一个在 Open WebUI 内部运行的[过滤器函数](/features/extensibility/plugin/functions/filter)。当消息发送到模型时，其 `inlet` 会启动一次 Langfuse generation；回复完成后，其 `outlet` 会使用回复及其 Token 计数完成该 generation。

## 快速开始指南 {#quick-start-guide}

### 第 1 步：设置 Open WebUI {#step-1-setup-open-webui}

你需要一个正在运行的 Open WebUI 实例及其管理员帐户。如果尚未准备好，请参阅[快速上手](/getting-started)。

### 第 2 步：获取 Langfuse API 密钥 {#step-2-get-your-langfuse-api-keys}

在 [Langfuse Cloud](https://cloud.langfuse.com) 注册，或使用你自己的[自托管 Langfuse](https://langfuse.com/self-hosting)，创建一个项目并为该项目创建一对 API 密钥。你需要三个值：

- **公钥**（`pk-lf-...`）
- **私钥**（`sk-lf-...`）
- **Langfuse URL**：Langfuse Cloud 使用 `https://cloud.langfuse.com`；否则使用你的密钥所属 Langfuse 区域或服务器的 URL

### 第 3 步：添加 Langfuse 过滤器 {#step-3-add-the-langfuse-filter}

1. 转到**管理员面板 > 函数（Functions）**。
2. 点击**创建（Create）**（**+** 按钮），然后选择**新建函数（New Function）**。
3. 粘贴以下代码并点击**保存（Save）**。

保存时，Open WebUI 会根据 `requirements` 行安装 `langfuse` 包。如果服务器已禁用包安装（[`ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS`](/reference/env-configuration#enable_pip_install_frontmatter_requirements) 或 [`OFFLINE_MODE`](/reference/env-configuration#offline_mode)），请自行将 `langfuse~=3.11` 安装到 Open WebUI 环境中。

```python
"""
title: Langfuse
author: open-webui
version: 1.0.0
license: MIT
description: Sends every chat reply to Langfuse, with its input, output, model, token usage, user and chat.
requirements: langfuse~=3.11
"""

import logging
from typing import Optional

from langfuse import Langfuse, propagate_attributes
from pydantic import BaseModel, Field

log = logging.getLogger(__name__)


class Filter:
    class Valves(BaseModel):
        public_key: str = Field(default="", description="Langfuse public key (pk-lf-...)")
        secret_key: str = Field(default="", description="Langfuse secret key (sk-lf-...)")
        host: str = Field(default="https://cloud.langfuse.com", description="Langfuse URL")

    def __init__(self):
        self.valves = self.Valves()
        self.langfuse = None
        self.langfuse_settings = None

    def get_langfuse(self) -> Optional[Langfuse]:
        settings = (self.valves.public_key, self.valves.secret_key, self.valves.host)
        if not (self.valves.public_key and self.valves.secret_key):
            return None
        if settings != self.langfuse_settings:
            self.langfuse = Langfuse(
                public_key=self.valves.public_key,
                secret_key=self.valves.secret_key,
                host=self.valves.host,
            )
            self.langfuse_settings = settings
        return self.langfuse

    async def inlet(
        self,
        body: dict,
        __user__: Optional[dict] = None,
        __metadata__: Optional[dict] = None,
        __model__: Optional[dict] = None,
    ) -> dict:
        langfuse = self.get_langfuse()
        if langfuse is None or __metadata__ is None:
            return body

        try:
            chat_id = __metadata__.get("chat_id") or None
            model = __model__ or {}
            # Langfuse 按模型 ID 为回复计价，因此报告工作区模型所基于的基础模型
            model_id = model.get("info", {}).get("base_model_id") or body.get("model")

            with propagate_attributes(
                user_id=(__user__ or {}).get("email"),
                session_id=chat_id,
                trace_name="Open WebUI chat",
                tags=["open-webui"],
            ):
                __metadata__["langfuse_generation"] = langfuse.start_observation(
                    trace_context={"trace_id": Langfuse.create_trace_id(seed=chat_id)} if chat_id else None,
                    name="chat-reply",
                    as_type="generation",
                    model=model_id,
                    input=body.get("messages"),
                    metadata={"model_name": model.get("name")},
                )
        except Exception:
            log.exception("Langfuse: could not start the generation")

        return body

    async def outlet(self, body: dict, __metadata__: Optional[dict] = None) -> dict:
        generation = (__metadata__ or {}).pop("langfuse_generation", None)
        if generation is None:
            return body

        try:
            reply = body["messages"][-1]
            usage = reply.get("usage") or {}
            usage_details = None
            if usage.get("input_tokens") is not None:
                usage_details = {
                    "input": usage["input_tokens"],
                    "output": usage["output_tokens"],
                    "total": usage["total_tokens"],
                }

            generation.update(output=reply.get("content"), usage_details=usage_details)
            generation.end()
        except Exception:
            log.exception("Langfuse: could not finish the generation")

        return body
```

:::note

该过滤器使用 Langfuse Python SDK 的第 3 版。第 4 版需要比 Open WebUI 随附版本更新的 OpenTelemetry 软件包，安装它会替换这些软件包，从而破坏 Open WebUI 自身的 [OpenTelemetry 支持](/reference/monitoring/otel)。第 3 版可与 Langfuse 服务器第 4 版配合使用。

:::

### 第 4 步：设置 Valves 并启用过滤器 {#step-4-set-the-valves-and-turn-the-filter-on}

1. 在**管理员面板 > 函数**中，点击 Langfuse 过滤器旁边的齿轮图标（**Valves**）。
2. 输入你的**公钥（Public Key）**、**私钥（Secret Key）**和 **Host**（Langfuse URL），然后保存。
3. 使用开关启用该过滤器。
4. 选择其运行位置：
   - **所有模型**：打开过滤器的 **⋮** 菜单，启用**全局（Global）**。
   - **选定模型**：转到**工作区 > 模型**，编辑一个模型，并在**过滤器（Filters）**下添加 Langfuse 过滤器。

过滤器会在第一次跟踪回复时连接到 Langfuse。如果之后更改 **Host** 或**私钥**但保留相同的**公钥**，请重启 Open WebUI 以应用更改。

:::note

大多数与 OpenAI 兼容的提供方只有在收到请求时，才会报告流式回复的 Token 计数。请为每个需要 Token 计数和成本数据的模型启用 **Usage** 功能，请参阅[功能与绑定](/features/workspace/models#capabilities-and-bindings)。

:::

### 第 5 步：在 Langfuse 中查看跟踪记录 {#step-5-see-your-traces-in-langfuse}

与任何已启用该过滤器的模型聊天，然后在 Langfuse 中打开你的项目：

- 每次聊天对应一条名为 **Open WebUI chat** 的跟踪记录，并带有 `open-webui` 标签。
- 该聊天中的每次模型回复都对应一个名为 **chat-reply** 的 generation，其中包含作为输入发送的消息、作为输出的回复、Token 用量和延迟。
- generation 的模型字段是模型 ID。对于工作区模型，它是其所基于的基础模型 ID，因此 Langfuse 可以将其与价格列表匹配。用户选择的模型名称位于 generation 的元数据中。
- 用户是 Open WebUI 用户的电子邮件地址，会话是聊天 ID，因此 Langfuse 可以按聊天和按用户对回复分组。

在 [`ENABLE_API_OUTLET_FILTERS`](/reference/env-configuration#enable_api_outlet_filters) 开启（默认设置）时，对 Open WebUI API 的直接调用也会被跟踪，每次调用对应一条跟踪记录。

## 了解更多 {#learn-more}

- [过滤器函数](/features/extensibility/plugin/functions/filter)：了解过滤器在 Open WebUI 中的工作方式
- [Langfuse 文档](https://langfuse.com/docs)
