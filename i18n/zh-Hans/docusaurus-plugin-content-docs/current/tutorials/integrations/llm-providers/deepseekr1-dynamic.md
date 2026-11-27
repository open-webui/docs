---
sidebar_position: 1
title: "DeepSeek R1 动态量化"
---

非常感谢 **UnslothAI** 付出的卓越努力！得益于他们的辛勤工作，我们现在可以在 **Llama.cpp** 上运行动态 1.58 位量化形式的 **DeepSeek-R1 完整版** 671B 参数模型（压缩后仅 131GB）！最棒的是什么？你不再需要为必须配备大型企业级 GPU 或服务器而感到绝望：可以在个人计算机上运行这个模型（不过在大多数消费级硬件上速度会比较慢）。

:::note

Ollama 上唯一真正的 **DeepSeek-R1** 模型是此处提供的 **671B 版本**：[https://ollama.com/library/deepseek-r1:671b](https://ollama.com/library/deepseek-r1:671b)。其他版本都是**蒸馏**模型。

:::

本指南重点介绍如何使用与 **Open WebUI** 集成的 **Llama.cpp** 运行 **DeepSeek-R1 完整版动态 1.58 位量化模型**。本教程将以 **M4 Max + 128GB RAM** 的计算机为例演示相关步骤。你可以根据自己的配置调整设置。

---

## 第 1 步：安装 Llama.cpp {#step-1-install-llamacpp}

你可以选择以下任一方式：

- [下载预构建的二进制文件](https://github.com/ggerganov/llama.cpp/releases)
- **或者自行构建**：按照 [Llama.cpp 构建指南](https://github.com/ggerganov/llama.cpp/blob/master/docs/build.md)中的说明操作

## 第 2 步：下载 UnslothAI 提供的模型 {#step-2-download-the-model-provided-by-unslothai}

前往 [Unsloth 的 Hugging Face 页面](https://huggingface.co/unsloth/DeepSeek-R1-GGUF)，下载合适的 DeepSeek-R1 **动态量化版本**。本教程将使用经过高度优化的 **1.58 位（131GB）**版本，其功能表现仍然令人惊喜。

:::tip

请了解你的“工作目录”，即 Python 脚本或终端会话正在运行的目录。默认情况下，模型文件会下载到该目录的子文件夹中，因此请务必确认其路径！例如，如果你在 `/Users/yourname/Documents/projects` 中运行以下命令，下载的模型将保存在 `/Users/yourname/Documents/projects/DeepSeek-R1-GGUF` 下。

:::

要详细了解 UnslothAI 的开发过程以及这些动态量化版本为何如此高效，请查看他们的博客文章：[UnslothAI DeepSeek R1 动态量化](https://unsloth.ai/blog/deepseekr1-dynamic)。

以下是通过程序下载模型的方法：

```python

# 运行前请安装 Hugging Face 依赖项：

# pip install huggingface_hub hf_transfer

from huggingface_hub import snapshot_download

snapshot_download(
    repo_id = "unsloth/DeepSeek-R1-GGUF",  # 指定 Hugging Face 仓库
    local_dir = "DeepSeek-R1-GGUF",         # 模型将下载到此目录
    allow_patterns = ["*UD-IQ1_S*"],        # 仅下载 1.58 位版本
)
```

下载完成后，你会看到如下目录结构中的模型文件：

```txt
DeepSeek-R1-GGUF/
├── DeepSeek-R1-UD-IQ1_S/
│   ├── DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf
│   ├── DeepSeek-R1-UD-IQ1_S-00002-of-00003.gguf
│   ├── DeepSeek-R1-UD-IQ1_S-00003-of-00003.gguf
```

:::info

请将后续步骤中的路径更新为**与你的具体目录结构一致**的路径。例如，如果脚本位于 `/Users/tim/Downloads`，则 GGUF 文件的完整路径为：
`/Users/tim/Downloads/DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf`。

:::

## 第 3 步：确保已安装并运行 Open WebUI {#step-3-make-sure-open-webui-is-installed-and-running}

如果尚未安装 **Open WebUI**，也不用担心！安装过程很简单，只需按照 [Open WebUI 文档](/)操作即可。安装完成后，启动应用程序。稍后我们会将它连接起来，以便与 DeepSeek-R1 模型交互。

## 第 4 步：使用 Llama.cpp 提供模型服务 {#step-4-serve-the-model-using-llamacpp}

模型下载完成后，下一步是使用 **Llama.cpp 的服务器模式**运行它。开始之前：

1. **找到 `llama-server` 二进制文件。**
   如果是从源代码构建的（如第 1 步所述），`llama-server` 可执行文件将位于 `llama.cpp/build/bin`。使用 `cd` 命令进入此目录：

   ```bash
   cd [path-to-llama-cpp]/llama.cpp/build/bin
   ```

   将 `[path-to-llama-cpp]` 替换为克隆或构建 Llama.cpp 的位置。例如：

   ```bash
   cd ~/Documents/workspace/llama.cpp/build/bin
   ```

2. **指向模型文件夹。**
   使用第 2 步创建的已下载 GGUF 文件的完整路径。提供模型服务时，请指定拆分 GGUF 文件的第一部分（例如 `DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf`）。

以下是启动服务器的命令：

```bash
./llama-server \
    --model /[your-directory]/DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --port 10000 \
    --ctx-size 1024 \
    --n-gpu-layers 40
```

:::tip

**可根据你的计算机自定义的参数：**

- **`--model`：**将 `/[your-directory]/` 替换为第 2 步中 GGUF 文件的下载路径。
- **`--port`：**服务器默认端口为 `8080`，你可以根据端口可用情况随意更改。
- **`--ctx-size`：**确定上下文长度（Token 数量）。如果硬件允许，可以增大该值，但请注意 RAM/VRAM 占用会随之增加。
- **`--n-gpu-layers`：**设置要卸载到 GPU 以加快推理的层数。具体数值取决于 GPU 的显存容量。具体建议请参阅 Unsloth 的表格。

:::

例如，如果模型下载到了 `/Users/tim/Documents/workspace`，则命令如下所示：

```bash
./llama-server \
    --model /Users/tim/Documents/workspace/DeepSeek-R1-GGUF/DeepSeek-R1-UD-IQ1_S/DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf \
    --port 10000 \
    --ctx-size 1024 \
    --n-gpu-layers 40
```

服务器启动后，将在以下地址提供**与 OpenAI 兼容的本地 API** 端点：

```txt
http://127.0.0.1:10000
```

:::info

**Llama.cpp 服务器正在运行**

![服务器截图](/images/tutorials/deepseek/serve.png)

运行该命令后，你应看到一条消息，确认服务器已启动并正在监听 10000 端口。

:::

请务必**保持此终端会话运行**，因为后续所有步骤都需要它来提供模型服务。

## 第 5 步：将 Llama.cpp 连接到 Open WebUI {#step-5-connect-llamacpp-to-open-webui}

1. 转到 Open WebUI 中的**管理员设置**。
2. 导航到**连接 > OpenAI 连接**。
3. 为新连接添加以下详细信息：
   - URL：`http://127.0.0.1:10000/v1`（在 Docker 中运行 Open WebUI 时使用 `http://host.docker.internal:10000/v1`）
   - API 密钥：`none`

:::info

**在 Open WebUI 中添加连接**

![连接截图](/images/tutorials/deepseek/connection.png)

运行该命令后，你应看到一条消息，确认服务器已启动并正在监听 10000 端口。

:::

保存连接后，即可直接从 Open WebUI 查询 **DeepSeek-R1**！

---

## 示例：生成回复 {#example-generating-responses}

现在可以使用 Open WebUI 的聊天界面与 **DeepSeek-R1 动态 1.58 位模型**交互。

![回复截图](/images/tutorials/deepseek/response.png)

---

## 注意事项 {#notes-and-considerations}

- **性能：**
  在个人硬件上运行 DeepSeek-R1 这样庞大的 131GB 模型会非常**慢**。即使使用我们的 M4 Max（128GB RAM），推理速度也很一般。但它能够运行，本身就证明了 UnslothAI 优化工作的价值。

- **VRAM/内存要求：**
  确保具有足够的 VRAM 和系统 RAM 以获得最佳性能。使用低端 GPU 或仅使用 CPU 的配置时，速度会更慢（但仍然可以运行！）。

---

感谢 **UnslothAI** 和 **Llama.cpp**，个人用户终于可以运行最大的开源推理模型之一 **DeepSeek-R1**（1.58 位版本）。虽然在消费级硬件上运行此类模型充满挑战，但无需庞大的计算基础设施即可实现这一点，无疑是一个重要的技术里程碑。

非常感谢社区不断突破开放 AI 研究的边界。

祝你实验愉快！
