---
sidebar_position: 10
title: "Reduce RAM Usage"
---

## Reduce RAM Usage

If you are deploying Open WebUI in a RAM-constrained environment (such as a Raspberry Pi, small VPS, or shared hosting), there are several strategies to significantly reduce memory consumption.

On a Raspberry Pi 4 (arm64) with version v0.3.10, these optimizations reduced idle memory consumption from >1GB to ~200MB (as observed with `docker container stats`).

---

## Quick Start

Set the following environment variables for immediate RAM savings:

```bash
# Use external embedding instead of local SentenceTransformers
RAG_EMBEDDING_ENGINE=ollama

# Use external Speech-to-Text instead of local Whisper
AUDIO_STT_ENGINE=openai
```

:::tip

These settings can also be configured in the **Admin Panel > Settings** interface - set RAG embedding to Ollama or OpenAI, and Speech-to-Text to OpenAI or WebAPI.

:::

---

## Why Does Open WebUI Use So Much RAM?

Much of the memory consumption comes from locally loaded ML models. Even when using an external LLM (OpenAI or separate Ollama instance), Open WebUI may load additional models for:

| Feature | Default | RAM Impact | Solution |
|---------|---------|------------|----------|
| **RAG Embedding** | Local SentenceTransformers | ~500-800MB | Use Ollama or OpenAI embeddings |
| **Speech-to-Text** | Local Whisper | ~300-500MB | Use OpenAI or WebAPI |
| **Reranking** | Disabled | ~200-400MB when enabled | Keep disabled or use external |
| **Image Generation** | Disabled | Variable | Keep disabled if not needed |

---

## ⚙️ Environment Variables for RAM Reduction

### Offload Embedding to External Service

The biggest RAM saver is using an external embedding engine:

```bash
# Option 1: Use Ollama for embeddings (if you have Ollama running separately)
RAG_EMBEDDING_ENGINE=ollama

# Option 2: Use OpenAI for embeddings
RAG_EMBEDDING_ENGINE=openai
OPENAI_API_KEY=your-api-key
```

### Offload Speech-to-Text

Local Whisper models consume significant RAM:

```bash
# Use OpenAI's Whisper API
AUDIO_STT_ENGINE=openai

# Or use browser-based WebAPI (no external service needed)
AUDIO_STT_ENGINE=webapi
```

### Disable Unused Features

Disable features you don't need to prevent model loading:

```bash
# Disable image generation (prevents loading image models)
ENABLE_IMAGE_GENERATION=False

# Disable code execution (reduces overhead)
ENABLE_CODE_EXECUTION=False

# Disable code interpreter
ENABLE_CODE_INTERPRETER=False
```

### Reduce Background Task Overhead

These settings reduce memory usage from background operations:

```bash
# Disable autocomplete (high resource usage)
ENABLE_AUTOCOMPLETE_GENERATION=False

# Disable automatic title generation
ENABLE_TITLE_GENERATION=False

# Disable tag generation
ENABLE_TAGS_GENERATION=False

# Disable follow-up suggestions
ENABLE_FOLLOW_UP_GENERATION=False
```

### Database and Cache Optimization

```bash
# Disable real-time chat saving (reduces database overhead)
ENABLE_REALTIME_CHAT_SAVE=False

# Reduce thread pool size for low-resource systems
THREAD_POOL_SIZE=10
```

### Vector Database Multitenancy

If using Milvus or Qdrant, enable multitenancy mode to reduce RAM:

```bash
# For Milvus
ENABLE_MILVUS_MULTITENANCY_MODE=True

# For Qdrant  
ENABLE_QDRANT_MULTITENANCY_MODE=True
```

---

## 🚀 Recommended Minimal Configuration

For extremely RAM-constrained environments, use this combined configuration:

```bash
# Offload ML models to external services
RAG_EMBEDDING_ENGINE=ollama
AUDIO_STT_ENGINE=openai

# Disable all non-essential features
ENABLE_IMAGE_GENERATION=False
ENABLE_CODE_EXECUTION=False
ENABLE_CODE_INTERPRETER=False
ENABLE_AUTOCOMPLETE_GENERATION=False
ENABLE_TITLE_GENERATION=False
ENABLE_TAGS_GENERATION=False
ENABLE_FOLLOW_UP_GENERATION=False

# Reduce worker overhead
THREAD_POOL_SIZE=10
```

---

## 💡 Additional Tips

- **Monitor Memory Usage**: Use `docker container stats` or `htop` to monitor RAM consumption
- **Restart After Changes**: Environment variable changes require a container restart
- **Fresh Deployments**: Some environment variables only take effect on fresh deployments without an existing `config.json`
- **Consider Alternatives**: For very constrained systems, consider running Open WebUI on a more capable machine and accessing it remotely

---

## Related Guides

- [Improve Local LLM Performance](/tutorials/tips/improve-performance-local) - For optimizing performance without reducing features
- [Environment Variable Configuration](/getting-started/env-configuration) - Complete list of all configuration options

