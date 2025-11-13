---
sidebar_position: 1
title: "Local Development Guide"
---

# Ready to Contribute to Open WebUI? Let's Get Started! 🚀

Excited to dive into Open WebUI development? This comprehensive guide will walk you through setting up your **local development environment** quickly and easily. Whether you're a seasoned developer or just starting out, we'll get you ready to tweak the frontend, enhance the backend, and contribute to the future of Open WebUI! Let's get your development environment up and running in simple, detailed steps!

## Prerequisites

Before you begin, ensure your system meets these minimum requirements:

- **Operating System:** Linux (or WSL on Windows), Windows 11, or macOS. *(Recommended for best compatibility)*
- **Python:** Version **3.11 or higher**. *(Required for backend services)*
- **Node.js:** Version **22.10 or higher**. *(Required for frontend development)*
- **IDE (Recommended):** We recommend using an IDE like [VS Code](https://code.visualstudio.com/) for code editing, debugging, and integrated terminal access. Feel free to use your favorite IDE if you have one!
- **[Optional] GitHub Desktop:** For easier management of the Git repository, especially if you are less familiar with command-line Git, consider installing [GitHub Desktop](https://desktop.github.com/).

## Setting Up Your Local Environment

We'll set up both the frontend (user interface) and backend (API and server logic) of Open WebUI.

### 1. Clone the Repository

First, use `git clone` to download the Open WebUI repository to your local machine. This will create a local copy of the project on your computer.

1. **Open your terminal** (or Git Bash if you're on Windows and using Git Bash).
2. **Navigate to the directory** where you want to store the Open WebUI project.
3. **Clone the repository:** Run the following command:

```bash
git clone https://github.com/open-webui/open-webui.git
cd open-webui
```

   The `git clone` command downloads the project files from GitHub. The `cd open-webui` command then navigates you into the newly created project directory.

### 2. Frontend Setup (User Interface)

Let's get the user interface (what you see in your browser) up and running first:

1. **Configure Environment Variables:**
   - Copy the example environment file to `.env`:

     ```bash
     cp -RPp .env.example .env
     ```

     This command copies the `.env.example` file to a new file named `.env`. The `.env` file is where you'll configure environment variables for the frontend.

   - **Customize `.env`**: Open the `.env` file in your code editor (like VS Code). This file contains configuration variables for the frontend, such as API endpoints and other settings. For local development, the default settings in `.env.example` are usually sufficient to start with. However, you can customize them if needed.

  **Important:** Do not commit sensitive information to `.env` if you are contributing back to the repository.

1. **Install Frontend Dependencies:**
   - **Navigate to the frontend directory:** If you're not already in the project root (`open-webui` directory), ensure you are there.

     ```bash
     # If you are not in the project root, run:
     cd open-webui
     ```

   - Install the required JavaScript packages:

     ```bash
     npm install
     ```

     This will install all frontend dependencies listed in `package.json`.

     *Note: Depending on your Open WebUI version, you might see compatibility warnings or errors. If so, just run:*

     ```bash
     npm install --force
     ```

     *Some setups need this to get around version issues.*

2. **Start the Frontend Development Server:**

     ```bash
     npm run dev
     ```

     This command launches the frontend development server. If the steps were followed successfully, it will usually indicate the server is running and provide a local URL.

     🎉 **Access the Frontend:** Open your web browser and go to [http://localhost:5173](http://localhost:5173). You should see a message indicating that Open WebUI's frontend is running and is waiting for the backend to be available. Don't worry about that message yet! Let's set up the backend next. **Keep this terminal running** – it's serving your frontend!

### 2.5: Build the Frontend (Recommended)

Once you’ve verified that the frontend development server (`npm run dev`) is running correctly and you can see Open WebUI at [http://localhost:5173](http://localhost:5173), it's a **good practice to also build the frontend assets**. This step simulates the production environment and can help catch build-time errors that don't show up during development.

**In the same frontend terminal:**

```bash
npm run build
```

- This command generates an optimized, production-ready build of the frontend and places the static files in the `build` directory.
- If the build completes successfully (without errors), you're ready! If there are errors, address them before proceeding.
- You don't need to do anything more with `build` for local development, but building ensures your code will not break in production or during deployment.

### 3. Backend Setup (API and Server)

We **require** you to use separate terminal instances for your frontend and backend processes. This keeps your workflows organized and makes it easier to manage each part of the application independently.

**Using VS Code Integrated Terminals:**

VS Code's integrated terminal feature makes managing multiple terminals incredibly easy. Here's how to leverage it for frontend and backend separation:

1. **Frontend Terminal (You likely already have this):** If you followed the Frontend Setup steps, you probably already have a terminal open in VS Code at the project root (`open-webui` directory). This is where you'll run your frontend commands (`npm run dev`, etc.). Ensure you are in the `open-webui` directory for the next steps if you are not already.

2. **Backend Terminal (Open a New One):**
   - In VS Code, go to **Terminal > New Terminal** (or use the shortcut `Ctrl+Shift+` on Windows/Linux or `Cmd+Shift+` on macOS). This will open a new integrated terminal panel.
   - **Navigate to the `backend` directory:** In this *new* terminal, use the `cd backend` command to change the directory to the `backend` folder within your project. This ensures all backend-related commands are executed in the correct context.

   Now you have **two separate terminal instances within VS Code**: one for the frontend (likely in the `open-webui` directory) and one specifically for the backend (inside the `backend` directory). You can easily switch between these terminals within VS Code to manage your frontend and backend processes independently. This setup is highly recommended for a cleaner and more efficient development workflow.

**Backend Setup Steps (in your *backend* terminal):**

1. **Navigate to the Backend Directory:** (You should already be in the `backend` directory in your *new* terminal from the previous step). If not, run:

   ```bash
   cd backend
   ```

2. **Create and Activate a Conda Environment (Recommended):**
   - We highly recommend using Conda to manage Python dependencies and isolate your project environment. This prevents conflicts with other Python projects on your system and ensures you have the correct Python version and libraries.

     ```bash
     conda create --name open-webui python=3.11
     conda activate open-webui
     ```

     - `conda create --name open-webui python=3.11`: This command creates a new Conda environment named `open-webui` using Python version 3.11. If you chose a different Python 3.11.x version, that's fine.
     - `conda activate open-webui`: This command activates the newly created Conda environment. Once activated, your terminal prompt will usually change to indicate you are in the `open-webui` environment (e.g., it might show `(open-webui)` at the beginning of the line).

    **Make sure you activate the environment in your backend terminal before proceeding.**

     *(Using Conda is optional but strongly recommended for managing Python dependencies and avoiding conflicts.)* If you choose not to use Conda, ensure you are using Python 3.11 or higher and proceed to the next step, but be aware of potential dependency conflicts.

1. **Install Backend Dependencies:**
     - In your *backend* terminal (and with the Conda environment activated if you are using Conda), run:

     ```bash
     pip install -r requirements.txt -U
     ```

     This command uses `pip` (Python Package Installer) to read the `requirements.txt` file in the `backend` directory. `requirements.txt` lists all the Python libraries that the backend needs to run. `pip install` downloads and installs these libraries into your active Python environment (your Conda environment if you are using it, or your system-wide Python environment otherwise). The `-U` flag ensures you get the latest compatible versions of the libraries.

2. **Start the Backend Development Server:**
     - In your *backend* terminal, run:

     ```bash
     sh dev.sh
     ```

     This command executes the `dev.sh` script. This script likely contains the command to start the backend development server. *(You can open and examine the `dev.sh` file in your code editor to see the exact command being run if you are curious.)* The backend server will usually start and print some output to the terminal.

     📄 **Explore the API Documentation:** Once the backend is running, you can access the automatically generated API documentation in your web browser at [http://localhost:8080/docs](http://localhost:8080/docs). This documentation is incredibly valuable for understanding the backend API endpoints, how to interact with the backend, and what data it expects and returns. Keep this documentation handy as you develop!

🎉 **Congratulations!** If you have followed all the steps, you should now have both the frontend and backend development servers running locally. Go back to your browser tab where you accessed the frontend (usually [http://localhost:5173](http://localhost:5173)). **Refresh the page.** You should now see the full Open WebUI application running in your browser, connected to your local backend!

## Testing From Another Device (Phone, Tablet, etc.)  

Want to open your dev instance from your phone or another computer on the same Wi-Fi?  

1. Find your dev-machine’s LAN IP, e.g. `192.168.1.42`.  
2. **Frontend only (quick check):**  
   - Keep the backend on `localhost`.  
   - From your phone browse to `http://192.168.1.42:5173`.  
3. **Full stack (frontend + backend):**  
   - In `backend/dev.sh` **add your LAN address to the CORS list**, e.g.  

     ```bash
     export CORS_ALLOW_ORIGIN="http://localhost:5173;http://localhost:8080;http://192.168.1.42:5173"
     ```

   - Restart the backend (`sh dev.sh`).  
   - From your phone browse to `http://192.168.1.42:5173`.  
   - All API calls will now be allowed from that origin.  

> **Security note:** The wildcard `"*"` works too, but do **not** ship that to production.  

## Troubleshooting Common Issues

Here are solutions to some common problems you might encounter during setup or development:

### 💥 "FATAL ERROR: Reached Heap Limit" (Frontend)

This error, often seen during frontend development, indicates that Node.js is running out of memory during the build process, especially when working with large frontend applications.

**Solution:** Increase the Node.js heap size. This gives Node.js more memory to work with. You have a couple of options:

1. **Using `NODE_OPTIONS` Environment Variable (Recommended for Development):**
   - This is a temporary way to increase the memory limit for the current terminal session. Before running `npm run dev` or `npm run build` in your *frontend* terminal, set the `NODE_OPTIONS` environment variable:

     ```bash
     export NODE_OPTIONS="--max-old-space-size=4096" # For Linux/macOS (bash, zsh)
     # set NODE_OPTIONS=--max-old-space-size=4096 # For Windows (Command Prompt)
     # $env:NODE_OPTIONS="--max-old-space-size=4096" # For Windows (PowerShell)
     npm run dev
     ```

     Choose the command appropriate for your operating system and terminal. `4096` represents 4GB of memory. You can try increasing this value further if needed (e.g., `8192` for 8GB). This setting will only apply to commands run in the current terminal session.

2. **Modifying `Dockerfile` (For Dockerized Environments):**
   - If you are working with Docker, you can permanently set the `NODE_OPTIONS` environment variable within your `Dockerfile`. This is useful for consistent memory allocation in Dockerized environments, as shown in the original guide example:

     ```dockerfile
     ENV NODE_OPTIONS=--max-old-space-size=4096
     ```

   - **Allocate Sufficient RAM:** Regardless of the method, ensure your system or Docker container has enough RAM available for Node.js to use. **At least 4 GB of RAM is recommended**, and more might be needed for larger projects or complex builds. Close unnecessary applications to free up RAM.

### ⚠️ Port Conflicts (Frontend & Backend)

If you see errors related to ports, such as "Address already in use" or "Port already bound," it means another application on your system is already using port `5173` (default for frontend) or `8080` (default for backend). Only one application can use a specific port at a time.

**Solution:**

1. **Identify the Conflicting Process:** You need to find out which application is using the port you need.
   - **Linux/macOS:** Open a new terminal and use the `lsof` or `netstat` commands:
     - `lsof -i :5173` (or `:8080` for the backend port)
     - `netstat -tulnp | grep 5173` (or `8080`)
     These commands will list the process ID (PID) and the name of the process using the specified port.
   - **Windows:** Open Command Prompt or PowerShell as an administrator and use `netstat` or `Get-NetTCPConnection`:
     - `netstat -ano | findstr :5173` (or `:8080`) (Command Prompt)
     - `Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess` (PowerShell)
     These commands will also show the PID of the process using the port.

2. **Terminate the Conflicting Process:** Once you identify the process ID (PID), you can stop the application using that port. **Be careful when terminating processes, especially if you are unsure what they are.**
   - **Linux/macOS:** Use the `kill` command: `kill <PID>` (replace `<PID>` with the actual process ID). If the process doesn't terminate with `kill`, you can use `kill -9 <PID>` (force kill), but use this with caution.
   - **Windows:** Use the `taskkill` command in Command Prompt or PowerShell as administrator: `taskkill /PID <PID> /F` (replace `<PID>` with the process ID). The `/F` flag forces termination.

3. **Alternatively, Change Ports (Advanced):**
   - If you cannot terminate the conflicting process (e.g., it's a system service you need), you can configure Open WebUI to use different ports for the frontend and/or backend. This usually involves modifying configuration files.
     - **Frontend Port:** Check the frontend documentation or configuration files (often in `vite.config.js` or similar) for how to change the development server port. You might need to adjust the `.env` file as well if the frontend uses environment variables for the port.
     - **Backend Port:** Examine the `dev.sh` script or backend configuration files to see how the backend port is set. You might need to modify the startup command or a configuration file to change the backend port. If you change the backend port, you'll likely need to update the frontend's `.env` file to point to the new backend URL.

### 🔄 Hot Reload Not Working

Hot reload (or hot module replacement - HMR) is a fantastic development feature that automatically refreshes your browser when you make changes to the code. If it's not working, it can significantly slow down your development workflow.

**Troubleshooting Steps:**

1. **Verify Development Servers are Running:** Double-check that both `npm run dev` (frontend) and `sh dev.sh` (backend) are running in their respective terminals and haven't encountered any errors. Look for messages in the terminal output indicating they are running and in "watch mode" or "development mode." If there are errors, address them first.
2. **Check for Watch Mode/HMR Messages:** When the development servers start, they should usually print messages in the terminal indicating that hot reload or watch mode is enabled. Look for phrases like "HMR enabled," "watching for file changes," or similar. If you don't see these messages, there might be a configuration issue.
3. **Browser Cache:** Sometimes, your browser's cache can prevent you from seeing the latest changes, even if hot reload is working. Try a **hard refresh** in your browser:
   - **Windows/Linux:** Ctrl+Shift+R
   - **macOS:** Cmd+Shift+R
   - Alternatively, you can try clearing your browser cache or opening the frontend in a private/incognito browser window.
4. **Dependency Issues (Frontend):** Outdated or corrupted frontend dependencies can sometimes interfere with hot reloading. Try refreshing your frontend dependencies:
   - In your *frontend* terminal, run:

     ```bash
     rm -rf node_modules && npm install
     ```

     This command deletes the `node_modules` directory (where dependencies are stored) and then reinstalls them from scratch. This can resolve issues caused by corrupted or outdated packages.
5. **Backend Restart Required (For Backend Changes):** Hot reload typically works best for frontend code changes (UI, styling, components). For significant backend code changes (especially changes to server logic, API endpoints, or dependencies), you might need to **manually restart the backend server** (by stopping `sh dev.sh` in your backend terminal and running it again). Hot reload for backend changes is often less reliable or not automatically configured in many backend development setups.
6. **IDE/Editor Issues:** In rare cases, issues with your IDE or code editor might prevent file changes from being properly detected by the development servers. Try restarting your IDE or ensuring that files are being saved correctly.
7. **Configuration Problems (Advanced):** If none of the above steps work, there might be a more complex configuration issue with the frontend or backend development server setup. Consult the project's documentation, configuration files (e.g., `vite.config.js` for frontend, backend server configuration files), or seek help from the Open WebUI community or maintainers.

## Contributing to Open WebUI

We warmly welcome your contributions to Open WebUI! Your help is valuable in making this project even better. Here's a quick guide for a smooth and effective contribution workflow:

1. **Understand the Project Structure:** Take some time to familiarize yourself with the project's directory structure, especially the `frontend` and `backend` folders. Look at the code, configuration files, and documentation to get a sense of how things are organized.
2. **Start with Small Contributions:** If you are new to the project, consider starting with smaller contributions like:
   - **Documentation improvements:** Fix typos, clarify explanations, add more details to the documentation.
   - **Bug fixes:** Address reported bugs or issues.
   - **Small UI enhancements:** Improve styling, fix minor layout issues.
   These smaller contributions are a great way to get familiar with the codebase and the contribution process.
3. **Discuss Larger Changes First:** If you are planning to implement a significant new feature or make substantial changes, it's highly recommended to **discuss your ideas with the project maintainers or community first.** You can do this by:
   - **Opening an issue** on the GitHub repository to propose your feature or change.
   - **Joining the Open WebUI community channels** (if available, check the project's README or website for links) and discussing your ideas there.
   This helps ensure that your contribution aligns with the project's goals and avoids wasted effort on features that might not be merged.
4. **Create a Separate Branch for Your Work:** **Never commit directly to the `dev` branch.** Always create a new branch for each feature or bug fix you are working on. This keeps your changes isolated and makes it easier to manage and submit pull requests.
   - To create a new branch (e.g., named `my-feature-branch`) based on the `dev` branch:

     ```bash
     git checkout dev
     git pull origin dev # Ensure your local dev branch is up-to-date
     git checkout -b my-feature-branch
     ```

5. **Commit Changes Frequently and Write Clear Commit Messages:** Make small, logical commits as you develop features or fix bugs. **Write clear and concise commit messages** that explain what changes you made and why. Good commit messages make it easier to understand the history of changes and are essential for collaboration.
   - Example of a good commit message: `Fix: Corrected typo in documentation for backend setup`
   - Example of a good commit message: `Feat: Implemented user profile page with basic information display`
6. **Stay Synced with the `dev` Branch Regularly:** While working on your branch, periodically sync your branch with the latest changes from the `dev` branch to minimize merge conflicts later:

   ```bash
   git checkout dev
   git pull origin dev
   git checkout my-feature-branch
   git merge dev
   ```

   Resolve any merge conflicts that arise during the `git merge` step.
7. **Run Tests (If Available) Before Pushing:** While this guide doesn't detail specific testing procedures for Open WebUI, it's a good practice to run any available tests before pushing your code. Check the project's documentation or `package.json` (for frontend) and backend files for test-related commands (e.g., `npm run test`, `pytest`, etc.). Running tests helps ensure your changes haven't introduced regressions or broken existing functionality.
8. **Submit a Pull Request (PR):** Once you have completed your work, tested it (if applicable), and are ready to contribute your changes, submit a pull request (PR) to the `dev` branch of the Open WebUI repository on GitHub.
   - **Go to the Open WebUI repository on GitHub.**
   - **Navigate to your branch.**
   - **Click the "Contribute" or "Pull Request" button** (usually green).
   - **Fill out the PR form:**
     - **Title:** Give your PR a clear and descriptive title that summarizes your changes (e.g., "Fix: Resolved issue with login form validation").
     - **Description:** Provide a more detailed description of your changes, the problem you are solving (if applicable), and any relevant context. Link to any related issues if there are any.
   - **Submit the PR.**

   Project maintainers will review your pull request, provide feedback, and potentially merge your changes. Be responsive to feedback and be prepared to make revisions if requested.

**Thank you for reading this comprehensive guide and for your interest in contributing to Open WebUI! We're excited to see your contributions and help you become a part of the Open WebUI community!** 🎉 Happy coding!
