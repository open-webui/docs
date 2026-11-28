---
sidebar_position: 3
title: "将 Open WebUI 作为应用使用"
---

# 将 Open WebUI 作为应用使用

每个 Open WebUI 实例都是一个**渐进式 Web 应用（Progressive Web App，PWA）**。你可以直接在浏览器中将其作为独立应用安装到手机、平板电脑或桌面设备上，无需单独下载。

## 功能特性 {#what-you-get}

- 主屏幕、任务栏或程序坞上的**应用图标**
- 没有浏览器工具栏或地址栏的**全屏体验**
- 桌面设备上的**独立窗口**，移动设备上的全屏显示
- **独立于浏览器**，拥有自己的窗口和任务条目
- 在“设置（Settings）> 通知（Notifications）”中开启**浏览器通知（Browser Notifications）**后，可收到回复完成、频道消息和日历提醒的**浏览器通知**。通知只会在应用打开时触发；没有推送服务。如果管理员启用了用户 webhook（并为非管理员用户授予 webhook 功能权限），同一选项卡中的**通知目标（Notification Targets）**可以将聊天完成或失败、频道消息、日历和文件处理失败警报发送到 webhook，可以仅在你离开时发送，也可以始终发送。

---

## 在设备上安装 {#install-on-your-device}

### Chrome / Edge（桌面设备） {#chrome--edge-desktop}

1. 在 Chrome 或 Edge 中打开你的 Open WebUI 实例。
2. 点击地址栏中的**安装图标**（⊕），或前往**菜单（Menu）→ 安装 Open WebUI（Install Open WebUI）**。
3. 点击**安装（Install）**。

Open WebUI 现在会显示在应用启动器中，并在自己的窗口中运行。

### Chrome（Android） {#chrome-android}

1. 在 Chrome 中打开你的 Open WebUI 实例。
2. 点击**菜单（Menu，⋮）→ 添加到主屏幕（Add to Home Screen）**或**安装应用（Install app）**。
3. 点击**安装（Install）**。

### Safari（iPhone / iPad） {#safari-iphone--ipad}

1. 在 Safari 中打开你的 Open WebUI 实例。
2. 点击**共享按钮**（↑）。
3. 向下滚动并点击**添加到主屏幕（Add to Home Screen）**。
4. 点击**添加（Add）**。

:::info
Safari 是 iOS 上唯一支持安装 PWA 的浏览器。iOS 上的 Chrome 和 Firefox 无法安装 PWA。
:::

### Firefox（Android） {#firefox-android}

1. 在 Firefox 中打开你的 Open WebUI 实例。
2. 点击**菜单（Menu，⋮）→ 安装（Install）**。

---

## 自定义 PWA（管理员） {#customizing-the-pwa-admins}

管理员可以通过 [`EXTERNAL_PWA_MANIFEST_URL`](/reference/env-configuration#external_pwa_manifest_url) 环境变量指向自定义清单，对 PWA 进行白标定制。这样即可设置自定义应用名称、图标和主题颜色。服务器会在每次请求 `/manifest.json` 时自行获取该 URL，因此该 URL 必须能从服务器访问，而不能只能从浏览器访问。未设置该变量时，清单使用 `WEBUI_NAME` 作为应用名称（不是默认值时会附加 ` (Open WebUI)`），并使用 Open WebUI 徽标作为图标。
