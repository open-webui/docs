---
sidebar_position: 3
title: "👥 User Groups"
---
## Overview

The User Group feature introduced in Open WebUI allows users with admin access to define and manage access levels for different groups of users. This feature enhances flexibility by providing the ability to assign varying permissions and roles to users based on their needs and responsibilities.

Administrators can manage users and groups directly from the **Admin Panel**, which includes two main sections: **Users** and **Groups**.

## Managing User Groups

### Roles

There are three default roles for users within a group:
1. **Pending**: Users awaiting approval for their account to be activated.
2. **User**: Standard users with permissions defined by the group settings.
3. **Admin**: Users with access to all features, models, tools, and other system capabilities.
:::note
Admins can view the chat history of users, including those with pending access.
:::
### Admin Panel: Groups 

The **Groups** section in the Admin Panel enables administrators to:
- **Define Access Levels**: Adjust the default permission levels for normal users.
- **Create New User Groups**: Introduce custom user levels with specific permissions.
- **Assign Permissions**: Control access to workspace, tools, models, and other features for each group.
- **Assign Users to Groups**: Assign users to specific groups.

:::note
To add new tools, users must have access to **Tools**. The same applies to managing **Knowledge** and **Prompts**.
:::
:::info
Users cannot view tools, prompts, or knowledge items added by others. However, admins have full visibility and can access all tools, prompts, and knowledge items, regardless of who added them.

![User Tools Permission Demo](/img/tools-user.png)
#### Users can only view the tools they have added themselves.
![Admin Tools Permission Demo](/img/tools-admin.png )
#### Admins can view all the tools.
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
    Admins are unable to grant users direct access to Functions.
   :::

4. **Manage Users**:
   - Assign users to groups by navigating to the **Groups** => **Edit User Group** section.
   - Within **Users** tab you can select the users who you want them in this group.

