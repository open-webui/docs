---
title: HTTPS using Nginx
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# HTTPS using Nginx

Ensuring secure communication between your users and the Open WebUI is paramount. HTTPS (HyperText Transfer Protocol Secure) encrypts the data transmitted, protecting it from eavesdroppers and tampering. By configuring Nginx as a reverse proxy, you can seamlessly add HTTPS to your Open WebUI deployment, enhancing both security and trustworthiness.

This guide provides two methods to set up HTTPS:

- **Self-Signed Certificates**: Ideal for development and internal use.
- **Let's Encrypt**: Perfect for production environments requiring trusted SSL certificates.

Choose the method that best fits your deployment needs.

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import SelfSigned from './tab-nginx/SelfSigned.md';
import LetsEncrypt from './tab-nginx/LetsEncrypt.md';

<Tabs>
  <TabItem value="self-signed" label="Self-Signed Certificate">
    <SelfSigned />
  </TabItem>

  <TabItem value="letsencrypt" label="Let's Encrypt">
    <LetsEncrypt />
  </TabItem>
</Tabs>

## Next Steps

After setting up HTTPS, access Open WebUI securely at:

- [https://localhost](https://localhost)

Ensure that your DNS records are correctly configured if you're using a domain name. For production environments, it's recommended to use Let's Encrypt for trusted SSL certificates.

---
