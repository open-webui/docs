---
title: "Ecosystem"
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Ecosystem

<ThemedImage
  alt="Ecosystem: a central block with spokes to four blocks around it"
  sources={{
    light: useBaseUrl('/images/banners/ecosystem-light.svg'),
    dark: useBaseUrl('/images/banners/ecosystem-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

Open WebUI is the core AI interface and agent control layer. The ecosystem is the set of separate Open WebUI projects that connect to it, complete it, or solve adjacent jobs while staying useful on their own.

**For new agent setups, we recommend [Open WebUI](/getting-started) with [Open Terminal](/features/open-terminal).**

## Projects

- [**Open Terminal & Terminals**](/ecosystem/open-terminal): the action layer that turns Open WebUI into a full agent harness, plus the enterprise orchestrator that provisions governed per-user workspaces with policies for images, tools, resources, storage, security context, cleanup, and resets.
- [**Knowledge Base Sync (oikb)**](/ecosystem/knowledge-base-sync): mirror folders, repos, buckets, wikis, and other sources into Open WebUI Knowledge Bases with incremental sync.
- [**Tether**](/ecosystem/tether): the desktop companion that connects your own computer to Open WebUI as a terminal and shows desktop notifications.
- [**Open WebUI Community**](/ecosystem/community): the community platform at openwebui.com, where people share models, prompts, tools, functions, and chats, review models, and rank them by real usage. Models, prompts, tools, and functions import into your instance straight from their posts.

## Being phased out

[Open WebUI Computer](/ecosystem/computer) is being gradually deprecated. Its documentation remains available for existing installations.
