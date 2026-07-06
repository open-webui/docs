---
sidebar_position: 2
title: "Security"
---

### Enterprise-Grade Security Architecture

For enterprise organizations, AI adoption isn't just a technology decision, it's a security decision. Every model query, every document uploaded, and every workflow automated represents data that needs protection.

Open WebUI is built with security as a core priority. Whether you are navigating strict regulatory requirements or simply committed to protecting your organization's intellectual property, Open WebUI provides controls to help you deploy AI with confidence. As with any self-hosted software, the deploying organization is responsible for securing its environment, infrastructure, and configuration.

For a detailed explanation of chat storage, administrator visibility, encryption at rest, temporary chats, model-provider exposure, and recommended controls, see [Chat Data Privacy & Encryption](/security/chat-data-privacy-and-encryption).

### Security Architecture

#### Your Data, Your Infrastructure

Unlike SaaS AI platforms where your data traverses third-party servers, Open WebUI gives you **full control over your data pipeline**:

| Deployment Model | Description |
| :--- | :--- |
| **On-Premise** | Run entirely within your own data centers. Your data stays within your network by default. |
| **Private Cloud** | Deploy in your organization's cloud tenancy (AWS, Azure, GCP) with full infrastructure control. |
| **Air-Gapped** | Complete network isolation for environments with the strictest security requirements. |
| **Hybrid** | Flexible configurations that balance accessibility with security boundaries. |

For organizations handling sensitive data, whether proprietary research, customer information, or classified materials, this architecture is designed to help protect your security posture.

If you are evaluating this through a sovereign AI lens, start by defining the infrastructure, data, model, identity, permission, logging, and operator boundaries your deployment must control. See [Sovereign AI Platform](/enterprise/sovereign-ai) for a practical evaluation checklist.

### Regulatory & Compliance Considerations

Many organizations evaluating AI platforms operate under regulatory frameworks such as SOC 2, HIPAA, GDPR, FedRAMP, or ISO 27001. Open WebUI's self-hosted, on-premise, and air-gapped architecture provides technical controls that can form **part of** a compliant deployment:

* **Self-hosted data pipeline** ,  Your data stays within your infrastructure by default, unless you configure external model providers.
* **Identity integration** ,  SSO, LDAP, RBAC to enforce your access policies.
* **Audit-ready logging** ,  Container-native log streams compatible with enterprise SIEM tools.
* **Data residency control** ,  You choose where your data physically resides.

:::warning Compliance Responsibility
As self-hosted software, Open WebUI is deployed and operated within your infrastructure. Compliance certifications apply to **your deployment**, not to the software itself. Because you manage the deployment, configuration, access controls, and operational safeguards, responsibility for meeting any regulatory framework sits with your organization. Use of this software is governed by the [Open WebUI License](/license).

General best-practice guidance is available in our [hardening documentation](/getting-started/advanced-topics/hardening). Enterprise customers on the appropriate tier receive hands-on support for deployment and configuration decisions.

[**Contact Enterprise Sales for Compliance Guidance → sales@openwebui.com**](mailto:sales@openwebui.com)
:::

### Identity & Access Management

Seamless integration with your existing identity infrastructure reduces friction while maintaining security boundaries.

#### Enterprise Identity Integration

Open WebUI integrates with the identity systems your organization already uses:

* **LDAP & Active Directory** ,  Connect directly to your existing directory services for user authentication and management.
* **Single Sign-On (SSO)** ,  Support for SAML and OIDC protocols, enabling users to access Open WebUI with their existing corporate credentials.
* **Multi-Factor Authentication (MFA)** ,  Layer additional security on top of primary authentication.

#### Access Control & Permissions

Beyond authentication, Open WebUI provides granular control over user permissions:

* **Role-Based Access Control (RBAC)** ,  Define roles that align with your organizational structure to limit administrative access.
* **Model-Level Permissions** ,  Control which users or groups can access specific models.
* **Workspace Isolation** ,  Separate teams or departments to help restrict unauthorized data access.

### Data Governance

#### Audit & Accountability

For regulated industries and security-conscious organizations, visibility into system usage is not optional. Open WebUI supports standard enterprise logging patterns:

* **Infrastructure-Level Logging** ,  Containerized architecture allows standard output streams to be piped directly to your logging infrastructure (Splunk, Datadog, ELK).
* **Event Tracking** ,  Track API usage and system events to monitor for anomalies.
* **Retention Controls** ,  Because you own the database, you control the data retention policies, so data can be purged or archived according to your compliance schedules.

#### Data Residency

For organizations with geographic data requirements, whether driven by GDPR, data sovereignty laws, or internal policy, Open WebUI's self-hosted deployment model is designed to support keeping your data physically located where your policies require.


### Vulnerability Management & Disclosure

Security issues in Open WebUI are handled through a single, defined process rather than ad hoc:

* **One authoritative channel.** Vulnerabilities are reported and coordinated through [GitHub Security Advisories](https://github.com/open-webui/open-webui/security). Reports are triaged and validated by hand against the code by the core team, not auto-classified.
* **Fix, identifier, disclosure.** Confirmed issues are patched as quickly as is practical, assigned CVE identifiers where valid and published openly as advisories once a fix ships. The full history is auditable on the [Security Advisories page](https://github.com/open-webui/open-webui/security/advisories): you can see what was found, how it was resolved and which release contains the fix.
* **Disputed claims are answered on the record.** Where an external CVE misrepresents the software or the threat model, the team publishes a reasoned [Vendor Disposition](/security/vendor-dispositions) rather than leaving the public record unchallenged.

The rules of engagement, supported versions, threat model and what is and is not treated as a vulnerability are documented in the [Security Policy](/security/security-policy).

### Supply Chain & Package Integrity

Open WebUI's published artifacts are built from the public source in the [open-webui/open-webui](https://github.com/open-webui/open-webui) repository and are reproducible from it, so any claim about a release can be checked against the code.

Automated supply-chain scanners (for example socket.dev) periodically raise behavioral risk indicators, unconfirmed classifications and license or maintainer scores against the packages. These reflect capabilities the software has by design and metadata artifacts, not confirmed vulnerabilities or malicious code. If your review surfaces such a flag, [Supply Chain and Security Scanners](/security/supply-chain-security) explains our position on each category and how to interpret it. Third-party dependencies are tracked and updated through routine maintenance.

### Code Execution & Sandboxing

Server-side code execution in Open WebUI is gated behind explicit administrator action, not exposed to arbitrary users:

* **Server-side execution engines (such as Jupyter) are opt-in** and administrator-configured. They are not wired to a server runtime by default.
* **Authoring server-side Tools and Functions is treated as equivalent to granting server code execution.** It is restricted by the `workspace.tools` permission, disabled by default for non-administrators and documented as equivalent to giving that user shell access to the server.
* **For production code and shell execution, use the Terminals orchestrator.** Rather than exposing a shared server runtime, the [Terminals orchestrator](/features/open-terminal/terminals) runs execution in per-session, container-isolated environments with configurable [security-context and resource policies](/features/open-terminal/terminals/orchestration/policies). This is the recommended model for enterprise deployments; general isolation guidance for other engines is in our [hardening documentation](/getting-started/advanced-topics/hardening).

See the [Tools and Functions security model](/features/extensibility/plugin/tools) for the full model.

### What This Means for Your Organization

#### For Security Teams

Open WebUI's publicly auditable codebase gives you visibility and control, integrating with your existing security tooling rather than creating blind spots. If a supply-chain or package scanner (such as socket.dev) flags the Open WebUI packages during your review, see [Supply Chain and Security Scanners](/security/supply-chain-security) for our position on those indicators.

#### For Compliance Officers

The technical controls exist to support your compliance posture. Whether you are preparing for an audit or responding to a security questionnaire, Open WebUI's architecture provides technical controls that can support your responses.

#### For IT Leadership

User management doesn't become another silo. Open WebUI works with your existing identity infrastructure, reducing administrative overhead and helping maintain consistent access policies across your tooling.

--- 

[**Contact Enterprise Sales → sales@openwebui.com**](mailto:sales@openwebui.com)
