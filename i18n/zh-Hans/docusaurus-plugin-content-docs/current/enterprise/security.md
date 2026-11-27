---
sidebar_position: 2
title: "安全"
---

### 企业级安全架构 {#enterprise-grade-security-architecture}

对企业组织而言，采用 AI 不仅是技术决策，更是安全决策。每一次模型查询、每一份上传的文档和每一个自动化工作流程，都涉及需要保护的数据。

Open WebUI 将安全作为核心优先事项。无论你需要满足严格的监管要求，还是致力于保护组织的知识产权，Open WebUI 都提供了相关控制项，帮助你放心地部署 AI。与任何自托管软件一样，部署组织负责保护其环境、基础设施和配置。

有关聊天存储、管理员可见性、静态加密、临时聊天、模型服务提供方数据暴露和建议控制项的详细说明，请参阅[聊天数据隐私与加密](/security/chat-data-privacy-and-encryption)。

### 安全架构 {#security-architecture}

#### 你的数据，你的基础设施 {#your-data-your-infrastructure}

SaaS AI 平台会让你的数据经过第三方服务器，而 Open WebUI 让你能够**完全掌控自己的数据管道**：

| 部署模式 | 说明 |
| :--- | :--- |
| **本地部署** | 完全在你自己的数据中心内运行。默认情况下，数据保留在你的网络中。 |
| **私有云** | 部署在组织的云租户（AWS、Azure、GCP）中，并完全控制基础设施。 |
| **气隙隔离** | 完全隔离网络，适用于具有最严格安全要求的环境。 |
| **混合部署** | 灵活配置，在可访问性与安全边界之间取得平衡。 |

对于处理敏感数据的组织，无论数据是专有研究成果、客户信息还是涉密材料，此架构都旨在帮助你维持安全防护水平。

如果你从主权 AI 的角度进行评估，请先定义部署必须控制的基础设施、数据、模型、身份、权限、日志和操作员边界。请参阅[主权 AI 平台](/enterprise/sovereign-ai)清单，或 openwebui.com 上的[主权 AI 产品概览](https://openwebui.com/sovereign-ai)。

### 监管与合规注意事项 {#regulatory--compliance-considerations}

许多评估 AI 平台的组织需要遵守 SOC 2、HIPAA、GDPR、FedRAMP 或 ISO 27001 等监管框架。Open WebUI 的自托管、本地和气隙隔离架构提供了可构成合规部署**一部分**的技术控制项：

* **自托管数据管道**：默认情况下，数据保留在你的基础设施中，除非你配置了外部模型服务提供方。
* **身份集成**：通过 SSO、LDAP 和 RBAC 执行访问策略。
* **可用于审计的日志**：容器原生日志流兼容企业 SIEM 工具。请求审计日志默认关闭（`AUDIT_LOG_LEVEL=NONE`），启用后写入 `DATA_DIR/audit.log`；设置 `ENABLE_AUDIT_STDOUT=true` 可将其同时发送到容器的 stdout。
* **数据驻留控制**：由你选择数据的物理驻留位置。

:::warning 合规责任
作为自托管软件，Open WebUI 部署并运行在你的基础设施中。合规认证适用于**你的部署**，而不是软件本身。由于部署、配置、访问控制和运营保障均由你管理，因此你的组织负责满足任何监管框架的要求。本软件的使用受 [Open WebUI 许可证](/license)约束。

通用最佳实践指导请参阅我们的[安全加固文档](/getting-started/advanced-topics/hardening)。相应级别的企业客户可获得有关部署和配置决策的实际操作支持。

[**联系企业销售团队获取合规指导 →**](https://openwebui.com/contact/sales)
:::

### 身份与访问管理 {#identity--access-management}

与现有身份基础设施无缝集成，既能减少使用阻碍，又能维持安全边界。

#### 企业身份集成 {#enterprise-identity-integration}

Open WebUI 可与组织已经在使用的身份系统集成：

* **LDAP 与 Active Directory**：直接连接现有目录服务，进行用户身份验证和管理。
* **单点登录（SSO）**：支持 OIDC 和 OAuth 2.0（Google、Microsoft Entra、GitHub 以及任何 OIDC 提供方），使用户能够使用现有的企业凭据访问 Open WebUI。
* **多因素认证（MFA）**：通过 SSO 将登录委托给身份提供方时，由身份提供方强制执行；也可以使用 Open WebUI 自带的[双因素登录](/features/authentication-access/mfa)，通过验证器应用保护密码、LDAP、SSO 和受信任请求头登录。

#### 访问控制与权限 {#access-control--permissions}

除身份验证外，Open WebUI 还提供精细的用户权限控制：

* **基于角色的访问控制（RBAC）**：定义与组织结构一致的角色，以限制管理访问权限。
* **模型级权限**：控制哪些用户或组可以访问特定模型。
* **工作区隔离**：分隔团队或部门，以帮助限制未经授权的数据访问。

### 数据治理 {#data-governance}

#### 审计与问责 {#audit--accountability}

对于受监管行业和注重安全的组织，系统使用情况的可见性必不可少。Open WebUI 支持标准的企业日志模式：

* **基础设施级日志**：容器化架构允许将标准输出流直接传送到日志基础设施（Splunk、Datadog、ELK）。
* **事件跟踪**：跟踪 API 使用情况和系统事件，以监测异常。
* **数据保留控制**：由于数据库由你所有，你可以控制数据保留策略，并根据合规计划清除或归档数据。

#### 数据驻留 {#data-residency}

对于有数据地域要求的组织，无论要求源自 GDPR、数据主权法律还是内部政策，Open WebUI 的自托管部署模式都旨在支持将数据实际保存在策略要求的位置。


### 漏洞管理与披露 {#vulnerability-management--disclosure}

Open WebUI 中的安全问题通过单一、明确的流程处理，而不是临时应对：

* **唯一权威渠道。** 漏洞通过 [GitHub Security Advisories](https://github.com/open-webui/open-webui/security) 报告和协调。核心团队会对照代码手动分类和验证报告，而不是自动分类。
* **修复、标识符与披露。** 已确认的问题会在切实可行的情况下尽快修补，在符合条件时分配 CVE 标识符，并在修复发布后以安全公告的形式公开。完整历史记录可在[安全公告页面](https://github.com/open-webui/open-webui/security/advisories)审计：你可以查看发现了什么问题、如何解决，以及哪个版本包含修复。
* **公开回应有争议的论断。** 当外部 CVE 曲解软件或威胁模型时，团队会发布有理有据的[供应商立场说明](/security/vendor-dispositions)，而不是任由不实的公开记录流传。

交互规则、受支持版本、威胁模型，以及哪些问题会被视为漏洞，均记录在[安全政策](/security/security-policy)中。

### 供应链与软件包完整性 {#supply-chain--package-integrity}

Open WebUI 发布的制品均根据 [open-webui/open-webui](https://github.com/open-webui/open-webui) 仓库中的公开源代码构建，并可从中复现，因此任何有关发布版本的论断都可以对照代码进行核验。

自动化供应链扫描器（例如 socket.dev）会定期针对这些软件包提出行为风险指标、未经确认的分类，以及许可证或维护者评分。这些内容反映的是软件设计上具备的能力和元数据表象，而不是已确认的漏洞或恶意代码。如果你的审查中出现此类标记，[供应链与安全扫描器](/security/supply-chain-security)解释了我们对各类标记的立场及其解读方式。第三方依赖通过日常维护进行跟踪和更新。

### 代码执行与沙盒隔离 {#code-execution--sandboxing}

Open WebUI 中的服务器端代码执行需要管理员显式操作才能启用，不会向任意用户开放：

* **服务器端执行引擎（例如 Jupyter）需要主动选择启用**，并由管理员配置。默认情况下，它们不会连接到服务器运行时。
* **编写服务器端工具和函数被视为等同于授予服务器代码执行权限。** 此能力受 `workspace.tools` 权限限制，默认对非管理员禁用，文档明确说明其等同于向该用户授予服务器的 shell 访问权限。
* **生产环境的代码和 shell 执行应使用 Terminals 编排器。** [Terminals 编排器](/features/open-terminal/terminals)在容器隔离的实例中运行执行任务，并设置资源限制，因此不会暴露共享服务器运行时。这是企业部署的推荐模式；其他引擎的通用隔离指导请参阅我们的[安全加固文档](/getting-started/advanced-topics/hardening)。

完整模型请参阅[工具与函数安全模型](/features/extensibility/plugin/tools)。

### 这对你的组织意味着什么 {#what-this-means-for-your-organization}

#### 对安全团队而言 {#for-security-teams}

Open WebUI 可公开审计的代码库为你提供可见性和控制力，并能与现有安全工具集成，而不是形成盲区。如果供应链或软件包扫描器（例如 socket.dev）在你的审查中标记了 Open WebUI 软件包，请参阅[供应链与安全扫描器](/security/supply-chain-security)，了解我们对这些指标的立场。

#### 对合规负责人而言 {#for-compliance-officers}

这些技术控制项可为你的合规工作提供支持。无论你是在准备审计，还是在回复安全调查问卷，Open WebUI 的架构都提供了可支持相关答复的技术控制项。

#### 对 IT 领导层而言 {#for-it-leadership}

用户管理不会再成为另一个信息孤岛。Open WebUI 与现有身份基础设施协同工作，减少管理开销，并有助于在你的各种工具中保持一致的访问策略。

---

[**联系企业销售团队 →**](https://openwebui.com/contact/sales)
