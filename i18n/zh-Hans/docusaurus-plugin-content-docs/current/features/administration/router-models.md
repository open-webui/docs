---
sidebar_position: 11
title: "路由模型"
---

路由模型在模型选择器中看起来与其他模型一样，它收到的每条消息都会转给你的某个实际模型，由该模型作答。具体如何选择由你决定。

典型用途：

- 将编程问题发送给代码模型，将其他所有问题发送给成本更低的通用模型。
- 根据对话中的词语，将敏感内容保留在本地模型上。
- 对模型进行盲测比较。具有两个或更多默认模型的路由模型会随机选择一个模型并隐藏所选模型，从而为[评估排行榜](/features/administration/evaluation)提供无偏差的评分。

## 创建路由模型 {#create-a-router-model}

打开**设置 > 模型**（管理区域），找到**路由模型**并点击 **+**。像创建其他模型一样为其设置名称和 ID，然后添加规则。保存后，该模型就会显示在模型选择器中。

用户还需要有权访问路由模型所使用的模型。通过路由模型的访问控制指定谁可以选择它，并确保同一批用户可以使用它路由到的模型。

### 规则 {#rules}

路由模型按以下顺序检查规则，第一条适用的规则决定使用哪个模型。

| 规则 | 匹配方式 |
| :--- | :--- |
| **模式** | 使用正则表达式（不区分大小写）检查对话。第一个匹配的模式生效，并且不会调用 **Decisions API**。 |
| **条件** | 自然语言条件，例如“用户询问编程相关问题”。一次 **Decisions API** 调用会为所有条件评分，如果可能性最高的条件达到**阈值**，则该条件生效。 |
| **默认** | 没有模式或条件适用时使用。 |

系统先检查模式，再检查条件，两者都按列表顺序检查。

至少添加一个默认模型。未匹配任何内容且没有默认模型的请求会失败。

### 默认模型 {#default-models}

添加一个或多个默认模型，并选择一种**策略**。

- **首个**（First）始终使用列表顶部的模型。
- **随机**（Random）需要至少两个默认模型。没有模式或条件适用时，它会为每条消息随机选择一个模型，并隐藏所选模型，直到你打开该回答的评分界面。这就是[评估](/features/administration/evaluation#1-blind-comparison-with-a-router-model)中使用的盲测比较。

### Decisions API {#decisions-api}

条件需要一个为其评分的服务。在 **Decisions API** 下设置 **API Base URL**、**API Key**、**Model** 和 **Threshold**（0 到 1 之间的概率，默认值为 0.5）。该服务与[工具搜索](/features/extensibility/plugin/tools#tool-search)使用的服务属于同一类型。每个请求最多调用一次，且仅在没有模式匹配时调用。如果调用失败，路由模型会回退到其默认模型。

**Threshold** 下方的输入框显示占位文字“Leave empty to use the default prompt, or enter a custom prompt”（留空以使用默认提示词，或输入自定义提示词）。其中的文本设置发送给服务的输入，条件会作为单独的问题随输入一起发送，因此提示词无需重复这些条件。它接受 `{{MESSAGES:END:6|middletruncate:2000}}` 和 `{{prompt}}` 等[消息和提示词修饰符](/features/workspace/prompts#message-and-prompt-modifiers)。默认提示词包含最近的聊天记录。不含 `{{MESSAGES}}` 的自定义提示词不会发送任何聊天记录。

在已保存的聊天中，模式和条件会检查当前对话分支中截至新消息的内容。

## 通过环境进行配置 {#set-them-up-from-the-environment}

[`ROUTER_MODELS`](/reference/env-configuration#router_models) 接受 JSON 列表形式的相同规则，适用于自动化部署。

```json
[
  {
    "id": "smart-router",
    "name": "Smart Router",
    "meta": {
      "routes": [
        { "model_id": "code-model", "pattern": "```|def |function " },
        { "model_id": "legal-model", "condition": "The user asks about contracts or legal questions" },
        { "model_id": "general-model" }
      ],
      "strategy": "first"
    },
    "config": {
      "decisions": {
        "api_base_url": "https://decisions.example.com/v1",
        "api_key": "<your key>",
        "model": "example-decisions-model",
        "threshold": 0.5,
        "prompt": ""
      }
    }
  }
]
```
