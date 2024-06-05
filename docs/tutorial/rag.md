---
sidebar_position: 8
title: "Retrieval Augmented Generation (RAG)"
---

# Retrieval Augmented Generation (RAG)

Retrieval Augmented Generation (RAG) allows context from other diverse sources to be included in chats. Text from different sources is combined with the RAG template and prefixed to the user's prompt.

## Including external sources in chats
Activate RAG by starting the prompt with a `#` symbol. A list of sources will appear.

Once selected, a document icon appears at the top of the prompt, indicating successful retrieval. 

### Local sources

Local documents must first be uploaded via the Documents section.
 
### Sourcing  from the Web

Remote sources are achieved with `#` followed by the target URL. Open WebUI fetches and parses the URL.

> **Tip:** Webpages often include extraneous information such as navigation and footer. Link to a raw or reader-friendly version of the page for better results.

## Document parsing

A variety of parsers extract content from local and remote documents. For more, see the [`get_loader`](https://github.com/open-webui/open-webui/blob/2fa94956f4e500bf5c42263124c758d8613ee05e/backend/apps/rag/main.py#L328) function.

## RAG Template Customization

Modify the RAG template by accessing the 'settings' icon housed within the 'Documents' section.
