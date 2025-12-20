---
sidebar_position: 4
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
