---
sidebar_position: 12
title: "Improve Local LLM Performance with Dedicated Task Models"
---

## Improve Performance with Dedicated Task Models

Open-WebUI provides several automated features—such as title generation, tag creation, autocomplete, and search query generation—to enhance the user experience. However, these features can generate multiple simultaneous requests to your local model, which may impact performance on systems with limited resources.

This guide explains how to optimize your setup by configuring a dedicated, lightweight task model or by selectively disabling automation features, ensuring that your primary chat functionality remains responsive and efficient.

---

:::tip

## Why Does Open-WebUI Feel Slow?

By default, Open-WebUI has several background tasks that can make it feel like magic but can also place a eavy load on local resources:

- **Title Generation**
- **Tag Generation**
- **Autocomplete Generation** (this function triggers on every keystroke)
- **Search Query Generation**

Each of these features makes asynchronous requests to your model. For example, continuous calls from the utocomplete feature can significantly delay responses on devices with limited memory >or processing power, uch as a Mac with 32GB of RAM running a 32B quantized model.

Optimizing the task model can help isolate these background tasks from your main chat application, improving verall responsiveness.

:::

---

## ⚡ How to Optimize Task Model Performance

Follow these steps to configure an efficient task model:

### Step 1: Access the Admin Panel

1. Open Open-WebUI in your browser.
2. Navigate to the **Admin Panel**.
3. Click on **Settings** in the sidebar.

### Step 2: Configure the Task Model

1. Go to **Interface > Set Task Model**.
2. Choose one of the following options based on your needs:

   - **Lightweight Local Model (Recommended)**
     - Select a compact model such as **Llama 3.2 3B** or **Qwen2.5 3B**.
     - These models offer rapid responses while consuming minimal system resources.

   - **Hosted API Endpoint (For Maximum Speed)**
     - Connect to a hosted API service to handle task processing.
     - This can be very cheap. For example, OpenRouter offers Llama and Qwen models at less than **1.5 cents per million input tokens**.

   - **Disable Unnecessary Automation**
     - If certain automated features are not required, disable them to reduce extraneous background calls—especially features like autocomplete.

![Local Model Configuration Set to Qwen2.5:3b](/images/tutorials/tips/set-task-model.png)

### Step 3: Save Your Changes and Test

1. Save the new configuration.
2. Interact with your chat interface and observe the responsiveness.
3. If necessary, adjust by further disabling unused automation features or experimenting with different task models.

---

## 🚀 Recommended Setup for Local Models

| Optimization Strategy           | Benefit                                  | Recommended For                        |
|---------------------------------|------------------------------------------|----------------------------------------|
| **Lightweight Local Model**     | Minimizes resource usage                 | Systems with limited hardware          |
| **Hosted API Endpoint**         | Offers the fastest response times        | Users with reliable internet/API access|
| **Disable Automation Features** | Maximizes performance by reducing load   | Those focused on core chat functionality|

Implementing these recommendations can greatly improve the responsiveness of Open-WebUI while allowing your local models to efficiently handle chat interactions.

---

## 💡 Additional Tips

- **Monitor System Resources:** Use your operating system’s tools (such as Activity Monitor on macOS or Task Manager on Windows) to keep an eye on resource usage.
- **Reduce Parallel Model Calls:** Limiting background automation prevents simultaneous requests from overwhelming your LLM.
- **Experiment with Configurations:** Test different lightweight models or hosted endpoints to find the optimal balance between speed and functionality.
- **Stay Updated:** Regular updates to Open-WebUI often include performance improvements and bug fixes, so keep your software current.

---

By applying these configuration changes, you'll support a more responsive and efficient Open-WebUI experience, allowing your local LLM to focus on delivering high-quality chat interactions without unnecessary delays.
