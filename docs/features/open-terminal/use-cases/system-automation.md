---
sidebar_position: 4
title: "Automate Tasks"
---

# Automate Tasks

Open Terminal isn't just for code. The AI can manage files, organize folders, process data in bulk, handle backups, and automate repetitive work — all from a conversation.

---

## "Rename and organize these files"

> **You:** I have 200 photos in the /photos folder with names like IMG_4521.jpg. Rename them to include the date and sort them into folders by month.

The AI reads the file dates, renames everything, and creates monthly folders:

![AI creating and renaming files with date prefixes](/images/open-terminal-ai-file-rename.png)

---

## "Find and remove duplicates"

> **You:** Are there any duplicate files in my documents folder?

The AI checks file sizes and content to find exact duplicates, then asks you what to do:

![AI analyzing files with disk usage details](/images/open-terminal-ai-disk-usage.png)

---

## "Back up this folder"

> **You:** Create a zip backup of the /projects folder with today's date in the filename.

![AI executing system automation commands](/images/open-terminal-ai-file-rename.png)

---

## "Convert these files"

> **You:** Convert all the .png screenshots in this folder to .jpg and make them half the size.

The AI uses image tools (which come pre-installed in Docker) to batch-convert and resize:

![AI using run_command for batch file operations](/images/open-terminal-ai-install-run.png)

---

## "Check on the system"

> **You:** How much disk space is left? Are any big files I should clean up?

![AI checking disk usage and analyzing storage](/images/open-terminal-ai-disk-usage.png)

---

## "Do this to every file in the folder"

> **You:** For every CSV file in /data, add a header row with "Name, Date, Amount" and save it.

The AI writes a script, processes every file, and reports back:

![AI reading and analyzing CSV data](/images/open-terminal-ai-csv-analysis.png)

---

## Pre-installed tools

The Docker image comes with common tools ready to use:

| What you want to do | Tools available |
| :--- | :--- |
| Download files from the internet | curl, wget |
| Work with JSON data | jq |
| Compress / decompress files | zip, tar, gzip, 7z |
| Process images | ffmpeg, ImageMagick (if installed) |
| Work with databases | sqlite3 |
| Transfer files between servers | rsync, scp |

If a tool isn't installed, the AI can install it on the fly (`sudo apt install ...`).

## More things to try

- **[Run code from chat →](./code-execution)** — the AI writes, runs, and debugs code
- **[Analyze documents & data →](./file-analysis)** — spreadsheets, PDFs, Word docs, emails
- **[Build & preview websites →](./web-development)** — create and iterate on web pages
