---
sidebar_position: 0
title: "身份验证与 SSO"
---

# 身份验证与 SSO 教程

**将 Open WebUI 连接到你的身份提供方，实现单点登录、LDAP 和组同步。**

这些社区贡献的指南逐步介绍实际的身份验证设置。有关官方 SSO 配置参考，请参阅 [SSO（OAuth、OIDC、可信标头）](/features/authentication-access/auth/sso)。

---

| 教程 | 你将实现的目标 | 受众 |
|----------|-------------------|----------|
| [Okta SSO（OIDC）](/tutorials/auth-sso/okta-oidc-sso) | 使用 Okta 实现单点登录，可选组同步和 MFA | 管理员 · 30 分钟 |
| [Azure AD LDAP](/tutorials/auth-sso/azure-ad-ds-ldap) | 通过 Azure AD Domain Services 实现安全 LDAP 身份验证 | 管理员 · 45 分钟 |
| [双 OAuth 设置](/tutorials/auth-sso/dual-oauth-configuration) | 同时运行 Microsoft 和 Google OAuth | 管理员 · 15 分钟 |
| [Entra ID 组名称同步](/tutorials/auth-sso/entra-group-name-sync) | 从 Microsoft Entra 获取人类可读的组名称，而不是 GUID | 管理员 · 30 分钟 |
| [Tailscale](/tutorials/auth-sso/tailscale) | 通过 Tailscale Serve 实现 HTTPS 和 SSO，并通过 Funnel 建立安全隧道 | 管理员 · 20 分钟 |
