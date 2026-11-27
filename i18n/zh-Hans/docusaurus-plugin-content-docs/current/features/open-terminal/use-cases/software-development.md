---
sidebar_position: 2
title: "软件开发"
---

# 软件开发

Open Terminal 使 AI 能够与真实的代码库交互：克隆代码仓库、运行测试、读取错误、安装依赖，并不断迭代修复。

---

## 克隆并探索代码仓库 {#clone-and-explore-a-repo}

> **你：** 克隆 https://github.com/user/project，并向我概述这个代码库。它的架构是什么？入口点在哪里？

AI 会：
1. 运行 `git clone` 拉取代码仓库
2. 扫描目录结构，读取关键文件（`README`、`package.json`、`pyproject.toml` 等）
3. 识别技术栈、入口点和主要组件
4. 返回结构化摘要，包括文件数量、依赖和架构说明

![AI 列出项目文件并描述结构](/images/open-terminal-ai-file-listing.png)

---

## 运行测试套件并修复失败项 {#run-the-test-suite-and-fix-failures}

> **你：** 运行测试。如果有任何失败，查明原因并修复。

AI 会：
1. 检测测试框架（`pytest`、`jest`、`go test` 等）
2. 根据需要安装依赖
3. 运行完整测试套件
4. 读取失败输出、追踪问题并编辑源代码
5. 重新运行失败的测试以确认修复有效

![AI 运行测试并迭代修复](/images/open-terminal-ai-test-suite.png)

:::tip 迭代调试
AI 看到的终端输出与开发者看到的相同：堆栈跟踪、断言错误和日志消息。它会自动执行多轮“运行、读取错误、修复、重新运行”。
:::

---

## 设置开发环境 {#set-up-a-development-environment}

> **你：** 配置好这个项目，让我可以进行开发。安装所有依赖、创建数据库并运行开发服务器。

AI 会：
1. 阅读设置文档（`README`、`Makefile`、`docker-compose.yml`）
2. 安装系统软件包和语言依赖
3. 创建配置文件、设置数据库并运行迁移
4. 启动开发服务器并确认其正常工作
5. 报告可访问该服务的 URL

![AI 安装依赖并运行项目](/images/open-terminal-ai-install-run.png)

---

## 放心重构 {#refactor-with-confidence}

> **你：** 重构 `users.py` 中的数据库查询，改用 async/await。确保测试仍然通过。

AI 会：
1. 读取当前实现
2. 按你的要求重写代码
3. 运行测试套件，验证没有破坏任何功能
4. 如果测试失败，调整重构后的代码，直到测试通过
5. 向你展示变更内容的 `git diff`

![AI 自动调试并修复代码错误](/images/open-terminal-ai-debug-fix.png)

---

## Git 工作流 {#git-workflows}

> **你：** 向我显示自上一个发布标签以来发生的变化。总结这些提交。

AI 可以直接使用 Git：

- 使用 `git log`、`git diff`、`git blame` 分析历史记录
- 创建分支、暂存更改、创建提交
- 根据提交历史生成更新日志
- 使用 `git bisect` 查找引入问题的时间
- 解决合并冲突

![AI 初始化 Git 仓库并使用 Git](/images/open-terminal-ai-git-workflow.png)

---

## 编写并运行测试 {#write-and-run-tests}

> **你：** 为 `orders.py` 中的 `calculate_shipping()` 函数编写单元测试。覆盖边界情况。

AI 会：
1. 读取函数以理解其逻辑和参数
2. 识别边界情况（数量为零、负数、国际与国内、免运费门槛）
3. 使用项目现有的测试框架编写测试用例
4. 运行测试，验证其通过
5. 如果有任何失败，判断是测试的问题还是代码的问题

![AI 运行 pytest 测试套件并报告每项结果](/images/open-terminal-ai-test-suite.png)

---

## 调试特定问题 {#debug-a-specific-issue}

> **你：** 用户报告登录端点有时会返回 500。这是日志中的错误：`KeyError: 'session_token'`。找出并修复这个问题。

AI 会：
1. 在代码库中搜索 `session_token` 的使用位置
2. 阅读周边代码以理解流程
3. 找出问题（例如，会话过期时缺少键检查）
4. 编写包含适当错误处理的修复代码
5. 为该边界情况添加测试用例
6. 运行测试进行确认

![AI 找出并修复代码库中的问题](/images/open-terminal-ai-debug-fix.png)

---

## 构建并验证 API {#build-and-verify-an-api}

> **你：** 创建一个用于管理书店的 REST API。我需要对图书、作者和分类进行 CRUD 操作。使用 FastAPI 和 SQLite。

AI 会：
1. 搭建项目结构
2. 定义数据库模型和数据模式
3. 实现所有端点及验证
4. 创建种子数据
5. 启动服务器，并使用 `curl` 测试每个端点
6. 向你展示 Swagger 文档页面

![AI 创建并运行 Web 应用](/images/open-terminal-ai-web-dev.png)

---

## 有哪些可用的语言和工具？ {#what-languages-and-tools-are-available}

Docker 镜像预装了常用的开发工具：

| 类别 | 可用工具 |
| :--- | :--- |
| **语言** | Python、Node.js、Ruby、C/C++、Bash |
| **软件包管理器** | pip、npm、gem、apt |
| **版本控制** | Git |
| **编辑器** | nano、vim |
| **构建工具** | make、gcc、g++ |

AI 可以按需安装其他工具：Rust、Go、Java、Docker CLI、数据库客户端，以及可通过 `apt` 或各语言专用软件包管理器获取的任何其他工具。

## 相关内容 {#related}

- **[代码执行 →](./code-execution.md)**：快速脚本和一次性任务
- **[Web 开发 →](./web-development.md)**：构建和预览网站
- **[高级工作流 →](./advanced-workflows/)**：用于代码审查、数据库分析等任务的技能
