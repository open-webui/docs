---
sidebar_position: 5
title: "File Management"
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

The File Manager lists your files with search and sorting. Click a file to open its details and preview, tick files to download or delete them (several files download as one `files.zip`).

- **Safe Deletion**: Deleting asks for confirmation.
  - :::info **Knowledge Base Cleanup**
    When you delete a file through the File Manager, Open WebUI automatically performs a deep cleanup. It removes the file from all associated Knowledge Bases and deletes its corresponding vector embeddings, ensuring your database stays clean and efficient.
    :::

## Using Files in Open WebUI

Files are at the heart of the platform's advanced capabilities:

### 1. Retrieval Augmented Generation (RAG)
By uploading documents (PDFs, Word docs, text files, etc.), you can ground your AI's responses in your own data.
- **Chat Uploads**: Simply drag and drop files into a chat or use the upload icon.
- **Knowledge Bases**: Add files to a [knowledge base](/features/workspace/knowledge) for more permanent and organized retrieval.

### 2. File Metadata
Every file carries metadata that helps both you and the AI understand its context. This includes content type, original filename, and size.

## Best Practices

- **Naming Conventions**: Use clear, descriptive filenames. This improves the accuracy of the File Manager's search and helps you identify specific documents.
- **Regular Audits**: Periodically use the **Manage Files** dashboard to delete old or redundant documents. This saves disk/database space and improves the performance of your system by ensuring only relevant data is retained.

## FAQ

**Q: If I delete a file, is it gone from my chats?**  
**A:** Yes. Deleting a file via the File Manager removes it from the system entirely. Any chat that referenced that file using RAG will no longer be able to pull information from it. If the file was an image shown in a message, that message displays a small **Image unavailable** placeholder where the picture was, and the placeholder cannot be clicked open.

**Q: Can I download my files back from the File Manager?**  
**A:** Yes, from a file's menu, or **Actions** > **Download** for several files at once.

**Q: Are there limits on the number of files I can manage?**  
**A:** There is no hard-coded limit in Open WebUI. The scalability depends on your storage (disk/S3) and your Vector Database (e.g., ChromaDB, PGVector).

**Q: Does managing files require Admin privileges?**  
**A:** No. The File Manager lists only your *own* uploaded files, for administrators too.
