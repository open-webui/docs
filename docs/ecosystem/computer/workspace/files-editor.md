---
title: "Files, editor, tabs, and splits"
sidebar_position: 2
---

# Files, editor, tabs, and splits

The file browser is for the files already in the selected workspace: open a source file, inspect a Markdown or media preview, keep related files open, and arrange the view around the small decision you need to make.

## Use this when

Use this to inspect or change a real workspace file, compare a source file with a test or diff, or manage a small set of open files while away from your desk. For a large refactor, use the editor to investigate but reserve broad review for a screen and workflow that suit it.

## Before you start

- Select the correct workspace and confirm its path before opening or editing files.
- Ensure the host account can write the file. Read-only mounts and source-control permissions still apply.
- If a file contains secrets, do not paste it into an AI chat or share screenshots of it.

## Do it

1. Browse with the file tree or type a name in its filter. Use the breadcrumb to move back through directories.
2. Select a file to open it in an editor tab. Use the file's preview control where available for Markdown and supported visual formats.
3. Keep two files open in tabs, then drag a tab into a split when comparing an implementation with its test or configuration.
4. Save the smallest intended edit and return to the git bar to inspect the diff. Use the file context menu to copy a path, rename, download, or manage an entry only when that is really the change you intend.

## Verify it worked

The editor title and breadcrumb identify the expected workspace path. After saving, reopening the file shows the same content and the git panel reports the intended modification. In a split, each pane remains bound to the file you selected instead of replacing the other view.

## If it did not

- **A file will not save:** check the workspace path, host permissions, and whether the directory is mounted read-only. Do not copy the content elsewhere and assume the real file changed.
- **The wrong tab changed:** use the tab title and path before saving, then inspect the git diff. Restore only a line you can identify.
- **A visual preview is unavailable:** open the source form or use the terminal's native tool. Not every file type is editable or previewable in the browser.

## Trust boundary

File actions operate on the host filesystem. Rename, delete, upload, and save are real operations, not a disposable browser draft. Keep the instance private and verify the path before making changes, especially from a small screen.
