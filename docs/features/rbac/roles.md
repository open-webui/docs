---
sidebar_position: 3
title: "Roles"
---

Open WebUI implements a structured role-based access control system with three primary user roles:

| **Role**      | **Description**                                   | **Default Creation**             |
|---------------|---------------------------------------------------|----------------------------------|
| Administrator | System administrator with full control            | First user account               |
| Regular User  | Standard user with limited permissions            | Subsequent approved users        |
| Pending       | Unapproved user awaiting administrator activation | New registrations (configurable) |

### Role Assignment

- **First User:** The first account created on a new Open WebUI instance automatically receives Administrator
  privileges.
- **Subsequent Users:** New user registrations are assigned a default role based on the `DEFAULT_USER_ROLE`
  configuration.

The default role for new registrations can be configured using the `DEFAULT_USER_ROLE` environment variable:

```.dotenv
DEFAULT_USER_ROLE=pending  # Options: pending, user, admin
```

When set to "pending", new users must be manually approved by an administrator before gaining access to the system.

## User Groups

Groups allow administrators to

- assign permissions to multiple users at once, simplifying access management
- limit access to specific resources (Models, Tools, etc) by setting their access to "private" then opening access to
specific groups
- Group access to a resource can be set as "read" or "write"

### Group Structure

Each group in Open WebUI contains:

- A unique identifier
- Name and description
- Owner/creator reference
- List of member user IDs
- Permission configuration
- Additional metadata

### Group Management

Groups can be:

- **Created manually** by administrators through the user interface
- **Synced automatically** from OAuth providers when `ENABLE_OAUTH_GROUP_MANAGEMENT` is enabled
- **Created automatically** from OAuth claims when both `ENABLE_OAUTH_GROUP_MANAGEMENT` and`ENABLE_OAUTH_GROUP_CREATION`
  are enabled

### OAuth Group Integration

When OAuth group management is enabled, user group memberships are synchronized with groups received in OAuth claims:

- Users are added to Open WebUI groups that match their OAuth claims
- Users are removed from groups not present in their OAuth claims
- With `ENABLE_OAUTH_GROUP_CREATION` enabled, groups from OAuth claims that don't exist in Open WebUI are automatically
  created
