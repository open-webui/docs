---
sidebar_position: 5
title: "Tools"
---

## What are Tools?
Tools are python scripts that are provided to an LLM at the time of the request. Tools allow LLMs to perform actions and receive additional context as a result. Generally speaking, your LLM of choice will need to support function calling for tools to be reliably utilized.

## How can I use Tools?
[Once installed](#how-to-install-tools), Tools can be used by assigning them to any LLM that supports function calling and then enabling that Tool. To assign a Tool to a model, you need to navigate to Workspace => Models. Here you can select the model for which you’d like to enable any Tools. 

Once you click the pencil icon to edit the model settings, scroll down to the Tools section and check any Tools you wish to enable. Once done you must click save.

Now that Tools are enabled for the model, you can click the “+” icon when chatting with an LLM to use various Tools. Please keep in mind that enabling a Tool does not force it to be used. It means the LLM will be provided the option to call this Tool.

Lastly, we do provide a filter function on the community site that allows LLMs to autoselect Tools without you needing to enable them in the “+” icon menu: https://openwebui.com/f/hub/autotool_filter/

Please note: when using the AutoTool Filter, you will still need to take the steps above to enable the Tools per model.

## How to install Tools
The Tools import process is quite simple. You will have two options:

### Download and import manually
Navigate to the community site: https://openwebui.com/tools/
1) Click on the Tool you wish to import
2) Click the blue “Get” button in the top right-hand corner of the page
3) Click “Download as JSON export”
4) You can now upload the Tool into OpenWebUI by navigating to Workspace => Tools and clicking “Import Tools”

### Import via your OpenWebUI URL
1) Navigate to the community site: https://openwebui.com/tools/
2) Click on the Tool you wish to import
3) Click the blue “Get” button in the top right-hand corner of the page
4) Enter the IP address of your OpenWebUI instance and click “Import to WebUI” which will automatically open your instance and allow you to import the Tool.

Note: You can install your own Tools and other Tools not tracked on the community site using the manual import method. Please do not import Tools you do not understand or are not from a trustworthy source. Running unknown code is ALWAYS a risk.

## What sorts of things can Tools do?
Tools enable diverse use cases for interactive conversations by providing a wide range of functionality such as:

- [**Web Search**](https://openwebui.com/t/constliakos/web_search/): Perform live web searches to fetch real-time information.
- [**Image Generation**](https://openwebui.com/t/justinrahb/image_gen/): Generate images based on the user prompt
- [**External Voice Synthesis**](https://openwebui.com/t/justinrahb/elevenlabs_tts/): Make API requests within the chat to integrate external voice synthesis service ElevenLabs and generate audio based on the LLM output.

## Important Tools Components
### Valves and UserValves - (optional, but HIGHLY encouraged)

Valves and UserValves are used to allow users to provide dyanmic details such as an API key or a configuration option. These will create a fillable field or a bool switch in the GUI menu for the given Tool.

Valves are configurable by admins alone and UserValves are configurable by any users.

<details>
<summary>Example</summary>

```
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
</details>

### Event Emitters
Event Emitters are used to add additional information to the chat interface. Similarly to Filter Outlets, Event Emitters are capable of appending content to the chat. Unlike Filter Outlets, they are not capable of stripping information. Additionally, emitters can be activated at any stage during the Tool.

There are two different types of Event Emitters:

#### Status
This is used to add statuses to a message while it is performing steps. These can be done at any stage during the Tool. These statuses appear right above the message content. These are very useful for Tools that delay the LLM response or process large amounts of information. This allows you to inform users what is being processed in real-time.

```
await __event_emitter__(
            {
                "type": "status", # We set the type here
                "data": {"description": "Message that shows up in the chat", "done": False}, 
                # Note done is False here indicating we are still emitting statuses
            }
        )
```

<details>
<summary>Example</summary>

```
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
</details>

#### Message
This type is used to append a message to the LLM at any stage in the Tool. This means that you can append messages, embed images, and even render web pages before, or after, or during the LLM response.

```
await __event_emitter__(
                    {
                        "type": "message", # We set the type here
                        "data": {"content": "This message will be appended to the chat."},
                        # Note that with message types we do NOT have to set a done condition
                    }
                )
```

<details>
<summary>Example</summary>

```
async def test_function(
        self, prompt: str, __user__: dict, __event_emitter__=None
    ) -> str:
        """
        This is a demo

        :param test: this is a test parameter
        """

        await __event_emitter__(
                    {
                        "type": "message", # We set the type here
                        "data": {"content": "This message will be appended to the chat."},
                        # Note that with message types we do NOT have to set a done condition
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
</details>
