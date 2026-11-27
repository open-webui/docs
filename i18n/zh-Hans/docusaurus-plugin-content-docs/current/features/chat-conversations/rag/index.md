---
sidebar_position: 1
title: "检索增强生成（RAG）"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

<ThemedImage
  alt="文档：一叠纸张，其中一张被抽出"
  sources={{
    light: useBaseUrl('/images/banners/chat-conversations-documents-light.svg'),
    dark: useBaseUrl('/images/banners/chat-conversations-documents-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

:::warning

如果你使用的是 **Ollama**，请注意，它会**根据 GPU 的显存选择模型的默认上下文长度，在显存小于 24 GiB 的 GPU 上，该长度为 4096 个词元**（请参阅 [Ollama 的上下文长度文档](https://docs.ollama.com/context-length)）。这会严重限制**检索增强生成（RAG）的性能**，尤其是网络搜索，因为检索到的数据可能**完全不会被使用**，或只能得到部分处理。

:::

检索增强生成（RAG）是一种通过整合来自不同来源的上下文来增强聊天机器人对话能力的技术。它从本地和远程文档、Web 内容，甚至 YouTube 视频等多媒体来源等广泛来源中检索相关信息。随后，检索到的文本会与预定义的 RAG 模板结合，并添加到用户提示词之前，从而提供信息更充分、与上下文更相关的回复。

RAG 的一个主要优势是能够访问和整合来自各种来源的信息，因此非常适合复杂的对话场景。例如，当用户询问与特定文档或网页相关的问题时，RAG 可以从该来源检索相关信息并将其整合到聊天回复中。RAG 还可以检索并整合 YouTube 视频等多媒体来源的信息。通过分析这些视频的转录文本或字幕，RAG 可以提取相关信息并将其整合到聊天回复中。

## 本地和远程 RAG 集成 {#local-and-remote-rag-integration}

要在 RAG 中使用本地文档，请将其添加到**工作区 > 知识（Workspace > Knowledge）**中的知识库，或在聊天中上传。在聊天中，请在查询前输入 `#`，然后从消息输入框上方出现的建议框中选择文档。

点击答案下方来自上传文件的来源，可以在聊天旁的独立标签页中打开该文件；如果已知引用页码，还会定位到对应页面。预览会高亮显示引用的文本，但以图像形式显示的 PowerPoint 幻灯片除外。在文档预览中，将鼠标悬停在高亮内容上，可查看提供给模型的段落。纯文本和代码文件只有在来源具有相关性得分时才显示该段落。网页、预览无法显示的文件（例如 `.doc` 或 `.epub`），以及只读共享聊天中的来源，会在弹窗中打开其检索文本。

![文档和检索设置](/images/admin/admin-documents.png)

:::tip 批量文件管理
需要清理多份已上传文档或审计存储内容吗？请使用位于**设置 > 数据控制 > 管理文件（Settings > Data Controls > Manage Files）**中的集中式[**文件管理器**](/features/chat-conversations/data-controls/files)。在其中删除文件时，会自动清理对应的 RAG 嵌入。
:::

## 外部知识来源（外部向量数据库） {#external-knowledge-sources-external-vector-databases}

:::warning 实验性功能
此功能处于实验阶段，其配置可能会在不同版本之间发生变化。
:::

除了直接在 Open WebUI 中上传文档并生成嵌入，你还可以将知识库指向自己已经在维护的**外部向量数据库**。Open WebUI 会在聊天时直接查询该数据库，因此你的文档、嵌入和索引都保留在自己的存储中，绝不会被重新摄取。

支持的服务提供方：**OpenAI 兼容**（OpenAI 向量存储、Azure OpenAI v1 和 LiteLLM）、**Qdrant**、**Milvus** 和 **pgvector**。对于 Qdrant、Milvus 和 pgvector，Open WebUI 镜像中必须存在相应服务提供方的 Python 客户端（例如 `qdrant-client` 或 `pymilvus`）。受支持的 Qdrant 服务器版本列在 [Qdrant 设置](/reference/env-configuration#qdrant)中。

### 使用 OpenAI 兼容向量存储 {#using-openai-compatible-vector-stores}

服务器会使用构建该存储时采用的嵌入模型自行执行搜索。输入**终结点（Endpoint）**（对于 Azure OpenAI，为 `/openai/v1` URL）和 **API 密钥 / 令牌（API Key / Token）**，然后点击**验证连接（Verify Connection）**加载存储列表。一个知识库可以使用已加载存储中的一个或多个。

如果要提供该终结点的每个存储，而不逐一创建知识库，请在添加连接时开启**将存储列为知识库（List stores as knowledge bases）**。随后，**存储 ID（Store IDs）**中指定的存储（留空表示全部存储）会作为只读知识库显示在**工作区 > 知识（Workspace > Knowledge）**中，并从终结点实时读取。访问权限在连接上设置，并应用于其所有存储。关闭该开关时，创建知识库需要一次能够返回文档的成功**测试查询（Test Query）**。

### 添加外部知识来源 {#adding-an-external-knowledge-source}

以下步骤适用于 Qdrant、Milvus 和 pgvector。请在**设置 > 集成 > 外部知识来源（Settings > Integrations > External Knowledge Sources）**（管理员区域）中配置：

1. **创建与向量数据库的连接**：
   - **提供方（Provider）**（Qdrant / Milvus / pgvector）
   - **终结点（Endpoint）**（数据库 URL）
   - **API 密钥 / 令牌（API Key / Token）**（如果数据库需要身份验证）
   - **数据库（Database）** / **表（Table）** / **集合（Collection）**（取决于提供方）
   - **超时（Timeout）**
2. **映射结果字段**，让 Open WebUI 知道如何读取你的记录。每项设置都将已存储文档中的一个字段映射到 Open WebUI 所需的字段：

   | Open WebUI 字段 | 映射设置 | 默认字段 |
   | :--- | :--- | :--- |
   | 分块文本 | **内容字段（Content Field）** | `content` |
   | 标题 | **标题字段（Title Field）** | `title` |
   | 来源 | **来源字段（Source Field）** | `source` |
   | URL | **URL 字段（URL Field）** | `url` |
   | 文档 ID | **文档 ID 字段（Document ID Field）** | `document_id` |
   | 页面 | **页面字段（Page Field）** | `page` |
   | 额外元数据 | **元数据字段（Metadata Field）** | `metadata` |
   | 相关性得分 | **得分字段（Score Field）** | `score` |

   嵌套字段支持点号路径（例如 `payload.text`）。
3. 使用示例问题**测试查询**。Open WebUI 会针对该来源执行实时检索并显示结果。必须测试成功，才能创建或保存来源。

创建后，外部来源会像其他知识库一样显示在**工作区 > 知识（Workspace > Knowledge）**中，并可附加到模型或聊天。对于 Qdrant、Milvus 和 pgvector，在聊天时，Open WebUI 会使用配置的 RAG 嵌入模型为用户查询生成嵌入，通过向量搜索外部数据库，并将最匹配的项传入提示词。Open WebUI 中不会存储文档副本。

开启[检索查询生成](/reference/env-configuration#enable_retrieval_query_generation)后，所有生成的查询会同时运行。其结果按排名合并（先取每个查询的第一条结果，再取每个查询的第二条结果，依此类推），删除重复项，并将列表截断至结果数量上限。

在答案下方的来源中，每条结果都按标题列出。对于 Qdrant、Milvus 和 pgvector，当结果的**来源字段（Source Field）**包含网址时，点击其标题或引用中的**内容（Content）**链接会打开该页面；否则，标题只显示为纯文本。

:::info 嵌入模型必须匹配
对于 Qdrant、Milvus 和 pgvector，Open WebUI 会为查询生成嵌入，并通过向量搜索你的数据库，因此外部数据库中存储的向量必须来自 Open WebUI 使用的**同一嵌入模型**（模型和维度均须匹配）。不匹配的嵌入会产生质量很差或毫无意义的结果。
:::

## 用于 RAG 的网络搜索 {#web-search-for-rag}

:::warning
**Ollama 用户的上下文长度警告：**即使经过内容提取，网页通常仍包含 4,000-8,000+ 个词元，包括主要内容、导航元素、页眉、页脚和元数据。在只有 4096 个词元可用的情况下，你通常只能获得一半页面内容，并遗漏最相关的信息。即使是 4096 个词元，也常常不足以全面分析 Web 内容。

**解决方法：**进入**设置 > 模型（Settings > Models）**（管理员区域），点击 Ollama 模型上的铅笔（**编辑（Edit）**），打开**高级参数（Advanced Params）**，然后**将上下文长度增加到 8192+（或者最好超过 16000）个词元**。此设置专门适用于 Ollama 模型。对于 OpenAI 和其他集成模型，请确保所用模型具有足够的内置上下文长度（例如具有 1M 词元上下文窗口的 GPT-5.6）。
:::

要集成 Web 内容，请在聊天中以 `#` 开始查询，后接目标 URL。点击聊天框上方出现的框中格式化后的 URL。如果可以，Open WebUI 会获取并解析该 URL 中的信息。指向文件（例如 PDF）的链接会使用文档提取进行读取。如果无法读取该 URL，尝试会失败，并显示一条指明无法读取哪个链接的消息，请参阅[附加链接或 YouTube 视频失败](/troubleshooting/rag#14-attaching-a-link-or-a-youtube-video-fails)。

:::tip

网页通常包含导航和页脚等多余信息。为获得更好的结果，请链接到页面的原始版本或适合阅读的版本。

:::

## RAG 模板自定义 {#rag-template-customization}

在设置（`Settings`） > 文档（`Documents`）（管理员区域）菜单中自定义 RAG 模板。

RAG 模板用于格式化**检索到的上下文**，并在消息到达模型之前将其添加到消息开头。使用 `{{CONTEXT}}` 占位符（或旧版 `[context]`）标记插入检索文档上下文的位置。如果没有该占位符，检索到的上下文将无处插入。

:::warning 不要包含查询占位符
你的消息（查询）**始终会自动追加**到渲染后的模板之后，因此模型已经能看到一次查询。模板也能识别 `{{QUERY}}` / `[query]`，并会在该位置替换查询；但由于查询之后仍会被追加，包含该占位符会使查询在最终提示词中出现**两次**。请在模板中省略 `{{QUERY}}` / `[query]`：模板是检索上下文的外层包装，而不是用于安排查询位置的地方。
:::

## Markdown 标题拆分 {#markdown-header-splitting}

启用后，文档会先按 Markdown 标题（H1-H6）拆分。这可以保留文档结构，并确保尽可能将同一标题下的章节保留在一起。随后，生成的分块会由标准字符或词元拆分器进一步处理。

:::tip

使用**分块最小大小目标（Chunk Min Size Target）**设置（位于**设置 > 文档（Settings > Documents）**（管理员区域）），在 Markdown 拆分后智能合并较小的章节，从而提高检索连贯性，并减少数据库中的向量总数。

:::

## 分块配置 {#chunking-configuration}

Open WebUI 允许你精细调整文档拆分为嵌入分块的方式。这对于获得最佳检索性能至关重要。

- **文本拆分器（Text Splitter）**：选择分块大小的计量方式。[`RAG_TEXT_SPLITTER`](/reference/env-configuration#rag_text_splitter) 可设为 `character`（默认值，RecursiveCharacterTextSplitter）、`token` 或 `token_transformers`。`token` 拆分器使用 Tiktoken 计算词元数。`token_transformers` 拆分器使用 [`RAG_TOKENIZER_MODEL`](/reference/env-configuration#rag_tokenizer_model) 指定的 HuggingFace 分词器（例如 `bert-base-uncased`）计算词元数，使分块边界与嵌入模型自己的分词器相匹配。精简镜像不提供此拆分器。
- **分块大小（Chunk Size）**：设置每个分块的最大字符数（或词元数）。
- **分块重叠（Chunk Overlap）**：指定相邻分块之间共享多少内容，以保持上下文。
- **分块最小大小目标（Chunk Min Size Target）**：尽管 [Markdown 标题拆分](#markdown-header-splitting)非常擅长保留结构，但它经常会产生缺少足够语义上下文、无法进行高质量嵌入的微小碎片分块（例如独立子标题、目录条目、单句段落或短列表项）。你可以设置**分块最小大小目标（Chunk Min Size Target）**，将这些小片段与其相邻分块智能合并，从而改善这一问题。

### 为什么使用分块最小大小目标？ {#why-use-a-chunk-min-size-target}

在 Markdown 拆分后智能合并较小章节具有以下几个主要优势：

- **提高 RAG 质量**：消除微小且无意义的碎片，确保每个检索分块具有更好的语义连贯性。
- **减小向量数据库大小**：分块越少，需要存储的向量就越少，从而降低存储成本和内存占用。
- **加快检索与嵌入**：较小的索引搜索更快，分块更少意味着所需的嵌入 API 调用更少（或本地计算量更小）。上传文件到聊天或知识库时，需要向量化的数据更少，因此能显著加快文档处理。
- **效率与影响**：测试表明，合理配置的阈值（例如分块大小为 2000 时设为 1000）可以将分块数量减少 90% 以上，同时通过保持语义上下文来**提高准确性**、加快嵌入速度并提升整体检索质量。

<details>
<summary>合并算法的工作原理（技术细节）</summary>

对大多数用户而言，上述说明已经足够：小块会与相邻块合并，从而以更少的向量获得更好的检索效果，并带来其他性能、成本和存储优势。如果你想了解具体逻辑和设计原理，下面介绍其内部工作方式。

### 为什么基于标题的拆分需要合并 {#why-header-based-splitting-needs-merging}

Markdown 标题拆分是较好的结构化分块方法之一，因为标题是文档作者设置的明确语义边界。它利用了人对一个主题在何处结束、另一个主题在何处开始的判断，因此通常比固定大小窗口生成更连贯的分块；后者可能会在段落或思路中间切断内容。

然而，真实文档往往存在结构上的特殊情况：目录、简短的介绍章节、各自标题下的单句段落，或内容极少的深层嵌套子标题。这些都会产生微小分块并引发问题：

- 独立检索时缺少足够的上下文，难以发挥作用
- 可能产生有噪声的检索结果（基于有限信号匹配，却不提供有用内容）
- 极短文本有时难以可靠地生成嵌入
- 浪费向量存储并减慢检索速度
- 在总内容相同的情况下，更多分块需要更长的嵌入时间
- 更多嵌入操作意味着更多 API 调用（成本）或更多本地计算

合并算法通过在遵守文档结构和大小限制的前提下智能合并过小分块来解决这一问题。

### 算法：单次前向遍历 {#the-algorithm-a-single-forward-pass}

合并逻辑刻意保持简单，只对全部分块执行一次前向遍历：

1. 以第一个分块作为“当前”累加器开始。
2. 对于每个**后续**分块，检查是否可以将其合并到当前分块中。
3. 只有**同时满足以下三个条件**，才能合并该分块：
   - 当前累计内容仍小于 `CHUNK_MIN_SIZE_TARGET`
   - 合并后不会超过 `CHUNK_SIZE`（最大值）
   - 两个分块属于同一源文档
4. 如果可以合并，就将它们合并（使用 `\n\n` 分隔以保留视觉结构），然后继续检查下一个分块。
5. 如果无法合并，就定稿当前分块，并从下一个分块重新开始，将其作为新的累加器。
6. 重复上述过程，直到处理完所有分块。

**关键点**：大小检查针对的是*累计*内容，而不是单个分块。这意味着多个连续的微小分块（例如包含许多小条目的目录）会持续合并，直到合并后的大小达到阈值，或继续合并下一个分块会超过最大值。

### 设计决策及其重要性 {#design-decisions-and-why-they-matter}

**仅前向合并**：小块始终合并到*下一个*分块，绝不向后合并。这使逻辑保持简单、可预测，并保留文档中常见的“本节介绍后续内容”关系。简短介绍章节向前合并到它所介绍的内容中，在语义上是合理的。

**为什么不向后合并？**除了增加代码复杂度，向后合并通常也无法成功。当某个分块定稿时，它只可能处于两种状态之一：要么通过合并已经增长到达到或超过 `CHUNK_MIN_SIZE_TARGET`（因此已经“满足要求”，剩余空间有限），要么因为会超过 `CHUNK_SIZE` 而无法合并下一个分块（因此已经接近上限）。无论哪种情况，向后合并通常都无法通过大小检查，这意味着你要为极少成功的操作增加分支逻辑和状态跟踪。

**不跨文档合并**：来自不同源文件的分块绝不会合并，即使两者都很小。这为引用、来源归属和检索上下文保留了清晰的文档边界。

**遵守最大大小**：如果合并两个分块会超过 `CHUNK_SIZE`，两者就保持独立。绝不会为了强制合并而丢弃内容。

**元数据继承**：合并后的分块继承合并序列中*第一个*分块的元数据。这与前向合并语义一致：来源和标题信息反映合并章节的“起点”，通常也是检索和引用的正确选择。

**`\n\n` 分隔符**：分块合并时使用双换行连接，而不是直接拼接。这会保留合并文本中的视觉和结构分隔；如果检查分块，这对嵌入质量和人工可读性都很重要。

### 边界情况 {#edge-cases}

**连续的微小分块**：可自然处理。它们会持续累计为一个分块，直到达到阈值或继续合并会超过最大大小。

**小块后接大块**：如果一个小块后接一个足够大的分块，合并后会超过 `CHUNK_SIZE`，那么小块会按原样定稿，仍然小于目标大小。在不进行向后合并或内容拆分的情况下，这无法避免，但实际中也很少见。它通常出现在自然的语义边界（密集章节之前的简短过渡），因此小块在该边界保持独立可以说也是合理的。

**文档中的最后一个分块**：如果最后一个分块小于目标大小，它会保持该大小，因为没有后续分块可以向前合并。这同样无法避免，而且通常没有问题：文档结尾本身就是自然边界。

### 性能特征 {#performance-characteristics}

该算法的时间复杂度为 O(n)，其中 n 是分块数量：只遍历一次，无需前瞻或回溯。因此，即使面对大型文档集，速度也很快。

合并带来的效率提升在某些方面呈非线性增长。检索 45 个向量与检索 588 个向量相比，不只是原始计算速度快约 13 倍，还能获得干净得多的 top-k 结果，因为那些近乎空白的噪声分块已被消除；这些分块可能在部分关键词匹配中获得较高分数，却不会为 LLM 提供任何有用内容。质量提升往往比速度提升更重要。

保留下来的每个分块都包含有意义的语义上下文，而不是让嵌入模型和检索排序都感到困惑的碎片。

</details>

## RAG 嵌入支持 {#rag-embedding-support}

在**设置（Settings）** > **文档（Documents）**（管理员区域）中更改 RAG 嵌入模型。嵌入引擎可以是内置的 SentenceTransformers 默认引擎、Ollama、OpenAI 或 Azure OpenAI。

如果嵌入模型文档要求搜索查询和存储文本分别使用不同前缀，请在同一页面的**嵌入（Embedding）**部分下，将它们填入**高级（Advanced）**中的**查询前缀（Query Prefix）**和**内容前缀（Content Prefix）**。它们分别对应 [`RAG_EMBEDDING_QUERY_PREFIX`](/reference/env-configuration#rag_embedding_query_prefix) 和 [`RAG_EMBEDDING_CONTENT_PREFIX`](/reference/env-configuration#rag_embedding_content_prefix)。请包含模型要求的任何尾随空格。除非 [`RAG_EMBEDDING_PREFIX_FIELD_NAME`](/reference/env-configuration#rag_embedding_prefix_field_name) 将前缀作为单独的请求字段发送，否则 Ollama、OpenAI 和 Azure OpenAI 都会将前缀添加到每段文本的开头。内置引擎会将其作为 `prompt` 传递给 SentenceTransformers。更改**内容前缀（Content Prefix）**后，请重新索引现有文档，因为更改前已生成嵌入的文档会保留旧前缀。

## 初始设置后更改 RAG 设置 {#changing-rag-settings-after-initial-setup}

如果文档已经建立索引，而你需要更改分块配置（分块大小、重叠）或嵌入模型，就必须了解需要执行哪些操作，以及这些更改会产生什么影响。

### 更改分块大小和重叠 {#changing-chunk-size-and-overlap}

新文档会**自动**使用更新后的分块大小和重叠设置。新上传的文件无需任何额外操作。

知识库中的现有文档会**保留原来的分块方式**，直到你执行重新索引。这些旧分块仍可正常检索（向量相似度搜索不依赖于分块大小），但如果新旧文档的分块大小差异很大，你可能会发现检索质量不一致。

:::tip
如果只更改分块设置而不更改嵌入模型，则并非必须重新索引。旧文档会继续工作。不过，为了让所有文档保持一致的检索质量，建议执行重新索引。
:::

### 更改嵌入模型 {#changing-the-embedding-model}

更改嵌入模型后，**必须重新索引**所有知识库文档。不同模型生成的嵌入位于不同的向量空间中，彼此不兼容。如果不重新索引，针对旧嵌入的检索会产生质量很差或毫无意义的结果。

更改嵌入模型后，点击**设置（Settings）** > **文档（Documents）**（管理员区域）中的**重新索引（Reindex）**按钮，使用新模型为所有知识库文档重新生成嵌入。

### 重新索引会执行什么操作？ {#what-does-re-indexing-do}

重新索引过程会对每个知识库执行以下步骤：

1. **删除**该知识库的现有向量集合。
2. 使用当前内容提取引擎及其设置，从原始上传文件中**重新提取**每个文件。
3. 使用当前分块大小、重叠和文本拆分器设置，对每个文件**重新分块**。
4. 使用当前配置的嵌入模型，为所有分块**重新生成嵌入**。
5. 同时**重建**知识库中每个文件的文件级集合，因此将其中一个文件单独附加到聊天时，检索到的内容与搜索其所属知识库时相同。

这意味着一次重新索引会同时应用内容提取、分块和嵌入模型的更改。

:::note 重新索引会再次解析文件
每个文件都会再次经过内容提取引擎，因此除了嵌入时间外，还要预留提取时间。知识库文件查看器中编辑过的文本会被新的提取结果替换。音频、图像和视频文件会保留其存储的文本；原始文件缺失或提取失败的文件也会保留已存储文本。
:::

:::warning 重新索引不包括聊天文件
重新索引操作只处理属于**知识库**的文件。直接上传到聊天（未添加到知识库）的文件具有自己的文件级向量集合，重新索引不会处理这些集合。

如果更改嵌入模型，这些独立聊天文件的嵌入仍会使用旧模型，其检索质量会下降。更新它们的唯一方法是重新上传文件。
:::

### 总结 {#summary}

| 更改 | 新文档 | 知识库文档（不重新索引） | 知识库文档（重新索引后） | 独立聊天文件 |
|---|---|---|---|---|
| **分块大小 / 重叠** | 使用新设置 | 旧分块仍可使用，但质量可能有所不同 | 使用新设置重新分块 | 旧分块，需重新上传才能更新 |
| **嵌入模型** | 使用新模型 | 旧嵌入，向量空间不兼容 | 使用新模型重新生成嵌入 | 旧嵌入，需重新上传才能更新 |

### 监控重新索引进度 {#monitoring-re-index-progress}

在 info 日志级别下，服务器日志会显示文件计数器，并在处理完第一个文件后显示预计剩余时间。随后，管理员操作会重建知识搜索索引和记忆向量，再显示成功。

即使 UI 报告成功，也请检查服务器日志。知识文件阶段可能会在个别错误后继续，并返回成功。请查找错误行和 `Failed to process ... files` 汇总，以找出需要处理的文件。

### 危险区域重置按钮 {#danger-zone-reset-buttons}

**设置（Settings）** > **文档（Documents）**（管理员区域）底部的**危险区域（Danger Zone）**有两个重置按钮。两者都会影响实例上的每位用户，且都无法撤销。

| 按钮 | 删除的内容 | 保留的内容 |
|---|---|---|
| **重置上传目录（Reset Upload Directory）** | 每条文件记录、每个已存储文件（上传目录，或正在使用的 S3、GCS、Azure 存储）以及向量存储 | 知识库（但不再包含文件或向量）和记忆（但不再包含其向量） |
| **重置向量存储/知识（Reset Vector Storage/Knowledge）** | 向量存储和每个知识库 | 上传的文件和记忆（但不再包含其向量） |

使用默认 Chroma 向量数据库时，重置向量存储会删除每个集合，包括知识库、单个文件、缓存的网络搜索结果和用户记忆。记忆会保留其文本，因此同一区域中的**重建知识与记忆向量索引（Reindex Knowledge and Memory Vectors）**可以使用当前嵌入模型重建其向量。

## RAG 功能中的引用 {#citations-in-rag-feature}

RAG 功能允许用户通过添加引用作为参考点，轻松跟踪提供给 LLM 的文档上下文。这确保了聊天中使用外部来源时的透明度和可追溯性。要让模型引用页码或随每个分块存储的其他详细信息，请设置 [`RAG_SOURCE_METADATA_KEYS`](/reference/env-configuration#rag_source_metadata_keys)。

## 预加载文件与内置工具 {#preload-files-vs-builtin-tools}

Open WebUI 提供两项独立能力来控制文件的处理方式。理解两者的区别对于正确配置模型非常重要。

### 预加载文件能力 {#preload-files-capability}

**预加载文件（Preload files）**能力控制 Open WebUI 是否对附加文件执行 RAG（检索增强生成）。使用原生函数调用时默认关闭，使用 Legacy 时默认开启。模型编辑器和**模型默认值（Model Defaults）**会显示实际生效的值。对于并非来自 Web UI 聊天的 API 请求，除非模型保存了该设置的值，否则此能力会开启，以便 `files` 字段中发送的文件和知识能够到达模型。

| 预加载文件 | 行为 |
|--------------|----------|
| **启用** | 附加文件通过 RAG 处理。检索内容并注入对话上下文。 |
| **禁用** | 绝不提取或注入文件内容。使用原生或默认函数调用时，模型会看到附加文件列表，并通过内置**文件（Files）**工具（`list_chat_files`、`query_chat_files`、`grep_chat_files`、`view_file`、`display_file`）读取它们。这些工具需要**文件（Files）**内置工具类别、模型的**文件上传（File Upload）**能力和用户的上传权限。 |

**何时禁用预加载文件：**
- **完全绕过 RAG**：不希望 Open WebUI 对附加文件进行任何处理时。
- **仅使用[内置工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)**：如果你希望模型按需检索内容，而不是预先注入内容。禁用预加载文件也会使[内置**文件（Files）**工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)可用，让模型能够自行列出、搜索和读取聊天附件。
- **调试/测试**：用于确定问题是否与 RAG 处理有关。

:::warning 禁用预加载文件 = 不预先注入内容
禁用预加载文件后，文件内容**不会自动提取或注入**。Open WebUI 不会将文件转发到模型的原生 API。禁用后，模型访问文件内容的唯一方式是通过[内置工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)（如果已启用）查询知识库或按需检索附加文件（智能体式文件处理）。
:::

:::tip 按文件设置检索模式
聊天中附加的单个文件和知识库也可以通过**全文（Full text）**开关完全绕过 RAG。无论原生函数调用如何设置，这都会将完整文件内容注入每条消息。有关详细信息，请参阅[检索模式](/features/workspace/knowledge#retrieval-modes)。

如果不想逐个文件选择，请在**设置 > 界面 > 文件（Settings > Interface > File）**中设置**默认上传模式（Default Upload Mode）**：之后附加的每个文件都会以你选择的模式开始，并且仍可单独切换。
:::

:::info
只有为模型启用**文件上传（File Upload）**时，才会显示预加载文件开关。
:::

### 内置工具能力 {#builtin-tools-capability}

**[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)**能力控制模型是否获得用于自主检索的原生函数调用工具：

| 内置工具 | 行为 |
|---------------|----------|
| **启用**（默认） | 除非模型设为 Legacy，否则会获得 `query_knowledge_bases`、`view_knowledge_file`、`search_chats` 等工具。 |
| **禁用** | 不注入任何[内置工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)。模型只使用预先注入的上下文。 |

**何时禁用[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)：**
- **模型不支持函数调用**：较小或较旧的模型可能无法处理 `tools` 参数。
- **需要可预测的行为**：希望模型只使用一开始提供的内容。

### 组合两项能力 {#combining-the-two-capabilities}

这些能力彼此独立，可提供细粒度控制。下表描述在设为默认或原生函数调用的模型上，**聊天内部**附加的文件和知识库。

在 Legacy 模式下，[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)设置对这些附件没有影响。无论该设置如何，模型都不会获得自主检索工具，因此结果完全由预加载文件决定：开启时，内容会预先注入，如传统 RAG 行所述；关闭时，没有任何内容到达模型，如不处理行所述。

| 预加载文件 | 内置工具 | 结果 |
|--------------|---------------|--------|
| 启用 | 启用 | **完整智能体模式**：注入 RAG 内容 + 模型可以自主查询知识库 |
| 启用 | 禁用 | **传统 RAG**：预先注入内容，无自主检索工具 |
| 禁用 | 启用 | **仅工具模式**：不预先注入内容。模型按需查询知识库，并注入[内置**文件（Files）**工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)（`list_chat_files`、`query_chat_files`、`grep_chat_files`、`view_file`、`display_file`），使其能够读取和搜索聊天自己的附件。聊天中附加的知识库和笔记会[将知识工具限制在这些内容内](/features/workspace/knowledge#scoped-access-keeps-things-organized)。此组合也是[提示词缓存的最佳设置](/features/chat-conversations/prompt-caching) |
| 禁用 | 禁用 | **不处理文件**：忽略附加文件，没有内容到达模型 |

:::warning 附加到模型或文件夹的知识行为不同
上表涵盖在聊天中附加的内容。在工作区中附加到模型的知识，以及附加到文件夹的知识，遵循函数调用模式：

- **Legacy**：只要启用了预加载文件，知识就会排队检索并预先注入，与上表所述完全一致。关闭预加载文件会完全移除检索步骤，因此在 Legacy 模式下也不会注入任何内容。
- **默认和原生**：无论预加载文件如何设置，都不会注入任何内容。知识通过[内置知识工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)提供给模型，由模型决定是否搜索。

这会导致一种配置在没有提示的情况下完全不起作用。当预加载文件开启、[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)关闭且函数调用保持默认时，附加到模型或文件夹的知识将永远不会被使用：不会注入任何内容，模型也没有工具进行查询。默认值是大多数部署从不更改的设置，因此很容易意外形成这种组合。

以下任一做法都可以解决：

- 在该模型上保持[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)启用。
- 将该模型的函数调用设为 Legacy。
- 在聊天中附加知识库，而不是附加到模型或文件夹。
:::

:::tip 选择正确的配置
- **大多数模型**：保持两者均启用，以获得完整功能。
- **小型/本地模型**：如果不支持函数调用，请禁用[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)。
- **仅按需检索**：如果你希望模型自行决定检索什么，而不是预先注入所有内容，请禁用预加载文件，启用[内置工具（Builtin Tools）](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)，并将模型设为默认或原生函数调用。这在 Legacy 模式下无效，因为它从不使用按需工具；因此在预加载文件关闭时，将完全不会检索任何内容。
:::

## 增强型 RAG 管道 {#enhanced-rag-pipeline}

RAG 嵌入功能中可切换的混合搜索子功能通过 `BM25` 增强 RAG，使用 `CrossEncoder` 进行重排序，并提供可配置的相关性得分阈值。这可以针对你的具体用例提供更精确、更贴合需求的 RAG 体验。

你可以在**设置 > 文档（Settings > Documents）**（管理员区域）中启用**混合搜索（Hybrid Search）**，无需重新索引知识库或重新上传聊天文件。在嵌入设置相同的情况下，混合搜索的向量部分会使用现有嵌入，关键词搜索则使用已存储的分块文本。

:::tip 文件系统式知识访问（`kb_exec`）
如需更强大的智能体体验，请设置 `ENABLE_KB_EXEC=True`。这会为模型提供基于知识库的 Shell 式界面（`ls`、`tree`、`grep`、`cat`、`head`/`tail`、按行读取以及管道），能力较强的模型通常能更可靠地串联这些操作，而不是并行调用多个独立搜索工具，因此能更频繁地找到正确段落。它需要**原生函数调用**（它是原生模式下的[内置工具](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)），默认关闭；对于设为 Legacy 的模型没有影响。我们建议为能力较强的模型开启它。请参阅[文件系统式访问](/features/workspace/knowledge#filesystem-style-access-kb_exec)。
:::

## YouTube RAG 管道 {#youtube-rag-pipeline}

专用的 RAG 管道可通过视频 URL 摘要 YouTube 视频，从而直接与视频转录文本顺畅交互。这项创新功能允许你将视频内容纳入聊天，进一步丰富对话体验。

视频会以转录文本的形式附加，因此没有可用转录文本的视频无法附加。错误消息会说明具体原因：上传者禁用了字幕、视频有年龄限制或不可用、没有所请求语言的转录文本，或 YouTube 因请求来源地址而阻止了请求。使用 [`YOUTUBE_LOADER_LANGUAGE`](/reference/env-configuration#youtube_loader_language) 设置要尝试的语言，并通过**设置 > 网络搜索 > YouTube 代理 URL（Settings > Web Search > Youtube Proxy URL）**（管理员区域）（[`YOUTUBE_LOADER_PROXY_URL`](/reference/env-configuration#youtube_loader_proxy_url)）让被阻止的请求通过代理发送。请参阅[附加链接或 YouTube 视频失败](/troubleshooting/rag#14-attaching-a-link-or-a-youtube-video-fails)。

## 文档解析 {#document-parsing}

多种解析器可以提取本地和远程文档的内容：Tika、Docling 和 Mistral OCR 等内置引擎，或者如果你需要按文件类型路由或自定义逻辑，也可以通过[外部引擎](/features/chat-conversations/rag/document-extraction/external)使用自己的服务。有关完整列表和设置步骤，请参阅[文档提取](/features/chat-conversations/rag/document-extraction)。

:::warning 临时聊天限制
对于**临时聊天（Temporary Chat）**中附加的本地文档，浏览器会提取文本，并在你提交消息时将其发送到后端。如果需要使用服务器配置的提取引擎，请使用标准聊天。请参阅[临时聊天中的文档附件](/features/chat-conversations/rag/document-extraction#document-attachments-in-temporary-chats)。
:::

### CSV 表格摘要 {#csv-table-summary}

解析后的 CSV 只包含其行数据，因此当被问及电子表格中有多少订单时，模型只能根据检索到的行作答。设置 [`ENABLE_RAG_CSV_SUMMARY=true`](/reference/env-configuration#enable_rag_csv_summary)（默认关闭，需要重启）后，每个 `.csv` 文件开头都会添加一行，注明其行数、数据行数和列名。

`external`、`tika` 和 `docling` 提取引擎会自行解析 `.csv` 文件，因此不会获得摘要。只有开启该设置后解析的文件才会包含摘要，因此请重新索引，为知识库中已有的 CSV 添加摘要。

## Google Drive 集成 {#google-drive-integration}

与启用了 Google Picker API 和 Google Drive API 的 Google Cloud 项目配合使用时，此功能允许用户直接从聊天界面访问其 Drive 文件，并上传文档、幻灯片、表格等内容作为聊天上下文。可以在设置（`Settings`） > 文档（`Documents`）（管理员区域）菜单中启用。必须设置 [`GOOGLE_DRIVE_API_KEY and GOOGLE_DRIVE_CLIENT_ID`](/reference/env-configuration) 环境变量才能使用。

### 详细说明 {#detailed-instructions}

1. 创建 OAuth 2.0 客户端，并将已授权的 JavaScript 来源（Authorized JavaScript origins）和已授权的重定向 URI（Authorized redirect URI）都配置为你用于访问 Open WebUI 实例的 URL（如果有端口，请包含端口）。
2. 记录与该 OAuth 客户端关联的客户端 ID。严格按照 Google 显示的形式使用，即 `<project number>-....apps.googleusercontent.com`。选择器会从客户端 ID 的前导数字中读取 Cloud 项目编号。
3. 确保为你的项目同时启用 Google Drive API 和 Google Picker API。
4. 在 OAuth 同意屏幕中，将应用设为“正式版（In production）”；或者保持“测试（Testing）”状态，并将你的用户添加到测试用户列表。
5. 添加 `https://www.googleapis.com/auth/drive.file` 范围。Open WebUI 只请求此范围，它仅授予对每位用户所选文件的访问权限。Google 将其归类为非敏感范围，因此自托管安装无需受限范围验证或安全评估，用户也不会看到“Google 尚未验证此应用”的警告。
6. 前往 Google Picker API 页面，点击创建凭据按钮。
7. 创建 API 密钥，在“应用程序限制（Application restrictions）”下选择“网站（Websites）”。然后添加你的 Open WebUI 实例 URL，与第 1 步中的已授权 JavaScript 来源和已授权重定向 URI 设置相同。
8. 在 API 密钥上设置 API 限制，使其只能访问 Google Drive API 和 Google Picker API。
9. 将环境变量 `GOOGLE_DRIVE_CLIENT_ID` 设为第 2 步中 OAuth 客户端的客户端 ID。
10. 将环境变量 `GOOGLE_DRIVE_API_KEY` 设为第 7 步中创建的 API 密钥值（不是第 2 步中的 OAuth 客户端密钥）。
11. 将 `GOOGLE_REDIRECT_URI` 设为 Open WebUI 实例的 URL（如果有端口，请包含端口）。
12. 然后使用这三个环境变量重新启动 Open WebUI 实例。
13. 之后，确保已在设置（`Settings`） > 文档（`Documents`） > `Google Drive`（管理员区域）下启用 Google Drive。

选择器会以列表视图打开，因为 `drive.file` 范围不允许它访问文件缩略图。
