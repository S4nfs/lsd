# 🧮 Multi-Language Calculator Suite (Python & JavaScript)

Welcome to the Multi-Language Calculator Suite! This repository contains two independent, highly functional, and beautiful calculator implementations—one written in **Python** (featuring a Tkinter desktop GUI and terminal CLI), and one written in **JavaScript** (featuring a modern responsive web interface).

---

## 🐍 1. Modern Python Calculator (GUI & CLI)

A modern, highly functional, and secure Python Calculator app designed with clean architecture principles. It features an elegant dark-themed desktop Graphical User Interface (GUI) and a responsive, interactive Command-Line Interface (CLI) fallback.

### ✨ Features
- **🎨 Modern Dark GUI:** A gorgeous, responsive dark-themed desktop app with custom-styled buttons, automatic scaling, and a dual-line screen (displays full active formula and result).
- **🔬 Scientific Panel:** A collapsible scientific keyboard overlay containing operations like square root ($\sqrt{x}$), exponentiation ($x^y$), trigonometric functions ($\sin$, $\cos$, $\tan$ in degrees), logarithms ($\log_{10}$ and $\ln$), percentage ($\%$), and constants ($\pi$ and $e$).
- **📜 Calculation History:** A collapsible side panel displaying previous calculations. Double-clicking or selecting any entry reloads its result back into the active display.
- **⌨️ Physical Keyboard Support:** Fully bound keyboard shortcuts! Type numbers, standard operators ($+$, $-$, $*$, $/$, $\%$), brackets, `Backspace` (delete), `Escape` (clear), or `Enter` (evaluate) directly from your keyboard.
- **🛡️ Secure Evaluator:** Built-in syntax analysis and safe sanitization to prevent arbitrary code injection or malicious code execution (does not use standard `eval()`).
- **📟 Interactive CLI Fallback:** A clean command-line menu option. Automatically falls back to the CLI if running in a headless environment, or can be run explicitly via command-line arguments.
- **🧪 Automated Tests:** Fully covered by a comprehensive suite of unit tests verifying basic arithmetic, scientific evaluations, edge cases, implicit multiplication, and security protection.

### 🛠️ Python Project Structure
```text
├── calculator.py       # Main entry-point script (handles mode selection)
├── core.py             # Math parser, history logic, and safe evaluation
├── gui.py              # Responsive desktop Tkinter GUI presentation
├── cli.py              # Interactive command-line terminal menu
└── test_calculator.py  # Complete unit test suite
```

### 🚀 How to Run Python Calculator
Prerequisite: You only need **Python 3.x** installed. No external pip libraries are required!

- **Launch standard GUI Mode:**
  ```bash
  python calculator.py
  ```
- **Launch CLI Terminal Mode directly:**
  ```bash
  python calculator.py --cli
  ```

### 🧪 Running Python Tests
The mathematical core is validated using Python's built-in `unittest` module. To execute the entire test suite, run:
```bash
python -m unittest test_calculator.py
```

---

## 🌐 2. Modern JavaScript Calculator (Web App)

A simple, elegant, and robust web-based calculator built with JavaScript, HTML, and CSS. It features a stateful calculator engine, a beautiful glassmorphism responsive UI with dark/light mode support, keyboard shortcuts, and unit tests.

### ✨ Features
- **Core Math Operations**: Addition, Subtraction, Multiplication, and Division.
- **Advanced Operations**: Percentage calculation, sign toggling (`±`), and decimal support.
- **Floating-Point Precision**: Handles floating-point precision issues gracefully (e.g., `0.1 + 0.2 = 0.3`).
- **Modern UI**: Sleek glassmorphism design with smooth transitions and responsive layout.
- **Theme Support**: Dark Mode and Light Mode toggle with persistent storage (`localStorage`).
- **Keyboard Shortcuts**: Full keyboard support for rapid calculations.
- **Robust Testing**: 100% test coverage for the core calculator logic using Jest.

### 🛠️ JavaScript Project Structure
```text
├── public/
│   ├── index.html      # Web interface structure
│   ├── style.css       # Modern responsive styling (Dark/Light themes)
│   └── app.js          # Frontend controller & keyboard event handling
├── src/
│   ├── calculator.js   # Core calculator logic (pure functions & stateful class)
│   └── calculator.test.js # Unit tests for the calculator logic
└── package.json        # Project configuration and dependencies
```

### 🚀 How to Run JavaScript Calculator
Open `public/index.html` in any modern web browser to run the application instantly!

To install development dependencies and run tests:
```bash
npm install
npm test
```
