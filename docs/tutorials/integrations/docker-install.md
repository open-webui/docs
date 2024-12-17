---
sidebar_position: 2
title: Installing Docker
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# Installing Docker

## For Windows and Mac Users

- Download Docker Desktop from [Docker's official website](https://www.docker.com/products/docker-desktop).  
- Follow the installation instructions on the website.  
- After installation, **open Docker Desktop** to ensure it's running properly.

---

## For Ubuntu Users

1. **Open your terminal.**

2. **Set up Docker’s apt repository:**

   ```bash
   sudo apt-get update
   sudo apt-get install ca-certificates curl
   sudo install -m 0755 -d /etc/apt/keyrings
   sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
   sudo chmod a+r /etc/apt/keyrings/docker.asc
   echo \
     "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
     $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
     sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   ```

:::note
If using an **Ubuntu derivative** (e.g., Linux Mint), use `UBUNTU_CODENAME` instead of `VERSION_CODENAME`.
:::

3. **Install Docker Engine:**

   ```bash
   sudo apt-get update
   sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
   ```

4. **Verify Docker Installation:**

   ```bash
   sudo docker run hello-world
   ```

---

## For Other Linux Distributions

For other Linux distributions, refer to the [official Docker documentation](https://docs.docker.com/engine/install/).

---

## Install and Verify Ollama

1. **Download Ollama** from [https://ollama.com/](https://ollama.com/).

2. **Verify Ollama Installation:**
   - Open a browser and navigate to:
     [http://127.0.0.1:11434/](http://127.0.0.1:11434/).
   - Note: The port may vary based on your installation.
