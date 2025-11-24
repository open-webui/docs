---
sidebar_position: 200
title: "HTTPS using Nginx"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

# HTTPS using Nginx

Ensuring secure communication between your users and the Open WebUI is paramount. HTTPS (HyperText Transfer Protocol Secure) encrypts the data transmitted, protecting it from eavesdroppers and tampering. By configuring Nginx as a reverse proxy, you can seamlessly add HTTPS to your Open WebUI deployment, enhancing both security and trustworthiness.

This guide provides three methods to set up HTTPS:

- **Self-Signed Certificates**: Ideal for development and internal use, using docker.
- **Let's Encrypt**: Perfect for production environments requiring trusted SSL certificates, using docker.
- **Windows+Self-Signed**: Simplified instructions for development and internal use on windows, no docker required.

:::danger Critical: Configure CORS for WebSocket Connections

A very common and difficult-to-debug issue with WebSocket connections is a misconfigured Cross-Origin Resource Sharing (CORS) policy. When running Open WebUI behind a reverse proxy like Nginx Proxy Manager, you **must** set the `CORS_ALLOW_ORIGIN` environment variable in your Open WebUI configuration.

Failure to do so will cause WebSocket connections to fail, even if you have enabled "Websockets support" in Nginx Proxy Manager.

:::

Choose the method that best fits your deployment needs.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import NginxProxyManager from '../tab-nginx/NginxProxyManager.md';
import SelfSigned from '../tab-nginx/SelfSigned.md';
import LetsEncrypt from '../tab-nginx/LetsEncrypt.md';
import Windows from '../tab-nginx/Windows.md';

<!-- markdownlint-disable-next-line MD033 -->
<Tabs>
  <TabItem value="NginxProxyManager" label="Nginx Proxy Manager">
    <NginxProxyManager />
  </TabItem>
  <TabItem value="letsencrypt" label="Let's Encrypt">
    <LetsEncrypt />
  </TabItem>
  <TabItem value="selfsigned" label="Self-Signed">
    <SelfSigned />
  </TabItem>
  <TabItem value="windows" label="Windows">
    <Windows />
  </TabItem>
</Tabs>

## Next Steps

After setting up HTTPS, access Open WebUI securely at:

- [https://localhost](https://localhost)

Ensure that your DNS records are correctly configured if you're using a domain name. For production environments, it's recommended to use Let's Encrypt for trusted SSL certificates.

---
