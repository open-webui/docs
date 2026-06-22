---
sidebar_position: 7
title: "File Browser Root"
---

# File Browser Root

Open Terminal reports a file-browser root through `GET /files/cwd`:

```json
{
  "cwd": "/home/user/project",
  "home": "/home/user",
  "root": {
    "path": "/home/user",
    "label": "Home"
  }
}
```

Clients such as Open WebUI should use this metadata to start the file browser inside `root.path`, render the first breadcrumb as `root.label`, and hide parent navigation above that root.

This prevents confusing support cases where non-technical users accidentally browse into system folders such as `/etc` and think they have accessed another user's files.

## Configure The Root

The default value is `home`, which reports the user's home directory as `Home`.

Set an explicit path to visually root the file browser somewhere else:

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "/workspace"
}
```

Open Terminal resolves the path for the current user and reports it as `root.path`. The root label is `Home` for the user's home directory, otherwise it uses the final path segment.

You can also use `{{home}}` or `~` for paths under the current user's home:

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "{{home}}/project"
}
```

Set this in policy `env` to opt out entirely:

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "filesystem"
}
```

When this value is `filesystem`, Open Terminal does not report `root` metadata from `GET /files/cwd`, so clients keep full filesystem browsing.

## Client Behavior

- Open at the reported root when `root` is present.
- Show the first breadcrumb as `root.label`.
- Hide parent folders above the root.
- Handle attempts to navigate above the root in the client UI.
- Keep full filesystem browsing when `root` is absent.

## What This Does Not Do

This is not a security boundary.

Terminal commands and model tools still operate with the permissions of the terminal container. Use container isolation, filesystem permissions, Kubernetes security context, network policy, and per-user storage for security.
