---
sidebar_position: 9
title: "App Builder"
---

# 🏗️ Build a Complete Application

Describe what you want and get a working app with frontend, backend, and database.

> **You:** $App Builder <br/>
> Build me an inventory tracker. I need to add products with name, quantity, and price. Show total value and low-stock alerts.

## What the AI does

1. Designs the database schema
2. Builds a Python API (Flask) with CRUD endpoints
3. Creates a polished frontend with dashboard, charts, and search
4. Seeds it with sample data
5. Starts the server and tests every endpoint
6. The port preview shows the running app

{/* TODO: Screenshot — The port preview showing a polished dashboard: summary cards (Total Items: 156, Total Value: $24,350, Low Stock: 3), a bar chart by category, and a searchable product table. */}

{/* TODO: Screenshot — File browser showing the project structure: app.py, database.py, templates/, static/. */}

## Skill content

Copy this into **Workspace → Skills → Create**:

```markdown
---
name: app-builder
description: Builds complete web applications with frontend, backend, and database
---

## Full-Stack Application Builder

When building a web app:

1. **Clarify requirements**: What data is managed? What should the UI show?
2. **Design the database first**: Use SQLite with proper schema
3. **Build the API** with Flask or FastAPI: CRUD, search, filtering, error handling
4. **Build a polished frontend**:
   - Modern CSS (not a skeleton — make it look demo-ready)
   - Dashboard with key metrics and charts (Chart.js)
   - Responsive tables with search
   - Forms for data entry
5. **Seed with realistic sample data** so the demo looks good
6. **Start the server** and test every endpoint with curl
7. **Verify the full flow**: create, read, update, delete, search

Build something polished enough to demo, not a wireframe.
```
