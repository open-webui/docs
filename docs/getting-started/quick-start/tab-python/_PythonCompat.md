:::info Python version compatibility
Open WebUI supports **Python 3.11 and 3.12**. **Python 3.13 is not supported**: some dependencies have no 3.13-compatible release, so installs on 3.13 fail or break at runtime.

- **For production**, run the **Docker image** or use the **latest Python 3.12**. The Docker image runs Python 3.12 on Debian 13.
- **Python 3.11 also works** for a pip install.
:::

:::info System packages
A Python install does not bring ffmpeg, which the standard Docker image includes. Install it with your operating system's package manager and make sure `ffmpeg` is on the `PATH` of the shell that runs `open-webui serve`. Speech-to-text uses it to convert, compress and split audio, and text-to-speech uses it to convert replies from an OpenAI-compatible engine that are not MP3. Without it the server log shows `Couldn't find ffmpeg or avconv` and those steps fail. See [Audio Troubleshooting](/troubleshooting/audio#ffmpeg-missing-on-a-pip-install).
:::

:::tip No NVIDIA GPU?
On Linux x86_64, installing `open-webui` from PyPI pulls in the default PyTorch build, which brings the NVIDIA CUDA libraries along whatever GPU the machine has. On a machine without an NVIDIA GPU, install the CPU build of PyTorch first, in the same environment, and the Open WebUI install leaves them out:

```bash
pip install torch --index-url https://download.pytorch.org/whl/cpu
```

With uv, run the same command as `uv pip install`. For GPU acceleration on AMD, install the ROCm build from [PyTorch's install page](https://pytorch.org/get-started/locally/) instead.
:::

:::warning `.env` in your start folder is not read
A pip, uv or Conda install ignores a `.env` file in the folder you run `open-webui serve` from. It reads only `<env>/lib/python3.12/.env` with Python 3.12 (`<env>\Lib\.env` on Windows). Export your variables in the shell or service unit, or set them on the command line as in the examples below. See [`.env` file ignored by pip, uv and Conda installs](/reference/env-configuration#env-file-ignored-by-pip-uv-and-conda-installs) for how to print the exact path.
:::
