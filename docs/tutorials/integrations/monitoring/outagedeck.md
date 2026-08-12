---
sidebar_position: 30
title: "OutageDeck"
---

# Correlate Open WebUI failures with provider incidents

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

Open WebUI can be healthy while a remote model provider is having an incident. The built-in `/health`, `/api/models`, and chat-completion checks described in the [monitoring guide](/reference/monitoring) tell you what your deployment can reach. A provider-status signal adds context about what the vendor is reporting publicly.

[OutageDeck](https://outagedeck.com/?utm_source=open_webui_docs&utm_medium=integration&utm_campaign=open_webui_provider_monitoring&utm_content=guide) normalizes the official status feeds for cloud and SaaS providers. Its public API does not require a key, so it can be added to Uptime Kuma as a separate, advisory monitor.

:::caution Keep the signals separate

A vendor feed is not independent proof. Providers can acknowledge incidents late, and an unavailable OutageDeck endpoint says nothing about the provider. Keep direct Open WebUI checks and synthetic probes as the primary evidence. Use provider status to explain a failure, not to replace those checks.

:::

## Add a provider-status monitor

The provider slug is the last part of the API URL. For example, this request returns the normalized OpenAI record:

```bash
curl https://outagedeck.com/api/v1/providers/openai
```

The useful response fields are:

```json
{
  "data": {
    "currentStatus": {
      "code": "operational",
      "capturedAt": "2026-08-12T13:31:57.408Z"
    },
    "source": {
      "checkedAt": "2026-08-12T15:45:01.284Z",
      "officialUrl": "https://status.openai.com/"
    },
    "activeIncidents": []
  }
}
```

Status codes are `operational`, `degraded`, `partial_outage`, `major_outage`, `maintenance`, and `unknown`.

### Uptime Kuma setup

1. Add a monitor with type **HTTP(s) - JSON Query**.
2. Set the URL to `https://outagedeck.com/api/v1/providers/openai`.
3. Use this JSONata query:

   ```jsonata
   $exists(data.currentStatus.code) and data.currentStatus.code = "operational"
   ```

4. Set the expected value to `true`.
5. Use a five-minute interval and give the monitor an explicit name such as `OpenAI vendor-reported status (advisory)`.

Repeat the monitor for the remote providers that matter to your deployment. Keep request frequency within the rate-limit headers returned by the API.

## Interpret the result

| Open WebUI | Model check | Provider status | Likely next step |
| --- | --- | --- | --- |
| Healthy | Failing | Incident reported | Confirm the affected service and region on the linked official status page. |
| Healthy | Failing | Operational | Check credentials, quotas, routing, and direct provider responses. The incident may also be unreported. |
| Failing | Unknown | Any state | Investigate the Open WebUI deployment first. |
| Healthy | Failing | Status signal unavailable | Treat provider state as unknown and check the official source directly. |

This separation prevents a failed third-party status check from being mistaken for a model-provider outage.

## Check status from a chat

The [OutageDeck Provider Status tool](https://openwebui.com/posts/5cac0e1b-424c-4700-8d5e-3ac9003648a1) can also check providers, services, and incident timelines inside Open WebUI. After installing it, try a prompt such as:

```text
Check OpenAI and GitHub status. Include the source timestamps and official links.
```

If the remote provider used by the selected model is unavailable, the model may not be able to invoke any tool. Keeping a local tool-capable model available provides a separate path for this kind of triage.

## Learn more

- [Open WebUI monitoring levels](/reference/monitoring)
- [OutageDeck public API reference](https://outagedeck.com/developers/api?utm_source=open_webui_docs&utm_medium=integration&utm_campaign=open_webui_provider_monitoring&utm_content=api_reference)
- [OpenAI provider record](https://outagedeck.com/providers/openai?utm_source=open_webui_docs&utm_medium=integration&utm_campaign=open_webui_provider_monitoring&utm_content=provider_example)
