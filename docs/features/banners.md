---
sidebar_position: 13
title: "🔰 Customizable Banners"
---

Overview
--------

Open WebUI provides a feature that allows administrators to create customizable banners with persistence in the `config.json` file. These banners can feature options for content, background color (info, warning, error, or success), and dismissibility. Banners are accessible only to logged-in users, ensuring the confidentiality of sensitive information.

Configuring Banners through the Admin Panel
---------------------------------------------

To configure banners through the admin panel, follow these steps:

1. Log in to your Open WebUI instance as an administrator.
2. Navigate to the `Admin Panel` -> `Settings` -> `Interface`.
3. Locate the `Banners` option directly above the `Default Prompt Suggestions` option.
4. Click on the `+` icon to add a new banner.
5. Select the banner type and set the banner text as desired.
6. Choose whether the banner is dismissible or not.
7. Set the timestamp for the banner (optional).
8. Press `Save` at the bottom of the page to save the banner.

Configuring Banners through Environment Variables
------------------------------------------------

Alternatively, you can configure banners through environment variables. To do this, you will need to set the `WEBUI_BANNERS` environment variable with a list of dictionaries in the following format:

```json
[{"id": "string","type": "string [info, success, warning, error]","title": "string","content": "string","dismissible": False,"timestamp": 1000}]
```

For more information on configuring environment variables in Open WebUI, see [Environment Variable Configuration](https://docs.openwebui.com/getting-started/advanced-topics/env-configuration#webui_banners).

Environment Variable Description
---------------------------------

* `WEBUI_BANNERS`:
  * Type: list of dict
  * Default: `[]`
  * Description: List of banners to show to users.

Banner Options
----------------

* `id`: Unique identifier for the banner.
* `type`: Background color of the banner (info, success, warning, error).
* `title`: Title of the banner.
* `content`: Content of the banner.
* `dismissible`: Whether the banner is dismissible or not.
* `timestamp`: Timestamp for the banner (optional).

FAQ
----

* Q: Can I configure banners through the admin panel?
A: Yes, you can configure banners through the admin panel by navigating to `Admin Panel` -> `Settings` -> `Interface` and clicking on the `+` icon to add a new banner.
* Q: Can I configure banners through environment variables?
A: Yes, you can configure banners through environment variables by setting the `WEBUI_BANNERS` environment variable with a list of dictionaries.
* Q: What is the format for the `WEBUI_BANNERS` environment variable?
A: The format for the `WEBUI_BANNERS` environment variable is a list of dictionaries with the following keys: `id`, `type`, `title`, `content`, `dismissible`, and `timestamp`.
* Q: Can I make banners dismissible?
A: Yes, you can make banners dismissible by setting the `dismissible` key to `True` in the banner configuration or by toggling dismissibility for a banner within the UI.
