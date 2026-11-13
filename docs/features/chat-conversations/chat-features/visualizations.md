---
sidebar_position: 19
title: "Visualizations"
---

# Visualizations

Visualizations let a model draw interactive charts, diagrams, calculators and explainers directly in the chat.

## What You Can Do With It

- **Chart your numbers.** Paste a table or a list of figures and ask for a chart.
- **See how something works.** Ask for a diagram of a process, a system or a timeline.
- **Try numbers yourself.** Ask for a small calculator, such as a loan or unit converter, with fields you can change.
- **Learn a concept.** Ask for an interactive explainer where you move a slider and watch the result change.

## Who It Is For

Anyone who chats with a model that has Visualizations turned on. Admins and model owners turn it on per model. Use it whenever a picture or something you can click explains the answer better than plain text.

## How It Works

The model writes a small piece of HTML, SVG and JavaScript through the `render_visualization` built-in tool, and the chat shows the result under a short title. Charts can use Chart.js. A model that has the tool uses it when a visual helps more than plain text.

## Turn It On

Visualizations are off by default. Turn them on per model in **Workspace > Models > Edit**, under **Builtin Tools** > **Visualizations**. The tool needs [native function calling](/features/extensibility/plugin/tools#tool-calling-modes-default-vs-native) and the model's **Builtin Tools** capability.

## Change the Instructions

The instructions the model receives for the tool decide when and how it draws. Admins can rewrite them in **Settings > Admin > Interface > Visualization Prompt** or with [`VISUALIZATION_PROMPT_TEMPLATE`](/reference/env-configuration#visualization_prompt_template). An empty value uses the default.

## Isolation and Security

A visualization renders in an isolated frame. Two controls decide what it can do:

- [`IFRAME_CSP`](/reference/env-configuration#iframe_csp) applies to the frame like any other `srcdoc` iframe.
- Scripts run only while **iframe Sandbox Allow Scripts** is on in **Settings > Interface**. See [What a preview is allowed to do](/features/chat-conversations/chat-features/code-execution/artifacts#what-a-preview-is-allowed-to-do).

When a visualization wants to send a message to the chat, the user must confirm it first.
