# Updating with Python

To update your locally installed **Open-WebUI** package to the latest version using `pip`, follow these simple steps:

```bash
pip install -U open-webui
```

The `-U` (or `--upgrade`) flag ensures that `pip` upgrades the package to the latest available version.

That's it! Your **Open-WebUI** package is now updated and ready to use.

:::warning Multi-Worker Environments
If you run Open WebUI with `UVICORN_WORKERS > 1` (e.g., in a production environment), you **MUST** ensure the update migration runs on a single worker first to prevent database schema corruption.

**Steps for proper update:**
1. Update `open-webui` using `pip`.
2. Start the application with `UVICORN_WORKERS=1` environment variable set.
3. Wait for the application to fully start and complete migrations.
4. Stop and restart the application with your desired number of workers.
:::
