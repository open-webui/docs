---
sidebar_position: 6
title: "Enabling HTTPS Encryption"
---

# Secure Your Open WebUI with HTTPS 🔒

While **HTTPS is not strictly required** for basic local operation, it is **highly recommended** for all deployments and **mandatory** for enabling specific features like Voice Calls.

:::warning Critical Feature Dependency
Modern browsers require a **Secure Context** (HTTPS) to access the microphone. 
**Voice Calls will NOT work** if you access Open WebUI via `http://` (unless using `localhost`).
:::

## Why HTTPS Matters 🛡️

Enabling HTTPS encryption provides essential benefits:

1.  **🔒 Privacy & Security**: Encrypts all data between the user and the server, protecting chat history and credentials.
2.  **🎤 Feature Unlocking**: Enables browser restrictions for Microphone (Voice Mode) and Camera access.
3.  **💪 Integrity**: Ensures data is not tampered with in transit.
4.  **✅ Trust**: Displays the padlock icon, reassuring users that the service is secure.

## Choosing Your Solution 🛠️

The best method depends on your infrastructure.

### 🏠 For Local/Docker Users
If you are running Open WebUI with Docker, the standard approach is to use a **Reverse Proxy**. This sits in front of Open WebUI and handles the SSL encryption.

*   **[Nginx](/tutorials/https/nginx)**: The industry standard. Highly configurable, great performance.
*   **[Caddy](/tutorials/https/caddy)**: **Easiest option**. Automatically obtains and renews Let's Encrypt certificates with minimal config.
*   **[HAProxy](/tutorials/https/haproxy)**: Robust choice for advanced load balancing needs.

### ☁️ For Cloud Deployments
*   **Cloud Load Balancers**: (AWS ALB, Google Cloud Load Balancing) often handle SSL termination natively.
*   **Cloudflare Tunnel**: Excellent for exposing localhost to the web securely without opening ports.

### 🧪 For Development
*   **Ngrok**: Good for quickly testing Voice features locally. *Not for production.*

## 📚 Implementation Guides

Ready to set it up? Check out our dedicated tutorial category for step-by-step configurations:

<div className="card-grid">

  <a className="card" href="/tutorials/https/nginx">
    <h3>Nginx Setup</h3>
    <p>Manual control and high performance.</p>
  </a>

  <a className="card" href="/tutorials/https/caddy">
    <h3>Caddy Setup</h3>
    <p>Zero-config automatic HTTPS.</p>
  </a>

  <a className="card" href="/tutorials/https/">
    <h3>📂 View All HTTPS Tutorials</h3>
    <p>Browse the full category of guides.</p>
  </a>

</div>
