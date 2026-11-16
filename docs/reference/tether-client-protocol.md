---
title: "Tether Client Protocol"
---

# Tether Client Protocol

This reference covers native-client sign-in and the Tether connection handshake. For installing the desktop app and using your computer from chat, see [Open WebUI Tether](/ecosystem/tether).

Each signed-in app has a separate renewable session. Signing out or deleting the session revokes it. Unused sessions expire after [`SESSION_EXPIRES_IN`](/reference/env-configuration#session_expires_in) (default `90d`). Access tokens last 15 minutes; refreshing replaces the refresh token.

## Session API

These endpoints are for developers of native clients. `requests`, `exchange` and `refresh` need no sign-in; every other endpoint needs the bearer token of a signed-in user. Calls to create, requests, exchange, refresh and authorize are limited to 30 per minute per IP address.

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/auths/sessions/requests` | Starts a browser sign-in. Send the app `name`, a loopback `redirect_uri` such as `http://127.0.0.1:<port>/callback` (host `127.0.0.1`, explicit port, no query or fragment), a `state` of 32 to 256 URL-safe characters and a PKCE `code_challenge` (S256, 43 characters). The request is valid for 10 minutes. Returns the `session_id` to open at `/auth/sessions/<id>`. |
| `GET` | `/api/v1/auths/sessions/{id}/request` | Returns the name and expiry of a waiting request. |
| `POST` | `/api/v1/auths/sessions/{id}/authorize` | Approves the request as the signed-in user and returns the callback address with a one-time `code` that is valid for 60 seconds. The `/auth/sessions/<id>` page calls it. |
| `POST` | `/api/v1/auths/sessions/exchange` | Trades the `session_id`, `code`, `redirect_uri` and `code_verifier` for an access token and a refresh token. |
| `POST` | `/api/v1/auths/sessions/refresh` | Trades a refresh token for new tokens. Send an optional `request_id` to recover the new tokens when the response was lost: repeating the call with the same `request_id` returns them again. |
| `POST` | `/api/v1/auths/sessions` | Creates a session directly from an already signed-in request. |
| `GET` | `/api/v1/auths/sessions` | Lists your sessions. |
| `DELETE` | `/api/v1/auths/sessions/{id}` | Revokes one of your sessions. |

### Connection

A client connects to the websocket `/api/v1/tether/connect` and sends a `hello` message with `version` (`1` or `2`), the access `token` of a session, a `connection_id`, a `name` and a list of `services`. Setting `notifications` to `true` opts the connection in to notifications. The server answers with `ready`.
