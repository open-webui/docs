---
sidebar_position: 8
title: "文件浏览器根目录"
---

# 文件浏览器根目录

Open Terminal 会向 Open WebUI 等客户端指明文件浏览器从哪个文件夹开始，并将哪个文件夹视为顶层。默认情况下，该目录是用户主目录，显示为 `Home`，文件浏览器会隐藏其上层的文件夹。这样可以避免非技术用户进入 `/etc` 等系统文件夹，并误以为自己访问了其他用户的文件。

## 配置根目录 {#configure-the-root}

默认值为 `home`，即使用用户的主目录并将其显示为 `Home`。

设置显式路径，可以将文件浏览器的可视根目录更改到其他位置：

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "/workspace"
}
```

Open Terminal 会解析当前用户对应的路径。对于用户主目录，第一段面包屑显示 `Home`；否则显示路径的最后一段。

对于当前用户主目录下的路径，还可以使用 `{{home}}` 或 `~`：

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "{{home}}/project"
}
```

若要完全取消根目录限制，请在终端的**环境变量**中进行以下设置：

```json
{
  "OPEN_TERMINAL_FILE_BROWSER_ROOT": "filesystem"
}
```

值为 `filesystem` 时，文件浏览器会显示完整的文件系统。

## 客户端行为 {#client-behavior}

- 在根目录打开。
- 将第一段面包屑显示为根目录的标签。
- 隐藏根目录上层的父文件夹。
- 当用户尝试向上导航时，将其限制在根目录内。
- 值为 `filesystem` 时显示完整的文件系统。

## 此功能不会做什么 {#what-this-does-not-do}

根目录决定文件浏览器显示的内容。终端命令和模型工具以终端容器的权限运行，因此请使用容器隔离、文件系统权限、Kubernetes 安全上下文、网络策略和按用户划分的存储来限制访问。
