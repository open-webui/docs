---
sidebar_position: 900
title: Manual Alembic Database Migration Guide
---

This guide provides step-by-step instructions for manually applying Alembic database migrations in Open WebUI. Migrations are typically run automatically on startup, but you may need to run them manually for maintenance, debugging, or deployment scenarios.

## Prerequisites

- Ensure you have a Python environment with Open WebUI dependencies installed.
- Your database connection must be configured via the `DATABASE_URL` environment variable.
- You need access to the backend directory of your Open WebUI installation.

## Accessing the Container (for Docker installations)

If you are running Open WebUI in a Docker container, you'll first need to get a shell into the container:

```bash
docker exec -it open-webui /bin/bash
```

:::note
Replace `open-webui` with the name of your container if it's different.
:::

## Manual Migration Commands

This section provides instructions for running Alembic commands. The correct directory path depends on whether you are running Open WebUI from a local installation or within a Docker container.

### 1. Navigate to the Correct Directory

#### Local Installation
If you are running Open WebUI from a local clone of the repository, navigate to the `backend/open_webui` directory from the repository root:
```bash
cd backend/open_webui
```

#### Docker Container
After accessing the container with `docker exec`, you will be in the `/app/backend` directory. From there, navigate to the `open_webui` directory:
```bash
cd open_webui
```

:::info
All subsequent Alembic commands must be run from this directory (`/app/backend/open_webui` inside the container or `backend/open_webui` in a local setup), where the `alembic.ini` file is located.
:::

### 2. Check the Current Database Revision

To see the current revision of your database, run:

```bash
alembic current
```

### 3. Apply All Pending Migrations (Upgrade)

To upgrade your database to the latest version, which applies all pending migrations, run:

```bash
alembic upgrade head
```

### 4. Upgrade to a Specific Revision

You can upgrade to a specific migration by providing its revision ID:

```bash
alembic upgrade <revision_id>
```

### 5. Downgrade to the Previous Revision

To revert the last migration, use:

```bash
alembic downgrade -1
```

### 6. Downgrade to a Specific Revision

You can also downgrade to a specific revision:

```bash
alembic downgrade <revision_id>
```

### 7. View Migration History

To see the history of all migrations, including their revision IDs, run:

```bash
alembic history
```

:::tip
The `alembic history` command is useful for finding the revision ID to use with the `upgrade` and `downgrade` commands.
:::

## Common Scenarios

### Fresh Database Setup

For a new database, run the following command to apply all migrations:

```bash
alembic upgrade head
```

### Specific Migration Issues

If a migration fails, you can resolve it with the following steps:
1.  Check the current revision: `alembic current`
2.  Identify the problematic revision from the error message.
3.  Downgrade to the previous revision: `alembic downgrade -1`
4.  Fix the underlying issue (e.g., a missing constraint).
5.  Run the upgrade again: `alembic upgrade head`

### Production Deployment

When deploying to a production environment:

:::danger[Backup Your Database]
**Always back up your database before running migrations in a production environment.**
:::

1.  Run migrations during a maintenance window to avoid service disruptions.
2.  Verify the migration was successful with `alembic current`.

## Troubleshooting

### `InvalidForeignKey` Error

If you encounter an error similar to `sqlalchemy.exc.ProgrammingError: (psycopg2.errors.InvalidForeignKey) there is no unique constraint matching given keys for referenced table "user"`, it's likely that a primary key constraint is missing on the `user` table.

To fix this, you need to connect to your PostgreSQL database and run the following SQL command:

```sql
ALTER TABLE public."user" ADD CONSTRAINT user_pk PRIMARY KEY (id);
```

After running this command, you can retry the `alembic upgrade head` command.

### Migration Path Issues

If you encounter path resolution issues, ensure you are running the `alembic` commands from the correct directory (`open_webui` inside the Docker container, or `backend/open_webui` in a local setup) where the `alembic.ini` file is located.

### Database Connection

Verify that your `DATABASE_URL` environment variable is correctly set and that the database is accessible from where you are running the commands.

## Notes

:::note
The application automatically runs migrations on startup via the `run_migrations()` function in `config.py`. Manual migrations are useful for debugging, controlled deployments, or when automatic migration is disabled.
:::

- Some migrations include data transformation logic that may take a significant amount of time to run on large datasets.
