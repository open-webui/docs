---
sidebar_position: 6
title: "财务仪表板"
---

# 个人财务仪表板

上传银行对账单，即可获得带图表的支出分析。

> **你：** $财务分析器 <br/>
> *（将 3 份 CSV 银行对账单放入文件浏览器）* <br/>
> 分析我过去 3 个月的支出。我的钱都花到哪里去了？

## AI 会执行哪些操作 {#what-the-ai-does}

1. 读取所有 CSV 文件并统一不同的格式
2. 对交易进行分类：食品杂货、餐饮、订阅、交通等
3. 识别周期性扣款并标记任何异常
4. 创建包含月度趋势、类别细分和主要商户的仪表板
5. 标记异常：异常大额扣款、新订阅、可能的重复扣款

![在其文件标签页中打开的生成支出仪表板](/images/open-terminal-finance-dashboard.png)

![AI 标记对账单中的异常交易](/images/open-terminal-finance-anomalies.png)

## 技能内容 {#skill-content}

将以下内容复制到**工作区 → 技能 → 创建**：

```markdown
---
name: finance-analyzer
description: 分析银行对账单并创建带图表的支出报告
---

## 财务分析

分析银行对账单时：

1. **读取所有文件**并统一列（日期、描述、金额、类型）。处理不同的 CSV 格式（检测分隔符、日期格式、借记/贷记约定）
2. **使用关键词匹配对交易进行分类**：
   - 食品杂货：walmart、costco、trader joe、whole foods
   - 餐饮：restaurant、cafe、doordash、uber eats
   - 订阅：netflix、spotify、每月周期性扣款
   - 交通：gas、uber、lyft、parking
   - （根据需要添加更多类别）
3. **生成图表**：
   - 月度支出趋势（折线图）
   - 类别细分（饼图）
   - 排名前 10 的商户（条形图）
4. **检测异常**：超过该商户平均扣款金额 2 倍的扣款、新的周期性扣款、可能的重复扣款（3 天内金额相同）
5. **创建可在文件浏览器中查看的 HTML 仪表板**

使用正确的货币格式，并保留两位小数。
```
