---
sidebar_position: 5
title: "📋 FAQ"
---

# 📋 Frequently Asked Questions

### Table of Contents

- [Q:  Why am I asked to sign up? Where are my data being sent to?](#q-why-am-i-asked-to-sign-up-where-are-my-data-being-sent-to)
- [Q: Why can't my Docker container connect to services on the host using `localhost`?](#q-why-cant-my-docker-container-connect-to-services-on-the-host-using-localhost)
- [Q: How do I make my host's services accessible to Docker containers?](#q-how-do-i-make-my-hosts-services-accessible-to-docker-containers)
- [Q: Why isn't my Open WebUI updating? I've re-pulled/restarted the container, and nothing changed.](#q-why-isnt-my-open-webui-updating-ive-re-pulledrestarted-the-container-and-nothing-changed)
- [Q: Wait, delete my container, won't I lose my data?](#q-wait-delete-my-container-wont-i-lose-my-data)
- [Q: Should I use the distro-packaged Docker or the official Docker package?](#q-should-i-use-the-distro-packaged-docker-or-the-official-docker-package)
- [Q: Is GPU support available in Docker?](#q-is-gpu-support-available-in-docker)
- [Q: Why does the WebUI project emphasize the use of Docker?](#q-why-does-the-webui-project-emphasize-the-use-of-docker)
- [Q: Why doesn't STT/TTS work in my deployment?](#q-why-doesnt-stttts-work-in-my-deployment)
- [Q: Why doesn't the WebUI include HTTPS support built-in?](#q-why-doesnt-the-webui-include-https-support-built-in)
- [Q: I updated/restarted/installed some new software and now my WebUI isn't working anymore!](#q-i-updatedrestartedinstalled-some-new-software-and-now-my-webui-isnt-working-anymore)
- [Q: I updated/restarted and now my login isn't working anymore, I had to create a new account and all my chats are gone.](#q-i-updatedrestarted-and-now-my-login-isnt-working-anymore-i-had-to-create-a-new-account-and-all-my-chats-are-gone)
- [Q: I tried to login and couldn't, made a new account and now I'm being told my account needs to be activated by an admin.](#q-i-tried-to-login-and-couldnt-made-a-new-account-and-now-im-being-told-my-account-needs-to-be-activated-by-an-admin)
- [Q: Why does the WebUI project can't be started with ssl error?](#q-why-does-the-webui-project-cant-be-started-with-ssl-error)

#### **Q: Why am I asked to sign up? Where are my data being sent to?**

**A:** We require you to sign up to become the admin user for enhanced security. This ensures that if the Open WebUI is ever exposed to external access, your data remains secure. It's important to note that everything is kept local. We do not collect your data. When you sign up, all information stays within your server and never leaves your device. Your privacy and security are our top priorities, ensuring that your data remains under your control at all times.

#### **Q: Why can't my Docker container connect to services on the host using `localhost`?**  

**A:** Inside a Docker container, `localhost` refers to the container itself, not the host machine. This distinction is crucial for networking. To establish a connection from your container to services running on the host, you should use the DNS name `host.docker.internal` instead of `localhost`. This DNS name is specially recognized by Docker to facilitate such connections, effectively treating the host as a reachable entity from within the container, thus bypassing the usual `localhost` scope limitation.

#### **Q: How do I make my host's services accessible to Docker containers?**  

**A:** To make services running on the host accessible to Docker containers, configure these services to listen on all network interfaces, using the IP address `0.0.0.0`, instead of `127.0.0.1` which is limited to `localhost` only. This configuration allows the services to accept connections from any IP address, including Docker containers. It's important to be aware of the security implications of this setup, especially when operating in environments with potential external access. Implementing appropriate security measures, such as firewalls and authentication, can help mitigate risks.

#### **Q: Why isn't my Open WebUI updating? I've re-pulled/restarted the container, and nothing changed.**

**A:** Updating Open WebUI requires more than just pulling the new Docker image. Here’s why your updates might not be showing and how to ensure they do:

1. **Updating the Docker Image**: The command `docker pull ghcr.io/open-webui/open-webui:main` updates the Docker image but not the running container or its data.
2. **Persistent Data in Docker Volumes**: Docker volumes store data independently of container lifecycles, preserving your data (like chat histories) through updates.
3. **Applying the Update**: Ensure your update takes effect by removing the existing container (which doesn't delete the volume) and creating a new one with the updated image and existing volume attached.

This process updates the app while keeping your data safe.

#### **Q: Wait, delete my container, won't I lose my data?**

**A:** It's a common concern, but deleting a container doesn't mean you'll lose your data, provided you're using Docker volumes correctly. Here’s why:

- **Volumes Preserve Data**: Docker volumes are designed to persist data outside of container lifecycles. As long as your data is stored in a volume, it remains intact, regardless of what happens to the container.
- **Safe Update Process**: When updating Open WebUI, removing the old container and creating a new one with the updated image does not affect the data stored in volumes. The key is not to explicitly delete the volume with commands like `docker volume rm`.

By following the correct update steps—pulling the new image, removing the old container without deleting the volume, and creating a new container with the updated image and the existing volume—your application code is updated while your data remains unchanged and safe.

#### **Q: Should I use the distro-packaged Docker or the official Docker package?**

**A:** We recommend using the official Docker package over distro-packaged versions for running Open WebUI. The official Docker package is frequently updated with the latest features, bug fixes, and security patches, ensuring optimal performance and security. Additionally, it supports important functionalities like `host.docker.internal`, which may not be available in distro-packaged versions. This feature is essential for proper network configurations and connectivity within Docker containers.

By choosing the official Docker package, you benefit from consistent behavior across different environments, more reliable troubleshooting support, and access to the latest Docker advancements. The broader Docker community and resources are also more aligned with the official package, providing you with a wealth of information and support for any issues you might encounter.

Everything you need to run Open WebUI, including your data, remains within your control and your server environment, emphasizing our commitment to your privacy and security. For instructions on installing the official Docker package, please refer to the [Install Docker Engine](https://docs.docker.com/engine/install/) guide on Docker's official documentation site.

#### **Q: Is GPU support available in Docker?**

**A:** GPU support in Docker is available but varies depending on the platform. Officially, GPU support is provided in Docker for Windows and Docker Engine on Linux. Other platforms, such as Docker Desktop for Linux and MacOS, do not currently offer GPU support. This limitation is important to consider for applications requiring GPU acceleration. For the best experience and to utilize GPU capabilities, we recommend using Docker on platforms that officially support GPU integration.

#### **Q: Why does the WebUI project emphasize the use of Docker?**

**A:** The decision to use Docker stems from its ability to ensure consistency, isolate dependencies, and simplify deployment across different environments. Docker minimizes compatibility issues and streamlines the process of getting the WebUI up and running, regardless of the underlying system. It's a strategic choice by the project maintainers to harness these benefits, acknowledging that while Docker has a learning curve, the advantages for deployment and maintenance are significant. We understand Docker might not be everyone's preference; however, this approach is central to our project's design and operational efficiency. We view the project's commitment to Docker as a fundamental aspect and encourage those looking for different deployment methods to explore community-driven alternatives.

#### **Q: Why doesn't STT/TTS work in my deployment?**

**A:** The functionality of Speech-to-Text (STT) and Text-to-Speech (TTS) services in your deployment may require HTTPS to operate correctly. Modern browsers enforce security measures that restrict certain features, including STT and TTS, to only work under secure HTTPS connections. If your deployment is not configured to use HTTPS, these services might not function as expected. Ensuring your deployment is accessible over HTTPS can resolve these issues, enabling full functionality of STT/TTS features.

#### **Q: Why doesn't the WebUI include HTTPS support built-in?**

**A:** While we understand the desire for an all-in-one solution that includes HTTPS support, we believe such an approach wouldn't adequately serve the diverse needs of our user base. Implementing HTTPS directly within the project could limit flexibility and may not align with the specific requirements or preferences of all users. To ensure that everyone can tailor their setup to their unique environment, we leave the implementation of HTTPS termination to the users for their production deployments. This decision allows for greater adaptability and customization. Though we don't offer official documentation on setting up HTTPS, community members may provide guidance upon request, sharing insights and suggestions based on their experiences.

#### **Q: I updated/restarted/installed some new software and now my WebUI isn't working anymore!**

**A:** If your Open WebUI isn't launching post-update or installation of new software, it's likely related to a direct installation approach, especially if you didn't use a virtual environment for your backend dependencies. Direct installations can be sensitive to changes in the system's environment, such as updates or new installations that alter existing dependencies. To avoid conflicts and ensure stability, we recommend using a virtual environment for managing the `requirements.txt` dependencies of your backend. This isolates your Open WebUI dependencies from other system packages, minimizing the risk of such issues.

#### **Q: I updated/restarted and now my login isn't working anymore, I had to create a new account and all my chats are gone.**

**A:** This issue typically arises when a Docker container is created without mounting a volume for `/app/backend/data` or if the designated Open WebUI volume (usually named `open-webui` in our examples) was unintentionally deleted. Docker volumes are crucial for persisting your data across container lifecycles. If you find yourself needing to create a new account after a restart, it's likely you've initiated a new container without attaching the existing volume where your data resides. Ensure that your Docker run command includes a volume mount pointing to the correct data location to prevent data loss.

#### **Q: I tried to login and couldn't, made a new account and now I'm being told my account needs to be activated by an admin.**

**A:** This situation occurs when you forget the password for the initial admin account created during the first setup. The first account is automatically designated as the admin account. Creating a new account without access to the admin account will result in the need for admin activation. Avoiding the loss of the initial admin account credentials is crucial for seamless access and management of Open WebUI. See the [Resetting the Admin Password](getting-started/troubleshooting#reset-admin-password) guide for instructions on recovering the admin account.

#### **Q: Why does the WebUI project can't be started with ssl error?**

**A:** The SSL error you're encountering when starting the WebUI project is likely due to the absence of SSL certificates or incorrect configuration of [huggingface.co](https://huggingface.co/). To resolve this issue, you could set up a mirror for huggingface, such as [hf-mirror.com](https://hf-mirror.com/), and specify it as the endpoint when starting the Docker container. Use the `-e HF_ENDPOINT=https://hf-mirror.com/` parameter to define the huggingface mirror address in the Docker run command. For example, you can modify the Docker run command as follows:

```bash
docker run -d -p 3000:8080 -e HF_ENDPOINT=https://hf-mirror.com/ --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

#### If you have any further questions or concerns, please out our [GitHub Issues page](https://github.com/open-webui/open-webui/issues) or our [Discord channel](https://discord.gg/5rJgQTnV4s) for more help and information.
