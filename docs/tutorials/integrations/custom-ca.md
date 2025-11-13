---
sidebar_position: 14
title: "Setting up with Custom CA Store"
---

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

If you get an `[SSL: CERTIFICATE_VERIFY_FAILED]` error when trying to run OI, most likely the issue is that you are on a network which intercepts HTTPS traffic (e.g., a corporate network).

To fix this, you will need to add the new cert into OI's truststore.

**For pre-built Docker image**:

1. Mount the certificate store from your host machine into the container by passing `--volume=/etc/ssl/certs/ca-certificates.crt:/etc/ssl/certs/ca-certificates.crt:ro` as a command-line option to `docker run`
2. Force python to use the system truststore by setting `REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt` (see https://docs.docker.com/reference/cli/docker/container/run/#env)

If the environment variable `REQUESTS_CA_BUNDLE` does not work try to set `SSL_CERT_FILE` (as per the [httpx documentation](https://www.python-httpx.org/environment_variables/#ssl_cert_file)) instead with the same value.

Example `compose.yaml` from [@KizzyCode](https://github.com/open-webui/open-webui/issues/1398#issuecomment-2258463210):

```yaml
services:
  openwebui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - /var/containers/openwebui:/app/backend/data:rw
      - /etc/containers/openwebui/compusrv.crt:/etc/ssl/certs/ca-certificates.crt:ro
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    environment:
      - WEBUI_NAME=compusrv
      - ENABLE_SIGNUP=False
      - ENABLE_COMMUNITY_SHARING=False
      - WEBUI_SESSION_COOKIE_SAME_SITE=strict
      - WEBUI_SESSION_COOKIE_SECURE=True
      - ENABLE_OLLAMA_API=False
      - REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```

The `ro` flag mounts the CA store as read-only and prevents accidental changes to your host CA store
**For local development**:

You can also add the certificates in the build process by modifying the `Dockerfile`. This is useful if you want to make changes to the UI, for instance.
Since the build happens in [multiple stages](https://docs.docker.com/build/building/multi-stage/), you have to add the cert into both

1. Frontend (`build` stage):

```dockerfile
COPY package.json package-lock.json <YourRootCert>.crt ./
ENV NODE_EXTRA_CA_CERTS=/app/<YourRootCert>.crt
RUN npm ci
```

2. Backend (`base` stage):

```dockerfile
COPY <CorporateSSL.crt> /usr/local/share/ca-certificates/
RUN update-ca-certificates
ENV PIP_CERT=/etc/ssl/certs/ca-certificates.crt \
    REQUESTS_CA_BUNDLE=/etc/ssl/certs/ca-certificates.crt
```
