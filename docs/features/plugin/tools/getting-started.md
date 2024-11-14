---
sidebar_position: 5
title: "🔧📖  Tool Development Guide"
---
# 🔧📖 Tool Development Guide
This documentation provides a complete guide for developers to create tools compatible with Open WebUI. By following these guidelines, you can ensure that your tools are efficient, user-friendly, and integrate well with the platform.

> **Tip:**  A great way to get more familiar with tools is by exploring [community tools](https://openwebui.com/tools/).
---

## Introduction
Open WebUI allows developers to extend its functionality by building custom tools using **pure python**. To maintain consistency and usability across the platform, it is essential to follow the development standards outlined in this guide.

---

## Class Structure
All tools must be encapsulated in a class named `Tools`. This ensures compatibility with Open WebUI’s architecture.

```python 
class Tools:
    def __init__(self):
        pass
```
### file_handler:
To define a file handler, you need to set the file_handler attribute in your tool's module. This attribute indicates whether the tool has custom logic for handling files. Using file handler in your tool will prevent open webui to later process the files.
Here's an example:

```python
class Tools:
    def __init__(self):
        self.file_handler = True  # Indicates custom file handling logic
    def process_file(self, file_path):
        # Custom file processing logic
        pass
```

### citation:
To share the citation to the sources used by the tool you can use the citation keyword inside your tool. Please check the [event emitters](#event-emitters) section for more information.
Here is an example:

```python
class Tools:
    def __init__(self):
        self.citation = True
```
<!-- --- -->
<!-- ## Import Path Replacements
You can integrate Open WebUI functionalities into your code by using its standardized import paths. These paths allow you to organize and access tools efficiently, supporting streamlined development. The available import paths include from utils, from main, from config, and from apps.

```python
from config import ADMIN_EMAIL
``` -->
<!-- --- -->
## Frontmatter Requirements
Each tool should define its requirements and parameters in the frontmatter. The frontmatter must:

1. Begin and end with triple backticks (""").

2. Start with a description (optional), followed by key-value pairs for parameters.

### Requirements: 
A list of Python packages that the tool depends on. These are specified as a comma-separated string and are installed using pip. Example:

```python
requirements: numpy, pandas
```
### Versioning:
Information about the required version of Open WebUI for compatibility. This ensures that the tool runs on the appropriate version of the platform. Example:

```python
required_open_webui_version: 1.2.3
```
---
## Function Documentation
All functions must use [**Sphinx-style docstrings**](https://sphinx-rtd-tutorial.readthedocs.io/en/latest/docstrings.html) for documentation. This ensures clarity, consistency, and compatibility for generating tool specifications. The docstring will be used to communicate to the model about the tool.

Guidelines:
1. Use Sphinx-style Format: The docstrings should include parameter and return type information.
2. Description: Begin with a brief description of the function.
3. Parameters: Document each parameter with its name and description (except for __user__)

>**Note:** The session user object will be passed automatically when the function is called. 
```python 
"""
Calculate the result of an equation.

:param equation: The equation to calculate.
:type equation: str
:return: The result of the calculation.
:rtype: float
"""
```
---
## Parameters
To use parameters, you need to use type hints for all parameters directly in the function definition.
>**Note:**: Reserved params do not require type hints.
### Some of the supported types for tool parameters: String, Integer, Number, Boolean, Array, Object, Null, Literal, Optional.
```python
 async def get_bbc_news_content(
        self,
        uri: str,
        __event_emitter__,
        __user__,
    ) -> str:
    
```
> **Note:** Set default values for parameters to ensure the tool works properly, even when those parameters are not provided by the end user.



## Valves and User Valves
Valves are optional configurations that control a tool's behavior. The key difference is that valves can only be configured by admins, whereas user valves can be set by any user to suit their individual needs.

They can be defined as follows:

```python
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
```
> **Note:** As you can see, you can give default value to valves and user valves.

## Event Emitters
Event emitters provide a simple and effective way to communicate messages, status updates, and errors to users during the execution of your tool. By including event emitter calls in your function, you can ensure that important updates are displayed in real-time while the final response is being generated.

You can pass event emitter directly to your function as input, and use it as follow:
```python
async def test_function(
        self, prompt: str, __user__: dict, __event_emitter__=None
    ) -> str:
        """
        This is a demo

        :param test: this is a test parameter
        """

        await __event_emitter__(
            {
                "type": "status", # We set the type here
                "data": {"description": "Message that shows up in the chat", "done": False}, 
                # Note done is False here indicating we are still emitting statuses
            }
        )

        # Do some other logic here
        await __event_emitter__(
            {
                "type": "status",
                "data": {"description": "Completed a task message", "done": True},
                # Note done is True here indicating we are done emitting statuses
            }
        )

        except Exception as e:
            await __event_emitter__(
                {
                    "type": "status",
                    "data": {"description": f"An error occured: {e}", "done": True},
                }
            )

            return f"Tell the user: {e}"
```

### Sending messages:
A real-time message will appear at the top of the generated response using the following format:

```python
await __event_emitter__(
                    {
                        "type": "message", # We set the type here
                        "data": {"content": "This message will be appended to the chat."},
                        # Note that with message types we do NOT have to set a done condition
                    }
                )
```

### Citation

It is possible also to sent citations using event emitter with **citation** type:

```python
await __event_emitter__(
                        {
                            "type": "citation",
                            "data": {
                                "document": [result["content"]],
                                "metadata": [{"source": result["url"]}],
                                "source": {"name": result["title"]},
                            },
                        }
)
```







