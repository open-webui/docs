---
title: "Keep it running"
sidebar_position: 6
---

# Keep it running

Two different things can stop your work: closing the browser tab (harmless) and the `cptr` process dying (not). Here's how to make the second one stop happening.

## What survives what

| Event | What happens |
|---|---|
| You close the tab / lose signal / lock your phone | Nothing stops. Terminals, agent tasks, and sessions run server-side; reconnect from any device and pick up where you left off. |
| The `cptr` process exits, or the host reboots or sleeps | Sessions end. Your files, chats, and config are safe on disk, but running terminals and in-flight agent work stop. |

So the job is: start `cptr` at boot, restart it if it crashes, and stop the machine from sleeping.

## Start at boot

Use the absolute path to `cptr` in your virtualenv (find it with `which cptr` while the venv is active); boot-time services don't have your shell's PATH.

### macOS (launchd)

Create `~/Library/LaunchAgents/com.openwebui.cptr.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.openwebui.cptr</string>
    <key>ProgramArguments</key>
    <array>
        <string>/Users/you/venvs/cptr/bin/cptr</string>
        <string>run</string>
        <string>--headless</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <true/>
</dict>
</plist>
```

Load it now (and automatically at every login):

```bash
launchctl load ~/Library/LaunchAgents/com.openwebui.cptr.plist
```

`--headless` stops `cptr` from trying to open a browser window.

### Linux (systemd user service)

Create `~/.config/systemd/user/cptr.service`:

```ini
[Unit]
Description=Open WebUI Computer

[Service]
ExecStart=/home/you/venvs/cptr/bin/cptr run --headless
Restart=on-failure

[Install]
WantedBy=default.target
```

```bash
systemctl --user enable --now cptr
loginctl enable-linger $USER   # keep it running when you're not logged in
```

### Windows (Task Scheduler)

Task Scheduler → **Create Task**: trigger **At log on**, action **Start a program** with the full path to `cptr.exe` (e.g. `C:\Users\you\venvs\cptr\Scripts\cptr.exe`) and arguments `run --headless`. Under Settings, enable "If the task fails, restart every ...".

### Docker

Use a restart policy; Docker brings the container back after crashes and reboots:

```yaml
services:
  cptr:
    image: ghcr.io/open-webui/computer:latest
    restart: unless-stopped
```

(or `docker run --restart unless-stopped ...`). Full setup: [Docker install](/ecosystem/computer/install/docker).

## Stop the machine from sleeping

A sleeping host serves nothing.

- **macOS:** **System Settings → Battery → Options → Prevent automatic sleeping when the display is off** (applies on the power adapter). Or ad hoc from a terminal: `caffeinate -s` keeps the Mac awake while it runs.
- **Linux:** desktop distros suspend by default. Disable automatic suspend in your desktop's power settings, or set `IdleAction=ignore` in `/etc/systemd/logind.conf`.
- **Windows:** **Settings → System → Power** → set "When plugged in, put my device to sleep" to **Never**.
- **Laptops with the lid closed:** closing the lid sleeps the machine regardless of the above. Keep it plugged in and set "do nothing" on lid close (macOS needs the prevent-sleep setting above; Linux: `HandleLidSwitch=ignore` in `logind.conf`; Windows: lid-close action in power settings).

## Verify

Reboot the machine, don't touch it, and open Computer from your phone. If it loads, you're done: `curl http://127.0.0.1:8000/api/health` on the host confirms the service is up. If something's off, check [troubleshooting](/ecosystem/computer/troubleshooting).
