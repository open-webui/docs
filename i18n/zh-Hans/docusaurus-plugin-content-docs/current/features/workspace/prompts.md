---
sidebar_position: 3
title: "提示词"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 提示词

<ThemedImage
  alt="工作区提示词：一个模板块位于一排相同副本上方"
  sources={{
    light: useBaseUrl('/images/banners/workspace-prompts-light.svg'),
    dark: useBaseUrl('/images/banners/workspace-prompts-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**可复用的斜杠命令，将复杂指令转化为点击一次即可填写的表单。**

提示词可将常用指令保存为斜杠命令。在任意聊天中输入 `/summarize`，完整提示词就会立即触发。添加自定义输入变量后，用户会在提示词发送前看到一个包含下拉菜单、日期选择器和文本字段的弹出表单。任何人都无需记住确切的措辞或结构。

每次更改都会记录在完整的版本历史中。你可以回滚到先前版本、比较更改，并通过访问控制与团队共享提示词。

---

## 为什么使用提示词？ {#why-prompts}

![工作区中保存的提示词](/images/workspace/prompts-list.png)

### 不必反复输入相同指令 {#stop-retyping-the-same-instructions}

只需保存一次提示词，即可通过 `/command` 使用。缺陷报告模板、会议纪要、代码审查、内容简报：任何需要输入两次以上的内容都应保存为提示词。

### 将提示词转化为交互式表单 {#turn-prompts-into-interactive-forms}

添加带类型的输入变量（下拉菜单、日期选择器、数字字段、复选框），用户就能使用整洁的表单，而不必编辑原始文本。非技术用户无需理解语法，也能运行复杂的提示词。

### 支持回滚的版本历史 {#version-history-with-rollback}

每次内容更改都会创建新版本。你可以浏览历史、预览版本、将其与当前线上版本比较、将其编辑为新版本、将其设为线上版本或删除它。每个版本都会记录更改者和更改内容。取消勾选**设为生产版本**，即可保存版本而不将其上线。重命名、重新标记标签或更改命令不会创建版本。

### 受控共享 {#controlled-sharing}

可与特定用户或组共享提示词。公开提示词会出现在所有人的 `/` 建议中，私有提示词则保留在你自己的工作区中。对于你有权编辑的提示词，在拥有**提示词共享**权限时，可通过**工作区 > 提示词**列表中 **⋯** 菜单内的**访问权限**直接打开[共享设置](/features/authentication-access/rbac/groups#resource-access-rbac)，无需打开编辑器，且其中的每项更改都会立即保存。以写入权限保存提示词时，会保留其现有共享设置，包括你无权自行设置的**公开**状态。

---

## 主要功能 {#key-features}

| | |
| :--- | :--- |
| **斜杠命令** | 输入 `/command` 即可插入完整提示词 |
| **输入变量表单** | 带类型的字段（文本、下拉菜单、日期、数字、复选框等）会生成弹出表单 |
| **版本历史** | 完整的更改跟踪，支持提交信息、回滚和生产版本固定 |
| **系统变量** | `{{CURRENT_DATE}}`、`{{USER_NAME}}`、`{{CLIPBOARD}}` 会在运行时自动替换 |
| **访问控制** | 与特定用户或组共享，或设为公开 |
| **启用/禁用开关** | 无需删除即可停用提示词 |
| **标签** | 整理和筛选提示词库 |

---

## 创建提示词 {#creating-a-prompt}

导航至**工作区 > 提示词**，然后点击工作区标题栏中的**创建**。

| 字段 | 描述 |
| :--- | :--- |
| **名称** | 便于识别的描述性标题 |
| **标签** | 用于筛选的分类 |
| **访问权限** | 控制谁可以查看和使用提示词。需要[**提示词共享**](/features/authentication-access/rbac/permissions#2-sharing-permissions)权限 |
| **命令** | 斜杠命令触发器（例如 `/summarize`） |
| **提示词内容** | 实际发送给模型的文本，可包含变量 |
| **提交信息** | 用于版本跟踪的可选更改说明 |

提示词内容上方的**比较修订**会在空白**建议修订**窗格旁打开原内容。将修订版本粘贴到该窗格中（例如模型生成的版本），点击**比较**标记更改，再使用箭头逐项查看。**应用到草稿**会将右侧窗格的内容放入编辑器。随后保存提示词。

使用清晰的变量名（使用 `{{your_name}}`，而非 `{{var1}}`），添加描述性的 `placeholder` 文本，在适当情况下提供 `default` 值，并且只将真正必需的字段标记为 `:required`。公开提示词会出现在每位用户的 `/` 建议中，因此应谨慎选择要公开的内容。使用启用/禁用开关暂时收起当前不使用的提示词。

---

## 变量 {#variables}

### 系统变量 {#system-variables}

以下变量会在运行时自动替换为对应的值：

| 变量 | 描述 |
| :--- | :--- |
| `{{CLIPBOARD}}` | 剪贴板中的内容。读取剪贴板需要 HTTPS 或 `localhost`。当浏览器阻止读取时（例如在局域网地址上使用 `http://`），Open WebUI 会显示 `Failed to read clipboard contents`，并在提示词中原样保留 `{{CLIPBOARD}}`。 |
| `{{CURRENT_DATE}}` | 当前日期 |
| `{{CURRENT_DATETIME}}` | 当前日期和时间 |
| `{{CURRENT_TIME}}` | 当前时间 |
| `{{CURRENT_TIMEZONE}}` | 当前时区 |
| `{{CURRENT_WEEKDAY}}` | 当前星期几 |
| `{{USER_NAME}}` | 你的显示名称 |
| `{{USER_EMAIL}}` | 你的电子邮件地址 |
| `{{USER_ROLE}}` | 你的角色，例如 `admin` 或 `user` |
| `{{USER_BIO}}` | “设置 > 账户 > 用户资料”中的个人简介（未设置时不替换） |
| `{{USER_GENDER}}` | “设置 > 账户 > 用户资料”中的性别（未设置时不替换） |
| `{{USER_BIRTH_DATE}}` | “设置 > 账户 > 用户资料”中的出生日期（未设置时不替换） |
| `{{USER_AGE}}` | 根据出生日期计算的年龄（未设置时不替换） |
| `{{USER_LANGUAGE}}` | 你选择的语言 |
| `{{USER_LOCATION}}` | 你的位置。浏览器会直接请求地理位置权限，这需要 HTTPS 或 `localhost`。当浏览器阻止请求、你拒绝授权或 10 秒内未收到位置时，Open WebUI 会显示 `Location access not allowed` 并插入 `LOCATION_UNKNOWN`。“界面”开关仅控制随聊天请求发送的位置 |
| `{{USER_GROUPS}}` | 用户所属组的逗号分隔列表，包括通过父组继承的组（没有则为空）。仅在占位符存在时才查询数据库，且仅适用于模型系统提示词和任务模板。在通过 `/` 插入的提示词中，它会保持字面文本。 |

### 自定义输入变量 {#custom-input-variables}

在提示词内容中添加变量后，用户使用斜杠命令时会看到弹出表单。

:::info 此语法仅在提示词内容中有效

本页的语法适用于已保存提示词的内容。将 `{{name | text:required}}` 放入模型的系统提示词不会产生任何作用：它不会声明字段或打开表单，而是作为字面文本发送给模型。

系统提示词应改用[聊天变量](/features/chat-conversations/chat-features/chat-params#chat-variables)，其字段类型相同，但需要添加 `chat.variables.` 前缀，因此上述示例应写为 `{{chat.variables.name | text:required}}`。

:::

**简单输入**会创建单行文本字段：
```
{{variable_name}}
```

**带类型输入**会创建具有已配置属性的特定字段类型：
```
{{variable_name | type:property="value"}}
```

所有自定义变量**默认为可选**。添加 `:required` 可将字段设为必填：
```
{{title | text:required}}
{{notes | textarea:placeholder="Additional context (optional)"}}
```

### 可用输入类型 {#available-input-types}

| 类型 | 描述 | 示例 |
| :--- | :--- | :--- |
| **text** | 单行文本（默认） | `{{name \| text:placeholder="Enter name":required}}` |
| **textarea** | 多行文本 | `{{description \| textarea:required}}` |
| **select** | 下拉菜单 | `{{priority \| select:options=["High","Medium","Low"]:required}}` |
| **number** | 数字输入 | `{{count \| number:min=1:max=100:default=5}}` |
| **checkbox** | 布尔开关 | `{{include_details \| checkbox:label="Include analysis"}}` |
| **date** | 日期选择器 | `{{start_date \| date:required}}` |
| **datetime-local** | 日期和时间选择器 | `{{appointment \| datetime-local}}` |
| **color** | 颜色选择器 | `{{brand_color \| color:default="#FFFFFF"}}` |
| **email** | 带验证的电子邮件字段 | `{{email \| email:required}}` |
| **range** | 滑块 | `{{rating \| range:min=1:max=10}}` |
| **tel** | 电话号码 | `{{phone \| tel}}` |
| **time** | 时间选择器 | `{{meeting_time \| time}}` |
| **url** | 带验证的 URL | `{{website \| url:required}}` |
| **month** | 月份和年份（仅限 Chrome/Edge，在 Firefox/Safari 中回退为文本） | `{{billing_month \| month}}` |
| **map** | 用于选择坐标的交互式地图（实验性） | `{{location \| map}}` |

---

## 消息和提示词修饰符 {#message-and-prompt-modifiers}

这些修饰符尤其适用于任务模型提示词（标题生成、标签生成、后续问题建议），因为此类对话可能包含粘贴文档或代码等长消息。

### 提示词截断 {#prompt-truncation}

`{{prompt}}` 变量支持按字符截断：

| 修饰符 | 作用 |
| :--- | :--- |
| `{{prompt:start:N}}` | 前 N 个字符 |
| `{{prompt:end:N}}` | 后 N 个字符 |
| `{{prompt:middletruncate:N}}` | 前半部分加后半部分，总计 N 个字符 |

### 消息选择器与管道筛选器 {#message-selectors-vs-pipe-filters}

`{{MESSAGES}}` 变量有两种不同的修饰符类型，分别作用于不同层级：

**消息选择器**（冒号 `:`）控制要包含的**消息数量**：

| 选择器 | 作用 | 示例 |
| :--- | :--- | :--- |
| `START:N` | 前 N 条消息 | `{{MESSAGES:START:5}}` |
| `END:N` | 后 N 条消息 | `{{MESSAGES:END:5}}` |
| `MIDDLETRUNCATE:N` | 前 N/2 条加后 N/2 条消息 | `{{MESSAGES:MIDDLETRUNCATE:6}}` |

对于 20 条消息，`{{MESSAGES:MIDDLETRUNCATE:6}}` 会保留第 1–3 条和第 18–20 条消息，跳过中间的 14 条。

**管道筛选器**（竖线 `|`）将**每条消息的内容**分别截断至指定字符数：

| 筛选器 | 作用 | 示例 |
| :--- | :--- | :--- |
| `\|start:N` | 每条消息的前 N 个字符 | `\{\{MESSAGES\|start:300\}\}` |
| `\|end:N` | 每条消息的后 N 个字符 | `\{\{MESSAGES\|end:300\}\}` |
| `\|middletruncate:N` | 每条消息的前半部分加后半部分 | `\{\{MESSAGES\|middletruncate:500\}\}` |

**组合使用两者**，即可控制包含哪些消息以及每条消息的长度：

| 语法 | 作用 |
| :--- | :--- |
| `\{\{MESSAGES:END:2\|middletruncate:500\}\}` | 后 2 条消息，每条最多 500 个字符 |
| `\{\{MESSAGES:START:5\|start:200\}\}` | 前 5 条消息，每条最多 200 个字符 |
| `\{\{MESSAGES:MIDDLETRUNCATE:10\|middletruncate:50\}\}` | 前 5 条加后 5 条消息，每条最多 50 个字符 |

:::warning 选择器计算的是消息数，而非字符数
`{{MESSAGES:MIDDLETRUNCATE:500}}` 会选择 **500 条消息**。如需限制每条消息的字符数，请使用管道筛选器：`\{\{MESSAGES\|middletruncate:500\}\}`。不使用管道筛选器时，一份粘贴的长文档就可能占满整个上下文窗口。
:::

---

## 版本历史 {#version-history}

每次保存提示词内容更改都会创建新版本。编辑提示词时，提示词内容上方的历史菜单默认显示 **Live**，即当前生效的生产版本。打开该菜单可按从新到旧的顺序列出版本，每个版本均附有提交信息和作者（悬停可查看日期），并可通过**加载更多**查看更早的版本。

- 点击任意版本即可**预览**。其内容以只读方式打开。
- **与当前版本比较**会显示该版本与线上版本之间的差异：名称和标签并排显示，随后以差异视图显示提示词内容。布局菜单可在**拆分**与**统一**之间切换，浏览器会记住你的选择。仅涉及换行符的更改会报告为**仅换行符已更改**。任一版本的内容超过 5000 行时无法比较（`Diff is limited to 5000 lines per version`）。
- **编辑为新版本**会使预览内容可编辑。保存时会基于它创建一个新版本。此处**保存**旁的**设为生产版本**复选框默认未勾选，因此在你勾选之前，线上提示词保持不变。
- **设为生产版本**会将该版本恢复为当前生效版本。
- 版本的 **⋯** 菜单中的**删除**会在你通过**删除版本**对话框确认后删除该版本。线上版本无法删除。基于已删除版本保存的后续版本会重新链接到其父版本，因此历史记录仍保持连贯。

![提示词编辑器中的“与当前版本比较”，在拆分布局下，左侧为旧版本，右侧为生产版本](/images/workspace/prompt-version-compare.webp)

存在未保存更改时，切换到其他版本或离开编辑器会先询问是否放弃这些更改。任何可以查看提示词的人都能打开并比较其版本；编辑、将版本设为线上版本和删除则需要写入权限。

通过 API，`GET /api/v1/prompts/id/{prompt_id}/history/diff?from_id=...&to_id=...` 会返回两个快照、以行列表表示的内容差异、`name_changed` 和 `line_endings_only`；当内容仅有换行符不同时，最后一项为 `true`。

:::note 迁移
版本控制更新前创建的提示词已自动迁移，其内容会保留为初始“Live”版本。URL 结构已从基于命令改为基于 ID，因此现有书签可能需要更新。自 v0.5.0 起，所有变量默认均为可选。
:::

---

## 导入和导出 {#import-and-export}

**工作区 > 提示词**的工作区标题栏中的**导出 JSON**，会将你可读取的所有提示词保存到一个 JSON 文件。提示词 **⋯** 菜单中的**导出**仅保存该提示词。两者都需要[**导出提示词**](/features/authentication-access/rbac/permissions)权限，而**导入 JSON** 需要**导入提示词**权限。管理员始终可以看到这三个操作。

导出文件包含每个提示词的命令、名称、内容、标签、`is_active`、`data`、`meta`、所有者、时间戳和访问授权，但不包含版本历史。

**导入 JSON** 只读取文件中每个提示词的 `command`、`name` 和 `content`，忽略其他所有内容。导入的提示词没有标签、处于启用状态，并且仅对你私有。导入后请重新添加标签和共享设置。

如果某提示词的命令已存在于实例中（无论属于哪个用户），该提示词会被跳过并显示 `Uh-oh! This command is already registered. Please choose another command string.`，文件中的其余提示词仍会继续导入。

---

## 示例 {#examples}

### 缺陷报告生成器（`/bug_report`） {#bug-report-generator-bug_report}

这是一个结构化表单，包含必填摘要、优先级下拉菜单和复现步骤，以及可选的上下文字段：

```txt
Generate a bug report with the following details:

**Summary:** {{summary | text:placeholder="A brief summary of the issue":required}}
**Priority:** {{priority | select:options=["Critical","High","Medium","Low"]:default="Medium":required}}
**Steps to Reproduce:**
{{steps | textarea:placeholder="1. Go to...\n2. Click on...\n3. See error...":required}}

**Additional Context:** {{additional_context | textarea:placeholder="Browser version, OS, screenshots, etc."}}
**Workaround:** {{workaround | textarea:placeholder="Any temporary solutions found"}}

Please format this into a clear and complete bug report document.
```

### 会议纪要（`/meeting_minutes`） {#meeting-minutes-meeting_minutes}

包含日期和时间选择器、必填的参会人员与议程，以及可选的决议和待办事项：

```txt
# Meeting Minutes

**Date:** {{meeting_date | date:required}}
**Time:** {{meeting_time | time:required}}
**Title:** {{title | text:placeholder="e.g., Weekly Team Sync":required}}
**Attendees:** {{attendees | text:placeholder="Comma-separated list of names":required}}

## Agenda / Key Discussion Points
{{agenda_items | textarea:placeholder="Paste the agenda or list the key topics discussed.":required}}

## Decisions Made
{{decisions | textarea:placeholder="Key decisions and outcomes"}}

## Action Items
{{action_items | textarea:placeholder="Action item, assignee, and deadline for each."}}

## Next Meeting
**Date:** {{next_meeting | date}}
**Topics:** {{next_topics | text:placeholder="Items to discuss next time"}}

Please format this into a clean and professional meeting summary.
```

### 标题生成（任务模型模板） {#title-generation-task-model-template}

结合使用消息选择器和管道筛选器，以保持较小的上下文：

```txt
Chat history:
<chat_history>
{{MESSAGES:END:2|middletruncate:500}}
</chat_history>

Generate a short title for this conversation.
```

仅发送最后 2 条消息，每条最多 500 个字符。

---

## 限制 {#limitations}

### 斜杠命令命名空间 {#slash-command-namespace}

公开提示词会出现在每位用户的 `/` 建议中。公开提示词过多会使菜单杂乱。使用启用/禁用开关，可避免非活动提示词出现在建议中。

[内置斜杠命令](/features/chat-conversations/chat-features/)的名称实际上已被保留：`compact`、`status`、`fork` 和 `model`。使用这些命令之一的提示词仍会显示在菜单中，并且从菜单选择后仍可正常工作，但用户手动输入并发送该命令时，触发的将是内置命令而非提示词。请选择其他命令名称。

### 默认可选 {#optional-by-default}

除非标记为 `:required`，否则所有自定义输入变量均为可选。如果提示词依赖某个字段，请显式添加 `:required`。
