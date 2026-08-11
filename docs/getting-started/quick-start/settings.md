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
| Admin enables it | Admin Settings > Interface | Makes autocomplete **available** on the instance |
| User enables it | Settings > Interface | Turns autocomplete **on for you personally** |

:::important Key Rule
If an admin **disables** a feature globally, users **cannot** enable it for themselves. The admin setting is always the ceiling.
:::

This pattern applies across web search, image generation, direct connections, code interpreter, and more. The admin controls **what is possible**. Users control **what they want**.

---

## Default Interface Settings (Admin)

Feature toggles are a ceiling. **Default Interface Settings** are a starting point: an administrator decides the values every account begins with for the options in **Settings > Interface**, and each person can still change any of them for themselves.

| | |
| :--- | :--- |
| **Location** | **Settings > Admin > System > General**, under **UI > Default Interface Settings** |
| **Access** | Administrators only |
| **Scope** | Every account, until the individual changes that setting |

Press **Configure** to open the same list of controls a user sees in **Settings > Interface**, set the ones you care about, then press **Save** at the bottom of the admin page. A line above the list counts how many settings you have configured. Every control you touch joins that set, including one you move and then move back, so use **Clear** to empty the whole set and return to the built-in defaults.

**How a value is decided for a user:**

1. If the user has set that option themselves, their value is used.
2. Otherwise the instance default is used.
3. If there is no instance default, the built-in default is used.

An on/off option a user has never touched shows a small **Default** label beside its switch in **Settings > Interface**. The options that are not switches carry no such label, but they inherit in exactly the same way. Either way, change the instance default later and everyone who has not overridden that option moves with it.

:::info Setting an option back to the default releases it
Open WebUI only stores the options a user actually differs on. Moving a control back to whatever the instance default currently is drops it from the user's own settings, so it goes back to being inherited and follows future changes to the default again.
:::

**What this does not do:**

- It does not restrict anyone. Everyone keeps full control of every option in **Settings > Interface**; to actually hold people to your values, take **Interface Settings Access** away from them in [permissions](/features/authentication-access/rbac/permissions).
- It does not rewrite accounts that already exist. Nobody's stored choices are touched; people who never set a given option simply start following your default instead of the built-in one.
- It does not cover **Theme** or **Language**. Both live in the browser rather than in the account, so they are not part of this. Use [`DEFAULT_LOCALE`](/reference/env-configuration#default_locale) for the starting language.

If you configure your instance through environment variables, [`DEFAULT_INTERFACE_SETTINGS`](/reference/env-configuration#default_interface_settings) sets the same thing as a JSON object, for example `{"chatBubble": false, "widescreenMode": true}`.

---

## Quick Reference

| | Admin Settings | User Settings |
|---|---|---|
| **Scope** | Entire instance (all users) | Individual user only |
| **Access** | Admins only | Everyone |
| **Controls** | API connections, feature toggles, security, defaults | Theme, default model, personal preferences |
| **Override behavior** | Cannot be overridden by users | Can customize within admin-allowed boundaries |

The one deliberate exception is [Default Interface Settings](#default-interface-settings-admin), which an admin sets as a starting value rather than a limit; each user can change any of it for themselves.

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

**"A switch in Settings > Interface has Default written next to it. What does that mean?"**
It means you have never changed that option, so it is following the instance-wide [Default Interface Settings](#default-interface-settings-admin) your admin configured. Change it and it becomes yours; set it back to the current default and it goes back to following.

**"I am the admin. Can I make everyone start with the same interface options?"**
Yes. **Settings > Admin > System > General > UI > Default Interface Settings**, or the [`DEFAULT_INTERFACE_SETTINGS`](/reference/env-configuration#default_interface_settings) environment variable. It sets where everyone starts; each person can still change any of it afterwards.

:::tip First-Time Admin?
Start with **Admin Settings > Connections** to connect your model providers (Ollama, OpenAI, etc.), then explore **Admin Settings > Interface** to enable or disable features for your users.
:::
