---
sidebar_position: 6
title: "📋 FAQ"
---

# 📋 Frequently Asked Questions

#### **Q: Why am I asked to sign up? Where are my data being sent to?**

**A:** We require you to sign up to become the admin user for enhanced security. This ensures that if the Open WebUI is ever exposed to external access, your data remains secure. It's important to note that everything is kept local. We do not collect your data. When you sign up, all information stays within your server and never leaves your device. Your privacy and security are our top priorities, ensuring that your data remains under your control at all times.

#### **Q: Why can't my Docker container connect to services on the host using `localhost`?**  

**A:** Inside a Docker container, `localhost` refers to the container itself, not the host machine. This distinction is crucial for networking. To establish a connection from your container to services running on the host, you should use the DNS name `host.docker.internal` instead of `localhost`. This DNS name is specially recognized by Docker to facilitate such connections, effectively treating the host as a reachable entity from within the container, thus bypassing the usual `localhost` scope limitation.

#### **Q: How do I make my host's services accessible to Docker containers?**  

**A:** To make services running on the host accessible to Docker containers, configure these services to listen on all network interfaces, using the IP address `0.0.0.0`, instead of `127.0.0.1` which is limited to `localhost` only. This configuration allows the services to accept connections from any IP address, including Docker containers. It's important to be aware of the security implications of this setup, especially when operating in environments with potential external access. Implementing appropriate security measures, such as firewalls and authentication, can help mitigate risks.

If you have any further questions or concerns, please don't hesitate to reach out! 🛡️
