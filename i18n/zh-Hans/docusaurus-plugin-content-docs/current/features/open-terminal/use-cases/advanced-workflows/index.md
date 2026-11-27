---
sidebar_position: 0
title: "高级工作流"
---

# 使用技能的高级工作流

这些工作流将 Open Terminal 的多种能力组合成强大的多步骤流水线。每个工作流都包含一个**技能（Skill）**，即你在 Open WebUI 中创建的一组可复用指令，用于准确告知 AI 如何处理特定类型的任务。

---

## 什么是技能？ {#what-are-skills}

**技能**是你保存在 Open WebUI 中的一组可复用 Markdown 指令。调用技能时，其指令会被注入该对话的 AI 系统提示词中，使 AI 成为该特定任务的专家。

可以把它想象成在请某人完成工作之前，先给他一份详细的 SOP（标准操作程序），而 AI 还能在不同对话中持续参考它。

### 创建技能 {#creating-a-skill}

1. 前往左侧边栏中的**工作区**
2. 点击**技能**
3. 点击**创建**（+ 按钮）
4. 为其设置**名称**（例如“数据报告生成器”）和**描述**
5. 在**内容区域**中用 Markdown 编写指令
6. 点击**保存并创建**

![Open WebUI 模型能力页面](/images/open-terminal-model-capabilities.png)

:::tip Frontmatter 快捷方式
如果技能指令以 YAML frontmatter 开头，名称和描述字段会自动填充：

```markdown
---
name: data-report-generator
description: 分析数据文件并创建专业的 PDF 报告
---

## 指令
当被要求分析数据时：
1. 首先读取文件……
```
:::

### 使用技能 {#using-a-skill}

使用技能有两种方式：

**方式 1：在聊天中提及它（`$`）**

在聊天输入框中输入 `$`，然后按名称搜索你的技能。选择该技能后，AI 会在该对话中收到其**指令**。当你想立即明确告知 AI 遵循某个特定技能时，这种方式最合适。

![AI 使用技能和结构化工作流与数据交互](/images/open-terminal-ai-csv-analysis.png)

**方式 2：让 AI 自行找到它（自动发现）**

这是更强大的方式。在内置工具处于活动状态且模型的**技能**类别已开启时，AI 会在相关时**自动发现并使用你有权读取的每个已启用技能**。你完全无需提及该技能。将技能附加到模型（**工作区 → 模型 → 编辑**，**技能**行）会在聊天中预先选择它。没有内置工具时，附加的技能会被注入使用该模型的每次聊天中。

其幕后工作方式如下：

1. AI 会收到一份清单，其中列出你有权读取的每个已启用技能的**名称和描述**，包括附加的技能；这样，在需要之前，完整指令不会进入上下文
2. 当你的请求与某个技能的描述匹配时，AI 会**自主调用内置的 `view_skill` 工具**，加载指令和该技能的支持文件列表
3. 然后，AI 会遵循这些指令来处理你的请求

这意味着，只要你的工作区中有“数据报告生成器”技能，每当你放入 CSV 并说“分析它”时，AI 都会自动加载并遵循报告指令，无需你记得该技能的存在。

![模型能力设置页面](/images/open-terminal-model-capabilities.png)

:::tip 为瑞士军刀式模型附加多个技能
将多个技能附加到一个模型，它就会成为多用途专家。放入电子表格 → 它会加载数据分析技能。询问“研究电动汽车电池” → 它会加载研究技能。构建落地页 → 它会加载 Web 开发技能。全部自动完成。
:::

### 共享技能 {#sharing-skills}

技能具有访问控制。你可以：
- 将其保持为**私有**（仅你可以使用）
- 与**特定用户或组**共享
- 将其设为**公开**（实例上的每个人都可以使用）

点击技能编辑器中的**访问权限**按钮，配置谁可以使用你的技能。非管理员用户只有拥有**技能共享**权限时才能看到它。

![AI 集成设置和访问控制](/images/open-terminal-integrations-page.png)

---

## 工作流库 {#workflow-library}

下面每个页面都包含一个完整的工作流和可复制粘贴的技能：

| 工作流 | 功能 |
| :--- | :--- |
| **[数据报告](/features/open-terminal/use-cases/advanced-workflows/data-reports)** | 将杂乱的 CSV 转化为带图表的精美 PDF 报告 |
| **[数据库分析](/features/open-terminal/use-cases/advanced-workflows/database-analysis)** | 连接 PostgreSQL/MySQL/SQLite、运行查询并生成洞察 |
| **[研究助手](/features/open-terminal/use-cases/advanced-workflows/research-assistant)** | 收集 Web 来源并撰写结构化简报 |
| **[电子邮件处理](/features/open-terminal/use-cases/advanced-workflows/email-processing)** | 从 .eml 文件中提取行动事项和截止日期 |
| **[文档对比](/features/open-terminal/use-cases/advanced-workflows/document-comparison)** | 比较合同或提案的两个版本 |
| **[财务仪表板](/features/open-terminal/use-cases/advanced-workflows/finance-dashboard)** | 分析银行对账单并绘制支出图表 |
| **[图像处理](/features/open-terminal/use-cases/advanced-workflows/image-processing)** | 批量调整图像大小、添加水印和转换格式 |
| **[竞争分析](/features/open-terminal/use-cases/advanced-workflows/competitive-analysis)** | 抓取竞争对手的定价并构建对比结果 |
| **[应用构建器](/features/open-terminal/use-cases/advanced-workflows/app-builder)** | 根据描述构建完整的 Web 应用 |
| **[代码审查](/features/open-terminal/use-cases/advanced-workflows/code-review)** | 审查代码更改中的安全、性能和风格问题 |

---

## 编写出色技能的技巧 {#tips-for-writing-great-skills}

### 保持指令具体 {#keep-instructions-specific}

不佳：“分析数据”
良好：“读取文件、统计行数、识别列、检查缺失值，然后计算每个类别的平均值”

### 为步骤编号 {#number-your-steps}

与散文式段落相比，LLM 能更可靠地遵循编号指令。

### 包含输出预期 {#include-output-expectations}

告诉技能最终交付物应该是什么样子：“创建一份包含标题页和 3 个部分的 PDF”比“制作一份报告”更好。

### 测试并迭代 {#test-and-iterate}

创建技能，在真实任务中试用，并根据 AI 处理正确或错误的地方完善指令。

### 与 Open Terminal 的能力结合 {#combine-with-open-terminal-capabilities}

真正的力量来自将技能与 Open Terminal 的工具相结合：文件读取、代码执行、Web 预览和文件浏览器。一个要求“读取电子表格、使用 Python 生成图表并将其保存为 PNG”的技能会利用所有这些能力。
