---
sidebar_position: 3
title: "Python 代码执行"
---

# Python 代码执行

## 概述 {#overview}

Open WebUI 提供两种执行 Python 代码的方式：

![代码执行设置](/images/admin/admin-code-execution.png)

1. **手动代码执行**：使用浏览器中的“运行（Run）”按钮运行 LLM 生成的 Python 代码块（使用 Pyodide/WebAssembly）。
2. **代码解释器**：一种 AI 能力，允许模型在回复过程中自动编写并执行 Python 代码（使用 Pyodide 或 Jupyter）。

两种方式都支持 matplotlib 图表等可视化输出，并能将其内联显示在聊天中。使用 Pyodide 引擎时，`/mnt/uploads/` 处会提供一个**持久虚拟文件系统**。文件可在多次代码执行之间保留（设置 [`ENABLE_PYODIDE_FILE_PERSISTENCE`](/reference/env-configuration#enable_pyodide_file_persistence) 后，还可在页面重新加载后保留），具有服务器文件 ID 的消息附件也可以挂载到该目录供代码访问。

:::caution Pyodide 和 Jupyter 是遗留引擎
浏览器内的 **Pyodide** 引擎和 **Jupyter** 引擎都属于**遗留**引擎。它们仍用于零配置的聊天内 Python 执行，但对于实际工作负载、完整的软件包支持和 Shell 访问，请改用 **[Open Terminal](/features/chat-conversations/chat-features/code-execution#open-terminal)**。Pyodide 可能会在未来版本中弃用。
:::

## 代码解释器能力 {#code-interpreter-capability}

代码解释器是一种模型能力，使 LLM 能够在对话中自主编写并执行 Python 代码。启用后，模型可以：

- 执行计算和数据分析
- 生成可视化内容（图表、图形、绘图）
- 动态处理数据
- 执行多步骤计算任务

### 启用代码解释器 {#enabling-code-interpreter}

**按模型配置（管理员）：**
1. 进入**设置 > 模型（Settings > Models）**（管理员区域）
2. 选择要配置的模型
3. 在**功能（Features）**下启用**代码解释器（Code Interpreter）**
4. 保存更改

**全局配置（管理员面板）：**

这些设置可以在**设置 > 代码执行（Settings > Code Execution）**（管理员区域，位于**遗留（Legacy）**下）中配置：
- 启用/禁用代码解释器
- 选择引擎：**pyodide** 或 **jupyter (Legacy)**（如需完整 Python 和 Shell 访问，请改用 [Open Terminal](/features/open-terminal)）
- 配置 Jupyter 连接设置
- 编辑代码解释器提示词模板

**全局配置（环境变量）：**

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| `ENABLE_CODE_INTERPRETER` | `true` | 全局启用/禁用代码解释器 |
| `CODE_INTERPRETER_ENGINE` | `pyodide` | 要使用的引擎：`pyodide`（浏览器，遗留）或 `jupyter`（服务器，遗留）。如需完整 Python 和 Shell 访问，请改用 [Open Terminal](/features/open-terminal)。 |
| `CODE_INTERPRETER_PROMPT_TEMPLATE` | （内置） | 代码解释器的自定义提示词模板 |
| `CODE_INTERPRETER_BLOCKED_MODULES` | `""` | 以逗号分隔、禁止导入的模块名称。默认为空。仅阻止直接的顶层导入；它是可选启用的便利过滤器，不是安全边界。请参阅[参考文档](/reference/env-configuration#code_interpreter_blocked_modules)。 |

有关 Jupyter 配置，请参阅 [Jupyter Notebook 集成](/tutorials/integrations/dev-tools/jupyter)教程。使用 Jupyter 引擎时，[`ENABLE_ORJSON`](/reference/env-configuration#enable_orjson)（默认开启）可以更快地将运行结果传入聊天，在代码输出大量内容或生成图片时效果尤为明显。

:::note 文件系统提示词注入
选择 Pyodide 引擎时，Open WebUI 会自动向代码解释器指令追加一段文件系统感知提示词。该提示词会向模型说明 `/mnt/uploads/` 以及如何发现用户上传的文件。使用 Jupyter 时，不会追加此文件系统提示词（因为 Jupyter 有自己的文件系统）。你无需在自定义 `CODE_INTERPRETER_PROMPT_TEMPLATE` 中加入文件系统指令，系统会自动添加。
:::

### Jupyter 连接设置 {#jupyter-connection-settings}

**设置 > 代码执行（Settings > Code Execution）**（管理员区域）包含两个独立部分。**代码执行（Code Execution）**由**启用代码执行（Enable Code Execution）**控制，驱动代码块上的**运行（Run）**按钮。**代码解释器（Code Interpreter）**由**启用代码解释器（Enable Code Interpreter）**控制，驱动模型自主运行的代码。每个部分都有独立的引擎、**Jupyter URL**、**Jupyter Auth**、凭据和**代码执行超时（Code Execution Timeout）**设置，因此在其中一个部分配置 Jupyter 并不会同时配置另一个。启用某个部分并将其引擎设为 **jupyter (Legacy)** 后，Jupyter 字段才会显示。

**Jupyter Auth** 提供 **None**、**Token** 和 **Password**，下方字段会随之变化：

| **Jupyter Auth** | 字段 | Open WebUI 向 Jupyter 服务器发送的内容 |
| --- | --- | --- |
| **None** | 无 | 不发送凭据 |
| **Token** | **Jupyter Token** | 在内核 API 调用和内核 WebSocket URL 中，将令牌作为 `token` 查询参数发送 |
| **Password** | **Jupyter Password** | 先通过 `GET login` 读取 `_xsrf` Cookie，再通过包含密码的 `POST login` 表单登录。随后，内核 API 调用和 WebSocket 会携带会话 Cookie 及 `X-XSRFToken` 请求头 |

系统只发送所选模式对应的凭据。选择 **Password** 时，之前保存的令牌会保持未使用状态。每次运行都会启动一个新的 Jupyter 内核，并在运行结束时删除它，因此变量和导入不会从一次运行延续到下一次。

### 原生函数调用（Native 模式） {#native-function-calling-native-mode}

对当前模型使用**原生函数调用模式（Native function calling mode）**时（至少支持 GPT-5.6 Luna、Gemini 3.5 Flash-Lite、MiniMax M3，或本地运行的 Muse Glimmer 30B），代码解释器可作为名为 `execute_code` 的内置工具使用。这能提供更完整的集成体验：

- **无需 XML 标签**：模型直接调用 `execute_code(code)`
- **相同的图片处理方式**：输出中的 Base64 图片 URL 会被替换为文件 URL；模型通过 Markdown 嵌入图片
- **此处不执行标签**：系统只在 Legacy 模式下教授并处理标签格式。Native 模式下的模型如果自行编写代码解释器标签块，该标签块会显示为文本而不会运行，因为需要执行的代码应通过工具调用传入。

**要求：**
1. 必须全局启用 `ENABLE_CODE_INTERPRETER`
2. 必须在模型的**功能（Features）**下开启代码解释器
3. 模型必须采用 **Native** 函数调用模式（默认模式；只有在模型的高级参数中切换为 **Legacy** 时才需要检查此项）

有关内置工具和 Native 模式的更多详细信息，请参阅[工具开发指南](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)。

## 内联显示图片（matplotlib 等） {#displaying-images-inline-matplotlib-etc}

使用 matplotlib 或其他可视化库时，图片可以直接显示在聊天中。要正确实现这一点，代码必须以 **base64 data URL** 的形式输出图片。

### matplotlib 的推荐写法 {#recommended-pattern-for-matplotlib}

```python
import matplotlib.pyplot as plt
import io
import base64

# 创建图表
plt.figure(figsize=(10, 6))
plt.bar(['A', 'B', 'C'], [4, 7, 5])
plt.title('Sample Chart')

# 输出为 base64 data URL（触发自动上传）
buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode('utf-8')
print(f"data:image/png;base64,{img_base64}")
plt.close()
```

### 图片显示的工作原理 {#how-image-display-works}

1. 代码执行并将 `data:image/png;base64,...` 输出到 stdout
2. Open WebUI 的中间件检测输出中的 base64 图片数据
3. 图片自动上传并存储为文件
4. base64 字符串被**替换为文件 URL**（例如 `/api/v1/files/{id}/content`）
5. 模型在代码输出中看到此 URL，并可以在回复中引用它
6. 图片内联渲染在聊天中

:::info 理解流程
模型的代码应输出 base64 data URL。Open WebUI 会拦截该输出并将其转换为永久文件 URL。随后，模型应在 Markdown 中使用这个**生成的 URL**，例如 `![Chart](/api/v1/files/abc123/content)`。它不应将原始 base64 字符串粘贴到回复文本中。

如果你在聊天回复中看到原始 base64 文本，说明模型错误地重复了 base64，而没有使用代码输出中转换后的 URL。
:::

### 示例提示词 {#example-prompt}

> 创建一个显示季度销售额的条形图：第一季度：150，第二季度：230，第三季度：180，第四季度：310。

**预期的模型行为：**
1. 模型使用上述 base64 写法编写 Python 代码
2. 代码执行并输出 `data:image/png;base64,...`
3. Open WebUI 在输出中将其转换为文件 URL（例如 `![Output Image](/api/v1/files/abc123/content)`）
4. 模型在回复中引用此 URL 以显示图表

### 常见问题 {#common-issues}

| 问题 | 原因 | 解决方案 |
|-------|-------|----------|
| 聊天中出现原始 base64 文本 | 模型在回复文本中输出了 base64 | 指示模型只在代码中输出 base64，不要在回复中重复 |
| 图片不显示 | 代码使用 `plt.show()`，但未输出 base64 | 改用上述 base64 写法 |
| “分析中...”加载指示器卡住 | 代码执行超时或出错 | 检查后端日志中的错误 |

## 手动代码执行（Pyodide） {#manual-code-execution-pyodide}

Open WebUI 使用 [Pyodide](https://pyodide.org/)（WebAssembly）内置了基于浏览器的 Python 环境。这样可以直接在浏览器中运行 Python 脚本，无需进行服务器端配置。

Pyodide worker 是**持久的**：它只创建一次，并在多次代码执行之间复用。这意味着在同一会话中，变量、已导入的模块以及写入虚拟文件系统的文件都会在执行之间保留。

**运行（Run）**按钮仅由 [`ENABLE_CODE_EXECUTION`](/reference/env-configuration#enable_code_execution) 控制，并向所有用户开放。**代码解释器（Code Interpreter）**用户组权限和模型能力不会影响它。使用默认 Pyodide 引擎时，代码在用户自己的浏览器中运行；将 [`CODE_EXECUTION_ENGINE`](/reference/env-configuration#code_execution_engine) 设为 `jupyter` 时，代码则改为在 Jupyter 服务器上运行。

### 手动运行代码 {#running-code-manually}

1. 要求 LLM 编写 Python 代码
2. 代码块中会出现**运行（Run）**按钮
3. 点击按钮，使用 Pyodide 执行代码
4. 输出显示在代码块下方

### 支持的库 {#supported-libraries}

Pyodide 包含以下软件包，系统会从 import 语句中自动检测它们并按需加载：

| 软件包 | 使用场景 |
|---------|----------|
| micropip | 软件包安装器（内部使用） |
| requests | HTTP 请求 |
| beautifulsoup4 | HTML/XML 解析 |
| numpy | 数值计算 |
| pandas | 数据分析与处理 |
| matplotlib | 图表和绘图生成 |
| seaborn | 统计数据可视化 |
| scikit-learn | 机器学习 |
| scipy | 科学计算 |
| regex | 高级正则表达式 |
| sympy | 符号数学 |
| tiktoken | LLM 词元计数 |
| pytz | 时区处理 |
| openpyxl | Excel 文件（也会由 `pandas.read_excel` 和 `to_excel` 加载） |
| python-pptx | PowerPoint 文件 |
| python-docx | Word 文件 |

Python 标准库也可完整使用（json、csv、math、datetime、os、io 等）。

:::warning 无法在运行时安装软件包
AI **无法安装**上述列表之外的**其他库**。任何导入不受支持软件包的代码都会因导入错误而失败。需要 C 扩展、系统调用或原生二进制文件的软件包（例如 torch、tensorflow、opencv、psycopg2）均**不可用**，也无法在 Pyodide 中变为可用。Pyodide 最适合**基础文件分析、简单计算、文本处理和图表生成**。如需访问完整的 Python 软件包，请改用 **[Open Terminal](/features/chat-conversations/chat-features/code-execution#open-terminal)**。
:::

## 持久文件系统 {#persistent-file-system}

使用 Pyodide 引擎时，持久虚拟文件系统会挂载到 `/mnt/uploads/`。此文件系统通过 [IDBFS](https://emscripten.org/docs/api_reference/Filesystem-API.html#filesystem-api-idbfs) 由浏览器的 IndexedDB 提供支持，并提供以下能力：

- **跨执行持久性**：一次代码执行写入的文件可在后续执行中访问。
- **跨重新加载持久性**（*可选启用*）：只有启用 [`ENABLE_PYODIDE_FILE_PERSISTENCE=true`](/reference/env-configuration#enable_pyodide_file_persistence)（默认关闭）后，文件才能在页面重新加载后保留。关闭时，Pyodide 在不透明源的沙箱中运行，由 IndexedDB 支持的文件系统不会在重新加载后保留。
- **自动挂载上传文件**：Pyodide 会获取具有服务器文件 ID 的消息附件，并在代码执行前将它们放入 `/mnt/uploads/`。临时聊天中内联附加的图片没有服务器文件 ID，因此会被跳过。要让 Python 获取图片字节，请通过 Pyodide 的**文件（Files）**标签页上传图片。
- **文件浏览器面板**：启用代码解释器后，聊天的[标签页](/features/chat-conversations/chat-features/#tabs-side-panel)中会出现**文件（Files）**标签页。无需终端即可浏览、预览、上传、下载和删除文件。

### 在代码中处理文件 {#working-with-files-in-code}

```python
import os

# 列出已上传的文件
print(os.listdir('/mnt/uploads'))

# 读取用户上传的 CSV
import pandas as pd
df = pd.read_csv('/mnt/uploads/data.csv')
print(df.head())

# 将输出写入持久文件系统（可通过文件浏览器下载）
df.to_csv('/mnt/uploads/result.csv', index=False)
print('Saved result.csv to /mnt/uploads/')
```

:::tip
要求模型将输出保存到 `/mnt/uploads/`，然后从 Pyodide 的**文件（Files）**标签页下载。在那里创建的文件位于浏览器中。已上传文件的 `display_file` 工具使用服务器文件 ID 或内容 URL，因此无法打开 Pyodide 路径或模型生成的 `sandbox:` 链接。
:::

:::note Jupyter 引擎
持久文件系统提示词和 `/mnt/uploads/` 集成**仅适用于 Pyodide**。使用 Jupyter 引擎时，文件通过 Jupyter 自己的文件系统管理。文件浏览器面板不适用于 Jupyter。
:::

## 示例：创建图表 {#example-creating-a-chart}

**提示词：**
> “使用 matplotlib 创建一个条形图，显示：Acuity 4.1、Signify 7.2、Hubbell 5.6、Legrand 8.9。将图表输出为 base64 data URL，以便内联显示。”

**预期代码输出：**
```python
import matplotlib.pyplot as plt
import io
import base64

companies = ['Acuity', 'Signify', 'Hubbell', 'Legrand']
values = [4.1, 7.2, 5.6, 8.9]

plt.figure(figsize=(10, 6))
bars = plt.bar(companies, values, color=['#3498db', '#2ecc71', '#e74c3c', '#9b59b6'])

for bar, value in zip(bars, values):
    plt.text(bar.get_x() + bar.get_width()/2, bar.get_height() + 0.1,
             str(value), ha='center', va='bottom', fontsize=12)

plt.title('Company Values', fontsize=16, fontweight='bold')
plt.xlabel('Company', fontsize=12)
plt.ylabel('Value', fontsize=12)
plt.tight_layout()

buf = io.BytesIO()
plt.savefig(buf, format='png', dpi=150, bbox_inches='tight')
buf.seek(0)
print(f"data:image/png;base64,{base64.b64encode(buf.read()).decode()}")
plt.close()
```

图片会自动上传并内联显示在聊天中。

## 浏览器兼容性 {#browser-compatibility}

### Microsoft Edge：Pyodide 崩溃 {#microsoft-edge-pyodide-crashes}

如果基于 Pyodide 的代码执行导致 Microsoft Edge 因 `STATUS_ACCESS_VIOLATION` 错误而崩溃，这是由 Edge 的增强安全模式引起的。

**症状：**尝试运行 Python 代码时，浏览器标签页或整个浏览器崩溃，且没有有用的错误消息。

**原因：**Edge 的“增强 Web 安全性（Enhance your security on the web）”设置（位于 `edge://settings/privacy/security`）启用了更严格的安全缓解措施，这些措施与 Pyodide 等基于 WebAssembly 的运行时不兼容。

**解决方案：**

1. **在 Edge 中禁用增强安全性：**
   - 进入 `edge://settings/privacy/security`
   - 关闭**“增强 Web 安全性（Enhance your security on the web）”**

2. **使用其他浏览器：**
   - Chrome 和 Firefox 不存在此问题

3. **使用 Jupyter 后端：**
   - 将 `CODE_INTERPRETER_ENGINE` 切换为 `jupyter`，完全避免浏览器端执行

:::note
这是 Edge 增强安全模式与 WebAssembly 之间已知的兼容性问题。启用此设置时，官方 [Pyodide 控制台](https://pyodide.org/en/stable/console.html)也会发生同样的崩溃。
:::

## 获得更好结果的技巧 {#tips-for-better-results}

- **说明环境**：告诉 LLM 它正在“Pyodide 环境”或“代码解释器”中运行，以生成更合适的代码
- **明确输出要求**：对于图片，要求“输出 base64 data URL”
- **使用 print 语句**：打印的输出显示在 **STDOUT/STDERR** 下。当代码块最后一行是表达式（例如 `square(7)`）时，其值也会显示在 **RESULT** 下
- **检查库支持**：确认所需的库在 Pyodide 中可用

## 延伸阅读 {#further-reading}

- [Pyodide 文档](https://pyodide.org/en/stable/)
- [Jupyter Notebook 集成](/tutorials/integrations/dev-tools/jupyter)
- [环境配置](/reference/env-configuration)（搜索 `CODE_INTERPRETER`）
