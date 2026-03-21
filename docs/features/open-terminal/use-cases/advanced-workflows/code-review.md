---
sidebar_position: 10
title: "Code Review"
---

# 🔍 Automated Code Review

Point the AI at a pull request, a branch diff, or a file, and get a detailed code review — security issues, performance problems, style violations, and suggestions for improvement.

> **You:** $Code Reviewer <br/>
> Review the changes in the `feature/auth-refactor` branch compared to `main`.

## What the AI does

1. Runs `git diff main..feature/auth-refactor` to see all changes
2. Reads each modified file in full context (not just the diff — it understands surrounding code)
3. Categorizes findings: security, performance, correctness, style, documentation
4. Prioritizes issues from critical to nitpick
5. Suggests specific fixes with code snippets
6. Saves a structured review report

{/* TODO: Screenshot — Chat showing the AI reviewing a branch diff. The response lists findings organized by severity: "🔴 Critical: SQL injection in user_query() — use parameterized queries. 🟡 Warning: N+1 query in get_orders(). 🔵 Suggestion: Extract validation logic into a helper." */}

{/* TODO: Screenshot — The generated review report in the file browser: a markdown file with sections for each file reviewed, findings with line numbers, and suggested fixes with code blocks. */}

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: code-reviewer
description: Reviews code changes for security, performance, correctness, and style issues
---

## Code Review

When asked to review code:

1. **Get the diff**: Use `git diff`, `git log`, or read the specified files to understand what changed
2. **Read full context**: Don't just look at changed lines — read the entire file to understand the surrounding logic, imports, and how the changes fit in
3. **Check for these categories**:
   - **Security**: SQL injection, XSS, hardcoded credentials, missing auth checks, unsafe deserialization, path traversal
   - **Correctness**: Logic errors, off-by-one bugs, unhandled edge cases, race conditions, missing error handling
   - **Performance**: N+1 queries, unnecessary loops, missing indexes, large memory allocations, blocking calls in async code
   - **Style & maintainability**: Inconsistent naming, overly complex functions, missing docstrings, dead code, magic numbers
   - **Testing**: Missing test coverage for new code paths, edge cases not tested
4. **Prioritize findings**:
   - 🔴 Critical: Must fix before merge (security, data loss, crashes)
   - 🟡 Warning: Should fix (performance, correctness edge cases)
   - 🔵 Suggestion: Nice to have (style, refactoring opportunities)
   - 💬 Nitpick: Optional (naming preferences, formatting)
5. **For each finding**:
   - Cite the exact file and line number
   - Explain WHY it's a problem (not just what's wrong)
   - Provide a concrete fix with a code snippet
6. **Write a summary**: Overall assessment, number of findings by severity, recommendation (approve / request changes)

Be thorough but fair. Acknowledge good patterns and well-written code, not just problems.
```
