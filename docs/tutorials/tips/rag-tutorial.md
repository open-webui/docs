---
sidebar_position: 3
title: "Open WebUI RAG Tutorial"
---

:::warning
This tutorial is a community contribution and is not supported by the OpenWebUI team. It serves only as a demonstration on how to customize OpenWebUI for your specific use case. Want to contribute? Check out the contributing tutorial.
:::

# Tutorial: Configuring RAG with OpenWebUI Documentation

In this tutorial, you will learn how to use **Retrieval-Augmented Generation (RAG)** with OpenWebUI to load real-world documentation as a knowledge base. We will walk through how to use the latest **OpenWebUI Documentation** as an example for this setup.

---

## Overview

### What is RAG?

Retrieval-Augmented Generation (RAG) combines **LLMs** with **retrieved knowledge** from external sources. The system retrieves relevant data from uploaded documents or knowledge bases, enhancing the quality and accuracy of responses.

This tutorial demonstrates how to:

- Upload the latest OpenWebUI Documentation as a knowledge base.
- Connect it to a custom model.
- Query the knowledge base for enhanced assistance.

---

## Setup

### Step-by-Step Setup: OpenWebUI Documentation as Knowledge Base

Follow these steps to set up RAG with **OpenWebUI Documentation**:

1. **Download the Documentation**:
   - Download the latest documentation:
     [https://github.com/open-webui/docs/archive/refs/heads/main.zip](https://github.com/open-webui/docs/archive/refs/heads/main.zip)

2. **Extract the Files**:
   - Extract the `main.zip` file to get all documentation files.

3. **Locate the Markdown Files**:
   - In the extracted folder, locate all files with `.md` and `.mdx`extensions (tip: search for `*.md*`).

4. **Create a Knowledge Base**:
   - Navigate to **Workspace** > **Knowledge** > **+ Create a Knowledge Base**.
   - Name it: `OpenWebUI Documentation`
   - Purpose: **Assistance**

   > Click **Create Knowledge**.

5. **Upload the Files**:
   - Drag and drop the `.md` and `.mdx` files from the extracted folder into the **OpenWebUI Documentation** knowledge base.

---

## Create and Configure the Model

### Create a Custom Model with the Knowledge Base

1. **Navigate to Models**:
   - Go to **Workspace** > **Models** > **+ Add New Model**.

2. **Configure the Model**:
   - **Name**: `OpenWebUI`
   - **Base Model**: *(Select the appropriate Llama or other available model)*
   - **Knowledge Source**: Select **OpenWebUI Documentation** from the dropdown.

3. **Save the Model**.

---

## Examples and Usage

### Query the OpenWebUI Documentation Model

1. **Start a New Chat**:
   - Navigate to **New Chat** and select the `OpenWebUI` model.

2. **Example Queries**:

   ```
   User: "How do I configure environment variables?"
   System: "Refer to Section 3.2: Use the `.env` file to manage configurations."
   ```

   ```
   User: "How do I update OpenWebUI using Docker?"
   System: "Refer to `docker/updating.md`: Use `docker pull` and restart the container."
   ```

   With the RAG-enabled model, the system retrieves the most relevant sections from the documentation to answer your query.

---

## Next Steps

### Next Steps

- **Add More Knowledge**: Continue expanding your knowledge base by adding more documents.

---

With this setup, you can effectively use the **OpenWebUI Documentation** to assist users by retrieving relevant information for their queries. Enjoy building and querying your custom knowledge-enhanced models!
