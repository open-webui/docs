---
slug: /deployment/azure-container-apps
sidebar_position: 3
title: "Azure Container Apps"
description: "Deploy Open WebUI on Azure Container Apps with PostgreSQL, Redis, Blob Storage, and managed secrets."
---

# Open WebUI on Azure Container Apps

Azure Container Apps runs the application without requiring you to operate Kubernetes. This guide uses the Azure portal to configure an app and a separate manual migration job. For AKS, use [Kubernetes Deployment](./kubernetes).

See the existing [Container Service guide](/enterprise/deployment/container-service) for the shared architecture. The application settings below target **Open WebUI v0.11.3**.

## 1. Prepare the Azure Services

| Component | Prepare before creating the app |
| :--- | :--- |
| Image | Mirror the versioned image into Azure Container Registry and retain an immutable digest. |
| Container Apps environment | An environment with the VNet connectivity, DNS, egress, and private endpoint access your backing services require. |
| Database | Azure Database for PostgreSQL Flexible Server, an application database/role, and the `vector` extension enabled by an administrator. |
| Redis | A compatible Redis endpoint, such as [Azure Managed Redis](https://learn.microsoft.com/en-us/azure/redis/overview). Verify its clustering mode, authentication, and TLS settings. |
| Files | A Blob Storage account and a private container for application uploads. |
| Secrets | Key Vault and an identity allowed to read the application secrets. |
| Models and extraction | Reachable chat/embedding APIs and a private Tika service. |
| Browser access | An approved HTTPS hostname and access path to the app. |

If the chosen endpoint uses Redis Cluster, set both `REDIS_CLUSTER=true` and `WEBSOCKET_REDIS_CLUSTER=true`; a standalone endpoint does not need these flags. Follow [Redis configuration](/reference/env-configuration#redis_url) for your chosen endpoint. Container Apps' local filesystem is temporary; do not use it for SQLite or durable file storage.

## 2. Configure Credentials and Environment Values

In Key Vault, store the credentials below. Use Container Apps secret references backed by a managed identity with permission to retrieve them. The identity also needs the appropriate registry-pull permissions. See [Container Apps secrets and Key Vault references](https://learn.microsoft.com/en-us/azure/container-apps/manage-secrets).

| Environment variable | Secret value |
| :--- | :--- |
| `WEBUI_SECRET_KEY` | A stable random signing key, identical on every instance. Generate once with `openssl rand -hex 32`. |
| `DATABASE_URL` and `PGVECTOR_DB_URL` | The same PostgreSQL connection URL for this reference deployment, with your provider's required TLS parameters. |
| `REDIS_URL` and `WEBSOCKET_REDIS_URL` | The same Redis connection URL, including authentication and TLS where configured. |
| `OPENAI_API_KEY` | Chat provider API key. |
| `RAG_OPENAI_API_KEY` | Embedding provider API key. |
| `WEBUI_ADMIN_EMAIL` and `WEBUI_ADMIN_PASSWORD` | Initial administrator credentials for an empty database. Keep the password in the secret store. |
| `LICENSE_KEY` | Optional issued Enterprise license key. |

Also store `AZURE_STORAGE_KEY` as a secret. This example uses an account key for Blob Storage; managed identity access to Key Vault does not automatically authenticate Open WebUI to the blob account.

Map each secret to its environment variable in the app configuration. Replace the non-secret values below:

```ini
HOST=0.0.0.0
PORT=8080
WEBUI_URL=https://ai.example.com
UVICORN_WORKERS=1
ENABLE_DB_MIGRATIONS=false
ENABLE_OLLAMA_API=false
ENABLE_WEBSOCKET_SUPPORT=true
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

**Expected result:** the environment has all endpoint settings and secret references, with one stable signing key shared across replicas. No real passwords or keys appear in the image or deployment configuration.

## 3. Run a Manual Migration Job

Create a **Container Apps Job** in the same environment before creating the serving application. Give it access to the same image, network, identity, and database secrets.

| Job setting | Value |
| :--- | :--- |
| Trigger type | Manual |
| Parallelism | `1` |
| Replica completion count | `1` |
| Replica retry limit | `0` |
| Replica timeout | Start with 1800 seconds; assess longer migrations before running. |
| CPU / memory | Start with 1 vCPU / 2 GiB. |

Use the same pinned application image as the service. Set `ENABLE_DB_MIGRATIONS=true` and override the container command as follows:

| Field | Value |
| :--- | :--- |
| Executable / entry point | `python` |
| Arguments, as two separate values | `-c` and `import open_webui.config` |

For **v0.11.3**, importing this module runs schema migrations when that flag is true and raises an error if they fail. This is a version-specific command based on the [application's migration implementation](https://github.com/open-webui/open-webui/blob/v0.11.3/backend/open_webui/config.py), not a stable public migration CLI. Recheck it when changing versions. It initializes the schema; normal application startup subsequently initializes runtime settings and the administrator account.

The migration container needs the same database connection, signing key, network access, and image-pull permissions. Run exactly one execution at a time, with automatic retries disabled, while all application instances using that database are stopped. Continue only when it exits successfully and the logs show no migration error.

Start one execution and wait for its status to become **Succeeded**, checking the execution logs. Do not configure an HTTP health probe on this job. See [Azure Container Apps jobs](https://learn.microsoft.com/en-us/azure/container-apps/jobs).

## 4. Create the Serving Container App

Create `openwebui` in the same environment, using the pinned image and the environment/secret mappings from step 2. Keep the image's normal command; the serving app uses `ENABLE_DB_MIGRATIONS=false`.

| App setting | Starting value |
| :--- | :--- |
| CPU / memory | 1 vCPU / 2 GiB, adjusted from actual workload. |
| Revision mode | Single revision. |
| Scale | Minimum `1`, maximum `1` until verification passes. |
| Ingress | HTTP, target port `8080`, transport `auto`, HTTPS only. Choose exposure consistent with the environment's access policy. |
| Startup probe | HTTP `/health` on `8080`; allow for measured startup time. |
| Readiness probe | HTTP `/health/db` on `8080`. |
| Liveness probe | HTTP `/health` on `8080`. |

Configure probes explicitly rather than relying on generic defaults. A starting startup-probe budget is 60 failures at 10-second intervals; use a 5-second probe timeout. Tune it after measuring startup and external-service latency.

Container Apps ingress supports WebSockets, while ordinary HTTP requests have a 240-second timeout. Test long streams and document processing through the actual ingress. See [ingress behavior](https://learn.microsoft.com/en-us/azure/container-apps/ingress-overview). For HTTP affinity, enable sticky sessions in single-revision mode; see [session affinity requirements](https://learn.microsoft.com/en-us/azure/container-apps/sticky-sessions).

Verify the app and follow logs with:

```bash
az containerapp show --name openwebui --resource-group RESOURCE_GROUP \
  --query '{state:properties.provisioningState,fqdn:properties.configuration.ingress.fqdn}'
az containerapp logs show --name openwebui --resource-group RESOURCE_GROUP --follow
```

Open your approved HTTPS hostname and sign in with the initial administrator credentials. After verification, increase the maximum replica count. Keep a minimum of one for this baseline and budget database connections for the maximum. Minimum replicas improve availability but do not make background work durable through restarts.

## Verify Before Adding Users

- Sign in with the initial administrator account and verify that open sign-up is disabled. Configure your [identity provider](/features/authentication-access/auth/sso) before enabling wider access.
- Select a model and stream a response. Reopen the saved conversation.
- Upload a small document containing a distinctive fact. Confirm indexing completes and a question about that fact retrieves the source.
- Replace an application instance and confirm the same account, conversation, and uploaded file remain available.
- With multiple instances, test repeated requests and WebSocket reconnection through the real ingress, checking for login loops and inconsistent state.

The initial administrator environment variables only create an account when the database has no users; changing them later does not reset its password. Rotate the initial password in the application after setup. Many application settings persist after first launch; review [configuration persistence](/reference/env-configuration#important-note-on-configvar-environment-variables) before expecting an environment change to replace a saved setting.

For enterprise deployments, verify license status separately from service health. See [licensing and branding](./kubernetes#enterprise-licensing-and-branding) for the application settings and license network requirements; inject the key through this platform's secret mechanism rather than Kubernetes Secrets.

## Updates and Recovery

Single-revision mode is not a database migration lock: Azure normally keeps the old revision serving until the replacement is ready. See [revision behavior](https://learn.microsoft.com/en-us/azure/container-apps/revisions). Do not enable startup migrations in an ordinary application revision update.

1. Save the app configuration and active revision list. Block new traffic and pause release automation. Use [revision management](https://learn.microsoft.com/en-us/azure/container-apps/revisions-manage) to deactivate **all** application revisions, including revisions reachable by labels, and verify their replicas have terminated. If necessary, switch to multiple-revision mode to manage deactivation explicitly; use single-revision mode again after bringing up the new version.
2. Take coordinated PostgreSQL and Blob Storage backups and retain the signing key.
3. Update the migration job to the new image and run one manual execution. Require **Succeeded** and clean migration logs.
4. Deploy a new serving revision using the same image with migrations disabled. Verify existing data, streaming, and uploads before restoring traffic and normal scaling.

Do not reactivate an incompatible old revision after schema migration. Image rollback does not reverse database changes; restore compatible database and storage state when necessary. See [backup and restore](/getting-started/updating#backup--restore).

## Troubleshooting and Removal

| Symptom | Check |
| :--- | :--- |
| Image or secret cannot be loaded | Registry pull permissions, managed identity, Key Vault permissions, and private DNS/egress. |
| Revision fails readiness | Port `8080`, application logs, PostgreSQL TLS/login, vector extension, and probe budget. |
| Redis connections fail | TLS, authentication, network reachability, and standalone versus cluster mode. |
| Uploads fail | Blob endpoint/container, storage key, account network rules, and Tika/embedding endpoints. |
| Streams or requests time out | Ingress request limits, affinity settings, and client reconnection behavior. |

Deleting the app or migration job does not delete separately provisioned PostgreSQL, Blob Storage, or Key Vault resources. Keep backups and credentials until your retention policy allows removal.
