---
sidebar_position: 12
title: "🪝 Webhook for New Sign Ups"
---

Overview
--------

Open WebUI provides a webhook feature that allows you to receive notifications automatically whenever new users sign up to your instance. This is done by providing a webhook URL to Open WebUI, which will then send notifications to that URL when a new user account is created.

Configuring Webhooks in Open WebUI
---------------------------------

You will need to obtain a webhook URL from an external service that supports webhooks, such as a Discord channel or a Slack workspace. This URL will be used to receive notifications from Open WebUI.

To configure webhooks in Open WebUI, you have two options:

### Option 1: Configure through the Admin Interface

1. Log in to your Open WebUI instance as an administrator.
2. Navigate to the `Admin Panel`.
3. Click the `Settings` tab located at the top.
4. From there, navigate to the `General` sectionn of the setting in the admin panel.
5. Locate the `Webhook URL` field and enter the webhook URL.
6. Save the changes.

### Option 2: Configure through Environment Variables

Alternatively, you can configure the webhook URL by setting the `WEBHOOK_URL` environment variable. For more information on environment variables in Open WebUI, see [Environment Variable Configuration](https://docs.openwebui.com/getting-started/advanced-topics/env-configuration/#webhook_url).

### Step 3: Verify the Webhook

To verify that the webhook is working correctly, create a new user account in Open WebUI. If the webhook is configured correctly, you should receive a notification at the specified webhook URL.

Webhook Payload Format
----------------------

The webhook payload sent by Open WebUI is in plain text and contains a simple notification message about the new user account. The payload format is as follows:

```
New user signed up: <username>
```

For example, if a user named "Tim" signs up, the payload sent would be:

```
New user signed up: Tim
```

Troubleshooting
--------------

* Make sure the webhook URL is correct and properly formatted.
* Verify that the webhook service is enabled and configured correctly.
* Check the Open WebUI logs for any errors related to the webhook.
* Verify the connection hasn't been interrupted or blocked by a firewall or proxy.
* The webhook server could be temporarily unavailable or experiencing high latency.
* If provided through the webhook service, verify if the Webhook API key is invalid, expired, or revoked.

Note: The webhook feature in Open WebUI is still evolving, and we plan to add more features and event types in the future.
