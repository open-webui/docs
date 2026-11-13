## Prerequisites

- A running Kubernetes cluster
- [Helm](https://helm.sh/docs/intro/install/) v3 installed
- `kubectl` configured to access your cluster
- [Open WebUI Enterprise License](https://docs.openwebui.com/enterprise) (required for production use)

## Deploy with Helm

The Open WebUI Helm chart includes Terminals as an optional subchart. Add a `terminals` section to your values file:

```yaml
# values.yaml
terminals:
  enabled: true
  apiKey: ""  # Auto-generated if left empty

  crd:
    install: false  # install the CRD from the Terminals repository, see below

  operator:
    image:
      repository: ghcr.io/open-webui/terminals-operator
      tag: latest

  orchestrator:
    image:
      repository: ghcr.io/open-webui/terminals
      tag: latest
    backend: kubernetes-operator
    terminalImage: "ghcr.io/open-webui/open-terminal:latest"
    idleTimeoutMinutes: 30
```

Then install or upgrade:

```bash
helm upgrade --install open-webui open-webui/open-webui \
  -f values.yaml \
  --namespace open-webui --create-namespace
```

:::tip Auto-configured connection
When `terminals.enabled` is `true`, the chart sets `TERMINAL_SERVER_CONNECTIONS` to point at the in-cluster orchestrator. In **Admin Settings > Integrations**, open the connection and save it once, so Open WebUI detects it as an orchestrator. Give the people who create terminals **Write** access in the connection's **Access** setting, see [Creating Terminals](/features/open-terminal/terminals/orchestration/creating-terminals).
:::

The Terminal CRD must define `spec.templateId`. The CRD bundled with the Helm chart requires `spec.userId`, so install the CRD from the [Terminals repository](https://github.com/open-webui/terminals/blob/main/manifests/terminal-crd.yaml) for your Terminals version and set `terminals.crd.install: false`.

### Verify

```bash
# Check that all pods are running
kubectl get pods -n open-webui -l app.kubernetes.io/part-of=open-terminal

# Check that the CRD is installed
kubectl get crd terminals.openwebui.com
```

---

## What gets deployed

When `terminals.enabled: true`, the chart creates:

| Resource | Purpose |
| :--- | :--- |
| **CRD** (`terminals.openwebui.com`) | Defines the `Terminal` custom resource |
| **Operator Deployment** | Kopf controller that watches Terminal CRs and provisions Pods, Services, PVCs, Secrets |
| **Orchestrator Deployment + Service** | FastAPI service that receives requests from Open WebUI and proxies to the machine Pods |
| **Secret** | Shared API key (auto-generated if not provided) |

For **each machine**, the operator creates a Pod, Service, Secret (API key) and optionally a PVC for persistent storage.

---

## Lifecycle

When a machine is needed, the orchestrator creates a `Terminal` CR. The operator provisions a Pod with a Service, Secret and optional PVC. Once the Pod passes readiness checks, the orchestrator proxies traffic to it.

When a machine has been idle longer than `idleTimeoutMinutes`, the operator deletes the Pod but keeps the PVC and Secret. On the next request, a fresh Pod is created with the same PVC reattached, so **user data persists** across idle cycles.

```bash
# List all terminals
kubectl get terminals -n open-webui

# Inspect a specific terminal
kubectl describe terminal <name> -n open-webui

# Delete a terminal (its Pod, Service and Secret are removed)
kubectl delete terminal <name> -n open-webui
```

Deleting a terminal removes its Pod, Service and Secret. The PVC with its files stays until you delete it separately with `kubectl delete pvc`.

---

## Monitoring

```bash
# Operator logs
kubectl logs -n open-webui deployment/<release>-terminals-operator --tail=50

# Orchestrator logs
kubectl logs -n open-webui deployment/<release>-terminals-orchestrator --tail=50
```

---

<details>
<summary>Terminal CRD reference</summary>

### Spec fields

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `templateId` | string | *(required)* | ID of the terminal this machine belongs to |
| `contextId` | string | `default` | Which machine of the terminal this is: `default`, `user:<id>`, `chat:<id>` or `model:<id>` |
| `image` | string | `ghcr.io/open-webui/open-terminal:latest` | Container image |
| `imagePullPolicy` | string | *(Kubernetes default)* | `Always`, `IfNotPresent` or `Never` |
| `resources.requests.cpu` | string | *(unset)* | CPU request. The orchestrator sets limits only |
| `resources.requests.memory` | string | *(unset)* | Memory request. The orchestrator sets limits only |
| `resources.limits.cpu` | string | *(unset)* | CPU limit. The orchestrator sets it when the terminal has a CPU limit |
| `resources.limits.memory` | string | *(unset)* | Memory limit. The orchestrator sets it when the terminal has a memory limit |
| `idleTimeoutMinutes` | integer | `30` | Idle timeout before Pod is stopped, `0` disables it. The orchestrator always sets it from the terminal or `TERMINALS_IDLE_TIMEOUT_MINUTES`, so the default only applies to hand-written resources |
| `packages` | array | `[]` | Apt packages to pre-install |
| `pipPackages` | array | `[]` | Pip packages to pre-install |
| `env` | object | `{}` | Environment variables passed to the container |
| `restricted` | boolean | `false` | Restricted Kubernetes and OpenShift pod defaults |
| `podSecurityContext`, `containerSecurityContext` | object | *(unset)* | Security contexts copied to the Pod and the container |
| `podTemplate` | object | *(unset)* | Pod metadata and spec overrides merged into the generated Pod |
| `persistence.enabled` | boolean | `true` | Enable persistent storage |
| `persistence.size` | string | `1Gi` | PVC size |
| `persistence.storageClass` | string | *(cluster default)* | Storage class |

### Status fields

| Field | Description |
| :--- | :--- |
| `phase` | `Pending`, `Provisioning`, `Running`, `Idle`, or `Error` |
| `podName` | Name of the terminal Pod |
| `serviceUrl` | In-cluster URL for the terminal |
| `apiKeySecret` | Secret holding the terminal's API key |
| `lastActivityAt` | Timestamp of last proxied request |
| `message` | Human-readable status message |

</details>

<details>
<summary>Full Helm values reference</summary>

| Key | Default | Description |
| :--- | :--- | :--- |
| `terminals.enabled` | `false` | Enable the Terminals subchart |
| `terminals.apiKey` | (empty) | Shared API key (auto-generated if empty) |
| `terminals.existingSecret` | (empty) | Pre-existing Secret name (key: `api-key`) |
| `terminals.crd.install` | `true` | Install the Terminal CRD |
| `terminals.operator.image.repository` | `ghcr.io/open-webui/terminals-operator` | Operator image |
| `terminals.operator.image.tag` | `latest` | Operator image tag |
| `terminals.operator.replicaCount` | `1` | Operator replicas |
| `terminals.orchestrator.image.repository` | `ghcr.io/open-webui/terminals` | Orchestrator image |
| `terminals.orchestrator.image.tag` | `latest` | Orchestrator image tag |
| `terminals.orchestrator.backend` | `kubernetes-operator` | Backend type |
| `terminals.orchestrator.terminalImage` | `ghcr.io/open-webui/open-terminal:latest` | Default image for user Pods |
| `terminals.orchestrator.idleTimeoutMinutes` | `30` | Idle timeout (minutes) |
| `terminals.orchestrator.terminalImagePullPolicy` | `IfNotPresent` | Pull policy for the machine image |
| `terminals.orchestrator.replicaCount` | `1` | Orchestrator replicas |
| `terminals.operator.extraEnvVars`, `terminals.orchestrator.extraEnvVars` | `[]` | Extra environment variables, as a list or a map |
| `terminals.networkPolicy.enabled` | `false` | Create NetworkPolicies for the operator, orchestrator and machine Pods |
| `terminals.orchestrator.service.type` | `ClusterIP` | Orchestrator Service type |
| `terminals.orchestrator.service.port` | `8080` | Orchestrator Service port |

</details>

<details>
<summary>RBAC requirements (manual install only)</summary>

If not using the Helm chart, the operator's ServiceAccount needs a ClusterRole with:

| Resource | Verbs |
| :--- | :--- |
| `terminals.openwebui.com` | get, list, watch, create, update, patch, delete |
| `pods`, `services`, `persistentvolumeclaims`, `secrets` | get, list, watch, create, update, patch, delete |
| `events` | create |
| `configmaps`, `leases` | get, list, watch, create, update, patch |

</details>
