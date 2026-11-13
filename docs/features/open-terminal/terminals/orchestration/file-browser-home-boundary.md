---
sidebar_position: 8
title: "File Browser Root"
---

# File Browser Root

Open Terminal tells clients such as Open WebUI which folder the file browser starts in and treats as its top. By default that is the home folder, shown as `Home`, and the file browser hides the folders above it. This keeps non-technical users out of system folders such as `/etc`, where they could think they have reached another user's files.

## Configure The Root

The default value is `home`, which uses the user's home directory and shows it as `Home`.

Set an explicit path to visually root the file browser somewhere else:

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "/workspace"
}
```

Open Terminal resolves the path for the current user. The first breadcrumb shows `Home` for the user's home directory, otherwise the final path segment.

You can also use `{{home}}` or `~` for paths under the current user's home:

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "{{home}}/project"
}
```

Set this in the terminal's **Environment variables** to opt out entirely:

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "filesystem"
}
```

With the value `filesystem`, the file browser shows the full filesystem.

## Client Behavior

- Opens at the root.
- Shows the first breadcrumb as the root's label.
- Hides parent folders above the root.
- Keeps the user inside the root when they try to navigate above it.
- Shows the full filesystem when the value is `filesystem`.

## What This Does Not Do

The root shapes what the file browser shows. Terminal commands and model tools operate with the permissions of the terminal container, so use container isolation, filesystem permissions, Kubernetes security context, network policy and per-user storage to restrict access.
