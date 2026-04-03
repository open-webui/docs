---
sidebar_position: 100
title: "Understanding Settings"
---

# Understanding Settings

**Open WebUI has two separate settings areas, not one.**

Open WebUI is multi-user from day one. Even if you are the only person using it, the architecture assumes there could be many users on the same instance. That means the platform needs two layers of configuration: one for the administrator who controls the instance, and one for each individual user who controls their own experience.

---

## The Two Settings Areas

### Admin Settings (Global)

| | |
| :--- | :--- |
| **Location** | Profile avatar > **Admin Settings**, or **Admin Panel > Settings** |
| **Access** | Administrators only |
| **Scope** | The entire instance and all users |

Admin Settings control everything about the Open WebUI instance itself: API connections, feature toggles, security policies, and default behaviors. Think of this as the **control panel for the building**. It determines what is installed and available for everyone.

**Examples of what lives here:**

- Connections to Ollama, OpenAI, and other providers
- Enabling or disabling web search, image generation, and code execution
- Default model selection and parameter presets
- RBAC policies, SSO configuration, and signup restrictions

---

### User Settings (Personal)

| | |
| :--- | :--- |
| **Location** | Profile avatar > **Settings** |
| **Access** | Every user (including admins) |
| **Scope** | Only the individual user |

User Settings control personal preferences: your default model, interface theme, language, notification preferences, and per-feature toggles for features the admin has already enabled. Think of this as the **thermostat in your own room**. You can adjust things for yourself, but only within what the building provides.

**Examples of what lives here:**

- Preferred default model and system prompt
- Interface theme and language
- Personal API keys (if [Direct Connections](/features/chat-conversations/direct-connections) are enabled)
- Per-feature toggles like autocomplete or rich text input

---

## How They Work Together

Many features follow a **two-layer pattern**:

1. The admin decides whether a feature is **available** (Admin Settings)
2. Each user decides whether they **personally want to use it** (User Settings)

**Example: Autocomplete (AI-powered typing suggestions)**

| Layer | Setting Location | Effect |
|-------|-----------------|--------|
| Admin enables it | Admin Settings > Interface | Makes autocomplete **available** on the instance |
| User enables it | Settings > Interface | Turns autocomplete **on for you personally** |

:::important Key Rule
If an admin **disables** a feature globally, users **cannot** enable it for themselves. The admin setting is always the ceiling.
:::

This pattern applies across web search, image generation, direct connections, code interpreter, and more. The admin controls **what is possible**. Users control **what they want**.

---

## Quick Reference

| | Admin Settings | User Settings |
|---|---|---|
| **Scope** | Entire instance (all users) | Individual user only |
| **Access** | Admins only | Everyone |
| **Controls** | API connections, feature toggles, security, defaults | Theme, default model, personal preferences |
| **Override behavior** | Cannot be overridden by users | Can customize within admin-allowed boundaries |

---

## Common Scenarios

**"I enabled a feature in my settings but it is not working."**
Check whether the admin has enabled it globally first. Your personal toggle only takes effect if the admin has made the feature available at the instance level.

**"I am the admin. Where do I configure connections to OpenAI or Ollama?"**
Admin Settings > Connections. These are instance-wide and shared by all users.

**"I want to use my own API key without sharing it with the server."**
If the admin has enabled **Direct Connections**, you can add personal API keys in User Settings > Connections. See [Direct Connections](/features/chat-conversations/direct-connections).

**"I set a system prompt but my admin's model settings override it."**
Model-level settings configured by admins in the Workspace take precedence over personal settings. See [Chat Parameters](/features/chat-conversations/chat-features/chat-params) for the full precedence hierarchy.

:::tip First-Time Admin?
Start with **Admin Settings > Connections** to connect your model providers (Ollama, OpenAI, etc.), then explore **Admin Settings > Interface** to enable or disable features for your users.
:::
