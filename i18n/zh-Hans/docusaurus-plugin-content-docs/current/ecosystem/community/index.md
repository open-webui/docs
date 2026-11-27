---
title: "Open WebUI 社区"
sidebar_position: 0
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open WebUI 社区

<ThemedImage
  alt="Open WebUI 社区：一个帖子展示板，其中一篇帖子正移向你的实例"
  sources={{
    light: useBaseUrl('/images/banners/community-platform-light.svg'),
    dark: useBaseUrl('/images/banners/community-platform-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**使用其他人已经构建的模型、提示词、技能和插件，并分享你自己的成果。**

你不必亲自编写每个系统提示词、工具或函数。[Open WebUI 社区](https://openwebui.com/)是一个独立网站，人们在这里发布为 Open WebUI 构建的内容，发布到这里的任何内容都只需点击几下即可导入你的实例。

负责运行服务器？[管理员须知](#for-admins)介绍了谁可以通过该网站将代码带入服务器、哪些内容会发送到 openwebui.com，以及如何关闭此功能。

## 导入帖子 {#import-a-post}

你需要一个 openwebui.com 账户，该账户与你在自己实例上的账户相互独立。

1. 在 openwebui.com 上打开帖子，然后点击**获取（Get）**。
2. 输入你的 Open WebUI URL，例如 `http://localhost:3000`，然后点击**导入（Import）**。
3. 你的实例会在新标签页中打开，编辑器已填入内容；如果尚未登录，则需要先登录。阅读该条目，包括工具或函数的全部代码，然后保存。

| 帖子 | 导入位置 | 谁可以导入 |
| :--- | :--- | :--- |
| 模型预设 | **工作区 > 模型** | 获准创建模型的用户 |
| 提示词 | **工作区 > 提示词** | 获准创建提示词的用户 |
| 技能 | **工作区 > 技能** | 获准创建和导入技能的用户 |
| 工具 | **工作区 > 工具** | 获准创建工具的用户 |
| 函数 | **管理员面板 > 函数** | 仅限管理员 |

## 分享你构建的内容 {#share-what-you-built}

**分享（Share）**会在新标签页中打开 openwebui.com，并预先填好一篇新帖子。在你于该网站完成发布前，不会公开任何内容。

- **模型预设、提示词或工具：**在**工作区**中，打开该条目的菜单并点击**分享（Share）**。
- **技能：**在**工作区 > 技能**中，打开该技能的菜单并点击**分享（Share）**。这需要**导出技能（Export Skills）**权限。帖子会包含该技能及其所有文件，总大小上限为 15 MiB。
- **函数（仅限管理员）：**在**管理员面板 > 函数**中，打开该函数的菜单并点击**分享（Share）**。
- **聊天：**在聊天的**分享（Share）**对话框中，点击**分享到 Open WebUI 社区（Share to Open WebUI Community）**。

分享工具或函数会公开其完整源代码。请检查其中是否含有 API 密钥、内部地址或任何其他不宜公开发布的内容。你在其 Valves 中输入的值不会包含在内。

## 评价模型 {#review-a-model}

openwebui.com 上的评价可以让你在投入时间设置模型之前，了解它在其他用户那里的表现；你的评价也能为其他人提供同样的参考。Open WebUI 中有两个链接可进入模型评价：

- **阅读评价：**在模型选择器中，打开某个模型的菜单并点击**社区评价（Community Reviews）**。
- **撰写评价：**用点赞或点踩评价一条回复，然后在打开的面板中点击**为该模型留下公开评价（Leave a public review for）**。在 openwebui.com 上，从结果中打开该模型。在**撰写评价（Write a review）**下，给出星级评分、标题以及哪些表现符合或不符合你的预期，然后点击**发布（Post）**。

这两个链接都会使用你实例中的模型 ID 搜索网站的[模型](https://openwebui.com/models)目录，因此自定义模型或预设可能无法匹配其中的条目。系统不会发送任何聊天内容，你的评价会以你的 openwebui.com 账户公开发布。

## 将你的使用数据添加到排行榜 {#add-your-usage-to-the-leaderboard}

[排行榜](https://openwebui.com/leaderboard)根据用户实际向模型发送的消息数量对模型进行排名。同步你的使用数据会将你依赖的模型计入该统计，随后你的 openwebui.com 个人资料会显示你最常用的模型，以及全年消息活动的热力图。

1. 登录 openwebui.com，打开**排行榜（Leaderboard）**并点击**同步统计（Sync Stats）**。
2. 在**同步 Open WebUI 统计（Sync Open WebUI Stats）**中，输入你的 Open WebUI URL 并点击**同步（Sync）**。你的实例需要运行 Open WebUI v0.7.0 或更高版本。
3. 你的实例会在新标签页中打开，并显示**同步使用统计（Sync Usage Stats）**对话框，列出会共享和不会共享的内容。点击**下载为 JSON（Download as JSON）**可先保存数据以便查看。
4. 点击**同步（Sync）**。

系统只发送你自己聊天的统计数据，绝不发送聊天文本。[哪些内容会发送到 openwebui.com](#what-reaches-openwebuicom)列出了每个字段。首次同步后，后续同步只发送自上次同步以来发生变化的聊天统计数据。

## 管理员须知 {#for-admins}

### 谁可以将代码带入你的服务器 {#who-can-bring-code-onto-your-server}

从该网站导入的工具或函数是 Python 代码，保存后即开始在你的服务器上运行。

- **函数**只能由管理员导入。
- 任何[工作区权限](/features/authentication-access/rbac/permissions#1-workspace-permissions)允许其创建相应条目类型的用户，都可以导入**工具**、模型预设和提示词。
- 工具或函数可以在顶部的 `requirements` 行列出 Python 包，Open WebUI 加载插件时会使用 pip 安装这些包。要禁止此行为，请将 [`ENABLE_PIP_INSTALL_FRONTMATTER_REQUIREMENTS`](/reference/env-configuration#enable_pip_install_frontmatter_requirements) 设置为 `False`。

### 哪些内容会发送到 openwebui.com {#what-reaches-openwebuicom}

openwebui.com 绝不会连接你的服务器。所有内容都在用户浏览器的两个标签页之间传递，因此 `localhost` 或专用网络上的实例与公共实例的工作方式相同；在用户点击执行相应操作之前，不会发送任何内容。用户可以发送两类内容：

- **分享内容。** 用户分享的任何内容都会作为帖子发布：按当前配置发布的模型预设或提示词、包含所有文件的技能、工具的完整源代码，或包含消息的聊天快照。管理员还可以分享函数的完整源代码。
- 用于[排行榜](#add-your-usage-to-the-leaderboard)的**统计同步**。每位用户自行决定是否同步，且同步仅涵盖其自己的聊天。用户需要在你实例上的**同步使用统计（Sync Usage Stats）**对话框中确认。

统计同步会发送：

- Open WebUI 版本
- 每个聊天的以下信息：聊天 ID、用户在你实例上的 ID、创建和更新时间，以及标签
- 每条消息的以下信息：消息 ID、角色、模型、字符数、token 数、时间戳，以及获得的评分和标签
- 每个聊天的汇总：消息数量、使用的模型、平均消息长度和平均响应时间

它不会发送消息文本、提示词、模型回复、聊天标题，或上传的文件和图片。

你实例自己的[评价](/features/administration/evaluation)排行榜由用户评分生成，绝不会离开你的实例。

### 关闭此功能 {#turn-it-off}

| 设置 | 位置 | 默认值 |
| :--- | :--- | :--- |
| **社区分享（Community Sharing）** | **设置 > 通用**（管理员区域） | 开启 |

[`ENABLE_COMMUNITY_SHARING`](/reference/env-configuration#enable_community_sharing)用于设置实例首次启动时的值。此后，以管理员面板中保存的值为准。

关闭此功能后，以下入口会对包括管理员在内的所有用户隐藏：

- 模型、提示词、技能、工具和函数页面上的**由 Open WebUI 社区提供（Made by Open WebUI Community）**链接
- 模型、提示词、技能、工具和函数菜单中的**分享（Share）**
- 聊天分享对话框中的**分享到 Open WebUI 社区（Share to Open WebUI Community）**
- 模型选择器中的**社区评价（Community Reviews）**，以及回复评分后的评价链接
- **同步使用统计（Sync Usage Stats）**对话框
- 新聊天中将导入自 openwebui.com 的模型链接到其网站作者的**作者（By）**信息行；模型会保留作者信息，因此重新开启分享后，该链接会恢复

该对话框背后的统计导出仍会通过 API 响应管理员请求，并拒绝其他所有用户。

## 后续阅读 {#where-to-go-next}

- **[社区插件](/features/extensibility/community)**：按你希望实现的功能查找插件。
- **[函数入门](/getting-started/quick-start/connect-a-provider/starting-with-functions)**：完成第一次函数导入，从查找函数到设置其 Valves。
- **[分享聊天](/features/chat-conversations/chat-features/chatshare#sharing-to-open-webui-community)**：了解分享链接，以及谁可以查看你分享到该网站的聊天。
