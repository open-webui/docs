---
sidebar_position: 6
title: "📊 Monitoring"
---

# Monitoring Open WebUI

Monitoring your Open WebUI instance is crucial for ensuring reliable service and quickly identifying issues. This guide covers three levels of monitoring:
- Basic health checks for service availability
- Model connectivity verification
- Deep health checks with model response testing

## Basic Health Check Endpoint

Open WebUI exposes a health check endpoint at `/health` that returns a 200 OK status when the service is running properly. 


```bash
   # No auth needed for this endpoint
   curl https://your-open-webuiinstance/health
```

### Using Uptime Kuma
[Uptime Kuma](https://github.com/louislam/uptime-kuma) is a great, easy to use, open source, self-hosted uptime monitoring tool. 

1. In your Uptime Kuma dashboard, click "Add New Monitor"
2. Set the following configuration:
   - Monitor Type: HTTP(s)
   - Name: Open WebUI
   - URL: `http://your-open-webuiinstance:8080/health`
   - Monitoring Interval: 60 seconds (or your preferred interval)
   - Retry count: 3 (recommended)

The health check will verify:
- The web server is responding
- The application is running
- Basic database connectivity

## Open WebUI Model Connectivity

To verify that Open WebUI can successfully connect to and list your configured models, you can monitor the models endpoint. This endpoint requires authentication and checks Open WebUI's ability to communicate with your model providers.

See [API documentation](https://docs.openwebui.com/getting-started/api-endpoints/#-retrieve-all-models) for more details about the models endpoint.


```bash
   # See steps below to get an API key
   curl -H "Authorization: Bearer sk-adfadsflkhasdflkasdflkh" https://your-open-webuiinstance/api/models
```

### Authentication Setup

1. Enable API Keys (Admin required):
   - Go to Admin Settings > General
   - Enable the "Enable API Key" setting
   - Save changes

2. Get your API key [docs](https://docs.openwebui.com/getting-started/api-endpoints):
   - (Optional), consider making a non-admin user for the monitoring API key
   - Go to Settings > Account in Open WebUI
   - Generate a new API key specifically for monitoring
   - Copy the API key for use in Uptime Kuma

Note: If you don't see the option to generate API keys in your Settings > Account, check with your administrator to ensure API keys are enabled.

### Using Uptime Kuma for Model Connectivity

1. Create a new monitor in Uptime Kuma:
   - Monitor Type: HTTP(s) - JSON Query
   - Name: Open WebUI Model Connectivity
   - URL: `http://your-open-webuiinstance:8080/api/models`
   - Method: GET
   - Expected Status Code: 200
   - JSON Query: `$count(data[*])>0`
   - Expected Value: `true`  
   - Monitoring Interval: 300 seconds (5 minutes recommended)

2. Configure Authentication:
   - In the Headers section, add:
     ```
     {
        "Authorization": "Bearer sk-abc123adfsdfsdfsdfsfdsdf"
     }
     ```
   - Replace `YOUR_API_KEY` with the API key you generated

Alternative JSON Queries:
```
# At least 1 models by ollama provider
$count(data[owned_by='ollama'])>1

# Check if specific model exists (returns true/false)
$exists(data[id='gpt-4o'])

# Check multiple models (returns true if ALL exist)
$count(data[id in ['gpt-4o', 'gpt-4o-mini']]) = 2
```

You can test JSONata queries at [jsonata.org](https://try.jsonata.org/) to verify they work with your API response.

## Model Response Testing

To verify that models can actually process requests, you can monitor the chat completions endpoint. This provides a deeper health check by ensuring models can generate responses.

```bash
# Test model response
curl -X POST https://your-open-webuiinstance/api/chat/completions \
  -H "Authorization: Bearer sk-adfadsflkhasdflkasdflkh" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Respond with the word HEALTHY"}],
    "model": "llama3.1",
    "temperature": 0
  }'
```
