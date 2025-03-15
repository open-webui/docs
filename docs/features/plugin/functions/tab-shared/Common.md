## Shared Function Components

### Valves and UserValves - (optional, but HIGHLY encouraged)

Valves and UserValves are used to allow users to provide dynamic details such as an API key or a configuration option. These will create a fillable field or a bool switch in the GUI menu for the given function.

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
            default=4, description="A valve controlling a numerical value"
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
Event Emitters are used to add additional information to the chat interface. Similarly to Filter Outlets, Event Emitters are capable of appending content to the chat. Unlike Filter Outlets, they are not capable of stripping information. Additionally, emitters can be activated at any stage during the function.

There are two different types of Event Emitters:

#### Status
This is used to add statuses to a message while it is performing steps. These can be done at any stage during the Function. These statuses appear right above the message content. These are very useful for Functions that delay the LLM response or process large amounts of information. This allows you to inform users what is being processed in real-time.

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
This type is used to append a message to the LLM at any stage in the Function. This means that you can append messages, embed images, and even render web pages before, or after, or during the LLM response.

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
