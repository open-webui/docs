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

Groups can be managed in the **Admin Panel > Users > Groups** section.

### Group Configuration
When creating or editing a group, you can configure its visibility in the system:

*   **Who can share to this group**: (Access Control setting)
    *   **Anyone**: (Default) Any user on the platform can see this group in the "Access Control" menus for Sharing and share Chat items, Models, Prompts, or Knowledge Bases to it.
    *   **Members**: Only users who are **already members** of this group will see it as an option in the "Access Control" menus for Sharing. This is the ideal setting for private team collaboration (e.g., a "Marketing" team), ensuring only teammates can share resources (Models, Prompts, Knowledge) with each other.
    *   **No one**: The group is completely **hidden** from sharing menus for non-administrators. This is perfect for technical groups used exclusively for **RBAC Permission assignment** (e.g., a "High-Tier Users" group) where content sharing is not required.

:::tip Strategy: Permission Groups vs. Sharing Groups
To maintain a clean and manageable system, consider separating your groups into two distinct categories using a naming scheme:

1.  **Permission Groups** (e.g., prefix `[Perms]`, `Role-`, or `P-`)
    *   **Purpose**: Exclusively for granting features (e.g., `[Perms] Image Gen`, `[Perms] Web Search`).
    *   **Config**: Set "Who can share" to **No one**.
    *   **Result**: Users get the features they need, but these technical groups don't clutter the "Share" menu.

2.  **Sharing Groups** (e.g., prefix `Team-`, `Project-`, or normal names)
    *   **Purpose**: Exclusively for organizing people (e.g., `Marketing`, `Engineering`, `Team Alpha`) to share resources.
    *   **Config**: Set "Who can share" to **Members** or **Anyone**.
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

You can restrict access to specific objects (like a proprietary Model or sensitive Knowledge Base) using Groups or individual user grants.

1.  **Tag the Resource**: When creating/editing a Model or Knowledge Base, set its visibility to **Private**.
2.  **Grant Access**: Select the specific **Groups** or **individual users** that should have "Read" or "Write" access. The redesigned access control UI makes it easy to add multiple groups or users at once.

The **Add Access** picker offers only the people and groups that do not have access yet, so the list gets shorter as you grant access and nobody can be added a second time. When there is nothing left to offer it says **No users were found.** instead of leaving a **Users** heading above an empty list.

Their row in the **Access List** is where you change what someone already has. Each row carries the level (a **Read**/**Write** selector on resources that accept write grants, a **Read** badge on the ones that do not) and an **✕** that removes the grant.

:::tip Knowledge Scoping for Models
Beyond visibility, knowledge access is also scoped by model configuration. When a model has **attached knowledge bases**, it can only access those specific KBs (not all user-accessible KBs). See [Knowledge Scoping with Native Function Calling](/features/workspace/knowledge#scoped-access-keeps-things-organized) for details.
:::

### What Private Means for Each Resource Type

Two kinds of resource share the same access control dropdown, and **Private** with an empty access list means something different for each.

**Workspace items have an owner.** Every model, knowledge base, prompt, tool, skill, note, folder, and shared chat has an owner, the account that created it. Private with no grants means only the owner can see and use the item. Other admins are not let in on role alone: they see the item when `BYPASS_ADMIN_ACCESS_CONTROL` is on (the default) or when a grant names them or one of their groups. The **No access grants. Private to you.** message in the modal describes this case.

**Admin-configured resources have no owner.** External tool servers, MCP servers, Open Terminal connections, and arena models are instance configuration, added and edited only by admins. Private with no grants means admin-only: every admin can see and use the resource, and no regular user can, until you grant a group or a user. Turning `BYPASS_ADMIN_ACCESS_CONTROL` off does not change this, because there is no owner to fall back to.

### Combining Public with the Access List

**Public** is stored as one more grant: read access for every signed-in user. Choosing Public or Private in the dropdown adds or removes only that grant. Rows in the access list stay where they are, so switching a resource back to Private later makes the rows take effect again at once.

The rows behave like this on a Public resource:

*   A **Read** row adds nothing while the resource stays Public, since everyone already has read access. It matters again the moment you switch back to Private.
*   A **Write** row is the useful combination: everyone can view and use the resource, and that user or group can also update or delete it. Choosing Write on a row stores read and write together.
*   **Allow public write access**, on resources that offer it, stores write access for every signed-in user. With it on, the rows add nothing, but they stay for the day you switch it off.

Public means every signed-in user. It does not open the resource to visitors without an account.

### Access Grant System
At a deeper level, resource access is managed through normalized **access grants** stored in the database. Each grant specifies:

*   **Resource**: The type and ID of the resource (e.g., a specific model or knowledge base).
*   **Principal**: Who receives access, either a **group** or an **individual user**.
*   **Permission**: The level of access, `read` or `write`.

For example, granting the "Marketing" group read access and a specific editor user write access to a model would create two separate grant entries. Public access is represented by a user grant with a wildcard (`*`) principal.

*   **Read**: Users can view and use the resource.
*   **Write**: Users can update or delete the resource.

### Previewing Access (Audit)

When access grants span many groups and resources, it's easy to lose track of who can see what. Open WebUI ships an admin-only **Preview Access** view that resolves every access grant for a specific user or group and lists the result in one place, no need to crawl through individual resource pages.

**For a user**: In **Admin Panel > Users**, hover over a non-admin user row and click the eye-style **Preview Access** button. The modal shows every model, knowledge base, and tool the user can read, aggregated across all of their group memberships and any direct user grants, **plus the resources they own themselves**, which they can always read without a grant existing for them. Models that have been deactivated are left out, since nobody reaches them.

**For a group**: In **Admin Panel > Users > Groups**, open the group editor and use the **Preview Group Access** panel. The output is the same shape (models, knowledge, tools), scoped to just that group's grants.

Both views are admin-only and read-only: they reflect what the access-grant table currently says without modifying it. Use them after a permission change to confirm the result matches intent, or as part of a periodic RBAC audit.

Programmatic equivalents:

- `GET /api/v1/users/{user_id}/preview`: user view (admin auth required)
- `GET /api/v1/groups/id/{id}/preview`: group view (admin auth required)
