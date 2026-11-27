:::info Python 版本兼容性
Open WebUI 支持 **Python 3.11 和 3.12**。**不支持 Python 3.13**：某些依赖没有兼容 3.13 的版本，因此在 3.13 上安装会失败，或安装后在运行时出错。

- **生产环境**请在 **Linux** 上运行 **Docker 镜像**，或使用**最新的 Python 3.12**。Docker 镜像在 Debian 13 上运行 Python 3.12。
- **在 Windows 上**，通过 pip、uv 或 Conda 安装适合个人使用。生产环境请使用 Linux。
- 使用 pip 安装时，**Python 3.11 同样可用**。

如果 pip 报告你的 Python 版本不受支持，请激活要用于安装的环境，然后检查版本：

```bash
python --version
python -m pip --version
```

单独安装 Python 3.12 不会更改现有环境中的解释器。如果版本不正确，请使用 Python 3.12 创建新环境并激活，然后运行 `python -m pip install open-webui`，通过该解释器进行安装。
:::

:::info 系统软件包
Python 安装不包含 ffmpeg，而标准 Docker 镜像已包含它。请使用操作系统的软件包管理器安装，并确保运行 `open-webui serve` 的 shell 能在 `PATH` 中找到 `ffmpeg`。语音转文本使用它转换、压缩和拆分音频；当 OpenAI 兼容引擎返回的文本转语音回复不是 MP3 格式时，文本转语音会使用它进行转换。如果缺少 ffmpeg，服务器日志会显示 `Couldn't find ffmpeg or avconv`，这些步骤会失败。请参阅[音频故障排除](/troubleshooting/audio#ffmpeg-missing-on-a-pip-install)。
:::

:::tip 没有 NVIDIA GPU？
在 Linux x86_64 上，从 PyPI 安装 `open-webui` 会拉取默认的 PyTorch 构建；无论计算机使用何种 GPU，该构建都会附带 NVIDIA CUDA 库。在没有 NVIDIA GPU 的计算机上，请先在同一环境中安装 PyTorch 的 CPU 构建，这样安装 Open WebUI 时就不会包含这些库：

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

使用 uv 时，请以 `uv pip install` 的形式运行同一命令。如需在 AMD 上使用 GPU 加速，请改为从 [PyTorch 安装页面](https://pytorch.org/get-started/locally/)安装 ROCm 构建。
:::

:::warning 不会读取启动目录中的 `.env`
通过 pip、uv 或 Conda 安装时，会忽略运行 `open-webui serve` 所在文件夹中的 `.env` 文件。使用 Python 3.12 时，它只会读取 `<env>/lib/python3.12/.env`（Windows 上为 `<env>\Lib\.env`）。请在 shell 或服务单元中导出变量，或像下方示例一样在命令行中设置。有关如何打印确切路径，请参阅[pip、uv 和 Conda 安装会忽略 `.env` 文件](/reference/env-configuration#env-file-ignored-by-pip-uv-and-conda-installs)。
:::
