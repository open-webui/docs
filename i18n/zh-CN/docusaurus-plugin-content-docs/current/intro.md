---
sidebar_position: 0
slug: /
# title: 🏡 Home
title: 🏡 Open WebUI 介绍
hide_title: true
---

# Open WebUI

**Open WebUI 是一个可扩展、功能丰富且用户友好的自托管 WebUI，完全离线运行。** 它支持各种 LLM 运行器，包括 Ollama 和兼容 OpenAI 的 API。

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

## 特性

- 🖥️ **直观的界面**：我们的聊天界面受到 ChatGPT 的启发，确保用户友好的体验。
- 📱 **响应式设计**：在桌面和移动设备上都能无缝体验。
- ⚡ **快速响应**：享受快速和响应性能。
- 🚀 **轻松设置**：使用 Docker 或 Kubernetes（kubectl、kustomize 或 helm）无缝安装，无需繁琐的操作。
- 💻 **代码语法高亮**：通过语法高亮功能提高代码可读性。
- ✒️🔢 **完整的 Markdown 和 LaTeX 支持**：通过全面的 Markdown 和 LaTeX 功能提升 LLM 体验，实现丰富的交互。
- 📚🌐 **[本地和远程 RAG 集成](tutorial/rag)**：通过具有突破性的检索增强生成（RAG）支持，探索聊天交互的未来。通过在聊天输入中以 `#` 开头的方式无缝集成本地和基于 Web 的内容到您的聊天中。此功能仍处于 Alpha 阶段，偶尔可能会出现问题！
- 📜 **提示预设支持**：通过聊天输入中的 `/` 命令即可立即访问预设提示。轻松加载预定义的对话启动器，加快您的交互速度。通过 [Open WebUI Community](https://openwebui.com/) 集成轻松导入提示。
- 👍👎 **RLHF 注释**：通过用大拇指向上和向下评分来增强您的消息，从而为人类反馈强化学习（RLHF）的数据集创建提供支持。利用您的消息来训练或微调模型，同时确保本地保存的数据的机密性。
- 🏷️ **对话标记**：轻松分类和定位特定的聊天，以便快速参考和简化数据收集。
- 📥🗑️ **下载/删除模型**：直接从 Web UI 轻松下载或删除模型。
- ⬆️ **GGUF 文件模型创建**：通过直接从 Web UI 上传 GGUF 文件轻松创建 Ollama 模型。通过从 Hugging Face 下载 GGUF 文件的选项简化流程。
- 🤖 **多模型支持**：在不同的聊天模型之间无缝切换，进行多样化的交互。
- 🔄 **多模态支持**：无缝地与支持多模态交互的模型进行交互，包括图像（例如 LLava）。
- 🧩 **模型文件生成器**：通过 Web UI 轻松创建 Ollama 模型文件。通过 [Open WebUI Community](https://openwebui.com/) 集成轻松创建和添加角色/代理、自定义聊天元素，并导入模型文件。
- ⚙️ **多模型对话**：轻松与多个模型同时交互，利用其独特的优势获得最佳响应。通过并行使用多种模型增强您的体验。
- 💬 **协作聊天**：通过无缝协调群组对话，利用多个模型的集体智慧。使用 `@` 命令指定模型，为您的聊天界面提供动态和多样化的对话。沉浸在编织到您的聊天环境中的集体智慧中。
- 🔄 **再生成历史访问**：轻松查看和探索您的整个再生成历史。
- 📜 **聊天历史**：轻松访问和管理您的对话历史。
- 📤📥 **导入/导出聊天历史**：轻松将您的聊天数据移入和移出平台。
- 🗣️ **语音输入支持**：通过语音交互与您的模型进行交互；直接与您的模型交谈的便利。此外，探索在 3 秒无声后自动发送语音输入的选项，以获得流畅的体验。
- ⚙️ **高级参数精细控制**：通过调整参数（如温度）和定义系统提示，获得更深层次的控制，以定制对话以满足您的特定偏好和需求。
- 🎨🤖 **图像生成集成**：使用 AUTOMATIC1111 API（本地）和 DALL-E 无缝整合图像生成功能，通过动态视觉内容丰富您的聊天体验。
- 🤝 **OpenAI API 集成**：轻松集成兼容 OpenAI 的 API，实现多样化的对话，同时与 Ollama 模型一起使用。自定义 API 基础 URL 以链接到 **LMStudio、Mistral、OpenRouter 等**。
- ✨ **多个兼容 OpenAI 的 API 支持**：无缝集成和定制各种兼容 OpenAI 的 API，增强聊天交互的多样性。
- 🔗 **外部 Ollama 服务器连接**：通过配置环境变量，轻松链接到托管在不同地址上的外部 Ollama 服务器。
- 🔀 **多个 Ollama 实例负载均衡**：轻松将聊天请求分发到多个 Ollama 实例，以提高性能和可靠性。
- 👥 **多用户管理**：通过直观的管理面板轻松监督和管理用户，简化用户管理流程。
- 🔐 **基于角色的访问控制（RBAC）**：通过受限权限确保安全访问；只有授权人员才能访问您的 Ollama，并且专门的模型创建/拉取权限仅供管理员使用。
- 🔒 **后端反向代理支持**：通过 Open WebUI 后端与 Ollama 之间的直接通信增强安全性。此关键功能消除了在局域网上暴露 Ollama 的需要。从 Web UI 发送到 '/ollama/api' 路由的请求会从后端无缝重定向到 Ollama，增强整体系统安全性。
- 🌟 **持续更新**：我们致力于通过定期更新和新功能改进 Open WebUI。

<!-- ### 🔗 Also Check Out Open WebUI Community! -->
### 🔗 欢迎关注 Open WebUI 社区！

<!-- Don't forget to explore our sibling project, [Open WebUI Community](https://openwebui.com/), where you can discover, download, and explore customized Modelfiles. Open WebUI Community offers a wide range of exciting possibilities for enhancing your chat interactions with Ollama! 🚀 -->
不要忘记探索我们的姊妹项目 [Open WebUI Community](https://openwebui.com/)，在这里您可以发现、下载和探索定制的模型文件。Open WebUI Community 为您提供了丰富的可能性，以增强您与 Ollama 的聊天交互！🚀

### Quick Start with Docker 🐳

<!-- :::info
When using Docker to install Open WebUI, make sure to include the `-v open-webui:/app/backend/data` in your Docker command. This step is crucial as it ensures your database is properly mounted and prevents any loss of data.
::: -->

:::info
在使用 Docker 安装 Open WebUI 时，请确保在 Docker 命令中包含 `-v open-webui:/app/backend/data`。这一步骤至关重要，因为它确保您的数据库正确挂载，防止数据丢失。
:::

<!-- Please note that the following instructions assume that the latest version of Ollama is already installed on your machine. If not, please refer to our full getting started documentation for comprehensive installation steps. -->

请注意，以下说明假定您的计算机上已经安装了最新版本的 Ollama。如果没有，请参考我们的完整入门文档，了解全面的安装步骤。

<!-- - **If Ollama is on your computer**, use this command:

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **If Ollama is on a Different Server**, use this command:

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **If you're only using OpenAI API**, use this command:

  ```bash
  docker run -d -p 3000:8080 -e OPENAI_API_KEY=your_secret_key -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- After installation, you can access Open WebUI at [http://localhost:3000](http://localhost:3000). Enjoy! 😄 -->

- **如果 Ollama 在您的计算机上**，请使用以下命令：

  ```bash
  docker run -d -p 3000:8080 --add-host=host.docker.internal:host-gateway -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **如果 Ollama 在另一台服务器上**，请使用以下命令：

  ```bash
  docker run -d -p 3000:8080 -e OLLAMA_BASE_URL=https://example.com -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- **如果您只使用 OpenAI API**，请使用以下命令：

  ```bash
  docker run -d -p 3000:8080 -e OPENAI_API_KEY=your_secret
  _key -v open-webui:/app/backend/data --name open-webui --restart always ghcr.io/open-webui/open-webui:main
  ```

- 安装完成后，您可以在 [http://localhost:3000](http://localhost:3000) 访问 Open WebUI。尽情享受！ 😄

<!-- #### Open WebUI: Server Connection Error -->

#### Open WebUI: 服务器连接错误

If you're experiencing connection issues, it’s often due to the WebUI docker container not being able to reach the Ollama server at 127.0.0.1:11434 (host.docker.internal:11434) inside the container . Use the `--network=host` flag in your docker command to resolve this. Note that the port changes from 3000 to 8080, resulting in the link: `http://localhost:8080`.

**Example Docker Command**:

```bash
docker run -d --network=host -v open-webui:/app/backend/data -e OLLAMA_BASE_URL=http://127.0.0.1:11434 --name open-webui --restart always ghcr.io/open-webui/open-webui:main
```

## Troubleshooting

If you're facing various issues like "Open WebUI: Server Connection Error", see [TROUBLESHOOTING](/getting-started/troubleshooting) for information on how to troubleshoot and/or join our [Open WebUI Discord community](https://discord.gg/5rJgQTnV4s).

Continue with the full [getting started guide](/getting-started).
