@ -0,0 +1,125 @@
---
sidebar_position: 5
title: "🔧 Coding Functions"
---

# 🔧 Coding Functions

Alright, so you're ready to dive into coding custom functions in Open WebUI! Whether you're here to enhance the WebUI experience, enable new AI capabilities, or automate tasks, this guide will make sure you know exactly how to get started. We’ll walk through the essentials of setting up a function, configuring user input options, and using real-time updates in the chat interface.

## TL;DR

- **Valves & UserValves** allow for dynamic configuration by admins and users, making functions adaptable.
- **Event Emitters** add real-time updates to the chat interface, letting users know the status of ongoing processes.
- Starting a new function requires defining parameters, logic, and configuration options.

## Let's Get Coding! 🛠️

Open WebUI functions are like adding superpowers to your WebUI! They allow you to introduce custom interactions, gather user input, and control behavior right within the platform.

Here’s a step-by-step guide to help you start:

### Step 1: Define Your Function

Every function in Open WebUI starts as a Python method. This function is where all the logic lives—whether it’s fetching data, transforming information, or communicating with an external API.

```python
async def my_first_function(self, prompt: str, __user__: dict) -> str:
    """
    This is a demo function to get started.

    :param prompt: The main text input from the user.
    :param __user__: User information for personalized responses.
    """
    # Function logic goes here!
    return "Hello, Open WebUI!"
```

## Step 2: Add Dynamic Inputs with Valves and UserValves 💡

Functions can be configured with **Valves** and **UserValves** to make them more flexible.

- **Valves**: These are admin-controlled fields that allow administrators to set parameters.
- **UserValves**: These are user-configurable options like switches or fields, letting users set details such as an API key or enabling/disabling specific features.

### Example Usage of Valves and UserValves

To set up these fields, define them as classes:

```python
class Valves(BaseModel):
    priority: int = Field(
        default=0, description="Priority level for the function."
    )
    max_attempts: int = Field(
        default=3, description="Maximum number of attempts allowed."
    )

class UserValves(BaseModel):
    enable_notifications: bool = Field(
        default=False, description="Toggle notifications for the function."
    )

def __init__(self):
    self.valves = self.Valves()
    self.user_valves = self.UserValves()

```

## Step 3: Keep Users Updated with Event Emitters ⏳
:::tip
If your goal is communicate to the models, you need to use these fucntions.
:::

**Event Emitters** make your functions interactive by adding status messages or updates to the chat interface.

### Types of Event Emitters:

- **Status**: Shows real-time updates like “Processing…” or “Almost done!”
- **Message**: Adds custom messages at any stage, even embedding images or links.

#### Example of a Status Event Emitter

```python
await __event_emitter__(
    {
        "type": "status",
        "data": {"description": "Processing your request...", "done": False}
    }
)
# Perform some processing
await __event_emitter__(
    {
        "type": "status",
        "data": {"description": "Completed processing!", "done": True}
    }
)
```
### Example of a Message Event Emitter
```python
await __event_emitter__(
    {
        "type": "message",
        "data": {"content": "Here’s your data! 📊"}
    }
)
```

## Step 4: Handle Errors Gracefully 🚨
To make your functions user-friendly, handle any exceptions and send a clear message back to the user.

```python
except Exception as e:
    await __event_emitter__(
        {
            "type": "status",
            "data": {"description": f"An error occurred: {e}", "done": True},
        }
    )
    return f"Oops! Something went wrong: {e}"
```

# Putting It All Together 🎉
With **Valves** and **UserValves**, you control input options. Event Emitters keep users informed with real-time updates. These components, combined with well-structured function logic, make Open WebUI functions versatile and user-centric.

Now you’re all set to start coding your own custom functions! Please check the specific section related to each function for more details! The community website can also be a great source of working code! 💻🌐