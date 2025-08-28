---
sidebar_position: 7
title: "🪶 Slim Docker image"
---

# Slim Docker image variant

## Intended use-case
The slim image is intended for deployments where no models are required locally and every model-related task that can be offloaded is offloaded to another server or external API (for example, cloud deployments where inference is handled by a separate service). Use this variant only when your deployment is explicitly configured to run without any AI models inside the image. This is helpful with scalable systems as individual nodes are able to pull the image faster, reducing cold-start times.

## What the slim image does
- Removes bundled model files and other model-specific assets from the image to reduce image size and speed up pulls.
- Optimizes the image for environments that do not host models locally.

## Important note on runtime behavior
There is undefined behavior if the server attempts to load models or run model-dependent components that were removed by the slim variant. This image should only be used when you are certain that no local model initialization or loading will occur in your deployment.

## References
- Code PR: https://github.com/open-webui/open-webui/pull/16982
