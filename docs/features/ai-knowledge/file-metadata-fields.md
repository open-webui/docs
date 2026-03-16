---
sidebar_position: 5
title: "File Metadata Fields"
---

Open WebUI supports config-driven metadata fields on knowledge base files. Metadata improves RAG retrieval quality, enables the LLM to cite sources with rich context, and allows filtering files by structured attributes.

## Overview

File metadata fields (such as title, author, tags, source URL) can be attached to files in a knowledge base. These fields are:

- **Stored** in the file record and propagated to vector DB chunks
- **Searchable** via BM25 hybrid search (fields with `embed: true`)
- **Visible to the LLM** as `<source>` tag attributes (fields with `context: true`)
- **Filterable** via the API (fields with `filter: true`)
- **Displayed** in the file viewer UI below the filename

## Configuration

Metadata fields are defined via the `FILE_METADATA_FIELDS` setting, which accepts a JSON array of field definitions. It can be set in three ways:

### Environment Variable

```env
FILE_METADATA_FIELDS='[{"key":"title","type":"string","embed":true,"context":true,"filter":true},{"key":"author","type":"string","embed":false,"context":true,"filter":true},{"key":"source_url","type":"string","embed":false,"context":true,"filter":true},{"key":"tags","type":"list","embed":true,"context":true,"filter":true}]'
```

### Docker Compose

```yaml
services:
  open-webui:
    environment:
      - FILE_METADATA_FIELDS=[{"key":"title","type":"string","embed":true,"context":true,"filter":true},{"key":"author","type":"string","embed":false,"context":true,"filter":true}]
```

### Admin API (Runtime, No Restart Required)

```bash
curl -X POST http://localhost:8080/api/v1/retrieval/config/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "FILE_METADATA_FIELDS": [
      {"key": "title", "type": "string", "embed": true, "context": true, "filter": true},
      {"key": "author", "type": "string", "embed": false, "context": true, "filter": true},
      {"key": "source_url", "type": "string", "embed": false, "context": true, "filter": true},
      {"key": "tags", "type": "list", "embed": true, "context": true, "filter": true}
    ]
  }'
```

## Field Definition Properties

Each field definition is a JSON object with the following properties:

| Property | Type | Description |
|----------|------|-------------|
| `key` | string | **Required.** The field name stored in file metadata and vector DB (e.g. `"title"`, `"author"`) |
| `type` | string | Value type for validation: `"string"`, `"integer"`, `"list"`, `"boolean"` |
| `embed` | boolean | Include in BM25 enrichment text for hybrid search. Improves search ranking when users search for terms in this field. |
| `context` | boolean | Include as attribute on `<source>` tags sent to the LLM. Makes the field visible for citation in AI responses. |
| `filter` | boolean | Whether this field can be used for filtering in API queries. |

### Understanding the embed and context Flags

The `embed` and `context` flags control two different things:

- **`embed`** affects **search quality** — when enabled, the field value is appended to the BM25 enrichment text used in hybrid search. This means searching for "Jane" will boost results from files where `author: "Jane"`.
- **`context`** affects **LLM visibility** — when enabled, the field is added as an XML attribute on the `<source>` tag that the LLM sees. This allows the LLM to cite the field in its response (e.g. including the source URL or author name).

| embed | context | Behavior |
|-------|---------|----------|
| true | true | Boosts search ranking AND LLM can cite it (e.g. `title`, `tags`) |
| true | false | Improves search only, LLM doesn't see it (e.g. `description`) |
| false | true | LLM sees it for citation, no effect on search (e.g. `source_url`, `author`) |
| false | false | Stored and filterable only, no search or LLM impact (e.g. `published_at`) |

## Default Fields

If `FILE_METADATA_FIELDS` is not configured, these defaults are used:

| Field | Type | embed | context | filter | Purpose |
|-------|------|-------|---------|--------|---------|
| `title` | string | true | true | true | Document title |
| `author` | string | false | true | true | Document author |
| `source_url` | string | false | true | true | Link to original file/page |
| `tags` | list | true | true | true | Categorization tags |
| `description` | string | true | false | true | Document description |
| `published_at` | integer | false | false | true | Publication date (epoch timestamp) |
| `language` | string | false | true | true | Document language |

## API Endpoints

### Discover Available Fields

```
GET /api/v1/retrieval/config/metadata_fields
```

Returns the configured field definitions. Available to all authenticated users, so API consumers can discover which fields are accepted.

### Get File Metadata

```
GET /api/v1/files/{id}/meta
```

Returns the full metadata dict for a file, including both system fields (`name`, `content_type`, `size`) and user-defined fields.

### Update File Metadata

```
POST /api/v1/files/{id}/meta/update
Content-Type: application/json

{
  "meta": {
    "title": "Q1 Financial Report",
    "author": "Jane Smith",
    "tags": ["finance", "quarterly"],
    "source_url": "https://intranet.example.com/reports/q1-2025.pdf"
  }
}
```

Updates metadata and **automatically re-processes** the file's vector DB embeddings, including all knowledge bases referencing the file. Set a key to `null` to remove it.

:::warning Protected Keys
System-managed keys (`name`, `content_type`, `size`, `collection_name`, `data`) cannot be modified via this endpoint.
:::

### Batch Update Metadata

```
POST /api/v1/files/meta/batch/update
Content-Type: application/json

{
  "file_ids": ["file-id-1", "file-id-2", "file-id-3"],
  "meta": {
    "author": "Legal Team",
    "tags": ["policy", "compliance"]
  }
}
```

Updates metadata across multiple files. Files the user doesn't have write access to are skipped. Returns lists of updated and skipped file IDs.

### Set Metadata During Upload

Metadata can be provided at upload time via the `metadata` form parameter:

```bash
curl -X POST http://localhost:8080/api/v1/files/ \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@report.pdf" \
  -F 'metadata={"title":"Q1 Report","author":"Jane","tags":["finance"],"source_url":"https://example.com/report.pdf"}'
```

Configured metadata fields are automatically extracted to the top level of `file.meta` during upload, so they are available immediately when the file is processed and added to a knowledge base.

## How Metadata Flows Through RAG

1. **Upload/Update** — Metadata is stored in `file.meta` in the database.
2. **Processing** — Configured fields are propagated to vector DB chunk metadata.
3. **Search** — Fields with `embed: true` are included in BM25 enrichment text, improving hybrid search relevance.
4. **LLM Context** — Fields with `context: true` are added as attributes on `<source>` tags:
   ```xml
   <source id="1" name="report.pdf" title="Q1 Report" author="Jane" source_url="https://..." tags="finance, quarterly">
   ...document chunk...
   </source>
   ```
5. **Response** — The LLM can cite metadata naturally, e.g. *"According to the Q1 Report by Jane [1]..."*
6. **API Response** — Full metadata is returned in the `sources` array for programmatic access.

## Adding Custom Fields

To add a new metadata field, update the configuration — no code changes required:

```bash
curl -X POST http://localhost:8080/api/v1/retrieval/config/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "FILE_METADATA_FIELDS": [
      {"key": "title", "type": "string", "embed": true, "context": true, "filter": true},
      {"key": "author", "type": "string", "embed": false, "context": true, "filter": true},
      {"key": "department", "type": "string", "embed": true, "context": true, "filter": true}
    ]
  }'
```

After updating the config, new uploads will use the field immediately. Existing files need a metadata update (via API) to include the new field, which triggers automatic re-processing.

:::tip
Use the `GET /api/v1/retrieval/config/metadata_fields` endpoint to verify which fields are currently configured.
:::
