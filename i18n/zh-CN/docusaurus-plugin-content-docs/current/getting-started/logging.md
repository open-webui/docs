# 日志

## 浏览器客户端日志 ##

客户端日志通常通过 [JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/API/console/log_static) `console.log()` 进行，可以通过内置的特定于浏览器的开发工具进行访问：
* Blink
  * [Chrome/Chromium](https://developer.chrome.com/docs/devtools/)
  * [Edge](https://learn.microsoft.com/zh-cn/microsoft-edge/devtools-guide-chromium/overview)
* Gecko
  * [Firefox](https://firefox-source-docs.mozilla.org/devtools-user/)
* WebKit
  * [Safari](https://developer.apple.com/safari/tools/)

## 应用程序服务器/后端日志 ##

日志记录是一个持续进行中的工作，但可以使用环境变量进行某种程度的控制。[Python 日志记录](https://docs.python.org/zh-cn/3/howto/logging.html) `log()` 和 `print()` 语句将信息发送到控制台。默认级别是 `INFO`。理想情况下，敏感数据仅在 `DEBUG` 级别时暴露。

### 日志级别 ###

支持以下[日志级别](https://docs.python.org/zh-cn/3/howto/logging.html#logging-levels)值：

| 级别       | 数值 |
| ---------- | ---- |
| `CRITICAL` | 50   |
| `ERROR`    | 40   |
| `WARNING`  | 30   |
| `INFO`     | 20   |
| `DEBUG`    | 10   |
| `NOTSET`   | 0    |

### 全局 ###

可以使用 `GLOBAL_LOG_LEVEL` 环境变量覆盖默认的全局日志级别 `INFO`。设置后，这将在 `config.py` 中将 `force` 参数设置为 *True* 执行 [basicConfig](https://docs.python.org/zh-cn/3/library/logging.html#logging.basicConfig) 语句。这会重新配置所有已附加的记录器：
> _如果指定此关键字参数为 true，则在执行由其他参数指定的配置之前，将删除和关闭附加到根记录器的任何现有处理程序。_

流使用标准输出 (`sys.stdout`)。除了所有 Open-WebUI `log()` 语句，这还会影响使用 Python 日志模块 `basicConfig` 机制的任何导入的 Python 模块，包括 [urllib](https://docs.python.org/zh-cn/3/library/urllib.html)。

例如，要将 `DEBUG` 日志级别设置为 Docker 参数，请使用：
```
--env GLOBAL_LOG_LEVEL="DEBUG"
```

### 应用程序/后端 ###

可以使用以下任何组合的变量来实现日志等级。请注意，`basicConfig` `force` 目前未使用，因此这些语句可能仅影响 Open-WebUI 日志记录，而不影响第三方模块。

| 环境变量            | 应用程序/后端                                      |
| ------------------- | -------------------------------------------------- |
| `AUDIO_LOG_LEVEL`   | 使用 faster-whisper、TTS 等进行音频转录            |
| `COMFYUI_LOG_LEVEL` | ComfyUI 集成处理                                   |
| `CONFIG_LOG_LEVEL`  | 配置处理                                           |
| `DB_LOG_LEVEL`      | 内部 Peewee 数据库                                 |
| `IMAGES_LOG_LEVEL`  | AUTOMATIC1111 稳定扩散图像生成                     |
| `LITELLM_LOG_LEVEL` | LiteLLM 代理                                       |
| `MAIN_LOG_LEVEL`    | 主日志等级                                         |
| `MODELS_LOG_LEVEL`  | LLM 模型交互、身份验证等                           |
| `OLLAMA_LOG_LEVEL`  | Ollama 后端交互                                    |
| `OPENAI_LOG_LEVEL`  | OpenAI 交互                                        |
| `RAG_LOG_LEVEL`     | 使用 Chroma/Sentence-Transformers 进行检索增强生成 |
| `WEBHOOK_LOG_LEVEL` | 认证 Webhook 扩展日志                              |
