---
sidebar_position: 2
title: "Calendar"
---

# 📅 Calendar

**Schedule, track, and manage events — with AI that can plan for you.**

Calendar is a built-in scheduling feature that gives every user a personal calendar. Create events, set recurring schedules, share calendars with teammates, and let AI models autonomously create and manage events through natural conversation.

Active [Automations](/features/chat-conversations/chat-features/automations) are automatically surfaced on a dedicated **Scheduled Tasks** calendar, so you get a unified view of both manual events and automated workflows in one place.

:::note
Calendar is enabled by default but can be disabled by an administrator via the [`ENABLE_CALENDAR`](/reference/env-configuration#enable_calendar) environment variable or the Admin Panel toggle.
:::

---

## Why Calendar?

### AI-powered scheduling

With [native function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models can search, create, update, and delete calendar events through natural language. Say *"Schedule a standup every weekday at 9am"* and the model handles it.

### Automation integration

Active automations with RRULE schedules appear as virtual events on your **Scheduled Tasks** calendar. Past automation runs are shown as completed events with links to the generated chats.

### Shared calendars

Share calendars with specific users or groups via access grants. Team members see shared events alongside their own.

### Multi-calendar organization

Organize events across multiple calendars (e.g., "Personal", "Team Meetings") with color coding. Each user gets **Personal** and **Scheduled Tasks** calendars created automatically on first access.

---

## Key Features

| | |
| :--- | :--- |
| 📅 **Month/Week/Day views** | Full calendar UI with month, week, and day views |
| 🔁 **Recurring events** | RRULE-based recurrence (daily, weekly, monthly, custom) |
| 🤖 **Agentic management** | Models can search, create, update, and delete events autonomously |
| ⚡ **Automation overlay** | Active automations and past runs surface as virtual calendar events |
| 👥 **Calendar sharing** | Share calendars with users or groups via access grants |
| 📍 **Location & description** | Attach locations and rich descriptions to events |
| 🎨 **Color coding** | Per-calendar and per-event color customization |
| ✅ **RSVP / Attendees** | Invite users to events with pending/accepted/declined/tentative status |
| 🔔 **Reminders** | Per-event alerts via toast, browser notification, and webhook |

---

## Access Control

Calendar is permission-gated for non-admin users.

- **Admins**: always have access to Calendar
- **Users**: require the **Features > Calendar** permission

See [RBAC Permissions](/features/authentication-access/rbac/permissions#4-features-permissions) for the permission category.

To grant user access:

1. Open **Admin Panel > Users > Groups**
2. Edit **Default permissions** or a specific group
3. Enable **Features > Calendar**

You can also set this default via [`USER_PERMISSIONS_FEATURES_CALENDAR`](/reference/env-configuration#user_permissions_features_calendar).

---

## Getting Started

### Access the Calendar

Open **User Menu > Calendar** from the sidebar. On first visit, two default calendars are created automatically:

:::tip Quick Access
Hold **Shift** in the User Menu to reveal pin/unpin buttons. Pinning Calendar adds a shortcut icon to the sidebar rail for one-click access.
:::

- **Personal** — your default calendar for manual events (blue, auto-created on first visit)
- **Scheduled Tasks** — virtual read-only overlay of automation schedules and runs (purple, only visible when the user has [Automations](/features/chat-conversations/chat-features/automations) access)

### Create an Event

1. Click **New Event** (sidebar or top bar) or click any day/hour cell on the calendar grid
2. Fill in the event details:
   - **Title** (required)
   - **Calendar** — which calendar to add the event to
   - **When** — date and time, or toggle **All day**
   - **Location** (optional)
   - **Description** (optional)
3. Click **Create**

### Edit or Delete an Event

Click any event on the calendar to open the event editor. From there you can update details or delete the event. Automation-generated virtual events cannot be edited directly — clicking them navigates to the automation or the run's chat.

---

## Calendar Views

Switch between views using the dropdown in the top bar:

| View | Description |
|------|-------------|
| **Month** | Full month grid with event chips. Events that overflow show a "+N more" link to the day view. |
| **Week** | 7-day time grid with hourly slots. Scroll vertically through the day. |
| **Day** | Single-day time grid with hourly slots for detailed scheduling. |

Use the **arrow buttons** to navigate forward/backward, or click **Today** to jump to the current date. The mini calendar in the sidebar provides quick date navigation.

---

## Automation Integration

The **Scheduled Tasks** calendar bridges the gap between automations and the calendar view. It is a **virtual calendar** — not stored in the database — that is synthesized at API response time whenever the user has access to the Automations feature.

### Future runs

For each active automation with an RRULE schedule, the calendar computes upcoming occurrences and renders them as virtual events in the requested date range.

### Past runs

Completed automation runs appear as historical events. Each shows the automation name and includes metadata linking to the generated chat (if available). Click a past run event to open the chat it created.

### How it works

- The virtual calendar uses a constant ID (`__scheduled_tasks__`) and is excluded from the event editor's calendar picker
- Virtual events have IDs prefixed with `auto_` (future) or `run_` (past)
- They cannot be edited or deleted from the calendar UI
- Clicking a future run event navigates to the automation editor
- Clicking a past run event navigates to the run's chat

---

## Agentic Event Management

With [**native function calling**](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) enabled, models can manage your calendar autonomously:

| Tool | What it does |
|------|-------------|
| `search_calendar_events` | Search events by text and/or date range across all accessible calendars |
| `create_calendar_event` | Create a new event on the default or specified calendar |
| `update_calendar_event` | Update an event's title, time, description, location, or cancel it |
| `delete_calendar_event` | Delete an event permanently |

> **You:** Schedule a team standup every weekday at 9am starting next Monday.
>
> **You:** What do I have on my calendar this week?
>
> **You:** Move tomorrow's design review to 3pm and add Building A as the location.

### Requirements

For chat-based calendar tools to be available:

1. **Native Function Calling** must be enabled for the model
2. **Builtin Tools** capability must be enabled for the model
3. **Calendar** category must be enabled in the model's Builtin Tools settings (enabled by default)
4. **`ENABLE_CALENDAR`** must be enabled globally (enabled by default)
5. The user must have the **Features > Calendar** permission (admins always pass)

All datetime values are automatically handled in the user's detected timezone.

See the [Builtin Tools reference](/features/extensibility/plugin/tools#built-in-system-tools-nativeagentic-mode) for full details on all builtin tools.

---

## Sharing Calendars

Calendars support the same access grant system used by knowledge bases, models, and other resources.

### Share a calendar

1. Open the calendar's **settings** (via the calendar list or edit endpoint)
2. Add access grants for specific users or groups with `read` or `write` permission

### What shared access provides

| Permission | Effect |
|------------|--------|
| **Read** | See the calendar and its events |
| **Write** | Read + create, update, and delete events on the calendar |

Only the calendar **owner** (or an admin) can manage access grants and delete the calendar itself.

---

## Attendees and RSVP

Events support attendees with RSVP tracking:

| Status | Meaning |
|--------|---------|
| `pending` | Invitation sent, no response yet |
| `accepted` | Attendee confirmed attendance |
| `declined` | Attendee declined |
| `tentative` | Attendee is uncertain |

Attendees can update their own RSVP status via the API. Events where a user is an attendee are visible regardless of calendar ownership.

---

## Reminders & Alerts

Each event has a **Reminder** setting that controls when an alert fires before the event starts.

| Option | Behavior |
|--------|----------|
| **None** | No alert |
| **At time of event** | Alert when the event starts |
| **5 / 10 / 15 / 30 minutes before** | Alert that many minutes ahead |
| **1 hour before** | Alert 60 minutes ahead |

The default is **10 minutes before**.

### How alerts are delivered

1. **Toast notification** — appears in the Open WebUI UI with the event title and time remaining. Clicking the toast navigates to the Calendar.
2. **Browser notification** — if browser notifications are enabled in user settings, a native OS notification is shown.
3. **Webhook** — if the user has a webhook URL configured in **Settings > Notifications**, a `calendar_alert` payload is sent.

Alerts are de-duplicated server-side via `meta.alerted_at`, so each event fires at most once per start time — even across restarts and multi-instance deployments.

The global alert polling window is configurable via [`CALENDAR_ALERT_LOOKAHEAD_MINUTES`](/reference/env-configuration#calendar_alert_lookahead_minutes) (default: 10 minutes).

---

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| [`ENABLE_CALENDAR`](/reference/env-configuration#enable_calendar) | `True` | Enable or disable the Calendar feature globally |
| [`USER_PERMISSIONS_FEATURES_CALENDAR`](/reference/env-configuration#user_permissions_features_calendar) | `True` | Enable or disable Calendar access for non-admin users by default |
| [`SCHEDULER_POLL_INTERVAL`](/reference/env-configuration#scheduler_poll_interval) | `10` | Seconds between scheduler ticks (shared with automations) |
| [`CALENDAR_ALERT_LOOKAHEAD_MINUTES`](/reference/env-configuration#calendar_alert_lookahead_minutes) | `10` | Default alert window in minutes for upcoming events |

Calendar can also be toggled from **Admin Panel > Settings > General** under the Features section.

---

## Limitations

### No external calendar sync

Calendar is currently a standalone feature within Open WebUI. It does not sync with Google Calendar, Outlook, or other external calendar services via CalDAV/iCal.

### Scheduled Tasks calendar is virtual and read-only

The Scheduled Tasks calendar is generated at runtime and is not stored in the database. Its events cannot be edited or deleted from the calendar UI. Manage the underlying automations from the [Automations](/features/chat-conversations/chat-features/automations) page instead.

### Recurring event expansion

Recurring events are expanded server-side at query time. Very complex RRULE patterns or extremely long date ranges may increase response time.
