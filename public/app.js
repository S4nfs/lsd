/**
 * Stateful Calculator Class for the Web UI
 */
class WebCalculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = '';
    this.operation = null;
    this.shouldResetScreen = false;
    this.updateDisplay();
  }

  delete() {
    if (this.shouldResetScreen) return;
    if (this.currentValue === 'Error') {
      this.clear();
      return;
    }
    this.currentValue = this.currentValue.toString().slice(0, -1);
    if (this.currentValue === '') {
      this.currentValue = '0';
    }
    this.updateDisplay();
  }

  appendNumber(number) {
    if (this.shouldResetScreen) {
      this.currentValue = '';
      this.shouldResetScreen = false;
    }
    if (number === '.' && this.currentValue.includes('.')) return;
    if (this.currentValue === '0' && number !== '.') {
      this.currentValue = number.toString();
    } else {
      this.currentValue = this.currentValue.toString() + number.toString();
    }
    this.updateDisplay();
  }

  chooseOperation(operation) {
    if (this.currentValue === 'Error') return;
    if (this.previousValue !== '') {
      this.compute();
    }
    this.operation = operation;
    this.previousValue = this.currentValue;
    this.shouldResetScreen = true;
    this.updateDisplay();
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    if (isNaN(prev) || isNaN(current)) return;

    const precisionRound = (num) => parseFloat(num.toFixed(10));

    switch (this.operation) {
      case '+':
        computation = precisionRound(prev + current);
        break;
      case '-':
        computation = precisionRound(prev - current);
        break;
      case '*':
        computation = precisionRound(prev * current);
        break;
      case '/':
        if (current === 0) {
          this.currentValue = 'Error';
          this.operation = null;
          this.previousValue = '';
          this.shouldResetScreen = true;
          this.updateDisplay();
          return;
        }
        computation = precisionRound(prev / current);
        break;
      default:
        return;
    }

    this.currentValue = computation.toString();
    this.operation = null;
    this.previousValue = '';
    this.updateDisplay();
  }

  toggleSign() {
    if (this.currentValue === 'Error') return;
    this.currentValue = (parseFloat(this.currentValue) * -1).toString();
    this.updateDisplay();
  }

  percentage() {
    if (this.currentValue === 'Error') return;
    this.currentValue = (parseFloat(this.currentValue) / 100).toString();
    this.updateDisplay();
  }

  getDisplayNumber(number) {
    if (number === 'Error') return 'Error';
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    if (decimalDigits != null) {
      return `${integerDisplay}.${decimalDigits}`;
    } else {
      return integerDisplay;
    }
  }

  updateDisplay() {
    this.currentOperandElement.innerText = this.getDisplayNumber(this.currentValue);
    if (this.operation != null) {
      const operationSymbol = this.operation === '*' ? '×' : this.operation === '/' ? '÷' : this.operation;
      this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousValue)} ${operationSymbol}`;
    } else {
      this.previousOperandElement.innerText = '';
    }
  }
}

// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const buttonsContainer = document.querySelector('.buttons');
const themeToggle = document.querySelector('.theme-toggle');

const calculator = new WebCalculator(previousOperandElement, currentOperandElement);

// Event Delegation for Buttons
buttonsContainer.addEventListener('click', (e) => {
  const button = e.target.closest('.btn');
  if (!button) return;

  const { number } = button.dataset;
  const { operator } = button.dataset;
  const { action } = button.dataset;

  if (number !== undefined) {
    calculator.appendNumber(number);
  } else if (operator !== undefined) {
    calculator.chooseOperation(operator);
  } else if (action !== undefined) {
    switch (action) {
      case 'clear':
        calculator.clear();
        break;
      case 'delete':
        calculator.delete();
        break;
      case 'percent':
        calculator.percentage();
        break;
      case 'toggle-sign':
        calculator.toggleSign();
        break;
      case 'equals':
        calculator.compute();
        break;
    }
  }
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
  // Prevent default behavior for space and enter to avoid triggering focused buttons
  if (e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
  }

  if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
    calculator.appendNumber(e.key);
  } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
    calculator.chooseOperation(e.key);
  } else if (e.key === 'Enter' || e.key === '=') {
    calculator.compute();
  } else if (e.key === 'Backspace') {
    calculator.delete();
  } else if (e.key === 'Escape') {
    calculator.clear();
  } else if (e.key === '%') {
    calculator.percentage();
  }
});

// Theme Toggle Logic
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeToggleUI(savedTheme);

themeToggle.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeToggleUI(newTheme);
});

function updateThemeToggleUI(theme) {
  const icon = themeToggle.querySelector('.toggle-icon');
  const text = themeToggle.querySelector('.toggle-text');
  if (theme === 'dark') {
    icon.innerText = '🌙';
    text.innerText = 'Dark Mode';
  } else {
    icon.innerText = '☀️';
    text.innerText = 'Light Mode';
  }
}
