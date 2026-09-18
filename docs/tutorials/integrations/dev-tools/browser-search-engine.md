---
sidebar_position: 50
title: "Browser Search Engine"
---

# Browser Search Engine Integration

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

Open WebUI allows you to integrate directly into your web browser. This tutorial will guide you through the process of setting up Open WebUI as a custom search engine, enabling you to execute queries easily from your browser's address bar.

## Setting Up Open WebUI as a Search Engine

### Prerequisites

Before you begin, ensure that:

- You have Chrome or another supported browser installed.
- Your Open WebUI instance is reachable from the browser at a stable URL.

### Step 1: Note your Open WebUI URL

The Chrome custom search engine is browser-side: the browser opens `<your-open-webui-url>/?q=%s` and Open WebUI reads the `q` parameter from the page URL. Firefox's one-click **Add** option (below) instead reads Open WebUI's `/opensearch.xml` description, which builds its search URL from the **WebUI URL** setting (`WEBUI_URL`, in Admin Panel > Settings > General), so set that to your public URL if you use it.

### Step 2: Add Open WebUI as a Custom Search Engine

### For Chrome

1. Open Chrome and navigate to **Settings**.
2. Select **Search engine** from the sidebar, then click on **Manage search engines**.
3. Click **Add** to create a new search engine.
4. Fill in the details as follows:
    - **Search engine**: Open WebUI Search
    - **Keyword**: webui (or any keyword you prefer)
    - **URL with %s in place of query**:

      ```txt
      https://<your-open-webui-url>/?q=%s
      ```

5. Click **Add** to save the configuration.

### For Firefox

1. Go to Open WebUI in Firefox.
2. Expand the address bar by clicking on it.
3. Click the plus icon that is enclosed in a green circle at the bottom of the expanded address bar. This adds Open WebUI's search to the search engines in your preferences.

Alternatively:

1. Go to Open WebUI in Firefox.
2. Right-click on the address bar.
3. Select "Add Open WebUI" (or similar) from the context menu.

### Optional: Using Specific Models

If you wish to utilize a specific model for your search, modify the URL format to include the model ID:

```txt
https://<your-open-webui-url>/?models=<model_id>&q=%s
```

:::note

**Note:** The model ID will need to be URL-encoded. Special characters like spaces or slashes need to be encoded (e.g., `my model` becomes `my%20model`).

:::

## Example Usage

Once the search engine is set up, you can perform searches directly from the address bar. Simply type your chosen keyword followed by your query:

```txt
webui your search query
```

This command will redirect you to the Open WebUI interface with your search results.

## Troubleshooting

If you encounter any issues, check the following:

- Ensure the URL in the search-engine setting points to a running Open WebUI instance.
- For Firefox's one-click option, ensure **WebUI URL** (`WEBUI_URL`) is set to the address you use to reach Open WebUI.
- Double-check that the search engine URL format is correctly entered in your browser settings.
- Confirm your internet connection is active and that the Open WebUI service is running smoothly.
