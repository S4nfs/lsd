# 🧮 Modern Python Calculator (GUI & CLI)

A modern, highly functional, and secure Python Calculator app designed with clean architecture principles. It features an elegant dark-themed desktop Graphical User Interface (GUI) and a responsive, interactive Command-Line Interface (CLI) fallback.

---

## ✨ Features

- **🎨 Modern Dark GUI:** A gorgeous, responsive dark-themed desktop app with custom-styled buttons, automatic scaling, and a dual-line screen (displays full active formula and result).
- **🔬 Scientific Panel:** A collapsible scientific keyboard overlay containing operations like square root ($\sqrt{x}$), exponentiation ($x^y$), trigonometric functions ($\sin$, $\cos$, $\tan$ in degrees), logarithms ($\log_{10}$ and $\ln$), percentage ($\%$), and constants ($\pi$ and $e$).
- **📜 Calculation History:** A collapsible side panel displaying previous calculations. Double-clicking or selecting any entry reloads its result back into the active display.
- **⌨️ Physical Keyboard Support:** Fully bound keyboard shortcuts! Type numbers, standard operators ($+$, $-$, $*$, $/$, $\%$), brackets, `Backspace` (delete), `Escape` (clear), or `Enter` (evaluate) directly from your keyboard.
- **🛡️ Secure Evaluator:** Built-in syntax analysis and safe sanitization to prevent arbitrary code injection or malicious code execution (does not use unredacted standard `eval()`).
- **📟 Interactive CLI Fallback:** A clean command-line menu option. Automatically falls back to the CLI if running in a headless environment, or can be run explicitly via command-line arguments.
- **🧪 Automated Tests:** Fully covered by a comprehensive suite of unit tests verifying basic arithmetic, scientific evaluations, edge cases, implicit multiplication, and security protection.

---

## 🛠️ Code Architecture

The project decouples the mathematical core logic from the user interface, conforming to clean, modular design principles:

1. **`core.py` (CalculatorCore):** Evaluator engine, security sanitization, mathematical parsing (like implicit multiplication e.g., `2(3)` or `2pi`), and history management.
2. **`gui.py` (CalculatorGUI):** Responsive desktop presentation built on standard Tkinter (no external dependencies required).
3. **`cli.py`:** Command-line console menu for terminal usage.
4. **`calculator.py`:** Main entry-point script that reads arguments, initializes components, and selects the run mode.
5. **`test_calculator.py`:** Complete unit test suite.

---

## 🚀 How to Run

### Prerequisite
You only need **Python 3.x** installed. No external pip libraries are required!

### 1. Launch standard GUI Mode:
```bash
python calculator.py
```

### 2. Launch CLI Terminal Mode directly:
```bash
python calculator.py --cli
```

---

## 🧪 Running Tests

The mathematical core is validated using Python's built-in `unittest` module. To execute the entire test suite, run:

```bash
python -m unittest test_calculator.py
```

You should see an output indicating all tests passed:
```text
........
----------------------------------------------------------------------
Ran 8 tests in 0.002s

OK
```
