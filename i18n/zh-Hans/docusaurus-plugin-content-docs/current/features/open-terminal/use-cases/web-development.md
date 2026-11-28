---
sidebar_position: 3
title: "构建并预览网站"
---

# 构建并预览网站

Open Terminal 最出色的能力之一是：AI 构建网站并启动服务器，而你无需离开 Open WebUI，就能**在浏览器标签页（Browser）中实时查看**。然后，你告诉它要更改什么，再重新加载页面即可看到结果。

---

## 工作原理 {#how-it-works}

1. 你要求 AI 创建网站（或 Web 应用、着陆页，或任何基于 Web 的内容）
2. AI 创建文件并启动 Web 服务器
3. Open Terminal **自动检测**正在运行的服务器
4. 你从[浏览器标签页](#the-browser-tab)的**端口（Ports）**列表中打开它
5. 你提出修改要求 → AI 编辑文件 → 你重新加载页面

![AI 检查端口 8080 上的状态页面是否响应并总结其内容](/images/open-terminal-ai-web-dev.png)

---

## “给我做一个着陆页” {#make-me-a-landing-page}

> **你：** 为我的摄影业务创建一个着陆页。包含作品集、关于部分和联系表单。

AI 会创建 HTML、CSS 和 JavaScript 文件并启动 Web 服务器，随后页面会出现在**端口（Ports）**列表中。页面看起来专业而精致，不是一个骨架线框。

![文件浏览器中显示已创建的 HTML 文件](/images/open-terminal-ai-web-dev-files.png)

---

## “更改配色和布局” {#change-the-colors-and-layout}

页面上线后，继续对话即可反复改进：

> **你：** 将背景改为深色，并使用更温暖的配色。将作品集 移到关于部分上方。

AI 会编辑 CSS 和 HTML 文件。重新加载浏览器标签页（Browser）即可看到更改。

---

## “给我做一个可交互的应用” {#build-me-something-interactive}

AI 不仅能创建静态页面，还能创建交互式 Web 应用：

> **你：** 构建一个在浏览器中运行的简单计算器。

![AI 为交互式应用创建并运行代码](/images/open-terminal-ai-code-execution.png)

---

## “帮我修复网站” {#help-me-fix-my-website}

已有网站出现问题或需要修改吗？上传文件并提出要求：

> **你：** *（通过文件浏览器上传 HTML/CSS 文件）* <br/>
> 联系表单无法提交。你能修复吗？

AI 会读取你的代码、找出问题并修复，然后你在浏览器标签页（Browser）中验证。

![AI 找出并修复代码错误](/images/open-terminal-ai-debug-fix.png)

---

## 端口检测的工作原理 {#how-port-detection-works}

要让服务器显示出来，你无需执行任何特殊操作。后台流程如下：

1. AI 启动 Web 服务器（例如 `python -m http.server 3000` 或任何其他服务器）
2. Open Terminal 监控新的网络端口
3. 检测到服务器正在运行后，它会向 Open WebUI 报告该端口
4. 浏览器标签页（Browser）的**端口（Ports）**列表会显示该服务器，Open WebUI 通过自身连接代理流量

这意味着你**无需开放额外端口**，也无需更改任何防火墙设置。它可以直接工作。

:::tip 多个服务器
如果 AI 启动了多个服务器（例如端口 3000 上的前端和端口 5000 上的后端 API），每个服务器都会在**端口（Ports）**列表中单独占一行。分别在各自的浏览器标签页（Browser）中打开。
:::

## 浏览器标签页 {#the-browser-tab}

在支持浏览器会话的终端上，**标签页（Tabs）**的 **+** 菜单会提供**浏览器（Browser）**选项。它的起始页列出终端正在提供服务的**端口（Ports）**；点击其中一个即可加载，也可以输入任何 http 或 https 地址。

选项菜单（**...**）用于选择页面加载方式。**Chrome** 会在终端上运行 Chrome，并以远程视图的形式将其流式传输到标签页，同时提供**移动视图（Mobile view）**和质量设置。**Proxy** 通过终端加载页面。如果终端提供 Chrome，新的浏览器标签页默认使用 Chrome 启动，否则使用 Proxy。如果 Chrome 运行失败，标签页会切换到 Proxy，并显示 **Chrome 运行失败。已切换到 Proxy（Chrome failed. Switched to Proxy.）**。当你或终端失去访问权限时，实时会话会停止。

## 桌面标签页 {#the-desktop-tab}

在支持桌面会话的终端上，**+** 菜单还会提供**桌面（Desktop）**选项。它显示终端的桌面，你可以使用鼠标和键盘进行操作，包括粘贴（当桌面自身没有剪贴板时，会将粘贴的文本输入到桌面中）；还有一个按钮可将其全屏打开。当终端提供桌面音频时，扬声器按钮（**取消静音（Unmute）/静音（Mute）**）可播放其声音。

## 更多可尝试的操作 {#more-things-to-try}

- **[从聊天运行代码 →](./code-execution.md)**：AI 编写、运行和调试代码
- **[分析文档和数据 →](./file-analysis.md)**：电子表格、PDF、Word 文档、电子邮件
- **[自动化任务 →](./system-automation.md)**：文件管理、备份、批量操作
