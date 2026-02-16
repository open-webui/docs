# Configuration Profiles

Copy-paste environment configurations for common deployment scenarios.

## Home Lab / Single User

```bash
docker run -d -p 3000:8080 \
  -e WEBUI_URL=http://localhost:3000 \
  -e ENABLE_SIGNUP=False \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

## Small Team (5-20 users)

```bash
docker run -d -p 3000:8080 \
  -e WEBUI_URL=https://chat.yourcompany.com \
  -e WEBUI_SECRET_KEY=your-static-secret-key-here \
  -e DATABASE_URL=postgresql://user:pass@postgres:5432/openwebui \
  -e ENABLE_SIGNUP=True \
  -e DEFAULT_USER_ROLE=pending \
  -e REDIS_URL=redis://redis:6379/0 \
  -e ENABLE_WEBSOCKET_SUPPORT=True \
  -e WEBSOCKET_MANAGER=redis \
  -e WEBSOCKET_REDIS_URL=redis://redis:6379/1 \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

## Production / Enterprise

```bash
docker run -d -p 3000:8080 \
  -e WEBUI_URL=https://ai.yourcompany.com \
  -e WEBUI_SECRET_KEY=$SECRET_KEY \
  -e DATABASE_URL=$DATABASE_URL \
  -e REDIS_URL=$REDIS_URL \
  -e ENABLE_WEBSOCKET_SUPPORT=True \
  -e WEBSOCKET_MANAGER=redis \
  -e WEBSOCKET_REDIS_URL=$WEBSOCKET_REDIS_URL \
  -e THREAD_POOL_SIZE=2000 \
  -e DATABASE_POOL_SIZE=15 \
  -e DATABASE_POOL_MAX_OVERFLOW=20 \
  -e ENABLE_BASE_MODELS_CACHE=True \
  -e RAG_EMBEDDING_ENGINE=openai \
  -e RAG_OPENAI_API_BASE=https://api.openai.com/v1 \
  -e RAG_OPENAI_API_KEY=$OPENAI_API_KEY \
  -e ENABLE_OPENTELEMETRY=True \
  -e OTEL_EXPORTER_OTLP_ENDPOINT=$OTEL_ENDPOINT \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```

## Privacy-First (No External APIs)

```bash
docker run -d -p 3000:8080 \
  -e WEBUI_URL=http://localhost:3000 \
  -e ENABLE_SIGNUP=False \
  -e RAG_EMBEDDING_ENGINE=sentence-transformers \
  -e AUDIO_STT_ENGINE=local \
  -e ENABLE_IMAGE_GENERATION=False \
  -e ENABLE_WEB_SEARCH=False \
  -e ENABLE_TITLE_GENERATION=False \
  -v open-webui:/app/backend/data \
  ghcr.io/open-webui/open-webui:main
```
