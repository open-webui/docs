---
sidebar_position: 2
title: "AUTOMATIC1111"
---

:::warning
本教程由社区贡献，不受 Open WebUI 团队支持。它仅演示如何针对你的具体用例定制 Open WebUI。想要贡献内容？请查看贡献教程。
:::

Open WebUI 支持通过 **AUTOMATIC1111** [API](https://github.com/AUTOMATIC1111/stable-diffusion-webui/wiki/API) 生成图像。入门步骤如下：

### 初始设置 {#initial-setup}

1. 确保已安装 [AUTOMATIC1111](https://github.com/AUTOMATIC1111/stable-diffusion-webui)。
2. 使用附加参数启动 AUTOMATIC1111，以启用 API 访问：

```python
/webui.sh --api --listen
```

### 将 Open WebUI 与 AUTOMATIC1111 搭配使用 {#setting-up-open-webui-with-automatic1111}

1. 在 Open WebUI 中，进入**设置** > **图像**（管理员区域），开启**图像生成**并添加连接。
2. 将**连接类型**设为 **AUTOMATIC1111**。
3. 在 **URL** 中输入可访问 AUTOMATIC1111 API 的地址：

```txt
http://<your_automatic1111_address>:7860/
```

如果你在 Docker 中运行 Open WebUI，并在同一台主机上运行 AUTOMATIC1111，请使用 `http://host.docker.internal:7860/` 作为地址。

4. 如果 AUTOMATIC1111 需要身份验证，请选择 **Basic** 身份验证类型并输入 `username:password`。
5. 将**模型 ID**留空可使用当前加载的检查点，也可以添加检查点名称以提供这些模型。选择列表中的另一个模型，会为所有使用该服务器的用户切换当前加载的检查点。
6. 可选择打开**高级**，添加额外参数，例如 `{"cfg_scale": 7, "sampler_name": "Euler a"}`。
7. 设置**访问控制**并点击**保存**。未授予访问权限时，只有管理员可以使用此连接。

AUTOMATIC1111 连接用于图像生成。如需编辑图像，请添加 ComfyUI 或 OpenAI 兼容连接。
