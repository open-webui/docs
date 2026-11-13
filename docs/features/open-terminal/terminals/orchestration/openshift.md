---
sidebar_position: 9
title: "OpenShift"
---

# OpenShift

Terminals can run on OpenShift as a restricted per-user terminal sandbox.

The restricted OpenShift setup runs terminals as non-root pods. Use prebuilt terminal images and let OpenShift provide the isolation boundary through one pod per machine.

## Supported Model

- One Open Terminal pod per machine.
- Persistent user files through PVCs.
- Per-terminal images, env vars, CPU, memory, storage and idle timeout.
- File browser, command execution, notebooks, and tools already installed in the image.

## Restricted SCC Limits

The restricted OpenShift path runs without root rights, so these features are unavailable:

- Runtime OS package installs with `OPEN_TERMINAL_PACKAGES`.
- Runtime global installs with `OPEN_TERMINAL_PIP_PACKAGES` or `OPEN_TERMINAL_NPM_PACKAGES`.
- `sudo`, dynamic Linux user creation, or `OPEN_TERMINAL_MULTI_USER=true`.
- Docker socket access or Docker-in-Docker workflows.
- The iptables/dnsmasq egress firewall from `OPEN_TERMINAL_ALLOWED_DOMAINS`.

The orchestrator rejects a terminal in restricted mode when its environment variables include `OPEN_TERMINAL_ALLOWED_DOMAINS`, `OPEN_TERMINAL_PACKAGES`, `OPEN_TERMINAL_PIP_PACKAGES` or `OPEN_TERMINAL_NPM_PACKAGES`. Build custom Open Terminal images with the tools users need.

## Database

Terminals uses SQLite by default and stores it under the Terminals data directory. Mount persistent storage at `/app/data` for the Terminals service to keep it. Set `TERMINALS_DATABASE_URL` to use an external database such as PostgreSQL.

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
  - name: TERMINALS_API_KEY
    valueFrom:
      secretKeyRef:
        name: terminals
        key: api-key
```

Create the `terminals` Secret with the key, and use the same key as the **API Key** of the connection in Open WebUI.

Use the OpenShift-compatible Open Terminal image in the terminal. Set **Image** to `ghcr.io/open-webui/open-terminal:openshift`, **CPU** to `1`, **Memory** to `1Gi`, **Storage** to `5Gi` and the environment variable `OPEN_TERMINAL_FILE_BROWSER_ROOT` to `home`.

Restricted mode applies Kubernetes security-context defaults suitable for restricted OpenShift deployments. Override them with `TERMINALS_KUBERNETES_POD_SECURITY_CONTEXT` and `TERMINALS_KUBERNETES_CONTAINER_SECURITY_CONTEXT` when your cluster requires different values.

Use cluster network policy for egress control on OpenShift.
