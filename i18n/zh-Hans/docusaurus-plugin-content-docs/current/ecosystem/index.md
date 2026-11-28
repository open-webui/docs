---
title: "生态系统"
sidebar_position: 1
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 生态系统

<ThemedImage
  alt="生态系统：一个中心方块通过辐条连接周围的四个方块"
  sources={{
    light: useBaseUrl('/images/banners/ecosystem-light.svg'),
    dark: useBaseUrl('/images/banners/ecosystem-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

Open WebUI 是核心 AI 界面和代理控制层。生态系统由一系列独立的 Open WebUI 项目组成，这些项目与 Open WebUI 连接、补全其能力或处理相关任务，同时也可独立发挥作用。

**对于新的代理设置，我们推荐将 [Open WebUI](/getting-started) 与 [Open Terminal](/features/open-terminal) 搭配使用。**

## 项目 {#projects}

- [**Open Terminal 与 Terminals**](/ecosystem/open-terminal)：在聊天中构建应用、生成报告并运行代理。为用户和项目提供各自的持久工作区，或共享环境以便协作。
- [**知识库同步（oikb）**](/ecosystem/knowledge-base-sync)：通过增量同步，将文件夹、仓库、存储桶、wiki 和其他来源镜像到 Open WebUI 知识库。
- [**Open WebUI Tether**](/ecosystem/tether)：让 AI 使用你自己计算机上的文件和工具，在受支持的设备上选择工作区沙盒，并从另一台设备继续工作。
- [**Open WebUI 社区**](/ecosystem/community)：位于 openwebui.com 的社区平台，人们在这里分享模型、提示词、工具、函数和聊天，评价模型，并根据真实用量进行排名。模型、提示词、工具和函数可以直接从相应帖子导入你的实例。
