---
sidebar_position: 11
title: "SQLite Database Overview"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

> [!WARNING]
> This documentation was created/updated based on version 0.6.30.

## Open-WebUI Internal SQLite Database

For Open-WebUI, the SQLite database serves as the backbone for user management, chat history, file storage, and various other core functionalities. Understanding this structure is essential for anyone looking to contribute to or maintain the project effectively.

## Internal SQLite Location

You can find the SQLite database at `root` -> `data` -> `webui.db`

```txt
📁 Root (/)
├── 📁 data
│   ├── 📁 cache
│   ├── 📁 uploads
│   ├── 📁 vector_db
│   └── 📄 webui.db
├── 📄 dev.sh
├── 📁 open_webui
├── 📄 requirements.txt
├── 📄 start.sh
└── 📄 start_windows.bat
```

## Copy Database Locally

If you want to copy the Open-WebUI SQLite database running in the container to your local machine, you can use:

```bash
docker cp open-webui:/app/backend/data/webui.db ./webui.db
```

Alternatively, you can access the database within the container using:

```bash
docker exec -it open-webui /bin/sh
```

## Table Overview

Here is a complete list of tables in Open-WebUI's SQLite database. The tables are listed alphabetically and numbered for convenience.

| **No.** | **Table Name**   | **Description**                                              |
| ------- | ---------------- | ------------------------------------------------------------ |
| 01      | auth             | Stores user authentication credentials and login information |
| 02      | channel          | Manages chat channels and their configurations               |
| 03      | channel_member   | Tracks user membership and permissions within channels       |
| 04      | chat             | Stores chat sessions and their metadata                      |
| 05      | chatidtag        | Maps relationships between chats and their associated tags   |
| 06      | config           | Maintains system-wide configuration settings                 |
| 07      | document         | Stores documents and their metadata for knowledge management |
| 08      | feedback         | Captures user feedback and ratings                           |
| 09      | file             | Manages uploaded files and their metadata                    |
| 10      | folder           | Organizes files and content into hierarchical structures     |
| 11      | function         | Stores custom functions and their configurations             |
| 12      | group            | Manages user groups and their permissions                    |
| 13      | knowledge        | Stores knowledge base entries and related information        |
| 14      | memory           | Maintains chat history and context memory                    |
| 15      | message          | Stores individual chat messages and their content            |
| 16      | message_reaction | Records user reactions (emojis/responses) to messages        |
| 17      | migrate_history  | Tracks database schema version and migration records         |
| 18      | model            | Manages AI model configurations and settings                 |
| 19      | note             | Stores user-created notes and annotations                    |
| 20      | oauth_session    | Manages active OAuth sessions for users                      |
| 21      | prompt           | Stores templates and configurations for AI prompts           |
| 22      | tag              | Manages tags/labels for content categorization               |
| 23      | tool             | Stores configurations for system tools and integrations      |
| 24      | user             | Maintains user profiles and account information              |

Note: there are two additional tables in Open-WebUI's SQLite database that are not related to Open-WebUI's core functionality, that have been excluded:

- Alembic Version table
- Migrate History table

Now that we have all the tables, let's understand the structure of each table.

## Auth Table

| **Column Name** | **Data Type** | **Constraints** | **Description**   |
| --------------- | ------------- | --------------- | ----------------- |
| id              | String        | PRIMARY KEY     | Unique identifier |
| email           | String        | -               | User's email      |
| password        | Text          | -               | Hashed password   |
| active          | Boolean       | -               | Account status    |

Things to know about the auth table:

- Uses UUID for primary key
- One-to-One relationship with `users` table (shared id)

## Channel Table

| **Column Name** | **Data Type** | **Constraints** | **Description**                     |
| --------------- | ------------- | --------------- | ----------------------------------- |
| id              | Text          | PRIMARY KEY     | Unique identifier (UUID)            |
| user_id         | Text          | -               | Owner/creator of channel            |
| type            | Text          | nullable        | Channel type                        |
| name            | Text          | -               | Channel name                        |
| description     | Text          | nullable        | Channel description                 |
| data            | JSON          | nullable        | Flexible data storage               |
| meta            | JSON          | nullable        | Channel metadata                    |
| access_control  | JSON          | nullable        | Permission settings                 |
| created_at      | BigInteger    | -               | Creation timestamp (nanoseconds)    |
| updated_at      | BigInteger    | -               | Last update timestamp (nanoseconds) |

Things to know about the auth table:

- Uses UUID for primary key
- Case-insensitive channel names (stored lowercase)

## Channel Member Table

| **Column Name** | **Data Type** | **Constraints** | **Description**                              |
| --------------- | ------------- | --------------- | -------------------------------------------- |
| id              | TEXT          | NOT NULL        | Unique identifier for the channel membership |
| channel_id      | TEXT          | NOT NULL        | Reference to the channel                     |
| user_id         | TEXT          | NOT NULL        | Reference to the user                        |
| created_at      | BIGINT        | -               | Timestamp when membership was created        |

## Chat Table

| **Column Name** | **Data Type** | **Constraints**         | **Description**          |
| --------------- | ------------- | ----------------------- | ------------------------ |
| id              | String        | PRIMARY KEY             | Unique identifier (UUID) |
| user_id         | String        | -                       | Owner of the chat        |
| title           | Text          | -                       | Chat title               |
| chat            | JSON          | -                       | Chat content and history |
| created_at      | BigInteger    | -                       | Creation timestamp       |
| updated_at      | BigInteger    | -                       | Last update timestamp    |
| share_id        | Text          | UNIQUE, nullable        | Sharing identifier       |
| archived        | Boolean       | default=False           | Archive status           |
| pinned          | Boolean       | default=False, nullable | Pin status               |
| meta            | JSON          | server_default="{}"     | Metadata including tags  |
| folder_id       | Text          | nullable                | Parent folder ID         |

## Chat ID Tag Table

| **Column Name** | **Data Type** | **Constraints** | **Description**    |
| --------------- | ------------- | --------------- | ------------------ |
| id              | VARCHAR(255)  | NOT NULL        | Unique identifier  |
| tag_name        | VARCHAR(255)  | NOT NULL        | Name of the tag    |
| chat_id         | VARCHAR(255)  | NOT NULL        | Reference to chat  |
| user_id         | VARCHAR(255)  | NOT NULL        | Reference to user  |
| timestamp       | INTEGER       | NOT NULL        | Creation timestamp |

## Config

| **Column Name** | **Data Type** | **Constraints** | **Default**       | **Description**        |
| --------------- | ------------- | --------------- | ----------------- | ---------------------- |
| id              | INTEGER       | NOT NULL        | -                 | Primary key identifier |
| data            | JSON          | NOT NULL        | -                 | Configuration data     |
| version         | INTEGER       | NOT NULL        | -                 | Config version number  |
| created_at      | DATETIME      | NOT NULL        | CURRENT_TIMESTAMP | Creation timestamp     |
| updated_at      | DATETIME      | -               | CURRENT_TIMESTAMP | Last update timestamp  |

## Feedback Table

| **Column Name** | **Data Type** | **Constraints** | **Description**                 |
| --------------- | ------------- | --------------- | ------------------------------- |
| id              | Text          | PRIMARY KEY     | Unique identifier (UUID)        |
| user_id         | Text          | -               | User who provided feedback      |
| version         | BigInteger    | default=0       | Feedback version number         |
| type            | Text          | -               | Type of feedback                |
| data            | JSON          | nullable        | Feedback data including ratings |
| meta            | JSON          | nullable        | Metadata (arena, chat_id, etc)  |
| snapshot        | JSON          | nullable        | Associated chat snapshot        |
| created_at      | BigInteger    | -               | Creation timestamp              |
| updated_at      | BigInteger    | -               | Last update timestamp           |

## File Table

| **Column Name** | **Data Type** | **Constraints** | **Description**       |
| --------------- | ------------- | --------------- | --------------------- |
| id              | String        | PRIMARY KEY     | Unique identifier     |
| user_id         | String        | -               | Owner of the file     |
| hash            | Text          | nullable        | File hash/checksum    |
| filename        | Text          | -               | Name of the file      |
| path            | Text          | nullable        | File system path      |
| data            | JSON          | nullable        | File-related data     |
| meta            | JSON          | nullable        | File metadata         |
| access_control  | JSON          | nullable        | Permission settings   |
| created_at      | BigInteger    | -               | Creation timestamp    |
| updated_at      | BigInteger    | -               | Last update timestamp |

The `meta` field's expected structure:

```python
{
    "name": string,          # Optional display name
    "content_type": string,  # MIME type
    "size": integer,         # File size in bytes
    # Additional metadata supported via ConfigDict(extra="allow")
}
```

## Folder Table

| **Column Name** | **Data Type** | **Constraints** | **Description**                |
| --------------- | ------------- | --------------- | ------------------------------ |
| id              | Text          | PK (composite)  | Unique identifier (UUID)       |
| parent_id       | Text          | nullable        | Parent folder ID for hierarchy |
| user_id         | Text          | PK (composite)  | Owner of the folder            |
| name            | Text          | -               | Folder name                    |
| items           | JSON          | nullable        | Folder contents                |
| data            | JSON          | nullable        | Additional folder data         |
| meta            | JSON          | nullable        | Folder metadata                |
| is_expanded     | Boolean       | default=False   | UI expansion state             |
| created_at      | BigInteger    | -               | Creation timestamp             |
| updated_at      | BigInteger    | -               | Last update timestamp          |

Things to know about the folder table:

- Primary key is composite (`id`, `user_id`)
- Folders can be nested (`parent_id` reference)
- Root folders have null `parent_id`
- Folder names must be unique within the same parent

## Function Table

| **Column Name** | **Data Type** | **Constraints** | **Description**           |
| --------------- | ------------- | --------------- | ------------------------- |
| id              | String        | PRIMARY KEY     | Unique identifier         |
| user_id         | String        | -               | Owner of the function     |
| name            | Text          | -               | Function name             |
| type            | Text          | -               | Function type             |
| content         | Text          | -               | Function content/code     |
| meta            | JSON          | -               | Function metadata         |
| valves          | JSON          | -               | Function control settings |
| is_active       | Boolean       | -               | Function active status    |
| is_global       | Boolean       | -               | Global availability flag  |
| created_at      | BigInteger    | -               | Creation timestamp        |
| updated_at      | BigInteger    | -               | Last update timestamp     |

Things to know about the function table:

- `type` can only be: ["filter", "action"]

## Group Table

| **Column Name** | **Data Type** | **Constraints**     | **Description**          |
| --------------- | ------------- | ------------------- | ------------------------ |
| id              | Text          | PRIMARY KEY, UNIQUE | Unique identifier (UUID) |
| user_id         | Text          | -                   | Group owner/creator      |
| name            | Text          | -                   | Group name               |
| description     | Text          | -                   | Group description        |
| data            | JSON          | nullable            | Additional group data    |
| meta            | JSON          | nullable            | Group metadata           |
| permissions     | JSON          | nullable            | Permission configuration |
| user_ids        | JSON          | nullable            | List of member user IDs  |
| created_at      | BigInteger    | -                   | Creation timestamp       |
| updated_at      | BigInteger    | -                   | Last update timestamp    |

## Knowledge Table

| **Column Name** | **Data Type** | **Constraints**     | **Description**            |
| --------------- | ------------- | ------------------- | -------------------------- |
| id              | Text          | PRIMARY KEY, UNIQUE | Unique identifier (UUID)   |
| user_id         | Text          | -                   | Knowledge base owner       |
| name            | Text          | -                   | Knowledge base name        |
| description     | Text          | -                   | Knowledge base description |
| data            | JSON          | nullable            | Knowledge base content     |
| meta            | JSON          | nullable            | Additional metadata        |
| access_control  | JSON          | nullable            | Access control rules       |
| created_at      | BigInteger    | -                   | Creation timestamp         |
| updated_at      | BigInteger    | -                   | Last update timestamp      |

The `access_control` fields expected structure:

```python
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

## Memory Table

| **Column Name** | **Data Type** | **Constraints** | **Description**          |
| --------------- | ------------- | --------------- | ------------------------ |
| id              | String        | PRIMARY KEY     | Unique identifier (UUID) |
| user_id         | String        | -               | Memory owner             |
| content         | Text          | -               | Memory content           |
| created_at      | BigInteger    | -               | Creation timestamp       |
| updated_at      | BigInteger    | -               | Last update timestamp    |

## Message Table

| **Column Name** | **Data Type** | **Constraints** | **Description**                     |
| --------------- | ------------- | --------------- | ----------------------------------- |
| id              | Text          | PRIMARY KEY     | Unique identifier (UUID)            |
| user_id         | Text          | -               | Message author                      |
| channel_id      | Text          | nullable        | Associated channel                  |
| parent_id       | Text          | nullable        | Parent message for threads          |
| content         | Text          | -               | Message content                     |
| data            | JSON          | nullable        | Additional message data             |
| meta            | JSON          | nullable        | Message metadata                    |
| created_at      | BigInteger    | -               | Creation timestamp (nanoseconds)    |
| updated_at      | BigInteger    | -               | Last update timestamp (nanoseconds) |

## Message Reaction Table

| **Column Name** | **Data Type** | **Constraints** | **Description**          |
| --------------- | ------------- | --------------- | ------------------------ |
| id              | Text          | PRIMARY KEY     | Unique identifier (UUID) |
| user_id         | Text          | -               | User who reacted         |
| message_id      | Text          | -               | Associated message       |
| name            | Text          | -               | Reaction name/emoji      |
| created_at      | BigInteger    | -               | Reaction timestamp       |

## Model Table

| **Column Name** | **Data Type** | **Constraints** | **Description**        |
| --------------- | ------------- | --------------- | ---------------------- |
| id              | Text          | PRIMARY KEY     | Model identifier       |
| user_id         | Text          | -               | Model owner            |
| base_model_id   | Text          | nullable        | Parent model reference |
| name            | Text          | -               | Display name           |
| params          | JSON          | -               | Model parameters       |
| meta            | JSON          | -               | Model metadata         |
| access_control  | JSON          | nullable        | Access permissions     |
| is_active       | Boolean       | default=True    | Active status          |
| created_at      | BigInteger    | -               | Creation timestamp     |
| updated_at      | BigInteger    | -               | Last update timestamp  |

## Note Table

| **Column Name** | **Data Type** | **Constraints** | **Description**            |
| --------------- | ------------- | --------------- | -------------------------- |
| id              | Text          | PRIMARY KEY     | Unique identifier          |
| user_id         | Text          | nullable        | Owner of the note          |
| title           | Text          | nullable        | Note title                 |
| data            | JSON          | nullable        | Note content and data      |
| meta            | JSON          | nullable        | Note metadata              |
| access_control  | JSON          | nullable        | Permission settings        |
| created_at      | BigInteger    | nullable        | Creation timestamp         |
| updated_at      | BigInteger    | nullable        | Last update timestamp      |

## OAuth Session Table

| **Column Name** | **Data Type** | **Constraints**      | **Description**                   |
| --------------- | ------------- | -------------------- | --------------------------------- |
| id              | Text          | PRIMARY KEY          | Unique session identifier         |
| user_id         | Text          | FOREIGN KEY(user.id) | Associated user                   |
| provider        | Text          | -                    | OAuth provider (e.g., 'google')   |
| token           | Text          | -                    | OAuth session token               |
| expires_at      | BigInteger    | -                    | Token expiration timestamp        |
| created_at      | BigInteger    | -                    | Session creation timestamp        |
| updated_at      | BigInteger    | -                    | Session last update timestamp     |

## Prompt Table

| **Column Name** | **Data Type** | **Constraints** | **Description**           |
| --------------- | ------------- | --------------- | ------------------------- |
| command         | String        | PRIMARY KEY     | Unique command identifier |
| user_id         | String        | -               | Prompt owner              |
| title           | Text          | -               | Prompt title              |
| content         | Text          | -               | Prompt content/template   |
| timestamp       | BigInteger    | -               | Last update timestamp     |
| access_control  | JSON          | nullable        | Access permissions        |

## Tag Table

| **Column Name** | **Data Type** | **Constraints** | **Description**           |
| --------------- | ------------- | --------------- | ------------------------- |
| id              | String        | PK (composite)  | Normalized tag identifier |
| name            | String        | -               | Display name              |
| user_id         | String        | PK (composite)  | Tag owner                 |
| meta            | JSON          | nullable        | Tag metadata              |

Things to know about the tag table:

- Primary key is composite (id, user_id)

## Tool Table

| **Column Name** | **Data Type** | **Constraints** | **Description**       |
| --------------- | ------------- | --------------- | --------------------- |
| id              | String        | PRIMARY KEY     | Unique identifier     |
| user_id         | String        | -               | Tool owner            |
| name            | Text          | -               | Tool name             |
| content         | Text          | -               | Tool content/code     |
| specs           | JSON          | -               | Tool specifications   |
| meta            | JSON          | -               | Tool metadata         |
| valves          | JSON          | -               | Tool control settings |
| access_control  | JSON          | nullable        | Access permissions    |
| created_at      | BigInteger    | -               | Creation timestamp    |
| updated_at      | BigInteger    | -               | Last update timestamp |

## User Table

| **Column Name**   | **Data Type** | **Constraints**  | **Description**            |
| ----------------- | ------------- | ---------------- | -------------------------- |
| id                | String        | PRIMARY KEY      | Unique identifier          |
| username          | String(50)    | nullable         | User's unique username     |
| name              | String        | -                | User's name                |
| email             | String        | -                | User's email               |
| role              | String        | -                | User's role                |
| profile_image_url | Text          | -                | Profile image path         |
| bio               | Text          | nullable         | User's biography           |
| gender            | Text          | nullable         | User's gender              |
| date_of_birth     | Date          | nullable         | User's date of birth       |
| last_active_at    | BigInteger    | -                | Last activity timestamp    |
| updated_at        | BigInteger    | -                | Last update timestamp      |
| created_at        | BigInteger    | -                | Creation timestamp         |
| api_key           | String        | UNIQUE, nullable | API authentication key     |
| settings          | JSON          | nullable         | User preferences           |
| info              | JSON          | nullable         | Additional user info       |
| oauth_sub         | Text          | UNIQUE           | OAuth subject identifier   |

## Entity Relationship Diagram

To help visualize the relationship between the tables, refer to the below Entity Relationship Diagram (ERD) generated with Mermaid.

```mermaid
erDiagram
    %% User and Authentication
    user ||--o{ auth : "has"
    user ||--o{ chat : "owns"
    user ||--o{ channel : "owns"
    user ||--o{ message : "creates"
    user ||--o{ folder : "owns"
    user ||--o{ file : "owns"
    user ||--o{ feedback : "provides"
    user ||--o{ function : "manages"
    user ||--o{ group : "manages"
    user ||--o{ knowledge : "manages"
    user ||--o{ memory : "owns"
    user ||--o{ model : "manages"
    user ||--o{ prompt : "creates"
    user ||--o{ tag : "creates"
    user ||--o{ tool : "manages"
    user ||--o{ note : "owns"
    user ||--|| oauth_session : "has"

    %% Content Relationships
    message ||--o{ message_reaction : "has"
    chat ||--o{ tag : "tagged_with"
    chat }|--|| folder : "organized_in"
    channel ||--o{ message : "contains"
    message ||--o{ message : "replies"

    user {
        string id PK
        string username
        string name
        string email
        string role
        text profile_image_url
        text bio
        text gender
        date date_of_birth
        bigint last_active_at
        string api_key
        json settings
        json info
        text oauth_sub
    }

    auth {
        string id PK
        string email
        text password
        boolean active
    }

    chat {
        string id PK
        string user_id FK
        string title
        json chat
        text share_id
        boolean archived
        boolean pinned
        json meta
        text folder_id FK
    }

    channel {
        text id PK
        text user_id FK
        text name
        text description
        json data
        json meta
        json access_control
    }

    message {
        text id PK
        text user_id FK
        text channel_id FK
        text parent_id FK
        text content
        json data
        json meta
    }

    message_reaction {
        text id PK
        text user_id FK
        text message_id FK
        text name
    }

    feedback {
        text id PK
        text user_id FK
        bigint version
        text type
        json data
        json meta
        json snapshot
    }

    file {
        string id PK
        string user_id FK
        text hash
        text filename
        text path
        json data
        json meta
        json access_control
    }

    folder {
        text id PK "composite"
        text user_id PK "composite"
        text parent_id FK
        text name
        json items
        json data
        json meta
        boolean is_expanded
    }

    function {
        string id PK
        string user_id FK
        text name
        text content
        json meta
        json valves
        boolean is_active
        boolean is_global
    }

    group {
        text id PK
        text user_id FK
        text name
        text description
        json data
        json meta
        json permissions
        json user_ids
    }

    knowledge {
        text id PK
        text user_id FK
        text name
        text description
        json data
        json meta
        json access_control
    }

    memory {
        string id PK
        string user_id FK
        text content
    }

    model {
        text id PK
        text user_id FK
        text base_model_id FK
        text name
        json params
        json meta
        json access_control
        boolean is_active
    }

    note {
        text id PK
        text user_id FK
        text title
        json data
        json meta
        json access_control
    }

    oauth_session {
        text id PK
        text user_id FK
        text provider
        text token
        bigint expires_at
    }

    prompt {
        string command PK
        string user_id FK
        text title
        text content
        json access_control
    }

    tag {
        string id PK "composite"
        string user_id PK "composite"
        string name
        json meta
    }

    tool {
        string id PK
        string user_id FK
        text name
        text content
        json specs
        json meta
        json valves
        json access_control
    }
```
