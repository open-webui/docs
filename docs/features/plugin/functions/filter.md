---
sidebar_position: 5
title: "🚦 Filters"
---

# 🚦 Filters

When using Open WebUI, not all user messages or model outputs might be perfectly suited for every conversation—this is where **Filters** come to the rescue. Filters let you control what goes in and out, ensuring that only the most relevant content reaches your chat or model.

## TL;DR
- **Filters** are used to pre-process (edit) incoming user messages or post-process (tweak) the AI’s responses. 
- Filters help you adjust content on the fly, adding flexibility for sensitive topics, formatting, or message simplification. 

### Why Use Filters? 🤔
Filters are ideal for adding rules to chat interactions, like removing specific keywords or reformatting text.

### Examples of Filters:
1. **Profanity Filter** 🚫 – Screens and removes inappropriate words from user messages.
2. **Format Adjuster** ✨ – Automatically reformats incoming or outgoing text for consistency.
3. **Spam Blocker** 🛑 – Filters out repetitive or unwanted messages.
4. **Resize Pictures** 📷 - Make the image smaller in size before giving it to the model.

By setting up Filters, you control the flow of your conversation, ensuring that interactions are smooth, clean, and always relevant!

## 💻 Getting Started with Filters
To start using filter functions you can start by checking the [community functions](https://openwebui.com).[This guide](index.mdx#how-to-install-functions) provides a foundation for setting up a filter.

<!-- To start creating filter functions, use the **Action code scaffold** available in [the community section](https://openwebui.com/f/hub/custom_action/). [This guide](index.mdx#how-to-install-functions) provides a foundation for setting up custom Actions tailored to your needs. -->

### How Filters Work
Filters work with two main components:
1. **Inlet** – Pre-processes a user’s message before sending it to the model.
2. **Outlet** – Adjusts the model’s response after it’s generated.

When a filter pipeline is enabled on a model or pipe, the incoming message from the user (or "inlet") is passed to the filter for processing. The filter performs the desired action against the message before requesting the chat completion from the LLM model. Finally, the filter performs post-processing on the outgoing LLM message (or "outlet") before it is sent to the user.



<!-- # Filters
Filters are used to perform actions against incoming user messages and outgoing assistant (LLM) messages. Potential actions that can be taken in a filter include sending messages to monitoring platforms (such as Langfuse or DataDog), modifying message contents, blocking toxic messages, translating messages to another language, or rate limiting messages from certain users. A list of examples is maintained in the [Pipelines repo](https://github.com/open-webui/pipelines/tree/main/examples/filters). Filters can be executed as a Function or on a Pipelines server. The general workflow can be seen in the image below. -->

<p align="center">
  <a href="#">
    <img src="/img/pipelines/filters.png" alt="Filter Workflow" />
  </a>
</p>


## 📝 Starting with Code

If you’re ready to dive into writing code, start with reading this [document](../getting_started.md).


<summary>Example</summary>

```
class Filter:
    # Define and Valves
    class Valves(BaseModel):
        priority: int = Field(
            default=0, description="Priority level for the filter operations."
        )
        test_valve: int = Field(
            default=4, description="A valve controlling a numberical value"
        )
        pass

    # Define any UserValves
    class UserValves(BaseModel):
        test_user_valve: bool = Field(
            default=False, description="A user valve controlling a True/False (on/off) switch"
        )
        pass

    def __init__(self):
        self.valves = self.Valves()
        pass

    def inlet(self, body: dict, __user__: Optional[dict] = None) -> dict:
        print(f"inlet:{__name__}")
        print(f"inlet:body:{body}")
        print(f"inlet:user:{__user__}")

        # Pre-processing logic here

        return body

    def outlet(self, body: dict, __user__: Optional[dict] = None) -> dict:
        print(f"outlet:{__name__}")
        print(f"outlet:body:{body}")
        print(f"outlet:user:{__user__}")

        # Post-processing logic here

        return body
```