---
sidebar_position: 13
title: "Customizable Banners"
---

## Overview

Open WebUI allows administrators to display custom banners to logged-in users. This feature is useful for making announcements, displaying system-wide alerts, or sharing important information. Banners are persistent and can be configured to be dismissible by users.

You can configure banners in two ways: through the Admin Panel for a user-friendly experience, or via environment variables for automated or GitOps-style deployments.

## Configuring Banners

### Option 1: Using the Admin Panel

This is the most straightforward way to manage banners.

1.  **Log in** to your Open WebUI instance as an administrator.
2.  Navigate to the **Admin Panel** > **Settings** > **Interface**.
3.  Locate the **"Banners"** section.
4.  Click the **+** icon to add a new banner.

You can then configure the following options for each banner:

-   **Type:** The color and style of the banner. Choose from:
    -   `info` (Blue)
    -   `success` (Green)
    -   `warning` (Yellow)
    -   `error` (Red)
-   **Title:** The main heading of the banner.
-   **Content:** The main text or message of the banner.
-   **Dismissible:** If toggled on, users can close the banner. Dismissed banners are stored in the user's browser, so they will not reappear for that user unless their browser cache is cleared. If toggled off, the banner will always be visible.

5.  Click **"Save"** at the bottom of the page to apply your changes.

### Option 2: Using Environment Variables

For automated deployments, you can configure banners using the `WEBUI_BANNERS` environment variable. The variable should be a JSON string representing a list of banner objects.

**Environment Variable:**

-   `WEBUI_BANNERS`
    -   **Type:** `string` (containing a JSON list of objects)
    -   **Default:** `[]`
    -   **Description:** A list of banner objects to be displayed to users.

**Example:**

Here is an example of how to set the `WEBUI_BANNERS` variable in a `docker-compose.yml` file:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - 'WEBUI_BANNERS=[{"id":"update-2024-07-26","type":"info","title":"System Update","content":"A system update is scheduled for this Friday at 10 PM. Expect brief downtime.","dismissible":true},{"id":"policy-reminder","type":"warning","title":"Policy Reminder","content":"Please remember to adhere to the company-wide usage policy.","dismissible":false}]'
```

## Banner Object Properties

Each banner object in the JSON list has the following properties:

-   `id` (string, required): A unique identifier for the banner. This is used to track which banners a user has dismissed.
-   `type` (string, required): The style of the banner. Must be one of `info`, `success`, `warning`, or `error`.
-   `title` (string, optional): The title text displayed on the banner.
-   `content` (string, required): The main message of the banner.
-   `dismissible` (boolean, required): Determines if the user can close the banner. `true` means it can be dismissed; `false` means it cannot.
-   `timestamp` (integer, required): **Note:** While this field is present in the configuration, it is not currently used by the frontend. The timestamp does not affect whether a banner is displayed or not.

## Troubleshooting

-   **Banner Not Appearing:**
    -   Ensure the JSON format for the `WEBUI_BANNERS` environment variable is correct. It must be a valid JSON array of objects.
    -   Check the Open WebUI server logs for any errors related to parsing the `WEBUI_BANNERS` variable.
-   **Banner Cannot Be Dismissed:**
    -   Verify that the `dismissible` property for the banner is set to `true` in your configuration.
    -   If a banner is not dismissible, it is by design and cannot be closed by the user.
