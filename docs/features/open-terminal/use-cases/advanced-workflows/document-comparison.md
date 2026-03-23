---
sidebar_position: 5
title: "Document Comparison"
---

# 📑 Compare Two Versions of a Document

Upload two versions of a contract or proposal and get a clear summary of what changed.

> **You:** $Document Comparator <br/>
> *(upload contract_v1.docx and contract_v2.docx)* <br/>
> Compare these two versions. Focus on payment terms and liability changes.

## What the AI does

1. Reads both documents (Open Terminal handles .docx natively)
2. Computes a text diff at the paragraph/sentence level
3. Categorizes changes: formatting-only, minor wording, substantive changes
4. Highlights the specific areas you asked about (payment terms, liability)
5. Creates a comparison report with side-by-side views of key changes

{/* TODO: Screenshot — Chat showing the AI's analysis: "Found 14 changes. 3 substantive:" followed by a highlighted comparison showing a payment term change ("Net 30" → "Net 60") with surrounding context. */}

{/* TODO: Screenshot — A generated diff report showing additions in green and removals in red, with change categories labeled. */}

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: document-comparator
description: Compares two document versions and highlights meaningful changes
---

## Document Comparison

When asked to compare documents:

1. **Read both versions** and extract full text
2. **Compute differences** at the paragraph or sentence level using Python's difflib
3. **Categorize each change**:
   - Formatting only (spacing, capitalization)
   - Minor wording (synonyms, clarifications)
   - Substantive (numbers, dates, terms, obligations, new/removed clauses)
4. **If the user mentions areas of interest** (e.g., "payment terms"), search both documents for those sections and present a focused comparison
5. **Create a report** with:
   - Summary of changes by category
   - Substantive changes with full surrounding context
   - Side-by-side view of key sections
6. **Save** as Markdown and HTML

Always flag changes affecting financial terms, legal obligations, or deadlines.
```
