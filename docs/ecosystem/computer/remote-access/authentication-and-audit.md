---
title: Authentication and audit boundaries
sidebar_position: 5
---

# Authentication and audit boundaries

## Use this when

You operate a personal instance and need to confirm who can sign in, what a `401` means, and what audit logging can and cannot prove.

## Before you start

The default password sign-in establishes JWT sessions. Audit logging is off by default and records mutating HTTP requests, not a full terminal transcript or a complete record of terminal activity.

## Do it

Use a strong, unique password for the first account and keep sign-up disabled unless you have a deliberate trusted-user workflow. Keep the service on localhost or a private network. If you need audit records, configure the level, path, retention, and protected storage through [logs, health, and configuration](/ecosystem/computer/operate/logs-health-and-configuration).

## Verify it worked

An unsigned-in browser receives `401` for protected API routes, while the intended account can sign in and reach only the instance you operate. If audit logging is enabled, make a harmless mutation and confirm a redacted entry appears using the [operations guide](/ecosystem/computer/operate/logs-health-and-configuration).

## If it did not

A `401` means sign in again or inspect the configured auth mode; do not bypass it with proxy headers. If audit records are absent, follow the operations guide to verify the selected level, writable storage path, and restart requirement. If access works for an unintended network or user, stop the service, return it to localhost-only access, rotate affected credentials, and inspect the available audit records.

## Trust boundary

Audit records can contain operational metadata and, at higher levels, redacted request data. Protect and retain them accordingly. Trusted-header authentication exists as an integration mode, but this documentation does not treat it as a supported reverse-proxy setup.
