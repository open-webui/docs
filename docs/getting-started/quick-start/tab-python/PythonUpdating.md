# Updating with Python

To update your locally installed **Open-WebUI** package to the latest version using `pip`, follow these simple steps:

```bash
pip install -U open-webui
```

The `-U` (or `--upgrade`) flag ensures that `pip` upgrades the package to the latest available version.

After upgrading, restart the server and verify it starts correctly:

```bash
open-webui serve
```

:::warning Multiple workers
Migrations run at startup in every process. If you run with `UVICORN_WORKERS` above `1`, start the new version with `UVICORN_WORKERS=1`, wait until the migrations finish, then restart. Running more than one worker is not recommended; scale with [replicas](/getting-started/advanced-topics/scaling#step-3-run-multiple-instances) instead.
:::

For version pinning, rollback, and backup procedures, see the [full update guide](/getting-started/updating).
