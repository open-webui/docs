---
sidebar_position: 5
title: "自定义镜像"
---

# 自定义镜像

自定义镜像是自行构建的 Open Terminal 镜像，其中预先安装了用户所需的工具、编程语言和文件，使每个实例启动后即可工作。当启动时安装软件速度较慢或安装内容过多时，可以构建自定义镜像。

对于少量软件包变更，优先使用 `OPEN_TERMINAL_PACKAGES`、`OPEN_TERMINAL_PIP_PACKAGES` 或 `OPEN_TERMINAL_NPM_PACKAGES`。

对于较复杂的定制，请构建镜像：

```bash
git clone https://github.com/open-webui/open-terminal.git
cd open-terminal
docker build -t ghcr.io/acme/open-terminal:python-ds .
docker push ghcr.io/acme/open-terminal:python-ds
```

然后：

1. 打开终端对话框并展开**高级**。
2. 将**镜像**设置为 `ghcr.io/acme/open-terminal:python-ds`。
3. 保存。

之后启动的实例会使用新镜像。

如果编排器设置了 `TERMINALS_ALLOWED_IMAGES`，镜像必须与该允许列表匹配。
