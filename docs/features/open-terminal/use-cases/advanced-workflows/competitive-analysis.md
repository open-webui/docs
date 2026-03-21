---
sidebar_position: 8
title: "Competitive Analysis"
---

# 🌐 Competitive Analysis

Scrape competitor pricing pages and build a comparison.

> **You:** $Competitive Analyst <br/>
> Check these 5 competitor websites and compare their pricing plans to ours.

## What the AI does

1. Fetches each competitor's pricing page
2. Parses HTML to extract plan names, prices, and feature lists
3. Normalizes pricing (monthly vs. annual)
4. Builds a comparison spreadsheet and highlights key differences
5. Writes strategic observations

{/* TODO: Screenshot — File browser previewing competitor_pricing.csv as a table: rows for features, columns for competitors, with prices and ✓/✗ marks. */}

{/* TODO: Screenshot — The summary: "Key findings: Competitor A has a free tier, Competitor C is 30% cheaper on Pro, but we're the only one with 24/7 support included." */}

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: competitive-analyst
description: Scrapes competitor websites and builds pricing/feature comparison tables
---

## Competitive Analysis

When analyzing competitors:

1. **Use curl** to fetch pages. Set a user-agent header, handle redirects
2. **Parse HTML** with beautifulsoup4 to extract:
   - Plan names and prices
   - Feature lists
   - Promotional offers (free trials, discounts)
3. **Normalize data**: Convert annual to monthly prices where needed
4. **Create a comparison CSV** with competitors as columns and features as rows
5. **Write strategic observations**: Where are we cheaper/more expensive? What features do competitors have that we don't?
6. **Note the date** (pricing changes frequently)

Present findings as actionable insights, not just raw data.
```
