---
sidebar_position: 3
title: "Build & Preview Websites"
---

# Build and Preview Websites

One of the most impressive things Open Terminal can do: the AI builds a website, starts a server, and you **see it live in a preview panel** — all inside Open WebUI. Then you tell it what to change, and the preview updates in real time.

---

## How it works

1. You ask the AI to create a website (or web app, or landing page, or anything web-based)
2. The AI creates the files and starts a web server
3. Open Terminal **automatically detects** the running server
4. A **preview panel** appears in Open WebUI showing the live page
5. You ask for changes → the AI edits the files → the preview updates

![AI creating a landing page with file browser showing the created files](/images/open-terminal-ai-web-dev.png)

---

## "Make me a landing page"

> **You:** Create a landing page for my photography business. Include a gallery, an about section, and a contact form.

The AI creates the HTML, CSS, and JavaScript files, starts a web server, and the preview appears automatically. It looks professional and polished — not a skeleton wireframe.

![File browser showing the created HTML files](/images/open-terminal-ai-web-dev-files.png)

---

## "Change the colors and layout"

Once the page is live, just keep talking to iterate:

> **You:** Make the background dark and use a warmer color palette. Move the gallery above the about section.

The AI edits the files, and the preview updates.

The AI edits the CSS and HTML files, and the preview updates instantly.

---

## "Build me something interactive"

The AI can create interactive web applications, not just static pages:

> **You:** Build a simple calculator that runs in the browser.

![AI creating and running code for interactive applications](/images/open-terminal-ai-code-execution.png)

---

## "Help me fix my website"

Got an existing website that's broken or needs changes? Upload the files and ask:

> **You:** *(uploads HTML/CSS files via the file browser)* <br/>
> The contact form doesn't submit. Can you fix it?

The AI reads your code, identifies the problem, fixes it, and you verify in the preview.

![AI identifying and fixing code errors](/images/open-terminal-ai-debug-fix.png)

---

## How port detection works

You don't need to do anything special for the preview to appear. Behind the scenes:

1. The AI starts a web server (like `python -m http.server 3000` or any other server)
2. Open Terminal monitors for new network ports
3. When it detects the server is running, it reports the port to Open WebUI
4. Open WebUI displays the preview panel, proxying the traffic through its own connection

This means **you don't need to open extra ports** or change any firewall settings. It just works.

:::tip Multiple previews
If the AI starts more than one server (say, a frontend on port 3000 and a backend API on port 5000), you can switch between them in the ports section.
:::

## More things to try

- **[Run code from chat →](./code-execution)** — the AI writes, runs, and debugs code
- **[Analyze documents & data →](./file-analysis)** — spreadsheets, PDFs, Word docs, emails
- **[Automate tasks →](./system-automation)** — file management, backups, batch operations
