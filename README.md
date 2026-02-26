# Course List Test

A Next.js web app for managing course lists.

---

## How to Run This App (Step by Step)

### Prerequisites — Install These First

1. **Install Node.js**
   - Go to https://nodejs.org
   - Download the **LTS** version (the big green button)
   - Run the installer, click "Next" through everything, done

2. **Install pnpm** (the package manager this project uses)
   - Open a terminal (search "Terminal" or "Command Prompt" in your Start menu)
   - Paste this command and press Enter:
     ```
     npm install -g pnpm
     ```
   - Wait for it to finish. That's it.

---

### Running the App

1. **Open a terminal in the project folder**
   - In VS Code: `File > Open Folder`, pick this project folder, then press `` Ctrl + ` `` to open the terminal
   - Or: open Command Prompt / Terminal and navigate to the folder:
     ```
     cd path\to\course-list-test
     ```

2. **Install dependencies** (only needed the first time, or after pulling new changes)
   ```
   pnpm install
   ```
   Wait until it finishes. You'll see a bunch of text scroll by — that's normal.

3. **Start the app**
   ```
   pnpm dev
   ```
   You should see something like:
   ```
   ▲ Next.js 16.1.6
   - Local: http://localhost:3000
   ```

4. **Open the app in your browser**
   - Go to http://localhost:3000
   - The app should be running!

5. **To stop the app**
   - Go back to the terminal and press `Ctrl + C`

---

### Quick Reference

| What you want to do       | Command          |
| ------------------------- | ---------------- |
| Install dependencies      | `pnpm install`   |
| Run in development mode   | `pnpm dev`       |
| Build for production      | `pnpm build`     |
| Run production build      | `pnpm start`     |
| Run linting               | `pnpm lint`      |

---

### Troubleshooting

- **"pnpm is not recognized"** — You need to install pnpm first (see Prerequisites step 2)
- **"node is not recognized"** — You need to install Node.js first (see Prerequisites step 1)
- **Port 3000 already in use** — Something else is using that port. Either close it, or run: `pnpm dev -- -p 3001` to use a different port
- **Blank page or errors** — Try deleting the `.next` folder and running `pnpm dev` again
