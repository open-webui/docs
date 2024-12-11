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
import CustomizeSplashLocal from './tab-nginx/CustomizeSplashLocal.md';
import CustomizeSplashExternal from './tab-nginx/CustomizeSplashExternal.md';

<Tabs>
  <TabItem value="self-signed" label="Self-Signed Certificate">
    <SelfSigned />
  </TabItem>

  <TabItem value="letsencrypt" label="Let's Encrypt">
    <LetsEncrypt />
  </TabItem>
</Tabs>

## Additional Tips

### Increase Upload Size

To allow users to upload larger files to OpenWebUI, increase the default upload size limit in your Nginx configuration:

```nginx
client_max_body_size 20M;  # Increase upload size limit to 20MB
```

Add this directive inside your `server` block, above the `location /` block.

## Customize Splash Screen and Favicon

Override the default splash screen and favicon by configuring Nginx to serve custom files. Choose one of the following methods:

<Tabs>
  <TabItem value="local" label="Host Locally">
    <CustomizeSplashLocal />
  </TabItem>

  <TabItem value="external" label="Host Externally">
    <CustomizeSplashExternal />
  </TabItem>
</Tabs>

## Applying Changes

To apply any changes made to the Nginx configuration, follow these steps:

```bash
sudo systemctl reload nginx  # If running Nginx directly
```

Or, if using Docker Compose:

```bash
docker compose restart nginx
```

### Access the WebUI

After reloading Nginx, your custom splash screen and favicon will be served from the external website:

- [https://your_domain_or_IP](https://your_domain_or_IP)

---
