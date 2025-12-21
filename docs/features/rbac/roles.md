---
sidebar_position: 3
title: "Roles"
---


Open WebUI defines three primary **System Roles** that determine the fundamental access level of a user account. These roles are distinct from [Groups](./groups.md) and [Permissions](./permissions.md).

| Role | Keyword | Description |
| :--- | :--- | :--- |
| **Admin** | `admin` | **Superuser**. Full control over the system. |
| **User** | `user` | **Standard User**. Subject to RBAC permissions. |
| **Pending** | `pending` | **Restricted**. No access until approved. |

## Role Details

### Administrator (`admin`)
The Admin role is designed for system maintainers.
*   **Full Access**: default access to all resources and settings.
*   **Management**: Can manage users, groups, and global configurations.
*   **Bypass**: Bypasses most permission checks by default.

:::warning Admin Limitations & Best Practices
While Administrators generally have unrestricted access, certain system configurations can limit their capabilities for security and privacy:
*   **Privacy Controls**: Environment variables like `ENABLE_ADMIN_CHAT_ACCESS=False` can prevent Admins from viewing user chats.
*   **Strict Feature Checks**: Critical security features like **API Keys** (`features.api_keys`) require explicit permission, even for Admins.
*   **Access Control Exceptions**: If `BYPASS_ADMIN_ACCESS_CONTROL` is disabled, Admins may require explicit permissions to access private model/knowledge resources.

For a robust security posture, we recommend including Admins in your permission schema (via Groups) rather than relying solely on the role's implicit bypasses. This ensures consistent access if bypass limitations are ever enabled.
:::

### Standard User (`user`)
This is the default functional role for team members.
*   **Subject to Permissions**: Does not have implicit access. All capabilities must be granted via **Global Default Permissions** or **Group Memberships**.
*   **Additive Rights**: As explained in the [Permissions](./permissions.md) section, their effective rights are the sum of all their grants.

### Pending User (`pending`)
The default state for new sign-ups (if configured) or deactivated users.
*   **Zero Access**: Cannot perform any actions or see any content.
*   **Approval Required**: Must be promoted to `user` or `admin` by an existing Administrator.

:::note
The `admin` role effectively has `check_permission() == True` for everything. Granular permissions (like disabling "Web Search") generally do **not** apply to admins.
:::

## Role Assignment

### Initial Setup
*   **First User:** The very first account created on a fresh installation is automatically assigned the **Admin** role.
*   **Subsequent Users:** New sign-ups are assigned the **Default User Role**.

### Configuration
You can control the default role for new users via the `DEFAULT_USER_ROLE` environment variable:

```bash
DEFAULT_USER_ROLE=pending
# Options: 'pending', 'user', 'admin'
```
*   **pending (Recommended for public/shared instances):** New users cannot log in until an Admin explicitly activates them in the Admin Panel.
*   **user:** New users get immediate access with default permissions.
*   **admin:** (Use with caution) New users become full administrators.

## Changing Roles
Administrators can change a user's role at any time via **Admin Panel > Users**.
*   Promoting a user to `admin` grants them full control.
*   Demoting an admin to `user` subjects them to the permission system again.

