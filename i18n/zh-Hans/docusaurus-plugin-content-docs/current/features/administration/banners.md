---
sidebar_position: 13
title: "可自定义横幅"
---

## 概述 {#overview}

Open WebUI 允许管理员在新聊天界面显示自定义横幅。横幅仅在没有打开聊天时显示在聊天标题栏下方，不会显示在工作区、管理页面或其他页面上。每个具有 `user` 或 `admin` 角色的账户都会看到相同的横幅列表，仍处于 `pending` 角色的账户不会看到横幅。横幅适用于公告、全系统警报、维护通知及其他重要消息。

用户可以关闭当前页面加载期间显示的任何横幅，横幅也可以选择记住关闭状态。可以通过以下两种方式配置横幅：

1. **管理员面板**（推荐用于快速编辑和试验）
2. **环境变量（`WEBUI_BANNERS`）**（推荐用于自动化 / GitOps 式部署）

---

## 何时使用横幅 {#when-to-use-banners}

横幅最适合简短、醒目的消息，例如：

- 计划维护和预定停机时段
- 事件通知（性能下降、部分服务中断）
- 政策提醒（合理使用、数据处理、保留期限）
- 重大变更（新模型、功能发布、界面变化）
- 指向内部沟通渠道的链接，用于获取最新动态和答疑

**提示：**保持横幅简洁，并链接到更详细的信息（状态页、发行说明、支持渠道）。

---

## 配置横幅 {#configuring-banners}

### 方式 1：使用管理员面板 {#option-1-using-the-admin-panel}

这是管理横幅最直接的方式：

1. 以管理员身份登录 Open WebUI 实例。
2. 导航到**设置** → **常规**（管理区域）。
3. 找到**横幅**部分。
4. 点击 **+** 图标添加新横幅。
5. 点击**保存**应用更改。

可以为每个横幅配置以下选项：

- **类型：**横幅的颜色和样式：
  - `info`（蓝色）
  - `success`（绿色）
  - `warning`（黄色）
  - `error`（红色）
- **标题：**横幅的主标题。
- **内容：**主要消息。系统会渲染 Markdown，并允许使用内联 HTML，两者都会经过清理器处理。解析前，每个换行符都会转换为换行，因此不会形成多行 Markdown 块（列表、表格、块引用）。这些内容请使用相应的 HTML 形式。
- **记住关闭状态：**启用后，用户关闭的横幅会保持关闭状态；禁用后，横幅会在下次加载页面时再次显示。

**横幅**标题旁的地球选择器会按语言存储内容，因此每位用户都能以其界面所用语言阅读横幅。请参阅[翻译](/features/administration/translations#banners)。

#### 关闭状态的工作方式 {#how-dismissing-works}

已关闭横幅的信息存储在用户浏览器中（客户端）。这意味着：

- 如果用户清除站点数据 / 缓存，已关闭的横幅可能会重新出现
- 已关闭的横幅可能会在其他设备或浏览器上重新出现
- 关闭状态按横幅 `id` 分别记录（如果 `id` 发生变化，该横幅会被视为新横幅）

如果需要横幅在每次加载页面时都重新出现，请设置 `dismissible: false`。

---

### 方式 2：使用环境变量（`WEBUI_BANNERS`） {#option-2-using-environment-variables-webui_banners}

对于自动化部署，请使用 `WEBUI_BANNERS` 环境变量配置横幅。其值必须是表示横幅对象**列表**（数组）的 **JSON 字符串**。

**环境变量：**

- `WEBUI_BANNERS`
  - **类型：**`string`（包含对象组成的 JSON 列表）
  - **默认值：**`[]`
  - **说明：**要向用户显示的横幅对象列表

#### 示例（Docker Compose） {#example-docker-compose}

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - 'WEBUI_BANNERS=[{"id":"maintenance-2026-03","type":"warning","title":"Maintenance","content":"A maintenance window is planned this week. Expect brief interruptions. <a href=\"https://intranet.example.com/status\" target=\"_blank\">See status page</a>.","dismissible":true,"timestamp":1772500000}]'
```

> 注意：由于 `WEBUI_BANNERS` 是 YAML 中的 JSON 字符串，必须确保它仍是有效的 JSON（参见下方的“常见陷阱”）。

---

## 横幅对象属性 {#banner-object-properties}

每个横幅对象支持以下属性：

- `id`（字符串，必填）：横幅的唯一标识符，用于跟踪用户是否已关闭该横幅。
- `type`（字符串，必填）：横幅样式，必须是以下值之一：`info`、`success`、`warning`、`error`。
- `title`（字符串，可选）：标题文本。
- `content`（字符串，必填）：横幅的主要消息（支持 Markdown 和内联 HTML）。
- `dismissible`（布尔值，必填）：已关闭的横幅是否对该用户保持关闭状态（即**记住关闭状态**开关）。
- `timestamp`（整数，必填）：存在于配置中，但前端目前不使用它控制显示时间。
- `i18n`（对象，可选）：按语言组织键的翻译内容，每个条目包含一个 `content` 字符串。系统会向用户显示与其界面语言匹配的条目，并回退到 `content`。请参阅[翻译](/features/administration/translations#banners)。

### 推荐的 `id` 策略（重要） {#recommended-id-strategy-important}

选择一种支持安全更新的 `id` 格式，避免横幅意外重新显示或永久隐藏：

- 小幅文字编辑使用稳定的 `id`：`policy-reminder`
- 需要“再次向所有人显示”的更新使用带版本号的 `id`：`incident-2026-03-06-v2`
- 周期性事件使用按时间划分的 `id`：`maintenance-2026-03`

如果用户已经关闭了某个横幅，而你希望他们看到更新后的消息，请更改 `id`。

---

## 支持的内容格式 {#supported-content-formatting}

横幅 `content` 会先按 Markdown 解析，再经过清理，因此内联 Markdown（`**bold**`、`[link](url)`、反引号）和内联 HTML 均可渲染。由于解析前每个换行符都会转换为换行，跨行的 Markdown 块（多行列表、表格、块引用、后续行上的标题）不会形成。HTML 列表、标题、表格和块引用可以渲染。JSON 中接受 `title`，但它不会显示：编辑器没有标题字段，横幅显示的是类型标签和内容。

### 文本格式 {#text-formatting}

| HTML | 效果 |
| --- | --- |
| `<b>` / `<strong>` | 粗体 |
| `<i>` / `<em>` | 斜体 |
| `<u>` | 下划线 |
| `<s>` / `<del>` | 删除线 |
| `<mark>` | 高亮 |
| `<small>` | 略小的文本 |
| `<sub>` / `<sup>` | 下标 / 上标 |
| `<code>` / `<kbd>` | 等宽内联代码 |
| `<abbr title="tooltip">` | 悬停工具提示 |

### 结构 {#structure}

| HTML | 效果 |
| --- | --- |
| `<br>` 或字面换行符 | 换行 |
| `<hr>` | 水平分隔线 |
| `<details><summary>Click</summary>...</details>` | 可折叠部分 |

### 链接与媒体 {#links--media}

| HTML | 效果 |
| --- | --- |
| `<a href="...">` | 可点击的链接。清理器会移除 `target`，因此链接在同一标签页中打开 |
| `<img src="..." width="16" height="16">` | 内联图片 |

### 自定义样式 {#custom-styling}

允许的标签支持内联样式：

```html
<span style="color: #b91c1c;">彩色文本</span>
<span style="font-weight: 600;">较粗字重</span>
<span style="background: linear-gradient(90deg,#e0f2fe,#fef9c3);">渐变背景</span>
```

也可以将内容包裹在块级元素中，为整个消息区域设置样式：

```html
<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:12px;padding:10px 14px;line-height:1.3;display:block;width:100%;box-sizing:border-box;">
  <b>通知标题</b><br>
  简短的补充消息。
</div>
```

> 样式应有明确用途。过大的内边距、过大的字号或层级过深的布局会使横幅过高，并导致不同主题下的视觉效果不一致。

---

## 设计有效的横幅 {#designing-effective-banners}

易于快速浏览、视觉上有区分度且足够简短、不会打断正常工作的横幅效果最佳。

### 组织消息结构 {#structure-the-message}

采用可预测的结构：

- 以事件类型或状态开头：`Maintenance`、`Incident`、`Policy update`、`New feature`。
- 将最重要的详细信息放在前面：日期、时间、影响或需要执行的操作。
- 正文控制在一两个短句内。
- 仅在用户需要更多详细信息时添加一个链接。

对于较长的通知，请使用简短的小节，而不是一个长段落。对于多语言通知，请使用不显眼的 `<hr>` 分隔不同语言，或使用可折叠的 `<details>` 部分。

### 让严重程度清晰可见 {#make-severity-visible}

一致地使用横幅 `type`：

- `info`：中性公告和产品更新。
- `success`：已解决的事件或已完成的变更。
- `warning`：计划维护、服务降级或即将需要执行的操作。
- `error`：正在发生的事件或需要紧急执行的操作。

避免将 `error` 用于非紧急公告。如果每条消息看起来都很严重，用户就会逐渐忽略警报。

### 谨慎使用颜色 {#use-color-carefully}

颜色应辅助表达横幅类型，而不是与之争夺注意力：

- 为整个消息区域使用柔和的背景色。
- 为小面积点缀、标签或左边框使用较鲜明的颜色。
- 保持足够的文本对比度，确保在明亮环境和昏暗屏幕上都能阅读。
- 避免在一个横幅中混用许多不相关的颜色。

一种实用的模式是浅色背景搭配较醒目的左边框：

```html
<div style="background:#f8fafc;color:#334155;border:1px solid #cbd5e1;border-left:6px solid #64748b;border-radius:12px;padding:10px 14px;line-height:1.3;display:block;width:100%;box-sizing:border-box;">
  <b>通知标题</b><br>
  简短的补充消息。
</div>
```

### 保持布局响应式 {#keep-layouts-responsive}

横幅显示在应用布局内，在窄屏幕上也必须正常工作。

- 对于包含标签、日期或徽章的行，优先使用 `display:flex;flex-wrap:wrap`。
- 避免使用固定宽度。
- 对于全宽样式块，使用 `width:100%;box-sizing:border-box`。
- 保持图标和徽章小巧，以免增加横幅高度。
- 广泛使用前，先在较窄的浏览器窗口中测试横幅。

### 避免意外增加高度 {#avoid-accidental-extra-height}

横幅内容会将字面换行符视为换行。如果使用显式的 `<br>` 标签，请保持原始 HTML 紧凑，避免在横幅内容字段中添加额外的空行或缩进。

这种紧凑写法：

```html
<b>通知</b><br>一个短句。<br>另一个短句。
```

比包含大量换行、格式繁复的 HTML 具有更可预测的渲染效果。

---

## 不支持的内容 {#unsupported-content}

横幅不支持以下内容，它们可能会渲染为纯文本或破坏布局：

- 标题（`<h1>` 至 `<h6>`）
- 列表（`<ul>`、`<ol>`）
- 表格
- 块引用
- Markdown 语法

如果需要“类似列表”的内容，请使用由 `<br>` 分隔的短行。

---

## 常见陷阱（及避免方法） {#common-pitfalls-and-how-to-avoid-them}

### 1) 字面换行符导致意外间距 {#1-unexpected-spacing-from-literal-newlines}

横幅内容会将**字面换行符**视为换行。如果粘贴格式整齐、带缩进且包含大量换行的 HTML，横幅可能会比预期高很多。

**建议：**
- 有意识地使用 `<br>`，并保持原始 HTML 相对紧凑。
- 除非确实需要额外间距，否则避免添加空行。

### 2) 横幅内容中的链接损坏 {#2-broken-links-in-banner-content}

如果链接似乎“损坏”，或者横幅的其余部分都变得可点击，通常是由无效 HTML 导致的。

请严格使用以下模式：

```html
<a href="https://example.com" target="_blank">打开链接</a>
```

**建议：**
- 始终使用 `</a>` 闭合锚点标签。
- 清理器会移除 `target="_blank"`，因此它不起作用。链接会在同一标签页中打开。
- 如果 URL 包含查询参数，请在 `href` 属性中将 `&` 转义为 `&amp;`：
  ```html
  <a href="https://example.com/page?x=1&amp;y=2" target="_blank">示例</a>
  ```
- 如果需要确保显示下划线，请用 `<u>` 包裹链接文本：
  ```html
  <a href="https://example.com" target="_blank"><u>支持</u></a>
  ```

### 3) `WEBUI_BANNERS` 中的 JSON/YAML 转义问题 {#3-jsonyaml-escaping-issues-in-webui_banners}

使用 `WEBUI_BANNERS` 时，需要将 JSON 嵌入 YAML 字符串（或 shell 字符串）中。常见问题包括：

- JSON 内部的双引号未转义
- JSON 字符串中插入了换行
- 复制 / 粘贴了“智能引号”（排版引号），而不是普通的 `"`

**建议：**
- 部署前使用 JSON 验证器验证 JSON。
- 保持 `content` 字符串简单，避免未转义的 `"` 字符。
- 如有需要，优先在 JSON 字符串内使用 `\"` 表示引号。
- 如果横幅未显示，请检查服务器日志。

### 4) 过度使用 `<small>` {#4-overusing-small}

`<small>` 适用于次要文本，但用 `<small>` 包裹横幅的大部分内容会使其难以阅读。

**建议：**主要消息使用正常文本，将 `<small>` 留给不太重要的详细信息。

### 5) 外部图片 {#5-external-images}

可以通过 `<img>` 嵌入图片，但外部图片可能：
- 因网络限制而加载失败
- 在未限制尺寸时，在不同设备上呈现不一致的大小
- 从第三方域加载时带来隐私 / 安全问题

**建议：**
- 尽可能优先使用内部 / 静态资源。
- 始终明确设置 `width` 和 `height`。
- 保持图标小巧（例如 16×16），以免增加横幅高度。

---

## 可复用模式（复制 / 粘贴片段） {#reusable-patterns-copypaste-snippets}

### 模式：带链接的极简两行公告 {#pattern-minimal-two-line-announcement-with-a-link}

```html
<b>通知</b><br>
服务更新：<a href="https://example.com/status" target="_blank"><u>状态页</u></a>
```

### 模式：紧凑的胶囊标签（日期 / 影响标记） {#pattern-compact-label-chip-dateimpact-tag}

```html
<span style="display:inline-block;background:#fff3cd;color:#664d03;padding:2px 8px;border-radius:999px;">
  已计划
</span>
```

### 模式：带样式的通知块 {#pattern-styled-notice-block}

当整条消息应作为一个公告区域阅读时，使用全宽样式块。粘贴到横幅内容字段时请保持此 HTML 紧凑，尤其是在其中还包含 `<br>` 标签时。

```html
<div style="background:#f8fafc;color:#334155;border:1px solid #cbd5e1;border-left:6px solid #64748b;border-radius:12px;padding:10px 14px;line-height:1.3;display:block;width:100%;box-sizing:border-box;"><div style="display:flex;flex-wrap:wrap;align-items:center;gap:5px 8px;margin-bottom:5px;"><span style="display:inline-flex;align-items:center;background:#64748b;color:#fff;padding:1px 7px;border-radius:999px;line-height:1.25;font-size:10px;font-weight:700;letter-spacing:.04em;">通知</span><b>通知标题</b><span style="display:inline-flex;align-items:center;background:#fff;color:#334155;padding:1px 8px;border-radius:999px;line-height:1.25;border:1px solid #cbd5e1;">关键详情</span></div><div>简短的补充消息。</div></div>
```

此模式使用：

- 为整个消息区域设置浅色背景。
- 使用较醒目的左边框，便于快速视觉识别。
- 使用小型大写标签表示事件类型。
- 使用紧凑的日期 / 时间胶囊标签展示最重要的元数据。
- 使用 `flex-wrap`，使标题行在窄屏幕上仍能正常显示。

### 模式：可折叠详情（保持横幅简短） {#pattern-collapsible-details-keep-banners-short}

```html
<b>计划更新</b><br>
<details>
  <summary>更多详情</summary>
  <br>
  此更新可能会在部署时段内造成短暂中断。
</details>
```

---

## 运维最佳实践 {#operational-best-practices}

### 保持横幅易于浏览 {#keep-banners-scannable}

好的横幅通常包括：
- 一个简短的标题
- 一句描述情况的文字
- 一个详情链接和一个提问链接（如有需要）

### 一致地使用横幅类型 {#use-banner-types-consistently}

为减少警报疲劳，可以考虑采用一致的映射：
- `info`：一般公告
- `success`：已完成的变更 / 已解决的事件
- `warning`：计划维护或部分降级
- `error`：正在发生的事件 / 服务中断

### 移除过期横幅 {#remove-expired-banners}

如果不断添加横幅却不移除旧横幅，用户可能会忽略它们。事件结束后，请移除或替换相应横幅。

---

## 故障排除 {#troubleshooting}

### 横幅未显示 {#banner-not-appearing}

- 确保 `WEBUI_BANNERS` 是由对象组成的有效 JSON **数组**（而不是单个对象）。
- 检查服务器日志中与 `WEBUI_BANNERS` 相关的解析错误。
- 如果使用管理员面板，请确认已点击**保存**。
- 如果重启后对 `WEBUI_BANNERS` 的更改没有生效，请检查**设置 > 常规**（管理区域）下的**横幅**。启用持久化配置后，已保存的列表优先于环境变量，即使已保存的列表为空也是如此。请在该处更新列表并点击**保存**。

### 无法关闭横幅 {#banner-cannot-be-dismissed}

- 确认 `dismissible` 已设置为 `true`。
- 每个横幅都可以通过其 × 按钮关闭。`dismissible: true`（编辑器中的**记住关闭状态**开关）会在浏览器中记住关闭状态，使横幅保持隐藏。`false` 仅将其隐藏到页面重新加载为止。无法将横幅设置为不可关闭。

### 横幅布局看起来异常或过高 {#banner-layout-looks-broken-or-too-tall}

- 移除原始 HTML 中多余的空行和缩进。
- 避免使用不支持的 HTML（列表、表格、标题）。
- 减少过于激进的内联样式（较大的 `padding`、较大的 `font-size`）。

---

## 常见问题 {#faq}

### 可以在横幅内容中使用 Markdown 吗？ {#can-i-use-markdown-in-banner-content}

可以，但仅限内联 Markdown。内容会先按 Markdown 解析，再经过清理。由于换行符会先转换为换行，多行 Markdown 块不会形成，因此需要跨多行的列表、表格和标题请使用 HTML。

### `timestamp` 是否控制横幅的显示时间？ {#does-timestamp-control-when-a-banner-shows}

不控制。前端目前不使用 `timestamp` 字段控制是否显示横幅。如果需要基于时间的行为，请通过部署自动化进行管理（按计划添加 / 移除横幅）。

### 可以显示多语言内容吗？ {#can-i-show-content-in-multiple-languages}

可以，更好的方式是翻译横幅，而不是在一条消息中堆叠多种语言：使用**横幅**标题旁的地球选择器，每位用户就只会看到自己的语言。请参阅[翻译](/features/administration/translations#banners)。通过 `WEBUI_BANNERS` 设置的横幅也可以在横幅上携带同样内容的 `i18n` 对象，该对象按语言组织键，每个条目包含一个 `content` 字符串。
