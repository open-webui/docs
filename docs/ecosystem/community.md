---
title: "Open WebUI Community"
sidebar_position: 37
---

import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';

# Open WebUI Community

<ThemedImage
  alt="Open WebUI Community: posts discovered on openwebui.com, imported into an Open WebUI instance, and shared back"
  sources={{
    light: useBaseUrl('/images/banners/community-platform-light.svg'),
    dark: useBaseUrl('/images/banners/community-platform-dark.svg'),
  }}
  style={{ width: '100%', margin: '0.25rem 0 1.75rem' }}
/>

**Find what other people have built for Open WebUI, bring it into your instance, and share your own.**

[Open WebUI Community](https://openwebui.com/) is the community platform at openwebui.com. People publish model presets, prompts, Tools, Functions and chats there, review models, and compare which models get used on a public leaderboard. Any model, prompt, Tool or Function posted there can be imported into your own instance from its post.

It is a separate website, not part of the Open WebUI server. Imports, shares and stats syncs are handed between two tabs in your browser, so openwebui.com never connects to your server, and an instance on `localhost` or a private network works the same as a public one. Nothing moves between the two until someone clicks a button for it.

:::danger Listed does not mean vetted

Posts are submitted by users and are **not reviewed** for security or quality. Being featured, popular or highly rated is not an endorsement.

Tools and Functions execute **arbitrary Python on your server**. Read the code before you import, every time. See the full [Plugin Security Warning](/features/extensibility/plugin/).

:::

## What's on the site

| Page | What you'll find |
| :--- | :--- |
| **Home** | The feed of posts. Filter by Models, Prompts, Tools, Functions, Chats or Reviews, and sort by Hot, New or Top |
| **Search** | Posts, users and communities by keyword |
| **Explore** | Trending posts and a directory of communities by topic |
| **Communities** | Topic groups, named `o/<name>`, that you can join and post into |
| **Models** | A catalog of AI models with star ratings and community reviews |
| **Leaderboard** | Models ranked by the messages opted-in users have synced from their instances |
| **Profile** | Your posts, comments and saved posts |

Browsing needs no account. Getting a post, publishing one and syncing stats need you to sign in on openwebui.com. That account is separate from your account on your own instance.

### Post types

| Type | What it holds | Where it lands when imported |
| :--- | :--- | :--- |
| **Model** | A [model preset](/features/workspace/models): base model, system prompt, parameters, tags and prompt suggestions | **Workspace > Models** |
| **Prompt** | A [prompt](/features/workspace/prompts) and its slash command, with optional `{{variable}}` placeholders | **Workspace > Prompts** |
| **Tool** | A [Tool](/features/extensibility/plugin/tools): Python code the model can call | **Workspace > Tools** |
| **Function** | A [Function](/features/extensibility/plugin/functions): a Pipe, Filter, Action or Event written in Python | **Admin Panel > Functions** |
| **Chat** | A snapshot of a conversation, shared from an instance | Read on the site |
| **Review** | A star rating and written review of a model in the Models catalog | Read on the site |
| **Text** | A discussion post | Read on the site |

## Import a post into your instance

1. Sign in on openwebui.com and open the post.
2. Click **Get**.
3. Enter your Open WebUI URL, for example `http://localhost:3000`, and click **Import**.
4. Your instance opens in a new tab with the matching editor already filled in. Use a browser where you are signed in to your instance.
5. Review the item, read the code if it is a Tool or Function, and save it.

The import creates the item the same way you would by hand, so your account on the instance needs the right to create it: Functions are admin-only, and Models, Prompts and Tools follow your [workspace permissions](/features/authentication-access/rbac/permissions#1-workspace-permissions).

**Download as JSON export**, under the **Import** button, saves the post as a JSON file instead.

:::tip Your instance does not need to be public

The Open WebUI URL only has to open in your browser. The post is passed from the openwebui.com tab to your instance's tab inside the browser, so `http://localhost:3000` or an address on your private network works.

:::

For plugins, the [Community Plugins](/features/extensibility/community) guide matches goals to plugin types and lists highlighted plugins, and [Starting with Functions](/getting-started/quick-start/connect-a-provider/starting-with-functions) walks through a first import screen by screen.

## Share from your instance

Each Share button opens the matching form on openwebui.com in a new tab, with your item filled in. Nothing is published until you finish the form there and post it.

| To share | In Open WebUI | Opens on openwebui.com |
| :--- | :--- | :--- |
| A model preset | **Workspace > Models**, the model's menu > **Share** | A new Model post |
| A prompt | **Workspace > Prompts**, the prompt's menu > **Share** | A new Prompt post |
| A Tool | **Workspace > Tools**, the tool's menu > **Share** | A new Tool post |
| A Function | **Admin Panel > Functions**, the function's menu > **Share** | A new Function post |
| A chat | The chat's **Share** dialog > **Share to Open WebUI Community** | The chat upload page |

Sharing a Tool or Function publishes its full source code. Check it for API keys, internal addresses or anything else you would not post publicly. Valve values you entered in Open WebUI are stored separately and are not included.

Shared chats are snapshots with their own visibility settings. See [Sharing to Open WebUI Community](/features/chat-conversations/chat-features/chatshare#sharing-to-open-webui-community).

## Model reviews

The **Models** catalog collects star ratings and written reviews, and two links in Open WebUI lead to it:

- In the model selector, a model's menu has **Community Reviews**, which searches the catalog for that model.
- After you rate a response, the rating panel offers **Leave a public review for** that model.

Both are plain links. Nothing is sent until you write a review on the site and post it.

## Sync usage stats to the leaderboard

The [Leaderboard](https://openwebui.com/leaderboard) ranks models by the messages people have synced from their own instances. Syncing is opt-in and per user: it sends stats about your own chats only, never their text.

1. Sign in on openwebui.com, open **Leaderboard** and click **Sync Stats**.
2. Enter your Open WebUI URL and click **Sync**. Syncing needs Open WebUI v0.7.0 or later.
3. Your instance opens in a new tab with a **Sync Usage Stats** dialog that lists what is and is not shared.
4. Click **Sync** to send the stats, or **Download as JSON** to save them to a file and read them first. The site's Sync dialog also accepts that file through **Click here to upload JSON file directly**.

After the first sync, **Only sync new/updated chats** is checked, so later syncs send only chats that changed since the last one. Clear it to send every chat again.

The dialog lists the main items. The full contents of a sync are:

| Sent | Not sent |
| :--- | :--- |
| Your Open WebUI version | Message text, prompts and model responses |
| For each chat: its ID, your user ID on the instance, its created and updated times, and its tags | Chat titles |
| For each message: its ID, role, model, length in characters, token count, timestamp, and the rating and tags it was given | Uploaded files and images |
| Per-chat totals: message counts, models used, average message lengths and average response time | |

## Turn it off

Admins control the instance side with **Community Sharing** in **Admin Panel > Settings > General**, or with [`ENABLE_COMMUNITY_SHARING`](/reference/env-configuration#enable_community_sharing). It is on by default. Turning it off hides, for every user including admins:

- the **Made by Open WebUI Community** links on the Models, Prompts, Tools and Functions pages
- **Share** in the model, prompt, tool, and function menus
- **Share to Open WebUI Community** in the chat share dialog
- **Community Reviews** in the model selector and the review link after rating
- the **Sync Usage Stats** dialog

The stats export behind that dialog also refuses non-admin users while the setting is off.

## See also

- **[Community Plugins →](/features/extensibility/community)**: find a plugin by what you want to do, and import it safely.
- **[Plugin Security Warning →](/features/extensibility/plugin/)**: why every Tool and Function needs a read before you import it.
- **[Sharing chats →](/features/chat-conversations/chat-features/chatshare)**: share links, visibility settings, and sharing to the community.
- **[Evaluation →](/features/administration/evaluation)**: your instance's own model leaderboard, built from your users' ratings and kept on your instance.
