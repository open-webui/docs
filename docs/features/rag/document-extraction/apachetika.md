---
sidebar_position: 4000
title: "Apache Tika Extraction"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## 🪶 Apache Tika Extraction

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
docker-compose up -d
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
- Change the `Default` content extraction engine dropdown to `Tika`.
- Update the context extraction engine URL to `http://tika:9998`.
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

### Using a Script to Verify Apache Tika

If you want to automate the verification process, this script sends a file to Apache Tika and checks the response for the expected metadata. If the metadata is present, the script will output a success message along with the file's metadata; otherwise, it will output an error message and the response from Apache Tika.

```python
import requests

def verify_tika(file_path, tika_url):
    try:
        # Send the file to Apache Tika and verify the output
        response = requests.put(tika_url, files={'file': open(file_path, 'rb')})

        if response.status_code == 200:
            print("Apache Tika successfully analyzed the file.")
            print("Response from Apache Tika:")
            print(response.text)
        else:
            print("Error analyzing the file:")
            print(f"Status code: {response.status_code}")
            print(f"Response from Apache Tika: {response.text}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    file_path = "test.txt"  # Replace with the path to your file
    tika_url = "http://localhost:9998/tika"

    verify_tika(file_path, tika_url)
```

Instructions to run the script:

### Prerequisites

- Python 3.x must be installed on your system
- `requests` library must be installed (you can install it using pip: `pip install requests`)
- Apache Tika Docker container must be running (use `docker run -p 9998:9998 apache/tika` command)
- Replace `"test.txt"` with the path to the file you want to send to Apache Tika

### Running the Script

1. Save the script as `verify_tika.py` (e.g., using a text editor like Notepad or Sublime Text)
2. Open a terminal or command prompt
3. Navigate to the directory where you saved the script (using the `cd` command)
4. Run the script using the following command: `python verify_tika.py`
5. The script will output a message indicating whether Apache Tika is working correctly

:::note

Note: If you encounter any issues, ensure that the Apache Tika container is running correctly and that the file is being sent to the correct URL.

:::

### Conclusion

By following these steps, you can verify that Apache Tika is working correctly in a Docker environment. You can test the setup by sending a file for analysis, verifying the server is running with a GET request, or use a script to automate the process. If you encounter any issues, ensure that the Apache Tika container is running correctly and that the file is being sent to the correct URL.

## Troubleshooting

- Make sure the Apache Tika service is running and accessible from the Open WebUI instance.
- Check the Docker logs for any errors or issues related to the Apache Tika service.
- Verify that the context extraction engine URL is correctly configured in Open WebUI.

## Benefits of Integration

Integrating Apache Tika with Open WebUI provides several benefits, including:

- **Improved Metadata Extraction**: Apache Tika's advanced metadata extraction capabilities can help you extract accurate and relevant data from your files.
- **Support for Multiple File Formats**: Apache Tika supports a wide range of file formats, making it an ideal solution for organizations that work with diverse file types.
- **Enhanced Content Analysis**: Apache Tika's advanced content analysis capabilities can help you extract valuable insights from your files.

## Conclusion

Integrating Apache Tika with Open WebUI is a straightforward process that can improve the metadata extraction capabilities of your Open WebUI instance. By following the steps outlined in this documentation, you can easily set up Apache Tika as a context extraction engine for Open WebUI.
