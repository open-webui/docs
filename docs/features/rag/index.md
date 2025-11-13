---
sidebar_position: 200
title: "Retrieval Augmented Generation (RAG)"
---

:::warning

If you're using **Ollama**, note that it **defaults to a 2048-token context length**. This severely limits **Retrieval-Augmented Generation (RAG) performance**, especially for web search, because retrieved data may **not be used at all** or only partially processed.

:::

Retrieval Augmented Generation (RAG) is a cutting-edge technology that enhances the conversational capabilities of chatbots by incorporating context from diverse sources. It works by retrieving relevant information from a wide range of sources such as local and remote documents, web content, and even multimedia sources like YouTube videos. The retrieved text is then combined with a predefined RAG template and prefixed to the user's prompt, providing a more informed and contextually relevant response.

One of the key advantages of RAG is its ability to access and integrate information from a variety of sources, making it an ideal solution for complex conversational scenarios. For instance, when a user asks a question related to a specific document or web page, RAG can retrieve and incorporate the relevant information from that source into the chat response. RAG can also retrieve and incorporate information from multimedia sources like YouTube videos. By analyzing the transcripts or captions of these videos, RAG can extract relevant information and incorporate it into the chat response.

## Local and Remote RAG Integration

Local documents must first be uploaded via the Documents section of the Workspace area to access them using the `#` symbol before a query. Click on the formatted URL in the that appears above the chat box. Once selected, a document icon appears above `Send a message`, indicating successful retrieval.

You can also load documents into the workspace area with their access by starting a prompt with `#`, followed by a URL. This can help incorporate web content directly into your conversations.

## Web Search for RAG

:::warning
**Context Length Warning for Ollama Users:** Web pages typically contain 4,000-8,000+ tokens even after content extraction, including main content, navigation elements, headers, footers, and metadata. With only 2048 tokens available, you're getting less than half the page content, often missing the most relevant information. Even 4096 tokens is frequently insufficient for comprehensive web content analysis.

**To Fix This:** Navigate to **Admin Panel > Models > Settings** (of your Ollama model) > **Advanced Parameters** and **increase the context length to 8192+ (or rather, more than 16000) tokens**. This setting specifically applies to Ollama models. For OpenAI and other integrated models, ensure you're using a model with sufficient built-in context length (e.g., GPT-4 Turbo with 128k tokens).
:::

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

## Google Drive Integration

When paired with a Google Cloud project that has the Google Picker API and Google Drive API enabled, this feature allows users to directly access their Drive files from the chat interface and upload documents, slides, sheets and more and uploads them as context to your chat. Can be enabled `Admin Panel` > `Settings` > `Documents` menu. Must set [`GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_CLIENT_ID`](https://github.com/open-webui/docs/blob/main/docs/getting-started/env-configuration.md) environment variables to use.

### Detailed Instructions

1. Create an OAuth 2.0 client and configure both the Authorized JavaScript origins & Authorized redirect URI to be the URL (include the port if any) you use to access your Open-WebUI instance.
2. Make a note of the Client ID associated with that OAuth client.
3. Make sure that you enable both Google Drive API and Google Picker API for your project.
4. Also set your app (project) as Testing and add your Google Drive email to the User List
5. Set the permission scope to include everything those APIs have to offer. And because the app would be in Testing mode, no verification is required by Google to allow the app from accessing the data of the limited test users.
6. Go to the Google Picker API page, and click on the create credentials button.
7. Create an API key and under Application restrictions and choose Websites. Then add your Open-WebUI instance's URL, same as the Authorized JavaScript origins and Authorized redirect URIs settings in the step 1.
8. Set up API restrictions on the API Key to only have access to Google Drive API & Google Picker API
9. Set up the environment variable, `GOOGLE_DRIVE_CLIENT_ID` to the Client ID of the OAuth client from step 2.
10. Set up the environment variable `GOOGLE_DRIVE_API_KEY` to the API Key value setup up in step 7 (NOT the OAuth client secret from step 2).
11. Set up the `GOOGLE_REDIRECT_URI` to my Open-WebUI instance's URL (include the port, if any).
12. Then relaunch your Open-WebUI instance with those three environment variables.
13. After that, make sure Google Drive was enabled under `Admin Panel` < `Settings` < `Documents` < `Google Drive`
