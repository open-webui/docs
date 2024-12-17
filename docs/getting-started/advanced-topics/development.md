---
sidebar_position: 5
title: "🛠️ Development Guide"
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import { TopBanners } from "@site/src/components/TopBanners";

<TopBanners />

# 🛠️ Development Setup Guide

Welcome to the **Open WebUI Development Setup Guide!** Whether you're a novice or an experienced developer, this guide will help you set up a **local development environment** for both the frontend and backend components. Let’s dive in! 🚀

## System Requirements

- **Operating System**: Linux (or WSL on Windows) or macOS  
- **Python Version**: Python 3.11+  
- **Node.js Version**: 20.10+

## Development Methods

<Tabs groupId="dev-setup">

<TabItem value="local" label="Local Setup">

### 🐧 Local Development Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/open-webui/open-webui.git
   cd open-webui
   ```

2. **Frontend Setup**:
   - Create a `.env` file:

     ```bash
     cp -RPp .env.example .env
     ```

   - Install dependencies:

     ```bash
     npm install
     ```

   - Start the frontend server:

     ```bash
     npm run dev
     ```

     🌐 Available at: [http://localhost:5173](http://localhost:5173).

3. **Backend Setup**:
   - Navigate to the backend:

     ```bash
     cd backend
     ```

   - Use **Conda** for environment setup:

     ```bash
     conda create --name open-webui python=3.11
     conda activate open-webui
     ```

   - Install dependencies:

     ```bash
     pip install -r requirements.txt -U
     ```

   - Start the backend:

     ```bash
     sh dev.sh
     ```

     📄 API docs available at: [http://localhost:8080/docs](http://localhost:8080/docs).

</TabItem>

<TabItem value="docker" label="Docker Setup">

### 🐳 Docker-Based Development Setup

1. **Create the Docker Compose File**:

   ```yaml
   name: open-webui-dev

   services:
     frontend:
       build:
         context: .
         target: build
       command: ["npm", "run", "dev"]
       depends_on:
         - backend
       ports:
         - "3000:5173"
       extra_hosts:
         - host.docker.internal:host-gateway
       volumes:
         - ./src:/app/src

     backend:
       build:
         context: .
         target: base
       command: ["bash", "dev.sh"]
       env_file: ".env"
       environment:
         - ENV=dev
         - WEBUI_AUTH=False
       ports:
         - "8080:8080"
       extra_hosts:
         - host.docker.internal:host-gateway
       volumes:
         - ./backend:/app/backend
         - data:/app/backend/data

   volumes:
     data: {}
   ```

2. **Start the Development Containers**:

   ```bash
   docker compose -f compose-dev.yaml up --watch
   ```

3. **Stop the Containers**:

   ```bash
   docker compose -f compose-dev.yaml down
   ```

</TabItem>
<TabItem value="conda" label="Optional Conda Setup">

### Conda Environment Setup

If you prefer using **Conda** for isolation:

1. **Create and Activate the Environment**:

   ```bash
   conda create --name open-webui-dev python=3.11
   conda activate open-webui-dev
   ```

2. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

3. **Run the Servers**:
   - Frontend:

     ```bash
     npm run dev
     ```

   - Backend:

     ```bash
     sh dev.sh
     ```

</TabItem>

<TabItem value="troubleshooting" label="Troubleshooting">

## 🐛 Troubleshooting

### **FATAL ERROR: Reached Heap Limit**

If you encounter memory-related errors during the build, increase the **Node.js heap size**:

1. **Modify Dockerfile**:

   ```dockerfile
   ENV NODE_OPTIONS=--max-old-space-size=4096
   ```

2. **Allocate at least 4 GB of RAM** to Node.js.

---

### **Other Issues**

- **Port Conflicts**:  
   Ensure that no other processes are using **ports 8080 or 5173**.

- **Hot Reload Not Working**:  
   Verify that **watch mode** is enabled for both frontend and backend.

</TabItem>

</Tabs>

## Contributing to Open WebUI

### Local Workflow

1. **Commit Changes Regularly** to track progress.
2. **Sync with the Main Branch** to avoid conflicts:

   ```bash
   git pull origin main
   ```

3. **Run Tests Before Pushing**:

   ```bash
   npm run test
   ```

Happy coding! 🎉
