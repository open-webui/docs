---
sidebar_position: 3
title: "Prompts"
---

The `Prompts` section of the `Workspace` within Open WebUI enables users to create, manage, and share custom prompts. This feature streamlines interactions with AI models by allowing users to save frequently used prompts and easily access them through slash commands.

### Prompt Management

The Prompts interface provides several key features for managing your custom prompts:

* **Create**: Design new prompts with customizable names, tags, access levels, and content.
* **Share**: Share prompts with other users based on configured access permissions.
* **Access Control**: Set visibility and usage permissions for each prompt (refer to [Permissions](/features/access-security/rbac/permissions) for more details).
* **Enable/Disable**: Toggle prompts on or off without deleting them. Disabled prompts won't appear in slash command suggestions but remain in your workspace for future use.
* **Slash Commands**: Quickly access prompts using custom slash commands during chat sessions.
* **Versioning & History**: Track every change with a full version history, allowing you to compare and revert to previous versions.
* **Tags & Filtering**: Organize your prompts using tags and easily filter through your collection in the workspace.

### Creating and Editing Prompts

When creating or editing a prompt, you can configure the following settings:

* **Name**: Give your prompt a descriptive name for easy identification.
* **Tags**: Categorize your prompts with tags to make them easier to find and filter in your workspace.
* **Access**: Set the access level to control who can view and use the prompt.
* **Command**: Define a slash command that will trigger the prompt (e.g., `/summarize`). Commands are triggered in the chat by typing `/` followed by the command name.
* **Prompt Content**: Write the actual prompt text that will be sent to the model.
* **Commit Message**: When saving changes, you can provide an optional commit message to describe what was updated in this version.

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
  * `{{USER_EMAIL}}`: Current user's email address
  * `{{USER_BIO}}`: Current user's bio. Configured in **Settings > Account > User Profile**. If not set, the variable remains unreplaced.
  * `{{USER_GENDER}}`: Current user's gender. Configured in **Settings > Account > User Profile**. If not set, the variable remains unreplaced.
  * `{{USER_BIRTH_DATE}}`: Current user's birth date. Configured in **Settings > Account > User Profile**. If not set, the variable remains unreplaced.
  * `{{USER_AGE}}`: Current user's age, calculated from birth date. If birth date is not set, the variable remains unreplaced.
  * `{{USER_LANGUAGE}}`: User's selected language
  * `{{USER_LOCATION}}`: User's location (requires HTTPS and Settings > Interface toggle)

**Custom Input Variables** transform your prompts into interactive templates. When you use a prompt containing these variables, a modal window will automatically appear, allowing you to fill in your values. This is extremely powerful for creating complex, reusable prompts that function like forms. See the guidelines below for a full explanation.

By leveraging custom input variables, you can move beyond static text and build interactive tools directly within the chat interface. This feature is designed to be foolproof, enabling even non-technical users to execute complex, multi-step prompts with ease. Instead of manually editing a large block of text, users are presented with a clean, structured form. This not only streamlines the workflow but also reduces errors by guiding the user to provide exactly the right information in the right format. It unlocks a new level of interactive prompt design, making sophisticated AI usage accessible to everyone.

### Variable Usage Guidelines

* Enclose all variables with double curly braces: `{{variable}}`
* **All custom input variables are optional by default** - users can leave fields blank when filling out the form
* Use the `:required` flag to make specific variables mandatory when necessary
* The `{{USER_LOCATION}}` system variable requires:
  * A secure HTTPS connection
  * Enabling the feature in `Settings` > `Interface`
* The `{{CLIPBOARD}}` system variable requires clipboard access permission from your device.

---

#### Advanced Variable Modifiers

Certain system variables like `{{prompt}}` and `{{MESSAGES}}` support optional modifiers to control their length and which part of the content is included. This is particularly useful for managing context window limits.

* **Start Truncation**: `{{prompt:start:N}}` - Includes only the first **N** characters of the content.
* **End Truncation**: `{{prompt:end:N}}` - Includes only the last **N** characters of the content.
* **Middle Truncation**: `{{prompt:middletruncate:N}}` - Includes a total of **N** characters, taking half from the beginning and half from the end, with `...` in the middle.

These modifiers also work with the `{{MESSAGES}}` variable (e.g., `{{MESSAGES:START:5}}` to include only the first 5 messages).

---

#### Using Custom Input Variables

**How It Works**

1. **Create a prompt** with one or more custom variables using the syntax below.
2. **Use the prompt's slash command** in the chat input.
3. An **"Input Variables" popup window** will appear with a form field for each variable you defined.
4. **Fill out the form** and click `Save`. Note that by default, all fields are optional unless explicitly marked as required.
5. The variables in your prompt will be replaced with your input, and the final prompt will be sent to the model.

**Syntax**

There are two ways to define a custom variable:

1. **Simple Input**: `{{variable_name}}`
    * This creates a standard, single-line `text` type input field in the popup window.
    * The field will be optional by default.

2. **Typed Input**: `{{variable_name | [type][:property="value"]}}`
    * This allows you to specify the type of input field (e.g., a dropdown, a date picker) and configure its properties.
    * The field will be optional by default unless you add the `:required` flag.

**Required vs Optional Variables**

By default, all custom input variables are **optional**, meaning users can leave them blank when filling out the form. This flexible approach allows for versatile prompt templates where some information might not always be needed.

To make a variable **required** (mandatory), add the `:required` flag:

```txt
{{mandatory_field | text:required}}
{{optional_field | text}}
```

When a field is marked as required:

* The form will display a visual indicator (asterisk) next to the field label
* Users cannot submit the form without providing a value
* Browser validation will prevent form submission if required fields are empty

**Input Types Overview**

You can specify different input types to build rich, user-friendly forms. Here is a table of available types and their properties.

| Type | Description | Available Properties | Syntax Example |
| :--- | :--- | :--- | :--- |
| **text** | A standard single-line text input field, perfect for capturing short pieces of information like names, titles, or single-sentence summaries. This is the **default type if no other is specified**. | `placeholder`, `default`, `required` | `{{name \| text:placeholder="Enter name":required}}` |
| **textarea**| A multi-line text area designed for capturing longer blocks of text, such as detailed descriptions, article content, or code snippets. | `placeholder`, `default`, `required` | `{{description \| textarea:required}}` |
| **select** | A dropdown menu that presents a predefined list of choices. This is ideal for ensuring consistent input for things like status, priority, or categories. | `options` (JSON array), `placeholder`, `default`, `required` | `{{priority \| select:options=["High","Medium","Low"]:placeholder="Choose priority":required}}` |
| **number** | An input field that is restricted to numerical values only. Useful for quantities, ratings, or any other numeric data. | `placeholder`, `min`, `max`, `step`, `default`, `required` | `{{count \| number:min=1:max=100:default=5}}` |
| **checkbox**| A simple checkbox that represents a true or false (boolean) value. It's perfect for on/off toggles, like 'Include a conclusion?' or 'Mark as urgent?'. | `label`, `default` (boolean), `required` | `{{include_details \| checkbox:label="Include detailed analysis"}}` |
| **date** | A calendar-based date picker that allows users to easily select a specific day, month, and year, ensuring a standardized date format. | `placeholder`, `default` (YYYY-MM-DD), `required` | `{{start_date \| date:required}}` |
| **datetime-local**| A specialized picker that allows users to select both a specific date and a specific time. Great for scheduling appointments or logging event timestamps. | `placeholder`, `default`, `required` | `{{appointment \| datetime-local}}` |
| **color** | A visual color picker that allows the user to select a color or input a standard hex code (e.g., #FF5733). Useful for design and branding prompts. | `default` (hex code), `required` | `{{brand_color \| color:default="#FFFFFF"}}` |
| **email** | An input field specifically formatted and validated for email addresses, ensuring the user provides a correctly structured email. | `placeholder`, `default`, `required` | `{{recipient_email \| email:required}}` |
| **month** | A picker that allows users to select a specific month and year, without needing to choose a day. Useful for billing cycles, reports, or timelines. **Note:** This input type is only natively supported in Chrome and Edge. In Firefox and Safari, it will display as a plain text input instead of a month picker. | `placeholder`, `default`, `required` | `{{billing_month \| month}}` |
| **range** | A slider control that allows the user to select a numerical value from within a defined minimum and maximum range. Ideal for satisfaction scores or percentage adjustments. | `min`, `max`, `step`, `default`, `required` | `{{satisfaction \| range:min=1:max=10}}` |
| **tel** | An input field designed for telephone numbers. It semantically indicates the expected input type for browsers and devices. | `placeholder`, `default`, `required` | `{{phone_number \| tel}}` |
| **time** | A picker for selecting a time. Useful for scheduling meetings, logging events, or setting reminders without an associated date. | `placeholder`, `default`, `required` | `{{meeting_time \| time}}` |
| **url** | An input field for web addresses (URLs). It helps ensure that the user provides a link, which can be useful for prompts that analyze websites or reference online sources. | `placeholder`, `default`, `required` | `{{website \| url:required}}` |
| **map** | **(Experimental)** An interactive map interface that lets users click to select geographic coordinates. This is a powerful tool for location-based prompts. | `default` (e.g., "51.5,-0.09"), `required` | `{{location \| map}}` |

#### Example Use Cases

**1. Flexible Article Summarizer**

Create a reusable prompt where the article content is required but additional parameters are optional.

* **Command:** `/summarize_article`
* **Prompt Content:**

    ```txt
    Please summarize the following article. {{article_text | textarea:placeholder="Paste the full text of the article here...":required}}

    {{summary_length | select:options=["Brief (3 bullets)","Detailed (5 bullets)","Executive Summary"]:default="Brief (3 bullets)"}}

    {{focus_area | text:placeholder="Any specific aspect to focus on? (optional)"}}

    {{include_quotes | checkbox:label="Include key quotes from the article"}}
    ```

    When you type `/summarize_article`, a modal will appear with a required text area for the article, and optional fields for customizing the summary style.

**2. Advanced Bug Report Generator**

This prompt ensures critical information is captured while allowing optional details.

* **Command:** `/bug_report`
* **Prompt Content:**

    ```txt
    Generate a bug report with the following details:

    **Summary:** {{summary | text:placeholder="A brief summary of the issue":required}}
    **Priority:** {{priority | select:options=["Critical","High","Medium","Low"]:default="Medium":required}}
    **Steps to Reproduce:**
    {{steps | textarea:placeholder="1. Go to...\n2. Click on...\n3. See error...":required}}

    **Additional Context:** {{additional_context | textarea:placeholder="Browser version, OS, screenshots, etc. (optional)"}}
    **Workaround:** {{workaround | textarea:placeholder="Any temporary solutions found (optional)"}}

    Please format this into a clear and complete bug report document.
    ```

    This creates a form where title, priority, and steps are mandatory, but additional context and workarounds are optional.

**3. Social Media Post Generator with Smart Defaults**

This prompt generates tailored content with required core information and optional customizations.

* **Command:** `/social_post`
* **Prompt Content:**

    ```txt
    Generate a social media post for {{platform | select:options=["LinkedIn","Twitter","Facebook","Instagram"]:required}}.

    **Topic:** {{topic | text:placeholder="e.g., New feature launch":required}}
    **Key Message:** {{key_message | textarea:placeholder="What are the essential points to communicate?":required}}
    **Tone of Voice:** {{tone | select:options=["Professional","Casual","Humorous","Inspirational"]:default="Professional"}}
    **Call to Action:** {{cta | text:placeholder="e.g., 'Learn more', 'Sign up today'"}}
    **Character Limit:** {{char_limit | number:placeholder="Leave blank for platform default"}}
    **Include Hashtags:** {{include_hashtags | checkbox:label="Add relevant hashtags":default=true}}

    Please create an engaging post optimized for the selected platform.
    ```

**4. Meeting Minutes Assistant with Flexible Structure**

Generate structured meeting minutes with required basics and optional details.

* **Command:** `/meeting_minutes`
* **Prompt Content:**

    ```txt
    # Meeting Minutes

    **Date:** {{meeting_date | date:required}}
    **Time:** {{meeting_time | time:required}}
    **Meeting Title:** {{title | text:placeholder="e.g., Weekly Team Sync":required}}
    **Attendees:** {{attendees | text:placeholder="Comma-separated list of names":required}}

    ## Agenda / Key Discussion Points
    {{agenda_items | textarea:placeholder="Paste the agenda or list the key topics discussed.":required}}

    ## Decisions Made
    {{decisions | textarea:placeholder="Key decisions and outcomes (optional)"}}

    ## Action Items
    {{action_items | textarea:placeholder="List each action item, who it is assigned to, and the deadline."}}

    ## Next Meeting
    **Date:** {{next_meeting | date}}
    **Topics:** {{next_topics | text:placeholder="Items to discuss next time"}}

    Please format the above information into a clean and professional meeting summary.
    ```

**5. Content Review Template**

A flexible template for reviewing various types of content.

* **Command:** `/content_review`
* **Prompt Content:**

    ```txt
    Please review the following {{content_type | select:options=["Blog Post","Marketing Copy","Documentation","Email","Presentation"]:required}}:

    **Content Title:** {{title | text:required}}
    **Content:** {{content | textarea:placeholder="Paste the content to be reviewed":required}}

    **Review Focus:** {{focus | select:options=["Grammar & Style","Technical Accuracy","Brand Voice","SEO Optimization","General Feedback"]:default="General Feedback"}}
    **Target Audience:** {{audience | text:placeholder="Who is this content for?"}}
    **Specific Concerns:** {{concerns | textarea:placeholder="Any particular areas you'd like me to focus on?"}}
    **Word Count Target:** {{word_count | number:placeholder="Target word count (if relevant)"}}

    Please provide detailed feedback and suggestions for improvement.
    ```

### Prompt Versioning and History

Open WebUI includes a robust versioning system for prompts, allowing you to track changes over time and revert to previous versions if needed.

#### Version Tracking
Every time you save changes to a prompt's content, name, command, or access control, a new version is automatically created. This ensures that your prompt's evolution is preserved.

#### History Sidebar
When editing an existing prompt, you will see a **History** sidebar (on desktop) that lists all previous versions in reverse chronological order. Each entry shows:
* **Commit Message**: A brief description of the changes (if provided).
* **Author**: The user who made the changes, including their profile picture.
* **Timestamp**: When the change was made.
* **Live Badge**: Indicates which version is currently active in the chat.

#### Managing Versions
* **Previewing**: Click on any version in the history sidebar to preview its content in the main editor.
* **Setting as Production**: To make a previous version the active "Live" version, select it and click **Set as Production**.
* **Deleting Versions**: You can delete individual history entries by clicking the menu icon next to the version. Note that you cannot delete the currently active production version.
* **Copying ID**: Click the prompt ID or a specific version's short ID to copy it to your clipboard for reference.

### Access Control and Permissions

Prompt management is controlled by the following permission settings:

* **Prompts Access**: Users need the `USER_PERMISSIONS_WORKSPACE_PROMPTS_ACCESS` permission to create and manage prompts.
* For detailed information about configuring permissions, refer to the [Permissions documentation](/features/access-security/rbac/permissions).

### Best Practices

* Use clear, descriptive titles for your prompts
* Create intuitive slash commands that reflect the prompt's purpose
* **Design with flexibility in mind**: Mark only truly essential fields as required, leaving optional fields for enhanced customization
* For custom variables, use clear names (e.g., `{{your_name}}` instead of `{{var1}}`) and descriptive `placeholder` text to make templates easy to understand
* **Provide sensible defaults** for optional fields where appropriate to speed up form completion
* **Use the required flag strategically** - only require information that is absolutely necessary for the prompt to function properly
* Document any specific requirements or expected inputs in the prompt description
* Test prompts with different variable combinations, including scenarios where optional fields are left blank
* Consider access levels carefully when sharing prompts with other users - public sharing means that it will appear automatically for all users when they hit `/` in a chat, so you want to avoid creating too many
* **Use the enable/disable toggle** to temporarily deactivate prompts you're not currently using instead of deleting them — this preserves the prompt's configuration and version history
* **Consider user workflows**: Think about which information users will always have versus what they might want to customize occasionally

### Migration Notes

* **Prompt History Migration**: Existing prompts created before the versioning update have been automatically migrated to the new system. Their current content has been preserved as the initial "Live" version in their history.
* **ID-based URLs**: The URL structure for editing prompts has changed from using commands to using unique IDs. Existing bookmarks to prompt edit pages may need to be updated.
* **Variable Requirement**: As of the v0.5.0 update, all variables are now treated as optional by default. To maintain required behavior for critical fields, edit your prompts to add the `:required` flag to those variables.
