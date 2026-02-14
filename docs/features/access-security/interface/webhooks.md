---
slug: /features/interface/webhooks
sidebar_position: 17
title: "Webhook Integrations"
---

## Overview

Open WebUI offers three distinct webhook integrations to help you stay informed about events happening within your instance and enable external integrations. These webhooks allow you to receive automated notifications in external services like Discord, Slack, or any other application that supports incoming webhooks, as well as post messages from external services into Open WebUI channels.

There are three types of webhooks available:

1.  **Admin Webhook:** A system-wide webhook that notifies administrators about new user sign-ups.
2.  **User Webhook:** A personal webhook that notifies individual users when a response to their chat is ready, especially useful for long-running tasks.
3.  **Channel Webhooks:** Incoming webhooks that allow external services to post messages into specific channels.

## 1. Admin Webhook: New User Notifications

This webhook is designed for administrators to monitor new user registration on the Open WebUI instance.

### Use Case

- **User Registration Tracking:** Receive a real-time notification in a dedicated Slack or Discord channel whenever a new user creates an account. This helps you keep track of your user base and welcome new members.

### Configuration

You can configure the admin webhook in two ways:

#### Option 1: Through the Admin Panel

1.  Log in as an administrator.
2.  Navigate to **Admin Panel > Settings > General**.
3.  Locate the **"Webhook URL"** field.
4.  Enter the webhook URL provided by your external service (e.g., Discord, Slack).
5.  Click **"Save"**.

#### Option 2: Through Environment Variables

You can also set the webhook URL using the `WEBHOOK_URL` environment variable. For more details, refer to the [Environment Variable Configuration](https://docs.openwebui.com/getting-started/env-configuration/#webhook_url) documentation.

### Payload Format

When a new user signs up, Open WebUI will send a `POST` request to the configured URL with a JSON payload containing the new user's details.

**Payload Example:**

```json
{
  "event": "new_user",
  "user": {
    "email": "tim@example.com",
    "name": "Tim"
  }
}
```

## 2. User Webhook: Chat Response Notifications

This webhook allows individual users to receive a notification when a model has finished generating a response to their prompt. It's particularly useful for long-running tasks where you might navigate away from the Open WebUI tab.

### Use Case

- **Long-Running Task Alerts:** If you submit a complex prompt that takes several minutes to process, you can close the browser tab and still be notified the moment the response is ready. This allows you to work on other tasks without having to constantly check the Open WebUI interface.

### How it Works

The notification is only sent if you are **not actively using the WebUI**. If you have the tab open and focused, the webhook will not be triggered, preventing unnecessary notifications.

### Enabling/Disabling User Webhooks

User webhooks are enabled by default. However, administrators can disable this feature for all users to prevent external requests or for security reasons.

This can be done in two ways:

1.  **Directly in the Admin Panel:**
    - Go to **Admin Panel > Settings > General > Features**.
    - Toggle the switch for **"User Webhooks"**.

2.  **Using Environment Variables:**
    - Set the environment variable `ENABLE_USER_WEBHOOKS` to `False` in your backend configuration. This will globally disable the feature and hide the setting from user profiles.

### Configuration

1.  Click on your profile picture in the bottom-left corner to open the settings menu.
2.  Navigate to **Settings > Account**.
3.  Locate the **"Notification Webhook"** field.
4.  Enter your personal webhook URL.
5.  Click **"Save"**.

### Payload Format

When a chat response is ready and you are inactive, Open WebUI will send a `POST` request to your webhook URL with a JSON payload containing details about the chat.

**Payload Example:**

```json
{
  "event": "chat_response",
  "chat": {
    "id": "abc-123-def-456",
    "title": "My Awesome Conversation",
    "last_message": "This is the prompt I submitted."
  }
}
```

## 3. Channel Webhooks: External Message Integration

Channel Webhooks allow external services, automation tools, or scripts to post messages directly into Open WebUI channels. This enables seamless integration with monitoring systems, CI/CD pipelines, notification services, or any custom automation.

### Use Cases

- **System Monitoring:** Post alerts from monitoring tools (Prometheus, Grafana, Nagios) directly into team channels.
- **CI/CD Integration:** Send build status notifications from GitHub Actions, GitLab CI, or Jenkins to development channels.
- **Custom Automation:** Integrate with n8n, Zapier, or custom scripts to automate message posting.
- **External Notifications:** Forward notifications from external services into your Open WebUI workspace.

### How it Works

Each channel can have multiple webhooks. Each webhook has:
- A unique **webhook URL** that external services can POST to
- A **display name** shown as the message author
- An optional **profile image** to visually identify the webhook source
- A **last used timestamp** to track webhook activity

Messages posted via webhooks appear in the channel with the webhook's identity, making it clear they came from an external source rather than a user.

### Managing Channel Webhooks

Only **channel managers** and **administrators** can create and manage webhooks for a channel.

#### Creating a Webhook

1.  Navigate to the channel where you want to add a webhook.
2.  Click the channel menu (⋮) and select **Edit Channel**.
3.  In the channel settings modal, locate the **Webhooks** section.
4.  Click **Manage** to open the Webhooks modal.
5.  Click **New Webhook** to create a new webhook.
6.  Configure the webhook:
    - **Name:** The display name that will appear as the message author
    - **Profile Image:** (Optional) Upload an image to represent this webhook
7.  Click **Save** to create the webhook.
8.  Copy the generated webhook URL using the **Copy URL** button.

#### Webhook URL Format

```
{WEBUI_API_BASE_URL}/channels/webhooks/{webhook_id}/{token}
```

This URL is unique and contains an authentication token. Anyone with this URL can post messages to the channel, so treat it securely.

#### Updating a Webhook

1.  Open the **Webhooks** modal from the channel settings.
2.  Click on the webhook you want to edit to expand it.
3.  Modify the **Name** or **Profile Image** as needed.
4.  Click **Save** to apply changes.

The webhook URL remains the same when you update the name or image. Messages posted after the update will show the new name/image, but existing messages retain the webhook identity from when they were posted.

#### Deleting a Webhook

1.  Open the **Webhooks** modal from the channel settings.
2.  Click on the webhook you want to delete to expand it.
3.  Click the **Delete** (trash) icon.
4.  Confirm the deletion.

Once deleted, the webhook URL will stop working immediately. Messages previously posted by the webhook will remain in the channel but show "Deleted Webhook" as the author.

### Posting Messages via Webhook

To post a message from an external service, send a `POST` request to the webhook URL with a JSON payload.

#### Request Format

**Endpoint:** `POST {webhook_url}`
**Headers:** `Content-Type: application/json`
**Body:**

```json
{
  "content": "Your message content here"
}
```

#### Example: Using cURL

```bash
curl -X POST "https://your-instance.com/api/channels/webhooks/{webhook_id}/{token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Deployment to production completed successfully! 🚀"}'
```

#### Example: Using Python

```python
import requests

webhook_url = "https://your-instance.com/api/channels/webhooks/{webhook_id}/{token}"
message = {
    "content": "Build #1234 failed: Unit tests did not pass."
}

response = requests.post(webhook_url, json=message)
print(response.json())
```

#### Response Format

On success, the webhook will return:

```json
{
  "success": true,
  "message_id": "abc-123-def-456"
}
```

### Security Considerations

-   **URL Protection:** Webhook URLs contain authentication tokens. Keep them secure and don't expose them in public repositories or logs.
-   **Channel Access:** Anyone with the webhook URL can post to the channel. Only share the URL with trusted services.
-   **Message Content:** Validate and sanitize message content on the sending side to prevent injection attacks.
-   **Regeneration:** If a webhook URL is compromised, delete the webhook and create a new one.

### Webhook Identity

Messages posted via webhooks have a special identity system:
- They appear with the webhook's **name** and **profile image**
- The user role is marked as **"webhook"** to distinguish from regular users
- If a webhook is deleted, its messages remain visible but show "Deleted Webhook" with the current webhook name no longer displayed
- Each message stores the webhook ID in its metadata, allowing proper attribution even if the webhook is later modified or deleted

## Troubleshooting

If you're not receiving webhook notifications, here are a few things to check:

-   **Verify the URL:** Ensure the webhook URL is correct and properly pasted into the settings field.
-   **Service Configuration:** Double-check that the webhook is set up correctly in the external service (e.g., Discord, Slack).
-   **Firewall/Proxy:** Make sure your network or firewall is not blocking outgoing requests from the Open WebUI server.
-   **Open WebUI Logs:** Check the Open WebUI server logs for any error messages related to webhook failures.

:::note

The webhook features in Open WebUI are continuously being improved. Stay tuned for more event types and customization options in future updates.

:::
