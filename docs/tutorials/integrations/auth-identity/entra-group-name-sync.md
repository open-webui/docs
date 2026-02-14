---
sidebar_position: 15
title: "Entra ID Group Sync"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# Microsoft Entra ID Group Name Sync

By default, when you configure Microsoft Entra ID OAuth and automatic group creation with Open WebUI, security groups are synced using their **Group IDs (GUIDs)** rather than human-readable group names. This is a Microsoft limitation where the ID token doesn't include group display names by default.

This tutorial explains how to configure Microsoft Entra ID to return group **names** instead of IDs, enabling a much better user experience when working with groups in Open WebUI.

## Prerequisites

- An Open WebUI instance configured with [Microsoft OAuth](/features/access-security/auth/sso#microsoft)
- An Azure account with permissions to modify App Registrations
- Access to the Microsoft Entra admin center
- Basic understanding of Microsoft Entra ID application configuration

## Overview

To get human-readable group names in Open WebUI, you need to:

1. Configure your App Registration to include groups in the token
2. Modify the application manifest to use `cloud_displayname`
3. Set `groupMembershipClaims` to `ApplicationGroup` only
4. Assign security groups to the Enterprise Application
5. Configure Open WebUI environment variables for [OAuth Group Management](/features/access-security/auth/sso#oauth-group-management)

:::info Key Requirement

The `cloud_displayname` property in the manifest **only works** when `groupMembershipClaims` is set to `ApplicationGroup`. If you include other options (like `SecurityGroup` or `All`), the token will revert to using Group IDs instead of names.

:::

## Step 1: Configure Token Claims in App Registration

1. Navigate to the **Microsoft Entra admin center** > **App registrations**
2. Select your Open WebUI application
3. Go to **Token configuration** in the left menu
4. Click **Add groups claim**
5. Select **Security groups** (or the appropriate group type for your needs)
6. Under **Customize token properties by type**, ensure groups are added for:
   - ID token
   - Access token
7. Click **Add**

## Step 2: Modify the Application Manifest

This is the critical step that enables group names instead of IDs.

1. In your App Registration, go to **Manifest** in the left menu
2. Locate the `optionalClaims` section
3. Add `cloud_displayname` to the `additionalProperties` array for each token type

Your manifest should look like this:

```json
"optionalClaims": {
    "idToken": [
        {
            "name": "groups",
            "source": null,
            "essential": false,
            "additionalProperties": [
                "cloud_displayname"
            ]
        }
    ],
    "accessToken": [
        {
            "name": "groups",
            "source": null,
            "essential": false,
            "additionalProperties": [
                "cloud_displayname"
            ]
        }
    ],
    "saml2Token": [
        {
            "name": "groups",
            "source": null,
            "essential": false,
            "additionalProperties": [
                "cloud_displayname"
            ]
        }
    ]
}
```

4. **Critical**: Set `groupMembershipClaims` to `ApplicationGroup` only:

```json
"groupMembershipClaims": "ApplicationGroup"
```

:::warning

If `groupMembershipClaims` includes other values like `SecurityGroup` or `All`, the `cloud_displayname` property will be ignored and the token will contain Group IDs instead of names. See [Microsoft's optional claims documentation](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims) for more details.

:::

5. Click **Save**

## Step 3: Assign Groups to the Enterprise Application

When using `ApplicationGroup`, only groups explicitly assigned to the Enterprise Application will be included in the token.

1. Navigate to **Microsoft Entra admin center** > **Enterprise applications**
2. Find and select your Open WebUI application
3. Go to **Users and groups** in the left menu
4. Click **Add user/group**
5. Select the security groups you want to sync with Open WebUI
6. Click **Assign**

:::warning Multiple Group Assignment

When a user belongs to multiple groups, ensure all relevant groups are assigned to the Enterprise Application. Note that only groups explicitly assigned here will appear in the user's token and subsequently sync to Open WebUI.

:::

## Step 4: Configure API Permissions

Ensure your App Registration has the required Microsoft Graph permissions:

1. In your App Registration, go to **API permissions**
2. Click **Add a permission** > **Microsoft Graph** > **Delegated permissions**
3. Add the following permissions from the OpenID section if not already present:
   - `openid`
   - `email`
   - `profile`
4. Click **Grant admin consent for [your organization]**

## Step 5: Configure Open WebUI Environment Variables

Configure the following environment variables for your Open WebUI deployment. For more details on each variable, see the [environment variable documentation](/reference/env-configuration).

```bash
# Required: Your public WebUI address
WEBUI_URL=https://your-open-webui-domain

# Microsoft OAuth Configuration (required)
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_CLIENT_TENANT_ID=your_tenant_id
MICROSOFT_REDIRECT_URI=https://your-open-webui-domain/oauth/microsoft/callback

# Required for logout to work properly
OPENID_PROVIDER_URL=https://login.microsoftonline.com/your_tenant_id/v2.0/.well-known/openid-configuration

# Enable OAuth signup
ENABLE_OAUTH_SIGNUP=true

# OAuth Group Management
OAUTH_GROUP_CLAIM=groups
ENABLE_OAUTH_GROUP_MANAGEMENT=true
ENABLE_OAUTH_GROUP_CREATION=true

# Recommended: Set a consistent secret key
WEBUI_SECRET_KEY=your_secure_secret_key
```

### Environment Variable Reference

| Variable                        | Default  | Description                                                                                                                                      |
| ------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OAUTH_GROUP_CLAIM`             | `groups` | The claim in the ID/access token containing the user's group memberships.                                                                        |
| `ENABLE_OAUTH_GROUP_MANAGEMENT` | `false`  | When `true`, user group memberships are synchronized with OAuth claims upon each login.                                                          |
| `ENABLE_OAUTH_GROUP_CREATION`   | `false`  | When `true`, enables **Just-in-Time (JIT) group creation** - groups present in OAuth claims but not in Open WebUI will be created automatically. |

:::warning Strict Group Synchronization

When `ENABLE_OAUTH_GROUP_MANAGEMENT` is set to `true`, a user's group memberships in Open WebUI are **strictly synchronized** with the groups received in their OAuth claims upon each login.

- Users will be **added** to Open WebUI groups that match their OAuth claims.
- Users will be **removed** from any Open WebUI groups (including those manually assigned within Open WebUI) if those groups are **not** present in their OAuth claims for that login session.

:::

## Verification

After completing the configuration:

1. **Test the token**: Use [https://jwt.ms](https://jwt.ms) to decode your ID token and verify that the `groups` claim contains display names instead of GUIDs.
2. **Log in as a non-admin user**: Admin users' group memberships are not automatically updated via OAuth group management. Use a standard user account for testing.
3. **Check Open WebUI**: Navigate to the Admin Panel and verify that groups appear with readable names.

:::info Admin Users

Admin users' group memberships are **not** automatically updated via OAuth group management. If you need to test the configuration, use a non-admin user account.

:::


## Additional Resources

- [SSO (OAuth, OIDC, Trusted Header)](/features/access-security/auth/sso) - OAuth configuration overview
- [OAuth Group Management](/features/access-security/auth/sso#oauth-group-management) - Group synchronization details
- [Groups](/features/access-security/rbac/groups) - Group management in Open WebUI
- [SSO Troubleshooting Guide](/troubleshooting/sso) - Common OAuth issues and solutions
- [Environment Configuration](/reference/env-configuration) - All environment variables
- [Microsoft Optional Claims Documentation](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims) - Microsoft's official documentation
