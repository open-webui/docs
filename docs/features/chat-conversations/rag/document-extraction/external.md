---
sidebar_position: 5
title: "External Document Extraction"
---

# External Document Extraction

Open WebUI can hand document extraction off to an HTTP service you run yourself, instead of one of the built-in engines. Set [`CONTENT_EXTRACTION_ENGINE`](/reference/env-configuration#content_extraction_engine) to `external` and point it at your service with [`EXTERNAL_DOCUMENT_LOADER_URL`](/reference/env-configuration#external_document_loader_url) and [`EXTERNAL_DOCUMENT_LOADER_API_KEY`](/reference/env-configuration#external_document_loader_api_key).

Reach for this when no built-in engine fits: routing different file types to different backends, an in-house parsing or OCR stack, or extraction logic that depends on who's asking.

## The contract

For every file, Open WebUI sends:

```
PUT {EXTERNAL_DOCUMENT_LOADER_URL}/process
```

- **Body**: the raw file bytes, unmodified.
- **`Content-Type`**: the file's detected MIME type.
- **`Authorization`**: `Bearer {EXTERNAL_DOCUMENT_LOADER_API_KEY}`.
- **`X-Filename`**: the original filename, URL-encoded.
- Any headers set in [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers), a JSON object of custom headers with placeholder templating: `{{FILE_ID}}`, `{{FILE_NAME}}`, `{{FILE_CONTENT_TYPE}}`, `{{USER_ID}}`, `{{USER_NAME}}`, `{{USER_EMAIL}}`, `{{USER_ROLE}}`, `{{USER_GROUPS}}`, `{{USER_GROUP_IDS}}`.
- User identity, forwarded automatically: a signed JWT in `X-OpenWebUI-User-Jwt` if [`FORWARD_USER_INFO_HEADER_JWT_SECRET`](/reference/env-configuration#forward_user_info_header_jwt_secret) is set, otherwise plain `X-OpenWebUI-User-Name`, `X-OpenWebUI-User-Id`, `X-OpenWebUI-User-Email`, and `X-OpenWebUI-User-Role` headers.

Your service replies `2xx` with a JSON body, either a single object or a list of objects:

```json
{
  "page_content": "extracted text for this document",
  "metadata": { "any": "extra fields you want stored alongside the chunk" }
}
```

Returning a list produces one Document per entry, each retrieved independently. That's useful when a single upload should split into several retrievable pieces, one entry per sheet, per page, per slide, rather than one giant blob. A non-2xx response, or a response with no content, fails the extraction and surfaces an error to the user.

## What this enables

- **Route by file type.** `Content-Type` and `X-Filename` are enough to dispatch `.xlsx` to one parser, `.pdf` to another, and everything else to a third, all from a single configured URL, without touching Open WebUI's own engine list.
- **Split large workbooks into per-sheet documents.** Return a list of `{page_content, metadata}` objects, one per sheet, instead of one giant blob. Focused Retrieval can then pull just the sheet a query actually needs, instead of the whole workbook.
- **Per-tenant or per-user processing.** Use the forwarded user headers, or the signed JWT if you'd rather verify a signature than trust plain headers, to apply per-user or per-group rules or route to a customer-specific backend. Combine with `EXTERNAL_DOCUMENT_LOADER_HEADERS` templating for per-tenant auth tokens.
- **Images and video.** The external engine is the only engine that can receive image and video uploads for extraction by default; see [`CONTENT_EXTRACTION_SUPPORTED_MEDIA_MIME_TYPES`](/reference/env-configuration#content_extraction_supported_media_mime_types) to extend that to other engines or restrict it further.

## Reference

- [`CONTENT_EXTRACTION_ENGINE`](/reference/env-configuration#content_extraction_engine)
- [`EXTERNAL_DOCUMENT_LOADER_URL`](/reference/env-configuration#external_document_loader_url)
- [`EXTERNAL_DOCUMENT_LOADER_API_KEY`](/reference/env-configuration#external_document_loader_api_key)
- [`EXTERNAL_DOCUMENT_LOADER_HEADERS`](/reference/env-configuration#external_document_loader_headers)
