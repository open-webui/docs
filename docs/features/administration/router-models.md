---
sidebar_position: 11
title: "Router Models"
---

A router model looks like any other model in the model selector, and each message it receives goes to one of your real models, which answers. You decide how it picks.

Typical uses:

- Send coding questions to a code model and everything else to a cheaper general model.
- Keep sensitive content on a local model, based on words in the conversation.
- Compare models blind. A router model with two or more default models that picks one at random and hides which one it picked gives you unbiased ratings for the [evaluation leaderboard](/features/administration/evaluation).

## Create a router model

Open **Settings > Models** (admin section), find **Router Models** and click **+**. Give it a name and ID like any model, then add rules. The model shows up in the model selector once you save it.

People also need access to the models a router model uses. Set the router model's access control for who can pick it, and make sure the same people can use the models it routes to.

### Rules

A router model checks its rules in this order, and the first rule that applies decides the model.

| Rule | How it matches |
| :--- | :--- |
| **Patterns** | Regular expressions (not case-sensitive) checked against the conversation. The first pattern that matches wins, and no **Decisions API** call is made. |
| **Conditions** | Plain-language conditions such as "the user asks about programming". One **Decisions API** call scores all of them, and the most likely condition wins if it reaches the **Threshold**. |
| **Default** | Used when no pattern or condition applies. |

Patterns are checked before conditions, each in list order.

Add at least one default model. A request that matches nothing and has no default model fails.

### Default models

Add one or more default models and pick a **Strategy**.

- **First** always uses the top model in the list.
- **Random** needs at least two default models. It picks one per message at random when no pattern or condition applies and hides which one it picked until you open the rating for the response. This is the blind comparison used in [Evaluation](/features/administration/evaluation#1-blind-comparison-with-a-router-model).

### Decisions API

Conditions need a service that scores them. Under **Decisions API**, set the **API Base URL**, **API Key**, **Model** and **Threshold** (a probability from 0 to 1, default 0.5). The service is the same kind used by [Tool Search](/features/extensibility/plugin/tools#tool-search). It is called at most once per request and only when no pattern matches. If the call fails, the router model falls back to its default models.

In a saved chat, the patterns and conditions see the current branch of the conversation up to the new message.

## Set them up from the environment

[`ROUTER_MODELS`](/reference/env-configuration#router_models) takes the same rules as a JSON list, which suits automated deployments.

```json
[
  {
    "id": "smart-router",
    "name": "Smart Router",
    "meta": {
      "routes": [
        { "model_id": "code-model", "pattern": "```|def |function " },
        { "model_id": "legal-model", "condition": "The user asks about contracts or legal questions" },
        { "model_id": "general-model" }
      ],
      "strategy": "first"
    },
    "config": {
      "decisions": {
        "api_base_url": "https://decisions.example.com/v1",
        "api_key": "<your key>",
        "model": "example-decisions-model",
        "threshold": 0.5
      }
    }
  }
]
```
