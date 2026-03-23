---
sidebar_position: 2
title: "Database Analysis"
---

# 🗄️ Connect to a Database and Analyze It

Connect to your PostgreSQL, MySQL, or SQLite database directly and let the AI explore the schema, run queries, and produce insights — all without writing SQL yourself.

> **You:** $Database Analyst <br/>
> Connect to my PostgreSQL database at `db.example.com` and analyze the `orders` table. What are our top-selling products this quarter? Any trends I should know about?

## What the AI does

1. Installs the database driver if needed (`pip install psycopg2-binary` or `pymysql`)
2. Connects to the database using your credentials
3. Explores the schema — lists tables, columns, relationships
4. Writes and runs SQL queries to answer your question
5. Pulls results into pandas for analysis
6. Generates charts (revenue trends, top products, regional breakdowns)
7. Saves everything as a report

{/* TODO: Screenshot — Chat showing the AI connecting to a PostgreSQL database, listing tables, and then running a query. Results show a formatted table with product names, quantities sold, and revenue. */}

{/* TODO: Screenshot — Charts generated from the database query: a bar chart of top 10 products by revenue, a line chart showing monthly order trends, and a pie chart of sales by region. */}

:::tip Keep credentials safe
Pass database credentials as environment variables when starting Open Terminal, or store them in a `.env` file in the container. Never paste passwords directly in chat — they get saved in chat history. Example:

```bash
docker run -d --name open-terminal \
  -e DB_HOST=db.example.com \
  -e DB_USER=analyst \
  -e DB_PASS=your-password \
  -e DB_NAME=production \
  ghcr.io/open-webui/open-terminal
```

Then tell the skill to read from environment variables.
:::

## Supported databases

| Database | Python driver | Install command |
| :--- | :--- | :--- |
| PostgreSQL | psycopg2 | `pip install psycopg2-binary` |
| MySQL / MariaDB | pymysql | `pip install pymysql` |
| SQLite | sqlite3 | Built-in (no install needed) |
| Microsoft SQL Server | pymssql | `pip install pymssql` |
| MongoDB | pymongo | `pip install pymongo` |

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: database-analyst
description: Connects to SQL databases, explores schemas, runs queries, and creates analysis reports
---

## Database Analysis

When asked to analyze a database:

1. **Connect safely**: Read credentials from environment variables (DB_HOST, DB_USER, DB_PASS, DB_NAME). Never hardcode passwords. Use `psycopg2` for PostgreSQL, `pymysql` for MySQL, `sqlite3` for SQLite
2. **Explore the schema first**:
   - List all tables and their row counts
   - Show column names, types, and sample values for relevant tables
   - Identify primary keys and foreign key relationships
   - Present the schema summary before running analysis queries
3. **Write efficient SQL**:
   - Use appropriate JOINs (not subqueries) where possible
   - Add LIMIT clauses to prevent accidentally pulling millions of rows
   - Use aggregate functions (COUNT, SUM, AVG, GROUP BY) for summaries
   - Always include ORDER BY for readability
4. **Analyze results in Python**:
   - Load query results into a pandas DataFrame
   - Compute additional metrics: growth rates, percentages, rankings
   - Identify trends, anomalies, and notable patterns
5. **Create visualizations**:
   - Use matplotlib with clear labels and consistent styling
   - Time series → line charts
   - Rankings → horizontal bar charts
   - Proportions → pie or donut charts
   - Save each chart as a PNG
6. **Produce a report** with:
   - Schema overview (what tables exist and how they relate)
   - Key findings with supporting data
   - Charts embedded in context
   - The actual SQL queries used (so the user can re-run them)
7. **Close the connection** when done

Always show the SQL query before showing results so the user can verify it's correct.
```
