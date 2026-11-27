---
sidebar_position: 1000
title: "备份"
---

# 备份你的实例

:::warning

本教程由社区贡献，Open WebUI 团队不提供支持。它仅用于演示如何针对特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

没有人喜欢丢失数据！

如果你正在自托管 Open WebUI，可能需要制定某种正式的备份计划，以确保保留部分配置的第二份和第三份副本。

本指南旨在就用户如何完成这项工作提供一些基本建议。

本指南假定用户已通过 Docker 安装 Open WebUI（或打算这样做）。对于 pip、uv 和 Conda 安装，请参阅 [pip、uv 和 Conda 安装](#pip-uv-and-conda-installs)。

## 确保数据持久化 {#ensuring-data-persistence}

首先，在使用 Docker 部署技术栈之前，请确保 Docker Compose 使用持久数据存储。如果使用[来自 GitHub 仓库](https://github.com/open-webui/open-webui/blob/main/docker-compose.yaml)的 Docker Compose，这一点已经处理好了。但自行编写各种变体时，很容易忘记验证这一点。

![管理员界面中的数据库设置](/images/admin/admin-database.png)

:::note

**设置 > 数据库**（管理员部分）中的**数据库**下载不是推荐的数据库备份方式。它按磁盘上的当前状态流式传输 `webui.db`，而在 SQLite WAL 模式下，最近的写入可能仍位于 `webui.db-wal` 中，因此该文件可能缺少最近的数据。请按照[导出和导入数据库](/tutorials/maintenance/database)中的说明自行复制数据库文件，或对 PostgreSQL 使用 `pg_dump`。

:::

Docker 容器是临时的，必须将数据持久化，才能确保其保留在主机文件系统中。

## 使用 Docker 卷 {#using-docker-volumes}

如果使用项目仓库中的 Docker Compose，你将通过 Docker 卷部署 Open WebUI。

Ollama 和 Open WebUI 的挂载如下：

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

要查找主机上的实际绑定路径，请运行：

`docker volume inspect ollama`

以及

`docker volume inspect open-webui`

## 使用直接主机绑定 {#using-direct-host-binds}

有些用户通过直接（固定）绑定到主机文件系统来部署 Open WebUI，如下所示：

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

如果你的实例是这样部署的，请记下主机上的路径。

## pip、uv 和 Conda 安装 {#pip-uv-and-conda-installs}

使用 `open-webui serve` 启动的实例会将其数据保存在 [`DATA_DIR`](/reference/env-configuration#data_dir) 设置的文件夹中。如果未设置 `DATA_DIR`，该文件夹为 Python 环境的 `site-packages` 内的 `open_webui/data`，因此删除或重新创建环境也会一并删除数据。要打印该路径，请在已激活的环境中运行：

```bash
python -c "import open_webui, pathlib; print(pathlib.Path(open_webui.__file__).resolve().parent / 'data')"
```

需要备份两项内容：

- **数据目录。**其中包含与 Docker 卷相同的文件，具体列于[持久数据存储中的文件](#files-in-persistent-data-store)。
- **`.webui_secret_key` 文件**，除非你在环境中设置了 [`WEBUI_SECRET_KEY`](/reference/env-configuration#webui_secret_key)。`open-webui serve` 首次启动时会在运行命令的文件夹中创建它，而不是在数据目录中，并且每次启动都会打印其路径：`Loading WEBUI_SECRET_KEY from <path>`。恢复后的实例如果没有它，就会生成一个新密钥，导致所有用户退出登录。

复制前请停止 Open WebUI，以便以一致的状态复制 `webui.db` 及其 `webui.db-wal` 文件。

要将数据移出环境，请停止 Open WebUI，将数据目录复制到自己的文件夹，并将 `DATA_DIR` 指向该文件夹后启动，例如 `DATA_DIR=~/.open-webui open-webui serve`。请从包含 `.webui_secret_key` 的文件夹启动，或将该文件复制到你启动命令的文件夹中。

## 编写备份任务脚本 {#scripting-a-backup-job}

无论实例如何预配，都值得检查服务器上应用程序的数据存储，以了解要备份的数据。你应看到类似以下内容：

```txt
├── audit.log
├── cache/
├── uploads/
├── vector_db/
└── webui.db
```

## 持久数据存储中的文件 {#files-in-persistent-data-store}

| 文件/目录 | 说明 |
|---|---|
| `audit.log` | 用于审计事件的日志文件。 |
| `cache/` | 用于存储缓存数据的目录。 |
| `uploads/` | 用于存储用户上传文件的目录。 |
| `vector_db/` | 包含 ChromaDB 向量数据库的目录。 |
| `webui.db` | 用于持久存储其他实例数据的 SQLite 数据库 |

## 导出管理员配置 {#exporting-the-admin-configuration}

**设置 > 数据库**（管理员部分）的**配置（Config）**部分包含**导出配置（Export Config）**和**导入配置（Import Config）**。它们只复制管理员设置，不能替代数据存储备份。

**导出配置**会下载 `config-<timestamp>.json`，这是一个扁平 JSON 对象，其中以点分键（例如 `openai.api_base_urls` 或 `ui.banners`）保存 `config` 表的每一行。

- 该文件以纯文本保存机密信息：连接 API 密钥（`openai.api_keys`）、Web 搜索 API 密钥、Jupyter 令牌和密码，以及 OAuth 客户端密钥。请像密码文件一样妥善保存它。
- 它不包含存储在 `config` 表之外的所有内容：用户、聊天、模型、知识、文件、函数和工具。仅作为环境变量存在的设置（例如 `WEBUI_SECRET_KEY`）也不在其中。
- 当 `ENABLE_PERSISTENT_CONFIG=False` 时，该文件保存 Open WebUI 运行时使用的值，这些值从环境变量开始。

**导入配置**读取相同结构的文件，并按原样写入其中的每个键，不检查键名或值。文件中缺少的键会保留其当前值，因此导入会合并到现有设置中，而不会重置其余设置。导入成功后会显示 `Config imported successfully`。

- 当 `ENABLE_PERSISTENT_CONFIG=False` 时，以及在 `ENABLE_OAUTH_PERSISTENT_CONFIG` 关闭时对于 `oauth.*` 键，导入的值只会更改正在运行的实例，并会在重启后丢失。
- 完整导出包含 MFA 键（`auth.mfa.enable`、`auth.mfa.allow_oauth_bypass`、`auth.mfa.allow_trusted_header_bypass`）。携带这些键的导入必须由已登录浏览器的管理员发起。如果使用 API 密钥发送，则会失败并显示 `A human administrator session is required to change MFA settings.`
- 如果导入的 MFA 值与当前值不同，所有用户都会退出登录。如果文件启用 MFA，但实例无法运行 MFA（没有身份验证、没有持久配置，或存储的 MFA 机密无法再解密），导入将失败并显示 `Unable to update MFA policy. Check configuration and retry.`，且不会写入任何内容。

# 文件级备份方法

第一种备份应用程序数据的方法是采用文件级备份，确保 Open WebUI 持久数据得到正确备份。

技术服务的备份方法几乎无穷无尽，但 `rsync` 仍是增量任务的热门选择，因此这里将它作为演示。

用户可以将整个 `data` 目录作为目标，一次性备份所有实例数据；也可以创建更有针对性的备份任务，分别针对各个组件。你还可以为目标添加更具描述性的名称。

一个 rsync 任务示例如下所示：

```bash

#!/bin/bash

# 配置
SOURCE_DIR="."  # 当前目录（文件结构所在位置）
B2_BUCKET="b2://OpenWebUI-backups" # 你的 Backblaze B2 存储桶
B2_PROFILE="your_rclone_profile" # 你的 rclone 配置文件名称

# 确保 rclone 已配置你的 B2 凭据

# 定义源目录和目标目录
SOURCE_UPLOADS="$SOURCE_DIR/uploads"
SOURCE_VECTORDB="$SOURCE_DIR/vector_db"
SOURCE_WEBUI_DB="$SOURCE_DIR/webui.db"

DEST_UPLOADS="$B2_BUCKET/user_uploads"
DEST_CHROMADB="$B2_BUCKET/ChromaDB"
DEST_MAIN_DB="$B2_BUCKET/main_database"

# 排除 cache 和 audit.log
EXCLUDE_LIST=(
    "cache/"
    "audit.log"
)

# 为 rclone 构造排除参数
EXCLUDE_ARGS=""
for EXCLUDE in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude '$EXCLUDE'"
done

# 执行 rclone 同步并检查错误的函数
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

# 对每个目录/文件执行 rclone 同步
rclone_sync "$SOURCE_UPLOADS" "$DEST_UPLOADS"
rclone_sync "$SOURCE_VECTORDB" "$DEST_CHROMADB"
rclone_sync "$SOURCE_WEBUI_DB" "$DEST_MAIN_DB"

echo "Backup completed successfully."
exit 0
```

## 中断容器的 Rsync 任务 {#rsync-job-with-container-interruption}

为保持数据完整性，通常建议在冷文件系统上运行数据库备份。可以稍作修改默认的模型备份任务，在运行备份脚本之前停止技术栈，并在完成后重新启动。

当然，这种方法的缺点是会导致实例停机。可以考虑在不会使用实例的时段运行该任务，或者同时执行“软件”每日备份（针对正在运行的数据）和更稳健的每周备份（针对冷数据）。

```bash

#!/bin/bash

# 配置
COMPOSE_FILE="docker-compose.yml" # docker-compose.yml 文件的路径
B2_BUCKET="b2://OpenWebUI-backups" # 你的 Backblaze B2 存储桶
B2_PROFILE="your_rclone_profile" # 你的 rclone 配置文件名称
SOURCE_DIR="."  # 当前目录（文件结构所在位置）

# 定义源目录和目标目录
SOURCE_UPLOADS="$SOURCE_DIR/uploads"
SOURCE_VECTORDB="$SOURCE_DIR/vector_db"
SOURCE_WEBUI_DB="$SOURCE_DIR/webui.db"

DEST_UPLOADS="$B2_BUCKET/user_uploads"
DEST_CHROMADB="$B2_BUCKET/ChromaDB"
DEST_MAIN_DB="$B2_BUCKET/main_database"

# 排除 cache 和 audit.log
EXCLUDE_LIST=(
    "cache/"
    "audit.log"
)

# 为 rclone 构造排除参数
EXCLUDE_ARGS=""
for EXCLUDE in "${EXCLUDE_LIST[@]}"; do
    EXCLUDE_ARGS="$EXCLUDE_ARGS --exclude '$EXCLUDE'"
done

# 执行 rclone 同步并检查错误的函数
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

# 1. 停止 Docker Compose 环境
echo "Stopping Docker Compose environment..."
docker compose -f "$COMPOSE_FILE" down

# 2. 执行备份
echo "Starting backup..."
rclone_sync "$SOURCE_UPLOADS" "$DEST_UPLOADS"
rclone_sync "$SOURCE_VECTORDB" "$DEST_CHROMADB"
rclone_sync "$SOURCE_WEBUI_DB" "$DEST_MAIN_DB"

# 3. 启动 Docker Compose 环境
echo "Starting Docker Compose environment..."
docker compose -f "$COMPOSE_FILE" up -d

echo "Backup completed successfully."
exit 0
```

## 使用 SQLite 和 ChromaDB 备份功能将模型备份到 B2 远程存储的脚本 {#model-backup-script-using-sqlite--chromadb-backup-functions-to-b2-remote}

```bash

#!/bin/bash

#

# 将 ChromaDB 和 SQLite 备份到 Backblaze B2 存储桶的脚本

# openwebuiweeklies，保留 3 个每周快照。

# 快照彼此独立，均可完整恢复。

# 使用 ChromaDB 和 SQLite 原生备份机制。

# 排除 audit.log、cache 和 uploads 目录。

#

# 确保已正确安装并配置 rclone。

# 安装 rclone：https://rclone.org/install/

# 配置 rclone：https://rclone.org/b2/

# 源目录（包含 ChromaDB 和 SQLite 数据）
SOURCE="/var/lib/open-webui/data"

# B2 存储桶名称和远程名称
B2_REMOTE="openwebuiweeklies"
B2_BUCKET="b2:$B2_REMOTE"

# 备份目录的时间戳
TIMESTAMP=$(date +%Y-%m-%d)

# 备份目录名称
BACKUP_DIR="open-webui-backup-$TIMESTAMP"

# B2 存储桶中备份目录的完整路径
DESTINATION="$B2_BUCKET/$BACKUP_DIR"

# 要保留的每周快照数量
NUM_SNAPSHOTS=3

# 排除过滤器（在数据库备份之后应用）
EXCLUDE_FILTERS="--exclude audit.log --exclude cache/** --exclude uploads/** --exclude vector_db"

# ChromaDB 备份设置（根据需要调整）
CHROMADB_DATA_DIR="$SOURCE/vector_db"  # ChromaDB 数据目录的路径
CHROMADB_BACKUP_FILE="$SOURCE/chromadb_backup.tar.gz" # ChromaDB 备份的归档文件

# SQLite 备份设置（根据需要调整）
SQLITE_DB_FILE="$SOURCE/webui.db" # SQLite 数据库文件的路径
SQLITE_BACKUP_FILE="$SOURCE/webui.db.backup" # SQLite 备份的临时文件

# 备份 ChromaDB 的函数
backup_chromadb() {
  echo "Backing up ChromaDB..."

  # 创建 vector_db 目录的 tar 归档
  tar -czvf "$CHROMADB_BACKUP_FILE" -C "$SOURCE" vector_db

  echo "ChromaDB backup complete."
}

# 备份 SQLite 的函数
backup_sqlite() {
  echo "Backing up SQLite database..."
  # 使用 .backup 命令备份 SQLite 数据库
  sqlite3 "$SQLITE_DB_FILE" ".backup '$SQLITE_BACKUP_FILE'"

  # 将备份文件移动到源目录
  mv "$SQLITE_BACKUP_FILE" "$SOURCE/"

  echo "SQLite backup complete."
}

# 执行数据库备份
backup_chromadb
backup_sqlite

# 使用排除规则执行备份
rclone copy "$SOURCE" "$DESTINATION" $EXCLUDE_FILTERS --progress

# 删除旧备份，保留最近的 NUM_SNAPSHOTS 个快照
find "$B2_BUCKET" -type d -name "open-webui-backup-*" | sort -r | tail -n +$((NUM_SNAPSHOTS + 1)) | while read dir; do
  rclone purge "$dir"
done

echo "Backup completed to $DESTINATION"
```

---

## 时间点快照 {#point-in-time-snapshots}

除了进行备份之外，用户可能还希望创建时间点快照，并将其存储在本地（服务器上）、远程或同时存储在两处。

```bash

#!/bin/bash

# 配置
SOURCE_DIR="."  # 要创建快照的目录（当前目录）
SNAPSHOT_DIR="/snapshots" # 用于存储快照的目录
TIMESTAMP=$(date +%Y%m%d%H%M%S) # 生成时间戳

# 如果快照目录不存在，则创建它
mkdir -p "$SNAPSHOT_DIR"

# 创建快照名称
SNAPSHOT_NAME="snapshot_$TIMESTAMP"
SNAPSHOT_PATH="$SNAPSHOT_DIR/$SNAPSHOT_NAME"

# 执行 rsync 快照
echo "Creating snapshot: $SNAPSHOT_PATH"
rsync -av --delete --link-dest="$SNAPSHOT_DIR/$(ls -t "$SNAPSHOT_DIR" | head -n 1)" "$SOURCE_DIR/" "$SNAPSHOT_PATH"

# 检查 rsync 是否成功
if [ $? -eq 0 ]; then
  echo "Snapshot created successfully."
else
  echo "Error: Snapshot creation failed."
  exit 1
fi

exit 0
```

## 使用 Crontab 调度 {#crontab-for-scheduling}

添加备份脚本并预配备份存储后，你需要对脚本进行质量保证测试，确保它们按预期运行。强烈建议记录日志。

根据所需的运行频率，使用 crontab 设置新脚本的运行计划。

# 商业工具

除了自行编写备份任务脚本外，还可以选择商业产品；这些产品通常通过在服务器上安装代理来简化运行备份的复杂工作。这些内容超出了本文范围，但它们提供了便捷的解决方案。

---

# 主机级备份

你的 Open WebUI 实例可能预配在你控制的主机（物理机或虚拟机）上。

主机级备份需要创建快照或备份，但对象是整个 VM，而不是运行中的应用程序。

有些人可能希望将其作为主要或唯一的保护措施，而另一些人可能希望将其作为额外的数据保护层。

# 我需要多少份备份？

你需要的备份数量取决于个人的风险承受能力。但请记住，最佳实践是*不要*将应用程序本身视为备份副本（即使它位于云端！）。这意味着，如果你在 VPS 上预配了实例，保留两份（独立的）备份副本仍是合理建议。

一个足以满足许多家庭用户需求的备份计划示例：

## 示例备份计划 1（主数据 + 2 份副本） {#model-backup-plan-1-primary--2-copies}

| 频率 | 目标 | 技术 | 说明 |
|---|---|---|---|
| 每日增量 | 云存储（S3/B2） | rsync | 每日将增量备份推送到云存储桶（S3 或 B2）。 |
| 每周增量 | 本地存储（家用 NAS） | rsync | 每周将增量备份从服务器拉取到本地存储（例如家用 NAS）。 |

## 示例备份计划 2（主数据 + 3 份副本） {#model-backup-plan-2-primary--3-copies}

这个备份计划稍微复杂一些，但也更全面：它涉及每天推送到两个云存储提供方，以实现额外冗余。

| 频率 | 目标 | 技术 | 说明 |
|---|---|---|---|
| 每日增量 | 云存储（S3） | rsync | 每日将增量备份推送到 S3 云存储桶。 |
| 每日增量 | 云存储（B2） | rsync | 每日将增量备份推送到 Backblaze B2 云存储桶。 |
| 每周增量 | 本地存储（家用 NAS） | rsync | 每周将增量备份从服务器拉取到本地存储（例如家用 NAS）。 |

# 其他主题

为了让本指南保持合理篇幅，以下主题未作展开，但根据你可用于设置和维护实例数据保护计划的时间，它们可能值得考虑：

| 主题 | 说明 |
|---|---|
| SQLite 内置备份 | 考虑使用 SQLite 的 `.backup` 命令实现一致的数据库备份。 |
| 加密 | 修改备份脚本以加入静态加密。 |
| 灾难恢复和测试 | 制定灾难恢复计划，并定期测试备份和恢复过程。 |
| 替代备份工具 | 探索 `borgbackup` 或 `restic` 等其他命令行备份工具，以使用高级功能。 |
| 电子邮件通知和 Webhook | 实现电子邮件通知或 Webhook，以监控备份成功或失败。 |
