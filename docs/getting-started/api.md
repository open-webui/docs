---
sidebar_position: 5
title: "🔗 Open WebUI API Endpoints"
---

Welcome to the Open WebUI API! 🚀 This guide provides essential information on how to interact with the API endpoints effectively to achieve seamless integration and automation using our models. Please note that this is an experimental setup and may undergo future updates for enhancement.

## Authentication
To ensure secure access to the API, authentication is required 🛡️. You can authenticate your API requests using the Bearer Token mechanism. Obtain your API key from **Settings > Account** in the Open WebUI, or alternatively, use a JWT (JSON Web Token) for authentication.

## Notable API Endpoints

### 📜 Retrieve All Models
- **Endpoint**: `GET /api/models`
- **Description**: Fetches all models created or added via Open WebUI.
- **Example**:
  ```bash
  curl -H "Authorization: Bearer YOUR_API_KEY" http://localhost:3000/api/models
  ```

### 💬 Chat Completions
- **Endpoint**: `POST /api/chat/completions`
- **Description**: Serves as an OpenAI API compatible chat completion endpoint for models on Open WebUI including Ollama models, OpenAI models, and Open WebUI Function models.
- **Example**:
  ```bash
  curl -X POST http://localhost:3000/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
        "model": "llama3.1",
        "messages": [
          {
            "role": "user",
            "content": "Why is the sky blue?"
          }
        ]
      }'
  ```

### 🧩 Retrival Augmented Generation (RAG)
- **Endpoint Info**: Currently available with limited functionality as it undergoes significant refinements. Use of the RAG API remains possible but certain operations may be limited until the integration of our ongoing improvements.
- **Note**: Anticipate enhanced functionality upon completion of [Issue #3527](https://github.com/open-webui/open-webui/issues/3527). We're working hard to streamline processes and include exciting new features. Thank you for your patience as we ensure that the RAG API will be easier and more efficient to use.

## Advantages of Using Open WebUI as a Unified LLM Provider
Open WebUI offers a myriad of benefits, making it an essential tool for developers and businesses alike:
- **Unified Interface**: Simplify your interactions with different LLMs through a single, integrated platform.
- **Ease of Implementation**: Quick start integration with comprehensive documentation and community support.

## Swagger Documentation Links
Access detailed API documentation for different services provided by Open WebUI:

| Application | Documentation Path   |
|-------------|----------------------|
| Main        | `/docs`              |
| WebUI       | `/api/v1/docs`       |
| Ollama      | `/ollama/docs`       |
| OpenAI      | `/openai/docs`       |
| Images      | `/images/api/v1/docs`|
| Audio       | `/audio/api/v1/docs` |
| RAG         | `/rag/api/v1/docs`   |

Each documentation portal offers interactive examples, schema descriptions, and testing capabilities to enhance your understanding and ease of use.

By following these guidelines, you can swiftly integrate and begin utilizing the Open WebUI API. Should you encounter any issues or have questions, feel free to reach out through our Discord Community or consult the FAQs. Happy coding! 🌟