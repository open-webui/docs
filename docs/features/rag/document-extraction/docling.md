---
sidebar_position: 4000
title: "Docling Document Extraction"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## 🐤 Docling Document Extraction

This documentation provides a step-by-step guide to integrating Docling with Open WebUI. Docling is a document processing library designed to transform a wide range of file formats—including PDFs, Word documents, spreadsheets, HTML, and images—into structured data such as JSON or Markdown. With built-in support for layout detection, table parsing, and language-aware processing, Docling streamlines document preparation for AI applications like search, summarization, and retrieval-augmented generation, all through a unified and extensible interface.

## Prerequisites

- Open WebUI instance
- Docker installed on your system
- Docker network set up for Open WebUI

# Integration Steps

### Step 1: Run the Docker Command for Docling-Serve

```bash
docker run -p 5001:5001 -e DOCLING_SERVE_ENABLE_UI=true quay.io/docling-project/docling-serve
```

*With GPU support:

```bash
docker run --gpus all -p 5001:5001 -e DOCLING_SERVE_ENABLE_UI=true quay.io/docling-project/docling-serve-cu124
```

### Step 2: Configure Open WebUI to use Docling

- Log in to your Open WebUI instance.
- Navigate to the `Admin Panel` settings menu.
- Click on `Settings`.
- Click on the `Documents` tab.
- Change the `Default` content extraction engine dropdown to `Docling`.
- Update the context extraction engine URL to `http://host.docker.internal:5001`.
- Save the changes.

### (optional) Step 3: Configure Docling's picture description features

- on the `Documents` tab:
- Activate `Describe Pictures in Documents` button.
- Below, choose a description mode: `local` or `API`
  - `local`: vision model will run in the same context as Docling itself
  - `API`: Docling will make a call to an external service/container (i.e. Ollama)
- fill in an **object value** as described at https://github.com/docling-project/docling-serve/blob/main/docs/usage.md#picture-description-options
- Save the changes.

#### Make sure the object value is a valid JSON! Working examples below

  ![image](https://github.com/user-attachments/assets/f6524949-fb47-4686-9c81-6ab8fdda6db1)

```json
{
  "repo_id": "HuggingFaceTB/SmolVLM-256M-Instruct",
  "generation_config": {
    "max_new_tokens": 200,
    "do_sample": false
  },
  "prompt": "Describe this image in a few sentences."
}
```

  ![image](https://github.com/user-attachments/assets/982e0081-8c11-457c-b886-af91569e7fef)

```json
{
  "url": "http://localhost:11434/v1/chat/completions",
  "params": {
    "model": "qwen2.5vl:7b-q4_K_M"
  },
  "timeout": 60,
  "prompt": "Describe this image in great details. "
}
```

## Verifying Docling in Docker

To verify that Docling is working correctly in a Docker environment, you can follow these steps:

### 1. Start the Docling Docker Container

First, ensure that the Docling Docker container is running. You can start it using the following command:

```bash
docker run -p 5001:5001 -e DOCLING_SERVE_ENABLE_UI=true quay.io/docling-project/docling-serve
```

This command starts the Docling container and maps port 5001 from the container to port 5001 on your local machine.

### 2. Verify the Server is Running

- Go to `http://127.0.0.1:5001/ui/`
- The URL should lead to a UI to use Docling

### 3. Verify the Integration

- You can try uploading some files via the UI and it should return output in MD format or your desired format

### Conclusion

Integrating Docling with Open WebUI is a simple and effective way to enhance document processing and content extraction capabilities. By following the steps in this guide, you can set up Docling as the default extraction engine and verify it’s working smoothly in a Docker environment. Once configured, Docling enables powerful, format-agnostic document parsing to support more advanced AI features in Open WebUI.
