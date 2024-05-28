---
sidebar_position: 3
title: "⭐ Features"
---

## Key Features of Open WebUI ⭐

- 🚀 **Effortless Setup**: Install seamlessly using Docker or Kubernetes (kubectl, kustomize or helm) for a hassle-free experience with support for both `:ollama` and `:cuda` tagged images.

- 🤝 **OpenAI API Integration**: Effortlessly integrate OpenAI-compatible APIs for versatile conversations alongside Ollama models. Customize the OpenAI API URL to link with **LMStudio, GroqCloud, Mistral, OpenRouter, and more**.

- 📱 **Responsive Design**: Enjoy a seamless experience across Desktop PC, Laptop, and Mobile devices.

- 📱 **Progressive Web App (PWA) for Mobile**: Enjoy a native app-like experience on your mobile device with our PWA, providing offline access on localhost and a seamless user interface.

- ✒️🔢 **Full Markdown and LaTeX Support**: Elevate your LLM experience with comprehensive Markdown and LaTeX capabilities for enriched interaction.

- 🧩 **Model Builder**: Easily create Ollama models via the Web UI. Create and add custom characters/agents, customize chat elements, and import models effortlessly through [Open WebUI Community](https://openwebui.com/) integration.

- 📚 **Local RAG Integration**: Dive into the future of chat interactions with groundbreaking Retrieval Augmented Generation (RAG) support. This feature seamlessly integrates document interactions into your chat experience. You can load documents directly into the chat or add files to your document library, effortlessly accessing them using the `#` command before a query.

- 🌐 **Web Browsing Capability**: Seamlessly integrate websites into your chat experience using the `#` command followed by a URL. This feature allows you to incorporate web content directly into your conversations, enhancing the richness and depth of your interactions.

- 🎨 **Image Generation Integration**: Seamlessly incorporate image generation capabilities using options such as AUTOMATIC1111 API or ComfyUI (local), and OpenAI's DALL-E (external), enriching your chat experience with dynamic visual content.

- ⚙️ **Many Models Conversations**: Effortlessly engage with various models simultaneously, harnessing their unique strengths for optimal responses. Enhance your experience by leveraging a diverse set of models in parallel.

- 🔐 **Role-Based Access Control (RBAC)**: Ensure secure access with restricted permissions; only authorized individuals can access your Ollama, and exclusive model creation/pulling rights are reserved for administrators.

- 🌐🌍 **Multilingual Support**: Experience Open WebUI in your preferred language with our internationalization (i18n) support. Join us in expanding our supported languages! We're actively seeking contributors!

- 🌟 **Continuous Updates**: We are committed to improving Open WebUI with regular updates, fixes, and new features.

## And many more remarkable features including... ⚡️

### 🌈 User Experience
<details>
  <summary></summary>

- 🖥️ **Intuitive Interface**: Our chat interface takes inspiration from ChatGPT user interface, ensuring a user-friendly experience.

- ⚡ **Swift Responsiveness**: Enjoy reliably fast and responsive performance.

- 🎨 **Splash Screen**: A simple loading splash screen for a smoother user experience.

- 📦 **Pip Install Method (Soon/WIP)**: Install Open WebUI using pip, simplifying the installation process and making it even easier for newcomers to get started.

- 🌈 **Theme Customization**: Choose from a variety of solid, yet sleek themes to personalize your Open WebUI experience. Choose between either Light, Dark, or OLED Dark mode; or simply let your system choose for you!

- 💻 **Code Syntax Highlighting**: Enjoy enhanced code readability with our syntax highlighting feature.

- ↕️ **Bi-Directional Chat Support**: Easily switch between left-to-right and right-to-left chat directions to accommodate various language preferences.

- 📱 **Mobile Accessibility**: Seamlessly open and close the sidebar on mobile devices with intuitive swipe gestures.

- 💾 **Persistent Settings**: Enjoy the convenience of saved settings, stored in a config.json file for easy access and reuse.

</details>

### 💬 Conversations
<details>
  <summary></summary>

- 📂 **Unified Workspace**: Access all your model files, documents, prompts, and playground in one convenient location, streamlining your workflow.

- 🔍 **RAG Embedding Support**: Change the RAG embedding model directly in document settings, enhancing document processing. This feature supports Ollama and OpenAI models.

- 🔄 **Multi-Modal Support**: Seamlessly engage with models that support multimodal interactions, including images (e.g., LLava).

- 🤖 **Multiple Model Support**: Seamlessly switch between different chat models for diverse interactions.

- ⚙️ **Fine-Tuned Control with Advanced Parameters**: Gain a deeper level of control by adjusting parameters such as temperature, context length, and seed, and define your system prompts to tailor the conversation to your specific preferences and needs.

- 🏷️ **Conversation Tagging**: Effortlessly categorize and locate specific chats for quick reference and streamlined data collection.

- 📜 **Prompt Preset Support**: Instantly access preset prompts using the `/` command in the chat input. Load predefined conversation starters effortlessly and expedite your interactions. Effortlessly import prompts through [Open WebUI Community](https://openwebui.com/) integration.

- ⬆️ **GGUF File Model Creation**: Effortlessly create Ollama models by uploading GGUF files directly from the Web UI. Streamlined process with options to upload from your machine or download GGUF files from Hugging Face.

- 🧠 **Experimental Memory Feature**: Manually input personal information you want LLMs to remember via Settings > Personalization > Memory.

- 📜 **Citations in RAG Feature**: Easily track the context fed to the LLM with added citations in the RAG feature.

- 🌟 **Enhanced RAG Pipeline**: With hybrid searching via `BM25`, reranking powered by `CrossEncoder`, and configurable relevance score thresholds.

- 📹 **Youtube RAG Pipeline**: Dedicated RAG pipeline for YouTube videos, enabling interaction with video transcriptions directly.

</details>

### 💻 Model Management
<details>
  <summary></summary>

- 🔍 **Model Selector**: Easily find and select custom models with search filter and detailed model information.

- 📥🗑️ **Download/Delete Models**: Easily download or delete models directly from Open WebUI.

- 🔄 **Seamless Integration**: Copy `ollama run {model:tag}` directly from a model's page on [Ollama library](https://ollama.com/library/) to easily select and pull models.

- 🔄 **Update All Ollama Models**: Easily update locally installed models all at once with a convenient button, streamlining model management.

</details>

### 👥 Collaboration
<details>
  <summary></summary>

- 🗨️ **Local Chat Sharing**: Generate and share chat links seamlessly between users, enhancing collaboration and communication.

- 👍👎 **RLHF Annotation**: Empower your messages by rating them with thumbs up and thumbs down, followed by the option to provide textual feedback, facilitating the creation of datasets for Reinforcement Learning from Human Feedback (RLHF). Utilize your messages to train or fine-tune models, all while ensuring the confidentiality of locally saved data.

</details>

### 📚 History and Archive
<details>
  <summary></summary>

- 🔄 **Regeneration History Access**: Easily revisit and explore your entire regeneration history.

- 📜 **Chat History**: Effortlessly access and manage your conversation history.

- 📬 **Archive Chats**: Effortlessly store away completed conversations with LLMs for future reference or interaction, maintaining a tidy and clutter-free chat interface while allowing for easy retrieval.

- 📤📥 **Import/Export Chat History**: Seamlessly move your chat data in and out of the platform.

- 📄 **Chat Download as PDF/TXT**: Easily download chats in .PDF or .txt format.

</details>

### 🎙️ Accessibility
<details>
  <summary></summary>

- 🗣️ **Voice Input Support**: Engage with your model through voice interactions; enjoy the convenience of talking to your model directly. Additionally, explore the option for sending voice input automatically after 3 seconds of silence for a streamlined experience.

- 👥 **'@' Model Integration**: Harness the collective intelligence of multiple models in a single chat by seamlessly switching to any acessible local or external model during conversations by using the `@` command to specify the model by name.

- 🔊 **Configurable Text-to-Speech Endpoint**: Customize your Text-to-Speech experience with configurable OpenAI endpoints.

</details>

### 🐍 Code Execution
<details>
  <summary></summary>

- 🐍 **Python Code Execution**: Execute Python code locally in the browser via Pyodide with libraries like `requests`, `beautifulsoup4`, `numpy`, `pandas`, `seaborn`, `matplotlib`, `scikit-learn`, `scipy`, & `regex`.

- 🚀 **Flexible, UI-Agnostic OpenAI-Compatible Pipelines (WIP)**: Seamlessly integrate and customize pipelines for efficient data processing and model training, ensuring ultimate flexibility and scalability.

</details>

### 🔓 Integration and Security
<details>
  <summary></summary>

- ✨ **Multiple OpenAI-Compatible API Support**: Seamlessly integrate and customize various OpenAI-compatible APIs, enhancing the versatility of your chat interactions.

- 🔑 **Simplified API Key Management**: Easily generate and manage secret keys to leverage Open WebUI with OpenAI libraries, streamlining integration and development.

- 🌐🔗 **External Ollama Server Connectivity**: Seamlessly link to an external Ollama server hosted on a different address by configuring the environment variable.

- 🛢️ **External Database Support**: Seamlessly connect to custom SQLite or Postgres databases using the `DATABASE_URL` environment variable.

- 🌐 **Remote ChromaDB Support**: Expand your database capabilities with the ability to connect to remote ChromaDB servers.

- 🔀 **Multiple Ollama Instance Load Balancing**: Effortlessly distribute chat requests across multiple Ollama instances for enhanced performance and reliability.

</details>

### 👑 Administration
<details>
  <summary></summary>

- 👑 **Super Admin Assignment**: Automatically assign the first signup as a super admin as an unchangeable role that cannot be modified by other admins.

- 🛡️ **Granular User Permissions**: Restrict user actions and access with customizable role-based permissions, ensuring that only authorized individuals can perform specific tasks.

- 👥 **Multi-User Management**: Seamlessly manage multiple users through our intuitive admin panel with pagination, streamlining user administration and simplifying user lifecycle management.

- 🔧 **Admin Panel**: Streamlined user management with options to add users directly or in bulk via CSV import, making user onboarding and management efficient.

- 🔗 **Webhook Integration**: Subscribe to new user sign-up events via webhook (compatible with Discord, Google Chat and Microsoft Teams), providing real-time notifications and automation capabilities.

- 🛡️ **Model Whitelisting**: Enhance security and access control by allowing admins to whitelist models for users with the `user` role, ensuring that only authorized models can be accessed.

- 📧 **Trusted Email Authentication**: Authenticate using a trusted email header, adding an extra layer of security and authentication to protect your Web UI.

- 🔒 **Backend Reverse Proxy Support**: Bolster security through direct communication between Open WebUI backend and Ollama. This key feature eliminates the need to expose Ollama over LAN. Requests made to the `/ollama/api` route from the Web UI are seamlessly redirected to Ollama from the backend, enhancing overall system security.

- 🔓 **Optional Authentication**: Enjoy the flexibility to disable authentication by setting WEBUI_AUTH to False, ideal for fresh installations without existing users.

</details>
