---
sidebar_position: 1000
title: "Backups"
---

 :::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# Backing Up Your Instance

 Nobody likes losing data!

 If you're self-hosting Open WebUI, then you may wish to institute some kind of formal backup plan in order to ensure that you retain a second and third copy of parts of your configuration.

 This guide is intended to recommend some basic recommendations for how users might go about doing that.

 This guide assumes that the user has installed Open WebUI via Docker (or intends to do so)

## Ensuring data persistence

Firstly, before deploying your stack with Docker, ensure that your Docker Compose uses a persistent data store. If you're using the Docker Compose [from the Github repository](https://github.com/open-webui/open-webui/blob/main/docker-compose.yaml) that's already taken care of. But it's easy to cook up your own variations and forget to verify this.

Docker containers are ephemeral and data must be persisted to ensure its survival on the host filesystem.

## Using Docker volumes

If you're using the Docker Compose from the project repository, you will be deploying Open Web UI using Docker volumes.

For Ollama and Open WebUI the mounts are:

```yaml
ollama:
  volumes:
    - ollama:/root/.ollama
```

```yaml
open-webui:
  volumes:
    - open-webui:/app/backend/data
```

To find the actual bind path on host, run:

`docker volume inspect ollama`

and

`docker volume inspect open-webui`

## Using direct host binds

Some users deploy Open Web UI with direct (fixed) binds to the host filesystem, like this:

```yaml
services:
  ollama:
    container_name: ollama
    image: ollama/ollama:${OLLAMA_DOCKER_TAG-latest}
    volumes:
      - /opt/ollama:/root/.ollama
  open-webui:
    container_name: open-webui
    image: ghcr.io/open-webui/open-webui:${WEBUI_DOCKER_TAG-main}
    volumes:
      - /opt/open-webui:/app/backend/data
```

If this is how you've deployed your instance, you'll want to note the paths on root.

## Scripting A Backup Job

However your instance is provisioned, it's worth inspecting the app's data store on your server to understand what data you'll be backing up. You should see something like this:

```txt
├── audit.log
├── cache/
├── uploads/
├── vector_db/
└── webui.db
```

## Files in persistent data store

| File/Directory | Description |
|---|---|
| `audit.log` | Log file for auditing events. |
| `cache/` | Directory for storing cached data. |
| `uploads/` | Directory for storing user-uploaded files. |
| `vector_db/` | Directory containing the ChromaDB vector database. |
| `webui.db` | SQLite database for persistent storage of other instance data |

# File Level Backup Approaches

The first way to back up the application data is to take a file level backup approach ensuring that the persistent Open Web UI data is properly backed up.

There's an almost infinite number of ways in which technical services can be backed up, but `rsync` remains a popular favorite for incremental jobs and so will be used as a demonstration.

Users could target the entire `data` directory to back up all the instance data at once or create more selective backup jobs targeting individual components. You could add more descriptive names for the targets also.

A model rsync job could look like this:

```bash

#!/bin/bash

# Configuration
SOURCE_DIR="."  # Current directory (where the file structure resides)
B2_BUCKET="b2://OpenWebUI-backups" # Your Backblaze B2 bucket
B2_PROFILE="your_rclone_profile" # Your rclone profile name

# Ensure rclone is configured with your B2 credentials

# Define source and destination directories
SOURCE_UPLOADS="$SOURCE_DIR/uploads"
SOURCE_VECTORDB="$SOURCE_DIR/vector_db"
SOURCE_WEBUI_DB="$SOURCE_DIR/webui.db"

DEST_UPLOADS="$B2_BUCKET/user_uploads"
DEST_CHROMADB="$B2_BUCKET/ChromaDB"
DEST_MAIN_DB="$B2_BUCKET/main_database"

# Exclude cache and audit.log
EXCLUDE_LIST=(
    "cache/"
    "audit.log"
)

# Construct exclude arguments for rclone
EXCLUDE_ARGS=""
for EXCLUDE in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude '$EXCLUDE'"
done

# Function to perform rclone sync with error checking
rclone_sync() {
    SOURCE="$1"
    DEST="$2"
    echo "Syncing '$SOURCE' to '$DEST'..."
    rclone sync "$SOURCE" "$DEST" $EXCLUDE_ARGS --progress --transfers=32 --checkers=16 --profile "$B2_PROFILE"
    if [ $? -ne 0 ]; then
        echo "Error: rclone sync failed for '$SOURCE' to '$DEST'"
        exit 1
    fi
}

# Perform rclone sync for each directory/file
rclone_sync "$SOURCE_UPLOADS" "$DEST_UPLOADS"
rclone_sync "$SOURCE_VECTORDB" "$DEST_CHROMADB"
rclone_sync "$SOURCE_WEBUI_DB" "$DEST_MAIN_DB"

echo "Backup completed successfully."
exit 0
```

## Rsync Job With Container Interruption

To maintain data integrity, it's generally recommended to run database backups on cold filesystems. Our default model backup job can be modified slightly to bring down the stack before running the backup script and bring it back after.

The downside of this approach, of course, is that it will entail instance downtime. Consider running the job at times you won't be using the instance or taking "software" dailies (on the running data) and more robust weeklies (on cold data).

```bash

#!/bin/bash

# Configuration
COMPOSE_FILE="docker-compose.yml" # Path to your docker-compose.yml file
B2_BUCKET="b2://OpenWebUI-backups" # Your Backblaze B2 bucket
B2_PROFILE="your_rclone_profile" # Your rclone profile name
SOURCE_DIR="."  # Current directory (where the file structure resides)

# Define source and destination directories
SOURCE_UPLOADS="$SOURCE_DIR/uploads"
SOURCE_VECTORDB="$SOURCE_DIR/vector_db"
SOURCE_WEBUI_DB="$SOURCE_DIR/webui.db"

DEST_UPLOADS="$B2_BUCKET/user_uploads"
DEST_CHROMADB="$B2_BUCKET/ChromaDB"
DEST_MAIN_DB="$B2_BUCKET/main_database"

# Exclude cache and audit.log
EXCLUDE_LIST=(
    "cache/"
    "audit.log"
)

# Construct exclude arguments for rclone
EXCLUDE_ARGS=""
for EXCLUDE in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude '$EXCLUDE'"
done

# Function to perform rclone sync with error checking
rclone_sync() {
    SOURCE="$1"
    DEST="$2"
    echo "Syncing '$SOURCE' to '$DEST'..."
    rclone sync "$SOURCE" "$DEST" $EXCLUDE_ARGS --progress --transfers=32 --checkers=16 --profile "$B2_PROFILE"
    if [ $? -ne 0 ]; then
        echo "Error: rclone sync failed for '$SOURCE' to '$DEST'"
        exit 1
    fi
}

# 1. Stop the Docker Compose environment
echo "Stopping Docker Compose environment..."
docker-compose -f "$COMPOSE_FILE" down

# 2. Perform the backup
echo "Starting backup..."
rclone_sync "$SOURCE_UPLOADS" "$DEST_UPLOADS"
rclone_sync "$SOURCE_VECTORDB" "$DEST_CHROMADB"
rclone_sync "$SOURCE_WEBUI_DB" "$DEST_MAIN_DB"

# 3. Start the Docker Compose environment
echo "Starting Docker Compose environment..."
docker-compose -f "$COMPOSE_FILE" up -d

echo "Backup completed successfully."
exit 0
```

## Model Backup Script Using SQLite & ChromaDB Backup Functions To B2 Remote

```bash

#!/bin/bash

#

# Backup script to back up ChromaDB and SQLite to Backblaze B2 bucket

# openwebuiweeklies, maintaining 3 weekly snapshots.

# Snapshots are independent and fully restorable.

# Uses ChromaDB and SQLite native backup mechanisms.

# Excludes audit.log, cache, and uploads directories.

#

# Ensure rclone is installed and configured correctly.

# Install rclone: https://rclone.org/install/

# Configure rclone: https://rclone.org/b2/

# Source directory (containing ChromaDB and SQLite data)
SOURCE="/var/lib/open-webui/data"

# B2 bucket name and remote name
B2_REMOTE="openwebuiweeklies"
B2_BUCKET="b2:$B2_REMOTE"

# Timestamp for the backup directory
TIMESTAMP=$(date +%Y-%m-%d)

# Backup directory name
BACKUP_DIR="open-webui-backup-$TIMESTAMP"

# Full path to the backup directory in the B2 bucket
DESTINATION="$B2_BUCKET/$BACKUP_DIR"

# Number of weekly snapshots to keep
NUM_SNAPSHOTS=3

# Exclude filters (applied *after* database backups)
EXCLUDE_FILTERS="--exclude audit.log --exclude cache/** --exclude uploads/** --exclude vector_db"

# ChromaDB Backup Settings (Adjust as needed)
CHROMADB_DATA_DIR="$SOURCE/vector_db"  # Path to ChromaDB data directory
CHROMADB_BACKUP_FILE="$SOURCE/chromadb_backup.tar.gz" # Archive file for ChromaDB backup

# SQLite Backup Settings (Adjust as needed)
SQLITE_DB_FILE="$SOURCE/webui.db" # Path to the SQLite database file
SQLITE_BACKUP_FILE="$SOURCE/webui.db.backup" # Temporary file for SQLite backup

# Function to backup ChromaDB
backup_chromadb() {
  echo "Backing up ChromaDB..."

  # Create a tar archive of the vector_db directory
  tar -czvf "$CHROMADB_BACKUP_FILE" -C "$SOURCE" vector_db

  echo "ChromaDB backup complete."
}

# Function to backup SQLite
backup_sqlite() {
  echo "Backing up SQLite database..."
  # Backup the SQLite database using the .backup command
  sqlite3 "$SQLITE_DB_FILE" ".backup '$SQLITE_BACKUP_FILE'"

  # Move the backup file to the source directory
  mv "$SQLITE_BACKUP_FILE" "$SOURCE/"

  echo "SQLite backup complete."
}

# Perform database backups
backup_chromadb
backup_sqlite

# Perform the backup with exclusions
rclone copy "$SOURCE" "$DESTINATION" $EXCLUDE_FILTERS --progress

# Remove old backups, keeping the most recent NUM_SNAPSHOTS
find "$B2_BUCKET" -type d -name "open-webui-backup-*" | sort -r | tail -n +$((NUM_SNAPSHOTS + 1)) | while read dir; do
  rclone purge "$dir"
done

echo "Backup completed to $DESTINATION"
```

---

## Point In Time Snapshots

In addition taking backups, users may also wish to create point-in-time snapshots which could be stored locally (on the server), remotely, or both.

```bash

#!/bin/bash

# Configuration
SOURCE_DIR="."  # Directory to snapshot (current directory)
SNAPSHOT_DIR="/snapshots" # Directory to store snapshots
TIMESTAMP=$(date +%Y%m%d%H%M%S) # Generate timestamp

# Create the snapshot directory if it doesn't exist
mkdir -p "$SNAPSHOT_DIR"

# Create the snapshot name
SNAPSHOT_NAME="snapshot_$TIMESTAMP"
SNAPSHOT_PATH="$SNAPSHOT_DIR/$SNAPSHOT_NAME"

# Perform the rsync snapshot
echo "Creating snapshot: $SNAPSHOT_PATH"
rsync -av --delete --link-dest="$SNAPSHOT_DIR/$(ls -t "$SNAPSHOT_DIR" | head -n 1)" "$SOURCE_DIR/" "$SNAPSHOT_PATH"

# Check if rsync was successful
if [ $? -eq 0 ]; then
  echo "Snapshot created successfully."
else
  echo "Error: Snapshot creation failed."
  exit 1
fi

exit 0
```

## Crontab For Scheduling

Once you've added your backup script and provisioned your backup storage, you'll want to QA the scripts to make sure that they're running as expected. Logging is highly advisable.

Set your new script(s) up to run using crontabs according to your desired run frequency.

# Commercial Utilities

In addition to scripting your own backup jobs, you can find commercial offerings which generally work by installing agents on your server that will abstract the complexities of running backups. These are beyond the purview of this article but provide convenient solutions.

---

# Host Level Backups

Your Open WebUI instance might be provisioned on a host (physical or virtualised) which you control.

Host level backups involve creating snapshots or backups but of the entire VM rather than running applications.

Some may wish to leverage them as their primary or only protection while others may wish to layer them in as additional data protections.

# How Many Backups Do I Need?

The amount of backups that you will wish to take depends on your personal level of risk tolerance. However, remember that it's best practice to *not* consider the application itself to be a backup copy (even if it lives in the cloud!). That means that if you've provisioned your instance on a VPS, it's still a reasonable recommendation to keep two (independent) backup copies.

An example backup plan that would cover the needs of many home users:

## Model backup plan 1 (primary + 2 copies)

| Frequency | Target | Technology | Description |
|---|---|---|---|
| Daily Incremental | Cloud Storage (S3/B2) | rsync | Daily incremental backup pushed to a cloud storage bucket (S3 or B2). |
| Weekly Incremental | On-site Storage (Home NAS) | rsync | Weekly incremental backup pulled from the server to on-site storage (e.g., a home NAS). |

## Model backup plan 2 (primary + 3 copies)

This backup plan is a little more complicated but also more comprehensive .. it involves daily pushes to two cloud storage providers for additional redundancy.

| Frequency | Target | Technology | Description |
|---|---|---|---|
| Daily Incremental | Cloud Storage (S3) | rsync | Daily incremental backup pushed to an S3 cloud storage bucket. |
| Daily Incremental | Cloud Storage (B2) | rsync | Daily incremental backup pushed to a Backblaze B2 cloud storage bucket. |
| Weekly Incremental | On-site Storage (Home NAS) | rsync | Weekly incremental backup pulled from the server to on-site storage (e.g., a home NAS). |

# Additional Topics

In the interest of keeping this guide reasonably thorough these additional subjects were ommitted but may be worth your consideration depending upon how much time you have to dedicate to setting up and maintaining a data protection plan for your instance:

| Topic | Description |
|---|---|
| SQLite Built-in Backup | Consider using SQLite's `.backup` command for a consistent database backup solution. |
| Encryption | Modify backup scripts to incorporate encryption at rest for enhanced security. |
| Disaster Recovery and Testing | Develop a disaster recovery plan and regularly test the backup and restore process. |
| Alternative Backup Tools | Explore other command-line backup tools like `borgbackup` or `restic` for advanced features. |
| Email Notifications and Webhooks | Implement email notifications or webhooks to monitor backup success or failure. |
