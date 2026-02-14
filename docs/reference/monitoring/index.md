---
sidebar_position: 6
title: "API Keys & Monitoring"
---

# API Keys & Monitoring Your Open WebUI 🔑🩺

This guide covers two essential topics: setting up API keys for programmatic access to Open WebUI, and monitoring your instance to ensure reliability and performance.

**Why Monitor?**

- **Ensure Uptime:**  Proactively detect outages and service disruptions.
- **Performance Insights:**  Track response times and identify potential bottlenecks.
- **Early Issue Detection:**  Catch problems before they impact users significantly.
- **Peace of Mind:**  Gain confidence that your Open WebUI instance is running smoothly.

## 🚦 Levels of Monitoring

We'll cover three levels of monitoring, progressing from basic to more comprehensive:

1. **Basic Health Check:**  Verifies if the Open WebUI service is running and responding.
2. **Model Connectivity Check:** Confirms that Open WebUI can connect to and list your configured models.
3. **Model Response Testing (Deep Health Check):**  Ensures that models can actually process requests and generate responses.

## Level 1: Basic Health Check Endpoint ✅

The simplest level of monitoring is checking the `/health` endpoint. This endpoint is publicly accessible (no authentication required) and returns a `200 OK` status code when the Open WebUI service is running correctly.

**How to Test:**

You can use `curl` or any HTTP client to check this endpoint:

```bash
   # Basic health check - no authentication needed
   curl https://your-open-webui-instance/health
```

**Expected Output:**  A successful health check will return a `200 OK` HTTP status code. The content of the response body is usually not important for a basic health check.

### Using Uptime Kuma for Basic Health Checks 🐻

[Uptime Kuma](https://github.com/louislam/uptime-kuma) is a fantastic, open-source, and easy-to-use self-hosted uptime monitoring tool. It's highly recommended for monitoring Open WebUI.

**Steps to Set Up in Uptime Kuma:**

1. **Add a New Monitor:** In your Uptime Kuma dashboard, click "Add New Monitor".
2. **Configure Monitor Settings:**
   - **Monitor Type:**  Select "HTTP(s)".
   - **Name:**  Give your monitor a descriptive name, e.g., "Open WebUI Health Check".
   - **URL:** Enter the health check endpoint URL: `http://your-open-webui-instance:8080/health` (Replace `your-open-webui-instance:8080` with your actual Open WebUI address and port).
   - **Monitoring Interval:** Set the frequency of checks (e.g., `60 seconds` for every minute).
   - **Retry Count:**  Set the number of retries before considering the service down (e.g., `3` retries).

**What This Check Verifies:**

- **Web Server Availability:**  Ensures the web server (e.g., Nginx, Uvicorn) is responding to requests.
- **Application Running:**  Confirms that the Open WebUI application itself is running and initialized.
- **Basic Database Connectivity:**  Typically includes a basic check to ensure the application can connect to the database.

## Level 2: Open WebUI Model Connectivity 🔗

To go beyond basic availability, you can monitor the `/api/models` endpoint. This endpoint **requires authentication** and verifies that Open WebUI can successfully communicate with your configured model providers (e.g., Ollama, OpenAI) and retrieve a list of available models.

**Why Monitor Model Connectivity?**

- **Model Provider Issues:** Detect problems with your model provider services (e.g., API outages, authentication failures).
- **Configuration Errors:**  Identify misconfigurations in your model provider settings within Open WebUI.
- **Ensure Model Availability:**  Confirm that the models you expect to be available are actually accessible to Open WebUI.

**API Endpoint Details:**

See the [Open WebUI API documentation](https://docs.openwebui.com/reference/api-endpoints/#-retrieve-all-models) for full details about the `/api/models` endpoint and its response structure.

**How to Test with `curl` (Authenticated):**

You'll need an API key to access this endpoint. See the "Authentication Setup" section below for instructions on generating an API key.

```bash
   # Authenticated model connectivity check
   curl -H "Authorization: Bearer YOUR_API_KEY" https://your-open-webui-instance/api/models
```

*(Replace `YOUR_API_KEY` with your actual API key and `your-open-webui-instance` with your Open WebUI address.)*

**Expected Output:** A successful request will return a `200 OK` status code and a JSON response containing a list of models.

### Authentication Setup for API Key 🔑

Before you can monitor the `/api/models` endpoint, you need to configure API keys in Open WebUI. **API key access now requires a two-level permission structure**: first, the global API keys feature must be enabled, and second, individual users or groups must be granted API key creation permissions.

#### Step 1: Enable API Keys Globally (Admin Required)

1. Log in to Open WebUI as an **administrator**.
2. Click on your **profile icon** in the bottom-left corner of the sidebar, then select **Admin Panel**.
3. Navigate to **Settings** > **General**.
4. Scroll down to the **Authentication** section.
5. Find the **"Enable API Keys"** toggle and **turn it ON**.
6. *(Optional)* Configure additional API key restrictions:
   - **API Key Endpoint Restrictions**: Enable this to limit which endpoints can be accessed via API keys.
   - **Allowed Endpoints**: Specify a comma-separated list of allowed endpoints (e.g., `/api/v1/models,/api/v1/chat/completions`).
7. Click **Save** at the bottom of the page.

:::info

This enables the API key feature globally but does not automatically grant users permission to create API keys. You must also configure user or group permissions in Step 2.

:::

#### Step 2: Grant API Key Permission (Admin Required)

**API key creation is disabled by default for all users, including administrators.** Admins are **not** exempt from this permission requirement—to use API keys, they must also grant themselves the permission. Administrators can grant API key permissions using one of the following methods:

##### Option A: Grant Permission via Default Permissions

This grants the API Keys permission to **all users with the "user" role**:

1. In the **Admin Panel**, navigate to **Users** > **Groups**.
2. At the bottom of the Groups page, click on **"Default permissions"** (this applies to all users with the "user" role).
3. In the modal that opens, scroll to the **Features Permissions** section.
4. Find **"API Keys"** and **toggle it ON**.
5. Click **Save**.

:::info

**Note for Administrators:** "Default permissions" only applies to accounts with the "user" role. If you are an admin and need API key access, you must use **Option B** (User Groups)—create or select a group with API Keys enabled and add yourself to that group.

:::

:::warning

Enabling API Keys for all users means any user can generate API keys that provide programmatic access to Open WebUI with their account's permissions. Consider using User Groups (Option B) for more restrictive access control.

:::

##### Option B: Grant Permission via User Groups

For more granular control, you can grant API key permissions to specific user groups only:

1. In the **Admin Panel**, navigate to **Users** > **Groups**.
2. Select the group you want to grant API key permissions to (or click the **+ button** to create a new group).
3. In the group edit modal, click on the **Permissions** tab.
4. Scroll to **Features Permissions**.
5. Find **"API Keys"** and **toggle it ON**.
6. Click **Save**.

:::tip

Create a dedicated monitoring group (e.g., "Monitoring Users") and add only the accounts that need API key access for monitoring purposes. This follows the principle of least privilege.

:::

#### Step 3: Generate an API Key (User Action)

Once global API keys are enabled and the user has been granted permission:

1. Log in to Open WebUI with a user account that has API key permissions.
2. Click on your **profile icon** in the bottom-left corner of the sidebar.
3. Select **Settings** > **Account**.
4. In the **API Keys** section, click **Generate New API Key**.
5. Give the API key a descriptive name (e.g., "Monitoring API Key").
6. **Copy the generated API key** immediately and store it securely—you won't be able to view it again.

:::warning

Treat your API key like a password! Store it securely and never share it publicly. If you suspect an API key has been compromised, delete it immediately and generate a new one.

:::

#### Recommended: Create a Dedicated Monitoring Account

For production monitoring, we recommend:

1. Create a **non-administrator user account** specifically for monitoring (e.g., "monitoring-bot").
2. Add this account to a group with API key permissions (or ensure default permissions allow API key creation).
3. Generate an API key from this account.

This approach limits the potential impact if the monitoring API key is compromised—the attacker would only have access to the permissions granted to that specific monitoring account, not administrator privileges.

#### Troubleshooting

If you don't see the API key generation option in your account settings:

- **Check global setting**: Verify that an administrator has enabled API keys globally under **Admin Panel** > **Settings** > **General** > **Enable API Keys**. See [`ENABLE_API_KEYS`](/reference/env-configuration#enable_api_keys).
- **Check your permissions**: Verify that your user account or group has been granted the "API Keys" feature permission under **Features Permissions**. See [`USER_PERMISSIONS_FEATURES_API_KEYS`](/reference/env-configuration#user_permissions_features_api_keys).

### Using Uptime Kuma for Model Connectivity Monitoring 🐻

1. **Create a New Monitor in Uptime Kuma:**
   - Monitor Type: "HTTP(s) - JSON Query".
   - Name: "Open WebUI Model Connectivity Check".
   - URL: `http://your-open-webui-instance:8080/api/models` (Replace with your URL).
   - Method: "GET".
   - Expected Status Code: `200`.

2. **Configure JSON Query (Verify Model List):**
   - **JSON Query:**  `$count(data[*])>0`
     - **Explanation:** This JSONata query checks if the `data` array in the API response (which contains the list of models) has a count greater than 0. In other words, it verifies that at least one model is returned.
   - **Expected Value:** `true` (The query should return `true` if models are listed).

3. **Add Authentication Headers:**
   - In the "Headers" section of the Uptime Kuma monitor configuration, click "Add Header".
   - **Header Name:** `Authorization`
   - **Header Value:** `Bearer YOUR_API_KEY` (Replace `YOUR_API_KEY` with the API key you generated).

4. **Set Monitoring Interval:**  Recommended interval: `300 seconds` (5 minutes) or longer, as model lists don't typically change very frequently.

**Alternative JSON Queries (Advanced):**

You can use more specific JSONata queries to check for particular models or providers. Here are some examples:

- **Check for at least one Ollama model:**  `$count(data[owned_by='ollama'])>0`
- **Check if a specific model exists (e.g., 'gpt-4o'):** `$exists(data[id='gpt-4o'])`
- **Check if multiple specific models exist (e.g., 'gpt-4o' and 'gpt-4o-mini'):** `$count(data[id in ['gpt-4o', 'gpt-4o-mini']]) = 2`

You can test and refine your JSONata queries at [jsonata.org](https://try.jsonata.org/) using a sample API response to ensure they work as expected.

## Level 3: Model Response Testing (Deep Health Check) 🤖

For the most comprehensive monitoring, you can test if models are actually capable of processing requests and generating responses. This involves sending a simple chat completion request to the `/api/chat/completions` endpoint.

**Why Test Model Responses?**

- **End-to-End Verification:**  Confirms that the entire model pipeline is working, from API request to model response.
- **Model Loading Issues:**  Detects problems with specific models failing to load or respond.
- **Backend Processing Errors:**  Catches errors in the backend logic that might prevent models from generating completions.

**How to Test with `curl` (Authenticated POST Request):**

This test requires an API key and sends a POST request with a simple message to the chat completions endpoint.

```bash

# Test model response - authenticated POST request
curl -X POST https://your-open-webui-instance/api/chat/completions \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Respond with the word HEALTHY"}],
    "model": "llama3.1",  # Replace with a model you expect to be available
    "temperature": 0      # Set temperature to 0 for consistent responses
  }'
```

*(Replace `YOUR_API_KEY`, `your-open-webui-instance`, and `llama3.1` with your actual values.)*

**Expected Output:** A successful request will return a `200 OK` status code and a JSON response containing a chat completion. You can verify that the response includes the word "HEALTHY" (or a similar expected response based on your prompt).

**Setting up Level 3 Monitoring in Uptime Kuma would involve configuring an HTTP(s) monitor with a POST request, JSON body, authentication headers, and potentially JSON query to validate the response content. This is a more advanced setup and can be customized based on your specific needs.**

By implementing these monitoring levels, you can proactively ensure the health, reliability, and performance of your Open WebUI instance, providing a consistently positive experience for users.
