# Modern JavaScript Calculator

A simple, elegant, and robust calculator built with JavaScript, HTML, and CSS. It features a stateful calculator engine, a beautiful responsive UI with dark/light mode support, keyboard shortcuts, and a comprehensive suite of unit tests.

## Features

- **Core Math Operations**: Addition, Subtraction, Multiplication, and Division.
- **Advanced Operations**: Percentage calculation, sign toggling (`±`), and decimal support.
- **Floating-Point Precision**: Handles floating-point precision issues gracefully (e.g., `0.1 + 0.2 = 0.3`).
- **Modern UI**: Sleek glassmorphism design with smooth transitions and responsive layout.
- **Theme Support**: Dark Mode and Light Mode toggle with persistent storage (`localStorage`).
- **Keyboard Shortcuts**: Full keyboard support for rapid calculations.
- **Robust Testing**: 100% test coverage for the core calculator logic using Jest.

## Project Structure

```text
├── public/
│   ├── index.html      # Web interface structure
│   ├── style.css       # Modern responsive styling (Dark/Light themes)
│   └── app.js          # Frontend controller & keyboard event handling
├── src/
│   ├── calculator.js   # Core calculator logic (pure functions & stateful class)
│   └── calculator.test.js # Unit tests for the calculator logic
├── package.json        # Project configuration and dependencies
└── README.md           # Project documentation
```

## Getting Started

### 1. Run the Web Calculator

Simply open the `public/index.html` file in any modern web browser. No server or build step is required!

```bash
# On macOS
open public/index.html

# On Linux
xdg-open public/index.html

# On Windows
start public/index.html
```

### 2. Run Unit Tests

To run the unit tests and verify the calculator logic:

```bash
# Install dependencies
npm install

# Run tests
npm test
```

## Keyboard Shortcuts

| Key | Action |
| --- | --- |
| `0` - `9` | Input numbers |
| `.` | Decimal point |
| `+` | Addition |
| `-` | Subtraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Percentage |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last digit |
| `Escape` | Clear all (AC) |
