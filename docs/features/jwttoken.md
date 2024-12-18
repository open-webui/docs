---
sidebar_position: 14
title: "📎 JWT Expiration"
---

Overview
--------

Open WebUI provides a feature that allows administrators to configure the expiration time of their JWT (JSON Web Token) token. This setting is crucial for ensuring secure access to the API, as it determines how long a JWT token remains valid for.

Configuring JWT Expiration
---------------------------

To configure the JWT expiration time, follow these steps:

### Option 1: Configure through the Admin Panel

1. Log in to your Open WebUI instance as an administrator.
2. Navigate to the `Admin Panel` -> `Settings` -> `General`.
3. Locate the `JWT Expiration` option.
4. Enter the desired expiration time value.
5. Save the changes.

### Option 2: Configure through Environment Variables

Alternatively, you can configure the JWT expiration time by setting the `JWT_EXPIRES_IN` environment variable.

For more information on configuring environment variables in Open WebUI, see [Environment Variable Configuration](https://docs.openwebui.com/getting-started/advanced-topics/env-configuration#jwt_expires_in).

Generating a Secret Key for JWT Tokens
--------------------------------------

Open WebUI uses a secret key to generate JWT tokens. By default, this secret key is randomly generated on the first start of the container. However, you can override this secret key by setting the `WEBUI_SECRET_KEY` environment variable.

Environment Variable Descriptions
---------------------------------

* `JWT_EXPIRES_IN`:
  * Type: int
  * Default: -1
  * Description: Sets the JWT expiration time in seconds. A value of -1 disables expiration.
* `WEBUI_SECRET_KEY`:
  * Type: str
  * Default: t0p-s3cr3t
  * Docker Default: Randomly generated on first start
  * Description: Overrides the randomly generated string used for JSON Web Token.

Valid Time Units
-----------------

* `s`: seconds
* `m`: minutes
* `h`: hours
* `d`: days
* `w`: weeks
* `-1`: no expiration

Authentication with JWT Tokens
---------------------------------

To authenticate your API requests using your JWT token, obtain your API key from `Settings > Account > API Keys > API Key` in Open WebUI. Alternatively, you can obtain a `JWT token` from the same location.

Note: The JWT token is used for authentication purposes only and should be kept secure to prevent unauthorized access to the API.

FAQ
----

* Q: What is the default expiration time for JWT tokens in Open WebUI?
A: The default expiration time for JWT tokens in Open WebUI is -1, which disables expiration.
* Q: Can I configure the JWT expiration time using environment variables?
A: Yes, you can configure the JWT expiration time by setting the `JWT_EXPIRES_IN` environment variable.
* Q: What are the valid time units for configuring JWT expiration in Open WebUI?
A: The valid time units are `s`, `m`, `h`, `d`, `w`, or `-1` for no expiration.
* Q: How do I obtain a JWT token for authentication purposes?
A: You can obtain a JWT token from the Open WebUI API or by navigating to `Settings > Account` in the Open WebUI admin panel.
* Q: Can I override the default secret key used for JWT tokens?
A: Yes, you can override the default secret key by setting the `WEBUI_SECRET_KEY` environment variable.
