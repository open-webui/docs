---
sidebar_position: 36
title: "Accessibility"
---

# Accessibility

Open WebUI can be enlarged, given stronger contrast and driven from the keyboard alone. This page covers the settings that exist for that and the behaviour you get without configuring anything.

**UI Scale**, **High Contrast Mode** and **Fade Effect for Streaming Text** are personal settings stored with your account, so they follow you to another browser or device. An administrator can choose what every account starts on with [Default Interface Settings](/features/administration/interface-defaults), and you can still change any of them for yourself afterwards.

---

## Sizing the interface

### UI Scale

**Settings > Interface**, the first row of the **UI** section.

Until you change it, the control reads **Default**. Click it to reveal a slider running from `1x` to `1.5x`, with `-` and `+` buttons on either side that step by `0.1`. Click the value to go back to **Default**.

Raising it enlarges the whole application rather than the chat text alone: the sidebar and its chat rows, dropdown menus, dialogs, the message input and the Open Terminal file browser all grow with it. `1x` is the floor, so the setting cannot make the interface smaller than normal.

### Browser text size

The default text size configured in your browser scales the interface the same way, and combines with **UI Scale**. It is the better route if you want a larger interface across every site you use, since it applies before you sign in and is not tied to your Open WebUI account.

---

## High Contrast Mode

**Settings > Interface**, in the **UI** section, off by default. The app describes it as increasing contrast for controls and input surfaces.

With it on:

- Muted and secondary text is darkened, including field placeholders, timestamps and the greyed-out [autocomplete](/features/chat-conversations/chat-features/autocomplete) suggestion in the chat input.
- The action buttons under a message and the **✕** that removes an attached file stay visible at all times, instead of appearing only while the pointer is over them.
- The highlight on the chat row you have open in the sidebar is stronger.
- In the light theme, text that shimmers while something is running, such as the label on a tool call that is still executing, is drawn as flat text instead of an animated gradient.

---

## Keyboard navigation

Stepping through the interface with `Tab` and `Shift+Tab` works everywhere, independently of the rebindable [keyboard shortcuts](/features/chat-conversations/chat-features/keyboard-shortcuts) and of the **Enable Keyboard Shortcuts** toggle. Whatever you have reached is marked with a clear outline, so you can always see where you are.

Controls that only show themselves when the pointer is over them are reachable the same way. The actions under a message (copy, edit, regenerate, rate and delete), the **✕** that removes a file you have attached and the **⋯** menu on a chat row in the sidebar all appear as soon as you reach them with `Tab`. A chat row keeps its actions visible while the menu you opened from it is still open.

A tool call block in a response opens and closes with `Enter` or `Space`, so you can read what a tool was called with and what it returned without a mouse.

A sidebar you have closed is skipped entirely: `Tab` does not step into it, so focus never lands in a panel you cannot see. On a wide window the narrow rail that takes its place stays reachable, and the **Toggle sidebar** shortcut (`Cmd+Shift+S` by default) brings the full sidebar back.

---

## Screen readers

A sidebar you have closed is hidden from screen readers as well as from `Tab`, so nothing inside it is read out while it is off screen. The sidebar itself is a navigation region named **Chat history**.

The switches in **Settings > Interface** are announced with the name of the setting they control, and the **UI Scale** slider reports its position as a multiplier, `1.2x` for example, rather than as a bare number.

---

## Reducing motion

**Fade Effect for Streaming Text**, in the **Chat** section of **Settings > Interface**, fades a response in as it arrives. It is on by default; turn it off to have the text appear without the animation.

---

## Related

- [Keyboard Shortcuts](/features/chat-conversations/chat-features/keyboard-shortcuts), for the rebindable shortcuts and the chat input triggers
- [Default Interface Settings](/features/administration/interface-defaults), for the starting values every account uses and the full list of setting keys
- [Roadmap](/roadmap), for where accessibility work is going
