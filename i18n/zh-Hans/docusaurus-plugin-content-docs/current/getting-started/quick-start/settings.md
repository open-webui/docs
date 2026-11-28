---
sidebar_position: 100
title: "了解设置"
---

# 了解设置 {#understanding-settings}

**Open WebUI 有两个相互独立的设置区域，而非只有一个。**

Open WebUI 从设计之初就支持多用户。即使只有你在使用，其架构也假定同一实例上可能有多个用户。因此，平台需要两层配置：一层面向控制实例的管理员，另一层面向控制个人体验的每位用户。

---

## 两个设置区域 {#the-two-settings-areas}

### 管理员设置（全局） {#admin-settings-global}

| | |
| :--- | :--- |
| **位置** | 个人资料头像 > **设置（Settings）**，然后进入 **管理员（Admin）** 部分 |
| **访问权限** | 仅限管理员 |
| **范围** | 整个实例和所有用户 |

管理员设置控制 Open WebUI 实例本身的一切：API 连接、功能开关、安全策略和默认行为。可以把它看作**整栋大楼的控制面板**。它决定为所有人安装和提供哪些功能。

**以下是此处的部分设置：**

- 与 Ollama、OpenAI 及其他模型服务提供方的连接
- 启用或禁用 Web 搜索、图像生成和代码执行
- [已选择和固定的模型](/features/workspace/models#selected-and-pinned-models-admin)和参数预设
- RBAC 策略、SSO 配置和注册限制

---

### 用户设置（个人） {#user-settings-personal}

| | |
| :--- | :--- |
| **位置** | 个人资料头像 > **设置（Settings）** |
| **访问权限** | 每位用户（包括管理员） |
| **范围** | 仅限当前用户 |

用户设置控制个人偏好：默认模型、界面主题、语言、通知偏好，以及管理员已启用功能的逐项开关。可以把它看作**自己房间里的恒温器**。你可以按自己的需要调整，但只能在大楼提供的范围内进行。

**以下是此处的部分设置：**

- 系统提示词，以及在模型选择器中通过 **设为默认（Set as default）** 保存的默认模型
- 界面主题和语言
- 自动补全或富文本输入等单项功能开关

**设置（Settings）> 通用（General）** 下的 **主题（Theme）** 和 **语言（Language）** 保存在浏览器中，而不是账户中，因此不会跟随你到其他浏览器或设备。此前从未打开过 Open WebUI 的浏览器会使用 **系统（System）** 主题，并使用管理员通过 [`DEFAULT_LOCALE`](/reference/env-configuration#default_locale) 设置的语言；如果管理员未设置，则使用浏览器自身的语言。

---

## 两者如何协同工作 {#how-they-work-together}

许多功能遵循**两层模式**：

1. 管理员决定某项功能是否**可用**（管理员设置）
2. 每位用户决定**自己是否要使用**（用户设置）

**示例：自动补全（AI 驱动的输入建议）**

| 层级 | 设置位置 | 效果 |
|-------|-----------------|--------|
| 管理员启用 | 设置（Settings）> 界面（Interface）（管理员部分） | 使自动补全在实例中**可用** |
| 用户启用 | 设置（Settings）> 界面（Interface） | 为你个人**开启**自动补全 |

:::important 重要规则
如果管理员全局**禁用**某项功能，用户**无法**自行启用。管理员设置始终是上限。
:::

此模式适用于 Web 搜索、图像生成、代码解释器等。管理员控制**哪些事可以做**，用户控制**自己想做什么**。

---

## 实例范围的初始值 {#instance-wide-starting-values}

功能开关是上限。有一项管理员控制则采用相反的工作方式：**默认界面设置（Default Interface Settings）**决定每个人的 **设置（Settings）> 界面（Interface）** 页面最初使用哪些值，每个人仍可自行更改其中任何选项。对于用户从未改动过的选项，其值会持续跟随你设置的默认值，因此你之后更改默认值也会同步影响这些用户。

在 **设置（Settings）> 通用（General）**（管理员部分）的 **UI > 默认界面设置（Default Interface Settings）** 下配置，或使用 `DEFAULT_INTERFACE_SETTINGS` 环境变量。

[**了解默认界面设置 →**](/features/administration/interface-defaults)

---

## 快速参考 {#quick-reference}

| | 管理员设置 | 用户设置 |
|---|---|---|
| **范围** | 整个实例（所有用户） | 仅限当前用户 |
| **访问权限** | 仅限管理员 | 所有人 |
| **控制内容** | API 连接、功能开关、安全、默认值 | 主题、默认模型、个人偏好 |
| **覆盖行为** | 用户无法覆盖 | 可在管理员允许的范围内自定义 |

唯一有意保留的例外是[默认界面设置](/features/administration/interface-defaults)，管理员将其设为初始值而不是限制；每位用户都可以自行更改其中任何选项。

---

## 常见场景 {#common-scenarios}

**“我在设置中启用了某项功能，但它不起作用。”**
先检查管理员是否已全局启用。只有管理员在实例级别提供该功能后，你的个人开关才会生效。

**“我是管理员。在哪里配置与 OpenAI 或 Ollama 的连接？”**
设置（Settings）> 连接（Connections）（管理员部分）。这些连接在实例范围内生效，由所有用户共享。

**“我想使用自己的 API 密钥，但不希望与服务器共享。”**
在 Tether 应用中添加的连接会将密钥保留在你的计算机上，请参阅[使用自己的模型和工具](/ecosystem/tether#bring-your-own-models-and-tools)。管理员可以在 **设置（Settings）> 连接（Connections）**（管理员部分）下添加共享连接。

**“我设置了系统提示词，但管理员的模型设置覆盖了它。”**
Open WebUI 会按以下顺序组合工作区模型的系统提示词、文件夹的提示词（如果有），以及聊天的提示词或你的账户提示词。聊天没有自己的提示词时，使用账户提示词。请参阅[聊天参数](/features/chat-conversations/chat-features/chat-params#how-system-prompts-combine)。

**“设置（Settings）> 界面（Interface）中的某个开关旁边写着默认（Default）。这是什么意思？”**
这表示你从未更改过该选项，因此它会跟随管理员配置的实例范围[默认界面设置](/features/administration/interface-defaults)。更改后，该选项就会成为你的个人设置；将其设回当前默认值后，它会重新跟随默认设置。

**“界面太小，看起来费力。”**
在 **设置（Settings）> 界面（Interface）** 的 **UI** 部分顶部调高 **界面缩放（UI Scale）**。它会放大整个应用，并保存在你的账户中。

点击 **界面缩放（UI Scale）** 旁的 **默认（Default）** 以显示滑块。范围为 `1x` 到 `1.5x`。旁边的减号和加号按钮（屏幕阅读器会朗读为 **Decrease UI Scale（减小界面缩放）** 和 **Increase UI Scale（增大界面缩放）**）每次调整 `0.1`。它们是按钮，不是键盘快捷键。点击数值即可恢复默认值。

**“可以更改字体吗？”**
可以。在 **设置（Settings）> 界面（Interface）** 中，**字体系列（Font Family）** 位于界面缩放正下方。点击 **默认（Default）** 调出文本框，然后输入字体名称，例如 `Aptos`。

字体必须已安装在你当前使用的计算机上。系统不会下载任何字体，因此如果输入的字体未安装，界面会继续使用标准字体，也不会显示错误。清空文本框即可恢复原状。预格式化块在这两种情况下都保持标准字体。

**“浮动快捷操作（Floating Quick Actions）和图像压缩（Image Compression）旁边的管理（Manage）按钮有什么作用？”**
每个按钮仅在其对应开关开启时显示。屏幕阅读器会将它们朗读为 **Open Modal To Manage Floating Quick Actions（打开浮动快捷操作管理对话框）** 和 **Open Modal To Manage Image Compression（打开图像压缩管理对话框）**。

- **浮动快捷操作（Floating Quick Actions）**位于 **聊天（Chat）** 部分，控制选中已生成完毕的回复中的文本时出现的工具栏。其 **管理（Manage）** 对话框 **快捷操作（Quick Actions）** 列出工具栏按钮。点击 **默认（Default）** 切换到 **自定义（Custom）**，初始包含内置的 **询问（Ask）** 和 **解释（Explain）** 按钮。使用加号图标添加按钮，为每个按钮填写 **按钮标签（Button Label）**、**按钮 ID（Button ID）** 和 **按钮提示词（Button Prompt）**，然后点击 **保存（Save）**。再次点击 **自定义（Custom）** 会恢复内置按钮，空列表也会使用内置按钮。点击某个按钮会将其提示词放入聊天输入框，但不会发送。在提示词中，`{{CONTENT}}` 会替换为选中的文本，`{{SELECTED_CONTENT}}` 会替换为以 `>` 引用的选中文本，`{{INPUT_CONTENT}}` 会先打开一个 **提问（Ask a question）** 输入框，并插入你在其中输入的内容。为每个按钮设置唯一的 **按钮 ID（Button ID）**：如果两个按钮共用一个 ID，两者都会执行第一个按钮的提示词。
- **图像压缩（Image Compression）**位于 **文件（File）** 部分，会在图片发送或存储前压缩你附加的图片。其 **管理（Manage）** 对话框通过 **宽度（Width）** 和 **高度（Height）**（以像素为单位）设置 **图像最大压缩尺寸（Image Max Compression Size）**。图片保持宽高比，若图片的宽度和高度都未超过限制，则保持原样。它适用于聊天和笔记中附加的图片；在 **压缩频道中的图片（Compress Images in Channels）** 开启时，也适用于频道中的图片。

**“我在设置（Settings）> 账户（Account）中输入了新密码并点击保存，但旧密码仍然有效。”**
**设置（Settings）> 账户（Account）** 底部的 **保存（Save）** 仅保存个人资料和用户变量，绝不会发送密码字段。要更改密码，请在 **密码（Password）** 部分通过 **显示（Show）** 打开 **更改密码（Change Password）**，填写 **当前密码（Current Password）**、**新密码（New Password）** 和 **确认密码（Confirm Password）**，然后点击这些字段下方的 **更新密码（Update password）**。

成功后，你会看到 `Password updated. Please sign in again.`（密码已更新，请重新登录。），随后 Open WebUI 会将你登出。与此同时，在任何设备上登录你账户的所有其他会话都会失效，因此请在使用 Open WebUI 的各处用新密码重新登录。API 密钥仍然有效。

| 消息 | 原因 |
| :--- | :--- |
| `The passwords you entered don't quite match. Please double-check and try again.`（你输入的两次密码不完全一致，请仔细检查后重试。） | **新密码（New Password）**与**确认密码（Confirm Password）**不一致。未发送任何内容。 |
| `The password provided is incorrect. Please check for typos and try again.`（提供的密码不正确，请检查是否有输入错误后重试。） | **当前密码（Current Password）**与账户中保存的密码不一致。 |
| `The password does not meet the required validation criteria.`（密码不符合所需的验证条件。），或管理员自定义的提示 | 新密码不符合通过 [`ENABLE_PASSWORD_VALIDATION`](/reference/env-configuration#enable_password_validation) 设置的规则。 |
| `The requested action has been restricted as a security measure.`（作为安全措施，请求的操作已被限制。） | 实例使用受信任标头登录（[`WEBUI_AUTH_TRUSTED_EMAIL_HEADER`](/reference/env-configuration#webui_auth_trusted_email_header)），因此密码由 Open WebUI 前面的代理管理。 |

对于 Open WebUI 在首次 OAuth 或 LDAP 登录时创建的账户，系统会分配一个从未向任何人显示的随机密码，因此 **当前密码（Current Password）** 永远无法匹配，你会看到密码不正确的消息。管理员可以在 **管理员面板（Admin Panel）> 用户（Users）** 下该账户的 **编辑用户（Edit User）** 对话框中，通过 **新密码（New Password）** 为其设置密码。此后，该密码即可在此处用作 **当前密码（Current Password）**。当管理员关闭 [`ENABLE_LOGIN_FORM`](/reference/env-configuration#enable_login_form) 或 [`ENABLE_PASSWORD_CHANGE_FORM`](/reference/env-configuration#enable_password_change_form) 时，整个 **密码（Password）** 部分会隐藏。

**“我是管理员。可以让所有人都以相同的界面选项开始吗？”**
可以，使用[默认界面设置](/features/administration/interface-defaults)。它决定所有人的初始状态；之后每个人仍可自行更改其中任何选项。

:::tip 首次担任管理员？
先在 **设置（Settings）> 连接（Connections）**（管理员部分）连接模型服务提供方（Ollama、OpenAI 等），然后探索 **设置（Settings）> 界面（Interface）**（管理员部分），为用户启用或禁用功能。
:::
