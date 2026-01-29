---
sidebar_position: 4
title: "💾 Import & Export"
---

Open WebUI provides tools to backup your chat history and restore it later, or migrate conversations from other platforms.

## Accessing Import & Export

1. Click on your **profile name** or avatar in the bottom-left corner of the sidebar.
2. Select **Settings** from the menu.
3. Navigate to the **Data Controls** tab.
4. Use the **Import Chats** or **Export Chats** buttons.

## Exporting Chats

Click the **Export Chats** button to download all your conversations as a JSON file. This backup includes:

- All chat messages and their metadata
- Model information used in each conversation
- Timestamps and conversation structure

:::tip Regular Backups
It's a good practice to periodically export your chats, especially before major updates or migrations.
:::

## Importing Chats

Click the **Import Chats** button and select a JSON file to restore conversations. Open WebUI supports importing from:

- **Open WebUI exports**: Native JSON format from previous exports
- **ChatGPT exports**: Conversations exported from OpenAI's ChatGPT
- **Other compatible formats**: JSON files following the expected structure

### Import Behavior

- Imported chats are added to your existing conversations (they don't replace them)
- Duplicate detection may vary based on chat IDs
- If using ChatGPT exports, the format is automatically converted

## FAQ

**Q: Will importing chats overwrite my existing conversations?**  
**A:** No. Imported chats are added alongside your existing conversations.

**Q: Can I import chats from Claude, Gemini, or other platforms?**  
**A:** Currently, native import support is available for Open WebUI and ChatGPT formats. Other platforms may require manual conversion to the expected JSON structure.

**Q: Is there a size limit for imports?**  
**A:** There's no hard-coded limit, but very large files may take longer to process. The practical limit depends on your server configuration and available memory.
