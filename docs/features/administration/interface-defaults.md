---
sidebar_position: 12
title: "Default Interface Settings"
---

## Overview

Every account has its own **Settings > Interface** page, and out of the box everyone starts on the values Open WebUI ships with. **Default Interface Settings** let an administrator choose those starting values for the whole instance, so a new account opens on the interface you want rather than the stock one.

They are starting values. Anyone can still change any of them for themselves.

You can configure them in two ways:

1. **Admin Panel** (recommended for quick edits and experimentation)
2. **Environment variable (`DEFAULT_INTERFACE_SETTINGS`)** (recommended for automated / GitOps-style deployments)

---

:::tip Renaming what the interface says
These settings decide the starting values of the options users see. To change the wording of the interface itself, a label or a button, use **UI Translations** on the same admin page. See [Translations](/features/administration/translations#interface-text).
:::

## How a value is decided

1. If the person has set that option themselves, their value is used.
2. Otherwise your instance default is used.
3. If you have set no default for it, the built-in value is used.

An on/off option someone has never touched shows a small **Default** label beside its switch in **Settings > Interface**. The options that are not switches carry no label, but they inherit the same way.

Untouched options keep tracking your default, so changing a default later moves everyone who has not overridden that option.

:::info Matching the default releases the option
Moving a control to whatever your default currently is releases the override: the **Default** label comes back and the option follows your defaults again. That is how someone undoes a choice they made earlier.

Releasing happens when that person saves their settings, and it compares against your defaults as they stand at that moment. So setting a default to the value someone had already chosen for themselves does not release their override on its own: their choice stays pinned, and your next change still will not reach them. It is released the next time they save anything on the **Interface** page, at which point every option of theirs that matches your current defaults is released together, not only the one they just changed.
:::

---

## Configuring the defaults

### Option 1: Using the Admin Panel

1. Log in to your Open WebUI instance as an administrator.
2. Navigate to **Settings** → **Admin** → **General**.
3. Locate the **UI** section and click **Configure** next to **Default Interface Settings**.
4. Set the options you want. The list is the same one users see in **Settings > Interface**.
5. Click **Save** at the bottom of the page.

A line above the list counts how many settings you have configured. Every control you touch joins that set, including one you move and then move straight back, so use **Clear** to empty the set and put everything back on the built-in values.

---

### Option 2: Using environment variables (`DEFAULT_INTERFACE_SETTINGS`)

For automated deployments, configure the defaults using the `DEFAULT_INTERFACE_SETTINGS` environment variable. The value must be a **JSON string** representing a **JSON object**, keyed by the setting names in the [table below](#setting-keys).

**Environment variable:**

- `DEFAULT_INTERFACE_SETTINGS`
  - **Type:** `string` (containing a JSON object)
  - **Default:** `{}`
  - **Description:** The starting values every account uses for the options in **Settings > Interface**

#### Example (Docker Compose)

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - 'DEFAULT_INTERFACE_SETTINGS={"chatBubble":false,"widescreenMode":true,"chatHoverPreview":false,"title":{"auto":false}}'
```

If the value is not valid JSON, or parses to something that is not an object, it is ignored and no defaults are applied.

:::tip Reach beyond the Interface page
The defaults apply to a person's whole settings record, which is wider than the **Interface** page. The environment variable therefore accepts keys written by the other personal settings pages as well, such as `system` (a personal system prompt), `params` (personal advanced parameters), `notificationSound` and `keyboardShortcuts`, even though the Admin Panel editor only offers the interface controls. They inherit and release just like the keys in the table.
:::

---

## Setting keys

Every option on the **Settings > Interface** page, in the order it appears there, with the name to use in `DEFAULT_INTERFACE_SETTINGS` and the value Open WebUI uses when you set no default.

### UI

| Key | Label in Settings > Interface | Built-in default |
| --- | --- | --- |
| `textScale` | UI Scale | `null` (shown as **Default**), otherwise a number from `1` to `1.5` |
| `fontFamily` | Font Family | `null` (shown as **Default**), otherwise the name of a font |
| `highContrastMode` | Accessibility Mode | `false` |
| `showChatTitleInTab` | Display Chat Title in Tab | `true` |
| `userLocation` | Allow User Location | `false` |
| `hapticFeedback` | Haptic Feedback (Android) | `false` |
| `copyFormatted` | Copy Formatted Text | `false` |
| `showUpdateToast` | Toast Notifications for New Updates | `true` |
| `showChangelog` | Show "What's New" Modal on Login | `true` |

`textScale` is the **UI Scale** slider and `highContrastMode` is **Accessibility Mode**, which was called **High Contrast Mode** before v0.11.2. The key kept its old name, so existing defaults keep working untouched.

`fontFamily` names a font that has to be installed on each person's own machine. Nothing is downloaded, so a default naming a font your users do not have simply falls back to the standard one, and everybody sees the usual interface. Set it only where you know what is installed, such as a managed fleet with a corporate typeface.

### Chat

| Key | Label in Settings > Interface | Built-in default |
| --- | --- | --- |
| `enableMessageQueue` | Enable Message Queue | `true` |
| `chatDirection` | Chat Direction | `"auto"`, or `"LTR"` / `"RTL"` |
| `landingPageMode` | Landing Page Mode | `""` (shown as **Default**), or `"chat"` |
| `backgroundImageUrl` | Chat Background Image | `null` |
| `chatBubble` | Chat Bubble UI | `true` |
| `showUsername` | Display the Username Instead of You in the Chat | `false` |
| `widescreenMode` | Widescreen Mode | `false` |
| `temporaryChatByDefault` | Temporary Chat by Default | `false` |
| `chatFadeStreamingText` | Fade Effect for Streaming Text | `true` |
| `renderMarkdownInUserMessages` | Render Markdown in User Messages | `true` |
| `renderMarkdownInAssistantMessages` | Render Markdown in Assistant Messages | `true` |
| `renderMarkdownInPreviews` | Render Markdown in Previews | `true` |
| `title.auto` | Title Auto-Generation | `true` |
| `autoFollowUps` | Follow-Up Auto-Generation | `true` |
| `autoTags` | Chat Tags Auto-Generation | `true` |
| `responseAutoCopy` | Auto-Copy Response to Clipboard | `false` |
| `scrollOnResponseGeneration` | Response Auto-Scroll | `true` |
| `scrollOnBranchChange` | Scroll On Branch Change | `true` |
| `insertSuggestionPrompt` | Insert Suggestion Prompt to Input | `false` |
| `keepFollowUpPrompts` | Keep Follow-Up Prompts in Chat | `false` |
| `insertFollowUpPrompt` | Insert Follow-Up Prompt to Input | `false` |
| `regenerateMenu` | Regenerate Menu | `true` |
| `collapseCodeBlocks` | Always Collapse Code Blocks | `false` |
| `expandDetails` | Always Expand Details | `false` |
| `chatHoverPreview` | Chat Hover Previews | `true` |
| `displayMultiModelResponsesInTabs` | Display Multi-model Responses in Tabs | `false` |
| `showFilesOnTerminalSelect` | Show Files on Terminal Select | `true` |
| `terminalFileDisplay` | Terminal File Display | `sidebar` |
| `stylizedPdfExport` | Stylized PDF Export | `true` |
| `showFloatingActionButtons` | Floating Quick Actions | `true` |
| `floatingActionButtons` | Floating Quick Actions > **Manage** | `null` |
| `webSearch` | Web Search in Chat | `null` (shown as **Default**), or `"always"` |

`title.auto` is nested, so in the environment variable it is written `{"title": {"auto": false}}`.

### Input

| Key | Label in Settings > Interface | Built-in default |
| --- | --- | --- |
| `ctrlEnterToSend` | Enter Key Behavior | `false` (**Enter to Send**); `true` is **Ctrl+Enter to Send** |
| `richTextInput` | Rich Text Input for Chat | `true` |
| `promptAutocomplete` | Prompt Autocompletion | `false` |
| `showFormattingToolbar` | Show Formatting Toolbar | `false` |
| `insertPromptAsRichText` | Insert Prompt as Rich Text | `false` |
| `largeTextAsFile` | Paste Large Text as File | `false` |

### Artifacts

| Key | Label in Settings > Interface | Built-in default |
| --- | --- | --- |
| `detectArtifacts` | Detect Artifacts Automatically | `true` |
| `iframeSandboxAllowScripts` | iframe Sandbox Allow Scripts | `true` |
| `iframeSandboxAllowSameOrigin` | iframe Sandbox Allow Same Origin | `false` |
| `terminalPreviewAllowSameOrigin` | Terminal Preview Allow Same Origin | `false` |
| `iframeSandboxAllowForms` | iframe Sandbox Allow Forms | `true` |
| `iframeSandboxAllowDownloads` | iframe Sandbox Allow Downloads | `true` |

### Voice

| Key | Label in Settings > Interface | Built-in default |
| --- | --- | --- |
| `voiceInterruption` | Allow Voice Interruption in Call | `false` |
| `showEmojiInCall` | Display Emoji in Call | `false` |

### File

| Key | Label in Settings > Interface | Built-in default |
| --- | --- | --- |
| `defaultUploadContext` | Default Upload Mode | `"focused"` (**Using Focused Retrieval**); `"full"` is **Using Entire Document** |
| `imageCompression` | Image Compression | `false` |
| `imageCompressionSize` | Image Compression > **Manage** | `{"width": "", "height": ""}` |
| `imageCompressionInChannels` | Compress Images in Channels | `true` |

:::note Rows that are not always on screen
A few controls only appear under a condition: **Toast Notifications for New Updates** and **Show "What's New" Modal on Login** are shown to admins only, **Display the Username Instead of You in the Chat** appears when **Chat Bubble UI** is off, **Temporary Chat by Default** needs the temporary-chat permission, **Prompt Autocompletion** needs autocomplete generation enabled on the instance, **Show Formatting Toolbar** and **Insert Prompt as Rich Text** appear when **Rich Text Input for Chat** is on, and **Compress Images in Channels** appears when **Image Compression** is on. Setting a default for any of them still works; it simply takes effect for the people who can see the control.
:::

---

## What this does not do

- **It does not restrict anyone.** Everyone keeps full control of every option in **Settings > Interface**. To actually hold people to your values, take **Interface Settings Access** away from them, see [Locking the defaults](#locking-the-defaults).
- **It does not wipe anyone's existing choices.** Whatever someone already set for themselves keeps its value. What changes is the options they never set: those move from the built-in value to yours.
- **It does not cover Theme or Language.** Both are stored in the browser rather than on the account, so they are not part of this. Use [`DEFAULT_LOCALE`](/reference/env-configuration#default_locale) to choose the starting language.

---

## Locking the defaults

If a set of accounts should stay exactly on your values, remove the **Interface Settings Access** permission from them (see [Permissions](/features/authentication-access/rbac/permissions)). Doing so hides the **Interface** page and refuses any attempt to save personal settings, so those accounts keep whatever you have configured. Admins are exempt from the permission and can always change their own settings.

---

## Checking what an account has overridden

`GET /api/v1/users/user/settings` returns the signed-in account's settings with your defaults already filled in, which is what the app itself uses. Add `?raw=true` to get that account's own stored settings instead, without the defaults merged in, so you can see exactly which options it has pinned and which are still inherited.

---

## Related

- [`DEFAULT_INTERFACE_SETTINGS`](/reference/env-configuration#default_interface_settings) in the environment variable reference
- [Understanding Settings](/getting-started/quick-start/settings), on how admin and user settings relate
- [Permissions](/features/authentication-access/rbac/permissions), for **Interface Settings Access**
