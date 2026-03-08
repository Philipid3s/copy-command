# DevCmds Dashboard 🚀

A high-performance, interactive toolkit for modern full-stack and AI-oriented developers. Designed for speed, utility, and a premium "Midnight Terminal" aesthetic.

![Version](https://img.shields.io/badge/version-1.2.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5.3-646CFF)

## ✨ Features

### 🛠️ Interactive "Smart Copy"
Commands and prompts aren't just static text. Any item with placeholders (e.g., `<container_id>`, `[BRANCH_NAME]`) automatically generates interactive input fields. Type once, copy a fully ready-to-run command.

### 🤖 AI Prompt Library
A dedicated mode for AI-oriented development. Switch between **Terminal Mode** and **AI Prompts** to access curated, high-value prompts for refactoring, debugging, and code generation.

### 🔍 Advanced Navigation
- **Dynamic Search:** Real-time filtering across commands, descriptions, and tags.
- **Clickable Tags:** Navigate by technology or task (e.g., `#docker`, `#cleanup`, `#security`) with a single click.
- **Category Filtering:** Grouped by tool (Git, Docker, NPM, etc.) for logical organization.

### 🌙 Midnight Aesthetic
A premium dark theme with glowing neon accents, glassmorphic UI elements, and a subtle high-tech grid background.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/copy-comand.git

# Enter directory
cd copy-comand

# Install dependencies
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

---

## 📦 Deployment to GitHub Pages

This project is pre-configured for seamless GitHub Pages deployment.

### Option 1: GitHub Actions (Automated)
1. Push your code to a GitHub repository.
2. Go to **Settings > Pages**.
3. Under **Build and deployment > Source**, select **GitHub Actions**.
4. Create a file at `.github/workflows/deploy.yml` (already included in this project).
5. On every push to `main`, your site will automatically update.

### Option 2: Manual (via `gh-pages`)
1. Install the deployment tool:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Add a script to `package.json`:
   ```json
   "deploy": "gh-pages -d dist"
   ```
3. Run the deployment:
   ```bash
   npm run build && npm run deploy
   ```

---

## 🛠️ Tech Stack
- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite
- **Icons:** Lucide React
- **Styling:** Vanilla CSS (Custom Properties + Flex/Grid)
- **Deployment:** GitHub Pages Ready

## 📄 License
MIT © 2026
