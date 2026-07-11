---
title: Voice, speech, and audio
sidebar_position: 9
---

# Voice, speech, and audio

Everything audio lives in **Settings → Audio**: speech-to-text, text-to-speech, voice mode, and voice memos.

## Speech-to-text

Any OpenAI-compatible transcription API. Defaults: base URL `https://api.openai.com/v1`, model `whisper-1`. One STT config powers three things:

- transcribing spoken input in chat and voice mode
- transcripts for voice memos
- voice notes sent to messaging bots

Long recordings are automatically chunked before transcription (this path needs `ffmpeg` on the machine).

## Text-to-speech

Off by default. Any OpenAI-compatible `/audio/speech` endpoint; defaults model `tts-1`, voice `alloy`, mp3 output. Responses are read aloud **sentence by sentence** as they stream, so playback starts before the response finishes. Playback speed is adjustable from 0.5× to 2×.

## Voice mode

Hands-free conversation: you talk, the AI answers, the reply is read back, and the mic re-arms for your next turn. The STT source is configurable:

- **browser**: the browser's built-in speech recognition, no API key needed
- **provider**: the STT API configured above

Voice mode has its own customizable system prompt, separate from your chat prompts. This is useful for keeping spoken answers short.

## Voice memos

Record audio from any device and it's saved into the workspace as a file. When speech-to-text is configured, the memo is transcribed to markdown automatically: dictate a review note from your phone and read it in the editor at your desk.
