:::info Python version compatibility
Open WebUI supports **Python 3.11 and 3.12**. **Python 3.13 is not supported yet** — a handful of our dependencies still need to ship 3.13-compatible releases, and until they do, installs on 3.13 will fail or break at runtime.

- **For production**, run the **Docker image** or use the **latest Python 3.11**. This is the combination we test against most heavily.
- **Python 3.12 also works**, but we have seen very rare reports of odd behaviour on 3.12 that we have not reproduced on 3.11. If something inexplicable happens on 3.12, drop to the latest 3.11 first.
:::
