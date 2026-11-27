---
sidebar_position: 2
title: "数据库分析"
---

# 连接并分析数据库

直接连接你的 PostgreSQL、MySQL 或 SQLite 数据库，让 AI 探索架构、运行查询并生成洞察，全程无需你自己编写 SQL。

> **你：** $数据库分析员 <br/>
> 连接我位于 `db.example.com` 的 PostgreSQL 数据库并分析 `orders` 表。本季度我们最畅销的产品是什么？有什么我应该了解的趋势吗？

## AI 会执行哪些操作 {#what-the-ai-does}

1. 根据需要安装数据库驱动程序（`pip install psycopg2-binary` 或 `pymysql`）
2. 使用你的凭据连接数据库
3. 探索架构：列出表、列和关系
4. 编写并运行 SQL 查询来回答你的问题
5. 将结果提取到 pandas 中进行分析
6. 生成图表（收入趋势、热门产品、地区细分）
7. 将所有内容保存为报告

{/* TODO: 截图：聊天中显示 AI 连接 PostgreSQL 数据库、列出表，然后运行查询。结果显示一个包含产品名称、销量和收入的格式化表格。 */}

{/* TODO: 截图：根据数据库查询生成的图表：按收入排名前 10 的产品条形图、显示月度订单趋势的折线图，以及按地区显示销售额的饼图。 */}

:::tip 保护凭据安全
启动 Open Terminal 时，将数据库凭据作为环境变量传入，或将其存储在容器内的 `.env` 文件中。切勿直接在聊天中粘贴密码：它们会保存在聊天历史记录中。示例：

```bash
docker run -d --name open-terminal \
  -e DB_HOST=db.example.com \
  -e DB_USER=analyst \
  -e DB_PASS=your-password \
  -e DB_NAME=production \
  ghcr.io/open-webui/open-terminal
```

然后告知技能从环境变量中读取凭据。
:::

## 支持的数据库 {#supported-databases}

| 数据库 | Python 驱动程序 | 安装命令 |
| :--- | :--- | :--- |
| PostgreSQL | psycopg2 | `pip install psycopg2-binary` |
| MySQL / MariaDB | pymysql | `pip install pymysql` |
| SQLite | sqlite3 | 内置（无需安装） |
| Microsoft SQL Server | pymssql | `pip install pymssql` |
| MongoDB | pymongo | `pip install pymongo` |

## 技能内容 {#skill-content}

将以下内容复制到**工作区 → 技能 → 创建**：

```markdown
---
name: database-analyst
description: 连接 SQL 数据库、探索架构、运行查询并创建分析报告
---

## 数据库分析

当被要求分析数据库时：

1. **安全连接**：从环境变量（DB_HOST、DB_USER、DB_PASS、DB_NAME）读取凭据。切勿硬编码密码。PostgreSQL 使用 `psycopg2`，MySQL 使用 `pymysql`，SQLite 使用 `sqlite3`
2. **先探索架构**：
   - 列出所有表及其行数
   - 显示相关表的列名、类型和示例值
   - 识别主键和外键关系
   - 在运行分析查询之前展示架构摘要
3. **编写高效的 SQL**：
   - 尽可能使用适当的 JOIN（而非子查询）
   - 添加 LIMIT 子句，防止意外提取数百万行
   - 使用聚合函数（COUNT、SUM、AVG、GROUP BY）进行汇总
   - 始终包含 ORDER BY 以提高可读性
4. **在 Python 中分析结果**：
   - 将查询结果加载到 pandas DataFrame 中
   - 计算其他指标：增长率、百分比、排名
   - 识别趋势、异常和值得注意的模式
5. **创建可视化**：
   - 使用 matplotlib，采用清晰的标签和一致的样式
   - 时间序列 → 折线图
   - 排名 → 水平条形图
   - 比例 → 饼图或环形图
   - 将每个图表保存为 PNG
6. **生成报告**，其中包含：
   - 架构概览（有哪些表以及它们如何关联）
   - 附带支撑数据的主要发现
   - 嵌入在相关上下文中的图表
   - 实际使用的 SQL 查询（以便用户重新运行）
7. **完成后关闭连接**

始终先显示 SQL 查询，再显示结果，以便用户验证其正确性。
```
