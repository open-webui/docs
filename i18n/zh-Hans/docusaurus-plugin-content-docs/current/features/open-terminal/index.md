---
sidebar_position: 3
title: "Open Terminal"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open Terminal

<ThemedImage
  alt="终端：带有光标的屏幕区块"
  sources={{
    light: useBaseUrl('/images/banners/terminal-light.svg'),
    dark: useBaseUrl('/images/banners/terminal-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**将 Open WebUI 变成完整的智能体运行框架。**

[在 GitHub 上查看 →](https://github.com/open-webui/open-terminal)

智能体运行框架是围绕模型构建、让模型完成实际工作的系统，包括指令、上下文、工具、状态、权限、反馈循环、可观测性和执行环境。Open WebUI 已经提供了该框架的控制部分：模型、聊天、知识、提示词、工具、MCP 连接、记忆、用户、权限、自动化和共享工作流控制。Open Terminal 则补上了大多数聊天产品仍然缺失的部分：一个用于执行操作并返回证据的真实计算机底座。

这意味着智能体可以自行完成工作。它可以规划、创建文件、运行代码、检查输出、安装依赖、启动服务器、渲染预览、从错误中恢复，并持续执行，直到生成可用的成果：脚本、报告、补丁、图表、网站、迁移或整理好的文件夹。

Open Terminal 是一个类似计算机的工作区，使 Open WebUI 的智能体循环能够操作文件、代码、软件包、服务器、文档和生成的成果。可以在 Docker 中运行以实现隔离，也可以在裸机上运行，让智能体直接操作主机。

![Open WebUI 中选中了 Open Terminal，并在新聊天旁打开“文件”选项卡](/images/open-terminal-file-browser.png)

## 正确的心智模型 {#the-right-mental-model}

现代智能体工作流并非输入一个提示词就只得到一个答案，而是有状态的循环：

1. 理解目标。
2. 检查工作区。
3. 选择操作。
4. 执行操作。
5. 观察结果。
6. 修复、继续或验证。

Open WebUI 负责协调这个循环。Open Terminal 为循环提供真实的发生场所：可供检查的文件、可运行的代码、可验证的输出，以及可交还的成果。两者共同构成完整的运行框架：模型、上下文、工具、状态、操作、观察和验证。

---

## 运行框架如何协同工作 {#how-the-harness-fits-together}

| | Open WebUI | Open Terminal |
| :--- | :--- | :--- |
| 框架角色 | 控制层：提示词、上下文、工具、状态、权限、用户和工作流界面 | 操作层：模型可以在其中执行操作的类计算机工作区 |
| 上下文 | 对话、上传的文件、知识库、记忆、笔记、频道 | 文件、文件夹、终端输出、日志、预览、文档和生成的成果 |
| 操作 | 内置工具、MCP/OpenAPI 工具、自动化、子智能体 | 创建文件、运行命令、安装软件包、执行代码、启动服务器、使用 Git、处理文档 |
| 反馈循环 | 工具调用、对话状态、模型路由和工作流推进 | 观察工作区、修改工作区、运行、检查结果、修复、重试、验证 |
| 边界 | Open WebUI 权限和配置 | Docker 沙盒或直接访问主机 |

Open WebUI 与 Open Terminal 共同构成完整的智能体运行框架：控制层、操作层，以及两者之间的反馈循环。

---

## 人们常用的术语 {#the-terms-people-use}

不同团队会用不同的语言描述这套技术栈。Open Terminal 符合人们在智能体系统中已有的用语习惯：

| 常用术语 | 在本文中的含义 |
| :--- | :--- |
| **Agentic AI（智能体 AI）** | 能够执行多步操作、观察结果并继续工作的模型 |
| **Agentic workflow（智能体工作流）** | 由智能体规划、执行、观察结果并调整行为的目标驱动过程 |
| **AI agent（AI 智能体）** | 模型加上指令、工具、记忆/上下文和执行循环 |
| **Agent harness（智能体运行框架）** | 围绕模型构建、将推理转化为操作的完整系统：指令、上下文、工具、状态、权限、反馈循环、评估、可观测性和执行环境 |
| **Agent runtime（智能体运行时）** | 智能体实际操作运行的场所：文件、代码、命令、服务器、文档和进程 |
| **Action runtime（操作运行时）** | 专注于通过授权和可审计性可靠执行实际操作的运行时 |
| **Agentic infrastructure（智能体基础设施）** | 在生产环境运行智能体所需的计算、状态、编排、工具、安全和可观测性 |
| **Computer substrate（计算机底座）** | 运行框架提供给智能体以便其完成工作的文件系统、shell、软件包、进程、预览和成果 |
| **Stateful session（有状态会话）** | 跨多轮模型/工具交互持续存在的任务或工作区，而非单个无状态请求 |
| **Tool calling / function calling（工具调用 / 函数调用）** | 模型选择结构化的工具操作，而非只生成文本 |
| **Tool result / context return（工具结果 / 上下文返回）** | 将操作输出返回给模型，以便模型决定下一步 |
| **Action tools（操作工具）** | 修改外部环境的工具，例如编辑文件、发布消息或更改记录 |
| **Computer use（计算机使用）** | 智能体通过文件、命令、界面或浏览器操作来控制类计算机环境 |
| **Code interpreter（代码解释器）** | 范围较窄的代码执行界面；Open Terminal 的范围更广，因为它包含文件系统、shell、软件包、进程和预览 |
| **MCP / tool servers（MCP / 工具服务器）** | 通过标准或 API 向模型提供能力的方式 |
| **Orchestration（编排）** | 选择工具、安排步骤顺序、处理失败并验证结果的循环 |
| **Human-in-the-loop（人工参与）** | 在由智能体驱动的工作流中设置人工批准或审核节点 |
| **Guardrails / governance（护栏 / 治理）** | 围绕智能体可见内容和可执行操作设置的策略、权限与安全控制 |
| **Observability / auditability（可观测性 / 可审计性）** | 展示智能体执行了什么及其原因的日志、跟踪和记录 |
| **Sandbox（沙盒）** | 围绕智能体文件系统、进程和网络访问设置的隔离边界 |

实际要点很简单：模型已经足够擅长使用工具，但运行框架的实用性取决于它能够操作的环境。Open Terminal 为 Open WebUI 提供了计算机形态的操作层，使运行框架趋于完整。

---

## 智能体工作负载 {#agent-workloads}

### 数据分析与报告 {#data-analysis-and-reporting}

上传电子表格、CSV、数据库或导出的日志。智能体可以检查文件、编写分析代码、安装库、生成图表，并返回完整的报告。

![AI 正在分析电子表格中的数据](/images/open-terminal-ai-csv-analysis.png)

### 文档搜索与提取 {#document-search-and-extraction}

让智能体处理包含 PDF、Word 文档、电子表格或电子邮件的文件夹。它可以搜索、提取、转换、总结、交叉引用，并生成结构化输出。

![AI 正在读取合同文件夹并总结续约内容](/images/open-terminal-document-search.png)

### 带实时预览的 Web 开发 {#web-development-with-live-preview}

描述一个网站或应用。智能体可以创建文件、安装依赖、启动开发服务器，并在 Open WebUI 内渲染结果。在聊天中描述更改即可继续迭代。

![聊天旁显示 AI 所托管活动网站的实时预览](/images/open-terminal-live-site-preview.png)

### 软件开发 {#software-development}

克隆仓库、检查架构、运行测试套件、调试失败、重构代码并使用 Git。智能体会运行并验证自己编写的代码。

### 文件与系统自动化 {#file-and-system-automation}

批量重命名、排序、去重、转换、压缩和整理文件。管理磁盘使用量、处理日志、准备导出，并自动执行可重复的操作。

![AI 正在重命名 43 张照片，为每个文件名添加日期前缀](/images/open-terminal-bulk-rename.png)

---

## 智能体能利用这个底座做什么 {#what-agents-can-do-with-this-substrate}

| | |
| :--- | :--- |
| **使用真实的 shell** | 运行命令、脚本、CLI、测试、构建工具和软件包管理器 |
| **拥有工作区** | 浏览、上传、下载、编辑、创建、重命名、转换和整理文件 |
| **处理文档与数据** | 处理 PDF、Word、Excel、PowerPoint、RTF、EPUB、电子邮件、文本、代码和数据文件 |
| **运行并预览软件** | 启动本地服务器，并在 Open WebUI 内显示实时预览 |
| **根据反馈迭代** | 读取输出、检查成果、修复错误、重试并验证结果 |
| **选择边界** | 在 Docker 中隔离运行，或在明确需要直接访问主机时于裸机上运行 |

---

## 开始使用 {#get-started}

**[安装 →](/features/open-terminal/setup/installation)** · **[连接到 Open WebUI →](/features/open-terminal/setup/connecting)**

若要在自己的服务器或笔记本电脑上不使用 Docker 运行 Open Terminal，请[将其添加为 SSH 机器](/features/open-terminal/setup/ssh-machines)。若要在 Open WebUI 服务器本身上运行，请[添加本地机器](/features/open-terminal/setup/local-machine)；Open WebUI 在 Docker 中运行时也同样适用。

:::info 模型要求
Open Terminal 需要能够以智能体所需质量执行工具调用的模型，而不能只是在技术上支持工具。在计算机底座中工作是一个多步循环：选择操作、观察文件或输出、判断发生了什么变化、从错误中恢复，并在多轮交互中重复。小模型即使能够生成有效的工具调用，也常常无法完成这个循环。处理复杂的软件、数据和自动化工作时，请使用能力强的前沿模型。默认使用原生工具调用；如果工具未被触发，请[检查模型的工具调用模式](/features/open-terminal/setup/connecting#8-enable-native-function-calling)。
:::

---

## 使用场景 {#use-cases}

- **[代码执行](/features/open-terminal/use-cases/code-execution)**：编写、运行和调试脚本
- **[软件开发](/features/open-terminal/use-cases/software-development)**：仓库、测试、调试、重构、Git
- **[文档与数据分析](/features/open-terminal/use-cases/file-analysis)**：电子表格、PDF、Word 文档、电子邮件
- **[Web 开发](/features/open-terminal/use-cases/web-development)**：在“浏览器”选项卡中构建并预览网站
- **[系统自动化](/features/open-terminal/use-cases/system-automation)**：文件管理、备份、批量操作
- **[高级工作流](/features/open-terminal/use-cases/advanced-workflows)**：用于数据报告、研究、代码审查等任务的技能
- **[智能体](/features/open-terminal/agents)**：模型选择器中的 Claude Code、Codex 或 Goose 等智能体
- **[文件浏览器](/features/open-terminal/file-browser)**：上传、预览、编辑文件及 Git

---

## 企业级多用户 {#enterprise-multi-user}

团队需要独立的智能体工作区吗？**[Terminals](/features/open-terminal/terminals/)** 是 Open Terminal 的编排器。它可以为每个用户、聊天或模型启动独立实例，并提供自动生命周期管理、资源限制、自定义镜像、持久化存储，以及拥有各自环境的可共享终端。
