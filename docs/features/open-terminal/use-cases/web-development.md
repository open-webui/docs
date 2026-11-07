---
sidebar_position: 3
title: "Build & Preview Websites"
---

# Build and Preview Websites

One of the most impressive things Open Terminal can do: the AI builds a website, starts a server and you **see it live in a Browser tab**, all inside Open WebUI. Then you tell it what to change and reload to see the result.

---

## How it works

1. You ask the AI to create a website (or web app, or landing page, or anything web-based)
2. The AI creates the files and starts a web server
3. Open Terminal **automatically detects** the running server
4. You open it from the **Ports** list of a [Browser tab](#the-browser-tab)
5. You ask for changes → the AI edits the files → you reload the page

This needs a terminal that supports browser sessions.

![AI checking that the status page on port 8080 responds and summarising it](/images/open-terminal-ai-web-dev.png)

---

## "Make me a landing page"

> **You:** Create a landing page for my photography business. Include a gallery, an about section, and a contact form.

The AI creates the HTML, CSS and JavaScript files, starts a web server and the page shows up in the **Ports** list. It looks professional and polished, not a skeleton wireframe.

![File browser showing the created HTML files](/images/open-terminal-ai-web-dev-files.png)

---

## "Change the colors and layout"

Once the page is live, just keep talking to iterate:

> **You:** Make the background dark and use a warmer color palette. Move the gallery above the about section.

The AI edits the CSS and HTML files. Reload the Browser tab to see the change.

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

The AI reads your code, identifies the problem, fixes it, and you verify in the Browser tab.

![AI identifying and fixing code errors](/images/open-terminal-ai-debug-fix.png)

---

## How port detection works

You don't need to do anything special for the server to show up. Behind the scenes:

1. The AI starts a web server (like `python -m http.server 3000` or any other server)
2. Open Terminal monitors for new network ports
3. When it detects the server is running, it reports the port to Open WebUI
4. The **Ports** list of the Browser tab shows it, and Open WebUI proxies the traffic through its own connection

This means **you don't need to open extra ports** or change any firewall settings. It just works.

:::tip Multiple servers
If the AI starts more than one server (say, a frontend on port 3000 and a backend API on port 5000), each one gets its own row in the **Ports** list. Open each in its own Browser tab.
:::

## The Browser tab

On terminals that support browser sessions, the **+** menu of the **Tabs** offers **Browser**. Its start page lists the **Ports** the terminal is serving; click one to load it, or type any http or https address.

The options menu (**...**) picks how pages load. **Proxy** loads them through the terminal. **Chrome** runs Chrome on the terminal, where available, and streams it to the tab as a remote view, with **Mobile view** and a quality setting. The tab remembers the last mode. A live session stops when you or the terminal loses access.

## The Desktop tab

On terminals that support it, the **+** menu also offers **Desktop**. It shows the terminal's desktop, which you use with mouse and keyboard, including paste, and a button opens it in full screen. When the terminal provides desktop audio, the speaker button (**Unmute** / **Mute**) plays its sound.

## More things to try

- **[Run code from chat →](./code-execution.md)**: the AI writes, runs, and debugs code
- **[Analyze documents & data →](./file-analysis.md)**: spreadsheets, PDFs, Word docs, emails
- **[Automate tasks →](./system-automation.md)**: file management, backups, batch operations

:::tip
Want to preview and iterate on websites from your phone? [**Open WebUI Computer**](/ecosystem/computer) gives you your whole machine in a browser tab, accessible from any device.
:::
