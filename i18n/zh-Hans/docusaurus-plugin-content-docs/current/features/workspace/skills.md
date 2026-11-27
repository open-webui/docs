---
sidebar_position: 6
title: "技能"
sidebar_label: "技能"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 技能

<ThemedImage
  alt="工作区技能：四个区块，上方叠放着第五个区块"
  sources={{
    light: useBaseUrl('/images/banners/workspace-skills-light.svg'),
    dark: useBaseUrl('/images/banners/workspace-skills-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**通过纯文本指令，教 AI 如何处理任务。**

技能是基于 Markdown 的可复用指令集，可附加到模型，也可在聊天中即时调用。与[工具](/features/extensibility/plugin/tools)（可执行的 Python 脚本）不同，技能是纯文本指令：代码审查准则、写作风格规则、故障排除手册、数据分析工作流。模型会读取并遵循这些指令。

在聊天中使用 `$` 提及技能，或将其绑定到模型，使每个新聊天开始时都选中该技能。你可读取的其他所有技能仍保持可用，模型会在需要时加载它们。

---

## 为什么使用技能？ {#why-skills}

![工作区中的技能](/images/workspace/skills-list.png)

### 无需代码即可编写指令 {#instructions-without-code}

使用 Markdown 编写准则。无需 Python、API 调用或部署。只要会编写文档，就能创建技能。

### 按需加载上下文 {#on-demand-context-loading}

借助[技能工具](#skill-tools)，你可读取的每个技能都会按名称和描述列出，模型会在需要时加载相应技能。已选技能会在模型回答前加载。

### 跨模型复用 {#reusable-across-models}

创建一个“代码审查准则”技能，并将其附加到每个编程模型。只需更新技能一次，每个模型都会获得新版本。

### 可与工具组合 {#composable-with-tools}

将技能与 [Open Terminal](/features/open-terminal) 或任意工具服务器搭配使用。技能负责教模型*如何*使用工具（检查退出代码、处理错误、对长时间运行的命令使用流式输出），工具则提供相应的*能力*。

---

## 主要功能 {#key-features}

| | |
| :--- | :--- |
| **Markdown 内容** | 使用纯 Markdown 编写指令 |
| **支持文件** | 在 `SKILL.md` 旁提供脚本、参考资料、模板和资源 |
| **版本历史** | 每次保存都会生成一个版本，可比较、导出或重新设为当前版本 |
| **在聊天中使用 $ 提及** | 输入 `$`，将技能指令注入当前消息 |
| **按聊天开关** | 通过 **+** 菜单为单个聊天启用技能，无需编辑模型 |
| **模型绑定** | 将技能附加到模型，使新聊天开始时自动选中它们 |
| **延迟加载** | 未选中的技能会列在清单中，并按需加载 |
| **导入/导出** | 导入 ZIP 压缩包、`.skill` 文件、技能文件夹、JSON 或单个 `.md` 文件，或从 URL 加载；导出为 `.skill`、ZIP 或 JSON |
| **社区** | 在 openwebui.com 上查找技能并共享自己的技能 |
| **访问控制** | 默认私有，可与用户或组共享 |
| **启用/停用开关** | 无需删除即可停用技能 |

---

## 技能的工作方式 {#how-skills-work}

### 用户选择的技能（$ 提及） {#user-selected-skills--mention}

在聊天输入框中输入 `$`，或使用 `/` 菜单，然后选择一个技能。启用[技能工具](#skill-tools)时，技能会在模型回答前加载，每个聊天仅加载一次。未启用时，其指令会随每条消息加入系统提示词。仅包含 `$` 提及的消息会以技能名称作为消息文本发送。

### 按聊天选择技能 {#per-chat-skills}

通过 **+** 菜单 > **技能**，可为当前聊天启用技能。列表分为**工作区**和所选机器两组，后者以机器名称命名，请参阅[来自机器的技能](#skills-from-a-machine)。徽章会显示已启用的数量。已选技能的加载方式与通过 `$` 提及的技能相同。

### 模型附加的技能 {#model-attached-skills}

使用单个模型开始新聊天时，会自动选中该模型的技能。

启用[技能工具](#skill-tools)时，你可读取的每个活动技能都会按名称和描述列在消息后的隐藏 `list_available_skills` 结果中。模型会在需要时使用 `view_skill` 加载相应技能，因此大量技能也只占用很少上下文。已选技能也以相同方式加载，即作为隐藏的 `view_skill` 结果，每个聊天仅加载一次。你在聊天中关闭的技能仍会保留在列表中。

未启用技能工具时不会生成列表。已选技能、被提及的技能和模型技能会随每条消息注入系统提示词，最多注入 `SKILL.md` 的前 100,000 个字符；即使在聊天中关闭模型技能，它们仍会被注入。

如果 `SKILL.md` 的长度超过[读取上限](#read-limits)，模型会先收到预览，再使用 `read_skill_file` 继续读取。

### 按需加载已选技能 {#loading-selected-skills-on-demand}

**设置 > 常规**（管理员区域）中的**按需加载已选技能**（[`ENABLE_SKILL_LAZY_LOADING`](/reference/env-configuration#enable_skill_lazy_loading)，默认关闭）会阻止已选技能和模型技能在模型回答前加载，使它们仅在模型请求时加载。在聊天中通过 `$` 提及的技能仍会随消息加载。此设置需要技能工具。

### 技能工具 {#skill-tools}

使用原生函数调用，并启用**内置工具**能力和模型的**技能**类别时，模型会获得以下工具。只要列出了至少一个技能，就会提供前三个工具；列出工作区技能时还会提供 `update_skill_files`。`/skills:create` 同样需要这些工具。

| 工具 | 作用 |
| :--- | :--- |
| `view_skill` | 加载技能的 `SKILL.md` 及其文件列表，最多达到读取上限。 |
| `read_skill_file` | 从指定偏移量读取技能的一个文件，每次调用最多达到读取上限。对于二进制文件，会返回文件大小和技能编辑器链接。 |
| `grep_skill_files` | 在技能的文本文件中搜索单词、短语或正则表达式并返回摘录，默认返回 10 条，最多 30 条。 |
| `update_skill_files` | 将文件更改保存为用户有权编辑的技能的新版本。如果在此期间有人保存了该技能，则会因冲突而拒绝操作。 |
| `create_skill` | 根据 `SKILL.md` 文本和可选文本文件，在工作区中创建新的私有技能。提供给管理员和拥有**技能访问权限**的用户。 |

读取技能的工具会检查用户对该技能的访问权限。对非活动技能拥有写入权限的用户，仍可以让模型加载和读取该技能。

### 读取上限 {#read-limits}

**设置 > 常规**（管理员区域）中的两个设置决定模型每次可获取多少技能内容：

| 设置 | 默认值 | 作用 |
| :--- | :--- | :--- |
| **技能读取上限** | 20,000 | 模型单次读取可获取的最大字符数 |
| **技能预览长度** | 5,000 | 当 `SKILL.md` 超过读取上限时，模型首先获取的字符数 |

将字段留空即可使用默认值，也可设置 [`SKILL_CONTENT_MAX_CHARS`](/reference/env-configuration#skill_content_max_chars) 和 [`SKILL_PREVIEW_MAX_CHARS`](/reference/env-configuration#skill_preview_max_chars)。

### 来自机器的技能 {#skills-from-a-machine}

已连接的 [Open Terminal](/features/open-terminal) 机器可以携带自己的技能，这些技能与它们所描述的文件一起保存在工作区中。Open WebUI 会从服务器读取这些技能，并在 `$` 选择器中将它们与工作区技能一起提供，其 ID 采用 `terminal:<url-encoded name>` 形式。它们的行为与其他技能相同：`$` 提及会注入内容，否则会列在同一清单中并通过 `view_skill` 加载。注入的内容包含技能目录及其随附文件，因此模型知道应从工作区中的哪个位置读取它们。`read_skill_file` 可分页读取终端技能的 `SKILL.md`，`grep_skill_files` 可搜索该文件；其他文件仍保留在机器上，模型使用该机器自己的文件工具打开它们。技能编辑器、版本历史和 `update_skill_files` 适用于工作区技能。

对于管理员配置的机器，Open WebUI 服务器会使用连接的身份验证信息、`Accept: application/json`、`X-User-Id`、`X-Session-Id`（聊天 ID）以及编排机器的 [`X-Terminal-*` 请求头](/features/open-terminal/terminals/orchestration/api-troubleshooting#headers-sent-to-the-terminals-server)发起调用。这些身份请求头与其他所有机器调用相同，因此按用户或聊天限定技能范围的服务器能获得所需信息。不会跟随重定向。对于用户在 [Tether 应用](/ecosystem/tether#bring-your-own-models-and-tools)中添加的机器，会通过用户计算机上的 Tether 发起调用，因此在 Tether 保持连接时，该机器可以与其他位置托管的 Open WebUI 配合工作。

---

## 创建技能 {#creating-a-skill}

导航至**工作区 > 技能**，然后点击工作区标题栏中的**创建**。

| 字段 | 描述 |
| :--- | :--- |
| **名称** | 便于阅读的显示名称（例如“代码审查准则”） |
| **技能 ID** | 唯一标识符，根据名称自动生成。创建期间可编辑，之后为只读 |
| **描述** | 显示在清单中的简短摘要。对于模型附加的技能，模型会据此决定是否加载完整指令 |
| **文件** | 包含完整 Markdown 技能指令的 `SKILL.md`，以及任意支持文件 |

名称旁的地球选择器可按语言翻译**名称**和**描述**，使技能在任何列出位置都以用户自己的语言显示。请参阅[翻译](/features/administration/translations)。

创建技能时，在 `SKILL.md` 中输入或粘贴的 YAML frontmatter 会填充空白的**名称**和**描述**：`name: code-review-guidelines` 会转化为名称“Code Review Guidelines”。frontmatter 会按真正的 YAML 解析，因此带引号和多行的值会按所写内容传入。

在**保存**旁的**描述此更改**中添加简短说明，可为本次保存创建的版本添加标签（请参阅[版本历史](#version-history)）。

### 支持文件 {#supporting-files}

一个技能就是一个小文件夹：根目录中包含 `SKILL.md`，以及指令引用的任意文件，例如 `scripts/` 中的脚本、`references/` 中的详细文档、`templates/` 中的可复用输出，以及 `assets/` 中的图像或其他资源。编辑器的文件面板会以树状结构列出这些文件。其 **...** 菜单提供**新建文件**、**新建文件夹**、**上传**和**上传文件夹**。条目可以重命名、删除或拖到其他文件夹，当前打开的文件提供**下载**按钮。文本文件还提供**复制**（用于复制其内容）；如果你可以编辑技能，还会提供**比较修订**：它会在空白的**建议修订**窗格旁打开文件。将修订版本粘贴到该窗格中，点击**比较**标记更改，再使用箭头逐项查看。**应用到草稿**会将右侧窗格的内容放入文件。随后保存技能。Markdown 文件提供**预览**，图像和 PDF 会就地打开，其他二进制文件则提供下载。

| 限制 | 值 |
| :--- | :--- |
| 单个文件大小 | 10 MiB |
| 一个技能中所有文件的总大小 | 50 MiB |
| 每个技能的文件数 | 1,000 |

文本文件以文本形式存储，其他文件以二进制形式存储。`SKILL.md` 必须保留在根目录，并且必须是 UTF-8 文本。点击**保存**时，所有文件更改会一并提交。

### 导入技能 {#importing-skills}

**创建**旁的箭头菜单提供三个导入项：

- **导入**接受一个或多个 `.zip`、`.skill`、`.json` 或 `.md` 文件，每次导入最大 200 MiB。`.skill` 文件属于 ZIP，按相同方式读取。ZIP 可以包含根目录带有 `SKILL.md` 的单个技能，也可以包含多个各自带有 `SKILL.md` 的技能文件夹。`.md` 文件会转化为以该文件作为 `SKILL.md` 的技能。JSON 文件是 Open WebUI 的技能导出文件，也支持仅含单个 `content` 字段的旧版导出。包含符号链接或其他特殊文件的 ZIP 或 `.skill` 文件会被拒绝，并显示 `Archives cannot contain links or special files`。需要**技能访问权限**和**导入技能**权限。
- **从 URL 导入**（仅限管理员）通过链接下载技能。请参阅[从 URL 导入](#importing-from-a-url)。
- **导入文件夹**接受计算机上的一个技能文件夹，或一个包含多个技能文件夹的目录，其中每个技能文件夹都有自己的 `SKILL.md`。需要**技能访问权限**和**导入技能**权限。

每次导入都会打开预览，列出每个技能的名称、ID 和文件。对于每个技能，可选择**创建**、**创建副本**、**替换**或**跳过**。ID 或名称已存在的技能默认选择**跳过**；为其提供唯一 ID 和名称，即可将其创建为副本。**替换**会显示在你可以编辑的现有技能上，并将导入内容保存为该技能的新版本，同时保持其共享设置不变。新技能和副本最初均为私有。

### 从 Markdown 导入 {#importing-from-markdown}

从 ZIP、文件夹或 `.md` 文件导入的技能会从 `SKILL.md` frontmatter 获取名称和描述，并根据名称生成 ID；JSON 导出文件则自带这些字段：

```yaml
---
name: code-review-guidelines
description: Step-by-step instructions for thorough code reviews
---

# Code Review Guidelines

1. Check for correctness...
```

### 从 URL 导入 {#importing-from-a-url}

**创建**旁箭头菜单中的**从 URL 导入**可直接从 Web 加载技能。此功能面向管理员开放。粘贴以下任一类链接：

| 链接 | 导入的内容 |
| :--- | :--- |
| GitHub 仓库，例如 `https://github.com/owner/repo` | 仓库中的每个技能：每个包含 `SKILL.md` 的文件夹；如果 `SKILL.md` 位于根目录，则导入整个仓库 |
| GitHub 文件夹，`https://github.com/owner/repo/tree/<branch>/<folder>` | 该文件夹中的技能 |
| GitHub 上的 `SKILL.md`，`https://github.com/owner/repo/blob/<branch>/<folder>/SKILL.md` | 该 `SKILL.md` 所在文件夹中的技能及其所有文件 |
| 指向 `.zip`、`.skill`、`.json` 或 `.md` 文件的直接链接 | 该文件中的技能，读取方式与上传相同 |

GitHub 链接会以该分支、标签或提交所对应仓库的 ZIP 形式下载，因此技能会连同其支持文件一起导入。包含 `/` 的分支名称必须进行 URL 编码（`%2F`），也可以改用提交链接。从任意链接下载的 ZIP 或 `.skill` 文件会跳过技能文件夹之外的符号链接和其他特殊文件，因此仓库其他位置存在此类链接时仍可导入。技能文件夹内部的符号链接或特殊文件会导致导入被拒绝，并显示 `Archives cannot contain links or special files`。找到的技能会在与上传相同的导入预览中打开，你可以在其中选择要创建的内容。

下载开始前以及每次重定向时，链接都会按照与 Web 获取相同的地址规则接受检查，因此在 [`ENABLE_LOCAL_WEB_FETCH`](/reference/env-configuration#enable_local_web_fetch) 关闭时，指向私有网络的链接会被拒绝。最多跟随 5 次重定向，60 秒后放弃，下载上限为 200 MiB。返回网页的链接会被拒绝，并提示使用原始文件或 ZIP 下载链接；在 GitHub 上，上述仓库、文件夹和 `SKILL.md` 链接可直接使用。

### 在聊天中通过 `/skills:create` 创建 {#from-a-chat-with-skillscreate}

聊天中刚完成的工作流可以转化为技能，无需你自行编写。在该聊天中输入 `/skills:create`，后面可选择性添加技能应涵盖的内容；模型会收集材料，按照下述标准编写一个 `SKILL.md`，并使用 `create_skill` 工具将其保存到你的**工作区 > 技能**，同时保存 `scripts/`、`references/`、`templates/` 或 `assets/` 下的任何支持文本文件。新技能为私有。完成后，模型会报告名称、位置和一行摘要，还可以使用 `update_skill_files` 修订你有权编辑的现有技能。

命令后输入的所有内容都会被视为创作指导。可以在这条请求中自由混用要提取的来源（路径、URL、“我们刚才做的操作”、粘贴的笔记）和影响结果的要求（重点、排除项、命名、风格）。

该命令需要：

- **技能访问权限**工作区权限（管理员始终拥有），
- 已启用内置工具且**内置工具**下的**技能**类别已开启的模型，
- 一个**已有内容**的聊天，因为聊天内容就是原始材料。

服务器会先检查全部三项，再允许模型保存任何内容。聊天已有内容且你拥有权限后，`/` 菜单就会提供该命令。

---

## 技能编写标准 {#skill-authoring-standard}

这是 Open WebUI 自身通过 `/skills:create` 编写技能时遵循的标准，也是你的自有技能应遵循的标准。

**Frontmatter（前置元数据）**

| 键 | 规则 |
| :--- | :--- |
| `name` | 使用小写字母和连字符，不含空格，最多 64 个字符。 |
| `description` | 清晰的描述，**最多 1024 个字符**，以句点结尾。说明能力，略过实现，不重复技能名称，也不使用 powerful、comprehensive、seamless、advanced 或 robust 等词语。保存前计算字符数。 |
| `platforms` | `[macos]`、`[linux]` 或 `[windows]`，仅在技能使用与操作系统绑定的内容时设置。可移植的技能应省略此字段。 |

**正文部分，按此顺序排列**

1. `# <Human Title>` 和简短介绍：说明它做什么、不做什么，以及假定已安装的内容。
2. `## When to Use`，附具体的触发短语。
3. `## Prerequisites`：确切的环境变量、凭据和安装步骤，或 `None`。
4. `## How to Run`：标准工作流，结合模型实际拥有的工具来描述。
5. `## Quick Reference`：命令、路由、文件或 API 的扁平列表。
6. `## Procedure`：编号步骤，可直接复制粘贴。
7. `## Pitfalls`：已知限制和失败模式。
8. `## Verification`：一项能够证明技能有效的针对性检查。

**工具的表述方式。** 使用反引号标出工具名称，包括 `run_command`、`write_file` 和 `view_skill`，并将 shell 操作描述为通过 `run_command` 运行。存在相应的读取和搜索工具时，应优先使用它们，而不是原始 shell 实用程序。过程中可以使用第三方 CLI，但必须明确 agent 是通过 `run_command` 调用它们。

**质量标准。** 命令、路由、路径、函数名、配置键和错误文本应与来源中的实际内容完全一致；虚构的标志或 API 是导致技能出错的主要原因。保持 `SKILL.md` 易于浏览，简单工作流约 100 行，复杂工作流约 200 行，并将大部分内容放在其他位置：较大的脚本放在 `scripts/`，详细文档放在 `references/`，可复用输出放在 `templates/`，二进制或视觉资源放在 `assets/`。只指向其他技能的技能没有价值；应编写真正完成工作的技能。

---

## 将技能绑定到模型 {#binding-skills-to-a-model}

1. 前往**工作区 > 模型**。
2. 编辑模型并打开**技能**行。
3. 选择希望此模型始终可以访问的技能。
4. 点击**保存并更新**。

使用该模型创建的每个新聊天都会自动选中这些技能。清单已经列出用户可读取的所有技能，因此只有需要模型在每次聊天中都遵循某个技能时，才应绑定该技能。

---

## 技能管理 {#skill-management}

在技能工作区列表中，对你有权编辑的技能使用省略号菜单（**...**）：

| 操作 | 描述 |
| :--- | :--- |
| **编辑** | 在编辑器中打开技能 |
| **访问权限** | 直接从列表打开技能的访问设置。更改会即时保存。非管理员仅在拥有**技能共享**权限时才能看到此操作 |
| **克隆** | 创建当前版本的私有副本（包含所有文件），并在编辑器中打开。副本的名称和 ID 会附加简短的随机后缀 |
| **导出 .skill** | 将技能及其所有文件下载为一个 `.skill` 文件，即包含技能文件夹的 ZIP。导入时，名称和描述来自 `SKILL.md` frontmatter，ID 来自该名称；标签不会保留。使用**导出 JSON** 可保留 ID、名称、描述和标签。需要**技能访问权限**和**导出技能**权限 |
| **导出 JSON** / **导出 ZIP** | 下载技能及其所有文件。需要**技能访问权限**和**导出技能**权限 |
| **共享** | 将技能及其所有文件发布到 openwebui.com。需要开启**社区共享**并拥有**导出技能**权限。请参阅[社区技能](#community-skills) |
| **删除** | 永久删除技能及其完整版本历史（Shift+点击可快速删除） |

**批量导出**：点击**创建**旁箭头菜单中的**导出 ZIP** 或**导出 JSON**，将所有可访问技能导出为一个文件。ZIP 中每个技能对应一个文件夹。两者都需要**技能访问权限**和**导出技能**权限。

**启用/停用开关**：非活动技能会从清单和 `$` 提及中排除，即使已绑定到模型也不例外。拥有写入权限的用户仍可以让模型加载它们（请参阅[技能工具](#skill-tools)）。

### 社区技能 {#community-skills}

开启**社区共享**后（请参阅 [Open WebUI 社区](/ecosystem/community#turn-it-off)），技能工作区会连接到 openwebui.com：

- 技能列表底部的**发现技能**会打开 openwebui.com 上已发布的技能。
- 从 openwebui.com 的技能页面导入技能时，会在你的实例上打开新的技能编辑器，并填入其名称、描述和所有文件。检查后点击**保存并创建**即可添加。这需要**技能访问权限**和**导入技能**权限。
- 技能 **...** 菜单中的**共享**会在新标签页中打开 openwebui.com，并创建一个包含该技能及其所有文件的新帖子。在你在该网站完成发布之前，不会公开任何内容。这需要**导出技能**权限，且技能共享总大小上限为 15 MiB。

---

## 版本历史 {#version-history}

每次保存技能的名称、描述、翻译或文件更改时，都会将技能的完整快照存储为新版本。启用或停用技能以及更改其访问权限不会改变历史记录。升级前已存在的技能会以当前内容作为初始版本。

编辑器文件面板顶部的版本菜单会列出**当前版本**和所有较早版本，按从新到旧排序，每页 20 个；每个版本均显示作者和**描述此更改**中的说明（没有说明时显示简短版本 ID）。选择较早版本会以只读方式打开，并提供两个操作：

- **与当前版本比较**会显示该版本与当前版本之间的差异：名称、描述和翻译，以及每个新增、删除或修改的文件；文本文件会显示逐行差异。任一版本中超过 5000 行的文件不会显示行级差异（`Diff is limited to 5000 lines per version`）。
- **设为生产版本**会将该版本重新设为当前版本。这需要写入权限。如果在你打开该版本后有人保存了技能，切换会被拒绝，编辑器会提供重新加载最新状态的选项。

每个较早版本旁的 **...** 中包含**删除**，供拥有写入权限的用户使用。基于已删除版本的后续版本会链接到其父版本，因此版本链保持完整。拥有**导出技能**权限时，文件面板的 **...** 菜单还可将正在查看的版本导出为 `.skill`、JSON 或 ZIP。

如果你编辑技能时其他人保存了该技能，你的保存会被拒绝，草稿仍保留在编辑器中。横幅会提供**重新加载最新版本**、**将草稿保存为副本**或**继续编辑**。

---

## 访问控制 {#access-control}

技能使用与其他工作区资源相同的[访问控制](/features/authentication-access/rbac)系统：

- **默认私有**：只有创建者可以查看和编辑新技能。
- **与用户或组共享**：通过编辑器中的**访问权限**按钮或列表菜单中的**访问权限**条目授予 `read` 或 `write` 权限。非管理员只有拥有[**技能共享**](/features/authentication-access/rbac/permissions#2-sharing-permissions)权限时才能看到这两个入口。
- **只读访问**：拥有读取权限的用户可以查看但不能编辑。编辑器会显示“只读”徽章。

:::caution 附加的技能仍需要用户访问权限
将技能附加到模型**不会**绕过访问控制。用户与模型聊天时，Open WebUI 会检查该用户是否拥有每个附加技能的读取权限。用户无法访问的技能会被静默排除。

**示例**：管理员创建一个私有技能并将其附加到共享模型。普通用户与该模型聊天时不会获得该技能，因为他们没有读取权限。

**解决方案**：确保需要使用模型技能的用户也拥有每个技能的读取权限（通过访问授权、组权限或将技能设为公开）。
:::

### 所需权限 {#required-permissions}

| 权限 | 控制的内容 |
| :--- | :--- |
| **工作区 > 技能访问权限** | 访问技能工作区以及创建/管理技能 |
| **工作区 > 导入技能** | 从 ZIP、`.skill`、文件夹、JSON 或 Markdown 导入技能，以及从 openwebui.com 打开技能 |
| **工作区 > 导出技能** | 将技能及其版本导出为 `.skill`、ZIP 或 JSON，并将技能共享到 openwebui.com |
| **共享 > 技能共享** | 与单个用户或组共享技能 |
| **共享 > 技能公开共享** | 将技能设为可公开访问 |

配置详情请参阅[权限](/features/authentication-access/rbac/permissions)。

---

## 技能 API {#skills-api}

编辑器的文件、版本、导入和导出功能由 `/api/v1/skills` 下的以下端点提供支持。读取操作需要技能的读取权限；更改当前版本和删除版本需要写入权限。

| 端点 | 作用 |
| :--- | :--- |
| `GET /id/{id}/files` | 列出技能的文件及其路径、大小和编码。`version_id` 用于选择历史版本。 |
| `GET /id/{id}/files/content` | 根据 `path` 和 `version_id` 下载一个文件。 |
| `GET /id/{id}/history` | 按从新到旧的顺序列出版本，每个 `page` 20 个。 |
| `GET /id/{id}/history/{history_id}` | 返回一个版本及其文件列表。 |
| `GET /id/{id}/history/diff` | 列出 `from_id` 与 `to_id` 之间的更改：元数据以及新增、删除或修改的文件。带 `path` 的 `/history/diff/file` 返回一个文本文件的行级差异。 |
| `POST /id/{id}/update/version` | 将已存储的版本设为当前版本。请求体包含 `version_id` 和 `expected_version_id`，后者是你认为当前生效的版本；如果不再匹配，调用会返回 `409`。 |
| `DELETE /id/{id}/history/{history_id}` | 删除非当前版本，并将其子版本链接到其父版本。 |
| `POST /id/{id}/clone` | 使用新的 `id` 和 `name` 复制技能，可选择从指定的 `version_id` 复制。副本为私有。 |
| `GET /export` | 以 `format=json`、`format=zip` 或 `format=skill` 导出技能。重复指定 `ids` 可选择多个技能；`format=skill` 要求恰好指定一个。只指定一个 ID 时，`version_id` 可导出历史版本。 |
| `POST /load/url` | 仅限管理员。下载 `{"url": "..."}` 指向的技能（请参阅[从 URL 导入](#importing-from-a-url)），并将其作为技能包返回，不保存任何内容。 |
| `POST /import/preview` | 读取上传的 ZIP、`.skill`、JSON 或 Markdown 文件（总计最多 200 MiB），列出找到的技能，并标记已存在的 ID 和名称。 |
| `POST /import` | 通过 `decisions` 列表导入相同的上传内容，每个技能对应一个条目：`action`（`create`、`copy`、`replace` 或 `skip`）、可选的 `id` 和 `name`，以及 `replace` 所需的 `expected_version_id`。 |

`POST /create` 和 `POST /id/{id}/update` 通过 `files` 接收技能文件，并接受用于标记新版本的可选 `commit_message`。更新请求可以发送 `operations`（`put`、`move`、`delete`）来更改单个文件。发送 `files` 或 `operations` 的更新请求需要 `expected_version_id`；如果在此期间有人保存了该技能，则返回 `409`。

---

## 使用场景 {#use-cases}

### 代码审查标准 {#code-review-standards}

将团队的审查清单编写为技能：命名约定、错误处理模式、测试覆盖率要求。将其附加到编程模型，使每次审查都遵循相同标准。

### 写作风格指南 {#writing-style-guide}

在技能中记录语气、格式规则和术语，并将其附加到内容写作模型。每份草稿都会遵循你的品牌风格。

### 故障排除手册 {#troubleshooting-playbooks}

将常见问题的运行手册编入技能：“先检查日志、验证配置、测试连接，如果出现 X 则升级处理。”模型会遵循与资深工程师相同的诊断步骤。

### 工具使用说明 {#tool-usage-instructions}

将技能与 Open Terminal 搭配使用，教模型*如何*妥善使用它。“始终检查退出代码。在脚本中使用 `set -e`。对于运行超过 10 秒的命令，使用流式输出。”

---

## 限制 {#limitations}

### 仅限纯文本 {#plain-text-only}

Open WebUI 会存储技能的脚本供模型读取。运行脚本需要能够执行代码的工具，例如 [Open Terminal](/features/open-terminal) 或代码解释器。需要进行计算、API 调用或系统访问时，请使用[工具](/features/extensibility/plugin/tools)。

### 使用 $ 提及时的上下文窗口 {#context-window-with--mention}

未启用技能工具时，已选技能会随每条消息进入系统提示词。对于上下文窗口较小的模型，过长的技能可能挤占对话空间。

### 延迟加载需要函数调用 {#lazy-loading-requires-function-calling}

清单和技能工具需要启用**内置工具**的[原生函数调用](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)。请参阅[模型附加的技能](#model-attached-skills)。
