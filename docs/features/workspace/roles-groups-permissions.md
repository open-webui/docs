---
sidebar_position: 3
title: "👩‍💻 Roles, Groups and Permissions"
---

Open WebUI provides a comprehensive and flexible user management system with role-based access control and fine-grained
permissions. Administrators have granular control over user access, while integration with external authentication
providers enables seamless incorporation into existing identity infrastructure.

The role-based model with fine-grained permissions ensures that users only have access to the features and resources
appropriate for their role, maintaining security while providing flexibility for different deployment scenarios.

## User Roles

Open WebUI implements a structured role-based access control system with three primary user roles:

| **Role**      | **Description**                                   | **Default Creation**             |
|---------------|---------------------------------------------------|----------------------------------|
| Administrator | System administrator with full control            | First user account               |
| Regular User  | Standard user with limited permissions            | Subsequent approved users        | 
| Pending       | Unapproved user awaiting administrator activation | New registrations (configurable) |

### Role Assignment

* **First User:** The first account created on a new Open WebUI instance automatically receives Administrator
  privileges.
* **Subsequent Users:** New user registrations are assigned a default role based on the `DEFAULT_USER_ROLE`
  configuration.

The default role for new registrations can be configured using the `DEFAULT_USER_ROLE` environment variable:

```.dotenv
DEFAULT_USER_ROLE=pending  # Options: pending, user, admin
```

When set to "pending", new users must be manually approved by an administrator before gaining access to the system.

## User Groups

Groups allow administrators to
* assign permissions to multiple users at once, simplifying access management
* limit access to specific resources (Models, Tools, etc) by setting their access to "private" then opening access to 
specific groups
* Group access to a resource can be set as "read" or "write"

### Group Structure

Each group in Open WebUI contains:

* A unique identifier
* Name and description
* Owner/creator reference
* List of member user IDs
* Permission configuration
* Additional metadata

### Group Management

Groups can be:

* **Created manually** by administrators through the user interface
* **Synced automatically** from OAuth providers when `ENABLE_OAUTH_GROUP_MANAGEMENT` is enabled
* **Created automatically** from OAuth claims when both `ENABLE_OAUTH_GROUP_MANAGEMENT` and`ENABLE_OAUTH_GROUP_CREATION`
  are enabled

### OAuth Group Integration

When OAuth group management is enabled, user group memberships are synchronized with groups received in OAuth claims:

* Users are added to Open WebUI groups that match their OAuth claims
* Users are removed from groups not present in their OAuth claims
* With `ENABLE_OAUTH_GROUP_CREATION` enabled, groups from OAuth claims that don't exist in Open WebUI are automatically
  created

## Permission Framework

Open WebUI implements a comprehensive [permission system](./permissions.md) divided into three main categories:

1. Workspace Permissions
2. Chat Permissions
3. Features Permissions

Administrators can configure permissions for each category individually and configure the default permissions for each
category.

## Resource Access Control

Open WebUI implements granular access control for resources like models, knowledge bases, prompts, and tools. Access can
be controlled at both the user and group level.

### Access Control Structure

Resources like knowledge bases use an access control structure that specifies read and write permissions for both users
and groups:

```json
{
  "read": {
    "group_ids": ["group_id1", "group_id2"],
    "user_ids": ["user_id1", "user_id2"]
  },
  "write": {
    "group_ids": ["group_id1", "group_id2"],
    "user_ids": ["user_id1", "user_id2"]
  }
}
```

This structure allows for precise control over who can view and modify specific resources.

## Managing Permissions

Administrators can manage permissions in the following ways:

1. **User Interface:** The Workspace's Permissions section provides a graphical interface for configuring permissions.
2. **Environment Variables:** Permissions can be set using environment variables, which are stored as `PersistentConfig` variables.
3. **Group Management:** Assigning users to groups with predefined permissions.
