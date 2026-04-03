---
sidebar_position: 10
title: "Local Development"
---

# Local Development

**Run Open WebUI from source for development and testing.**

This guide covers setting up a local development environment with the frontend (SvelteKit) and backend (Python/FastAPI) running side by side. You will need two terminal sessions, one for each.

:::tip Don't need a full dev environment?
You can test the latest changes by running the [dev Docker image](/getting-started/quick-start) instead: `docker run -d -p 3000:8080 -v open-webui-dev:/app/backend/data --name open-webui-dev ghcr.io/open-webui/open-webui:dev`
:::

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Python** | 3.11+ |
| **Node.js** | 22.10+ |
| **Git** | Any recent version |

:::warning Separate your data
Never share your database or data directory between dev and production. Dev builds may include database migrations that are not backward-compatible.
:::

---

## 1. Clone the repository

```bash
git clone https://github.com/open-webui/open-webui.git
cd open-webui
```

---

## 2. Frontend setup

In your **first terminal**, from the project root:

```bash
cp -RPp .env.example .env
npm install
npm run build
npm run dev
```

`npm run build` compiles the frontend and catches build-time errors early. `npm run dev` then starts the dev server at [http://localhost:5173](http://localhost:5173). It will show a waiting screen until the backend is running.

:::tip
If `npm install` fails with compatibility warnings, run `npm install --force`.
:::

---

## 3. Backend setup

In your **second terminal**:

```bash
cd backend
```

Create and activate a virtual environment (Conda or venv):

```bash
# Option A: Conda
conda create --name open-webui python=3.11
conda activate open-webui

# Option B: venv
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

Install dependencies and start the server:

```bash
pip install -r requirements.txt -U
sh dev.sh
```

The backend starts at [http://localhost:8080](http://localhost:8080). API docs are available at [http://localhost:8080/docs](http://localhost:8080/docs).

Refresh the frontend at [http://localhost:5173](http://localhost:5173) and you should see the full application.

---

## Testing from another device

To access your dev instance from a phone or another computer on the same network:

1. Find your machine's LAN IP (e.g., `192.168.1.42`)
2. Add the origin to CORS in `backend/dev.sh`:

```bash
export CORS_ALLOW_ORIGIN="http://localhost:5173;http://localhost:8080;http://192.168.1.42:5173"
```

3. Restart the backend and browse to `http://192.168.1.42:5173`

---

## Troubleshooting

### "FATAL ERROR: Reached Heap Limit"

Node.js is running out of memory during the build. Increase the heap size before running frontend commands:

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

Ensure at least 4 GB of RAM is available.

### Port conflicts

If port `5173` or `8080` is already in use, find the conflicting process:

```bash
# macOS/Linux
lsof -i :5173

# Windows (PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess
```

Terminate the process or change the port in `vite.config.js` (frontend) or `dev.sh` (backend).

### Icons not loading (CORS)

If static assets fail to load, configure `CORS_ALLOW_ORIGIN` in `backend/dev.sh` to include your frontend URL. See [CORS configuration](/reference/env-configuration#cors_allow_origin) for details.

### Hot reload not working

1. Verify both dev servers are running without errors
2. Hard refresh the browser (Ctrl+Shift+R / Cmd+Shift+R)
3. Reinstall frontend dependencies: `rm -rf node_modules && npm install`
4. Backend changes may require manually restarting `sh dev.sh`

---

## Contributing workflow

1. **Open a discussion first** at [GitHub Discussions](https://github.com/open-webui/open-webui/discussions/new/choose) before writing code
2. **Create a branch** from `dev` for your work. Never commit directly to `dev`.

```bash
git checkout dev
git pull origin dev
git checkout -b my-feature-branch
```

3. **Keep your branch synced** by periodically merging from `dev`
4. **Submit a pull request** to the `dev` branch with a clear title and description

For contribution guidelines, see [Contributing](/contributing).
