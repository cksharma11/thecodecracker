# LeetDSA Arena (thecodecracker)

LeetDSA Arena is a premium, fully static (client-side) Data Structures and Algorithms learning portal designed to take developers from beginners to experts. The application features **101 handpicked challenges**, detailed study roadmaps, interactive visualizers, and browser-based code compilation for JavaScript and Python.

## 🚀 Key Features

* **101 Core DSA Challenges:** Curated problems covering Arrays, Sliding Windows, Trees, Graphs, Dynamic Programming, and more, complete with company tags, examples, constraints, and complexity-annotated solutions.
* **In-Browser Code compilation & Sandboxing:**
  * **JavaScript:** Runs locally inside sandboxed frames.
  * **Python:** Loads **Pyodide WebAssembly** from a CDN to execute CPython code natively inside your browser.
  * **Watchdog Loop Protection:** Dynamic timeout limits (2.5s for JS, 15s for Python) to intercept and terminate infinite loops (e.g. `while True:`) without freezing the tab.
  * **Stdout Catcher:** Intercepts `console.log()` and `print()` streams to pipe statements straight into a styled console.
* **Interactive Data Structure Visualizers:**
  * **Arrays:** Push elements and run step-by-step **Bubble Sort** animations.
  * **Stacks & Queues:** Visual buckets demonstrating LIFO/FIFO insertions and pops.
  * **Linked Lists:** Interactive chains connected by pointer arrows.
  * **Binary Search Trees:** Visual SVG nodes displaying Pre-order, In-order, and Post-order traversals.
* **Study Guides & Roadmaps:** Categorized educational concepts with a custom markdown-to-HTML parser and jumps to related code challenges.
* **Dashboard Stats & Streaks:** Circular progress counters, daily streak trackers, and a GitHub-style submission heatmap calendar.
* **Serverless & Offline-First:** Fully static hosting (ideal for **GitHub Pages**). All progress, code drafts, and study notes are persisted offline using `localStorage`.

---

## 🛠️ Tech Stack

* **Core:** React, Vite, Vanilla CSS
* **Code Editor:** Monaco Editor (`@monaco-editor/react`)
* **Icons:** Lucide React (`lucide-react`)
* **Python Runtime:** Pyodide WASM (`pyodide`)
* **Styles:** Custom glassmorphic linear gradients, Outfit display headers, and JetBrains Mono code fonts.

---

## 📦 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v16.0.0 or higher)
* `npm` or `yarn`

### Installation
1. Clone the repository:
   ```bash
   git clone git@github.com:cksharma11/thecodecracker.git
   cd thecodecracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

4. Build for production (outputs static files to `dist/` ready for GitHub Pages):
   ```bash
   npm run build
   ```

---

## 📂 Project Architecture

```
thecodecracker/
├── dist/                # Production-ready static output files
├── public/              # Global assets
├── src/
│   ├── components/      # UI components
│   │   ├── Navbar.jsx        # Navigation & progress
│   │   ├── Dashboard.jsx     # Stats panel
│   │   ├── Heatmap.jsx       # Contribution calendar
│   │   ├── ProblemsList.jsx  # Challenge filters & table
│   │   ├── CodingWorkspace.jsx # Code editor & WASM sandbox
│   │   ├── Visualizer.jsx    # SVG tree/list animators
│   │   └── Guides.jsx        # Roadmap & markdown viewer
│   ├── data/            # Local databases
│   │   ├── problems.js       # 101 DSA problems schemas
│   │   └── roadmap.js        # Concepts roadmaps
│   ├── hooks/           # State helper utilities
│   │   └── useLocalStorage.js # LocalStorage wrapper hook
│   ├── App.jsx          # Route coordinator & state provider
│   ├── index.css        # Glassmorphic stylesheet
│   └── main.jsx
├── index.html
├── package.json
└── vite.config.js       # Configured with base: './' for subpath deployments
```
