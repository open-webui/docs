---
title: OpenAPI tool servers
sidebar_position: 9
---

# OpenAPI tool servers

An OpenAPI tool server lets an agent call operations described by an external HTTP API. This is useful for a service with a clear contract; it is not a generic way to hand an agent a broad administrative credential.

## Use this when

You want an agent to call a reviewed API with a documented specification and a scoped credential.

## Before you start

- Review the specification URL and the operations it exposes.
- Create the least-privileged bearer credential or custom header the API supports.
- Identify one safe read-only operation for the first test.

## Do it

1. In **Settings → Admin → Tool Servers**, add the OpenAPI server, specification URL, and its authentication/custom headers.
2. Verify the server and inspect the operations Computer discovers.
3. Enable it in one chat and request only the identified read-only operation.

## Verify it worked

The expected operations appear during verification and the read-only request returns the expected result without changing the external service.

## If it did not

Disable the server, correct the specification URL or authentication, and retest. Revoke/rotate the credential if it may have been sent to an untrusted endpoint. Do not enable write operations until the read-only path is understood.

## Trust boundary

OpenAPI calls leave the host with the headers and credentials you configure. An API action can mutate another system even when the Computer workspace remains unchanged.
