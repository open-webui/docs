---
sidebar_position: 1
title: "知识库同步（oikb）"
slug: /ecosystem/knowledge-base-sync
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 知识库同步（oikb）

<ThemedImage
  alt="知识同步：两座塔楼之间有一个正在传输的方块"
  sources={{
    light: useBaseUrl('/images/banners/kbsync-light.svg'),
    dark: useBaseUrl('/images/banners/kbsync-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**自动让知识库与权威来源保持同步。**

[oikb](https://github.com/open-webui/oikb)是用于将内容镜像到[知识库](/features/workspace/knowledge)的官方配套工具。将它指向本地文件夹、GitHub 仓库、Confluence 空间、S3 存储桶或其 44 个连接器中的任何一个，它就能让知识库保持最新。

一次性上传的内容在来源变化时就会过时，而 oikb 与此不同，它执行**增量**同步：只需将知识库与持续更新的来源连接一次，随后即可按计划、在每次推送时或按需保持更新。文档仓库、wiki、存储桶都能保持最新，无需任何人持续看管。

它是一个独立程序（一个命令行工具，加上可选的长期运行[守护进程](/ecosystem/knowledge-base-sync/daemon)），不属于 Open WebUI 服务器，但专为 Open WebUI 构建，并通过标准 REST API 与其通信。

:::info 需要 Open WebUI 0.9.6+
oikb 会调用增量同步端点（`POST /api/v1/knowledge/{id}/sync/diff` 和 `.../sync/cleanup`）。这些端点的服务器端说明见[知识 → 同步本地目录](/features/workspace/knowledge#syncing-a-local-directory)。
:::

---

## 为什么使用知识库同步？ {#why-knowledge-base-sync}

### 仅传输变化 {#only-the-changes-move}

系统会计算每个文件的哈希（SHA-256），并与服务器已有内容进行比较，因此只上传新增和修改的文件，并移除已删除的文件。包含 10,000 个未变文件的仓库可在数秒内完成重新同步，因为无需重新上传或重新嵌入任何内容。频繁运行几乎不会产生额外开销。

### 为大型资料库而构建 {#built-for-large-libraries}

应用内的**同步目录（Sync Directory）**操作在浏览器中运行，因此处理大型数据集（数千个文件或数 GB 的资料库）时速度会变慢，而且几乎不显示进度。oikb 以原生方式运行，提供进度条、并行上传和重试，因此包含数万文件的资料库也能可靠同步。**如果你的语料库很大，这是推荐的加载方式。**

### 一个工具，支持所有来源 {#one-tool-every-source}

可将它指向本地文件夹、Git 仓库、Confluence 或 Notion 空间、S3 存储桶、Jira 项目、Slack 频道以及另外 30 多种来源。所有来源都使用相同的命令和增量同步引擎。

### 自动保持最新 {#stays-fresh-on-its-own}

可以手动同步一次，也可以交给[守护进程](/ecosystem/knowledge-base-sync/daemon)按间隔、按 cron 计划运行，或在有人推送时立即运行。连接到持续更新来源的知识库，不会再悄无声息地逐渐过时。

### 模型可以驱动同步 {#the-model-can-drive-it}

守护进程同时也是一个 [OpenAPI 工具服务器](/ecosystem/knowledge-base-sync/daemon#let-the-model-trigger-syncs)，因此模型可以在对话中触发重新同步并报告结果，无需任何人操作命令行。

---

## 核心功能 {#key-features}

| | |
| :--- | :--- |
| **增量同步** | SHA-256 差异比较仅上传新增和修改的文件；删除的文件会被移除，未变化的文件保持不动 |
| **44 个连接器** | 本地文件夹、Git、云存储、wiki、工单、聊天、CRM，以及 Web 爬虫 |
| **计划与 webhook 同步** | 按间隔、按 cron 计划运行，或在有人推送时立即运行（通过守护进程） |
| **监视模式** | 每次保存时自动同步本地文件夹 |
| **选择性同步** | 包含/排除 glob、大小上限，并将一个来源拆分到多个知识库 |
| **可由模型触发** | 守护进程是 OpenAPI 工具服务器，模型可以从聊天中启动和检查同步 |
| **使用你的访问权限** | 以你的用户身份进行身份验证，绝不绕过知识库访问控制 |
| **可用于生产环境** | Prometheus 指标、结构化 JSON 日志、同步历史和失败通知 |

---

## 安装 {#install}

```bash
pip install oikb
```

需要 **Python 3.11+** 和 **Open WebUI 0.9.6+** 服务器。大多数连接器使用普通 HTTP，无需额外组件。少数连接器需要其厂商 SDK，可作为可选附加组件安装：

```bash
pip install oikb[s3]       # Amazon S3
pip install oikb[gcs]      # Google Cloud Storage
pip install oikb[azure]    # Azure Blob
pip install oikb[dropbox]  # Dropbox
pip install oikb[gdrive]   # Google Drive
pip install oikb[all]      # 一次安装所有可选连接器
```

完整的附加组件集合为 `s3`、`gcs`、`azure`、`dropbox`、`r2`、`gdrive`、`gmail`、`gsites`、`web`、`oracle`、`sharepoint-cert` 和 `all`。此处未列出的连接器（GitHub、Confluence、Notion、Jira、Slack 和大多数其他连接器）不需要附加组件。

生产环境可使用发布在 `ghcr.io/open-webui/oikb` 的 Docker 镜像。请参阅[运行守护进程](/ecosystem/knowledge-base-sync/daemon#deployment)。

---

## 快速开始 {#quick-start}

```bash
export OPEN_WEBUI_URL=http://localhost:3000
export OPEN_WEBUI_API_KEY=sk-your-api-key   # 设置 → 账户 → API 密钥

# 将本地文件夹同步到知识库
oikb sync ./docs --kb-id your-kb-id

# 或同步 GitHub 仓库，无需本地克隆
oikb sync github:owner/repo --kb-id your-kb-id

# 精确预览将发生的变化，不上传任何内容
oikb sync ./docs --kb-id your-kb-id --dry-run
```

`--kb-id` 是知识库的 ID，即工作区中其 URL 里的 UUID（`.../knowledge/<kb-id>`）。同一命令运行两次时，第二次不会执行任何变更：只有内容发生变化的文件才会被处理。

### 同步过程示例 {#what-a-sync-looks-like}

第一次运行会上传所有内容；之后每次运行只处理发生变化的内容：

```console
$ oikb sync github:acme/handbook --kb-id 8f3a2b1c-...
  1,204 files found
  Diff: +3, ~1, -2, 1198 unchanged
  Uploading ━━━━━━━━━━━━━━━━━━━━ 4/4 • 0:00:02
Sync complete: 3 added, 1 modified, 2 deleted, 1198 unchanged
```

`Diff` 行是服务器对“实际发生了什么变化”的回答：三个新文件、一个修改的文件、两个删除的文件，以及 1,198 个完全保持不变的文件。

:::note 访问权限就是你的用户权限
API 密钥会以**你的**用户身份进行身份验证。oikb 只能读写该用户已有权访问的知识库。它不是管理员后门，也不会绕过[访问控制](/features/authentication-access/rbac)。
:::

### 保存凭据 {#saving-credentials}

这样就不用在每条命令中重复输入 URL 和密钥：

```bash
oikb config set url http://localhost:3000
oikb config set token sk-your-api-key
oikb config get                    # 显示已保存的内容（token 会被掩码）
```

凭据保存在 `~/.config/oikb/config.yaml`（可用 `OIKB_CONFIG_DIR` 覆盖该目录）。解析顺序按优先级从高到低如下：

1. CLI 参数（`--url`、`--token`）
2. 环境变量（`OPEN_WEBUI_URL`、`OPEN_WEBUI_API_KEY`）
3. 配置文件

---

## 增量同步的工作方式 {#how-incremental-sync-works}

1. oikb 扫描来源，并为每个文件计算 **SHA-256** 校验和。
2. 它将该清单（路径、文件名、校验和和大小，**不包括**文件内容）发送到 Open WebUI 的 `/sync/diff`，后者会准确回复哪些内容被**新增**、**修改**和**删除**，以及需要创建或移除哪些目录。该调用是只读的，不会更改知识库。
3. oikb 删除过时文件（以及目前为空的目录），创建任何缺失的目录，然后仅上传**新增**和**修改**的文件，并为每个文件附上其哈希，以便服务器跳过重复哈希计算。在服务器端，清理还会删除过时文件的记录和存储字节，除非 `ENABLE_KNOWLEDGE_FILE_RETENTION=true`、该文件仍链接到另一个知识库，或者密钥所属用户既不是文件所有者也不是管理员。0.9.6 之前上传的文件没有存储的校验和，因此首次同步时会被报告为已修改；它会被替换一次，此后保持不变。

由于差异比较基于内容哈希，未变化的仓库几乎可以立即完成重新同步：不会重新上传、重新提取或重新嵌入任何内容，因此频繁运行也不会产生额外处理开销。只有真实变化才会触发实际工作。

上传期间出现临时服务器错误（HTTP 5xx）时，会采用指数退避策略最多重试三次。上传默认按顺序执行；对于大型同步，可传入 `--concurrency N`（或按条目设置 `concurrency:`）以并行上传 N 个文件。

与之匹配的服务器端行为，以及可供你自己的脚本使用的这两个相同端点，记录在[知识 → 同步本地目录](/features/workspace/knowledge#syncing-a-local-directory)和[知识 → API 访问](/features/workspace/knowledge#api-access)中。oikb 是受维护的客户端，实现完整流程，并在此基础上增加计划调度、webhook 和 44 个连接器。

---

## 来源和连接器 {#sources-and-connectors}

**来源**可以是本地路径，也可以是 `scheme:target` 字符串。oikb 会将 scheme 解析为连接器，拉取文件并同步到知识库。凭据绝不会写入来源字符串或 `.oikb.yaml`；每个连接器都从**环境变量**读取凭据，使机密留在配置之外（可结合 [`${VAR}` 插值](/ecosystem/knowledge-base-sync/daemon#the-oikbyaml-config-file)，让配置文件可以安全提交）。

下表中，`[brackets]` 表示来源字符串的可选部分。

| 分组 | 连接器 | 来源字符串 | 凭据（环境变量） |
|---|---|---|---|
| **本地** | 本地目录 | `./path`（任意文件系统路径） | 无 |
| **代码** | GitHub | `github:owner/repo` | `GITHUB_TOKEN`（私有仓库） |
| | GitLab | `gitlab:owner/repo` | `GITLAB_TOKEN`、`GITLAB_URL`（自托管） |
| | Bitbucket | `bitbucket:owner/repo` | `BITBUCKET_USER`、`BITBUCKET_APP_PASSWORD` |
| **云存储** | Amazon S3 | `s3://bucket/prefix` | 标准 AWS 凭据链（boto3） |
| | Google Cloud Storage | `gs://bucket/prefix` | `GOOGLE_APPLICATION_CREDENTIALS` |
| | Azure Blob | `az://container/prefix` | `AZURE_STORAGE_CONNECTION_STRING` |
| | Cloudflare R2 | `r2://bucket/prefix` | `R2_ACCOUNT_ID`、`R2_ACCESS_KEY_ID`、`R2_SECRET_ACCESS_KEY` |
| | Oracle Cloud | `oci://bucket/prefix` | `OCI_NAMESPACE` + OCI SDK 配置 |
| | Dropbox | `dropbox:/path` | `DROPBOX_TOKEN` |
| | Google Drive | `gdrive:folder_id` | `GOOGLE_APPLICATION_CREDENTIALS` |
| | SharePoint | `sharepoint:site[/library]` | `SHAREPOINT_TENANT_ID`、`SHAREPOINT_CLIENT_ID` 和 `SHAREPOINT_CLIENT_SECRET`，**或** `SHAREPOINT_CERTIFICATE_PATH` |
| | Egnyte | `egnyte:/path` | `EGNYTE_DOMAIN`、`EGNYTE_TOKEN` |
| **Wiki 与知识库** | Confluence | `confluence:SPACE` | `CONFLUENCE_URL`、`CONFLUENCE_USER`、`CONFLUENCE_TOKEN` |
| | Notion | `notion:root_id` | `NOTION_TOKEN` |
| | BookStack | `bookstack:` | `BOOKSTACK_URL`、`BOOKSTACK_TOKEN_ID`、`BOOKSTACK_TOKEN_SECRET` |
| | Discourse | `discourse:[category]` | `DISCOURSE_URL`、`DISCOURSE_API_KEY`、`DISCOURSE_API_USERNAME` |
| | GitBook | `gitbook:space_id` | `GITBOOK_TOKEN` |
| | Guru | `guru:[collection]` | `GURU_USER`、`GURU_TOKEN` |
| | Outline | `outline:[collection]` | `OUTLINE_URL`、`OUTLINE_TOKEN` |
| | Slab | `slab:[org]` | `SLAB_ORG`、`SLAB_TOKEN` |
| | Document360 | `document360:project_id` | `DOCUMENT360_TOKEN` |
| | DokuWiki | `dokuwiki:[namespace]` | `DOKUWIKI_URL`、`DOKUWIKI_USER`、`DOKUWIKI_PASSWORD` |
| | Google Sites | `gsites:site_id` | `GOOGLE_SITES_TOKEN` |
| **工单** | Jira | `jira:PROJECT` | `JIRA_URL`、`JIRA_USER`、`JIRA_TOKEN` |
| | Linear | `linear:team_key` | `LINEAR_TOKEN` |
| | Zendesk | `zendesk:[subdomain]` | `ZENDESK_SUBDOMAIN`、`ZENDESK_USER`、`ZENDESK_TOKEN` |
| | Freshdesk | `freshdesk:[domain]` | `FRESHDESK_DOMAIN`、`FRESHDESK_TOKEN` |
| | Asana | `asana:project_id` | `ASANA_TOKEN` |
| | ClickUp | `clickup:space_id` | `CLICKUP_TOKEN` |
| | Airtable | `airtable:base_id[/table]` | `AIRTABLE_TOKEN` |
| | ServiceNow | `servicenow:[table]` | `SERVICENOW_INSTANCE`、`SERVICENOW_USER`、`SERVICENOW_PASSWORD` |
| | ProductBoard | `productboard:` | `PRODUCTBOARD_TOKEN` |
| **消息** | Slack | `slack:channel_id` | `SLACK_TOKEN` |
| | Discord | `discord:channel_id` | `DISCORD_TOKEN` |
| | Microsoft Teams | `teams:team_id/channel_id` | `TEAMS_TENANT_ID`、`TEAMS_CLIENT_ID`、`TEAMS_CLIENT_SECRET` |
| | Gmail | `gmail:user@example.com` | `GOOGLE_APPLICATION_CREDENTIALS` |
| | Zulip | `zulip:[stream]` | `ZULIP_URL`、`ZULIP_EMAIL`、`ZULIP_KEY` |
| **会议** | Gong | `gong:` | `GONG_ACCESS_KEY`、`GONG_ACCESS_KEY_SECRET` |
| | Fireflies | `fireflies:` | `FIREFLIES_TOKEN` |
| **销售与 CRM** | Salesforce | `salesforce:` | `SALESFORCE_URL`、`SALESFORCE_TOKEN` |
| | HubSpot | `hubspot:` | `HUBSPOT_TOKEN` |
| **论坛** | XenForo | `xenforo:[forum_id]` | `XENFORO_URL`、`XENFORO_KEY` |
| **Web** | 网站 / 站点地图 | `web:https://example.com` | 无 |

以下是一些值得了解的连接器说明：

- **GitHub** 通过 Trees API 读取，因此无需本地克隆。添加 `--branch` 和 `--path`（或配置中的 `branch:` / `path:`）可指定分支或子目录。
- **聊天连接器**（Slack、Discord、Teams）按天拆分历史记录，从而实现真正的增量同步：过去日期的内容不可变，因此其校验和绝不会变化，也绝不会重新上传。
- **Jira** 和 **ServiceNow** 接受来源字符串中的额外选项（查询、字段、输出格式、结果上限），例如 `servicenow:incident?query=...&limit=500`。每个连接器的完整选项请参阅 [oikb 仓库](https://github.com/open-webui/oikb)。

---

## 筛选同步内容 {#filtering-what-gets-synced}

使用包含/排除 glob 和大小上限来缩小来源范围。这些设置位于 [`.oikb.yaml`](/ecosystem/knowledge-base-sync/daemon#the-oikbyaml-config-file) 的 `filter:` 下：

```yaml
sources:
  - name: docs
    source: github:owner/repo
    kb-id: your-kb-id
    filter:
      include: ["docs/**/*.md", "*.txt"]   # 仅包含这些
      exclude: ["drafts/**", "**/*.tmp"]   # 排除这些（在 include 之后应用）
      max-size: 50mb                        # 跳过更大的文件
```

`max-size` 接受 `b`、`kb`、`mb`、`gb`。超大文件会在差异比较前收到警告并被跳过，因此绝不会上传。该设置也可用作 CLI 参数：`oikb sync ./docs --kb-id abc --max-file-size 50mb`。管理员设置限制后，Open WebUI 也会执行自己的限制（两者默认均未设置）：超过管理员最大上传大小（`RAG_FILE_MAX_SIZE`，单位为 MB）的文件会被拒绝并返回 HTTP 413；扩展名不在允许的文件扩展名（`RAG_ALLOWED_FILE_EXTENSIONS`）内的文件会被拒绝并返回 HTTP 400。因此，除非你在这里将其筛选掉，否则此类文件每次同步都会失败。

若要将一个来源的不同部分路由到不同知识库，请使用具有不同 `filter.include` 和 `kb-id` 的独立条目：

```yaml
sources:
  - name: user-docs
    source: github:owner/repo
    kb-id: abc123
    filter: { include: ["docs/**"] }
  - name: api-reference
    source: github:owner/repo
    kb-id: def456
    filter: { include: ["api/**"] }
```

### 跳过的文件与 `.oikbignore` {#skipped-files-and-oikbignore}

同步**本地目录**时，oikb 始终会跳过隐藏条目（任何以 `.` 开头的条目）和内置列表：`.git`、`.svn`、`.hg`、`.DS_Store`、`Thumbs.db`、`__pycache__`、`.pytest_cache`、`node_modules`、`.oikb`、`.env`。

如需项目专属排除规则，请在同步根目录中放置一个 `.oikbignore` 文件。它使用 gitignore 风格的 glob（末尾的 `/` 仅匹配目录，开头的 `/` 锚定到根目录）。尚不支持使用 `!` 进行否定。

---

## 监视模式 {#watch-mode}

对于正在积极编辑的本地目录，`watch` 会在文件发生变化时立即重新同步：

```bash
oikb watch ./docs --kb-id your-kb-id
```

它使用文件系统事件（而非轮询），防抖时间为一秒（可用 `--debounce` 调整），并持续运行直到你按 Ctrl+C 停止。它适合实时笔记文件夹；对于任何远程或无人值守场景，请改用[守护进程](/ecosystem/knowledge-base-sync/daemon)。

---

## 在 CI 中执行一次性同步 {#one-shot-sync-in-ci}

Docker 镜像可作为一次性命令运行，因此能直接用作 [GitHub Actions](/ecosystem/knowledge-base-sync/daemon#deployment) 步骤，在每次合并时将文档推送到知识库：

```yaml
- name: Sync docs to Open WebUI
  uses: docker://ghcr.io/open-webui/oikb:latest
  with:
    args: sync /github/workspace/docs --kb-id ${{ secrets.KB_ID }}
  env:
    OPEN_WEBUI_URL: ${{ secrets.OPEN_WEBUI_URL }}
    OPEN_WEBUI_API_KEY: ${{ secrets.OPEN_WEBUI_API_KEY }}
```

---

## CLI 参考 {#cli-reference}

| 命令 | 作用 |
|---|---|
| `oikb sync <source>` | 从来源增量同步到知识库（`--kb-id`）。省略 `<source>` 可同步 [`.oikb.yaml`](/ecosystem/knowledge-base-sync/daemon#the-oikbyaml-config-file) 中的每个条目。 |
| `oikb sync --dry-run` | 预览新增/修改/删除，不上传。 |
| `oikb sync --concurrency N` | 并行上传 N 个文件（默认值为 1，即按顺序上传）。 |
| `oikb sync --max-file-size 50mb` | 跳过超过指定大小的文件。 |
| `oikb sync --name <alias>` | 在 `.oikb.yaml` 模式下，仅同步匹配的条目。 |
| `oikb diff <source> --kb-id ID` | 预览变化（`sync --dry-run` 的别名）。 |
| `oikb watch <dir> --kb-id ID` | 本地目录发生变化时自动同步（`--debounce`）。 |
| `oikb init` | 通过交互式向导写入 `.oikb.yaml`。 |
| `oikb validate` | 检查 `.oikb.yaml` 语法。添加 `--deep` 还可 ping Open WebUI、验证 API 密钥并确认每个知识库存在。 |
| `oikb daemon` | 运行带 HTTP API 的计划[守护进程](/ecosystem/knowledge-base-sync/daemon)。 |
| `oikb ls --kb-id ID` | 列出知识库中的文件。 |
| `oikb status --kb-id ID` | 显示知识库的名称、文件数和总大小。 |
| `oikb history` | 查看同步历史（`--json`、`--errors`、`--kb-id`、`--clear --days N`）。 |
| `oikb reset --kb-id ID` | 删除知识库中的所有文件（`--keep-directories` 保留文件夹结构）。执行前会要求确认。 |
| `oikb config set url\|token <value>` | 保存 Open WebUI URL 或 API 密钥。`oikb config get` 显示这些值。 |

为任何命令添加 `-q` / `--quiet` 可禁止非错误输出（在脚本中很有用），添加 `-v` / `--verbose` 可显示每个文件的详细信息。

:::warning `oikb reset` 会删除知识库中的所有内容
`reset` 会移除目标知识库中的每个文件，而不仅是 oikb 上传的文件。这是唯一具有破坏性的命令。确认提示至关重要，请勿忽视。
:::

---

## 使用场景 {#use-cases}

### 始终保持最新的产品文档 {#always-current-product-docs}

将文档仓库（`github:acme/docs`）连接到知识库，并在 CI 中每次合并时同步，或通过 webhook 同步。支持代理和客户查询的文档最多只落后一个提交。

### 大型个人或家庭资料库 {#a-large-personal-or-family-vault}

一个整理良好的文件夹中存放数千份混合文档（PDF、Markdown、扫描件、记录）。将 oikb 指向资料库顶层，它就会把整棵目录树（包括每个子目录）同步到一个知识库，家庭成员无需知道答案位于哪个子文件夹即可提问。应用内同步难以应对这种规模，而 oikb 专为此构建。

### 来自 wiki 的公司手册 {#company-handbook-from-the-wiki}

通过每天早晨运行的 cron，将 Confluence 空间或 Notion 工作区镜像到知识库。“咨询 HR”模型会根据当前手册作答，wiki 中所做的编辑会在第二天显示，无需任何人重新上传。

### 来自工单的支持知识 {#support-knowledge-from-tickets}

将已解决的 Zendesk 或 Jira 工单同步到知识库，使分类模型能够展示以往如何处理类似问题，并以你自己的历史记录而非通用训练数据为依据。

### 理解代码的助手 {#code-aware-assistant}

使用筛选器将一个仓库拆分到两个知识库：`docs/**` 下的文档进入“文档”知识库，`src/**` 下的源代码进入“代码”知识库。为模型附加适合的知识库，两者即可通过一份配置保持同步。

---

## 限制 {#limitations}

### 需要 Open WebUI 0.9.6+ {#requires-open-webui-096}


### 守护进程以单进程运行 {#the-daemon-runs-as-one-process}

计划调度和每个知识库的锁都位于单个进程中，因此[守护进程](/ecosystem/knowledge-base-sync/daemon#deployment)应以单副本运行。要覆盖更多来源，请在一个守护进程中添加条目，而不是运行多个副本。

### 索引仍在服务器端进行 {#indexing-still-happens-server-side}

oikb 的上传速度很快，但 Open WebUI 会异步提取并嵌入每个新文件。文件存储完成后，上传即会返回；提取、嵌入以及链接到知识库则在后台任务中进行，`GET /api/v1/files/{id}/process/status` 会报告文件何时进入 `completed` 或 `failed` 状态。在此之前，文件不会出现在知识库的文件列表中。

---

## 故障排除 {#troubleshooting}

**`Connection refused` 或 `401 Unauthorized`**：URL 或密钥错误或未设置。使用 `oikb config get`，或 `echo $OPEN_WEBUI_URL` 和 `echo $OPEN_WEBUI_API_KEY` 检查。密钥必须是有效的 Open WebUI API 密钥（设置 → 账户）。API 密钥默认关闭：管理员必须启用它们（`ENABLE_API_KEYS`），非管理员用户还需要 API Keys 权限，否则账户页面不会显示 API 密钥区域。

**`403 Forbidden`**：密钥有效，但服务器禁用了 API 密钥；你的用户缺少 API Keys 权限；端点限制已开启（`ENABLE_API_KEYS_ENDPOINT_RESTRICTIONS`），且 `API_KEYS_ALLOWED_ENDPOINTS` 未包含 `/api/v1/knowledge` 和 `/api/v1/files`；或者你的用户没有目标知识库的写入权限。

**`No source specified and no .oikb.yaml found`**：你在未指定来源的情况下运行了 `oikb sync`，且当前目录中没有 `.oikb.yaml`。请传入来源（`oikb sync ./docs --kb-id ...`），或使用 `oikb init` 创建配置。

**大型同步速度慢**：添加 `--concurrency 4` 进行并行上传，设置 `filter.max-size` 跳过大型二进制文件，并使用 `filter.exclude` 排除模型不需要的任何内容。

**守护进程无法启动 / 某个知识库似乎缺失**：运行 `oikb validate --deep`。它会验证服务器是否可访问、API 密钥是否有效，以及配置中的每个 `kb-id` 是否确实存在。

**我的知识库 ID 在哪里？** 在工作区中打开知识库；UUID 就是 URL 的最后一段路径，即 `.../knowledge/<kb-id>`。

---

## 另请参阅 {#see-also}

- **[运行守护进程 →](/ecosystem/knowledge-base-sync/daemon)**：计划同步、webhook、HTTP API、可观测性、部署，以及让模型触发同步。
- **[知识](/features/workspace/knowledge)**：oikb 向其提供内容的知识库功能，包括服务器端[同步端点](/features/workspace/knowledge#api-access)。
- **[OpenAPI / MCP 工具服务器](/features/extensibility/mcp)**：守护进程如何接入为模型可调用的工具。
