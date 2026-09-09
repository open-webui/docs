---
slug: /deployment/google-cloud-run
sidebar_position: 4
title: "Google Cloud Run"
description: "Deploy Open WebUI on Google Cloud Run with Cloud SQL, Redis, Cloud Storage, and a separate migration job."
---

# Open WebUI on Google Cloud Run

Cloud Run is the Google Cloud managed-container option for this guide. Use shared external state and a separate migration job. For GKE, use [Kubernetes Deployment](./kubernetes); for the general architecture, see the existing [Container Service guide](/enterprise/deployment/container-service).

:::info Check the workload fit
Cloud Run supports WebSockets, but connections remain subject to its request timeout, up to 60 minutes. Clients must reconnect, and session affinity is best effort. Redis remains necessary across instances. Test long conversations and background work before adopting this platform. See [Cloud Run WebSockets](https://docs.cloud.google.com/run/docs/triggering/websockets).
:::

## 1. Prepare the Google Cloud Services

| Component | Prepare before creating the service |
| :--- | :--- |
| Image | Mirror `ghcr.io/open-webui/open-webui:v0.11.3` into Artifact Registry and retain its immutable digest. |
| Database | Cloud SQL for PostgreSQL, an application database/role, and the `vector` extension enabled by an administrator. This guide uses a private-IP database connection. |
| Redis | A compatible Memorystore or other Redis endpoint. Match authentication, TLS, and cluster settings to the chosen service. |
| Files | A private Cloud Storage bucket. |
| Identity and secrets | A dedicated service account and Secret Manager secrets for application credentials. |
| VPC access | Direct VPC egress or a Serverless VPC Access connector providing access to the private database, Redis, and extraction service. |
| Models and extraction | Reachable chat/embedding APIs and a Tika endpoint the app can call. |
| Browser access | An approved HTTPS hostname and browser authentication/access route. |

Configure firewall rules, private DNS, and egress for all backing services. If all traffic is routed through the VPC, provide the appropriate NAT or private access for model APIs and other external endpoints. Apply the same networking to the migration job. See [Direct VPC egress](https://docs.cloud.google.com/run/docs/configuring/vpc-direct-vpc).

## 2. Configure the Service Identity and Environment

Grant the service account access to the specific Secret Manager secrets and the required object read/write/list/delete permissions on the bucket. Use the attached service identity for Cloud Storage through Application Default Credentials; do not embed a downloaded service-account key in the image.

Create and map these secret environment variables. Pin secret versions so a deployment uses a known credential set; grant the runtime identity access to each referenced secret. See [Cloud Run secret configuration](https://docs.cloud.google.com/run/docs/configuring/services/secrets).

| Environment variable | Secret value |
| :--- | :--- |
| `WEBUI_SECRET_KEY` | A stable random signing key, identical on every instance. Generate once with `openssl rand -hex 32`. |
| `DATABASE_URL` and `PGVECTOR_DB_URL` | The same PostgreSQL connection URL for this reference deployment, with your provider's required TLS parameters. |
| `REDIS_URL` and `WEBSOCKET_REDIS_URL` | The same Redis connection URL, including authentication and TLS where configured. |
| `OPENAI_API_KEY` | Chat provider API key. |
| `RAG_OPENAI_API_KEY` | Embedding provider API key. |
| `WEBUI_ADMIN_EMAIL` and `WEBUI_ADMIN_PASSWORD` | Initial administrator credentials for an empty database. Keep the password in the secret store. |
| `LICENSE_KEY` | Optional issued Enterprise license key. |

Configure these non-secret values, replacing the example endpoints and bucket:

```ini
HOST=0.0.0.0
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
STORAGE_PROVIDER=gcs
GCS_BUCKET_NAME=REPLACE_WITH_BUCKET
```

Cloud Run sets `PORT`; configure the container port as `8080`. Open WebUI's normal container entry point listens on that port and on `0.0.0.0`.

Container-local files are temporary and can consume instance memory. Do not use SQLite, local ChromaDB, or a Cloud Storage FUSE mount as a substitute for the shared database/vector backends. Use the application's Cloud Storage provider for uploads.

## 3. Initialize the Database with a Cloud Run Job

Create a job named `openwebui-migrate`, using the pinned image, service account, secret references, and VPC configuration. Set task count `1`, parallelism `1`, retries `0`, and a task timeout appropriate to the expected migration; 1800 seconds is a starting point.

Use the same pinned application image as the service. Set `ENABLE_DB_MIGRATIONS=true` and override the container command as follows:

| Field | Value |
| :--- | :--- |
| Executable / entry point | `python` |
| Arguments, as two separate values | `-c` and `import open_webui.config` |

For **v0.11.3**, importing this module runs schema migrations when that flag is true and raises an error if they fail. This is a version-specific command based on the [application's migration implementation](https://github.com/open-webui/open-webui/blob/v0.11.3/backend/open_webui/config.py), not a stable public migration CLI. Recheck it when changing versions. It initializes the schema; normal application startup subsequently initializes runtime settings and the administrator account.

The migration container needs the same database connection, signing key, network access, and image-pull permissions. Run exactly one execution at a time, with automatic retries disabled, while all application instances using that database are stopped. Continue only when it exits successfully and the logs show no migration error.

Run one job execution and wait for success. A job must exit; do not leave it running the image's normal web-server command. See [creating Cloud Run jobs](https://docs.cloud.google.com/run/docs/create-jobs).

```bash
gcloud run jobs execute openwebui-migrate --region REGION --wait
```

**Expected result:** one completed task with a successful execution and migration logs. A service maximum of one instance is not a replacement for this job: [Cloud Run instance limits can be exceeded temporarily](https://docs.cloud.google.com/run/docs/configuring/max-instances).

## 4. Create the Cloud Run Service

In the Cloud Run console, deploy `openwebui` with the same image, identity, VPC access, and settings. Keep the image's normal entry point and `ENABLE_DB_MIGRATIONS=false`.

| Service setting | Starting value |
| :--- | :--- |
| Container port | `8080` |
| CPU / memory | 1 vCPU / 4 GiB; measure and tune. |
| Billing / CPU | Instance-based billing, with CPU available outside requests. |
| Instances | Minimum `1`, maximum `1` until verification passes. |
| Concurrency | Start at `20` and tune with realistic chat/ingestion traffic. |
| Request timeout | `3600` seconds; clients still need to reconnect. |
| Session affinity | Enabled. |
| Startup probe | HTTP `/health/db`, port `8080`, 10-second period, 5-second timeout, failure threshold `24`. |
| Liveness probe | HTTP `/health`, port `8080`, with a suitable interval and failure threshold. |

Keep startup within Cloud Run's [supported probe budget](https://docs.cloud.google.com/run/docs/configuring/healthchecks). Offloaded embeddings and a separate migration job reduce startup work. A successful probe does not validate the model provider or bucket permissions.

Instance-based billing and a minimum instance support work outside active requests, but instances can still be terminated. They do not make in-process background tasks durable. See [Cloud Run billing settings](https://docs.cloud.google.com/run/docs/configuring/billing-settings).

Choose browser access explicitly. Cloud Run IAM authentication requires Google identity tokens; an Open WebUI login does not satisfy that outer layer. Use your organization's browser-facing identity gateway, or deliberately configure public invocation only when the application authentication and network exposure meet your policy. Never disable Open WebUI authentication merely to bypass a Cloud Run access error.

Inspect the service and logs:

```bash
gcloud run services describe openwebui --region REGION \
  --format='value(status.url,status.latestReadyRevisionName)'
gcloud run services logs read openwebui --region REGION --limit=50
```

Open the approved HTTPS hostname and sign in with the initial administrator credentials. After verification, raise the instance maximum while budgeting shared database connections and testing WebSocket reconnection across instances.

## Verify Before Adding Users

- Sign in with the initial administrator account and verify that open sign-up is disabled. Configure your [identity provider](/features/authentication-access/auth/sso) before enabling wider access.
- Select a model and stream a response. Reopen the saved conversation.
- Upload a small document containing a distinctive fact. Confirm indexing completes and a question about that fact retrieves the source.
- Replace an application instance and confirm the same account, conversation, and uploaded file remain available.
- With multiple instances, test repeated requests and WebSocket reconnection through the real ingress, checking for login loops and inconsistent state.

The initial administrator environment variables only create an account when the database has no users; changing them later does not reset its password. Rotate the initial password in the application after setup. Many application settings persist after first launch; review [configuration persistence](/reference/env-configuration#important-note-on-configvar-environment-variables) before expecting an environment change to replace a saved setting.

For enterprise deployments, verify license status separately from service health. See [licensing and branding](./kubernetes#enterprise-licensing-and-branding) for the application settings and license network requirements; inject the key through this platform's secret mechanism rather than Kubernetes Secrets.

## Updates and Recovery

Traffic splitting is not safe across incompatible schema versions. Sending zero traffic to a revision or setting minimum instances to zero does not prove old containers have stopped.

For a schema-changing release, use a maintenance window and the following conservative procedure:

1. Export the service configuration and IAM policy, record your domain/access configuration, and pause deployment automation. Block new requests and drain active connections.
2. Delete the **Cloud Run application service** so old revisions cannot be invoked, and verify old application database connections have drained before migrating. Keep the database, bucket, secrets, and migration job. Preserve a stable custom hostname for the recreated service.
3. Take coordinated database/storage backups and retain the signing key.
4. Update the migration job to the new image and run one execution to successful completion.
5. Recreate the service using the new image, migrations disabled, and the saved networking, secrets, scaling, IAM, and ingress settings. Restore domain routing only after verifying the service.

For example, export the service and IAM configuration **before** deleting it:

```bash
gcloud run services describe openwebui --region REGION \
  --format=export > openwebui-service.yaml
gcloud run services get-iam-policy openwebui --region REGION \
  --format=yaml > openwebui-iam.yaml
```

The export does not replace a database backup, and IAM/domain settings must be restored separately. This procedure incurs downtime and service recreation; if that operating model is unsuitable, consider GKE or a VM/container platform with explicit control over stopping application processes.

Do not route to an incompatible old image after migration. Restore compatible database/storage state when required; see [backup and restore](/getting-started/updating#backup--restore).

## Troubleshooting and Removal

| Symptom | Check |
| :--- | :--- |
| Service returns 403 before the login page | Cloud Run IAM/ingress policy and the browser's access route. |
| Startup fails | Port, startup budget, database private-IP routing/TLS, secret permissions, and logs. |
| Redis cannot connect | VPC egress, firewall/DNS, authentication/TLS, and Redis cluster mode. |
| Files disappear or uploads fail | `STORAGE_PROVIDER=gcs`, bucket name, service-account permissions, and external vector storage. |
| WebSocket disconnects after a long session | Request timeout and client reconnection; affinity is best effort. |
| Background work pauses or disappears | CPU allocation, minimum instances, and process termination; use durable job infrastructure for work that must survive an instance. |

Deleting the Cloud Run service or job does not delete separately provisioned Cloud SQL, Redis, Cloud Storage, or Secret Manager resources. Remove those only according to your backup and retention policy.
