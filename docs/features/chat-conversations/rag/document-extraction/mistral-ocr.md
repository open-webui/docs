---
sidebar_position: 4
title: "Mistral OCR"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## 👁️ Mistral OCR

This documentation provides a step-by-step guide to integrating Mistral OCR with Open WebUI. Mistral OCR is an optical character recognition library designed to extract text from a variety of image-based file formats (including scanned PDFs, images, and handwritten documents) into structured data such as JSON or plain text. With advanced support for multilingual text recognition, layout analysis, and handwriting interpretation, Mistral OCR simplifies the process of digitizing and processing documents for AI applications like search, summarization, and data extraction, all through a robust and customizable interface.

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
- Leave **API Base URL** (`MISTRAL_OCR_API_BASE_URL`, default `https://api.mistral.ai/v1`) as it is unless you route through a proxy or a regional endpoint
- Save the Admin Panel.

### Optional: Send PDFs as Base64

By default, Open WebUI uploads a PDF to Mistral's file store and then runs OCR on it. Enabling **Use Base64** in **Settings → Admin → Documents** (or [`MISTRAL_OCR_USE_BASE64=true`](/reference/env-configuration#mistral_ocr_use_base64)) instead sends the PDF **inline as a base64 data URL** in a single request, skipping the separate upload step. This helps in proxy or air-gapped setups, or when the upload step fails; the trade-off is a larger single request.

### What Is Sent and What Happens on Failure

Open WebUI sends only `.pdf` uploads to Mistral OCR. Every other file type, images included, goes through the built-in loaders. A failed OCR call does not fail the upload: the file is indexed with a single chunk that reads `Error during processing: ...`, so check the file's extracted content when a document looks processed but returns nothing useful.

## Verifying Mistral OCR

To verify that Mistral OCR is working correctly in script, please refer to `https://docs.mistral.ai/capabilities/document/`

### Conclusion

Integrating Mistral OCR with Open WebUI is a simple and effective way to enhance document processing and content extraction capabilities. By following the steps in this guide, you can set up Mistral OCR as the default extraction engine and leverage its advanced text recognition features. Once configured, Mistral OCR enables powerful, multilingual document parsing with support for various formats, enhancing AI-driven document analysis capabilities in Open WebUI.
