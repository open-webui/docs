---
sidebar_position: 10
title: "📝 Model Whitelisting"
---

Open WebUI allows you to filter specific models for use in your instance. This feature is especially useful for administrators who want to control which models are available to users. Filtering can be done through the WebUI or by adding environment variables to the backend.

## Filtering via WebUI

![Model Filter Configuration](/img/tutorial_model_filter.png)

1. Go to **Admin Panel > Settings > Users**.
2. In the **Manage Models** section, you can enable or disable the model whitelisting feature, and add or remove models from the whitelist.
3. Click **Save** to apply your changes.

## Filtering via Environment Variables

You can also whitelist models by adding environment variables to the backend. This method is useful for automated deployments and can be done by adding the following environment variables to your `docker run` command:

```bash
-e ENABLE_MODEL_FILTER=True \
-e MODEL_FILTER_LIST="llama2:13b;mistral:latest;gpt-3.5-turbo" \
```

In this example, the `ENABLE_MODEL_FILTER` variable is set to `True` to enable the feature, and the `MODEL_FILTER_LIST` variable lists the models to be whitelisted. The format for the `MODEL_FILTER_LIST` variable is `model_name:version;model_name:version;...`.
