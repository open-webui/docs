---
title: "Open Terminal 与 Terminals"
description: "在 Open WebUI 中构建应用、生成报告并运行代理。Open Terminal 为你的 AI 提供一台计算机；Terminals 为每个人或每个项目提供工作区。"
sidebar_position: 2
---

# Open Terminal 与 Terminals

**为你的 AI 提供一台计算机。在聊天中完成工作。**

让它构建一个仪表板，就能在对话旁打开一个可运行的应用。交给 AI 一份电子表格，就能获得一份可发送的报告。提供一个代码库，就能让它进行修改、运行测试并修复失败项。

**Open Terminal** 为你的 AI 提供完成这些工作所需的文件、软件、浏览器和命令行。**Terminals** 可按需提供这些环境，为个人和项目设置独立工作区，或设置共享工作区用于协作。两者都直接连接到 Open WebUI。

**[安装 Open Terminal](/features/open-terminal/setup/installation)** · **[部署 Terminals](https://github.com/open-webui/terminals#quick-start)**

## 从想法到可打开的成果 {#from-an-idea-to-something-you-can-open}

> 根据这个 CSV 构建一个小型仪表板。让我可以按日期和类别筛选，然后启动它，以便我在这里预览。

你的 AI 可以安装依赖、编写应用、启动服务器并检查输出。Open WebUI 会将文件、终端和预览放在对话旁，让你在当前工作位置直接试用结果并要求修改。

同样的循环也适用于演示文稿、批量编辑图片或分析数千行数据。脚本和交付物都是真实文件：你可以检查、下载并在其基础上继续构建。持久工作区能让下一项任务从已经完成的工作开始。

![聊天旁显示 Open Terminal 工作区及其文件浏览器的 Open WebUI](/images/open-terminal-file-browser.png)

## 使用你想合作的 AI {#use-the-ai-you-want-to-work-with}

通过 Open WebUI 连接能力出色的本地或云端模型，并启用[原生工具调用](/features/open-terminal/setup/connecting#8-enable-native-function-calling)。Open Terminal 为它提供一个可以执行你的请求、检查工作并重试的环境。

更喜欢 **Claude Code、Codex、Cursor 或 Gemini CLI**？在终端环境中安装并验证代理，然后在 Open WebUI 的模型选择器中选择它。代理自己的软件会针对你的项目运行，并在聊天中提供流式响应、审批和对话续接。[连接代理](/getting-started/quick-start/connect-an-agent)介绍了受支持的代理，以及如何通过 ACP 添加其他代理。

将工作区托管在你自己的计算机或服务器上，然后通过浏览器使用。

## 为每个项目提供工作空间 {#give-every-project-a-place-to-work}

**Terminals** 让你可以在 Open WebUI 中创建和分享已配置的工作区。只需选择一次软件、起始文件夹和设置脚本；Terminals 就会根据需要，在 Docker 或 Kubernetes 上启动 Open Terminal 容器。

对于个人工作，可以跨对话保留个人环境，也可以为每个已保存的聊天提供独立环境，使不同项目拥有不同的文件和进程。

对于协作工作，聊天级环境会为获得授权的协作者提供相同的文件和运行环境。一个人可以要求修改，另一个人可以检查结果，工作与相关讨论始终在一起。

对于团队，可以使用你的软件包和报告脚本预先准备分析环境，然后与某个组共享其模板。采用用户作用域时，每个人都会根据该设置获得独立的容器和持久文件。将机器与模型预设的**默认机器（Default machine）**配对后，用户就可以选择已经配好工作环境的报告助手。你还可以为某个模型预设提供专用环境，或在所有获得访问权限的用户之间共享一个环境。

用户通过 Open WebUI 工作；运维人员集中维护模板、访问权限和资源限制。你无需在每台笔记本电脑上设置开发环境，就能向整个团队提供实用的助手。

## 让有用的工作可重复执行 {#make-useful-work-repeatable}

在个人或共享工作区中构建报告脚本，然后将该机器和工作文件夹交给 Open WebUI [自动化](/features/chat-conversations/chat-features/automations)。安排提示词按计划运行，用它处理新数据并总结结果。工作区可以同时服务交互式工作和周期性任务，并使用模型或受支持的代理。

Terminals 可以停止空闲环境，同时保留其持久化文件，然后按需重新启动。可以为每个模板设置 CPU 和内存限制。工作区可以随时用于下一项任务，而无需让容器全天运行。

## 从一项真实任务开始 {#start-with-one-real-task}

1. **[安装 Open Terminal](/features/open-terminal/setup/installation)。** Docker 会为它提供独立的容器环境；主机安装则可在操作系统用户的权限范围内使用该机器的文件和软件。
2. **[将它连接到 Open WebUI](/features/open-terminal/setup/connecting)。** 在**设置 > 集成**（管理员区域）的**机器（Machines）**部分添加其地址和 API 密钥。
3. **在聊天中选择机器并让它开始工作。** 选择能力出色的模型或已安装的代理，提供文件或项目，并要求它交付可使用的结果。

如需按需创建工作区，请**[部署 Terminals](https://github.com/open-webui/terminals#quick-start)**，并从 Open WebUI 的**新建机器（New machine）**菜单创建第一个模板。如需连接你自己计算机的桌面应用，请使用 [Open WebUI Tether](/ecosystem/tether)。

Open Terminal 采用 [MIT 许可证](https://github.com/open-webui/open-terminal/blob/main/LICENSE)，也可通过其 REST API 与你自己的应用配合使用。[Terminals](https://github.com/open-webui/terminals/blob/main/LICENSE) 可免费用于个人非商业用途；商业或组织生产用途需要具有 Terminals 访问权限的 [Open WebUI 企业许可证](/enterprise)。
