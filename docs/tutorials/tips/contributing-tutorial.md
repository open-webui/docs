---
sidebar_position: 2
title: "Contributing Tutorials"
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# Contributing Tutorials

We appreciate your interest in contributing tutorials to the Open WebUI documentation. Follow the steps below to set up your environment and submit your tutorial.

## Steps

1. **Fork the `openwebui/docs` GitHub Repository**

   - Navigate to the [Open WebUI Docs Repository](https://github.com/open-webui/docs) on GitHub.
   - Click the **Fork** button at the top-right corner to create a copy under your GitHub account.

2. **Configure GitHub Environment Variables**

   - In your forked repository, go to **Settings** > **Secrets and variables** > **Actions** > **Variables**.
   - Add the following environment variables:
     - `BASE_URL` set to `/docs` (or your chosen base URL for the fork).
     - `SITE_URL` set to `https://<your-github-username>.github.io/`.

3. **Enable GitHub Actions**

   - In your forked repository, navigate to the **Actions** tab.
   - If prompted, enable GitHub Actions by following the on-screen instructions.

4. **Enable GitHub Pages**

   - Go to **Settings** > **Pages** in your forked repository.
   - Under **Source**, select the branch you want to deploy (e.g., `main`) and the folder (e.g.,`/docs`).
   - Click **Save** to enable GitHub Pages.

5. **Run the `gh-pages` GitHub Workflow**

   - In the **Actions** tab, locate the `gh-pages` workflow.
   - Trigger the workflow manually if necessary, or it may run automatically based on your setup.

6. **Browse to Your Forked Copy**

   - Visit `https://<your-github-username>.github.io/docs` to view your forked documentation.

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
```
:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::
```

---

:::tip How to Test Docusaurus Locally  
You can test your Docusaurus site locally with the following commands:

```bash
npm install   # Install dependencies
npm run build # Build the site for production
```

This will help you catch any issues before deploying
:::

---
