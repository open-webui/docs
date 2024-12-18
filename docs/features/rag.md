---
sidebar_position: 8
title: "🔎 Retrieval Augmented Generation (RAG)"
---

Retrieval Augmented Generation (RAG) is a a cutting-edge technology that enhances the conversational capabilities of chatbots by incorporating context from diverse sources. It works by retrieving relevant information from a wide range of sources such as local and remote documents, web content, and even multimedia sources like YouTube videos. The retrieved text is then combined with a predefined RAG template and prefixed to the user's prompt, providing a more informed and contextually relevant response.

One of the key advantages of RAG is its ability to access and integrate information from a variety of sources, making it an ideal solution for complex conversational scenarios. For instance, when a user asks a question related to a specific document or web page, RAG can retrieve and incorporate the relevant information from that source into the chat response. RAG can also retrieve and incorporate information from multimedia sources like YouTube videos. By analyzing the transcripts or captions of these videos, RAG can extract relevant information and incorporate it into the chat response.

## Local and Remote RAG Integration

Local documents must first be uploaded via the Documents section of the Workspace area to access them using the `#` symbol before a query. Click on the formatted URL in the that appears above the chat box. Once selected, a document icon appears above `Send a message`, indicating successful retrieval.

## Web Search for RAG

For web content integration, start a query in a chat with `#`, followed by the target URL. Click on the formatted URL in the box that appears above the chat box. Once selected, a document icon appears above `Send a message`, indicating successful retrieval. Open WebUI fetches and parses information from the URL if it can.

:::tip
Web pages often contain extraneous information such as navigation and footer. For better results, link to a raw or reader-friendly version of the page.
:::

## RAG Template Customization

Customize the RAG template from the `Admin Panel` > `Settings` > `Documents` menu.

## RAG Embedding Support

Change the RAG embedding model directly in the `Admin Panel` > `Settings` > `Documents` menu. This feature supports Ollama and OpenAI models, enabling you to enhance document processing according to your requirements.

## Citations in RAG Feature

The RAG feature allows users to easily track the context of documents fed to LLMs with added citations for reference points. This ensures transparency and accountability in the use of external sources within your chats.

## Enhanced RAG Pipeline

The togglable hybrid search sub-feature for our RAG embedding feature enhances RAG functionality via `BM25`, with re-ranking powered by `CrossEncoder`, and configurable relevance score thresholds. This provides a more precise and tailored RAG experience for your specific use case.

## YouTube RAG Pipeline

The dedicated RAG pipeline for summarizing YouTube videos via video URLs enables smooth interaction with video transcriptions directly. This innovative feature allows you to incorporate video content into your chats, further enriching your conversation experience.

## Document Parsing

A variety of parsers extract content from local and remote documents. For more, see the [`get_loader`](https://github.com/open-webui/open-webui/blob/2fa94956f4e500bf5c42263124c758d8613ee05e/backend/apps/rag/main.py#L328) function.
