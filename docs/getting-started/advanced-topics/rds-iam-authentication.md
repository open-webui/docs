---
sidebar_position: 60
title: "AWS RDS IAM Authentication"
---

# 🔐 AWS RDS IAM Authentication

:::warning

This tutorial is a community contribution and is not supported by the Open WebUI team. It serves only as a demonstration on how to customize Open WebUI for your specific use case. Want to contribute? Check out the contributing tutorial.

:::

## Overview

AWS RDS IAM Database Authentication lets you authenticate to a PostgreSQL RDS instance using short-lived IAM tokens instead of a static password. This eliminates the need to store or rotate database passwords in your environment and allows access control to be managed entirely through AWS IAM policies.

Open WebUI supports RDS IAM authentication for its main PostgreSQL database. When enabled, tokens are fetched from AWS automatically and refreshed before they expire (tokens are valid for 15 minutes).

## Prerequisites

Before enabling RDS IAM authentication in Open WebUI, complete the following steps in AWS:

### 1. Enable IAM Database Authentication on Your RDS Instance

In the AWS Console or via CLI, enable IAM authentication on your RDS PostgreSQL instance:

```bash
aws rds modify-db-instance \
  --db-instance-identifier your-db-instance \
  --enable-iam-database-authentication \
  --apply-immediately
```

### 2. Create an IAM Policy for Token Generation

Attach a policy to the IAM role your Open WebUI container runs as (e.g., an ECS task role or EC2 instance profile). Replace the resource ARN with your own:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "rds-db:connect",
      "Resource": "arn:aws:rds-db:us-east-1:123456789012:dbuser:db-ABCDEFGHIJKL01234/your_db_user"
    }
  ]
}
```

The resource ARN format is: `arn:aws:rds-db:<region>:<account-id>:dbuser:<db-resource-id>/<db-username>`

You can find your DB resource ID in the RDS console under the instance's **Configuration** tab (`DbiResourceId`).

### 3. Grant the `rds_iam` Role in PostgreSQL

Connect to your database as a superuser and grant the `rds_iam` role to the database user Open WebUI will connect as:

```sql
GRANT rds_iam TO your_db_user;
```

:::warning

This step is required. Without it, IAM tokens will be generated successfully but rejected by PostgreSQL with `password authentication failed`.

:::

### 4. Configure SSL

RDS IAM authentication requires SSL. Your database must have SSL enabled (it is on by default for RDS PostgreSQL). You will need the RDS CA bundle to verify the server certificate.

Download the appropriate bundle for your region from the [AWS RDS documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.SSL.html). For most regions, the global bundle works:

```bash
wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem -O /path/to/rds-ca-bundle.pem
```

## Configuration

### Environment Variables

When using IAM authentication, use the individual database connection variables rather than `DATABASE_URL`. The password is supplied automatically via IAM token — do not set it.

| Variable | Required | Description |
|---|:---:|---|
| `DATABASE_TYPE` | Yes | Database driver. Must be `postgresql` for RDS IAM auth. |
| `DATABASE_HOST` | Yes | Hostname of your RDS instance. |
| `DATABASE_PORT` | Yes | Database port (typically `5432`). |
| `DATABASE_NAME` | Yes | Name of the database to connect to. |
| `DATABASE_USER` | Yes | Database user with the `rds_iam` role granted. |
| `DATABASE_ENABLE_IAM_TOKEN_AUTH` | Yes | Set to `true` to enable RDS IAM authentication. |
| `DATABASE_CA_PATH` | Yes | Absolute path to the RDS CA certificate bundle (PEM file) on the container filesystem. |
| `AWS_DEFAULT_REGION` | Yes | AWS region where your RDS instance is located (e.g., `us-east-1`). |

:::info

`DATABASE_URL` does not need to be set when using IAM authentication. Open WebUI builds the connection string internally from the individual `DATABASE_*` variables.

:::

### Docker Compose Example

```yaml
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    environment:
      - DATABASE_TYPE=postgresql
      - DATABASE_HOST=your-rds-host.us-east-1.rds.amazonaws.com
      - DATABASE_PORT=5432
      - DATABASE_NAME=openwebui
      - DATABASE_USER=your_db_user
      - DATABASE_ENABLE_IAM_TOKEN_AUTH=true
      - DATABASE_CA_PATH=/app/certs/rds-ca-bundle.pem
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - /path/to/rds-ca-bundle.pem:/app/certs/rds-ca-bundle.pem:ro
```

:::tip

When running on EC2 or ECS, AWS credentials are provided automatically via the instance profile or task role — no `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` needed. The standard [boto3 credential chain](https://boto3.amazonaws.com/v1/documentation/api/latest/guide/credentials.html) applies.

:::

### Kubernetes Example

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: open-webui
spec:
  template:
    spec:
      containers:
        - name: open-webui
          env:
            - name: DATABASE_TYPE
              value: "postgresql"
            - name: DATABASE_HOST
              value: "your-rds-host.us-east-1.rds.amazonaws.com"
            - name: DATABASE_PORT
              value: "5432"
            - name: DATABASE_NAME
              value: "openwebui"
            - name: DATABASE_USER
              value: "your_db_user"
            - name: DATABASE_ENABLE_IAM_TOKEN_AUTH
              value: "true"
            - name: DATABASE_CA_PATH
              value: "/app/certs/rds-ca-bundle.pem"
            - name: AWS_DEFAULT_REGION
              value: "us-east-1"
          volumeMounts:
            - name: rds-ca
              mountPath: /app/certs
              readOnly: true
      volumes:
        - name: rds-ca
          configMap:
            name: rds-ca-bundle
```

## How Token Refresh Works

IAM tokens are valid for 15 minutes. Open WebUI automatically refreshes the token before it expires: each time a new database connection is established, the token age is checked. If it is older than 14 minutes, a new token is fetched from AWS before the connection proceeds. This refresh is transparent and requires no restarts or manual intervention.

## Troubleshooting

### `password authentication failed`

The IAM token was generated but PostgreSQL rejected it. Check that:

1. The `rds_iam` role has been granted to the database user: `GRANT rds_iam TO your_db_user;`
2. IAM database authentication is enabled on the RDS instance.
3. The IAM policy grants `rds-db:connect` for the correct resource ARN and database user.
4. The AWS region in `AWS_DEFAULT_REGION` matches the RDS instance region.

### `fe_sendauth: no password supplied`

This occurs if `DATABASE_ENABLE_IAM_TOKEN_AUTH` is not set to `true`, causing Open WebUI to attempt a connection to PostgreSQL without a password. Verify the environment variable is set correctly.

### `SSL connection is required`

RDS IAM authentication requires SSL. Ensure:

1. `DATABASE_CA_PATH` points to a valid, readable PEM file inside the container.
2. The volume mount is correct and the file is present.
3. The CA bundle is the correct one for your RDS instance's region.

### `SSL SYSCALL error: EOF detected`

This usually means the SSL certificate could not be verified. Check that `DATABASE_CA_PATH` points to the correct RDS CA bundle and that the bundle covers your region. Try the global bundle from AWS if using a region-specific one.

### Token Generation Fails / `botocore` Errors

Open WebUI uses `boto3` to generate IAM tokens. Ensure:

1. The container has access to AWS credentials (instance profile, task role, or environment variables).
2. `AWS_DEFAULT_REGION` is set to the correct region.
3. The IAM principal (role/user) has the `rds-db:connect` permission for the correct resource ARN.

You can test token generation manually:

```bash
aws rds generate-db-auth-token \
  --hostname your-rds-host.us-east-1.rds.amazonaws.com \
  --port 5432 \
  --region us-east-1 \
  --username your_db_user
```

If this command fails, the issue is with your IAM configuration, not Open WebUI.
