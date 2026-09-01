---
sidebar_position: 4
title: "Email Processing"
---

# Process a Folder of Emails

Drop a batch of `.eml` files and get a structured spreadsheet with action items and deadlines.

> **You:** $Email Processor <br/>
> Go through the /project-emails folder and extract all action items and deadlines.

## What the AI does

1. Lists all `.eml` files in the folder
2. Reads each email: headers (from, to, subject, date) and body
3. Identifies action items, deadlines, decisions, and open questions
4. Creates a CSV with structured columns
5. Flags overdue items
6. Writes a summary of the most critical emails

![The extracted action items previewed as a table](/images/open-terminal-email-actions-table.png)

![The AI summarising the most urgent action items](/images/open-terminal-email-summary.png)

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: email-processor
description: Reads .eml email files and extracts action items, deadlines, and key decisions
---

## Email Processing

When asked to process email files:

1. **List all .eml files** in the specified directory
2. **For each email, extract**:
   - Headers: From, To, CC, Date, Subject
   - Body: prefer plain text, strip HTML tags as fallback
   - Attachment filenames (if any)
3. **Analyze each body for**:
   - Action items (tasks assigned to someone)
   - Deadlines or due dates
   - Decisions made
   - Questions that need answers
4. **Create a CSV** with columns: Date, From, Subject, Action Items, Deadline, Priority
5. **Sort by date** and flag anything overdue
6. **Write a summary** highlighting the 5 most critical items

Preserve original email context so findings are traceable.
```
