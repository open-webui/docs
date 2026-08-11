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
| **Location** | Profile avatar > **Settings**, then the **Admin** section |
| **Access** | Administrators only |
| **Scope** | The entire instance and all users |

Admin Settings control everything about the Open WebUI instance itself: API connections, feature toggles, security policies, and default behaviors. Think of this as the **control panel for the building**. It determines what is installed and available for everyone.

**Examples of what lives here:**

- Connections to Ollama, OpenAI, and other providers
- Enabling or disabling web search, image generation, and code execution
- [Selected and pinned models](/features/workspace/models#selected-and-pinned-models-admin) and parameter presets
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
| Admin enables it | Settings > Admin > Interface | Makes autocomplete **available** on the instance |
| User enables it | Settings > Interface | Turns autocomplete **on for you personally** |

:::important Key Rule
If an admin **disables** a feature globally, users **cannot** enable it for themselves. The admin setting is always the ceiling.
:::

This pattern applies across web search, image generation, direct connections, code interpreter, and more. The admin controls **what is possible**. Users control **what they want**.

---

## Instance-Wide Starting Values

Feature toggles are a ceiling. One admin control works the other way round: **Default Interface Settings** decides what everyone's **Settings > Interface** page starts on, and each person can still change any of it for themselves. An option somebody has never touched keeps following your default, so a later change to it reaches them too.

Set it in **Settings > Admin > General**, under **UI > Default Interface Settings**, or with the `DEFAULT_INTERFACE_SETTINGS` environment variable.

[**Learn about Default Interface Settings →**](/features/administration/interface-defaults)

---

## Quick Reference

| | Admin Settings | User Settings |
|---|---|---|
| **Scope** | Entire instance (all users) | Individual user only |
| **Access** | Admins only | Everyone |
| **Controls** | API connections, feature toggles, security, defaults | Theme, default model, personal preferences |
| **Override behavior** | Cannot be overridden by users | Can customize within admin-allowed boundaries |

The one deliberate exception is [Default Interface Settings](/features/administration/interface-defaults), which an admin sets as a starting value rather than a limit; each user can change any of it for themselves.

---

## Common Scenarios

**"I enabled a feature in my settings but it is not working."**
Check whether the admin has enabled it globally first. Your personal toggle only takes effect if the admin has made the feature available at the instance level.

**"I am the admin. Where do I configure connections to OpenAI or Ollama?"**
Settings > Admin > Connections. These are instance-wide and shared by all users.

**"I want to use my own API key without sharing it with the server."**
If the admin has enabled **Direct Connections**, you can add personal API keys in User Settings > Connections. See [Direct Connections](/features/chat-conversations/direct-connections).

**"I set a system prompt but my admin's model settings override it."**
Model-level settings configured by admins in the Workspace take precedence over personal settings. See [Chat Parameters](/features/chat-conversations/chat-features/chat-params) for the full precedence hierarchy.

**"A switch in Settings > Interface has Default written next to it. What does that mean?"**
It means you have never changed that option, so it is following the instance-wide [Default Interface Settings](/features/administration/interface-defaults) your admin configured. Change it and it becomes yours; set it back to the current default and it goes back to following.

**"The interface is too small to read comfortably."**
Open **Settings > Interface** and click **Default** beside **UI Scale**, at the top of the **UI** section, to reveal a slider that runs from `1x` to `1.5x`. It enlarges the entire application, the sidebar, menus, dialogs and the Open Terminal file browser included, and it is stored with your account, so it follows you to another browser or device. Click the value to go back to **Default**. The default text size configured in your browser scales the interface the same way.

**"I am the admin. Can I make everyone start with the same interface options?"**
Yes, with [Default Interface Settings](/features/administration/interface-defaults). It sets where everyone starts; each person can still change any of it afterwards.

:::tip First-Time Admin?
Start with **Settings > Admin > Connections** to connect your model providers (Ollama, OpenAI, etc.), then explore **Settings > Admin > Interface** to enable or disable features for your users.
:::
