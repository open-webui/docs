---
sidebar_position: 3
title: "Groups"
---

Groups allow administrators to

- assign permissions to multiple users at once, simplifying access management
- limit access to specific resources (Models, Tools, etc) by setting their access to "private" then opening access to specific groups
- Specify access to a resource for a group to either "read" or "write" (write access implies read)

:::info

Note that the permissions model is permissive. If a user is a member of two groups that define different permissions for a resource, the most permissive permission is applied.

:::

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

## Group Permissions

Groups can be used to make sets of permissions available to users. For example, a group could be created for "Data
Scientists" that has read and write access to all models, knowledge bases, and tools.

## Resource Access Control for Groups

Open WebUI implements granular access control for resources like models, knowledge bases, prompts, and tools. Access can
be controlled at both the user and group level.

To enable access control for a resource, set its access to "private" and then open access to specific groups.

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
