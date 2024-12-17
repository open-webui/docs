---
sidebar_position: 0
title: "🤖 Models"
---

The `Models` section of the `Workspace` within Open WebUI is a powerful tool that allows you to create and manage custom models tailored to specific purposes. This section serves as a central hub for all your modelfiles, providing a range of features to edit, clone, share, export, and hide your models.

### Modelfile Management

From the `Models` section, you can perform the following actions on your modelfiles:

* **Edit**: Dive into the details of your modelfile and make changes to its character and more.
* **Clone**: Create a copy of a modelfile, which will be appended with `-clone` to the cloned `Model ID`. Note that you cannot clone a base model; you must create a model first before cloning it.
* **Share**: Share your modelfile with the Open WebUI community by clicking the `Share` button, which will redirect you to [https://openwebui.com/models/create](https://openwebui.com/models/create).
* **Export**: Download the modelfile's `.json` export to your PC.
* **Hide**: Hide the modelfile from the model selector dropdown within chats.

### Modelfile Editing

When editing a modelfile, you can customize the following settings:

* **Avatar Photo**: Upload an avatar photo to represent your modelfile.
* **Model Name**: Change the name of your modelfile.
* **System Prompt**: Provide an optional system prompt for your modelfile.
* **Model Parameters**: Adjust the parameters of your modelfile.
* **Prompt Suggestions**: Add prompts that will be displayed on a fresh new chat page.
* **Documents**: Add documents to the modelfile (always RAG [Retrieval Augmented Generation]).
* **Tools, Filters, and Actions**: Select the tools, filters, and actions that will be available to the modelfile.
* **Vision**: Toggle to enable `Vision` for multi-modals.
* **Tags**: Add tags to the modelfile that will be displayed beside the model name in the model selector dropdown.

### Model Discovery and Import/Export

The `Models` section also includes features for importing and exporting models:

* **Import Models**: Use this button to import models from a .json file or other sources.
* **Export Models**: Use this button to export all your modelfiles in a single .json file.

To download models, navigate to the **Ollama Settings** in the Connections tab.
Alternatively, you can also download models directly by typing a command like `ollama run hf.co/[model creator]/[model name]` in the model selection dropdown.
This action will create a button labeled "Pull [Model Name]" for downloading.

### Model Switching

   **Example**: Switching between **Mistral**, **LLaVA**, and **GPT-3.5** in a Multi-Stage Task

* **Scenario**: A multi-stage conversation involves different task types, such as starting with a simple FAQ, interpreting an image, and then generating a creative response.
* **Reason for Switching**: The user can leverage each model's specific strengths for each stage:
  * **Mistral** for general questions to reduce computation time and costs.
  * **LLaVA** for visual tasks to gain insights from image-based data.
  * **GPT-3.5** for generating more sophisticated and nuanced language output.
* **Process**: The user switches between models, depending on the task type, to maximize efficiency and response quality.

    **How To**:
    1. **Select the Model**: Within the chat interface, select the desired models from the model switcher dropdown. You can select up to two models simultaneously, and both responses will be generated. You can then navigate between them by using the back and forth arrows.
    2. **Context Preservation**: Open WebUI retains the conversation context across model switches, allowing smooth transitions.
