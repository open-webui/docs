---
sidebar_position: 2
title: "📚 Prompts"
---

The `Prompts` section of the `Workspace` within Open WebUI enables users to create, manage, and share custom prompts. This feature streamlines interactions with AI models by allowing users to save frequently used prompts and easily access them through slash commands.

### Prompt Management

The Prompts interface provides several key features for managing your custom prompts:

* **Create**: Design new prompts with customizable titles, access levels, and content.
* **Share**: Share prompts with other users based on configured access permissions.
* **Access Control**: Set visibility and usage permissions for each prompt (refer to [Permissions](./permissions.md) for more details).
* **Slash Commands**: Quickly access prompts using custom slash commands during chat sessions.

### Creating and Editing Prompts

When creating or editing a prompt, you can configure the following settings:

* **Title**: Give your prompt a descriptive name for easy identification.
* **Access**: Set the access level to control who can view and use the prompt.
* **Command**: Define a slash command that will trigger the prompt (e.g., `/summarize`).
* **Prompt Content**: Write the actual prompt text that will be sent to the model.

### Prompt Variables

Open WebUI supports two kinds of variables to make your prompts more dynamic and powerful: **System Variables** and **Custom Input Variables**.

**System Variables** are automatically replaced with their corresponding value when the prompt is used. They are useful for inserting dynamic information like the current date or user details.

* **Clipboard Content**: Use `{{CLIPBOARD}}` to insert content from your clipboard.
* **Date and Time**:
  * `{{CURRENT_DATE}}`: Current date
  * `{{CURRENT_DATETIME}}`: Current date and time
  * `{{CURRENT_TIME}}`: Current time
  * `{{CURRENT_TIMEZONE}}`: Current timezone
  * `{{CURRENT_WEEKDAY}}`: Current day of the week
* **User Information**:
  * `{{USER_NAME}}`: Current user's name
  * `{{USER_LANGUAGE}}`: User's selected language
  * `{{USER_LOCATION}}`: User's location (requires HTTPS and Settings > Interface toggle)

**Custom Input Variables** transform your prompts into interactive templates. When you use a prompt containing these variables, a modal window will automatically appear, allowing you to fill in your values. This is extremely powerful for creating complex, reusable prompts that function like forms. See the guidelines below for a full explanation.

By leveraging custom input variables, you can move beyond static text and build interactive tools directly within the chat interface. This feature is designed to be foolproof, enabling even non-technical users to execute complex, multi-step prompts with ease. Instead of manually editing a large block of text, users are presented with a clean, structured form. This not only streamlines the workflow but also reduces errors by guiding the user to provide exactly the right information in the right format. It unlocks a new level of interactive prompt design, making sophisticated AI usage accessible to everyone.

### Variable Usage Guidelines

* Enclose all variables with double curly braces: `{{variable}}`
* The `{{USER_LOCATION}}` system variable requires:
  * A secure HTTPS connection
  * Enabling the feature in `Settings` > `Interface`
* The `{{CLIPBOARD}}` system variable requires clipboard access permission from your device

---

#### Using Custom Input Variables

**How It Works**

1.  **Create a prompt** with one or more custom variables using the syntax below.
2.  **Use the prompt's slash command** in the chat input.
3.  An **"Input Variables" popup window** will appear with a form field for each variable you defined.
4.  **Fill out the form** and click `Save`.
5.  The variables in your prompt will be replaced with your input, and the final prompt will be sent to the model.

**Syntax**

There are two ways to define a custom variable:

1.  **Simple Input**: `{{variable_name}}`
    *   This creates a standard, single-line `text` type input field in the popup window.

2.  **Typed Input**: `{{variable_name | [type][:property="value"]}}`
    *   This allows you to specify the type of input field (e.g., a dropdown, a date picker) and configure its properties.

**Input Types Overview**

You can specify different input types to build rich, user-friendly forms. Here is a table of available types and their properties.

| Type | Description | Available Properties | Syntax Example |
| :--- | :--- | :--- | :--- |
| **text** | A standard single-line text input field, perfect for capturing short pieces of information like names, titles, or single-sentence summaries. This is the **default type if no other is specified**. | `placeholder`, `default` | `{{name \| text:placeholder="Enter name"}}` |
| **textarea**| A multi-line text area designed for capturing longer blocks of text, such as detailed descriptions, article content, or code snippets. | `placeholder`, `default` | `{{description \| textarea}}` |
| **select** | A dropdown menu that presents a predefined list of choices. This is ideal for ensuring consistent input for things like status, priority, or categories. | `options` (JSON array), `default` | `{{priority \| select:options=["High","Low"]}}` |
| **number** | An input field that is restricted to numerical values only. Useful for quantities, ratings, or any other numeric data. | `placeholder`, `default` | `{{count \| number:default=5}}` |
| **checkbox**| A simple checkbox that represents a true or false (boolean) value. It's perfect for on/off toggles, like 'Include a conclusion?' or 'Mark as urgent?'. | `default` (boolean) | `{{include_details \| checkbox}}` |
| **date** | A calendar-based date picker that allows users to easily select a specific day, month, and year, ensuring a standardized date format. | `default` (YYYY-MM-DD) | `{{start_date \| date}}` |
| **datetime-local**| A specialized picker that allows users to select both a specific date and a specific time. Great for scheduling appointments or logging event timestamps. | `default` | `{{appointment \| datetime-local}}` |
| **color** | A visual color picker that allows the user to select a color or input a standard hex code (e.g., #FF5733). Useful for design and branding prompts. | `default` (hex code) | `{{brand_color \| color:default="#FFFFFF"}}` |
| **email** | An input field specifically formatted and validated for email addresses, ensuring the user provides a correctly structured email. | `placeholder`, `default` | `{{recipient_email \| email}}` |
| **month** | A picker that allows users to select a specific month and year, without needing to choose a day. Useful for billing cycles, reports, or timelines. | `default` | `{{billing_month \| month}}` |
| **range** | A slider control that allows the user to select a numerical value from within a defined minimum and maximum range. Ideal for satisfaction scores or percentage adjustments. | `min`, `max`, `step`, `default` | `{{satisfaction \| range}}` |
| **tel** | An input field designed for telephone numbers. It semantically indicates the expected input type for browsers and devices. | `placeholder`, `default` | `{{phone_number \| tel}}` |
| **time** | A picker for selecting a time. Useful for scheduling meetings, logging events, or setting reminders without an associated date. | `default` | `{{meeting_time \| time}}` |
| **url** | An input field for web addresses (URLs). It helps ensure that the user provides a link, which can be useful for prompts that analyze websites or reference online sources. | `placeholder`, `default` | `{{website \| url}}` |
| **map** | **(Experimental)** An interactive map interface that lets users click to select geographic coordinates. This is a powerful tool for location-based prompts. | `default` (e.g., "51.5,-0.09") | `{{location \| map}}` |


#### Example Use Cases

**1. Simple Article Summarizer**

Create a reusable prompt to summarize any article.

*   **Command:** `/summarize_article`
*   **Prompt Content:**
    ```
    Please summarize the following article in three key bullet points. Be concise and clear.

    Article:
    {{article_text | textarea:placeholder="Paste the full text of the article here..."}}
    ```
    When you type `/summarize_article`, a modal will appear with a large text area, prompting you to paste the article text.

**2. Advanced Bug Report Generator**

This prompt acts as a structured form to ensure all necessary details for a bug report are captured.

*   **Command:** `/bug_report`
*   **Prompt Content:**
    ```
    Generate a bug report with the following details:

    **Summary:** {{summary | text:placeholder="A brief summary of the issue"}}
    **Priority:** {{priority | select:options=["High", "Medium", "Low"]:default="Medium"}}
    **Steps to Reproduce:**
    {{steps | textarea:placeholder="1. Go to...\n2. Click on...\n3. See error..."}}
    
    Please format this into a clear and complete bug report document.
    ```
    When used, this prompt generates a form with a text input, a dropdown menu, and two text areas.

**3. Social Media Post Generator**

This prompt generates tailored content for different social media platforms.

*   **Command:** `/social_post`
*   **Prompt Content:**
    ```
    Generate a social media post for the {{platform}} platform.
    
    **Topic:** {{topic | text:placeholder="e.g., New feature launch"}}
    **Key Message:** {{key_message | textarea:placeholder="What are the essential points to communicate?"}}
    **Tone of Voice:** {{tone | select:options=["Professional", "Casual", "Humorous", "Inspirational"]:default="Professional"}}
    **Call to Action:** {{cta | text:placeholder="e.g., 'Learn more', 'Sign up today'"}}

    Please include relevant hashtags.
    ```

**4. Meeting Minutes Assistant**

Quickly generate structured meeting minutes by filling out a simple form.

*   **Command:** `/meeting_minutes`
*   **Prompt Content:**
    ```
    # Meeting Minutes

    **Date:** {{meeting_date | date}}
    **Time:** {{meeting_time | time}}
    **Attendees:** {{attendees | text:placeholder="Comma-separated list of names"}}

    ## Agenda / Key Discussion Points
    {{agenda_items | textarea:placeholder="Paste the agenda or list the key topics discussed."}}

    ## Action Items
    {{action_items | textarea:placeholder="List each action item, who it is assigned to, and the deadline."}}

    Please format the above information into a clean and professional meeting summary.
    ```

### Access Control and Permissions

Prompt management is controlled by the following permission settings:

* **Prompts Access**: Users need the `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS` permission to create and manage prompts.
* For detailed information about configuring permissions, refer to the [Permissions documentation](./permissions.md).

### Best Practices

* Use clear, descriptive titles for your prompts
* Create intuitive slash commands that reflect the prompt's purpose
* For custom variables, use clear names (e.g., `{{your_name}}` instead of `{{var1}}`) and descriptive `placeholder` text to make templates easy to understand.
* Document any specific requirements or expected inputs in the prompt description
* Test prompts with different variable combinations to ensure they work as intended
* Consider access levels carefully when sharing prompts with other users - public sharing means that it will appear automatically for all users when they hit `/` in a chat, so you want to avoid creating too many.
