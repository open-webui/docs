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

- System prompt, and the default model you save with **Set as default** in the model selector
- Interface theme and language
- Per-feature toggles like autocomplete or rich text input

**Theme** and **Language** under **Settings > General** are saved in the browser, not in your account, so they do not follow you to another browser or device. A browser that has not opened Open WebUI before starts on the **System** theme and on the language set by [`DEFAULT_LOCALE`](/reference/env-configuration#default_locale), or the browser's own language when the admin has not set one.

---

## How They Work Together

Many features follow a **two-layer pattern**:

1. The admin decides whether a feature is **available** (Admin Settings)
2. Each user decides whether they **personally want to use it** (User Settings)

**Example: Autocomplete (AI-powered typing suggestions)**

| Layer | Setting Location | Effect |
|-------|-----------------|--------|
| Admin enables it | Settings > Interface (admin section) | Makes autocomplete **available** on the instance |
| User enables it | Settings > Interface | Turns autocomplete **on for you personally** |

:::important Key Rule
If an admin **disables** a feature globally, users **cannot** enable it for themselves. The admin setting is always the ceiling.
:::

This pattern applies across web search, image generation, code interpreter and more. The admin controls **what is possible**. Users control **what they want**.

---

## Instance-Wide Starting Values

Feature toggles are a ceiling. One admin control works the other way round: **Default Interface Settings** decides what everyone's **Settings > Interface** page starts on, and each person can still change any of it for themselves. An option somebody has never touched keeps following your default, so a later change to it reaches them too.

Set it in **Settings > General** (admin section), under **UI > Default Interface Settings**, or with the `DEFAULT_INTERFACE_SETTINGS` environment variable.

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
Settings > Connections (admin section). These are instance-wide and shared by all users.

**"I want to use my own API key without sharing it with the server."**
Connections added in the Tether app keep the keys on your computer, see [Bring Your Own Models and Tools](/ecosystem/tether#bring-your-own-models-and-tools). An admin can add shared connections under **Settings > Connections** (admin section).

**"I set a system prompt but my admin's model settings override it."**
A system prompt an admin has configured on the model in the Workspace takes precedence over your personal one. Advanced parameters go the other way: one you set for your account, or for a single chat under **Model controls > Controls**, is the value sent. See [Chat Parameters](/features/chat-conversations/chat-features/chat-params) for the full precedence hierarchy.

**"A switch in Settings > Interface has Default written next to it. What does that mean?"**
It means you have never changed that option, so it is following the instance-wide [Default Interface Settings](/features/administration/interface-defaults) your admin configured. Change it and it becomes yours; set it back to the current default and it goes back to following.

**"The interface is too small to read comfortably."**
Raise **UI Scale** at the top of the **UI** section in **Settings > Interface**. It enlarges the whole application and is stored with your account.

Click **Default** next to **UI Scale** to show the slider. It runs from `1x` to `1.5x`. The minus and plus buttons beside it, which screen readers announce as **Decrease UI Scale** and **Increase UI Scale**, move it by `0.1`. They are buttons, not keyboard shortcuts. Click the value to go back to the default.

**"Can I change the font?"**
**Font Family**, just under UI Scale in **Settings > Interface**. Click **Default** to get a text box, then type the name of a font, such as `Aptos`.

The font has to already be installed on the computer you are sitting at. Nothing is downloaded, so a name that is not installed leaves you with the standard font and no error. Clearing the box puts everything back. Preformatted blocks are left on the standard font either way.

**"What do the Manage buttons next to Floating Quick Actions and Image Compression do?"**
Each one appears only while its switch is on. Screen readers announce them as **Open Modal To Manage Floating Quick Actions** and **Open Modal To Manage Image Compression**.

- **Floating Quick Actions**, in the **Chat** section, controls the toolbar that appears when you select text in a finished response. Its **Manage** dialog, **Quick Actions**, lists the toolbar's buttons. Click **Default** to switch to **Custom**, which starts with the built-in **Ask** and **Explain** buttons. Add buttons with the plus icon, and give each a **Button Label**, a **Button ID** and a **Button Prompt**, then click **Save**. Clicking **Custom** again goes back to the built-in buttons, and an empty list also uses them. Clicking a button puts its prompt in the chat input without sending it. In the prompt, `{{CONTENT}}` becomes the selected text, `{{SELECTED_CONTENT}}` becomes the selected text as a `>` quote, and `{{INPUT_CONTENT}}` first opens an **Ask a question** box and inserts what you type there. Give each button its own **Button ID**: when two share one, both run the first button's prompt.
- **Image Compression**, in the **File** section, shrinks images you attach before they are sent or stored. Its **Manage** dialog sets **Image Max Compression Size** as a **Width** and a **Height** in pixels. Images keep their aspect ratio, and an image already inside both limits is left as it is. It applies to images attached in chats and in notes, and in channels while **Compress Images in Channels** is on.

**"I typed a new password in Settings > Account and clicked Save, but my old password still works."**
**Save** at the bottom of **Settings > Account** stores your profile and user variables only. It never sends the password fields. To change the password, open **Change Password** in the **Password** section with **Show**, fill in **Current Password**, **New Password** and **Confirm Password**, and click **Update password** under them.

On success you see `Password updated. Please sign in again.` and Open WebUI signs you out. Every other session signed in to your account, on any device, stops working at the same time, so sign in again with the new password wherever you use Open WebUI. API keys keep working.

| Message | Cause |
| :--- | :--- |
| `The passwords you entered don't quite match. Please double-check and try again.` | **New Password** and **Confirm Password** differ. Nothing was sent. |
| `The password provided is incorrect. Please check for typos and try again.` | **Current Password** does not match the password stored for your account. |
| `The password does not meet the required validation criteria.`, or your admin's own hint | The new password fails the rule set with [`ENABLE_PASSWORD_VALIDATION`](/reference/env-configuration#enable_password_validation). |
| `The requested action has been restricted as a security measure.` | The instance uses trusted-header sign-in ([`WEBUI_AUTH_TRUSTED_EMAIL_HEADER`](/reference/env-configuration#webui_auth_trusted_email_header)), so passwords are managed by the proxy in front of Open WebUI. |

An account that Open WebUI created on its first OAuth or LDAP sign-in gets a random password that nobody is shown, so **Current Password** never matches and you get the incorrect-password message. An admin can give such an account a password with **New Password** in its **Edit User** dialog under **Admin Panel > Users**. That password then works as **Current Password** here. The whole **Password** section is hidden when the admin turns off [`ENABLE_LOGIN_FORM`](/reference/env-configuration#enable_login_form) or [`ENABLE_PASSWORD_CHANGE_FORM`](/reference/env-configuration#enable_password_change_form).

**"I am the admin. Can I make everyone start with the same interface options?"**
Yes, with [Default Interface Settings](/features/administration/interface-defaults). It sets where everyone starts; each person can still change any of it afterwards.

:::tip First-Time Admin?
Start with **Settings > Connections** (admin section) to connect your model providers (Ollama, OpenAI, etc.), then explore **Settings > Interface** (admin section) to enable or disable features for your users.
:::
