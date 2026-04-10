---
sidebar_position: 500
title: "Advanced Topics"
---

# Advanced Topics

**Go beyond the defaults: scale, debug, and develop Open WebUI for production and contribution.**

Open WebUI works out of the box for personal use, but real-world deployments need more: production databases, horizontal scaling, structured logging, observability. This section covers everything between "it runs on my laptop" and "it serves my entire organization."

---

## Why Advanced Topics?

### Scale beyond a single container

The default SQLite database and single-worker setup top out at small-team usage. Learn how to swap in PostgreSQL, add Redis for shared state, run multiple replicas behind a load balancer, and choose an external vector database, all without re-architecting your deployment.

### Debug with confidence

When something goes wrong at scale, the first question is always "what do the logs say?" Configure log levels, enable structured JSON output for log aggregators, and connect OpenTelemetry for end-to-end traces across your entire stack.

### Contribute to the project

Set up a local development environment with hot-reloading frontend and backend, understand the contribution workflow, and start shipping pull requests.

---

## What's Covered

| | |
| :--- | :--- |
| 🚀 **[Scaling Open WebUI](scaling)** | Move from SQLite to PostgreSQL, add Redis, run multiple replicas, configure external vector databases, and set up shared storage and observability |
| 🪵 **[Logging Open WebUI](logging)** | Configure log levels, enable debug output, and switch to structured JSON logging for production log aggregators |
| 🛠️ **[Developing Open WebUI](development)** | Clone the repo, run the frontend and backend side by side, test on other devices, and submit pull requests |
| 🔒 **[Hardening Open WebUI](hardening)** | Lock down authentication, secrets, CORS, security headers, audit logging, and network access for production deployments |
