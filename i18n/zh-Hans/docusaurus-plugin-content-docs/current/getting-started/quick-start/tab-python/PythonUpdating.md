# 使用 Python 更新 {#updating-with-python}

要使用 `pip` 将本地安装的 **Open-WebUI** 包更新到最新版本，只需执行以下简单步骤：

```bash
pip install -U open-webui
```

`-U`（或 `--upgrade`）参数可确保 `pip` 将软件包升级到最新的可用版本。

升级后，重启服务器并确认其正常启动：

```bash
open-webui serve
```

:::warning 多个工作进程
每个进程都会在启动时运行迁移。如果 `UVICORN_WORKERS` 的设置值大于 `1`，请先使用 `UVICORN_WORKERS=1` 启动新版本，等待迁移完成，然后重启。不建议运行多个工作进程；请改用[副本](/getting-started/advanced-topics/scaling#step-3-run-multiple-instances)进行扩展。
:::

有关版本固定、回滚和备份流程，请参阅[完整更新指南](/getting-started/updating)。
