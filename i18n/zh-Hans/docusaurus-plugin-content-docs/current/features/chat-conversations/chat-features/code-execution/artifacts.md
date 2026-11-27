---
sidebar_position: 2
title: "Artifacts"
---

## 什么是 Artifacts，如何在 Open WebUI 中使用它们？ {#what-are-artifacts-and-how-do-i-use-them-in-open-webui}

Open WebUI 中的 Artifacts 是一项受 Claude.AI 的 Artifacts 启发的创新功能，让你能够与聊天中由 LLM 生成的重要且可独立使用的内容进行交互。你可以独立于主对话查看、修改、扩展或引用大段内容，从而更轻松地处理复杂输出，并确保以后能够重新查阅重要信息。

## Open WebUI 何时使用 Artifacts？ {#when-does-open-webui-use-artifacts}

当生成的内容符合针对我们平台制定的特定条件时，Open WebUI 会创建 Artifact：

1. **可渲染**：要显示为 Artifact，内容必须采用 Open WebUI 支持渲染的格式。这包括：

- 单页 HTML 网站
- 可缩放矢量图形（SVG）图片
- 完整网页，即在同一个 Artifact 中包含 HTML、JavaScript 和 CSS。请注意，生成完整网页时必须包含 HTML。
- ThreeJS 可视化，以及 D3.js 等其他 JavaScript 可视化库。

Open WebUI 不会将文档（Markdown 或纯文本）、代码片段和 React 组件等其他内容类型渲染为 Artifacts。

## Open WebUI 的模型如何创建 Artifacts？ {#how-does-open-webuis-model-create-artifacts}

要在 Open WebUI 中使用 Artifacts，模型必须提供能够触发 Artifact 渲染过程的内容。这需要生成有效的 HTML、SVG 代码或其他受支持的 Artifact 渲染格式。当生成的内容符合上述条件时，Open WebUI 会将其显示为交互式 Artifact。

## 如何在 Open WebUI 中使用 Artifacts？ {#how-do-i-use-artifacts-in-open-webui}

通过[标签栏](/features/chat-conversations/chat-features/#tabs-side-panel)中的 **+** 菜单打开 **Artifacts**。当聊天包含可渲染的 Artifact，并且你的账户可以看到 Artifacts 控件时，才会显示此入口。**设置 > 界面 > Artifacts > 自动检测 Artifacts（Settings > Interface > Artifacts > Detect Artifacts Automatically）**默认开启，用于控制生成新 Artifact 时是否自动打开标签页。移动端和紧凑预览不会自动打开。即使关闭自动检测，你仍然可以使用标签页菜单。

- **编辑与迭代**：在聊天中要求 LLM 编辑或迭代内容，这些更新会直接显示在 Artifact 窗口中。你可以使用 Artifact 左上角的版本选择器切换版本。每次编辑都会创建新版本，因此可以通过版本选择器跟踪更改。
- **更新**：Open WebUI 可能会根据你的消息更新现有 Artifact。Artifact 窗口会显示最新内容。

使用预览上方的工具栏复制或下载所选版本。对于 HTML 预览，点击工具栏右端的**全屏打开（Open in full screen）**。SVG 预览提供平移和缩放控件。渲染为 Rich UI 嵌入内容的工具输出有自己的查看器，不显示 Artifacts 工具栏。

## 使用 CSP 保护 Artifact 预览 {#securing-artifact-previews-with-a-csp}

Artifact 预览在沙箱化的 `srcdoc` iframe 中渲染。如需更严格地控制生成的 HTML 可以执行的操作（出站网络请求、脚本、样式），请通过 [`IFRAME_CSP`](/reference/env-configuration#iframe_csp) 环境变量向预览注入专用的内容安全策略，它与主应用的 `CONTENT_SECURITY_POLICY` 相互独立。

该变量默认为空（iframe 的 `sandbox` 已提供基础隔离），并应用于 UI 中的**每一个** `srcdoc` iframe：Artifacts、代码/HTML 预览、文件预览、引用弹窗、MCP Apps 和 Visualizations。设置后，Open WebUI 会在 iframe 文档开头添加 `<meta http-equiv="Content-Security-Policy">` 标签；按照 CSP 规范，首个策略生效，因此它会覆盖生成的 HTML 已声明的任何 CSP。可以从以下合理配置开始：

```bash
IFRAME_CSP=default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'none'
```

这样既能保持内联脚本和样式正常工作（大多数 Artifacts 都需要它们），又能阻止 `fetch` / `XMLHttpRequest` / `WebSocket`，防止 Artifact 在不易察觉的情况下发起网络请求。

:::tip 先宽松，再收紧
过于严格的策略可能会使预览显示为空白，因为许多 Artifacts 依赖内联 `<script>` 和 `<style>`。请先采用宽松策略，再逐步收紧。`IFRAME_CSP` 是启动环境变量（不是管理员面板设置），更改后需要重启。有关侧重安全的操作说明，请参阅[安全加固 → iframe 内容安全策略](/getting-started/advanced-topics/hardening#iframe-content-security-policy)。
:::

## 预览可以执行哪些操作 {#what-a-preview-is-allowed-to-do}

预览 iframe 的沙箱由**设置 > 界面（Settings > Interface）**中的四项设置共同组成，因此无需修改 CSP，即可收紧或放宽生成的 HTML 所能执行的操作。

| 设置 | 默认值 | 允许的操作 |
| :--- | :--- | :--- |
| **iframe 沙箱允许脚本（iframe Sandbox Allow Scripts）** | 开启 | JavaScript 在预览内运行。大多数 Artifacts 都需要此功能，关闭后所有交互内容都会失去响应。 |
| **iframe 沙箱允许表单（iframe Sandbox Allow Forms）** | 开启 | 可以提交预览内的表单。 |
| **iframe 沙箱允许下载（iframe Sandbox Allow Downloads）** | 开启 | 预览可以启动文件下载。 |
| **iframe 沙箱允许同源（iframe Sandbox Allow Same Origin）** | 关闭 | 预览被视为与你的 Open WebUI 同源。 |

除非有明确需求，否则请保持**允许同源（Allow Same Origin）**关闭。开启后，预览中的脚本与应用程序同源，这意味着它可以访问你的会话，而不是被限制在框架内。下方[故障排除部分](#artifacts-preview-not-working-uncaught-securityerror)介绍了一种确实需要启用它的错误。

另外三项设置控制内容在自身框架内可以执行的操作。关闭它们可以在渲染你不信任的内容时，让这些内容保持不可交互状态。

## 编辑 Artifacts {#editing-artifacts}

1. **定向更新**：描述要更改的内容和位置。例如：

- “将图表中条形的颜色从蓝色改为红色。”
- “将 SVG 图片的标题更新为‘新标题’。”

2. **整体重写**：请求影响大部分内容的重大更改，以进行实质性重构或更新多个部分。例如：

- “将这个单页 HTML 网站重写为落地页。”
- “重新设计此 SVG，使用 ThreeJS 让它动起来。”

**最佳实践**：

- 明确说明要更改 Artifact 的哪个部分。
- 定向更新时，引用目标更改附近具有唯一性的标识文本。
- 考虑小范围更新还是整体重写更符合你的需求。

## 使用场景 {#use-cases}

Open WebUI 中的 Artifacts 让各类团队能够快速、高效地创建高质量工作成果。以下是一些针对我们平台的示例：

- **设计师**：
  - 为 UI/UX 设计创建交互式 SVG 图形。
  - 设计单页 HTML 网站或落地页。
- **开发者**：创建简单的 HTML 原型，或为项目生成 SVG 图标。
- **营销人员**：
  - 设计带有效果指标的推广活动落地页。
  - 为广告创意或社交媒体帖子创建 SVG 图形。

## 使用 Open WebUI Artifacts 可以创建的项目示例 {#examples-of-projects-you-can-create-with-open-webuis-artifacts}

Open WebUI 中的 Artifacts 让各类团队和个人能够快速、高效地创建高质量工作成果。以下是一些针对我们平台的示例，展示 Artifacts 的多种用途，并启发你探索其潜力：

1. **交互式可视化**

- 使用的组件：ThreeJS、D3.js 和 SVG
- 优势：通过交互式可视化创建沉浸式数据叙事。Open WebUI 的 Artifacts 支持切换版本，便于测试不同的可视化方法并跟踪更改。

示例项目：使用 ThreeJS 构建交互式折线图，可视化股价随时间的变化。在不同版本中更新图表的颜色和刻度，比较不同的可视化策略。

2. **单页 Web 应用程序**

- 使用的组件：HTML、CSS 和 JavaScript
- 优势：直接在 Open WebUI 中开发单页 Web 应用程序。通过定向更新和整体重写编辑并迭代内容。

示例项目：设计一个待办事项应用，使用 HTML 和 CSS 构建用户界面，使用 JavaScript 添加交互功能。通过定向更新和整体重写调整应用的布局及 UI/UX。

3. **动画 SVG 图形**

- 使用的组件：SVG 和 ThreeJS
- 优势：为营销活动、社交媒体或网页设计创建引人入胜的动画 SVG 图形。Open WebUI 的 Artifacts 支持在一个窗口中编辑并迭代图形。

示例项目：为公司品牌设计动画 SVG 标志。使用 ThreeJS 添加动画效果，并通过 Open WebUI 的定向更新优化标志的颜色和设计。

4. **网页原型**

- 使用的组件：HTML、CSS 和 JavaScript
- 优势：直接在 Open WebUI 中构建和测试网页原型。切换版本以比较不同的设计方案并完善原型。

示例项目：使用 HTML、CSS 和 JavaScript 开发一个新的电子商务网站原型。通过 Open WebUI 的定向更新优化导航、布局和 UI/UX。

5. **交互式叙事**

- 使用的组件：HTML、CSS 和 JavaScript
- 优势：创建具有滚动效果、动画和其他交互元素的交互式故事。Open WebUI 的 Artifacts 支持完善故事并测试不同版本。

示例项目：构建一个关于公司历史的交互式故事，利用滚动效果和动画吸引读者。使用定向更新完善故事叙述，并使用 Open WebUI 的版本选择器测试不同版本。

## 故障排除 {#troubleshooting}

### Artifacts 预览无法工作（Uncaught SecurityError） {#artifacts-preview-not-working-uncaught-securityerror}

如果聊天界面中的代码预览未显示，并且你在浏览器控制台中看到类似 `Artifacts.svelte:40 Uncaught SecurityError` 的错误，这通常是由某些环境配置中的跨域 iframe 限制引起的。

**解决方案：**

1. 进入**设置 > 界面（Settings > Interface）**。
2. 开启**iframe 沙箱允许同源（iframe Sandbox Allow Same Origin）**。
3. 保存设置。

### 设置 CSP 后 Artifact 预览为空白 {#artifact-preview-is-blank-after-setting-a-csp}

如果设置 [`IFRAME_CSP`](/reference/env-configuration#iframe_csp) 后预览停止渲染，说明该策略阻止了生成的 HTML 所需的某些资源。

1. 打开浏览器开发者工具，在控制台中查找 **CSP violation（CSP 违规）**消息。
2. 仅针对被阻止的资源类型或来源放宽策略（常见的是内联 `script` / `style`、`eval`，或特定的图片、字体或 `connect` 来源）。
3. 要完全排除 CSP 的影响，请暂时取消设置 `IFRAME_CSP` 并重启；预览会回退到仅使用沙箱隔离。
