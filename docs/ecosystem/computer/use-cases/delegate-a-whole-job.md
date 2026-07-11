---
title: "Delegate a whole job, come back to a deliverable"
sidebar_position: 9
---

# Delegate a whole job, come back to a deliverable

Your team needs to pick a city for the offsite: 20 people, three candidate cities, flights, venues, visa quirks, a budget ceiling. That's an afternoon of tabs and a spreadsheet. Or it's one well-written brief handed to an agent at 9:00, and a folder with a report, a comparison table, and sources waiting when you're back from lunch.

The skill here isn't prompting; it's *delegation*: a clear goal, a defined deliverable, and a check-in loop you control.

**You need:** a [model connected](/ecosystem/computer/ai/connect-a-model). Web search works with zero config (DuckDuckGo); a search provider key improves results, and enabling the [browser](/ecosystem/computer/ai/web-search-and-browsing) lets it read pages that search snippets can't cover.

## The walkthrough

1. **Give the job a home.** New folder, `offsite-research/`, opened as a workspace. Deliverables will be files here, not scrollback in a chat.

2. **Approve the plan, not the keystrokes.** Turn on [plan mode](/ecosystem/computer/ai/approvals-and-plan-mode) and write the brief like you'd brief a person:

   > Compare Lisbon, Prague, and Valencia for a 20-person, 3-night team offsite in October, budget €40k. I need: report.md with a recommendation and reasoning; costs.csv comparing flights from Berlin/London/NYC, hotels, and a venue estimate per city; sources.md with links for every number. Flag anything visa-related for US and Indian passport holders.

   It comes back with its plan: what it will search, how it splits the work, what goes in each file. Adjust ("use midweek flight prices"), then approve.

3. **Let it fan out.** For a job like this the agent can spin up [sub-agents](/ecosystem/computer/ai/subagents): one per city researching in parallel, results folded back into the main task. You'll see the delegation happen in the tool log.

4. **Walk away; check in on your terms.** The task runs server-side. Glance at your phone once: the chat shows what it's doing right now, and if it hit something genuinely ambiguous, your reply steers it without restarting anything.

5. **Come back to files, and audit the ones that matter.** `report.md`, `costs.csv`, `sources.md`, sitting in the file browser like work products, because they are. The chat is the full replay: every search, every page it read, every number's origin. Spot-check the way you would an intern's work: pick the two numbers the decision hinges on and follow them to their sources.

6. **Iterate like a manager, not a prompter.** "Valencia's venue estimate looks low; re-check it against actual quotes, and add a rain-probability row" is a follow-up message, not a new project. Same workspace, same context, updated files.

## What makes this work

The deliverable-first brief changes everything: the agent optimizes for finishing files, not for holding a conversation, and you get artifacts you can diff, share, and re-generate. Plan mode in front means you spend your judgment where it's cheap (before the work), and the replayable tool log means trust is verified, not assumed. Same recipe for market scans, competitor teardowns, literature reviews, and "turn this folder of CSVs into a briefing."

**Go deeper:** [Web search and browsing](/ecosystem/computer/ai/web-search-and-browsing) · [Sub-agents](/ecosystem/computer/ai/subagents) · [Approvals and plan mode](/ecosystem/computer/ai/approvals-and-plan-mode)
