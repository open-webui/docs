---
sidebar_position: 1
title: "代码执行"
---

Open WebUI 直接在聊天界面中提供强大的代码执行功能，让你无需离开平台即可将想法转化为可操作的结果。

## 主要功能 {#key-features}

- **代码解释器能力**：让模型能够在回复过程中自主编写并执行 Python 代码。在 Native（Agentic）模式（唯一支持的工具调用模式）下，此功能通过 `execute_code` 工具运行。旧的基于 XML 的机制本身也是不受支持的遗留方案，因此新部署应使用 Native 模式。

- **Python 代码执行**：通过 Pyodide 在浏览器中运行 Python，或通过 Jupyter 在服务器上运行 Python，无需配置即可完成自包含任务。两者都是**遗留**引擎：对于实际 Python 工作负载（任意软件包、完整性能、Shell 访问），请使用 **Open Terminal**。

- **MermaidJS 渲染**：使用 MermaidJS 语法创建并可视化流程图、示意图和其他视觉内容，这些内容会自动在聊天中渲染。

- **交互式 Artifacts**：直接在对话中生成 HTML 网站、SVG 图形和 JavaScript 可视化等丰富内容，并与之交互。

- **Open Terminal**：连接远程 Shell 执行 API 作为工具，获得完整的操作系统级访问能力：在隔离的 Docker 容器中运行任意命令、安装软件包和管理文件。

这些执行功能弥合了对话与实现之间的差距，让你能够在与 AI 模型聊天时无缝探索想法、分析数据和创建视觉内容。

## 选择代码执行后端 {#choosing-a-code-execution-backend}

Open WebUI 支持多种代码执行后端，各自适用于不同场景。正确的选择取决于你的需求：轻量级浏览器执行、完整的 Python 环境，还是不受限的 Shell 访问。

:::tip 推荐：Open Terminal
**[Open Terminal](#open-terminal)** 是实际代码执行的推荐后端：完整的原生 Python、任意软件包、任意语言和 Shell 访问，并隔离在 Docker 容器中。**Pyodide** 和 **Jupyter** 是用于零配置、聊天内执行的**遗留**引擎。
:::

### Pyodide（遗留） {#pyodide-legacy}

:::caution 遗留引擎
Pyodide 是**遗留**代码执行引擎。它是聊天内代码解释器内置的零配置默认引擎，也是安全的浏览器沙箱。对于基础分析之外的需求，请使用 **[Open Terminal](#open-terminal)**，它提供完整的原生 Python、任意软件包和 Shell 访问。Pyodide 可能会在未来版本中弃用。
:::

Pyodide 通过 WebAssembly 在浏览器中运行 Python。它采用沙箱机制，可安全用于多用户环境，但存在一些限制：

- **持久文件存储**：`/mnt/uploads/` 处的虚拟文件系统由 IndexedDB（IDBFS）提供支持。文件可在同一会话中的多次代码执行之间保留，但**要在页面重新加载后仍然保留，需要设置 [`ENABLE_PYODIDE_FILE_PERSISTENCE=true`](/reference/env-configuration#enable_pyodide_file_persistence)**（默认关闭）。关闭时，Pyodide 在采用不透明源的沙箱化 iframe 中运行，文件系统不会在重新加载后保留。
- **内置文件浏览器**：启用代码解释器后，聊天的[标签页](/features/chat-conversations/chat-features/#tabs-side-panel)中会出现**文件（Files）**标签页。无需终端即可浏览、预览、上传、下载和删除 Pyodide 文件系统中的文件。
- **用户文件访问**：附加到消息的文件会在代码执行前自动放入 `/mnt/uploads/`，因此模型（和你的代码）可以直接读取它们。
- **库支持有限**：只有部分 Python 软件包可用。依赖 C 扩展或系统调用的库可能无法工作。
- **无 Shell 访问**：无法运行 Shell 命令、安装软件包或与操作系统交互。

:::tip
Pyodide 非常适合**文本分析、哈希计算、图表生成、文件处理**和其他自包含任务。matplotlib 等图表库会生成 base64 编码图片，Open WebUI 会自动捕获这些图片，将其作为文件上传，并在输出中插入直接图片链接，因此模型无需任何额外配置即可直接在聊天中显示图表。
:::

:::warning 最适合基础分析
Pyodide 通过 WebAssembly 在浏览器内运行 Python。AI **无法安装**下方固定的小范围软件包集合之外的**其他库**。任何导入不受支持软件包的代码都会失败。执行速度也**显著慢于**原生 Python，大型数据集或 CPU 密集型任务可能会触及浏览器内存限制。Pyodide 最适合**基础文件分析、简单计算、文本处理和图表生成**。对于要求更高的任务，请改用 **Open Terminal**，它在 Docker 容器中提供完整的原生性能，并允许访问任意软件包。

可用库：micropip、requests、beautifulsoup4、numpy、pandas、matplotlib、seaborn、scikit-learn、scipy、regex、sympy、tiktoken、pytz、openpyxl、python-pptx、python-docx 以及 Python 标准库。**运行时无法安装任何其他软件包。**
:::

:::note 与 Open Terminal 互斥
代码解释器开关和 Open Terminal 开关不能同时启用。启用其中一个会停用另一个。它们用途相似，但使用不同的执行后端。
:::

### Jupyter（遗留） {#jupyter-legacy}

:::caution 遗留引擎
Jupyter 与 Pyodide 一样，都是**遗留**代码执行引擎。需要服务器端执行时，推荐使用 **Open Terminal** 后端。Jupyter 支持可能会在未来版本中弃用。
:::

Jupyter 提供完整的 Python 环境，几乎可以处理任何任务：创建文件、安装软件包和使用复杂库。不过，它在共享部署中存在明显缺点：

- **共享环境**：所有用户共享同一个 Python 运行时和文件系统。
- **默认不使用沙箱**：如果未经谨慎配置，用户可以访问系统资源或读取其他用户的数据。
- **并非为多租户使用而设计**：Jupyter 面向单用户工作流构建。

:::warning
如果你运行的是多用户或组织部署，**不建议将 Jupyter** 用作代码执行后端。Open WebUI 的 Jupyter 集成连接到单个共享实例，不提供按用户隔离。Jupyter 仅最适合**单用户、开发或受信任用户环境**。
:::

### Open Terminal {#open-terminal}

[Open Terminal](https://github.com/open-webui/open-terminal) 是一个轻量级 API，用于在 Docker 容器中远程运行 Shell 命令。它提供完整的操作系统级访问能力（任意语言、任意工具、任意 Shell 命令），并具备容器级隔离。

- **完整 Shell 访问**：模型可以安装软件包、使用任意语言运行脚本，以及使用 ffmpeg、git、curl 等系统工具。
- **容器隔离**：在自己的 Docker 容器中运行，与 Open WebUI 和其他服务分离。
- **丰富的预装工具集**：Docker 镜像随附 Python 3.12、数据科学库、构建工具、网络实用程序等。
- **内置文件浏览器**：直接在**文件（Files）**标签页中浏览、预览、创建、删除、上传和下载文件。
- **内置多用户模式**：单个容器可以服务多位用户，为每位用户提供独立的 Linux 账户和主目录（适合小型受信任团队，但不是用户之间的安全边界）。

完整文档请参阅 [Open Terminal 集成指南](/features/open-terminal)。

### Terminals（多租户编排器） {#terminals-multi-tenant-orchestrator}

[Terminals](https://github.com/open-webui/terminals) 是一个编排器，用于为团队预配和管理 Open Terminal 实例。Open Terminal 是单个实例，而 Terminals 是其上层的完整生命周期管理层，负责预配、路由、空闲清理和销毁。它需要[企业许可证](/enterprise)。

- **独立实例**：终端可以为每位用户、每个聊天或每个模型提供具有独立文件系统、进程和资源的实例，也可以让所有使用者共享一个实例。
- **自动生命周期管理**：实例在首次请求时预配，并在达到你设置的空闲超时时间后停止。
- **多种后端**：Docker、Kubernetes 或 Kubernetes Operator（基于 CRD）。
- **透明路由**：Terminals 将每个请求发送到正确的实例。
- **企业级能力**：支持使用 PostgreSQL 存储终端状态。
- **管理员仪表板**：内置前端，用于管理终端和监控实例。

:::note 许可证
Terminals 采用 [Open WebUI 企业许可证](/enterprise)，而非 MIT 许可证。
:::

### 对比 {#comparison}

| 考量因素 | Pyodide（遗留） | Jupyter（遗留） | Open Terminal | Terminals |
| :--- | :--- | :--- | :--- | :--- |
| **运行位置** | 浏览器（WebAssembly） | 服务器（Python 内核） | 服务器（Docker 容器） | 服务器（编排容器） |
| **库支持** | 有限子集 | 完整 Python 生态系统 | 完整操作系统（任意语言、任意工具） | 完整操作系统（任意语言、任意工具） |
| **Shell 访问** | 无 | 有限 | 完整 Shell | 完整 Shell |
| **文件持久性** | 会话内的 IDBFS（重新加载后保留需要 `ENABLE_PYODIDE_FILE_PERSISTENCE`） | 共享文件系统 | 容器文件系统（直至容器移除） | 每个实例的持久存储 |
| **文件浏览器** | 内置侧边栏面板 | 无 | 内置侧边栏面板 | 内置侧边栏面板 |
| **用户文件访问** | 附件放入 `/mnt/uploads/` | 手动 | 可访问附件 | 可访问附件 |
| **隔离** | 浏览器沙箱 | 共享环境 | 容器级（使用 Docker 时） | 按用户、聊天或模型划分独立实例 |
| **多用户安全性** | 设计上按用户隔离 | 无隔离 | 内置多用户模式（小型团队） | 具有生命周期管理的独立实例 |
| **文件生成** | 写入 `/mnt/uploads/`，通过文件浏览器下载 | 完整支持 | 完整支持上传/下载 | 完整支持上传/下载 |
| **配置** | 无需配置（内置） | 管理员全局配置 | 通过“设置 → 集成”进行原生集成 | 独立服务 + Docker socket 或 K8s 集群 |
| **组织使用建议** | 遗留（安全但有限） | 没有隔离则不建议 | 最适合小型团队 | 为多租户组织设计 |
| **企业可扩展性** | 客户端执行，无服务器负载 | 单个共享实例 | 单个容器，共享资源 | 可水平扩展（Docker 或 Kubernetes） |
| **空闲管理** | 不适用 | 不适用 | 不适用（始终运行） | 可配置超时后自动停止 |
| **许可证** | MIT | MIT | MIT | [企业版](/enterprise) |
