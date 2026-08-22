---
sidebar_position: 5
title: "External Document Extraction"
---

# External Document Extraction

The **External** extraction method allows you to delegate the document extraction process entirely to your own custom API or an external HTTP microservice. 

This is the most flexible and scalable option, as it allows you to:
- Integrate proprietary OCR or extraction tools.
- Use cloud-based third-party extraction APIs.
- Offload heavy extraction tasks from the main Open WebUI backend to a dedicated server with GPUs or more memory.
- Filter or redact PII (Personally Identifiable Information) before the text is stored in Open WebUI.

## How it Works

When the **Content Extraction Engine** is set to **External** in the Open WebUI Admin Settings, Open WebUI will bypass its internal parsing libraries. Instead, it sends the raw, uploaded file to your specified external service via an HTTP `PUT` request and expects the extracted text to be returned in a specific JSON format.

## Configuration

To use this method, navigate to **Admin Panel** -> **Settings** -> **Documents** -> **Content Extraction Engine** and select **External**.

You will then need to provide the following settings:

- **URL**: The base URL of your external extraction service. Open WebUI will automatically append `/process` to this URL. *(Note: Ensure your URL does not have a trailing slash, or it will become `{URL}//process`).*
- **API Key (Optional)**: If your external service requires authentication, you can provide an API Key here. Open WebUI will pass it as a Bearer token.

## API Specification (For Developers)

If you are building the external service to handle the extraction, it must conform to the following API specification.

### Request
Open WebUI will send a request to `{YOUR_BASE_URL}/process` with the following properties:

- **Method**: `PUT`
- **Body**: The raw binary content of the uploaded file.
- **Headers**:
  - `Content-Type`: The MIME type of the uploaded file (e.g., `application/pdf`, `image/jpeg`, `text/plain`).
  - `Authorization`: `Bearer {API_KEY}` (Only included if an API Key is configured in Open WebUI).
  - `X-Filename`: The URL-encoded original filename of the uploaded document.
  - *Additional Headers*: Open WebUI may also forward custom headers or user-specific metadata headers depending on your environment variables.

### Expected Response
Your service must return an HTTP `200 OK` status with a `JSON` payload. The payload can be either a single JSON object or a JSON array of objects.

Each object **must** contain the following keys:
- `page_content` (string): The extracted text.
- `metadata` (object): A dictionary containing metadata about the extracted content (e.g., page number, source filename).

#### Example JSON Response
```json
[
    {
        "page_content": "This is the extracted text from the first page of the document.",
        "metadata": {
            "page": 1,
            "author": "John Doe"
        }
    },
    {
        "page_content": "This is the extracted text from the second page.",
        "metadata": {
            "page": 2,
            "author": "John Doe"
        }
    }
]
```

## Example: Building a FastAPI External Extraction Service

Here is a minimal example of a FastAPI server that you can run locally to act as your External Document Extraction Engine. 

```python
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
import uvicorn

app = FastAPI()


@app.api_route("/process", methods=["PUT", "POST"])
async def external_process(request: Request):
    original_filename = request.headers.get("x-filename", "")
    content_type = request.headers.get("content-type", "")

    # Read the raw file bytes
    file_bytes = await request.body()
    
    # TODO: Implement your extraction logic here
    # extracted_text = your_processing_function(file_bytes, content_type)
    extracted_text = "Placeholder: Replace this with your actual extraction logic."

    return JSONResponse(
        {
            "page_content": extracted_text,
            "metadata": {
                "source": original_filename or "external_document",
                "content_type": content_type
            }
        }
    )


if __name__ == "__main__":
    # To run this server:
    # pip install fastapi uvicorn
    # python server.py
    uvicorn.run(app, host="0.0.0.0", port=5000)
```

Once this server is running on `http://localhost:5000`, set your Open WebUI External URL to `http://localhost:5000`, and Open WebUI will send uploaded files to this script for extraction.