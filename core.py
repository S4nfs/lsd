import math
import re

class CalculatorCore:
    """
    Core mathematical logic and history management for the Calculator App.
    Keeps the presentation layer (GUI/CLI) decoupled from evaluation logic.
    """
    def __init__(self):
        self.expression = ""
        self.history = []  # List of dicts: {"expression": str, "result": str}

    def clear(self):
        """Reset the current expression."""
        self.expression = ""

    def backspace(self):
        """Remove the last character from the current expression."""
        if self.expression:
            self.expression = self.expression[:-1]

    def append(self, value: str):
        """Append a number, operator, or function to the expression."""
        self.expression += str(value)

    def get_expression(self) -> str:
        """Return the current expression."""
        return self.expression

    def set_expression(self, expr: str):
        """Set the current expression directly (e.g., when loading from history)."""
        self.expression = str(expr)

    def get_history(self):
        """Return the history list."""
        return self.history

    def clear_history(self):
        """Clear all calculation history."""
        self.history = []

    def evaluate(self) -> str:
        """
        Safely evaluates the current expression and returns the result.
        Returns 'Error' if a mathematical or syntax error occurs.
        """
        if not self.expression.strip():
            return ""

        try:
            # 1. Translate symbols for safe evaluation
            eval_expr = self.expression

            # Replace visual operators with Python operators
            eval_expr = eval_expr.replace("×", "*")
            eval_expr = eval_expr.replace("÷", "/")
            eval_expr = eval_expr.replace("^", "**")
            eval_expr = eval_expr.replace("π", "pi")

            # Handle percentage conversion, e.g. 50% -> (50/100)
            eval_expr = re.sub(r"([0-9]+\.?[0-9]*|pi|e)%", r"(\1/100)", eval_expr)

            # Handle brackets insertion for square roots: √x -> sqrt(x)
            # √ followed by a number, decimal, or parenthesis
            eval_expr = re.sub(r"√(\d+\.?\d*)", r"sqrt(\1)", eval_expr)
            eval_expr = eval_expr.replace("√", "sqrt")

            # 2. Strict character validation to prevent code execution injection
            # Only allow digits, standard math symbols, and specific safe math names
            allowed_chars = r"^[0-9+\-*/().\s|%|pi|e|sqrt|sin|cos|tan|log|ln|**]*$"
            sanitized = eval_expr.replace("sqrt", "").replace("sin", "").replace("cos", "").replace("tan", "").replace("log", "").replace("ln", "").replace("pi", "")

            if not re.match(r"^[0-9+\-*/().\s|%|e|**]*$", sanitized):
                raise ValueError("Invalid characters detected")

            # 3. Create a restricted evaluation namespace
            safe_namespace = {
                "__builtins__": None,
                "pi": math.pi,
                "e": math.e,
                "sqrt": math.sqrt,
                "sin": lambda x: math.sin(math.radians(x)),  # degrees support
                "cos": lambda x: math.cos(math.radians(x)),
                "tan": lambda x: math.tan(math.radians(x)),
                "log": math.log10,                           # default log is log10 for general calc
                "ln": math.log,                              # ln is natural log
            }

            # Check for implicit multiplication like 2(3) or 2pi or (2)(3)
            # Replace "number(" with "number*("
            eval_expr = re.sub(r"(\d+)\(", r"\1*(", eval_expr)
            # Replace ")number" with ")*number"
            eval_expr = re.sub(r"\)(\d+)", r")*\1", eval_expr)
            # Replace "pi" following a number with "*pi"
            eval_expr = re.sub(r"(\d+)pi", r"\1*pi", eval_expr)
            # Replace "e" following a number with "*e"
            eval_expr = re.sub(r"(\d+)e", r"\1*e", eval_expr)
            # Replace ")( " with ")*("
            eval_expr = eval_expr.replace(")(", ")*(")

            # 4. Perform the evaluation
            result_val = eval(eval_expr, safe_namespace)

            # Format the output result
            if isinstance(result_val, float):
                # If it's a whole number, display as integer
                if result_val.is_integer():
                    result_str = str(int(result_val))
                else:
                    # Round float results to avoid IEEE floating point errors
                    result_str = f"{result_val:.10g}"
            else:
                result_str = str(result_val)

            # Add to history list
            self.history.append({
                "expression": self.expression,
                "result": result_str
            })

            # Update active expression to result
            self.expression = result_str
            return result_str

        except ZeroDivisionError:
            self.expression = ""
            return "Div by 0"
        except Exception:
            self.expression = ""
            return "Error"
