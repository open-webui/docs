---
sidebar_position: 2
title: "Azure AI Speech TTS"
---

# Using Azure AI Speech for Text-to-Speech

This guide covers how to use Azure AI Speech for Text-to-Speech with Open WebUI. Open WebUI sends text to Azure's [text to speech REST API](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech) and plays back the audio it returns.

:::tip Looking for STT?
See the companion guide: [Using Azure AI Speech for Speech-to-Text](/features/chat-conversations/audio/speech-to-text/azure-stt-integration)
:::

## Requirements

- An Azure Speech resource (Microsoft's documentation also calls it a Foundry resource for Speech). See Microsoft's [Speech service regions table](https://learn.microsoft.com/azure/ai-services/speech-service/regions?tabs=tts) for text to speech availability by region.
- The resource's key, from **Resource Management** > **Keys and Endpoint** in the Azure portal. Either of the two keys works.
- Open WebUI installed and running

## Quick Setup (UI)

1. Click your **profile icon** (bottom-left corner)
2. Select **Admin Panel**, then **Settings**. Settings opens in a window.
3. In the sidebar, choose **Audio** under **Admin**, in the *Experience* group. The other **Audio** entry, in the *Preferences* group, holds your personal audio settings. On a narrow screen these labels are hidden, so open the admin one directly at `/?settings=admin:audio` instead.
4. Configure the following:

| Setting | Value |
|---------|-------|
| **Text-to-Speech Engine** | `Azure AI Speech` |
| **API Key** | Your Speech resource key |
| **Azure Region** | The region of your Speech resource, as an identifier such as `westus` or `westeurope` |
| **Endpoint URL** | Leave blank, unless you use a sovereign cloud (see [Endpoint URL](#endpoint-url)) |

5. Click **Save**. Choosing the engine already saves on its own and clears **TTS Voice**, which is why the voice comes after this step.
6. Switch to another settings tab and back to **Audio**. The voice list is fetched when the Audio tab opens, so it only loads with your key after this.
7. Configure the voice and format:

| Setting | Value |
|---------|-------|
| **TTS Voice** | Type part of a voice name or language to search, then pick a voice, for example `en-US-JennyNeural` |
| **Output format** | Leave the default `audio-24khz-160kbitrate-mono-mp3` (see [Output Format](#output-format)) |

8. Click **Save**

The key only works with the region the resource was created in. Microsoft notes that keys are region-scoped, so a key used with a different region fails to authenticate.

:::caution Always set the region
If **Azure Region** and **Endpoint URL** are both blank, speech is still requested from `eastus`, but the voice list is not loaded at all. Set the region your resource is in.
:::

## Choosing Voices

Open WebUI loads the voice list for your region from Azure. Each row in **TTS Voice** shows the voice's full name, such as `en-US-JennyNeural`, with its display label next to it in grey. Only a few rows show at a time, so type part of a name or a language, such as `en-GB`, to narrow the list.

The full name is what Open WebUI sends to Azure, and it takes the speech language from the first two parts of that name (`en-US` from `en-US-JennyNeural`). If you type a voice instead of picking one, use the full name.

Which voice is used for a reply:

1. The model's own **TTS Voice**, if one is set when editing the model in **Workspace** → **Models**
2. Otherwise, the voice the user picked under **Set Voice** in their personal **Audio** settings, as long as the admin's **TTS Voice** is still the one that was set when they picked it. If the admin changes it, users hear the new default until they pick again.
3. Otherwise, the admin's **TTS Voice**

For the full list of voices and languages, see Microsoft's [Language and voice support](https://learn.microsoft.com/azure/ai-services/speech-service/language-support?tabs=tts).

## Endpoint URL

By default, Open WebUI sends requests to `https://<region>.tts.speech.microsoft.com`, built from **Azure Region**. **Endpoint URL** replaces that address. Open WebUI adds `/cognitiveservices/v1` to it to request speech and `/cognitiveservices/voices/list` to load the voice list, so enter only the scheme and host, with no path.

This is not your resource's endpoint from **Keys and Endpoint**, the one the [STT guide](/features/chat-conversations/audio/speech-to-text/azure-stt-integration#endpoint-url) can use. Microsoft documents the voice list at `/tts/cognitiveservices/voices/list` on that address, while Open WebUI requests `/cognitiveservices/voices/list`, so the voice list would not load.

For the sovereign clouds, Microsoft documents these addresses, with `<region>` replaced by your region identifier:

| Cloud | Endpoint URL |
|-------|--------------|
| Azure Government | `https://<region>.tts.speech.azure.us` |
| Azure operated by 21Vianet | `https://<region>.tts.speech.azure.cn` |

See [Speech service in sovereign clouds](https://learn.microsoft.com/azure/ai-services/speech-service/sovereign-clouds) for the region identifiers.

## Output Format

**Output format** is sent to Azure as the audio format to return. Keep one of the MP3 formats, such as the default `audio-24khz-160kbitrate-mono-mp3`. Open WebUI stores the audio it receives as an `.mp3` file and, except in the slim image, serves it as MP3 whatever format Azure returned. The slim image refuses audio types outside its list of browser-playable formats, such as MP3, WAV and Ogg. Microsoft's [audio outputs list](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs) has every value.

## Environment Variables Setup

If you prefer to configure via environment variables:

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - AUDIO_TTS_ENGINE=azure
      - AUDIO_TTS_API_KEY=your-speech-resource-key
      - AUDIO_TTS_AZURE_SPEECH_REGION=westeurope
      - AUDIO_TTS_VOICE=en-US-JennyNeural
    # ... other configuration
```

Set `AUDIO_TTS_VOICE` to an Azure voice name. Its default, `alloy`, is an OpenAI voice.

### All Azure TTS Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `AUDIO_TTS_ENGINE` | Set to `azure` | empty (uses browser-only TTS) |
| `AUDIO_TTS_API_KEY` | Your Speech resource key (shared with the ElevenLabs engine) | empty |
| `AUDIO_TTS_AZURE_SPEECH_REGION` | Region identifier of your Speech resource | empty (speech uses `eastus`; without a base URL, the voice list does not load) |
| `AUDIO_TTS_AZURE_SPEECH_BASE_URL` | Replaces `https://<region>.tts.speech.microsoft.com` | empty |
| `AUDIO_TTS_AZURE_SPEECH_OUTPUT_FORMAT` | Audio output format | `audio-24khz-160kbitrate-mono-mp3` |
| `AUDIO_TTS_VOICE` | Full Azure voice name | `alloy` (not an Azure voice) |

:::info Settings saved in the UI take precedence
Saving the admin **Audio** settings stores every field on that tab, empty ones included, and choosing an engine saves too. With the default `ENABLE_PERSISTENT_CONFIG=true`, those stored values take precedence over the `AUDIO_*` environment variables from then on. See [`ENABLE_PERSISTENT_CONFIG`](/reference/env-configuration#enable_persistent_config).
:::

## Testing TTS

1. Start a new chat
2. Send a message to any model
3. Click the **speaker icon** on the AI response to hear it read aloud

## Troubleshooting

### No voices shown in the list

1. Confirm **API Key** and **Azure Region** are set and saved
2. Switch to another settings tab and back to **Audio** to reload the list
3. Check the Open WebUI logs for `Error fetching Azure voices`

### Speech fails with a 401 error

Azure rejected the key. Check that the key is copied correctly from **Keys and Endpoint** and that **Azure Region** is the region your Speech resource is in.

### Speech fails with another error

1. Confirm **TTS Voice** is set to a full Azure voice name from the list
2. Confirm **Output format** is one of the MP3 values from Microsoft's [audio outputs list](https://learn.microsoft.com/azure/ai-services/speech-service/rest-text-to-speech#audio-outputs)
3. Check the Open WebUI logs for the full error

For broader audio debugging, see the [Audio Troubleshooting Guide](/troubleshooting/audio).

## Cost Considerations

Azure bills Speech usage under your Azure subscription. Check [Azure's Speech pricing page](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) for current rates.
