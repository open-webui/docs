---
sidebar_position: 10
title: "Developing Open WebUI"
---

# Developing Open WebUI

:::danger Work on `dev`, never on `main`
`dev` is the pre-release branch, and everything lands there first. Every fix and every feature goes to `dev` and stays there, so a bug fixed today is on `dev` today and reaches `main` at the next release. `main` is a snapshot of `dev` taken on release day, which means building from `main` gives you code that is already behind.

A fresh `git clone` puts you on `main`. Switch before you do anything else:

```bash
git clone https://github.com/open-webui/open-webui.git
cd open-webui
git checkout dev
```

Pull requests are opened against `dev` as well. One opened against `main` has to be redone.
:::

**Run Open WebUI from source for development and testing.**

This guide covers setting up a local development environment with the frontend (SvelteKit) and backend (Python/FastAPI) running side by side. You will need two terminal sessions, one for each.

:::tip Don't need a full dev environment?
Run the `:dev` pre-release image instead. It is the same code, rebuilt nightly as changes land, with nothing for you to build:

```bash
docker run -d -p 3001:8080 --add-host=host.docker.internal:host-gateway -v open-webui-dev:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui-dev --restart always ghcr.io/open-webui/open-webui:dev
```

Testing it and reporting what you find is the lowest-effort way to help, and it is what makes releases good. See [Using the Dev Branch](/getting-started/quick-start#using-the-dev-branch) for the details, and note the separate volume.
:::

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| **Python** | 3.11 or 3.12 (see note below; 3.13 not supported yet) |
| **Node.js** | 20.19+ or 22.13+ (`package.json` allows up to 22.x; the Docker image builds on Node 22) |
| **Git** | Any recent version |

:::info Python version compatibility
Open WebUI supports **Python 3.11 and 3.12**. **3.13 is not supported yet**: a few of our dependencies still need to ship 3.13-compatible releases, and until they do, installs on 3.13 will fail or break at runtime.

- **For production**, use the [Docker image](/getting-started/quick-start) or the **latest Python 3.12**. The Docker image runs Python 3.12 on Debian 13.
- **3.11 also works** for development and pip installs.
:::

:::warning Separate your data
Never share your database or data directory between dev and production. Dev builds may include database migrations that are not backward-compatible.
:::

---

## 1. Clone the repository

```bash
git clone https://github.com/open-webui/open-webui.git
cd open-webui
git checkout dev
```

`git checkout dev` is the important line. Without it you are building the last release rather than the current code.

---

## 2. Frontend setup

In your **first terminal**, from the project root:

```bash
cp -RPp .env.example .env
npm install
npm run build
npm run dev
```

`npm run build` compiles the frontend and catches build-time errors early. It runs Vite with a 12 GB Node.js heap limit. `npm run dev` then starts the dev server at [http://localhost:5173](http://localhost:5173). Until the backend is running it shows a "Backend Required" page; click **Check Again** once the backend is up.

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
conda create --name open-webui python=3.12
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

`dev.sh` does not generate a secret key, so set `WEBUI_SECRET_KEY` to a long random value (exported in your shell or in the root `.env`) first; without it the backend exits at startup. The backend starts at [http://localhost:8080](http://localhost:8080). API docs are available at [http://localhost:8080/docs](http://localhost:8080/docs). The `/docs` page is served only when `ENV=dev`, the default when running from source; the Docker image sets `ENV=prod` and does not serve it.

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

`npm run dev` runs `vite dev --host`, so the dev server already listens on every interface and proxies `/api`, `/ollama`, `/openai`, `/oauth` and `/ws` to the backend. The CORS entry is still needed because Socket.IO checks the browser's `Origin` header against `CORS_ALLOW_ORIGIN`. If the backend runs on another machine, point the proxy at it with `WEBUI_BACKEND_URL=http://<host>:8080 npm run dev`.

---

## Troubleshooting

### "FATAL ERROR: Reached Heap Limit"

Node.js is running out of memory. `npm run build` already sets a 12 GB heap limit of its own. For `npm run dev` and other frontend commands, increase the heap size before running them:

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

Terminate the process, or start on another port: `PORT=9000 sh dev.sh` for the backend (then start the frontend with `WEBUI_BACKEND_URL=http://localhost:9000 npm run dev`), and `npm run dev:5050` for the frontend (add `http://localhost:5050` to `CORS_ALLOW_ORIGIN` in `backend/dev.sh` first).

### Icons not loading

Static assets come from the Vite dev server, and API requests go through its proxy on the same origin, so `CORS_ALLOW_ORIGIN` does not affect them. Check the dev server's terminal and the browser's Network tab for the failing request instead.

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
