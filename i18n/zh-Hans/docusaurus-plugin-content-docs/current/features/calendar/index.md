---
sidebar_position: 2
title: "日历"
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# 日历

<ThemedImage
  alt="日历：一个月的日期方格，其中一天被单独提起"
  sources={{
    light: useBaseUrl('/images/banners/calendar-light.svg'),
    dark: useBaseUrl('/images/banners/calendar-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**安排、跟踪和管理日程，让 AI 为你进行规划。**

日历是一项内置的日程安排功能，为每位用户提供个人日历。你可以创建日程、设置重复规则、通过 API 与团队成员共享日历，还可以让 AI 模型通过自然对话自主创建和管理日程。

活跃的[自动化任务](/features/chat-conversations/chat-features/automations)会自动显示在专用的**计划任务（Scheduled Tasks）**日历中，让你在同一处统一查看手动日程和自动化工作流。

:::note
日历默认启用，但管理员可以通过 [`ENABLE_CALENDAR`](/reference/env-configuration#enable_calendar) 环境变量或管理员面板中的开关将其禁用。
:::

---

## 为什么使用日历？ {#why-calendar}

日历让模型能够与时间交互。启用后，你可以让模型提醒你某件事、安排重复任务或查看本周的日程，模型会直接完成相应操作。

### AI 驱动的日程安排 {#ai-powered-scheduling}

启用[原生函数调用](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)后，模型可以通过自然语言搜索、创建、更新和删除日历日程。只需说*“提醒我周五下午 3 点跟进设计团队”*，模型就会创建一条带提醒的日程。到达设定时间时，你会收到浮动提示、浏览器通知以及（可选的）webhook，无需手动创建日程。

### 自动化集成 {#automation-integration}

活跃的[自动化任务](/features/chat-conversations/chat-features/automations)会作为虚拟日程显示在专用的**计划任务（Scheduled Tasks）**日历中。即将运行的任务会显示下次执行时间，已运行的任务则直接链接到其生成的聊天，让你的日程和自动化工作流呈现在统一的时间线上。

### 共享日历 {#shared-calendars}

如[共享日历](#sharing-calendars)一节所述，可以通过 API 与指定用户或用户组共享日历。日历视图中没有共享控件。团队成员会在自己的日历旁看到共享给他们的日历日程。参与者及其 RSVP 状态（待回复、已接受、已拒绝、暂定）也通过 API 设置。

### 多日历管理 {#multi-calendar-organization}

使用多个日历（例如“个人”“团队会议”“值班”）并通过颜色标记来整理日程。每位用户首次访问时，系统会自动创建**个人（Personal）**和**计划任务（Scheduled Tasks）**日历。

---

## 核心功能 {#key-features}

| | |
| :--- | :--- |
| **月/周/日视图** | 完整的日历界面，支持月、周和日视图 |
| **重复日程** | 基于 RRULE 的重复规则（每天、每周、每月、自定义） |
| **智能体管理** | 模型可以自主搜索、创建、更新和删除日程 |
| **自动化任务叠加显示** | 活跃的自动化任务和历史运行记录会作为虚拟日历日程显示 |
| **日历共享** | 通过 API 与用户或用户组共享日历 |
| **位置和描述** | 为日程添加位置和富文本描述 |
| **颜色标记** | 按日历和按日程自定义颜色 |
| **RSVP / 参与者** | 通过 API 邀请用户参加日程，并设置待回复/已接受/已拒绝/暂定状态 |
| **提醒** | 按日程通过浮动提示、浏览器通知和 webhook 发出提醒 |

---

## 访问控制 {#access-control}

非管理员用户需要获得权限才能使用日历。

- **管理员**：始终可以访问日历
- **用户**：需要**功能 > 日历（Features > Calendar）**权限

没有访问权限时，打开 `/calendar` 会跳转到首页。

有关权限类别，请参阅 [RBAC 权限](/features/authentication-access/rbac/permissions#4-features-permissions)。

要授予用户访问权限：

1. 打开**管理员面板 > 用户 > 用户组（Admin Panel > Users > Groups）**
2. 编辑**默认权限（Default permissions）**或指定用户组
3. 启用**功能 > 日历（Features > Calendar）**

你也可以通过 [`USER_PERMISSIONS_FEATURES_CALENDAR`](/reference/env-configuration#user_permissions_features_calendar) 设置此默认权限。

---

## 快速上手 {#getting-started}

### 访问日历 {#access-the-calendar}

在侧边栏中打开**用户菜单 > 日历（User Menu > Calendar）**。首次访问时，系统会自动创建两个默认日历：

:::tip 快速访问
在用户菜单中按住 **Shift** 可显示固定/取消固定按钮。固定日历后，侧边栏栏轨中会出现一个快捷图标，单击即可访问。
:::

- **个人（Personal）**：用于手动日程的默认日历（蓝色，首次访问时自动创建）
- **计划任务（Scheduled Tasks）**：以只读方式叠加显示自动化计划和运行记录的虚拟日历（紫色，仅在用户拥有[自动化任务](/features/chat-conversations/chat-features/automations)访问权限时可见）

### 创建日历 {#create-a-calendar}

点击日历侧边栏中**日历（Calendars）**标题旁的小型 **+** 按钮，打开**新建日历（New Calendar）**对话框。输入名称，从预设调色板中选择颜色（蓝色、红色、绿色、琥珀色、紫色、粉色、青色、橙色），然后点击**创建（Create）**。新日历会立即出现在侧边栏中，并显示在创建或编辑日程时的日历选择器中。每个日历都归其创建者所有，并可按[共享日历](#sharing-calendars)中的说明通过 API 共享。

要重命名你的个人日历或你创建的日历，或者更改其颜色，请在侧边栏中将鼠标悬停在该日历上，点击铅笔图标（**编辑**），修改名称或颜色，然后点击**保存（Save）**。

### 创建日程 {#create-an-event}

1. 点击**新建日程（New Event）**（位于侧边栏或顶栏），或点击日历网格中的任意日期/小时单元格
2. 填写日程详细信息：
   - **标题（Title）**（必填）
   - **日历（Calendar）**：要将日程添加到哪个日历
   - **时间（When）**：日期和时间，或开启**全天（All day）**
   - **位置（Location）**（可选）
   - **重复（Repeat）**：日程的重复频率，请参阅[重复日程](#recurring-events)
   - **描述（Description）**（可选）
3. 点击**创建（Create）**

**新建日程（New Event）**会打开以今天为日期的表单，开始时间为当前时间，结束时间为一小时后。两者均取自你的本地时钟，因此即使在深夜或清晨打开表单，日期仍然是今天，而不会变成明天或昨天。通过点击网格打开表单时，会预先填入对应时段：在周视图和日视图中为你点击的小时，在月视图中为 09:00。

### 编辑或删除日程 {#edit-or-delete-an-event}

点击日历上的任意日程即可打开日程编辑器，在其中更新详细信息或删除日程。自动化生成的虚拟日程无法直接编辑；点击后会跳转到相应的自动化任务或该次运行生成的聊天。

点击重复日程的某一次实例，会打开从首次发生日期开始的整个系列。**保存（Save）**会将更改应用到每一次实例，**删除（Delete）**会删除整个系列。

---

## 日历视图 {#calendar-views}

使用顶栏中的下拉菜单切换视图：

| 视图 | 说明 |
|------|-------------|
| **月（Month）** | 完整的月份网格，日程以标签形式显示。 |
| **周（Week）** | 7 天时间网格，按小时划分时段。可垂直滚动查看一天中的各个时段。 |
| **日（Day）** | 单天时间网格，按小时划分时段，便于详细安排。 |

使用**箭头按钮**向前或向后导航，或点击**今天（Today）**跳转到当前日期。侧边栏中的迷你日历可用于快速切换日期。

---

## 重复日程 {#recurring-events}

在日程表单中设置**重复（Repeat）**，即可让日程周期性出现：**不重复（No Repeat）**（默认）、**每天（Daily）**、**周一至周五（Monday – Friday）**、**每周（Weekly）**、**每月（Monthly）**或**每年（Yearly）**。各次实例从日程自身的开始日期起算，因此每周重复的日程会落在开始日期对应的星期几，每月重复的日程会落在每月的同一天。

每次实例都按你设置的时钟时间显示，并以你的时区而非服务器时区为准。无论服务器使用 UTC 还是其他时区，09:00 的站会都显示为 09:00；夏令时开始或结束、时钟拨快或拨慢后，也仍保持在 09:00。

你的时区取自浏览器并保存在账户中，因此无需配置。如果账户没有可用的时区，其重复日程会回退到服务器时区。

### 日程最高只能按天重复 {#daily-is-as-often-as-an-event-can-repeat}

日程的重复频率不能高于每天一次。保存每小时或每十五分钟重复一次的规则时，会被拒绝并显示**重复日程的频率不能高于每天一次（Recurring events cannot repeat more often than daily）**。此检查在服务器端执行，因此同时适用于通过 API、模型和界面创建的日程。

高于每天一次的频率属于任务而非预约，应使用[自动化任务](/features/chat-conversations/chat-features/automations)，它专为按此类计划运行而设计。

在此限制引入前保存的高频日程会继续按原样运行。除非更改其重复规则，否则无法再次保存；因此，编辑此类日程的任何其他内容时，也必须同时修正重复规则。

---

## 自动化集成 {#automation-integration-1}

**计划任务（Scheduled Tasks）**日历连接了自动化任务与日历视图。它是一个**虚拟日历**，不存储在数据库中；只要用户拥有自动化任务功能的访问权限，系统就会在 API 返回响应时动态生成。

### 未来运行 {#future-runs}

对于每个采用 RRULE 计划的活跃自动化任务，日历会计算即将发生的实例，并在请求的日期范围内以你的时区将其呈现为虚拟日程。

### 历史运行 {#past-runs}

已完成的自动化任务运行会显示为历史日程。每条日程都显示自动化任务名称，并包含链接到所生成聊天（如果有）的元数据。点击历史运行日程即可打开它创建的聊天。

### 工作原理 {#how-it-works}

- 虚拟日历使用固定 ID（`__scheduled_tasks__`），不会出现在日程编辑器的日历选择器中
- 虚拟日程的 ID 以 `auto_`（未来）或 `run_`（历史）为前缀
- 无法从日历界面编辑或删除这些日程
- 点击未来运行日程会跳转到自动化任务编辑器
- 点击历史运行日程会跳转到该次运行的聊天

---

## 智能体日程管理 {#agentic-event-management}

启用[**原生函数调用**](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native)后，模型可以自主管理你的日历：

| 工具 | 功能 |
|------|-------------|
| `search_calendar_events` | 在所有可访问的日历中按文本和/或日期范围搜索日程 |
| `create_calendar_event` | 在默认日历或指定日历中创建新日程 |
| `update_calendar_event` | 更新日程的标题、时间、描述、位置，或取消日程 |
| `delete_calendar_event` | 永久删除日程 |

> **你：** 从下周一上午 9 点开始，每个工作日安排一次团队站会。
>
> **你：** 我本周的日历上有什么安排？
>
> **你：** 把明天的设计评审改到下午 3 点，并将位置设为 A 栋。

### 前提条件 {#requirements}

要在聊天中使用日历工具，必须满足以下条件：

1. 必须为模型启用**原生函数调用（Native Function Calling）**
2. 必须为模型启用**内置工具（Builtin Tools）**能力
3. 必须在模型的内置工具设置中启用**日历（Calendar）**类别（默认启用）
4. 必须全局启用 **`ENABLE_CALENDAR`**（默认启用）
5. 用户必须拥有**功能 > 日历（Features > Calendar）**权限（管理员始终通过）

所有日期时间值都会自动按照检测到的用户时区处理。

有关所有内置工具的完整详细信息，请参阅[内置工具参考](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode)。

---

## 共享日历 {#sharing-calendars}

日历使用与知识库、模型及其他资源相同的访问授权系统。

### 共享日历 {#share-a-calendar}

日历视图中没有共享控件。共享通过 API 设置：将日历的完整访问授权列表发送到 `POST /api/v1/calendars/{calendar_id}/access/update`，每项授权指定一个用户或用户组，并赋予 `read` 或 `write` 权限。

### 共享访问权限的作用 {#what-shared-access-provides}

| 权限 | 效果 |
|------------|--------|
| **读取（Read）** | 查看日历及其日程 |
| **写入（Write）** | 读取，以及在日历中创建、更新和删除日程 |

只有日历**所有者**（或管理员）可以管理访问授权并删除日历本身。

:::info 共享受权限控制
非管理员用户只能在其[共享权限](/features/authentication-access/rbac/permissions#2-sharing-permissions)允许的范围内共享日历。**日历公开共享（Calendars Public Sharing）**会向所有拥有日历权限的用户开放日历。日历绝不能共享给未登录的人。
:::

---

## 参与者与 RSVP {#attendees-and-rsvp}

日程支持参与者及 RSVP 状态跟踪：

| 状态 | 含义 |
|--------|---------|
| `pending` | 邀请已发送，尚未回复 |
| `accepted` | 参与者已确认参加 |
| `declined` | 参与者已拒绝邀请 |
| `tentative` | 参与者尚不确定 |

参与者可以通过 API 更新自己的 RSVP 状态。无论日历归谁所有，用户作为参与者加入的日程都对其可见。

---

## 提醒与通知 {#reminders--alerts}

每个日程都有一个**提醒（Reminder）**设置，用于控制在日程开始前多久发出通知。

| 选项 | 行为 |
|--------|----------|
| **无（None）** | 不发送通知 |
| **日程开始时（At time of event）** | 日程开始时发送通知 |
| **提前 5 / 10 / 15 / 30 分钟** | 提前相应分钟数发送通知 |
| **提前 1 小时** | 提前 60 分钟发送通知 |

默认为**提前 10 分钟**。

### 通知发送方式 {#how-alerts-are-delivered}

1. **浮动提示通知**：显示在 Open WebUI 界面中，包含日程标题和剩余时间。点击提示会跳转到日历。
2. **浏览器通知**：如果用户设置中启用了浏览器通知，则显示原生操作系统通知。
3. **Webhook**：如果用户在**设置 > 通知（Settings > Notifications）**中配置了 webhook URL，则发送 `calendar_alert` 负载。

服务器端通过 `meta.alerted_at` 对通知去重，因此即使跨重启和多实例部署，每个日程在每个开始时间最多触发一次通知。将日程移到新的开始时间后，其通知会重新进入待触发状态。

全局通知轮询窗口可通过 [`CALENDAR_ALERT_LOOKAHEAD_MINUTES`](/reference/env-configuration#calendar_alert_lookahead_minutes) 配置（默认：10 分钟）。

---

## 配置 {#configuration}

| 变量 | 默认值 | 说明 |
|----------|---------|-------------|
| [`ENABLE_CALENDAR`](/reference/env-configuration#enable_calendar) | `True` | 全局启用或禁用日历功能 |
| [`USER_PERMISSIONS_FEATURES_CALENDAR`](/reference/env-configuration#user_permissions_features_calendar) | `True` | 默认启用或禁用非管理员用户的日历访问权限 |
| [`USER_PERMISSIONS_CALENDAR_ALLOW_PUBLIC_SHARING`](/reference/env-configuration#user_permissions_calendar_allow_public_sharing) | `False` | 允许非管理员所有者向日历添加通配符读取/写入访问授权 |
| [`SCHEDULER_POLL_INTERVAL`](/reference/env-configuration#scheduler_poll_interval) | `10` | 调度器每次轮询之间的秒数（与自动化任务共享） |
| [`CALENDAR_ALERT_LOOKAHEAD_MINUTES`](/reference/env-configuration#calendar_alert_lookahead_minutes) | `10` | 即将开始日程的默认通知窗口，单位为分钟 |

也可以在**设置 > 通用（Settings > General）**（管理员区域）的功能部分中切换日历。

---

## 限制 {#limitations}

### 不支持外部日历同步 {#no-external-calendar-sync}

日历目前是 Open WebUI 中的独立功能，不会通过 CalDAV/iCal 与 Google 日历、Outlook 或其他外部日历服务同步。

### 计划任务日历是虚拟且只读的 {#scheduled-tasks-calendar-is-virtual-and-read-only}

计划任务日历在运行时生成，不存储在数据库中。其日程无法从日历界面编辑或删除。请改为在[自动化任务](/features/chat-conversations/chat-features/automations)页面管理底层自动化任务。

### 重复日程展开 {#recurring-event-expansion}

重复日程由服务器端在查询时展开。非常复杂的 RRULE 模式或极长的日期范围可能会增加响应时间。
