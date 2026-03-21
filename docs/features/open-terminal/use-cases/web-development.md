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

{/* TODO: Screenshot — Full view of Open WebUI showing a chat on the left ("Create a landing page for a bakery") and a live website preview panel on the right displaying a beautiful bakery landing page with a hero image, menu section, and contact info. */}

---

## "Make me a landing page"

> **You:** Create a landing page for my photography business. Include a gallery, an about section, and a contact form.

The AI creates the HTML, CSS, and JavaScript files, starts a web server, and the preview appears automatically. It looks professional and polished — not a skeleton wireframe.

{/* TODO: Screenshot — The preview panel showing a photography business landing page with a hero banner, grid gallery of sample images, an "About" section, and a contact form. */}

{/* TODO: Screenshot — File browser showing the created files: index.html, styles.css, script.js. */}

---

## "Change the colors and layout"

Once the page is live, just keep talking to iterate:

> **You:** Make the background dark and use a warmer color palette. Move the gallery above the about section.

The AI edits the files, and the preview updates.

{/* TODO: Screenshot — Side-by-side or before/after: the original light-themed page, then the updated dark-themed page with warm accent colors and rearranged sections. */}

> **You:** Add a logo at the top and make the contact form prettier.

{/* TODO: Screenshot — The updated page with a logo header and a redesigned contact form with styled inputs and a gradient submit button. */}

---

## "Build me something interactive"

The AI can create interactive web applications, not just static pages:

> **You:** Build a simple calculator that runs in the browser.

{/* TODO: Screenshot — Preview panel showing a working calculator web app with number buttons, operation buttons, and a display showing a calculation result. */}

> **You:** Make a habit tracker where I can check off daily habits.

{/* TODO: Screenshot — Preview panel showing a habit tracker with a weekly grid, habit names on the left, and checkmarks for completed days. */}

---

## "Help me fix my website"

Got an existing website that's broken or needs changes? Upload the files and ask:

> **You:** *(uploads HTML/CSS files via the file browser)* <br/>
> The contact form doesn't submit. Can you fix it?

The AI reads your code, identifies the problem, fixes it, and you verify in the preview.

{/* TODO: Screenshot — Chat showing the AI reading the uploaded HTML, identifying the bug ("The form action URL is pointing to a non-existent endpoint"), fixing it, and confirming the form now works. The preview shows the working form. */}

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
