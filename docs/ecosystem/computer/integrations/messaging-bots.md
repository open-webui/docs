---
title: Messaging bots
sidebar_position: 7
---

# Messaging bots

A messaging bot can be convenient when your phone is the only screen you have and the answer is in a trusted Computer workspace. It is not a general customer-support bot: an inbound message can start host-capable agent work.

## The first useful proof

If your client repositories live on a workstation and you already check Slack while commuting, the first useful bot question is not "fix whatever is wrong." It is: "Which branch is checked out in the selected client workspace?" You get a real answer from the machine without opening a laptop, while keeping the first request read-only.

That is the right first test for every supported platform: Telegram, Discord, Slack, WhatsApp, or Signal. Do not put the bot in a shared channel to make it more convenient.

## Use this when

You want to use a private Telegram, Discord, Slack, WhatsApp, or Signal account/channel to ask a narrow question about work on your own machine.

## Before you start

- Enter at least one exact platform user ID in **Allowed senders** before starting the bot. An empty list accepts every sender who can reach the bot.
- Use only an account or channel you exclusively control. Sender allowlisting is not channel allowlisting, so do not install the bot in groups or shared channels.
- Keep the bot out of groups, shared channels, and public communities.
- Select a deliberate workspace and model; use a dedicated Computer account or instance when a bot must see only one project.

## Do it

1. In **Settings → Admin → Bots**, create the adapter configuration and verify its token.
2. Select the workspace/model and start the bot.
3. From the private account/channel, send a read-only test such as “Which branch is checked out?” Use `/new` for a fresh chat.

Use `/workspaces` to list the workspaces available to the bot, then `/workspace <name>` to switch the bot and start a new conversation there. `/stop` cancels active work and `/retry` repeats the last user request. These commands make it possible to recover from a small-screen mistake without granting a second bot more access.

## Verify it worked

The bot reports running, and the test creates a matching Computer chat in the intended workspace. Confirm the response identifies the expected branch or file without making a change.

## If it did not

Stop the bot; recheck its running status, token verification, sender IDs, and selected workspace/model. If a command says the workspace is missing, use `/workspaces` rather than guessing its name. WhatsApp also needs a publicly reachable inbound webhook configured with Meta. If you cannot guarantee a private sender boundary or need to confine it to one project, do not enable the bot on that instance.

## Trust boundary

Bots use full approval/high trust. An inbound message can invoke agent tools, and `/workspace` can select workspaces owned by that Computer user. Treat a bot token and its private platform account as access to the host, not as a harmless notification channel.
