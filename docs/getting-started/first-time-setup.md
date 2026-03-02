# First Time Setup (Beginner Guide)

This guide is for first-time users. You do NOT need to know programming.
By the end, you will:
- chat with an AI
- (optional) chat with your own documents

## What you need
- A computer
- Open WebUI open in your browser
- (Optional) a folder with a few `.txt` or `.pdf` files

> During first use, you may be asked to create an account or sign in.
> This is normal and depends on how Open WebUI is configured.
> Just follow the on-screen steps and return to this guide afterward.

---

# Part 0 — Make sure Open WebUI has access to an AI model

Before chatting, Open WebUI must be connected to an AI model (the “AI brain”).

If you already see model names in the interface, you can skip this section.

If you do **not** see any models:
- Open WebUI is running
- but it is not connected to an AI provider yet

Most setups use one of these:
- a local model runner (for example, a local installation)
- an API key from a hosted AI provider

Once a model is connected and visible in the UI, continue below.

---

# Part A — Make sure basic chat works

## Step 1: Open Open WebUI
Open the Open WebUI page in your browser.

✅ You should see a chat screen with a message box.

If you cannot open the page:
- the app is not running yet, or
- the address (URL) is incorrect.

---

## Step 2: Choose a model
Look for a model selector (usually a dropdown or button near the chat area).

### Recommended for beginners
If you are unsure which model to choose:
- select any free or local model that is already available
- or choose the first model marked as ready or installed

This choice is only to confirm that chat works.
You can change models later without breaking anything.

✅ You should be able to select a model name.

If no models appear:
- return to **Part 0** and connect an AI provider first.

---

## Step 3: Send a test message
Type:
`Say "OK" and nothing else.`

✅ If the AI replies with `OK`, basic chat works.

---

# Part B — Optional: Chat with your own documents

This feature is sometimes called “RAG”.
You do not need to understand this term.

It simply means: Open WebUI can search your documents and use them while answering.

---

## Step 4: Create a small test folder (recommended)
On your computer, create a folder named:
`webui-test-docs`

Inside it, create a file named `hello.txt` with this text:
`My dog’s name is Luna.`

This makes testing simple and predictable.

---

## Step 5: Add the folder to Knowledge
In Open WebUI, open the **Knowledge** section (usually in the left sidebar).

In the sidebar:
- Click **Workspace**
- Then **Knowledge**
- Click **+ New Knowledge**
- Enter a name and description
- Click **Create**

Open the knowledge collection you just created.

Then:
- Click the **+** button (usually in the upper-right area)
- Choose **Upload directory**
- Select your `webui-test-docs` folder

> If the layout looks different, look for buttons labeled “Knowledge”, “New Knowledge”, or “Upload”.

IMPORTANT:
- Stay on the page until the upload finishes
- Do NOT refresh or navigate away early
- The first upload may take up to ~90 seconds, even for small folders

If nothing appears after waiting:
- Try refreshing the Knowledge page once
- If the folder upload still does not start, you can manually drag individual files into the Knowledge collection

✅ When finished, you should see your file listed in the collection.

---

## Step 6: Test that document search works
Return to chat and ask:
`What is my dog’s name? Use my documents only.`

✅ The correct answer is: `Luna`

If the answer is incorrect:
- the documents may not be indexed yet, or
- document search is not enabled in that chat session

---

# If something doesn’t work

## Problem: “I can chat, but my documents are ignored”
Try this:
- Ask a question that ONLY the document can answer
- Confirm your files appear in the Knowledge collection
- Refresh the Knowledge page after the upload completes

---

## Problem: “I uploaded files but I don’t see them”
Most common causes:
- the upload was interrupted
- the folder was empty
- the app cannot access the folder (permissions or wrong path)

---

# When asking for help

If you get stuck and decide to ask for help, you’re not doing anything wrong.
Sharing a few details upfront makes it much easier for others to help you quickly.

When opening an issue or asking for support, try to include:

- how you installed Open WebUI (for example: Docker or another method)
- the steps you followed, in your own words
- what you expected to happen
- what actually happened instead
- any relevant logs from startup or from when you uploaded documents

Even partial information is okay.
The goal is not to be perfect — just to help others understand your situation.
