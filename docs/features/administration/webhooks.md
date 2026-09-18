---
sidebar_position: 17
title: "Webhook Integrations"
---

## Overview

Open WebUI offers three distinct webhook integrations to help you stay informed about events happening within your instance and enable external integrations. These webhooks allow you to receive automated notifications in external services like Discord, Slack, or any other application that supports incoming webhooks, as well as post messages from external services into Open WebUI channels.

There are three types of webhooks available:

1.  **Event Webhooks:** admin-configured webhooks that receive events from the catalog (sign-ups, user changes, chats, channels, files, models, configuration, startup and shutdown), each with a name, URL, event filter and audience.
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
2.  Navigate to **Settings > Admin > General**.
3.  Scroll to **Events** > **Webhooks** and click **+**. Give the webhook a name and URL, choose **Send events for** and **Events**, then save. Existing entries have **Configure** and **Delete**.
4.  Enter the webhook URL provided by your external service (e.g., Discord, Slack).
5.  Click **"Save"**.

#### Option 2: Through Environment Variables

A `WEBHOOK_URL` environment variable is migrated once at startup into a **Default webhook** subscribed to every event. Narrow it to `auth.signup` or `user.created` if you only want sign-ups. For more details, refer to the [Environment Variable Configuration](https://docs.openwebui.com/reference/env-configuration/#webhook_url) documentation.

### Payload Format

When a matching event fires, Open WebUI sends a `POST` request to the configured URL. A form sign-up fires `user.created` and then `auth.signup`, so a webhook subscribed to every event posts twice. Users created through OAuth, LDAP, SCIM or by an admin fire only `user.created`, with `source` set accordingly. Generic URLs receive the event envelope; Slack and Google Chat get `{"text": ...}`, Discord `{"content": ...}`, and Teams a MessageCard.

**Payload Example:**

```json
{
  "schema": "0.11.3",
  "id": "8b1f...",
  "event": "auth.signup",
  "resource": "auth",
  "operation": "signup",
  "created_at": 1758150000,
  "source": "api",
  "actor": {"type": "user", "id": "...", "name": "Tim", "email": "tim@example.com", "role": "pending"},
  "subject": {"type": "user", "id": "..."},
  "data": {"email": "tim@example.com"}
}
```

## 2. User Webhook: Notification Targets

This webhook lets individual users be notified when something they care about happens, such as a model finishing a long response, a channel message arriving, or a calendar alert firing. It is useful when you have navigated away from the Open WebUI tab.

Each user configures one or more **notification targets** in **Settings > Notifications**, and chooses per target which events it receives and whether it fires only while they are away or always. The model can also send a notification itself through the `notify` tool.

See **[Notifications](/features/chat-conversations/chat-features/notifications)** for the full feature: targets, the five subscribable events, delivery modes, URL masking, and the `notify` tool.

### Use Case

- **Long-Running Task Alerts:** If you submit a complex prompt that takes several minutes to process, you can close the browser tab and still be notified the moment the response is ready. This allows you to work on other tasks without having to constantly check the Open WebUI interface.

### How it Works

With the default **away** delivery, a notification is only sent if you are **not actively using the WebUI**, so you are not pinged about something you are already watching. Setting a target to **always** sends regardless. Channel messages are always delivered, since they come from someone else.

### Enabling/Disabling User Webhooks

User webhooks are disabled by default. Administrators can enable this feature for all users when needed, or keep it disabled to prevent external requests.

This can be done in two ways:

1.  **Directly in the Admin Panel:**
    - Go to **Settings > Admin > General > Features**.
    - Toggle the switch for **"User Webhooks"**.

2.  **Using Environment Variables:**
    - The feature is off by default. `ENABLE_USER_WEBHOOKS` defaults to `False`, and so does the **User Webhooks** permission, so to offer it set `ENABLE_USER_WEBHOOKS=True` (or the toggle) and grant the permission. Setting it to `False` turns it back off and hides the setting from user profiles.

Users also need the `features.webhooks` permission ([`USER_PERMISSIONS_FEATURES_USER_WEBHOOKS`](/reference/env-configuration#user_permissions_features_user_webhooks)); admins always have it.

### Configuration

1.  Click on your profile picture in the bottom-left corner to open the settings menu.
2.  Navigate to **Settings > Notifications**.
3.  Add a target with your webhook URL, and pick the events it should receive.
4.  Use **Send Test** to confirm it works.

:::info Upgrading from the old Notification Webhook field
The single **Notification Webhook** field under **Settings > Account** has been replaced by targets. An existing URL is migrated automatically into a target subscribed to all events, so notifications keep arriving without any action.
:::

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
5.  Click **New Webhook**. This creates a live webhook named "New Webhook" at once. **Save** only applies later name and image edits.
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

The webhook URL remains the same when you update the name or image. All messages posted by the webhook, earlier ones included, show its current name and image.

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
curl -X POST "https://your-instance.com/api/v1/channels/webhooks/{webhook_id}/{token}" \
  -H "Content-Type: application/json" \
  -d '{"content": "Deployment to production completed successfully! 🚀"}'
```

#### Example: Using Python

```python
import requests

webhook_url = "https://your-instance.com/api/v1/channels/webhooks/{webhook_id}/{token}"
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
- If a webhook is deleted, its messages remain visible but show "Deleted Webhook" with the default avatar
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
