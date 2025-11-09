---
sidebar_position: 17
title: "🪝 Webhook Integrations"
---

## Overview

Open WebUI offers two distinct webhook integrations to help you stay informed about events happening within your instance. These webhooks allow you to receive automated notifications in external services like Discord, Slack, or any other application that supports incoming webhooks.

There are two types of webhooks available:

1.  **Admin Webhook:** A system-wide webhook that notifies administrators about new user sign-ups.
2.  **User Webhook:** A personal webhook that notifies individual users when a response to their chat is ready, especially useful for long-running tasks.

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

## Troubleshooting

If you're not receiving webhook notifications, here are a few things to check:

-   **Verify the URL:** Ensure the webhook URL is correct and properly pasted into the settings field.
-   **Service Configuration:** Double-check that the webhook is set up correctly in the external service (e.g., Discord, Slack).
-   **Firewall/Proxy:** Make sure your network or firewall is not blocking outgoing requests from the Open WebUI server.
-   **Open WebUI Logs:** Check the Open WebUI server logs for any error messages related to webhook failures.

:::note

The webhook features in Open WebUI are continuously being improved. Stay tuned for more event types and customization options in future updates.

:::
