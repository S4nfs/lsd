# 🧮 Modern JavaScript Calculator

A simple, elegant, and robust web-based calculator built with JavaScript, HTML, and CSS. It features a stateful calculator engine, a beautiful glassmorphism responsive UI with dark/light mode support, keyboard shortcuts, and a comprehensive suite of unit tests.

---

## ✨ Features

- **🔢 Core Math Operations**: Addition, Subtraction, Multiplication, and Division.
- **🔬 Advanced Operations**: Percentage calculation, sign toggling (`±`), and decimal support.
- **🛡️ Floating-Point Precision**: Handles floating-point precision issues gracefully (e.g., `0.1 + 0.2 = 0.3`).
- **🎨 Modern UI**: Sleek glassmorphism design with smooth transitions and responsive layout.
- **🌓 Theme Support**: Dark Mode and Light Mode toggle with persistent storage (`localStorage`).
- **⌨️ Keyboard Shortcuts**: Full physical keyboard support for rapid calculations.
- **🧪 Robust Testing**: 100% test coverage for the core calculator logic using Jest.

---

## 🛠️ Project Structure

```text
├── public/
│   ├── index.html         # Web interface structure
│   ├── style.css          # Modern responsive styling (Dark/Light themes)
│   └── app.js             # Frontend controller & keyboard event handling
├── src/
│   ├── calculator.js      # Core calculator logic (pure functions & stateful class)
│   └── calculator.test.js # Unit tests for the calculator logic
├── package.json           # Project configuration and dependencies
└── README.md              # Project documentation
```

---

## 🚀 Getting Started

### 📋 Prerequisites
You only need a modern web browser to run the app. To install development dependencies or run tests, you will need [Node.js](https://nodejs.org/) installed.

### 1. Running the App
Simply double-click or open **`public/index.html`** in any web browser to use the calculator instantly!

### 2. Running Unit Tests
Install dependencies and run the Jest test suite:
```bash
npm install
npm test
```
