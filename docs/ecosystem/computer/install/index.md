---
title: Installation
sidebar_position: 1
---

# Installation

The fastest install is two commands on the machine you want to serve:

```bash
pip install cptr
cptr run
```

That path (including `uvx cptr@latest run` if you prefer uv) is covered step by step in the [quickstart](/ecosystem/computer/quickstart). This section covers everything else:

| You want | Go to |
|---|---|
| Install with pip or uv on the machine itself | [Quickstart](/ecosystem/computer/quickstart) |
| Run in a container (compose, named volumes, project mounts) | [Docker](./docker) |
| Install on a Windows machine | [Windows](./windows) |
| Install on a host with no internet access | [Air-gapped](./air-gapped) |
| Upgrade an existing install | [Updating](./updating) |

## Requirements

- Python 3.10 or newer (not needed for Docker)
- macOS, Linux, or Windows
- A browser, on the same machine or any other device

Optional feature groups install as pip extras: `cptr[mcp]` for MCP tool servers, `cptr[pam]` for PAM auth, or `cptr[all]` for everything. The Docker image already includes all of them.
