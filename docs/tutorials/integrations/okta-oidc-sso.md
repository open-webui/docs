---
sidebar_position: 40
title: "🔗 Okta OIDC SSO Integration"
---

:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# 🔗 Okta OIDC SSO Integration

## Overview

This documentation page outlines the steps required to integrate Okta OIDC Single Sign-On (SSO) with Open WebUI, including support for managing user groups based on Okta group membership. By following these steps, you will enable users to log in to Open WebUI using their Okta credentials and automatically assign them to relevant groups within Open WebUI.

### Prerequisites

*   A valid Open WebUI instance.
*   An Okta account with administrative privileges to create and configure applications.
*   Basic understanding of OIDC, Okta application configuration, and Open WebUI environment variables.

## Setting up Okta

First, you need to configure an OIDC application within your Okta organization and set up a groups claim to pass group information to Open WebUI.

### 1. Create/Configure OIDC Application in Okta

1.  Log in to your Okta Admin Console.
2.  Navigate to **Applications > Applications**.
3.  Either create a new **OIDC - OpenID Connect** application (choose **Web Application** as the type) or select an existing one you wish to use for Open WebUI.
4.  During setup or in the application's **General** settings tab, configure the **Sign-in redirect URIs**. Add the URI for your Open WebUI instance, followed by `/oauth/oidc/callback`. For example: `https://your-open-webui.com/oauth/oidc/callback`.
5.  Take note of the **Client ID** and **Client secret** provided on the application's **General** tab. You will need these for the Open WebUI configuration.
6.  Ensure the correct users or groups are assigned to this application under the **Assignments** tab.

### 2. Add a Groups Claim to the ID Token

To enable group management in Open WebUI, you need to configure Okta to send the user's group memberships in the ID token.

1.  In the Admin Console, go to **Applications > Applications** and select your OIDC client app.
2.  Go to the **Sign On** tab and click **Edit** in the **OpenID Connect ID Token** section.
3.  In the **Group claim type** section, select **Filter**.
4.  In the **Group claims filter** section:
    *   Enter `groups` as the claim name (or use the default if present).
    *   Select **Matches regex** from the dropdown.
    *   Enter `.*` in the regex field. This will include all groups the user is a member of. You can use a more specific regex if needed.
5.  Click **Save**.
6.  Click the **Back to applications** link.
7.  From the **More** button dropdown menu for your application, click **Refresh Application Data**.

*For more advanced group claim configurations, refer to the Okta documentation on [customizing tokens](https://developer.okta.com/docs/guides/customize-tokens-returned-from-okta/main/) and [group functions](https://developer.okta.com/docs/reference/okta-expression-language/#group-functions).*

## Configuring Open WebUI

To enable Okta OIDC SSO and group management in Open WebUI, you need to set the following environment variables for your Open WebUI instance:

```bash
# --- OIDC Core Settings ---
# Enable OAuth signup if you want users to be able to create accounts via Okta
# ENABLE_OAUTH_SIGNUP="true"

# Your Okta application's Client ID
OAUTH_CLIENT_ID="YOUR_OKTA_CLIENT_ID"

# Your Okta application's Client Secret
OAUTH_CLIENT_SECRET="YOUR_OKTA_CLIENT_SECRET"

# Your Okta organization's OIDC discovery URL
# Format: https://<your-okta-domain>/.well-known/openid-configuration
# Or for a specific authorization server: https://<your-okta-domain>/oauth2/<auth-server-id>/.well-known/openid-configuration
OPENID_PROVIDER_URL="YOUR_OKTA_OIDC_DISCOVERY_URL"

# Name displayed on the login button (e.g., "Login with Okta")
OAUTH_PROVIDER_NAME="Okta"

# Scopes to request (default is usually sufficient)
# OAUTH_SCOPES="openid email profile groups" # Ensure 'groups' is included if not default

# --- OAuth Group Management ---
# Enable group management feature
ENABLE_OAUTH_GROUP_MANAGEMENT="true"

# The claim name in the ID token containing group information (must match Okta config)
OAUTH_GROUP_CLAIM="groups"
```

Replace `YOUR_OKTA_CLIENT_ID`, `YOUR_OKTA_CLIENT_SECRET`, and `YOUR_OKTA_OIDC_DISCOVERY_URL` with the actual values from your Okta application configuration. Ensure `OAUTH_GROUP_CLAIM` matches the claim name you configured in Okta (default is `groups`).

Restart your Open WebUI instance after setting these environment variables.

## Verification

1.  Navigate to your Open WebUI login page. You should see a button labeled "Login with Okta" (or whatever you set for `OAUTH_PROVIDER_NAME`).
2.  Click the button and authenticate through the Okta login flow.
3.  Upon successful authentication, you should be redirected back to Open WebUI and logged in.
4.  If `ENABLE_OAUTH_GROUP_MANAGEMENT` is true, log in as a non-admin user. Their groups within Open WebUI should reflect their group memberships in Okta (after their first login). Note that admin users' groups are not automatically updated via SSO.
5.  Check the Open WebUI server logs for any OIDC or group-related errors if you encounter issues.

## Troubleshooting

*   **400 Bad Request/Redirect URI Mismatch:** Double-check that the **Sign-in redirect URI** in your Okta application exactly matches `<your-open-webui-url>/oauth/oidc/callback`.
*   **Groups Not Syncing:** Verify that the `OAUTH_GROUP_CLAIM` environment variable matches the claim name configured in the Okta ID Token settings. Ensure the user logged out and back in after group changes. Remember admin groups are not synced.
*   **Configuration Errors:** Review the Open WebUI server logs for detailed error messages related to OIDC configuration.
*   Refer to the official [Open WebUI SSO Documentation](../features/sso.md).
*   Consult the [Okta Developer Documentation](https://developer.okta.com/docs/).