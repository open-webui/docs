---
sidebar_position: 4
title: "SSH 机器"
---

# 通过 SSH 添加机器

可以将自己的服务器、备用计算机或笔记本电脑用作 Open Terminal 机器，无需运行 Docker，也无需开放端口。向 Open WebUI 提供 SSH 地址，它就会在该机器上安装并启动 Open Terminal，然后通过 SSH 访问它。

随后，AI 会以该机器上 SSH 用户的身份操作其文件和工具，与[裸机安装](./installation.mdx)的效果相同。

---

## 要求 {#requirements}

- Open WebUI 服务器可以通过 SSH 访问该机器，并运行在 Linux 或 macOS 上，例如在 Docker 中运行。原生 Windows 版 Open WebUI 无法使用 SSH 机器，因为连接需要 Open WebUI 端提供 Unix 套接字。
- 该机器运行 Linux（x86_64 或 aarch64）或 macOS（Apple 芯片）。
- 该机器已安装 `curl` 和 `tar`。
- 该机器可以访问互联网，以下载 uv、Python 3.12 和 Open Terminal。
- 你是 Open WebUI 管理员。

---

## 添加机器 {#add-the-machine}

### 1. 打开“机器”部分 {#1-open-the-machines-section}

按照[连接 Open Terminal](./connecting.md) 中的说明，前往**设置 > 集成**，滚动到**机器**并点击 **+**。

### 2. 输入地址 {#2-enter-the-address}

在 URL 字段中以 `ssh://user@host` 或 `ssh://user@host:port` 格式输入机器地址（端口默认为 22）。为机器填写**名称**（必填）。随后，表单会询问 Open WebUI 应如何登录。

### 3. 选择登录方式 {#3-choose-how-to-sign-in}

Open WebUI 会为该机器创建自己的 SSH 密钥，并需要将该密钥添加到对应用户的 `~/.ssh/authorized_keys`。在**登录方式**下选择一种添加方式。

| 选项 | 执行的操作 |
| :--- | :--- |
| **密码** | 输入用户的 SSH 密码。Open WebUI 登录一次，添加自己的密钥，然后丢弃密码。 |
| **私钥** | 粘贴或上传机器已接受的私钥；如果私钥设有密码短语，也一并提供。Open WebUI 使用它一次来添加自己的密钥，然后将其丢弃。 |
| **自行添加密钥** | Open WebUI 显示一条命令。以该用户身份在机器上运行命令，然后点击**继续**。 |

### 4. 选择 Open Terminal 版本 {#4-choose-an-open-terminal-version}

将**版本**留空会安装最新版本，也可以输入 `0.17.21` 等版本号以固定版本。`0.17.21` 是 Open WebUI 支持的最早版本。

将**软件包**留空，或列出要添加到机器的内容，例如 `desktop browser ffmpeg`。`desktop` 会添加桌面环境，`browser` 会添加 Chrome，二者对应[“桌面”和“浏览器”选项卡](../use-cases/web-development.md)。其他任何名称都会作为 apt 软件包安装。这需要使用能够免密运行 `sudo` 的用户。

### 5. 核对指纹并安装 {#5-check-the-fingerprint-and-install}

点击**安装**。Open WebUI 会显示机器的主机密钥指纹。将其与预期指纹进行比对，然后点击**信任并安装**。Open WebUI 会记住该指纹；如果指纹日后发生变化，将拒绝连接。

进度列表会显示安装过程。达到**就绪**状态后，机器会出现在**机器**下，并可像其他机器一样使用。Open Terminal 位于 SSH 用户主目录下的 `~/.open-webui/` 中。如果某个软件包安装失败，机器仍可正常使用，但会显示警告以及需要你在机器上自行运行的命令。

:::warning 谁可以使用
每台机器的访问者都可以运行命令，并查看 SSH 用户能够访问的所有文件。对于共享机器，请使用专用用户，并按照[连接 Open Terminal](./connecting.md#6-optional-restrict-access-to-specific-groups) 中的说明，在机器的**访问权限**部分设置可访问人员。
:::

---

## 管理机器 {#manage-the-machine}

从**机器**列表中打开机器，可以查看其 Open Terminal 版本和以下按钮。

| 按钮 | 作用 |
| :--- | :--- |
| **升级** | 安装版本字段中指定的版本。留空表示最新版本。也可用于修复损坏的安装。同时安装**软件包**中列出的内容。 |
| **安装**（位于**软件包**旁） | 在不升级的情况下，将**软件包**中列出的内容安装到机器上。 |
| **重启** | 重启机器上的 Open Terminal。 |
| **日志** | 显示 Open Terminal 日志的最新行。机器显示错误时，请先查看此处。 |

**起始目录**是终端会话开始的位置；留空时使用 SSH 用户的主目录。若要在其他位置启动，请在添加机器时或稍后编辑机器时，输入机器上已存在的绝对路径，例如 `/home/user/project`。更改该设置会在新目录中重启 Open Terminal。

**参数**用于向在机器上启动 Open Terminal 的 `open-terminal run` 命令添加选项，例如使用 `--desktop-mode host` 共享当前登录的 Linux 桌面。Open WebUI 会自行设置 `--ipc` 和 `--api-key`，并拒绝在此处使用这两个参数。保存更改会重启 Open Terminal；如果新参数导致 Open Terminal 无法启动，Open WebUI 会恢复先前的参数和起始目录，并显示错误。

若要移除机器，请将其删除并确认。Open WebUI 会从机器上卸载 Open Terminal，并丢弃自己的密钥。如果无法访问该机器，Open WebUI 会提供仍将其从 Open WebUI 中移除的选项；`~/.open-webui/` 下的文件会保留在机器上，直到你自行删除。

Open WebUI 的密钥始终保留在机器的 `~/.ssh/authorized_keys` 中。对应行以 `open-webui-` 加机器 ID 结尾。删除该行即可撤销密钥。
