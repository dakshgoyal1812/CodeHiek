<div align="center">

# 🔍 CodeView — Interactive GitHub Repository Code Inspector & Visualizer

**Fast. Clean. Beautiful Code Previews.**  
*A sleek web application for exploring GitHub repositories, browsing source code trees, rendering Markdown documentation, and inspecting files with syntax highlighting.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://code-view-lyart.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/dakshgoyal1812/CodeHiek)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

<br/>

> **CodeView** allows users to simply paste any public GitHub repository URL to immediately browse the directory hierarchy, read formatted markdown files, and inspect highlighted code blocks with speed and elegance.

<br/>

</div>

---

## ✨ Features

- 📂 **Instant Repository Tree Inspector**: Paste any GitHub repo URL to load file and directory trees instantly.
- 🎨 **Multi-Language Syntax Highlighting**: Powered by `highlight.js` with sleek dark theme code formatting.
- 📖 **Markdown Documentation Renderer**: Formats `README.md` and docs files cleanly via `marked`.
- ⚡ **High Performance & Caching**: Employs HTTP response compression (`compression`) and rate-limiting (`express-rate-limit`) for smooth navigation.
- 🛡️ **Enterprise Security Standards**: Protected with `helmet` HTTP headers, CORS validation, and input sanitization.

---

## 🚀 Live Demo

Experience CodeView live:  
👉 **[https://code-view-lyart.vercel.app/](https://code-view-lyart.vercel.app/)**

---

## 🛠️ Tech Stack

- **Backend Runtime**: Node.js, Express.js
- **Rendering & Markdown**: `marked`, `highlight.js`
- **Security & Performance**: `helmet`, `cors`, `compression`, `express-rate-limit`, `morgan`
- **Data Source**: GitHub REST API v3 (`@octokit` / `node-fetch`)
- **Deployment**: Vercel

---

## 🗂️ Project Structure

```bash
CodeHiek/
├── public/             # Frontend UI assets, CSS stylesheets & client scripts
├── server.js           # Express web server, GitHub API handler & proxy
├── package.json        # Dependencies and start scripts
└── README.md           # Documentation
```

---

## 💻 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/dakshgoyal1812/CodeHiek.git
cd CodeHiek
```

### 2. Install dependencies
```bash
npm install
```

### 3. (Optional) Set GitHub Token
For higher API rate limits, set a GitHub token:
```bash
export GITHUB_TOKEN="your_personal_access_token"
```

### 4. Run the server
```bash
npm start
```
Open **`http://localhost:3000`** in your browser.

---

## 👨‍💻 Author

**Daksh Goyal**  
* GitHub: [@dakshgoyal1812](https://github.com/dakshgoyal1812)  
* Portfolio: [my-cv-rosy-psi.vercel.app](https://my-cv-rosy-psi.vercel.app)
