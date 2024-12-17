---
sidebar_position: 7
title: "FAQ"
---

# FAQ

**What's the difference between Functions and Pipelines?**

The main difference between Functions and Pipelines are that Functions are executed directly on the Open WebUI server, while Pipelines are executed on a separate server. Functions are not capable of downloading new packages in Open WebUI, meaning that you are only able to import libraries into Functions that are packaged into Open WebUI. Pipelines, on the other hand, are more extensible, enabling you to install any Python dependencies your filter or pipe could need. Pipelines also execute on a separate server, potentially reducing the load on your Open WebUI instance.
