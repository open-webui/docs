---
sidebar_position: 3
title: "👥 User Groups"
---
The User Group feature introduced in Open WebUI allows users with admin access to define and manage access levels for different groups of users. This feature enhances flexibility by providing the ability to assign varying permissions and roles to users based on their needs and responsibilities.

Administrators can manage users and groups directly from the User page from the **Admin Panel**, which includes two main sections: **Users** and **Groups**.

## Managing User Groups

### Roles

There are three default roles for users within a group:
1. **Pending**: Users awaiting approval for their account to be activated.
2. **User**: Standard users with permissions defined by the group settings.
3. **Admin**: Users with access to all features, models, tools, and other system capabilities.
:::note
Admins can view the chat history of users, including those with pending access.
:::
### Groups 

The **Groups** section in the Admin Panel enables administrators to:
- **Define Access Levels**: Adjust the default permission levels for members with a **user** role.
- **Create New User Groups**: Introduce custom user access levels with specific permissions.
- **Assign Permissions**: Control access to workspace, tools, models, and other features for each group.
- **Assign Users to Groups**: Assign users to specific groups.

:::note
For example, to add new tools, users must have **workspace permission** and access to **Tools**. The same applies to managing **Knowledge** and **Prompts**. 
:::
:::info
Admins have full visibility and can access all tools, prompts, and knowledge items, regardless of who added them, however, Users cannot view tools, prompts, or knowledge items added by others. 

![User Tools Permission Demo](/img/tools-user.png)
**Figure 1**: Users can only view the tools they have added themselves.
![Admin Tools Permission Demo](/img/tools-admin.png )
**Figure 2**: Admins can view all the tools.
:::
:::info
Members with any access level (Admin, User) have access to use the tools, knowledge, and prompts.
:::
## Steps to Manage User Groups

1. **Navigate to the Admin Panel**:
   - Open the Admin Panel and select the **Users** => **Groups** section.
2. **Create or Modify Groups**:
   - To create a new group, click **Creat Group** and specify the group name and description.
   - To modify an existing group, select it from the list and adjust the settings.

3. **Assign Permissions**:
   - Define the default permissions for users in the group by navigating to the **Groups** => **Edit User Group** => **Permissions**.
   - Use the setting to give access to Workspace sections (Model, Tools, Promps, Knowledge), and Chat Permissions(File Upload, Chat Edit, Chat Delete, Temporary Chat).
   :::tip 
    Admins cannot grant users direct access to Functions, as they are advanced features that can only be managed through the admin panel.
   :::

4. **Manage Users**:
   - Assign users to groups by navigating to the **Groups** => **Edit User Group** section.
   - Within **Users** tab you can select the users who you want them in this group.

