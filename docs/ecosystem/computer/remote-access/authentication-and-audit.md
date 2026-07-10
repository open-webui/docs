---
title: Authentication and audit logging
sidebar_position: 5
---

# Authentication and audit logging

## Use this when

You operate a personal instance and need an evidence trail for configuration changes or a way to distinguish an access problem from a server problem.

## Before you start

The default password sign-in establishes JWT sessions. Configuration is stored under the data directory. Audit logging is off by default and records mutating HTTP requests, not a full terminal transcript.

## Do it

Start the server with an audit level appropriate to your privacy needs:

```bash
CPTR_AUDIT_LOG_LEVEL=METADATA cptr run
```

Use `REQUEST` to include redacted request bodies or `REQUEST_RESPONSE` to include redacted request and response bodies. The default file is `~/.cptr/logs/audit.jsonl`; set `CPTR_AUDIT_LOG_PATH` to store it elsewhere. Use a strong unique password at first setup and keep signup disabled unless you have a trusted-user workflow.

## Verify it worked

Make a harmless change such as opening a workspace or saving a preference, then inspect the last JSON line in the audit log. It contains the method, path, status, source IP, and authenticated user metadata. Passwords, API keys, tokens, authorization, cookies, and secrets are redacted.

## If it did not

Restart after changing environment variables; they are read when the process starts. If the file is absent, verify the process can create its parent directory and that the level is one of `METADATA`, `REQUEST`, or `REQUEST_RESPONSE`. A `401` means sign in again or inspect the configured auth mode; do not bypass it with proxy headers.

## Trust boundary

Audit records can contain operational metadata and, at higher levels, redacted request data. Protect and retain them accordingly. Trusted-header authentication exists as an integration mode, but this documentation does not treat it as a supported reverse-proxy setup.
