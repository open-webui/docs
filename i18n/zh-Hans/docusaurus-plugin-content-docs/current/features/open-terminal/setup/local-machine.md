---
sidebar_position: 5
title: "本地机器"
---

# 添加本地机器

:::warning 实验性功能
本地机器属于实验性功能，可能发生变化。
:::

只需设置名称并点击一次，即可让 Open WebUI 在其自身所在的服务器上安装并运行 Open Terminal。随后，AI 会以运行 Open WebUI 的用户身份操作该用户的文件和工具，与在该服务器上进行[裸机安装](./installation.mdx)的效果相同。

:::warning 谁可以使用
任何有权访问本地机器的人都可以使用与 Open WebUI 进程相同的用户身份，在 Open WebUI 服务器本身上运行命令，并查看该用户能够访问的所有文件。请仅与完全信任的人员共享，并按照[连接 Open Terminal](./connecting.md#6-optional-restrict-access-to-specific-groups) 中的说明，在机器的**访问权限**部分设置可访问人员。
:::

---

## 要求 {#requirements}

- 你是 Open WebUI 管理员。
- Open WebUI 服务器运行 Linux（x86_64 或 aarch64）或 macOS（Apple 芯片）。
- 服务器已安装 `curl` 和 `tar`。
- 服务器可以访问互联网，以下载 uv、Python 3.12 和 Open Terminal。

---

## 添加机器 {#add-the-machine}

### 1. 打开“机器”部分 {#1-open-the-machines-section}

按照[连接 Open Terminal](./connecting.md) 中的说明，前往**设置 > 集成**，滚动到**机器**并点击 **+**。

### 2. 选择“本地”类型 {#2-choose-the-local-type}

点击**类型**旁的**远程**，然后选择**本地**。名称为可选项。

每个 Open WebUI 实例只能存在一台本地机器，因此添加一台后，**类型**选项便不再显示。

### 3. 选择文件夹和版本 {#3-choose-a-folder-and-a-version}

**起始目录**是终端会话开始的位置。留空则在项目文件夹中启动：如果 `/workspace` 文件夹存在，则使用该文件夹；否则，当 Open WebUI 在 Docker 中运行时，使用数据卷中的 `workspace` 文件夹，或使用 Open WebUI 的启动文件夹。若要使用其他文件夹，请输入已存在的绝对路径，例如 `/home/user/project`。

将**版本**留空会安装最新版本，也可以输入 `0.17.21` 等版本号以固定版本。`0.17.21` 是 Open WebUI 支持的最早版本。

### 4. 安装 {#4-install}

点击**安装**。进度列表会显示安装过程。达到**就绪**状态后，机器会出现在**机器**下，并可像其他机器一样使用。

Open Terminal 会安装在 Open WebUI 用户主目录下的 `~/.open-webui/` 中。在 Docker 中，它会安装在数据卷内，因此容器更新后仍会保留。

---

## 管理机器 {#manage-the-machine}

从**机器**列表中打开机器，可以更改**起始目录**，以及升级、重启或读取日志，具体说明参见 [SSH 机器](./ssh-machines.md#manage-the-machine)。更改**起始目录**会在新目录中重启 Open Terminal。**参数**的用法与 [SSH 机器](./ssh-machines.md)相同。

删除机器时，Open WebUI 会卸载 Open Terminal。起始目录中的文件会保留。
