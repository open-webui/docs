---
sidebar_position: 5
title: "💬 Actions "
---

# 💬 Actions

Ever wanted a 🔘 button that lets you quickly do something with the AI’s response? That’s where **Actions** come in. Actions in Open WebUI are mini-interactive elements you can attach to individual chat messages, making interactions smoother and more efficient. ⚡

## TL;DR
- **Actions** are buttons or interactive elements you can add to chat messages.
- They allow users to interact with messages—such as confirming, adding notes, or triggering additional responses.

### What Are Actions? 🤔
Actions allow you to place buttons right below any chat message, making it super easy for users to respond to prompts, confirm information, or trigger a new task based on the conversation.

### How Do Actions Work? ⚙️
Actions are created with a primary component, the **action function**, which defines what happens when the button is clicked. For instance, an action might open a small text input where users can add feedback or perform a secondary task.

### Examples of Actions:
1. **Confirm Action**  – Users click to confirm an instruction or agreement.
2. **Add Feedback**  – Opens a text box to input additional information.
3. **Quick Reply**  – Buttons for fast responses like “Yes” or “No”.

By making interactions intuitive, Actions create a better user experience within Open WebUI, helping users stay engaged and making workflows faster and easier to manage.

Some of the actual usecases includes:
- Grant permission before performing a specific task
- Generate visualizations of structured data 
- Download audio snippets of chats 
- Enable other interactive use cases for a richer messaging experience

## 💻 Getting Started with Actions
To start using action functions you can start by checking the [community functions](https://openwebui.com).[This guide](index.mdx#how-to-install-functions) provides a foundation for setting up an action.

## 📊 Example: Graph Visualization Action

For example, a graph visualization Action can enrich user interactions by enabling real-time data visuals. Check out the example below to see it in action:

<p align="center">
  <a href="#">
    <img src="/img/pipelines/graph-viz-action.gif" alt="Graph Visualization Action" />
  </a>
</p>

Explore and experiment to make your interactions more dynamic and engaging with **Actions**!



## 📝 Starting with Code

If you’re ready to dive into writing code, start with reading this [document](../getting_started.md). You can also use the **Action code scaffold** available in [the community section](https://openwebui.com/f/hub/custom_action/).

Actions have a single main component called an action function. This component takes an object defining the type of action and the data being processed.

<summary>Example</summary>

```
async def action(
        self,
        body: dict,
        __user__=None,
        __event_emitter__=None,
        __event_call__=None,
    ) -> Optional[dict]:
        print(f"action:{__name__}")

        response = await __event_call__(
            {
                "type": "input",
                "data": {
                    "title": "write a message",
                    "message": "here write a message to append",
                    "placeholder": "enter your message",
                },
            }
        )
        print(response)
```


 
