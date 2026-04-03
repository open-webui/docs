---
sidebar_position: 0
title: "Tutorials"
---

# 🎓 Tutorials

**Step-by-step guides for real-world scenarios, contributed by the Open WebUI community.**

These tutorials walk through specific tasks — connecting identity providers, integrating developer tools, managing deployments, and more. Each guide covers a practical scenario you can follow from start to finish.

:::tip Where should I start?
If you're looking for **initial setup**, see [Getting Started](/getting-started). For **feature documentation**, see [Features](/features). Tutorials are for when you already have Open WebUI running and want to **do more with it**.
:::

---

## Authentication & SSO

Configure single sign-on, LDAP, and identity federation.

| Tutorial | What you'll achieve | Details |
|----------|-------------------|---------|
| [Okta SSO (OIDC)](/tutorials/auth-sso/okta-oidc-sso) | Single sign-on with Okta, optional group sync and MFA | 👤 Admin · ⏱️ 30 min |
| [Azure AD LDAP](/tutorials/auth-sso/azure-ad-ds-ldap) | Secure LDAP authentication against Azure AD Domain Services | 👤 Admin · ⏱️ 45 min |
| [Dual OAuth Setup](/tutorials/auth-sso/dual-oauth-configuration) | Microsoft and Google OAuth running simultaneously | 👤 Admin · ⏱️ 15 min |
| [Entra ID Group Name Sync](/tutorials/auth-sso/entra-group-name-sync) | Human-readable group names from Microsoft Entra | 👤 Admin · ⏱️ 30 min |
| [Tailscale](/tutorials/auth-sso/tailscale) | HTTPS and SSO via Tailscale Serve, plus Funnel tunnels | 👤 Admin · ⏱️ 20 min |

[Browse all Authentication & SSO tutorials →](/tutorials/auth-sso)

---

## Integrations

Connect Open WebUI to LLM providers, monitoring platforms, developer tools, and external services.

| Tutorial | What you'll achieve | Details |
|----------|-------------------|---------|
| [Azure OpenAI (Entra ID)](/tutorials/integrations/llm-providers/azure-openai) | Keyless authentication to Azure OpenAI | 👤 Admin · ⏱️ 30–60 min |
| [DeepSeek R1 Dynamic](/tutorials/integrations/llm-providers/deepseekr1-dynamic) | Run the full 671B DeepSeek-R1 via llama.cpp | 👤 Developer · ⏱️ 45 min |
| [Intel GPU (IPEX-LLM)](/tutorials/integrations/llm-providers/ipex_llm) | Accelerate Ollama on Intel GPUs | 👤 Developer · ⏱️ 20 min |
| [Helicone](/tutorials/integrations/monitoring/helicone) | Monitor LLM API calls, costs, and latency | 👤 Admin · ⏱️ 15 min |
| [Langfuse](/tutorials/integrations/monitoring/langfuse) | Trace LLM usage and evaluate prompt quality | 👤 Admin · ⏱️ 20 min · ⚠️ Outdated |
| [Continue.dev](/tutorials/integrations/dev-tools/continue-dev) | Use Open WebUI as a VS Code backend | 👤 Developer · ⏱️ 15 min |
| [Jupyter Notebooks](/tutorials/integrations/dev-tools/jupyter) | Code interpreter with Jupyter integration | 👤 Developer · ⏱️ 20 min |
| [iTerm2](/tutorials/integrations/dev-tools/iterm2) | Query models from your macOS terminal | 👤 Developer · ⏱️ 10 min |
| [Firefox Sidebar](/tutorials/integrations/dev-tools/firefox-sidebar) | Pin Open WebUI in Firefox's AI sidebar | 👤 User · ⏱️ 5 min |
| [Browser Search Engine](/tutorials/integrations/dev-tools/browser-search-engine) | Add Open WebUI as a browser search engine | 👤 User · ⏱️ 5 min |
| [Notion (MCP)](/tutorials/integrations/mcp-notion) | Connect Notion via Model Context Protocol | 👤 User · ⏱️ 20 min |
| [OneDrive & SharePoint](/tutorials/integrations/onedrive-sharepoint) | Pull Microsoft 365 documents into Open WebUI | 👤 Admin · ⏱️ 30 min |
| [LibreTranslate](/tutorials/integrations/libre-translate) | Add self-hosted translation capabilities | 👤 Admin · ⏱️ 15 min |

[Browse all integration tutorials →](/tutorials/integrations)

---

## Maintenance

Keep your deployment healthy — backups, storage, offline mode, and database management.

| Tutorial | What you'll achieve | Details |
|----------|-------------------|---------|
| [Backups](/tutorials/maintenance/backups) | Back up and restore all Open WebUI data | 👤 Admin · ⏱️ 15 min |
| [Database Management](/tutorials/maintenance/database) | Manage, migrate, and troubleshoot the database | 👤 Admin · ⏱️ 20 min |
| [Offline Mode](/tutorials/maintenance/offline-mode) | Run Open WebUI without internet access | 👤 Admin · ⏱️ 30 min |
| [S3 Storage](/tutorials/maintenance/s3-storage) | Store uploads in S3-compatible object storage | 👤 Admin · ⏱️ 20 min |

[Browse all maintenance tutorials →](/tutorials/maintenance)

---

## More

| Page | Description |
|------|------------|
| [Contributing to Docs](/tutorials/contributing-tutorial) | Set up a fork, draft a tutorial, and submit a PR to the docs repo |
| [Community Guides & Videos →](/tutorials/community) | Deployment tutorials, reviews, and walkthroughs from the community |
