---
sidebar_position: 4
title: "Knowledge"
---

Knowledge part of Open WebUI is like a memory bank that makes your interactions even more powerful and context-aware. Let's break down what "Knowledge" really means in Open WebUI, how it works, and why it's incredibly helpful for enhancing your experience.

## TL;DR

- **Knowledge** is a section in Open WebUI where you can store structured information that the system can refer to during your interactions.
- It's like a memory system for Open WebUI that allows it to pull from saved data, making responses more personalized and contextually aware.
- You can use Knowledge directly in your chats with Open WebUI to access the stored data whenever you need it.

Setting up Knowledge is straightforward! Simply navigate to **Workspace → Knowledge** in the sidebar and start adding details or data. You don't need coding expertise or technical setup; it's built into the core system!

## What is the "Knowledge" Section?

The **Knowledge section** is a storage area within Open WebUI where you can save specific pieces of information or data points. Think of it as a **reference library** that Open WebUI can use to make its responses more accurate and relevant to your needs.

### Why is Knowledge Useful?

Imagine you're working on a long-term project and want the system to remember certain parameters, settings, or even key notes about the project without having to remind it every time. Or perhaps, you want it to remember specific personal preferences for chats and responses. The Knowledge section is where you can store this kind of **persistent information** so that Open WebUI can reference it in future conversations, creating a more **coherent, personalized experience**.

Some examples of what you might store in Knowledge:

- Important project parameters or specific data points you'll frequently reference.
- Custom commands, workflows, or settings you want to apply.
- Personal preferences, guidelines, or rules that Open WebUI can follow in every chat.

### How to Use Knowledge in Chats

Accessing stored Knowledge in your chats is easy! By simply referencing what's saved (using '#' before the name), Open WebUI can pull in data or follow specific guidelines that you've set up in the Knowledge section.

For example:

- When discussing a project, Open WebUI can automatically recall your specified project details.
- It can apply custom preferences to responses, like formality levels or preferred phrasing.

To reference Knowledge in your chats, just ensure it's saved in the Knowledge section, and Open WebUI will know when and where to bring in the relevant information!

Admins can add knowledge to the workspace, which users can access and use; however, users do not have direct access to the workspace itself.

### Native Mode (Agentic Mode) Knowledge Tools

When using **Native Function Calling (Agentic Mode)**, quality models can interact with your Knowledge Bases autonomously using built-in tools:

:::tip Quality Models for Knowledge Exploration
Autonomous knowledge base exploration works best with frontier models (GPT-5, Claude 4.5+, Gemini 3+) that can intelligently search, browse, and synthesize information from multiple documents. Small local models may struggle with multi-step knowledge retrieval.
:::

- **`query_knowledge_bases`**: Search across knowledge bases using semantic/vector search. This should be the model's first choice for finding information before searching the web.
- **`list_knowledge_bases`**: Browse available knowledge bases with file counts.
- **`search_knowledge_bases`**: Find specific knowledge bases by name or description.
- **`search_knowledge_files`**: Locate files within knowledge bases by filename.
- **`view_knowledge_file`**: Read the full content of a specific file from a knowledge base.

These tools enable models to autonomously explore and retrieve information from your knowledge bases, making conversations more contextually aware and grounded in your stored documents.

:::info Central Tool Documentation
For complete details on all built-in agentic tools and how to configure them, see the [**Native/Agentic Mode Tools Guide**](/features/plugin/tools#built-in-system-tools-nativeagentic-mode).
:::

### Setting Up Your Knowledge Base

1. **Navigate to the Knowledge Section**: Click **Workspace** in the sidebar, then select **Knowledge**. This area is designed to be user-friendly and intuitive.
2. **Add Entries**: Input information you want Open WebUI to remember. It can be as specific or broad as you like.
3. **Save and Apply**: Once saved, the Knowledge is accessible and ready to enhance your chat interactions.

### Exporting a Knowledge Base

Admins can export an entire knowledge base as a downloadable zip file. This is useful for backing up your knowledge, migrating data between instances, or sharing curated knowledge collections with others.

To export a knowledge base, open the item menu (three dots) on any knowledge base entry and select **Export**. The system will generate a zip archive containing all files from that knowledge base, converted to `.txt` format for universal compatibility. The zip file will be named after the knowledge base itself.

:::note Admin Only
The export feature is restricted to admin users. Regular users will not see the Export option in the menu.
:::

### Programmatic Access via API

Knowledge bases can also be managed programmatically through the Open WebUI API. This is useful for automated workflows, bulk imports, or integrating with external systems.

Key API endpoints:
- `POST /api/v1/files/` - Upload files
- `GET /api/v1/files/{id}/process/status` - Check file processing status
- `POST /api/v1/knowledge/{id}/file/add` - Add files to a knowledge base

:::warning Important: Async File Processing
When uploading files via API, processing happens asynchronously. You **must** wait for file processing to complete before adding files to a knowledge base, or you will receive an "empty content" error.

For detailed examples and proper workflow handling, see the [API Endpoints documentation](/getting-started/api-endpoints#-retrieval-augmented-generation-rag).
:::

## Summary

- The Knowledge section is like Open WebUI's "memory bank," where you can store data that you want it to remember and use.
- **Use Knowledge to keep the system aware** of important details, ensuring a personalized chat experience.
- You can **directly reference Knowledge in chats** to bring in stored data whenever you need it using '#' + name of the knowlege.
- **Admins can export knowledge bases** as zip files for backup, migration, or sharing purposes.

🌟 Remember, there's always more to discover, so dive in and make Open WebUI truly your own!
