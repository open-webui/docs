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

{/* TODO: Screenshot — Chat showing the AI responding with "I'll create a bar chart of the top 10 countries by population." The AI creates and runs a script. Below, the output shows "Chart saved to population_chart.png". */}

{/* TODO: Screenshot — The file browser previewing the generated population_chart.png — a clean bar chart with country names and populations. */}

---

## Downloading and processing files

> **You:** Download the images from this webpage and sort them by size.

The AI installs required packages, writes the script, downloads files, and organizes them:

{/* TODO: Screenshot — Chat showing the AI installing the requests library, running a download script, and reporting: "Downloaded 15 images. Sorted into 3 folders: small (under 100KB), medium (100KB–1MB), large (over 1MB)." */}

{/* TODO: Screenshot — File browser showing the three folders (small/, medium/, large/) with images sorted inside each. */}

:::tip Automatic dependency installation
In Docker mode, the AI can install packages as needed. If a task requires a library that isn't pre-installed, it installs it automatically before proceeding.
:::

---

## Self-correcting errors

When code fails, the AI reads the error output and adjusts:

> **You:** Scrape all the article titles from this news website.

The AI writes a scraper, hits an unexpected page layout, reads the `AttributeError` traceback, adjusts the CSS selectors, and re-runs successfully.

{/* TODO: Screenshot — Chat showing the AI's first attempt failing with an error: "AttributeError: 'NoneType' object has no attribute 'text'". The AI responds: "The page structure is different than expected — the titles are inside <h2> tags, not <h1>. Let me adjust..." Then it runs the fixed version successfully, listing 20 article titles. */}

---

## Multi-step project scaffolding

> **You:** Create a to-do list app with a web interface and a database.

The AI:
1. Creates project files (HTML, CSS, JavaScript, Python backend)
2. Installs dependencies
3. Sets up the database
4. Starts the server
5. Verifies the result in the web preview

{/* TODO: Screenshot — File browser showing a complete project structure: app.py, templates/ folder with HTML files, static/ folder with CSS, requirements.txt. */}

{/* TODO: Screenshot — The web preview panel showing the running to-do app with a text input, an "Add" button, and a list of example tasks with checkboxes. */}

---

## System queries

> **You:** Check what's using the most disk space.

{/* TODO: Screenshot — Chat showing the AI running a disk usage command and interpreting the results: "The /home/user/data directory is using 2.3 GB, mostly from log files. The largest single file is access.log at 800 MB. Would you like me to clean up old logs?" */}

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
