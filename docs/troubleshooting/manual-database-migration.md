---
sidebar_position: 900
title: Manual Alembic Database Migration
sidebar_label: Manual Migration
description: Complete guide for manually running Alembic database migrations when Open WebUI's automatic migration fails or requires direct intervention.
keywords: [alembic, migration, database, troubleshooting, sqlite, postgresql, docker]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Overview

Open WebUI automatically runs database migrations on startup. **Manual migration is rarely needed** and should only be performed in specific failure scenarios or maintenance situations.

:::info When Manual Migration is Required
You need manual migration only if:

- Open WebUI logs show specific migration errors during startup
- You're performing offline database maintenance
- Automatic migration fails after a version upgrade
- You're migrating between database types (SQLite ↔ PostgreSQL)
- A developer has instructed you to run migrations manually
:::

:::danger Critical Warning
Manual migration can corrupt your database if performed incorrectly. **Always create a verified backup before proceeding.**
:::

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Root/admin access** to your Open WebUI installation
- [ ] **Database location confirmed** (default: `/app/backend/data/webui.db` in Docker)
- [ ] **Open WebUI completely stopped** (no running processes)
- [ ] **Backup created and verified** (see below)
- [ ] **Access to container or Python environment** where Open WebUI runs

:::warning Stop All Processes First
Database migrations cannot run while Open WebUI is active. You **must** stop all Open WebUI processes before attempting manual migration.
:::

## Step 1: Create and Verify Backup

### Backup Your Database

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite (Default)" default>
    ```bash title="Terminal"
    # Find your database location first
    docker inspect open-webui | grep -A 5 Mounts

    # Create timestamped backup
    cp /path/to/webui.db /path/to/webui.db.backup.$(date +%Y%m%d_%H%M%S)
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal"
    pg_dump -h localhost -U your_user -d open_webui_db > backup_$(date +%Y%m%d_%H%M%S).sql
    ```
  </TabItem>
</Tabs>

### Verify Backup Integrity

**Critical:** Test that your backup is readable before proceeding.

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal - Verify Backup"
    # Test backup can be opened
    sqlite3 /path/to/webui.db.backup "SELECT count(*) FROM user;"

    # Verify schema matches
    sqlite3 /path/to/webui.db ".schema" > current-schema.sql
    sqlite3 /path/to/webui.db.backup ".schema" > backup-schema.sql
    diff current-schema.sql backup-schema.sql
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal - Verify Backup"
    # Verify backup file is not empty and contains SQL
    head -n 20 backup_*.sql
    grep -c "CREATE TABLE" backup_*.sql
    ```
  </TabItem>
</Tabs>

:::tip Backup Storage
Store backups on a **different disk or volume** than your database to protect against disk failure.
:::

## Step 2: Diagnose Current State

Before attempting any fixes, gather information about your database state.

### Access Your Environment

<Tabs groupId="install-type">
  <TabItem value="docker" label="Docker" default>
    ```bash title="Terminal"
    # Stop Open WebUI first
    docker stop open-webui

    # Enter container for diagnostics
    docker run --rm -it \
      -v open-webui:/app/backend/data \
      --entrypoint /bin/bash \
      ghcr.io/open-webui/open-webui:main
    ```
    
    :::note Default Directory
    When you enter the container, you'll be in `/app`. The Alembic configuration is at `/app/backend/open_webui/alembic.ini`.
    :::
  </TabItem>
  <TabItem value="local" label="Local Install">
    ```bash title="Terminal"
    # Navigate to Open WebUI installation
    cd /path/to/open-webui/backend/open_webui

    # Activate virtual environment if used
    source ../../venv/bin/activate  # Linux/Mac
    # venv\Scripts\activate  # Windows
    ```
  </TabItem>
</Tabs>

### Navigate to Alembic Directory and Set Environment

Navigate to the directory containing `alembic.ini` and configure required environment variables:

```bash title="Terminal - Navigate and Configure Environment"
# Navigate to Alembic directory
cd /app/backend/open_webui  # Docker
# OR
cd /path/to/open-webui/backend/open_webui  # Local

# Verify alembic.ini exists
ls -la alembic.ini
```

### Set Required Environment Variables

```bash title="Terminal - Set Environment Variables"
# Required: Database URL
# For Docker with SQLite (4 slashes for absolute path)
export DATABASE_URL="sqlite:////app/backend/data/webui.db"

# For local install with SQLite (relative path)
export DATABASE_URL="sqlite:///../data/webui.db"

# For PostgreSQL
export DATABASE_URL="postgresql://user:password@localhost:5432/open_webui_db"

# Required: WEBUI_SECRET_KEY
# Get from existing file
export WEBUI_SECRET_KEY=$(cat /app/backend/data/.webui_secret_key)

# If .webui_secret_key doesn't exist, generate one
# export WEBUI_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
# echo $WEBUI_SECRET_KEY > /app/backend/data/.webui_secret_key

# Verify both are set
echo "DATABASE_URL: $DATABASE_URL"
echo "WEBUI_SECRET_KEY: ${WEBUI_SECRET_KEY:0:10}..."
```

:::danger Both Variables Required
Alembic commands will fail with `Required environment variable not found` if `WEBUI_SECRET_KEY` is missing. Open WebUI's code imports `env.py` which validates this variable exists before Alembic can even connect to the database.
:::

:::warning Path Syntax for SQLite

- `sqlite:////app/...` = 4 slashes total (absolute path: `sqlite://` + `/` + `/app/...`)
- `sqlite:///../data/...` = 3 slashes total (relative path)
:::

### Run Diagnostic Commands

Execute these read-only diagnostic commands:

```bash title="Terminal - Diagnostics (Safe - Read Only)"
# Check current migration version
alembic current -v

# Check target (latest) version
alembic heads

# List all migration history
alembic history

# Check for branching (indicates issues)
alembic branches
```

**Expected output:**

```
# alembic current should show something like:
ae1027a6acf (head)

# If you see multiple heads or branching, your migration history has issues
```

:::info Understanding Output

- `alembic current` = what version your database thinks it's at
- `alembic heads` = what version the code expects
- If `current` is older than `heads`, you have pending migrations
- If `current` equals `heads`, your database is up-to-date
:::

<details>
<summary>Check Actual Database Tables</summary>

Verify what's actually in your database:

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal"
    sqlite3 /app/backend/data/webui.db ".tables"
    sqlite3 /app/backend/data/webui.db "SELECT * FROM alembic_version;"
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal"
    psql -h localhost -U user -d dbname -c "\dt"
    psql -h localhost -U user -d dbname -c "SELECT * FROM alembic_version;"
    ```
  </TabItem>
</Tabs>

</details>

## Step 3: Apply Migrations

### Standard Upgrade (Most Common)

If diagnostics show you have pending migrations (`current` < `heads`), upgrade to latest:

```bash title="Terminal - Upgrade to Latest"
# Ensure you're in the correct directory
cd /app/backend/open_webui

# Run upgrade
alembic upgrade head
```

**Watch for these outputs:**

```bash
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
# highlight-next-line
INFO  [alembic.runtime.migration] Running upgrade abc123 -> def456, add_new_column
```

:::note "Will assume non-transactional DDL"
This is a **normal informational message** for SQLite, not an error. SQLite doesn't support rollback of schema changes, so migrations run without transaction protection.

If the process appears to hang after this message, wait 2-3 minutes - some migrations take time. If it's truly stuck, check for database locks (see troubleshooting).
:::

### Upgrade to Specific Version

If you need to apply migrations up to a specific point:

```bash title="Terminal - Upgrade to Specific Version"
# List available versions first
alembic history

# Upgrade to specific revision
alembic upgrade ae1027a6acf
```

### Downgrade (Rollback)

:::danger Data Loss Risk
Downgrading can cause **permanent data loss** if the migration removed columns or tables. Only downgrade if you understand the consequences.
:::

```bash title="Terminal - Downgrade Migrations"
# Downgrade one version
alembic downgrade -1

# Downgrade to specific version
alembic downgrade <revision_id>

# Nuclear option: Remove all migrations (rarely needed)
alembic downgrade base
```

## Step 4: Verify Migration Success

After running migrations, confirm everything is correct:

```bash title="Terminal - Post-Migration Verification"
# Verify current version matches expected
alembic current

# Should show (head) indicating you're at latest
# Example: ae1027a6acf (head)

# Confirm no pending migrations
alembic upgrade head --sql | head -20
# If output contains only comments or is empty, you're up to date
```

### Test Application Startup

<Tabs groupId="install-type">
  <TabItem value="docker" label="Docker" default>
    ```bash title="Terminal"
    # Exit the diagnostic container
    exit

    # Start Open WebUI normally
    docker start open-webui
    
    # Watch logs for migration confirmation
    docker logs -f open-webui
    ```
  </TabItem>
  <TabItem value="local" label="Local Install">
    ```bash title="Terminal"
    # Start Open WebUI
    python -m open_webui.main

    # Watch for successful startup messages
    ```
  </TabItem>
</Tabs>

**Successful startup logs:**

```
INFO:     [db] Database initialization complete
INFO:     [main] Open WebUI starting on http://0.0.0.0:8080
```

## Troubleshooting

### "Required environment variable not found"

**Cause:** `WEBUI_SECRET_KEY` environment variable is missing.

**Solution:**

```bash title="Terminal - Fix Missing Secret Key"
# Method 1: Use existing key from file
export WEBUI_SECRET_KEY=$(cat /app/backend/data/.webui_secret_key)

# Method 2: If file doesn't exist, generate new key
export WEBUI_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
echo $WEBUI_SECRET_KEY > /app/backend/data/.webui_secret_key

# Verify it's set
echo "WEBUI_SECRET_KEY: ${WEBUI_SECRET_KEY:0:10}..."

# Try alembic again
alembic current -v
```

:::warning Why This Happens
Open WebUI's `env.py` file imports models, which import `open_webui.env`, which validates that `WEBUI_SECRET_KEY` exists. Without it, Python crashes before Alembic can even connect to the database.
:::

### "No config file 'alembic.ini' found"

**Cause:** You're in the wrong directory.

**Solution:**

```bash title="Terminal"
# Find alembic.ini location
find /app -name "alembic.ini" 2>/dev/null  # Docker
find . -name "alembic.ini"  # Local

# Navigate to that directory
cd /app/backend/open_webui  # Most common path
```

### "Target database is not up to date"

**Cause:** Your database version doesn't match expected schema.

**Diagnosis:**

```bash title="Terminal - Diagnose Version Mismatch"
# Check what database thinks its version is
alembic current

# Check what code expects
alembic heads

# Compare
```

**Solution depends on diagnosis:**

<Tabs>
  <TabItem value="pending" label="Pending Migrations" default>
    **Scenario:** `alembic current` shows older version than `alembic heads`

    **Fix:** You simply need to apply pending migrations.
    
    ```bash title="Terminal"
    alembic upgrade head
    ```
  </TabItem>
  <TabItem value="mismatch" label="Schema Mismatch">
    **Scenario:** `alembic current` shows correct version, but you still see errors

    **Cause:** Someone manually modified the database schema without migrations, or a previous migration partially failed.
    
    **Fix:** Restore from backup - you have database corruption.
    
    ```bash title="Terminal"
    # Stop everything
    docker stop open-webui
    
    # Restore backup
    cp /path/to/webui.db.backup /path/to/webui.db
    
    # Try migration again
    alembic upgrade head
    ```
  </TabItem>
  <TabItem value="fresh" label="Fresh Database">
    **Scenario:** New database that needs initial schema

    **Fix:** Run migrations from scratch.
    
    ```bash title="Terminal"
    alembic upgrade head
    ```
  </TabItem>
</Tabs>

:::danger Never Use "alembic stamp" as a Fix
You may see advice to run `alembic stamp head` to "fix" version mismatches. **This is dangerous.**

`alembic stamp` tells Alembic "pretend this migration was applied" without actually running it. This creates permanent database corruption where Alembic thinks your schema is up-to-date when it isn't.

**Only use `alembic stamp head` if:**

- You manually created all tables using `create_all()` and need to mark them as migrated
- You're a developer initializing a fresh database that matches current schema

**Never use it to "fix" migration errors.**
:::

### Process Hangs After "Will assume non-transactional DDL"

**Understanding the message:** This is **not an error**. It's informational. SQLite doesn't support transactional DDL, so Alembic is warning that migrations can't be rolled back automatically.

**If genuinely stuck:**

<Tabs>
  <TabItem value="wait" label="Wait First" default>
    Some migrations (especially those adding indexes or modifying large tables) take several minutes.

    **Action:** Wait 3-5 minutes before assuming it's stuck.
  </TabItem>
  <TabItem value="lock" label="Check Database Lock">
    Another process might have locked the database.

    ```bash title="Terminal - Check for Locks"
    # Find processes using database file
    fuser /app/backend/data/webui.db
    
    # Kill any orphaned processes
    pkill -f "open-webui"
    
    # Verify nothing running
    ps aux | grep open-webui
    
    # Try migration again
    alembic upgrade head
    ```
  </TabItem>
  <TabItem value="corrupt" label="Database Corruption">
    If the database is corrupted, migration will hang.

    ```bash title="Terminal - Check Integrity"
    sqlite3 /app/backend/data/webui.db "PRAGMA integrity_check;"
    ```
    
    If integrity check fails, restore from backup.
  </TabItem>
</Tabs>

### Autogenerate Detects Removed Tables

**Symptom:** You ran `alembic revision --autogenerate` and it wants to drop existing tables.

:::warning Don't Run Autogenerate
**Regular users should NEVER run `alembic revision --autogenerate`.** This command is for developers creating new migration files, not for applying existing migrations.

The command you want is `alembic upgrade head` (no `revision`, no `--autogenerate`).
:::

**If you accidentally created a bad migration file:**

```bash title="Terminal - Remove Bad Migration"
# List migration files
ls -la /app/backend/open_webui/migrations/versions/

# Delete the incorrect auto-generated file (newest file)
rm /app/backend/open_webui/migrations/versions/<newest_timestamp>_*.py

# Restore to known good state
git checkout /app/backend/open_webui/migrations/  # If using git
```

**Technical context:** The "autogenerate detects removed tables" issue occurs because Open WebUI's Alembic metadata configuration doesn't import all model definitions. This causes autogenerate to compare against incomplete metadata, thinking tables should be removed. This is a developer-level issue that doesn't affect users running `alembic upgrade`.

### Peewee to Alembic Transition Issues

**Background:** Older Open WebUI versions (pre-0.4.x) used Peewee migrations. Current versions use Alembic.

**Symptoms:**

- Both `migratehistory` and `alembic_version` tables exist
- Errors about "migration already applied"

**What happens automatically:**

1. Open WebUI's `internal/db.py` runs old Peewee migrations first via `handle_peewee_migration()`
2. Then `config.py` runs Alembic migrations via `run_migrations()`
3. Both systems should work transparently

**If automatic transition fails:**

```bash title="Terminal - Manual Transition"
# Check if old Peewee migrations exist
sqlite3 /app/backend/data/webui.db "SELECT * FROM migratehistory;" 2>/dev/null

# If Peewee migrations exist, ensure they completed
# Then run Alembic migrations
cd /app/backend/open_webui
alembic upgrade head
```

:::tip
If upgrading from very old Open WebUI versions (< 0.3.x), consider a fresh install with data export/import rather than attempting to migrate the database schema across multiple major version changes.
:::

## Advanced Operations

### Generate SQL Without Applying

For review or audit purposes, generate the SQL that would be executed:

```bash title="Terminal - Generate Migration SQL"
# Generate SQL for pending migrations
alembic upgrade head --sql > /tmp/migration-plan.sql

# Review what would be applied
cat /tmp/migration-plan.sql
```

**Use cases:**

- DBA review in enterprise environments
- Understanding what changes will occur
- Debugging migration issues
- Applying migrations in restricted environments

:::info When to Use This
This is advanced functionality for DBAs or DevOps engineers. Regular users should just run `alembic upgrade head` directly.
:::

### Offline Migration (No Network)

If your database server is offline or isolated:

```bash title="Terminal - Offline Migration Workflow"
# 1. Generate SQL on development machine
alembic upgrade head --sql > upgrade-to-head.sql

# 2. Transfer SQL file to production
scp upgrade-to-head.sql production-server:/tmp/

# 3. On production, apply SQL manually
sqlite3 /app/backend/data/webui.db < /tmp/upgrade-to-head.sql

# 4. Update alembic_version table manually
sqlite3 /app/backend/data/webui.db \
  "UPDATE alembic_version SET version_num='<target_revision>';"
```

:::danger Manual alembic_version Updates
Only update `alembic_version` if you've **actually applied** the corresponding migrations. Lying to Alembic about migration state causes permanent corruption.
:::

## Recovery Procedures

### Recovery from Failed Migration

:::danger SQLite Has No Rollback
SQLite migrations are **non-transactional**. If a migration fails halfway through, your database is in a partially-migrated state. The only safe recovery is restoring from backup.
:::

**Symptoms of partial migration:**

- Some tables exist, others don't match expected schema
- Foreign key violations
- Missing columns that migration should have added
- Application errors about missing database fields

**Recovery steps:**

```bash title="Terminal - Restore from Backup"
# 1. Stop Open WebUI immediately
docker stop open-webui

# 2. Verify backup integrity
sqlite3 /path/to/webui.db.backup "PRAGMA integrity_check;"

# 3. Restore backup
cp /path/to/webui.db.backup /path/to/webui.db

# 4. Investigate root cause before retrying
docker logs open-webui > migration-failure-logs.txt

# 5. Get help with logs before attempting migration again
```

:::warning Do Not Use "stamp" to Fix Failed Migrations
Never use `alembic stamp` to mark a partially-failed migration as complete. This leaves your database in a corrupt state.
:::

### Validate Database Integrity

Before and after migrations, verify your database isn't corrupted:

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal - SQLite Integrity Check"
    sqlite3 /app/backend/data/webui.db "PRAGMA integrity_check;"

    # Should output: ok
    # If it outputs anything else, database is corrupted
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal - PostgreSQL Integrity Check"
    # Check for table corruption
    psql -h localhost -U user -d dbname -c "SELECT * FROM pg_stat_database WHERE datname='open_webui_db';"

    # Vacuum and analyze
    psql -h localhost -U user -d dbname -c "VACUUM ANALYZE;"
    ```
  </TabItem>
</Tabs>

## Post-Migration Checklist

After successful migration, verify:

- [ ] `alembic current` shows `(head)` indicating latest version
- [ ] Open WebUI starts without errors
- [ ] Can log in successfully
- [ ] Core features work (chat, model selection, etc.)
- [ ] No error messages in logs
- [ ] Data appears intact (users, chats, models)
- [ ] Backup can be safely archived after 1 week of stability

:::tip Keep Recent Backups
Retain backups from before major migrations for at least 1-2 weeks. Issues sometimes appear days later during specific workflows.
:::

## Getting Help

If migrations continue to fail after following this guide:

**Gather diagnostic information:**

```bash title="Terminal - Collect Diagnostic Data"
# Version information
docker logs open-webui 2>&1 | head -20 > diagnostics.txt

# Migration state
cd /app/backend/open_webui
alembic current -v >> diagnostics.txt
alembic history >> diagnostics.txt

# Database info (SQLite)
sqlite3 /app/backend/data/webui.db ".tables" >> diagnostics.txt
sqlite3 /app/backend/data/webui.db "SELECT * FROM alembic_version;" >> diagnostics.txt

# Full migration log
alembic upgrade head 2>&1 >> diagnostics.txt
```

**Where to get help:**

1. **Open WebUI GitHub Issues:** https://github.com/open-webui/open-webui/issues
   - Search existing issues first
   - Include your `diagnostics.txt` file
   - Specify your Open WebUI version and installation method

2. **Open WebUI Discord Community**
   - Real-time support from community members
   - Share error messages and diagnostics

3. **Provide this information:**
   - Open WebUI version
   - Installation method (Docker/local)
   - Database type (SQLite/PostgreSQL)
   - Output of `alembic current` and `alembic history`
   - Complete error messages
   - What you were doing when it failed

:::note
Do not share your `webui.db` database file publicly - it contains user credentials and sensitive data. Only share the diagnostic text output.
:::
