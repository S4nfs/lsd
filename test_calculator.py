import unittest
import math
from core import CalculatorCore

class TestCalculatorCore(unittest.TestCase):
    def setUp(self):
        self.core = CalculatorCore()

    def test_basic_operations(self):
        # Addition
        self.core.set_expression("12+5")
        self.assertEqual(self.core.evaluate(), "17")

        # Subtraction
        self.core.set_expression("100-35")
        self.assertEqual(self.core.evaluate(), "65")

        # Multiplication (standard and visual)
        self.core.set_expression("6*7")
        self.assertEqual(self.core.evaluate(), "42")

        self.core.set_expression("6×7")
        self.assertEqual(self.core.evaluate(), "42")

        # Division (standard and visual)
        self.core.set_expression("20/4")
        self.assertEqual(self.core.evaluate(), "5")

        self.core.set_expression("20÷4")
        self.assertEqual(self.core.evaluate(), "5")

    def test_float_results_formatting(self):
        # Check whole-number float conversion to integer string
        self.core.set_expression("5.0+5.0")
        self.assertEqual(self.core.evaluate(), "10")

        # Check precision rounding for repeating floats
        self.core.set_expression("1/3")
        self.assertEqual(self.core.evaluate(), "0.3333333333")

        # Check standard float formatting
        self.core.set_expression("1.25*2")
        self.assertEqual(self.core.evaluate(), "2.5")

    def test_operator_precedence(self):
        # Multiplication before addition
        self.core.set_expression("2+3*4")
        self.assertEqual(self.core.evaluate(), "14")

        # Brackets overriding precedence
        self.core.set_expression("(2+3)*4")
        self.assertEqual(self.core.evaluate(), "20")

        # Complex brackets nesting
        self.core.set_expression("2*(3+4*(10-8))")
        self.assertEqual(self.core.evaluate(), "22")

    def test_implicit_multiplication(self):
        # Number(Expression) -> Number*(Expression)
        self.core.set_expression("2(3+4)")
        self.assertEqual(self.core.evaluate(), "14")

        # (Expression)Number -> (Expression)*Number
        self.core.set_expression("(3+4)2")
        self.assertEqual(self.core.evaluate(), "14")

        # (Expression)(Expression)
        self.core.set_expression("(2+3)(4+1)")
        self.assertEqual(self.core.evaluate(), "25")

        # NumberPi -> Number*Pi
        self.core.set_expression("2pi")
        self.assertAlmostEqual(float(self.core.evaluate()), 2 * math.pi)

        # NumberE -> Number*E
        self.core.set_expression("2e")
        self.assertAlmostEqual(float(self.core.evaluate()), 2 * math.e)

    def test_scientific_operations(self):
        # Square Root: √16 and sqrt(16)
        self.core.set_expression("√16")
        self.assertEqual(self.core.evaluate(), "4")

        self.core.set_expression("sqrt(25)")
        self.assertEqual(self.core.evaluate(), "5")

        # Power (using ^ and **)
        self.core.set_expression("2^3")
        self.assertEqual(self.core.evaluate(), "8")

        self.core.set_expression("2**4")
        self.assertEqual(self.core.evaluate(), "16")

        # Trigonometry in DEGREES
        self.core.set_expression("sin(90)")
        self.assertEqual(self.core.evaluate(), "1")

        self.core.set_expression("cos(0)")
        self.assertEqual(self.core.evaluate(), "1")

        # Logarithms
        self.core.set_expression("log(100)")
        self.assertEqual(self.core.evaluate(), "2")  # Base 10

        self.core.set_expression("ln(e)")
        self.assertEqual(self.core.evaluate(), "1")  # Natural log

        # Percentage
        self.core.set_expression("50%")
        self.assertEqual(self.core.evaluate(), "0.5")

    def test_edge_cases(self):
        # Empty expression
        self.core.set_expression("")
        self.assertEqual(self.core.evaluate(), "")

        # Division by zero
        self.core.set_expression("10/0")
        self.assertEqual(self.core.evaluate(), "Div by 0")

        # Division by zero in expression
        self.core.set_expression("2+(5/(1-1))")
        self.assertEqual(self.core.evaluate(), "Div by 0")

        # Invalid syntax
        self.core.set_expression("2+/3")
        self.assertEqual(self.core.evaluate(), "Error")

        # Unbalanced parentheses
        self.core.set_expression("(2+3")
        self.assertEqual(self.core.evaluate(), "Error")

    def test_security_sanitization(self):
        # Attempt code execution injection
        self.core.set_expression("__import__('os').system('echo hack')")
        self.assertEqual(self.core.evaluate(), "Error")

        self.core.set_expression("eval('1+1')")
        self.assertEqual(self.core.evaluate(), "Error")

        self.core.set_expression("print('test')")
        self.assertEqual(self.core.evaluate(), "Error")

    def test_history_management(self):
        # Initial history is empty
        self.assertEqual(len(self.core.get_history()), 0)

        # First evaluation
        self.core.set_expression("5+5")
        self.core.evaluate()
        self.assertEqual(len(self.core.get_history()), 1)
        self.assertEqual(self.core.get_history()[0], {"expression": "5+5", "result": "10"})

        # Second evaluation
        self.core.set_expression("10*2")
        self.core.evaluate()
        self.assertEqual(len(self.core.get_history()), 2)
        self.assertEqual(self.core.get_history()[1], {"expression": "10*2", "result": "20"})

        # Clear history
        self.core.clear_history()
        self.assertEqual(len(self.core.get_history()), 0)

if __name__ == "__main__":
    unittest.main()
