---
sidebar_position: 1
title: "Policies"
---

# Policies

A policy describes what a user's Open Terminal container should look like. It controls the image, resources, storage, environment variables, and idle timeout.

In Open WebUI, go to **Admin Panel -> Settings -> Integrations -> Open Terminal**, add an orchestrator connection, verify it, then edit the policy fields.

## Policy Fields

| Policy field | Example | What it controls |
| :--- | :--- | :--- |
| `image` | `ghcr.io/acme/open-terminal:python` | Open Terminal image used for new containers |
| `cpu_limit` | `2` or `500m` | CPU limit passed to Docker/Kubernetes |
| `memory_limit` | `4Gi` | Memory limit passed to Docker/Kubernetes |
| `storage` | `10Gi` | Persistent file storage on Kubernetes; Docker stores files under the orchestrator data dir |
| `storage_mode` | `per-user` | Kubernetes storage mode: `per-user`, `shared`, or `shared-rwo` |
| `env` | `OPENAI_API_KEY=sk-...` | Raw environment variables injected into the user container |
| `idle_timeout_minutes` | `30` | Idle time before the terminal is stopped and removed |

All fields are optional. If a field is omitted, the orchestrator uses its global default, such as `TERMINALS_IMAGE` or `TERMINALS_KUBERNETES_STORAGE_MODE`.

Policy changes apply when a terminal is newly provisioned. Existing running terminals keep their current image and environment until they are stopped, refreshed, or cleaned up by idle timeout.

Scheduled resets are configured through policy lifecycle, not policy fields. This keeps provisioning settings separate from ongoing maintenance.
