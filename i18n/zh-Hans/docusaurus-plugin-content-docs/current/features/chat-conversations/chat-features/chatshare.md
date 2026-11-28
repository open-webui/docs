---
sidebar_position: 3
title: "聊天共享"
---

### 启用社区共享 {#enabling-community-sharing}

要启用社区共享，请按以下步骤操作：

1. 以**管理员（Admin）**身份进入**管理员面板（Admin Panel）**页面。
2. 点击**设置（Settings）**标签页。
3. 在**通用（General）**设置标签页中开启**社区共享（Community Sharing）**。

:::note

**注意：**只有管理员可以切换**社区共享（Community Sharing）**选项。如果此选项关闭，用户和管理员都不会看到用于分享聊天的**分享到 Open WebUI 社区（Share to Open WebUI Community）**选项。必须由管理员启用社区共享，用户才能将聊天分享到 Open WebUI 社区。关闭此选项后，已导入模型上的 openwebui.com 作者链接也会隐藏。

:::

这会为你的 Open WebUI 实例上的所有用户启用社区共享。

### 分享聊天 {#sharing-chats}

要分享聊天：

1. 选择要分享的聊天对话。
2. 将鼠标指针悬停在目标聊天上，点击出现的三点菜单。在触摸屏上，三点菜单始终显示，直接点击即可。
3. 然后点击**分享（Share）**选项。
4. 选择**分享到 Open WebUI 社区（Share to Open WebUI Community）**（需要管理员在**设置 > 通用 > 功能（Settings > General > Features）**中开启**社区共享（Community Sharing）**；创建任何分享链接还需要**允许聊天分享（Allow Chat Share）**权限，即 `USER_PERMISSIONS_CHAT_SHARE`），或选择**复制链接（Copy Link）**。

:::info 共享范围由 RBAC 控制

弹窗会显示**访问控制（Access Control）**选择器，用于指定谁可以打开链接，提供**私密（Private）**、**公开（Public）**和**开放（Open）**选项，也可以指定用户和用户组。新链接一开始为私密状态；向某人授予访问权限时，如果该聊天尚无链接，系统会创建链接。

**公开（Public）**允许此实例的任何已登录用户访问链接，因此未登录的访问者仍会被引导至登录页面。此选项受**聊天公开分享（Chats Public Sharing）**权限控制。该权限关闭时，非管理员用户只能看到向特定用户或用户组授予访问权限的选项。管理员始终保留所有选项。有关配置，请参阅 [RBAC 权限](/features/authentication-access/rbac/permissions)和 [`USER_PERMISSIONS_CHAT_ALLOW_PUBLIC_SHARING`](/reference/env-configuration#user_permissions_chat_allow_public_sharing)。

**开放（Open）**会完全取消登录要求，详见下文[开放链接](#open-links-no-sign-in)。

:::

### 开放链接（无需登录） {#open-links-no-sign-in}

**开放（Open）**是唯一能让没有 Open WebUI 账户的人阅读聊天的设置。任何持有链接的人都可以直接通过互联网阅读对话，无需登录，也不会留下访问者身份记录。

此设置默认关闭。非管理员需要拥有**聊天开放分享（Chats Open Sharing）**权限（[`USER_PERMISSIONS_CHAT_ALLOW_OPEN_SHARING`](/reference/env-configuration#user_permissions_chat_allow_open_sharing)，默认值为 `False`），该选项才会显示。没有此权限时，下拉列表只显示**私密（Private）**和**公开（Public）**，服务器也会拒绝开放授权。

开放链接允许和不允许的操作如下：

- 链接为只读。开放访问仅以读取授权的形式存在，因此不会提供写入开关，针对它的写入授权也会被拒绝。
- 仅适用于聊天。其他资源类型均不接受此类授权，因此知识库、模型、提示词、工具、笔记和日历无法通过这种方式共享。
- 将对话复制到账户中仍需要登录，并持有**聊天导入（Chat Import）**权限。
- 页面会要求搜索引擎不要索引它（`noindex,nofollow`）。这只是对遵守规范的爬虫提出的请求，并不是访问控制：任何获得链接的人仍然可以打开它。

:::warning 开放链接即向互联网公开

请将 URL 本身视为唯一保护措施。访问权限无法针对特定人员单独撤销，因此如果链接泄露，切断访问的方法是删除分享链接（请参阅[删除共享聊天](#deleting-shared-chats)），或将聊天改回**私密（Private）**。共享聊天是快照，因此生成链接时对话中的任何内容都会保持可见，包括消息中引用的文件内容、名称或内部详细信息。

:::

#### 分享到 Open WebUI 社区 {#sharing-to-open-webui-community}

当你选择 `Share to Open WebUI Community` 时：

- 系统会打开一个新标签页，让你将聊天作为快照上传到 Open WebUI 社区网站（https://openwebui.com/chats/upload）。
- 你可以从以下访问设置中选择谁能查看已上传的聊天：
  - **私密（Private）**：只有你可以访问此聊天。
  - **公开（Public）**：互联网上的任何人都可以查看聊天快照中显示的消息。
  - **公开完整历史（Public, Full History）**：互联网上的任何人都可以查看聊天的完整重新生成历史。

:::note

注意：你可以随时在 openwebui.com 账户的社区平台上更改已分享聊天的权限级别。

**目前，社区网站上已分享的聊天无法通过搜索找到。不过，后续更新计划让权限设为 `Public` 或 `Public, Full History` 的公开聊天可以被公众发现。**

:::

#### 复制分享链接 {#copying-a-share-link}

选择**复制链接（`Copy Link`）**时，系统会生成一个可与他人分享的唯一分享链接。

**重要注意事项：**

- 共享聊天只包含创建链接时已经存在的消息。生成链接后在聊天中发送的任何新消息都不会包含在内，除非删除该链接并使用新链接更新。
- 生成的分享链接是生成时聊天内容的静态快照。启用[允许回复](#allowing-replies)后，分享对象会看到实时聊天。
- 除非聊天设为**开放（Open）**，否则查看聊天需要拥有生成链接的 Open WebUI 实例上的账户，并登录该账户。未登录的访问者会先被重定向到登录页面。
- 设为**开放（Open）**的聊天不需要满足上述两项要求，任何持有链接的人都可以阅读。请参阅[开放链接](#open-links-no-sign-in)。

### 允许回复 {#allowing-replies}

至少一个人或用户组获得访问权限后，弹窗还会显示**共享模式（Sharing mode）**：

- **仅克隆（Clone only）**（默认）：人们打开链接后，看到的是链接创建或最后更新时的对话。若要继续对话，他们需要将其克隆或分叉到自己的聊天中（请参阅[克隆或分叉共享聊天](#cloning-or-forking-a-shared-chat)）。
- **允许回复（Allow replies）**：所有按姓名、通过用户组或通过**公开（Public）**获得访问权限的人都可以写入同一个聊天。打开链接会直接进入实时对话，聊天中的每个人都能在新消息和回复到达时看到它们。

![“分享聊天”对话框，其中共享模式设为“允许回复”，访问列表中包含 Engineering 用户组](/images/features/chat/share-allow-replies.webp)

在允许回复的聊天中：

- 在气泡布局中，其他人的消息与其姓名和头像一起显示在左侧，你自己的消息显示在右侧且不显示姓名和头像。在**设置 > 界面（Settings > Interface）**中关闭**聊天气泡 UI（Chat Bubble UI）**后，每条消息都会显示发送者的姓名和头像。
- 消息输入框上方的一行会显示谁正在输入。
- 聊天顶栏会显示当前打开此聊天的其他人。点击该处可查看**协作者（Collaborators）**列表。
- 任何可以向聊天写入内容并拥有**允许重新生成回复（Allow Regenerate Response）**权限的人，都可以**重新生成（Regenerate）**任何回复。新版本归属于生成它的人。每个人只能继续、停止和评价自己生成的回复版本。
- 任何可以向聊天写入内容并拥有[**允许聊天编辑（Allow Chat Edit）**](/features/authentication-access/rbac/permissions#3-chat-permissions)权限的人，都可以编辑任何提示词。编辑器提供**发送（Send）**，会将编辑后的提示词作为新分支添加并生成新回复，同时保留原提示词不变。聊天中的其他人仍停留在自己此前选择的分支上。
- 只有所有者可以编辑回复并原地保存修改，而且只能编辑自己的消息和自己生成的回复版本。在其他人的消息上打开编辑器时，提示词提供**发送（Send）**，回复提供**另存为副本（Save As Copy）**，二者都会添加新消息并保留原消息不变。
- 回复上的**删除（Delete）**仅对所有者显示，且只适用于所有者生成的回复版本，并且该回复必须有多个版本。
- 任何可以向聊天写入内容的人都可以更改并保存聊天的模型、终端和工作文件夹。所有可以向聊天写入内容的人也都可以使用聊天自己的终端。
- 只有所有者的消息会生成标题和标签，或更改聊天的附件和聊天变量。其他人的对话轮次运行时不会使用聊天变量。
- 仅通过**开放（Open）**链接进入聊天，且没有按姓名、用户组或**公开（Public）**获得访问权限的人，只能看到快照。
- 某人失去访问权限时，聊天会立即对其关闭，并不再向其推送更新。

![允许回复的聊天中所有者看到的视图：另一位成员的消息及其姓名和头像、模型对该消息的回复，以及输入框上方显示该成员正在输入的一行提示](/images/features/chat/shared-chat-replies-live.webp)

切回**仅克隆（Clone only）**会刷新链接背后的快照，使其显示当时的对话内容，包括所有回复。[**允许聊天分享（Allow Chat Share）**](/features/authentication-access/rbac/permissions#3-chat-permissions)权限控制谁可以分享聊天，访问选项遵循与任何分享链接相同的权限规则。[共享文件夹](/features/chat-conversations/chat-features/conversation-organization#sharing-folders)具有相同的**共享模式（Sharing mode）**，应用于文件夹中直接包含的聊天。每个子文件夹都有自己的共享模式。

### 查看共享聊天 {#viewing-shared-chats}

要查看共享聊天：

1. 确保你已登录共享该聊天的 Open WebUI 实例上的账户。对于以**开放（Open）**方式共享的聊天，无需执行此步骤，任何人无需账户即可阅读。
2. 点击提供给你的共享链接。
3. 聊天将以只读格式显示。启用[允许回复](#allowing-replies)后，你会直接进入聊天本身并可以向其中写入内容。
4. 如果共享链接来源的 Open WebUI 实例管理员配置了文字转语音，消息可能会提供音频按钮，为你朗读内容（视情况而定）。

属于其他人的聊天会显示在其作者名下：每条消息都带有发送者的姓名和头像。无论你通过分享链接、[与你共享的文件夹](/features/chat-conversations/chat-features/conversation-organization#sharing-folders)，还是以管理员身份从**管理员面板 > 用户（Admin Panel > Users）**打开，都是如此。在应用内打开时，聊天的**概览（Overview）**标签页也会以相同方式标记消息节点。

除所有者外，其他人只能获得对话内容：所有者的高级参数、所选工具、工具服务器和过滤器、聊天变量以及每条消息的设置仍仅归所有者所有。

#### 克隆或分叉共享聊天 {#cloning-or-forking-a-shared-chat}

只要你能读取属于其他人的聊天，就可以将其复制到自己的聊天中：可以通过分享链接、授予你的共享权限、[与你共享的文件夹](/features/chat-conversations/chat-features/conversation-organization#sharing-folders)，或者由管理员通过**管理员面板 > 用户（Admin Panel > Users）**进行。复制方式有两种：

- **克隆聊天（Clone Chat）**是聊天底部的按钮，会将对话复制到你自己的聊天中，不放入任何文件夹。聊天对你为只读时会显示此按钮；在允许回复的聊天中，请使用**分叉聊天（Fork chat）**。
- **分叉聊天（Fork chat）**位于每条已完成回复下方的操作中，会将从开始到该回复为止的对话复制到一个标题为 `<original title> (fork)` 的新聊天中。

两种方式都需要你登录并拥有[**允许聊天导入（Allow Chat Import）**](/features/authentication-access/rbac/permissions#3-chat-permissions)权限（管理员始终拥有此权限）。通过分享链接创建的分叉只包含链接所展示的内容，因此链接最后更新后添加到原聊天中的消息不会包含在内。分叉他人的聊天会进入你自己的聊天列表，不放入任何文件夹，也不会包含所有者的置顶状态、标签、聊天设置和聊天变量。

在副本中，原所有者的提示词和回复会变成你的内容，因此你可以像在自己的任何聊天中一样编辑它们，并对其使用**重新生成（Regenerate）**和**继续回复（Continue Response）**。其他人在允许回复的聊天中写入的消息仍保留原作者。

使用**仅克隆（Clone only）**时，分享链接打开的页面只显示消息，不显示 **Artifacts** 面板，因此回复中的 HTML 和 SVG 代码不会在那里作为 Artifact 打开。克隆或分叉聊天后，即可在你的副本中查看其 Artifacts。

#### 将共享聊天用作上下文 {#using-a-shared-chat-as-context}

聊天的读取权限还允许你将该对话附加到自己的聊天中，让模型据此工作。这适用于按姓名授予你的共享、授予你所属用户组的共享、设为**公开（Public）**的共享，以及位于[与你共享的文件夹](/features/chat-conversations/chat-features/conversation-organization#sharing-folders)中的聊天。
模型会收到对话的当前内容，因此即使链接本身仍提供旧快照，生成链接后新增的消息也会包含在内。系统只传递对话当前所在的分支。文本会原样传入，不进行分块，也不进行向量搜索。

### 更新共享聊天 {#updating-shared-chats}

要更新共享聊天：

1. 选择要分享的聊天对话。
2. 将鼠标指针悬停在目标聊天上，点击出现的三点菜单。在触摸屏上，三点菜单始终显示，直接点击即可。
3. 点击**分享（Share）**选项。
4. 如果你此前分享过该聊天，**分享聊天（Share Chat）**弹窗的外观会有所不同。

**分享聊天（Share Chat）**弹窗包含以下选项：

- **before（查看此前分享）**：打开新标签页，通过分享链接查看此前分享的聊天。
- **delete this link（删除此链接）**：删除聊天的共享链接，并显示初始聊天分享弹窗。
- **分享到 Open WebUI 社区（Share to Open WebUI Community）**：打开指向 https://openwebui.com/chats/upload 的新标签页，并准备好将聊天作为快照分享。
- **更新并复制链接（Update and Copy Link）**：更新此前聊天分享链接对应的聊天快照，并将链接复制到设备剪贴板。

### 删除共享聊天 {#deleting-shared-chats}

要删除共享聊天链接：

1. 选择要删除共享链接的聊天对话。
2. 将鼠标指针悬停在目标聊天上，点击出现的三点菜单。在触摸屏上，三点菜单始终显示，直接点击即可。
3. 点击**分享（Share）**选项。
4. 如果你此前分享过该聊天，**分享聊天（Share Chat）**弹窗的外观会有所不同。
5. 点击 **delete this link（删除此链接）**。

删除后，共享链接将不再有效，用户也无法再查看共享聊天。

:::note

**注意：**分享到社区平台的聊天无法删除。要更改分享到社区平台的聊天访问级别，请执行以下操作：

:::

1. 在 openwebui.com 上登录你的 Open WebUI 账户。
2. 点击网站右上角的账户用户名。
3. 点击**聊天（Chats）**。
4. 点击要更改访问权限的聊天。
5. 滚动到聊天底部并更新其权限级别。
6. 点击**更新聊天（Update Chat）**按钮。

### 管理共享聊天 {#managing-shared-chats}

Open WebUI 提供集中式仪表板，用于管理你分享过的每个聊天对话。你可以在其中搜索共享历史、重新复制链接或立即撤销访问权限。

有关管理仪表板的详细信息，请参阅[共享聊天管理](/features/chat-conversations/data-controls/shared-chats)。
