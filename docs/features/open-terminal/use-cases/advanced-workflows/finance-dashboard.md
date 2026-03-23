---
sidebar_position: 6
title: "Finance Dashboard"
---

# 💰 Personal Finance Dashboard

Upload bank statements and get a spending analysis with charts.

> **You:** $Finance Analyzer <br/>
> *(drop 3 CSV bank statements into the file browser)* <br/>
> Analyze my spending over the last 3 months. Where is my money going?

## What the AI does

1. Reads all CSV files and normalizes the different formats
2. Categorizes transactions: groceries, dining, subscriptions, transport, etc.
3. Identifies recurring charges and flags anything unusual
4. Creates a dashboard with monthly trends, category breakdown, and top merchants
5. Flags anomalies: unusually large charges, new subscriptions, possible duplicates

{/* TODO: Screenshot — File browser previewing a generated spending_dashboard.html: pie chart of spending categories, bar chart of monthly trends, table of top merchants. */}

{/* TODO: Screenshot — The anomaly report: "3 things to check: $450 charge to 'TECHSTORE' on Feb 15 (unusually large), new $14.99/month subscription to 'StreamPlus', possible duplicate $89.00 charge on March 3 and 5." */}

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: finance-analyzer
description: Analyzes bank statements and creates spending reports with charts
---

## Financial Analysis

When analyzing bank statements:

1. **Read all files** and normalize columns (date, description, amount, type). Handle different CSV formats (detect delimiters, date formats, debit/credit conventions)
2. **Categorize transactions** using keyword matching:
   - Groceries: walmart, costco, trader joe, whole foods
   - Dining: restaurant, cafe, doordash, uber eats
   - Subscriptions: netflix, spotify, recurring monthly charges
   - Transport: gas, uber, lyft, parking
   - (Add more categories as needed)
3. **Generate charts**:
   - Monthly spending trend (line chart)
   - Category breakdown (pie chart)
   - Top 10 merchants (bar chart)
4. **Detect anomalies**: charges >2x average for that merchant, new recurring charges, possible duplicates (same amount within 3 days)
5. **Create an HTML dashboard** viewable in the file browser

Use proper currency formatting and round to 2 decimal places.
```
