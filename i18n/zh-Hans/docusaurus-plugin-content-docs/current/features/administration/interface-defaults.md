---
sidebar_position: 12
title: "默认界面设置"
---

## 概述 {#overview}

每个账户都有自己的**设置 > 界面**页面，开箱即用时，所有人都从 Open WebUI 随附的值开始。**默认界面设置**允许管理员为整个实例选择这些初始值，使新账户打开时看到你想要的界面，而不是开箱默认界面。

这些值只是初始值。任何人仍可自行更改其中任何一项。

可以通过以下两种方式配置：

1. **管理员面板**（推荐用于快速编辑和试验）
2. **环境变量（`DEFAULT_INTERFACE_SETTINGS`）**（推荐用于自动化 / GitOps 式部署）

---

:::tip 重命名界面中显示的文字
这些设置决定用户所见选项的初始值。要更改界面本身的措辞、标签或按钮，请使用同一管理页面上的**界面翻译**。请参阅[翻译](/features/administration/translations#interface-text)。
:::

## 如何确定一个值 {#how-a-value-is-decided}

1. 如果用户自己设置过该选项，则使用其设置的值。
2. 否则使用你的实例默认值。
3. 如果你没有为它设置默认值，则使用内置值。

对于用户从未改动过的开关选项，**设置 > 界面**中的开关旁会显示一个小小的**默认**标签。非开关选项没有此标签，但继承方式相同。

未改动过的选项会持续跟踪你的默认值，因此以后更改默认值时，所有未覆盖该选项的人都会随之更新。保存**界面**页面后，这些选项仍保持继承状态，包括**字体**和**图片压缩**尺寸。

:::info 与默认值一致会解除选项覆盖
将控件调整为当前默认值会解除覆盖：**默认**标签会重新出现，该选项也会再次跟随你的默认值。用户可以通过这种方式撤销之前自行做出的选择。

解除覆盖发生在该用户保存其设置时，系统会将各项设置与你当时的默认值进行比较。因此，将某个默认值设为与某用户已自行选择的值相同，本身并不会解除其覆盖：其选择仍保持固定，你的下一次更改也仍不会应用到该用户。下次该用户在**界面**页面保存任何内容时才会解除覆盖；届时，其所有与你当前默认值一致的选项都会一起解除覆盖，而不只是刚刚更改的那一项。
:::

---

## 配置默认值 {#configuring-the-defaults}

### 方式 1：使用管理员面板 {#option-1-using-the-admin-panel}

1. 以管理员身份登录 Open WebUI 实例。
2. 导航到**设置** → **常规**（管理区域）。
3. 找到 **UI** 部分，点击**默认界面设置**旁的**配置**。
4. 设置所需选项。该列表与用户在**设置 > 界面**中看到的列表相同。
5. 点击页面底部的**保存**。

列表上方的一行会统计你已配置的设置数量。你操作过的每个控件都会加入这个集合，包括移动后立即移回原处的控件。因此，请使用**清除**清空集合，让所有设置恢复为内置值。

---

### 方式 2：使用环境变量（`DEFAULT_INTERFACE_SETTINGS`） {#option-2-using-environment-variables-default_interface_settings}

对于自动化部署，请使用 `DEFAULT_INTERFACE_SETTINGS` 环境变量配置默认值。其值必须是表示 **JSON 对象**的 **JSON 字符串**，以[下表](#setting-keys)中的设置名称为键。

**环境变量：**

- `DEFAULT_INTERFACE_SETTINGS`
  - **类型：**`string`（包含一个 JSON 对象）
  - **默认值：**`{}`
  - **说明：**每个账户用于**设置 > 界面**中各选项的初始值

#### 示例（Docker Compose） {#example-docker-compose}

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - 'DEFAULT_INTERFACE_SETTINGS={"chatBubble":false,"widescreenMode":true,"chatHoverPreview":false,"title":{"auto":false}}'
```

如果该值不是有效的 JSON，或者解析结果不是对象，则会被忽略，不会应用任何默认值。

:::tip 覆盖界面页面之外的设置
默认值应用于用户的整条设置记录，其范围比**界面**页面更广。因此，环境变量也接受其他个人设置页面写入的键，例如 `system`（个人系统提示词）、`params`（个人高级参数）、`notificationSound` 和 `keyboardShortcuts`，尽管管理员面板编辑器仅提供界面控件。这些键的继承和解除覆盖方式与表中的键相同。
:::

---

## 设置键 {#setting-keys}

以下按显示顺序列出**设置 > 界面**页面上的每个选项，以及在 `DEFAULT_INTERFACE_SETTINGS` 中使用的名称和未设置默认值时 Open WebUI 使用的值。

### UI {#ui}

| 键 | “设置 > 界面”中的标签 | 内置默认值 |
| --- | --- | --- |
| `textScale` | 界面缩放 | `null`（显示为**默认**），否则为 `1` 到 `1.5` 之间的数字 |
| `fontFamily` | 字体 | `null`（显示为**默认**），否则为字体名称 |
| `highContrastMode` | 无障碍模式 | `false` |
| `showChatTitleInTab` | 在标签页中显示聊天标题 | `true` |
| `userLocation` | 允许使用用户位置 | `false` |
| `hapticFeedback` | 触觉反馈（Android） | `false` |
| `copyFormatted` | 复制格式化文本 | `false` |
| `showUpdateToast` | 新更新的弹出通知 | `true` |
| `showChangelog` | 登录时显示“新增功能”弹窗 | `true` |

`textScale` 是**界面缩放**滑块，`highContrastMode` 是**无障碍模式**。启用无障碍模式后，手机允许最高 5 倍的捏合缩放；禁用后，缩放保持锁定，以免手机自行放大较小的文本输入框。

启用**复制格式化文本**后，助手回答的**复制**操作会尝试同时将 HTML 和纯文本写入剪贴板。粘贴目标应用会选择格式，因此纯文本编辑器仍会粘贴纯文本。如果浏览器的富文本剪贴板写入失败，Open WebUI 会尝试改为复制纯文本。

`fontFamily` 指定字体，该字体必须安装在每位用户自己的机器上。系统不会下载任何内容，因此如果默认值指定的字体未安装在用户机器上，就会直接回退到标准字体，所有人看到的仍是通常的界面。仅在你了解已安装字体的环境中设置此项，例如使用企业字体的受管设备群。

### 聊天 {#chat}

| 键 | “设置 > 界面”中的标签 | 内置默认值 |
| --- | --- | --- |
| `enableMessageQueue` | 启用消息队列 | `true` |
| `chatDirection` | 聊天方向 | `"auto"`，或 `"LTR"` / `"RTL"` |
| `landingPageMode` | 启动页模式 | `""`（显示为**默认**），或 `"chat"` |
| `backgroundImageUrl` | 聊天背景图片 | `null` |
| `chatBubble` | 聊天气泡界面 | `true` |
| `showUsername` | 在聊天中显示用户名而非“你” | `false` |
| `widescreenMode` | 宽屏模式 | `false` |
| `temporaryChatByDefault` | 默认使用临时聊天 | `false` |
| `chatFadeStreamingText` | 流式文本淡入淡出效果 | `true` |
| `renderMarkdownInUserMessages` | 在用户消息中渲染 Markdown | `true` |
| `renderMarkdownInAssistantMessages` | 在助手消息中渲染 Markdown | `true` |
| `renderMarkdownInPreviews` | 在预览中渲染 Markdown | `true` |
| `title.auto` | 自动生成标题 | `true` |
| `autoFollowUps` | 自动生成后续问题 | `true` |
| `autoTags` | 自动生成聊天标签 | `true` |
| `responseAutoCopy` | 自动将回答复制到剪贴板 | `false` |
| `scrollOnResponseGeneration` | 回答时自动滚动 | `true` |
| `scrollOnBranchChange` | 分支切换时滚动 | `true` |
| `insertSuggestionPrompt` | 将建议提示词插入输入框 | `false` |
| `keepFollowUpPrompts` | 在聊天中保留后续问题提示词 | `false` |
| `insertFollowUpPrompt` | 将后续问题提示词插入输入框 | `false` |
| `regenerateMenu` | 重新生成菜单 | `true` |
| `collapseCodeBlocks` | 始终折叠代码块 | `false` |
| `expandDetails` | 始终展开详情 | `false` |
| `chatHoverPreview` | 聊天悬停预览 | `true` |
| `displayMultiModelResponsesInTabs` | 在标签页中显示多模型回答 | `false` |
| `machineFileDisplay` | 机器文件显示 | `sidebar` |
| `machinePreviewAllowSameOrigin` | 机器预览允许同源 | `false` |
| `stylizedPdfExport` | 带样式的 PDF 导出 | `true` |
| `showFloatingActionButtons` | 浮动快捷操作 | `true` |
| `floatingActionButtons` | 浮动快捷操作 > **管理** | `null` |
| `webSearch` | 聊天中的网页搜索 | `null`（显示为**默认**），或 `"always"` |

`title.auto` 是嵌套键，因此在环境变量中写作 `{"title": {"auto": false}}`。

### 输入 {#input}

| 键 | “设置 > 界面”中的标签 | 内置默认值 |
| --- | --- | --- |
| `ctrlEnterToSend` | Enter 键行为 | `false`（**按 Enter 发送**）；`true` 为**按 Ctrl+Enter 发送**，适用于聊天、频道消息和话题回复 |
| `showInputSelections` | 显示输入选择项 | `false` |
| `richTextInput` | 聊天富文本输入 | `true` |
| `promptAutocomplete` | 提示词自动补全 | `false` |
| `showFormattingToolbar` | 显示格式工具栏 | `false` |
| `insertPromptAsRichText` | 以富文本形式插入提示词 | `false` |
| `largeTextAsFile` | 将大段文本粘贴为文件 | `false` |

**显示输入选择项**会在聊天输入框的 **+** 菜单旁显示指示标记，用于标明聊天中已选择的工具、技能和过滤器，以及已启用且符合条件的功能。请先检查用户**设置 > 界面**中的有效开关。如果该开关已启用，但非管理员用户仍看不到某个已选工具的指示标记，请检查管理员**设置 > 界面**中**可见控件**下的**已选工具**。其他指示标记各有自己的可见性开关。

### 生成物 {#artifacts}

| 键 | “设置 > 界面”中的标签 | 内置默认值 |
| --- | --- | --- |
| `detectArtifacts` | 自动检测生成物 | `true` |
| `iframeSandboxAllowScripts` | iframe 沙盒允许脚本 | `true` |
| `iframeSandboxAllowSameOrigin` | iframe 沙盒允许同源 | `false` |
| `iframeSandboxAllowForms` | iframe 沙盒允许表单 | `true` |
| `iframeSandboxAllowDownloads` | iframe 沙盒允许下载 | `true` |

### 语音 {#voice}

| 键 | “设置 > 界面”中的标签 | 内置默认值 |
| --- | --- | --- |
| `voiceInterruption` | 通话中允许语音打断 | `false` |
| `showEmojiInCall` | 通话中显示表情符号 | `false` |

### 文件 {#file}

| 键 | “设置 > 界面”中的标签 | 内置默认值 |
| --- | --- | --- |
| `defaultUploadContext` | 默认上传模式 | `"focused"`（**相关片段**）；`"full"` 为**全文** |
| `imageCompression` | 图片压缩 | `false` |
| `imageCompressionSize` | 图片压缩 > **管理** | `{"width": "", "height": ""}` |
| `imageCompressionInChannels` | 压缩频道中的图片 | `true` |

:::note 并非始终显示的行
一些控件仅在适用时才会出现，例如用户可以访问终端后才会显示终端设置，或者在网页搜索已启用且获准时才会显示**聊天中的网页搜索**。为这些控件设置默认值仍然有效；该默认值会对看到相应控件的用户生效。
:::

---

## 此功能不会执行的操作 {#what-this-does-not-do}

- **不会限制任何人。**每个人仍可完全控制**设置 > 界面**中的每个选项。如需真正强制他人使用你的值，请移除其**界面设置访问**权限（参见[锁定默认值](#locking-the-defaults)），或使用[可见控件](#hiding-controls)隐藏单个选项。
- **不会清除任何人的现有选择。**用户已经自行设置的值都会保留。变化的是他们从未设置过的选项：这些选项会从内置值改为你设置的值。
- **不包括主题或语言。**两者存储在浏览器中，而不是账户中，因此不属于此功能的范围。使用 [`DEFAULT_LOCALE`](/reference/env-configuration#default_locale) 选择初始语言。

---

## 锁定默认值 {#locking-the-defaults}

如果一组账户必须严格使用你的值，请移除其**界面设置访问**权限（参见[权限](/features/authentication-access/rbac/permissions)）。这样会隐藏**界面**页面，并拒绝任何保存个人设置的尝试，使这些账户保持使用你配置的值。管理员不受此权限限制，始终可以更改自己的设置。

---

## 隐藏控件 {#hiding-controls}

**设置 > 界面**（管理区域）中的**可见控件**可向管理员以外的所有人隐藏单个控件。隐藏只会使控件不再显示：其值及其背后的功能仍然有效，因此如需阻止人们使用某项功能，请使用[权限](/features/authentication-access/rbac/permissions)。隐藏**归档**也会隐藏取消归档和**归档所有聊天**。如果某个部分或菜单条目中的控件全部被隐藏，该部分或条目也会随之消失，例如聊天输入菜单中的**附件**或模型编辑器的**功能**部分。也可以通过 [`UI_VISIBILITY`](/reference/env-configuration#ui_visibility) 设置同一列表。

---

## 检查账户覆盖了哪些设置 {#checking-what-an-account-has-overridden}

`GET /api/v1/users/user/settings` 返回已登录账户的设置，其中已填入你的默认值，应用本身使用的就是这一结果。添加 `?raw=true` 可改为获取该账户自己存储的设置，不合并默认值，从而准确查看哪些选项已被固定，哪些仍在继承。

---

## 相关内容 {#related}

- 环境变量参考中的 [`DEFAULT_INTERFACE_SETTINGS`](/reference/env-configuration#default_interface_settings)
- [了解设置](/getting-started/quick-start/settings)，介绍管理员设置与用户设置之间的关系
- [权限](/features/authentication-access/rbac/permissions)，了解**界面设置访问**权限
