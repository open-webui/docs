---
sidebar_position: 4
title: "Deployment Options"
---

# Enterprise Deployment Options

Open WebUI's **stateless, container-first architecture** means the same application runs identically whether you deploy it as a Python process on a VM, a container in a managed service, or a pod in a Kubernetes cluster. The difference between deployment patterns is how you **orchestrate, scale, and operate** the application — not how the application itself behaves.

This guide covers three production deployment patterns for enterprise environments. Each section includes an architecture overview, scaling strategy, and key considerations to help both technical decision-makers evaluating options and platform engineers planning implementation.

:::tip Model Inference Is Independent
How you serve LLM models is separate from how you deploy Open WebUI. You can use **managed APIs** (OpenAI, Anthropic, Azure OpenAI, Google Gemini) or **self-hosted inference** (Ollama, vLLM) with any deployment pattern. See [Integration](/enterprise/integration) for details on connecting models.
:::

---

## Shared Infrastructure Requirements

Regardless of which deployment pattern you choose, every scaled Open WebUI deployment requires the same set of backing services. Configure these **before** scaling beyond a single instance.

| Component | Why It's Required | Options |
| :--- | :--- | :--- |
| **PostgreSQL** | Multi-instance deployments require a real database. SQLite does not support concurrent writes from multiple processes. | Self-managed, Amazon RDS, Azure Database for PostgreSQL, Google Cloud SQL |
| **Redis** | Session management, WebSocket coordination, and configuration sync across instances. | Self-managed, Amazon ElastiCache, Azure Cache for Redis, Google Memorystore |
| **Vector Database** | The default ChromaDB uses a local SQLite backend that is not safe for multi-process access. | PGVector (shares PostgreSQL), Milvus, Qdrant, or ChromaDB in HTTP server mode |
| **Shared Storage** | Uploaded files must be accessible from every instance. | Shared filesystem (NFS, EFS, CephFS) or object storage (`S3`, `GCS`, `Azure Blob`) |
| **Content Extraction** | The default `pypdf` extractor leaks memory under sustained load. | Apache Tika or Docling as a sidecar service |
| **Embedding Engine** | The default SentenceTransformers model loads ~500 MB into RAM per worker process. | OpenAI Embeddings API, or Ollama running an embedding model |

### Critical Configuration

These environment variables **must** be set consistently across every instance:

```bash
# Shared secret — MUST be identical on all instances
WEBUI_SECRET_KEY=your-secret-key-here

# Database
DATABASE_URL=postgresql://user:password@db-host:5432/openwebui

# Vector Database
VECTOR_DB=pgvector
PGVECTOR_DB_URL=postgresql://user:password@db-host:5432/openwebui

# Redis
REDIS_URL=redis://redis-host:6379/0
WEBSOCKET_MANAGER=redis
ENABLE_WEBSOCKET_SUPPORT=true

# Content Extraction
CONTENT_EXTRACTION_ENGINE=tika
TIKA_SERVER_URL=http://tika:9998

# Embeddings
RAG_EMBEDDING_ENGINE=openai

# Storage — choose ONE:
# Option A: shared filesystem (mount the same volume to all instances, no env var needed)
# Option B: object storage (see https://docs.openwebui.com/reference/env-configuration#cloud-storage for all required vars)
# STORAGE_PROVIDER=s3

# Workers — let the orchestrator handle scaling
UVICORN_WORKERS=1

# Migrations — only ONE instance should run migrations
ENABLE_DB_MIGRATIONS=false
```

:::warning Database Migrations
Set `ENABLE_DB_MIGRATIONS=false` on **all instances except one**. During updates, scale down to a single instance, allow migrations to complete, then scale back up. Concurrent migrations can corrupt your database.
:::

For the complete step-by-step scaling walkthrough, see [Scaling Open WebUI](/getting-started/advanced-topics/scaling). For the full environment variable reference, see [Environment Variable Configuration](/reference/env-configuration).

---

## Option 1: Python / Pip on Auto-Scaling VMs

Deploy `open-webui serve` as a systemd-managed process on virtual machines in a cloud auto-scaling group (AWS ASG, Azure VMSS, GCP MIG).

### When to Choose This Pattern

- Your organization has established VM-based infrastructure and operational practices
- Regulatory or compliance requirements mandate direct OS-level control
- Your team has limited container expertise but strong Linux administration skills
- You want a straightforward deployment without container orchestration overhead

### Architecture

```mermaid
flowchart TB
    LB["Load Balancer"]

    subgraph ASG["Auto-Scaling Group"]
        VM1["VM 1"]
        VM2["VM 2"]
        VM3["VM N"]
    end

    subgraph Backend["Backing Services"]
        PG["PostgreSQL + PGVector"]
        Redis["Redis"]
        S3["Object Storage"]
        Tika["Tika"]
    end

    LB --> ASG
    ASG --> Backend
```

### Installation

Install on each VM using pip with the `[all]` extra (includes PostgreSQL drivers):

```bash
pip install open-webui[all]
```

Create a systemd unit to manage the process:

```ini
[Unit]
Description=Open WebUI
After=network.target

[Service]
Type=simple
User=openwebui
EnvironmentFile=/etc/open-webui/env
ExecStart=/usr/local/bin/open-webui serve
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Place your environment variables in `/etc/open-webui/env` (see [Critical Configuration](#critical-configuration) above).

### Scaling Strategy

- **Horizontal scaling**: Configure your auto-scaling group to add or remove VMs based on CPU utilization or request count.
- **Health checks**: Point your load balancer health check at the `/health` endpoint (HTTP 200 when healthy).
- **One process per VM**: Keep `UVICORN_WORKERS=1` and let the auto-scaler manage capacity. This simplifies memory accounting and avoids fork-safety issues with the default vector database.
- **Sticky sessions**: Configure your load balancer for cookie-based session affinity to ensure WebSocket connections remain routed to the same instance.

### Key Considerations

| Consideration | Detail |
| :--- | :--- |
| **OS patching** | You are responsible for OS updates, security patches, and Python runtime management. |
| **Python environment** | Pin your Python version (3.11 recommended) and use a virtual environment or system-level install. |
| **Storage** | Use object storage (such as S3) or a shared filesystem (such as NFS) since VMs in an auto-scaling group do not share a local filesystem. |
| **Tika sidecar** | Run a Tika server on each VM or as a shared service. A shared instance simplifies management. |
| **Updates** | Scale the group to 1 instance, update the package (`pip install --upgrade open-webui`), wait for database migrations to complete, then scale back up. |

For pip installation basics, see the [Python Quick Start](/getting-started/quick-start#python).

---

## Option 2: Container Service

Run the official `ghcr.io/open-webui/open-webui` image on a managed container platform such as AWS ECS/Fargate, Azure Container Apps, or Google Cloud Run.

### When to Choose This Pattern

- You want container benefits (immutable images, versioned deployments, no OS management) without Kubernetes complexity
- Your organization already uses a managed container platform
- You need fast scaling with minimal operational overhead
- You prefer managed infrastructure with platform-native auto-scaling

### Architecture

```mermaid
flowchart TB
    LB["Load Balancer"]

    subgraph CS["Container Service"]
        T1["Container Task 1"]
        T2["Container Task 2"]
        T3["Container Task N"]
    end

    subgraph Backend["Managed Backing Services"]
        PG["PostgreSQL + PGVector"]
        Redis["Redis"]
        S3["Object Storage"]
        Tika["Tika"]
    end

    LB --> CS
    CS --> Backend
```

### Image Selection

Use **versioned tags** for production stability:

```
ghcr.io/open-webui/open-webui:v0.x.x
```

Avoid the `:main` tag in production — it tracks the latest development build and can introduce breaking changes without warning. Check the [Open WebUI releases](https://github.com/open-webui/open-webui/releases) for the latest stable version.

### Scaling Strategy

- **Platform-native auto-scaling**: Configure your container service to scale on CPU utilization, memory, or request count.
- **Health checks**: Use the `/health` endpoint for both liveness and readiness probes.
- **Task-level env vars**: Pass all shared infrastructure configuration as environment variables or secrets in your task definition.
- **Session affinity**: Enable sticky sessions on your load balancer for WebSocket stability. While Redis handles cross-instance coordination, session affinity reduces unnecessary session handoffs.

### Key Considerations

| Consideration | Detail |
| :--- | :--- |
| **Storage** | Use object storage (S3, GCS, Azure Blob) or a shared filesystem (such as EFS). Container-local storage is ephemeral and not shared across tasks. |
| **Tika sidecar** | Run Tika as a sidecar container in the same task definition, or as a separate service. Sidecar pattern keeps extraction traffic local. |
| **Secrets management** | Use your platform's secrets manager (AWS Secrets Manager, Azure Key Vault, GCP Secret Manager) for `DATABASE_URL`, `REDIS_URL`, and `WEBUI_SECRET_KEY`. |
| **Updates** | Perform a rolling deployment with a single task first — this task runs migrations (`ENABLE_DB_MIGRATIONS=true`). Once healthy, scale the remaining tasks with `ENABLE_DB_MIGRATIONS=false`. |

### Anti-Patterns to Avoid

| Anti-Pattern | Impact | Fix |
| :--- | :--- | :--- |
| Using local SQLite | Data loss on task restart, database locks with multiple tasks | Set `DATABASE_URL` to PostgreSQL |
| Default ChromaDB | SQLite-backed vector DB crashes under multi-process access | Set `VECTOR_DB=pgvector` (or Milvus/Qdrant) |
| Inconsistent `WEBUI_SECRET_KEY` | Login loops, 401 errors, sessions that don't persist across tasks | Set the same key on every task via secrets manager |
| No Redis | WebSocket failures, config not syncing, "Model Not Found" errors | Set `REDIS_URL` and `WEBSOCKET_MANAGER=redis` |

For container basics, see the [Docker Quick Start](/getting-started/quick-start#docker). For a Docker Swarm example with external ChromaDB, see the [Docker Swarm guide](/getting-started/quick-start#docker-swarm).

---

## Option 3: Kubernetes with Helm

Deploy using the official Open WebUI Helm chart on any Kubernetes distribution (EKS, AKS, GKE, OpenShift, Rancher, self-managed).

### When to Choose This Pattern

- Your organization runs Kubernetes and has platform engineering expertise
- You need declarative infrastructure-as-code with GitOps workflows
- You require advanced scaling (HPA), rolling updates, and pod disruption budgets
- You are deploying for hundreds to thousands of users in a mission-critical environment

### Architecture

```mermaid
flowchart LR
    subgraph K8s["Kubernetes Cluster"]

        subgraph mgmt["Cluster Management"]
            Ingress["Ingress Controller"]
            HPA["HPA"]
        end

        subgraph genai["GenAI Namespace"]
            subgraph Deploy["Open WebUI Deployment"]
                P1["Pod 1"]
                P2["Pod 2"]
                P3["Pod N"]
            end
        end

        subgraph data["Data Namespace"]
            PG["PostgreSQL + PGVector"]
            Redis["Redis"]
            Storage["Shared Storage"]
            Tika["Tika"]
        end

    end

    Ingress --> Deploy
    HPA -.- Deploy
    Deploy --> data
```

### Helm Chart Setup

```bash
# Add the repository
helm repo add open-webui https://open-webui.github.io/helm-charts
helm repo update

# Install with custom values
helm install openwebui open-webui/open-webui -f values.yaml
```

Your `values.yaml` should override the defaults to point at your shared infrastructure. The chart has dedicated values for many common settings — use these instead of raw environment variables where available:

```yaml
# Example values.yaml overrides (refer to chart documentation for full schema)
replicaCount: 3

# -- Database: use an external PostgreSQL instance
databaseUrl: "postgresql://user:password@db-host:5432/openwebui"

# -- WebSocket & Redis: the chart can auto-deploy Redis in-cluster,
#    or you can point to an external Redis instance via websocket.url
websocket:
  enabled: true
  manager: redis
  # url: "redis://my-external-redis:6379/0"  # uncomment to use external Redis
  redis:
    enabled: true  # set to false if using external Redis

# -- Tika: the chart can auto-deploy Tika in-cluster
tika:
  enabled: true

# -- Ollama: disable if using external model APIs or a separate Ollama deployment
ollama:
  enabled: false

# -- Storage: use object storage instead of local PVC for multi-replica
persistence:
  provider: s3  # or "gcs" / "azure"
  s3:
    bucket: "my-openwebui-bucket"
    region: "us-east-1"
    accessKeyExistingSecret: "openwebui-s3-creds"
    accessKeyExistingAccessKey: "access-key"
    secretKeyExistingSecret: "openwebui-s3-creds"
    secretKeyExistingSecretKey: "secret-key"
  # -- Alternatively, use a shared filesystem (RWX PVC) instead of object storage:
  # provider: local
  # accessModes:
  #   - ReadWriteMany
  # storageClass: "efs-sc"

# -- Ingress: configure if exposing via an ingress controller
ingress:
  enabled: true
  class: "nginx"
  host: "ai.example.com"
  tls: true
  existingSecret: "openwebui-tls"
  annotations:
    nginx.ingress.kubernetes.io/affinity: "cookie"
    nginx.ingress.kubernetes.io/session-cookie-name: "open-webui-session"
    nginx.ingress.kubernetes.io/session-cookie-expires: "172800"
    nginx.ingress.kubernetes.io/session-cookie-max-age: "172800"

# -- Remaining settings that don't have dedicated chart values
extraEnvVars:
  - name: WEBUI_SECRET_KEY
    valueFrom:
      secretKeyRef:
        name: openwebui-secrets
        key: secret-key
  - name: VECTOR_DB
    value: "pgvector"
  - name: PGVECTOR_DB_URL
    valueFrom:
      secretKeyRef:
        name: openwebui-secrets
        key: database-url
  - name: UVICORN_WORKERS
    value: "1"
  - name: ENABLE_DB_MIGRATIONS
    value: "false"
  - name: RAG_EMBEDDING_ENGINE
    value: "openai"
```

### Scaling Strategy

- **Horizontal Pod Autoscaler (HPA)**: Scale on CPU or memory utilization. Keep `UVICORN_WORKERS=1` per pod and let Kubernetes manage the replica count.
- **Resource requests and limits**: Set appropriate CPU and memory requests to ensure the scheduler places pods correctly and the HPA has accurate metrics.
- **Pod disruption budgets**: Configure a PDB to ensure a minimum number of pods remain available during voluntary disruptions (node drains, cluster upgrades).

### Update Procedure

:::danger Critical Update Process
When running multiple replicas, you **must** follow this process for every update:

1. Scale the deployment to **1 replica**
2. Apply the new image version (with `ENABLE_DB_MIGRATIONS=true` on the single replica)
3. Wait for the pod to become **fully ready** (database migrations complete)
4. Scale back to your desired replica count (with `ENABLE_DB_MIGRATIONS=false`)

Skipping this process risks database corruption from concurrent migrations.
:::

### Key Considerations

| Consideration | Detail |
| :--- | :--- |
| **Storage** | Use a **ReadWriteMany (RWX)** shared filesystem (EFS, CephFS, NFS) or object storage (S3, GCS, Azure Blob) for uploaded files. ReadWriteOnce volumes will not work with multiple pods. |
| **Secrets** | Store credentials in Kubernetes Secrets and reference via `secretKeyRef`. Integrate with external secrets operators (External Secrets, Sealed Secrets) for GitOps workflows. |
| **Database** | Use a managed PostgreSQL service (RDS, Cloud SQL, Azure DB) for production. In-cluster PostgreSQL operators (CloudNativePG, Zalando) are viable but add operational burden. |
| **Redis** | A single Redis instance with `timeout 1800` and `maxclients 10000` is sufficient for most deployments. Redis Sentinel or Cluster is only needed if Redis itself must be highly available. |
| **Networking** | Keep all services in the same availability zone. Target < 2 ms database latency. Audit network policies to ensure pods can reach PostgreSQL, Redis, and storage backends. |

For the complete Helm setup guide, see [Kubernetes Quick Start](/getting-started/quick-start#kubernetes--helm). For troubleshooting multi-replica issues, see [Multi-Replica Troubleshooting](/troubleshooting/multi-replica).

---

## Deployment Comparison

| | **Python / Pip (VMs)** | **Container Service** | **Kubernetes (Helm)** |
| :--- | :--- | :--- | :--- |
| **Operational complexity** | Moderate — OS patching, Python management | Low — platform-managed containers | Higher — requires K8s expertise |
| **Auto-scaling** | Cloud ASG/VMSS with health checks | Platform-native, minimal configuration | HPA with fine-grained control |
| **Container isolation** | None — process runs directly on OS | Full container isolation | Full container + namespace isolation |
| **Rolling updates** | Manual (scale down, update, scale up) | Platform-managed rolling deployments | Declarative rolling updates with rollback |
| **Infrastructure-as-code** | Terraform/Pulumi for VMs + config mgmt | Task/service definitions (CloudFormation, Bicep, Terraform) | Helm charts + GitOps (Argo CD, Flux) |
| **Best suited for** | Teams with VM-centric operations, regulatory constraints | Teams wanting container benefits without K8s complexity | Large-scale, mission-critical deployments |
| **Minimum team expertise** | Linux administration, Python | Container fundamentals, cloud platform | Kubernetes, Helm, cloud-native patterns |

---

## Observability

Production deployments should include monitoring and observability regardless of deployment pattern.

### Health Checks

- **`/health`** — Basic liveness check. Returns HTTP 200 when the application is running. Use this for load balancer and auto-scaler health checks.
- **`/api/models`** — Verifies the application can connect to configured model backends. Requires an API key.

### OpenTelemetry

Open WebUI supports **OpenTelemetry** for distributed tracing and HTTP metrics. Enable it with:

```bash
ENABLE_OTEL=true
OTEL_EXPORTER_OTLP_ENDPOINT=http://your-collector:4318
OTEL_SERVICE_NAME=open-webui
```

This auto-instruments FastAPI, SQLAlchemy, Redis, and HTTP clients — giving visibility into request latency, database query performance, and cross-service traces.

### Structured Logging

Enable JSON-formatted logs for integration with log aggregation platforms (Datadog, Loki, CloudWatch, Splunk):

```bash
LOG_FORMAT=json
GLOBAL_LOG_LEVEL=INFO
```

For full monitoring setup details, see [Monitoring](/reference/monitoring) and [OpenTelemetry](/reference/monitoring/otel).

---

## Next Steps

- **[Architecture & High Availability](/enterprise/architecture)** — Deeper dive into Open WebUI's stateless design and HA capabilities.
- **[Security](/enterprise/security)** — Compliance frameworks, SSO/LDAP integration, RBAC, and audit logging.
- **[Integration](/enterprise/integration)** — Connecting AI models, pipelines, and extending functionality.
- **[Scaling Open WebUI](/getting-started/advanced-topics/scaling)** — The complete step-by-step technical scaling guide.
- **[Multi-Replica Troubleshooting](/troubleshooting/multi-replica)** — Solutions for common issues in scaled deployments.

---

**Need help planning your enterprise deployment?** Our team works with organizations worldwide to design and implement production Open WebUI environments.

[**Contact Enterprise Sales → sales@openwebui.com**](mailto:sales@openwebui.com)
