---
title: "Message your computer from Telegram"
sidebar_position: 4
---

# Message your computer from Telegram

You're out, and you want to know whether the build you kicked off actually passed, without opening a laptop or even a browser tab. So you text your computer like it's a person:

> did the build in ~/code/api finish? paste the last few lines if it failed

and it answers, because "it" is the full agent running in that workspace.

**You need:** the quickstart done, an [AI model connected](/ecosystem/computer/ai/), and five minutes for the bot. No tunnel or public URL; Telegram long-polls outward. (Discord, Slack, and Signal work the same way; WhatsApp needs a public webhook. See [messaging bots](/ecosystem/computer/automate/messaging-bots) for those.)

## The walkthrough

1. **Create the bot.** Message [@BotFather](https://t.me/BotFather) on Telegram, send `/newbot`, name it, and copy the token.

2. **Add it to Computer.** In **Settings → Admin → Bots**, create a bot, choose Telegram, paste the token, and hit **Verify**.

3. **Lock it to you.** Put your numeric Telegram user ID in **Allowed senders** (a bot like @userinfobot tells you your ID). This is the step people skip and shouldn't: an empty list answers anyone who finds the bot, and bot messages run with full tool approval.

4. **Pick its home.** Select the workspace and model the bot starts in, then start it.

5. **Talk to it.** Ask the build question. You'll see the reply stream in as the agent works: tool activity lines first, then the answer. Useful commands mid-conversation:

   - `/workspace api` to switch projects
   - `/new` for a fresh chat, `/stop` to cancel a runaway task
   - `/model` to switch models on the fly

6. **Pick it up later in the browser.** Every bot conversation is a real chat in that workspace; it's in the sidebar when you're back at a screen, with the full history.

## What makes this work

The bot isn't a notification shim; it's the same agent loop the web chat uses, with file, terminal, and tool access in the workspace you chose. That's also why the allowed-senders list is non-negotiable, and why a bot pinned to one scoped workspace beats one pointed at your home directory. Ask it read-only questions from the street; save the destructive stuff for when you can see a diff.

**Go deeper:** [Messaging bots](/ecosystem/computer/automate/messaging-bots) · [Notifications](/ecosystem/computer/automate/notifications) · [Security model](/ecosystem/computer/phone-and-remote/security)
