---
slug: /deployment/kubernetes
sidebar_position: 1
title: "Kubernetes Deployment"
description: "Deploy Open WebUI on Kubernetes with Helm, from one persistent instance to a production deployment with shared services."
---

# Kubernetes Deployment

Use the official Open WebUI Helm chart to deploy on your Kubernetes cluster. This guide covers setup, installation, verification, and updates in one place.

For the existing Helm documentation, see the [Helm quick start](/getting-started/quick-start/install-methods/kubernetes-helm) and [enterprise Helm deployment guide](/enterprise/deployment/kubernetes-helm).

Open WebUI connects to an existing model server or API. The examples do not install Ollama, Pipelines, or Terminals, and do not require GPUs for the Open WebUI pods.

## Choose Your Deployment

| Path | What you get | Use it when |
| :--- | :--- | :--- |
| [Single replica](#single-replica) | One application pod with a persistent volume for its database and files. | You want a simple installation on storage suitable for SQLite. |
| [Production](#production) | One or more application pods using shared PostgreSQL, Redis, and object storage. | You need shared services, multiple replicas, or storage that is unsuitable for SQLite. |

An Enterprise license works with either path. User count alone does not determine the number of replicas; size for concurrent chats, document processing, and model latency.

**Follow steps 1–5 in order.** In step 3, choose one deployment path. Licensing, branding, scaling, and maintenance are covered afterwards.

## 1. Check Your Cluster

You need a running Kubernetes cluster, Helm 3, and `kubectl` configured for that cluster. You also need permission to create a namespace, workloads, Services, and Secrets, plus access to the chart repository, container registry, and your model endpoint.

```bash
kubectl config current-context
kubectl get nodes
kubectl create namespace openwebui
helm repo add open-webui https://open-webui.github.io/helm-charts
helm repo update
```

**Expected result:** your nodes are ready and the `openwebui` namespace exists. If it already exists, reuse it.

This guide pins **chart 16.5.0** and **application v0.11.3**. Chart and application versions are separate. Consult the [published chart](https://github.com/open-webui/helm-charts/tree/open-webui-16.5.0/charts/open-webui) and [image reference](/getting-started/quick-start/install-methods/docker-images) before changing versions.

## 2. Configure the Application

### Store the Signing Key and Model API Key

Generate a signing key once, then keep it in your secret manager for future restarts and restores:

```bash
openssl rand -hex 32
```

Create `secrets.env` in a private directory outside Git. Set its permissions to `600` before entering real credentials. Replace both placeholders; use single-line values without surrounding quotes.

```ini title="secrets.env"
WEBUI_SECRET_KEY=REPLACE_WITH_GENERATED_KEY
OPENAI_API_KEY=REPLACE_WITH_MODEL_API_KEY
```

```bash
kubectl -n openwebui create secret generic openwebui-secrets \
  --from-env-file=secrets.env
```

**Expected result:** Secret `openwebui-secrets` is created. Kubernetes Secrets need appropriate RBAC and encryption at rest. Your secrets operator can create the same named Secret and keys instead.

### Save the Shared Helm Values

Save the following as `values-common.yaml`. Replace `https://models.example.com/v1` with your OpenAI-compatible API base URL. Your pods must be able to reach it, and its model list must include a chat model.

<details>
<summary>Show values-common.yaml</summary>

```yaml title="values-common.yaml"
fullnameOverride: openwebui
workload:
  kind: Deployment
strategy:
  type: Recreate
image:
  repository: ghcr.io/open-webui/open-webui
  tag: v0.11.3
ollama:
  enabled: false
pipelines:
  enabled: false
terminals:
  enabled: false
tika:
  enabled: false
service:
  type: ClusterIP
  port: 80
openaiBaseApiUrl: https://models.example.com/v1
openaiApiKeyExistingSecret: openwebui-secrets
openaiApiKeyExistingSecretKey: OPENAI_API_KEY
resources:
  requests:
    cpu: 500m
    memory: 1Gi
  limits:
    cpu: '2'
    memory: 4Gi
startupProbe:
  httpGet:
    path: /health
    port: http
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 60
readinessProbe:
  httpGet:
    path: /health/db
    port: http
  periodSeconds: 10
  timeoutSeconds: 5
livenessProbe:
  httpGet:
    path: /health
    port: http
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3
extraEnvVars:
  WEBUI_SECRET_KEY:
    valueFrom:
      secretKeyRef:
        name: openwebui-secrets
        key: WEBUI_SECRET_KEY
  UVICORN_WORKERS: '1'
```

</details>

These values give the application predictable resource names, reference its credentials through a Secret, and configure health probes. `Recreate` stops the old application pods before starting replacements during a rollout. Resource requests and limits are starting points; tune them from observed usage.

The chart supports map-style `extraEnvVars`, used here to merge settings across files. Helm 3 may report a coalescing warning because the chart's default is a list; confirm the environment and secret references in the rendered manifest before installing.

## 3. Choose a Storage Configuration

Save **one** of the following profiles alongside `values-common.yaml`.

### Single Replica {#single-replica}

Check your available storage classes:

```bash
kubectl get storageclass
```

Choose storage with reliable file locking and low-latency filesystem access suitable for SQLite, such as local or block-backed storage. Do not place SQLite on NFS, SMB, or another shared network filesystem. If your storage is unsuitable, use the production profile with PostgreSQL. See [database storage guidance](/getting-started/advanced-topics/scaling#step-1-switch-to-postgresql).

Save this as `values-single.yaml`, replacing `your-storage-class`:

```yaml title="values-single.yaml"
replicaCount: 1
websocket:
  enabled: true
  manager: ''
  redis:
    enabled: false
persistence:
  enabled: true
  provider: local
  storageClass: your-storage-class
  accessModes:
  - ReadWriteOnce
  size: 10Gi
  annotations:
    helm.sh/resource-policy: keep
ingress:
  enabled: false
extraEnvVars:
  ENABLE_DB_MIGRATIONS: 'true'
```

The PVC stores SQLite, local vector data, uploads, and model caches at `/app/backend/data`. Keep both the replica count and worker count at one. The keep annotation retains this PVC during Helm uninstall.

Local embedding models may download during the first startup. Allow the necessary model-download access or prepare those assets in advance. Redis is optional for this path; review [token revocation](/getting-started/advanced-topics/hardening#token-revocation) before using it for production.

### Production {#production}

Provision these services before installing. The chart configuration below connects to them; it does not create them.

| Service | What to prepare |
| :--- | :--- |
| PostgreSQL + PGVector | An application database and role with schema migration permissions. Have the database administrator enable the `vector` extension in that database. |
| Redis | A shared endpoint, with authentication and TLS where configured. |
| S3-compatible storage | An existing bucket and credentials for the required read, write, list, and delete operations. |
| Embedding API | An OpenAI-compatible embedding endpoint, its API key, and a supported embedding model ID. |
| Content extraction | A reachable Apache Tika service. |
| HTTPS access | An installed ingress controller, a DNS hostname, and its TLS certificate and key. |

From the application network, verify database login and the vector extension, Redis access, bucket upload/download/delete, a model response, an embedding request, and Tika access. Configure network policies and private CA trust for these services as needed.

:::warning Existing installations
These values target a fresh database and bucket. Setting a PostgreSQL URL does not transfer existing SQLite users, chats, or settings. Plan data migration, file transfer, and vector migration or re-indexing before changing backends on a populated installation.
:::

Create a private `backends.env`, protected like `secrets.env`, and replace the placeholders. URL-encode special characters in database and Redis credentials. Use your database provider's required [TLS parameters](/reference/env-configuration#database_url).

```ini title="backends.env"
DATABASE_URL=postgresql://REPLACE_USER:REPLACE_PASSWORD@postgres.example.com:5432/openwebui
REDIS_URL=rediss://default:REPLACE_PASSWORD@redis.example.com:6379/0
RAG_OPENAI_API_KEY=REPLACE_WITH_EMBEDDING_API_KEY
S3_ACCESS_KEY_ID=REPLACE_WITH_STORAGE_ACCESS_KEY
S3_SECRET_ACCESS_KEY=REPLACE_WITH_STORAGE_SECRET_KEY
```

```bash
kubectl -n openwebui create secret generic openwebui-backends \
  --from-env-file=backends.env
kubectl -n openwebui create secret tls openwebui-tls \
  --cert=/path/to/tls.crt --key=/path/to/tls.key
```

Save the following as `values-production.yaml`. Replace the hostnames, ingress class, bucket, region, and embedding model. Keep `WEBUI_URL` aligned with your ingress hostname; it must be correct during the first startup, even while ingress is disabled.

<details>
<summary>Show values-production.yaml</summary>

```yaml title="values-production.yaml"
replicaCount: 3
websocket:
  enabled: true
  manager: redis
  redis:
    enabled: false
  existingSecret: openwebui-backends
  existingSecretKey: REDIS_URL
databaseUrl: ''
persistence:
  enabled: false
  provider: s3
  s3:
    bucket: openwebui
    region: us-east-1
    endpointUrl: https://s3.example.com
    accessKeyExistingSecret: openwebui-backends
    accessKeyExistingAccessKey: S3_ACCESS_KEY_ID
    secretKeyExistingSecret: openwebui-backends
    secretKeyExistingSecretKey: S3_SECRET_ACCESS_KEY
ingress:
  enabled: true
  class: your-ingress-class
  host: ai.example.com
  tls: true
  existingSecret: openwebui-tls
extraEnvVars:
  WEBUI_URL: https://ai.example.com
  DATABASE_URL:
    valueFrom:
      secretKeyRef:
        name: openwebui-backends
        key: DATABASE_URL
  VECTOR_DB: pgvector
  PGVECTOR_DB_URL:
    valueFrom:
      secretKeyRef:
        name: openwebui-backends
        key: DATABASE_URL
  PGVECTOR_CREATE_EXTENSION: 'false'
  RAG_EMBEDDING_ENGINE: openai
  RAG_EMBEDDING_MODEL: REPLACE_WITH_EMBEDDING_MODEL_ID
  RAG_OPENAI_API_BASE_URL: https://embeddings.example.com/v1
  RAG_OPENAI_API_KEY:
    valueFrom:
      secretKeyRef:
        name: openwebui-backends
        key: RAG_OPENAI_API_KEY
  CONTENT_EXTRACTION_ENGINE: tika
  TIKA_SERVER_URL: http://tika.example.com:9998
  ENABLE_DB_MIGRATIONS: 'false'
```

</details>

The chart sets both application and WebSocket Redis URLs from the same Secret. PostgreSQL holds application records and vectors; the bucket holds uploaded files. `/app/backend/data` is ephemeral with this profile, so local caches and feature-specific files outside those shared backends do not survive pod replacement.

For one production replica, set `replicaCount: 1` in this file. Additional replicas require sufficient database connection capacity and shared services; place them on different nodes when you need resilience to a node failure. See [scaling guidance](/getting-started/advanced-topics/scaling).

## 4. Install with Helm

Choose the profile you saved:

```bash
# Choose ONE:
OPENWEBUI_PROFILE=values-single.yaml
# OPENWEBUI_PROFILE=values-production.yaml
```

Both paths start with exactly **one migration-enabled worker** and ingress disabled. Review the rendered manifest, then install:

```bash
helm template openwebui open-webui/open-webui \
  --version 16.5.0 --namespace openwebui \
  -f values-common.yaml -f "$OPENWEBUI_PROFILE" \
  --set replicaCount=1 --set ingress.enabled=false \
  --set-string extraEnvVars.ENABLE_DB_MIGRATIONS=true > rendered.yaml

helm install openwebui open-webui/open-webui \
  --version 16.5.0 --namespace openwebui \
  -f values-common.yaml -f "$OPENWEBUI_PROFILE" \
  --set replicaCount=1 --set ingress.enabled=false \
  --set-string extraEnvVars.ENABLE_DB_MIGRATIONS=true \
  --wait --timeout 15m

kubectl -n openwebui rollout status deployment/openwebui --timeout=10m
kubectl -n openwebui get pods,pvc,services
```

**Expected result:** one ready application pod. The single-replica path also has a bound `openwebui` PVC. Image pulls and initial model downloads can take several minutes.

If Helm times out, inspect `helm status openwebui -n openwebui`, pod events, and logs. If the release already exists, retry using `helm upgrade` with the same bootstrap flags. Do not add replicas until initialization succeeds.

## 5. Open and Verify Open WebUI

Leave this command running:

```bash
kubectl -n openwebui port-forward service/openwebui 3000:80
```

Open [http://localhost:3000](http://localhost:3000), create the first administrator account, select a model, and send a message. If models are missing, check **Admin Panel → Settings → Connections**.

Before exposing the service, disable open sign-up or configure your [identity provider](/features/authentication-access/auth/sso). Review the [hardening guide](/getting-started/advanced-topics/hardening).

### Finish the Production Installation

For the production path, apply the saved profile after the first replica initializes successfully:

```bash
helm upgrade openwebui open-webui/open-webui \
  --version 16.5.0 --namespace openwebui \
  -f values-common.yaml -f values-production.yaml \
  --wait --timeout 15m
kubectl -n openwebui rollout status deployment/openwebui --timeout=10m
kubectl -n openwebui get pods,ingress
```

This disables migrations on all replicas, applies the desired replica count, and enables ingress. Expect a brief restart. Point DNS at your ingress controller, then open your HTTPS hostname.

Configure your controller for WebSockets, streamed responses without buffering, suitable request/idle timeouts, and your required upload size. Session affinity may be needed for Socket.IO polling. Affinity does not replace Redis; see [connection troubleshooting](/troubleshooting/connection-error).

### Verify the Deployment

- **Chat:** Sign in, stream a model response, and reopen the saved conversation.
- **Persistence:** Run `kubectl -n openwebui rollout restart deployment/openwebui`, wait for rollout completion, restart port-forwarding if needed, and confirm the conversation remains.
- **Production documents:** Upload a small document containing a distinctive fact. Confirm indexing finishes and a question about that fact retrieves the correct source. Check that the uploaded object exists in the bucket.
- **Multiple replicas:** Port-forward two different pods on different local ports, sign in to each, and verify that both can access the same saved conversation and uploaded file. Also test through ingress. A stream on a replaced pod may need to be retried.

A ready pod checks application/database health; it does not prove model APIs, Redis, storage, or licensing work. Many application settings persist after first startup, so later environment changes may not override them. See [configuration persistence](/reference/env-configuration#important-note-on-configvar-environment-variables).

## Enterprise Licensing and Branding

<details>
<summary>Add an enterprise license</summary>

Create a private, permission-restricted `license.env` containing `LICENSE_KEY=YOUR_ISSUED_KEY`, then create its Secret:

```bash
kubectl -n openwebui create secret generic openwebui-license \
  --from-env-file=license.env
```

Add this entry under `extraEnvVars` in `values-common.yaml`, alongside the existing entries:

```yaml
  LICENSE_KEY:
    valueFrom:
      secretKeyRef:
        name: openwebui-license
        key: LICENSE_KEY
```

Create the Secret before installation, or apply the change using the update procedure below. Secret environment changes require pod replacement. Confirm the expected enterprise status and licensed user limit in the application's admin interface; readiness alone does not verify activation.

</details>

<details>
<summary>Use your own branding image or managed branding</summary>

For internally maintained branding, build your licensed fork and push its image to your registry. Change the existing image settings in `values-common.yaml` and add the pull-secret reference:

```yaml
image:
  repository: registry.example.com/platform/openwebui
  tag: v0.11.3-branding.1
imagePullSecrets:
  - name: openwebui-registry
```

Create that Secret in the same namespace through your approved registry credential workflow, for example:

```bash
kubectl -n openwebui create secret generic openwebui-registry \
  --type=kubernetes.io/dockerconfigjson \
  --from-file=.dockerconfigjson=/path/to/private/docker-config.json
```

Use immutable image tags and deploy through the update procedure. Changes made inside a running pod will be lost on replacement.

Managed branding is delivered through license configuration. The [v0.11.3 license implementation](https://github.com/open-webui/open-webui/blob/v0.11.3/backend/open_webui/utils/auth.py) attempts startup retrieval over HTTPS through `api.openwebui.com` and `licenses.api.openwebui.com`. Allow DNS resolution and outbound HTTPS for that workflow. A custom branding image does not itself remove license network requirements. For disconnected deployments, obtain supported offline license provisioning instructions from your enterprise contact; `OFFLINE_MODE` alone does not provision a license.

</details>

## Updates and Recovery {#updates-and-recovery}

Use a maintenance window. `Recreate` prevents an ordinary Deployment rollout from overlapping old and new pods, but does not serialize migrations across several new replicas.

1. Record the deployed image, chart, and values, retain your signing key, and prepare backups. Stop incoming traffic and pause any autoscaler or GitOps reconciliation that could restart application pods.
2. Stop **all** application instances sharing the database and wait for them to terminate:

```bash
kubectl -n openwebui scale deployment/openwebui --replicas=0
kubectl -n openwebui wait --for=delete pod \
  -l app.kubernetes.io/instance=openwebui,app.kubernetes.io/name=open-webui \
  --timeout=10m
```

3. Take the final backup of the PVC for the single-replica path, or PostgreSQL and object storage for production.
4. Update the image tag in `values-common.yaml` and review the target release notes. Set `OPENWEBUI_PROFILE` to your saved profile again if using a new shell. Start one migration-enabled worker, keeping ingress disabled:

```bash
helm upgrade openwebui open-webui/open-webui \
  --version 16.5.0 --namespace openwebui \
  -f values-common.yaml -f "$OPENWEBUI_PROFILE" \
  --set replicaCount=1 --set ingress.enabled=false \
  --set-string extraEnvVars.ENABLE_DB_MIGRATIONS=true \
  --wait --timeout 15m
kubectl -n openwebui logs deployment/openwebui -c open-webui --tail=100
```

5. Verify startup and existing data using port-forwarding. For production, run the **Finish the Production Installation** command to restore normal replicas, ingress, and disabled migrations. The single-replica profile keeps migrations enabled on its only worker. Repeat the verification checks before resuming normal traffic and controllers.

When changing the chart version, also review its release notes and update `--version` in the commands. If initialization fails, keep other replicas stopped and investigate. Helm rollback, including `--atomic`, cannot undo database migrations. Recovery to an incompatible older application requires restoring compatible database and storage state. See [backup and restore](/getting-started/updating#backup--restore).

## Optional Autoscaling

<details>
<summary>Add an HPA and PodDisruptionBudget after the production deployment works</summary>

Chart 16.5.0 does not create these through dedicated values. Save these separate resources as `scaling.yaml`. The HPA requires a working metrics API and CPU requests; first confirm `kubectl top pods -n openwebui` works.

```yaml title="scaling.yaml"
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: openwebui
  namespace: openwebui
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: openwebui
  minReplicas: 2
  maxReplicas: 4
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: openwebui
  namespace: openwebui
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app.kubernetes.io/instance: openwebui
      app.kubernetes.io/name: open-webui
```

Apply with `kubectl -n openwebui apply -f scaling.yaml`. The thresholds are examples, not a user-capacity guarantee. Budget database connections for the maximum replica count and prevent GitOps from fighting HPA changes to `spec.replicas`. Helm upgrades can also reset the replica count.

Before updates, remove this HPA with `kubectl -n openwebui delete hpa openwebui` and pause any controller that would recreate it. Reapply it only after verifying the restored deployment. A PDB limits voluntary evictions such as node drains; it does not prevent Deployment scale-down or the maintenance outage described above.

</details>

## Troubleshooting

```bash
kubectl -n openwebui get pods,pvc,services,ingress
kubectl -n openwebui get events --sort-by=.metadata.creationTimestamp
kubectl -n openwebui describe deployment openwebui
kubectl -n openwebui logs deployment/openwebui -c open-webui --tail=100
```

| Symptom | Check |
| :--- | :--- |
| Pending pod or PVC | Available resources, StorageClass, access mode, and scheduler events. The production S3 profile creates no application PVC. |
| ImagePullBackOff or init-container failure | Image tag, registry access, pull Secret, and logs for `copy-app-data`. |
| Missing Secret or key | Exact Secret and key names in the same namespace. Avoid printing credentials into diagnostics. |
| Database initialization fails | Database login/TLS, schema permissions, vector extension, and exactly one migration-enabled worker. |
| Failed uploads or retrieval | Bucket permissions, Tika access, embedding model/credentials, and vector database connectivity. |
| Login loops or inconsistent settings | Shared signing key, database, Redis, public URL, and persisted configuration. |
| Interrupted streaming | Redis connectivity, ingress buffering, WebSocket handling, and request/idle timeouts. |
| License missing | Issued license, Secret reference, pod replacement, and license endpoint access. |
| OOMKilled or startup timeout | Application logs, memory use, model downloads, and database latency. |

See [multi-replica troubleshooting](/troubleshooting/multi-replica) for more diagnostics.

## Uninstall Without Accidentally Deleting Data

If you installed `scaling.yaml`, delete those optional resources first. Then uninstall the release:

```bash
helm uninstall openwebui --namespace openwebui
```

The single-replica profile's **keep annotation** preserves its PVC. Verify with `kubectl -n openwebui get pvc openwebui`; do not assume all chart configurations retain PVCs. To reuse it, set `persistence.existingClaim: openwebui` and reuse the signing key.

External production databases and object storage are not deleted by the release. Separately created Secrets also remain. Keep backups and credentials according to your recovery policy.

:::danger Intentional data deletion
Deleting the namespace deletes its Secrets and PVCs. Only delete the retained `openwebui` PVC when you no longer need the data and have any required backup; its reclaim policy may also delete the underlying storage.
:::
