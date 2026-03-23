---
sidebar_position: 3
title: "Research Assistant"
---

# 🔍 Research and Summarize Any Topic

Give the AI a question, and it gathers information from the web, organizes it, and writes a structured briefing.

> **You:** $Research Assistant <br/>
> What's the current state of solid-state batteries? Who are the key players and what's the timeline for commercialization?

## What the AI does

1. Uses `curl` to fetch content from relevant tech news sites, company pages, and articles
2. Parses HTML to extract the useful text
3. Cross-references facts across multiple sources
4. Creates a structured Markdown briefing with sections, source citations, and comparison tables
5. Saves as both Markdown and PDF

{/* TODO: Screenshot — Chat showing the AI gathering information from 6+ sources and producing a structured briefing document. The file browser shows research_briefing.md being previewed with headers, bullet points, and a comparison table. */}

{/* TODO: Screenshot — The briefing document showing an executive summary, a comparison table of key companies and their technology approaches, and a source list with URLs. */}

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: research-assistant
description: Researches topics from the web and creates structured briefing documents
---

## Research Assistant

When asked to research a topic:

1. **Plan first**: Identify 3-5 angles to investigate
2. **Gather information**: Use curl to fetch content from authoritative sources. Parse HTML with beautifulsoup4 to extract text
3. **For each source, note**:
   - Key claims and data points
   - Publication date
   - Source authority/reliability
4. **Organize into a document**:
   - Executive summary (3 sentences)
   - Findings by theme
   - Comparison tables where helpful
   - Source list with URLs
5. **Flag conflicts**: Note where sources disagree
6. **Save** as Markdown and optionally PDF

Clearly distinguish facts from sources vs. your own analysis.
```
