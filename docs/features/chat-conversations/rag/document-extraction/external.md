---
sidebar_position: 5
title: "External Document Extraction"
---

# External Document Extraction

The built-in engines (Tika, Docling, Mistral OCR, and the rest) cover most cases, but sometimes none of them fit: you have a proprietary OCR tool, a cloud extraction API you already pay for, an extraction workload heavy enough that you'd rather run it on its own GPU or memory-heavy box instead of your Open WebUI server, or a compliance requirement to redact PII before the text ever reaches Open WebUI or the model. For all of that, the **external** engine hands document extraction off entirely to an HTTP service you write and run yourself.

Because you control that service, you also control what happens inside it. A few things this makes possible, covered in more detail below:

- **Route by file type.** One configured URL, your service decides internally which parser or model handles `.xlsx` versus `.pdf` versus everything else.
- **Split large documents into multiple retrievable pieces.** Return one chunk per sheet, page, or slide instead of one giant blob.
- **Apply per-user or per-tenant logic.** Open WebUI forwards the requesting user's identity with every request, so your service can enforce access rules or route to a customer-specific backend.
- **Process images and video.** The external engine is the only one that receives image and video uploads for extraction by default.

## Configuration

In **Settings > Admin > Documents**, set **Content Extraction Engine** to **External**, then fill in:

- **Document Loader URL**: the base URL of your service. Open WebUI appends `/process` to it.
- **API Key** (optional): sent as a bearer token if your service checks for one.
- **Headers** (optional): a JSON object of additional headers to send with every request, see [templating](#the-contract) below.

The same settings are available as environment variables: [`CONTENT_EXTRACTION_ENGINE=external`](/reference/env-configuration#content_extraction_engine), [`EXTERNAL_DOCUMENT_LOADER_URL`](/reference/env-configuration#external_document_loader_url), [`EXTERNAL_DOCUMENT_LOADER_API_KEY`](/reference/env-configuration#external_document_loader_api_key), [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers).

## The contract

For every file, Open WebUI sends:

```
PUT {EXTERNAL_DOCUMENT_LOADER_URL}/process
```

- **Body**: the raw file bytes, unmodified.
- **`Content-Type`**: the file's detected MIME type.
- **`Authorization`**: `Bearer {EXTERNAL_DOCUMENT_LOADER_API_KEY}`, if an API key is configured.
- **`X-Filename`**: the original filename, URL-encoded.
- Any headers set in **Headers** / [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers), a JSON object of custom headers with placeholder templating: `{{FILE_ID}}`, `{{FILE_NAME}}`, `{{FILE_CONTENT_TYPE}}`, `{{USER_ID}}`, `{{USER_NAME}}`, `{{USER_EMAIL}}`, `{{USER_ROLE}}`, `{{USER_GROUPS}}`, `{{USER_GROUP_IDS}}`.
- User identity, forwarded automatically: a signed JWT in `X-OpenWebUI-User-Jwt` if [`FORWARD_USER_INFO_HEADER_JWT_SECRET`](/reference/env-configuration#forward_user_info_header_jwt_secret) is set, otherwise plain `X-OpenWebUI-User-Name`, `X-OpenWebUI-User-Id`, `X-OpenWebUI-User-Email`, and `X-OpenWebUI-User-Role` headers.

Your service replies `2xx` with a JSON body, either a single object or a list of objects:

```json
{
  "page_content": "extracted text for this document",
  "metadata": { "any": "extra fields you want stored alongside the chunk" }
}
```

Returning a list produces one Document per entry, each retrieved independently. That's how you split a single upload into several retrievable pieces, one entry per sheet, per page, per slide, rather than one giant blob. A non-2xx response, or a response with no content, fails the extraction and surfaces an error to the user.

## Minimal example

A bare FastAPI service that implements the contract above, returning a placeholder instead of real extraction:

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()


@app.put("/process")
async def process(request: Request):
    filename = request.headers.get("x-filename", "")
    content_type = request.headers.get("content-type", "")
    file_bytes = await request.body()

    # TODO: replace with real extraction logic
    extracted_text = f"Placeholder text for {filename} ({len(file_bytes)} bytes)"

    return JSONResponse({
        "page_content": extracted_text,
        "metadata": {"source": filename, "content_type": content_type},
    })


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
```

Run it (`pip install fastapi uvicorn` first), then set **Document Loader URL** to wherever it's reachable from your Open WebUI instance, for example `http://localhost:5000` in a local setup or `http://your-service:5000` on a shared Docker network.

## Reference

- [`CONTENT_EXTRACTION_ENGINE`](/reference/env-configuration#content_extraction_engine)
- [`EXTERNAL_DOCUMENT_LOADER_URL`](/reference/env-configuration#external_document_loader_url)
- [`EXTERNAL_DOCUMENT_LOADER_API_KEY`](/reference/env-configuration#external_document_loader_api_key)
- [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers)
