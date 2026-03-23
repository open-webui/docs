---
sidebar_position: 1
title: "Code Execution"
---

# Code Execution

Open Terminal allows the AI to write, execute, and debug code in real time. It handles the full cycle — writing the script, running it, reading errors, and iterating until the result is correct.

---

## Data visualization

> **You:** Create a chart showing the top 10 most populated countries.

The AI writes a Python script, executes it, and saves the output. Results are available in the file browser.

![AI creating and running a Python script with output](/images/open-terminal-ai-code-execution.png)

---

## Downloading and processing files

> **You:** Download the images from this webpage and sort them by size.

The AI installs required packages, writes the script, downloads files, and organizes them:

![AI installing a library and running a script](/images/open-terminal-ai-install-run.png)

:::tip Automatic dependency installation
In Docker mode, the AI can install packages as needed. If a task requires a library that isn't pre-installed, it installs it automatically before proceeding.
:::

---

## Self-correcting errors

When code fails, the AI reads the error output and adjusts:

> **You:** Scrape all the article titles from this news website.

The AI writes a scraper, hits an unexpected page layout, reads the `AttributeError` traceback, adjusts the CSS selectors, and re-runs successfully.

![AI detecting an error, fixing the script, and running it successfully](/images/open-terminal-ai-debug-fix.png)

---

## Multi-step project scaffolding

> **You:** Create a to-do list app with a web interface and a database.

The AI:
1. Creates project files (HTML, CSS, JavaScript, Python backend)
2. Installs dependencies
3. Sets up the database
4. Starts the server
5. Verifies the result in the web preview

![AI listing files and describing the project structure](/images/open-terminal-ai-file-listing.png)



---

## System queries

> **You:** Check what's using the most disk space.

![AI analyzing disk usage and identifying large files](/images/open-terminal-ai-disk-usage.png)

---

## Available languages

| Language | Status |
| :--- | :--- |
| Python | Pre-installed |
| JavaScript (Node.js) | Pre-installed |
| Bash | Always available |
| Ruby | Pre-installed |
| C / C++ | Compiler pre-installed |

Additional languages (Rust, Go, Java, etc.) can be installed on the fly.

## Related

- **[Software development →](./software-development)** — repos, tests, debugging, refactoring
- **[Document & data analysis →](./file-analysis)** — spreadsheets, PDFs, Word docs
- **[Web development →](./web-development)** — build and preview websites
- **[System automation →](./system-automation)** — file management, backups, batch operations
