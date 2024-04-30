---
sidebar_position: 5
title: "模型白名单"
---

# 模型白名单

Open WebUI 允许您过滤特定模型以在您的实例中使用。此功能对于希望控制哪些模型对用户可用的管理员特别有用。可以通过 WebUI 进行过滤，也可以通过向后端添加环境变量来完成。

## 通过 WebUI 进行过滤

![模型过滤配置](/img/tutorial_model_filter.png)

1. 转到 **管理面板 > 管理设置**。
2. 在 **管理模型** 部分，您可以启用或禁用该功能，并添加或从白名单中删除模型。
3. 单击 **保存** 以应用更改。

## 通过环境变量进行过滤

您还可以通过向后端添加环境变量来将模型添加到白名单中。此方法对于自动化部署非常有用，可以通过将以下环境变量添加到您的 `docker run` 命令来完成：

```bash
-e MODEL_FILTER_ENABLED=True \
-e MODEL_FILTER_LIST="llama2:13b;mistral:latest;gpt-3.5-turbo" \
```

在此示例中，`MODEL_FILTER_ENABLED` 变量设置为 `True` 以启用该功能，`MODEL_FILTER_LIST` 变量列出要列入白名单的模型。`MODEL_FILTER_LIST` 变量的格式为 `model_name:version;model_name:version;...`。
