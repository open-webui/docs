---
sidebar_position: 6
title: "Chat Parameters"
---

Within Open WebUI, there are three levels to setting a **System Prompt** and **Advanced Parameters**: per-chat basis, per-model basis, and per-account basis. This hierarchical system allows for flexibility while maintaining structured administration and control.

## System Prompt and Advanced Parameters Hierarchy Chart

| **Level** | **Definition** | **Modification Permissions** | **Override Capabilities** |
| --- | --- | --- | --- |
| **Per-Chat** | System prompt and advanced parameters for a specific chat instance | Users can modify, but cannot override model-specific settings | Restricted from overriding model-specific settings |
| **Per-Account** | Default system prompt and advanced parameters for a specific user account | Users can set, but may be overridden by model-specific settings | User settings can be overridden by model-specific settings |
| **Per-Model** | Default system prompt and advanced parameters for a specific model | Administrators can set, Users cannot modify | Admin-specific settings take precedence, User settings can be overridden |

### 1. **Per-chat basis:**

- **Description**: The per-chat basis setting refers to the system prompt and advanced parameters configured for a specific chat instance. These settings are only applicable to the current conversation and do not affect future chats.
- **How to set**: Users can modify the system prompt and advanced parameters for a specific chat instance within the right-hand sidebar's **Chat Controls** section in Open WebUI.
- **Override capabilities**: Users are restricted from overriding the **System Prompt** or specific **Advanced Parameters** already set by an administrator on a per-model basis (**#2**). This ensures consistency and adherence to model-specific settings.

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>Example Use Case</summary>

:::tip

**Per-chat basis**:
Suppose a user wants to set a custom system prompt for a specific conversation. They can do so by accessing the **Chat Controls** section and modifying the **System Prompt** field. These changes will only apply to the current chat session.

:::
</details>

### 2. **Per-account basis:**

- **Description**: The per-account basis setting refers to the default system prompt and advanced parameters configured for a specific user account. Any user-specific changes can serve as a fallback in situations where lower-level settings aren't defined.
- **How to set**: Users can set their own system prompt and advanced parameters for their account within the **General** section of the **Settings** menu in Open WebUI.
- **Override capabilities**: Users have the ability to set their own system prompt on their account, but they must be aware that such parameters can still be overridden if an administrator has already set the **System Prompt** or specific **Advanced Parameters** on a per-model basis for the particular model being used.

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>Example Use Case</summary>

:::tip

**Per-account basis**:
Suppose a user wants to set their own system prompt for their account. They can do so by accessing the **Settings** menu and modifying the **System Prompt** field.

:::
</details>

### 3. **Per-model basis:**

- **Description**: The per-model basis setting refers to the default system prompt and advanced parameters configured for a specific model. These settings are applicable to all chat instances using that model.
- **How to set**: Administrators can set the default system prompt and advanced parameters for a specific model within the **Models** section of the **Workspace** in Open WebUI.
- **Override capabilities**: **User** accounts are restricted from modifying the **System Prompt** or specific **Advanced Parameters** on a per-model basis (**#3**). This restriction prevents users from inappropriately altering default settings.
- **Context length preservation:** When a model's **System Prompt** or specific **Advanced Parameters** are set manually in the **Workspace** section by an Admin, said **System Prompt** or manually set **Advanced Parameters** cannot be overridden or adjusted on a per-account basis within the **General** settings or **Chat Controls** section by a **User** account. This ensures consistency and prevents excessive reloading of the model whenever a user's context length setting changes.
- **Model precedence:** If a model's **System Prompt** or specific **Advanced Parameters** value is pre-set in the Workspace section by an Admin, any context length changes made by a **User** account in the **General** settings or **Chat Controls** section will be disregarded, maintaining the pre-configured value for that model. Be advised that parameters left untouched by an **Admin** account can still be manually adjusted by a **User** account on a per-account or per-chat basis.

<!-- markdownlint-disable-next-line MD033 -->
<details>
<!-- markdownlint-disable-next-line MD033 -->
<summary>Example Use Case</summary>

:::tip

**Per-model basis**:
Suppose an administrator wants to set a default system prompt for a specific model. They can do so by accessing the **Models** section and modifying the **System Prompt** field for the corresponding model. Any chat instances using this model will automatically use the model's system prompt and advanced parameters.

:::
</details>

## **Optimize System Prompt Settings for Maximum Flexibility**

:::tip

**Bonus Tips**
**This tip applies for both administrators and user accounts. To achieve maximum flexibility with your system prompts, we recommend considering the following setup:**

- Assign your primary System Prompt (**i.e., to give an LLM a defining character**) you want to use in your **General** settings **System Prompt** field. This sets it on a per-account level and allows it to work as the system prompt across all your LLMs without requiring adjustments within a model from the **Workspace** section.

- For your secondary System Prompt (**i.e, to give an LLM a task to perform**), choose whether to place it in the **System Prompt** field within the **Chat Controls** sidebar (on a per-chat basis) or the **Models** section of the **Workspace** section (on a per-model basis) for Admins, allowing you to set them directly. This allows your account-level system prompt to work in conjunction with either the per-chat level system prompt provided by **Chat Controls**, or the per-model level system prompt provided by **Models**.

- As an administrator, you should assign your LLM parameters on a per-model basis using **Models** section for optimal flexibility. For both of these secondary System Prompts, ensure to set them in a manner that maximizes flexibility and minimizes required adjustments across different per-account or per-chat instances. It is essential for both your Admin account as well as all User accounts to understand the priority order by which system prompts within **Chat Controls** and the **Models** section will be applied to the **LLM**.

:::

## Chat Variables

Chat variables turn a model's system prompt into a short form. An administrator writes placeholders into the system prompt, and Open WebUI asks whoever opens a chat with that model to fill them in. The answers are saved on that chat and reused for every message in it.

Declare one in a model's system prompt:

```txt
{{chat.variables.key_name}}
```

That produces a single-line text field. Add a definition after the pipe for a typed field:

```txt
{{chat.variables.project_name | text:placeholder="Which project?":required}}
{{chat.variables.tone | select:options=["Formal","Casual"]:default="Formal"}}
```

The grammar and the available field types are the same ones used by [prompt input variables](/features/workspace/prompts#available-input-types). Keys must be lowercase snake case: start with a letter, then letters, digits, or underscores.

### Filling them in

When a selected model declares chat variables, a control appears next to the chat input, and opens the **Chat Variables** form. Sending the first message opens the form on its own if nothing has been filled in yet, or if a required field is still empty. The values can be changed from the same control later, and take effect for messages sent after the change.

They are stored on the chat, so reopening it keeps them, and forking or cloning a chat carries them over. In temporary chats they are sent with the request instead of being stored, so they last only as long as the chat does.

A variable with no value is replaced with an empty string rather than blocking the request, so a partly filled form still sends. `required` is enforced when you send from the chat interface, not at the point the prompt is assembled.

A single value can be up to 20,000 characters, and all of a chat's variables together up to 100,000 characters.

:::warning Editing a definition can blank existing chats

Values are validated against the current definitions when the prompt is assembled, and if any of them fails, every chat variable in that prompt renders empty rather than just the offending one. Removing an option from a `select` therefore silently blanks the whole set for chats that were storing the removed value, so re-open affected chats and re-fill the form after changing a definition.

:::

### Several models in one chat

Selecting more than one model merges their variables. Identical definitions collapse into one field, which is required if any of the models marks it required. If two selected models define the same key differently, sending is blocked and the conflicting keys are listed along with the models that define them, so deselect one of them or make the definitions match.

### Authoring checks

The model editor lists what it found under **Detected Variables**, split into **Chat Variables** and **User Variables**. It warns about a key that is not lowercase snake case, a `select` with no `options=[...]`, the same key defined two different ways, and a user variable given a definition, since those are configured by each user and a definition has no effect on them.

## User Variables

User variables let one shared system prompt produce a different result for each person using it. An administrator writes a placeholder into a model's system prompt, and every user fills in their own value.

Each user manages their own values under **Settings > Account > User Variables**, as a list of key and value pairs. Reference them in a system prompt with:

```txt
{{user.variables.key_name}}
```

At request time each placeholder is replaced with that user's value for the key. A key the user has not set is replaced with an empty string, so the prompt never shows the raw placeholder.

For example, a single shared model can carry `Address the user as {{user.variables.preferred_name}} and answer in {{user.variables.language}}.` and behave correctly for everyone, without an administrator maintaining a model per person.

### Rules for keys and values

- Keys must be lowercase snake case: start with a letter, then letters, digits, or underscores (`preferred_name`, `team2`). Keys that do not match are rejected.
- Values are plain text. A single value can be up to 20,000 characters, and all of a user's variables together up to 100,000 characters.
- Values are stored per user and are only ever substituted into that user's own requests.

Values are personal, so treat them as user-supplied text rather than a place for secrets: anything put in a variable is inserted into the prompt sent to the model configured for that chat.

### User variables or chat variables?

Both are written into a model's system prompt and both are filled in by users rather than administrators. The difference is who is asked and how long the answer lasts.

| | Chat variables | User variables |
| --- | --- | --- |
| Written as | `{{chat.variables.key}}` | `{{user.variables.key}}` |
| Who fills them in | whoever opens the chat, in a form | each user, once, in **Settings > Account** |
| How long they last | that one conversation | every request that user sends |
| Field types | typed, defined after the pipe | plain text only |
| When they are asked for | when the chat starts | never, they are set ahead of time |

Definitions after the pipe only apply to chat variables. Writing one on a user variable has no effect, and the model editor flags it, since each user configures their own value in settings rather than being prompted for it.
