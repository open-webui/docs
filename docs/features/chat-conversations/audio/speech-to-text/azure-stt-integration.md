---
sidebar_position: 2
title: "Azure AI Speech STT"
---

# Using Azure AI Speech for Speech-to-Text

This guide covers how to use Azure AI Speech for Speech-to-Text with Open WebUI. Open WebUI sends each recording to Azure's [fast transcription API](https://learn.microsoft.com/azure/ai-services/speech-service/fast-transcription-create), which returns the text in a single request.

:::tip Looking for TTS?
See the companion guide: [Using Azure AI Speech for Text-to-Speech](/features/chat-conversations/audio/text-to-speech/azure-tts-integration)
:::

## Requirements

- An Azure Speech resource (Microsoft's documentation also calls it a Foundry resource for Speech) in a region that offers **fast transcription**. Not every region does: check the **Fast transcription** column of Microsoft's [Speech service regions table](https://learn.microsoft.com/azure/ai-services/speech-service/regions?tabs=stt).
- The resource's key, from **Resource Management** > **Keys and Endpoint** in the Azure portal. Either of the two keys works.
- Open WebUI installed and running

:::caution Azure Government
Microsoft lists fast transcription as unsupported in Azure Government, so this engine cannot be used there. See [Speech service in sovereign clouds](https://learn.microsoft.com/azure/ai-services/speech-service/sovereign-clouds).
:::

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**, then **Settings**. Settings opens in a window.
3. In the sidebar, choose **Audio** under **Admin**, in the *Experience* group. The other **Audio** entry, in the *Preferences* group, holds your personal audio settings. On a narrow screen these labels are hidden, so open the admin one directly at `/?settings=admin:audio` instead.
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Speech-to-Text Engine** | `Azure AI Speech` |
| **API Key** | Your Speech resource key |
| **Azure Region** | The region of your Speech resource, as an identifier such as `westus` or `westeurope`. Left blank, Open WebUI uses `eastus` |
| **Language Locales** | The languages your users speak, separated by commas with no spaces, for example `en-US,de-DE`. See [Language Locales](#language-locales) |
| **Endpoint URL** | Leave blank, unless you use your resource's own endpoint (see [Endpoint URL](#endpoint-url)) |
| **Max Speakers** | Leave blank to use the default of `3` |

5. Click **Save**

The key only works with the region the resource was created in. Microsoft notes that keys are region-scoped, so a key used with a different region fails to authenticate.

## Language Locales

Azure works out which language is being spoken from the list of locales Open WebUI sends with each recording:

- When **Language Locales** is set, Azure uses those locales as its candidates. Microsoft notes that if none of them is in the audio, the service tries to identify the language itself.
- When it is left blank, Open WebUI sends this list: `en-US`, `es-ES`, `es-MX`, `fr-FR`, `hi-IN`, `it-IT`, `de-DE`, `en-GB`, `en-IN`, `ja-JP`, `ko-KR`, `pt-BR` and `zh-CN`.

Azure identifies one main language per recording. Microsoft notes that a smaller, accurate set of candidate locales can improve detection, so list only the languages your users actually speak. For the locales Azure supports, see [Language and voice support](https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=stt).

Separate locales with commas only. Open WebUI does not trim spaces, so `en-US, de-DE` sends `" de-DE"` with a leading space.

The **Language** each user can set under **Settings** → **Audio** is not used by this engine. Only the admin's **Language Locales** list is sent to Azure.

## Endpoint URL

By default, Open WebUI sends requests to `https://<region>.api.cognitive.microsoft.com`, built from **Azure Region**. **Endpoint URL** replaces that address, and Open WebUI adds `/speechtotext/transcriptions:transcribe?api-version=2024-11-15` to it. Enter only the scheme and host, with no path.

You can use your resource's own endpoint from **Keys and Endpoint**, for example `https://<resource-name>.cognitiveservices.azure.com`. Microsoft's fast transcription examples call the same path on that address. Leave off the trailing `/` that Azure shows, because Open WebUI adds the path directly and would otherwise double the slash.

## Max Speakers

Open WebUI always asks Azure to separate speakers (diarization), with **Max Speakers** as the upper limit. The text Open WebUI keeps is the combined transcript, without speaker labels.

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_STT_ENGINE=azure
      - AUDIO_STT_AZURE_API_KEY=your-speech-resource-key
      - AUDIO_STT_AZURE_REGION=westeurope
      - AUDIO_STT_AZURE_LOCALES=en-US,de-DE
    # ... other configuration
```

### All Azure STT Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_STT_ENGINE` | Set to `azure` | empty (uses local Whisper) |
| `AUDIO_STT_AZURE_API_KEY` | Your Speech resource key | empty |
| `AUDIO_STT_AZURE_REGION` | Region identifier of your Speech resource | empty, which uses `eastus` |
| `AUDIO_STT_AZURE_LOCALES` | Comma-separated locales, no spaces | empty, which sends the 13 locales listed above |
| `AUDIO_STT_AZURE_BASE_URL` | Replaces `https://<region>.api.cognitive.microsoft.com` | empty |
| `AUDIO_STT_AZURE_MAX_SPEAKERS` | Upper limit for speaker separation | empty, which uses `3` |

:::info Settings saved in the UI take precedence
Saving the admin **Audio** settings stores every field on that tab, empty ones included, and choosing an engine saves too. With the default `ENABLE_PERSISTENT_CONFIG=true`, those stored values take precedence over the `AUDIO_*` environment variables from then on. See [`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config).
:::

## Long Recordings

Before transcription, Open WebUI converts recordings in formats outside its supported list to MP3. Audio larger than 20 MB is re-encoded to a smaller MP3 and, if still too large, split into pieces of up to 20 MB. Each piece is sent to Azure as its own request, so the language is detected separately for each piece, and the texts are joined.

The slim image, or `BYPASS_PYDUB_PREPROCESSING=true`, skips this step and sends files whole. Open WebUI then rejects files over 200 MB, and Microsoft's reference for the API version Open WebUI uses (`2024-11-15`) limits audio to under 2 hours.

## Using STT

1. Click the **microphone icon** in the chat input
2. Speak your message
3. Click the checkmark (**Confirm recording**) when you finish
4. Your speech is transcribed and appears in the message box, or is sent right away if **Instant Auto-Send After Voice Transcription** is on in your **Audio** settings

## Troubleshooting

### "Azure API key and region are required for Azure STT"

No API key is saved. Enter your Speech resource key in **API Key** (or set `AUDIO_STT_AZURE_API_KEY`) and save.

### "External: Access denied due to invalid subscription key or wrong API endpoint"

Azure rejected the key. Check that:

1. The key is copied correctly from **Keys and Endpoint**
2. **Azure Region** is the region your Speech resource is in
3. **Endpoint URL**, if set, is your resource's endpoint with no path

### "External: Resource not found"

Azure did not recognize the address. If **Endpoint URL** is set, make sure it has no path after the host.

### Language could not be identified

When Azure cannot identify a language, or finds several with none dominant, Open WebUI shows Azure's own error message. Set **Language Locales** to the languages actually spoken in your recordings.

### Other errors

Open WebUI shows Azure's own message when the audio is empty or too long, and for the two language identification errors. Other errors in Azure's transcription error format show "An error occurred during transcription.", and Azure's error code and message are written to the server log, in a line containing `Azure STT error`.

A few other messages come from Open WebUI itself:

- **A message starting with "Failed to parse Azure response:"**: Azure answered, but without any transcript text.
- **A message starting with "Error transcribing chunk:"**: the request never reached Azure, for example because the region identifier is mistyped.

If the key and region are correct and transcription still fails, confirm that your region offers fast transcription.

For more troubleshooting, see the [Audio Troubleshooting Guide](/troubleshooting/audio).

## Cost Considerations

Azure bills Speech usage under your Azure subscription. Check [Azure's Speech pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for current rates. Microsoft's [quotas and limits](https://learn.microsoft.com/azure/ai-services/speech-service/speech-services-quotas-and-limits) list fast transcription limits for the Standard (S0) tier only.

:::tip
For free STT, use **Local Whisper** (the default) or the browser's **Web API** for basic transcription.
:::
