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
*   **Access Control Exceptions**: If `BYPASS_ADMIN_ACCESS_CONTROL` is disabled, Admins may require explicit permissions to access private model/knowledge/notes resources.

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
*   **Headless Admin Creation:** For automated/containerized deployments, you can create the admin account automatically using environment variables (see below).
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

## Headless Admin Account Creation

For **automated deployments** (Docker, Kubernetes, cloud platforms) where manual interaction is impractical, Open WebUI supports creating an admin account automatically on first startup using environment variables.

### How It Works

When the following environment variables are configured:
- `WEBUI_ADMIN_EMAIL`: The admin account email address
- `WEBUI_ADMIN_PASSWORD`: The admin account password
- `WEBUI_ADMIN_NAME`: (Optional) The admin display name (defaults to "Admin")

Open WebUI will automatically:
1. Check if any users exist in the database on startup
2. If the database is empty (fresh installation), create an admin account using the provided credentials
3. Securely hash and store the password
4. Automatically disable sign-up (`ENABLE_SIGNUP=False`) to prevent unauthorized account creation

### Use Cases

This feature is particularly useful for:
- **CI/CD Pipelines**: Automatically provision Open WebUI instances with admin credentials from secrets management
- **Docker/Kubernetes Deployments**: Eliminate the time gap between container startup and manual admin creation
- **Automated Testing**: Create reproducible test environments with pre-configured admin accounts
- **Headless Servers**: Deploy instances where accessing the UI to manually create an account is impractical

### Example Configuration

#### Docker Compose
```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - WEBUI_ADMIN_EMAIL=admin@example.com
      - WEBUI_ADMIN_PASSWORD=${ADMIN_PASSWORD}  # Use secrets management
      - WEBUI_ADMIN_NAME=System Administrator
    # ... other configuration
```

#### Kubernetes Secret
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: openwebui-admin
type: Opaque
stringData:
  admin-email: admin@example.com
  admin-password: your-secure-password
  admin-name: System Administrator
---
apiVersion: v1
kind: Pod
metadata:
  name: open-webui
spec:
  containers:
  - name: open-webui
    image: ghcr.io/open-webui/open-webui:main
    env:
    - name: WEBUI_ADMIN_EMAIL
      valueFrom:
        secretKeyRef:
          name: openwebui-admin
          key: admin-email
    - name: WEBUI_ADMIN_PASSWORD
      valueFrom:
        secretKeyRef:
          name: openwebui-admin
          key: admin-password
    - name: WEBUI_ADMIN_NAME
      valueFrom:
        secretKeyRef:
          name: openwebui-admin
          key: admin-name
```

### Important Notes

:::warning Security Considerations
- **Use Secrets Management**: Never hardcode `WEBUI_ADMIN_PASSWORD` in Docker Compose files or Dockerfiles. Use Docker secrets, Kubernetes secrets, or environment variable injection.
- **Strong Passwords**: Use a strong, unique password for production deployments.
- **Change After Setup**: Consider changing the admin password through the UI after initial deployment for enhanced security.
- **Automatic Signup Disable**: After admin creation, sign-up is automatically disabled. You can re-enable it later via **Admin Panel > Settings > General** if needed.
:::

:::info Behavior Details
- **Only on Fresh Install**: The admin account is created **only** if no users exist in the database. If users already exist, these environment variables are ignored.
- **Password Hashing**: The password is securely hashed using the same mechanism as manual account creation, ensuring security.
- **One-Time Operation**: This is a one-time operation on first startup. Subsequent restarts with the same environment variables will not modify the existing admin account.
:::

For complete documentation on these environment variables, see the [Environment Configuration Guide](/reference/env-configuration#webui_admin_email).

