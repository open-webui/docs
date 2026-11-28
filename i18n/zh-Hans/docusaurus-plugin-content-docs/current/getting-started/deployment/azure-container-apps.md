---
slug: /deployment/azure-container-apps
sidebar_position: 3
title: "Azure Container Apps"
description: "在 Azure Container Apps 上使用 PostgreSQL、Redis、Blob Storage 和托管密钥部署 Open WebUI。"
---

# 在 Azure Container Apps 上运行 Open WebUI

Azure Container Apps 无需你自行运维 Kubernetes 即可运行应用程序。本文使用 Azure 门户配置一个应用程序和一个单独的手动迁移作业。对于 AKS，请使用 [Kubernetes 部署](./kubernetes)。

有关共享架构，请参阅现有的[容器服务指南](/enterprise/deployment/container-service)。以下应用程序设置面向 **Open WebUI v0.13.0**。

## 1. 准备 Azure 服务 {#1-prepare-the-azure-services}

| 组件 | 创建应用程序前的准备工作 |
| :--- | :--- |
| 镜像 | 将带版本的标准镜像（`ghcr.io/open-webui/open-webui:v0.13.0`）复制到 Azure Container Registry，并保留不可变摘要。Slim 镜像没有 Azure Blob 客户端。 |
| Container Apps 环境 | 一个具备后端服务所需 VNet 连接、DNS、出口和私有端点访问能力的环境。 |
| 数据库 | Azure Database for PostgreSQL Flexible Server、一个应用程序数据库/角色，以及由管理员启用的 `vector` 扩展。 |
| Redis | 一个兼容的 Redis 端点，例如 [Azure Managed Redis](https://learn.microsoft.com/en-us/azure/redis/overview)。验证其集群模式、身份验证和 TLS 设置。 |
| 文件 | 一个 Blob Storage 账户和一个用于应用程序上传内容的私有容器。 |
| 密钥 | Key Vault，以及一个有权读取应用程序密钥的标识。 |
| 模型和内容提取 | 可访问的聊天/嵌入 API 和一个私有 Tika 服务。 |
| 浏览器访问 | 一个已批准的 HTTPS 主机名和通往应用程序的访问路径。 |

如果所选端点使用 Redis Cluster，请设置 `REDIS_CLUSTER=true`（除非设置了 `WEBSOCKET_REDIS_CLUSTER`，否则 WebSocket 会遵循此设置）。按照 [Redis 配置](/reference/env-configuration#redis_url)设置所选端点。Container Apps 的本地文件系统是临时的；不要将其用于 SQLite 或持久文件存储。

## 2. 配置凭据和环境值 {#2-configure-credentials-and-environment-values}

在 Key Vault 中存储以下凭据。使用由托管标识支持的 Container Apps 密钥引用，该标识需要有检索这些密钥的权限。此标识还需要适当的镜像仓库拉取权限。请参阅 [Container Apps 密钥和 Key Vault 引用](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets)。

| 环境变量 | 密钥值 |
| :--- | :--- |
| `WEBUI_SECRET_KEY` | 稳定的随机签名密钥，在每个实例上保持一致。使用 `openssl rand -hex 32` 生成一次。 |
| `DATABASE_URL` | PostgreSQL 连接 URL，包含服务提供方要求的 TLS 参数。除非设置 `PGVECTOR_DB_URL`，否则 PGVector 也使用该 URL。 |
| `REDIS_URL` | Redis 连接 URL，包含已配置的身份验证和 TLS 信息。除非设置 `WEBSOCKET_REDIS_URL`，否则 WebSocket 也使用该 URL。 |
| `OPENAI_API_KEY` | 聊天服务提供方的 API 密钥。 |
| `RAG_OPENAI_API_KEY` | 嵌入服务提供方的 API 密钥。未设置时默认为 `OPENAI_API_KEY`。 |
| `WEBUI_ADMIN_EMAIL` 和 `WEBUI_ADMIN_PASSWORD` | 空数据库的初始管理员凭据。将密码保存在密钥存储中。 |
| `LICENSE_KEY` | 可选的已签发 Enterprise 许可证密钥。 |

如果使用账户密钥，还要将 `AZURE_STORAGE_KEY` 存储为密钥。如果保持未设置，Open WebUI 会使用 `DefaultAzureCredential` 对 Blob Storage 进行身份验证，因此当 Container App 的托管标识在存储账户上拥有 Blob 数据角色时，便可使用该标识；仅有 Key Vault 的托管标识访问权限并不会授予此角色。

在应用程序配置中将每个密钥映射到其环境变量。替换以下非机密值：

```ini
WEBUI_URL=https://ai.example.com
UVICORN_WORKERS=1
ENABLE_DB_MIGRATIONS=false
ENABLE_OLLAMA_API=false
WEBSOCKET_MANAGER=redis
VECTOR_DB=pgvector
PGVECTOR_CREATE_EXTENSION=false
OPENAI_API_BASE_URL=https://models.example.com/v1
RAG_EMBEDDING_ENGINE=openai
RAG_EMBEDDING_MODEL=REPLACE_WITH_EMBEDDING_MODEL_ID
RAG_OPENAI_API_BASE_URL=https://embeddings.example.com/v1
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://REPLACE_WITH_PRIVATE_TIKA_ENDPOINT:9998
STORAGE_PROVIDER=azure
AZURE_STORAGE_ENDPOINT=https://REPLACE_ACCOUNT.blob.core.windows.net
AZURE_STORAGE_CONTAINER_NAME=openwebui
```

**预期结果：**环境包含所有端点设置和密钥引用，所有副本共享一个稳定的签名密钥。镜像或部署配置中不出现真实密码或密钥。

## 3. 运行手动迁移作业 {#3-run-a-manual-migration-job}

创建服务应用程序之前，在同一环境中创建一个 **Container Apps Job**。为其授予访问相同镜像、网络、标识和数据库密钥的权限。

| 作业设置 | 值 |
| :--- | :--- |
| 触发器类型 | 手动 |
| 并行度 | `1` |
| 副本完成计数 | `1` |
| 副本重试限制 | `0` |
| 副本超时 | 先设置为 1800 秒；运行前评估耗时更长的迁移。 |
| CPU / 内存 | 先使用 1 vCPU / 2 GiB。 |

使用与服务相同的固定应用程序镜像。设置 `ENABLE_DB_MIGRATIONS=true`，并按如下方式覆盖容器命令：

| 字段 | 值 |
| :--- | :--- |
| 可执行文件 / 入口点 | `python` |
| 参数（两个独立值） | `-c` 和 `import open_webui.config` |

当该标志为 true 时，导入此模块会运行架构迁移，并在迁移失败时以错误状态退出。它是内部入口点，不是稳定的迁移 CLI，因此更改版本时应对照[迁移代码](https://github.com/open-webui/open-webui/blob/v0.13.0/backend/open_webui/config.py)重新检查。它会初始化架构；随后正常的应用程序启动会初始化运行时设置和管理员账户。

迁移容器需要相同的数据库连接、签名密钥、网络访问和镜像拉取权限。使用此数据库的所有应用程序实例均已停止时，一次只运行一个执行实例，并禁用自动重试。仅在执行成功完成且日志中没有迁移错误时才继续。

启动一个执行实例并等待其状态变为 **Succeeded**，同时检查执行日志。不要为此作业配置 HTTP 健康探测。请参阅 [Azure Container Apps 作业](https://learn.microsoft.com/en-us/azure/container-apps/jobs)。

## 4. 创建服务容器应用 {#4-create-the-serving-container-app}

在同一环境中创建 `openwebui`，使用固定镜像以及步骤 2 中的环境变量/密钥映射。保留镜像的正常命令；服务应用使用 `ENABLE_DB_MIGRATIONS=false`。

| 应用设置 | 初始值 |
| :--- | :--- |
| CPU / 内存 | 1 vCPU / 2 GiB，根据实际工作负载调整。 |
| 修订模式 | 单修订版。 |
| 规模 | 验证通过前，最小 `1`，最大 `1`。 |
| 入口 | HTTP，目标端口 `8080`，传输协议 `auto`，仅 HTTPS。选择与环境访问策略一致的公开方式。 |
| 启动探测 | `8080` 端口上的 HTTP `/health`；为测得的启动时间留出余量。 |
| 就绪探测 | `8080` 端口上的 HTTP `/ready`。启动完成且数据库和 Redis 均有响应后，该端点会作出应答。 |
| 存活探测 | `8080` 端口上的 HTTP `/health`。 |

显式配置探测，不要依赖通用默认值。启动探测的初始预算可设为 60 次失败、每次间隔 10 秒；探测超时使用 5 秒。测量启动时间和外部服务延迟后再进行调整。

Container Apps 入口支持 WebSocket，而普通 HTTP 请求的超时时间为 240 秒。通过实际入口测试长数据流和文档处理。请参阅[入口行为](https://learn.microsoft.com/en-us/azure/container-apps/ingress-overview)。仅在关闭 WebSocket（`ENABLE_WEBSOCKET_SUPPORT=false`）时才需要粘性会话；请参阅[会话亲和性要求](https://learn.microsoft.com/en-us/azure/container-apps/sticky-sessions)。

使用以下命令验证应用程序并跟踪日志：

```bash
az containerapp show --name openwebui --resource-group RESOURCE_GROUP \
  --query '{state:properties.provisioningState,fqdn:properties.configuration.ingress.fqdn}'
az containerapp logs show --name openwebui --resource-group RESOURCE_GROUP --follow
```

打开已批准的 HTTPS 主机名，使用初始管理员凭据登录。验证后，增加最大副本计数。此基线至少保留一个副本，并按最大副本数规划数据库连接数。最小副本数可提高可用性，但不能保证后台工作在重启后仍能持久保留。

## 添加用户前验证 {#verify-before-adding-users}

- 使用初始管理员账户登录，并验证开放注册已禁用（通过 `WEBUI_ADMIN_EMAIL` 和 `WEBUI_ADMIN_PASSWORD` 创建管理员会将其关闭）。在开放更广泛的访问前，配置你的[身份提供方](/features/authentication-access/auth/sso)。
- 选择一个模型并流式生成响应。重新打开已保存的会话。
- 上传一个包含独特事实的小文档。确认索引完成，并且有关该事实的问题能检索到来源。
- 替换一个应用程序实例，确认同一账户、会话和上传的文件仍可使用。
- 使用多个实例时，通过实际入口测试重复请求和 WebSocket 重新连接，检查是否出现登录循环和状态不一致。

初始管理员环境变量仅在数据库没有用户时创建账户；之后更改这些变量不会重置其密码。完成设置后，在应用程序中轮换初始密码。许多应用程序设置会在首次启动后持久保存；在预期环境变量更改会替换已保存的设置之前，请查看[配置持久性](/reference/env-configuration#important-note-on-configvar-environment-variables)。

对于企业部署，请独立于服务健康状态验证许可证状态。有关应用程序设置和许可证网络要求，请参阅[许可与品牌](./kubernetes#enterprise-licensing-and-branding)；通过此平台的密钥机制注入密钥，而不是使用 Kubernetes Secrets。

## 更新与恢复 {#updates-and-recovery}

单修订版模式不是数据库迁移锁：Azure 通常会让旧修订版继续提供服务，直到替代版本准备就绪。请参阅[修订版行为](https://learn.microsoft.com/en-us/azure/container-apps/revisions)。不要在普通应用程序修订版更新中启用启动迁移。

1. 保存应用程序配置和活动修订版列表。阻止新流量并暂停发布自动化。使用[修订版管理](https://learn.microsoft.com/en-us/azure/container-apps/revisions-manage)停用**所有**应用程序修订版，包括可通过标签访问的修订版，并验证其副本已终止。如有必要，切换到多修订版模式以显式管理停用；启动新版本后再使用单修订版模式。
2. 对 PostgreSQL 和 Blob Storage 进行协调一致的备份，并保留签名密钥。
3. 将迁移作业更新到新镜像，并运行一次手动执行。要求状态为 **Succeeded**，且迁移日志无错误。
4. 使用同一镜像部署禁用迁移的新服务修订版。恢复流量和正常扩缩容之前，验证现有数据、流式响应和上传。

架构迁移后，不要重新激活不兼容的旧修订版。镜像回滚不会逆转数据库更改；必要时恢复兼容的数据库和存储状态。请参阅[备份与恢复](/getting-started/updating#backup--restore)。

## 故障排除与移除 {#troubleshooting-and-removal}

| 症状 | 检查项 |
| :--- | :--- |
| 无法加载镜像或密钥 | 镜像仓库拉取权限、托管标识、Key Vault 权限，以及私有 DNS/出口。 |
| 修订版未通过就绪检查 | 端口 `8080`、应用程序日志、PostgreSQL TLS/登录、向量扩展和探测预算。 |
| Redis 连接失败 | TLS、身份验证、网络可达性，以及独立模式与集群模式。 |
| 上传失败 | Blob 端点/容器、存储密钥或托管标识的 Blob 数据角色、账户网络规则，以及 Tika/嵌入端点。 |
| 流式连接或请求超时 | 入口请求限制、亲和性设置和客户端重新连接行为。 |

删除应用程序或迁移作业不会删除单独预置的 PostgreSQL、Blob Storage 或 Key Vault 资源。请保留备份和凭据，直到保留策略允许将其移除。
