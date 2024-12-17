---
sidebar_position: 6
title: "🔒HTTPS Encryption"
---

## Overview

While HTTPS encryption is **not required** to operate Open WebUI in most cases, certain features—such as **Voice Calls**—will be blocked by modern web browsers unless HTTPS is enabled. If you do not plan to use these features, you can skip this section.

## Importance of HTTPS

For deployments at high risk of traffic interception, such as those hosted on the internet, it is recommended to implement HTTPS encryption. This ensures that the username/password signup and authentication process remains secure, protecting sensitive user data from potential threats.

## Choosing Your HTTPS Solution

The choice of HTTPS encryption solution is up to the user and should align with the existing infrastructure. Here are some common scenarios:

- **AWS Environments**: Utilizing an AWS Elastic Load Balancer is often a practical choice for managing HTTPS.
- **Docker Container Environments**: Popular solutions include Nginx, Traefik, and Caddy.
- **Cloudflare**: Offers easy HTTPS setup with minimal server-side configuration, suitable for a wide range of applications.
- **Ngrok**: Provides a quick way to set up HTTPS for local development environments, particularly useful for testing and demos.

## Further Guidance

For detailed instructions and community-submitted tutorials on actual HTTPS encryption deployments, please refer to the [Deployment Tutorials](../../tutorials/deployment/).

This documentation provides a starting point for understanding the options available for enabling HTTPS encryption in your environment.
