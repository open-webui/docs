---
sidebar_position: 2
title: "Apache Tika Extraction"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Apache Tika Extraction

This documentation provides a step-by-step guide to integrating Apache Tika with Open WebUI. Apache Tika is a content analysis toolkit that can be used to detect and extract metadata and text content from over a thousand different file types. All of these file types can be parsed through a single interface, making Tika useful for search engine indexing, content analysis, translation, and much more.

## Prerequisites

- Open WebUI instance
- Docker installed on your system
- Docker network set up for Open WebUI

# Integration Steps

### Step 1: Create a Docker Compose File or Run the Docker Command for Apache Tika

You have two options to run Apache Tika:

**Option 1: Using Docker Compose**

Create a new file named `docker-compose.yml` in the same directory as your Open WebUI instance. Add the following configuration to the file:

```yml
services:
  tika:
    image: apache/tika:latest-full
    container_name: tika
    ports:
      - "9998:9998"
    restart: unless-stopped
```

Run the Docker Compose file using the following command:

```bash
docker compose up -d
```

**Option 2: Using Docker Run Command**

Alternatively, you can run Apache Tika using the following Docker command:

```bash
docker run -d --name tika \
  -p 9998:9998 \
  --restart unless-stopped \
  apache/tika:latest-full
```

Note that if you choose to use the Docker run command, you'll need to specify the `--network` flag if you want to run the container in the same network as your Open WebUI instance.

### Step 2: Configure Open WebUI to Use Apache Tika

To use Apache Tika as the context extraction engine in Open WebUI, follow these steps:

- Log in to your Open WebUI instance.
- Navigate to the `Admin Panel` settings menu.
- Click on `Settings`.
- Click on the `Documents` tab.
- Set **Content Extraction Engine** to **Tika**.
- Set **Tika Server URL** to `http://tika:9998`.
- Set **Tika Server Version** to match the server you are running, **Tika 3.x** or **Tika 4.x**. The two major versions expose different endpoints, so a mismatch makes extraction fail against a server that is otherwise running correctly. The default is **Tika 3.x**, and the same choice is available as [`TIKA_SERVER_VERSION`](/reference/env-configuration#tika_server_version). **Tika 4.x** also extracts to Markdown rather than plain text, so headings, lists and tables reach the model with their structure intact.
- Save the changes.

## Verifying Apache Tika in Docker

To verify that Apache Tika is working correctly in a Docker environment, you can follow these steps:

### 1. Start the Apache Tika Docker Container

First, ensure that the Apache Tika Docker container is running. You can start it using the following command:

```bash
docker run -p 9998:9998 apache/tika
```

This command starts the Apache Tika container and maps port 9998 from the container to port 9998 on your local machine.

### 2. Verify the Server is Running

You can verify that the Apache Tika server is running by sending a GET request:

```bash
curl -X GET http://localhost:9998/tika
```

This command should return the following response:

```txt
This is Tika Server. Please PUT
```

### 3. Verify the Integration

Alternatively, you can also try sending a file for analysis to test the integration. You can test Apache Tika by sending a file for analysis using the `curl` command:

```bash
curl -T test.txt http://localhost:9998/tika
```

Replace `test.txt` with the path to a text file on your local machine.

Apache Tika will respond with the detected metadata and content type of the file.

## Troubleshooting

- Make sure the Apache Tika service is running and accessible from the Open WebUI instance.
- Check the Docker logs for any errors or issues related to the Apache Tika service.
- Verify that **Tika Server URL** is correctly configured in Open WebUI.

## Benefits of Integration

Integrating Apache Tika with Open WebUI provides several benefits, including:

- **Improved Metadata Extraction**: Apache Tika's advanced metadata extraction capabilities can help you extract accurate and relevant data from your files.
- **Support for Multiple File Formats**: Apache Tika supports a wide range of file formats, making it an ideal solution for organizations that work with diverse file types.
- **Enhanced Content Analysis**: Apache Tika's advanced content analysis capabilities can help you extract valuable insights from your files.

## Conclusion

Integrating Apache Tika with Open WebUI is a straightforward process that can improve the metadata extraction capabilities of your Open WebUI instance. By following the steps outlined in this documentation, you can easily set up Apache Tika as a context extraction engine for Open WebUI.
