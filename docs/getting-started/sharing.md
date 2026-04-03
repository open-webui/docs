---
sidebar_position: 15
title: "Sharing Open WebUI"
---

# Sharing Open WebUI

**Bring AI to your entire organization with a single deployment.**

Open WebUI isn't just a local interface for AI. It is designed to be a centralized AI operating system for teams. While single-user desktop apps require individual installations, license management, and siloed data, Open WebUI offers a much more powerful architecture: you deploy it once, and everyone benefits.

---

## Built for Teams

### Frictionless Onboarding

Your users don't need to install desktop client software, deal with Docker, or configure Python environments. They simply open a web browser, navigate to your Open WebUI instance URL, and start chatting.

### Collaborative Intelligence

When you share an Open WebUI instance, your collective knowledge grows. 
- [**Channels**](/features/channels) provide shared spaces where humans and AI tackle problems together in real time.
- **Shared Chats** let you send a exact conversation state to a colleague.
- **Global Prompts & Knowledge** mean an expert can build a specialized AI agent (like a "Code Reviewer" or "Legal Assistant") and make it instantly available to the entire team.

### Optimized Resources

Running local models requires expensive, high-end hardware for every employee. With Open WebUI, you run one powerful server (or cluster), allowing dozens of people to pool and share the compute resources efficiently.

### Centralized Security

Administrators manage everything from a single dashboard. You control exactly which models users can access, configure [**Role-Based Access Control (RBAC)**](/features/access-security/rbac), review audit logs, restrict features, and ensure sensitive data isn't leaking to public SaaS providers.

---

## Opening Your Instance to the Team

To share your Open WebUI instance, you need to make it accessible over a network. There are three common ways to do this, ranging from simple local-only access to robust public domains.

### 1. Zero-Config LAN (Local Network)

The simplest method. If your team is on the same local network or VPN, they can access Open WebUI using your machine's local IP address and port.

> `http://192.168.1.100:3000`

### 2. Secure Private Networks (Recommended)

If your team is remote but you don't want to expose your server to the public internet, use an overlay network or secure tunnel. This provides encrypted access without opening firewall ports.

- [**Tailscale**](/reference/https/tailscale): Creates a secure, private mesh network. With Tailscale MagicDNS, your team accesses the instance via a clean URL like `https://open-webui.tailnet-name.ts.net`.
- [**Cloudflare Tunnels**](/reference/https/cloudflare-tunnels): Securely connects your local server to Cloudflare's edge, exposing it via a public URL but protected by Cloudflare Access (Zero Trust).
- [**ngrok**](/reference/https/ngrok): Excellent for rapid, temporary sharing or development testing.

### 3. Public HTTPS (Reverse Proxy)

For standard enterprise deployments, you'll place Open WebUI behind a reverse proxy that handles incoming traffic and SSL/TLS certificates, exposing it on your company's domain (e.g., `ai.yourcompany.com`).

- [**Nginx**](/reference/https/nginx): The industry standard web server.
- [**Caddy**](/reference/https/caddy): Known for automatic, dead-simple HTTPS provisioning.
- [**HAProxy**](/reference/https/haproxy): High-performance load balancing and proxying.

---

## Onboarding Your Team

Once your instance is reachable by your team, you need to manage how they create accounts and log in.

### The Pending Queue

By default, the first user to register on a new Open WebUI installation becomes the **Administrator**. 

Any subsequent users who sign up will have their account placed in a **Pending** state. They cannot use the platform or access models until an Administrator goes to the Admin Panel and explicitly approves their account, changing their role to **User**.

### Enterprise Single Sign-On (SSO)

For larger organizations, manually approving accounts is tedious. Open WebUI supports seamless integration with your existing identity providers.

- Automatically log users in via **Google**, **Microsoft**, **Okta**, or **Keycloak**.
- Map IDP groups directly to Open WebUI groups.
- Sync user lifecycle states automatically using [**SCIM 2.0 provisioning**](/features/access-security/auth/scim).

[**Learn how to set up SSO →**](/features/access-security/auth/sso)
