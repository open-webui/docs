---
sidebar_position: 8
title: "OpenShift"
---

# OpenShift

Terminals can run on OpenShift as a restricted per-user terminal sandbox.

OpenShift restricted SCC does not support the full rootful agent devbox model. Use prebuilt terminal images and let OpenShift provide the isolation boundary through one pod per user.

## Supported Model

- One Open Terminal pod per user and policy.
- Persistent user files through PVCs.
- Policy-selected images, env vars, CPU, memory, storage, and idle timeout.
- Refresh and scheduled reset of persisted terminal files.
- File browser, command execution, notebooks, and tools already installed in the image.

## Restricted SCC Limits

These features are not available in the restricted OpenShift path:

- Runtime OS package installs with `OPEN_TERMINAL_PACKAGES`.
- Runtime global installs with `OPEN_TERMINAL_PIP_PACKAGES` or `OPEN_TERMINAL_NPM_PACKAGES`.
- `sudo`, dynamic Linux user creation, or `OPEN_TERMINAL_MULTI_USER=true`.
- Docker socket access or Docker-in-Docker workflows.
- The iptables/dnsmasq egress firewall from `OPEN_TERMINAL_ALLOWED_DOMAINS`.

Build custom Open Terminal images when users need additional tools.

## Database

PostgreSQL is not required. Terminals uses SQLite by default and stores it under the Terminals data directory.

Mount persistent storage at `/app/data` for the Terminals service if you use the default SQLite database. Use `TERMINALS_DATABASE_URL` only when you want an external database.

## Deployment

Install the CRD and operator:

```bash
oc apply -f manifests/terminal-crd.yaml
oc apply -f manifests/operator-deployment.yaml
```

Run the Terminals service with the operator backend and restricted mode:

```yaml
env:
  - name: TERMINALS_BACKEND
    value: kubernetes-operator
  - name: TERMINALS_KUBERNETES_NAMESPACE
    value: terminals
  - name: TERMINALS_KUBERNETES_RESTRICTED
    value: "true"
```

Use the OpenShift-compatible Open Terminal image in policy config:

```json
{
  "image": "ghcr.io/open-webui/open-terminal:openshift",
  "restricted": true,
  "storage": "5Gi",
  "storage_mode": "per-user",
  "cpu_limit": "1",
  "memory_limit": "1Gi",
  "env": {
    "OPEN_TERMINAL_FILE_BROWSER_ROOT": "home"
  }
}
```

Restricted mode applies Kubernetes security-context defaults suitable for restricted OpenShift deployments. You can override them with `pod_security_context` and `container_security_context` in a policy when your cluster requires different values.

Use cluster network policy for egress control on OpenShift.
