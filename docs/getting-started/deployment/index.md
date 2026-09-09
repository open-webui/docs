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
| Kubernetes | Your team operates a cluster and wants to deploy with Helm. | [Kubernetes Deployment](./kubernetes) · [Helm quick start](/deployment/kubernetes-helm) |
| AWS ECS / Fargate | You want AWS-managed container tasks with an Application Load Balancer. | [AWS ECS / Fargate](./aws-ecs) |
| Azure Container Apps | You want managed containers integrated with Azure networking and services. | [Azure Container Apps](./azure-container-apps) |
| Google Cloud Run | You want managed Google Cloud containers and can accommodate request-duration and instance-lifecycle limits. | [Google Cloud Run](./google-cloud-run) |
| Managed container service | Your organization runs applications on a managed container platform. | [Container Service](/enterprise/deployment/container-service) |
| Python on virtual machines | You manage application processes and scaling on VMs. | [Python / Pip on VMs](/enterprise/deployment/python-pip) |

### Other ways to run it

| Guide | What it covers |
| :--- | :--- |
| [Docker images and tags](./docker-images) | Every image and tag, the GPU and bundled-Ollama variants, slim, pinned versions, updating and uninstalling |
| [Podman](./podman) · [Quadlets](./podman-quadlets) · [Kube Play](./podman-kube-play) | Rootless containers, systemd-managed units, and Podman's Kubernetes-style manifests |
| [Kubernetes (Helm)](./kubernetes-helm) | The community Helm chart, as an alternative to the manifests in the Kubernetes guide |
| [Docker Swarm](./docker-swarm) | A Swarm stack, with GPU and without |
| [Docker on Windows with WSL](./windows-wsl) | Running the container on Windows through WSL 2 |
| [Docker Desktop Extension and Pinokio](./docker-desktop-extension) | One-click installs for a desktop machine |
| [Python environments](./python-environments) | uv, Conda and venv, for running the package without a container |

The Kubernetes guide includes both a persistent single-replica installation and a production configuration using shared PostgreSQL, Redis, and object storage.

The AWS, Azure, and Google Cloud guides cover each platform's networking, secrets, database initialization, and update procedure. They use external databases and object storage so application replacement does not discard persistent data.

## Plan for Production

Before opening a deployment to users, configure authentication, persistence, backups, and monitoring. Use the [hardening guide](/getting-started/advanced-topics/hardening), [scaling guide](/getting-started/advanced-topics/scaling), and [monitoring reference](/reference/monitoring) for the relevant configuration.

Model inference is configured separately from the Open WebUI application. Connect an existing model server or hosted API using [Connect a provider](/getting-started/quick-start/connect-a-provider).
