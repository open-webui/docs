---
sidebar_position: 0
slug: /
title: 🏡 Home
hide_title: true
---

# Open WebUI

**Open WebUI is an extensible, feature-rich, and user-friendly self-hosted WebUI for various LLM runners**, supported LLM runners include Ollama and OpenAI-compatible APIs.

![GitHub stars](https://img.shields.io/github/stars/open-webui/open-webui?style=social)
![GitHub forks](https://img.shields.io/github/forks/open-webui/open-webui?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/open-webui/open-webui?style=social)
![GitHub repo size](https://img.shields.io/github/repo-size/open-webui/open-webui)
![GitHub language count](https://img.shields.io/github/languages/count/open-webui/open-webui)
![GitHub top language](https://img.shields.io/github/languages/top/open-webui/open-webui)
![GitHub last commit](https://img.shields.io/github/last-commit/open-webui/open-webui?color=red)
![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Follama-webui%2Follama-wbui&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)
[![Discord](https://img.shields.io/badge/Discord-Open_WebUI-blue?logo=discord&logoColor=white)](https://discord.gg/5rJgQTnV4s)
[![](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](https://github.com/sponsors/tjbck)

![Open WebUI Demo](/img/demo.gif)

## Features ⭐

- 🖥️ **Intuitive Interface**: Our chat interface takes inspiration from ChatGPT, ensuring a user-friendly experience.
- 📱 **Responsive Design**: Enjoy a seamless experience on both desktop and mobile devices.
- ⚡ **Swift Responsiveness**: Enjoy fast and responsive performance.
- 🚀 **Effortless Setup**: Install seamlessly using Docker or Kubernetes (kubectl, kustomize or helm) for a hassle-free experience.
- 💻 **Code Syntax Highlighting**: Enjoy enhanced code readability with our syntax highlighting feature.
- ✒️🔢 **Full Markdown and LaTeX Support**: Elevate your LLM experience with comprehensive Markdown and LaTeX capabilities for enriched interaction.
- 📚 **Local RAG Integration**: Dive into the future of chat interactions with the groundbreaking Retrieval Augmented Generation (RAG) support. This feature seamlessly integrates document interactions into your chat experience. You can load documents directly into the chat or add files to your document library, effortlessly accessing them using `#` command in the prompt. In its alpha phase, occasional issues may arise as we actively refine and enhance this feature to ensure optimal performance and reliability.
- 🌐 **Web Browsing Capability**: Seamlessly integrate websites into your chat experience using the `#` command followed by the URL. This feature allows you to incorporate web content directly into your conversations, enhancing the richness and depth of your interactions.
- 📜 **Prompt Preset Support**: Instantly access preset prompts using the `/` command in the chat input. Load predefined conversation starters effortlessly and expedite your interactions. Effortlessly import prompts through [Open WebUI Community](https://openwebui.com/) integration.
- 👍👎 **RLHF Annotation**: Empower your messages by rating them with thumbs up and thumbs down, facilitating the creation of datasets for Reinforcement Learning from Human Feedback (RLHF). Utilize your messages to train or fine-tune models, all while ensuring the confidentiality of locally saved data.
- 🏷️ **Conversation Tagging**: Effortlessly categorize and locate specific chats for quick reference and streamlined data collection.
- 📥🗑️ **Download/Delete Models**: Easily download or remove models directly from the web UI.
- ⬆️ **GGUF File Model Creation**: Effortlessly create Ollama models by uploading GGUF files directly from the web UI. Streamlined process with options to upload from your machine or download GGUF files from Hugging Face.
- 🤖 **Multiple Model Support**: Seamlessly switch between different chat models for diverse interactions.
- 🔄 **Multi-Modal Support**: Seamlessly engage with models that support multimodal interactions, including images (e.g., LLava).
- 🧩 **Modelfile Builder**: Easily create Ollama modelfiles via the web UI. Create and add characters/agents, customize chat elements, and import modelfiles effortlessly through [Open WebUI Community](https://openwebui.com/) integration.
- ⚙️ **Many Models Conversations**: Effortlessly engage with various models simultaneously, harnessing their unique strengths for optimal responses. Enhance your experience by leveraging a diverse set of models in parallel.
- 💬 **Collaborative Chat**: Harness the collective intelligence of multiple models by seamlessly orchestrating group conversations. Use the `@` command to specify the model, enabling dynamic and diverse dialogues within your chat interface. Immerse yourself in the collective intelligence woven into your chat environment.
- 🤝 **OpenAI API Integration**: Effortlessly integrate OpenAI-compatible API for versatile conversations alongside Ollama models. Customize the API Base URL to link with **LMStudio, Mistral, OpenRouter, and more**.
- 🔄 **Regeneration History Access**: Easily revisit and explore your entire regeneration history.
- 📜 **Chat History**: Effortlessly access and manage your conversation history.
- 📤📥 **Import/Export Chat History**: Seamlessly move your chat data in and out of the platform.
- 🗣️ **Voice Input Support**: Engage with your model through voice interactions; enjoy the convenience of talking to your model directly. Additionally, explore the option for sending voice input automatically after 3 seconds of silence for a streamlined experience.
- ⚙️ **Fine-Tuned Control with Advanced Parameters**: Gain a deeper level of control by adjusting parameters such as temperature and defining your system prompts to tailor the conversation to your specific preferences and needs.
- 🔗 **External Ollama Server Connection**: Seamlessly link to an external Ollama server hosted on a different address by configuring the environment variable.
- 🔐 **Role-Based Access Control (RBAC)**: Ensure secure access with restricted permissions; only authorized individuals can access your Ollama, and exclusive model creation/pulling rights are reserved for administrators.
- 🔒 **Backend Reverse Proxy Support**: Bolster security through direct communication between Open WebUI backend and Ollama. This key feature eliminates the need to expose Ollama over LAN. Requests made to the '/ollama/api' route from the web UI are seamlessly redirected to Ollama from the backend, enhancing overall system security.
- 🌟 **Continuous Updates**: We are committed to improving Open WebUI with regular updates and new features.

### 🔗 Also Check Out Open WebUI Community!

Don't forget to explore our sibling project, [Open WebUI Community](https://openwebui.com/), where you can discover, download, and explore customized Modelfiles. Open WebUI Community offers a wide range of exciting possibilities for enhancing your chat interactions with Ollama! 🚀

## Installing with Docker 🐳

- **If Ollama is on your computer**, use this command:

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- After installation, you can access Open WebUI at [http://localhost:3000](http://localhost:3000).

#### Using Ollama on a Different Server

- To connect to Ollama on another server, change the `OLLAMA_API_BASE_URL` to the server's URL:

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_API_BASE_URL=https://example.com/api -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

## Installing with Podman
<details>
<summary>Rootless (Podman) local-only Open WebUI with Systemd service and auto-update</summary>

- **Important:** Consult the Docker documentation because much of the configuration and syntax is interchangeable with [Podman](https://github.com/containers/podman). See also [rootless_tutorial](https://github.com/containers/podman/blob/main/docs/tutorials/rootless_tutorial.md). This example requires the [slirp4netns](https://github.com/rootless-containers/slirp4netns) network backend to facilitate server listen and Ollama communication over localhost only.

1. Pull the latest image:
   ```bash
   podman pull ghcr.io/open-webui/open-webui:main
   ```
2. Create a new container using desired configuration:

   **Note:** `-p 127.0.0.1:3000:8080` ensures that we listen only on localhost, `--network slirp4netns:allow_host_loopback=true` permits the container to access Ollama when it also listens strictly on localhost. `--add-host=ollama.local:10.0.2.2 --env 'OLLAMA_API_BASE_URL=http://ollama.local:11434/api'` adds a hosts record to the container and configures open-webui to use the friendly hostname. `10.0.2.2` is the default slirp4netns address used for localhost mapping. `--env 'ANONYMIZED_TELEMETRY=False'` isn't necessary since Chroma telemetry has been disabled in the code but is included as an example.
   ```bash
   podman create -p 127.0.0.1:3000:8080 --network slirp4netns:allow_host_loopback=true --add-host=ollama.local:10.0.2.2 --env 'OLLAMA_API_BASE_URL=http://ollama.local:11434/api' --env 'ANONYMIZED_TELEMETRY=False' -v open-webui:/app/backend/data --label io.containers.autoupdate=registry --name open-webui ghcr.io/open-webui/open-webui:main
   ```
4. Prepare for systemd user service:
   ```bash
   mkdir -p ~/.config/systemd/user/
   ```
5. Generate user service with Podman:
   ```bash
   podman generate systemd --new open-webui > ~/.config/systemd/user/open-webui.service
   ```
6. Reload systemd configuration:
   ```bash
   systemctl --user daemon-reload
   ```
7. Enable and validate new service:
   ```bash
   systemctl --user enable open-webui.service
   systemctl --user start open-webui.service
   systemctl --user status open-webui.service
   ```
8. Enable and validate Podman auto-update:
   ```bash
   systemctl --user enable podman-auto-update.timer
   systemctl --user enable podman-auto-update.service
   systemctl --user status podman-auto-update.timer
   ```
   Dry run with the following command (omit `--dry-run` to force an update):
   ```bash
   podman auto-update --dry-run
   ```

</details>

## Troubleshooting

If you're facing various issues like "Open WebUI: Server Connection Error", see [TROUBLESHOOTING](/getting-started/troubleshooting) for information on how to troubleshoot and/or join our [Open WebUI Discord community](https://discord.gg/5rJgQTnV4s).

Continue with the full [getting started guide](/getting-started).
