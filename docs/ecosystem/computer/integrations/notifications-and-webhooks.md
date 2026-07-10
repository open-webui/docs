---
title: Notifications and webhooks
sidebar_position: 5
---

# Notifications and webhooks

Notifications tell you that a trusted chat or automation completed or failed. A webhook trigger starts a known automation. They help you leave the browser without losing awareness; they do not make unattended work safer.

## Use this when

You need a browser, webhook, or bot target to report a finished/failed run, or a private system to trigger an existing automation.

## Before you start

- Create and manually validate the automation or chat path first.
- Use a notification endpoint you control and understand.

## Do it

1. In **Settings → Notifications**, create the target and select its events.
2. Use the target's test action and confirm delivery.
3. If an automation needs an inbound trigger, generate its webhook URL and store it as a secret in the calling system.

## Verify it worked

The target test arrives with the expected event. A manual automation run produces its selected completion/failure notification; an authorized webhook invocation creates only the intended automation run.

## If it did not

Re-test the endpoint, inspect its configured event selection, and check the destination's own delivery log. Revoke and regenerate a trigger URL that was exposed or sent to the wrong system.

## Trust boundary

A webhook URL is an authentication secret for running the associated high-trust automation. Do not put it in a public client, source repository, ticket, or chat transcript.
