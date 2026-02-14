---
slug: /features/data-controls/files
sidebar_position: 5
title: "📁 File Management"
---

Open WebUI provides a comprehensive file management system that allows you to upload, organize, and utilize your documents across various features like Knowledge Bases and RAG.

## Centralized File Manager

The **Centralized File Manager** provides a unified interface to view, search, and manage every file you have uploaded to your Open WebUI instance, whether it was uploaded directly to a chat or into a Knowledge Base.

### Accessing the File Manager

1. Click on your **profile name** or avatar in the bottom-left corner.
2. Select **Settings** from the menu.
3. Navigate to the **Data Controls** tab.
4. Locate the **Manage Files** row and click the **Manage** button.

### Key Features

The File Manager modal offers several powerful tools for maintaining your data:

- **Universal Search**: Quickly find any file by its filename using the integrated search bar.
- **Advanced Sorting**: Organize your file list by:
  - **Filename**: Sort alphabetically to find specific documents.
  - **Created At**: See your most recent uploads or find older files.
- **File Details**: View important information at a glance, including:
  - **File Size**: See how much space each document occupies (e.g., KB, MB).
  - **Upload Date**: Track when each file was added to your instance.
- **Built-in Viewer**: Click on any file to open the **File Item Viewer**, which displays the file's metadata and specific details (such as size and type).
- **Safe Deletion**: Easily remove files you no longer need.
  - :::info **Knowledge Base Cleanup**
    When you delete a file through the File Manager, Open WebUI automatically performs a deep cleanup. It removes the file from all associated Knowledge Bases and deletes its corresponding vector embeddings, ensuring your database stays clean and efficient.
    :::

## Using Files in Open WebUI

Files are at the heart of the platform's advanced capabilities:

### 1. Retrieval Augmented Generation (RAG)
By uploading documents (PDFs, Word docs, text files, etc.), you can ground your AI's responses in your own data.
- **Chat Uploads**: Simply drag and drop files into a chat or use the upload icon.
- **Knowledge Bases**: Add files to structured collections for more permanent and organized retrieval.

### 2. File Metadata
Every file carries metadata that helps both you and the AI understand its context. This includes content type, original filename, and size.

## Best Practices

- **Naming Conventions**: Use clear, descriptive filenames. This improves the accuracy of the File Manager's search and helps you identify specific documents.
- **Regular Audits**: Periodically use the **Manage Files** dashboard to delete old or redundant documents. This saves disk/database space and improves the performance of your system by ensuring only relevant data is retained.

## FAQ

**Q: If I delete a file, is it gone from my chats?**  
**A:** Yes. Deleting a file via the File Manager removes it from the system entirely. Any chat that referenced that file using RAG will no longer be able to pull information from it.

**Q: Can I download my files back from the File Manager?**  
**A:** Currently, the File Manager focuses on viewing metadata and management (deletion). To download a file, you should typically access it from the original chat or Knowledge Base where it was used.

**Q: Are there limits on the number of files I can manage?**  
**A:** There is no hard-coded limit in Open WebUI. The scalability depends on your storage (disk/S3) and your Vector Database (e.g., ChromaDB, PGVector).

**Q: Does managing files require Admin privileges?**  
**A:** Regular users can manage their *own* uploaded files. Administrators have additional tools to manage global files and configuration via the Admin Panel.
