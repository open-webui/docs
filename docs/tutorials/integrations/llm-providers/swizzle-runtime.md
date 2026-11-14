---
sidebar_position: 4
title: "Swizzle Runtime"
---

# Running Local GGUF Models with Swizzle Runtime

[Swizzle Runtime](https://github.com/Swizzle-AI/swizzle-runtime) (`swizzle-rt`) is an Apache-2.0, pure-Rust GGUF inference engine with custom AVX2, NVIDIA CUDA (`sm_75` to `sm_120`), and Vulkan compute kernels. It exposes a drop-in OpenAI-compatible and Ollama-compatible HTTP server (`swizzle-rt serve`) with zero Python or PyTorch runtime dependencies.

## 1. Install Swizzle Runtime

On Linux x86_64 (CUDA 12.8):

```sh
curl -fsSL https://raw.githubusercontent.com/Swizzle-AI/swizzle-runtime/main/install.sh | sh
```

Or build from source (CPU + Vulkan):

```sh
git clone https://github.com/Swizzle-AI/swizzle-runtime.git
cd swizzle-runtime
cargo build --release --locked -p swizzle-cli
```

## 2. Pull and Serve a Model

Pull a GGUF model from Hugging Face and start the local server on port `8080`:

```sh
swizzle-rt pull Qwen/Qwen3-0.6B-GGUF:Q8_0
swizzle-rt serve Qwen3-0.6B-Q8_0.gguf --port 8080
```

## 3. Connect Open WebUI

1. Open **Admin Panel > Settings > Connections** in Open WebUI.
2. Under **OpenAI API**, add a new connection:
   - **URL**: `http://localhost:8080/v1` (or `http://host.docker.internal:8080/v1` if Open WebUI is running inside Docker)
   - **API Key**: `swizzle-local` (any non-empty placeholder string)
3. Save and select your loaded GGUF model from the chat model selector.

:::tip

`swizzle-rt serve` also exposes Ollama-compatible routes (`/api/chat`, `/api/generate`, `/api/tags`) and emits latency telemetry headers (`X-Swizzle-TTFT-Ms`, `X-Swizzle-Tokens-Per-Sec`) plus optional Ed25519 + BLAKE3 execution receipts.

:::
