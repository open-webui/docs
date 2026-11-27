---
sidebar_position: 3
title: "权限"
---

Open WebUI 提供灵活的权限系统，使管理员能够为用户配置访问控制和功能可用性，从而精细控制用户可以在应用程序中访问和修改的内容。

管理员可以通过两种主要方式管理权限：
1.  **默认权限：**通过**管理员面板 > 用户 > 组 > 默认权限**，设置适用于所有用户（包括管理员）的基线权限。
2.  **组权限：**通过**管理员面板 > 用户 > 组**创建具有特定权限覆盖的组（例如，一个可使用图像生成功能的“高级用户”组）。

具有 `Pending` 角色的用户在获得批准前没有任何访问权限，`Admin` 用户拥有完整的管理访问权限，`User` 账户则受下述权限系统约束。

:::warning RBAC 范围边界
RBAC 权限控制用户可以在 Open WebUI 内部执行的操作。

RBAC 不能取代提供方侧的最小权限设计。对于 OpenAI 兼容提供方/代理（包括 LiteLLM），请根据部署需要，为凭据配置最小必需权限范围。
:::

:::info 权限逻辑
Open WebUI 中的权限采用**累加方式**。
*   用户的有效权限由**全局默认设置**与其所有**组成员关系**共同组合而成，包括其所属组的每个父组（请参阅[嵌套组](/features/authentication-access/rbac/groups#nested-groups)）。
*   **True 优先于 False**：只要*任何*来源（全局默认设置或*任何*一个组）授予某项权限，用户**就会**拥有该权限。
*   **没有“拒绝”能力**：无法使用某个特定组“移除”另一个组或全局默认设置授予的权限。要限制某项功能，必须在全局默认设置中禁用它，*并且*在用户所属的**所有**组中禁用它，包括父组。
:::

:::tip 最佳实践：最小权限原则
由于权限采用**累加方式**，推荐的安全策略是从**限制**开始：
1.  **尽量减少全局默认权限**：配置默认权限（**管理员面板 > 用户 > 组 > 默认权限**），使其*仅*包含每位用户都绝对需要拥有的权限。
2.  **通过组授予**：创建特定组（例如“创作者”、“高级用户”），明确**授予**图像生成或文件上传等高级功能。

这种方法可确保新用户不会意外获得敏感功能的访问权限，同时让你只需将用户添加到相关组，即可轻松提升其权限。
:::

## 权限类别 {#permission-categories}

权限分为五个主要类别：**工作区**、**共享**、**聊天**、**功能**和**设置**。

某些开关只会在对应功能已为整个实例开启时显示，例如**笔记共享**、**API 密钥**和**网络搜索**。隐藏的开关会保留其值。管理员不受本页任何权限限制。

### 1. 工作区权限 {#1-workspace-permissions}
控制对“工作区”部分的访问，用户可在此处创建和管理资源。
某些权限**依赖**其他权限（例如，如果无法访问模型工作区，就无法导入模型）。

| 权限 | 描述 |
| :--- | :--- |
| **模型访问** | **（父级）**访问**模型**工作区，以创建或编辑自定义模型。 |
| **导入模型** | *（需要模型访问）*从 JSON/文件导入模型的能力。 |
| **导出模型** | *（需要模型访问）*将模型导出到文件的能力。 |
| **隐藏模型** | *（需要模型访问）*选择隐藏模型作为工作区模型基座模型的能力（[`USER_PERMISSIONS_WORKSPACE_MODELS_HIDDEN`](/reference/env-configuration#user_permissions_workspace_models_hidden)）。默认关闭。 |
| **知识库访问** | 打开**知识库**工作区并创建知识库（[`USER_PERMISSIONS_WORKSPACE_KNOWLEDGE_ACCESS`](/reference/env-configuration#user_permissions_workspace_knowledge_access)）。非管理员默认关闭。对现有知识库的访问由所有权和[资源授权](./groups.md#access-grant-system)单独控制。 |
| **提示词访问** | **（父级）**访问**提示词**工作区，以管理自定义系统提示词。 |
| **导入提示词** | *（需要提示词访问）*导入提示词的能力。 |
| **导出提示词** | *（需要提示词访问）*导出提示词的能力。 |
| **工具访问** | **（父级）**访问**工具**工作区，以管理函数/工具。当 [`ENABLE_PLUGINS`](/reference/env-configuration#enable_plugins) 或 [`ENABLE_TOOLS`](/reference/env-configuration#enable_tools) 为 `false` 时，此权限及其“导入”和“导出”子开关会隐藏，因为此时不存在工具工作区。 |
| **导入工具** | *（需要工具访问）*导入工具的能力。有关它如何影响代码更改，请参阅[版本历史](/features/extensibility/plugin/tools#version-history)。 |
| **导出工具** | *（需要工具访问）*导出工具的能力。 |
| **技能访问** | **（父级）**访问**技能**工作区，以创建和管理可复用的指令集。使用 [`/skills:create`](/features/workspace/skills#from-a-chat-with-skillscreate) 也需要此权限。 |
| **导入技能** | *（需要技能访问）*将技能导入技能工作区（请参阅[导入技能](/features/workspace/skills#importing-skills)和[社区技能](/features/workspace/skills#community-skills)）。 |
| **导出技能** | *（需要技能访问）*从技能工作区导出技能（请参阅[技能管理](/features/workspace/skills#skill-management)和[社区技能](/features/workspace/skills#community-skills)）。 |

:::danger 工具访问权限 = 与 root 等效的访问权限
**请将工具访问权限视为与 root 等效的访问权限。**授予用户创建或导入工具的权限，等同于授予其服务器的 shell 访问权限，因为工具和函数会执行任意 Python 代码。只应将此权限授予那些你会信任其直接访问服务器的用户。如果为不受信任的用户启用此权限，就意味着你接受主机上任意代码执行的风险。完整详情请参阅[插件安全警告](/features/extensibility/plugin/)。
:::

### 2. 共享权限 {#2-sharing-permissions}
控制用户可以与社区共享哪些内容，或可以将哪些内容公开。

每项**（父级）**权限决定用户是否可以共享对应类型的项目。没有该权限时，**访问权限**按钮会隐藏，服务器也会拒绝更改该类型的共享设置。下面的**公开共享**和**允许共享给**权限决定用户可以添加哪些受众。

如果共享更改请求添加用户无权添加的受众，服务器会拒绝并返回 `403`（`You do not have permission to share with the requested audience`）。保存项目本身不会更改其共享设置。对管理员也一样，文件夹永远不能公开，而且只有聊天共享链接可以向没有账户的人开放。

| 权限 | 描述 |
| :--- | :--- |
| **模型共享** | **（父级）**共享模型的能力。 |
| **模型公开共享** | *（需要模型共享）*使模型可被公开发现的能力。 |
| **知识库共享** | **（父级）**共享知识库的能力。 |
| **知识库公开共享** | *（需要知识库共享）*公开知识库的能力。 |
| **提示词共享** | **（父级）**共享提示词的能力。 |
| **提示词公开共享** | *（需要提示词共享）*公开提示词的能力。 |
| **工具共享** | **（父级）**共享工具的能力。 |
| **工具公开共享** | *（需要工具共享）*公开工具的能力。 |
| **技能共享** | **（父级）**共享技能的能力。 |
| **技能公开共享** | *（需要技能共享）*公开技能的能力。 |
| **笔记共享** | **（父级）**共享笔记的能力。 |
| **笔记公开共享** | *（需要笔记共享）*公开笔记的能力。 |
| **自动化共享** | 与特定用户或组共享自动化的能力。请参阅[共享](/features/chat-conversations/chat-features/automations#sharing)（[`USER_PERMISSIONS_AUTOMATIONS_ALLOW_SHARING`](/reference/env-configuration#user_permissions_automations_allow_sharing)）。 |
| **文件夹共享** | 与特定用户或组共享聊天文件夹及其中聊天的能力。请参阅[共享文件夹](/features/chat-conversations/chat-features/conversation-organization#sharing-folders)。 |
| **聊天公开共享** | *（需要允许聊天共享）*使聊天共享链接可被实例的每位已登录用户访问的能力。打开链接仍需登录。禁用后，用户仍可通过访问控制选择器与特定用户或组共享聊天，但非管理员不会看到“公开”选项。管理员始终不受限制。 |
| **聊天开放共享** | *（需要允许聊天共享）*使任何持有聊天共享链接的人无需登录即可阅读的能力。这是唯一会将内容公开到实例之外的权限。默认关闭。请参阅[开放链接](/features/chat-conversations/chat-features/chatshare#open-links-no-sign-in)。 |
| **日历公开共享** | *（需要功能 > 日历）*使每位拥有日历权限的用户都能读取或写入日历的能力。没有此权限时，所有者仍可与特定用户或组共享。 |
| **允许与用户共享** | 与**特定用户**共享的能力（[`USER_PERMISSIONS_ACCESS_GRANTS_ALLOW_USERS`](/reference/env-configuration#user_permissions_access_grants_allow_users)）。 |
| **允许与组共享** | 与**组**共享的能力（[`USER_PERMISSIONS_ACCESS_GRANTS_ALLOW_GROUPS`](/reference/env-configuration#user_permissions_access_grants_allow_groups)）。 |

面板**共享权限**部分中的每个开关默认均关闭，除非你将其开启；只有对应行指定的父级权限开启后，才会绘制公开共享开关。两个**允许共享给……**行位于单独的**访问授权**部分，默认开启。关闭**允许与组共享**后，**添加访问权限**选择器不会列出任何组。关闭**允许与用户共享**后，则不会列出任何用户。

:::warning 升级后重新检查工具和笔记的公开共享

在从早于**工具公开共享**和**笔记公开共享**功能的版本升级而来的实例上，管理员面板过去会将这两个开关都显示为开启，而后端仍会拒绝操作。随后，在该页面保存任何权限都会将这两个开关持久化为启用状态，从而授予从未配置过的工具和笔记公开共享权限。现在面板的显示与后端的执行已保持一致，但已写入数据库的值不会回滚。

如果你在受影响的版本中保存过默认权限，请打开**管理员面板 > 用户 > 组**，编辑**默认权限**，并确认两个开关的状态符合你的意图。组级覆盖也值得进行同样的检查。

:::

### 3. 聊天权限 {#3-chat-permissions}
控制用户在聊天界面中可以使用的功能。

| 权限 | 描述 |
| :--- | :--- |
| **允许聊天控制** | **（父级）**访问高级聊天设置。禁用后，聊天**模型控制**菜单中的**控制**，以及**设置 > 通用**中的**系统提示词**和**高级参数**部分都会隐藏。[模型控制](/features/workspace/models#using-model-controls-in-chat)仍可使用，因此管理员无需提供完整的**控制**部分，也能提供思考级别等选项。 |
| **允许聊天 Valves** | *（需要允许聊天控制）*访问 [Valves](/features/extensibility/plugin/development/valves)（[`USER_PERMISSIONS_CHAT_VALVES`](/reference/env-configuration#user_permissions_chat_valves)），包括聊天输入区域中管道模型的 **Valves** 按钮。 |
| **允许聊天系统提示词** | *（需要允许聊天控制）*编辑对话系统提示词的能力。 |
| **允许聊天参数** | *（需要允许聊天控制）*调整 LLM 参数（例如 temperature、top_k）的能力。禁用后，聊天和**设置 > 通用**中的**高级参数**部分会隐藏。这只会隐藏这些部分：用户仍可通过 API 设置参数。这种取舍让管理员既能隐藏面板，又能继续提供[模型控制](/features/workspace/models#using-model-controls-in-chat)。 |
| **允许文件上传** | 向聊天上传文件的能力。 |
| **允许网页上传** | 通过消息输入区域附件菜单中的**附加网页**，按 URL 将网页附加到聊天的能力（[`USER_PERMISSIONS_CHAT_WEB_UPLOAD`](/reference/env-configuration#user_permissions_chat_web_upload)）。默认开启。禁用后，该选项会灰显，附加操作会被拒绝。管理员始终不受限制。 |
| **允许删除聊天** | 删除聊天的能力（[`USER_PERMISSIONS_CHAT_DELETE`](/reference/env-configuration#user_permissions_chat_delete)）。默认开启。禁用后，所有聊天删除控件都会隐藏，包括**删除所有聊天**；同时删除文件夹及其中聊天的操作也会被拒绝。归档仍可使用。 |
| **允许删除消息** | 删除单条消息的能力。 |
| **允许编辑聊天** | 编辑消息的能力（[`USER_PERMISSIONS_CHAT_EDIT`](/reference/env-configuration#user_permissions_chat_edit)），包括自己的消息和响应。 |
| **允许继续响应** | 对被截断的响应使用“继续”功能的能力。 |
| **允许重新生成响应** | 重新生成 AI 响应的能力。 |
| **允许评价响应** | 对响应点赞或点踩的能力。 |
| **允许聊天共享** | 为聊天生成共享链接的能力（[`USER_PERMISSIONS_CHAT_SHARE`](/reference/env-configuration#user_permissions_chat_share)）。有关允许接收共享的人回复，请参阅[允许回复](/features/chat-conversations/chat-features/chatshare#allowing-replies)。 |
| **允许聊天导出** | 导出聊天的能力（[`USER_PERMISSIONS_CHAT_EXPORT`](/reference/env-configuration#user_permissions_chat_export)）。默认开启。禁用后，所有下载或复制整个聊天的选项都会隐藏，包括文件夹的**导出**和**导出聊天**。 |
| **允许聊天导入** | 导入聊天（将以前导出的聊天上传回 Open WebUI）、[分叉聊天](/features/chat-conversations/chat-features/)或[克隆与你共享的聊天](/features/chat-conversations/chat-features/chatshare#cloning-or-forking-a-shared-chat)的能力；这些操作会将现有对话复制到新对话中（[`USER_PERMISSIONS_CHAT_IMPORT`](/reference/env-configuration#user_permissions_chat_import)）。默认开启。禁用后，非管理员将无法看到**设置 > 数据控制**中的**导入聊天**、共享聊天上的**克隆聊天**按钮、助手响应下的**分叉聊天**操作，以及 `/fork` 条目（位于聊天输入区域的 `/` 菜单中）。管理员始终不受限制。 |
| **允许语音转文字** | 使用语音输入的能力。 |
| **允许文字转语音** | 使用语音输出的能力。 |
| **允许通话** | 在标准和实时两种通话模式下发起[语音模式](/features/chat-conversations/chat-features/voice-mode)通话的能力。 |
| **允许在聊天中使用多个模型** | 同时使用多个模型的能力（[`USER_PERMISSIONS_CHAT_MULTIPLE_MODELS`](/reference/env-configuration#user_permissions_chat_multiple_models)）。禁用后，聊天仅使用其第一个模型。 |
| **允许临时聊天** | **（父级）**切换“临时聊天”（无痕模式/不记录历史）的能力。**注意：**为保护隐私，此模式会禁用后端文档解析。 |
| **允许侧边聊天** | 打开[侧边聊天](/features/chat-conversations/chat-features/#tabs-side-panel)的能力（[`USER_PERMISSIONS_CHAT_SIDE_CHAT`](/reference/env-configuration#user_permissions_chat_side_chat)）。默认关闭。管理员始终拥有此权限。只有**允许临时聊天**开启时，组权限表单才会显示其开关。 |
| **强制临时聊天** | *（需要允许临时聊天）***限制**用户*始终*使用临时聊天（禁用历史记录）（[`USER_PERMISSIONS_CHAT_TEMPORARY_ENFORCED`](/reference/env-configuration#user_permissions_chat_temporary_enforced)）。 |

**设置**中的**音频**标签页至少需要**允许语音转文字**、**允许文字转语音**和**允许通话**中的一项权限。

### 4. 功能权限 {#4-features-permissions}
控制对平台广泛能力的访问。

| 权限 | 描述 |
| :--- | :--- |
| **API 密钥** | 非管理员用户在用户设置中生成个人访问令牌（API 密钥）的能力。 |
| **笔记** | 访问“笔记”功能，包括聊天输入区域中的**附加笔记**。 |
| **频道** | 访问“频道”功能（[`USER_PERMISSIONS_FEATURES_CHANNELS`](/reference/env-configuration#user_permissions_features_channels)），包括实时频道消息和频道自动化。 |
| **加密频道** | 在私信和私有组频道中使用[加密聊天](/features/channels/encrypted-chats)的能力（[`USER_PERMISSIONS_FEATURES_ENCRYPTED_CHANNELS`](/reference/env-configuration#user_permissions_features_encrypted_channels)）。还需要**频道**权限。默认关闭。 |
| **文件夹** | 使用文件夹组织聊天的能力。 |
| **网络搜索** | 使用网络搜索集成的能力。 |
| **图像生成** | 使用图像生成工具的能力。在 AUTOMATIC1111 连接上设置模型 ID 后，此权限还允许切换服务器为所有人加载的模型；请参阅下方说明。 |
| **视频生成** | 使用[视频生成](/features/chat-conversations/image-generation-and-editing/video-generation)的能力（[`USER_PERMISSIONS_FEATURES_VIDEO_GENERATION`](/reference/env-configuration#user_permissions_features_video_generation)）。默认关闭。管理员始终拥有此权限。启用视频生成后会显示此开关。 |
| **代码解释器** | 使用 Python 代码解释器的能力。手动执行代码（代码块上的**运行**按钮）没有独立权限；对所有用户均遵循 [`ENABLE_CODE_EXECUTION`](/reference/env-configuration#enable_code_execution)。请参阅[手动执行代码](/features/chat-conversations/chat-features/code-execution/python#manual-code-execution-pyodide)。 |
| **记忆** | 访问记忆功能，以提供持久的用户上下文。移除此权限会隐藏**个性化**设置标签页、阻止记忆 API 端点、不向模型提供记忆工具，并停止将存储的记忆注入聊天的系统上下文。注入检查会在服务器端对每次聊天请求执行，因此即使客户端仍请求使用记忆，也不会获得记忆。管理员始终不受限制。 |
| **自动化** | 非管理员用户访问自动化页面并创建、编辑和删除自己的定时自动化，以及运行和暂停以写入权限共享给他们的自动化的能力。拥有此权限的所有人都可以使用 Webhook。任何可编辑文件夹的人，也可以运行和暂停向该文件夹发布内容的自动化。请参阅[文件夹](/features/chat-conversations/chat-features/automations#folders)。 |
| **日历** | 访问日历功能，以创建日历、管理事件和查看共享日历。 |
| **子代理** | 使用 `delegate_task`、`timer` 和 `send_message` 工具的能力（[`USER_PERMISSIONS_FEATURES_SUBAGENTS`](/reference/env-configuration#user_permissions_features_subagents)）。启用[子代理](/features/chat-conversations/chat-features/subagents)后会显示此开关。 |
| **用户 Webhooks** | 用户设置自己的个人 Webhook URL（位于**设置 > 账户**下）以接收通知的能力。默认禁用。 |

:::info 图像生成与当前模型

AUTOMATIC1111 一次只加载一个检查点，并使用当前激活的检查点进行生成。当 AUTOMATIC1111 连接设置了**模型 ID**时，有权访问该连接的用户如果选择了与当前加载模型不同的模型，就会为所有使用该服务器的人切换加载的检查点，直到再次切换。将**模型 ID**留空可防止这种情况。

其他连接类型会在每次请求时接受模型，因此用户的选择只应用于自己的生成。用户可以使用哪些连接，由[图像生成](/features/chat-conversations/image-generation-and-editing#set-up-a-connection)中连接的**访问控制**设置决定。

:::

:::info 自动化权限范围

对于自动化访问：

1. **非管理员权限检查**：具有 `user` 角色的用户需要**功能 > 自动化**（`features.automations`）。
2. **管理员不受 `features.automations` 限制**：具有 `admin` 角色的用户无需该特定权限即可访问自动化。

可以通过 [`USER_PERMISSIONS_FEATURES_AUTOMATIONS`](/reference/env-configuration#user_permissions_features_automations) 配置默认权限。

:::

:::info 日历权限范围

对于日历访问：

1. **非管理员权限检查**：具有 `user` 角色的用户需要**功能 > 日历**（`features.calendar`）。
2. **管理员不受 `features.calendar` 限制**：具有 `admin` 角色的用户无需该特定权限即可访问日历。
3. **直接链接重定向**：没有访问权限时，打开 `/calendar` 会转到首页。

可以通过 [`USER_PERMISSIONS_FEATURES_CALENDAR`](/reference/env-configuration#user_permissions_features_calendar) 配置默认权限。

:::

### 5. 设置权限 {#5-settings-permissions}
控制对用户设置区域的访问。

| 权限 | 描述 |
| :--- | :--- |
| **界面设置访问** | 在用户设置中访问和修改界面设置的能力。 |

:::info 界面设置访问与实例默认值

移除此权限会隐藏**界面**页面，因此受影响的用户会继续使用你配置的[默认界面设置](/features/administration/interface-defaults)。保留此权限时，这些默认值仅是起点，每位用户都可以更改。管理员不受限制。

它的影响仅限于此。此类用户保存设置时，界面字段会被丢弃，其余内容仍会保存，因此系统提示词、固定模型、音频、通知和快捷键仍能保存。**允许聊天系统提示词**对系统提示词采用相同的工作方式。

唯一例外是用户在模型选择器中通过**设为默认**保存的**默认模型**。它存储为界面字段，因此关闭此权限后将不再保存。

没有任何权限可以锁定个人设置整体。此权限只会隐藏一个页面并过滤该页面的字段，别无其他作用。

:::

:::info API 密钥权限范围

对于 API 密钥创建：

1.  **需要全局开关**：必须在**设置 > 身份验证 > API 密钥**（管理员区域）中全局启用此功能。如果关闭，*没有人*可以生成密钥。
2.  **非管理员权限检查**：具有 `user` 角色的用户必须拥有 `features.api_keys` 权限。
3.  **管理员不受 `features.api_keys` 限制**：全局启用 API 密钥后，具有 `admin` 角色的用户即使没有该特定权限，也可以生成 API 密钥。

:::

:::tip 最佳实践：创建管理员组

**为应对未来的权限变化，请为管理员创建专用组：**

1.  通过**管理员面板 > 用户 > 组**创建一个“Administrators”组
2.  **将所有管理员用户**添加到此组
3.  根据需要向该组**授予面向用户的功能权限**（例如，为非管理员组成员授予 API 密钥权限）

这种方法可确保新增适用于管理员的权限时，你可以通过组轻松将其授予所有管理员，而无需修改各个用户的设置。它还能精细控制哪些管理员可以访问哪些功能。

:::

## 环境变量 {#environment-variables}

虽然推荐使用界面管理权限，但可以通过环境变量设置初始默认值。这些变量通常以 `USER_PERMISSIONS_` 为前缀。
*   `ENABLE_IMAGE_GENERATION=True`
*   `ENABLE_WEB_SEARCH=True`
*   `USER_PERMISSIONS_CHAT_FILE_UPLOAD=True`

有关有效变量的完整列表，请参阅[环境配置](/reference/env-configuration)指南。
