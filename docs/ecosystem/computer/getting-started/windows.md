---
title: Windows
sidebar_position: 5
---

# Windows host setup

## Use this when

You are running Open WebUI Computer on a Windows workstation and want the same real files, terminal, and workspace available in the browser.

## Before you start

Install Python 3.10 or newer and ensure its Scripts directory is on `PATH`. Decide which Windows account should own the process: that account's permissions define what the terminal and file browser can access.

## Do it

In PowerShell:

```powershell
py -m pip install cptr
cptr run
```

Open the URL printed by the command and select an existing project folder in the setup wizard.

## Verify it worked

The workspace sidebar and file browser show the folder you selected and one familiar file. In PowerShell on the host, run `Invoke-RestMethod http://127.0.0.1:8000/api/health`; it returns an object whose `status` is `ok`. If the folder is a Git repository, an optional terminal check with `pwd` and `git status` should match your usual tools.

## If it did not

If creating a terminal reports `VCRUNTIME140.dll` or a Universal CRT DLL is missing, install Microsoft's [Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist), restart Open WebUI Computer, and retry. If `cptr` is not recognized, reopen PowerShell or invoke it with `py -m` from the environment where it was installed.

## Trust boundary

Open WebUI Computer operates with the rights of the Windows account that starts it. Do not use an administrator account merely to make a project easier to reach.

## Not a fit

Use a dedicated managed development environment if the job requires strict per-user Windows isolation. This app is a browser surface for the account and machine you choose.
