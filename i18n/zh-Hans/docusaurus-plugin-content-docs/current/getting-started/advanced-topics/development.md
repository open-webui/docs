---
sidebar_position: 10
title: "开发 Open WebUI"
---

# 开发 Open WebUI

:::danger 在 `dev` 上开发，切勿在 `main` 上开发
`dev` 是预发布分支，所有改动都会先进入该分支。每项修复和每项功能都会提交到 `dev` 并保留在那里，因此今天修复的缺陷今天就会出现在 `dev` 中，并在下次发布时进入 `main`。`main` 是发布日当天从 `dev` 截取的快照，这意味着从 `main` 构建得到的代码已经落后。

全新执行 `git clone` 后会位于 `main`。请先切换分支，再进行任何其他操作：

```bash
git clone https://github.com/open-webui/open-webui.git
cd open-webui
git checkout dev
```

拉取请求也应以 `dev` 为目标分支。以 `main` 为目标的拉取请求必须重新创建。
:::

**从源代码运行 Open WebUI，以便进行开发和测试。**

本指南介绍如何搭建本地开发环境，让前端（SvelteKit）与后端（Python/FastAPI）同时运行。你需要两个终端会话，分别用于前端和后端。

:::tip 不需要完整的开发环境？
可以改为运行 `:dev` 预发布镜像。它使用相同的代码，并会随着改动提交每晚重新构建，无需你手动构建：

```bash
docker run -d -p 3001:8080 --add-host=host.docker.internal:host-gateway -v open-webui-dev:/app/backend/data -e WEBUI_SECRET_KEY=your-secret-key --name open-webui-dev --restart always ghcr.io/open-webui/open-webui:dev
```

测试该镜像并报告发现的问题，是成本最低的贡献方式，也是保障发布质量的重要方式。详情请参阅[使用 Dev 分支](/getting-started/quick-start#using-the-dev-branch)，并注意它使用独立的数据卷。
:::

---

## 前提条件 {#prerequisites}

| 要求 | 版本 |
|-------------|---------|
| **Python** | 3.11 或 3.12（请参阅下方说明；尚不支持 3.13） |
| **Node.js** | 20.19+ 或 22.13+（`package.json` 允许最高 22.x；Docker 镜像基于 Node 22 构建） |
| **Git** | 任意较新版本 |

:::info Python 版本兼容性
Open WebUI 支持 **Python 3.11 和 3.12**。**尚不支持 3.13**：仍有少数依赖需要发布兼容 3.13 的版本，在此之前，在 3.13 上安装会失败或在运行时出错。

- **生产环境**请使用 [Docker 镜像](/getting-started/quick-start)或**最新的 Python 3.12**。Docker 镜像在 Debian 13 上运行 Python 3.12。
- **3.11 同样可用**于开发和 pip 安装。
:::

:::warning 隔离数据
切勿在开发环境与生产环境之间共享数据库或数据目录。开发构建可能包含不向后兼容的数据库迁移。
:::

---

## 1. 克隆仓库 {#1-clone-the-repository}

```bash
git clone https://github.com/open-webui/open-webui.git
cd open-webui
git checkout dev
```

`git checkout dev` 是关键一行。缺少这一步，你构建的将是上一个发布版本，而不是当前代码。

---

## 2. 前端设置 {#2-frontend-setup}

在**第一个终端**中，从项目根目录运行：

```bash
cp -RPp .env.example .env
npm install
npm run build
npm run dev
```

`npm run build` 会编译前端并及早发现构建时错误。它运行 Vite，并将 Node.js 堆内存上限设为 12 GB。随后，`npm run dev` 会在 [http://localhost:5173](http://localhost:5173) 启动开发服务器。在后端运行之前，页面会显示“Backend Required”；后端启动后，点击 **Check Again**。

:::tip
如果 `npm install` 因兼容性警告而失败，请运行 `npm install --force`。
:::

---

## 3. 后端设置 {#3-backend-setup}

在**第二个终端**中运行：

```bash
cd backend
```

创建并激活虚拟环境（Conda 或 venv）：

```bash
# 方案 A：Conda
conda create --name open-webui python=3.12
conda activate open-webui

# 方案 B：venv
python3 -m venv venv
source venv/bin/activate  # Windows：venv\Scripts\activate
```

安装依赖并启动服务器：

```bash
pip install -r requirements.txt -U
sh dev.sh
```

`dev.sh` 不会生成密钥，因此请先设置 `WEBUI_SECRET_KEY`，使用一个较长的随机值（在 shell 中导出，或写入根目录的 `.env`）；否则后端会在启动时退出。后端将在 [http://localhost:8080](http://localhost:8080) 启动。API 文档位于 [http://localhost:8080/docs](http://localhost:8080/docs)。只有 `ENV=dev` 时才提供 `/docs` 页面，从源代码运行时这是默认值；Docker 镜像会设置 `ENV=prod`，不提供该页面。

刷新 [http://localhost:5173](http://localhost:5173) 上的前端页面，即可看到完整应用。

---

## 从其他设备测试 {#testing-from-another-device}

要从手机或同一网络中的另一台计算机访问开发实例：

1. 查找本机的局域网 IP（例如 `192.168.1.42`）
2. 在 `backend/dev.sh` 中将该来源添加到 CORS：

```bash
export CORS_ALLOW_ORIGIN="http://localhost:5173;http://localhost:8080;http://192.168.1.42:5173"
```

3. 重启后端，然后浏览至 `http://192.168.1.42:5173`

`npm run dev` 会运行 `vite dev --host`，因此开发服务器已监听所有网络接口，并将 `/api`、`/ollama`、`/openai`、`/oauth` 和 `/ws` 代理到后端。仍需配置 CORS 条目，因为 Socket.IO 会根据 `CORS_ALLOW_ORIGIN` 检查浏览器的 `Origin` 请求头。如果后端运行在另一台计算机上，请使用 `WEBUI_BACKEND_URL=http://<host>:8080 npm run dev` 将代理指向该后端。

---

## 故障排除 {#troubleshooting}

### “FATAL ERROR: Reached Heap Limit” {#fatal-error-reached-heap-limit}

Node.js 内存不足。`npm run build` 已自行设置 12 GB 的堆内存上限。对于 `npm run dev` 和其他前端命令，请在运行前增大堆内存：

```bash
export NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

请确保至少有 4 GB 可用内存。

### 端口冲突 {#port-conflicts}

如果端口 `5173` 或 `8080` 已被占用，请查找冲突进程：

```bash
# macOS/Linux
lsof -i :5173

# Windows（PowerShell）
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess
```

终止该进程，或改用其他端口启动：后端使用 `PORT=9000 sh dev.sh`（随后使用 `WEBUI_BACKEND_URL=http://localhost:9000 npm run dev` 启动前端），前端使用 `npm run dev:5050`（先将 `http://localhost:5050` 添加到 `backend/dev.sh` 中的 `CORS_ALLOW_ORIGIN`）。

### 图标未加载 {#icons-not-loading}

静态资源来自 Vite 开发服务器，API 请求通过同一来源下的代理发送，因此 `CORS_ALLOW_ORIGIN` 不会影响这些请求。请改为检查开发服务器终端和浏览器的 Network 标签页，找出失败的请求。

### 热重载不工作 {#hot-reload-not-working}

1. 确认两个开发服务器均在运行且没有错误
2. 强制刷新浏览器（Ctrl+Shift+R / Cmd+Shift+R）
3. 重新安装前端依赖：`rm -rf node_modules && npm install`
4. 后端改动可能需要手动重启 `sh dev.sh`

---

## 贡献流程 {#contributing-workflow}

1. 在编写代码之前，先在 [GitHub Discussions](https://github.com/open-webui/open-webui/discussions/new/choose) 中**发起讨论**
2. 从 `dev` **创建工作分支**。切勿直接向 `dev` 提交。

```bash
git checkout dev
git pull origin dev
git checkout -b my-feature-branch
```

3. 定期合并 `dev` 中的改动，**保持分支同步**
4. 向 `dev` 分支**提交拉取请求**，并提供清晰的标题和描述

贡献准则请参阅[贡献指南](/contributing)。
