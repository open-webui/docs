---
sidebar_position: 3
title: "📜 Prompt Presets"
---

Prompt Presets are a handy feature in Open WebUI that make working with LLM simpler and faster. Imagine you’ve figured out the perfect way to ask the model a specific question—let’s say for summarizing a technical document with key highlights and action points. Instead of rewriting this detailed prompt every time, you can save it as a Prompt Preset. The next time you need it, just select the preset, customize a few details if needed, and get your results instantly. This makes it easy to reuse well-crafted prompts without wasting time recreating them from scratch.
Contributor

![Prompt Preset Demo](/img/prompt-set.gif)

## How Can You Create Custom Prompts?

Open WebUI offers a flexible interface for creating custom prompts. The prompt creation process involves the following steps:

1. **Add a Title**: Assign a clear and descriptive title to your prompt, such as "Professional Email" or "Customer Query."
2. **Define a Command**: Create a reusable command (e.g., `/email`) that allows quick insertion of the prompt content.
3. **Set Prompt Content**: Write the core instructions, incorporating customizable placeholders.
4. **Save the Prompt**: Store the prompt for future use, ensuring it is easily accessible.

### Who Can Access and Use Prompts?
- **Admins**: Have the ability to create and manage all prompts within a shared workspace.

- **Users**: They can use the prompts added by the admin , however, they can add and edit prompts if granted the necessary [access by the admin](../user-group.md).

This structured approach ensures that prompts remain standardized and accessible to relevant team members.

---

## How Do Variables Work in Prompts?

Open WebUI allows the use of **variables** in prompts. Variables act as placeholders that can be dynamically replaced with specific content during prompt execution. They are defined by enclosing text within double curly braces, such as `{{VARIABLE_NAME}}`.
---
---

## What Reserved Variables Are Available?

Open WebUI includes a set of **reserved variables** designed to facilitate the creation of context-aware and interactive prompts. These variables provide dynamic content, such as dates, times, and user-specific information.

| **Reserved Variable**          | **Description**                                                                                | **Requirements**                                                               |
|--------------------------------|------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|
| `{{CLIPBOARD}}`                | Inserts the content of the user's clipboard.                                                   | Requires device clipboard access.                                              |
| `{{CURRENT_DATE}}`             | Inserts the current date in `YYYY-MM-DD` format.                                               | None                                                                           |
| `{{CURRENT_DATETIME}}`         | Inserts the current date and time in `YYYY-MM-DD HH:MM:SS` format.                             | None                                                                           |
| `{{CURRENT_TIME}}`             | Inserts the current time in `HH:MM:SS` format.                                                 | None                                                                           |
| `{{CURRENT_TIMEZONE}}`         | Inserts the user's current timezone.                                                           | None                                                                           |
| `{{CURRENT_WEEKDAY}}`          | Inserts the current day of the week (e.g., Monday, Tuesday).                                   | None                                                                           |
| `{{USER_NAME}}`                | Inserts the user’s name.                                                                       | None                                                                           |
| `{{USER_LANGUAGE}}`            | Inserts the user’s language preference.                                                        | None                                                                           |
| `{{USER_LOCATION}}`            | Inserts the user’s geographic location (e.g., city, country).                                  | Requires HTTPS and must be enabled via `Settings > Interface`.                |

### What Can You Do With Reserved Variables?
- **Context-Aware Prompts**: Generate location-specific responses using `{{USER_LOCATION}}`.
- **Dynamic Integration**: Use `{{CLIPBOARD}}` to include content copied to the clipboard.
- **Time-Sensitive Prompts**: Adapt responses based on the current time or date with variables like `{{CURRENT_DATETIME}}`.

Ensure reserved variables are enabled in your settings to take full advantage of their functionality.

---

## How Can You Explore Community Prompts?

Open WebUI’s [community prompt library](https://openwebui.com/prompts) provides access to a wide range of user-contributed prompts. These templates can be downloaded and customized to meet your needs, offering a quick way to integrate best practices into your workflow.