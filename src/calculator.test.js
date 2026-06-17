const { add, subtract, multiply, divide, Calculator } = require('./calculator');

describe('Pure Math Functions', () => {
  test('adds two numbers correctly', () => {
    expect(add(1, 2)).toBe(3);
    expect(add(0.1, 0.2)).toBe(0.3); // Floating point precision check
    expect(add(-5, 5)).toBe(0);
  });

  test('subtracts two numbers correctly', () => {
    expect(subtract(5, 2)).toBe(3);
    expect(subtract(0.3, 0.1)).toBe(0.2);
    expect(subtract(5, 10)).toBe(-5);
  });

  test('multiplies two numbers correctly', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0.1, 0.2)).toBe(0.02);
    expect(multiply(-2, 3)).toBe(-6);
  });

  test('divides two numbers correctly', () => {
    expect(divide(6, 2)).toBe(3);
    expect(divide(1, 3)).toBe(0.3333333333);
    expect(() => divide(5, 0)).toThrow('Cannot divide by zero');
  });
});

describe('Stateful Calculator Class', () => {
  let calc;

  beforeEach(() => {
    calc = new Calculator();
  });

  test('initial state is 0', () => {
    expect(calc.currentValue).toBe('0');
    expect(calc.previousValue).toBeNull();
    expect(calc.operation).toBeNull();
  });

  test('appends numbers correctly', () => {
    calc.appendNumber('1');
    calc.appendNumber('2');
    expect(calc.currentValue).toBe('12');
  });

  test('handles decimal points correctly', () => {
    calc.appendNumber('1');
    calc.appendNumber('.');
    calc.appendNumber('5');
    calc.appendNumber('.'); // Should ignore second decimal
    expect(calc.currentValue).toBe('1.5');
  });

  test('performs basic addition operation', () => {
    calc.appendNumber('5');
    calc.chooseOperation('+');
    calc.appendNumber('7');
    calc.compute();
    expect(calc.currentValue).toBe('12');
  });

  test('performs basic subtraction operation', () => {
    calc.appendNumber('10');
    calc.chooseOperation('-');
    calc.appendNumber('4');
    calc.compute();
    expect(calc.currentValue).toBe('6');
  });

  test('performs basic multiplication operation', () => {
    calc.appendNumber('3');
    calc.chooseOperation('*');
    calc.appendNumber('4');
    calc.compute();
    expect(calc.currentValue).toBe('12');
  });

  test('performs basic division operation', () => {
    calc.appendNumber('15');
    calc.chooseOperation('/');
    calc.appendNumber('3');
    calc.compute();
    expect(calc.currentValue).toBe('5');
  });

  test('handles division by zero gracefully', () => {
    calc.appendNumber('5');
    calc.chooseOperation('/');
    calc.appendNumber('0');
    calc.compute();
    expect(calc.currentValue).toBe('Error');
  });

  test('clears state correctly', () => {
    calc.appendNumber('5');
    calc.chooseOperation('+');
    calc.clear();
    expect(calc.currentValue).toBe('0');
    expect(calc.previousValue).toBeNull();
    expect(calc.operation).toBeNull();
  });

  test('deletes last digit correctly', () => {
    calc.appendNumber('1');
    calc.appendNumber('2');
    calc.delete();
    expect(calc.currentValue).toBe('1');
    calc.delete();
    expect(calc.currentValue).toBe('0');
  });

  test('toggles sign correctly', () => {
    calc.appendNumber('5');
    calc.toggleSign();
    expect(calc.currentValue).toBe('-5');
    calc.toggleSign();
    expect(calc.currentValue).toBe('5');
  });

  test('calculates percentage correctly', () => {
    calc.appendNumber('50');
    calc.percentage();
    expect(calc.currentValue).toBe('0.5');
  });

  test('chains multiple operations correctly', () => {
    calc.appendNumber('5');
    calc.chooseOperation('+');
    calc.appendNumber('5');
    calc.chooseOperation('*'); // This should compute 5 + 5 = 10 first
    expect(calc.currentValue).toBe('10');
    calc.appendNumber('3');
    calc.compute(); // 10 * 3 = 30
    expect(calc.currentValue).toBe('30');
  });
});
