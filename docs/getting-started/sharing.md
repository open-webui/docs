---
sidebar_position: 15
title: "Share Open WebUI with Your Team"
sidebar_label: "Sharing Open WebUI"
description: "Give a team access to one Open WebUI instance, configure accounts and resource permissions, and verify access as a regular user."
---

# Share Open WebUI with Your Team {#sharing-open-webui}

Share one Open WebUI instance so your team can use connected models from their browsers. Configure network access, accounts, and permissions before inviting users.

Open WebUI is built to be shared. A single instance can serve your whole organization. Users just open a browser and start chatting. No per-seat installs, no client-side dependencies, no fragmented data across machines.

---

## Set up a small team

Start with an administrator account and a model endpoint the Open WebUI server can reach. A small team can begin with one instance; use the [scaling guide](/getting-started/advanced-topics/scaling) when your workload requires more capacity.

1. [Install Open WebUI](/getting-started/quick-start) and [connect a model](/getting-started/quick-start/connect-a-provider). Confirm that the administrator can send a message and receive an answer.
2. Choose a [network-access option](#opening-your-instance-to-the-team) below and check that a teammate can reach the login page. Use HTTPS for remote access.
3. [Approve user accounts](#the-pending-queue) or [configure SSO](/features/authentication-access/auth/sso) with your identity provider.
4. Create [groups](/features/authentication-access/rbac/groups) and grant access to the appropriate [models](/features/workspace/models) and [knowledge bases](/features/workspace/knowledge). Review [default and group permissions](/features/authentication-access/rbac/permissions) together: permissions are additive.
5. Sign in as a regular user and follow the [access checks](#verify-team-access) at the end of this page. An administrator's view does not prove that a teammate has the intended access.

Sharing an instance does not automatically share everyone's documents or conversations. Grant access to knowledge bases explicitly, and use [chat sharing](/features/chat-conversations/chat-features/chatshare) when you want to share a conversation snapshot.

## Built for Teams

### Streamlined Onboarding

End users don't need to install anything, manage Docker, or touch a terminal. They open a browser, navigate to your instance URL, and log in.

### Collaborative Intelligence

A shared instance means shared knowledge.

| | |
| :--- | :--- |
| **[Channels](/features/channels)** | Persistent spaces where your team and AI models work together in real time |
| **Shared Chats** | Send an exact conversation snapshot to a colleague. A share link is private to the users and groups you grant; instance-wide or no-sign-in links need the public-sharing and open-sharing chat permissions, which are off by default for non-admin users |
| **Global Prompts & Knowledge** | Build specialized agents and make them instantly available to everyone |

The share dialog can also upload a chat to the Open WebUI Community site. Turn off **Community Sharing** in Admin Panel > Settings > General (or set `ENABLE_COMMUNITY_SHARING=false` before the first start) to keep everything in-house.

### Shared Compute

When running local models, a single powerful server (or cluster) serves your entire team instead of requiring capable hardware on every desk.

### Centralized Administration

Manage everything from one place: control which models users can access, configure [**Role-Based Access Control (RBAC)**](/features/authentication-access/rbac), review audit logs, and restrict features as needed.

---

## Opening Your Instance to the Team

To share your instance, you need to make it accessible over a network. There are three common approaches, from simple local access to production-grade public domains.

### 1. Zero-Config LAN (Local Network)

If your team is on the same local network or VPN, they can reach Open WebUI using your machine's local IP address and port.

> `http://192.168.1.100:3000`

### 2. Secure Private Networks (Recommended)

For remote teams that don't need public internet exposure. Overlay networks and secure tunnels provide encrypted access without opening firewall ports.

| | |
| :--- | :--- |
| **[Tailscale](/reference/https/tailscale)** | Private mesh network with MagicDNS (`https://open-webui.tailnet-name.ts.net`) |
| **[Cloudflare Tunnels](/reference/https/cloudflare-tunnel)** | Expose via Cloudflare's edge, protected by Cloudflare Access (Zero Trust) |
| **[ngrok](/reference/https/ngrok)** | Quick temporary sharing for development or testing |

### 3. Public HTTPS (Reverse Proxy)

For production deployments, place Open WebUI behind a reverse proxy for SSL/TLS termination on your own domain (e.g., `ai.yourcompany.com`).

| | |
| :--- | :--- |
| **[Nginx](/reference/https/nginx)** | Industry standard web server and reverse proxy |
| **[Caddy](/reference/https/caddy)** | Automatic HTTPS with minimal configuration |
| **[HAProxy](/reference/https/haproxy)** | High-performance load balancing and proxying |

---

## Onboarding Your Team

Once your instance is network-accessible, you need to manage how users create accounts and log in.

### The Pending Queue

The first user to register becomes the **Administrator**. Creating that first account switches off **New Sign Ups** in Admin Panel > Settings > Authentication, so others can only register once an admin turns it back on. New accounts then wait in a **Pending** state, unable to access models or use the platform, until an admin approves them, unless **Default User Role** there is set to `user`. `DEFAULT_USER_ROLE` sets that value only on the first start (after that the saved setting wins), and `ENABLE_SIGNUP` is overwritten to off when the first account is created.

### Enterprise Single Sign-On (SSO)

For organizations where manual approval doesn't scale, Open WebUI integrates with your existing identity provider.

| | |
| :--- | :--- |
| **OAuth / OIDC** | Authenticate via **Google**, **Microsoft**, **Okta**, or **Keycloak** |
| **Group mapping** | Map IdP groups directly to Open WebUI groups |
| **[SCIM 2.0](/features/authentication-access/auth/scim)** | Automated user and group provisioning and deprovisioning |

[**Learn how to set up SSO →**](/features/authentication-access/auth/sso)

## Verify team access

Using a regular account in the intended group, check that:

- The permitted model is visible and answers a test message.
- The shared knowledge base is accessible and answers a question from a test document.
- A restricted model and a restricted knowledge base are unavailable to that account, including through a direct link.

Repeat with an account outside the group to confirm the restricted resources remain unavailable. Review [groups and resource access](/features/authentication-access/rbac/groups#resource-access-rbac) if either account sees more than intended.
