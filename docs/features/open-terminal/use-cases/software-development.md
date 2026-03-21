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

{/* TODO: Screenshot — Chat showing the AI cloning a repo, then providing a codebase overview: "This is a FastAPI app with 3 main modules: auth, users, and billing. Entry point is main.py. Database: PostgreSQL via SQLAlchemy. 47 files, 12 API endpoints." */}

{/* TODO: Screenshot — File browser showing the cloned repo's directory tree with folders like src/, tests/, docs/ expanded. */}

---

## Run the test suite and fix failures

> **You:** Run the tests. If anything fails, figure out why and fix it.

The AI:
1. Detects the test framework (`pytest`, `jest`, `go test`, etc.)
2. Installs dependencies if needed
3. Runs the full test suite
4. Reads failure output, traces the bug, edits the source code
5. Re-runs the failing tests to confirm the fix

{/* TODO: Screenshot — Chat showing the AI running pytest, getting 2 failures, reading the tracebacks, editing a source file, and re-running to show all tests passing. */}

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

{/* TODO: Screenshot — Chat showing the AI reading a README, running pip install, running database migrations, starting a Flask dev server, and reporting "Server running on port 5000." */}

---

## Refactor with confidence

> **You:** Refactor the database queries in `users.py` to use async/await. Make sure the tests still pass.

The AI:
1. Reads the current implementation
2. Rewrites the code with your requested changes
3. Runs the test suite to verify nothing broke
4. If tests fail, adjusts the refactored code until they pass
5. Shows you a `git diff` of what changed

{/* TODO: Screenshot — Chat showing the AI refactoring code, running tests (all pass), then displaying a git diff with the changes highlighted: old synchronous queries removed, new async queries added. */}

---

## Git workflows

> **You:** Show me what changed since the last release tag. Summarize the commits.

The AI works with Git directly:

- `git log`, `git diff`, `git blame` to analyze history
- Create branches, stage changes, make commits
- Generate changelogs from commit history
- Find when a bug was introduced with `git bisect`
- Resolve merge conflicts

{/* TODO: Screenshot — Chat showing the AI running git log between two tags, then summarizing: "23 commits since v1.2.0. Key changes: new billing module (5 commits), auth refactor (8 commits), bug fixes (10 commits)." */}

---

## Write and run tests

> **You:** Write unit tests for the `calculate_shipping()` function in `orders.py`. Cover edge cases.

The AI:
1. Reads the function to understand its logic and parameters
2. Identifies edge cases (zero quantity, negative values, international vs domestic, free shipping threshold)
3. Writes test cases using the project's existing test framework
4. Runs them to verify they pass
5. If any fail, it determines whether it's a test bug or a code bug

{/* TODO: Screenshot — Chat showing the AI reading the function, writing 8 test cases, running pytest, and reporting "8 tests passed. Coverage for calculate_shipping: 94%." */}

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

{/* TODO: Screenshot — Chat showing the AI using grep to find the bug location, reading the code, explaining the root cause, applying a fix, and running the test suite. */}

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

{/* TODO: Screenshot — Chat showing the AI testing each endpoint with curl: POST /books (201 Created), GET /books (returns list), PUT /books/1 (updated), DELETE /books/1 (deleted). */}

{/* TODO: Screenshot — Port preview showing the FastAPI Swagger UI at /docs with all endpoints visible. */}

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
