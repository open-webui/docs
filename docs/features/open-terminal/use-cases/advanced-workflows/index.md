---
sidebar_position: 0
title: "Advanced Workflows"
---

# Advanced Workflows with Skills

These workflows combine multiple Open Terminal capabilities into powerful multi-step pipelines. Each one includes a **Skill** — a reusable set of instructions you create in Open WebUI that tells the AI exactly how to approach a specific type of task.

---

## What are Skills?

A **Skill** is a reusable set of markdown instructions that you save in Open WebUI. When you invoke a skill, its instructions are injected into the AI's system prompt for that conversation, making the AI an expert at that specific task.

Think of it like giving someone a detailed SOP (standard operating procedure) before asking them to do a job — except the AI follows it perfectly every time.

### Creating a Skill

1. Go to **Workspace** in the left sidebar
2. Click **Skills**
3. Click **Create** (+ button)
4. Give it a **name** (e.g., "Data Report Generator") and a **description**
5. Write the instructions in markdown in the **content area**
6. Click **Save & Create**

{/* TODO: Screenshot — The Workspace → Skills page showing a list of existing skills (e.g., "Data Report Generator", "Research Assistant", "Email Processor"). The Create button is visible in the top-right corner. */}

{/* TODO: Screenshot — The Skill Editor showing a skill being created. The name field says "Data Report Generator", the description says "Analyzes data files and creates professional PDF reports". The content area shows markdown instructions with numbered steps. */}

:::tip Frontmatter shortcut
If your skill instructions start with YAML frontmatter, the name and description fields auto-populate:

```markdown
---
name: data-report-generator
description: Analyzes data files and creates professional PDF reports
---

## Instructions
When asked to analyze data:
1. First, read the file...
```
:::

### Using a Skill

There are two ways to use a skill:

**Option 1: Mention it in chat (`$`)**

Type `$` in the chat input, then search for your skill by name. Select it, and the AI receives the **full instructions** for that conversation. This is best when you want to explicitly tell the AI to follow a specific skill right now.

{/* TODO: Screenshot — The chat input showing the $ mention dropdown. The user has typed "$Data" and the autocomplete shows "Data Report Generator" as a suggestion, with its description visible. */}

{/* TODO: Screenshot — A chat where the user has $mentioned a skill and then asked a question. The skill name appears as a tag in the message. The AI's response clearly follows the skill's structured approach. */}

**Option 2: Attach it to a Model (auto-discovery)**

This is the more powerful option. Go to **Workspace → Models → Edit** and check the skill under the **Skills** section. Now the AI **automatically discovers and uses it when relevant** — you don't need to mention the skill at all.

Here's how it works behind the scenes:

1. The AI receives a manifest listing each attached skill's **name and description** (not the full instructions — that would waste context)
2. When your request matches a skill's description, the AI **autonomously calls a built-in `view_skill` tool** to load the full instructions
3. The AI then follows those instructions to handle your request

This means you can attach a "Data Report Generator" skill to your model, and any time you drop a CSV and say "analyze this," the AI will automatically load and follow the reporting instructions — without you needing to remember the skill exists.

{/* TODO: Screenshot — The Model Editor showing the Skills section with checkboxes. "Data Report Generator" and "Research Assistant" are checked. A note says "To select skills here, add them to the Skills workspace first." */}

:::tip Attach multiple skills for a Swiss-army-knife model
Attach several skills to a single model and it becomes a multi-purpose expert. Drop a spreadsheet → it loads the data analysis skill. Ask "research EV batteries" → it loads the research skill. Build a landing page → it loads the web dev skill. All automatically.
:::

### Sharing Skills

Skills have access controls. You can:
- Keep them **private** (only you can use them)
- Share with **specific users or groups**
- Make them **public** (available to everyone on your instance)

Click the **Access** button in the skill editor to configure who can use your skill.

{/* TODO: Screenshot — The Access Control modal for a skill, showing options to set visibility: Private, specific users/groups, or Public. */}

---

## Workflow Library

Each page below is a complete workflow with a copy-pasteable skill:

| Workflow | What it does |
| :--- | :--- |
| **[Data Reports](./data-reports)** | Turn messy CSVs into polished PDF reports with charts |
| **[Database Analysis](./database-analysis)** | Connect to PostgreSQL/MySQL/SQLite, run queries, produce insights |
| **[Research Assistant](./research-assistant)** | Gather web sources and write structured briefings |
| **[Email Processing](./email-processing)** | Extract action items and deadlines from .eml files |
| **[Document Comparison](./document-comparison)** | Diff two versions of a contract or proposal |
| **[Finance Dashboard](./finance-dashboard)** | Analyze bank statements and chart spending |
| **[Image Processing](./image-processing)** | Batch resize, watermark, and convert images |
| **[Competitive Analysis](./competitive-analysis)** | Scrape competitor pricing and build comparisons |
| **[App Builder](./app-builder)** | Build a complete web app from a description |
| **[Code Review](./code-review)** | Review code changes for security, performance, and style issues |

---

## Tips for Writing Great Skills

### Keep instructions specific
Bad: "Analyze the data"
Good: "Read the file, count rows, identify columns, check for missing values, then compute averages per category"

### Number your steps
LLMs follow numbered instructions more reliably than prose paragraphs.

### Include output expectations
Tell the skill what the final deliverable should look like: "Create a PDF with a title page and 3 sections" is better than "make a report."

### Test and iterate
Create the skill, try it on a real task, and refine the instructions based on what the AI gets right or wrong.

### Combine with Open Terminal capabilities
The real power comes from combining skills with Open Terminal's tools: file reading, code execution, web preview, and the file browser. A skill that says "read the spreadsheet, generate a chart with Python, and save it as a PNG" leverages all of these.
