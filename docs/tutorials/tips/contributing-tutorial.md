---
sidebar_position: 2
title: "Contributing Tutorials"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# Contributing Tutorials

We appreciate your interest in contributing tutorials to the Open WebUI documentation. Follow the steps below to set up your environment and submit your tutorial.

## Contributing Steps

1. **Fork the `open-webui/docs` GitHub Repository**

   - Navigate to the [Open WebUI Docs Repository](https://github.com/open-webui/docs) on GitHub.
   - Click the **Fork** button at the top-right corner to create a copy under your GitHub account.

2. **Enable GitHub Actions**

   - In your forked repository, navigate to the **Actions** tab.
   - If prompted, enable GitHub Actions by following the on-screen instructions.

3. **Enable GitHub Pages**

   - Go to **Settings** > **Pages** in your forked repository.
   - Under **Source**, select the branch you want to deploy (e.g., `main`) and the folder (e.g.,`/docs`).
   - Click **Save** to enable GitHub Pages.

4. **Configure GitHub Environment Variables**

   - In your forked repository, go to **Settings** > **Secrets and variables** > **Actions** > **Variables**.
   - Add the following environment variables:
     - `BASE_URL` set to `/docs` (or your chosen base URL for the fork).
     - `SITE_URL` set to `https://<your-github-username>.github.io/`.

### 📝 Updating the GitHub Pages Workflow and Config File

If you need to adjust deployment settings to fit your custom setup, here’s what to do:

a. **Update `.github/workflows/gh-pages.yml`**

- Add environment variables for `BASE_URL` and `SITE_URL` to the build step if necessary:

     ```yaml
       - name: Build
         env:
           BASE_URL: ${{ vars.BASE_URL }}
           SITE_URL: ${{ vars.SITE_URL }}
         run: npm run build
     ```

b. **Modify `docusaurus.config.ts` to Use Environment Variables**

- Update `docusaurus.config.ts` to use these environment variables, with default values for local or direct deployment:

     ```typescript
     const config: Config = {
       title: "Open WebUI",
       tagline: "ChatGPT-Style WebUI for LLMs (Formerly Ollama WebUI)",
       favicon: "images/favicon.png",
       url: process.env.SITE_URL || "https://openwebui.com",
       baseUrl: process.env.BASE_URL || "/",
       ...
     };
     ```

- This setup ensures consistent deployment behavior for forks and custom setups.

5. **Run the `gh-pages` GitHub Workflow**

   - In the **Actions** tab, locate the `gh-pages` workflow.
   - Trigger the workflow manually if necessary, or it may run automatically based on your setup.

6. **Browse to Your Forked Copy**

   - Visit `https://<your-github-username>.github.io/<BASE_URL>` to view your forked documentation.

7. **Draft Your Changes**

   - In your forked repository, navigate to the appropriate directory (e.g., `docs/tutorial/`).
   - Create a new markdown file for your tutorial or edit existing ones.
   - Ensure that your tutorial includes the unsupported warning banner.

8. **Submit a Pull Request**

   - Once your tutorial is ready, commit your changes to your forked repository.
   - Navigate to the original `open-webui/docs` repository.
   - Click **New Pull Request** and select your fork and branch as the source.
   - Provide a descriptive title and description for your PR.
   - Submit the pull request for review.

## Important

Community-contributed tutorials must include the the following:

```txt

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

```

---

:::tip

How to Test Docusaurus Locally
You can test your Docusaurus site locally with the following commands:

```bash
npm install   # Install dependencies
npm run build # Build the site for production
```

This will help you catch any issues before deploying

:::

---
