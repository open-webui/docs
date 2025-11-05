---
sidebar_position: 4000
title: "👁️ Mistral OCR"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## 👁️ Mistral OCR

This documentation provides a step-by-step guide to integrating Mistral OCR with Open WebUI. Mistral OCR is an optical character recognition library designed to extract text from a variety of image-based file formats—including scanned PDFs, images, and handwritten documents—into structured data such as JSON or plain text. With advanced support for multilingual text recognition, layout analysis, and handwriting interpretation, Mistral OCR simplifies the process of digitizing and processing documents for AI applications like search, summarization, and data extraction, all through a robust and customizable interface. The Mistral Document loader in Open WebUI supports custom endpoints and models, allowing you to use alternative OCR services such as [LiteLLM OCR](https://docs.litellm.ai/docs/ocr) for enhanced flexibility and integration options.

## Prerequisites

- Open WebUI instance
- Mistral AI account

# Integration Steps

### Step 1: Sign Up or Login to Mistral AI console

- Go to `https://console.mistral.ai`
- Follow the instructions as instructed on the process
- After successful authorization, you should be welcomed to the Console Home

### Step 2: Generate an API key

- Go to `API Keys` or `https://console.mistral.ai/api-keys`
- Create a new key and make sure to copy it

### Step 3: Configure Open WebUI to use Mistral OCR

- Log in to your Open WebUI instance.
- Navigate to the `Admin Panel` settings menu.
- Click on `Settings`.
- Click on the `Documents` tab.
- Change the `Default` content extraction engine dropdown to `Mistral OCR`.
- Paste the API Key on the field
- Save the Admin Panel.

:::info Custom Endpoints Support

Custom endpoints are also supported, for example **[LiteLLM OCR](https://docs.litellm.ai/docs/ocr)** endpoint. To use a custom endpoint:

1. Fill in the **custom endpoint** URL field
2. Define the **custom model** to use
3. Select **Base64** as the PDF transfer method (upload is currently only supported with the official Mistral API)

**Note:** For the Mistral API, both methods work, but the upload method (where PDFs are deleted afterwards) is a bit faster than the Base64 method.

:::

## Verifying Mistral OCR

To verify that Mistral OCR functions correctly, upload a PDF in a chat and check the OCR results. More information is available at `https://docs.mistral.ai/capabilities/document_ai/basic_ocr`.

### Conclusion

Integrating Mistral OCR with Open WebUI is a simple and effective way to enhance document processing and content extraction capabilities. By following the steps in this guide, you can set up Mistral OCR as the default extraction engine and leverage its advanced text recognition features. Once configured, Mistral OCR enables powerful, multilingual document parsing with support for various formats, enhancing AI-driven document analysis capabilities in Open WebUI.
