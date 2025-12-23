---
sidebar_position: 2
title: "🛡️ Security & Governance"
description: "Enterprise security architecture for Open WebUI: Data sovereignty, RBAC, SSO integration, and compliance support."
---

# Security & Governance

## Your Data, Your Perimeter

In the age of AI, data leakage is a top-tier risk. Public AI services often treat user data as training material, creating unacceptable liability for enterprises.

Open WebUI flips this model. We provide the interface and orchestration, but **you control the infrastructure**. Whether you are protecting trade secrets, PII, or government data, Open WebUI ensures your AI interactions never leave your security perimeter without your explicit permission.

---

## Security Architecture

### Zero-Trust Deployment Options

Unlike SaaS AI platforms where your data traverses third-party networks, Open WebUI gives you **complete data sovereignty**:

| Deployment Model | Security Profile |
| :--- | :--- |
| **On-Premise** | Run entirely within your own physical data centers. Zero external connectivity required. |
| **Private Cloud** | Deploy in your organization's protected VPC (AWS, Azure, GCP) with full network isolation. |
| **Air-Gapped** | Complete network isolation for environments with the highest classification requirements. |
| **Hybrid** | Securely connect local LLMs with external APIs via controlled, monitored gateways. |

---

## Identity & Access Management (IAM)

Security begins with knowing who is accessing your model. Open WebUI integrates seamlessly with your existing enterprise identity providers, preventing "Shadow AI" usage by standardizing access controls.

### Single Sign-On (SSO) & Authentication
Stop managing separate passwords for your AI tools. Open WebUI supports industry-standard authentication protocols:
*   **OIDC (OpenID Connect)**
*   **OAuth 2.0**
*   **LDAP / Active Directory**

### Role-Based Access Control (RBAC)
Grant appropriate access levels based on user roles. Limit administrative privileges, manage model availability, and control feature access to ensure that only authorized personnel can modify system configurations.

---

## Compliance Readiness

Open WebUI is engineered to fitting into your organization's governance framework. By keeping data processing within your controlled infrastructure, we help you satisfy the requirements of major compliance standards:

*   **SOC 2:** Maintain control over processing integrity and security by removing third-party data handlers.
*   **HIPAA:** Ensure Protected Health Information (PHI) never leaves your HIPAA-compliant private cloud or on-prem server.
*   **GDPR:** Fulfill data residency and "Right to be Forgotten" requirements by retaining full ownership of your database.
*   **FedRAMP:** Deploy in FedRAMP-authorized cloud environments or government-owned hardware.

---

## Observability & Audit Readiness

### "Glass Box" Architecture
Unlike "Black Box" SaaS providers, Open WebUI provides transparency into how your AI platform is being used.

*   **Database Ownership:** All chat history, user interactions, and system configurations are stored in your own SQL database (PostgreSQL/SQLite). You have direct access to query, backup, and audit this data at any time.
*   **Infrastructure Logging:** Open WebUI outputs standard container logs that can be ingested by your existing SIEM and observability tools (Splunk, Datadog, ELK Stack), allowing your security team to monitor API usage and detect anomalies using their preferred workflows.

---

## What This Means for Your Stakeholders

### For CISOs & Security Architects
You eliminate the risk of "Model Leakage." Your proprietary data is never used to train a public model, and you maintain the keys to the infrastructure.

### For Compliance Officers
The technical controls exist to support your audit posture. Whether you are responding to a security questionnaire or preparing for a SOC 2 audit, Open WebUI's self-hosted architecture provides defensible answers regarding data location and access.

### For IT Leadership
User management is centralized. Integration with your existing IdP (Identity Provider) reduces administrative overhead and ensures that employee off-boarding immediately revokes AI access.

---

## Planning Your Secure Deployment

Security requirements vary significantly across industries. The right configuration depends on your specific threat model and compliance obligations.

**Start a conversation with our security solutions team to discuss:**
*   Air-gapped deployment strategies.
*   Integrating with complex IdP setups.
*   Hardening Open WebUI for government or financial use.

[**Contact Security Solutions Team**](mailto:sales@openwebui.com)

---

## Next Steps

*   **[🔧 Integration & Customization](./customization)** — Learn how to configure white-labeling and custom models.
*   **[🤝 Support & SLAs](./support)** — Review our enterprise support tiers.
*   **[🏗️ High Availability](./architecture)** — Return to architecture and scalability overview.