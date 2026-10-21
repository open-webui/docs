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

The File Manager modal offers several powerful tools for maintaining your data:

- **Universal Search**: Quickly find any file by its filename using the integrated search bar.
- **Advanced Sorting**: Organize your file list by:
  - **Filename**: Sort alphabetically to find specific documents.
  - **Created At**: See your most recent uploads or find older files.
- **File Details**: View important information at a glance, including:
  - **File Size**: See how much space each document occupies (e.g., KB, MB).
  - **Upload Date**: Track when each file was added to your instance.
- **Built-in Viewer**: Click on any file to open the **File Item Viewer**, which displays the file's metadata and specific details (such as size and type).
  - **Preview tab**: Word documents, presentations, spreadsheets, PDFs, audio, code and Markdown open on a **Content** tab showing the extracted text, with a **Preview** tab beside it that renders the file itself. Word documents (`.docx`) render as pages, keeping headers, footers, footnotes and embedded images, and presentations (`.pptx`) open in a slide viewer with a numbered thumbnail strip. Both can be zoomed from the small toolbar that floats over the preview. The same viewer opens when you click a file attached in a chat or on a note.
- **Selection**: Tick the checkbox on a row to select that file, or the checkbox in the header to select every loaded file. When the list has more files than are loaded, **Select all matching files** then selects every file that matches the current search. The selection count shows next to the search bar.
- **Download**: Use **Download** in a file's row menu, or in the **Actions** menu for the selection. Several files download as one `files.zip` archive.
- **Safe Deletion**: Easily remove files you no longer need, one at a time from the row menu or as a selection from the **Actions** menu. Open WebUI asks for confirmation first. Holding **Shift** while clicking **Delete** on a single file deletes it without the confirmation. While a bulk delete or download runs, a progress line shows how many files are done, with a **Stop** button that ends the run after the current files.
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
**A:** Yes. Deleting a file via the File Manager removes it from the system entirely. Any chat that referenced that file using RAG will no longer be able to pull information from it. If the file was an image shown in a message, that message displays a small **Image unavailable** placeholder where the picture was, and the placeholder cannot be clicked open.

**Q: Can I download my files back from the File Manager?**  
**A:** Yes. Use **Download** in a file's row menu, or select several files and use **Actions** > **Download** to get them as one `files.zip` archive.

**Q: Are there limits on the number of files I can manage?**  
**A:** There is no hard-coded limit in Open WebUI. The scalability depends on your storage (disk/S3) and your Vector Database (e.g., ChromaDB, PGVector).

**Q: Does managing files require Admin privileges?**  
**A:** No. The File Manager lists only your *own* uploaded files. This holds for administrators too, also when `BYPASS_ADMIN_ACCESS_CONTROL` is on. Administrators have additional tools to manage global files and configuration via the Admin Panel.
