---
sidebar_position: 322
title: "🤖 OpenWebUI Chat Client"
---
:::warning
This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::
# OpenWebUI Chat Client


**openwebui-chat-client** is a comprehensive, stateful Python client library for the [Open WebUI](https://github.com/open-webui/open-webui) API. It enables intelligent interaction with Open WebUI, supporting single/multi-model chats, file uploads, Retrieval-Augmented Generation (RAG), knowledge base management, and advanced chat organization features.

---

## 🚀 Installation

Install the client directly from PyPI:

```bash
pip install openwebui-chat-client
```

---

## ⚡ Quick Start

```python
from openwebui_chat_client import OpenWebUIClient
import logging

logging.basicConfig(level=logging.INFO)

client = OpenWebUIClient(
    base_url="http://localhost:3000",
    token="your-bearer-token",
    default_model_id="gpt-4.1"
)

response, message_id = client.chat(
    question="Hello, how are you?",
    chat_title="My First Chat"
)

print(response)
```

---

## ✨ Features

- **Multi-Modal Conversations**: Text, images, and file uploads.
- **Single & Parallel Model Chats**: Query one or multiple models simultaneously (great for model A/B tests!).
- **RAG Integration**: Use files or knowledge bases for retrieval-augmented responses.
- **Knowledge Base Management**: Create, update, and use knowledge bases.
- **Chat Organization**: Folders, tags, and search functionality.
- **Smart Caching**: Session, file upload, and knowledge base caches for efficiency.
- **Concurrent Processing**: Parallel model querying for fast multi-model responses.
- **Comprehensive Logging & Error Handling**: Robust and debuggable.

---

## 🧑‍💻 Example: Single Model Chat (`gpt-4.1`)

```python
from openwebui_chat_client import OpenWebUIClient

client = OpenWebUIClient(
    base_url="http://localhost:3000",
    token="your-bearer-token",
    default_model_id="gpt-4.1"
)

response, message_id = client.chat(
    question="What are the key features of OpenAI GPT-4.1?",
    chat_title="Model Features - GPT-4.1"
)

print("GPT-4.1 Response:", response)
```

---

## 🤖 Example: Parallel Model Chat (`gpt-4.1` and `gemini-2.5-flash`)

```python
from openwebui_chat_client import OpenWebUIClient

client = OpenWebUIClient(
    base_url="http://localhost:3000",
    token="your-bearer-token",
    default_model_id="gpt-4.1"
)

responses = client.parallel_chat(
    question="Compare the strengths of GPT-4.1 and Gemini 2.5 Flash for document summarization.",
    chat_title="Model Comparison: Summarization",
    model_ids=["gpt-4.1", "gemini-2.5-flash"]
)

for model, resp in responses.items():
    print(f"{model} Response:\n{resp}\n")
```

---

## 🖥️ Example: Page Rendering (Web UI Integration)

After running the above Python code, you can view the conversation and model comparison results in the Open WebUI web interface:

- **Single Model** (`gpt-4.1`):  
  The chat history will display your input question and the GPT-4.1 model's response in the conversational timeline.  
  ![Single Model Chat Example](https://cdn.jsdelivr.net/gh/Fu-Jie/openwebui-chat-client@main/examples/images/single-model-chat.png)

- **Parallel Models** (`gpt-4.1` & `gemini-2.5-flash`):  
  The chat will show a side-by-side (or grouped) comparison of the responses from both models to the same input, often tagged or color-coded by model.  
  ![Parallel Model Comparison Example](https://cdn.jsdelivr.net/gh/Fu-Jie/openwebui-chat-client@main/examples/images/parallel-model-chat.png)

> **Tip:**  
> The web UI visually distinguishes responses using the model name. You can expand, collapse, or copy each answer, and also tag, organize, and search your chats directly in the interface.

---

## 🧠 Advanced Usage

### Knowledge Base and RAG Example

```python
# Create knowledge base and add documents for RAG
client.create_knowledge_base("Doc-KB")
client.add_file_to_knowledge_base("manual.pdf", "Doc-KB")

response, _ = client.chat(
    question="Summarize the manual in Doc-KB.",
    chat_title="Manual Summary",
    rag_collections=["Doc-KB"],
    model_id="gemini-2.5-flash"
)
print("Gemini-2.5-Flash Response:", response)
```

### Chat Organization with Folder and Tags

```python
response, _ = client.chat(
    question="How can I improve code quality?",
    chat_title="Code Quality Tips",
    model_id="gpt-4.1",
    folder_name="Development",
    tags=["coding", "best-practices"]
)
```

---

## 🔑 How to get your API Key

1. Log in to your Open WebUI account.
2. Click on your profile picture/name in the bottom-left corner and go to **Settings**.
3. In the settings menu, navigate to the **Account** section.
4. Find the **API Keys** area and **Create a new key**.
5. Copy the generated key and set it as your `OUI_AUTH_TOKEN` environment variable or use it directly in your client code.

---

## 📚 API Reference

| Method | Description | Example |
|--------|-------------|---------|
| `chat()` | Single model conversation | See "Single Model Chat" |
| `parallel_chat()` | Multi-model conversation | See "Parallel Model Chat" |
| `create_knowledge_base()` | Create new knowledge base | `client.create_knowledge_base("MyKB")` |
| `add_file_to_knowledge_base()` | Add file to knowledge base | `client.add_file_to_knowledge_base("file.pdf", "MyKB")` |
| `get_knowledge_base_by_name()` | Retrieve knowledge base | `client.get_knowledge_base_by_name("MyKB")` |
| `create_folder()` | Create chat folder | `client.create_folder("ProjectX")` |
| `set_chat_tags()` | Apply tags to chat | `client.set_chat_tags(chat_id, ["tag1", "tag2"])` |

---

## 🛠️ Troubleshooting

- **Authentication Errors**: Ensure your bearer token is valid.
- **Model Not Found**: Check model IDs are correct (e.g., `"gpt-4.1"`, `"gemini-2.5-flash"`).
- **File Upload Issues**: Ensure file paths exist and permissions are correct.
- **Web UI Not Updating**: Refresh the page or check server logs for errors.
- **Image Not Displayed**: If you use relative paths for screenshots, make sure the images exist in the correct directory in your repository (e.g. `./examples/images/`).

---
