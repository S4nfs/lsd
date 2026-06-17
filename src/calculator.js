/**
 * Pure mathematical functions
 */
const add = (a, b) => {
  const result = parseFloat(a) + parseFloat(b);
  return parseFloat(result.toFixed(10));
};

const subtract = (a, b) => {
  const result = parseFloat(a) - parseFloat(b);
  return parseFloat(result.toFixed(10));
};

const multiply = (a, b) => {
  const result = parseFloat(a) * parseFloat(b);
  return parseFloat(result.toFixed(10));
};

const divide = (a, b) => {
  const divisor = parseFloat(b);
  if (divisor === 0) {
    throw new Error("Cannot divide by zero");
  }
  const result = parseFloat(a) / divisor;
  return parseFloat(result.toFixed(10));
};

/**
 * Stateful Calculator class for UI/interactive applications
 */
class Calculator {
  constructor() {
    this.clear();
  }

  clear() {
    this.currentValue = '0';
    this.previousValue = null;
    this.operation = null;
    this.shouldResetScreen = false;
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
  }

  chooseOperation(operation) {
    if (this.currentValue === 'Error') return;
    if (this.previousValue !== null) {
      this.compute();
    }
    this.operation = operation;
    this.previousValue = this.currentValue;
    this.shouldResetScreen = true;
  }

  compute() {
    let computation;
    const prev = parseFloat(this.previousValue);
    const current = parseFloat(this.currentValue);
    if (isNaN(prev) || isNaN(current)) return;

    try {
      switch (this.operation) {
        case '+':
          computation = add(prev, current);
          break;
        case '-':
          computation = subtract(prev, current);
          break;
        case '*':
          computation = multiply(prev, current);
          break;
        case '/':
          computation = divide(prev, current);
          break;
        default:
          return;
      }
      this.currentValue = computation.toString();
    } catch (error) {
      this.currentValue = 'Error';
    }
    
    this.operation = null;
    this.previousValue = null;
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
  }

  toggleSign() {
    if (this.currentValue === 'Error') return;
    this.currentValue = (parseFloat(this.currentValue) * -1).toString();
  }

  percentage() {
    if (this.currentValue === 'Error') return;
    this.currentValue = (parseFloat(this.currentValue) / 100).toString();
  }
}

module.exports = {
  add,
  subtract,
  multiply,
  divide,
  Calculator
};
