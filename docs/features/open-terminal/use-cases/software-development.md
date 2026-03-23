---
sidebar_position: 2
title: "Software Development"
---

# Software Development

Open Terminal enables the AI to interact with real codebases — cloning repos, running tests, reading errors, installing dependencies, and iterating on fixes.

---

## Clone and explore a repo

> **You:** Clone https://github.com/user/project and give me an overview of the codebase. What's the architecture? Where are the entry points?

The AI:
1. Runs `git clone` to pull the repo
2. Scans the directory structure, reads key files (`README`, `package.json`, `pyproject.toml`, etc.)
3. Identifies the tech stack, entry points, and major components
4. Returns a structured summary with file counts, dependencies, and architecture notes

![AI listing project files and describing the structure](/images/open-terminal-ai-file-listing.png)

---

## Run the test suite and fix failures

> **You:** Run the tests. If anything fails, figure out why and fix it.

The AI:
1. Detects the test framework (`pytest`, `jest`, `go test`, etc.)
2. Installs dependencies if needed
3. Runs the full test suite
4. Reads failure output, traces the bug, edits the source code
5. Re-runs the failing tests to confirm the fix

![AI running tests and iterating on fixes](/images/open-terminal-ai-test-suite.png)

:::tip Iterative debugging
The AI sees the same terminal output a developer would — stack traces, assertion errors, log messages. Multiple rounds of "run → read error → fix → re-run" happen automatically.
:::

---

## Set up a development environment

> **You:** Set up this project so I can develop on it. Install all dependencies, create the database, and run the dev server.

The AI:
1. Reads setup docs (`README`, `Makefile`, `docker-compose.yml`)
2. Installs system packages and language dependencies
3. Creates config files, sets up databases, runs migrations
4. Starts the dev server and confirms it's working
5. Reports the URL where you can access it

![AI installing dependencies and running a project](/images/open-terminal-ai-install-run.png)

---

## Refactor with confidence

> **You:** Refactor the database queries in `users.py` to use async/await. Make sure the tests still pass.

The AI:
1. Reads the current implementation
2. Rewrites the code with your requested changes
3. Runs the test suite to verify nothing broke
4. If tests fail, adjusts the refactored code until they pass
5. Shows you a `git diff` of what changed

![AI debugging and fixing code errors automatically](/images/open-terminal-ai-debug-fix.png)

---

## Git workflows

> **You:** Show me what changed since the last release tag. Summarize the commits.

The AI works with Git directly:

- `git log`, `git diff`, `git blame` to analyze history
- Create branches, stage changes, make commits
- Generate changelogs from commit history
- Find when a bug was introduced with `git bisect`
- Resolve merge conflicts

![AI initializing a git repo and working with git](/images/open-terminal-ai-git-workflow.png)

---

## Write and run tests

> **You:** Write unit tests for the `calculate_shipping()` function in `orders.py`. Cover edge cases.

The AI:
1. Reads the function to understand its logic and parameters
2. Identifies edge cases (zero quantity, negative values, international vs domestic, free shipping threshold)
3. Writes test cases using the project's existing test framework
4. Runs them to verify they pass
5. If any fail, it determines whether it's a test bug or a code bug

![AI writing and running unit tests with pytest](/images/open-terminal-ai-test-suite.png)

---

## Debug a specific issue

> **You:** Users are reporting that the login endpoint returns 500 sometimes. Here's the error from the logs: `KeyError: 'session_token'`. Find and fix it.

The AI:
1. Searches the codebase for where `session_token` is used
2. Reads the surrounding code to understand the flow
3. Identifies the bug (e.g., missing key check when session expires)
4. Writes the fix with proper error handling
5. Adds a test case for the edge case
6. Runs the tests to confirm

![AI finding and fixing a bug in the codebase](/images/open-terminal-ai-debug-fix.png)

---

## Build and verify an API

> **You:** Create a REST API for managing a bookstore. I need CRUD for books, authors, and categories. Use FastAPI and SQLite.

The AI:
1. Scaffolds the project structure
2. Defines database models and schemas
3. Implements all endpoints with validation
4. Creates seed data
5. Starts the server and tests every endpoint with `curl`
6. Shows you the Swagger docs page

![AI creating and running a web application](/images/open-terminal-ai-web-dev.png)

---

## What languages and tools are available?

The Docker image comes with common development tools pre-installed:

| Category | Tools available |
| :--- | :--- |
| **Languages** | Python, Node.js, Ruby, C/C++, Bash |
| **Package managers** | pip, npm, gem, apt |
| **Version control** | Git |
| **Editors** | nano, vim |
| **Build tools** | make, gcc, g++ |

The AI can install additional tools on the fly — Rust, Go, Java, Docker CLI, database clients, and anything else available via `apt` or language-specific package managers.

## Related

- **[Code execution →](./code-execution)** — quick scripts and one-off tasks
- **[Web development →](./web-development)** — build and preview websites
- **[Advanced workflows →](./advanced-workflows)** — skills for code review, database analysis, and more
