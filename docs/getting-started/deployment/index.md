---
slug: /deployment/
sidebar_position: 0
title: "Deploying Open WebUI"
---

# Deploying Open WebUI

Choose how to run Open WebUI in your environment. Start with a single instance or use shared infrastructure when you need multiple application replicas.

## Choose a Deployment

| Deployment | When to use it | Guide |
| :--- | :--- | :--- |
| Docker or Python | You want to get an instance running on a machine you manage. | [Quick Start](/getting-started/quick-start) |
| Kubernetes | Your team operates a cluster and wants to deploy with Helm. | [Kubernetes Deployment](./kubernetes) |
| AWS ECS / Fargate | You want AWS-managed container tasks with an Application Load Balancer. | [AWS ECS / Fargate](./aws-ecs) |
| Azure Container Apps | You want managed containers integrated with Azure networking and services. | [Azure Container Apps](./azure-container-apps) |
| Google Cloud Run | You want managed Google Cloud containers and can accommodate request-duration and instance-lifecycle limits. | [Google Cloud Run](./google-cloud-run) |
| Managed container service | Your organization runs applications on a managed container platform. | [Container Service](/enterprise/deployment/container-service) |
| Python on virtual machines | You manage application processes and scaling on VMs. | [Python / Pip on VMs](/enterprise/deployment/python-pip) |

### Docker Swarm

| Guide | What it covers |
| :--- | :--- |
| [Docker Swarm](./docker-swarm) | A Swarm stack across nodes, with GPU and without |

Running **one instance** on a machine you manage, on Podman, WSL, the Docker Desktop extension or a plain Python environment, is covered in the [Quick Start tabs](/getting-started/quick-start). The tag reference, including the GPU, Ollama and slim variants, is [Docker images and tags](/getting-started/quick-start).

The Kubernetes guide includes both a persistent single-replica installation and a production configuration using shared PostgreSQL, Redis, and object storage.

The AWS, Azure, and Google Cloud guides cover each platform's networking, secrets, database initialization, and update procedure. They use external databases and object storage so application replacement does not discard persistent data.

## Plan for Production

Before opening a deployment to users, configure authentication, persistence, backups, and monitoring. Use the [hardening guide](/getting-started/advanced-topics/hardening), [scaling guide](/getting-started/advanced-topics/scaling), and [monitoring reference](/reference/monitoring) for the relevant configuration.

Model inference is configured separately from the Open WebUI application. Connect an existing model server or hosted API using [Connect a provider](/getting-started/quick-start/connect-a-provider).
