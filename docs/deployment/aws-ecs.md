---
sidebar_position: 2
title: "AWS ECS / Fargate"
description: "Deploy Open WebUI on AWS ECS with Fargate, shared data services, Secrets Manager, and an Application Load Balancer."
---

# Open WebUI on AWS ECS / Fargate

Run Open WebUI as an ECS service on Fargate. This guide assumes you already manage an AWS account and VPC; it walks through the application settings and deployment sequence using the ECS console, with CLI commands for verification.

For an overview of the architecture, see the existing [Container Service guide](/enterprise/deployment/container-service). For EKS or another Kubernetes cluster, use [Kubernetes Deployment](./kubernetes).

## 1. Prepare the AWS Services

| Component | Prepare before creating the service |
| :--- | :--- |
| Container image | Mirror `ghcr.io/open-webui/open-webui:v0.11.3` into ECR and use its immutable digest. Match the image architecture to the Fargate task. |
| ECS and networking | An ECS cluster, private subnets, and security groups. Allow image pulls, secret retrieval, log delivery, model APIs, and the backing-service connections. Use NAT or appropriate VPC endpoints for these paths. |
| Database | RDS PostgreSQL or Aurora PostgreSQL, an application database and role, and the `vector` extension enabled by a database administrator. |
| Redis | An ElastiCache Redis-compatible endpoint or another Redis service. Match Open WebUI's Redis mode and TLS settings to the actual service. |
| Files | An S3 bucket for application uploads. |
| Models and extraction | Reachable chat and embedding APIs plus a private Tika service. Model inference is separate from the ECS application task. |
| HTTPS | An Application Load Balancer, HTTPS listener and certificate, DNS hostname, and an **IP-type** target group forwarding to port `8080`. |

Use task security groups to allow inbound `8080` only from the load balancer. Choose internal or internet-facing load balancing according to your organization's access requirements. Fargate's `awsvpc` networking requires IP targets; see [ECS with an Application Load Balancer](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/alb.html).

Create separate IAM roles for the task's application access and ECS execution. The **execution role** needs image-pull, CloudWatch Logs, and secret-retrieval permissions, including KMS decryption where required. The **task role** needs the required S3 bucket/object permissions. Use task-role credentials for S3 instead of embedding AWS access keys in the task definition. See the [ECS task execution role](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html) for execution-side permissions.

## 2. Create the Application Task Definition

In the ECS console, create a Linux Fargate task definition named `openwebui`:

| Setting | Starting value |
| :--- | :--- |
| Network mode | `awsvpc` |
| Task resources | 1 vCPU and 4 GiB memory; tune after measuring workload. |
| Container name | `openwebui` |
| Image | Your pinned ECR image digest. |
| Container port | `8080/TCP` |
| Persistent filesystem | None; use the external database and S3. |
| Logs | `awslogs`, with an existing CloudWatch log group and stream prefix. |
| Application command | Keep the image's normal entry point and command. |

Set these non-secret environment values, replacing the example endpoints and bucket:

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
STORAGE_PROVIDER=s3
S3_BUCKET_NAME=REPLACE_WITH_BUCKET
S3_REGION_NAME=REPLACE_WITH_AWS_REGION
```

Create the credentials in Secrets Manager and map them into the container's **Secrets** settings:

| Environment variable | Secret value |
| :--- | :--- |
| `WEBUI_SECRET_KEY` | A stable random signing key, identical on every instance. Generate once with `openssl rand -hex 32`. |
| `DATABASE_URL` and `PGVECTOR_DB_URL` | The same PostgreSQL connection URL for this reference deployment, with your provider's required TLS parameters. |
| `REDIS_URL` and `WEBSOCKET_REDIS_URL` | The same Redis connection URL, including authentication and TLS where configured. |
| `OPENAI_API_KEY` | Chat provider API key. |
| `RAG_OPENAI_API_KEY` | Embedding provider API key. |
| `WEBUI_ADMIN_EMAIL` and `WEBUI_ADMIN_PASSWORD` | Initial administrator credentials for an empty database. Keep the password in the secret store. |
| `LICENSE_KEY` | Optional issued Enterprise license key. |

The environment variable name and secret ARN are separate fields. For example, this is a fragment of a task definition's container configuration:

```json
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT_ID:secret:openwebui-database-SUFFIX"
    }
  ]
}
```

Repeat for every secret variable; two variables may reference the same secret. Environment-injected secrets are read when the task starts, so rotation requires replacement tasks. See [ECS secret injection](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/specifying-sensitive-data-tutorial.html).

Do not store SQLite or local vector data on the task's ephemeral disk. Switching a populated installation to PostgreSQL or S3 does not migrate its existing data.

## 3. Initialize the Database with One Standalone Task

Create a second task-definition family, `openwebui-migrate`, copied from the application definition. Remove its HTTP health check, if configured, because this task exits instead of serving HTTP.

Use the same pinned application image as the service. Set `ENABLE_DB_MIGRATIONS=true` and override the container command as follows:

| Field | Value |
| :--- | :--- |
| Executable / entry point | `python` |
| Arguments, as two separate values | `-c` and `import open_webui.config` |

For **v0.11.3**, importing this module runs schema migrations when that flag is true and raises an error if they fail. This is a version-specific command based on the [application's migration implementation](https://github.com/open-webui/open-webui/blob/v0.11.3/backend/open_webui/config.py), not a stable public migration CLI. Recheck it when changing versions. It initializes the schema; normal application startup subsequently initializes runtime settings and the administrator account.

The migration container needs the same database connection, signing key, network access, and image-pull permissions. Run exactly one execution at a time, with automatic retries disabled, while all application instances using that database are stopped. Continue only when it exits successfully and the logs show no migration error.

Use **Run new task**, select Fargate, set task count to `1`, and use the application subnets and security groups without a load balancer. A standalone task is not maintained by an ECS service; see [standalone tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/standalone-tasks.html).

**Expected result:** the task reaches `STOPPED`, the `openwebui` container exit code is `0`, and its logs show successful migrations. `STOPPED` alone is not a success signal.

## 4. Create the ECS Service

Create an ECS service using the **application** task definition, with `ENABLE_DB_MIGRATIONS=false` and its normal command. Start with desired task count `1` and connect the ALB target group to container `openwebui`, port `8080`.

Set the target group's health-check path to `/health/db`. Start with a service health-check grace period of 300 seconds and adjust based on measured startup time. `/health` can be used for a separate process-liveness check. Neither endpoint verifies model APIs or S3 permissions.

Set ALB idle timeouts for your streaming workload and enable target-group stickiness if your Socket.IO transport needs affinity. Verify WebSockets and streamed responses through the ALB rather than relying on direct-container checks.

Use the AWS CLI to wait and inspect service events, replacing the identifiers:

```bash
aws ecs wait services-stable --cluster CLUSTER --services openwebui
aws ecs describe-services --cluster CLUSTER --services openwebui \
  --query 'services[0].{running:runningCount,desired:desiredCount,events:events[0:5]}'
```

Open the HTTPS hostname configured in `WEBUI_URL`. The initial administrator credentials create the first account during startup. Once verification passes, increase the desired count and optionally configure Service Auto Scaling. Budget PostgreSQL and Redis connections for the maximum task count.

## Verify Before Adding Users

- Sign in with the initial administrator account and verify that open sign-up is disabled. Configure your [identity provider](/features/authentication-access/auth/sso) before enabling wider access.
- Select a model and stream a response. Reopen the saved conversation.
- Upload a small document containing a distinctive fact. Confirm indexing completes and a question about that fact retrieves the source.
- Replace an application instance and confirm the same account, conversation, and uploaded file remain available.
- With multiple instances, test repeated requests and WebSocket reconnection through the real ingress, checking for login loops and inconsistent state.

The initial administrator environment variables only create an account when the database has no users; changing them later does not reset its password. Rotate the initial password in the application after setup. Many application settings persist after first launch; review [configuration persistence](/reference/env-configuration#important-note-on-configvar-environment-variables) before expecting an environment change to replace a saved setting.

For enterprise deployments, verify license status separately from service health. See [licensing and branding](./kubernetes#enterprise-licensing-and-branding) for the application settings and license network requirements; inject the key through this platform's secret mechanism rather than Kubernetes Secrets.

## Updates and Recovery

Use a maintenance window for schema-changing updates:

1. Save the deployed task definition and service configuration. Block new traffic, suspend service autoscaling and deployment automation, set desired count to zero, and verify all old application tasks are stopped. Stop any standalone tasks sharing the database as well.
2. Take coordinated database and S3 backups and retain the signing key.
3. Register a new migration-task revision using the new image. Run one standalone migration task and require exit code `0` before continuing.
4. Register the application-task revision with that same image and migrations disabled. Update the service while its desired count remains zero, then restore the desired count and verify the service before resuming traffic and autoscaling.

An ECS rollback changes the image, not the database schema. Do not enable automatic rollback to an incompatible old application across a schema change; restore a compatible database/storage backup when required. See [backup and restore](/getting-started/updating#backup--restore).

## Troubleshooting and Removal

| Symptom | Check |
| :--- | :--- |
| Task cannot start or pull image | Execution role, ECR permissions, subnet egress/VPC endpoints, architecture, and Secrets Manager access. |
| ALB reports unhealthy targets | IP target type, container port, task security group, `/health/db`, startup logs, and database connectivity. |
| Chats work but uploads fail | Task-role S3 permissions, bucket name/region, and extraction/embedding endpoints. |
| Login loops across tasks | Shared signing key, common database, and both Redis URLs. |
| Streams disconnect | ALB idle timeout, client reconnection, Redis mode, and target-group affinity. |

Deleting the ECS service does not delete RDS, S3, or Secrets Manager resources provisioned separately. Remove resources deliberately according to your retention policy; keep restoreable backups before removing persistent services.
