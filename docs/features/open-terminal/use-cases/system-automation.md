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

{/* TODO: Screenshot — Chat showing the AI processing 200 files. The response says "Done! Renamed 200 files and sorted into 8 monthly folders." An example shows: IMG_4521.jpg → 2025-03/2025-03-15_IMG_4521.jpg */}

{/* TODO: Screenshot — File browser showing the new folder structure: 2025-01/, 2025-02/, 2025-03/, etc., with renamed photos inside each. */}

---

## "Find and remove duplicates"

> **You:** Are there any duplicate files in my documents folder?

The AI checks file sizes and content to find exact duplicates, then asks you what to do:

{/* TODO: Screenshot — Chat showing the AI's report: "Found 12 duplicate pairs (saving 340 MB total). Here are the largest:" followed by a table showing file names, sizes, and locations of each duplicate pair. The AI asks "Would you like me to delete the duplicates?" */}

---

## "Back up this folder"

> **You:** Create a zip backup of the /projects folder with today's date in the filename.

{/* TODO: Screenshot — Chat showing the AI creating the backup: "Created backup: projects_2025-03-20.zip (245 MB). Saved to /backups/". The file browser shows the zip file. */}

---

## "Convert these files"

> **You:** Convert all the .png screenshots in this folder to .jpg and make them half the size.

The AI uses image tools (which come pre-installed in Docker) to batch-convert and resize:

{/* TODO: Screenshot — Chat showing the AI processing files: "Converted 25 images from PNG to JPG. Average file size reduced from 2.1 MB to 380 KB." */}

{/* TODO: Screenshot — File browser showing the converted .jpg files alongside or replacing the originals. */}

---

## "Check on the system"

> **You:** How much disk space is left? Are any big files I should clean up?

{/* TODO: Screenshot — Chat showing the AI running a disk usage analysis: "You have 12 GB free out of 50 GB. The largest directories are: /home/user/data (8.2 GB), /home/user/logs (3.1 GB). The single largest file is access.log at 1.4 GB — it's 6 months old. Want me to clean it up?" */}

---

## "Do this to every file in the folder"

> **You:** For every CSV file in /data, add a header row with "Name, Date, Amount" and save it.

The AI writes a script, processes every file, and reports back:

{/* TODO: Screenshot — Chat showing the AI processing CSV files: "Updated 15 CSV files with the header row. Here's a preview of the first one:" followed by a small table showing the first few rows with the new header. */}

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
