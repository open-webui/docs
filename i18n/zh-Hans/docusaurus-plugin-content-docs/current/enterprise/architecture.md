---
sidebar_position: 1
title: "架构与高可用性"
---

### 为关键任务可靠性而构建 {#built-for-mission-critical-reliability}

当 AI 成为组织运营的核心时，停机不仅带来不便，更会造成高昂代价。Open WebUI 从底层架构开始便支持企业级部署，将可靠性作为必备能力。

无论你支持的是 15 人的试点团队，还是数千人的全球员工队伍，Open WebUI 的无状态架构都能随你扩展，无需在需求增长时彻底重建。

### 架构概览 {#architecture-overview}

#### 无状态、容器优先的设计 {#stateless-container-first-design}

Open WebUI 采用**无状态、容器优先的架构**。在扩展部署中，状态保存在共享服务中，而不依赖特定的应用副本。PostgreSQL 保存应用数据，共享向量数据库保存嵌入，共享存储保存文件，Redis 协调各实例。这带来了以下能力：

* **横向扩展：**随着需求增长添加更多实例，而无需升级到更大、更昂贵的硬件。
* **灵活部署：**无需更改架构，即可在本地、私有云或混合环境中运行。
* **容器编排兼容性：**完整支持 Kubernetes、Docker Swarm 和其他编排平台。

对决策者而言，这意味着你在 Open WebUI 上的初始投资不会变成技术债。支持概念验证的同一架构，可以扩展到支持整个组织。

默认的单实例设置使用本地 SQLite 和 ChromaDB 存储。添加副本之前，请按照[扩展指南](/getting-started/advanced-topics/scaling)配置共享服务和匹配的密钥。

### 高可用性配置 {#high-availability-configuration}

对于运行时间要求严格的组织，Open WebUI 支持生产级高可用性配置：

| 组件 | 能力 |
| :--- | :--- |
| **负载均衡** | 在负载均衡器后运行多个容器实例，以提高韧性和整体性能。 |
| **外部数据库** | PostgreSQL 作为主数据库（多实例不支持 SQLite）。 |
| **外部向量数据库** | 客户端-服务器架构的向量数据库（PGVector、Milvus、Qdrant），或 HTTP 服务器模式下的 ChromaDB。默认的 ChromaDB 本地模式使用 SQLite，不适合多进程访问。 |
| **Redis** | 跨实例协调 WebSocket、撤销 token 以及共享缓存（如模型列表）所必需。配置通过共同的 PostgreSQL 数据库共享，而不是通过 Redis。 |
| **持久存储** | 灵活的存储后端，满足你的数据驻留和性能要求。 |
| **可观测性** | 与现代日志和指标工具集成，实现主动监控。 |

配置正确时，Open WebUI 能够提供适用于企业环境的高可用性支持。

### 实际扩展能力 {#scalability-in-practice}

Open WebUI 并非仅在理论上具备扩展能力，而是**已经实现大规模部署**。该平台已在支持极高用户数量的部署中获得信任，包括：

* **大学**：管理覆盖整个机构的 AI 访问。
* **跨国企业**：跨地区和业务部门部署。
* **大型组织**：在高负载下要求稳定一致的性能。

通过正确的基础设施配置，Open WebUI 可以从试点项目扩展到全球范围的关键任务部署。

### 这对你的组织意味着什么 {#what-this-means-for-your-organization}

#### 对 IT 领导层 {#for-it-leadership}

你采用的并不是一款会随着发展而需要被替换的工具。Open WebUI 的架构支持你的长期 AI 战略，无需被迫迁移或重新构建平台。

#### 对安全与合规团队 {#for-security--compliance-teams}

无状态架构和灵活的部署选项，意味着你可以满足数据驻留要求，并掌控 AI 基础设施的部署位置。

#### 对财务与采购部门 {#for-finance--procurement}

横向扩展意味着你可以按实际需求为容量付费，无需“以防万一”而过度预配昂贵硬件。

---

[**联系企业销售 →**](https://openwebui.com/contact/sales)
