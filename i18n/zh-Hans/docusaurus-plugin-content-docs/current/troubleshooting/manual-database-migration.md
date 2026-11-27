---
sidebar_position: 900
title: "数据库迁移"
sidebar_label: 手动迁移
description: 当 Open WebUI 的自动迁移失败或需要直接干预时，手动运行 Alembic 数据库迁移的完整指南。
keywords: [alembic, migration, database, troubleshooting, sqlite, postgresql, docker]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 概述 {#overview}

Open WebUI 会在启动时自动运行数据库迁移。**很少需要手动迁移**，只应在特定故障场景或维护情况下执行。

:::info 何时需要手动迁移
仅在以下情况下需要手动迁移：

- Open WebUI 日志在启动期间显示特定的迁移错误
- 正在执行离线数据库维护
- 版本升级后自动迁移失败
- 正在数据库类型之间迁移（SQLite ↔ PostgreSQL）
- 开发人员要求你手动运行迁移
:::

:::tip 快速修复：升级后的迁移错误
**“No such table”**：迁移未应用。进入容器，设置所需的环境变量（[参见步骤 2](#step-2-diagnose-current-state)），然后运行 `alembic upgrade head`。参见[详细信息](#no-such-table-errors)。

**“Table already exists”**：先前的迁移只完成了一部分。需要为部分应用的迁移设置版本标记，然后再升级。参见[详细信息](#table-already-exists-errors)。

**跨大版本升级后出现多个错误**（例如先出现“duplicate column”，然后出现“table already exists”，再出现“no such column”）：数据库在多个迁移中处于部分迁移状态。需要逐个处理这些迁移。参见[详细信息](#multiple-failures-after-a-major-version-jump)。
:::

:::danger 严重警告
手动迁移操作不当可能损坏数据库。**继续操作前，务必创建并验证备份。**
:::

## 前置条件检查清单 {#prerequisites-checklist}

开始之前，请确保具备以下条件：

- [ ] 对 Open WebUI 安装环境拥有 **root/管理员访问权限**
- [ ] **已确认数据库位置**（Docker 中默认为 `/app/backend/data/webui.db`）
- [ ] **Open WebUI 已完全停止**（没有运行中的进程）
- [ ] **已创建并验证备份**（见下文）
- [ ] **可访问运行 Open WebUI 的容器或 Python 环境**

:::warning 先停止所有进程
Open WebUI 处于活动状态时不能运行数据库迁移。尝试手动迁移前，**必须**停止所有 Open WebUI 进程。
:::

## 步骤 1：创建并验证备份 {#step-1-create-and-verify-backup}

### 备份数据库 {#backup-your-database}

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite (Default)" default>
    ```bash title="Terminal"
    # 先查找数据库位置
    docker inspect open-webui | grep -A 5 Mounts

    # 创建带时间戳的备份
    cp /path/to/webui.db /path/to/webui.db.backup.$(date +%Y%m%d_%H%M%S)
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal"
    pg_dump -h localhost -U your_user -d open_webui_db > backup_$(date +%Y%m%d_%H%M%S).sql
    ```
  </TabItem>
</Tabs>

### 验证备份完整性 {#verify-backup-integrity}

**关键：**继续操作前，测试备份是否可读取。

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal - Verify Backup"
    # 测试备份能否打开
    sqlite3 /path/to/webui.db.backup "SELECT count(*) FROM user;"

    # 验证架构是否匹配
    sqlite3 /path/to/webui.db ".schema" > current-schema.sql
    sqlite3 /path/to/webui.db.backup ".schema" > backup-schema.sql
    diff current-schema.sql backup-schema.sql
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal - Verify Backup"
    # 验证备份文件非空且包含 SQL
    head -n 20 backup_*.sql
    grep -c "CREATE TABLE" backup_*.sql
    ```
  </TabItem>
</Tabs>

:::tip 备份存储
将备份存储在与数据库**不同的磁盘或卷**上，以防磁盘故障。
:::

## 步骤 2：诊断当前状态 {#step-2-diagnose-current-state}

尝试任何修复之前，先收集有关数据库状态的信息。

### 访问运行环境 {#access-your-environment}

<Tabs groupId="install-type">
  <TabItem value="docker" label="Docker" default>
    ```bash title="Terminal"
    # 先停止 Open WebUI
    docker stop open-webui

    # 进入容器进行诊断
    docker run --rm -it \
      -v open-webui:/app/backend/data \
      --entrypoint /bin/bash \
      ghcr.io/open-webui/open-webui:main
    ```

    :::note 确认当前位置
    进入容器后，检查当前所在位置：
    ```bash
    pwd
    ```
    Alembic 配置位于 `/app/backend/open_webui/alembic.ini`。无论从哪个目录开始，都要进入该目录。
    :::

    :::note 镜像中没有 `sqlite3` 命令
    Open WebUI 镜像不包含 `sqlite3` 命令。在容器内，本页的 SQLite 命令使用 Python 内置的 SQLite shell，即 `python3 -m sqlite3`。它可以运行 SQL 语句，但不支持 `.tables` 或 `.schema` 等点命令，并以 Python 元组形式打印每一行。
    :::
  </TabItem>
  <TabItem value="local" label="Local Install">
    ```bash title="Terminal"
    # 进入 Open WebUI 安装目录
    cd /path/to/open-webui/backend/open_webui

    # 如果使用虚拟环境，将其激活
    source ../../venv/bin/activate  # Linux/Mac
    # venv\Scripts\activate  # Windows
    ```
  </TabItem>
</Tabs>

### 进入 Alembic 目录并设置环境 {#navigate-to-alembic-directory-and-set-environment}

进入包含 `alembic.ini` 的目录，并配置所需的环境变量：

```bash title="Terminal - Navigate and Configure Environment"
# 首先确认当前位置
pwd

# 进入 Alembic 目录（如果 pwd 不同，请调整路径）
cd /app/backend/open_webui  # Docker
# 或
cd /path/to/open-webui/backend/open_webui  # 本地

# 验证当前目录中存在 alembic.ini
ls -la alembic.ini
```

### 设置必需的环境变量 {#set-required-environment-variables}

<Tabs groupId="install-type">
  <TabItem value="docker" label="Docker" default>

```bash title="Terminal - Set Environment Variables (Docker)"
# 必需：数据库 URL
# 对于 SQLite（绝对路径使用 4 个斜杠）
export DATABASE_URL="sqlite:////app/backend/data/webui.db"

# 对于 PostgreSQL
export DATABASE_URL="postgresql://user:password@localhost:5432/open_webui_db"

# 必需：WEBUI_SECRET_KEY
# 从 backend 目录（而非 data 目录）中的现有文件获取
export WEBUI_SECRET_KEY=$(cat /app/backend/.webui_secret_key)

# 如果失败，尝试 data 目录中的位置
# export WEBUI_SECRET_KEY=$(cat /app/backend/data/.webui_secret_key)

# 如果两个文件都不存在，生成一个
# export WEBUI_SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_hex(32))")
# echo $WEBUI_SECRET_KEY > /app/backend/.webui_secret_key

# 验证两个变量均已设置
echo "DATABASE_URL: $DATABASE_URL"
echo "WEBUI_SECRET_KEY: ${WEBUI_SECRET_KEY:0:10}..."
```

  </TabItem>
  <TabItem value="local" label="Local Install">

```bash title="Terminal - Set Environment Variables (Local)"
# 必需：数据库 URL
# 对于 SQLite（相对于 backend/open_webui 目录的路径）
export DATABASE_URL="sqlite:///../data/webui.db"

# 对于绝对路径
export DATABASE_URL="sqlite:////full/path/to/webui.db"

# 对于 PostgreSQL
export DATABASE_URL="postgresql://user:password@localhost:5432/open_webui_db"

# 必需：WEBUI_SECRET_KEY
# 如果使用 .env 文件，Alembic 可能不会自动读取，请手动导出
export WEBUI_SECRET_KEY=$(cat ../data/.webui_secret_key)

# 或者环境中已有该值
# export WEBUI_SECRET_KEY="your-existing-key"

# 验证两个变量均已设置
echo "DATABASE_URL: $DATABASE_URL"
echo "WEBUI_SECRET_KEY: ${WEBUI_SECRET_KEY:0:10}..."
```

:::note 本地安装环境
本地安装通常将 `DATABASE_URL` 放在 `.env` 文件中，但运行 `alembic` 会导入 `open_webui.env`，后者加载仓库中的 `.env`。位于其他任何位置的 `.env` 都会被忽略，因此这种情况下，请在 shell 中导出变量，再运行 Alembic 命令。
:::

  </TabItem>
</Tabs>

:::danger 两个变量都是必需的
如果启用 `WEBUI_AUTH` 时缺少 `WEBUI_SECRET_KEY`，Alembic 命令会因 `WEBUI_SECRET_KEY is not set. It is a hard requirement when authentication is enabled.` 而失败。Open WebUI 的代码会导入 `env.py`，后者会在 Alembic 连接数据库之前验证该变量是否存在。
:::

:::warning SQLite 路径语法

- `sqlite:////app/...` = 总共 4 个斜杠（绝对路径：`sqlite://` + `/` + `/app/...`）
- `sqlite:///../data/...` = 总共 3 个斜杠（相对路径）
:::

### 运行诊断命令 {#run-diagnostic-commands}

执行以下只读诊断命令：

```bash title="Terminal - Diagnostics (Safe - Read Only)"
# 检查当前迁移版本
alembic current -v

# 检查目标（最新）版本
alembic heads

# 列出所有迁移历史
alembic history

# 显示待处理迁移（升级将应用的迁移）
alembic history -r current:head

# 检查是否存在分支（表示有问题）
alembic branches
```

**预期输出：**

```
# alembic current 应显示类似以下内容：
b8f2c6d91a04 (head)

# 如果看到多个 head 或分支，说明迁移历史存在问题
```

:::info 理解输出

- `alembic current` = 数据库记录的当前版本
- `alembic heads` = 代码预期的版本
- `alembic history -r current:head` = 从当前版本到最新版本的每个迁移，最新的在前；除最底行外的所有行均为待处理迁移
- 如果 `current` 早于 `heads`，则存在待处理迁移
- 如果 `current` 等于 `heads`，数据库已是最新状态
:::

<details>
<summary>检查实际数据库表</summary>

验证数据库中的实际内容：

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal"
    python3 -m sqlite3 /app/backend/data/webui.db "SELECT name FROM sqlite_master WHERE type='table';"
    python3 -m sqlite3 /app/backend/data/webui.db "SELECT * FROM alembic_version;"
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

## 步骤 3：应用迁移 {#step-3-apply-migrations}

### 标准升级（最常见） {#standard-upgrade-most-common}

如果诊断显示存在待处理迁移（`current` < `heads`），请升级到最新版本：

```bash title="Terminal - Upgrade to Latest"
# 确保位于正确目录
cd /app/backend/open_webui

# 运行升级
alembic upgrade head
```

**留意以下输出：**

```bash
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
# highlight-next-line
INFO  [alembic.runtime.migration] Running upgrade abc123 -> def456, add_new_column
```

:::note 关于“Will assume non-transactional DDL”
对于 SQLite，这是**普通的信息性消息**，不是错误。SQLite 不支持回滚架构更改，因此迁移在没有事务保护的情况下运行。

如果进程在此消息后看似卡住，请等待 2–3 分钟；某些迁移需要时间，尤其是：
- 为大型表添加索引的迁移（100 万行以上：1–5 分钟）
- 包含数据转换的迁移（10 万行以上：30 秒到数分钟）
- 重建表的迁移（SQLite 不支持所有 ALTER 操作）

对于非常大的数据库（1000 万行以上），请考虑在维护窗口内运行迁移，并在另一个终端使用 `sqlite3 /path/to/webui.db ".tables"` 监控进度。
:::

### 升级到特定版本 {#upgrade-to-specific-version}

如果需要应用截至某个特定点的迁移：

```bash title="Terminal - Upgrade to Specific Version"
# 先列出可用版本
alembic history

# 升级到特定修订版本
alembic upgrade <revision>
```

### 降级（回滚） {#downgrade-rollback}

:::danger 数据丢失风险
如果迁移删除了列或表，降级可能导致**永久性数据丢失**。只有理解后果时才可降级。
:::

只要仍存在由应用发布的消息，降级越过 [Apps](/features/channels/apps) 迁移（`c92da83b017f`）时就会以 `Export/remove app messages before downgrading apps` 停止。这些消息删除后，降级会移除应用表和每个应用频道成员关系。

降级越过为 [SCIM](/features/authentication-access/auth/scim#integration-with-sso) 用户添加登录记录的迁移（`0bd252b206fb`）时，会保留该迁移添加的记录，因为这些账户在升级后可能已设置密码或双因素登录。

```bash title="Terminal - Downgrade Migrations"
# 降级一个版本
alembic downgrade -1

# 降级到特定版本
alembic downgrade <revision_id>

# 最后手段：移除所有迁移（很少需要）
alembic downgrade base
```

## 步骤 4：验证迁移成功 {#step-4-verify-migration-success}

运行迁移后，确认一切正常：

```bash title="Terminal - Post-Migration Verification"
# 验证当前版本与预期版本匹配
alembic current
# 应显示 (head)，表示已是最新版本
# 示例：b8f2c6d91a04 (head)

# 确认没有待处理迁移
alembic history -r current:head
# 如果只显示一行并标记为 (head)，则已是最新状态

# 验证关键表存在（SQLite）
python3 -m sqlite3 /app/backend/data/webui.db "SELECT name FROM sqlite_master WHERE type='table';" | grep -E "user|chat|model"
# 除其他表外，应显示 user、chat、model 表

# 测试简单查询，确保架构完好
python3 -m sqlite3 /app/backend/data/webui.db "SELECT COUNT(*) FROM user;"
# 应返回数字，而不是错误
```

### 测试应用启动 {#test-application-startup}

<Tabs groupId="install-type">
  <TabItem value="docker" label="Docker" default>
    ```bash title="Terminal"
    # 退出诊断容器
    exit

    # 正常启动 Open WebUI
    docker start open-webui

    # 查看日志，确认迁移情况
    docker logs -f open-webui

    # 确认启动成功，然后在浏览器中测试
    # 访问 http://localhost:8080，验证登录页面是否加载
    ```
  </TabItem>
  <TabItem value="local" label="Local Install">
    ```bash title="Terminal"
    # 启动 Open WebUI
    open-webui serve

    # 留意启动成功的消息
    # 访问 http://localhost:8080 进行测试
    ```
  </TabItem>
</Tabs>

**成功启动的日志：**

```
INFO:     [db] Database initialization complete
INFO:     [main] Open WebUI starting on http://0.0.0.0:8080
```

**启动后的冒烟测试：**
- 可以访问登录页面
- 可以使用现有凭据登录
- 可以查看聊天历史
- 没有 JavaScript 控制台错误

## 故障排除 {#troubleshooting}

### “No such table”错误 {#no-such-table-errors}

**症状：**Open WebUI 启动时崩溃，并显示类似以下错误：

```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) no such table: access_grant
```

或者引用其他缺失表的类似错误（例如 `message`、`channel`）。

**原因：**一个或多个 Alembic 迁移未成功应用。可能发生在以下情况下：

- 自动升级期间迁移失败（Open WebUI 记录 traceback 并中止启动，导致容器循环重启）
- 迁移运行期间升级进程被中断
- 环境中设置了 `ENABLE_DB_MIGRATIONS=False`（禁用启动时的自动迁移）
- 多个工作进程或副本尝试同时运行迁移

:::warning ENABLE_DB_MIGRATIONS 无法修复此问题
设置 `ENABLE_DB_MIGRATIONS=True`（默认值）只会让 Open WebUI 在下一次启动时**尝试**自动迁移。它**不会**追溯修复已经失败或跳过的迁移。如果数据库已经处于异常状态，必须手动应用迁移。
:::

**解决方案：**

按照[步骤 2](#step-2-diagnose-current-state)访问运行环境，然后运行：

```bash title="Terminal"
cd /app/backend/open_webui  # Docker
alembic upgrade head
```

这会应用所有待处理迁移，包括创建任何缺失的表。迁移成功后，正常重启 Open WebUI。

如果在手动迁移期间看到其他错误（例如[“table already exists”](#table-already-exists-errors)），请查看下面其他故障排除章节中的具体错误消息。

### “Duplicate Emails”迁移失败 {#duplicate-emails-migration-failure}

**症状：**升级停止并显示：

```
RuntimeError: Cannot add unique normalized user email index because duplicate emails exist:
someone@example.com (x2). Merge or remove the duplicate users and rerun migrations.
```

**原因：**Open WebUI 现在通过 `user` 表中小写 `email` 列上的唯一索引，强制每个电子邮件地址（不区分大小写）只能对应一个账户。旧版本没有此限制，因此实例中可能存在 `Someone@Example.com` 和 `someone@example.com` 两个独立账户，通常由混合使用多种登录方式造成。迁移不会替你选择保留哪一个，而是拒绝运行并列出涉及的每个地址。

**解决方法：**针对列出的每个地址，决定要保留哪个账户，然后在删除其他账户之前，将需要保留的内容转移到保留账户。

1. 列出受影响的账户，以便区分它们：

   ```sql
   SELECT id, email, name, role, created_at, last_active_at
   FROM "user"
   WHERE lower(email) IN (SELECT lower(email) FROM "user" GROUP BY lower(email) HAVING count(*) > 1)
   ORDER BY lower(email), created_at;
   ```

2. 删除每个重复账户前，检查其拥有的内容，因为聊天、文件夹、笔记、文件和工作区项目都通过所有者的 `id` 关联：

   ```sql
   SELECT (SELECT count(*) FROM chat WHERE user_id = '<id>') AS chats,
          (SELECT count(*) FROM folder WHERE user_id = '<id>') AS folders,
          (SELECT count(*) FROM note WHERE user_id = '<id>') AS notes;
   ```

3. 通过更新 `user_id` 将这些内容重新分配给保留账户，或者接受内容丢失，然后通过**管理员面板 > 用户**列表删除重复账户；此操作还会删除对应的 `auth` 行。

4. 重新运行升级。

不能保留已经清空的重复账户：索引覆盖所有 `email` 不为 null 的行，因此每个地址只保留一个账户之前，迁移会一直失败。

### “Table Already Exists”错误 {#table-already-exists-errors}

**症状：**运行 `alembic upgrade head` 失败并显示：

```
sqlalchemy.exc.OperationalError: (sqlite3.OperationalError) table chat_message already exists
```

或者其他表的类似错误（例如 `access_grant`）。

**原因：**先前的迁移**只完成了一部分**：表已在数据库中创建，但 Alembic 的版本跟踪未更新（通常是因为迁移在创建表后的数据回填步骤中被中断）。Alembic 仍认为该迁移尚未应用，因此尝试再次创建表。

:::tip 迁移具有幂等性
随附的 Alembic 迁移会检查实时架构，并**跳过已经存在的表、索引和列**，还会为旧版 Peewee 时代的表添加缺失的主键。许多架构已部分应用的升级可以直接通过 `alembic upgrade head` 顺利完成。下面的恢复步骤仍适用于以其他方式修改过的数据库。
:::

**诊断：**

```bash title="Terminal - Identify the Stuck Migration"
# 检查 Alembic 记录的当前版本
alembic current
# 示例输出：374d2f66af06 (head)

# 检查下一个迁移
alembic history
# 查找紧接当前版本之后的迁移
# 示例：374d2f66af06 -> 8452d01d26d7, Add chat_message table
```

**解决方案：**

有三种解决方法，按最安全到数据损失风险最高排列：

#### 选项 1：从备份恢复（推荐） {#option-1-restore-from-backup-recommended}

从[步骤 1](#step-1-create-and-verify-backup)创建的备份恢复数据库，然后在干净的备份上运行 `alembic upgrade head`。这可确保完整迁移（包括所有数据回填）正确完成。

#### 选项 2：删除表并重新运行 {#option-2-drop-the-table-and-re-run}

如果没有备份，可以删除只创建了一部分的表，让迁移从头运行。**执行此操作前，请验证是否安全：**

```bash title="Terminal - Verify Before Dropping"
# 1. 确认迁移不完整（当前修订版本应早于失败的迁移）
alembic current

# 2. 检查表中有多少数据（如果有）
# SQLite：
python3 -m sqlite3 /app/backend/data/webui.db "SELECT COUNT(*) FROM <table_name>;"
# PostgreSQL：
psql $DATABASE_URL -c "SELECT COUNT(*) FROM <table_name>;"

# 3. 打开迁移文件，验证源数据是否仍然存在
#    按修订版本 ID 查找文件：
ls migrations/versions/ | grep <revision_id>
#    阅读文件，查找它从哪些源列/表复制数据。
#    然后验证数据库中是否仍存在这些源列。
```

确认迁移不完整且源数据完好之后，删除表并重新运行：

```bash title="Terminal - Drop and Re-Run"
# SQLite：
python3 -m sqlite3 /app/backend/data/webui.db "DROP TABLE <table_name>;"

# PostgreSQL：
psql $DATABASE_URL -c "DROP TABLE <table_name>;"

# 重新运行迁移
alembic upgrade head
```

:::caution 先检查迁移文件
仅当迁移将数据从旧列**复制**到新表（原始数据保持完好）时，此操作才安全。打开迁移文件，确认它使用 `INSERT INTO ... SELECT FROM` 或类似操作，而**不是**修改或删除源数据的破坏性操作。如果不确定，请改用选项 1。
:::

#### 选项 3：设置版本标记并跳过（最后手段） {#option-3-stamp-past-it-last-resort}

如果上述两个选项都不可行，可以让 Alembic 完全跳过卡住的迁移：

```bash title="Terminal"
# 将迁移标记为已应用，而不实际运行
alembic stamp <revision_id>

# 继续其余迁移
alembic upgrade head
```

:::warning 这会跳过数据回填
设置版本标记会将迁移标记为完成，但会跳过将历史数据复制到新表等剩余步骤。旧数据**不会被删除**（仍存在于原始列中），但应用可能不再读取这些旧列。某些功能可能缺少部分历史数据，而其他功能可能完全丢失设置。
:::

如果 `alembic upgrade head` 再次因另一个迁移的“table already exists”错误而失败，请对每个卡住的迁移重复此过程。

:::tip 多个迁移卡住？
如果每次重试都遇到不同错误（先“duplicate column”，再“table already exists”，然后“no such column”），说明数据库在多个步骤中处于部分迁移状态。这通常发生在跨大版本升级之后（例如 0.7.x → 0.8.x）。分步恢复流程请参阅[跨大版本升级后出现多个失败](#multiple-failures-after-a-major-version-jump)。
:::

### 跨大版本升级后出现多个失败 {#multiple-failures-after-a-major-version-jump}

**症状：**跨多个版本升级后（例如 0.7.x → 0.8.x），Open WebUI 启动时因“no such column”错误崩溃（例如 `no such column: user.scim`）。运行 `alembic upgrade head` 时，在*更早的*迁移上因“duplicate column”或“already exists”错误失败。修复该错误后，*下一个*迁移又出现另一个错误，依此类推。

**原因：**跨大版本升级后 Open WebUI 启动时，会尝试按顺序运行所有待处理迁移。如果链中的任何一个迁移中途失败（常见原因：SQLite `NOT NULL` 约束没有默认值、进程中断、大型回填达到内存限制），部分架构更改会保留下来（因为 SQLite 迁移不是事务性的），但 `alembic_version` 不会前进。之后每次启动都会重试同一个失败的迁移，在已经应用的部分上崩溃，永远无法执行后续迁移。结果数据库架构变得拼凑不一：早期迁移的部分更改已应用，后期迁移则完全未应用。

**诊断：**

```bash title="Terminal - Confirm Partial Migration Chain"
# 检查 Alembic 记录的当前版本
alembic current
# 示例：37f288994c47（比 head 落后多个版本）

# 检查 head 的位置
alembic heads
# 示例：b2c3d4e5f6a7 (head)

# 列出 current 与 head 之间的完整迁移链
alembic history

# 检查当前修订版本下尚不应存在的架构元素
# （这些元素表示后续迁移已被部分应用）
python3 -m sqlite3 /app/backend/data/webui.db "PRAGMA table_info(channel_member);" | grep status
python3 -m sqlite3 /app/backend/data/webui.db "SELECT name FROM sqlite_master WHERE type='table' AND name='chat_message';"
```

如果 `alembic current` 显示旧修订版本，但数据库中已经存在后续迁移的表或列，则说明迁移链处于部分应用状态。

**解决方案：每次处理一个迁移：**

方法：分别升级到每个修订版本。成功则继续。如果因“duplicate column”或“already exists”失败，则设置版本标记并跳过。如果因其他错误失败，则停止并调查。

```bash title="Terminal - Step-by-Step Recovery"
# 获取按顺序排列的待处理迁移列表
alembic history

# 尝试第一个待处理迁移
alembic upgrade <first_pending_revision>
```

如果成功：

```bash
# 继续下一个
alembic upgrade <next_revision>
```

如果因“duplicate column name”或“already exists”失败：

```bash
# 该迁移的架构更改已在先前某次部分运行中应用。
# 设置版本标记并跳过，使 alembic_version 前进，而不重新运行 SQL。
alembic stamp <that_revision>

# 继续下一个迁移
alembic upgrade <next_revision>
```

重复操作，直到到达 head。

:::info 何时在这里设置版本标记是安全的？
确认该迁移的架构更改已存在于数据库中后，设置版本标记才是安全的；“already exists”或“duplicate column”错误本身就确认了这一点。这不同于盲目运行 `alembic stamp head`，后者会跳过*所有*待处理迁移，无论它们是否已经应用。
:::

**特殊情况：包含数据回填的迁移：**

某些迁移不仅更改架构，还会将数据从旧表复制到新表（例如 `chat_message` 迁移从 `chat` 表的 JSON 列回填）。如果此类迁移的*表创建*成功，但*回填*被中断：

```bash title="Terminal - Check if Backfill Completed"
# 检查表中是否有数据
python3 -m sqlite3 /app/backend/data/webui.db "SELECT COUNT(*) FROM <table_name>;"
```

如果计数大于零，回填很可能已完成，因此可以设置版本标记并跳过。如果计数为零，有两个选择：

1. **删除并重新运行**（保留数据，但大型数据库的回填可能需要很长时间）：
   ```bash
   python3 -m sqlite3 /app/backend/data/webui.db "DROP TABLE <table_name>;"
   alembic upgrade <that_revision>
   ```

2. **设置版本标记并跳过**（速度快，但会跳过回填，因此依赖新表的某些功能可能缺少部分历史数据）：
   ```bash
   alembic stamp <that_revision>
   ```

**验证并启动：**

```bash title="Terminal - Verify Recovery"
alembic current
# 应显示：<latest_revision> (head)
```

然后退出容器并正常启动：

```bash
exit
docker start open-webui
docker logs -f open-webui
```

:::warning 看到意外错误时停止
设置版本标记并继续的方法只适用于“already exists”和“duplicate column”错误，这些错误确认该迁移的架构更改已在数据库中。如果迁移因*其他*错误失败（例如数据类型不匹配、外键约束违反或与架构冲突无关的 Python traceback），**不要**设置版本标记跳过。请在 GitHub issue 或 Discord 上发布完整错误。
:::

### “Required environment variable not found”（未找到必需的环境变量） {#required-environment-variable-not-found}

**原因：**缺少 `WEBUI_SECRET_KEY` 环境变量。

**解决方案：**按照[步骤 2：设置必需的环境变量](#set-required-environment-variables)中的说明设置 `WEBUI_SECRET_KEY` 环境变量，然后重试 Alembic 命令。

:::warning 发生原因
Open WebUI 的 `env.py` 文件会导入模型，模型会导入 `open_webui.env`，后者验证 `WEBUI_SECRET_KEY` 是否存在。如果没有该变量，Python 会在 Alembic 连接数据库之前崩溃。
:::

### “No config file 'alembic.ini' found”（未找到配置文件 alembic.ini） {#no-config-file-alembicini-found}

**原因：**当前目录不正确。

**解决方案：**

```bash title="Terminal"
# 如果容器名称不是 open-webui，请查找容器名称
docker ps

# 查找 alembic.ini 的位置
find /app -name "alembic.ini" 2>/dev/null  # Docker
find . -name "alembic.ini"  # 本地

# 进入该目录
cd /app/backend/open_webui  # 最常见路径

# 验证当前位置正确
ls -la alembic.ini
```

### “Target database is not up to date”（目标数据库不是最新状态） {#target-database-is-not-up-to-date}

**原因：**数据库版本与预期架构不匹配。

**诊断：**

```bash title="Terminal - Diagnose Version Mismatch"
# 检查数据库记录的版本
alembic current

# 检查代码预期的版本
alembic heads

# 进行比较
```

**解决方案取决于诊断结果：**

<Tabs>
  <TabItem value="pending" label="Pending Migrations" default>
    **场景：**`alembic current` 显示的版本早于 `alembic heads`

    **解决方法：**只需应用待处理迁移。

    ```bash title="Terminal"
    alembic upgrade head
    ```
  </TabItem>
  <TabItem value="mismatch" label="Schema Mismatch">
    **场景：**`alembic current` 显示正确版本，但仍然看到错误

    **原因：**有人未通过迁移而手动修改了数据库架构，或者先前的迁移只完成了一部分。

    **解决方法：**从备份恢复；数据库已损坏。

    ```bash title="Terminal"
    # 停止所有服务
    docker stop open-webui

    # 恢复备份
    cp /path/to/webui.db.backup /path/to/webui.db

    # 再次尝试迁移
    alembic upgrade head
    ```
  </TabItem>
  <TabItem value="fresh" label="Fresh Database">
    **场景：**需要初始架构的新数据库

    **解决方法：**从头运行迁移。

    ```bash title="Terminal"
    alembic upgrade head
    ```
  </TabItem>
</Tabs>

:::danger 切勿使用“alembic stamp head”修复
你可能会看到运行 `alembic stamp head` 来“修复”版本不匹配的建议。**这很危险。**

`alembic stamp head` 告诉 Alembic“假设*所有*迁移都已应用”，但不实际运行任何迁移。这会造成永久性的数据库损坏：Alembic 认为架构已是最新，但事实并非如此。

**仅在以下情况下，`alembic stamp <specific_revision>` 才是安全的：**

- 已确认该迁移的架构更改存在于数据库中（例如“already exists”或“duplicate column”错误可以证明）；请参阅[跨大版本升级后出现多个失败](#multiple-failures-after-a-major-version-jump)
- 已使用 `create_all()` 手动创建所有表，需要将其标记为已迁移
- 你是开发人员，正在初始化与当前架构匹配的全新数据库
- 从另一个系统导入了数据库备份，需要将其标记为正确修订版本
- 已通过原始 SQL 手动应用迁移，需要更新版本跟踪

**切勿使用 `alembic stamp head` 一次性跳过所有待处理迁移。**
:::

### 在“Will assume non-transactional DDL”后进程卡住 {#process-hangs-after-will-assume-non-transactional-ddl}

**理解该消息：**这**不是错误**，而是信息性消息。SQLite 不支持事务性 DDL，因此 Alembic 提醒迁移无法自动回滚。

**如果确实卡住：**

<Tabs>
  <TabItem value="wait" label="Wait First" default>
    某些迁移（尤其是添加索引或修改大型表的迁移）需要数分钟。

    **操作：**等待 3–5 分钟，再判断是否卡住。
  </TabItem>
  <TabItem value="lock" label="Check Database Lock">
    另一个进程可能锁定了数据库。

    ```bash title="Terminal - Check for Locks"
    # 查找使用数据库文件的进程
    fuser /app/backend/data/webui.db

    # 终止任何孤立进程
    pkill -f "open-webui"

    # 验证没有进程在运行
    ps aux | grep open-webui

    # 再次尝试迁移
    alembic upgrade head
    ```
  </TabItem>
  <TabItem value="corrupt" label="Database Corruption">
    如果数据库已损坏，迁移会卡住。

    ```bash title="Terminal - Check Integrity"
    python3 -m sqlite3 /app/backend/data/webui.db "PRAGMA integrity_check;"
    ```

    如果完整性检查失败，请从备份恢复。
  </TabItem>
</Tabs>

### Autogenerate 检测到已删除的表 {#autogenerate-detects-removed-tables}

**症状：**运行 `alembic revision --autogenerate` 后，它试图删除现有表。

:::warning 不要运行 Autogenerate
**普通用户绝不应运行 `alembic revision --autogenerate`。**此命令供开发人员创建新迁移文件，而不是用于应用现有迁移。

需要运行的命令是 `alembic upgrade head`（不带 `revision`，不带 `--autogenerate`）。
:::

**如果意外创建了错误的迁移文件：**

```bash title="Terminal - Remove Bad Migration"
# 列出迁移文件
ls -la /app/backend/open_webui/migrations/versions/

# 删除错误的自动生成文件（最新文件）
rm /app/backend/open_webui/migrations/versions/<newest_timestamp>_*.py

# 恢复到已知的正常状态
git checkout /app/backend/open_webui/migrations/  # 如果使用 git
```

**技术背景：**出现“autogenerate detects removed tables”问题，是因为 Open WebUI 的 Alembic 元数据配置没有导入所有模型定义。这会导致 autogenerate 与不完整的元数据进行比较，误以为应删除表。这是开发人员层面的问题，不影响运行 `alembic upgrade` 的用户。

### PostgreSQL 外键错误 {#postgresql-foreign-key-errors}

:::info 仅限 PostgreSQL
此故障排除仅适用于 PostgreSQL 数据库。SQLite 对外键的处理方式不同。
:::

**症状：**出现 `psycopg2.errors.InvalidForeignKey: there is no unique constraint matching given keys for referenced table "user"` 等错误

**原因：**PostgreSQL 需要显式主键约束，而旧架构版本中缺少这些约束。

**PostgreSQL 的解决方案：**

```sql title="PostgreSQL Fix"
-- 连接到 PostgreSQL 数据库
psql -h localhost -U your_user -d open_webui_db

-- 添加缺失的主键约束（PostgreSQL 语法）
ALTER TABLE public."user" ADD CONSTRAINT user_pk PRIMARY KEY (id);

-- 验证约束已添加
\d+ public."user"
```

**注意：**`public.` 架构前缀和带引号的 `"user"` 标识符是 PostgreSQL 专用语法。此 SQL 在 SQLite 或 MySQL 上无法运行。

### 重复列错误 {#duplicate-column-errors}

:::danger 严重问题
重复列错误表明架构损坏，通常由迁移失败或手动修改数据库造成。这需要谨慎地手动干预。
:::

**症状：**迁移失败并显示类似以下错误：

```
sqlite3.OperationalError: duplicate column name: message.reply_to_id
```

或者启动 Open WebUI 时出现：

```
UNIQUE constraint failed: alembic_version.version_num
```

**原因：**

<ul>
  <li>先前的迁移只完成了一部分，留下重复列</li>
  <li>数据库曾被手动修改</li>
  <li>迁移在执行中途被中断</li>
  <li>直接跨多个版本升级（跳过中间迁移）</li>
</ul>

**诊断：**

```bash title="Terminal - Check for Duplicate Columns"
# 列出 message 表中的所有列
python3 -m sqlite3 /app/backend/data/webui.db "PRAGMA table_info(message);"

# 在输出中查找重复列名
# 有问题的输出示例：
# (10, 'reply_to_id', 'TEXT', 0, None, 0)
# (15, 'reply_to_id', 'TEXT', 0, None, 0)  <- 重复！
```

**解决方案：手动删除列：**

:::warning 数据丢失风险
删除列可能导致数据丢失。继续操作前，**先备份数据库**。
:::

```bash title="Terminal - Remove Duplicate Column (SQLite)"
# 1. 先备份数据库！
cp /app/backend/data/webui.db /app/backend/data/webui.db.pre-fix

# 2. 进入 SQLite
python3 -m sqlite3 /app/backend/data/webui.db

# 3. 检查当前表结构
PRAGMA table_info(message);

# 4. SQLite 不直接支持 DROP COLUMN，必须重建表
# 首先获取 CREATE TABLE 语句
SELECT sql FROM sqlite_master WHERE name='message';

# 5. 创建不含重复列的新表
-- 复制 CREATE TABLE 语句，但删除重复的列定义
-- 示例（根据实际架构调整）：
CREATE TABLE message_new (
    id TEXT PRIMARY KEY,
    content TEXT,
    role TEXT,
    -- ... 其他列 ...
    reply_to_id TEXT,  -- 只保留一个实例
    -- ... 其余列 ...
    FOREIGN KEY (reply_to_id) REFERENCES message(id)
);

# 6. 将数据从旧表复制到新表
INSERT INTO message_new SELECT * FROM message;

# 7. 删除旧表
DROP TABLE message;

# 8. 重命名新表
ALTER TABLE message_new RENAME TO message;

# 9. 退出 SQLite
.quit

# 10. 验证修复是否生效
python3 -m sqlite3 /app/backend/data/webui.db "PRAGMA table_info(message);"

# 11. 再次尝试迁移
cd /app/backend/open_webui
alembic upgrade head
```

**替代方法：知道重复列时的更简单方案：**

```bash title="Terminal - Quick Fix for Known Duplicate"
# 仅当该列确实完全重复，且 SQLite 的表重建能正确处理时才有效

python3 -m sqlite3 /app/backend/data/webui.db <<EOF
-- 使用正确架构创建临时表
CREATE TABLE message_temp AS SELECT DISTINCT * FROM message;

-- 删除原始表
DROP TABLE message;

-- 使用正确架构重新创建（从 SELECT sql FROM sqlite_master WHERE name='message' 获取）
-- 然后将数据复制回来
EOF
```

:::danger 何时寻求帮助
如果你不熟悉 SQL，或者不确定哪一列重复，**请到此停止并寻求帮助**，可前往 Open WebUI GitHub issues 或 Discord。请提供：
- `PRAGMA table_info(message);` 的输出
- 完整的迁移错误消息
- Open WebUI 版本历史（从哪个版本升级到哪个版本）
:::

**预防措施：**

<ul>
  <li>升级时切勿跨越大版本（不要从 v0.1.x 直接跳到 v0.4.x）</li>
  <li>升级前务必备份</li>
  <li>先在数据库副本上测试升级</li>
  <li>检查版本升级路径对应的迁移脚本</li>
</ul>

### Peewee 到 Alembic 的过渡问题 {#peewee-to-alembic-transition-issues}

**背景：**旧版 Open WebUI（0.4.x 之前）使用 Peewee 迁移。当前版本使用 Alembic。

**症状：**

- 同时存在 `migratehistory` 和 `alembic_version` 表
- 出现“migration already applied”相关错误

**自动执行的过程：**

1. Peewee 迁移代码已不存在。唯一与 Peewee 时代相关的处理是 Alembic 修订版本 `461111b60977`，它为旧表添加缺失的主键。遗留的 `migratehistory` 表不会产生作用。
2. 然后 `config.py` 通过 `run_migrations()` 运行 Alembic 迁移
3. 两个系统应能透明地协同工作

**如果自动过渡失败：**

```bash title="Terminal - Manual Transition"
# 检查是否存在旧 Peewee 迁移
python3 -m sqlite3 /app/backend/data/webui.db "SELECT * FROM migratehistory;" 2>/dev/null

# 如果存在 Peewee 迁移，确保它们已完成
# 然后运行 Alembic 迁移
cd /app/backend/open_webui
alembic upgrade head
```

:::tip
如果从非常旧的 Open WebUI 版本（< 0.3.x）升级，请考虑全新安装后导出/导入数据，而不是尝试跨多个大版本变更迁移数据库架构。
:::

## 高级操作 {#advanced-operations}

### 生产与多服务器部署 {#production-and-multi-server-deployments}

:::warning 滚动更新可能导致失败
在多服务器部署中，如果新代码需要尚未应用的架构更改，或者旧代码与新架构不兼容，滚动更新期间同时运行不同代码版本会导致错误。
:::

**推荐的部署策略：**

<Tabs>
  <TabItem value="separate-job" label="Separate Migration Job" default>

在部署新应用代码之前，将迁移作为一次性任务运行：

```bash title="Kubernetes Job Example"
# 1. 运行迁移任务
kubectl apply -f migration-job.yaml

# 2. 等待完成
kubectl wait --for=condition=complete job/openwebui-migration

# 3. 部署新应用版本
kubectl rollout restart deployment/openwebui
```

这可确保在任何新代码运行之前更新架构。

  </TabItem>
  <TabItem value="maintenance" label="Maintenance Window">

迁移期间让应用离线：

```bash title="Maintenance Workflow"
# 1. 停止所有应用实例
docker compose down

# 2. 运行迁移
docker run --rm -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main \
  bash -c "cd /app/backend/open_webui && alembic upgrade head"

# 3. 使用新代码启动所有实例
docker compose up -d
```

这是最简单的方法，但需要停机。

  </TabItem>
  <TabItem value="blue-green" label="Blue-Green Deployment">

维护两个完全相同的环境，并在迁移后切换流量：

```bash title="Blue-Green Workflow"
# 1. 绿色（新）环境使用已迁移的数据库
# 2. 将新代码部署到绿色环境
# 3. 全面测试绿色环境
# 4. 将流量从蓝色切换到绿色
# 5. 保留蓝色环境作为即时回滚选项
```

零停机，但需要双倍基础设施。

  </TabItem>
</Tabs>

### 生成 SQL 而不应用 {#generate-sql-without-applying}

要查看 SQL 更改而不接触真实数据库，请在副本上运行升级，并比较升级前后的架构差异。升级输出会列出它运行的每个迁移，差异会以 SQL 形式显示产生的架构更改。

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal - Preview Upgrade on a Copy"
    # 复制数据库并保存当前架构
    cp /path/to/webui.db /tmp/webui-preview.db
    sqlite3 /tmp/webui-preview.db ".schema" > /tmp/schema-before.sql

    # 升级副本
    DATABASE_URL="sqlite:////tmp/webui-preview.db" alembic upgrade head

    # 比较升级后的架构
    sqlite3 /tmp/webui-preview.db ".schema" > /tmp/schema-after.sql
    diff /tmp/schema-before.sql /tmp/schema-after.sql
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal - Preview Upgrade on a Copy"
    # 复制数据库（先停止 Open WebUI，使源数据库没有打开的连接）
    createdb -h localhost -U your_user -T open_webui_db open_webui_preview
    pg_dump -h localhost -U your_user -d open_webui_preview --schema-only > /tmp/schema-before.sql

    # 升级副本
    DATABASE_URL="postgresql://user:password@localhost:5432/open_webui_preview" alembic upgrade head

    # 比较升级后的架构，然后删除副本
    pg_dump -h localhost -U your_user -d open_webui_preview --schema-only > /tmp/schema-after.sql
    diff /tmp/schema-before.sql /tmp/schema-after.sql
    dropdb -h localhost -U your_user open_webui_preview
    ```
  </TabItem>
</Tabs>

**使用场景：**

- 企业环境中的 DBA 审核
- 了解将发生哪些更改
- 调试迁移问题

:::info 何时使用此功能
这是面向 DBA 或 DevOps 工程师的高级功能。普通用户直接运行 `alembic upgrade head` 即可。
:::

### 离线迁移（无网络） {#offline-migration-no-network}

如果数据库服务器离线或隔离，请在运行相同 Open WebUI 版本的机器上升级 SQLite 数据库副本，然后将其放回原处：

```bash title="Terminal - Offline Migration Workflow"
# 1. 停止生产环境中的 Open WebUI，然后将数据库传输到开发机器
scp production-server:/app/backend/data/webui.db /tmp/webui.db

# 2. 在开发机器上升级副本
DATABASE_URL="sqlite:////tmp/webui.db" alembic upgrade head

# 3. 确认已达到最新版本
DATABASE_URL="sqlite:////tmp/webui.db" alembic current

# 4. 将升级后的数据库传回生产环境并启动 Open WebUI
scp /tmp/webui.db production-server:/app/backend/data/webui.db
```

## 恢复流程 {#recovery-procedures}

### 从失败的迁移中恢复 {#recovery-from-failed-migration}

:::danger SQLite 无法回滚
SQLite 迁移是**非事务性的**。如果迁移中途失败，数据库会处于部分迁移状态。唯一安全的恢复方法是从备份恢复。
:::

**部分迁移的症状：**

- 某些表存在，其他表与预期架构不匹配
- 外键约束违反
- 缺少迁移本应添加的列
- 应用出现有关缺失数据库字段的错误

**恢复步骤：**

```bash title="Terminal - Restore from Backup"
# 1. 立即停止 Open WebUI
docker stop open-webui

# 2. 验证备份完整性
sqlite3 /path/to/webui.db.backup "PRAGMA integrity_check;"

# 3. 恢复备份
cp /path/to/webui.db.backup /path/to/webui.db

# 4. 重试前调查根本原因
docker logs open-webui > migration-failure-logs.txt

# 5. 再次尝试迁移前，携带日志寻求帮助
```

:::warning 不要使用“stamp”跳过未完成的迁移
如果迁移的架构更改实际*未*应用，不要使用 `alembic stamp` 将其标记为完成。如果迁移因“already exists”或“duplicate column”*以外*的错误失败，说明架构更改确实缺失，设置版本标记跳过会使数据库处于损坏状态。何时*适合*设置版本标记，请参阅[跨大版本升级后出现多个失败](#multiple-failures-after-a-major-version-jump)。
:::

### 验证数据库完整性 {#validate-database-integrity}

迁移前后，验证数据库是否未损坏：

<Tabs groupId="database-type">
  <TabItem value="sqlite" label="SQLite" default>
    ```bash title="Terminal - SQLite Integrity Check"
    python3 -m sqlite3 /app/backend/data/webui.db "PRAGMA integrity_check;"

    # 应输出：('ok',)
    # 如果输出其他内容，则数据库已损坏
    ```
  </TabItem>
  <TabItem value="postgresql" label="PostgreSQL">
    ```bash title="Terminal - PostgreSQL Integrity Check"
    # 检查表是否损坏
    psql -h localhost -U user -d dbname -c "SELECT * FROM pg_stat_database WHERE datname='open_webui_db';"

    # 清理并分析
    psql -h localhost -U user -d dbname -c "VACUUM ANALYZE;"
    ```
  </TabItem>
</Tabs>

## 迁移后检查清单 {#post-migration-checklist}

迁移成功后，验证以下各项：

- [ ] `alembic current` 显示 `(head)`，表示最新版本
- [ ] Open WebUI 启动时没有错误
- [ ] 可以成功登录
- [ ] 核心功能正常（聊天、模型选择等）
- [ ] 日志中没有错误消息
- [ ] 数据看起来完好（用户、聊天、模型）
- [ ] 稳定运行 1 周后，可以安全归档备份

:::tip 保留近期备份
大版本迁移前的备份至少保留 1–2 周。有些问题可能会在数天后执行特定工作流程时才出现。
:::

## 获取帮助 {#getting-help}

如果按照本指南操作后迁移仍然失败：

**收集诊断信息：**

```bash title="Terminal - Collect Diagnostic Data"
# 版本信息
docker logs open-webui 2>&1 | head -20 > diagnostics.txt

# 迁移状态
cd /app/backend/open_webui
alembic current -v >> diagnostics.txt
alembic history >> diagnostics.txt

# 数据库信息（SQLite）
python3 -m sqlite3 /app/backend/data/webui.db "SELECT name FROM sqlite_master WHERE type='table';" >> diagnostics.txt
python3 -m sqlite3 /app/backend/data/webui.db "SELECT * FROM alembic_version;" >> diagnostics.txt

# 完整迁移日志
alembic upgrade head 2>&1 >> diagnostics.txt
```

**获取帮助的途径：**

1. **Open WebUI Discord 社区**
   - 社区成员提供实时支持
   - 分享错误消息和诊断信息

2. **请提供以下信息：**
   - Open WebUI 版本
   - 安装方式（Docker/本地）
   - 数据库类型（SQLite/PostgreSQL）
   - `alembic current` 和 `alembic history` 的输出
   - 完整的错误消息
   - 失败时正在执行的操作

:::note
不要公开分享 `webui.db` 数据库文件；其中包含用户凭据和敏感数据。只分享诊断文本输出。
:::
