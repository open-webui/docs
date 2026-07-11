---
title: "An assistant that texts you first"
sidebar_position: 8
---

# An assistant that texts you first

7:45 on a Tuesday. Your phone buzzes with a Telegram message from your own computer:

> Morning. Rain until noon. Three things from the news feed match your watchlist; the interesting one is the SDK deprecation notice, summary in the workspace. Your side-project tests passed overnight. Nothing needs you before the 10:00 call.

You didn't ask. That's the point. Chatbots wait; assistants show up. This walkthrough turns Computer into the kind that shows up.

**You need:** a [model connected](/ecosystem/computer/ai/connect-a-model), a [Telegram bot](/ecosystem/computer/use-cases/message-your-computer) set up, and the host [awake in the mornings](/ecosystem/computer/phone-and-remote/keep-it-running). Web search works out of the box (DuckDuckGo needs no key).

## The walkthrough

1. **Give it a headquarters.** Make a folder like `assistant/`, open it as a workspace, and give the assistant standing orders in a `.cptr/system.md` file at its root. This file becomes the system prompt for every chat in that workspace:

   > You are my personal assistant. Be brief and concrete. I care about: the Rust ecosystem, our open-source repo, Berlin weather. Never invent facts; say "nothing found" when there's nothing. End every briefing with "nothing needs you" or the one thing that does.

2. **Turn on memory.** Enable Memory in Settings. Now corrections stick: tell it once that you don't care about crypto news, and future briefings know. You can review and delete anything it has remembered.

3. **Have it schedule its own briefing.** Tell the assistant, in its workspace chat:

   > Every day at 7:40, compile my morning brief: today's Berlin weather, top items from the news matching my interests (search the web), and the result of last night's test run in ~/code/sideproject. Write the full brief to briefs/today.md and reply with a 5-line summary. Set that up as a scheduled task.

   It creates the task itself; approve the tool call, then glance at the **Scheduled** page to see it sitting there with a next-run time, and hit **Run now** once to rehearse.

4. **Make it reach your phone.** In **Settings → Notifications**, add a **bot** target pointing at your Telegram bot, subscribed to **chat finished**. When the scheduled run completes, the summary lands in Telegram. That's the buzz at 7:45.

5. **Talk back.** It's a real chat, so replying works: "expand on the SDK thing" continues the same conversation with the same context, from the same phone.

6. **Level up: event-driven pings.** Scheduled isn't the only trigger. Every scheduled task can expose a secret webhook URL, and the caller's JSON is available to the prompt via `{{webhook_payload}}`. Point your uptime monitor or CI at one:

   > The payload describes a failure. Investigate: check the service logs in this workspace, summarize the probable cause in 3 lines.

   Now the assistant doesn't just brief you at 7:40; it investigates at 3am and texts you the diagnosis, not just the alarm.

## What makes this work

Proactive is just "scheduled plus a delivery path," and both halves are visible: every briefing is a real chat with the full tool log, so when it says the tests passed, you can open the run and see the command. The personality file and memory are what make it feel like *yours* rather than a cron job; the honesty rules you write into `.cptr/system.md` are what keep a daily unattended summary trustworthy. Start with a brief you can verify, and only widen the mandate as it earns it.

**Go deeper:** [Scheduled tasks](/ecosystem/computer/automate/scheduled-tasks) · [Notifications](/ecosystem/computer/automate/notifications) · [Skills and memory](/ecosystem/computer/ai/skills-and-memory) · [Messaging bots](/ecosystem/computer/automate/messaging-bots)
