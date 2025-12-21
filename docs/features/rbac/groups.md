---
sidebar_position: 3
title: "Groups"
---


Groups in Open WebUI are a powerful mechanism for organizing users and managing access control at scale. They serve two primary purposes:
1.  **Permission Management:** Assigning granular permissions to multiple users efficiently.
2.  **Resource Access Control:** controlling who can access specific private resources (Models, Knowledge Bases, Tools).

:::info Permission Merging Logic
Open WebUI permissions are **additive** (Union-based).
*   If a user is in multiple groups, they receive the **superset** of all permissions.
*   If *Group A* allows "Image Generation" and *Group B* does not, a user in both groups **WILL** have access to Image Generation.
*   "Deny" permissions do not exist; you can only "Grant" permissions.
:::

## Group Management

Groups can be managed in the **Admin Panel > Groups** section.

### Group Configuration
When creating or editing a group, you can configure its visibility in the system:

*   **Allow Group Sharing**: (Default: **On**)
    *   **Enabled**: The group will appear in the "Access Control" dropdowns when users share Chat items, Models, or Knowledge lists. Use this for teams or project groups that need to collaborate on content.
    *   **Disabled**: The group is **hidden** from sharing menus. This is designed for groups used solely for **RBAC Permission assignment** (e.g., granting "Image Generation" rights). Hiding these prevents the Sharing UI from becoming cluttered with technical/administrative groups.

:::tip Strategy: Permission Groups vs. Sharing Groups
To maintain a clean and manageable system, consider separating your groups into two distinct categories using a naming scheme:

1.  **Permission Groups** (e.g., prefix `[Perms]`, `Role-`, or `P-`)
    *   **Purpose**: Exclusively for granting features (e.g., `[Perms] Image Gen`, `[Perms] Web Search`).
    *   **Config**: Disable **Allow Group Sharing**.
    *   **Result**: Users get the features they need, but these technical groups don't clutter the "Share" menu.

2.  **Sharing Groups** (e.g., prefix `Team-`, `Project-`, or normal names)
    *   **Purpose**: Exclusively for organizing people (e.g., `Marketing`, `Engineering`, `Team Alpha`) to share resources.
    *   **Config**: Enable **Allow Group Sharing**.
    *   **Best Practice**: **Disable all permissions** in these groups.
        *   Rely on *Global Default Permissions* (or separate *Permission Groups*) for feature rights.
        *   *Why?* This ensures painless **Permission Revocation**. If you decide to disable a feature (e.g., "Web Search") globally, it will instantly take effect for everyone. If your Sharing Groups had "Web Search" enabled, you would have to manually update every single group to remove the right, as the Group's `True` status would override the Global `False`. Keep functional groups clean to maintain Global control.
:::

### Creation Methods
*   **Manual Creation:** Administrators can manually create groups and add users via the UI.
*   **OAuth Synchronization:** If `ENABLE_OAUTH_GROUP_MANAGEMENT` is enabled, groups can be synced from your OAuth provider (e.g., Keycloak, Azure AD).
    *   **Auto-Creation:** With `ENABLE_OAUTH_GROUP_CREATION`, groups that don't exist locally will be created automatically.
    *   **Membership Sync:** Users are strictly added/removed from groups to match their OAuth claims.

### Group Structure
A group definition typically includes:
*   **Name**: The display name of the group.
*   **Description**: Purpose of the group.
*   **Permissions**: A detailed JSON object overriding default user permissions (see [Permissions](./permissions.md)).
*   **Members**: A list of User IDs belonging to the group.

## Assigning Permissions to Groups

When editing a group, you can toggle specific permissions.
*   **Default State**: By default, a group grants *no* extra permissions; members rely on the global defaults.
*   **Granting Access**: Toggling a permission (e.g., "Web Search") to **ON** for a group means all members get that feature, even if it's disabled globally.

## Resource Access (RBAC)

You can restrict access to specific objects (like a proprietary Model or sensitive Knowledge Base) using Groups.

1.  **Tag the Resource**: When creating/editing a Model or Knowledge Base, set its visibility to **Private** or **Restricted**.
2.  **Grant Access**: Select the specific **Groups** (or individual users) that should have "Read" or "Write" access.

### Access Control Object
At a deeper level, resources store an access control list (ACL) looking like this:

```json
{
  "read": {
    "group_ids": ["marketing-team-id", "admins-id"],
    "user_ids": []
  },
  "write": {
    "group_ids": ["admins-id"],
    "user_ids": ["editor-user-id"]
  }
}
```
*   **Read**: Users can view and use the resource.
*   **Write**: Users can update or delete the resource.
