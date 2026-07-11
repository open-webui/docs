---
title: Windows
sidebar_position: 3
---

# Windows

In PowerShell:

```powershell
py -m pip install cptr
cptr run
```

Your browser opens at `http://localhost:8000`. If `cptr` is not recognized after installing, Python's Scripts directory isn't on `PATH`. Reopen PowerShell after adding it, or install into a virtual environment and run `cptr` from there.

## Terminal fails with a missing VCRUNTIME140.dll

If opening a terminal reports a missing `VCRUNTIME140.dll` or Universal CRT DLL, install Microsoft's [Visual C++ Redistributable](https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist), then restart `cptr`.

## Which account should run it

Open WebUI Computer runs with the rights of the Windows account that starts it; that account's permissions decide what the file browser and terminal can reach. Use your normal account; don't run it as administrator just to make a folder easier to reach.

## Keep it running

To have Open WebUI Computer start automatically and survive logouts, see [keep it running](/ecosystem/computer/phone-and-remote/keep-it-running).
