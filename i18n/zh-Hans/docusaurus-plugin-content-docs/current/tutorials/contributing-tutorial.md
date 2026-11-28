---
sidebar_position: 900
title: "为文档做贡献"
---

# 为文档做贡献

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

感谢你关注如何为 Open WebUI 文档贡献教程。请按照以下步骤设置环境并提交教程。

## 贡献步骤 {#contributing-steps}

1. **Fork `open-webui/docs` GitHub 仓库**

   - 在 GitHub 上导航至 [Open WebUI 文档仓库](https://github.com/open-webui/docs)。
   - 点击右上角的 **Fork** 按钮，在你的 GitHub 账户下创建一个副本。

2. **启用 GitHub Actions**

   - 在你 fork 的仓库中，导航至 **Actions** 选项卡。
   - 如果出现提示，请按照屏幕上的说明启用 GitHub Actions。

3. **启用 GitHub Pages**

   - 在你 fork 的仓库中，前往 **Settings** > **Pages**。
   - 在 **Build and deployment** > **Source** 下，选择 **GitHub Actions**。工作流会自行构建并发布站点，因此无需选择分支或文件夹。

4. **配置 GitHub 环境变量**

   - 在你 fork 的仓库中，前往 **Settings** > **Secrets and variables** > **Actions** > **Variables**。
   - 添加以下环境变量：
     - 将 `BASE_URL` 设置为 `/docs`（或你为 fork 选择的基础 URL）。
     - 将 `SITE_URL` 设置为 `https://<your-github-username>.github.io/`。

   这些变量只有在完成下一节的工作流和配置编辑后才会生效：上游 `gh-pages.yml` 的构建步骤未设置 `env`，而 `docusaurus.config.ts` 硬编码了 `url` 和 `baseUrl`。

### 更新 GitHub Pages 工作流和配置文件 {#updating-the-github-pages-workflow-and-config-file}

如果需要调整部署设置以适配自定义环境，请按以下步骤操作：

a. **更新 `.github/workflows/gh-pages.yml`**

- 如有必要，将 `BASE_URL` 和 `SITE_URL` 的环境变量添加到构建步骤：

     ```yaml
       - name: Build
         env:
           BASE_URL: ${{ vars.BASE_URL }}
           SITE_URL: ${{ vars.SITE_URL }}
         run: npm run build
     ```

b. **修改 `docusaurus.config.ts` 以使用环境变量**

- 更新 `docusaurus.config.ts` 以使用这些环境变量，并为本地部署或直接部署提供默认值：

     ```typescript
     const config: Config = {
       title: "Open WebUI",
       tagline: "On a mission to build the best AI interface",
       favicon: "images/favicon.png",
       url: process.env.SITE_URL || "https://docs.openwebui.com",
       baseUrl: process.env.BASE_URL || "/",
       ...
     };
     ```

- 此设置可确保 fork 和自定义环境的部署行为保持一致。

5. **运行 Deploy site to Pages 工作流**

   - 在 **Actions** 选项卡中，找到 **Deploy site to Pages** 工作流（`gh-pages.yml`）。
   - 如有必要，手动触发工作流；它也可能会根据你的设置自动运行。

6. **浏览你的 Fork 副本**

   - 访问 `https://<your-github-username>.github.io/<BASE_URL>`，查看你 fork 的文档。

7. **起草更改**

   - 在你 fork 的仓库中，导航至相应目录（例如 `docs/tutorials/`）。
   - 为教程创建新的 Markdown 文件，或编辑现有文件。
   - 确保教程包含不受支持的警告横幅。

8. **提交 Pull Request**

   - 教程准备就绪后，将更改提交到你 fork 的仓库。
   - 导航至原始 `open-webui/docs` 仓库。
   - 点击 **New Pull Request**，选择你的 fork 和分支作为来源。
   - 为 PR 提供描述清楚的标题和说明。
   - 提交 Pull Request 以供审核。

## 重要说明 {#important}

社区贡献的教程必须包含以下内容：

```txt

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

```

---

:::tip

如何在本地测试 Docusaurus
你可以使用以下命令在本地测试 Docusaurus 站点：

```bash
npm install   # 安装依赖
npm run build # 为生产环境构建站点
```

这有助于你在部署前发现任何问题

:::

---
