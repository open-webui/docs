---
sidebar_position: 1
title: "Policies"
---

# Policies

A policy describes what a user's Open Terminal workspace should look like. It controls the image, tools, resources, storage, environment variables, security context, and idle timeout.

Think of policies as agent workspace profiles. A data team might get Python, notebooks, and larger storage. A training lab might get a locked-down image and scheduled resets. A software team might get Git, build tools, language runtimes, and persistent files.

In Open WebUI, go to **Settings** -> **Admin** -> **Tools** -> **Integrations** -> Open Terminal**, add an orchestrator connection, verify it, then edit the policy fields.

## Policy Fields

| Policy field | Example | What it controls |
| :--- | :--- | :--- |
| `image` | `ghcr.io/acme/open-terminal:python` | Open Terminal image used for new workspaces |
| `cpu_limit` | `2` or `500m` | CPU limit passed to Docker/Kubernetes |
| `memory_limit` | `4Gi` | Memory limit passed to Docker/Kubernetes |
| `storage` | `10Gi` | Persistent file storage on Kubernetes; Docker stores files under the orchestrator data dir. On Docker the cap is best-effort: it limits only the writable layer via `StorageOpt` and needs a quota-capable driver (overlay2 on XFS with `pquota`), and `/home/user` is bind-mounted and not quota-limited. Use a Kubernetes backend for hard storage caps |
| `storage_mode` | `per-user` | Kubernetes storage mode: `per-user`, `shared`, or `shared-rwo` |
| `env` | `OPENAI_API_KEY=sk-...` | Raw environment variables injected into the user workspace |
| `idle_timeout_minutes` | `30` | Idle time before the workspace is stopped and removed |
| `restricted` | `true` | Run under a restricted security context (Kubernetes/OpenShift backends) |
| `pod_security_context` | `{"fsGroup": 1000}` | Kubernetes pod `securityContext` overrides (Kubernetes/OpenShift backends) |
| `container_security_context` | `{"runAsNonRoot": true}` | Kubernetes container `securityContext` overrides (Kubernetes/OpenShift backends) |

All fields are optional. If a field is omitted, the orchestrator uses its global default, such as `TERMINALS_IMAGE` or `TERMINALS_KUBERNETES_STORAGE_MODE`.

Policy changes apply when a workspace is newly provisioned. Existing running workspaces keep their current image and environment until they are stopped, refreshed, or cleaned up by idle timeout. Open WebUI is an admin client for this policy state; Terminals remains the source of truth for both policy and lifecycle configuration.

Scheduled resets are configured through policy lifecycle, not policy fields. This keeps provisioning settings separate from ongoing maintenance.
