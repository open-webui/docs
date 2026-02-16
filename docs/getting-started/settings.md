---
sidebar_position: 5
title: "Understanding Settings"
---

# Understanding Settings

When you first start using Open WebUI, you'll notice there are **two separate settings areas** — not one. This trips up almost everyone at first, so let's clear it up.

## Why Two Settings?

Open WebUI is designed to be **multi-user from day one**. Even if you're the only person using it right now, the architecture assumes there could be many users on the same instance — a team, a classroom, an entire organization.

That creates a fundamental problem: **an admin needs to control what's available on the instance** (which APIs are connected, which features are turned on, what the security policies are), while **each user needs to control their own experience** (which model they prefer, what their interface looks like, their personal defaults). A single settings page can't serve both purposes — what an admin configures for everyone is fundamentally different from what you configure for yourself.

So Open WebUI splits them:

## The Two Settings Areas

### ⚙️ Admin Settings (Global)

- **Where**: Click your profile avatar → **Admin Settings**, or **Admin Panel > Settings**
- **Who can access**: Only **Administrators**
- **What it controls**: Everything about the Open WebUI **instance itself** — the features available to all users, API connections, security policies, and default behaviors

Think of this as the **control panel for the building**. It determines what's installed and available for everyone.

### 🛠️ User Settings (Personal)

- **Where**: Click your profile avatar → **Settings**
- **Who can access**: **Every user** (including admins)
- **What it controls**: Your **personal preferences** — your default model, interface theme, language, notification preferences, and personal overrides for features the admin has enabled

Think of this as the **thermostat in your own room**. You can adjust things for yourself, but only within what the building provides.

## How They Work Together

Many features in Open WebUI follow a **two-layer pattern**:

1. **The admin decides if a feature is available** (Admin Settings)
2. **Each user decides if they personally want to use it** (User Settings)

For example, consider **Autocomplete** (AI-powered typing suggestions):

| Layer | Setting Location | Effect |
|-------|-----------------|--------|
| Admin enables it | Admin Settings > Interface | Makes autocomplete **available** on the instance |
| User enables it | Settings > Interface | Turns autocomplete **on for you personally** |

:::important Key Rule
If an admin **disables** a feature globally, users **cannot** enable it for themselves. The admin setting is always the ceiling.
:::

This pattern repeats across many features — web search, image generation, direct connections, code interpreter, and more. The admin controls the **what's possible**, and users control the **what I want**.

## Quick Reference

| | Admin Settings | User Settings |
|---|---|---|
| **Icon** | ⚙️ Admin Settings | 🛠️ Settings |
| **Scope** | Entire instance (all users) | Just you |
| **Access** | Admins only | Everyone |
| **Controls** | API connections, feature toggles, security, defaults | Theme, default model, personal preferences |
| **Overrides** | Cannot be overridden by users | Can customize within admin-allowed features |

## Common Scenarios

**"I enabled a feature in my settings but it's not working."**
→ Check if the admin has enabled it globally first. Your personal setting only works if the admin has made the feature available.

**"I'm the admin. Where do I configure connections to OpenAI/Ollama?"**
→ Admin Settings > Connections. These are instance-wide and shared by all users.

**"I want to use my own API key without sharing it with the server."**
→ If the admin has enabled **Direct Connections**, you can add personal API keys in your User Settings > Connections. See [Direct Connections](/features/chat-conversations/direct-connections).

**"I set a system prompt but my admin's model settings override it."**
→ Model-level settings (configured by admins in the Workspace) take precedence over your personal settings. See [Chat Parameters](/features/chat-conversations/chat-features/chat-params) for the full hierarchy.

:::tip First-Time Admin?
If you just installed Open WebUI, start with **Admin Settings > Connections** to connect your model providers (Ollama, OpenAI, etc.), then explore **Admin Settings > Interface** to enable or disable features for your users.
:::
