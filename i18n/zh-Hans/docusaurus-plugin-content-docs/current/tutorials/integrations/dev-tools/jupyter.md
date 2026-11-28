---
sidebar_position: 30
title: "Jupyter Notebooks"
---

> [!WARNING]
> 本文档基于当前版本（0.5.16）编写，并会持续更新。

# Jupyter Notebook 集成

:::warning

本教程由社区贡献，不受 Open WebUI 团队支持。它仅用于演示如何针对你的特定用例自定义 Open WebUI。想要贡献内容？请查看贡献教程。

:::

从 v0.5.11 开始，Open WebUI 发布了一项名为 `Jupyter Notebook Support in Code Interpreter` 的新功能。此功能允许你将 Open WebUI 与 Jupyter 集成。后续版本已经对此功能进行了多项改进，因此请仔细查看发行说明。

本教程将介绍在两个服务之间建立连接的基本设置。

- [查看 v0.5.11 发行说明](https://github.com/open-webui/open-webui/releases/tag/v0.5.11)
- [查看 v0.5.15 发行说明](https://github.com/open-webui/open-webui/releases/tag/v0.5.15)

## 什么是 Jupyter Notebook {#what-are-jupyter-notebooks}

Jupyter Notebook 是一款开源 Web 应用程序，允许用户创建和共享包含实时代码、方程、可视化内容和叙述性文本的文档。它在数据科学、科学计算和教育领域尤其受欢迎，因为它使用户能够将可执行代码（使用 Python、R 或 Julia 等语言）与解释性文本、图像和交互式可视化内容整合在一个文档中。Jupyter Notebook 对数据分析和探索尤其有用，因为它允许用户以易于管理的小段代码执行程序，同时记录自己的思考过程和发现。这种格式让实验、代码调试以及创建全面且可共享的报告变得简单，报告既能展示分析过程，也能展示结果。

更多信息请访问 Jupyter 网站：[Project Jupyter](https://jupyter.org/)

## 第 0 步：配置摘要 {#step-0-configuration-summary}

以下是本教程将要设置的目标配置。

![代码执行配置](/images/tutorials/jupyter/jupyter-code-execution.png)

# 第 1 步：启动 OUI 和 Jupyter

为此，我使用 Docker Compose 启动了一个包含这两个服务以及我的 LLM 的技术栈；如果分别运行每个 Docker 容器，这种方式也应该有效。

```yaml title="docker-compose.yml"
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:latest
    container_name: open-webui
    ports:
      - "3000:8080"
    volumes:
      - open-webui:/app/backend/data
    extra_hosts:
      - host.docker.internal:host-gateway

  jupyter:
    image: jupyter/minimal-notebook:latest
    container_name: jupyter-notebook
    ports:
      - "8888:8888"
    volumes:
      - jupyter_data:/home/jovyan/work
    environment:
      - JUPYTER_ENABLE_LAB=yes
      - JUPYTER_TOKEN=123456

volumes:
  open-webui:
  jupyter_data:
```

`extra_hosts` 行使 `host.docker.internal` 能够在 Linux 上解析，下面的 `CODE_EXECUTION_JUPYTER_URL` 依赖于此；在此 Compose 项目中，`http://jupyter:8888` 同样有效。

你可以在保存 `docker-compose.yml` 文件的目录中运行以下命令，启动上述技术栈：

```bash title="运行 Docker Compose"
docker compose up -d
```

现在，你应该能够通过以下 URL 访问这两个服务：

| 服务 | URL |
| ---------- | ----------------------- |
| Open WebUI | `http://localhost:3000` |
| Jupyter | `http://localhost:8888` |

访问 Jupyter 服务时，你需要使用上面定义的 `JUPYTER_TOKEN`。在本教程中，我选择的虚拟令牌值为 `123456`。

![Jupyter 登录页面要求输入密码或令牌](/images/tutorials/jupyter/jupyter-token.png)

# 第 2 步：为 Jupyter 配置代码执行

现在 Open WebUI 和 Jupyter 都已运行，我们需要在 Settings > Code Execution（管理员区域的 Legacy 下）中配置 Open WebUI 的代码执行功能以使用 Jupyter。由于 Open WebUI 不断发布和改进此功能，我建议始终查看 [`configs.py` 文件](https://github.com/open-webui/open-webui/blob/6fedd72e3973e1d13c9daf540350cd822826bf27/backend/open_webui/routers/configs.py#L72)中可能提供的最新配置。其中包括：

| Open WebUI 环境变量 | 值 |
| ------------------------------------- | -------------------------------- |
| `ENABLE_CODE_INTERPRETER` | True |
| `CODE_EXECUTION_ENGINE` | jupyter |
| `CODE_EXECUTION_JUPYTER_URL` | http://host.docker.internal:8888 |
| `CODE_EXECUTION_JUPYTER_AUTH` | token |
| `CODE_EXECUTION_JUPYTER_AUTH_TOKEN` | 123456 |
| `CODE_EXECUTION_JUPYTER_TIMEOUT` | 60 |
| `CODE_INTERPRETER_ENGINE` | jupyter |
| `CODE_INTERPRETER_JUPYTER_URL` | http://host.docker.internal:8888 |
| `CODE_INTERPRETER_JUPYTER_AUTH` | token |
| `CODE_INTERPRETER_JUPYTER_AUTH_TOKEN` | 123456 |
| `CODE_INTERPRETER_JUPYTER_TIMEOUT` | 60 |

这些是持久化的管理员设置：环境变量仅在全新数据库的首次启动时生效；之后，以数据库中保存的值为准（在 **Settings > Code Execution** 中更改，该设置位于管理员区域的 **Legacy** 下），除非 `ENABLE_PERSISTENT_CONFIG=False`。`CODE_EXECUTION_JUPYTER_AUTH` 仅接受 `token` 或 `password`；任何其他值都不会发送凭据，而密码模式会通过 Jupyter 的 `/login` 表单登录。`CODE_INTERPRETER_JUPYTER_*` 变量默认使用对应的 `CODE_EXECUTION_JUPYTER_*` 变量值，但 `CODE_INTERPRETER_ENGINE` 不会（它默认为 `pyodide`），因此请设置这两个引擎变量。

将 Jupyter 设为引擎后，默认开启的 [`ENABLE_ORJSON`](/reference/env-configuration#enable_orjson) 可以更快地将运行输出显示到聊天中；当代码打印大量内容或生成图像时，这一点最为明显。请将其保持为 `True`；它只在启动时读取一次，因此更改后需要重启。

## 第 3 步：测试连接 {#step-3-test-the-connection}

首先，确认 Jupyter 目录中的内容。如下图所示，我们只有一个空的 `work` 文件夹。

![已打开 Launcher 的空 Jupyter 工作区](/images/tutorials/jupyter/jupyter-empty.png)

### 创建 CSV {#create-a-csv}

让我们运行第一个提示词。确保你已选择 `Code Execution` 按钮。

```txt
Prompt: Create two CSV files using fake data. The first CSV should be created using vanilla python and the second CSV should be created using the pandas library. Name the CSVs data1.csv and data2.csv
```

![Open WebUI 聊天，其中模型使用代码解释器写入两个 CSV 文件](/images/tutorials/jupyter/jupyter-create-csv.png)

可以看到 CSV 文件已创建，现在可以在 Jupyter 中访问。

![在 Jupyter 中打开的 data1.csv，文件浏览器中旁边是 data2.csv](/images/tutorials/jupyter/jupyter-view-csv.png)

### 创建可视化内容 {#create-a-visualization}

让我们运行第二个提示词。同样，确保你已选择 `Code Execution` 按钮。

```txt
Prompt: Create several visualizations in python using matplotlib and seaborn and save them to jupyter
```

![Open WebUI 聊天，其中模型创建 matplotlib 和 seaborn 图表](/images/tutorials/jupyter/jupyter-create-viz.png)

可以看到可视化内容已创建，现在可以在 Jupyter 中访问。

![模型保存的 Seaborn 箱线图，已在 Jupyter 中打开](/images/tutorials/jupyter/jupyter-view-viz.png)

### 创建 Notebook {#create-a-notebook}

让我们一起运行最后一个提示词。在这个提示词中，我们将仅使用一段提示词创建一个全新的 Notebook。

```txt
Prompt: Write python code to read and write json files and save it to my notebook called notebook.ipynb
```

![Open WebUI 聊天，其中模型写入名为 notebook.ipynb 的 Notebook](/images/tutorials/jupyter/jupyter-create-notebook.png)

可以看到可视化内容已创建，现在可以在 Jupyter 中访问。

![在 Jupyter 中打开的 notebook.ipynb，包含一个 Markdown 单元格和两个代码单元格](/images/tutorials/jupyter/jupyter-view-notebook.png)

## 工作流程说明 {#note-about-workflow}

在测试此功能时，我多次注意到，Open WebUI 不会自动将其中生成的代码或输出保存到我的 Jupyter 实例。为了强制它输出我创建的文件/项目，我经常采用以下两步工作流程：先创建所需的代码产物，再要求它将其保存到我的 Jupyter 实例。这是有意设计的行为：每次执行都会启动一个全新的内核，并在完成后将其删除，因此变量和内存中的对象绝不会在多次运行之间持久化，只有写入磁盘的文件会保留下来。

![聊天概览，显示创建并保存 Notebook 的提示词和回答](/images/tutorials/jupyter/jupyter-workflow.png)

## 你如何使用此功能？ {#how-are-you-using-this-feature}

你是否正在使用代码执行功能和/或 Jupyter？如果是，请联系我们。我很想了解你的使用方式，以便继续在本教程中添加示例，展示此功能的其他精彩用法！
