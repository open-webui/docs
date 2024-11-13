---
sidebar_position: 5
title: "🔗 Pipes"
---

# 🔗 Pipes

If you’re ready to take Open WebUI to the next level, **Pipes** might just be the feature you need. Pipes let you create custom "mini-models" with specific logic that work as independent, fully-functional models in the WebUI interface. 🚀

## TL;DR
- **Pipes** act as standalone models within WebUI, letting you add unique logic and processing. ⚙️
- With Pipes, you can design specialized models or workflows directly in Open WebUI.

### What Are Pipes? 🤔
A Pipe is like a model that you build yourself. You get to define its logic, what it does, and how it processes messages. Pipes can appear as a unique model, enabling custom processing steps beyond the default options in WebUI.

### How Pipes Work 🔍
Pipes are defined by a primary component called the **pipe function**. This is where the logic lives—whether it’s to transform data, format text, or something more specialized.
<p align="center">
  <a href="#">
    <img src="/img/pipelines/pipes.png" alt="Pipe Workflow" />
  </a>
</p>


### Examples of Pipes:
1. **Sentiment Analyzer** 💬 – A pipe that classifies the sentiment of text.
2. **Summarizer** 📄 – Automatically generates a concise summary for long inputs.
3. **Keyword Extractor** 🔑 – Identifies and highlights key terms in user messages.

If you’re looking to add advanced functionality and custom processing to Open WebUI, Pipes are your best friend. 🛠️ They give you the freedom to create unique features that act like personal assistants in your WebUI setup!


## 💻 Getting Started with Pipes
To start using pipes functions you can start by checking the [community functions](https://openwebui.com).[This guide](index.mdx#how-to-install-functions) provides a foundation for setting up an action.


## 📝 Starting with Code

If you’re ready to dive into writing code, start with reading this [document](../start_coding.md).
<summary>Example</summary>

```
class Pipe:
    class Valves(BaseModel):
        RANDOM_CONFIG_OPTION: str = Field(default="")

    def __init__(self):
        self.type = "pipe"
        self.id = "blah"
        self.name = "Testing"
        self.valves = self.Valves(
            **{"RANDOM_CONFIG_OPTION": os.getenv("RANDOM_CONFIG_OPTION", "")}
        )
        pass

    def get_provider_models(self):
        return [
            {"id": "model_id_1", "name": "model_1"},
            {"id": "model_id_2", "name": "model_2"},
            {"id": "model_id_3", "name": "model_3"},
        ]

    def pipe(self, body: dict) -> Union[str, Generator, Iterator]:
      # Logic goes here
      return body
```