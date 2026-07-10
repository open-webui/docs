---
title: Operate Open WebUI Computer
sidebar_position: 1
---

# Operate Open WebUI Computer

These pages cover a persistent single-host instance: where state lives, how to back it up, how to upgrade it, and how to prove it is healthy. They do not turn Open WebUI Computer into a multi-replica or untrusted shared service.

Operate the app only after its local-folder workflow is useful. Private remote access is the next optional layer; schedules, bots, gateway access, and external tool servers come after that and need a separate high-trust review. A healthy process is useful evidence, but it does not prove that an agent task or unattended run produced the intended result.

- [Data and backups](./data-and-backups)
- [Docker volumes and upgrades](./docker-and-upgrades)
- [Logs, health, and configuration](./logs-health-and-configuration)
