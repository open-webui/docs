---
sidebar_position: 4
title: "导入与导出"
---

Open WebUI 提供备份聊天历史记录并在日后恢复的工具，也支持从其他平台迁移对话。

## 访问导入与导出 {#accessing-import--export}

1. 点击侧边栏左下角的**个人资料名称**或头像。
2. 从菜单中选择**设置**。
3. 进入**数据控制**标签页。
4. 使用**导入聊天**或**导出聊天**按钮。

## 导出聊天 {#exporting-chats}

点击**导出聊天**按钮，将所有对话下载为一个 JSON 文件。此备份包括：

- 所有聊天消息及其元数据
- 每个对话使用的模型信息
- 时间戳和对话结构

:::warning 导出内容不包括图像和附件
在已保存的聊天中，你附加的图像和其他文件会作为文件上传到服务器。聊天及其导出内容仅保留每个文件的 ID 和名称，Open WebUI 在显示消息时会从 `/api/v1/files/<id>/content` 加载图像。将聊天导入另一个 Open WebUI 实例后，这些图像无法加载，这些文件也无法打开，因为该实例中没有具有此 ID 的文件。如果在迁移后仍需这些文件，请保留原文件。

临时聊天是例外。图像以 base64 数据的形式保留在聊天中，其他文件则以提取的文本形式保留，因此临时聊天菜单中的**下载** > **导出聊天 (.json)** 会包含这些内容。
:::

:::tip 定期备份
定期导出聊天是一种良好做法，尤其是在重大更新或迁移之前。
:::

要将单个对话保存为 PDF，请打开聊天顶部或侧边栏中可编辑聊天旁的三点菜单。选择**下载 > PDF 文档 (.pdf)**。**允许聊天导出**默认开启。如果管理员移除此[权限](/features/authentication-access/rbac/permissions#3-chat-permissions)，受影响用户的**下载**菜单会被隐藏。管理员仍保留访问权限。

**设置 > 界面 > 美化 PDF 导出**默认开启。它会将呈现后的对话捕获为页面图像。如果美化版 PDF 为空白或文件过大，或者你需要可选择的文本，请关闭此设置并重新导出 PDF。基于文本的 PDF 包含当前分支的消息文本，不包含呈现后的布局或内嵌图像。

## 导入聊天 {#importing-chats}

点击**导入聊天**按钮并选择 JSON 文件即可恢复对话。Open WebUI 支持从以下来源导入：

- **Open WebUI 导出文件**：先前导出的原生 JSON 格式
- **ChatGPT 导出文件**：从 OpenAI 的 ChatGPT 导出的对话（自动检测并转换）
- **自定义 JSON 文件**：任何符合下述预期结构的 JSON 文件

:::info 导入权限也适用于创建分支

**允许聊天导入**同样控制[创建聊天分支](/features/chat-conversations/chat-features/)，该操作会将现有对话复制到新对话中。未授予此权限时，此处的**导入聊天**行、助手回复下的**创建聊天分支**操作，以及聊天输入框 `/` 菜单中的 `/fork` 条目都不会显示在界面中，而不是显示后再拒绝操作。管理员始终不受限制。请参阅[权限](/features/authentication-access/rbac/permissions#3-chat-permissions)。

:::

### 导入行为 {#import-behavior}

- 导入的聊天会添加到现有对话中（不会替换它们）
- 每个导入的聊天都会获得新的唯一 ID，因此重复导入同一文件会创建重复聊天
- 使用 ChatGPT 导出文件时，系统会自动检测并转换其格式
- 文件中你的账户尚没有的标签会被创建。导出内容会将每个标签以小写加下划线的形式存储，因此名为 Import Test 的标签会恢复为 import_test

### 在实例之间移动聊天 {#moving-chats-between-instances}

聊天 JSON 导出文件（包括文件夹菜单中的**导出**）包含对话记录。导入这些文件不会创建文件夹，也不会恢复系统提示词等文件夹设置。仅当目标实例上存在 ID 完全相同的文件夹且你对其具有写入权限时，Open WebUI 才会保留导出的文件夹 ID。否则，聊天会导入到所有文件夹之外。请在目标实例上重新创建文件夹及其设置，然后将导入的聊天移入其中。

## 聊天导入 JSON 架构 {#chat-import-json-schema}

导入文件必须是由聊天对象组成的 **JSON 数组**。支持两种格式：**标准格式**（Open WebUI 导出使用）和**旧版格式**。

### 标准格式（推荐） {#standard-format-recommended}

数组中的每个对象都应具有包含对话数据的 `chat` 键：

```json
[
  {
    "chat": {
      "title": "My Conversation",
      "models": ["qwen3.6:27b"],
      "history": {
        "currentId": "message-id-2",
        "messages": {
          "message-id-1": {
            "id": "message-id-1",
            "parentId": null,
            "childrenIds": ["message-id-2"],
            "role": "user",
            "content": "Hello, how are you?",
            "timestamp": 1700000000
          },
          "message-id-2": {
            "id": "message-id-2",
            "parentId": "message-id-1",
            "childrenIds": [],
            "role": "assistant",
            "content": "I'm doing well, thank you!",
            "model": "qwen3.6:27b",
            "done": true,
            "timestamp": 1700000005
          }
        }
      }
    },
    "meta": {
      "tags": ["greeting"]
    },
    "pinned": false,
    "folder_id": null,
    "created_at": 1700000000,
    "updated_at": 1700000005
  }
]
```

### 旧版格式 {#legacy-format}

如果数组中的对象**没有** `chat` 键，则整个对象会被视为聊天数据本身（即对象会自动包装在 `{ "chat": <object> }` 中）：

```json
[
  {
    "title": "My Conversation",
    "models": ["qwen3.6:27b"],
    "history": {
      "currentId": "message-id-2",
      "messages": {
        "message-id-1": {
          "id": "message-id-1",
          "parentId": null,
          "childrenIds": ["message-id-2"],
          "role": "user",
          "content": "Hello!"
        },
        "message-id-2": {
          "id": "message-id-2",
          "parentId": "message-id-1",
          "childrenIds": [],
          "role": "assistant",
          "content": "Hi there!",
          "model": "qwen3.6:27b",
          "done": true
        }
      }
    }
  }
]
```

### 字段参考 {#field-reference}

#### 顶级聊天对象（标准格式） {#top-level-chat-object-standard-format}

| 字段 | 类型 | 必需 | 描述 |
|---|---|---|---|
| `chat` | object | 是 | 对话数据（见下方“聊天数据”） |
| `meta` | object | 否 | 元数据，例如 `tags`（字符串数组）。默认为 `{}` |
| `pinned` | boolean | 否 | 聊天是否置顶。默认为 `false` |
| `archived` | boolean | 否 | 聊天是否已归档。默认为 `false`。已归档聊天会导入到**设置 > 已归档聊天**中 |
| `variables` | object | 否 | 为聊天的[聊天变量](/features/chat-conversations/chat-features/chat-params#chat-variables)填写的值。默认为 `{}` |
| `folder_id` | string \| null | 否 | 用于放置聊天的文件夹 ID。默认为 `null`。它必须指向你有写入权限的文件夹，可以是你拥有的文件夹，也可以是以**写入**权限共享给你的文件夹。如果文件夹不存在，或仅以只读权限共享给你，该值会被清除，聊天将导入到所有文件夹之外，而不会导致导入失败 |
| `created_at` | integer \| null | 否 | 聊天创建时间的 Unix 时间戳（秒） |
| `updated_at` | integer \| null | 否 | 聊天最后更新时间的 Unix 时间戳（秒） |

#### 聊天数据对象 {#chat-data-object}

| 字段 | 类型 | 必需 | 描述 |
|---|---|---|---|
| `title` | string | 否 | 对话标题。默认为 `"New Chat"` |
| `models` | string[] | 否 | 对话中使用的模型标识符列表 |
| `history` | object | 是 | 包含消息树（见下方“历史记录”） |
| `options` | object | 否 | 聊天级选项/参数 |

#### 历史记录对象 {#history-object}

| 字段 | 类型 | 必需 | 描述 |
|---|---|---|---|
| `currentId` | string | 是 | 当前对话分支中最后一条消息的 ID |
| `messages` | object | 是 | 消息 ID → 消息对象的映射（见下方“消息”） |

#### 消息对象 {#message-object}

| 字段 | 类型 | 必需 | 描述 |
|---|---|---|---|
| `id` | string | 是 | 消息的唯一标识符 |
| `parentId` | string \| null | 是 | 父消息的 ID；首条消息为 `null` |
| `childrenIds` | string[] | 是 | 子消息 ID 数组。最后一条消息使用空数组 `[]` |
| `role` | string | 是 | 为 `"user"` 或 `"assistant"` |
| `content` | string | 是 | 消息文本（支持 Markdown） |
| `model` | string | 否 | 模型标识符（适用于助手消息） |
| `done` | boolean | 否 | 回复是否已完成 |
| `timestamp` | integer | 否 | 消息的 Unix 时间戳（秒） |
| `context` | string \| null | 否 | 消息的附加上下文 |

:::info 消息树结构
消息使用**树结构**而非平面列表。每条消息通过 `parentId` 引用其父消息，并通过 `childrenIds` 引用其子消息。这使 Open WebUI 能够支持分支对话（例如编辑一条消息并获得不同的回复）。`history.currentId` 字段指向当前活动分支中的最后一条消息。
:::

### ChatGPT 导出格式 {#chatgpt-export-format}

当数组中的任何对象包含 `mapping` 键时，系统会自动检测 ChatGPT 导出文件；没有此键的条目（ChatGPT 的文件夹和项目记录）会被跳过。你无需手动转换 ChatGPT 导出文件：直接导入文件，Open WebUI 会处理转换。

### 最小可用示例 {#minimal-working-example}

最小的有效导入文件如下所示：

```json
[
  {
    "title": "Quick Chat",
    "history": {
      "currentId": "msg-1",
      "messages": {
        "msg-1": {
          "id": "msg-1",
          "parentId": null,
          "childrenIds": [],
          "role": "user",
          "content": "Hello!"
        }
      }
    }
  }
]
```

此示例使用旧版格式（没有 `chat` 包装器），仅包含一条用户消息。

## 常见问题 {#faq}

**问：导入聊天会覆盖现有对话吗？**

**答：**不会。导入的聊天会与现有对话并存。

**问：可以从 Claude、Gemini 或其他平台导入聊天吗？**

**答：**没有针对这些平台的内置转换器。你需要将导出文件转换为上述 JSON 结构。关键要求是使用正确的 `parentId` / `childrenIds` 关系构建消息树。

**问：导入有大小限制吗？**

**答：**没有硬编码的限制，但处理非常大的文件可能需要更长时间。实际上限取决于你的服务器配置和可用内存。

**问：如果同一文件导入两次会怎样？**

**答：**每次导入都会创建具有全新 ID 的聊天，因此最终会出现重复对话。

**问：支持哪些消息角色？**

**答：**导入支持 `"user"` 和 `"assistant"` 角色。系统消息通常通过模型配置设置，而不是存储在聊天历史记录中。
