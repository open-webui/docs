---
title: "An agent that learns how you work"
sidebar_position: 10
---

# An agent that learns how you work

The third time you explain your release process to the AI, something should change. Not the model; the setup. The difference between a chatbot and a colleague is that a colleague doesn't need the speech twice: they keep the checklist, remember your preferences, and can dig up "what did we decide in June?" without you re-telling it. Computer has all three of those mechanisms; this walkthrough turns them on.

**You need:** a [model or coding agent connected](/ecosystem/computer/ai/). That's it.

## The walkthrough

1. **Turn the third explanation into a skill.** You've just walked the agent through a release again: bump the version, changelog from merged PRs, tag format, the smoke test, the announcement post. This time, end with:

   > Save this whole procedure as a skill called release-checklist. Include the tag format and the announcement template.

   The agent writes a `SKILL.md` into the workspace's `.cptr/skills/` folder. It's a plain file; open it, edit the wording, commit it with the repo if you like. Next release, type `$release-checklist` and the entire method loads. If you already keep skills for Claude Code or Codex, Computer found those too; it reads `.claude/skills`, `.codex/skills`, `.agents/skills`, and their global `~/` equivalents.

2. **Let the skills sharpen themselves.** Enable background skill review on the admin Skills page. Every so often (default: every 10 turns), Computer looks at how a skill actually got used and proposes an update: the edge case you corrected mid-release gets folded into the checklist instead of living only in your head. You review the proposed diff; nothing changes silently.

3. **Turn on memory for the person-shaped stuff.** Skills hold procedures; Memory (Settings) holds *you*: "prefers squash merges," "never deploy Fridays," "timezone is CET." It accumulates from your corrections and gets recalled into future chats automatically. Everything it holds is inspectable and deletable, which is what makes it a feature instead of a liability.

4. **Use the paper trail you've been generating.** Every chat is part of the workspace record, and the agent can search it. So ask the question you'd ask a colleague:

   > Search our past chats: what did we decide about the retry backoff in June, and why?

   It pulls the actual decision with its context. Cross-device, months later, still there, because chats are files in the workspace's `.cptr/` folder.

5. **Promote what deserves to travel.** A skill that proved itself in one repo moves to `~/.cptr/skills` and every workspace has it. Your global skill library plus your memory profile is, functionally, an agent trained on how you work, portable across every project and every model you plug in.

## What makes this work

Each mechanism closes a different loop: skills stop you re-teaching *procedures*, memory stops you re-stating *preferences*, and chat search stops you re-litigating *decisions*. None of it is magic; it's files and settings you can read, edit, and delete, which is exactly why it compounds instead of drifting. Two months in, the assistant you have is measurably better than the one you installed, and every part of that improvement is sitting in a folder you own.

**Go deeper:** [Skills and memory](/ecosystem/computer/ai/skills-and-memory) · [Search and chats](/ecosystem/computer/workspace/search-and-chats) · [Chat features](/ecosystem/computer/ai/chat-features)
